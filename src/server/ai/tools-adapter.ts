/**
 * Web Agent - 工具适配器
 * 将 Core 工具函数适配为 Vercel AI SDK 格式
 */

import {z} from 'zod';
import {tool} from 'ai';
import {jsonSchema, type Schema, zodSchema} from '@ai-sdk/ui-utils';
import {GatewayClient} from '@/core';
import {callGatewayApi, getDevices, getDevice, getGraphs, getGraph, createGraph, updateGraph, deleteGraph, toggleGraph, getVariables, setVariable, validateGraph, layoutNodes} from '@/core';
import {getSkillByName, formatSkillContent, readSkillFile, getSkillCatalog} from '../skills/loader';

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

export function createCoreTools(gateway: GatewayClient) {
    return {
        think: defineTool({
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

        ask_user: defineTool({
            description: '仅用于需要用户选择或确认时。简单任务不要使用。',
            parameters: z.object({
                question: z.string().describe('问题内容'),
                options: z.array(z.string()).describe('选项列表'),
                needConfirm: z.boolean().optional().describe('是否需要确认'),
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

        get_devices: defineTool({
            description: '获取设备列表（预览模式，只返回关键字段）',
            parameters: z.object({}),
            execute: async () => {
                return getDevices(gateway);
            },
        }),

        get_device: defineTool({
            description: '获取设备详情及 MIOT Spec 能力',
            parameters: z.object({
                dids: z.array(z.string()).describe('设备ID数组'),
            }),
            execute: async ({dids}) => {
                return getDevice(gateway, dids);
            },
        }),

        call_gateway_api: defineTool({
            description: '仅在用户明确要求排障、发现网关接口或查询未被专用工具覆盖的只读数据时使用。只能调用已验证的只读 API；写入、删除和未知方法会被拒绝。',
            parameters: z.object({
                method: z.string().describe('已验证的只读网关 API 方法名，例如 getApiList、getLog、getVarScopeList'),
                params: z.record(z.unknown()).default({}).describe('API 参数对象'),
                timeout: z.number().int().min(1000).max(10000).default(10000).describe('超时时间（毫秒）'),
            }),
            execute: async ({method, params, timeout}) => {
                return callGatewayApi(gateway, method, params, timeout);
            },
        }),

        get_graphs: defineTool({
            description: '获取所有自动化规则列表',
            parameters: z.object({}),
            execute: async () => {
                return getGraphs(gateway);
            },
        }),

        get_graph: defineTool({
            description: '获取指定规则的详细信息',
            parameters: z.object({
                id: z.string().describe('规则ID'),
            }),
            execute: async ({id}) => {
                return getGraph(gateway, id);
            },
        }),

        create_graph: defineTool({
            description: '创建新的自动化规则',
            parameters: z.object({
                name: z.string().describe('规则名称'),
                nodes: z.array(z.any()).describe('节点列表'),
                enable: z.boolean().optional().describe('是否启用'),
            }),
            execute: async ({name, nodes, enable = true}) => {
                return createGraph(gateway, {name, nodes, enable});
            },
        }),

        update_graph: defineTool({
            description: '更新现有规则',
            parameters: z.object({
                id: z.string().describe('规则ID'),
                name: z.string().optional().describe('新规则名称'),
                nodes: z.array(z.any()).optional().describe('新节点列表'),
                enable: z.boolean().optional().describe('是否启用'),
            }),
            execute: async ({id, name, nodes, enable}) => {
                return updateGraph(gateway, id, {name, nodes, enable});
            },
        }),

        delete_graph: defineTool({
            description: '删除指定的自动化规则',
            parameters: z.object({
                id: z.string().describe('规则ID'),
            }),
            execute: async ({id}) => {
                return deleteGraph(gateway, id);
            },
        }),

        toggle_graph: defineTool({
            description: '启用或禁用指定的自动化规则',
            parameters: z.object({
                id: z.string().describe('规则ID'),
                enable: z.boolean().describe('是否启用'),
            }),
            execute: async ({id, enable}) => {
                return toggleGraph(gateway, id, enable);
            },
        }),

        get_variables: defineTool({
            description: '获取变量列表',
            parameters: z.object({
                scope: z.string().optional().describe('变量作用域'),
            }),
            execute: async ({scope = 'global'}) => {
                return getVariables(gateway, scope);
            },
        }),

        set_variable: defineTool({
            description: '设置变量的值',
            parameters: z.object({
                id: z.string().describe('变量ID'),
                value: z.union([z.string(), z.number()]).describe('变量值'),
                scope: z.string().optional().describe('变量作用域'),
            }),
            execute: async ({id, value, scope = 'global'}) => {
                return setVariable(gateway, id, value, scope);
            },
        }),

        validate_graph: defineTool({
            description: '校验规则连接完整性',
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
                }),
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

        activate_skill: defineTool({
            description: '激活指定的 skill',
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

        read_skill_file: defineTool({
            description: '读取 skill 目录中的资源文件',
            parameters: z.object({
                skillName: z.string().describe('skill 名称'),
                filePath: z.string().describe('相对于 skill 目录的文件路径'),
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
    };
}
