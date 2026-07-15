/**
 * Core - maintenance/debug tools.
 */

import { GatewayClient } from '../gateway/client';
import type { ToolResponse } from '../types';

export const READ_ONLY_GATEWAY_METHODS = new Set([
    'getBackupConfig',
    'getBackupList',
    'getBackupProgress',
    'getDevList',
    'getGraph',
    'getGraphList',
    'getLog',
    'getVarConfig',
    'getVarList',
    'getVarScopeList',
    'getVarValue',
]);

export async function callGatewayApi(
    gateway: GatewayClient,
    method: string,
    params: Record<string, unknown> = {},
    timeout: number = 10000
): Promise<ToolResponse<unknown>> {
    if (!READ_ONLY_GATEWAY_METHODS.has(method)) {
        return {
            success: false,
            error: `方法 ${method} 不在已验证的只读 API 白名单中`,
        };
    }

    try {
        const data = await gateway.callApi(method, params, timeout);
        return { success: true, data };
    } catch (error) {
        return { success: false, error: `调用网关 API 失败: ${error}` };
    }
}
