import assert from 'node:assert/strict';
import test from 'node:test';
import type { GatewayClient } from '../../src/core/gateway/client';
import { callGatewayApi } from '../../src/core/tools/misc';

function gatewayWith(handler: (method: string, params: Record<string, unknown>, timeout: number) => unknown): GatewayClient {
    return {
        callApi: async (method: string, params: Record<string, unknown>, timeout: number) => handler(method, params, timeout),
    } as unknown as GatewayClient;
}

test('只读 API 原样透传 method、params 和 timeout', async () => {
    const gateway = gatewayWith((method, params, timeout) => ({ method, params, timeout }));
    const result = await callGatewayApi(gateway, 'getLog', { num: 0 }, 3210);

    assert.deepEqual(result, {
        success: true,
        data: { method: 'getLog', params: { num: 0 }, timeout: 3210 },
    });
});

test('未显式授权时拒绝写 API', async () => {
    let called = false;
    const gateway = gatewayWith(() => {
        called = true;
        return undefined;
    });

    const result = await callGatewayApi(gateway, 'setGraph', {}, 10000);

    assert.equal(result.success, false);
    assert.equal(called, false);
});

test('显式授权后允许写 API', async () => {
    const gateway = gatewayWith((method) => method);
    const result = await callGatewayApi(gateway, 'setGraph', {}, 10000, true);

    assert.deepEqual(result, { success: true, data: 'setGraph' });
});

test('网关异常转为失败响应', async () => {
    const gateway = gatewayWith(() => {
        throw new Error('boom');
    });
    const result = await callGatewayApi(gateway, 'getGraphList');

    assert.equal(result.success, false);
    if (!result.success) assert.match(result.error, /boom/);
});
