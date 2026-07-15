/**
 * MCP Server - maintenance/debug tools.
 */

import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { GatewayManager } from "../../core/gateway/manager.js";
import { callGatewayApi } from "../../core/index.js";
import { formatJson, handleError } from "../utils.js";

export function registerMiscTools(
  server: McpServer,
  gatewayManager: GatewayManager
): void {
  server.registerTool(
    "mijia_call_api",
    {
      title: "调用原始网关 API",
      description: `维护/排障用：直接调用米家网关原始 API 方法。

默认只允许 get* 读取方法。set*/create*/delete*/load* 等可能修改状态的方法，必须由用户明确授权并设置 allow_mutation=true。
普通设备和自动化操作优先使用专用工具。

只读示例：
- getVarScopeList: {}
- getVarList: {"scope":"global"}
- getLog: {"num":0}
- getBackupList: {"from":"fds"}

Args:
  - method: API 方法名
  - params: 参数对象，默认 {}
  - timeout: 超时时间毫秒，默认 10000
  - allow_mutation: 是否允许可能修改网关状态的方法，默认 false`,
      inputSchema: z.object({
        method: z.string().min(1).describe("API 方法名"),
        params: z.record(z.unknown()).default({}).describe("参数对象"),
        timeout: z.number().int().positive().default(10000).describe("超时时间毫秒"),
        allow_mutation: z.boolean().default(false).describe("显式允许可能修改状态的方法"),
      }),
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
        idempotentHint: false,
        openWorldHint: true,
      },
    },
    async ({ method, params = {}, timeout = 10000, allow_mutation = false }) => {
      try {
        gatewayManager.ensureConnected();
        const result = await callGatewayApi(
          gatewayManager.gateway!,
          method,
          params,
          timeout,
          allow_mutation
        );

        if (!result.success) {
          return {
            content: [{ type: "text", text: handleError(new Error(result.error), "call_api") }],
            isError: true,
          };
        }

        return {
          content: [{ type: "text", text: formatJson({ method, params, result: result.data }) }],
          structuredContent: { method, params, result: result.data },
        };
      } catch (error) {
        return {
          content: [{ type: "text", text: handleError(error, "call_api") }],
          isError: true,
        };
      }
    }
  );
}
