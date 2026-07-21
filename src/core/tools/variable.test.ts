import assert from 'node:assert/strict';
import type { GatewayClient } from '../gateway/client';
import { createVariable, deleteVariable, getVariableConfig, getVariableValue } from './variable';

async function main(): Promise<void> {
    const calls: Array<{ method: string; params: unknown; timeout: number }> = [];
    const gateway = {
        async callApi(method: string, params: unknown, timeout: number): Promise<unknown> {
            calls.push({ method, params, timeout });
            if (method === 'getVarValue') return { value: 7 };
            if (method === 'getVarConfig') return { type: 'number' };
            return undefined;
        },
    } as unknown as GatewayClient;

    assert.equal((await createVariable(gateway, 'probe1', 'number', 0, 'Probe')).success, true);
    assert.equal((await deleteVariable(gateway, 'probe1')).success, true);
    assert.deepEqual(await getVariableValue(gateway, 'probe1'), {
        success: true,
        data: { id: 'probe1', scope: 'global', value: { value: 7 } },
    });
    assert.deepEqual(await getVariableConfig(gateway, 'probe1'), {
        success: true,
        data: { id: 'probe1', scope: 'global', config: { type: 'number' } },
    });
    assert.deepEqual(calls, [
        { method: 'createVar', params: { scope: 'global', id: 'probe1', type: 'number', value: 0, name: 'Probe' }, timeout: 10000 },
        { method: 'deleteVar', params: { scope: 'global', id: 'probe1' }, timeout: 10000 },
        { method: 'getVarValue', params: { scope: 'global', id: 'probe1' }, timeout: 10000 },
        { method: 'getVarConfig', params: { scope: 'global', id: 'probe1' }, timeout: 10000 },
    ]);

    const failingGateway = {
        async callApi(): Promise<never> {
            throw new Error('gateway failed');
        },
    } as unknown as GatewayClient;
    const failure = await createVariable(failingGateway, 'probe2', 'number', 0);
    assert.equal(failure.success, false);
    assert.match('error' in failure ? failure.error : '', /gateway failed/);

    console.log('variable lifecycle tests passed');
}

void main();
