/**
 * MCP Server - 设备管理工具
 */

import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { GatewayManager } from "../../core/gateway/manager.js";
import { getDevices, getDevice } from "../../core/index.js";
import {
  ResponseFormatSchema,
  formatJson,
  handleError,
  formatDeviceListMarkdown,
  formatDeviceDetailsMarkdown,
} from "../utils.js";

export function registerDeviceTools(
  server: McpServer,
  gatewayManager: GatewayManager
): void {
  // ==================== mijia_get_devices ====================
  server.registerTool(
    "mijia_get_devices",
    {
      title: "获取设备列表",
      description: `获取已连接网关下的所有设备列表。

返回设备的基本信息，包括ID、名称、型号、在线状态和房间信息。

Args:
  - response_format (string, optional): 输出格式，"markdown" 或 "json"，默认 "markdown"

Returns:
  - devices: 设备列表
  - count: 设备数量

Error Handling:
  - "网关未连接" - 请先调用 mijia_auth`,
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
        const result = await getDevices(gatewayManager.gateway!);

        if (!result.success) {
          return {
            content: [{ type: "text", text: handleError(new Error(result.error), "get_devices") }],
            isError: true,
          };
        }

        const devices = result.data ?? [];
        const output = { devices, count: devices.length };

        if (response_format === "json") {
          return {
            content: [{ type: "text", text: formatJson(output) }],
            structuredContent: output,
          };
        }

        return {
          content: [{ type: "text", text: formatDeviceListMarkdown(devices, devices.length) }],
          structuredContent: output,
        };
      } catch (error) {
        return {
          content: [{ type: "text", text: handleError(error, "get_devices") }],
          isError: true,
        };
      }
    }
  );

  // ==================== mijia_get_device ====================
  server.registerTool(
    "mijia_get_device",
    {
      title: "获取设备详情",
      description: `获取指定设备的详细信息，包括 MIOT Spec 能力定义。

返回设备的属性、触发事件（含事件参数和取值表）、可执行动作等详细信息。

Args:
  - dids (string[]): 设备ID数组，支持批量查询
  - response_format (string, optional): 输出格式，默认 "markdown"

Returns:
  - devices: 设备详情列表
  - 包含 triggers(可触发能力及事件 arguments), actions(可执行能力), readable(可读属性)

Error Handling:
  - "网关未连接" - 请先调用 mijia_auth
  - "设备不存在" - 指定的设备ID不存在`,
      inputSchema: z.object({
        dids: z.array(z.string()).min(1).describe("设备ID数组"),
        response_format: ResponseFormatSchema.optional().default("markdown").describe("输出格式"),
      }),
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    async ({ dids, response_format = "markdown" }) => {
      try {
        gatewayManager.ensureConnected();
        const result = await getDevice(gatewayManager.gateway!, dids);

        if (!result.success) {
          return {
            content: [{ type: "text", text: handleError(new Error(result.error), "get_device") }],
            isError: true,
          };
        }

        const devices = result.data ?? [];
        const output = { devices, count: devices.length };

        if (response_format === "json") {
          return {
            content: [{ type: "text", text: formatJson(output) }],
            structuredContent: output,
          };
        }

        return {
          content: [{ type: "text", text: formatDeviceDetailsMarkdown(devices) }],
          structuredContent: output,
        };
      } catch (error) {
        return {
          content: [{ type: "text", text: handleError(error, "get_device") }],
          isError: true,
        };
      }
    }
  );
}
