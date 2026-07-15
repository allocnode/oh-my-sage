/**
 * Core - 设备类型定义
 */

/** 设备信息 */
export interface Device {
    did: string;
    name: string;
    modelName: string;
    online: boolean;
    roomName: string;
}

/** 设备详情信息 */
export interface DeviceInfo {
    did: string;
    name: string;
    model: string;
    modelName: string;
    online: boolean;
    roomName: string;
    urn: string;
    triggers?: Array<{
        siid: number;
        piid?: number;
        eiid?: number;
        desc: string;
        dtype?: string;
        type: 'prop' | 'event';
        range?: unknown;
        list?: unknown;
        arguments?: Array<{
            piid: number;
            desc: string;
            dtype: string;
            range?: unknown;
            list?: unknown;
        }>;
    }>;
    actions?: Array<{
        siid: number;
        piid?: number;
        aiid?: number;
        desc: string;
        dtype?: string;
        type: 'prop' | 'action';
        range?: unknown;
        list?: unknown;
        in?: unknown[];
    }>;
    readable?: Array<{
        siid: number;
        piid: number;
        desc: string;
        dtype?: string;
    }>;
    specError?: string;
}

/** 设备列表响应 */
export interface DeviceListResponse {
    devList: Record<string, {
        name: string;
        model: string;
        modelName: string;
        online: boolean;
        roomName: string;
        urn: string;
    }>;
}
