/**
 * MCP 服务 - 变量管理工具
 */

import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { GatewayManager } from "../../core/gateway/manager.js";
import { getVariables, setVariable, createVariable, deleteVariable, getVariableValue, getVariableConfig } from "../../core/index.js";
import {
  ResponseFormatSchema,
  formatJson,
  textResult,
  jsonResult,
  errorResult,
  formatVariableListMarkdown,
} from "../utils.js";

export const CreateVariableToolInputSchema = z.object({
  id: z.string().regex(/^[a-zA-Z0-9]+$/, "id 必须是纯字母数字，不能含下划线/连字符").describe("变量ID，纯字母数字"),
  type: z.enum(["number", "string"]).describe("变量类型"),
  value: z.union([z.string(), z.number()]).describe("初始值"),
  name: z.string().trim().min(1, "name 不能为空").optional().describe("显示名称，可选，默认与 id 相同"),
  scope: z.string().default("global").describe("变量作用域，默认 global"),
});

export const CreateVariableInputSchema = CreateVariableToolInputSchema.refine(
  ({ type, value }) => typeof value === type,
  { message: "value 必须与 type 匹配", path: ["value"] }
);

const VARIABLE_HINT = "变量过多，请用 mijia_get_variable_value 按 id 单独查询";

/** 把核心层返回值包装为对象，便于作为 structuredContent */
function asRecord(data: unknown): Record<string, unknown> {
  return data && typeof data === "object" && !Array.isArray(data) ? (data as Record<string, unknown>) : { value: data };
}

export function registerVariableTools(
  server: McpServer,
  gatewayManager: GatewayManager
): void {
  // ==================== mijia_get_variables ====================
  server.registerTool(
    "mijia_get_variables",
    {
      title: "获取变量列表",
      description: `获取自动化变量列表。

变量可用于规则间的数据传递和状态存储。

参数：
  - scope (string, optional): 变量作用域，默认 "global"
  - response_format: markdown 每个变量一行；json 为紧凑 JSON {count, scope, variables}`,
      inputSchema: z.object({
        scope: z.string().default("global").describe("变量作用域，默认 global"),
        response_format: ResponseFormatSchema.optional().default("markdown").describe("输出格式"),
      }),
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    async ({ scope = "global", response_format = "markdown" }) => {
      try {
        gatewayManager.ensureConnected();
        const result = await getVariables(gatewayManager.gateway!, scope);
        if (!result.success) return errorResult(new Error(result.error), "get_variables");

        const variables = result.data ?? [];
        const output = { count: variables.length, scope, variables };

        if (response_format === "json") return jsonResult(output, { hint: VARIABLE_HINT });
        return textResult(formatVariableListMarkdown(variables, scope), output, false, { hint: VARIABLE_HINT });
      } catch (error) {
        return errorResult(error, "get_variables");
      }
    }
  );

  // ==================== mijia_set_variable ====================
  server.registerTool(
    "mijia_set_variable",
    {
      title: "设置变量值",
      description: `设置自动化变量的值。

参数：
  - id (string): 变量ID
  - value (string | number): 变量值
  - scope (string, optional): 变量作用域，默认 "global"`,
      inputSchema: z.object({
        id: z.string().describe("变量ID"),
        value: z.union([z.string(), z.number()]).describe("变量值"),
        scope: z.string().default("global").describe("变量作用域，默认 global"),
      }),
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    async ({ id, value, scope = "global" }) => {
      try {
        gatewayManager.ensureConnected();
        const result = await setVariable(gatewayManager.gateway!, id, value, scope);
        if (!result.success) return errorResult(new Error(result.error), "set_variable");

        return textResult(result.message || `变量 ${id} 已更新为 ${value}`, { success: true, id, value, scope });
      } catch (error) {
        return errorResult(error, "set_variable");
      }
    }
  );

  // ==================== mijia_create_variable ====================
  server.registerTool(
    "mijia_create_variable",
    {
      title: "创建变量",
      description: `创建一个新的自动化变量。

注意：网关要求 id 必须是纯字母数字（不能含下划线、连字符或中文），否则返回 "Invalid id format"。

参数：
  - id (string): 变量ID，纯字母数字
  - type (string): "number" 或 "string"
  - value (string | number): 初始值
  - name (string, optional): 显示名称（可含中文），默认与 id 相同
  - scope (string, optional): 变量作用域，默认 "global"`,
      inputSchema: CreateVariableToolInputSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: true,
      },
    },
    async ({ id, type, value, name, scope = "global" }) => {
      try {
        const parsed = CreateVariableInputSchema.safeParse({ id, type, value, name, scope });
        if (!parsed.success) {
          return textResult(parsed.error.issues.map((issue) => issue.message).join("；"), undefined, true);
        }
        gatewayManager.ensureConnected();
        const result = await createVariable(gatewayManager.gateway!, id, type, value, name, scope);
        if (!result.success) return errorResult(new Error(result.error), "create_variable");

        return textResult(result.message || `变量 ${id} 创建成功`, { success: true, id, type, value, scope });
      } catch (error) {
        return errorResult(error, "create_variable");
      }
    }
  );

  // ==================== mijia_delete_variable ====================
  server.registerTool(
    "mijia_delete_variable",
    {
      title: "删除变量",
      description: `删除一个自动化变量。删除前会扫描全部规则；仍被引用或无法完成引用检查时会拒绝删除。

参数：
  - id (string): 变量ID
  - scope (string, optional): 变量作用域，默认 "global"`,
      inputSchema: z.object({
        id: z.string().describe("变量ID"),
        scope: z.string().default("global").describe("变量作用域，默认 global"),
      }),
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    async ({ id, scope = "global" }) => {
      try {
        gatewayManager.ensureConnected();
        const result = await deleteVariable(gatewayManager.gateway!, id, scope);
        if (!result.success) return errorResult(new Error(result.error), "delete_variable");

        return textResult(result.message || `变量 ${id} 删除成功`, { success: true, id, scope });
      } catch (error) {
        return errorResult(error, "delete_variable");
      }
    }
  );

  // ==================== mijia_get_variable_value ====================
  server.registerTool(
    "mijia_get_variable_value",
    {
      title: "获取变量当前值",
      description: `获取单个变量的当前值。

参数：
  - id (string): 变量ID
  - scope (string, optional): 变量作用域，默认 "global"`,
      inputSchema: z.object({
        id: z.string().describe("变量ID"),
        scope: z.string().default("global").describe("变量作用域，默认 global"),
      }),
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    async ({ id, scope = "global" }) => {
      try {
        gatewayManager.ensureConnected();
        const result = await getVariableValue(gatewayManager.gateway!, id, scope);
        if (!result.success) return errorResult(new Error(result.error), "get_variable_value");

        return textResult(formatJson(result.data), asRecord(result.data));
      } catch (error) {
        return errorResult(error, "get_variable_value");
      }
    }
  );

  // ==================== mijia_get_variable_config ====================
  server.registerTool(
    "mijia_get_variable_config",
    {
      title: "获取变量配置",
      description: `获取单个变量的配置（类型、显示名称等）。

参数：
  - id (string): 变量ID
  - scope (string, optional): 变量作用域，默认 "global"`,
      inputSchema: z.object({
        id: z.string().describe("变量ID"),
        scope: z.string().default("global").describe("变量作用域，默认 global"),
      }),
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    async ({ id, scope = "global" }) => {
      try {
        gatewayManager.ensureConnected();
        const result = await getVariableConfig(gatewayManager.gateway!, id, scope);
        if (!result.success) return errorResult(new Error(result.error), "get_variable_config");

        return textResult(formatJson(result.data), asRecord(result.data));
      } catch (error) {
        return errorResult(error, "get_variable_config");
      }
    }
  );
}
