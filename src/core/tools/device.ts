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

        const results: DeviceInfo[] = [];
        for (const did of dids) {
            const device = devList[did];
            if (!device) {
                results.push({ did, name: '', model: '', modelName: '', online: false, roomName: '', urn: '' });
                continue;
            }

            const info: DeviceInfo = {
                did,
                name: device.name,
                model: device.model,
                modelName: device.modelName,
                online: device.online,
                roomName: device.roomName,
                urn: device.urn,
            };

            if (device.urn) {
                try {
                    const specUrl = `https://miot-spec.org/miot-spec-v2/instance?type=${encodeURIComponent(device.urn)}`;
                    const specRes = await fetch(specUrl);
                    if (specRes.ok) {
                        Object.assign(info, normalizeMiotSpec(await specRes.json() as MiotSpec));
                    } else {
                        info.specError = `HTTP ${specRes.status}`;
                    }
                } catch (e) {
                    info.specError = String(e);
                }
            }

            results.push(info);
        }

        return { success: true, data: results };
    } catch (error) {
        return { success: false, error: `获取设备信息失败: ${error}` };
    }
}
