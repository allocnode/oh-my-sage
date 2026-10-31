import { GatewayClient } from '../gateway/client';
import type { DeviceListResponse, MiotActionCapability, MiotEventCapability, MiotPropertyCapability } from '../types/device';
import type { Graph, GraphNode, ValidationError } from '../types/graph';
import type { Variable } from '../types';
import { fetchMiotSpec } from './device';
import { getDeviceListFor } from './gatewayCache';

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

interface VariableReference {
    node: GraphNode;
    id: string;
    scope: string;
    expectedType?: 'number' | 'string';
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

// 浮点步进取模带容差判断：JS 浮点精度下 (85 - 0) % 0.1 === 0.0999...，严格取模会把合法值误判为越界
function inRange(value: number, range: { min: number; max: number; step: number }): boolean {
    if (value < range.min || value > range.max) return false;
    const mod = (value - range.min) % range.step;
    return mod < 1e-6 || range.step - mod < 1e-6;
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
            else if (typeof value === 'number' && !inRange(value, property.range)) errors.push(error(node, 'range_value', `${property.desc} 值 ${value} 超出范围 ${JSON.stringify(property.range)}`));
        }
        if (typeof v1 === 'number' && typeof v2 === 'number' && v1 > v2) errors.push(error(node, 'range_order', `${property.desc} 的 v1 不能大于 v2`));
    }
    else if (!validScalar(v1, property.dtype)) errors.push(error(node, 'value_type', `${property.desc} 需要 ${property.dtype} 类型值`));
    return errors;
}

function validateActionInputValue(node: GraphNode, property: MiotPropertyCapability, value: unknown): ValidationError[] {
    if (!validScalar(value, property.dtype)) return [error(node, 'action_input_type', `${property.desc} 需要 ${property.dtype} 类型值`)];
    if (property.list && !property.list.some((item) => item.value === value)) {
        return [error(node, 'action_input_enum', `${property.desc} 不支持值 ${JSON.stringify(value)}；允许值 ${JSON.stringify(property.list.map((item) => item.value))}`)];
    }
    if (property.range && typeof value === 'number' && !inRange(value, property.range)) {
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
        if (typeof entry.id === 'string' && typeof entry.scope === 'string') {
            if (!graphDtypeMatches(property.dtype, entry.dtype, true)) errors.push(error(node, 'action_input_type', `${property.desc} 的 MIOT 类型为 ${property.dtype}，变量类型不兼容`));
            continue;
        }
        errors.push(...validateActionInputValue(node, property, entry.value));
    }
    for (const property of action.in) {
        if (!inputs.some((input) => input && typeof input === 'object' && (input as Record<string, unknown>).piid === property.piid)) {
            errors.push(error(node, 'missing_action_input', `${action.desc} 缺少输入 ${property.desc}`));
        }
    }
    return errors;
}

function variableReferences(nodes: GraphNode[]): VariableReference[] {
    const references: VariableReference[] = [];
    const add = (node: GraphNode, value: unknown, expectedType?: 'number' | 'string'): void => {
        if (!value || typeof value !== 'object') return;
        const ref = value as Record<string, unknown>;
        if (typeof ref.id === 'string' && typeof ref.scope === 'string') references.push({ node, id: ref.id, scope: ref.scope, expectedType });
    };

    for (const node of nodes) {
        const declaredType = node.props.varType === 'string' || node.props.dtype === 'string' ? 'string' : 'number';
        const resultType = node.type === 'varSetString' ? 'string' : ['varSetNumber', 'deviceInputSetVar', 'deviceGetSetVar', 'varChange', 'varGet'].includes(node.type) ? declaredType : undefined;
        if (resultType) add(node, node.props, resultType);
        if (node.type === 'deviceOutput' && typeof node.props.aiid !== 'number') {
            const dtype = node.props.dtype;
            add(node, node.props, dtype === 'string' ? 'string' : dtype === 'number' ? 'number' : undefined);
        }
        if (node.type === 'deviceOutput' && Array.isArray(node.props.ins)) for (const input of node.props.ins) {
            const dtype = input && typeof input === 'object' ? (input as Record<string, unknown>).dtype : undefined;
            add(node, input, dtype === 'string' ? 'string' : dtype === 'number' ? 'number' : undefined);
        }
        if (node.type === 'deviceInputSetVar' && Array.isArray(node.props.arguments)) for (const argument of node.props.arguments) {
            const dtype = argument && typeof argument === 'object' ? (argument as Record<string, unknown>).dtype : undefined;
            add(node, argument, dtype === 'string' ? 'string' : 'number');
        }
        if (Array.isArray(node.props.elements)) for (const element of node.props.elements) {
            if (element && typeof element === 'object' && (element as Record<string, unknown>).type === 'var') add(node, element, node.type === 'varSetNumber' ? 'number' : undefined);
        }
    }
    return references;
}

export function graphReferencesVariable(nodes: GraphNode[], id: string, scope: string): boolean {
    return variableReferences(nodes).some((reference) => reference.id === id && reference.scope === scope);
}

/** 变量校验选项 */
export interface VariableValidationOptions {
    /** 本规则变量声明（创建前尚未写入网关）；scope 为 "rule" 的引用只在这里解析 */
    ruleVariables?: Array<{ id: string; type: 'number' | 'string' }>;
}

export async function validateGraphVariablesWithGateway(gateway: GatewayClient, nodes: GraphNode[], options?: VariableValidationOptions): Promise<ValidationError[]> {
    const errors: ValidationError[] = [];
    const variablesByScope = new Map<string, Map<string, Variable>>();
    const ruleVariables = options?.ruleVariables ? new Map(options.ruleVariables.map((variable) => [variable.id, variable])) : undefined;
    const references = variableReferences(nodes);
    // 用到的作用域同时读取，而不是逐个排队
    const scopes = [...new Set(references.map((reference) => reference.scope).filter((scope) => scope !== 'rule'))];
    const scopeResults = await Promise.all(scopes.map(async (scope) => {
        try {
            const response = await gateway.callApi<Variable[] | Record<string, Variable>>('getVarList', { scope }, 10000);
            const entries = Array.isArray(response)
                ? response.flatMap((variable) => typeof variable.id === 'string' ? [[variable.id, variable] as const] : [])
                : Object.entries(response || {});
            return { scope, variables: new Map(entries) as Map<string, Variable> };
        } catch (cause) {
            return { scope, cause };
        }
    }));
    const failedScopes = new Map<string, unknown>();
    for (const result of scopeResults) {
        if ('variables' in result) variablesByScope.set(result.scope, result.variables!);
        else failedScopes.set(result.scope, result.cause);
    }
    for (const reference of references) {
        // 本规则变量：只对照声明，不访问网关
        if (reference.scope === 'rule') {
            const declared = ruleVariables?.get(reference.id);
            if (!ruleVariables || !declared) errors.push(error(reference.node, 'unknown_variable', `本规则变量 rule/${reference.id} 未声明；请在 variables 中声明`));
            else if (reference.expectedType && declared.type !== reference.expectedType) errors.push(error(reference.node, 'variable_type_mismatch', `变量 rule/${reference.id} 类型为 ${declared.type}，需要 ${reference.expectedType}`));
            continue;
        }
        if (failedScopes.has(reference.scope)) {
            errors.push(error(reference.node, 'variable_scope_unavailable', `无法读取变量作用域 ${reference.scope}: ${String(failedScopes.get(reference.scope))}`));
            failedScopes.delete(reference.scope);
            variablesByScope.set(reference.scope, new Map());
        }
        const variable = variablesByScope.get(reference.scope)!.get(reference.id);
        if (!variable) errors.push(error(reference.node, 'unknown_variable', `变量 ${reference.scope}/${reference.id} 不存在`));
        else if (reference.expectedType && variable.type !== reference.expectedType) errors.push(error(reference.node, 'variable_type_mismatch', `变量 ${reference.scope}/${reference.id} 类型为 ${String(variable.type)}，需要 ${reference.expectedType}`));
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
        if ((node.type === 'deviceInput' || node.type === 'deviceInputSetVar') && typeof props.eiid === 'number') {
            const event = device.events.find((item) => item.siid === siid && item.eiid === props.eiid);
            if (!event) { errors.push(error(node, 'unknown_event', `找不到事件 siid=${siid}, eiid=${String(props.eiid)}`)); continue; }
            if (node.type === 'deviceInputSetVar') {
                if (!Array.isArray(props.arguments)) { errors.push(error(node, 'missing_event_arguments', `${event.desc} 缺少事件参数赋值`)); continue; }
                const seenPiids = new Set<number>();
                for (const argument of props.arguments) {
                    if (!argument || typeof argument !== 'object') { errors.push(error(node, 'invalid_event_argument', `${event.desc} 的事件参数格式错误`)); continue; }
                    const entry = argument as Record<string, unknown>;
                    const property = typeof entry.piid === 'number' ? event.arguments.find((item) => item.piid === entry.piid) : undefined;
                    if (!property) { errors.push(error(node, 'unknown_event_argument', `${event.desc} 不支持参数 piid=${String(entry.piid)}`)); continue; }
                    if (seenPiids.has(property.piid)) { errors.push(error(node, 'duplicate_event_argument', `${event.desc} 的参数 piid=${property.piid} 重复赋值`)); continue; }
                    seenPiids.add(property.piid);
                    if (typeof entry.id !== 'string' || typeof entry.scope !== 'string') errors.push(error(node, 'missing_event_argument_variable', `${property.desc} 缺少变量 id 或 scope`));
                    if (!graphDtypeMatches(property.dtype, entry.dtype, true)) errors.push(error(node, 'event_argument_type', `${property.desc} 的 MIOT 类型为 ${property.dtype}，变量类型不兼容`));
                }
            }
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
        const hasDynamicReference = node.type === 'deviceOutput' && (props.id !== undefined || props.scope !== undefined || props.dtype !== undefined);
        const dynamicOutput = hasDynamicReference && typeof props.id === 'string' && typeof props.scope === 'string' && props.dtype !== undefined;
        const variableValue = setVar || dynamicOutput;
        if (props.dtype !== undefined && !graphDtypeMatches(property.dtype, props.dtype, variableValue)) errors.push(error(node, 'dtype_mismatch', `${property.desc} 的 MIOT 类型为 ${property.dtype}，节点类型应兼容 ${variableValue ? 'number' : property.dtype}`));
        if (node.type === 'deviceOutput') {
            if (hasDynamicReference && !dynamicOutput) {
                errors.push(error(node, 'incomplete_variable_reference', `${property.desc} 的动态变量引用必须同时提供 id、scope 和 dtype`));
                continue;
            }
            if (dynamicOutput) {
                if (property.range && (props.min !== property.range.min || props.max !== property.range.max || props.step !== property.range.step)) {
                    errors.push(error(node, 'range_mismatch', `${property.desc} 的动态变量范围应为 ${JSON.stringify(property.range)}`));
                }
            } else {
                errors.push(...validateActionInputValue(node, property, props.value));
            }
        }
        else if (!setVar) errors.push(...validateValue(node, property, props.operator, props.v1, props.v2));
    }
    return { valid: errors.length === 0, errors, warnings, inspectedDids: [...devices.keys()], inspectedUrns: [...new Set([...devices.values()].map((device) => device.urn))] };
}

export async function validateGraphCapabilitiesWithGateway(gateway: GatewayClient, graph: Graph, options?: VariableValidationOptions): Promise<CapabilityValidationReport> {
    const dids = [...new Set(graph.nodes.map((node) => node.props.did).filter((did): did is string => typeof did === 'string'))];
    // 变量校验只依赖网关变量表，与设备能力拉取互不依赖，同时开始
    const variableErrors = validateGraphVariablesWithGateway(gateway, graph.nodes, options);
    variableErrors.catch(() => undefined);
    const response: Pick<DeviceListResponse, 'devList'> = { devList: dids.length > 0 ? await getDeviceListFor(gateway, dids) : {} };
    const specs = new Map<string, DeviceCapabilities>();
    const specErrors = new Map<string, unknown>();
    const errors: ValidationError[] = [];
    // 不同 URN 并行拉取（fetchMiotSpec 自带缓存与超时）
    const urns = [...new Set(dids.map((did) => response.devList?.[did]?.urn).filter((urn): urn is string => Boolean(urn)))];
    await Promise.all(urns.map(async (urn) => {
        try {
            const normalized = await fetchMiotSpec(urn);
            specs.set(urn, { urn, properties: normalized.properties || [], events: normalized.events || [], actions: (normalized.actions || []).flatMap((action) => action.type === 'action' && typeof action.aiid === 'number' ? [{ siid: action.siid, aiid: action.aiid, desc: action.desc, in: action.in || [] }] : []) });
        } catch (cause) {
            specErrors.set(urn, cause);
        }
    }));
    for (const did of dids) {
        const device = response.devList?.[did];
        if (!device?.urn) { errors.push({ nodeId: '(graph)', type: 'unknown_device', level: 'error', message: `设备 ${did} 缺少本地 URN` }); continue; }
        if (specErrors.has(device.urn)) {
            errors.push({ nodeId: '(graph)', type: 'spec_unavailable', level: 'error', message: `无法读取 ${device.urn} 的 MIOT Spec: ${String(specErrors.get(device.urn))}` });
        }
    }
    const devices = new Map<string, DeviceCapabilities>();
    for (const did of dids) {
        const device = response.devList?.[did];
        if (device?.urn && specs.has(device.urn)) devices.set(did, specs.get(device.urn)!);
    }
    const report = validateGraphCapabilities(graph.nodes, devices);
    report.errors.push(...await variableErrors);
    report.errors.unshift(...errors);
    report.valid = report.errors.length === 0;
    return report;
}
