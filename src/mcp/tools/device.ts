/**
 * MCP Server - 设备管理工具
 */

import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { GatewayManager } from "../../core/gateway/manager.js";
import { getDevices, getDevice, findDeviceUsage } from "../../core/index.js";
import {
  ResponseFormatSchema,
  textResult,
  jsonResult,
  errorResult,
  formatDeviceListMarkdown,
  formatDeviceDetailsMarkdown,
  formatDeviceSummaryMarkdown,
  formatDeviceUsageMarkdown,
  summarizeDevice,
  filterDeviceBySiids,
} from "../utils.js";

const DEVICE_HINT = "可用 siids 只看指定服务，或减少 dids 数量";

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

Returns（紧凑）：
  - markdown: 每台设备一行「名称 (did) | 房间 | 型号 | [在线]/[离线]」
  - json: {count, devices:[{did,name,modelName,online,roomName}]}

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
        if (!result.success) return errorResult(new Error(result.error), "get_devices");

        const devices = (result.data ?? []).map(({ did, name, modelName, online, roomName }) => ({ did, name, modelName, online, roomName }));
        const output = { count: devices.length, devices };
        const hint = "设备过多，可用 mijia_find_device_usage 的 query 或 mijia_get_device 精确查询";

        if (response_format === "json") return jsonResult(output, { hint });
        return textResult(formatDeviceListMarkdown(devices, devices.length), output, false, { hint });
      } catch (error) {
        return errorResult(error, "get_devices");
      }
    }
  );

  // ==================== mijia_get_device ====================
  server.registerTool(
    "mijia_get_device",
    {
      title: "获取设备详情",
      description: `获取指定设备的详细信息，包括 MIOT Spec 能力定义。

默认 detail="summary"：每个属性只出现一次 {siid,piid,desc,dtype,access(r=读 w=写 n=订阅),unit?,range?,values?[{v,d}]}，枚举最多 30 项（超出见 valuesTruncated），另含 events{siid,eiid,desc,args:[piid]} 与 actions{siid,aiid,desc,in:[piid]}。
detail="full" 返回原始完整对象（含 triggers/actions/readable，体积大）。siids 可只看指定服务。
返回每个设备完整 urn：构造规则节点时必须原样复制到 cfg.urn，不要从型号字符串推导版本号。排查设备映射时优先使用本工具，无需先读取日志。

Args:
  - dids (string[]): 设备ID数组，支持批量查询
  - detail ("summary"|"full", optional): 默认 summary
  - siids (number[], optional): 只返回这些服务的能力
  - response_format (string, optional): 默认 "markdown"（每个属性一行），json 为紧凑 JSON

Returns:
  - devices, count, notFound: 网关设备表中不存在的设备ID列表（为空表示全部命中）
  - found=false 表示该ID在网关设备表中不存在，不是「设备离线」

Error Handling:
  - "网关未连接" - 请先调用 mijia_auth`,
      inputSchema: z.object({
        dids: z.array(z.string()).min(1).describe("设备ID数组"),
        detail: z.enum(["summary", "full"]).optional().default("summary").describe("summary=精简能力（默认），full=完整原始对象"),
        siids: z.array(z.number().int()).optional().describe("只返回这些服务 siid 的能力"),
        response_format: ResponseFormatSchema.optional().default("markdown").describe("输出格式"),
      }),
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    async ({ dids, detail = "summary", siids, response_format = "markdown" }) => {
      try {
        gatewayManager.ensureConnected();
        const result = await getDevice(gatewayManager.gateway!, dids);
        if (!result.success) return errorResult(new Error(result.error), "get_device");

        const raw = result.data ?? [];
        const notFound = raw.filter((device) => device.found === false).map((device) => device.did);

        if (detail === "full") {
          const devices = raw.map((device) => filterDeviceBySiids(device, siids));
          const output = { count: devices.length, notFound, devices };
          if (response_format === "json") return jsonResult(output, { hint: DEVICE_HINT });
          return textResult(formatDeviceDetailsMarkdown(devices), output, false, { hint: DEVICE_HINT });
        }

        const devices = raw.map((device) => summarizeDevice(device, siids));
        const output = { count: devices.length, notFound, devices };
        if (response_format === "json") return jsonResult(output, { hint: DEVICE_HINT });
        const text = `${formatDeviceSummaryMarkdown(devices)}${notFound.length > 0 ? `\nnotFound: ${notFound.join(", ")}` : ""}`;
        return textResult(text, output, false, { hint: DEVICE_HINT });
      } catch (error) {
        return errorResult(error, "get_device");
      }
    }
  );

  // ==================== mijia_find_device_usage ====================
  server.registerTool(
    "mijia_find_device_usage",
    {
      title: "查询设备被哪些自动化规则引用",
      description: `一次扫描全部自动化规则，找出引用了指定设备的规则和节点。

替代逐条 mijia_get_graph 翻查。更换、拆除、排查设备前先用本工具确认影响范围。

Args:
  - dids (string[], optional): 设备ID数组。已从网关删除的设备ID同样可查，用于排查残留引用
  - query (string, optional): 名称/型号/房间/设备ID的模糊匹配，不区分大小写。型号同时匹配 model 串(如 linp-es5b)与中文型号名
  - response_format (string, optional): 输出格式，默认 "markdown"；json 为紧凑 JSON
  - dids 与 query 至少提供一个；两者同时提供时取并集

Returns:
  - devices: 每个设备命中的规则列表，含节点ID、节点类型、角色(trigger 触发 / read 读取 / write 控制)、siid/piid/eiid/aiid
  - orphans: 规则引用了但网关设备表中已不存在的设备ID及其规则名，为空表示没有残留引用
  - scannedGraphs: 本次扫描的规则总数
  - unreadableGraphs: 读取失败的规则ID，非空说明这些规则的引用情况未确认

Error Handling:
  - "网关未连接" - 请先调用 mijia_auth
  - "必须提供 dids 或 query 之一"
  - query 无匹配时返回错误，请先用 mijia_get_devices 确认名称

Note: 需要逐条拉取规则，规则较多时耗时数秒。`,
      inputSchema: z.object({
        dids: z.array(z.string()).optional().describe("设备ID数组"),
        query: z.string().optional().describe("名称/型号/房间/设备ID模糊匹配"),
        response_format: ResponseFormatSchema.optional().default("markdown").describe("输出格式"),
      }),
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    async ({ dids, query, response_format = "markdown" }) => {
      try {
        gatewayManager.ensureConnected();
        const result = await findDeviceUsage(gatewayManager.gateway!, { dids, query });
        if (!result.success) return errorResult(new Error(result.error), "find_device_usage");

        const report = result.data ?? { devices: [], orphans: [], scannedGraphs: 0, unreadableGraphs: [] };
        const output = { ...report };
        const hint = "请用更精确的 dids 或 query 缩小范围";

        if (response_format === "json") return jsonResult(output, { hint });
        return textResult(formatDeviceUsageMarkdown(report), output, false, { hint });
      } catch (error) {
        return errorResult(error, "find_device_usage");
      }
    }
  );
}
