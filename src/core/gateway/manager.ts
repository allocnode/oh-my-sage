/**
 * Core - Gateway 连接管理器
 * 统一管理 Gateway 连接状态
 *
 * HTTP 常驻模式下所有客户端共享同一个管理器，因此：
 * - 重新登录（换网关、换登录码）必须在新连接认证成功后才替换旧连接，
 *   失败时保留旧连接，避免一次输错登录码让所有客户端一起掉线；
 * - 登录请求串行执行，避免两个并发登录互相覆盖。
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

/** 验证连接时使用的只读请求：返回体很小（实测约 200 字节、20 ms 级） */
export const VERIFY_METHOD = 'getVarScopeList';
export const VERIFY_TIMEOUT_MS = 5000;

export interface GatewayVerifyResult {
    /** 本地记录的连接状态 */
    connected: boolean;
    /** 网关是否实际响应了只读请求；未连接时为 false */
    responsive: boolean;
    /** 请求耗时（毫秒），仅在发出请求时返回 */
    latencyMs?: number;
    /** 失败原因 */
    error?: string;
}

/** 管理器使用的网关客户端最小接口，便于测试替换 */
export type GatewayClientLike = Pick<GatewayClient, 'connect' | 'authenticate' | 'close' | 'isConnected' | 'callApi'>;

export interface GatewayManagerOptions {
    /** 创建网关客户端；默认 new GatewayClient()，测试时可替换 */
    createClient?: () => GatewayClientLike;
    /** 登录成功后是否后台预热设备表与 MIOT Spec，默认 true */
    warmUp?: boolean;
}

export interface GatewayManager {
    gateway: GatewayClient | null;
    isConnected(): boolean;
    /**
     * 登录网关。已有连接时，新连接认证成功后才替换旧连接；失败时旧连接保持可用。
     * 多次调用按顺序执行。
     */
    connect(passcode: string, gatewayUrl?: string): Promise<void>;
    disconnect(): Promise<void>;
    ensureConnected(): void;
    /** 向网关发一次轻量只读请求，确认连接确实可用（不读缓存、不重新登录） */
    verify?(timeoutMs?: number): Promise<GatewayVerifyResult>;
}

export function createGatewayManager(options: GatewayManagerOptions = {}): GatewayManager {
    const createClient = options.createClient ?? (() => new GatewayClient());
    const shouldWarmUp = options.warmUp ?? true;
    let gateway: GatewayClientLike | null = null;
    // 登录队列：保证 connect() 串行执行
    let queue: Promise<unknown> = Promise.resolve();

    const closeQuietly = async (client: GatewayClientLike | null): Promise<void> => {
        if (!client) return;
        try {
            await client.close();
        } catch {
            // 忽略关闭错误
        }
    };

    const doConnect = async (passcode: string, gatewayUrl?: string): Promise<void> => {
        const url = gatewayUrl || process.env.GATEWAY_URL;
        if (!url) {
            throw new Error('未配置网关地址：请在 mijia_auth 的 gateway_url 参数中提供网关地址，或在 MCP 配置里设置 GATEWAY_URL 环境变量');
        }

        const next = createClient();
        try {
            await next.connect(url);
            await next.authenticate(passcode);
        } catch (error) {
            // 新连接失败：关闭它，旧连接（如果有）保持不变
            await closeQuietly(next);
            throw error;
        }

        const previous = gateway;
        gateway = next;
        await closeQuietly(previous);

        // 后台预热：设备表与所有设备型号的 MIOT Spec（外网请求每个约数百毫秒）。
        // 不等待、不影响登录结果，失败只是退回按需拉取。
        if (shouldWarmUp && next instanceof GatewayClient) void warmUp(next);
    };

    return {
        get gateway() {
            return gateway as GatewayClient | null;
        },

        isConnected(): boolean {
            return gateway !== null && gateway.isConnected();
        },

        connect(passcode: string, gatewayUrl?: string): Promise<void> {
            const run = queue.then(() => doConnect(passcode, gatewayUrl));
            // 队列只关心顺序，不传播上一次的失败
            queue = run.catch(() => undefined);
            return run;
        },

        async disconnect(): Promise<void> {
            const current = gateway;
            gateway = null;
            await closeQuietly(current);
        },

        ensureConnected(): void {
            if (!this.isConnected()) {
                throw new Error('网关未连接，请先调用 mijia_auth');
            }
        },

        async verify(timeoutMs: number = VERIFY_TIMEOUT_MS): Promise<GatewayVerifyResult> {
            const current = gateway;
            if (!current || !current.isConnected()) {
                return { connected: false, responsive: false, error: '网关未连接' };
            }
            const started = Date.now();
            try {
                await current.callApi(VERIFY_METHOD, {}, timeoutMs);
                return { connected: true, responsive: true, latencyMs: Date.now() - started };
            } catch (error) {
                return {
                    connected: current.isConnected(),
                    responsive: false,
                    latencyMs: Date.now() - started,
                    error: error instanceof Error ? error.message : String(error),
                };
            }
        },
    };
}
