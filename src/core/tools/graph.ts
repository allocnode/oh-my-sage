/**
 * Core - 规则工具
 */

import { GatewayClient } from '../gateway/client';
import { randomInt } from 'node:crypto';
import type { Graph, GraphNode, GraphSummary, CreateGraphInput, UpdateGraphInput, ValidationError, DeviceUsageNode, DeviceUsageReport, DeviceUsage } from '../types/graph';
import type { DeviceListResponse } from '../types/device';
import type { ToolResponse } from '../types';
import { validateGraph, layoutNodes, mapLimit } from './base';
import { validateGraphCapabilitiesWithGateway } from './capabilityValidation';

/** 全量扫描规则时的并发上限 */
const GRAPH_SCAN_CONCURRENCY = 6;

function nextGraphId(): string {
    return String(randomInt(1_000_000_000_000, 10_000_000_000_000));
}

function replaceRuleScope(value: unknown, scope: string): unknown {
    if (Array.isArray(value)) return value.map((item) => replaceRuleScope(item, scope));
    if (!value || typeof value !== 'object') return value;
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, key === 'scope' && item === 'rule' ? scope : replaceRuleScope(item, scope)]));
}

function comparableNodes(nodes: Graph['nodes']): unknown {
    return nodes.map((node) => {
        const { pos: _pos, ...cfg } = node.cfg || {};
        return { ...node, cfg };
    });
}

function isSetupShell(graph: Graph): boolean {
    if (graph.cfg.enable !== false || graph.nodes.length !== 1) return false;
    const node = graph.nodes[0];
    return node.id === 'setup'
        && node.type === 'onLoad'
        && node.cfg?.name === 'onLoad'
        && Object.keys(node.props || {}).length === 0
        && Object.keys(node.inputs || {}).length === 0
        && JSON.stringify(node.outputs) === JSON.stringify({ output: [] });
}

function validateVariableDefinitions(variables: NonNullable<CreateGraphInput['variables']>): string | undefined {
    const ids = new Set<string>();
    for (const variable of variables) {
        if (!/^[a-zA-Z0-9]+$/.test(variable.id)) return `变量 ID ${variable.id} 必须是纯字母数字`;
        if (ids.has(variable.id)) return `变量 ID ${variable.id} 重复`;
        if (typeof variable.value !== variable.type) return `变量 ${variable.id} 的初始值类型必须是 ${variable.type}`;
        if (variable.name !== undefined && !variable.name.trim()) return `变量 ${variable.id} 的显示名称不能为空`;
        ids.add(variable.id);
    }
    return undefined;
}

async function deleteGraphConfirmed(gateway: GatewayClient, id: string): Promise<void> {
    try {
        await gateway.callApi('deleteGraph', { id }, 10000);
    } catch (deleteError) {
        const graphList = await gateway.callApi<Array<{ id: string }>>('getGraphList', {}, 10000);
        if (!Array.isArray(graphList) || graphList.some((graph) => graph.id === id)) throw deleteError;
    }
}

export async function getGraphs(gateway: GatewayClient): Promise<ToolResponse<GraphSummary[]>> {
    try {
        const graphs = await gateway.callApi<Array<{ id: string; enable?: boolean; userData?: { name?: string; lastUpdateTime?: number }; createTime?: number }>>('getGraphList', {}, 10000);
        const graphList = Array.isArray(graphs) ? graphs : [];
        return {
            success: true,
            data: graphList.map((graph) => ({
                id: graph.id,
                name: graph.userData?.name || graph.id,
                enable: graph.enable ?? false,
                createTime: graph.createTime,
                updateTime: graph.userData?.lastUpdateTime,
            })),
        };
    } catch (error) {
        return { success: false, error: `获取规则列表失败: ${error}` };
    }
}

export async function getGraph(gateway: GatewayClient, id: string): Promise<ToolResponse<Graph>> {
    try {
        const graph = await gateway.callApi<Graph>('getGraph', { id }, 10000);
        if (!graph.cfg) {
            const graphList = await gateway.callApi<Array<{
                id: string;
                enable?: boolean;
                userData?: Graph['cfg']['userData'];
            }>>('getGraphList', {}, 10000);
            const info = Array.isArray(graphList) ? graphList.find((item) => item.id === id) : undefined;
            graph.cfg = {
                id,
                enable: info?.enable ?? false,
                uiType: 'graph',
                userData: {
                    name: info?.userData?.name || id,
                    lastUpdateTime: info?.userData?.lastUpdateTime || 0,
                    transform: info?.userData?.transform || { x: 0, y: 0, scale: 1, rotate: 0 },
                },
            };
        }
        return { success: true, data: graph };
    } catch (error) {
        return { success: false, error: `获取规则详情失败: ${error}` };
    }
}

export async function createGraph(gateway: GatewayClient, input: CreateGraphInput): Promise<ToolResponse<{ graphId: string }>> {
    let graphId = input.graphId || nextGraphId();
    let variableScope = `R${graphId}`;
    const variables = input.variables || [];
    const createdVariables: string[] = [];
    let shellCreatedHere = false;
    let resumedExisting = false;
    try {
        const existingGraphs = await gateway.callApi<Array<{ id: string }>>('getGraphList', {}, 10000);
        const scopeResult = await gateway.callApi<{ scopes?: string[] } | string[]>('getVarScopeList', {}, 10000);
        const existingIds = new Set((Array.isArray(existingGraphs) ? existingGraphs : []).map((graph) => graph.id));
        const existingScopes = new Set(Array.isArray(scopeResult) ? scopeResult : scopeResult?.scopes || []);
        while (!input.graphId && (existingIds.has(graphId) || existingScopes.has(`R${graphId}`))) graphId = nextGraphId();
        variableScope = `R${graphId}`;
        const definitionError = validateVariableDefinitions(variables);
        if (definitionError) return { success: false, error: definitionError };

        const processedNodes = input.nodes.map((node) => ({
            ...node,
            cfg: {
                ...node.cfg,
                name: (node.cfg as Record<string, unknown>)?.name || node.type,
                version: (node.cfg as Record<string, unknown>)?.version ?? 1,
            },
            props: replaceRuleScope(node.props || {}, variableScope) as Record<string, unknown>,
        }));

        layoutNodes(processedNodes);

        const graph = {
            id: graphId,
            nodes: processedNodes,
            cfg: {
                id: graphId,
                enable: input.enable ?? true,
                uiType: 'graph',
                userData: {
                    name: input.name,
                    lastUpdateTime: Date.now(),
                    transform: { x: 0, y: 0, scale: 1, rotate: 0 },
                },
            },
        };

        const errors = validateGraph(graph);
        const errorList = errors.filter((e: { level: string }) => e.level === 'error');
        if (errorList.length > 0) {
            return {
                success: false,
                error: `规则校验失败（${errorList.length} 个错误）：${errorList.map((item) => `[${item.nodeId}] ${item.message}`).join('；')}`,
            };
        }

        let resumedShell = false;
        if (input.graphId && existingIds.has(graphId)) {
            const existing = await gateway.callApi<Graph>('getGraph', { id: graphId }, 10000);
            if (JSON.stringify(comparableNodes(existing.nodes)) === JSON.stringify(comparableNodes(graph.nodes))) {
                resumedExisting = true;
            } else {
                resumedShell = isSetupShell(existing);
                if (!resumedShell) return { success: false, error: `指定的规则 ID ${graphId} 已被其他规则占用` };
                resumedExisting = true;
            }
        } else if (input.graphId && existingScopes.has(variableScope)) {
            return { success: false, error: `指定的规则作用域 ${variableScope} 已存在` };
        }

        if (variables.length > 0) {
            if (!resumedExisting) {
                shellCreatedHere = true;
                await gateway.callApi('setGraph', {
                    ...graph,
                    nodes: [{ id: 'setup', type: 'onLoad', cfg: { name: 'onLoad', version: 1 }, props: {}, inputs: {}, outputs: { output: [] } }],
                    cfg: { ...graph.cfg, enable: false },
                }, 10000);
            }
            const variableResponse = resumedExisting
                ? await gateway.callApi<Array<{ id?: string; type?: string }> | Record<string, { type?: string }>>('getVarList', { scope: variableScope }, 10000)
                : {};
            const existingVariables = new Map(Array.isArray(variableResponse)
                ? variableResponse.flatMap((variable) => typeof variable.id === 'string' ? [[variable.id, variable] as const] : [])
                : Object.entries(variableResponse || {}));
            for (const variable of variables) {
                const existingVariable = existingVariables.get(variable.id);
                if (existingVariable) {
                    if (existingVariable.type !== variable.type) throw new Error(`变量 ${variable.id} 类型与草稿不一致`);
                    continue;
                }
                createdVariables.push(variable.id);
                await gateway.callApi('createVar', {
                    scope: variableScope,
                    id: variable.id,
                    type: variable.type,
                    value: variable.value,
                    userData: { name: variable.name?.trim() || variable.id },
                }, 10000);
            }
        }
        const capabilityReport = await validateGraphCapabilitiesWithGateway(gateway, graph);
        if (!capabilityReport.valid) throw new Error(`规则能力校验失败: ${capabilityReport.errors.map((item) => item.message).join('；')}`);

        if (!resumedExisting) shellCreatedHere = true;
        await gateway.callApi('setGraph', graph, 10000);

        return { success: true, data: { graphId }, message: `规则 "${input.name}" 创建成功` };
    } catch (error) {
        const cleanupErrors: string[] = [];
        if (shellCreatedHere) {
            try {
                await deleteGraphConfirmed(gateway, graphId);
                if (createdVariables.length > 0) await gateway.callApi('deleteVar', { scope: variableScope, all: true }, 10000);
            } catch (cleanupError) {
                cleanupErrors.push(`自动清理失败，可能残留规则 ${graphId} 或作用域 ${variableScope}: ${cleanupError}`);
            }
        } else if (createdVariables.length > 0) {
            for (const id of createdVariables) {
                try {
                    await gateway.callApi('deleteVar', { scope: variableScope, id }, 10000);
                } catch (cleanupError) {
                    cleanupErrors.push(`补建变量 ${variableScope}/${id} 清理失败: ${cleanupError}`);
                }
            }
        }
        return { success: false, error: `创建规则失败: ${error}${cleanupErrors.length ? `；${cleanupErrors.join('；')}` : ''}` };
    }
}

export async function updateGraph(gateway: GatewayClient, id: string, input: UpdateGraphInput): Promise<ToolResponse> {
    try {
        const existing = await gateway.callApi<Graph>('getGraph', { id }, 10000);
        const graphList = await gateway.callApi('getGraphList', {}, 10000);
        const graphInfo = Array.isArray(graphList)
            ? graphList.find((g: Graph) => g.id === id) as GraphListInfo | undefined
            : null;
        return await writeGraphNodes(gateway, id, existing, { ...input, graphInfo: graphInfo ?? null });
    } catch (error) {
        return { success: false, error: `更新规则失败: ${error}` };
    }
}

/** getGraphList 中单条规则的元信息 */
export interface GraphListInfo {
    enable?: boolean;
    userData?: { name?: string; transform?: { x: number; y: number; scale: number; rotate: number } };
}

/**
 * 基于已读取的规则写入（不再读取网关）：规范化 → 保留坐标 → 布局 → 结构校验 → 能力校验 → setGraph。
 * 提供 graphInfo 键（可为 null）时，name/enable/transform 回退值取自规则列表（updateGraph 语义）；
 * 未提供时回退到 existing.cfg（调用方已用 getGraph 补全 cfg）。
 */
export async function writeGraphNodes(
    gateway: GatewayClient,
    id: string,
    existing: Graph,
    input: UpdateGraphInput & { graphInfo?: GraphListInfo | null }
): Promise<ToolResponse> {
    try {
        const graphInfo: GraphListInfo | null | undefined = 'graphInfo' in input
            ? input.graphInfo
            : { enable: existing.cfg?.enable, userData: existing.cfg?.userData };

        const inputNodes = input.nodes || existing.nodes;
        const processedNodes = inputNodes.map((node) => ({
            ...node,
            cfg: {
                ...node.cfg,
                name: (node.cfg as Record<string, unknown>)?.name || node.type,
                version: (node.cfg as Record<string, unknown>)?.version ?? 1,
            },
            props: node.props || {},
        }));

        if (input.nodes) {
            const existingPositions = new Map(existing.nodes.flatMap((node) => {
                const pos = (node.cfg as Record<string, unknown>)?.pos;
                return pos && typeof pos === 'object' ? [[node.id, pos] as const] : [];
            }));
            const positions = new Map(processedNodes.flatMap((node) => {
                const pos = (node.cfg as Record<string, unknown>)?.pos;
                const preserved = pos && typeof pos === 'object' ? pos : existingPositions.get(node.id);
                return preserved ? [[node.id, preserved] as const] : [];
            }));
            layoutNodes(processedNodes);
            for (const node of processedNodes) {
                const pos = positions.get(node.id);
                if (pos) (node.cfg as Record<string, unknown>).pos = pos;
            }
        }

        const graph = {
            id,
            nodes: processedNodes,
            cfg: {
                id,
                enable: input.enable ?? existing.cfg?.enable ?? graphInfo?.enable ?? false,
                uiType: 'graph',
                userData: {
                    name: input.name || graphInfo?.userData?.name || '规则',
                    lastUpdateTime: Date.now(),
                    transform: graphInfo?.userData?.transform || { x: 0, y: 0, scale: 1, rotate: 0 },
                },
            },
        };

        if (input.nodes) {
            const errors = validateGraph(graph);
            const errorList = errors.filter((e: { level: string }) => e.level === 'error');
            if (errorList.length > 0) {
                const details = errorList.slice(0, 10).map((item) => `[${item.nodeId}] ${item.message}`).join('；');
                return { success: false, error: `规则校验失败（${errorList.length} 个错误）：${details}${errorList.length > 10 ? '；…' : ''}` };
            }
            const capabilityReport = await validateGraphCapabilitiesWithGateway(gateway, graph);
            if (!capabilityReport.valid) return { success: false, error: `规则能力校验失败: ${capabilityReport.errors.map((item) => item.message).join('；')}` };
        }

        await gateway.callApi('setGraph', graph, 10000);

        return { success: true, message: `规则 ${id} 更新成功` };
    } catch (error) {
        return { success: false, error: `更新规则失败: ${error}` };
    }
}

export async function deleteGraph(gateway: GatewayClient, id: string): Promise<ToolResponse> {
    try {
        const scope = `R${id}`;
        const scopeResult = await gateway.callApi<{ scopes?: string[] } | string[]>('getVarScopeList', {}, 10000);
        const scopes = Array.isArray(scopeResult) ? scopeResult : scopeResult.scopes || [];
        const hasRuleVariables = scopes.includes(scope);
        await deleteGraphConfirmed(gateway, id);
        if (!hasRuleVariables) return { success: true, message: `规则 ${id} 删除成功` };
        try {
            await gateway.callApi('deleteVar', { scope, all: true }, 10000);
            return { success: true, message: `规则 ${id} 及本规则变量已删除` };
        } catch (cleanupError) {
            return { success: false, error: `规则 ${id} 已删除，但变量作用域 ${scope} 清理失败: ${cleanupError}` };
        }
    } catch (error) {
        return { success: false, error: `删除规则失败: ${error}` };
    }
}

export async function toggleGraph(gateway: GatewayClient, id: string, enable: boolean): Promise<ToolResponse> {
    try {
        const graphList = await gateway.callApi('getGraphList', {}, 10000);
        const graphInfo = Array.isArray(graphList)
            ? graphList.find((g: Graph) => g.id === id)
            : null;

        if (!graphInfo) {
            return { success: false, error: `规则 ${id} 不存在` };
        }

        await gateway.callApi('changeGraphConfig', {
            id,
            enable,
            userData: {
                name: (graphInfo as unknown as { userData?: { name?: string } })?.userData?.name || '未命名规则',
                lastUpdateTime: Date.now(),
                transform: (graphInfo as unknown as { userData?: { transform?: { x: number; y: number; scale: number; rotate: number } } })?.userData?.transform || { x: 0, y: 0, scale: 1, rotate: 0 },
            },
        }, 10000);

        return { success: true, message: `规则 ${id} 已${enable ? '启用' : '禁用'}` };
    } catch (error) {
        return { success: false, error: `切换规则状态失败: ${error}` };
    }
}

// ==================== 设备引用扫描 ====================

/** 会携带 did 的节点类型 → 该设备在节点中扮演的角色 */
const DEVICE_NODE_ROLES: Record<string, DeviceUsageNode['role']> = {
    deviceInput: 'trigger',
    deviceInputSetVar: 'trigger',
    deviceGet: 'read',
    deviceGetSetVar: 'read',
    deviceOutput: 'write',
};

function nodeTarget(props: GraphNode['props']): string {
    const parts = (['siid', 'piid', 'eiid', 'aiid'] as const)
        .filter((key) => typeof props[key] === 'number')
        .map((key) => `${key}=${String(props[key])}`);
    return parts.join(' ') || '-';
}

/**
 * 扫描全部规则，找出引用了指定设备的规则与节点。
 * 传入的 did 即使已从网关设备表中删除也会照常扫描，用于排查残留引用。
 * 需要逐条拉取规则，规则较多时耗时数秒。
 */
export async function findDeviceUsage(
    gateway: GatewayClient,
    input: { dids?: string[]; query?: string }
): Promise<ToolResponse<DeviceUsageReport>> {
    const explicitDids = (input.dids || []).map((did) => did.trim()).filter(Boolean);
    const query = input.query?.trim().toLowerCase() || '';
    if (explicitDids.length === 0 && !query) {
        return { success: false, error: '必须提供 dids 或 query 之一' };
    }

    try {
        const deviceResponse = await gateway.callApi<DeviceListResponse>('getDevList', {}, 10000);
        const devList = deviceResponse.devList || {};

        const targets = new Map<string, { name: string; found: boolean }>();
        for (const did of explicitDids) {
            const device = devList[did];
            targets.set(did, { name: device?.name || '(设备表中不存在)', found: Boolean(device) });
        }
        if (query) {
            for (const [did, device] of Object.entries(devList)) {
                const haystack = `${did} ${device.name} ${device.model} ${device.modelName} ${device.roomName}`.toLowerCase();
                if (haystack.includes(query)) targets.set(did, { name: device.name, found: true });
            }
        }
        if (targets.size === 0) {
            return { success: false, error: `没有匹配 "${input.query}" 的设备，请改用 mijia_get_devices 确认名称` };
        }

        const graphList = await gateway.callApi<Array<{ id: string; enable?: boolean; userData?: { name?: string } }>>('getGraphList', {}, 10000);
        const summaries = Array.isArray(graphList) ? graphList : [];

        const hits = new Map<string, DeviceUsage>();
        for (const [did, info] of targets) {
            hits.set(did, { did, name: info.name, found: info.found, nodeCount: 0, graphs: [] });
        }
        const orphanGraphs = new Map<string, string[]>();
        const unreadableGraphs: string[] = [];

        // 并发拉取（上限 6），再按列表顺序处理，保证输出顺序与串行一致
        const fetched = await mapLimit(summaries, GRAPH_SCAN_CONCURRENCY, async (summary) => {
            try {
                const graph = await gateway.callApi<Graph>('getGraph', { id: summary.id }, 10000);
                return graph.nodes || [];
            } catch {
                return null;
            }
        });

        for (const [index, summary] of summaries.entries()) {
            const graphName = summary.userData?.name || summary.id;
            const nodes = fetched[index];
            if (!nodes) {
                unreadableGraphs.push(summary.id);
                continue;
            }

            const perDevice = new Map<string, DeviceUsageNode[]>();
            for (const node of nodes) {
                const role = DEVICE_NODE_ROLES[node.type];
                const did = node.props?.did;
                if (!role || typeof did !== 'string') continue;
                if (!devList[did] && !orphanGraphs.has(did)) orphanGraphs.set(did, []);
                if (!devList[did]) {
                    const list = orphanGraphs.get(did)!;
                    if (!list.includes(graphName)) list.push(graphName);
                }
                if (!hits.has(did)) continue;
                if (!perDevice.has(did)) perDevice.set(did, []);
                perDevice.get(did)!.push({ nodeId: node.id, nodeType: node.type, role, target: nodeTarget(node.props) });
            }

            for (const [did, usageNodes] of perDevice) {
                const usage = hits.get(did)!;
                usage.nodeCount += usageNodes.length;
                usage.graphs.push({ graphId: summary.id, name: graphName, enable: summary.enable ?? false, nodes: usageNodes });
            }
        }

        return {
            success: true,
            data: {
                devices: [...hits.values()].sort((a, b) => b.nodeCount - a.nodeCount),
                orphans: [...orphanGraphs].map(([did, graphs]) => ({ did, graphs })),
                scannedGraphs: summaries.length,
                unreadableGraphs,
            },
        };
    } catch (error) {
        return { success: false, error: `扫描设备引用失败: ${error}` };
    }
}

