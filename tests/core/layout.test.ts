import assert from 'node:assert/strict';
import test from 'node:test';
import type { GatewayClient } from '../../src/core/gateway/client';
import type { Graph, GraphNode } from '../../src/core/types/graph';
import { arrangeNodes, layoutReport } from '../../src/core/tools/layout';
import { graphHash, layoutHash } from '../../src/core/tools/graphHash';
import { applyGraphPatch, patchGraph } from '../../src/core/tools/graphEdit';
import { writeGraphNodes } from '../../src/core/tools/graph';
import { patchGraphV2 } from '../../src/core/tools/graphText';

type Pos = { x: number; y: number; width: number; height: number };

function n(id: string, type: string, outputs: Record<string, string[]> = { output: [] }, pos?: Pos, inputs: Record<string, unknown> = { input: null }): GraphNode {
    return { id, type, cfg: { name: type, version: 1, ...(pos ? { pos } : {}) }, props: {}, inputs, outputs };
}

function source(id: string, pos?: Pos, outputs: string[] = []): GraphNode {
    return n(id, 'onLoad', { output: outputs }, pos, {});
}

function graphOf(nodes: GraphNode[]): Graph {
    return { id: '1000000000001', nodes, cfg: { id: '1000000000001', enable: false, uiType: 'graph', userData: { name: 'Synthetic', lastUpdateTime: 1, transform: { x: 0, y: 0, scale: 1, rotate: 0 } } } };
}

function fakeGateway(graph: Graph) {
    const writes: Graph[] = [];
    let stored = structuredClone(graph);
    const gateway = {
        async callApi(method: string, body: any): Promise<unknown> {
            if (method === 'getGraph') return structuredClone({ id: stored.id, nodes: stored.nodes });
            if (method === 'getGraphList') return [{ id: stored.id, enable: stored.cfg.enable, userData: stored.cfg.userData }];
            if (method === 'setGraph') { writes.push(structuredClone(body)); stored = structuredClone(body); return {}; }
            if (method === 'getDevList') return { devList: {} };
            if (method === 'getVarList' || method === 'getVarScopeList') return {};
            throw new Error(`Unexpected API: ${method}`);
        },
    } as unknown as GatewayClient;
    return { gateway, writes, stored: () => stored };
}

const pos = (node: GraphNode) => node.cfg.pos as Pos;
const overlap = (a: Pos, b: Pos) => a.x < b.x + b.width && b.x < a.x + a.width && a.y < b.y + b.height && b.y < a.y + a.height;

// ==================== #29 纯坐标修改 ====================

test('#29 applyGraphPatch 分开报告逻辑变化与位置变化，逻辑 hash 不受坐标影响', () => {
    const base = [source('n1', { x: 100, y: 100, width: 528, height: 164 })];
    const patched = applyGraphPatch(base, { merge: [{ id: 'n1', cfg: { pos: { x: 600 } } }] });
    assert.deepEqual(patched.changedIds, []);
    assert.deepEqual(patched.layoutChangedIds, ['n1']);
    assert.deepEqual(pos(patched.nodes[0]), { x: 600, y: 100, width: 528, height: 164 }, '只给 x 时保留 y 与宽高');
    assert.equal(graphHash(patched.nodes), graphHash(base));
    assert.notEqual(layoutHash(patched.nodes), layoutHash(base));
});

test('#29 patchGraph 仅改坐标时实际写入，其余字段不变；真正无变化时不写入', async () => {
    const node = source('n1', { x: 100, y: 100, width: 528, height: 164 });
    node.props = { keep: 1 };
    (node.cfg as Record<string, unknown>).custom = { a: 1 };
    const graph = graphOf([node]);
    const { gateway, writes, stored } = fakeGateway(graph);
    const merge = [{ id: 'n1', cfg: { pos: { ...pos(node), x: 600 } } }];
    const result = await patchGraph(gateway, graph.id, { baseHash: graphHash(graph.nodes), baseLayoutHash: layoutHash(graph.nodes), merge });
    assert.equal(result.success, true);
    assert.equal(writes.length, 1);
    const saved = stored().nodes[0];
    assert.equal(pos(saved).x, 600);
    assert.deepEqual(saved.props, { keep: 1 });
    assert.deepEqual((saved.cfg as Record<string, unknown>).custom, { a: 1 });
    assert.equal(stored().cfg.enable, false);
    assert.deepEqual(result.data!.changedIds, []);
    assert.deepEqual(result.data!.layoutChangedIds, ['n1']);
    assert.equal(result.data!.hash, graphHash(graph.nodes), '逻辑 hash 不变');

    const again = await patchGraph(gateway, graph.id, { merge });
    assert.equal(again.success && again.message, '无变化');
    assert.equal(writes.length, 1);
});

test('#29 upsert 只改坐标同样会保存', async () => {
    const graph = graphOf([source('n1', { x: 100, y: 100, width: 528, height: 164 })]);
    const { gateway, writes } = fakeGateway(graph);
    const moved = structuredClone(graph.nodes[0]);
    (moved.cfg as Record<string, unknown>).pos = { x: 100, y: 700, width: 528, height: 164 };
    const result = await patchGraph(gateway, graph.id, { upsert: [moved] });
    assert.equal(result.success, true);
    assert.equal(writes.length, 1);
    assert.equal(pos(writes[0].nodes[0]).y, 700);
});

test('#29 布局并发冲突：baseLayoutHash 过期时拒绝，即使逻辑 hash 一致', async () => {
    const graph = graphOf([source('n1', { x: 100, y: 100, width: 528, height: 164 })]);
    const { gateway, writes } = fakeGateway(graph);
    const staleLayout = layoutHash(graph.nodes);
    await patchGraph(gateway, graph.id, { merge: [{ id: 'n1', cfg: { pos: { x: 300 } } }] });
    const result = await patchGraph(gateway, graph.id, { baseHash: graphHash(graph.nodes), baseLayoutHash: staleLayout, merge: [{ id: 'n1', cfg: { pos: { x: 900 } } }] });
    assert.equal(result.success, false);
    assert.match(result.success ? '' : result.error, /layoutHash/);
    assert.equal(writes.length, 1);
});

test('#29 patchGraphV2 positions 只改位置并返回 moved 与 layoutHash；移到其他卡片上时拒绝', async () => {
    const graph = graphOf([
        source('a', { x: 100, y: 100, width: 528, height: 164 }, ['b.input']),
        n('b', 'delay', { output: [] }, { x: 800, y: 100, width: 528, height: 164 }),
    ]);
    const { gateway, writes } = fakeGateway(graph);
    const ok = await patchGraphV2(gateway, graph.id, { baseLayoutHash: layoutHash(graph.nodes), positions: { b: { x: 800, y: 500 } } });
    assert.equal(ok.success, true, ok.success ? '' : ok.error);
    assert.deepEqual(ok.data!.moved, ['b']);
    assert.deepEqual(ok.data!.changed, []);
    assert.equal(writes.length, 1);
    assert.equal(ok.data!.layout?.savedPositionsVerified, true);
    const bad = await patchGraphV2(gateway, graph.id, { positions: { b: { x: 150, y: 120 } } });
    assert.equal(bad.success, false);
    assert.match(bad.success ? '' : bad.error, /重叠/);
    assert.equal(writes.length, 1);
});

// ==================== #30 增量避让 ====================

test('#30 issue 复现：已移动的卡片加一张新卡片，保存前不再重叠', async () => {
    const graph = graphOf([source('a', { x: 100, y: 384, width: 528, height: 164 })]);
    const { gateway, writes } = fakeGateway(graph);
    const result = await writeGraphNodes(gateway, graph.id, graph, { nodes: [...graph.nodes, source('b')] });
    assert.equal(result.success, true);
    assert.equal(writes.length, 1);
    const [a, b] = writes[0].nodes;
    assert.deepEqual(pos(a), { x: 100, y: 384, width: 528, height: 164 }, '已有卡片不动');
    assert.equal(overlap(pos(a), pos(b)), false);
});

test('#30 新卡片靠近上游放在右侧，避开所有已有卡片（含原生测量的大卡片）', () => {
    const nodes = [
        source('t', { x: 100, y: 100, width: 528, height: 164 }, ['g.input']),
        n('g', 'deviceGet', { output: ['x.input'], output2: [] }, { x: 778, y: 100, width: 748, height: 172 }),
        n('busy', 'delay', { output: [] }, { x: 1676, y: 100, width: 528, height: 164 }),
        n('x', 'delay'),
    ];
    const result = arrangeNodes(nodes);
    assert.deepEqual(result.placedIds, ['x']);
    const placed = pos(result.nodes[3]);
    assert.ok(placed.x >= 778 + 748, '在上游右侧');
    for (const other of result.nodes.slice(0, 3)) assert.equal(overlap(placed, pos(other)), false);
    assert.equal(result.report.overlaps.length, 0);
});

test('#30 已有卡片之间的既有重叠只报告，不移动；新卡片也不与之重叠', () => {
    const nodes = [
        source('a', { x: 100, y: 100, width: 528, height: 164 }),
        source('b', { x: 200, y: 150, width: 528, height: 164 }),
        source('c'),
    ];
    const result = arrangeNodes(nodes);
    assert.deepEqual(pos(result.nodes[0]), pos(nodes[0]));
    assert.deepEqual(pos(result.nodes[1]), pos(nodes[1]));
    assert.deepEqual(result.report.overlaps, [['a', 'b']]);
    assert.equal(overlap(pos(result.nodes[2]), pos(nodes[0])) || overlap(pos(result.nodes[2]), pos(nodes[1])), false);
});

test('#30 新的独立分区放在已有流程下方，不与任何卡片重叠', () => {
    const nodes = [
        source('a', { x: 100, y: 100, width: 528, height: 164 }, ['b.input']),
        n('b', 'delay', { output: [] }, { x: 778, y: 100, width: 528, height: 164 }),
        source('s', undefined, ['t.input']),
        n('t', 'delay'),
    ];
    const result = arrangeNodes(nodes);
    const [a, b, s, t] = result.nodes.map(pos);
    assert.ok(s.y > Math.max(a.y + a.height, b.y + b.height));
    assert.ok(t.x > s.x, '分区内部仍从左到右');
    assert.equal(result.report.overlaps.length, 0);
    assert.equal(result.report.regions.length, 2);
});

test('#30 全新规则：分支上下排列、回路不报错、无重叠无穿卡', () => {
    // load → cond(met → on → wait → cond 回路, unmet → off)；另一触发经共享节点 on
    const nodes = [
        source('load', undefined, ['cond.trigger']),
        n('cond', 'condition', { met: ['on.trigger'], unmet: ['off.trigger'] }, undefined, { trigger: null, condition: null }),
        n('on', 'deviceOutput', { output: ['wait.input'] }, undefined, { trigger: null }),
        n('off', 'deviceOutput', { output: [] }, undefined, { trigger: null }),
        n('wait', 'delay', { output: ['cond.trigger'] }),
        source('other', undefined, ['on.trigger']),
    ];
    const result = arrangeNodes(nodes);
    const p = Object.fromEntries(result.nodes.map((node) => [node.id, pos(node)]));
    assert.ok(p.cond.x > p.load.x && p.on.x > p.cond.x && p.wait.x > p.on.x, '主流程从左到右');
    assert.equal(p.on.x, p.off.x, '同层分支在同一列');
    assert.notEqual(p.on.y, p.off.y);
    assert.equal(result.report.overlaps.length, 0);
    assert.equal(result.report.possibleOverlaps.length, 0, '按保守尺寸也留有间距');
    // 回连线（wait → cond）需要绕回，允许被报告；前向连线不应穿卡
    assert.deepEqual(result.report.edgesThroughCards.filter((edge) => !(edge.from === 'wait' && edge.to === 'cond')), []);
    assert.equal(result.report.backEdges, 1, '回路连线向左');
});

test('#30 交叉最少化：两条平行链不应交叉', () => {
    const nodes = [
        source('a1', undefined, ['b2.input']),
        source('a2', undefined, ['b1.input']),
        n('b1', 'delay'),
        n('b2', 'delay'),
    ];
    const result = arrangeNodes(nodes);
    assert.equal(result.report.crossings, 0);
});

test('#30 full 模式重排，pinned 卡片不动且其他卡片避开它', () => {
    const nodes = [
        source('a', { x: 5000, y: 5000, width: 528, height: 164 }, ['b.input']),
        n('b', 'delay', { output: ['c.input'] }, { x: 100, y: 100, width: 528, height: 164 }),
        n('c', 'delay', { output: [] }, { x: 110, y: 110, width: 528, height: 164 }),
    ];
    const result = arrangeNodes(nodes, { mode: 'full', pinned: ['a'] });
    assert.deepEqual(pos(result.nodes[0]), pos(nodes[0]));
    assert.deepEqual(result.placedIds.sort(), ['b', 'c']);
    assert.equal(result.report.overlaps.length, 0);
    assert.ok(pos(result.nodes[1]).x > 5000, 'b 跟在 pinned 的上游右侧');
});

test('#30 重排保留卡片的原生测量尺寸', () => {
    const nodes = [
        source('a', { x: 0, y: 0, width: 160, height: 98 }, ['b.input']),
        n('b', 'deviceGet', { output: [], output2: [] }, { x: 10, y: 10, width: 740, height: 172 }),
    ];
    const result = arrangeNodes(nodes, { mode: 'full' });
    assert.deepEqual([pos(result.nodes[0]).width, pos(result.nodes[0]).height], [160, 98]);
    assert.deepEqual([pos(result.nodes[1]).width, pos(result.nodes[1]).height], [740, 172]);
    assert.equal(result.report.overlaps.length, 0);
});

test('#30 layoutReport 检出穿卡连线和可能重叠', () => {
    const nodes = [
        source('a', { x: 0, y: 0, width: 528, height: 164 }, ['c.input']),
        n('b', 'delay', { output: [] }, { x: 800, y: 0, width: 528, height: 164 }),
        n('c', 'delay', { output: [] }, { x: 1500, y: 0, width: 528, height: 164 }),
        n('g', 'deviceGet', { output: [], output2: [] }, { x: 0, y: 180, width: 528, height: 164 }),
    ];
    const report = layoutReport(nodes);
    assert.deepEqual(report.edgesThroughCards, [{ from: 'a', to: 'c', cards: ['b'] }]);
    assert.deepEqual(report.overlaps, []);
    assert.deepEqual(report.possibleOverlaps, [['a', 'g']], 'deviceGet 原生可能更大，与上方卡片间距不足');
    assert.equal(report.model.verifiedInNativeUi, false);
});

test('#30 新备注放在流程上方，不压流程卡片', () => {
    const nodes = [
        source('a', { x: 100, y: 100, width: 528, height: 164 }),
        { id: 'note', type: 'nop', cfg: { name: 'nop', version: 0, contents: 'x' }, props: {}, inputs: {}, outputs: { output: [] } } as GraphNode,
    ];
    const result = arrangeNodes(nodes);
    const note = pos(result.nodes[1]);
    assert.ok(note.y + note.height < 100);
    assert.equal(result.report.overlaps.length, 0);
});
