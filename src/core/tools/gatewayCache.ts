/**
 * Core - 网关读缓存
 *
 * 一次修改流程里设备表和规则会被反复读取，而网关基本按顺序处理请求，
 * 每多一次排队往返就多 25-60 ms。这里提供两类缓存（按网关连接隔离）：
 *
 * - 设备表：短时缓存（默认 30 秒）。查找某个 did 或设备名称未命中时，调用方应 force 刷新一次，
 *   这样新加入的设备不会因缓存而认不出来。
 * - 规则：以 getGraphList 中的 lastUpdateTime 为版本号，只重新读取有变化的规则。
 *   本进程写入、删除规则后会主动失效；另设 5 分钟上限，防止外部修改未更新时间戳时长期读到旧内容。
 */

import { GatewayClient } from '../gateway/client';
import type { DeviceListResponse } from '../types/device';
import type { GraphNode } from '../types/graph';

export const DEVICE_LIST_TTL_MS = 30_000;
export const GRAPH_CACHE_MAX_AGE_MS = 5 * 60_000;
export const SCAN_CONCURRENCY = 12;

export interface GraphListEntry {
    id: string;
    enable?: boolean;
    uiType?: string;
    userData?: { name?: string; lastUpdateTime?: number; transform?: { x: number; y: number; scale: number; rotate: number } };
    createTime?: number;
}

interface GatewayCache {
    devList?: { at: number; promise: Promise<DeviceListResponse['devList']> };
    graphs: Map<string, { version: number; at: number; nodes: GraphNode[] }>;
}

const caches = new WeakMap<object, GatewayCache>();

function cacheOf(gateway: GatewayClient): GatewayCache {
    let cache = caches.get(gateway);
    if (!cache) {
        cache = { graphs: new Map() };
        caches.set(gateway, cache);
    }
    return cache;
}

/** 读取设备表（带短时缓存）；并发调用共享同一次请求，失败不缓存 */
export async function getDeviceList(gateway: GatewayClient, options: { force?: boolean } = {}): Promise<DeviceListResponse['devList']> {
    const cache = cacheOf(gateway);
    const now = Date.now();
    if (!options.force && cache.devList && now - cache.devList.at < DEVICE_LIST_TTL_MS) return cache.devList.promise;
    const promise = gateway.callApi<DeviceListResponse>('getDevList', {}, 10000).then((response) => response?.devList || {});
    cache.devList = { at: now, promise };
    promise.catch(() => {
        if (cache.devList?.promise === promise) cache.devList = undefined;
    });
    return promise;
}

/** 按 did 或设备名称查设备表；未命中时强制刷新一次再查 */
export async function getDeviceListFor(gateway: GatewayClient, tokens: string[]): Promise<DeviceListResponse['devList']> {
    const list = await getDeviceList(gateway);
    const names = new Set(Object.values(list).map((device) => device.name?.trim()));
    const missing = tokens.some((token) => !list[token] && !names.has(token.trim()));
    return missing ? getDeviceList(gateway, { force: true }) : list;
}

/** 规则内容变化后（写入、删除）调用 */
export function invalidateGraph(gateway: GatewayClient, id: string): void {
    cacheOf(gateway).graphs.delete(id);
}

/** 清空某个网关连接的全部缓存（测试或重新登录时用） */
export function clearGatewayCache(gateway: GatewayClient): void {
    caches.delete(gateway);
}

/** 有界并发 map，结果按输入顺序返回；单项失败返回 null 而不是整体失败 */
async function settleLimit<T, R>(items: T[], limit: number, fn: (item: T) => Promise<R>): Promise<Array<R | null>> {
    const results = new Array<R | null>(items.length).fill(null);
    let next = 0;
    const worker = async (): Promise<void> => {
        while (next < items.length) {
            const index = next++;
            try {
                results[index] = await fn(items[index]);
            } catch {
                results[index] = null;
            }
        }
    };
    await Promise.all(Array.from({ length: Math.max(1, Math.min(limit, items.length)) }, worker));
    return results;
}

export interface ScannedGraph {
    summary: GraphListEntry;
    /** 读取失败时为 null */
    nodes: GraphNode[] | null;
}

/**
 * 读取全部规则（或指定规则）。只重新拉取 lastUpdateTime 变化或缓存过期的规则。
 * fresh=true 时忽略缓存全部重读（删除变量前的引用检查等安全相关场景使用）。
 */
export async function scanGraphs(gateway: GatewayClient, options: { ids?: string[]; fresh?: boolean } = {}): Promise<ScannedGraph[]> {
    const cache = cacheOf(gateway);
    const list = await gateway.callApi<GraphListEntry[]>('getGraphList', {}, 10000);
    const summaries = (Array.isArray(list) ? list : []).filter((item) => !options.ids || options.ids.includes(item.id));
    const live = new Set((Array.isArray(list) ? list : []).map((item) => item.id));
    for (const id of cache.graphs.keys()) if (!live.has(id)) cache.graphs.delete(id);
    const now = Date.now();
    const nodes = await settleLimit(summaries, SCAN_CONCURRENCY, async (summary) => {
        const version = summary.userData?.lastUpdateTime ?? -1;
        const hit = cache.graphs.get(summary.id);
        if (!options.fresh && hit && hit.version === version && version !== -1 && now - hit.at < GRAPH_CACHE_MAX_AGE_MS) return hit.nodes;
        const graph = await gateway.callApi<{ nodes?: GraphNode[] }>('getGraph', { id: summary.id }, 10000);
        const result = graph?.nodes || [];
        cache.graphs.set(summary.id, { version, at: Date.now(), nodes: result });
        return result;
    });
    return summaries.map((summary, index) => ({ summary, nodes: nodes[index] }));
}
