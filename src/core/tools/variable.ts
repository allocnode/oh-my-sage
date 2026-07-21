/**
 * Core - 变量工具
 */

import { GatewayClient } from '../gateway/client';
import type { Variable } from '../types';
import type { ToolResponse } from '../types';

export async function getVariables(gateway: GatewayClient, scope: string = 'global'): Promise<ToolResponse<Variable[]>> {
    try {
        const variables = await gateway.callApi<Variable[]>('getVarList', { scope }, 10000);
        return { success: true, data: Array.isArray(variables) ? variables : [] };
    } catch (error) {
        return { success: false, error: `获取变量列表失败: ${error}` };
    }
}

export async function setVariable(gateway: GatewayClient, id: string, value: string | number, scope: string = 'global'): Promise<ToolResponse> {
    try {
        await gateway.callApi('setVarValue', { scope, id, value }, 10000);
        return { success: true, message: `变量 ${id} 已更新为 ${value}` };
    } catch (error) {
        return { success: false, error: `设置变量值失败: ${error}` };
    }
}

/**
 * 创建变量。
 * ⚠️ 网关要求 id 必须是纯字母数字（不能含下划线/连字符），否则返回 "Invalid id format"。
 */
export async function createVariable(
    gateway: GatewayClient,
    id: string,
    type: 'number' | 'string',
    value: number | string,
    name?: string,
    scope: string = 'global'
): Promise<ToolResponse> {
    try {
        await gateway.callApi('createVar', { scope, id, type, value, name: name ?? id }, 10000);
        return { success: true, message: `变量 ${id} 创建成功` };
    } catch (error) {
        return { success: false, error: `创建变量失败: ${error}` };
    }
}

export async function deleteVariable(gateway: GatewayClient, id: string, scope: string = 'global'): Promise<ToolResponse> {
    try {
        await gateway.callApi('deleteVar', { scope, id }, 10000);
        return { success: true, message: `变量 ${id} 删除成功` };
    } catch (error) {
        return { success: false, error: `删除变量失败: ${error}` };
    }
}

export async function getVariableValue(gateway: GatewayClient, id: string, scope: string = 'global'): Promise<ToolResponse> {
    try {
        const value = await gateway.callApi('getVarValue', { scope, id }, 10000);
        return { success: true, data: { id, scope, value } };
    } catch (error) {
        return { success: false, error: `获取变量值失败: ${error}` };
    }
}

export async function getVariableConfig(gateway: GatewayClient, id: string, scope: string = 'global'): Promise<ToolResponse> {
    try {
        const config = await gateway.callApi('getVarConfig', { scope, id }, 10000);
        return { success: true, data: { id, scope, config } };
    } catch (error) {
        return { success: false, error: `获取变量配置失败: ${error}` };
    }
}
