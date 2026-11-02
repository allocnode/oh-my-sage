/**
 * MCP Server - 实例创建
 *
 * stdio 模式只创建一个实例；HTTP 模式每个会话创建一个实例，
 * 但所有实例共享同一个 GatewayManager 与 GraphDraftStore。
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { createGatewayManager } from "../core/index.js";
import type { GatewayManager } from "../core/gateway/manager.js";
import { getConfig, type Config } from "./config.js";
import { GraphDraftStore } from "./tools/graphDraft.js";
import {
  registerAuthTools,
  registerDeviceTools,
  registerGraphTools,
  registerMiscTools,
  registerVariableTools,
} from "./tools/index.js";

export const SERVER_NAME = "oh-my-sage";
export const SERVER_VERSION = readPackageVersion();

/**
 * 读取 package.json 中的版本号
 *
 * 编译产物位于 dist/mcp/mcp/，仓库与 npm 包里 package.json 都在其上三级；
 * 用 tsx 直接运行源码时位于 src/mcp/，在上两级。
 */
function readPackageVersion(): string {
  for (const relative of ["../../..", "../.."]) {
    try {
      const pkg = JSON.parse(readFileSync(join(__dirname, relative, "package.json"), "utf8")) as { name?: string; version?: string };
      if (pkg.name?.startsWith("oh-my-sage") && pkg.version) return pkg.version;
    } catch {
      // 该位置没有 package.json，继续尝试下一个
    }
  }
  return "0.0.0";
}

/**
 * 创建并配置 MCP Server
 *
 * @param userConfig     可选配置
 * @param gatewayManager 网关管理器；HTTP 模式传入共享实例，缺省时新建
 * @param drafts         规则草稿库；HTTP 模式传入共享实例，缺省时新建
 */
export function createServer(
  userConfig?: Config,
  gatewayManager: GatewayManager = createGatewayManager(),
  drafts?: GraphDraftStore
): McpServer {
  getConfig(userConfig);

  const server = new McpServer({
    name: SERVER_NAME,
    version: SERVER_VERSION,
  });

  // 注册所有工具
  registerAuthTools(server, gatewayManager);
  registerDeviceTools(server, gatewayManager);
  registerGraphTools(server, gatewayManager, drafts);
  registerVariableTools(server, gatewayManager);
  registerMiscTools(server, gatewayManager);

  return server;
}
