/**
 * 在线检查：网关上的每条规则都必须能「JSON → 紧凑文本 → JSON」无损往返。
 * 修改 src/core/tools/ruleText.ts 后请运行一次。只读，不会修改任何规则。
 *
 *   OH_MY_SAGE_URL=http://127.0.0.1:3790/mcp OH_MY_SAGE_TOKEN=<token> npx tsx scripts/check-rule-text.mts
 */

import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { nodesToText, textToNodes, sameNode, type RuleTextContext } from "../src/core/tools/ruleText.ts";
import { fetchMiotSpec } from "../src/core/tools/device.ts";
import type { GraphNode } from "../src/core/types/graph.ts";

const url = process.env.OH_MY_SAGE_URL;
if (!url) throw new Error("请设置 OH_MY_SAGE_URL");
const token = process.env.OH_MY_SAGE_TOKEN;
const client = new Client({ name: "check-rule-text", version: "1.0.0" });
await client.connect(new StreamableHTTPClientTransport(new URL(url), { requestInit: token ? { headers: { Authorization: `Bearer ${token}` } } : undefined }));

async function call(name: string, args: Record<string, unknown>): Promise<any> {
  const result: any = await client.callTool({ name, arguments: args });
  if (result.isError) throw new Error(result.content?.[0]?.text);
  return result.structuredContent ?? JSON.parse(result.content[0].text);
}

const devList: Record<string, { name: string; urn: string }> = (await call("mijia_call_api", { method: "getDevList", params: {} })).result.devList;
const devices = new Map(Object.entries(devList).map(([did, device]) => [did, { name: device.name, urn: device.urn }]));
const specs: RuleTextContext["specs"] = new Map();
for (const urn of new Set([...devices.values()].map((device) => device.urn))) {
  try {
    const spec = await fetchMiotSpec(urn);
    specs.set(urn, { properties: spec.properties || [], actions: spec.actions || [] });
  } catch {
    // 能力取不到时仍应无损往返
  }
}

const graphs: Array<{ id: string; name: string }> = (await call("mijia_get_graphs", { response_format: "json" })).graphs;
let nodeCount = 0;
let jsonBytes = 0;
let textBytes = 0;
let fallbackLines = 0;
const failures: string[] = [];
for (const graph of graphs) {
  const nodes: GraphNode[] = (await call("mijia_get_graph", { id: graph.id, detail: "full" })).graph.nodes;
  const ctx: RuleTextContext = { scope: `R${graph.id}`, devices, specs };
  const text = nodesToText(nodes, ctx);
  try {
    const back = textToNodes(text, ctx).nodes;
    const bad = nodes.filter((node, index) => !back[index] || !sameNode(back[index], node)).map((node) => node.id);
    if (bad.length > 0 || back.length !== nodes.length) failures.push(`${graph.id}: ${bad.slice(0, 5).join(", ")}`);
  } catch (error) {
    failures.push(`${graph.id}: ${error}`);
  }
  nodeCount += nodes.length;
  jsonBytes += Buffer.byteLength(JSON.stringify(await call("mijia_get_graph", { id: graph.id })));
  textBytes += Buffer.byteLength(text);
  fallbackLines += text.split("\n").filter((line) => / raw \{/.test(line)).length;
}
await client.close();

console.log(`规则 ${graphs.length} 条，节点 ${nodeCount} 个，raw 兜底行 ${fallbackLines} 行`);
console.log(`JSON 摘要 ${jsonBytes} 字节，紧凑文本 ${textBytes} 字节（${Math.round((textBytes / jsonBytes) * 100)}%）`);
if (failures.length > 0) {
  console.error(`往返不一致 ${failures.length} 条：\n${failures.join("\n")}`);
  process.exit(1);
}
console.log("全部无损往返");
