#!/usr/bin/env node
/**
 * oh-my-sage MCP 服务
 * 米家自动化极客版 MCP 服务
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createGatewayManager } from "../core/index.js";
import { getConfig, type Config } from "./config.js";
import {
  registerAuthTools,
  registerDeviceTools,
  registerGraphTools,
  registerMiscTools,
  registerVariableTools,
} from "./tools/index.js";

/**
 * 创建并配置 MCP 服务
 */
function createServer(userConfig?: Config): McpServer {
  const config = getConfig(userConfig);

  const server = new McpServer({
    name: "oh-my-sage",
    version: "1.0.0",
  });

  // 创建网关管理器
  const gatewayManager = createGatewayManager();

  // 注册所有工具
  registerAuthTools(server, gatewayManager);
  registerDeviceTools(server, gatewayManager);
  registerGraphTools(server, gatewayManager);
  registerVariableTools(server, gatewayManager);
  registerMiscTools(server, gatewayManager);

  return server;
}

/**
 * 启动 MCP 服务
 */
async function main(): Promise<void> {
  // 支持从环境变量读取配置
  const userConfig: Config | undefined = process.env.GATEWAY_URL
    ? { gatewayUrl: process.env.GATEWAY_URL }
    : undefined;

  const server = createServer(userConfig);
  const transport = new StdioServerTransport();

  await server.connect(transport);
  console.error("oh-my-sage MCP 服务已通过 stdio 运行");
}

// 启动服务器
main().catch((error) => {
  console.error("致命错误：", error);
  process.exit(1);
});

// 导出创建函数，支持编程使用
export { createServer, getConfig };
export type { Config };
