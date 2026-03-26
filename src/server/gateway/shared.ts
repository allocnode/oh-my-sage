/**
 * 共享的 Gateway 实例管理器
 * 登录成功后保持 WebSocket 连接
 */

import {GatewayClient} from './client';

// 使用 globalThis 确保在所有模块中共享同一个实例
const globalKey = '__oh_my_sage_gateway__';

function getGlobalGateway(): GatewayClient | null {
    return (globalThis as any)[globalKey] || null;
}

function setGlobalGateway(instance: GatewayClient | null): void {
    (globalThis as any)[globalKey] = instance;
}

/**
 * 登录并建立 WebSocket 连接
 */
export async function connectGateway(passcode: string, gatewayUrl?: string): Promise<GatewayClient> {
    const url = gatewayUrl || process.env.GATEWAY_URL || 'http://192.168.0.5';

    // 如果已有连接，先关闭
    const existing = getGlobalGateway();
    if (existing) {
        try {
            await existing.close();
        } catch {
        }
    }

    // 创建新连接
    const gateway = new GatewayClient();
    await gateway.connect(url);
    await gateway.authenticate(passcode);

    // 保存到全局变量
    setGlobalGateway(gateway);

    return gateway;
}

/**
 * 获取已建立的网关连接
 */
export function getGateway(): GatewayClient | null {
    return getGlobalGateway();
}

/**
 * 检查是否已连接
 */
export function isGatewayConnected(): boolean {
    const gateway = getGlobalGateway();
    if (!gateway) return false;
    return gateway.isConnected();
}


