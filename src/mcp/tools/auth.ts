/**
 * MCP Server - 认证相关工具
 */

import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { GatewayManager } from "../../core/gateway/manager.js";
import { getConfig } from "../config.js";
import { formatJson, textResult } from "../utils.js";

export function registerAuthTools(
  server: McpServer,
  gatewayManager: GatewayManager
): void {
  const config = getConfig();

  // ==================== mijia_auth ====================
  server.registerTool(
    "mijia_auth",
    {
      title: "连接米家网关",
      description: `连接米家网关并建立认证 Session。

此工具必须在调用其他任何工具之前调用，用于建立与米家网关的安全连接。
建议先调用 mijia_status：若已连接（例如 HTTP 模式下其他会话已登录），可直接使用，无需登录码。

注意：登录码是一次性的：一个登录码只能用于一次认证尝试（成功或失败后即作废）。
每次连接（含断开后重连）都必须向用户索取一个【新的】登录码，不可复用旧码。

Args:
  - passcode (string): 6位数字登录码，从网关设备上获取
  - gateway_url (string, optional): 网关地址。未提供时使用 MCP 配置的 GATEWAY_URL 环境变量；两者都没有时会返回错误，请提供地址

Returns:
  - success: boolean - 连接是否成功
  - message: string - 连接状态信息

Error Handling:
  - "登录码格式错误" - passcode 不是6位数字
  - "未配置网关地址" - 未提供 gateway_url 且未设置 GATEWAY_URL，请提供网关地址
  - "网关已连接且可直接使用" - 已有连接（可能来自其他会话），直接调用其他工具即可
  - "网关连接失败" - 无法连接到网关地址
  - "登录码已被使用或无效" - 登录码一次性，需重新获取新登录码`,
      inputSchema: z.object({
        passcode: z.string().regex(/^\d{6}$/, "必须是6位数字").describe("6位数字登录码（一次性，每次连接都需新的）"),
        gateway_url: z.string().url().optional().describe("网关地址，可选；缺省时使用 GATEWAY_URL 环境变量，两者都无则报错"),
      }),
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: true,
      },
    },
    async ({ passcode, gateway_url }) => {
      if (gatewayManager.isConnected()) {
        // HTTP 模式下多个客户端共享同一网关连接：新会话无需登录码即可直接使用
        return textResult(
          formatJson({
            success: false,
            connected: true,
            error: "网关已连接且可直接使用，无需再次认证（不需要登录码）；如确需更换网关或重新登录，请先调用 mijia_disconnect",
          }),
          undefined,
          true
        );
      }
      try {
        const url = gateway_url || config.gatewayUrl;
        if (!url) {
          return textResult(formatJson({ success: false, error: "未配置网关地址：请在 gateway_url 参数中提供网关地址，或在 MCP 配置里设置 GATEWAY_URL 环境变量" }), undefined, true);
        }
        await gatewayManager.connect(passcode, url);
        return textResult(
          formatJson({ success: true, message: "连接成功", gateway_url: url }),
          { success: true, connected: true, gateway_url: url }
        );
      } catch (error) {
        return textResult(formatJson({ success: false, error: String(error) }), undefined, true);
      }
    }
  );

  // ==================== mijia_disconnect ====================
  server.registerTool(
    "mijia_disconnect",
    {
      title: "断开网关连接",
      description: `断开与米家网关的连接。

调用后可重新调用 mijia_auth 建立新连接。建议在完成所有操作后调用以释放资源。`,
      inputSchema: z.object({}),
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    async () => {
      try {
        await gatewayManager.disconnect();
        return textResult(formatJson({ success: true, message: "已断开" }), { success: true, connected: false });
      } catch (error) {
        return textResult(formatJson({ success: false, error: String(error) }), undefined, true);
      }
    }
  );

  // ==================== mijia_status ====================
  server.registerTool(
    "mijia_status",
    {
      title: "检查连接状态",
      description: `检查与米家网关的连接状态。

已连接时可直接调用其他工具，无需 mijia_auth；未连接时需向用户索取新的登录码后调用 mijia_auth。

Returns:
  - connected: boolean - 是否已连接（反映网关连接的实时状态）`,
      inputSchema: z.object({}),
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    async () => {
      const connected = gatewayManager.isConnected();
      return textResult(formatJson({ connected }), { connected });
    }
  );
}
