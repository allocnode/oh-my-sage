/**
 * Core - 设备工具
 */

import { GatewayClient } from '../gateway/client';
import type { Device, DeviceInfo, DeviceListResponse } from '../types/device';
import type { ToolResponse, ToolResult } from '../types';

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
                        const specData = await specRes.json() as { services?: Array<{ iid: number; description: string; properties?: Array<{ iid: number; description: string; format: string; access?: string[]; 'value-range'?: unknown; 'value-list'?: unknown }>; events?: Array<{ iid: number; description: string; arguments?: number[] }>; actions?: Array<{ iid: number; description: string; in?: unknown[] }> }> };
                        const services = specData.services || [];

                        const triggers: DeviceInfo['triggers'] = [];
                        const actions: DeviceInfo['actions'] = [];
                        const readable: DeviceInfo['readable'] = [];

                        for (const s of services) {
                            for (const p of (s.properties || [])) {
                                const cap = {
                                    siid: s.iid,
                                    piid: p.iid,
                                    desc: `${s.description}-${p.description}`,
                                    dtype: p.format,
                                };
                                if (p.access?.includes('notify')) triggers.push({ ...cap, type: 'prop' as const });
                                if (p.access?.includes('write')) actions.push({ ...cap, type: 'prop' as const, range: p['value-range'], list: p['value-list'] });
                                if (p.access?.includes('read')) readable.push(cap);
                            }
                            for (const e of (s.events || [])) {
                                const properties = s.properties || [];
                                const args = (e.arguments || []).map((piid) => {
                                    const property = properties.find((p) => p.iid === piid);
                                    return {
                                        piid,
                                        desc: property?.description || `Property ${piid}`,
                                        dtype: property?.format || 'unknown',
                                        range: property?.['value-range'],
                                        list: property?.['value-list'],
                                    };
                                });
                                triggers.push({
                                    siid: s.iid,
                                    eiid: e.iid,
                                    desc: `${s.description}-${e.description}`,
                                    type: 'event' as const,
                                    ...(args.length > 0 ? { arguments: args } : {}),
                                });
                            }
                            for (const a of (s.actions || [])) {
                                actions.push({ siid: s.iid, aiid: a.iid, desc: `${s.description}-${a.description}`, type: 'action' as const, in: a.in });
                            }
                        }

                        info.triggers = triggers;
                        info.actions = actions;
                        info.readable = readable;
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
