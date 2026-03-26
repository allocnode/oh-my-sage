/**
 * 规则连接完整性校验器
 *
 * 网关 setGraph 只校验节点级别结构（字段类型、必填字段），
 * 不校验连接级别的逻辑完整性。本校验器在调用 setGraph 前运行。
 *
 * CLI 用法: npx tsx src/server/validator/graph-validator.ts <graph-json-file>
 * 代码用法: import { validateGraph } from './server/validator/graph-validator';
 */

export interface GraphNode {
    id: string;
    type: string;
    cfg: Record<string, any>;
    props: Record<string, any>;
    inputs: Record<string, any>;
    outputs: Record<string, string[]>;
}

export interface Graph {
    id: string;
    nodes: GraphNode[];
    cfg: Record<string, any>;
}

export interface ValidationError {
    nodeId: string;
    type: string;
    level: 'error' | 'warn';
    message: string;
}

const STATE_NODE_TYPES = new Set([
    'timeRange', 'alarmClock', 'onLoad', 'deviceInputSetVar', 'varChange',
]);

const DUAL_OUTPUT_TYPES = new Set(['deviceGet', 'varGet', 'deviceGetSetVar']);

export function validateGraph(graph: Graph): ValidationError[] {
    const errors: ValidationError[] = [];
    const nodeMap = new Map<string, GraphNode>();

    for (const node of graph.nodes) {
        if (nodeMap.has(node.id)) {
            errors.push({nodeId: node.id, type: 'duplicate_id', level: 'error', message: `节点 ID "${node.id}" 重复`});
        }
        nodeMap.set(node.id, node);
    }

    // 收集入站连接: "nodeId.portName" → Set<"source.outputName → target">
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
                    errors.push({nodeId: node.id, type: 'invalid_format', level: 'error', message: `outputs.${portName} 中 "${target}" 缺少 "." 分隔符`});
                    continue;
                }
                const targetId = target.substring(0, dotIdx);
                const targetPort = target.substring(dotIdx + 1);
                if (!nodeMap.has(targetId)) {
                    errors.push({nodeId: node.id, type: 'target_not_found', level: 'error', message: `outputs.${portName} 引用不存在的节点 "${targetId}"`});
                    continue;
                }
                const key = `${targetId}.${targetPort}`;
                if (!incoming.has(key)) incoming.set(key, new Set());
                incoming.get(key)!.add(srcDesc);
            }
        }
    }

    for (const node of graph.nodes) {
        // 结构校验
        if (!node.id || !/^[0-9a-zA-Z]+$/.test(node.id)) {
            // 网关实际允许下划线，SKILL.md 文档说不允许。降级为 warn
            const level = !node.id ? 'error' : (node.id.includes('_') ? 'warn' : 'error');
            errors.push({nodeId: node.id || '(empty)', type: 'invalid_id', level, message: `节点 ID 包含非 [0-9a-zA-Z] 字符（网关可能接受，但建议避免）`});
        }
        if (!node.type) {
            errors.push({nodeId: node.id, type: 'missing_type', level: 'error', message: '缺少 type'});
            continue;
        }
        if (!node.props || typeof node.props !== 'object') {
            errors.push({nodeId: node.id, type: 'missing_props', level: 'error', message: 'props 缺失（必须为 {}）'});
        }
        if (!node.inputs || typeof node.inputs !== 'object') {
            errors.push({nodeId: node.id, type: 'missing_inputs', level: 'error', message: 'inputs 缺失'});
        }
        if (!node.outputs || typeof node.outputs !== 'object') {
            errors.push({nodeId: node.id, type: 'missing_outputs', level: 'error', message: 'outputs 缺失'});
        } else {
            for (const [p, v] of Object.entries(node.outputs)) {
                if (!Array.isArray(v)) {
                    errors.push({nodeId: node.id, type: 'invalid_output', level: 'error', message: `outputs.${p} 必须是数组`});
                }
            }
        }

        // state 节点
        if (STATE_NODE_TYPES.has(node.type) && Object.keys(node.inputs || {}).length > 0) {
            errors.push({nodeId: node.id, type: 'state_has_inputs', level: 'error', message: `${node.type} 是 state 节点，inputs 必须为 {}`});
        }

        // loop
        if (node.type === 'loop') {
            const ik = Object.keys(node.inputs || {});
            if (!ik.includes('start') || !ik.includes('stop')) {
                errors.push({nodeId: node.id, type: 'loop_wrong_inputs', level: 'error', message: `loop inputs 必须含 start 和 stop，当前 [${ik.join(', ')}]`});
            }
        }

        // condition: trigger + condition 都必须有来源
        if (node.type === 'condition') {
            if (!incoming.has(`${node.id}.trigger`) || incoming.get(`${node.id}.trigger`)!.size === 0) {
                errors.push({nodeId: node.id, type: 'cond_no_trigger', level: 'error', message: `condition "${node.id}" trigger 无信号来源`});
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

        // deviceGet/varGet: 必须有 output 和 output2
        if (DUAL_OUTPUT_TYPES.has(node.type)) {
            const o = node.outputs || {};
            if (!('output' in o)) errors.push({nodeId: node.id, type: 'missing_output', level: 'error', message: `${node.type} 必须声明 outputs.output`});
            if (!('output2' in o)) errors.push({nodeId: node.id, type: 'missing_output2', level: 'error', message: `${node.type} 必须声明 outputs.output2`});
        }

        // delay: inputs 必须用 input
        if (node.type === 'delay' && !('input' in (node.inputs || {}))) {
            errors.push({nodeId: node.id, type: 'delay_wrong_input', level: 'error', message: 'delay inputs 必须用 "input"，不是 "trigger"'});
        }

        // timeRange: output 只能连 condition.condition
        if (node.type === 'timeRange') {
            if ('output2' in (node.outputs || {})) {
                errors.push({nodeId: node.id, type: 'tr_has_output2', level: 'error', message: 'timeRange 只有 output，没有 output2'});
            }
            for (const t of node.outputs?.output || []) {
                const port = t.substring(t.lastIndexOf('.') + 1);
                if (port !== 'condition') {
                    errors.push({nodeId: node.id, type: 'tr_wrong_target', level: 'error', message: `timeRange.output 只能连 condition.condition，当前连到 "${t}"`});
                }
            }
        }

        // deviceGet.output2 不应连 state 节点
        if (DUAL_OUTPUT_TYPES.has(node.type)) {
            for (const t of node.outputs?.output2 || []) {
                const tid = t.substring(0, t.lastIndexOf('.'));
                const tn = nodeMap.get(tid);
                if (tn && STATE_NODE_TYPES.has(tn.type)) {
                    errors.push({nodeId: node.id, type: 'output2_to_state', level: 'error', message: `${node.type}.output2 不应连 state 节点 "${tid}" (${tn.type})`});
                }
            }
        }

        // 变量类 dtype 检查
        if ((node.type === 'deviceInputSetVar' || node.type === 'deviceGetSetVar') && (node.props?.dtype === 'int' || node.props?.dtype === 'float')) {
            errors.push({nodeId: node.id, type: 'var_dtype', level: 'warn', message: `${node.type} dtype 应为 "number"，当前 "${node.props.dtype}"`});
        }
    }

    // 全局: state 节点不应被任何 output 连接
    incoming.forEach((sources, key) => {
        const nid = key.substring(0, key.indexOf('.'));
        const n = nodeMap.get(nid);
        if (n && STATE_NODE_TYPES.has(n.type)) {
            sources.forEach((s) => {
                errors.push({nodeId: nid, type: 'state_has_incoming', level: 'error', message: `state 节点 "${nid}" (${n.type}) 不应被触发，收到连接: ${s}`});
            });
        }
    });

    errors.sort((a, b) => (a.level === b.level ? 0 : a.level === 'error' ? -1 : 1));
    return errors;
}

// CLI
if (typeof require !== 'undefined' && require.main === module) {
    const fs = require('fs');
    const fp = process.argv[2];
    if (!fp) {
        console.error('用法: npx tsx src/server/validator/graph-validator.ts <graph-json>');
        process.exit(1);
    }
    const raw = JSON.parse(fs.readFileSync(fp, 'utf8'));
    const graph: Graph = raw.graph || raw;
    const errors = validateGraph(graph);
    if (errors.length === 0) {
        console.log('✅ 规则校验通过');
    } else {
        console.log(`❌ 发现 ${errors.length} 个问题：\n`);
        for (const e of errors) {
            console.log(`${e.level === 'error' ? '❌' : '⚠️'} [${e.nodeId}] ${e.type}: ${e.message}`);
        }
        const ec = errors.filter(e => e.level === 'error').length;
        console.log(`\n总计: ${ec} 个错误, ${errors.length - ec} 个警告`);
        process.exit(ec > 0 ? 1 : 0);
    }
}
