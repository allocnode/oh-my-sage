/**
 * Core - maintenance/debug tools.
 */

import { GatewayClient } from '../gateway/client';
import type { ToolResponse } from '../types';

export function isReadOnlyGatewayMethod(method: string): boolean {
    return /^get[A-Z0-9_]/.test(method);
}

export async function callGatewayApi(
    gateway: GatewayClient,
    method: string,
    params: Record<string, unknown> = {},
    timeout: number = 10000,
    allowMutation: boolean = false
): Promise<ToolResponse<unknown>> {
    if (!isReadOnlyGatewayMethod(method) && !allowMutation) {
        return {
            success: false,
            error: `方法 ${method} 可能修改网关状态；如确需调用，请显式设置 allow_mutation=true`,
        };
    }

    try {
        const data = await gateway.callApi(method, params, timeout);
        return { success: true, data };
    } catch (error) {
        return { success: false, error: `调用网关 API 失败: ${error}` };
    }
}
