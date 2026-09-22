import assert from 'node:assert/strict';
import test from 'node:test';
import type { Graph, GraphNode } from '../../src/core/types/graph';
import { layoutNodes, validateGraph } from '../../src/core/tools/base';

function node(
    id: string,
    type: string,
    inputs: Record<string, unknown>,
    outputs: Record<string, string[]>,
    props: Record<string, unknown> = {}
): GraphNode {
    return { id, type, cfg: { name: type, version: 1 }, props, inputs, outputs };
}

function graph(nodes: GraphNode[]): Graph {
    return {
        id: 'testgraph',
        nodes,
        cfg: {
            id: 'testgraph',
            enable: false,
            uiType: 'graph',
            userData: {
                name: 'validator test',
                lastUpdateTime: 0,
                transform: { x: 0, y: 0, scale: 1, rotate: 0 },
            },
        },
    };
}

function conditionGraph(logic: GraphNode, targetPort: string): Graph {
    return graph([
        node('load', 'onLoad', {}, { output: ['cond.trigger'] }),
        node('range', 'timeRange', {}, { output: [`logic.${targetPort}`] }),
        logic,
        node('cond', 'condition', { trigger: null, condition: null }, { met: [], unmet: [] }),
    ]);
}

test('timeRange 可以连接 logicOr、logicAnd 和 logicNot 的条件输入', () => {
    const cases = [
        conditionGraph(node('logic', 'logicOr', { input0: null }, { output: ['cond.condition'] }), 'input0'),
        conditionGraph(node('logic', 'logicAnd', { input0: null, input1: null }, { output: ['cond.condition'] }), 'input1'),
        conditionGraph(node('logic', 'logicNot', { input: null }, { output: ['cond.condition'] }), 'input'),
    ];

    for (const value of cases) {
        assert.equal(validateGraph(value).some((error) => error.type === 'tr_wrong_target'), false);
    }
});

test('timeRange 连接事件端口仍然报错', () => {
    const value = graph([
        node('range', 'timeRange', {}, { output: ['cond.trigger'] }),
        node('cond', 'condition', { trigger: null, condition: null }, { met: [], unmet: [] }),
    ]);

    assert.equal(validateGraph(value).some((error) => error.type === 'tr_wrong_target' && error.level === 'error'), true);
});

test('timeRange 连接未声明的 logic 端口仍然报错', () => {
    const value = conditionGraph(
        node('logic', 'logicOr', { input0: null }, { output: ['cond.condition'] }),
        'input999'
    );

    assert.equal(validateGraph(value).some((error) => error.type === 'tr_wrong_target' && error.level === 'error'), true);
});

test('logic 条件链未到达 condition.condition 时仍然报错', () => {
    const value = graph([
        node('range', 'timeRange', {}, { output: ['logic.input0'] }),
        node('logic', 'logicOr', { input0: null }, { output: ['set.input'] }),
        node('set', 'varSetNumber', { input: null }, { output: [] }),
    ]);

    assert.equal(validateGraph(value).some((error) => error.type === 'tr_wrong_target' && error.level === 'error'), true);
});

test('condition 缺少 condition 来源仍然报错', () => {
    const value = graph([
        node('load', 'onLoad', {}, { output: ['cond.trigger'] }),
        node('cond', 'condition', { trigger: null, condition: null }, { met: [], unmet: [] }),
    ]);

    assert.equal(validateGraph(value).some((error) => error.type === 'cond_no_condition' && error.level === 'error'), true);
});

test('output2 连接 state 节点仍然报错，连接 event 输入不报该错误', () => {
    const invalid = graph([
        node('get', 'varGet', { input: null }, { output: [], output2: ['range.trigger'] }),
        node('range', 'timeRange', {}, { output: [] }),
    ]);
    const valid = graph([
        node('get', 'varGet', { input: null }, { output: [], output2: ['set.input'] }),
        node('set', 'varSetNumber', { input: null }, { output: [] }),
    ]);

    assert.equal(validateGraph(invalid).some((error) => error.type === 'output2_to_state' && error.level === 'error'), true);
    assert.equal(validateGraph(valid).some((error) => error.type === 'output2_to_state'), false);
});

test('deviceGetSetVar 接受极客版 UI 生成的单 output 结构', () => {
    const value = graph([
        node('queryvar', 'deviceGetSetVar', { input: null }, { output: [] }, {
            did: 'device', siid: 2, piid: 1, dtype: 'number', id: 'value1', scope: 'global',
        }),
    ]);

    assert.deepEqual(validateGraph(value), []);
});

function noteNode(
    id: string,
    text: string,
    inputs: Record<string, unknown> = {},
    outputs: Record<string, string[]> = { output: [] }
): GraphNode {
    return {
        id,
        type: 'nop',
        cfg: { name: 'nop', version: 1, background: '#80CAFF', contents: [{ insert: text }] },
        props: {},
        inputs,
        outputs,
    };
}

test('合法的 nop 备注节点不产生任何错误', () => {
    const value = graph([
        noteNode('note1', '用途   有人进入时自动开灯\n'),
        node('load', 'onLoad', {}, { output: ['set.input'] }),
        node('set', 'varSetNumber', { input: null }, { output: [] }),
    ]);

    assert.deepEqual(validateGraph(value), []);
});

test('nop 节点声明 inputs 报错', () => {
    const value = graph([noteNode('note1', '备注', { trigger: null })]);

    assert.equal(validateGraph(value).some((error) => error.type === 'nop_has_inputs' && error.level === 'error'), true);
});

test('nop 节点连接下游节点报错', () => {
    const value = graph([
        noteNode('note1', '备注', {}, { output: ['set.input'] }),
        node('set', 'varSetNumber', { input: null }, { output: [] }),
    ]);

    assert.equal(validateGraph(value).some((error) => error.type === 'nop_has_outputs' && error.level === 'error'), true);
});

test('其他节点连接到 nop 报错', () => {
    const value = graph([
        node('load', 'onLoad', {}, { output: ['note1.input'] }),
        noteNode('note1', '备注', { input: null }),
    ]);

    assert.equal(validateGraph(value).some((error) => error.type === 'nop_has_incoming' && error.level === 'error'), true);
});

test('nop 备注正文为空只给出 warn，不阻止写入', () => {
    const errors = validateGraph(graph([noteNode('note1', '   \n')]));

    assert.equal(errors.some((error) => error.type === 'nop_empty' && error.level === 'warn'), true);
    assert.equal(errors.some((error) => error.level === 'error'), false);
});

function scopedGraph(graphId: string, scope: string): Graph {
    const value = graph([
        node('load', 'onLoad', {}, { output: ['set.input'] }),
        node('set', 'varSetNumber', { input: null }, { output: [] }, {
            elements: [{ type: 'const', value: '0' }], id: 'inRoom', scope,
        }),
    ]);
    value.id = graphId;
    value.cfg.id = graphId;
    return value;
}

test('structural validation permits global, local and cross-rule variable scopes', () => {
    for (const scope of ['global', 'R123', 'Rgraph_123', 'R456', 'rule']) {
        assert.deepEqual(validateGraph(scopedGraph('graph_123', scope)), []);
    }
});

test('annotation text supports legacy strings and ignores non-text inserts', () => {
    const note = noteNode('note', '');
    note.cfg.contents = 'Legacy note';
    assert.deepEqual(validateGraph(graph([note])), []);
    note.cfg.contents = [null, { insert: { image: 'example' } }, { insert: 'Rich text' }];
    assert.deepEqual(validateGraph(graph([note])), []);
});

test('annotations do not move flow nodes and receive separate positions', () => {
    const flow = [node('load', 'onLoad', {}, { output: ['set.input'] }), node('set', 'varSetNumber', { input: null }, { output: [] })];
    const annotated = structuredClone(flow);
    const first = noteNode('first', 'First');
    const second = noteNode('second', 'Second');
    layoutNodes(flow);
    layoutNodes([first, ...annotated, second]);
    assert.deepEqual(annotated, flow);
    const firstPos = first.cfg.pos as { y: number; height: number };
    const secondPos = second.cfg.pos as { y: number; height: number };
    const flowPos = flow[0].cfg.pos as { y: number };
    assert.ok(firstPos.y + firstPos.height < flowPos.y);
    assert.ok(secondPos.y + secondPos.height < firstPos.y);
});

test('annotation-only layout preserves existing size and rich-text content', () => {
    const existing = noteNode('existing', 'Keep this');
    existing.cfg.pos = { x: -100, y: -900, width: 700, height: 600 };
    const original = structuredClone(existing);
    const added = noteNode('added', 'New');
    layoutNodes([existing, added]);
    assert.deepEqual(existing, original);
    const addedPos = added.cfg.pos as { y: number; height: number };
    assert.ok(addedPos.y + addedPos.height < -900);
});
