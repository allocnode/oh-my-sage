/**
 * Core - 设备工具
 */

import { GatewayClient } from '../gateway/client';
import type {
    Device,
    DeviceInfo,
    DeviceListResponse,
    MiotActionCapability,
    MiotEventCapability,
    MiotPropertyCapability,
    MiotValueListItem,
    MiotValueRange,
} from '../types/device';
import type { ToolResponse } from '../types';

interface MiotSpecProperty {
    iid: number;
    description: string;
    format: string;
    unit?: string;
    access?: string[];
    'value-range'?: unknown;
    'value-list'?: unknown;
}

interface MiotSpecService {
    iid: number;
    description: string;
    properties?: MiotSpecProperty[];
    events?: Array<{ iid: number; description: string; arguments?: number[] }>;
    actions?: Array<{ iid: number; description: string; in?: number[] }>;
}

interface MiotSpec {
    services?: MiotSpecService[];
}

function normalizeRange(value: unknown): MiotValueRange | undefined {
    if (!Array.isArray(value) || value.length !== 3 || !value.every((item) => typeof item === 'number' && Number.isFinite(item))) {
        return undefined;
    }
    return { min: value[0], max: value[1], step: value[2] };
}

function normalizeList(value: unknown): MiotValueListItem[] | undefined {
    if (!Array.isArray(value) || !value.every((item) => {
        if (!item || typeof item !== 'object') return false;
        const entry = item as Record<string, unknown>;
        return (typeof entry.value === 'string' || typeof entry.value === 'number' || typeof entry.value === 'boolean') && typeof entry.description === 'string';
    })) {
        return undefined;
    }
    return value.map((item) => {
        const entry = item as { value: string | number | boolean; description: string };
        return { value: entry.value, description: entry.description };
    });
}

function propertyCapability(siid: number, serviceDescription: string, property: MiotSpecProperty): MiotPropertyCapability {
    return {
        siid,
        piid: property.iid,
        desc: `${serviceDescription}-${property.description}`,
        dtype: property.format,
        access: property.access || [],
        ...(property.unit ? { unit: property.unit } : {}),
        ...(normalizeRange(property['value-range']) ? { range: normalizeRange(property['value-range']) } : {}),
        ...(normalizeList(property['value-list']) ? { list: normalizeList(property['value-list']) } : {}),
    };
}

export function normalizeMiotSpec(spec: MiotSpec): Pick<DeviceInfo, 'properties' | 'events' | 'triggers' | 'actions' | 'readable'> {
    if (!Array.isArray(spec.services) || spec.services.length === 0) {
        throw new Error('MIOT Spec does not contain services');
    }

    const properties: MiotPropertyCapability[] = [];
    const events: MiotEventCapability[] = [];
    const actionCapabilities: MiotActionCapability[] = [];
    const triggers: NonNullable<DeviceInfo['triggers']> = [];
    const actions: NonNullable<DeviceInfo['actions']> = [];
    const readable: NonNullable<DeviceInfo['readable']> = [];

    for (const service of spec.services) {
        const serviceProperties = (service.properties || []).map((property) => propertyCapability(service.iid, service.description, property));
        properties.push(...serviceProperties);

        for (const property of serviceProperties) {
            const legacy = {
                siid: property.siid,
                piid: property.piid,
                desc: property.desc,
                dtype: property.dtype,
                range: property.range,
                list: property.list,
            };
            if (property.access.includes('notify')) triggers.push({ ...legacy, type: 'prop' });
            if (property.access.includes('write')) actions.push({ ...legacy, type: 'prop' });
            if (property.access.includes('read')) readable.push({ ...legacy, unit: property.unit });
        }

        for (const event of service.events || []) {
            const argumentsList = (event.arguments || []).map((piid) => {
                const property = serviceProperties.find((candidate) => candidate.piid === piid);
                return property || {
                    siid: service.iid,
                    piid,
                    desc: `Property ${piid}`,
                    dtype: 'unknown',
                    access: [],
                };
            });
            const capability: MiotEventCapability = {
                siid: service.iid,
                eiid: event.iid,
                desc: `${service.description}-${event.description}`,
                arguments: argumentsList,
            };
            events.push(capability);
            triggers.push({
                siid: capability.siid,
                eiid: capability.eiid,
                desc: capability.desc,
                type: 'event',
                ...(capability.arguments.length > 0 ? { arguments: capability.arguments } : {}),
            });
        }

        for (const action of service.actions || []) {
            const inputs = (action.in || []).map((piid) => serviceProperties.find((property) => property.piid === piid) || {
                siid: service.iid,
                piid,
                desc: `Property ${piid}`,
                dtype: 'unknown',
                access: [],
            });
            const capability: MiotActionCapability = {
                siid: service.iid,
                aiid: action.iid,
                desc: `${service.description}-${action.description}`,
                in: inputs,
            };
            actionCapabilities.push(capability);
            actions.push({
                siid: capability.siid,
                aiid: capability.aiid,
                desc: capability.desc,
                type: 'action',
                in: capability.in,
            });
        }
    }

    return { properties, events, triggers, actions, readable };
}

// ==================== MIOT Spec 缓存 ====================

const MIOT_SPEC_TIMEOUT_MS = 10000;

/** 进程内缓存：按 URN 保存进行中的 Promise，并发调用共享同一次请求 */
const miotSpecCache = new Map<string, Promise<ReturnType<typeof normalizeMiotSpec>>>();

/**
 * 拉取并规范化 MIOT Spec。成功结果按 URN 缓存，失败会移除缓存以便重试。
 * 失败时抛出异常（调用方负责转换为工具错误）。
 */
export async function fetchMiotSpec(urn: string): Promise<ReturnType<typeof normalizeMiotSpec>> {
    const cached = miotSpecCache.get(urn);
    if (cached) return cached;
    const pending = (async () => {
        const response = await fetch(`https://miot-spec.org/miot-spec-v2/instance?type=${encodeURIComponent(urn)}`, {
            signal: AbortSignal.timeout(MIOT_SPEC_TIMEOUT_MS),
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return normalizeMiotSpec(await response.json() as MiotSpec);
    })();
    miotSpecCache.set(urn, pending);
    pending.catch(() => {
        if (miotSpecCache.get(urn) === pending) miotSpecCache.delete(urn);
    });
    return pending;
}

/** 清空 MIOT Spec 缓存（测试用） */
export function clearMiotSpecCache(): void {
    miotSpecCache.clear();
}

export async function getDevices(gateway: GatewayClient): Promise<ToolResponse<Device[]>> {
    try {
        const response = await gateway.callApi<DeviceListResponse>('getDevList', {}, 10000);
        const devList = response.devList || {};
        const devices: Device[] = Object.entries(devList).map(([did, device]) => ({
            did,
            name: device.name,
            modelName: device.modelName,
            online: device.online,
            roomName: device.roomName,
        }));
        return { success: true, data: devices };
    } catch (error) {
        return { success: false, error: `获取设备列表失败: ${error}` };
    }
}

export async function getDevice(gateway: GatewayClient, dids: string[]): Promise<ToolResponse<DeviceInfo[]>> {
    try {
        const response = await gateway.callApi<DeviceListResponse>('getDevList', {}, 10000);
        const devList = response.devList || {};

        // 不同 URN 并行拉取，相同 URN 只请求一次
        const urns = [...new Set(dids.map((did) => devList[did]?.urn).filter((urn): urn is string => Boolean(urn)))];
        type SpecResult = { spec: ReturnType<typeof normalizeMiotSpec> } | { error: string };
        const specResults = new Map<string, SpecResult>(await Promise.all(urns.map(async (urn): Promise<[string, SpecResult]> => {
            try {
                return [urn, { spec: await fetchMiotSpec(urn) }];
            } catch (e) {
                return [urn, { error: e instanceof Error && e.message.startsWith('HTTP ') ? e.message : String(e) }];
            }
        })));

        const results: DeviceInfo[] = [];
        for (const did of dids) {
            const device = devList[did];
            if (!device) {
                results.push({ did, found: false, name: '', model: '', modelName: '', online: false, roomName: '', urn: '' });
                continue;
            }

            const info: DeviceInfo = {
                did,
                found: true,
                name: device.name,
                model: device.model,
                modelName: device.modelName,
                online: device.online,
                roomName: device.roomName,
                urn: device.urn,
            };

            if (device.urn) {
                const spec = specResults.get(device.urn);
                if (spec && 'spec' in spec) Object.assign(info, structuredClone(spec.spec));
                else if (spec) info.specError = spec.error;
            }

            results.push(info);
        }

        return { success: true, data: results };
    } catch (error) {
        return { success: false, error: `获取设备信息失败: ${error}` };
    }
}
