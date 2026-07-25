import assert from 'node:assert/strict';
import test from 'node:test';
import type { GatewayClient } from '../../src/core/gateway/client';
import {createCoreTools} from '../../src/server/ai/tools-adapter';

test('网页端智能体公开完整变量生命周期工具', () => {
    const tools = createCoreTools({} as GatewayClient) as any;
    for (const name of ['create_variable', 'delete_variable', 'get_variable_value', 'get_variable_config']) {
        assert.equal(typeof tools[name]?.execute, 'function');
    }
});

test('网页端 create_graph 透传本规则变量定义', async () => {
    const calls: Array<{method: string; params: any}> = [];
    const variables: Record<string, any> = {};
    const gateway = {
        async callApi(method: string, params: any): Promise<unknown> {
            calls.push({method, params});
            if (method === 'getGraphList') return [];
            if (method === 'getVarScopeList') return {scopes: []};
            if (method === 'createVar') variables[params.id] = {type: params.type, value: params.value, userData: params.userData};
            if (method === 'getVarList') return variables;
            return undefined;
        },
    } as unknown as GatewayClient;
    const tools = createCoreTools(gateway) as any;

    const result = await tools.create_graph.execute({
        name: '网页端变量规则',
        nodes: [{id: 'calc', type: 'varSetNumber', cfg: {}, props: {id: 'result', scope: 'rule', elements: [{type: 'const', value: '1'}]}, inputs: {input: null}, outputs: {output: []}}],
        variables: [{id: 'result', type: 'number', value: 0, name: '结果'}],
        enable: false,
    });

    assert.equal(result.success, true);
    assert.equal(calls.some(call => call.method === 'createVar'), true);
    const saved = calls.filter(call => call.method === 'setGraph').at(-1)?.params;
    assert.match(saved.nodes[0].props.scope, /^R\d{13}$/);
});
