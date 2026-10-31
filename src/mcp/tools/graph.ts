/**
 * MCP 服务 - 规则管理工具
 */

import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { GatewayManager } from "../../core/gateway/manager.js";
import {
  getGraphs,
  getGraph,
  createGraph,
  updateGraph,
  deleteGraph,
  toggleGraph,
  validateGraph,
  validateGraphCapabilitiesWithGateway,
  getGraphText,
  putGraphText,
  patchGraphV2,
  queryRules,
  getGraphLog,
  graphHash,
  buildTextContext,
  textToNodes,
  arrangeNodes,
  layoutHash,
  positionChangedIds,
} from "../../core/index.js";
import type { Graph, GraphNode } from "../../core/index.js";
import {
  ResponseFormatSchema,
  textResult,
  jsonResult,
  errorResult,
  handleError,
  formatGraphListMarkdown,
  shapeGraphOutput,
  compactIssues,
} from "../utils.js";
import { GraphDraftStore } from "./graphDraft.js";

const GraphVariableSchema = z.discriminatedUnion("type", [
  z.object({ id: z.string().regex(/^[a-zA-Z0-9]+$/, "id 必须是纯字母数字"), type: z.literal("number"), value: z.number(), name: z.string().trim().min(1).optional() }),
  z.object({ id: z.string().regex(/^[a-zA-Z0-9]+$/, "id 必须是纯字母数字"), type: z.literal("string"), value: z.string(), name: z.string().trim().min(1).optional() }),
]);

const GraphNodeSchema = z.object({
  id: z.string().regex(/^[0-9a-zA-Z]+$/, "节点 ID 只能包含字母和数字"),
  type: z.string().min(1),
  cfg: z.record(z.unknown()),
  props: z.record(z.unknown()),
  inputs: z.record(z.unknown()),
  outputs: z.record(z.array(z.string())),
});

const GraphMergeSchema = z.object({
  id: z.string().min(1).describe("要局部修改的节点 ID"),
  props: z.record(z.unknown()).optional().describe("浅合并到 props；值为 null 删除该键"),
  cfg: z.record(z.unknown()).optional().describe("浅合并到 cfg；值为 null 删除该键"),
  outputs: z.record(z.array(z.string())).optional().describe("按端口整体替换 outputs"),
  inputs: z.record(z.unknown()).optional().describe("浅合并到 inputs；值为 null 删除该键"),
});

const GRAPH_FULL_HINT = "请改用 detail=summary，或用 node_ids 只取需要的节点";

const PositionsSchema = z.record(z.object({
  x: z.number(),
  y: z.number(),
  width: z.number().positive().optional(),
  height: z.number().positive().optional(),
}));

const LayoutOptionsSchema = z.object({
  mode: z.enum(["incremental", "full"]).optional().describe("incremental（默认）只摆放没有坐标的卡片；full 全图重排"),
  pinned: z.array(z.string()).optional().describe("full 模式下保持不动的节点"),
});
const VALIDATE_HINT = "错误过多，请先修复前面的错误后重新校验";

/** 缺少 cfg 时补一个默认 cfg，便于只传 {id, nodes} 校验 */
function withDefaultCfg(graph: { id: string; nodes: unknown[]; cfg?: unknown }): Graph {
  const cfg = (graph.cfg && typeof graph.cfg === "object" ? graph.cfg : {
    id: graph.id,
    enable: true,
    uiType: "graph",
    userData: { name: graph.id, lastUpdateTime: 0, transform: { x: 0, y: 0, scale: 1, rotate: 0 } },
  }) as Graph["cfg"];
  return { id: graph.id, nodes: (graph.nodes || []) as GraphNode[], cfg };
}

export function registerGraphTools(
  server: McpServer,
  gatewayManager: GatewayManager,
  // HTTP 模式下多个会话共享同一个草稿库，避免草稿和清理定时器随会话数倍增
  drafts: GraphDraftStore = new GraphDraftStore()
): void {
  const restoreDraftError = (draftId: string, commitToken: string | undefined, error: unknown): string => {
    const original = handleError(error, "graph_draft_commit");
    if (!commitToken) return original;
    try {
      drafts.failCommit(draftId, commitToken);
      return original;
    } catch (restoreError) {
      return `${original}；草稿状态恢复失败: ${String(restoreError)}`;
    }
  };

  /** 按 id 读取规则；失败返回错误文本 */
  const loadGraph = async (id: string): Promise<{ graph?: Graph; error?: string }> => {
    const result = await getGraph(gatewayManager.gateway!, id);
    if (!result.success) return { error: result.error };
    const graph = result.data!;
    graph.nodes = graph.nodes || [];
    return { graph };
  };

  // ==================== mijia_validate_graph_capabilities ====================
  server.registerTool(
    "mijia_validate_graph_capabilities",
    {
      title: "校验规则设备能力",
      description: `根据真实 MIOT Spec 校验规则的 DID、URN、字段权限、类型、枚举值、数值范围以及变量引用。创建或更新设备节点前必须先通过本校验和 mijia_validate_graph。

二选一：
  - id: 校验网关中已保存的规则（服务端读取，无需上传整图）
  - graph: 校验待提交的规则 {id, nodes, cfg?}
可选 variables：与 mijia_create_graph 相同的本规则变量声明，使 scope="rule" 的引用在创建前即可通过校验。

返回紧凑 JSON：{valid, errorCount, warningCount, errors:[{nodeId,type,message}], warnings, inspectedDeviceCount, inspectedUrnCount}`,
      inputSchema: z.object({
        id: z.string().optional().describe("已保存规则的 ID（与 graph 二选一）"),
        graph: z.object({ id: z.string(), nodes: z.array(z.any()), cfg: z.any().optional() }).optional().describe("待校验规则对象（与 id 二选一）"),
        variables: z.array(GraphVariableSchema).optional().describe("本规则变量声明，用于创建前校验 scope=rule 的引用"),
      }),
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true },
    },
    async ({ id, graph, variables }) => {
      try {
        if (!graph && !id) return textResult("Error: 必须提供 id 或 graph 之一 (validate_graph_capabilities)", undefined, true);
        gatewayManager.ensureConnected();
        let target: Graph;
        if (graph) {
          target = withDefaultCfg(graph);
        } else {
          const loaded = await loadGraph(id!);
          if (!loaded.graph) return errorResult(new Error(loaded.error), "validate_graph_capabilities");
          target = loaded.graph;
        }
        const ruleVariables = variables?.map((variable) => ({ id: variable.id, type: variable.type }));
        const report = await validateGraphCapabilitiesWithGateway(gatewayManager.gateway!, target, ruleVariables ? { ruleVariables } : undefined);
        const output = {
          valid: report.valid,
          errorCount: report.errors.length,
          warningCount: report.warnings.length,
          errors: compactIssues(report.errors),
          warnings: compactIssues(report.warnings),
          inspectedDeviceCount: report.inspectedDids.length,
          inspectedUrnCount: report.inspectedUrns.length,
        };
        return jsonResult(output, { hint: VALIDATE_HINT });
      } catch (error) {
        return errorResult(error, "validate_graph_capabilities");
      }
    }
  );

  // ==================== mijia_get_graphs ====================
  server.registerTool(
    "mijia_get_graphs",
    {
      title: "获取规则列表",
      description: `获取所有自动化规则的列表。

返回（紧凑）：
  - markdown: 每条规则一行「名称 (id) [启用]/[禁用]」
  - json: {count, graphs:[{id,name,enable}]}`,
      inputSchema: z.object({
        response_format: ResponseFormatSchema.optional().default("markdown").describe("输出格式"),
      }),
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    async ({ response_format = "markdown" }) => {
      try {
        gatewayManager.ensureConnected();
        const result = await getGraphs(gatewayManager.gateway!);
        if (!result.success) return errorResult(new Error(result.error), "get_graphs");

        const graphs = (result.data ?? []).map(({ id, name, enable }) => ({ id, name, enable }));
        const output = { count: graphs.length, graphs };
        const hint = "规则过多，请用 response_format=json 或 mijia_find_device_usage 按设备查找";

        if (response_format === "json") return jsonResult(output, { hint });
        return textResult(formatGraphListMarkdown(graphs), output, false, { hint });
      } catch (error) {
        return errorResult(error, "get_graphs");
      }
    }
  );

  // ==================== mijia_get_graph ====================
  server.registerTool(
    "mijia_get_graph",
    {
      title: "获取规则详情",
      description: `获取指定自动化规则，并返回 hash（修改时传给 baseHash 防止覆盖他人修改）。

  - format="text"（推荐）：紧凑文本，一行一个节点，备注为 Markdown；体积约为 JSON 摘要的一半，可直接用于 mijia_patch_graph 的 add/replace 和 mijia_put_graph_text。语法见 mijia-automation Skill 的「规则文本格式」。
  - focus + depth：只返回这些节点及其上下游 depth 步内的节点（文本格式），读大规则时首选
  - ifNoneMatch：传入已知 hash，未变化时只返回 {unchanged:true, hash}
  - detail="summary"（默认，兼容旧用法）：紧凑 JSON 摘要
  - detail="full"：完整规则对象（体积大）
  - node_ids：只返回这些节点的完整 JSON`,
      inputSchema: z.object({
        id: z.string().describe("规则ID"),
        format: z.enum(["json", "text"]).optional().default("json").describe("text=紧凑文本（推荐），json=沿用 detail/node_ids"),
        focus: z.array(z.string()).optional().describe("只看这些节点及其上下游（自动使用文本格式）"),
        depth: z.number().int().min(0).max(5).optional().default(1).describe("focus 的上下游步数，默认 1"),
        ifNoneMatch: z.string().optional().describe("已知 hash；规则未变化时只返回 unchanged"),
        detail: z.enum(["summary", "full"]).optional().default("summary").describe("summary=紧凑摘要（默认），full=完整规则"),
        node_ids: z.array(z.string()).optional().describe("只返回这些节点的完整 JSON"),
        response_format: ResponseFormatSchema.optional().default("markdown").describe("兼容保留，输出均为紧凑 JSON"),
      }),
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    async ({ id, format = "json", focus, depth = 1, ifNoneMatch, detail = "summary", node_ids }) => {
      try {
        gatewayManager.ensureConnected();
        if (ifNoneMatch) {
          const loaded = await loadGraph(id);
          if (!loaded.graph) return errorResult(new Error(loaded.error), "get_graph");
          const hash = graphHash(loaded.graph.nodes);
          if (hash === ifNoneMatch) return jsonResult({ id, unchanged: true, hash });
        }
        if (format === "text" || (focus && focus.length > 0)) {
          const result = await getGraphText(gatewayManager.gateway!, id, { focus, depth });
          if (!result.success) return errorResult(new Error(result.error), "get_graph");
          return jsonResult({ ...result.data! }, { hint: "请改用 focus 只看相关节点" });
        }
        const loaded = await loadGraph(id);
        if (!loaded.graph) return errorResult(new Error(loaded.error), "get_graph");

        const output = shapeGraphOutput(loaded.graph, { detail, nodeIds: node_ids });
        return jsonResult(output, { hint: node_ids && node_ids.length > 0 ? "请减少 node_ids 数量" : GRAPH_FULL_HINT });
      } catch (error) {
        return errorResult(error, "get_graph");
      }
    }
  );

  // ==================== mijia_patch_graph ====================
  server.registerTool(
    "mijia_patch_graph",
    {
      title: "增量修改自动化规则",
      description: `修改已有规则的首选方式：一次调用完成建变量、改节点、改备注、结构与能力校验、写入和回读。

  - baseHash: mijia_get_graph 返回的 hash，规则已被他人修改时拒绝写入
  - add: 新增节点（紧凑文本，可多行，可含 var 声明和 @tts/@pulse 宏）；节点 ID 已存在时拒绝，避免误覆盖
  - replace: 整行替换已有节点（紧凑文本）；ID 不存在时拒绝
  - merge: [{id, props?, cfg?, inputs?, outputs?}] 浅合并；值为 null 删除该键；outputs 按端口替换
  - removeIds: 删除节点并清理指向它们的连线
  - note: 备注操作数组，按顺序执行：{section, append} 在某段末尾加一条；{replace, with} 替换恰好出现一次的原文；{changelog} 在「变更」段最前加一条；{set} 整体替换为 Markdown。缺省改第一个备注节点（noteId 可指定），没有备注时新建
  - variables: [{id, scope, type, value, name?}] 需要的变量，不存在才创建；scope 写 "rule" 表示本规则
  - upsert: 完整 JSON 节点（兼容旧用法）
  - positions: {节点ID: {x, y, width?, height?}} 只改卡片位置（只写这几个字段）；只改位置也会保存
  - baseLayoutHash: 读取时的 layoutHash；卡片在此期间被别人挪动过时拒绝写入（与 baseHash 互相独立）
  - layout: 默认只给没有坐标的新卡片找空位（靠近上下游、不与任何卡片重叠），已有卡片不动；{mode:"full", pinned?:[...]} 全图重排
  - verifyLayout: 写入后回读确认坐标已保存（多一次网关往返，默认不做）
  - dryRun: 只预览改动，不写入
连线默认端口：写目标节点 ID 即可（delay/varGet 等自动用 input，deviceOutput/condition 用 trigger）；condition.condition、logicOr 的 inputN 等需写明端口。

本次摆放或移动的卡片与任何卡片重叠时拒绝写入。保存会整条重写规则，网关可能重新加载规则，进行中的延时不保证延续。

返回：{graphId, hash, layoutHash, added, changed, removed, moved, placed, noteChanged, createdVariables, diff（改动节点的文本）, layout（重叠/可能重叠/穿卡连线/交叉估计）, message}。写入前已完成两项校验，无需再单独调用校验工具。`,
      inputSchema: z.object({
        id: z.string().describe("规则ID"),
        baseHash: z.string().optional().describe("mijia_get_graph 返回的 hash，用于拒绝过期修改"),
        add: z.string().optional().describe("新增节点的紧凑文本"),
        replace: z.string().optional().describe("替换已有节点的紧凑文本"),
        merge: z.array(GraphMergeSchema).optional().describe("局部合并的节点字段"),
        removeIds: z.array(z.string()).optional().describe("要删除的节点 ID"),
        note: z.array(z.object({
          section: z.string().optional(),
          append: z.string().optional(),
          replace: z.string().optional(),
          with: z.string().optional(),
          changelog: z.string().optional(),
          set: z.string().optional(),
        })).optional().describe("备注操作"),
        noteId: z.string().optional().describe("要修改的备注节点 ID，缺省为第一个备注"),
        variables: z.array(z.object({
          id: z.string().regex(/^[a-zA-Z0-9]+$/),
          scope: z.string().default("rule"),
          type: z.enum(["number", "string"]),
          value: z.union([z.number(), z.string()]),
          name: z.string().optional(),
        })).optional().describe("需要的变量；不存在时创建"),
        upsert: z.array(GraphNodeSchema).optional().describe("新增或整体替换的完整 JSON 节点（兼容）"),
        positions: PositionsSchema.optional().describe("只改卡片位置"),
        baseLayoutHash: z.string().optional().describe("读取时的 layoutHash，用于拒绝覆盖他人挪动的位置"),
        layout: LayoutOptionsSchema.optional().describe("布局方式，默认只摆放新卡片"),
        verifyLayout: z.boolean().optional().describe("写入后回读确认坐标已保存（多一次网关往返，默认不做）"),
        dryRun: z.boolean().optional().describe("只预览，不写入"),
        name: z.string().min(1).optional().describe("新规则名称"),
        enable: z.boolean().optional().describe("是否启用"),
      }),
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
        idempotentHint: false,
        openWorldHint: true,
      },
    },
    async ({ id, baseHash, baseLayoutHash, add, replace, merge, removeIds, note, noteId, variables, upsert, positions, layout, verifyLayout, dryRun, name, enable }) => {
      try {
        gatewayManager.ensureConnected();
        for (const variable of variables || []) {
          if (typeof variable.value !== variable.type) return textResult(`Error: 变量 ${variable.id} 的初始值类型必须是 ${variable.type} (patch_graph)`, undefined, true);
        }
        const hasNodeChange = Boolean(add || replace || merge?.length || removeIds?.length || note?.length || variables?.length || upsert?.length || (positions && Object.keys(positions).length) || layout?.mode === "full");
        if (hasNodeChange) {
          const result = await patchGraphV2(gatewayManager.gateway!, id, {
            baseHash, baseLayoutHash, add, replace, merge, removeIds, note, noteId, upsert, positions, layout, verifyLayout, dryRun,
            variables: variables as Array<{ id: string; scope: string; type: "number" | "string"; value: number | string; name?: string }> | undefined,
          });
          if (!result.success) return errorResult(new Error(result.error), "patch_graph");
          if (!dryRun && (name !== undefined || enable !== undefined)) {
            const meta = await updateGraph(gatewayManager.gateway!, id, { name, enable });
            if (!meta.success) return errorResult(new Error(meta.error), "patch_graph");
          }
          return jsonResult({ ...result.data! }, { hint: "改动过多，请分批提交" });
        }
        if (name === undefined && enable === undefined) return jsonResult({ graphId: id, message: "无变化" });
        const meta = await updateGraph(gatewayManager.gateway!, id, { name, enable });
        if (!meta.success) return errorResult(new Error(meta.error), "patch_graph");
        return jsonResult({ graphId: id, message: meta.message ?? "已更新" });
      } catch (error) {
        return errorResult(error, "patch_graph");
      }
    }
  );

  // ==================== mijia_put_graph_text ====================
  server.registerTool(
    "mijia_put_graph_text",
    {
      title: "用紧凑文本替换规则",
      description: `用一份完整的紧凑文本（mijia_get_graph format=text 的格式）替换规则内容，是「规则文件」工作流的服务端：本地 .rule 文件改完后由 scripts/rules.mjs push 调用。

服务端解析文本、按差异计算新增/修改/删除、创建 var 声明的变量、执行结构与能力校验、保留卡片坐标并给新卡片找空位后写入，返回改动明细、布局检查和写入后的规范文本。必须传 baseHash，网关上的规则在此期间被改过时拒绝写入。dryRun=true 只预览。`,
      inputSchema: z.object({
        id: z.string().describe("规则ID"),
        baseHash: z.string().describe("拉取文本时的 hash"),
        baseLayoutHash: z.string().optional().describe("拉取文本时的 layoutHash"),
        text: z.string().describe("完整紧凑文本"),
        layout: LayoutOptionsSchema.optional().describe("布局方式，默认只摆放新卡片"),
        dryRun: z.boolean().optional().describe("只预览，不写入"),
      }),
      annotations: { readOnlyHint: false, destructiveHint: true, idempotentHint: true, openWorldHint: true },
    },
    async ({ id, baseHash, baseLayoutHash, text, layout, dryRun }) => {
      try {
        gatewayManager.ensureConnected();
        const result = await putGraphText(gatewayManager.gateway!, id, { text, baseHash, baseLayoutHash, layout, dryRun });
        if (!result.success) return errorResult(new Error(result.error), "put_graph_text");
        return jsonResult({ ...result.data! });
      } catch (error) {
        return errorResult(error, "put_graph_text");
      }
    }
  );

  // ==================== mijia_query_rules ====================
  server.registerTool(
    "mijia_query_rules",
    {
      title: "跨规则查询节点",
      description: `在服务端扫描全部规则，只返回命中的节点（紧凑文本），不把整张规则传回对话。

条件可组合（同时满足）：
  - variable: "$livingOccupied"（全局）、"$R1234.x"（指定作用域）或 "x"（任意作用域）
  - device: did 或设备名称；property: "siid/piid"
  - nodeType: 节点类型，如 varChange
  - contains: 节点文本包含的字符串
  - graphs: 只查这些规则
返回：{scanned, hits:[{graphId, name, enable, lines}]}`,
      inputSchema: z.object({
        variable: z.string().optional(),
        device: z.string().optional(),
        property: z.string().optional(),
        nodeType: z.string().optional(),
        contains: z.string().optional(),
        graphs: z.array(z.string()).optional(),
      }),
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true },
    },
    async (query) => {
      try {
        gatewayManager.ensureConnected();
        const result = await queryRules(gatewayManager.gateway!, query);
        if (!result.success) return errorResult(new Error(result.error), "query_rules");
        return jsonResult({ ...result.data! }, { hint: "命中过多，请增加条件或限定 graphs" });
      } catch (error) {
        return errorResult(error, "query_rules");
      }
    }
  );

  // ==================== mijia_get_log ====================
  server.registerTool(
    "mijia_get_log",
    {
      title: "查看规则执行日志",
      description: `读取网关执行日志并在服务端过滤，只返回需要的几行。网关日志只记录规则执行（连线触发和节点取值），不记录设备自身的上报。

  - graph: 规则ID；nodes: 只看这些节点
  - minutes: 最近多少分钟，默认 60
  - limit: 最多返回多少行（取最新），默认 200
  - summary=true: 只返回各节点执行次数，用来快速找出执行链在哪一步断开
时间为 UTC+8。行格式：「时间 源节点.端口 -> 目标节点.端口」或「时间 节点 = 值」`,
      inputSchema: z.object({
        graph: z.string().optional(),
        nodes: z.array(z.string()).optional(),
        minutes: z.number().positive().max(10080).optional(),
        limit: z.number().int().positive().max(2000).optional(),
        summary: z.boolean().optional(),
      }),
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true },
    },
    async (query) => {
      try {
        gatewayManager.ensureConnected();
        const result = await getGraphLog(gatewayManager.gateway!, query);
        if (!result.success) return errorResult(new Error(result.error), "get_log");
        return jsonResult({ ...result.data! }, { hint: "请缩短 minutes、减少 limit 或指定 graph/nodes" });
      } catch (error) {
        return errorResult(error, "get_log");
      }
    }
  );

  // ==================== mijia_create_graph ====================
  server.registerTool(
    "mijia_create_graph",
    {
      title: "创建自动化规则",
      description: `创建新的自动化规则。

注意：在调用此工具前，你必须先阅读并理解 mijia-automation Skill 中的规则创建指南（使用 Skill 工具加载）。该 Skill 包含：
- 完整的节点类型模板（deviceInput, deviceOutput, condition, timeRange, delay 等）
- 节点连接规则（outputs 格式、state/event 节点区别）
- 关键校验规则（节点ID格式、inputs/outputs 要求）
- dtype 映射规则（bool/int/float/string）
- 设备控制常见模式

只有理解这些规则后才能正确构建 nodes 数组。小规则可直接使用本工具；超过 10 个节点的复杂规则应使用 graph_draft 工具分块上传，避免在上下文中重复传输完整节点图。

系统会自动进行节点布局和连接完整性校验。创建前可用 mijia_validate_graph / mijia_validate_graph_capabilities 预检（后者接受同样的 variables，用于校验 scope="rule" 的引用）。

参数：
  - name (string): 规则名称
  - text (string, 推荐): 紧凑文本（见 mijia-automation Skill 的「规则文本格式」），支持 var 声明与 @tts/@pulse 宏，与 nodes 二选一
  - nodes (array): 节点列表，包含触发器、条件、动作等（必须符合 mijia-automation Skill 中的模板规范）
  - variables (array, optional): 同时创建的本规则变量；节点中使用 scope="rule"，系统会替换为真实作用域
  - enable (boolean, optional): 是否立即启用，默认 true

返回：
  - graphId: 创建的规则ID

错误处理：
  - "规则校验失败" - 节点连接不完整或不符合规范
  - "网关未连接" - 请先调用 mijia_auth`,
      inputSchema: z.object({
        name: z.string().min(1).describe("规则名称"),
        nodes: z.array(z.any()).optional().describe("节点列表（与 text 二选一）"),
        text: z.string().optional().describe("紧凑文本（与 nodes 二选一，推荐）；$R.名 指本规则变量，var $R.名 声明的变量随规则一起创建"),
        variables: z.array(GraphVariableSchema).optional().describe("本规则变量定义；节点引用时 scope 使用 rule"),
        enable: z.boolean().default(true).describe("是否启用，默认 true"),
      }),
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: true,
      },
    },
    async ({ name, nodes, text, variables, enable }) => {
      try {
        gatewayManager.ensureConnected();
        if (!nodes === !text) return textResult("Error: nodes 与 text 必须且只能提供一个 (create_graph)", undefined, true);
        let createNodes = nodes as GraphNode[] | undefined;
        let createVariables = variables;
        if (text) {
          const ctx = await buildTextContext(gatewayManager.gateway!, "rule", [], text);
          ctx.scope = "rule";
          const parsed = textToNodes(text, ctx);
          const foreign = parsed.variables.filter((variable) => variable.scope !== "rule");
          if (foreign.length > 0) return textResult(`Error: 新建规则的 var 只能声明本规则变量（$R.名），全局变量请先用 mijia_create_variable 创建：${foreign.map((v) => `${v.scope}/${v.id}`).join(", ")} (create_graph)`, undefined, true);
          createNodes = parsed.nodes;
          createVariables = [...(variables || []), ...parsed.variables.map(({ id, type, value, name: label }) => ({ id, type, value, ...(label ? { name: label } : {}) }))] as typeof variables;
        }
        const result = await createGraph(gatewayManager.gateway!, { name, nodes: createNodes!, variables: createVariables, enable });
        if (!result.success) return errorResult(new Error(result.error), "create_graph");

        return jsonResult({ graphId: result.data?.graphId, message: result.message });
      } catch (error) {
        return errorResult(error, "create_graph");
      }
    }
  );

  server.registerTool(
    "mijia_graph_draft_begin",
    {
      title: "开始复杂规则草稿",
      description: "为复杂规则创建内存草稿。超过 10 个节点时优先使用：先开始草稿，再分块追加节点，最后仅用 draftId 提交。草稿 30 分钟后自动过期。",
      inputSchema: z.object({
        name: z.string().min(1).describe("规则名称"),
        variables: z.array(GraphVariableSchema).optional().describe("本规则变量定义；节点引用时 scope 使用 rule"),
        enable: z.boolean().default(true).describe("创建后是否启用"),
      }),
      annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: false },
    },
    async ({ name, variables, enable }) => {
      try {
        const draftId = drafts.begin({ name, variables, enable });
        return jsonResult({ draftId, nodeCount: 0, message: "草稿已创建，请分块追加节点" });
      } catch (error) {
        return errorResult(error, "graph_draft_begin");
      }
    }
  );

  server.registerTool(
    "mijia_graph_draft_append",
    {
      title: "追加复杂规则节点",
      description: "向规则草稿追加一小批节点。每个节点只需上传一次；建议每批 5 至 10 个节点，单批不超过 128 KiB。相同节点重试视为成功，内容变化时使用 edit。",
      inputSchema: z.object({
        draftId: z.string().uuid().describe("草稿 ID"),
        nodes: z.array(GraphNodeSchema).min(1).max(25).describe("本批节点，最多 25 个"),
      }),
      annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: false },
    },
    async ({ draftId, nodes }) => {
      try {
        const result = drafts.append(draftId, nodes);
        return jsonResult({ draftId, ...result });
      } catch (error) {
        return errorResult(error, "graph_draft_append");
      }
    }
  );

  server.registerTool(
    "mijia_graph_draft_edit",
    {
      title: "编辑复杂规则草稿",
      description: "按节点 ID 替换、增加或删除草稿节点。校验失败后只需修正相关节点，不必重传完整规则。",
      inputSchema: z.object({
        draftId: z.string().uuid().describe("草稿 ID"),
        upsert: z.array(GraphNodeSchema).max(25).optional().describe("新增或替换的节点"),
        removeIds: z.array(z.string()).max(25).optional().describe("要删除的节点 ID"),
      }),
      annotations: { readOnlyHint: false, destructiveHint: true, idempotentHint: true, openWorldHint: false },
    },
    async ({ draftId, upsert = [], removeIds = [] }) => {
      try {
        const output = drafts.edit(draftId, upsert, removeIds);
        return jsonResult({ ...output });
      } catch (error) {
        return errorResult(error, "graph_draft_edit");
      }
    }
  );

  server.registerTool(
    "mijia_graph_draft_status",
    {
      title: "查看复杂规则草稿状态",
      description: "返回草稿状态、节点数量、节点 ID、过期时间和已创建的规则 ID，不返回完整节点内容。",
      inputSchema: z.object({ draftId: z.string().uuid().describe("草稿 ID") }),
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    },
    async ({ draftId }) => {
      try {
        const output = drafts.status(draftId);
        return jsonResult({ ...output });
      } catch (error) {
        return errorResult(error, "graph_draft_status");
      }
    }
  );

  server.registerTool(
    "mijia_graph_draft_commit",
    {
      title: "校验并提交复杂规则草稿",
      description: "仅传 draftId，服务端会对完整草稿执行结构校验、真实设备能力校验、自动布局和规则创建。成功后保留提交结果供幂等重试，失败时恢复为可编辑状态。",
      inputSchema: z.object({ draftId: z.string().uuid().describe("草稿 ID") }),
      annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: true },
    },
    async ({ draftId }) => {
      let commitToken: string | undefined;
      try {
        gatewayManager.ensureConnected();
        const commit = drafts.beginCommit(draftId);
        commitToken = commit.commitToken;
        if (commit.committedGraphId) {
          return jsonResult({ graphId: commit.committedGraphId, message: "草稿已提交" });
        }
        const result = await createGraph(gatewayManager.gateway!, commit.input!);
        if (!result.success) {
          return textResult(restoreDraftError(draftId, commitToken, new Error(result.error)), undefined, true);
        }
        const summary = drafts.completeCommit(draftId, result.data!.graphId, commitToken);
        return jsonResult({ graphId: summary.graphId, nodeCount: summary.nodeCount, message: result.message });
      } catch (error) {
        return textResult(restoreDraftError(draftId, commitToken, error), undefined, true);
      }
    }
  );

  server.registerTool(
    "mijia_graph_draft_discard",
    {
      title: "丢弃复杂规则草稿",
      description: "丢弃尚未提交或已提交的临时草稿记录，不删除已创建的网关规则或变量。",
      inputSchema: z.object({ draftId: z.string().uuid().describe("草稿 ID") }),
      annotations: { readOnlyHint: false, destructiveHint: true, idempotentHint: true, openWorldHint: false },
    },
    async ({ draftId }) => {
      try {
        const discarded = drafts.delete(draftId);
        return jsonResult({ draftId, discarded });
      } catch (error) {
        return errorResult(error, "graph_draft_discard");
      }
    }
  );

  // ==================== mijia_update_graph ====================
  server.registerTool(
    "mijia_update_graph",
    {
      title: "更新自动化规则",
      description: `更新现有自动化规则（兼容保留）。修改节点请优先使用 mijia_patch_graph，只发送变化的节点；本工具的 nodes 必须是完整节点列表，会整体替换。

注意：如果更新 nodes 节点列表，你必须先阅读并理解 mijia-automation Skill 中的规则创建指南（使用 Skill 工具加载）。只更新名称或启用状态时无需加载 Skill。

参数：
  - id (string): 规则ID
  - name (string, optional): 新规则名称
  - nodes (array, optional): 完整的新节点列表（必须符合 mijia-automation Skill 中的模板规范）
  - enable (boolean, optional): 是否启用

更新 nodes 时会自动进行节点布局（保留原有位置信息）、连接完整性校验与设备能力校验。`,
      inputSchema: z.object({
        id: z.string().describe("规则ID"),
        name: z.string().optional().describe("新规则名称"),
        nodes: z.array(z.any()).optional().describe("完整的新节点列表"),
        enable: z.boolean().optional().describe("是否启用"),
      }),
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
        idempotentHint: false,
        openWorldHint: true,
      },
    },
    async ({ id, name, nodes, enable }) => {
      try {
        gatewayManager.ensureConnected();
        const result = await updateGraph(gatewayManager.gateway!, id, { name, nodes, enable });
        if (!result.success) return errorResult(new Error(result.error), "update_graph");

        return textResult(result.message || "更新成功", { success: true });
      } catch (error) {
        return errorResult(error, "update_graph");
      }
    }
  );

  // ==================== mijia_delete_graph ====================
  server.registerTool(
    "mijia_delete_graph",
    {
      title: "删除自动化规则",
      description: `删除指定的自动化规则，并清理对应的本规则变量作用域。

此操作不可恢复，请确认后再执行。

参数：
  - id (string): 规则ID`,
      inputSchema: z.object({
        id: z.string().describe("规则ID"),
      }),
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    async ({ id }) => {
      try {
        gatewayManager.ensureConnected();
        const result = await deleteGraph(gatewayManager.gateway!, id);
        if (!result.success) return errorResult(new Error(result.error), "delete_graph");

        return textResult(result.message || "删除成功", { success: true, id });
      } catch (error) {
        return errorResult(error, "delete_graph");
      }
    }
  );

  // ==================== mijia_toggle_graph ====================
  server.registerTool(
    "mijia_toggle_graph",
    {
      title: "切换规则状态",
      description: `启用或禁用指定的自动化规则。

参数：
  - id (string): 规则ID
  - enable (boolean): 是否启用`,
      inputSchema: z.object({
        id: z.string().describe("规则ID"),
        enable: z.boolean().describe("是否启用"),
      }),
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    async ({ id, enable }) => {
      try {
        gatewayManager.ensureConnected();
        const result = await toggleGraph(gatewayManager.gateway!, id, enable);
        if (!result.success) return errorResult(new Error(result.error), "toggle_graph");

        return textResult(result.message || (enable ? "规则已启用 [启用]" : "规则已禁用 [禁用]"), { success: true, id, enable });
      } catch (error) {
        return errorResult(error, "toggle_graph");
      }
    }
  );

  // ==================== mijia_validate_graph ====================
  server.registerTool(
    "mijia_validate_graph",
    {
      title: "校验规则完整性",
      description: `校验自动化规则的节点连接完整性（结构校验，不检查设备能力；设备与变量引用请用 mijia_validate_graph_capabilities）。

注意：在调用此工具前，建议先阅读 mijia-automation Skill 了解节点构建规范（使用 Skill 工具加载）。

此校验器会检查 mijia-automation Skill 中定义的关键规则：
- 节点 ID 格式（只允许 [0-9a-zA-Z]）
- outputs 连接格式（必须是 "nodeId.inputPort" 点分隔格式）
- state 节点 vs event 节点的正确使用
- deviceGet 必须有 output 和 output2
- condition 必须有 trigger 和 condition 两个输入源
- delay 节点的 inputs 必须用 "input" 而非 "trigger"
- timeRange 可连接 condition.condition，或经 logicOr/logicAnd/logicNot 最终连接 condition.condition
- 所有节点的 props、inputs、outputs 必须存在

二选一：
  - id: 校验网关中已保存的规则（服务端读取，无需上传整图）
  - graph: {id, nodes, cfg?}，cfg 可省略

返回紧凑 JSON：{valid, errorCount, warningCount, errors:[{nodeId,type,message}], warnings}`,
      inputSchema: z.object({
        id: z.string().optional().describe("已保存规则的 ID（与 graph 二选一）"),
        graph: z.object({
          id: z.string().describe("规则ID"),
          nodes: z.array(z.any()).describe("节点列表"),
          cfg: z.any().optional().describe("规则配置，可省略"),
        }).optional().describe("待校验规则对象（与 id 二选一）"),
      }),
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    async ({ id, graph }) => {
      try {
        if (!graph && !id) return textResult("Error: 必须提供 id 或 graph 之一 (validate_graph)", undefined, true);
        let target: Graph;
        if (graph) {
          target = withDefaultCfg(graph);
        } else {
          gatewayManager.ensureConnected();
          const loaded = await loadGraph(id!);
          if (!loaded.graph) return errorResult(new Error(loaded.error), "validate_graph");
          target = loaded.graph;
        }
        const issues = validateGraph(target);
        const errorList = issues.filter((e) => e.level === "error");
        const warnList = issues.filter((e) => e.level === "warn");
        const output = {
          valid: errorList.length === 0,
          errorCount: errorList.length,
          warningCount: warnList.length,
          errors: compactIssues(errorList),
          warnings: compactIssues(warnList),
        };
        return jsonResult(output, { hint: VALIDATE_HINT });
      } catch (error) {
        return errorResult(error, "validate_graph");
      }
    }
  );

  // ==================== mijia_check_layout ====================
  server.registerTool(
    "mijia_check_layout",
    {
      title: "检查规则卡片布局",
      description: `只读检查规则的卡片布局，不写入网关。可检查已保存的规则（id），也可预览一次修改后的布局（id + positions，或 id + layout）。

返回：
  - overlaps: 按已保存尺寸确定重叠的卡片对
  - possibleOverlaps: 按类型尺寸上限（原生画布可能把卡片画得更大）可能重叠或间距不足 24 像素的卡片对
  - edgesThroughCards: 估计穿过无关卡片的连线
  - crossings: 估计的连线交叉数；backEdges: 向左回连的连线数（回路，正常）
  - regions: 互不相连的分区及其范围
  - placed / moved: 预览时会被摆放或移动的卡片
  - layoutHash: 卡片位置哈希，挪卡片时传给 mijia_patch_graph 的 baseLayoutHash
连线按水平贝塞尔曲线近似，穿卡和交叉为估计值，不代表原生网页实际显示；这些指标只用于判断是否便于维护，不是规则逻辑错误。`,
      inputSchema: z.object({
        id: z.string().describe("规则ID"),
        positions: PositionsSchema.optional().describe("预览这些位置修改"),
        layout: LayoutOptionsSchema.optional().describe("预览布局方式，如 {mode:'full'}"),
        limit: z.number().int().min(1).max(200).optional().default(30).describe("每类问题最多列出几条"),
      }),
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true },
    },
    async ({ id, positions, layout, limit = 30 }) => {
      try {
        gatewayManager.ensureConnected();
        const loaded = await loadGraph(id);
        if (!loaded.graph) return errorResult(new Error(loaded.error), "check_layout");
        let nodes = loaded.graph.nodes;
        if (positions) {
          for (const nodeId of Object.keys(positions)) {
            if (!nodes.some((node) => node.id === nodeId)) return textResult(`Error: positions 中的节点 ${nodeId} 不存在 (check_layout)`, undefined, true);
          }
          nodes = nodes.map((node) => positions[node.id]
            ? { ...node, cfg: { ...node.cfg, pos: { ...((node.cfg as Record<string, unknown>).pos as object || {}), ...positions[node.id] } } }
            : node);
        }
        const arranged = arrangeNodes(nodes, layout);
        const report = arranged.report;
        return jsonResult({
          id,
          layoutHash: layoutHash(arranged.nodes),
          nodeCount: report.nodeCount,
          placed: arranged.placedIds,
          moved: positionChangedIds(loaded.graph.nodes, arranged.nodes),
          overlaps: report.overlaps.slice(0, limit),
          overlapCount: report.overlaps.length,
          possibleOverlaps: report.possibleOverlaps.slice(0, limit),
          possibleOverlapCount: report.possibleOverlaps.length,
          edgesThroughCards: report.edgesThroughCards.slice(0, limit),
          edgesThroughCardCount: report.edgesThroughCards.length,
          crossings: report.crossings,
          backEdges: report.backEdges,
          regions: report.regions.map((region) => ({ count: region.ids.length, first: region.ids[0], box: region.box })),
          missingPositions: report.missingPositions,
          model: report.model,
        });
      } catch (error) {
        return errorResult(error, "check_layout");
      }
    }
  );
}