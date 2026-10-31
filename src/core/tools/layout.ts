/**
 * Core - 规则卡片布局
 *
 * 布局模型（与米家原生画布的关系）：
 * - 卡片尺寸：已保存的 cfg.pos.width/height 视为原生画布测量值；缺失时按节点类型估算。
 *   原生画布会按内容重新测量卡片（实测设备卡片最宽约 748、最高约 224），
 *   因此排版和“可能重叠”检查使用按类型取上限的保守包围框，“确定重叠”只用已保存尺寸判断。
 * - 连线：按原生画布的水平三次贝塞尔曲线近似（源卡片右侧端口 → 目标卡片左侧端口），
 *   用于估计穿卡和交叉，不等同于原生网页实际渲染。
 *
 * 布局算法：分层布局（Sugiyama）。断开回路 → 最长路径分层 → 长连线插入占位节点（给连线留通道）
 * → 重心法多轮排序减少交叉 → 按尺寸计算坐标。互不相连的部分作为独立分区上下排列，备注放在流程上方。
 *
 * 增量排版：已有坐标的卡片默认固定，只给没有坐标的卡片找空位（靠近上下游、不与任何卡片重叠、尽量不压连线），
 * 最后对全部卡片做碰撞复检。
 */

import type { GraphNode } from '../types/graph';

// ==================== 常量 ====================

export const DEFAULT_CARD_WIDTH = 528;
export const DEFAULT_CARD_HEIGHT = 164;
const H_GAP = 150;
const V_GAP = 80;
const START_X = 100;
const START_Y = 100;
const REGION_GAP = 240;
const NOTE_DEFAULT_HEIGHT = 400;
const DUMMY_HEIGHT = 40;
const MIN_SPACING = 24;

/** 原生画布实测的类型尺寸上限（来自真实规则的已保存尺寸），用于保守包围框 */
const TYPE_MAX_SIZE: Record<string, { width: number; height: number }> = {
    deviceGet: { width: 748, height: 172 },
    deviceOutput: { width: 736, height: 172 },
    deviceInput: { width: 584, height: 224 },
    logicOr: { width: 528, height: 180 },
    signalOr: { width: 528, height: 180 },
};

const ANNOTATION_TYPES = new Set(['nop']);

export interface Box { x: number; y: number; width: number; height: number }

export type LayoutMode = 'incremental' | 'full';

export interface LayoutOptions {
    /** incremental（默认）：已有坐标的卡片不动，只摆放没有坐标的卡片；full：全图重排（pinned 除外） */
    mode?: LayoutMode;
    /** full 模式下保持不动的节点 */
    pinned?: string[];
}

export interface LayoutResult {
    nodes: GraphNode[];
    /** 本次新摆放或移动的节点 */
    placedIds: string[];
    report: LayoutReport;
}

export interface LayoutReport {
    nodeCount: number;
    /** 按已保存尺寸确定重叠的卡片对 */
    overlaps: Array<[string, string]>;
    /** 按保守包围框（原生画布可能把卡片画得更大）可能重叠或间距过小的卡片对，不含 overlaps 中已有的 */
    possibleOverlaps: Array<[string, string]>;
    /** 估计穿过无关卡片的连线：from → to 经过 cards */
    edgesThroughCards: Array<{ from: string; to: string; cards: string[] }>;
    /** 估计的连线交叉数 */
    crossings: number;
    /** 向左回连的连线数（回路，不要求单向） */
    backEdges: number;
    /** 互不相连的分区 */
    regions: Array<{ ids: string[]; box: Box }>;
    /** 没有坐标的节点（检查时按估计尺寸处理） */
    missingPositions: string[];
    model: { sizes: string; routes: string; verifiedInNativeUi: false };
}

// ==================== 尺寸 ====================

/** 卡片尺寸：已保存的宽高（原生测量值）优先，缺失时按类型估算 */
function sizeOf(node: GraphNode): { width: number; height: number } {
    const pos = (node.cfg as Record<string, unknown> | undefined)?.pos as Partial<Box> | undefined;
    const estimated = estimateSize(node);
    return {
        width: pos && typeof pos.width === 'number' && pos.width > 0 ? pos.width : estimated.width,
        height: pos && typeof pos.height === 'number' && pos.height > 0 ? pos.height : estimated.height,
    };
}

/** 已保存的位置与尺寸；没有有效坐标时为 null */
function storedBox(node: GraphNode): Box | null {
    const pos = (node.cfg as Record<string, unknown> | undefined)?.pos as Partial<Box> | undefined;
    if (!pos || typeof pos !== 'object') return null;
    if (![pos.x, pos.y].every((value) => typeof value === 'number' && Number.isFinite(value))) return null;
    return { x: pos.x!, y: pos.y!, ...sizeOf(node) };
}

function portCount(node: GraphNode): number {
    return Math.max(Object.keys(node.inputs || {}).length, Object.keys(node.outputs || {}).length, 1);
}

/** 新卡片写入的尺寸：沿用工具一直写入的 528×164，端口多时加高 */
export function estimateSize(node: GraphNode): { width: number; height: number } {
    if (ANNOTATION_TYPES.has(node.type)) return { width: DEFAULT_CARD_WIDTH, height: NOTE_DEFAULT_HEIGHT };
    const ports = portCount(node);
    return { width: DEFAULT_CARD_WIDTH, height: ports > 3 ? DEFAULT_CARD_HEIGHT + (ports - 3) * 40 : DEFAULT_CARD_HEIGHT };
}

/** 保守包围框：已保存尺寸与类型上限取大（备注按已保存尺寸） */
function safeBox(node: GraphNode, box: Box): Box {
    if (ANNOTATION_TYPES.has(node.type)) return box;
    const max = TYPE_MAX_SIZE[node.type];
    if (!max) return box;
    return { ...box, width: Math.max(box.width, max.width), height: Math.max(box.height, max.height) };
}

function layoutSize(node: GraphNode): { width: number; height: number } {
    return safeBox(node, { x: 0, y: 0, ...sizeOf(node) });
}

function intersects(a: Box, b: Box, margin = 0): boolean {
    return a.x < b.x + b.width + margin && b.x < a.x + a.width + margin && a.y < b.y + b.height + margin && b.y < a.y + a.height + margin;
}

// ==================== 图结构 ====================

interface Edge { from: string; fromPort: string; to: string; toPort: string }

function targetId(target: string): string {
    const index = target.lastIndexOf('.');
    return index === -1 ? target : target.slice(0, index);
}

function collectEdges(nodes: GraphNode[]): Edge[] {
    const ids = new Set(nodes.map((node) => node.id));
    const edges: Edge[] = [];
    for (const node of nodes) {
        for (const [port, targets] of Object.entries(node.outputs || {})) {
            if (!Array.isArray(targets)) continue;
            for (const target of targets) {
                if (typeof target !== 'string') continue;
                const to = targetId(target);
                if (!ids.has(to) || to === node.id) continue;
                edges.push({ from: node.id, fromPort: port, to, toPort: target.slice(to.length + 1) });
            }
        }
    }
    return edges;
}

/** 弱连通分量，按节点原顺序 */
function components(ids: string[], edges: Edge[]): string[][] {
    const parent = new Map(ids.map((id) => [id, id]));
    const find = (id: string): string => {
        let root = id;
        while (parent.get(root) !== root) root = parent.get(root)!;
        let current = id;
        while (parent.get(current) !== root) { const next = parent.get(current)!; parent.set(current, root); current = next; }
        return root;
    };
    for (const edge of edges) if (parent.has(edge.from) && parent.has(edge.to)) parent.set(find(edge.from), find(edge.to));
    const groups = new Map<string, string[]>();
    for (const id of ids) {
        const root = find(id);
        if (!groups.has(root)) groups.set(root, []);
        groups.get(root)!.push(id);
    }
    return [...groups.values()];
}

/** DFS 找回边（回路），从入度为 0 的节点开始；返回去掉回边方向后的边 */
function acyclicEdges(ids: string[], edges: Edge[]): { forward: Array<[string, string]>; back: number } {
    const out = new Map(ids.map((id) => [id, [] as string[]]));
    const indeg = new Map(ids.map((id) => [id, 0]));
    for (const edge of edges) { out.get(edge.from)?.push(edge.to); indeg.set(edge.to, (indeg.get(edge.to) || 0) + 1); }
    const state = new Map<string, number>();
    const forward: Array<[string, string]> = [];
    let back = 0;
    const visit = (start: string) => {
        const stack: Array<[string, number]> = [[start, 0]];
        state.set(start, 1);
        while (stack.length) {
            const top = stack[stack.length - 1];
            const children = out.get(top[0])!;
            if (top[1] >= children.length) { state.set(top[0], 2); stack.pop(); continue; }
            const child = children[top[1]++];
            const childState = state.get(child) || 0;
            if (childState === 1) { forward.push([child, top[0]]); back++; continue; }
            forward.push([top[0], child]);
            if (childState === 0) { state.set(child, 1); stack.push([child, 0]); }
        }
    };
    for (const id of ids) if ((indeg.get(id) || 0) === 0 && !state.get(id)) visit(id);
    for (const id of ids) if (!state.get(id)) visit(id);
    return { forward, back };
}

// ==================== 分层布局 ====================

interface LayerNode { id: string; dummy: boolean; width: number; height: number }

/**
 * 对一个连通分区做分层布局，返回相对坐标（左上角为 0,0）。
 */
function layoutRegion(ids: string[], edges: Edge[], nodeById: Map<string, GraphNode>): Map<string, Box> {
    const idSet = new Set(ids);
    const regionEdges = edges.filter((edge) => idSet.has(edge.from) && idSet.has(edge.to));
    const { forward } = acyclicEdges(ids, regionEdges);

    // 最长路径分层
    const level = new Map(ids.map((id) => [id, 0]));
    const preds = new Map(ids.map((id) => [id, [] as string[]]));
    for (const [from, to] of forward) preds.get(to)!.push(from);
    const order = topoOrder(ids, forward);
    for (const id of order) for (const pred of preds.get(id)!) level.set(id, Math.max(level.get(id)!, level.get(pred)! + 1));
    // 没有上游的起点尽量靠近它的下游（避免触发节点都堆在第 0 列、连线拉得很长）
    const succs = new Map(ids.map((id) => [id, [] as string[]]));
    for (const [from, to] of forward) succs.get(from)!.push(to);
    for (const id of [...order].reverse()) {
        if (preds.get(id)!.length > 0 || succs.get(id)!.length === 0) continue;
        level.set(id, Math.min(...succs.get(id)!.map((succ) => level.get(succ)!)) - 1);
    }

    // 长连线插入占位节点
    const layerCount = Math.max(0, ...level.values()) + 1;
    const layers: LayerNode[][] = Array.from({ length: layerCount }, () => []);
    for (const id of order) {
        const size = layoutSize(nodeById.get(id)!);
        layers[level.get(id)!].push({ id, dummy: false, ...size });
    }
    const links: Array<[string, string]> = [];
    let dummyIndex = 0;
    for (const [from, to] of forward) {
        let previous = from;
        for (let l = level.get(from)! + 1; l < level.get(to)!; l++) {
            const dummy = `\u0000d${dummyIndex++}`;
            layers[l].push({ id: dummy, dummy: true, width: 0, height: DUMMY_HEIGHT });
            links.push([previous, dummy]);
            level.set(dummy, l);
            previous = dummy;
        }
        links.push([previous, to]);
    }

    // 重心法排序
    const up = new Map<string, string[]>();
    const down = new Map<string, string[]>();
    for (const [from, to] of links) {
        if (!down.has(from)) down.set(from, []);
        if (!up.has(to)) up.set(to, []);
        down.get(from)!.push(to);
        up.get(to)!.push(from);
    }
    const position = new Map<string, number>();
    const refresh = () => layers.forEach((layer) => layer.forEach((item, index) => position.set(item.id, index)));
    refresh();
    const crossingsOf = (): number => {
        let total = 0;
        for (let l = 0; l + 1 < layers.length; l++) {
            const pairs: Array<[number, number]> = [];
            for (const item of layers[l]) for (const next of down.get(item.id) || []) pairs.push([position.get(item.id)!, position.get(next)!]);
            for (let i = 0; i < pairs.length; i++) for (let j = i + 1; j < pairs.length; j++) {
                if ((pairs[i][0] - pairs[j][0]) * (pairs[i][1] - pairs[j][1]) < 0) total++;
            }
        }
        return total;
    };
    const sortLayer = (layer: LayerNode[], neighbors: Map<string, string[]>) => {
        const keyed = layer.map((item, index) => {
            const list = neighbors.get(item.id) || [];
            const key = list.length ? list.reduce((sum, id) => sum + position.get(id)!, 0) / list.length : index;
            return { item, key, index };
        });
        keyed.sort((a, b) => a.key - b.key || a.index - b.index);
        layer.splice(0, layer.length, ...keyed.map((entry) => entry.item));
    };
    let best = layers.map((layer) => [...layer]);
    let bestCrossings = crossingsOf();
    for (let sweep = 0; sweep < 8 && bestCrossings > 0; sweep++) {
        if (sweep % 2 === 0) for (let l = 1; l < layers.length; l++) { sortLayer(layers[l], up); refresh(); }
        else for (let l = layers.length - 2; l >= 0; l--) { sortLayer(layers[l], down); refresh(); }
        const current = crossingsOf();
        if (current < bestCrossings) { bestCrossings = current; best = layers.map((layer) => [...layer]); }
    }
    layers.splice(0, layers.length, ...best);
    refresh();

    // 坐标：x 按列宽累加；y 先按顺序紧排，再向上下游中心对齐（保持顺序与间距）
    const xs: number[] = [];
    let x = 0;
    for (const layer of layers) {
        xs.push(x);
        x += Math.max(0, ...layer.map((item) => item.width)) + H_GAP;
    }
    const y = new Map<string, number>();
    const height = new Map<string, number>();
    for (const layer of layers) {
        let cursor = 0;
        for (const item of layer) { y.set(item.id, cursor); height.set(item.id, item.height); cursor += item.height + V_GAP; }
    }
    const center = (id: string) => y.get(id)! + height.get(id)! / 2;
    const align = (layer: LayerNode[], neighbors: Map<string, string[]>) => {
        const desired = layer.map((item) => {
            const list = neighbors.get(item.id) || [];
            if (!list.length) return y.get(item.id)!;
            const centers = list.map(center).sort((a, b) => a - b);
            const median = centers[Math.floor((centers.length - 1) / 2)] / 2 + centers[Math.floor(centers.length / 2)] / 2;
            return median - item.height / 2;
        });
        // 保持顺序且间距不小于 V_GAP：自上而下推开，再自下而上收回，最后再推开一次
        const placed = [...desired];
        for (let i = 1; i < layer.length; i++) placed[i] = Math.max(placed[i], placed[i - 1] + layer[i - 1].height + V_GAP);
        for (let i = layer.length - 2; i >= 0; i--) placed[i] = Math.min(placed[i], placed[i + 1] - layer[i].height - V_GAP);
        for (let i = 1; i < layer.length; i++) placed[i] = Math.max(placed[i], placed[i - 1] + layer[i - 1].height + V_GAP);
        layer.forEach((item, index) => y.set(item.id, placed[index]));
    };
    for (let pass = 0; pass < 4; pass++) {
        for (let l = 1; l < layers.length; l++) align(layers[l], up);
        for (let l = layers.length - 2; l >= 0; l--) align(layers[l], down);
    }

    const minY = Math.min(...[...y.entries()].filter(([id]) => !id.startsWith('\u0000')).map(([, value]) => value));
    const result = new Map<string, Box>();
    layers.forEach((layer, l) => {
        for (const item of layer) {
            if (item.dummy) continue;
            const size = sizeOf(nodeById.get(item.id)!);
            result.set(item.id, { x: xs[l], y: Math.round(y.get(item.id)! - minY), width: size.width, height: size.height });
        }
    });
    return result;
}

function topoOrder(ids: string[], forward: Array<[string, string]>): string[] {
    const indeg = new Map(ids.map((id) => [id, 0]));
    const out = new Map(ids.map((id) => [id, [] as string[]]));
    for (const [from, to] of forward) { indeg.set(to, indeg.get(to)! + 1); out.get(from)!.push(to); }
    const queue = ids.filter((id) => indeg.get(id) === 0);
    const order: string[] = [];
    while (queue.length) {
        const id = queue.shift()!;
        order.push(id);
        for (const next of out.get(id)!) { indeg.set(next, indeg.get(next)! - 1); if (indeg.get(next) === 0) queue.push(next); }
    }
    return order.length === ids.length ? order : [...order, ...ids.filter((id) => !order.includes(id))];
}

function boundsOf(boxes: Box[]): Box | null {
    if (!boxes.length) return null;
    const minX = Math.min(...boxes.map((box) => box.x));
    const minY = Math.min(...boxes.map((box) => box.y));
    const maxX = Math.max(...boxes.map((box) => box.x + box.width));
    const maxY = Math.max(...boxes.map((box) => box.y + box.height));
    return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
}

// ==================== 空位搜索 ====================

interface Placed { id: string; box: Box; safe: Box }

/** 线段是否穿过盒子（Liang-Barsky 裁剪） */
function segmentHitsBox(x1: number, y1: number, x2: number, y2: number, box: Box): boolean {
    let t0 = 0, t1 = 1;
    const dx = x2 - x1, dy = y2 - y1;
    const checks: Array<[number, number]> = [[-dx, x1 - box.x], [dx, box.x + box.width - x1], [-dy, y1 - box.y], [dy, box.y + box.height - y1]];
    for (const [p, q] of checks) {
        if (p === 0) { if (q < 0) return false; continue; }
        const r = q / p;
        if (p < 0) { if (r > t1) return false; if (r > t0) t0 = r; } else { if (r < t0) return false; if (r < t1) t1 = r; }
    }
    return t0 < t1;
}

/**
 * 在固定卡片之间给一张卡片找位置：优先期望位置，按与期望位置的距离、
 * 是否压住已有连线方向上的卡片打分；保证与所有已摆卡片（保守包围框）不重叠。
 */
function findFreeSpot(desired: Box, safeSize: { width: number; height: number }, placed: Placed[], anchors: Array<{ x: number; y: number }>, avoid: Set<string>): Box {
    const step = 20;
    let best: { box: Box; score: number } | null = null;
    for (let column = 0; column < 4; column++) {
        const x = desired.x + column * (Math.max(desired.width, safeSize.width) + H_GAP);
        for (let i = 0; i <= 400; i++) {
            const dy = (i % 2 === 0 ? 1 : -1) * Math.ceil(i / 2) * step;
            const candidate: Box = { x, y: desired.y + dy, width: desired.width, height: desired.height };
            const safe: Box = { ...candidate, width: safeSize.width, height: safeSize.height };
            if (placed.some((item) => intersects(safe, item.safe, MIN_SPACING))) continue;
            const distance = Math.abs(dy) + column * 600;
            if (best && distance >= best.score) break;
            let hits = 0;
            for (const anchor of anchors) {
                const cy = candidate.y + candidate.height / 2;
                for (const item of placed) {
                    if (avoid.has(item.id)) continue;
                    if (segmentHitsBox(anchor.x, anchor.y, anchor.x <= candidate.x ? candidate.x : candidate.x + candidate.width, cy, item.box)) hits++;
                }
            }
            const score = distance + hits * 400;
            if (!best || score < best.score) best = { box: candidate, score };
            break;
        }
    }
    if (best) return best.box;
    // 理论上不会到这里：放到所有卡片下方
    const bottom = Math.max(...placed.map((item) => item.safe.y + item.safe.height));
    return { ...desired, y: bottom + V_GAP };
}

// ==================== 入口 ====================

function withPos(node: GraphNode, box: Box): GraphNode {
    return { ...node, cfg: { ...(node.cfg || {}), pos: { x: Math.round(box.x), y: Math.round(box.y), width: Math.round(box.width), height: Math.round(box.height) } } };
}

/**
 * 计算布局（纯函数，不修改入参）。
 * - incremental：有坐标的卡片保持不动；没有坐标的卡片靠近上下游找空位；整组新卡片自成分区时放在已有卡片下方
 * - full：全图分层重排；pinned 节点不动，其余卡片若与之碰撞则就近避让
 * 备注卡片不参与流程分层：已有坐标的保持（full 模式下未 pinned 的重新叠放在流程上方），新备注叠放在最上方。
 */
export function arrangeNodes(nodes: GraphNode[], options: LayoutOptions = {}): LayoutResult {
    const mode = options.mode || 'incremental';
    const pinned = new Set(options.pinned || []);
    const nodeById = new Map(nodes.map((node) => [node.id, node]));
    const edges = collectEdges(nodes.filter((node) => !ANNOTATION_TYPES.has(node.type)));
    const boxes = new Map<string, Box>();
    const placedIds: string[] = [];

    const fixed = (node: GraphNode) => mode === 'incremental' ? storedBox(node) !== null : pinned.has(node.id) && storedBox(node) !== null;
    for (const node of nodes) if (fixed(node)) boxes.set(node.id, storedBox(node)!);

    const flowIds = nodes.filter((node) => !ANNOTATION_TYPES.has(node.type)).map((node) => node.id);
    const looseIds = flowIds.filter((id) => !boxes.has(id));
    const placed = (): Placed[] => [...boxes.entries()].map(([id, box]) => ({ id, box, safe: safeBox(nodeById.get(id)!, box) }));

    if (looseIds.length > 0) {
        const anchorsExist = flowIds.some((id) => boxes.has(id));
        // 先把待摆放卡片按连通分区做理想布局
        const looseSet = new Set(looseIds);
        const groups = components(looseIds, edges.filter((edge) => looseSet.has(edge.from) && looseSet.has(edge.to)));
        const allFlowBoxes = () => [...boxes.entries()].filter(([id]) => !ANNOTATION_TYPES.has(nodeById.get(id)!.type)).map(([id, box]) => safeBox(nodeById.get(id)!, box));
        for (const group of groups) {
            const relative = layoutRegion(group, edges, nodeById);
            const groupSet = new Set(group);
            const connected = edges.some((edge) => (groupSet.has(edge.from) && boxes.has(edge.to)) || (groupSet.has(edge.to) && boxes.has(edge.from)));
            if (!anchorsExist || !connected) {
                // 独立分区：放在已有流程下方（没有已有流程时从起点开始）
                const bounds = boundsOf(allFlowBoxes());
                const originX = bounds ? bounds.x : START_X;
                const originY = bounds ? bounds.y + bounds.height + REGION_GAP : START_Y;
                const shifted = [...relative.entries()].map(([id, box]) => [id, { ...box, x: box.x + originX, y: box.y + originY }] as const);
                const others = placed();
                const collide = shifted.some(([id, box]) => others.some((item) => intersects(safeBox(nodeById.get(id)!, box), item.safe, MIN_SPACING)));
                const extra = collide ? Math.max(...others.map((item) => item.safe.y + item.safe.height)) + REGION_GAP - originY : 0;
                for (const [id, box] of shifted) { boxes.set(id, { ...box, y: box.y + extra }); placedIds.push(id); }
                continue;
            }
            // 与已有卡片相连：按拓扑顺序逐张摆放，每张靠近已摆好的上下游
            const order = topoOrder(group, acyclicEdges(group, edges.filter((edge) => groupSet.has(edge.from) && groupSet.has(edge.to))).forward);
            for (const id of order) {
                const node = nodeById.get(id)!;
                const size = sizeOf(node);
                const safeSize = safeBox(node, { x: 0, y: 0, width: size.width, height: size.height });
                const predBoxes = edges.filter((edge) => edge.to === id && boxes.has(edge.from)).map((edge) => ({ id: edge.from, box: boxes.get(edge.from)!, safe: safeBox(nodeById.get(edge.from)!, boxes.get(edge.from)!) }));
                const succBoxes = edges.filter((edge) => edge.from === id && boxes.has(edge.to)).map((edge) => ({ id: edge.to, box: boxes.get(edge.to)! }));
                let desired: Box;
                if (predBoxes.length) {
                    const x = Math.max(...predBoxes.map((item) => item.safe.x + item.safe.width)) + H_GAP;
                    const cy = predBoxes.reduce((sum, item) => sum + item.box.y + item.box.height / 2, 0) / predBoxes.length;
                    desired = { x, y: cy - size.height / 2, width: size.width, height: size.height };
                } else if (succBoxes.length) {
                    const x = Math.min(...succBoxes.map((item) => item.box.x)) - H_GAP - safeSize.width;
                    const cy = succBoxes.reduce((sum, item) => sum + item.box.y + item.box.height / 2, 0) / succBoxes.length;
                    desired = { x, y: cy - size.height / 2, width: size.width, height: size.height };
                } else {
                    // 同组前序节点已摆好：沿用理想布局中的相对位置
                    const reference = group.find((other) => boxes.has(other) && relative.has(other));
                    const rel = relative.get(id)!;
                    desired = reference
                        ? { x: boxes.get(reference)!.x + rel.x - relative.get(reference)!.x, y: boxes.get(reference)!.y + rel.y - relative.get(reference)!.y, width: size.width, height: size.height }
                        : { x: START_X, y: START_Y, width: size.width, height: size.height };
                }
                const anchors = [
                    ...predBoxes.map((item) => ({ x: item.box.x + item.box.width, y: item.box.y + item.box.height / 2 })),
                    ...succBoxes.map((item) => ({ x: item.box.x, y: item.box.y + item.box.height / 2 })),
                ];
                const avoid = new Set([...predBoxes.map((item) => item.id), ...succBoxes.map((item) => item.id)]);
                boxes.set(id, findFreeSpot(desired, safeSize, placed(), anchors, avoid));
                placedIds.push(id);
            }
        }
    }

    // 备注：固定的保持；其余叠放在所有卡片上方
    const notes = nodes.filter((node) => ANNOTATION_TYPES.has(node.type) && !boxes.has(node.id));
    if (notes.length) {
        const all = [...boxes.values()];
        const flowBounds = boundsOf([...boxes.entries()].filter(([id]) => !ANNOTATION_TYPES.has(nodeById.get(id)!.type)).map(([, box]) => box));
        let top = Math.min(START_Y, ...all.map((box) => box.y));
        const x = flowBounds ? flowBounds.x : START_X;
        for (const note of notes) {
            const size = sizeOf(note);
            top -= V_GAP + size.height;
            boxes.set(note.id, { x, y: top, width: size.width, height: size.height });
            placedIds.push(note.id);
        }
    }

    const result = nodes.map((node) => placedIds.includes(node.id) ? withPos(node, boxes.get(node.id)!) : node);
    return { nodes: result, placedIds, report: layoutReport(result) };
}

// ==================== 质量报告 ====================

/** 近似原生连线：从源卡片右侧端口到目标卡片左侧端口的水平三次贝塞尔，采样为折线 */
function routePoints(from: Box, fromIndex: number, fromCount: number, to: Box, toIndex: number, toCount: number): Array<[number, number]> {
    const x1 = from.x + from.width;
    const y1 = from.y + from.height * (fromIndex + 1) / (fromCount + 1);
    const x2 = to.x;
    const y2 = to.y + to.height * (toIndex + 1) / (toCount + 1);
    const bend = Math.max(80, Math.abs(x2 - x1) / 2);
    const points: Array<[number, number]> = [];
    for (let i = 0; i <= 16; i++) {
        const t = i / 16, u = 1 - t;
        const x = u * u * u * x1 + 3 * u * u * t * (x1 + bend) + 3 * u * t * t * (x2 - bend) + t * t * t * x2;
        const y = u * u * u * y1 + 3 * u * u * t * y1 + 3 * u * t * t * y2 + t * t * t * y2;
        points.push([x, y]);
    }
    return points;
}

function cross(p: [number, number], q: [number, number], r: [number, number]): number {
    return (q[0] - p[0]) * (r[1] - p[1]) - (q[1] - p[1]) * (r[0] - p[0]);
}

function segmentsCross(a: [number, number], b: [number, number], c: [number, number], d: [number, number]): boolean {
    const d1 = cross(c, d, a), d2 = cross(c, d, b), d3 = cross(a, b, c), d4 = cross(a, b, d);
    return ((d1 > 0 && d2 < 0) || (d1 < 0 && d2 > 0)) && ((d3 > 0 && d4 < 0) || (d3 < 0 && d4 > 0));
}

/** 只读布局质量检查：确定重叠、可能重叠、穿卡连线、交叉估计、回连、分区 */
export function layoutReport(nodes: GraphNode[]): LayoutReport {
    const nodeById = new Map(nodes.map((node) => [node.id, node]));
    const missingPositions = nodes.filter((node) => !storedBox(node)).map((node) => node.id);
    const boxes = new Map(nodes.flatMap((node) => { const box = storedBox(node); return box ? [[node.id, box] as const] : []; }));
    const ids = [...boxes.keys()];
    const overlaps: Array<[string, string]> = [];
    const possibleOverlaps: Array<[string, string]> = [];
    for (let i = 0; i < ids.length; i++) {
        for (let j = i + 1; j < ids.length; j++) {
            const a = boxes.get(ids[i])!, b = boxes.get(ids[j])!;
            if (intersects(a, b)) overlaps.push([ids[i], ids[j]]);
            else if (intersects(safeBox(nodeById.get(ids[i])!, a), safeBox(nodeById.get(ids[j])!, b), MIN_SPACING)) possibleOverlaps.push([ids[i], ids[j]]);
        }
    }

    const flowNodes = nodes.filter((node) => !ANNOTATION_TYPES.has(node.type));
    const edges = collectEdges(flowNodes).filter((edge) => boxes.has(edge.from) && boxes.has(edge.to));
    const routes = edges.map((edge) => {
        const from = nodeById.get(edge.from)!, to = nodeById.get(edge.to)!;
        const outPorts = Object.keys(from.outputs || {});
        const inPorts = Object.keys(to.inputs || {});
        const points = routePoints(boxes.get(edge.from)!, Math.max(0, outPorts.indexOf(edge.fromPort)), Math.max(1, outPorts.length), boxes.get(edge.to)!, Math.max(0, inPorts.indexOf(edge.toPort)), Math.max(1, inPorts.length));
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        for (const [x, y] of points) { if (x < minX) minX = x; if (x > maxX) maxX = x; if (y < minY) minY = y; if (y > maxY) maxY = y; }
        return { edge, points, minX, minY, maxX, maxY };
    });
    // 先用包围盒排除不可能相交的组合，再逐段检查（大规则上把检查耗时从数百毫秒降到几毫秒）
    const cards = [...boxes].map(([id, box]) => ({ id, x: box.x + 4, y: box.y + 4, width: box.width - 8, height: box.height - 8 }));
    const edgesThroughCards: LayoutReport['edgesThroughCards'] = [];
    for (const route of routes) {
        const hitCards: string[] = [];
        const { points } = route;
        for (const card of cards) {
            if (card.id === route.edge.from || card.id === route.edge.to) continue;
            if (route.maxX < card.x || route.minX > card.x + card.width || route.maxY < card.y || route.minY > card.y + card.height) continue;
            for (let index = 1; index < points.length; index++) {
                if (segmentHitsBox(points[index - 1][0], points[index - 1][1], points[index][0], points[index][1], card)) { hitCards.push(card.id); break; }
            }
        }
        if (hitCards.length) edgesThroughCards.push({ from: route.edge.from, to: route.edge.to, cards: hitCards });
    }
    let crossings = 0;
    for (let i = 0; i < routes.length; i++) {
        const a = routes[i];
        for (let j = i + 1; j < routes.length; j++) {
            const b = routes[j];
            if (a.maxX < b.minX || b.maxX < a.minX || a.maxY < b.minY || b.maxY < a.minY) continue;
            if (a.edge.from === b.edge.from || a.edge.to === b.edge.to || a.edge.from === b.edge.to || a.edge.to === b.edge.from) continue;
            let hit = false;
            for (let p = 1; p < a.points.length && !hit; p++) {
                const a1 = a.points[p - 1], a2 = a.points[p];
                const sx0 = Math.min(a1[0], a2[0]), sx1 = Math.max(a1[0], a2[0]), sy0 = Math.min(a1[1], a2[1]), sy1 = Math.max(a1[1], a2[1]);
                if (sx1 < b.minX || sx0 > b.maxX || sy1 < b.minY || sy0 > b.maxY) continue;
                for (let q = 1; q < b.points.length; q++) {
                    if (segmentsCross(a1, a2, b.points[q - 1], b.points[q])) { hit = true; break; }
                }
            }
            if (hit) crossings++;
        }
    }
    const backEdges = edges.filter((edge) => boxes.get(edge.to)!.x < boxes.get(edge.from)!.x + boxes.get(edge.from)!.width / 2).length;
    const regions = components(flowNodes.map((node) => node.id), collectEdges(flowNodes))
        .map((group) => ({ ids: group, box: boundsOf(group.flatMap((id) => boxes.has(id) ? [boxes.get(id)!] : [])) }))
        .filter((region): region is { ids: string[]; box: Box } => region.box !== null);

    return {
        nodeCount: nodes.length,
        overlaps,
        possibleOverlaps,
        edgesThroughCards,
        crossings,
        backEdges,
        regions,
        missingPositions,
        model: {
            sizes: '确定重叠按已保存的卡片尺寸；可能重叠按类型尺寸上限（原生画布可能把卡片画得更大）并要求至少 24 像素间距',
            routes: '连线按水平三次贝塞尔曲线近似，穿卡和交叉数量为估计值',
            verifiedInNativeUi: false,
        },
    };
}
