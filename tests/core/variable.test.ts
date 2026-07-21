import assert from 'node:assert/strict';
import test from 'node:test';
import type { GatewayClient } from '../../src/core/gateway/client';
import { createVariable, deleteVariable, getVariableConfig, getVariables, getVariableValue } from '../../src/core/tools/variable';

test('变量生命周期 API 使用网关真实参数和响应结构', async () => {
    const calls: Array<{ method: string; params: unknown; timeout: number }> = [];
    const gateway = {
        async callApi(method: string, params: unknown, timeout: number): Promise<unknown> {
            calls.push({ method, params, timeout });
            if (method === 'getVarList') return {
                probe1: { type: 'number', value: 7, userData: { name: 'Probe' } },
            };
            if (method === 'getVarValue') return { value: 7 };
            if (method === 'getVarConfig') return { type: 'number', userData: { name: 'Probe' } };
            return undefined;
        },
    } as unknown as GatewayClient;

    assert.equal((await createVariable(gateway, 'probe1', 'number', 0, ' Probe ')).success, true);
    assert.deepEqual(await getVariables(gateway), {
        success: true,
        data: [{ id: 'probe1', scope: 'global', type: 'number', value: 7, userData: { name: 'Probe' } }],
    });
    assert.deepEqual(await getVariableValue(gateway, 'probe1'), {
        success: true,
        data: { id: 'probe1', scope: 'global', value: 7 },
    });
    assert.deepEqual(await getVariableConfig(gateway, 'probe1'), {
        success: true,
        data: { id: 'probe1', scope: 'global', config: { type: 'number', userData: { name: 'Probe' } } },
    });
    assert.equal((await deleteVariable(gateway, 'probe1')).success, true);
    assert.deepEqual(calls, [
        { method: 'createVar', params: { scope: 'global', id: 'probe1', type: 'number', value: 0, userData: { name: 'Probe' } }, timeout: 10000 },
        { method: 'getVarList', params: { scope: 'global' }, timeout: 10000 },
        { method: 'getVarValue', params: { scope: 'global', id: 'probe1' }, timeout: 10000 },
        { method: 'getVarConfig', params: { scope: 'global', id: 'probe1' }, timeout: 10000 },
        { method: 'deleteVar', params: { scope: 'global', id: 'probe1' }, timeout: 10000 },
    ]);
});

test('空白显示名称在 Core 层回退到变量 ID', async () => {
    let params: unknown;
    const gateway = {
        async callApi(_method: string, input: unknown): Promise<void> {
            params = input;
        },
    } as unknown as GatewayClient;

    await createVariable(gateway, 'probe2', 'string', '', '   ');
    assert.deepEqual(params, {
        scope: 'global', id: 'probe2', type: 'string', value: '', userData: { name: 'probe2' },
    });
});

test('网关异常转为失败响应', async () => {
    const gateway = {
        async callApi(): Promise<never> {
            throw new Error('gateway failed');
        },
    } as unknown as GatewayClient;

    const failure = await createVariable(gateway, 'probe3', 'number', 0);
    assert.equal(failure.success, false);
    assert.match('error' in failure ? failure.error : '', /gateway failed/);
});
