/**
 * MCP Server - 变量管理工具
 */

import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { GatewayManager } from "../../core/gateway/manager.js";
import { getVariables, setVariable, createVariable, deleteVariable, getVariableValue, getVariableConfig } from "../../core/index.js";
import {
  ResponseFormatSchema,
  formatJson,
  handleError,
  formatVariableListMarkdown,
} from "../utils.js";

export const CreateVariableInputSchema = z.object({
  id: z.string().regex(/^[a-zA-Z0-9]+$/, "id 必须是纯字母数字，不能含下划线/连字符").describe("变量ID，纯字母数字"),
  type: z.enum(["number", "string"]).describe("变量类型"),
  value: z.union([z.string(), z.number()]).describe("初始值"),
  name: z.string().trim().min(1, "name 不能为空").optional().describe("显示名称，可选，默认与 id 相同"),
  scope: z.string().default("global").describe("变量作用域，默认 global"),
}).refine(
  ({ type, value }) => typeof value === type,
  { message: "value 必须与 type 匹配", path: ["value"] }
);

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

Args:
  - scope (string, optional): 变量作用域，默认 "global"`,
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

        if (!result.success) {
          return {
            content: [{ type: "text", text: handleError(new Error(result.error), "get_variables") }],
            isError: true,
          };
        }

        const variables = result.data ?? [];
        const output = { variables, count: variables.length, scope };

        if (response_format === "json") {
          return {
            content: [{ type: "text", text: formatJson(output) }],
            structuredContent: output,
          };
        }

        return {
          content: [{ type: "text", text: formatVariableListMarkdown(variables, scope) }],
          structuredContent: output,
        };
      } catch (error) {
        return {
          content: [{ type: "text", text: handleError(error, "get_variables") }],
          isError: true,
        };
      }
    }
  );

  // ==================== mijia_set_variable ====================
  server.registerTool(
    "mijia_set_variable",
    {
      title: "设置变量值",
      description: `设置自动化变量的值。

Args:
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

        if (!result.success) {
          return {
            content: [{ type: "text", text: handleError(new Error(result.error), "set_variable") }],
            isError: true,
          };
        }

        return {
          content: [{ type: "text", text: result.message || `变量 ${id} 已更新为 ${value}` }],
          structuredContent: { success: true, id, value, scope },
        };
      } catch (error) {
        return {
          content: [{ type: "text", text: handleError(error, "set_variable") }],
          isError: true,
        };
      }
    }
  );

  // ==================== mijia_create_variable ====================
  server.registerTool(
    "mijia_create_variable",
    {
      title: "创建变量",
      description: `创建一个新的自动化变量。

⚠️ 网关要求 id 必须是纯字母数字（不能含下划线、连字符或中文），否则返回 "Invalid id format"。

Args:
  - id (string): 变量ID，纯字母数字
  - type (string): "number" 或 "string"
  - value (string | number): 初始值
  - name (string, optional): 显示名称（可含中文），默认与 id 相同
  - scope (string, optional): 变量作用域，默认 "global"`,
      inputSchema: CreateVariableInputSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: true,
      },
    },
    async ({ id, type, value, name, scope = "global" }) => {
      try {
        gatewayManager.ensureConnected();
        const result = await createVariable(gatewayManager.gateway!, id, type, value, name, scope);

        if (!result.success) {
          return {
            content: [{ type: "text", text: handleError(new Error(result.error), "create_variable") }],
            isError: true,
          };
        }

        return {
          content: [{ type: "text", text: result.message || `变量 ${id} 创建成功` }],
          structuredContent: { success: true, id, type, value, scope },
        };
      } catch (error) {
        return {
          content: [{ type: "text", text: handleError(error, "create_variable") }],
          isError: true,
        };
      }
    }
  );

  // ==================== mijia_delete_variable ====================
  server.registerTool(
    "mijia_delete_variable",
    {
      title: "删除变量",
      description: `删除一个自动化变量。

Args:
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

        if (!result.success) {
          return {
            content: [{ type: "text", text: handleError(new Error(result.error), "delete_variable") }],
            isError: true,
          };
        }

        return {
          content: [{ type: "text", text: result.message || `变量 ${id} 删除成功` }],
          structuredContent: { success: true, id, scope },
        };
      } catch (error) {
        return {
          content: [{ type: "text", text: handleError(error, "delete_variable") }],
          isError: true,
        };
      }
    }
  );

  // ==================== mijia_get_variable_value ====================
  server.registerTool(
    "mijia_get_variable_value",
    {
      title: "获取变量当前值",
      description: `获取单个变量的当前值。

Args:
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

        if (!result.success) {
          return {
            content: [{ type: "text", text: handleError(new Error(result.error), "get_variable_value") }],
            isError: true,
          };
        }

        return {
          content: [{ type: "text", text: formatJson(result.data) }],
          structuredContent: result.data as Record<string, unknown>,
        };
      } catch (error) {
        return {
          content: [{ type: "text", text: handleError(error, "get_variable_value") }],
          isError: true,
        };
      }
    }
  );

  // ==================== mijia_get_variable_config ====================
  server.registerTool(
    "mijia_get_variable_config",
    {
      title: "获取变量配置",
      description: `获取单个变量的配置（类型、显示名称等）。

Args:
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

        if (!result.success) {
          return {
            content: [{ type: "text", text: handleError(new Error(result.error), "get_variable_config") }],
            isError: true,
          };
        }

        return {
          content: [{ type: "text", text: formatJson(result.data) }],
          structuredContent: result.data as Record<string, unknown>,
        };
      } catch (error) {
        return {
          content: [{ type: "text", text: handleError(error, "get_variable_config") }],
          isError: true,
        };
      }
    }
  );
}
