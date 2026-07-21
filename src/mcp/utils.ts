/**
 * MCP Server - 工具函数
 */

import { z } from "zod";
import type { MiotActionCapability, MiotEventCapability, MiotPropertyCapability } from "../core/types/device.js";

// 响应格式枚举
export const ResponseFormatSchema = z.enum(["markdown", "json"]);
export type ResponseFormat = z.infer<typeof ResponseFormatSchema>;

/**
 * 格式化 JSON 输出
 */
export function formatJson(data: unknown): string {
  return JSON.stringify(data, null, 2);
}

/**
 * 格式化 Markdown 输出
 */
export function formatMarkdown(data: unknown, title: string): string {
  if (typeof data !== "object" || data === null) {
    return String(data);
  }

  if (Array.isArray(data)) {
    if (data.length === 0) return `## ${title}\n\n无数据`;
    const lines = [`## ${title}`, ""];
    for (const item of data) {
      if (typeof item === "object" && item !== null) {
        lines.push(`- ${JSON.stringify(item)}`);
      } else {
        lines.push(`- ${item}`);
      }
    }
    return lines.join("\n");
  }

  const obj = data as Record<string, unknown>;
  const lines = [`## ${title}`, ""];

  for (const [key, value] of Object.entries(obj)) {
    if (key === "data" && typeof value === "object" && value !== null) {
      lines.push(`### Data`);
      for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
        lines.push(`- **${k}**: ${JSON.stringify(v)}`);
      }
    } else if (typeof value === "object" && value !== null) {
      lines.push(`### ${key}`);
      for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
        lines.push(`- **${k}**: ${JSON.stringify(v)}`);
      }
    } else {
      lines.push(`- **${key}**: ${JSON.stringify(value)}`);
    }
  }

  return lines.join("\n");
}

/**
 * 处理错误信息
 */
export function handleError(error: unknown, context: string): string {
  const msg = error instanceof Error ? error.message : String(error);
  if (msg.includes("timeout")) {
    return `Error: 请求超时。请检查网关连接或网络状态。(${context})`;
  }
  if (msg.includes("not connected") || msg.includes("未连接")) {
    return `Error: 网关未连接。请先调用 mijia_auth 进行认证。(${context})`;
  }
  return `Error: ${msg} (${context})`;
}

/**
 * 格式化设备列表为 Markdown
 */
export function formatDeviceListMarkdown(devices: Array<{
  name: string;
  did: string;
  modelName?: string;
  online?: boolean;
  roomName?: string;
}>, count: number): string {
  const lines = ["## 设备列表", ""];
  lines.push(`总计: ${count} 台设备`, "");

  for (const device of devices) {
    lines.push(`- **${device.name}** (${device.did})`);
    lines.push(`  - 型号: ${device.modelName || "未知"}`);
    lines.push(`  - 状态: ${device.online ? "在线 ✅" : "离线 ❌"}`);
    lines.push(`  - 房间: ${device.roomName || "未分组"}`);
    lines.push("");
  }

  return lines.join("\n");
}

/**
 * 格式化设备详情为 Markdown
 */
export function formatDeviceDetailsMarkdown(devices: Array<{
  name: string;
  did: string;
  model?: string;
  modelName?: string;
  online?: boolean;
  roomName?: string;
  properties?: MiotPropertyCapability[];
  events?: MiotEventCapability[];
  triggers?: Array<{
    desc: string;
    type: string;
    siid?: number;
    piid?: number;
    eiid?: number;
    arguments?: Array<{ piid: number; desc: string; dtype: string; range?: unknown; list?: unknown }>;
  }>;
  actions?: Array<{ desc: string; type: string; siid?: number; piid?: number; aiid?: number; in?: MiotActionCapability["in"] }>;
}>): string {
  const lines = ["## 设备详情", ""];

  for (const device of devices) {
    lines.push(`### ${device.name} (${device.did})`);
    lines.push(`- 型号: ${device.model || "未知"} - ${device.modelName || "未知"}`);
    lines.push(`- 状态: ${device.online ? "在线 ✅" : "离线 ❌"}`);
    lines.push(`- 房间: ${device.roomName || "未分组"}`);
    lines.push("");

    if (device.properties && device.properties.length > 0) {
      lines.push("**属性能力（所有字段）:**");
      for (const property of device.properties) {
        const details = [
          `siid=${property.siid}`,
          `piid=${property.piid}`,
          `dtype=${property.dtype}`,
          `access=${property.access.join(",") || "none"}`,
          property.unit && `unit=${property.unit}`,
          property.list && `values=${JSON.stringify(property.list)}`,
          property.range && `range=${JSON.stringify(property.range)}`,
        ].filter(Boolean).join(", ");
        lines.push(`  - ${property.desc} (${details})`);
      }
      lines.push("");
    }

    if (device.events && device.events.length > 0) {
      lines.push("**事件能力:**");
      for (const event of device.events) {
        lines.push(`  - ${event.desc} (siid=${event.siid}, eiid=${event.eiid})`);
        for (const arg of event.arguments) {
          const details = [
            `dtype=${arg.dtype}`,
            arg.unit && `unit=${arg.unit}`,
            arg.list && `values=${JSON.stringify(arg.list)}`,
            arg.range && `range=${JSON.stringify(arg.range)}`,
          ].filter(Boolean).join(", ");
          lines.push(`    - 参数 piid=${arg.piid}: ${arg.desc} (${details})`);
        }
      }
      lines.push("");
    }

    if (device.triggers && device.triggers.length > 0) {
      lines.push("**可触发能力:**");
      for (const t of device.triggers) {
        const ids = [t.siid && `siid=${t.siid}`, t.piid && `piid=${t.piid}`, t.eiid && `eiid=${t.eiid}`].filter(Boolean).join(", ");
        lines.push(`  - ${t.desc} (${t.type}${ids ? `; ${ids}` : ""})`);
        for (const arg of (t.arguments || [])) {
          lines.push(`    - 参数 piid=${arg.piid}: ${arg.desc}, ${arg.dtype}${arg.list ? `, values=${JSON.stringify(arg.list)}` : ""}${arg.range ? `, range=${JSON.stringify(arg.range)}` : ""}`);
        }
      }
      lines.push("");
    }

    if (device.actions && device.actions.length > 0) {
      lines.push("**可执行动作:**");
      for (const a of device.actions) {
        const ids = [a.siid && `siid=${a.siid}`, a.piid && `piid=${a.piid}`, a.aiid && `aiid=${a.aiid}`].filter(Boolean).join(", ");
        lines.push(`  - ${a.desc} (${a.type}${ids ? `; ${ids}` : ""})`);
        for (const input of a.in || []) {
          const details = [
            `dtype=${input.dtype}`,
            input.unit && `unit=${input.unit}`,
            input.list && `values=${JSON.stringify(input.list)}`,
            input.range && `range=${JSON.stringify(input.range)}`,
          ].filter(Boolean).join(", ");
          lines.push(`    - 参数 piid=${input.piid}: ${input.desc} (${details})`);
        }
      }
      lines.push("");
    }
  }

  return lines.join("\n");
}

/**
 * 格式化规则列表为 Markdown
 */
export function formatGraphListMarkdown(graphs: Array<{
  name: string;
  id: string;
  enable?: boolean;
  updateTime?: number;
}>): string {
  const lines = ["## 自动化规则列表", ""];
  lines.push(`总计: ${graphs.length} 条规则`, "");

  const enabled = graphs.filter((g) => g.enable);
  const disabled = graphs.filter((g) => !g.enable);

  if (enabled.length > 0) {
    lines.push("### 已启用 ✅");
    for (const g of enabled) {
      lines.push(`- **${g.name}** (${g.id})`);
      if (g.updateTime) {
        lines.push(`  - 更新时间: ${new Date(g.updateTime).toLocaleString()}`);
      }
    }
    lines.push("");
  }

  if (disabled.length > 0) {
    lines.push("### 已禁用 ❌");
    for (const g of disabled) {
      lines.push(`- **${g.name}** (${g.id})`);
    }
    lines.push("");
  }

  return lines.join("\n");
}

/**
 * 格式化变量列表为 Markdown
 */
export function formatVariableListMarkdown(
  variables: Array<{ userData?: { name?: string }; type?: string; value?: unknown }>,
  scope: string
): string {
  const lines = ["## 变量列表", ""];
  lines.push(`作用域: ${scope}`, "");
  lines.push(`总计: ${variables.length} 个变量`, "");

  for (const v of variables) {
    const name = v.userData?.name || "未命名";
    lines.push(`- **${name}**`);
    lines.push(`  - 类型: ${v.type || "未知"}`);
    lines.push(`  - 值: ${v.value}`);
    lines.push("");
  }

  return lines.join("\n");
}
