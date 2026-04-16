/**
 * oh-my-sage - AI 工具定义
 * 所有 Agent 能力都通过工具实现
 */

import {z} from 'zod';
import {tool} from 'ai';
import {jsonSchema, type Schema, zodSchema} from '@ai-sdk/ui-utils';
import {GatewayClient} from '../gateway/client';
import {Device} from '../../shared/types';
import {ModelConfig, getModelConfigFromEnv} from './model';
import {getSkillByName, formatSkillContent, readSkillFile, getSkillCatalog} from '../skills/loader';
import {validateGraph} from '../validator/graph-validator';

function patchArrayItems(schema: unknown): unknown {
    if (Array.isArray(schema)) {
        return schema.map(patchArrayItems);
    }

    if (schema === null || typeof schema !== 'object') {
        return schema;
    }

    const patched = Object.fromEntries(
        Object.entries(schema).map(([key, value]) => [key, patchArrayItems(value)])
    ) as Record<string, unknown>;

    if (patched.type === 'array' && !('items' in patched)) {
        patched.items = {};
    }

    return patched;
}

function compatibleParameters<OBJECT>(
    schema: z.Schema<OBJECT, z.ZodTypeDef, any>
): Schema<OBJECT> {
    const baseSchema = zodSchema(schema);

    return jsonSchema<OBJECT>(patchArrayItems(baseSchema.jsonSchema) as any, {
        validate: value => {
            const result = schema.safeParse(value);
            return result.success
                ? {success: true, value: result.data}
                : {success: false, error: result.error};
        },
    });
}

function defineTool<P extends z.Schema<any, z.ZodTypeDef, any>, RESULT>(config: {
    description?: string;
    parameters: P;
    execute?: (args: z.infer<P>, options: {abortSignal?: AbortSignal}) => PromiseLike<RESULT>;
}) {
    return tool({
        ...config,
        parameters: compatibleParameters(config.parameters),
    } as any);
}

/**
 * 节点自动布局
 * 根据节点连接关系进行分层布局，从左到右表示流程方向
 */
function layoutNodes(nodes: any[]): void {
    const NODE_WIDTH = 528;
    const NODE_HEIGHT = 164;
    const H_SPACING = 150;  // 水平间距
    const V_SPACING = 80;   // 垂直间距
    const START_X = 100;
    const START_Y = 100;

    // 建立节点索引
    const nodeMap = new Map<string, any>();
    for (const node of nodes) {
        nodeMap.set(node.id, node);
    }

    // 解析连接，建立邻接表和入度表
    const children = new Map<string, string[]>();  // 父节点 -> 子节点列表
    const inDegree = new Map<string, number>();    // 节点入度
    const parentOf = new Map<string, string>();    // 子节点 -> 父节点（用于确定分支位置）

    for (const node of nodes) {
        children.set(node.id, []);
        inDegree.set(node.id, 0);
    }

    // 解析 outputs 连接
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

    // BFS 分层：确定每个节点的层级（x 坐标）
    const levels = new Map<string, number>();  // 节点 -> 层级
    const queue: string[] = [];

    // 找到所有根节点（入度为 0）
    for (const node of nodes) {
        if (inDegree.get(node.id) === 0) {
            queue.push(node.id);
            levels.set(node.id, 0);
        }
    }

    // BFS 遍历
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

    // 处理未被遍历到的节点（可能有循环引用）
    for (const node of nodes) {
        if (!levels.has(node.id)) {
            levels.set(node.id, 0);
        }
    }

    // 按层级分组
    const levelGroups = new Map<number, string[]>();
    for (const [nodeId, level] of levels) {
        if (!levelGroups.has(level)) {
            levelGroups.set(level, []);
        }
        levelGroups.get(level)!.push(nodeId);
    }

    // 分配 y 坐标：考虑分支结构
    const positions = new Map<string, { x: number; y: number }>();

    // 对每个层级的节点进行排序，使有共同父节点的节点靠近
    for (const [level, nodeIds] of levelGroups) {
        // 按父节点分组排序
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
        const startY = START_Y + (levelGroups.get(0)!.length * (NODE_HEIGHT + V_SPACING) - totalHeight) / 2;

        for (let i = 0; i < nodeIds.length; i++) {
            const y = startY + i * (NODE_HEIGHT + V_SPACING);
            positions.set(nodeIds[i], {x, y});
        }
    }

    // 应用位置到节点
    for (const node of nodes) {
        const pos = positions.get(node.id);
        if (pos) {
            node.cfg = node.cfg || {};
            node.cfg.pos = {
                x: Math.round(pos.x),
                y: Math.round(pos.y),
                width: NODE_WIDTH,
                height: NODE_HEIGHT,
            };
        }
    }
}

/**
 * 创建工具定义
 *
 * @param gatewayClient 网关客户端实例
 * @param modelConfig 模型配置（可选）
 * @returns 工具定义对象
 */
export function createTools(gatewayClient: GatewayClient, modelConfig?: ModelConfig) {
    const config = modelConfig || getModelConfigFromEnv();

    return {
        // ==================== 思考工具 ====================

        /**
         * 思考工具
         * 仅用于复杂任务（如创建规则），简单任务不要使用
         */
        'think': defineTool({
            description: '仅用于复杂任务的思考（如创建规则）。简单任务（查询设备、查看规则等）不要使用此工具，直接调用相应工具即可。',
            parameters: z.object({
                thought: z.string().describe('思考内容'),
                nextAction: z.string().optional().describe('下一步行动'),
            }),
            execute: async ({thought, nextAction}) => {
                return {
                    success: true,
                    thought,
                    nextAction,
                };
            },
        }),

        /**
         * 向用户提问
         * 仅用于需要用户选择或确认时
         */
        'ask_user': defineTool({
            description: '仅用于需要用户选择或确认时。简单任务不要使用。',
            parameters: z.object({
                question: z.string().describe('问题内容'),
                options: z.array(z.string()).describe('选项列表，必须是字符串数组，例如: ["选项1", "选项2"]'),
                needConfirm: z.boolean().optional().describe('是否需要确认（是/否）'),
            }),
            execute: async ({question, options, needConfirm}) => {
                return {
                    success: true,
                    needsUserInput: true,
                    question,
                    options,
                    needConfirm,
                };
            },
        }),

        // ==================== 设备相关工具 ====================

        /**
         * 获取设备列表（精简预览）
         */
        'get_devices': defineTool({
            description: '获取设备列表（预览模式，只返回关键字段）。如需设备能力信息，用 get_device',
            parameters: z.object({}),
            execute: async () => {
                try {
                    const response = await gatewayClient.callApi('getDevList', {}, 10000);
                    const devList = response.devList || {};
                    const devices = Object.entries(devList).map(([did, device]: [string, any]) => ({
                        did,
                        name: device.name,
                        modelName: device.modelName,
                        online: device.online,
                        roomName: device.roomName,
                    }));
                    return {success: true, devices, count: devices.length};
                } catch (error) {
                    return {success: false, error: `获取设备列表失败: ${error}`};
                }
            },
        }),

        /**
         * 获取设备详情 + MIOT Spec 能力（支持批量）
         * 合并原 get_device + get_device_spec
         */
        'get_device': defineTool({
            description: '获取设备详情及 MIOT Spec 能力（siid/piid/eiid/aiid）。支持批量：传入多个 did 一次获取',
            parameters: z.object({
                dids: z.array(z.string()).describe('设备ID数组，如 ["950058664", "2076971215"]'),
            }),
            execute: async ({dids}) => {
                try {
                    const response = await gatewayClient.callApi('getDevList', {}, 10000);
                    const devList = response.devList || {};

                    // 批量获取设备信息
                    const results: any[] = [];
                    for (const did of dids) {
                        const device = devList[did];
                        if (!device) {
                            results.push({did, error: '设备不存在'});
                            continue;
                        }

                        const info: any = {
                            did,
                            name: device.name,
                            model: device.model,
                            modelName: device.modelName,
                            online: device.online,
                            roomName: device.roomName,
                            urn: device.urn,
                        };

                        // 获取 Spec 能力
                        if (device.urn) {
                            try {
                                const specUrl = `https://miot-spec.org/miot-spec-v2/instance?type=${encodeURIComponent(device.urn)}`;
                                const specRes = await fetch(specUrl);
                                if (specRes.ok) {
                                    const specData = await specRes.json() as any;
                                    const services = specData.services || [];

                                    // 提取可触发能力（deviceInput 用）
                                    const triggers: any[] = [];
                                    // 提取可执行能力（deviceOutput 用）
                                    const actions: any[] = [];
                                    // 提取可查询能力（deviceGet 用）
                                    const readable: any[] = [];

                                    for (const s of services) {
                                        for (const p of (s.properties || [])) {
                                            const cap = {
                                                siid: s.iid,
                                                piid: p.iid,
                                                desc: `${s.description}-${p.description}`,
                                                dtype: p.format,  // bool/uint8/int32/float 等
                                            };
                                            if (p.access?.includes('notify')) triggers.push({...cap, type: 'prop'});
                                            if (p.access?.includes('write')) actions.push({...cap, type: 'prop', range: p['value-range'], list: p['value-list']});
                                            if (p.access?.includes('read')) readable.push(cap);
                                        }
                                        for (const e of (s.events || [])) {
                                            triggers.push({siid: s.iid, eiid: e.iid, desc: `${s.description}-${e.description}`, type: 'event'});
                                        }
                                        for (const a of (s.actions || [])) {
                                            actions.push({siid: s.iid, aiid: a.iid, desc: `${s.description}-${a.description}`, type: 'action', in: a.in});
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

                    return {
                        success: true,
                        devices: results,
                        count: results.length,
                    };
                } catch (error) {
                    return {success: false, error: `获取设备信息失败: ${error}`};
                }
            },
        }),

        // ==================== 规则相关工具 ====================

        /**
         * 获取规则列表
         */
        'get_graphs': defineTool({
            description: '获取所有自动化规则列表',
            parameters: z.object({}),
            execute: async () => {
                try {
                    const graphs = await gatewayClient.callApi('getGraphList', {}, 10000);
                    const graphList = Array.isArray(graphs) ? graphs : [];
                    return {
                        success: true,
                        graphs: graphList.map((graph: any) => ({
                            id: graph.id,
                            name: graph.userData?.name || graph.id,
                            enabled: graph.enable,
                            createTime: graph.createTime,
                            updateTime: graph.userData?.lastUpdateTime,
                        })),
                        count: graphList.length,
                    };
                } catch (error) {
                    return {
                        success: false,
                        error: `获取规则列表失败: ${error}`,
                    };
                }
            },
        }),

        /**
         * 获取规则详情
         */
        'get_graph': defineTool({
            description: '获取指定规则的详细信息，包括所有节点和连接',
            parameters: z.object({
                id: z.string().describe('规则ID'),
            }),
            execute: async ({id}) => {
                try {
                    const graph = await gatewayClient.callApi('getGraph', {id}, 10000);
                    return {
                        success: true,
                        graph,
                    };
                } catch (error) {
                    return {
                        success: false,
                        error: `获取规则详情失败: ${error}`,
                    };
                }
            },
        }),

        /**
         * 创建规则
         */
        'create_graph': defineTool({
            description: '创建新的自动化规则。创建前请先获取设备信息，生成方案并获得用户确认。',
            parameters: z.object({
                name: z.string().describe('规则名称'),
                nodes: z.array(z.any()).describe('节点列表'),
                enable: z.boolean().optional().describe('是否启用'),
            }),
            execute: async ({name, nodes, enable = true}) => {
                try {
                    const graphId = `graph_${Date.now()}`;

                    // 处理节点：确保每个节点的 cfg 和 props 包含必要字段
                    const processedNodes = nodes.map((node: any) => ({
                        ...node,
                        cfg: {
                            ...node.cfg,
                            name: node.cfg?.name || node.type,
                            version: node.cfg?.version ?? 1,
                        },
                        props: node.props || {},  // props 必须存在，可以为空对象
                    }));

                    // 自动布局节点位置
                    layoutNodes(processedNodes);

                    const graph: any = {
                        id: graphId,
                        nodes: processedNodes,
                        cfg: {
                            id: graphId,
                            enable,
                            uiType: 'graph',
                            userData: {
                                name,
                                lastUpdateTime: Date.now(),
                                transform: {x: 0, y: 0, scale: 1, rotate: 0},
                            },
                        },
                    };

                    // 校验连接完整性
                    const errors = validateGraph(graph);
                    const errorList = errors.filter(e => e.level === 'error');
                    if (errorList.length > 0) {
                        return {
                            success: false,
                            valid: false,
                            errors: errorList.map(e => ({node: e.nodeId, type: e.type, message: e.message})),
                            error: `规则校验失败（${errorList.length} 个错误），请修复后重试`,
                        };
                    }

                    await gatewayClient.callApi('setGraph', graph, 10000);

                    return {
                        success: true,
                        graphId,
                        message: `规则 "${name}" 创建成功`,
                    };
                } catch (error) {
                    return {
                        success: false,
                        error: `创建规则失败: ${error}`,
                    };
                }
            },
        }),

        /**
         * 更新规则
         */
        'update_graph': defineTool({
            description: '更新现有规则。更新前请先获取规则详情并获得用户确认。',
            parameters: z.object({
                id: z.string().describe('规则ID'),
                name: z.string().optional().describe('新规则名称'),
                nodes: z.array(z.any()).optional().describe('新节点列表'),
                enable: z.boolean().optional().describe('是否启用'),
            }),
            execute: async ({id, name, nodes, enable}) => {
                try {
                    // 获取现有规则的节点
                    const existing = await gatewayClient.callApi('getGraph', {id}, 10000);

                    // 从 getGraphList 获取规则名称（getGraph 只返回 nodes，不包含 userData）
                    const graphList = await gatewayClient.callApi('getGraphList', {}, 10000);
                    const graphInfo = Array.isArray(graphList)
                        ? graphList.find((g: any) => g.id === id)
                        : null;

                    // 处理节点：确保每个节点的 cfg 和 props 包含必要字段
                    const inputNodes = nodes || existing.nodes;
                    const processedNodes = inputNodes.map((node: any) => ({
                        ...node,
                        cfg: {
                            ...node.cfg,
                            name: node.cfg?.name || node.type,
                            version: node.cfg?.version ?? 1,
                        },
                        props: node.props || {},  // props 必须存在，可以为空对象
                    }));

                    // 自动布局节点位置（仅当提供新节点时重新布局）
                    if (nodes) {
                        layoutNodes(processedNodes);
                    }

                    const graph: any = {
                        id,
                        nodes: processedNodes,
                        cfg: {
                            id,
                            enable: enable !== undefined ? enable : true,
                            uiType: 'graph',
                            userData: {
                                name: name || graphInfo?.userData?.name || '规则',
                                lastUpdateTime: Date.now(),
                                transform: graphInfo?.userData?.transform || {x: 0, y: 0, scale: 1, rotate: 0},
                            },
                        },
                    };

                    // 校验连接完整性（仅当提供新节点时校验）
                    if (nodes) {
                        const errors = validateGraph(graph);
                        const errorList = errors.filter(e => e.level === 'error');
                        if (errorList.length > 0) {
                            return {
                                success: false,
                                valid: false,
                                errors: errorList.map(e => ({node: e.nodeId, type: e.type, message: e.message})),
                                error: `规则校验失败（${errorList.length} 个错误），请修复后重试`,
                            };
                        }
                    }

                    await gatewayClient.callApi('setGraph', graph, 10000);

                    return {
                        success: true,
                        message: `规则 ${id} 更新成功`,
                    };
                } catch (error) {
                    return {
                        success: false,
                        error: `更新规则失败: ${error}`,
                    };
                }
            },
        }),

        /**
         * 删除规则
         */
        'delete_graph': defineTool({
            description: '删除指定的自动化规则。删除前请获得用户确认。',
            parameters: z.object({
                id: z.string().describe('规则ID'),
            }),
            execute: async ({id}) => {
                try {
                    await gatewayClient.callApi('deleteGraph', {id}, 10000);
                    return {
                        success: true,
                        message: `规则 ${id} 删除成功`,
                    };
                } catch (error) {
                    return {
                        success: false,
                        error: `删除规则失败: ${error}`,
                    };
                }
            },
        }),

        /**
         * 启用/禁用规则
         */
        'toggle_graph': defineTool({
            description: '启用或禁用指定的自动化规则',
            parameters: z.object({
                id: z.string().describe('规则ID'),
                enable: z.boolean().describe('是否启用'),
            }),
            execute: async ({id, enable}) => {
                try {
                    // 先从 getGraphList 获取规则信息（包含 userData.name）
                    const graphList = await gatewayClient.callApi('getGraphList', {}, 10000);
                    const graphInfo = Array.isArray(graphList)
                        ? graphList.find((g: any) => g.id === id)
                        : null;

                    if (!graphInfo) {
                        return {
                            success: false,
                            error: `规则 ${id} 不存在`,
                        };
                    }

                    // 调用 changeGraphConfig 需要传递完整的 userData，否则会丢失规则名称
                    await gatewayClient.callApi('changeGraphConfig', {
                        id,
                        enable,
                        userData: {
                            name: graphInfo.userData?.name || '未命名规则',
                            lastUpdateTime: Date.now(),
                            transform: graphInfo.userData?.transform || {x: 0, y: 0, scale: 1, rotate: 0},
                        },
                    }, 10000);

                    return {
                        success: true,
                        message: `规则 ${id} 已${enable ? '启用' : '禁用'}`,
                    };
                } catch (error) {
                    return {
                        success: false,
                        error: `切换规则状态失败: ${error}`,
                    };
                }
            },
        }),

        // ==================== 变量相关工具 ====================

        /**
         * 获取变量列表
         */
        'get_variables': defineTool({
            description: '获取变量列表',
            parameters: z.object({
                scope: z.string().optional().describe('变量作用域，默认为"global"，可选"rule_xxx"'),
            }),
            execute: async ({scope = 'global'}) => {
                try {
                    const variables = await gatewayClient.callApi('getVarList', {scope}, 10000);
                    return {
                        success: true,
                        variables,
                    };
                } catch (error) {
                    return {
                        success: false,
                        error: `获取变量列表失败: ${error}`,
                    };
                }
            },
        }),

        /**
         * 设置变量值
         */
        'set_variable': defineTool({
            description: '设置变量的值',
            parameters: z.object({
                id: z.string().describe('变量ID'),
                value: z.union([z.string(), z.number()]).describe('变量值'),
                scope: z.string().optional().describe('变量作用域，默认为"global"，可选"rule_xxx"'),
            }),
            execute: async ({id, value, scope = 'global'}) => {
                try {
                    await gatewayClient.callApi('setVarValue', {scope, id, value}, 10000);
                    return {
                        success: true,
                        message: `变量 ${id} 已更新为 ${value}`,
                    };
                } catch (error) {
                    return {
                        success: false,
                        error: `设置变量值失败: ${error}`,
                    };
                }
            },
        }),

        // ==================== Skill 工具 ====================

        /**
         * 激活 Skill（渐进式披露第二层）
         * 当任务匹配某个 skill 的描述时，使用此工具加载其完整内容
         */
        'activate_skill': defineTool({
            description: '激活指定的 skill，加载其完整指导内容。当任务匹配某个 skill 的描述时使用此工具。',
            parameters: z.object({
                name: z.string().describe('skill 名称'),
            }),
            execute: async ({name}) => {
                const skill = getSkillByName(name);
                if (!skill) {
                    const catalog = getSkillCatalog();
                    const available = catalog.map(s => s.name).join(', ');
                    return {
                        success: false,
                        error: `Skill "${name}" 不存在。可用的 skills: ${available}`,
                    };
                }

                return {
                    success: true,
                    skill: skill.name,
                    content: formatSkillContent(skill),
                    resources: skill.resources,
                    message: `已激活 skill: ${skill.name}`,
                };
            },
        }),

        /**
         * 读取 Skill 资源文件（渐进式披露第三层）
         * 读取 skill 目录中的 references/, scripts/, assets/ 等文件
         */
        'read_skill_file': defineTool({
            description: '读取 skill 目录中的资源文件（如 references/ 中的详细文档）。需要先使用 activate_skill 激活 skill。',
            parameters: z.object({
                skillName: z.string().describe('skill 名称'),
                filePath: z.string().describe('相对于 skill 目录的文件路径，如 references/node-types.md'),
            }),
            execute: async ({skillName, filePath}) => {
                const content = readSkillFile(skillName, filePath);
                if (content === null) {
                    return {
                        success: false,
                        error: `无法读取文件: ${filePath}`,
                    };
                }

                return {
                    success: true,
                    skillName,
                    filePath,
                    content,
                };
            },
        }),

        // ==================== 校验工具 ====================

        /**
         * 校验规则连接完整性
         * 在调用 create_graph / update_graph 之前必须先调用此工具
         * 将完整的 graph JSON 传入（包含 nodes 和 cfg），返回校验结果
         */
        'validate_graph': defineTool({
            description: '校验规则连接完整性。创建或更新规则前必须先调用此工具。传入完整的 graph JSON（含 nodes 和 cfg），返回错误列表。如果有 error 级别的问题，必须修复后再创建。',
            parameters: z.object({
                nodes: z.array(z.any()).describe('节点列表'),
                cfg: z.object({
                    id: z.string(),
                    enable: z.boolean(),
                    uiType: z.string(),
                    userData: z.object({
                        name: z.string(),
                        lastUpdateTime: z.number(),
                        transform: z.object({x: z.number(), y: z.number(), scale: z.number(), rotate: z.number()}),
                    }),
                }).describe('规则配置'),
            }),
            execute: async ({nodes, cfg}) => {
                const graph = {id: cfg.id, nodes, cfg};
                const errors = validateGraph(graph as any);

                if (errors.length === 0) {
                    return {success: true, valid: true, message: '规则校验通过'};
                }

                const errorList = errors
                    .filter(e => e.level === 'error')
                    .map(e => ({node: e.nodeId, type: e.type, message: e.message}));
                const warnList = errors
                    .filter(e => e.level === 'warn')
                    .map(e => ({node: e.nodeId, type: e.type, message: e.message}));

                return {
                    success: true,
                    valid: errorList.length === 0,
                    errors: errorList,
                    warnings: warnList,
                    message: errorList.length > 0
                        ? `发现 ${errorList.length} 个错误，必须修复后才能创建规则`
                        : `校验通过（${warnList.length} 个警告）`,
                };
            },
        }),
    };
}


