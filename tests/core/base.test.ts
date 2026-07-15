import assert from 'node:assert/strict';
import test from 'node:test';
import type { Graph, GraphNode } from '../../src/core/types/graph';
import { validateGraph } from '../../src/core/tools/base';

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
