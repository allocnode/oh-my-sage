import { GatewayClient } from '../gateway/client';
import type { DeviceListResponse, MiotActionCapability, MiotEventCapability, MiotPropertyCapability } from '../types/device';
import type { Graph, GraphNode, ValidationError } from '../types/graph';
import { normalizeMiotSpec } from './device';

export interface DeviceCapabilities {
    urn: string;
    properties: MiotPropertyCapability[];
    events: MiotEventCapability[];
    actions: MiotActionCapability[];
}

export interface CapabilityValidationReport {
    valid: boolean;
    errors: ValidationError[];
    warnings: ValidationError[];
    inspectedDids: string[];
    inspectedUrns: string[];
}

function error(node: GraphNode, type: string, message: string): ValidationError {
    return { nodeId: node.id, type, level: 'error', message };
}

function graphDtypeMatches(miot: string, graph: unknown, setVar: boolean): boolean {
    if (setVar && graph === 'number') return /^(u?int\d*|float)$/.test(miot);
    if (/^u?int\d*$/.test(miot)) return graph === 'int';
    if (miot === 'bool') return graph === 'boolean';
    return graph === miot;
}

function validScalar(value: unknown, dtype: string): boolean {
    if (dtype === 'string') return typeof value === 'string';
    if (dtype === 'bool') return typeof value === 'boolean';
    if (typeof value !== 'number' || !Number.isFinite(value)) return false;
    return !/^u?int\d*$/.test(dtype) || Number.isInteger(value);
}

function validateValue(node: GraphNode, property: MiotPropertyCapability, operator: unknown, v1: unknown, v2?: unknown): ValidationError[] {
    const errors: ValidationError[] = [];
    if (property.list) {
        if (operator !== 'include' || !Array.isArray(v1)) {
            return [error(node, 'enum_filter', `${property.desc} 是枚举字段，必须使用 operator="include" 和数组 v1；允许值 ${JSON.stringify(property.list.map((item) => item.value))}`)];
        }
        for (const value of v1) {
            if (!validScalar(value, property.dtype) || !property.list.some((item) => item.value === value)) {
                errors.push(error(node, 'enum_value', `${property.desc} 不支持值 ${JSON.stringify(value)}；允许值 ${JSON.stringify(property.list.map((item) => item.value))}`));
            }
        }
        return errors;
    }
    if (property.range) {
        const values = operator === 'between' ? [v1, v2] : [v1];
        if (operator === 'between' && v2 === undefined) errors.push(error(node, 'range_between', `${property.desc} 使用 between 时必须提供 v2`));
        for (const value of values) {
            if (!validScalar(value, property.dtype)) errors.push(error(node, 'value_type', `${property.desc} 需要 ${property.dtype} 类型值`));
            else if (typeof value === 'number' && (value < property.range.min || value > property.range.max || ((value - property.range.min) % property.range.step !== 0))) errors.push(error(node, 'range_value', `${property.desc} 值 ${value} 超出范围 ${JSON.stringify(property.range)}`));
        }
        if (typeof v1 === 'number' && typeof v2 === 'number' && v1 > v2) errors.push(error(node, 'range_order', `${property.desc} 的 v1 不能大于 v2`));
    }
    return errors;
}

function validateActionInputValue(node: GraphNode, property: MiotPropertyCapability, value: unknown): ValidationError[] {
    if (!validScalar(value, property.dtype)) return [error(node, 'action_input_type', `${property.desc} 需要 ${property.dtype} 类型值`)];
    if (property.list && !property.list.some((item) => item.value === value)) {
        return [error(node, 'action_input_enum', `${property.desc} 不支持值 ${JSON.stringify(value)}；允许值 ${JSON.stringify(property.list.map((item) => item.value))}`)];
    }
    if (property.range && typeof value === 'number' && (value < property.range.min || value > property.range.max || ((value - property.range.min) % property.range.step !== 0))) {
        return [error(node, 'action_input_range', `${property.desc} 值 ${value} 超出范围 ${JSON.stringify(property.range)}`)];
    }
    return [];
}

function validateAction(node: GraphNode, device: DeviceCapabilities): ValidationError[] {
    const siid = node.props.siid;
    const aiid = node.props.aiid;
    if (typeof siid !== 'number' || typeof aiid !== 'number') return [error(node, 'missing_action', '动作节点缺少 siid 或 aiid')];
    const action = device.actions.find((item) => item.siid === siid && item.aiid === aiid);
    if (!action) return [error(node, 'unknown_action', `找不到动作 siid=${siid}, aiid=${aiid}`)];
    const inputs = node.props.ins;
    if (!Array.isArray(inputs)) return action.in.length ? [error(node, 'missing_action_input', `${action.desc} 需要输入参数`)] : [];

    const errors: ValidationError[] = [];
    for (const input of inputs) {
        if (!input || typeof input !== 'object') { errors.push(error(node, 'invalid_action_input', `${action.desc} 的输入参数格式错误`)); continue; }
        const entry = input as Record<string, unknown>;
        const property = typeof entry.piid === 'number' ? action.in.find((item) => item.piid === entry.piid) : undefined;
        if (!property) { errors.push(error(node, 'unknown_action_input', `${action.desc} 不支持输入 piid=${String(entry.piid)}`)); continue; }
        errors.push(...validateActionInputValue(node, property, entry.value));
    }
    for (const property of action.in) {
        if (!inputs.some((input) => input && typeof input === 'object' && (input as Record<string, unknown>).piid === property.piid)) {
            errors.push(error(node, 'missing_action_input', `${action.desc} 缺少输入 ${property.desc}`));
        }
    }
    return errors;
}

export function validateGraphCapabilities(nodes: GraphNode[], devices: Map<string, DeviceCapabilities>): CapabilityValidationReport {
    const errors: ValidationError[] = [];
    const warnings: ValidationError[] = [];
    for (const node of nodes) {
        if (!['deviceInput', 'deviceGet', 'deviceOutput', 'deviceInputSetVar', 'deviceGetSetVar'].includes(node.type)) continue;
        const props = node.props;
        const did = props.did;
        if (typeof did !== 'string' || !devices.has(did)) { errors.push(error(node, 'unknown_device', `找不到设备 ${String(did)}`)); continue; }
        const device = devices.get(did)!;
        if (node.cfg.urn !== device.urn) { errors.push(error(node, 'urn_mismatch', `节点 URN 与设备 ${did} 的 URN 不一致`)); continue; }
        const siid = props.siid;
        if (typeof siid !== 'number') { errors.push(error(node, 'missing_siid', '缺少 siid')); continue; }
        if (node.type === 'deviceInput' && typeof props.eiid === 'number') {
            const event = device.events.find((item) => item.siid === siid && item.eiid === props.eiid);
            if (!event) errors.push(error(node, 'unknown_event', `找不到事件 siid=${siid}, eiid=${String(props.eiid)}`));
            continue;
        }
        if (node.type === 'deviceOutput' && typeof props.aiid === 'number') {
            errors.push(...validateAction(node, device));
            continue;
        }
        const piid = props.piid;
        const property = typeof piid === 'number' ? device.properties.find((item) => item.siid === siid && item.piid === piid) : undefined;
        if (!property) { errors.push(error(node, 'unknown_property', `找不到属性 siid=${siid}, piid=${String(piid)}`)); continue; }
        const requiredAccess = node.type === 'deviceInput' || node.type === 'deviceInputSetVar' ? 'notify' : node.type === 'deviceGet' || node.type === 'deviceGetSetVar' ? 'read' : 'write';
        if (!property.access.includes(requiredAccess)) errors.push(error(node, 'access_denied', `${property.desc} 不支持 ${requiredAccess}`));
        const setVar = node.type === 'deviceInputSetVar' || node.type === 'deviceGetSetVar';
        if (props.dtype !== undefined && !graphDtypeMatches(property.dtype, props.dtype, setVar)) errors.push(error(node, 'dtype_mismatch', `${property.desc} 的 MIOT 类型为 ${property.dtype}，节点类型应兼容 ${setVar ? 'number' : property.dtype}`));
        if (node.type === 'deviceOutput') errors.push(...validateValue(node, property, '=', props.value));
        else if (!setVar) errors.push(...validateValue(node, property, props.operator, props.v1, props.v2));
    }
    return { valid: errors.length === 0, errors, warnings, inspectedDids: [...devices.keys()], inspectedUrns: [...new Set([...devices.values()].map((device) => device.urn))] };
}

export async function validateGraphCapabilitiesWithGateway(gateway: GatewayClient, graph: Graph): Promise<CapabilityValidationReport> {
    const response = await gateway.callApi<DeviceListResponse>('getDevList', {}, 10000);
    const dids = [...new Set(graph.nodes.map((node) => node.props.did).filter((did): did is string => typeof did === 'string'))];
    const specs = new Map<string, DeviceCapabilities>();
    const errors: ValidationError[] = [];
    for (const did of dids) {
        const device = response.devList?.[did];
        if (!device?.urn) { errors.push({ nodeId: '(graph)', type: 'unknown_device', level: 'error', message: `设备 ${did} 缺少本地 URN` }); continue; }
        if (!specs.has(device.urn)) {
            try {
                const result = await fetch(`https://miot-spec.org/miot-spec-v2/instance?type=${encodeURIComponent(device.urn)}`);
                if (!result.ok) throw new Error(`HTTP ${result.status}`);
                const normalized = normalizeMiotSpec(await result.json() as { services?: Array<never> });
                specs.set(device.urn, { urn: device.urn, properties: normalized.properties || [], events: normalized.events || [], actions: (normalized.actions || []).flatMap((action) => action.type === 'action' && typeof action.aiid === 'number' ? [{ siid: action.siid, aiid: action.aiid, desc: action.desc, in: action.in || [] }] : []) });
            } catch (cause) {
                errors.push({ nodeId: '(graph)', type: 'spec_unavailable', level: 'error', message: `无法读取 ${device.urn} 的 MIOT Spec: ${String(cause)}` });
            }
        }
    }
    const devices = new Map<string, DeviceCapabilities>();
    for (const did of dids) {
        const device = response.devList?.[did];
        if (device?.urn && specs.has(device.urn)) devices.set(did, specs.get(device.urn)!);
    }
    const report = validateGraphCapabilities(graph.nodes, devices);
    report.errors.unshift(...errors);
    report.valid = report.errors.length === 0;
    return report;
}
