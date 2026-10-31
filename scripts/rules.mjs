#!/usr/bin/env node
/**
 * 规则文件同步命令行（客户端）
 *
 * MCP 服务可能运行在私有服务器上，读不到本机文件。本脚本在本机运行，
 * 通过 Streamable HTTP 调用 MCP 工具，把规则拉成文本文件，或把改好的文件推回网关。
 * Agent 用普通的文件编辑只改需要的几行，再执行一次 push，避免在对话里来回传整张规则。
 *
 * 环境变量：
 *   OH_MY_SAGE_URL    MCP 地址，例如 http://127.0.0.1:3790/mcp
 *   OH_MY_SAGE_TOKEN  Bearer token（服务端设置了 MCP_AUTH_TOKEN 时必填）
 *
 * 用法：
 *   node scripts/rules.mjs pull [规则ID...] [--dir rules]   拉取规则（缺省为全部）
 *   node scripts/rules.mjs push <文件...> [--dry-run]       推送修改；--dry-run 只预览差异
 *   node scripts/rules.mjs status [--dir rules]              对比本地文件与网关是否一致
 *   node scripts/rules.mjs call <工具名> [JSON参数]          直接调用任意 MCP 工具
 */

import { readFile, writeFile, mkdir, readdir } from "node:fs/promises";
import { join, resolve } from "node:path";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

const HEADER_ID = /^# id: (.+)$/m;
const HEADER_BASE = /^# base: ([0-9a-f]{16})$/m;

function fail(message) {
  console.error(message);
  process.exit(1);
}

function parseArgs(argv) {
  const positional = [];
  const flags = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--dir") flags.dir = argv[++i];
    else if (arg === "--dry-run") flags.dryRun = true;
    else positional.push(arg);
  }
  return { positional, flags };
}

async function connect() {
  const url = process.env.OH_MY_SAGE_URL;
  if (!url) fail("请设置 OH_MY_SAGE_URL，例如 http://127.0.0.1:3790/mcp");
  const token = process.env.OH_MY_SAGE_TOKEN;
  const transport = new StreamableHTTPClientTransport(new URL(url), {
    requestInit: token ? { headers: { Authorization: `Bearer ${token}` } } : undefined,
  });
  const client = new Client({ name: "oh-my-sage-rules", version: "1.0.0" });
  await client.connect(transport);
  return client;
}

/** 调用工具并返回结构化结果；工具报错时直接退出 */
async function callTool(client, name, args) {
  const result = await client.callTool({ name, arguments: args });
  const text = (result.content || []).map((item) => item.text || "").join("\n");
  if (result.isError) fail(text);
  if (result.structuredContent) return result.structuredContent;
  try {
    return JSON.parse(text);
  } catch {
    return { text };
  }
}

function fileContent(data) {
  return `# id: ${data.id}\n# name: ${data.name}\n# enable: ${data.enable}\n# base: ${data.hash}\n\n${data.text.trimEnd()}\n`;
}

function stripHeader(content) {
  return content.split(/\r?\n/).filter((line) => !/^# (id|name|enable|base): /.test(line)).join("\n").trim();
}

async function pull(client, ids, dir) {
  await mkdir(dir, { recursive: true });
  let targets = ids;
  if (targets.length === 0) {
    const list = await callTool(client, "mijia_get_graphs", { response_format: "json" });
    targets = list.graphs.map((graph) => graph.id);
  }
  for (const id of targets) {
    const data = await callTool(client, "mijia_get_graph", { id, format: "text" });
    await writeFile(join(dir, `${id}.rule`), fileContent(data), "utf8");
    console.log(`拉取 ${id} ${data.name}（${data.nodeCount} 个节点）`);
  }
}

async function push(client, files, dryRun) {
  for (const file of files) {
    const content = await readFile(file, "utf8");
    const id = HEADER_ID.exec(content)?.[1]?.trim();
    const baseHash = HEADER_BASE.exec(content)?.[1];
    if (!id || !baseHash) fail(`${file} 缺少 # id 或 # base 文件头，请先 pull`);
    const data = await callTool(client, "mijia_put_graph_text", { id, baseHash, text: stripHeader(content), dryRun: Boolean(dryRun) });
    console.log(`${file}: ${data.message}`);
    if (data.added?.length) console.log(`  新增: ${data.added.join(", ")}`);
    if (data.changed?.length) console.log(`  修改: ${data.changed.join(", ")}`);
    if (data.removed?.length) console.log(`  删除: ${data.removed.join(", ")}`);
    if (data.noteChanged) console.log("  备注已更新");
    if (!dryRun && data.text) await writeFile(file, fileContent(data), "utf8");
  }
}

async function status(client, dir) {
  const files = (await readdir(dir)).filter((name) => name.endsWith(".rule"));
  for (const name of files) {
    const content = await readFile(join(dir, name), "utf8");
    const id = HEADER_ID.exec(content)?.[1]?.trim();
    const baseHash = HEADER_BASE.exec(content)?.[1];
    if (!id) continue;
    const data = await callTool(client, "mijia_get_graph", { id, ifNoneMatch: baseHash });
    console.log(`${data.unchanged ? "一致" : "网关已变化"}  ${name}`);
  }
}

async function main() {
  const [command, ...rest] = process.argv.slice(2);
  const { positional, flags } = parseArgs(rest);
  const dir = resolve(flags.dir || "rules");
  if (!command) fail("用法见文件头注释：pull | push | status | call");
  const client = await connect();
  try {
    if (command === "pull") await pull(client, positional, dir);
    else if (command === "push") {
      if (positional.length === 0) fail("push 需要至少一个 .rule 文件");
      await push(client, positional, flags.dryRun);
    } else if (command === "status") await status(client, dir);
    else if (command === "call") {
      const [name, json] = positional;
      if (!name) fail("call 需要工具名");
      const result = await client.callTool({ name, arguments: json ? JSON.parse(json) : {} });
      process.stdout.write(`${(result.content || []).map((item) => item.text || "").join("\n")}\n`);
      if (result.isError) process.exitCode = 1;
    } else fail(`未知命令 ${command}`);
  } finally {
    await client.close();
  }
}

main().catch((error) => fail(String(error?.stack || error)));
