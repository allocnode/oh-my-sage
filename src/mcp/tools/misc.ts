/**
 * MCP Server - maintenance/debug tools.
 */

import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { GatewayManager } from "../../core/gateway/manager.js";
import { callGatewayApi } from "../../core/index.js";
import { MAX_RESULT_BYTES, jsonResult, errorResult } from "../utils.js";

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
  - timeout: 超时时间毫秒，默认 10000
  - max_bytes: 结果文本上限（字节），默认且最大 40000；超出会截断，请缩小 params 范围

Returns: 紧凑 JSON {method, params, result}`,
      inputSchema: z.object({
        method: z.string().min(1).describe("API 方法名"),
        params: z.record(z.unknown()).default({}).describe("参数对象"),
        timeout: z.number().int().positive().default(10000).describe("超时时间毫秒"),
        max_bytes: z.number().int().min(1000).max(MAX_RESULT_BYTES).optional().default(MAX_RESULT_BYTES).describe("结果文本上限（字节），默认且最大 40000"),
      }),
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    async ({ method, params = {}, timeout = 10000, max_bytes = MAX_RESULT_BYTES }) => {
      try {
        gatewayManager.ensureConnected();
        const result = await callGatewayApi(
          gatewayManager.gateway!,
          method,
          params,
          timeout
        );

        if (!result.success) return errorResult(new Error(result.error), "call_api");

        return jsonResult(
          { method, params, result: result.data },
          { hint: "请缩小 params 范围（如减少 num/条目数）后重试", maxBytes: max_bytes }
        );
      } catch (error) {
        return errorResult(error, "call_api");
      }
    }
  );
}
