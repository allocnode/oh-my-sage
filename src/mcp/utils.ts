/**
 * MCP Server - 工具函数
 */

import { z } from "zod";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import type { DeviceInfo, MiotActionCapability, MiotEventCapability, MiotPropertyCapability, MiotValueListItem, MiotValueRange } from "../core/types/device.js";
import type { Graph, GraphNode } from "../core/types/graph.js";
import { summarizeGraph, graphHash } from "../core/index.js";

// 响应格式枚举
export const ResponseFormatSchema = z.enum(["markdown", "json"]);
export type ResponseFormat = z.infer<typeof ResponseFormatSchema>;

// ==================== 输出卫生 ====================

/** 单个工具结果文本的硬上限（UTF-8 字节） */
export const MAX_RESULT_BYTES = 40_000;
/** structuredContent 的安全上限：仅超过该字节数（如原始 API 返回 MB 级数据）时省略 */
export const MAX_STRUCTURED_BYTES = 1_000_000;
/** 默认截断提示 */
export const DEFAULT_TRUNCATION_HINT = "请缩小查询范围后重试";

/**
 * 格式化 JSON 输出（紧凑，无缩进）
 */
export function formatJson(data: unknown): string {
  return JSON.stringify(data) ?? "null";
}

function byteLength(text: string): number {
  return Buffer.byteLength(text, "utf8");
}

/**
 * 按 UTF-8 字节硬截断文本。超限时在安全边界切断（不拆分代理对，优先最后一个换行），
 * 并追加一行截断说明（含如何缩小范围的提示）。返回结果总字节数不超过 maxBytes。
 */
export function capText(text: string, hint: string = DEFAULT_TRUNCATION_HINT, maxBytes: number = MAX_RESULT_BYTES): string {
  const limit = Math.max(0, Math.min(maxBytes, MAX_RESULT_BYTES));
  const total = byteLength(text);
  if (total <= limit) return text;

  const buildNote = (shown: number): string => `\n[已截断：原始 ${total} 字节，仅显示前 ${shown} 字节。${hint}]`;
  // 用上限值估算说明行长度（位数只会更少），保证总长不超限
  const budget = Math.max(0, limit - byteLength(buildNote(limit)));

  // 按码点累加，天然不会拆开代理对
  let bytes = 0;
  let cut = 0;
  for (const ch of text) {
    const size = byteLength(ch);
    if (bytes + size > budget) break;
    bytes += size;
    cut += ch.length;
  }

  // 优先在最后一个换行处切断，但不丢弃超过一半的可用内容
  const newline = text.lastIndexOf("\n", cut - 1);
  if (newline > 0 && newline >= cut / 2) cut = newline;

  const head = text.slice(0, cut);
  return `${head}${buildNote(byteLength(head))}`;
}

export interface TextResultOptions {
  /** 截断时提示如何缩小范围 */
  hint?: string;
  /** 文本上限（字节），不超过 MAX_RESULT_BYTES */
  maxBytes?: number;
}

/**
 * 统一的工具结果构造：文本截断 + structuredContent。
 * 文本始终受 MAX_RESULT_BYTES 限制；structuredContent 默认总是附带（code mode 直接拿到对象），
 * 仅在序列化后超过 MAX_STRUCTURED_BYTES 时省略。错误结果只返回 content。
 */
export function textResult(
  text: string,
  structured?: Record<string, unknown>,
  isError?: boolean,
  options: TextResultOptions = {}
): CallToolResult {
  const result: CallToolResult = {
    content: [{ type: "text", text: capText(text, options.hint, options.maxBytes) }],
  };
  if (isError) {
    result.isError = true;
    return result;
  }
  if (structured !== undefined) {
    const serialized = JSON.stringify(structured);
    if (serialized !== undefined && byteLength(serialized) <= MAX_STRUCTURED_BYTES) {
      result.structuredContent = structured;
    }
  }
  return result;
}

/** 紧凑 JSON 结果 */
export function jsonResult(data: Record<string, unknown>, options: TextResultOptions = {}): CallToolResult {
  return textResult(formatJson(data), data, false, options);
}

/** 错误结果（仅 content） */
export function errorResult(error: unknown, context: string): CallToolResult {
  return textResult(handleError(error, context), undefined, true);
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
    if (typeof value === "object" && value !== null) {
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

const onlineTag = (online?: boolean): string => (online ? "[在线]" : "[离线]");
const enableTag = (enable?: boolean): string => (enable ? "[启用]" : "[禁用]");

// ==================== 设备 ====================

/**
 * 格式化设备列表为 Markdown（每台设备一行）
 */
export function formatDeviceListMarkdown(devices: Array<{
  name: string;
  did: string;
  modelName?: string;
  online?: boolean;
  roomName?: string;
}>, count: number): string {
  const lines = [`## 设备列表（${count} 台）`];
  for (const device of devices) {
    lines.push(`- ${device.name} (${device.did}) | ${device.roomName || "未分组"} | ${device.modelName || "未知"} | ${onlineTag(device.online)}`);
  }
  return lines.join("\n");
}

/** 设备摘要中的属性 */
export interface DevicePropertySummary {
  siid: number;
  piid: number;
  desc: string;
  dtype: string;
  access: string;
  unit?: string;
  range?: MiotValueRange;
  values?: Array<{ v: MiotValueListItem["value"]; d: string }>;
  valuesTruncated?: number;
}

/** 设备摘要 */
export interface DeviceSummary {
  did: string;
  found: boolean;
  name?: string;
  model?: string;
  modelName?: string;
  online?: boolean;
  roomName?: string;
  urn?: string;
  properties?: DevicePropertySummary[];
  events?: Array<{ siid: number; eiid: number; desc: string; args: number[] }>;
  actions?: Array<{ siid: number; aiid: number; desc: string; in: number[] }>;
  specError?: string;
}

/** 枚举值最多展示条数 */
export const MAX_ENUM_VALUES = 30;

/** access 数组压缩为短字符串：r=read, w=write, n=notify */
export function accessShort(access: string[] | undefined): string {
  const list = access || [];
  return `${list.includes("read") ? "r" : ""}${list.includes("write") ? "w" : ""}${list.includes("notify") ? "n" : ""}`;
}

function summarizeProperty(property: MiotPropertyCapability): DevicePropertySummary {
  const summary: DevicePropertySummary = {
    siid: property.siid,
    piid: property.piid,
    desc: property.desc,
    dtype: property.dtype,
    access: accessShort(property.access),
  };
  if (property.unit) summary.unit = property.unit;
  if (property.range) summary.range = property.range;
  if (property.list && property.list.length > 0) {
    summary.values = property.list.slice(0, MAX_ENUM_VALUES).map((item) => ({ v: item.value, d: item.description }));
    if (property.list.length > MAX_ENUM_VALUES) summary.valuesTruncated = property.list.length - MAX_ENUM_VALUES;
  }
  return summary;
}

/**
 * 设备详情精简摘要：属性/事件/动作各出现一次，不重复 triggers/readable。
 * siids 非空时只保留这些服务。
 */
export function summarizeDevice(device: DeviceInfo, siids?: number[]): DeviceSummary {
  if (device.found === false) return { did: device.did, found: false };
  const keep = (siid: number): boolean => !siids || siids.length === 0 || siids.includes(siid);
  const events: MiotEventCapability[] = device.events || [];
  const summary: DeviceSummary = {
    did: device.did,
    found: true,
    name: device.name,
    model: device.model,
    modelName: device.modelName,
    online: device.online,
    roomName: device.roomName,
    urn: device.urn,
    properties: (device.properties || []).filter((p) => keep(p.siid)).map(summarizeProperty),
    events: events.filter((e) => keep(e.siid)).map((e) => ({ siid: e.siid, eiid: e.eiid, desc: e.desc, args: (e.arguments || []).map((a) => a.piid) })),
    actions: (device.actions || [])
      .filter((a) => a.type === "action" && typeof a.aiid === "number" && keep(a.siid))
      .map((a) => ({ siid: a.siid, aiid: a.aiid as number, desc: a.desc, in: (a.in || []).map((p) => p.piid) })),
  };
  if (device.specError) summary.specError = device.specError;
  return summary;
}

/** 完整模式下按 siid 过滤设备能力 */
export function filterDeviceBySiids(device: DeviceInfo, siids?: number[]): DeviceInfo {
  if (!siids || siids.length === 0 || device.found === false) return device;
  const keep = (item: { siid: number }): boolean => siids.includes(item.siid);
  return {
    ...device,
    properties: device.properties?.filter(keep),
    events: device.events?.filter(keep),
    triggers: device.triggers?.filter(keep),
    actions: device.actions?.filter(keep),
    readable: device.readable?.filter(keep),
  };
}

function formatValues(values: DevicePropertySummary["values"], truncated?: number): string {
  if (!values) return "";
  const text = values.map((item) => `${item.v}:${item.d}`).join(",");
  return truncated ? `${text},...(+${truncated})` : text;
}

/**
 * 设备摘要 Markdown：每个属性/事件/动作一行
 */
export function formatDeviceSummaryMarkdown(devices: DeviceSummary[]): string {
  const lines: string[] = [];
  for (const device of devices) {
    if (!device.found) {
      lines.push(`## ${device.did} [注意] 网关设备表中不存在该设备ID（不是设备离线），请核对设备ID`);
      continue;
    }
    lines.push(`## ${device.name} (${device.did}) | ${device.model || "未知"} | ${device.modelName || "未知"} | ${device.roomName || "未分组"} | ${onlineTag(device.online)}`);
    lines.push(`urn: ${device.urn || "未知"}`);
    if (device.specError) lines.push(`[注意] Spec 读取失败: ${device.specError}`);
    if (device.properties && device.properties.length > 0) {
      lines.push("属性 (siid.piid 描述 | dtype | access r/w/n | 单位/范围/取值):");
      for (const p of device.properties) {
        const extra = [
          p.unit && `unit=${p.unit}`,
          p.range && `range=${p.range.min}..${p.range.max}/${p.range.step}`,
          p.values && `values=${formatValues(p.values, p.valuesTruncated)}`,
        ].filter(Boolean).join(" ");
        lines.push(`- ${p.siid}.${p.piid} ${p.desc} | ${p.dtype} | ${p.access || "-"}${extra ? ` | ${extra}` : ""}`);
      }
    }
    if (device.events && device.events.length > 0) {
      lines.push("事件 (siid.eiid 描述 args=参数piid):");
      for (const e of device.events) lines.push(`- ${e.siid}.${e.eiid} ${e.desc}${e.args.length ? ` args=${e.args.join(",")}` : ""}`);
    }
    if (device.actions && device.actions.length > 0) {
      lines.push("动作 (siid.aiid 描述 in=输入piid):");
      for (const a of device.actions) lines.push(`- ${a.siid}.${a.aiid} ${a.desc}${a.in.length ? ` in=${a.in.join(",")}` : ""}`);
    }
    lines.push("");
  }
  return lines.join("\n").trimEnd();
}

/**
 * 格式化设备详情为 Markdown（完整模式）
 */
export function formatDeviceDetailsMarkdown(devices: Array<{
  name: string;
  did: string;
  found?: boolean;
  model?: string;
  modelName?: string;
  online?: boolean;
  roomName?: string;
  urn?: string;
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
    if (device.found === false) {
      lines.push(`### ${device.did}`);
      lines.push("- [注意] 网关设备表中不存在该设备ID，无法读取任何能力");
      lines.push("- 这不是「设备离线」：离线设备仍会返回名称、型号和 MIOT 能力");
      lines.push("- 请核对设备ID是否正确，或该设备是否已从网关移除");
      lines.push("");
      continue;
    }

    lines.push(`### ${device.name} (${device.did})`);
    lines.push(`- 型号: ${device.model || "未知"} - ${device.modelName || "未知"}`);
    lines.push(`- 状态: ${onlineTag(device.online)}`);
    lines.push(`- 房间: ${device.roomName || "未分组"}`);
    lines.push(`- URN: ${device.urn || "未知"}`);
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

// ==================== 规则 ====================

/**
 * 格式化规则列表为 Markdown（每条规则一行）
 */
export function formatGraphListMarkdown(graphs: Array<{
  name: string;
  id: string;
  enable?: boolean;
}>): string {
  const lines = [`## 自动化规则列表（${graphs.length} 条）`];
  for (const g of graphs) lines.push(`- ${g.name} (${g.id}) ${enableTag(g.enable)}`);
  return lines.join("\n");
}

/**
 * mijia_get_graph 输出整形（纯函数）。
 * - node_ids 非空：规则头 + 指定节点完整 JSON（missingIds 列出不存在的节点）
 * - detail=full：{hash, graph}
 * - 默认 summary：summarizeGraph 紧凑摘要
 */
export function shapeGraphOutput(graph: Graph, options: { detail?: "summary" | "full"; nodeIds?: string[] } = {}): Record<string, unknown> {
  const nodes: GraphNode[] = graph.nodes || [];
  if (options.nodeIds && options.nodeIds.length > 0) {
    const wanted = new Set(options.nodeIds);
    const picked = nodes.filter((node) => wanted.has(node.id));
    const found = new Set(picked.map((node) => node.id));
    const missingIds = options.nodeIds.filter((id) => !found.has(id));
    return {
      id: graph.id,
      name: graph.cfg?.userData?.name || graph.id,
      enable: graph.cfg?.enable ?? false,
      hash: graphHash(nodes),
      nodeCount: nodes.length,
      nodes: picked,
      ...(missingIds.length > 0 ? { missingIds } : {}),
    };
  }
  if (options.detail === "full") return { hash: graphHash(nodes), graph };
  return { ...summarizeGraph({ ...graph, nodes }) };
}

/**
 * 格式化设备引用扫描结果为 Markdown
 */
export function formatDeviceUsageMarkdown(report: {
  devices: Array<{
    did: string;
    name: string;
    found: boolean;
    nodeCount: number;
    graphs: Array<{
      graphId: string;
      name: string;
      enable: boolean;
      nodes: Array<{ nodeId: string; nodeType: string; role: string; target: string }>;
    }>;
  }>;
  orphans: Array<{ did: string; graphs: string[] }>;
  scannedGraphs: number;
  unreadableGraphs: string[];
}): string {
  const ROLE_LABEL: Record<string, string> = { trigger: "触发", read: "读取", write: "控制" };
  const lines = [`## 设备引用扫描（扫描规则 ${report.scannedGraphs} 条）`];

  for (const device of report.devices) {
    lines.push(`### ${device.name} (${device.did})${device.found ? "" : " [注意] 该设备已不在网关设备表中"}`);
    if (device.graphs.length === 0) {
      lines.push("- 没有任何规则引用此设备");
      continue;
    }
    lines.push(`- 命中 ${device.graphs.length} 条规则，共 ${device.nodeCount} 个节点`);
    for (const graph of device.graphs) {
      lines.push(`- ${graph.name} (${graph.graphId}) ${enableTag(graph.enable)}`);
      for (const node of graph.nodes) {
        lines.push(`  - ${node.nodeId} | ${node.nodeType} | ${ROLE_LABEL[node.role] || node.role} | ${node.target}`);
      }
    }
  }

  if (report.orphans.length > 0) {
    lines.push("### [注意] 残留引用（设备已删除但规则仍在引用）");
    for (const orphan of report.orphans) {
      lines.push(`- ${orphan.did} -> ${orphan.graphs.join(", ")}`);
    }
  }

  if (report.unreadableGraphs.length > 0) {
    lines.push("### [注意] 读取失败的规则（引用情况未知）", `- ${report.unreadableGraphs.join(", ")}`);
  }

  return lines.join("\n");
}

// ==================== 变量 ====================

/**
 * 格式化变量列表为 Markdown（每个变量一行）
 */
export function formatVariableListMarkdown(
  variables: Array<{ id?: string; userData?: { name?: string }; type?: string; value?: unknown }>,
  scope: string
): string {
  const lines = [`## 变量列表（作用域 ${scope}，${variables.length} 个）`];
  for (const v of variables) {
    const name = v.userData?.name || "未命名";
    lines.push(`- ${name}${v.id ? ` (${v.id})` : ""} | ${v.type || "未知"} | 值: ${typeof v.value === "string" ? v.value : JSON.stringify(v.value)}`);
  }
  return lines.join("\n");
}

// ==================== 校验结果 ====================

/** 校验条目精简为 {nodeId, type, message} */
export function compactIssues(items: Array<{ nodeId: string; type: string; message: string }>): Array<{ nodeId: string; type: string; message: string }> {
  return items.map(({ nodeId, type, message }) => ({ nodeId, type, message }));
}
