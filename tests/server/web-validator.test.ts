import assert from 'node:assert/strict';
import test from 'node:test';
import type { GatewayClient } from '../../src/core/gateway/client';
import { createCoreTools } from '../../src/server/ai/tools-adapter';

const cfg = {
    id: 'web-validator-test',
    enable: false,
    uiType: 'graph',
    userData: {
        name: 'web validator test',
        lastUpdateTime: 0,
        transform: {x: 0, y: 0, scale: 1, rotate: 0},
    },
};

function node(
    id: string,
    type: string,
    inputs: Record<string, unknown>,
    outputs: Record<string, string[]>
) {
    return {id, type, cfg: {name: type, version: 1}, props: {}, inputs, outputs};
}

test('Web validate_graph 接受已验证的 timeRange 条件链', async () => {
    const tools = createCoreTools({} as GatewayClient) as any;
    const result = await tools.validate_graph.execute({
        cfg,
        nodes: [
            node('load', 'onLoad', {}, {output: ['cond.trigger']}),
            node('range', 'timeRange', {}, {output: ['logic.input0']}),
            node('logic', 'logicOr', {input0: null}, {output: ['cond.condition']}),
            node('cond', 'condition', {trigger: null, condition: null}, {met: [], unmet: []}),
        ],
    });

    assert.deepEqual(result, {success: true, valid: true, message: '规则校验通过'});
});

test('Web validate_graph 仍拒绝 output2 连接状态节点', async () => {
    const tools = createCoreTools({} as GatewayClient) as any;
    const result = await tools.validate_graph.execute({
        cfg,
        nodes: [
            node('get', 'varGet', {input: null}, {output: [], output2: ['range.trigger']}),
            node('range', 'timeRange', {}, {output: []}),
        ],
    });

    assert.equal(result.success, true);
    assert.equal(result.valid, false);
    assert.equal(result.errors.some((error: {type: string}) => error.type === 'output2_to_state'), true);
});
