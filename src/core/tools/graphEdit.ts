/**
 * Core - 规则增量编辑
 * 规则哈希、紧凑摘要、节点级补丁，避免每次修改都整图重传
 */

import { createHash } from 'node:crypto';
import { GatewayClient } from '../gateway/client';
import type { Graph, GraphNode, ValidationError } from '../types/graph';
import type { ToolResponse } from '../types';
import { validateGraph } from './base';
import { validateGraphCapabilitiesWithGateway, type CapabilityValidationReport } from './capabilityValidation';
import { getGraph, writeGraphNodes } from './graph';

// ==================== 规则哈希 ====================

/** 递归排序对象键，数组保持原顺序 */
function canonicalize(value: unknown): unknown {
    if (Array.isArray(value)) return value.map(canonicalize);
    if (!value || typeof value !== 'object') return value;
    const record = value as Record<string, unknown>;
    return Object.fromEntries(Object.keys(record).sort().map((key) => [key, canonicalize(record[key])]));
}

/** 去掉 cfg.pos（卡片坐标不影响规则语义） */
function withoutPos(node: GraphNode): unknown {
    const { pos: _pos, ...cfg } = (node.cfg || {}) as Record<string, unknown>;
    return { ...node, cfg };
}

function canonicalNode(node: GraphNode): string {
    return JSON.stringify(canonicalize(withoutPos(node)));
}

/** 规则内容哈希：忽略坐标与对象键顺序，节点顺序参与计算；取 sha256 前 16 位 */
export function graphHash(nodes: GraphNode[]): string {
    const canonical = JSON.stringify(canonicalize((nodes || []).map(withoutPos)));
    return createHash('sha256').update(canonical).digest('hex').slice(0, 16);
}

// ==================== 规则摘要 ====================

export interface GraphNodeSummary {
    id: string;
    type: string;
    params?: Record<string, unknown>;
    out?: Record<string, string[]>;
}

/** 规则紧凑摘要；备注节点（nop）不进 nodes，只列在 noteIds，文本合并到 note */
export interface GraphCompactSummary {
    id: string;
    name: string;
    enable: boolean;
    hash: string;
    nodeCount: number;
    note?: string;
    noteIds?: string[];
    nodes: GraphNodeSummary[];
}

const PARAMS_MAX_JSON = 300;
const NOTE_MAX_CHARS = 1500;

const DEVICE_PARAM_KEYS = ['did', 'siid', 'piid', 'eiid', 'aiid', 'value', 'operator', 'v1', 'v2', 'preload', 'id', 'scope', 'ins', 'arguments'];
const VAR_PARAM_KEYS = ['id', 'scope', 'operator', 'v1', 'preload', 'varType'];
const TIMER_PARAM_KEYS = ['timeout', 'interval'];

function pick(source: Record<string, unknown> | undefined, keys: string[]): Record<string, unknown> {
    const result: Record<string, unknown> = {};
    if (!source) return result;
    for (const key of keys) if (source[key] !== undefined) result[key] = source[key];
    return result;
}

/** 小体积 props 原样返回，过大则标记 omitted */
function compactProps(props: Record<string, unknown> | undefined): Record<string, unknown> {
    if (!props || Object.keys(props).length === 0) return {};
    return JSON.stringify(props).length <= PARAMS_MAX_JSON ? { ...props } : { omitted: true };
}

function nodeParams(node: GraphNode): Record<string, unknown> {
    const props = node.props || {};
    const cfg = (node.cfg || {}) as Record<string, unknown>;
    if (node.type.startsWith('device')) return pick(props, DEVICE_PARAM_KEYS);
    if (node.type.startsWith('var')) {
        const params = pick(props, VAR_PARAM_KEYS);
        if ((node.type === 'varSetNumber' || node.type === 'varSetString') && props.elements !== undefined) params.elements = props.elements;
        return params;
    }
    if (node.type === 'delay' || node.type === 'statusLast' || node.type === 'loop') {
        const params = pick(props, TIMER_PARAM_KEYS);
        if (cfg.unit !== undefined) params.unit = cfg.unit;
        if (cfg.value !== undefined) params.value = cfg.value;
        return params;
    }
    return compactProps(props);
}

/** 提取备注节点纯文本：cfg.contents 可能是字符串或富文本 delta 数组 */
function noteText(node: GraphNode): string {
    const contents = (node.cfg as Record<string, unknown> | undefined)?.contents;
    if (typeof contents === 'string') return contents;
    if (!Array.isArray(contents)) return '';
    return contents.map((item) => {
        const insert = item && typeof item === 'object' ? (item as Record<string, unknown>).insert : undefined;
        return typeof insert === 'string' ? insert : '';
    }).join('');
}

/** 生成规则紧凑摘要：不含坐标、URN、inputs；备注节点合并为 note，其 ID 列在 noteIds */
export function summarizeGraph(graph: Graph): GraphCompactSummary {
    const nodes = graph.nodes || [];
    const notes: string[] = [];
    const noteIds: string[] = [];
    const summaries: GraphNodeSummary[] = [];
    for (const node of nodes) {
        if (node.type === 'nop') {
            noteIds.push(node.id);
            const text = noteText(node).trim();
            if (text) notes.push(text);
            continue;
        }
        const summary: GraphNodeSummary = { id: node.id, type: node.type };
        const params = nodeParams(node);
        if (Object.keys(params).length > 0) summary.params = params;
        const out = Object.fromEntries(Object.entries(node.outputs || {}).filter(([, targets]) => Array.isArray(targets) && targets.length > 0));
        if (Object.keys(out).length > 0) summary.out = out;
        summaries.push(summary);
    }
    let note = notes.join('\n');
    if (note.length > NOTE_MAX_CHARS) note = `${note.slice(0, NOTE_MAX_CHARS)}…(truncated)`;
    return {
        id: graph.id,
        name: graph.cfg?.userData?.name || graph.id,
        enable: graph.cfg?.enable ?? false,
        hash: graphHash(nodes),
        nodeCount: nodes.length,
        ...(note ? { note } : {}),
        ...(noteIds.length > 0 ? { noteIds } : {}),
        nodes: summaries,
    };
}

// ==================== 节点补丁 ====================

export interface GraphPatch {
    upsert?: GraphNode[];
    merge?: Array<{ id: string; props?: Record<string, unknown>; cfg?: Record<string, unknown>; outputs?: Record<string, string[]>; inputs?: Record<string, unknown> }>;
    removeIds?: string[];
}

/** Object.assign 语义的浅合并，值为 null 表示删除该键 */
function shallowMerge(base: Record<string, unknown> | undefined, patch: Record<string, unknown>): Record<string, unknown> {
    const result: Record<string, unknown> = { ...(base || {}) };
    for (const [key, value] of Object.entries(patch)) {
        if (value === null) delete result[key];
        else result[key] = value;
    }
    return result;
}

function targetNodeId(target: string): string {
    const dotIdx = target.lastIndexOf('.');
    return dotIdx === -1 ? target : target.substring(0, dotIdx);
}

/**
 * 应用节点补丁（纯函数，不修改入参）。
 * 顺序：先删除并清理指向被删节点的连线，再 upsert，最后 merge。
 * changedIds 只包含内容实际发生变化（忽略坐标）的节点。
 */
export function applyGraphPatch(nodes: GraphNode[], patch: GraphPatch): { nodes: GraphNode[]; changedIds: string[]; error?: string } {
    const original = nodes || [];
    const fail = (error: string) => ({ nodes: structuredClone(original), changedIds: [], error });

    // 同一 ID 只能出现一次
    const seen = new Set<string>();
    const allIds = [
        ...(patch.upsert || []).map((node) => node?.id),
        ...(patch.merge || []).map((entry) => entry?.id),
        ...(patch.removeIds || []),
    ];
    for (const id of allIds) {
        if (typeof id !== 'string' || !id) return fail('补丁中存在缺少 id 的条目');
        if (seen.has(id)) return fail(`节点 ${id} 在 upsert/merge/removeIds 中重复出现`);
        seen.add(id);
    }

    let result = structuredClone(original);
    const existingIds = new Set(result.map((node) => node.id));

    // 删除
    const removeIds = new Set(patch.removeIds || []);
    for (const id of removeIds) {
        if (!existingIds.has(id)) return fail(`要删除的节点 ${id} 不存在`);
    }
    if (removeIds.size > 0) {
        result = result.filter((node) => !removeIds.has(node.id));
        for (const node of result) {
            for (const [port, targets] of Object.entries(node.outputs || {})) {
                if (!Array.isArray(targets)) continue;
                const kept = targets.filter((target) => typeof target !== 'string' || !removeIds.has(targetNodeId(target)));
                if (kept.length !== targets.length) node.outputs[port] = kept;
            }
        }
    }

    // 替换或追加
    for (const incoming of patch.upsert || []) {
        const node = structuredClone(incoming);
        const index = result.findIndex((item) => item.id === node.id);
        if (index === -1) {
            result.push(node);
            continue;
        }
        if (result[index].type !== node.type) {
            return fail(`节点 ${node.id} 已存在且类型为 ${result[index].type}，upsert 不能改类型；如需替换请先 removeIds 再 upsert`);
        }
        const previousPos = (result[index].cfg as Record<string, unknown> | undefined)?.pos;
        node.cfg = node.cfg || {};
        if ((node.cfg as Record<string, unknown>).pos === undefined && previousPos !== undefined) {
            (node.cfg as Record<string, unknown>).pos = previousPos;
        }
        result[index] = node;
    }

    // 局部合并
    for (const entry of patch.merge || []) {
        const node = result.find((item) => item.id === entry.id);
        if (!node) return fail(`要合并的节点 ${entry.id} 不存在`);
        const change = structuredClone(entry);
        if (change.props) node.props = shallowMerge(node.props, change.props);
        if (change.cfg) node.cfg = shallowMerge(node.cfg, change.cfg);
        if (change.inputs) node.inputs = shallowMerge(node.inputs, change.inputs);
        if (change.outputs) node.outputs = { ...(node.outputs || {}), ...change.outputs };
    }

    // 计算实际变化的节点
    const before = new Map(original.map((node) => [node.id, canonicalNode(node)]));
    const after = new Map(result.map((node) => [node.id, canonicalNode(node)]));
    const changed = new Set<string>();
    for (const [id, value] of before) if (after.get(id) !== value) changed.add(id);
    for (const id of after.keys()) if (!before.has(id)) changed.add(id);

    return { nodes: result, changedIds: [...changed].sort() };
}

/** 与 updateGraph 一致的节点规范化（补 cfg.name / cfg.version / props），保证返回的 hash 与写入内容一致 */
function normalizeForWrite(nodes: GraphNode[]): GraphNode[] {
    return nodes.map((node) => ({
        ...node,
        cfg: {
            ...node.cfg,
            name: (node.cfg as Record<string, unknown>)?.name || node.type,
            version: (node.cfg as Record<string, unknown>)?.version ?? 1,
        },
        props: node.props || {},
    }));
}

/**
 * 按节点补丁修改规则。只调用一次 getGraph（cfg 缺失时 getGraph 会补读 getGraphList）、只写一次；
 * 可选 baseHash 防止覆盖读取前的他人修改。网关没有条件写入接口，读取与写入之间的并发修改仍可能被覆盖。
 */
export async function patchGraph(
    gateway: GatewayClient,
    id: string,
    input: GraphPatch & { baseHash?: string; name?: string; enable?: boolean }
): Promise<ToolResponse<{ graphId: string; hash: string; changedIds: string[]; nodeCount: number }>> {
    try {
        const current = await getGraph(gateway, id);
        if (!current.success) return current;
        const existing = current.data!;
        const existingNodes = existing.nodes || [];
        const currentHash = graphHash(existingNodes);
        if (input.baseHash !== undefined && input.baseHash !== currentHash) {
            return { success: false, error: `规则已被修改（hash 不一致），请重新读取后再改；当前 hash=${currentHash}` };
        }

        const patched = applyGraphPatch(existingNodes, input);
        if (patched.error) return { success: false, error: patched.error };

        const nameChanged = input.name !== undefined && input.name !== existing.cfg?.userData?.name;
        const enableChanged = input.enable !== undefined && input.enable !== existing.cfg?.enable;
        const nodesChanged = patched.changedIds.length > 0;
        if (!nodesChanged && !nameChanged && !enableChanged) {
            return {
                success: true,
                data: { graphId: id, hash: currentHash, changedIds: [], nodeCount: existingNodes.length },
                message: '无变化',
            };
        }

        const nodesToWrite = nodesChanged ? normalizeForWrite(patched.nodes) : undefined;
        const updated = await writeGraphNodes(gateway, id, { ...existing, nodes: existingNodes }, {
            ...(nodesToWrite ? { nodes: nodesToWrite } : {}),
            ...(input.name !== undefined ? { name: input.name } : {}),
            ...(input.enable !== undefined ? { enable: input.enable } : {}),
        });
        if (!updated.success) return updated;

        const finalNodes = nodesToWrite || existingNodes;
        return {
            success: true,
            data: { graphId: id, hash: graphHash(finalNodes), changedIds: patched.changedIds, nodeCount: finalNodes.length },
            message: `规则 ${id} 已更新（${patched.changedIds.length} 个节点变化）`,
        };
    } catch (error) {
        return { success: false, error: `修改规则失败: ${error}` };
    }
}

// ==================== 按 ID 校验 ====================

/**
 * 读取网关中的规则并执行结构校验与能力校验。不会抛出异常：读取失败时以错误条目返回。
 */
export async function validateGraphById(gateway: GatewayClient, id: string): Promise<{ structural: ValidationError[]; capability: CapabilityValidationReport }> {
    const failure = (message: string, type: string): { structural: ValidationError[]; capability: CapabilityValidationReport } => {
        const item: ValidationError = { nodeId: '(graph)', type, level: 'error', message };
        return { structural: [item], capability: { valid: false, errors: [item], warnings: [], inspectedDids: [], inspectedUrns: [] } };
    };
    const current = await getGraph(gateway, id);
    if (!current.success) return failure(current.error, 'graph_unavailable');
    const graph = current.data!;
    graph.nodes = graph.nodes || [];
    const structural = validateGraph(graph);
    try {
        const capability = await validateGraphCapabilitiesWithGateway(gateway, graph);
        return { structural, capability };
    } catch (error) {
        const item: ValidationError = { nodeId: '(graph)', type: 'capability_unavailable', level: 'error', message: `能力校验失败: ${error}` };
        return { structural, capability: { valid: false, errors: [item], warnings: [], inspectedDids: [], inspectedUrns: [] } };
    }
}
