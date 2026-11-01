/**
 * Web Agent - 工具适配器
 * 将 Core 工具函数适配为 Vercel AI SDK 格式
 */

import {z} from 'zod';
import {tool} from 'ai';
import {jsonSchema, type Schema, zodSchema} from '@ai-sdk/ui-utils';
import {GatewayClient} from '@/core';
import {callGatewayApi, getDevices, getDevice, getGraphs, getGraph, createGraph, updateGraph, deleteGraph, toggleGraph, getVariables, setVariable, createVariable, deleteVariable, getVariableValue, getVariableConfig, validateGraph, validateGraphCapabilitiesWithGateway, getGraphText, patchGraphV2, putGraphText, queryRules, getGraphLog, checkGraphLayout, graphHash} from '@/core';
import {getSkillByName, formatSkillContent, readSkillFile, getSkillCatalog} from '../skills/loader';

// ==================== 规则修改参数 ====================

const positionsSchema = z.record(z.object({
    x: z.number(),
    y: z.number(),
    width: z.number().positive().optional(),
    height: z.number().positive().optional(),
}));

const layoutOptionsSchema = z.object({
    mode: z.enum(['incremental', 'full']).optional().describe('incremental（默认）只摆放没有坐标的卡片；full 全图重排'),
    pinned: z.array(z.string()).optional().describe('full 模式下保持不动的节点'),
});

const mergeSchema = z.object({
    id: z.string().min(1).describe('要局部修改的节点 ID'),
    props: z.record(z.unknown()).optional().describe('浅合并到 props；值为 null 删除该键'),
    cfg: z.record(z.unknown()).optional().describe('浅合并到 cfg；值为 null 删除该键'),
    outputs: z.record(z.array(z.string())).optional().describe('按端口整体替换 outputs'),
    inputs: z.record(z.unknown()).optional().describe('浅合并到 inputs；值为 null 删除该键'),
});

const noteOperationSchema = z.object({
    section: z.string().optional(),
    append: z.string().optional(),
    replace: z.string().optional(),
    with: z.string().optional(),
    changelog: z.string().optional(),
    set: z.string().optional(),
});

const patchVariableSchema = z.object({
    id: z.string().regex(/^[a-zA-Z0-9]+$/),
    scope: z.string().default('rule'),
    type: z.enum(['number', 'string']),
    value: z.union([z.number(), z.string()]),
    name: z.string().optional(),
});

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
            description: '获取指定规则。修改已有规则前用 format="text" 读紧凑文本（一行一个节点，备注为 Markdown，附 hash 和 layoutHash），大规则用 focus 只看相关节点；不传 format 时返回完整 JSON。',
            parameters: z.object({
                id: z.string().describe('规则ID'),
                format: z.enum(['json', 'text']).optional().describe('text=紧凑文本（推荐），json=完整规则（默认）'),
                focus: z.array(z.string()).optional().describe('只看这些节点及其上下游（自动使用文本格式）'),
                depth: z.number().int().min(0).max(5).optional().describe('focus 的上下游步数，默认 1'),
                ifNoneMatch: z.string().optional().describe('已知 hash；规则未变化时只返回 unchanged'),
            }),
            execute: async ({id, format, focus, depth = 1, ifNoneMatch}) => {
                const wantText = format === 'text' || (focus !== undefined && focus.length > 0);
                if (ifNoneMatch) {
                    const current = await getGraph(gateway, id);
                    if (!current.success) return current;
                    const hash = graphHash(current.data!.nodes || []);
                    if (hash === ifNoneMatch) return {success: true, data: {id, unchanged: true, hash}};
                    if (!wantText) return current;
                }
                if (wantText) return getGraphText(gateway, id, {focus, depth});
                return getGraph(gateway, id);
            },
        }),

        patch_graph: defineTool({
            description: `修改已有规则的首选方式：一次调用完成建变量、改节点、改备注、结构与能力校验和写入。先用 get_graph({id, format:"text"}) 拿到 hash。
- add: 新增节点（紧凑文本，可多行，可含 var 声明和 @tts/@pulse 宏）；ID 已存在时拒绝
- replace: 整行替换已有节点（紧凑文本）；ID 不存在时拒绝
- merge: 只改个别字段或连线（outputs 按端口整体替换）；removeIds: 删除节点并清理连线
- note: 备注操作 {section, append} / {replace, with} / {changelog} / {set}
- variables: 需要的变量，不存在才创建；scope 写 "rule" 表示本规则
- positions: {节点ID: {x, y}} 只挪卡片；layout: 默认只给新卡片找空位，{mode:"full"} 全图重排
- baseHash 必传；挪卡片或重排时同时传 baseLayoutHash；dryRun:true 只预览
本次摆放或移动的卡片与任何卡片重叠时拒绝写入。返回改动明细、diff（改动节点的文本）和布局检查摘要，无需再单独校验。`,
            parameters: z.object({
                id: z.string().describe('规则ID'),
                baseHash: z.string().optional().describe('get_graph 返回的 hash，规则已被他人修改时拒绝写入'),
                baseLayoutHash: z.string().optional().describe('get_graph 返回的 layoutHash，卡片被别人挪动过时拒绝写入'),
                add: z.string().optional().describe('新增节点的紧凑文本'),
                replace: z.string().optional().describe('替换已有节点的紧凑文本'),
                merge: z.array(mergeSchema).optional().describe('局部合并的节点字段'),
                removeIds: z.array(z.string()).optional().describe('要删除的节点 ID'),
                note: z.array(noteOperationSchema).optional().describe('备注操作'),
                noteId: z.string().optional().describe('要修改的备注节点 ID，缺省为第一个备注'),
                variables: z.array(patchVariableSchema).optional().describe('需要的变量；不存在时创建'),
                positions: positionsSchema.optional().describe('只改卡片位置'),
                layout: layoutOptionsSchema.optional().describe('布局方式，默认只摆放新卡片'),
                verifyLayout: z.boolean().optional().describe('写入后回读确认坐标已保存（多一次网关往返，默认不做）'),
                dryRun: z.boolean().optional().describe('只预览，不写入'),
                name: z.string().min(1).optional().describe('新规则名称'),
                enable: z.boolean().optional().describe('是否启用'),
            }),
            execute: async ({id, name, enable, variables, ...patch}) => {
                for (const variable of variables || []) {
                    if (typeof variable.value !== variable.type) return {success: false, error: `变量 ${variable.id} 的初始值类型必须是 ${variable.type}`};
                }
                const hasNodeChange = Boolean(patch.add || patch.replace || patch.merge?.length || patch.removeIds?.length || patch.note?.length
                    || variables?.length || (patch.positions && Object.keys(patch.positions).length) || patch.layout?.mode === 'full');
                if (!hasNodeChange) {
                    if (name === undefined && enable === undefined) return {success: true, data: {graphId: id, message: '无变化'}};
                    return updateGraph(gateway, id, {name, enable});
                }
                const result = await patchGraphV2(gateway, id, {
                    ...patch,
                    variables: variables as Array<{id: string; scope: string; type: 'number' | 'string'; value: number | string; name?: string}> | undefined,
                });
                if (!result.success || patch.dryRun || (name === undefined && enable === undefined)) return result;
                const meta = await updateGraph(gateway, id, {name, enable});
                return meta.success ? result : meta;
            },
        }),

        put_graph_text: defineTool({
            description: '用一份完整的紧凑文本（get_graph format="text" 的格式）替换规则内容。服务端按差异计算新增/修改/删除、创建 var 声明的变量、执行两项校验、保留卡片坐标并给新卡片找空位后写入。改动很大、patch_graph 不方便表达时使用。必须传 baseHash。',
            parameters: z.object({
                id: z.string().describe('规则ID'),
                baseHash: z.string().describe('读取文本时的 hash'),
                baseLayoutHash: z.string().optional().describe('读取文本时的 layoutHash'),
                text: z.string().describe('完整紧凑文本'),
                layout: layoutOptionsSchema.optional().describe('布局方式，默认只摆放新卡片'),
                dryRun: z.boolean().optional().describe('只预览，不写入'),
            }),
            execute: async ({id, ...input}) => putGraphText(gateway, id, input),
        }),

        query_rules: defineTool({
            description: '在服务端扫描全部规则，只返回命中的节点（紧凑文本）。用于找「谁在读某变量」「谁在控制某设备属性」，不要逐条读规则。条件可组合（同时满足）。',
            parameters: z.object({
                variable: z.string().optional().describe('"$livingOccupied"（全局）、"$R1234.x"（指定作用域）或 "x"（任意作用域）'),
                device: z.string().optional().describe('did 或设备名称'),
                property: z.string().optional().describe('"siid/piid"'),
                nodeType: z.string().optional().describe('节点类型，如 varChange'),
                contains: z.string().optional().describe('节点文本包含的字符串'),
                graphs: z.array(z.string()).optional().describe('只查这些规则'),
            }),
            execute: async (query) => queryRules(gateway, query),
        }),

        get_log: defineTool({
            description: '读取网关执行日志并在服务端过滤。只记录规则执行（连线触发和节点取值），不记录设备自身上报。排查规则为什么没执行时，先用 summary:true 看各节点执行次数，找出执行链断在哪一步。时间为 UTC+8。',
            parameters: z.object({
                graph: z.string().optional().describe('规则ID'),
                nodes: z.array(z.string()).optional().describe('只看这些节点'),
                minutes: z.number().positive().max(10080).optional().describe('最近多少分钟，默认 60'),
                limit: z.number().int().positive().max(2000).optional().describe('最多返回多少行（取最新），默认 200'),
                summary: z.boolean().optional().describe('只返回各节点执行次数'),
            }),
            execute: async (query) => getGraphLog(gateway, query),
        }),

        check_layout: defineTool({
            description: '只读检查规则的卡片布局（重叠、可能重叠、穿卡连线、交叉估计、分区），不写入网关。可带 positions 或 layout 预览修改效果。穿卡和交叉是估计值，只用于判断是否便于维护，不是规则逻辑错误。',
            parameters: z.object({
                id: z.string().describe('规则ID'),
                positions: positionsSchema.optional().describe('预览这些位置修改'),
                layout: layoutOptionsSchema.optional().describe("预览布局方式，如 {mode:'full'}"),
                limit: z.number().int().min(1).max(200).optional().describe('每类问题最多列出几条，默认 30'),
            }),
            execute: async ({id, ...input}) => checkGraphLayout(gateway, id, input),
        }),

        create_graph: defineTool({
            description: '创建新的自动化规则',
            parameters: z.object({
                name: z.string().describe('规则名称'),
                nodes: z.array(z.any()).describe('节点列表'),
                variables: z.array(z.discriminatedUnion('type', [
                    z.object({id: z.string().regex(/^[a-zA-Z0-9]+$/), type: z.literal('number'), value: z.number(), name: z.string().trim().min(1).optional()}),
                    z.object({id: z.string().regex(/^[a-zA-Z0-9]+$/), type: z.literal('string'), value: z.string(), name: z.string().trim().min(1).optional()}),
                ])).optional().describe('本规则变量定义；节点引用时 scope 使用 rule'),
                enable: z.boolean().optional().describe('是否启用'),
            }),
            execute: async ({name, nodes, variables, enable = true}) => {
                return createGraph(gateway, {name, nodes, variables, enable});
            },
        }),

        update_graph: defineTool({
            description: '整图替换现有规则（需要传全部节点）。修改已有规则优先用 patch_graph，只在补丁无法表达时使用。',
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

        create_variable: defineTool({
            description: '创建自动化变量',
            parameters: z.object({id: z.string().regex(/^[a-zA-Z0-9]+$/), type: z.enum(['number', 'string']), value: z.union([z.number(), z.string()]), name: z.string().trim().min(1).optional(), scope: z.string().optional()}),
            execute: async ({id, type, value, name, scope = 'global'}) => {
                if (typeof value !== type) return {success: false, error: 'value 必须与 type 匹配'};
                return createVariable(gateway, id, type, value, name, scope);
            },
        }),

        delete_variable: defineTool({
            description: '删除自动化变量；仍被规则引用时拒绝删除',
            parameters: z.object({
                id: z.string().describe('变量 ID'),
                scope: z.string().optional().describe('变量作用域'),
            }),
            execute: async ({id, scope = 'global'}) => {
                return deleteVariable(gateway, id, scope);
            },
        }),

        get_variable_value: defineTool({
            description: '获取变量当前值',
            parameters: z.object({id: z.string(), scope: z.string().optional()}),
            execute: async ({id, scope = 'global'}) => getVariableValue(gateway, id, scope),
        }),

        get_variable_config: defineTool({
            description: '获取变量配置',
            parameters: z.object({id: z.string(), scope: z.string().optional()}),
            execute: async ({id, scope = 'global'}) => getVariableConfig(gateway, id, scope),
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

        validate_graph_capabilities: defineTool({
            description: '根据真实 MIOT Spec 校验规则中的设备能力和变量引用',
            parameters: z.object({
                graph: z.object({id: z.string(), nodes: z.array(z.any()), cfg: z.any()}),
            }),
            execute: async ({graph}) => validateGraphCapabilitiesWithGateway(gateway, graph as any),
        }),

        activate_skill: defineTool({
            description: '激活指定的 Skill',
            parameters: z.object({
                name: z.string().describe('Skill 名称'),
            }),
            execute: async ({name}) => {
                const skill = getSkillByName(name);
                if (!skill) {
                    const catalog = getSkillCatalog();
                    const available = catalog.map(s => s.name).join(', ');
                    return {
                        success: false,
                        error: `Skill "${name}" 不存在。可用的 Skills: ${available}`,
                    };
                }

                return {
                    success: true,
                    skill: skill.name,
                    content: formatSkillContent(skill),
                    resources: skill.resources,
                    message: `已激活 Skill: ${skill.name}`,
                };
            },
        }),

        read_skill_file: defineTool({
            description: '读取 Skill 目录中的资源文件',
            parameters: z.object({
                skillName: z.string().describe('Skill 名称'),
                filePath: z.string().describe('相对于 Skill 目录的文件路径'),
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
