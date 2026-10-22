import assert from 'node:assert/strict';
import test from 'node:test';
import type { GatewayClient } from '../../src/core/gateway/client';
import type { Graph, GraphNode } from '../../src/core/types/graph';
import { applyGraphPatch, graphHash, patchGraph, summarizeGraph, validateGraphById } from '../../src/core/tools/graphEdit';
import { clearMiotSpecCache } from '../../src/core/tools/device';

const node = (id: string, type: string, extra: Partial<GraphNode> = {}): GraphNode => ({
    id,
    type,
    cfg: { name: type, version: 1 },
    props: {},
    inputs: {},
    outputs: { output: [] },
    ...extra,
});

function sampleNodes(): GraphNode[] {
    return [
        node('start', 'onLoad', { cfg: { name: 'onLoad', version: 1, pos: { x: 1, y: 2 } }, outputs: { output: ['wait.input'] } }),
        node('wait', 'delay', { cfg: { name: 'delay', version: 1, unit: 's', value: 5, pos: { x: 3, y: 4 } }, props: { timeout: 5000 }, inputs: { input: null }, outputs: { output: ['lamp.trigger'] } }),
        node('lamp', 'deviceOutput', { cfg: { name: 'deviceOutput', version: 1, urn: 'urn:test:lamp', pos: { x: 5, y: 6 } }, props: { did: 'd1', siid: 2, piid: 1, value: true, dtype: 'boolean' }, inputs: { trigger: null } }),
    ];
}

// ==================== graphHash ====================

test('graphHash 忽略坐标与对象键顺序，但节点顺序参与计算', () => {
    const nodes = sampleNodes();
    const reordered = nodes.map((item) => ({ outputs: item.outputs, inputs: item.inputs, props: item.props, cfg: item.cfg, type: item.type, id: item.id }));
    assert.equal(graphHash(nodes), graphHash(reordered));
    assert.match(graphHash(nodes), /^[0-9a-f]{16}$/);

    const moved = structuredClone(nodes);
    (moved[1].cfg as Record<string, unknown>).pos = { x: 999, y: 999 };
    assert.equal(graphHash(moved), graphHash(nodes));

    assert.notEqual(graphHash([...nodes].reverse()), graphHash(nodes));
    const changed = structuredClone(nodes);
    changed[1].props.timeout = 6000;
    assert.notEqual(graphHash(changed), graphHash(nodes));
});

// ==================== summarizeGraph ====================

test('summarizeGraph 提取备注、精简参数且不含坐标/URN/inputs', () => {
    const graph: Graph = {
        id: 'g1',
        nodes: [
            ...sampleNodes(),
            node('note1', 'nop', { cfg: { name: 'nop', contents: [{ insert: '第一行\n' }, { insert: '第二行' }] }, outputs: {} }),
            node('setVar', 'varSetNumber', { props: { id: 'v', scope: 'R1', elements: [{ type: 'const', value: '1' }], extra: 'x' } }),
            node('big', 'timeRange', { props: { blob: 'x'.repeat(400) } }),
        ],
        cfg: { id: 'g1', enable: true, uiType: 'graph', userData: { name: '测试', lastUpdateTime: 0, transform: { x: 0, y: 0, scale: 1, rotate: 0 } } },
    };
    const summary = summarizeGraph(graph);
    assert.equal(summary.name, '测试');
    assert.equal(summary.enable, true);
    assert.equal(summary.nodeCount, 6);
    assert.equal(summary.note, '第一行\n第二行');
    assert.deepEqual(summary.noteIds, ['note1']);
    assert.equal(summary.nodes.some((item) => item.type === 'nop'), false);

    const byId = new Map(summary.nodes.map((item) => [item.id, item]));
    assert.deepEqual(byId.get('wait')?.params, { timeout: 5000, unit: 's', value: 5 });
    assert.deepEqual(byId.get('lamp')?.params, { did: 'd1', siid: 2, piid: 1, value: true });
    assert.equal(byId.get('lamp')?.out, undefined);
    assert.deepEqual(byId.get('start')?.out, { output: ['wait.input'] });
    assert.equal(byId.get('start')?.params, undefined);
    assert.deepEqual(byId.get('setVar')?.params, { id: 'v', scope: 'R1', elements: [{ type: 'const', value: '1' }] });
    assert.deepEqual(byId.get('big')?.params, { omitted: true });

    const text = JSON.stringify(summary);
    assert.equal(text.includes('pos'), false);
    assert.equal(text.includes('urn:test'), false);
    assert.equal(text.includes('inputs'), false);
});

test('summarizeGraph 截断超长备注', () => {
    const graph = { id: 'g', nodes: [node('n', 'nop', { cfg: { contents: 'a'.repeat(2000) } })], cfg: undefined } as unknown as Graph;
    const summary = summarizeGraph(graph);
    assert.equal(summary.note, `${'a'.repeat(1500)}…(truncated)`);
    assert.equal(summary.name, 'g');
});

// ==================== applyGraphPatch ====================

test('applyGraphPatch upsert 保留原坐标并追加新节点', () => {
    const nodes = sampleNodes();
    const result = applyGraphPatch(nodes, {
        upsert: [
            node('wait', 'delay', { cfg: { name: 'delay', version: 1 }, props: { timeout: 9000 }, inputs: { input: null }, outputs: { output: ['lamp.trigger'] } }),
            node('extra', 'onLoad'),
        ],
    });
    assert.equal(result.error, undefined);
    assert.deepEqual(result.nodes.find((item) => item.id === 'wait')?.cfg.pos, { x: 3, y: 4 });
    assert.equal(result.nodes.at(-1)?.id, 'extra');
    assert.deepEqual(result.changedIds, ['extra', 'wait']);
});

test('applyGraphPatch merge 浅合并且 null 删除键，outputs 按端口替换', () => {
    const result = applyGraphPatch(sampleNodes(), {
        merge: [{ id: 'lamp', props: { value: false, dtype: null }, outputs: { output: ['wait.input'] } }],
    });
    const lamp = result.nodes.find((item) => item.id === 'lamp')!;
    assert.deepEqual(lamp.props, { did: 'd1', siid: 2, piid: 1, value: false });
    assert.deepEqual(lamp.outputs, { output: ['wait.input'] });
    assert.deepEqual(result.changedIds, ['lamp']);
});

test('applyGraphPatch 删除节点时清理悬空连线并计入变化', () => {
    const result = applyGraphPatch(sampleNodes(), { removeIds: ['lamp'] });
    assert.equal(result.error, undefined);
    assert.equal(result.nodes.some((item) => item.id === 'lamp'), false);
    assert.deepEqual(result.nodes.find((item) => item.id === 'wait')?.outputs, { output: [] });
    assert.deepEqual(result.changedIds, ['lamp', 'wait']);
});

test('applyGraphPatch 拒绝重复 ID 与不存在的节点', () => {
    assert.match(applyGraphPatch(sampleNodes(), { merge: [{ id: 'lamp' }], removeIds: ['lamp'] }).error || '', /重复/);
    assert.match(applyGraphPatch(sampleNodes(), { removeIds: ['nope'] }).error || '', /不存在/);
    assert.match(applyGraphPatch(sampleNodes(), { merge: [{ id: 'nope', props: {} }] }).error || '', /不存在/);
});

test('applyGraphPatch 不修改入参', () => {
    const nodes = sampleNodes();
    const snapshot = structuredClone(nodes);
    const upsert = [node('wait', 'delay', { props: { timeout: 1 } })];
    applyGraphPatch(nodes, { upsert, merge: [{ id: 'lamp', props: { value: false } }], removeIds: ['start'] });
    assert.deepEqual(nodes, snapshot);
    assert.equal(upsert[0].cfg.pos, undefined);
});

// ==================== patchGraph ====================

function fakeGateway(nodes: GraphNode[], devList: Record<string, unknown> = {}) {
    const calls: Array<{ method: string; params: any }> = [];
    const gateway = {
        async callApi(method: string, params: any): Promise<unknown> {
            calls.push({ method, params });
            if (method === 'getGraph') return { id: '1', nodes: structuredClone(nodes), cfg: { id: '1', enable: true, uiType: 'graph', userData: { name: 'R', lastUpdateTime: 0, transform: { x: 0, y: 0, scale: 1, rotate: 0 } } } };
            if (method === 'getGraphList') return [{ id: '1', enable: true, userData: { name: 'R' } }];
            if (method === 'getDevList') return { devList };
            if (method === 'setGraph') return undefined;
            throw new Error(`意外的方法 ${method}`);
        },
    } as unknown as GatewayClient;
    return { gateway, calls };
}

const plainNodes = (): GraphNode[] => [
    node('start', 'onLoad', { cfg: { name: 'onLoad', version: 1, pos: { x: 1, y: 2 } }, outputs: { output: ['wait.input'] } }),
    node('wait', 'delay', { cfg: { name: 'delay', version: 1, pos: { x: 3, y: 4 } }, props: { timeout: 5000 }, inputs: { input: null }, outputs: { output: [] } }),
];

test('patchGraph hash 不一致时拒绝且不写入', async () => {
    const { gateway, calls } = fakeGateway(plainNodes());
    const result = await patchGraph(gateway, '1', { baseHash: '0000000000000000', merge: [{ id: 'wait', props: { timeout: 1000 } }] });
    assert.equal(result.success, false);
    assert.match('error' in result ? result.error : '', /hash 不一致.*当前 hash=[0-9a-f]{16}/);
    assert.equal(calls.some((call) => call.method === 'setGraph'), false);
});

test('patchGraph 无变化时不写入', async () => {
    const nodes = plainNodes();
    const { gateway, calls } = fakeGateway(nodes);
    const result = await patchGraph(gateway, '1', { baseHash: graphHash(nodes), merge: [{ id: 'wait', props: { timeout: 5000 } }], name: 'R', enable: true });
    assert.equal(result.success, true);
    assert.equal(result.success && result.message, '无变化');
    assert.equal(calls.some((call) => call.method === 'setGraph'), false);
});

test('patchGraph 成功路径只写一次并返回新 hash', async () => {
    const nodes = plainNodes();
    const { gateway, calls } = fakeGateway(nodes);
    const result = await patchGraph(gateway, '1', { baseHash: graphHash(nodes), merge: [{ id: 'wait', props: { timeout: 8000 } }] });
    assert.equal(result.success, true, JSON.stringify(result));
    const sets = calls.filter((call) => call.method === 'setGraph');
    assert.equal(sets.length, 1);
    const saved = sets[0].params.nodes as GraphNode[];
    assert.equal(saved.find((item) => item.id === 'wait')?.props.timeout, 8000);
    assert.deepEqual(saved.find((item) => item.id === 'wait')?.cfg.pos, { x: 3, y: 4 });
    if (result.success) {
        assert.deepEqual(result.data?.changedIds, ['wait']);
        assert.equal(result.data?.hash, graphHash(saved));
        assert.equal(result.data?.nodeCount, 2);
    }
    assert.equal(calls.filter((call) => call.method === 'getGraph').length, 1);
    assert.equal(sets[0].params.cfg.enable, true);
    assert.equal(sets[0].params.cfg.userData.name, 'R');
});

test('patchGraph upsert 改变已有节点类型时报错且不写入', async () => {
    const { gateway, calls } = fakeGateway(plainNodes());
    const result = await patchGraph(gateway, '1', { upsert: [node('wait', 'onLoad')] });
    assert.equal(result.success, false);
    assert.match('error' in result ? result.error : '', /节点 wait 已存在且类型为 delay，upsert 不能改类型/);
    assert.equal(calls.some((call) => call.method === 'setGraph'), false);
});

test('patchGraph upsert 设备节点缺少 cfg.urn 时能力校验失败且不写入', async () => {
    clearMiotSpecCache();
    const originalFetch = globalThis.fetch;
    const spec = { services: [{ iid: 2, description: 'light', properties: [{ iid: 1, description: 'on', format: 'bool', access: ['read', 'write'] }] }] };
    globalThis.fetch = (async () => new Response(JSON.stringify(spec), { status: 200 })) as typeof fetch;
    try {
        const devList = { d1: { name: 'Lamp', model: 'm', modelName: 'M', online: true, roomName: 'R', urn: 'urn:test:lamp' } };
        const { gateway, calls } = fakeGateway(plainNodes(), devList);
        const lamp = node('lamp', 'deviceOutput', { props: { did: 'd1', siid: 2, piid: 1, value: true, dtype: 'boolean' }, inputs: { trigger: null } });
        const result = await patchGraph(gateway, '1', {
            upsert: [lamp],
            merge: [{ id: 'wait', outputs: { output: ['lamp.trigger'] } }],
        });
        assert.equal(result.success, false);
        assert.match('error' in result ? result.error : '', /能力校验失败/);
        assert.equal(calls.some((call) => call.method === 'getDevList'), true);
        assert.equal(calls.some((call) => call.method === 'setGraph'), false);
    } finally {
        globalThis.fetch = originalFetch;
        clearMiotSpecCache();
    }
});

test('patchGraph 结构错误时返回前 10 条明细且不写入', async () => {
    const { gateway, calls } = fakeGateway(plainNodes());
    const result = await patchGraph(gateway, '1', { merge: [{ id: 'start', outputs: { output: ['ghost.input'] } }] });
    assert.equal(result.success, false);
    assert.match('error' in result ? result.error : '', /\[start\] .*ghost/);
    assert.equal(calls.some((call) => call.method === 'setGraph'), false);
});

test('validateGraphById 返回结构与能力校验结果', async () => {
    const { gateway } = fakeGateway(plainNodes());
    const report = await validateGraphById(gateway, '1');
    assert.deepEqual(report.structural.filter((item) => item.level === 'error'), []);
    assert.equal(report.capability.valid, true);
});
