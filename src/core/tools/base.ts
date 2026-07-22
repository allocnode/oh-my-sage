/**
 * Core - 基础工具函数
 * 包含校验和布局等辅助函数
 */

import type { Graph, GraphNode, ValidationError } from '../types/graph';

const STATE_NODE_TYPES = new Set([
    'timeRange', 'alarmClock', 'onLoad', 'deviceInputSetVar', 'varChange',
]);

const DUAL_OUTPUT_TYPES = new Set(['deviceGet', 'varGet']);

const STATE_CONDITION_INPUT_TYPES = new Set(['condition', 'logicOr', 'logicAnd', 'logicNot']);

function targetInfo(target: string): { id: string; port: string } | null {
    const dotIdx = target.lastIndexOf('.');
    if (dotIdx === -1) return null;
    return { id: target.substring(0, dotIdx), port: target.substring(dotIdx + 1) };
}

function isDeclaredConditionInput(node: GraphNode, port: string): boolean {
    if (!Object.prototype.hasOwnProperty.call(node.inputs || {}, port)) return false;
    if (node.type === 'condition') return port === 'condition';
    if (node.type === 'logicNot') return port === 'input';
    return (node.type === 'logicOr' || node.type === 'logicAnd') && /^input\d+$/.test(port);
}

function reachesConditionInput(nodeId: string, nodeMap: Map<string, GraphNode>, visited: Set<string>): boolean {
    if (visited.has(nodeId)) return false;
    visited.add(nodeId);

    const node = nodeMap.get(nodeId);
    if (!node) return false;

    for (const target of node.outputs?.output || []) {
        const info = targetInfo(target);
        if (!info) continue;
        const targetNode = nodeMap.get(info.id);
        if (!targetNode || !isDeclaredConditionInput(targetNode, info.port)) continue;
        if (targetNode.type === 'condition') return true;
        if (reachesConditionInput(targetNode.id, nodeMap, new Set(visited))) return true;
    }

    return false;
}

function canAcceptStateCondition(target: string, nodeMap: Map<string, GraphNode>): boolean {
    const info = targetInfo(target);
    if (!info) return false;

    const targetNode = nodeMap.get(info.id);
    if (!targetNode || !STATE_CONDITION_INPUT_TYPES.has(targetNode.type)) return false;
    if (!isDeclaredConditionInput(targetNode, info.port)) return false;

    return targetNode.type === 'condition' || reachesConditionInput(targetNode.id, nodeMap, new Set());
}

export function validateGraph(graph: Graph): ValidationError[] {
    const errors: ValidationError[] = [];
    const nodeMap = new Map<string, GraphNode>();

    for (const node of graph.nodes) {
        if (nodeMap.has(node.id)) {
            errors.push({ nodeId: node.id, type: 'duplicate_id', level: 'error', message: `节点 ID "${node.id}" 重复` });
        }
        nodeMap.set(node.id, node);
    }

    const incoming = new Map<string, Set<string>>();
    for (const node of graph.nodes) {
        if (!node.outputs) continue;
        for (const portName of Object.keys(node.outputs)) {
            const targets = node.outputs[portName];
            if (!Array.isArray(targets)) continue;
            for (const target of targets) {
                const srcDesc = `${node.id}.${portName} → ${target}`;
                const dotIdx = target.lastIndexOf('.');
                if (dotIdx === -1) {
                    errors.push({ nodeId: node.id, type: 'invalid_format', level: 'error', message: `outputs.${portName} 中 "${target}" 缺少 "." 分隔符` });
                    continue;
                }
                const targetId = target.substring(0, dotIdx);
                const targetPort = target.substring(dotIdx + 1);
                if (!nodeMap.has(targetId)) {
                    errors.push({ nodeId: node.id, type: 'target_not_found', level: 'error', message: `outputs.${portName} 引用不存在的节点 "${targetId}"` });
                    continue;
                }
                const key = `${targetId}.${targetPort}`;
                if (!incoming.has(key)) incoming.set(key, new Set());
                incoming.get(key)!.add(srcDesc);
            }
        }
    }

    for (const node of graph.nodes) {
        if (!node.id || !/^[0-9a-zA-Z]+$/.test(node.id)) {
            const level = !node.id ? 'error' : (node.id.includes('_') ? 'warn' : 'error');
            errors.push({ nodeId: node.id || '(empty)', type: 'invalid_id', level, message: `节点 ID 包含非 [0-9a-zA-Z] 字符（网关可能接受，但建议避免）` });
        }
        if (!node.type) {
            errors.push({ nodeId: node.id, type: 'missing_type', level: 'error', message: '缺少 type' });
            continue;
        }
        if (!node.props || typeof node.props !== 'object') {
            errors.push({ nodeId: node.id, type: 'missing_props', level: 'error', message: 'props 缺失（必须为 {}）' });
        }
        if (!node.inputs || typeof node.inputs !== 'object') {
            errors.push({ nodeId: node.id, type: 'missing_inputs', level: 'error', message: 'inputs 缺失' });
        }
        if (!node.outputs || typeof node.outputs !== 'object') {
            errors.push({ nodeId: node.id, type: 'missing_outputs', level: 'error', message: 'outputs 缺失' });
        } else {
            for (const [, v] of Object.entries(node.outputs)) {
                if (!Array.isArray(v)) {
                    errors.push({ nodeId: node.id, type: 'invalid_output', level: 'error', message: `outputs 必须是数组` });
                }
            }
        }

        if (STATE_NODE_TYPES.has(node.type) && Object.keys(node.inputs || {}).length > 0) {
            errors.push({ nodeId: node.id, type: 'state_has_inputs', level: 'error', message: `${node.type} 是 state 节点，inputs 必须为 {}` });
        }

        if (node.type === 'loop') {
            const ik = Object.keys(node.inputs || {});
            if (!ik.includes('start') || !ik.includes('stop')) {
                errors.push({ nodeId: node.id, type: 'loop_wrong_inputs', level: 'error', message: `loop inputs 必须含 start 和 stop，当前 [${ik.join(', ')}]` });
            }
        }

        if (node.type === 'condition') {
            if (!incoming.has(`${node.id}.trigger`) || incoming.get(`${node.id}.trigger`)!.size === 0) {
                errors.push({ nodeId: node.id, type: 'cond_no_trigger', level: 'error', message: `condition "${node.id}" trigger 无信号来源` });
            }
            if (!incoming.has(`${node.id}.condition`) || incoming.get(`${node.id}.condition`)!.size === 0) {
                errors.push({
                    nodeId: node.id,
                    type: 'cond_no_condition',
                    level: 'error',
                    message: `condition "${node.id}" condition 无信号来源（需 state 节点 output 连接，如 timeRange.output）`
                });
            }
        }

        if (DUAL_OUTPUT_TYPES.has(node.type)) {
            const o = node.outputs || {};
            if (!('output' in o)) errors.push({ nodeId: node.id, type: 'missing_output', level: 'error', message: `${node.type} 必须声明 outputs.output` });
            if (!('output2' in o)) errors.push({ nodeId: node.id, type: 'missing_output2', level: 'error', message: `${node.type} 必须声明 outputs.output2` });
        }

        if (node.type === 'deviceGetSetVar' && !('output' in (node.outputs || {}))) {
            errors.push({ nodeId: node.id, type: 'missing_output', level: 'error', message: 'deviceGetSetVar 必须声明 outputs.output' });
        }

        if (node.type === 'delay' && !('input' in (node.inputs || {}))) {
            errors.push({ nodeId: node.id, type: 'delay_wrong_input', level: 'error', message: 'delay inputs 必须用 "input"，不是 "trigger"' });
        }

        if (node.type === 'timeRange') {
            if ('output2' in (node.outputs || {})) {
                errors.push({ nodeId: node.id, type: 'tr_has_output2', level: 'error', message: 'timeRange 只有 output，没有 output2' });
            }
            for (const t of node.outputs?.output || []) {
                if (!canAcceptStateCondition(t, nodeMap)) {
                    errors.push({ nodeId: node.id, type: 'tr_wrong_target', level: 'error', message: `timeRange.output 只能连 condition.condition 或 logicOr/logicAnd/logicNot 的条件输入，当前连到 "${t}"` });
                }
            }
        }

        if (DUAL_OUTPUT_TYPES.has(node.type)) {
            for (const t of node.outputs?.output2 || []) {
                const tid = t.substring(0, t.lastIndexOf('.'));
                const tn = nodeMap.get(tid);
                if (tn && STATE_NODE_TYPES.has(tn.type)) {
                    errors.push({ nodeId: node.id, type: 'output2_to_state', level: 'error', message: `${node.type}.output2 不应连 state 节点 "${tid}" (${tn.type})` });
                }
            }
        }

        if ((node.type === 'deviceInputSetVar' || node.type === 'deviceGetSetVar') && ((node.props as Record<string, unknown>)?.dtype === 'int' || (node.props as Record<string, unknown>)?.dtype === 'float')) {
            errors.push({ nodeId: node.id, type: 'var_dtype', level: 'warn', message: `${node.type} dtype 应为 "number"，当前 "${(node.props as Record<string, unknown>).dtype}"` });
        }
    }

    incoming.forEach((sources, key) => {
        const nid = key.substring(0, key.indexOf('.'));
        const n = nodeMap.get(nid);
        if (n && STATE_NODE_TYPES.has(n.type)) {
            sources.forEach((s) => {
                errors.push({ nodeId: nid, type: 'state_has_incoming', level: 'error', message: `state 节点 "${nid}" (${n.type}) 不应被触发，收到连接: ${s}` });
            });
        }
    });

    errors.sort((a, b) => (a.level === b.level ? 0 : a.level === 'error' ? -1 : 1));
    return errors;
}

export function layoutNodes(nodes: GraphNode[]): void {
    const NODE_WIDTH = 528;
    const NODE_HEIGHT = 164;
    const H_SPACING = 150;
    const V_SPACING = 80;
    const START_X = 100;
    const START_Y = 100;

    const nodeMap = new Map<string, GraphNode>();
    for (const node of nodes) {
        nodeMap.set(node.id, node);
    }

    const children = new Map<string, string[]>();
    const inDegree = new Map<string, number>();
    const parentOf = new Map<string, string>();

    for (const node of nodes) {
        children.set(node.id, []);
        inDegree.set(node.id, 0);
    }

    for (const node of nodes) {
        const outputs = node.outputs || {};
        for (const [, targets] of Object.entries(outputs)) {
            if (!Array.isArray(targets)) continue;
            for (const target of targets) {
                if (typeof target !== 'string') continue;
                const targetId = target.split('.')[0];
                if (nodeMap.has(targetId)) {
                    children.get(node.id)!.push(targetId);
                    inDegree.set(targetId, (inDegree.get(targetId) || 0) + 1);
                    parentOf.set(targetId, node.id);
                }
            }
        }
    }

    const levels = new Map<string, number>();
    const queue: string[] = [];

    for (const node of nodes) {
        if (inDegree.get(node.id) === 0) {
            queue.push(node.id);
            levels.set(node.id, 0);
        }
    }

    while (queue.length > 0) {
        const current = queue.shift()!;
        const currentLevel = levels.get(current)!;
        for (const child of children.get(current) || []) {
            const childLevel = levels.get(child);
            if (childLevel === undefined || childLevel < currentLevel + 1) {
                levels.set(child, currentLevel + 1);
            }
            inDegree.set(child, inDegree.get(child)! - 1);
            if (inDegree.get(child) === 0) {
                queue.push(child);
            }
        }
    }

    for (const node of nodes) {
        if (!levels.has(node.id)) {
            levels.set(node.id, 0);
        }
    }

    const levelGroups = new Map<number, string[]>();
    for (const [nodeId, level] of levels) {
        if (!levelGroups.has(level)) {
            levelGroups.set(level, []);
        }
        levelGroups.get(level)!.push(nodeId);
    }

    const positions = new Map<string, { x: number; y: number }>();

    for (const [level, nodeIds] of levelGroups) {
        nodeIds.sort((a, b) => {
            const parentA = parentOf.get(a);
            const parentB = parentOf.get(b);
            if (parentA === parentB) return 0;
            if (!parentA) return -1;
            if (!parentB) return 1;
            return nodeIds.indexOf(parentA) - nodeIds.indexOf(parentB);
        });

        const x = START_X + level * (NODE_WIDTH + H_SPACING);
        const totalHeight = nodeIds.length * (NODE_HEIGHT + V_SPACING) - V_SPACING;
        const startY = START_Y + ((levelGroups.get(0)?.length || 1) * (NODE_HEIGHT + V_SPACING) - totalHeight) / 2;

        for (let i = 0; i < nodeIds.length; i++) {
            const y = startY + i * (NODE_HEIGHT + V_SPACING);
            positions.set(nodeIds[i], { x, y });
        }
    }

    for (const node of nodes) {
        const pos = positions.get(node.id);
        if (pos) {
            node.cfg = node.cfg || {};
            (node.cfg as Record<string, unknown>).pos = {
                x: Math.round(pos.x),
                y: Math.round(pos.y),
                width: NODE_WIDTH,
                height: NODE_HEIGHT,
            };
        }
    }
}
