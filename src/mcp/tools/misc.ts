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

只允许调用代码中明确列出的只读方法；写入、删除、恢复以及未知方法都会被拒绝。
普通设备和自动化操作优先使用专用工具。

只读示例：
- getVarScopeList: {}
- getVarList: {"scope":"global"}
- getLog: {"num":0}
- getBackupList: {"from":"fds"}

Args:
  - method: API 方法名
  - params: 参数对象，默认 {}
  - timeout: 超时时间毫秒，默认 10000`,
      inputSchema: z.object({
        method: z.string().min(1).describe("API 方法名"),
        params: z.record(z.unknown()).default({}).describe("参数对象"),
        timeout: z.number().int().positive().default(10000).describe("超时时间毫秒"),
      }),
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    async ({ method, params = {}, timeout = 10000 }) => {
      try {
        gatewayManager.ensureConnected();
        const result = await callGatewayApi(
          gatewayManager.gateway!,
          method,
          params,
          timeout
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
