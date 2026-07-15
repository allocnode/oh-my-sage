import assert from 'node:assert/strict';
import test from 'node:test';
import type { GatewayClient } from '../../src/core/gateway/client';
import { createCoreTools } from '../../src/server/ai/tools-adapter';

function gatewayWith(handler: (method: string, params: Record<string, unknown>, timeout: number) => unknown): GatewayClient {
    return {
        callApi: async (method: string, params: Record<string, unknown>, timeout: number) => handler(method, params, timeout),
    } as unknown as GatewayClient;
}

test('Web Agent 可以调用白名单内的原始读取 API', async () => {
    const gateway = gatewayWith((method, params, timeout) => ({method, params, timeout}));
    const tools = createCoreTools(gateway) as any;

    const result = await tools.call_gateway_api.execute({
        method: 'getApiList',
        params: {},
        timeout: 3210,
    });

    assert.deepEqual(result, {
        success: true,
        data: {method: 'getApiList', params: {}, timeout: 3210},
    });
});

test('Web Agent 无法绕过原始 API 的只读白名单', async () => {
    let called = false;
    const gateway = gatewayWith(() => {
        called = true;
        return undefined;
    });
    const tools = createCoreTools(gateway) as any;

    const result = await tools.call_gateway_api.execute({
        method: 'setGraph',
        params: {},
        timeout: 3210,
    });

    assert.equal(result.success, false);
    assert.equal(called, false);
});
