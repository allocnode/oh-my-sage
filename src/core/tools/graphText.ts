/**
 * Core - 紧凑文本读写、规则查询与日志过滤
 *
 * 这些函数把「读规则、改规则、找引用、看执行记录」都收敛为一次调用，
 * 并且只返回 Agent 需要的那部分，避免整图 JSON 在对话里来回传。
 */

import { GatewayClient } from '../gateway/client';
import type { Graph, GraphNode, ValidationError } from '../types/graph';
import type { DeviceListResponse } from '../types/device';
import type { ToolResponse, Variable } from '../types';
import { validateGraph } from './base';
import { fetchMiotSpec } from './device';
import { getGraph, writeGraphNodes } from './graph';
import { applyGraphPatch, graphHash, type GraphPatch } from './graphEdit';
import { applyNoteOperations, markdownToNoteContents, noteHeight, noteToMarkdown, type NoteOperation } from './ruleNote';
import { collectDeviceTokens, nodeLines, nodesToText, sameNode, textToNodes, type RuleTextContext, type RuleTextVariable } from './ruleText';
import { mapLimit } from './base';

const SCAN_CONCURRENCY = 6;

// ==================== 上下文 ====================

/** 构建文本编解码上下文：设备表 + 用到的设备能力（能力拉取失败时降级为按取值推断） */
export async function buildTextContext(gateway: GatewayClient, graphId: string, nodes: GraphNode[], text?: string): Promise<RuleTextContext> {
    const response = await gateway.callApi<DeviceListResponse>('getDevList', {}, 10000);
    const devList = response.devList || {};
    const devices = new Map(Object.entries(devList).map(([did, device]) => [did, { name: device.name, urn: device.urn }]));
    const dids = new Set(nodes.map((node) => node.props?.did).filter((did): did is string => typeof did === 'string'));
    if (text) {
        for (const token of collectDeviceTokens(text)) {
            if (devices.has(token)) dids.add(token);
            for (const [did, device] of devices) if (device.name.trim() === token.trim()) dids.add(did);
        }
    }
    const urns = [...new Set([...dids].map((did) => devices.get(did)?.urn).filter((urn): urn is string => Boolean(urn)))];
    const specs = new Map<string, { properties: NonNullable<Awaited<ReturnType<typeof fetchMiotSpec>>['properties']>; actions: Array<{ siid: number; aiid?: number; desc: string; type: string }> }>();
    await Promise.all(urns.map(async (urn) => {
        try {
            const spec = await fetchMiotSpec(urn);
            specs.set(urn, { properties: spec.properties || [], actions: spec.actions || [] });
        } catch {
            // 能力不可用时文本仍可无损往返，只是 dtype 等字段会出现在差异里
        }
    }));
    return { scope: `R${graphId}`, devices, specs };
}

// ==================== 读取 ====================

export interface GraphTextResult {
    id: string;
    name: string;
    enable: boolean;
    hash: string;
    nodeCount: number;
    text: string;
}

/** 按 focus 节点取上下游 depth 步内的节点 ID */
export function focusIds(nodes: GraphNode[], focus: string[], depth: number): Set<string> {
    const downstream = new Map<string, Set<string>>();
    const upstream = new Map<string, Set<string>>();
    for (const node of nodes) {
        for (const targets of Object.values(node.outputs || {})) {
            if (!Array.isArray(targets)) continue;
            for (const target of targets) {
                const id = String(target).split('.')[0];
                if (!downstream.has(node.id)) downstream.set(node.id, new Set());
                downstream.get(node.id)!.add(id);
                if (!upstream.has(id)) upstream.set(id, new Set());
                upstream.get(id)!.add(node.id);
            }
        }
    }
    const result = new Set(focus);
    let frontier = new Set(focus);
    for (let step = 0; step < depth; step++) {
        const next = new Set<string>();
        for (const id of frontier) {
            for (const neighbor of [...(downstream.get(id) || []), ...(upstream.get(id) || [])]) {
                if (!result.has(neighbor)) next.add(neighbor);
            }
        }
        for (const id of next) result.add(id);
        frontier = next;
    }
    return result;
}

export async function getGraphText(
    gateway: GatewayClient,
    id: string,
    options: { focus?: string[]; depth?: number } = {}
): Promise<ToolResponse<GraphTextResult & { missingIds?: string[] }>> {
    const current = await getGraph(gateway, id);
    if (!current.success) return current;
    const graph = current.data!;
    const nodes = graph.nodes || [];
    try {
        const ctx = await buildTextContext(gateway, id, nodes);
        let text: string;
        let missingIds: string[] | undefined;
        if (options.focus && options.focus.length > 0) {
            const known = new Set(nodes.map((node) => node.id));
            missingIds = options.focus.filter((item) => !known.has(item));
            const ids = focusIds(nodes, options.focus.filter((item) => known.has(item)), options.depth ?? 1);
            text = nodeLines(nodes, [...ids], ctx);
        } else {
            text = nodesToText(nodes, ctx);
        }
        return {
            success: true,
            data: {
                id,
                name: graph.cfg?.userData?.name || id,
                enable: graph.cfg?.enable ?? false,
                hash: graphHash(nodes),
                nodeCount: nodes.length,
                text,
                ...(missingIds && missingIds.length > 0 ? { missingIds } : {}),
            },
        };
    } catch (error) {
        return { success: false, error: `生成规则文本失败: ${error}` };
    }
}

// ==================== 写入 ====================

export interface GraphChangeReport {
    graphId: string;
    hash: string;
    nodeCount: number;
    added: string[];
    changed: string[];
    removed: string[];
    noteChanged: boolean;
    createdVariables: string[];
    /** 改动节点的文本（删除的节点不在其中） */
    diff: string;
    /** 写入后的完整文本，仅 put 返回 */
    text?: string;
    message: string;
}

function diffIds(before: GraphNode[], after: GraphNode[]): { added: string[]; changed: string[]; removed: string[] } {
    const old = new Map(before.map((node) => [node.id, node]));
    const now = new Map(after.map((node) => [node.id, node]));
    const added = after.filter((node) => !old.has(node.id)).map((node) => node.id);
    const removed = before.filter((node) => !now.has(node.id)).map((node) => node.id);
    const changed = after.filter((node) => old.has(node.id) && !sameNode(old.get(node.id)!, node)).map((node) => node.id);
    return { added, changed, removed };
}

/** 保留原坐标；备注正文变化时按行数调整高度 */
function carryPositions(before: GraphNode[], after: GraphNode[]): GraphNode[] {
    const old = new Map(before.map((node) => [node.id, node]));
    return after.map((node) => {
        const previous = old.get(node.id);
        const pos = (previous?.cfg as Record<string, unknown> | undefined)?.pos as Record<string, unknown> | undefined;
        const cfg = { ...node.cfg } as Record<string, unknown>;
        if (cfg.pos === undefined && pos) cfg.pos = { ...pos };
        // 已有坐标的备注正文变化时按行数调整高度；新备注没有坐标，交给自动布局
        if (node.type === 'nop' && cfg.pos && typeof cfg.pos === 'object') {
            const md = noteToMarkdown(cfg.contents);
            const previousMd = previous ? noteToMarkdown((previous.cfg as Record<string, unknown>).contents) : null;
            if (md !== null && md !== previousMd) cfg.pos = { ...(cfg.pos as Record<string, unknown>), height: noteHeight(md) };
        }
        return { ...node, cfg };
    });
}

/** 创建尚不存在的变量；已存在且类型一致时跳过，类型不一致时报错 */
async function ensureVariables(gateway: GatewayClient, variables: RuleTextVariable[]): Promise<{ created: RuleTextVariable[]; error?: string }> {
    const created: RuleTextVariable[] = [];
    const byScope = new Map<string, Map<string, Variable>>();
    for (const variable of variables) {
        if (!byScope.has(variable.scope)) {
            try {
                const response = await gateway.callApi<Variable[] | Record<string, Variable>>('getVarList', { scope: variable.scope }, 10000);
                const entries = Array.isArray(response)
                    ? response.flatMap((item) => typeof item.id === 'string' ? [[item.id, item] as const] : [])
                    : Object.entries(response || {});
                byScope.set(variable.scope, new Map(entries));
            } catch {
                // 作用域还不存在：创建第一个变量时网关会自动建立
                byScope.set(variable.scope, new Map());
            }
        }
        const existing = byScope.get(variable.scope)!.get(variable.id);
        if (existing) {
            if (existing.type !== variable.type) return { created, error: `变量 ${variable.scope}/${variable.id} 已存在且类型为 ${existing.type}，与声明的 ${variable.type} 不一致` };
            continue;
        }
        try {
            await gateway.callApi('createVar', { scope: variable.scope, id: variable.id, type: variable.type, value: variable.value, userData: { name: variable.name?.trim() || variable.id } }, 10000);
            created.push(variable);
        } catch (error) {
            return { created, error: `创建变量 ${variable.scope}/${variable.id} 失败: ${error}` };
        }
    }
    return { created };
}

async function rollbackVariables(gateway: GatewayClient, created: RuleTextVariable[]): Promise<string[]> {
    const failures: string[] = [];
    for (const variable of created) {
        try {
            await gateway.callApi('deleteVar', { scope: variable.scope, id: variable.id }, 10000);
        } catch (error) {
            failures.push(`${variable.scope}/${variable.id}: ${error}`);
        }
    }
    return failures;
}

function structuralErrors(id: string, nodes: GraphNode[]): ValidationError[] {
    const graph = { id, nodes, cfg: { id, enable: true, uiType: 'graph', userData: { name: id, lastUpdateTime: 0, transform: { x: 0, y: 0, scale: 1, rotate: 0 } } } } as Graph;
    return validateGraph(graph).filter((item) => item.level === 'error');
}

function formatErrors(errors: ValidationError[]): string {
    return errors.slice(0, 10).map((item) => `[${item.nodeId}] ${item.message}`).join('；') + (errors.length > 10 ? '；…' : '');
}

/**
 * 改动明细：普通节点给出写入后的整行；已有备注只给出增删的行（+ / -），避免把整篇备注传回对话。
 */
function changeText(before: GraphNode[], after: GraphNode[], ids: string[], ctx: RuleTextContext): string {
    const old = new Map(before.map((node) => [node.id, node]));
    const plain: string[] = [];
    const notes: string[] = [];
    for (const id of ids) {
        const node = after.find((item) => item.id === id);
        const previous = old.get(id);
        if (node?.type === 'nop' && previous?.type === 'nop') {
            const oldMd = noteToMarkdown((previous.cfg as Record<string, unknown>).contents);
            const newMd = noteToMarkdown((node.cfg as Record<string, unknown>).contents);
            if (oldMd !== null && newMd !== null) {
                const oldLines = oldMd.split('\n');
                const newLines = newMd.split('\n');
                const removedLines = oldLines.filter((line) => line.trim() && !newLines.includes(line)).map((line) => `- ${line}`);
                const addedLines = newLines.filter((line) => line.trim() && !oldLines.includes(line)).map((line) => `+ ${line}`);
                notes.push(`<<< ${id} 改动`, ...removedLines, ...addedLines, '>>>');
                continue;
            }
        }
        plain.push(id);
    }
    return [nodeLines(after, plain, ctx), ...notes].filter(Boolean).join('\n');
}

/**
 * 统一的写入事务：校验 → 建变量 → 写入（含能力校验）→ 回读。失败时删除本次新建的变量。
 * 返回改动明细（文本形式）和写入后的 hash。
 */
async function commitNodes(
    gateway: GatewayClient,
    existing: Graph,
    nextNodes: GraphNode[],
    variables: RuleTextVariable[],
    options: { dryRun?: boolean; returnText?: boolean; ctx: RuleTextContext }
): Promise<ToolResponse<GraphChangeReport>> {
    const id = existing.id;
    const before = existing.nodes || [];
    const nodes = carryPositions(before, nextNodes);
    const { added, changed, removed } = diffIds(before, nodes);
    const noteChanged = [...added, ...changed, ...removed].some((nodeId) => (nodes.find((node) => node.id === nodeId) || before.find((node) => node.id === nodeId))?.type === 'nop');
    const diff = changeText(before, nodes, [...added, ...changed], options.ctx);
    const base = { graphId: id, added, changed, removed, noteChanged, diff };

    const errors = structuralErrors(id, nodes);
    if (errors.length > 0) return { success: false, error: `规则校验失败（${errors.length} 个错误）：${formatErrors(errors)}` };

    if (added.length + changed.length + removed.length === 0 && variables.length === 0) {
        return { success: true, data: { ...base, hash: graphHash(before), nodeCount: before.length, createdVariables: [], message: '无变化', ...(options.returnText ? { text: nodesToText(before, options.ctx) } : {}) }, message: '无变化' };
    }
    if (options.dryRun) {
        return { success: true, data: { ...base, hash: graphHash(before), nodeCount: nodes.length, createdVariables: [], message: '预览，未写入' }, message: '预览，未写入' };
    }

    const ensured = await ensureVariables(gateway, variables);
    if (ensured.error) {
        const failures = await rollbackVariables(gateway, ensured.created);
        return { success: false, error: `${ensured.error}${failures.length ? `；回滚失败: ${failures.join('，')}` : ''}` };
    }
    const nodesChanged = added.length + changed.length + removed.length > 0;
    if (nodesChanged) {
        const written = await writeGraphNodes(gateway, id, existing, { nodes });
        if (!written.success) {
            const failures = await rollbackVariables(gateway, ensured.created);
            return { success: false, error: `${written.error}${failures.length ? `；变量回滚失败: ${failures.join('，')}` : ''}` };
        }
    }

    const reread = await getGraph(gateway, id);
    const finalNodes = reread.success ? reread.data!.nodes || [] : nodes;
    const created = ensured.created.map((variable) => `${variable.scope}/${variable.id}`);
    const message = `规则 ${id} 已更新：新增 ${added.length}，修改 ${changed.length}，删除 ${removed.length}${created.length ? `，新建变量 ${created.length}` : ''}`;
    return {
        success: true,
        data: {
            ...base,
            hash: graphHash(finalNodes),
            nodeCount: finalNodes.length,
            createdVariables: created,
            message,
            ...(options.returnText ? { text: nodesToText(finalNodes, options.ctx) } : {}),
        },
        message,
    };
}

/** 用一份完整的紧凑文本替换规则（规则文件 push 的服务端实现） */
export async function putGraphText(
    gateway: GatewayClient,
    id: string,
    input: { text: string; baseHash?: string; dryRun?: boolean }
): Promise<ToolResponse<GraphChangeReport>> {
    try {
        const current = await getGraph(gateway, id);
        if (!current.success) return current;
        const existing = current.data!;
        existing.nodes = existing.nodes || [];
        const currentHash = graphHash(existing.nodes);
        if (input.baseHash !== undefined && input.baseHash !== currentHash) {
            return { success: false, error: `规则已被修改（hash 不一致），请重新拉取后再改；当前 hash=${currentHash}` };
        }
        const ctx = await buildTextContext(gateway, id, existing.nodes, input.text);
        const parsed = textToNodes(input.text, ctx);
        return await commitNodes(gateway, existing, parsed.nodes, parsed.variables, { dryRun: input.dryRun, returnText: true, ctx });
    } catch (error) {
        return { success: false, error: `写入规则文本失败: ${error instanceof Error ? error.message : error}` };
    }
}

export interface PatchV2Input extends GraphPatch {
    baseHash?: string;
    /** 新增节点（紧凑文本，可含宏与 var 声明）；ID 已存在时拒绝 */
    add?: string;
    /** 整行替换已有节点（紧凑文本）；ID 不存在时拒绝 */
    replace?: string;
    /** 备注操作；note 指定备注节点 ID，缺省为规则中第一个备注节点，不存在时新建 note1 */
    note?: NoteOperation[];
    noteId?: string;
    /** 需要创建的变量（已存在且类型一致时跳过） */
    variables?: RuleTextVariable[];
    dryRun?: boolean;
}

/**
 * 增强版增量修改：在原 upsert/merge/removeIds 之外，支持文本新增与替换、备注操作和变量声明，
 * 一次完成校验、建变量、写入和回读。
 */
export async function patchGraphV2(gateway: GatewayClient, id: string, input: PatchV2Input): Promise<ToolResponse<GraphChangeReport>> {
    try {
        const current = await getGraph(gateway, id);
        if (!current.success) return current;
        const existing = current.data!;
        existing.nodes = existing.nodes || [];
        const currentHash = graphHash(existing.nodes);
        if (input.baseHash !== undefined && input.baseHash !== currentHash) {
            return { success: false, error: `规则已被修改（hash 不一致），请重新读取后再改；当前 hash=${currentHash}` };
        }
        const ctx = await buildTextContext(gateway, id, existing.nodes, [input.add, input.replace].filter(Boolean).join('\n'));
        const known = new Set(existing.nodes.map((node) => node.id));
        const variables: RuleTextVariable[] = [...(input.variables || [])].map((variable) => ({ ...variable, scope: variable.scope === 'rule' ? ctx.scope : variable.scope }));
        const upsert: GraphNode[] = [...(input.upsert || [])];

        if (input.add) {
            const nodes = parseBatchAdd(input.add, existing.nodes, ctx, variables);
            for (const node of nodes) if (known.has(node.id)) return { success: false, error: `add 中的节点 ${node.id} 已存在；修改已有节点请用 replace 或 merge` };
            upsert.push(...nodes);
        }
        if (input.replace) {
            const nodes = parseBatchAdd(input.replace, existing.nodes, ctx, variables);
            for (const node of nodes) if (!known.has(node.id)) return { success: false, error: `replace 中的节点 ${node.id} 不存在；新增节点请用 add` };
            upsert.push(...nodes);
        }

        const patched = applyGraphPatch(existing.nodes, { upsert, merge: input.merge, removeIds: input.removeIds });
        if (patched.error) return { success: false, error: patched.error };
        let nodes = patched.nodes;

        if (input.note && input.note.length > 0) {
            const noteIndex = input.noteId ? nodes.findIndex((node) => node.id === input.noteId) : nodes.findIndex((node) => node.type === 'nop');
            if (noteIndex === -1) {
                const noteId = input.noteId || 'note1';
                if (nodes.some((node) => node.id === noteId)) return { success: false, error: `节点 ${noteId} 已存在且不是备注` };
                const md = applyNoteOperations('', input.note);
                nodes = [...nodes, { id: noteId, type: 'nop', cfg: { name: 'nop', version: 0, background: '#80CAFF', contents: markdownToNoteContents(md) }, props: {}, inputs: {}, outputs: { output: [] } }];
            } else {
                const note = nodes[noteIndex];
                const md = noteToMarkdown((note.cfg as Record<string, unknown>).contents);
                if (md === null) return { success: false, error: `备注 ${note.id} 含有不支持的格式，无法按段落操作；请用 merge 改 cfg.contents` };
                const nextMd = applyNoteOperations(md, input.note);
                nodes = nodes.map((node, index) => index === noteIndex ? { ...node, cfg: { ...node.cfg, contents: markdownToNoteContents(nextMd) } } : node);
            }
        }

        return await commitNodes(gateway, existing, nodes, variables, { dryRun: input.dryRun, ctx });
    } catch (error) {
        return { success: false, error: `修改规则失败: ${error instanceof Error ? error.message : error}` };
    }
}

/** 解析一批节点文本；连线可以指向已有节点（用已有节点类型解析默认端口） */
function parseBatchAdd(text: string, existingNodes: GraphNode[], ctx: RuleTextContext, variables: RuleTextVariable[]): GraphNode[] {
    // 为已有节点生成占位行，只用于提供类型信息，解析后丢弃
    const batchIds = new Set<string>();
    const draft = textToNodes(text.replace(/\s->\s.*$/gm, '').replace(/\s->$/gm, ''), ctx);
    for (const node of draft.nodes) batchIds.add(node.id);
    const placeholders = existingNodes
        .filter((node) => !batchIds.has(node.id))
        .map((node) => `${node.id} raw ${JSON.stringify({ type: node.type, cfg: {}, props: {}, inputs: {}, outputs: {} })}`)
        .join('\n');
    const parsed = textToNodes(`${placeholders}\n${text}`, ctx);
    variables.push(...parsed.variables);
    return parsed.nodes.filter((node) => batchIds.has(node.id));
}

// ==================== 查询 ====================

export interface RuleQuery {
    /** 变量，写法同文本格式：$名、$R.名（需配合 graph）、$作用域.名，或只写 ID 匹配任意作用域 */
    variable?: string;
    /** 设备 did 或名称 */
    device?: string;
    /** siid/piid，配合 device 使用 */
    property?: string;
    /** 节点类型 */
    nodeType?: string;
    /** 节点文本中包含的字符串 */
    contains?: string;
    /** 只查这些规则 */
    graphs?: string[];
}

export interface RuleQueryHit {
    graphId: string;
    name: string;
    enable: boolean;
    lines: string;
}

function variableMatches(node: GraphNode, query: string, scope: string): boolean {
    const match = /^\$?(?:([A-Za-z0-9_]+)\.)?([A-Za-z0-9]+)$/.exec(query);
    if (!match) return false;
    const wantedScope = match[1] === undefined ? (query.startsWith('$') ? 'global' : undefined) : match[1] === 'R' ? scope : match[1];
    const id = match[2];
    let found = false;
    const visit = (value: unknown): void => {
        if (found || !value || typeof value !== 'object') return;
        if (Array.isArray(value)) {
            value.forEach(visit);
            return;
        }
        const record = value as Record<string, unknown>;
        if (record.id === id && typeof record.scope === 'string' && (wantedScope === undefined || record.scope === wantedScope)) {
            found = true;
            return;
        }
        Object.values(record).forEach(visit);
    };
    visit(node.props);
    return found;
}

export async function queryRules(gateway: GatewayClient, query: RuleQuery): Promise<ToolResponse<{ scanned: number; hits: RuleQueryHit[] }>> {
    if (!query.variable && !query.device && !query.nodeType && !query.contains) {
        return { success: false, error: '至少提供 variable、device、nodeType、contains 之一' };
    }
    try {
        const list = await gateway.callApi<Array<{ id: string; enable?: boolean; userData?: { name?: string } }>>('getGraphList', {}, 10000);
        const summaries = (Array.isArray(list) ? list : []).filter((item) => !query.graphs || query.graphs.includes(item.id));
        const devList = (await gateway.callApi<DeviceListResponse>('getDevList', {}, 10000)).devList || {};
        let did: string | undefined;
        if (query.device) {
            if (devList[query.device]) did = query.device;
            else {
                const byName = Object.entries(devList).filter(([, device]) => device.name.trim() === query.device!.trim());
                if (byName.length > 1) return { success: false, error: `设备名称「${query.device}」不唯一：${byName.map(([key]) => key).join(', ')}` };
                did = byName[0]?.[0] ?? query.device;
            }
        }
        const property = query.property ? /^(\d+)\/(\d+)$/.exec(query.property) : null;
        if (query.property && !property) return { success: false, error: 'property 写法为 siid/piid' };

        const fetched = await mapLimit(summaries, SCAN_CONCURRENCY, async (summary) => {
            try {
                return (await gateway.callApi<Graph>('getGraph', { id: summary.id }, 10000)).nodes || [];
            } catch {
                return null;
            }
        });
        const hits: RuleQueryHit[] = [];
        for (const [index, summary] of summaries.entries()) {
            const nodes = fetched[index];
            if (!nodes) continue;
            const scope = `R${summary.id}`;
            const ctx: RuleTextContext = { scope, devices: new Map(Object.entries(devList).map(([key, device]) => [key, { name: device.name, urn: device.urn }])), specs: new Map() };
            const matched = nodes.filter((node) => {
                if (query.nodeType && node.type !== query.nodeType) return false;
                if (did && node.props?.did !== did) return false;
                if (property && (node.props?.siid !== Number(property[1]) || node.props?.piid !== Number(property[2]))) return false;
                if (query.variable && !variableMatches(node, query.variable, scope)) return false;
                return true;
            });
            if (matched.length === 0) continue;
            let lines = nodeLines(nodes, matched.map((node) => node.id), ctx);
            if (query.contains) lines = lines.split('\n').filter((line) => line.includes(query.contains!)).join('\n');
            if (!lines) continue;
            hits.push({ graphId: summary.id, name: summary.userData?.name || summary.id, enable: summary.enable ?? false, lines });
        }
        return { success: true, data: { scanned: summaries.length, hits } };
    } catch (error) {
        return { success: false, error: `查询规则失败: ${error}` };
    }
}

// ==================== 日志 ====================

export interface LogQuery {
    graph?: string;
    nodes?: string[];
    /** 最近多少分钟，默认 60 */
    minutes?: number;
    /** 最多返回多少行，默认 200（取最新的） */
    limit?: number;
    /** true 时只返回各节点执行次数 */
    summary?: boolean;
}

export interface LogEntry {
    time: string;
    graph: string;
    kind: 'link' | 'node';
    node: string;
    detail: string;
}

function localTime(ms: number, offsetMinutes: number): string {
    const date = new Date(ms + offsetMinutes * 60000);
    return date.toISOString().replace('T', ' ').slice(0, 23);
}

/** 解析网关日志文本。格式：3|毫秒时间戳|l|规则|源.端口|目标.端口|… 或 3|时间戳|i|规则|节点|值 */
export function parseGatewayLog(raw: string, query: LogQuery, now: number, offsetMinutes = 480): { entries: LogEntry[]; counts: Record<string, number> } {
    const since = now - (query.minutes ?? 60) * 60000;
    const nodes = query.nodes && query.nodes.length > 0 ? new Set(query.nodes) : undefined;
    const entries: LogEntry[] = [];
    const counts: Record<string, number> = {};
    for (const line of raw.split('\n')) {
        const parts = line.split('|');
        if (parts.length < 5) continue;
        const time = Number(parts[1]);
        if (!Number.isFinite(time) || time < since) continue;
        const graph = parts[3];
        if (query.graph && graph !== query.graph) continue;
        if (parts[2] === 'l') {
            const source = parts[4].split('.')[0];
            const target = (parts[5] || '').split('.')[0];
            if (nodes && !nodes.has(source) && !nodes.has(target)) continue;
            entries.push({ time: localTime(time, offsetMinutes), graph, kind: 'link', node: parts[4], detail: parts[5] || '' });
        } else if (parts[2] === 'i') {
            const node = parts[4];
            if (nodes && !nodes.has(node)) continue;
            const detail = parts.slice(5).join('|');
            entries.push({ time: localTime(time, offsetMinutes), graph, kind: 'node', node, detail });
            if (detail !== 'success') counts[`${graph}/${node}`] = (counts[`${graph}/${node}`] || 0) + 1;
        }
    }
    const limit = query.limit ?? 200;
    return { entries: entries.slice(Math.max(0, entries.length - limit)), counts };
}

export async function getGraphLog(gateway: GatewayClient, query: LogQuery): Promise<ToolResponse<{ lines?: string; counts?: Record<string, number>; total: number }>> {
    try {
        const raw = await gateway.callApi<string>('getLog', { num: 0 }, 15000);
        const { entries, counts } = parseGatewayLog(typeof raw === 'string' ? raw : '', query, Date.now());
        if (query.summary) return { success: true, data: { counts, total: Object.values(counts).reduce((sum, value) => sum + value, 0) } };
        const lines = entries.map((entry) => entry.kind === 'link'
            ? `${entry.time} ${query.graph ? '' : `${entry.graph} `}${entry.node} -> ${entry.detail}`
            : `${entry.time} ${query.graph ? '' : `${entry.graph} `}${entry.node} = ${entry.detail}`).join('\n');
        return { success: true, data: { lines, total: entries.length } };
    } catch (error) {
        return { success: false, error: `读取日志失败: ${error}` };
    }
}
