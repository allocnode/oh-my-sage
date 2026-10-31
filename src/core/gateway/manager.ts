/**
 * Core - Gateway 连接管理器
 * 统一管理 Gateway 连接状态
 */

import { GatewayClient } from './client';
import { getDeviceList } from '../tools/gatewayCache';
import { fetchMiotSpec } from '../tools/device';

async function warmUp(gateway: GatewayClient): Promise<void> {
    try {
        const devList = await getDeviceList(gateway);
        const urns = [...new Set(Object.values(devList).map((device) => device.urn).filter(Boolean))];
        for (let i = 0; i < urns.length; i += 4) {
            await Promise.allSettled(urns.slice(i, i + 4).map((urn) => fetchMiotSpec(urn)));
        }
    } catch {
        // 预热失败不影响正常使用
    }
}

export interface GatewayManager {
    gateway: GatewayClient | null;
    isConnected(): boolean;
    connect(passcode: string, gatewayUrl?: string): Promise<void>;
    disconnect(): Promise<void>;
    ensureConnected(): void;
}

export function createGatewayManager(): GatewayManager {
    let gateway: GatewayClient | null = null;

    return {
        get gateway() {
            return gateway;
        },

        isConnected(): boolean {
            return gateway !== null && gateway.isConnected();
        },

        async connect(passcode: string, gatewayUrl?: string): Promise<void> {
            const url = gatewayUrl || process.env.GATEWAY_URL;
            if (!url) {
                throw new Error('未配置网关地址：请在 mijia_auth 的 gateway_url 参数中提供网关地址，或在 MCP 配置里设置 GATEWAY_URL 环境变量');
            }

            if (gateway) {
                try {
                    await gateway.close();
                } catch {
                }
            }

            gateway = new GatewayClient();
            await gateway.connect(url);
            await gateway.authenticate(passcode);
            // 后台预热：设备表与所有设备型号的 MIOT Spec（外网请求每个约数百毫秒）。
            // 不等待、不影响登录结果，失败只是退回按需拉取。
            void warmUp(gateway);
        },

        async disconnect(): Promise<void> {
            if (gateway) {
                try {
                    await gateway.close();
                } catch {
                }
                gateway = null;
            }
        },

        ensureConnected(): void {
            if (!this.isConnected()) {
                throw new Error('网关未连接，请先调用 mijia_auth');
            }
        },
    };
}
