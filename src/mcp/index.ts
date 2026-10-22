#!/usr/bin/env node
/**
 * oh-my-sage MCP Server
 * 米家自动化极客版 MCP 服务
 *
 * 默认 stdio 传输；传 --http 或设置 MCP_TRANSPORT=http 时改用 Streamable HTTP。
 */

import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { getConfig, type Config } from "./config.js";
import { resolveHttpOptions, startHttpServer } from "./http.js";
import { createServer } from "./server.js";

function useHttpTransport(): boolean {
  return process.argv.slice(2).includes("--http") || (process.env.MCP_TRANSPORT || "").toLowerCase() === "http";
}

/**
 * 启动 MCP Server
 */
async function main(): Promise<void> {
  // 支持从环境变量读取配置
  const userConfig: Config | undefined = process.env.GATEWAY_URL
    ? { gatewayUrl: process.env.GATEWAY_URL }
    : undefined;

  if (useHttpTransport()) {
    const running = await startHttpServer({ ...resolveHttpOptions(process.env), userConfig });
    console.error(`oh-my-sage MCP Server running on ${running.url}`);

    // ==================== 优雅退出 ====================
    let stopping = false;
    const shutdown = (signal: string): void => {
      if (stopping) return;
      stopping = true;
      console.error(`收到 ${signal}，正在关闭 MCP Server`);
      const force = setTimeout(() => process.exit(1), 5000);
      force.unref();
      running.close().then(
        () => process.exit(0),
        (error: unknown) => {
          console.error("关闭失败:", error);
          process.exit(1);
        }
      );
    };
    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));
    return;
  }

  const server = createServer(userConfig);
  const transport = new StdioServerTransport();

  await server.connect(transport);
  console.error("oh-my-sage MCP Server running on stdio");
}

// 启动服务器
main().catch((error) => {
  console.error("Fatal error:", error instanceof Error ? error.message : error);
  process.exit(1);
});

// 导出创建函数，支持编程使用
export { createServer, getConfig };
export type { Config };
