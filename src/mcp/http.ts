/**
 * MCP Server - Streamable HTTP 传输
 *
 * 一个长驻 HTTP 进程服务多个客户端会话：
 * - 所有会话共享同一个 GatewayManager（网关登录一次，客户端重启后仍可用）
 * - 所有会话共享同一个 GraphDraftStore
 * - 每个会话独立的 McpServer + StreamableHTTPServerTransport
 */

import http from "node:http";
import { createHash, randomUUID, timingSafeEqual } from "node:crypto";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { isInitializeRequest } from "@modelcontextprotocol/sdk/types.js";
import { createGatewayManager } from "../core/index.js";
import type { GatewayManager } from "../core/gateway/manager.js";
import type { Config } from "./config.js";
import { GraphDraftStore } from "./tools/graphDraft.js";
import { createServer } from "./server.js";

// ==================== 常量 ====================

export const DEFAULT_HTTP_HOST = "127.0.0.1";
export const DEFAULT_HTTP_PORT = 3790;
export const MCP_PATH = "/mcp";
export const HEALTH_PATH = "/healthz";
const DEFAULT_SESSION_TTL_MS = 30 * 60 * 1000;
const MAX_BODY_BYTES = 8 * 1024 * 1024;
const LOOPBACK_HOSTS = ["localhost", "127.0.0.1", "[::1]"];

// ==================== 类型 ====================

export interface HttpOptions {
  host: string;
  port: number;
  /** Bearer token；非回环地址监听时必填 */
  authToken?: string;
  /** 允许的 Host 主机名（不含端口），用于防 DNS rebinding */
  allowedHosts: string[];
  /** 会话空闲多久后回收（毫秒） */
  sessionTtlMs: number;
}

export interface StartHttpOptions extends Partial<HttpOptions> {
  userConfig?: Config;
  /** 共享网关管理器；缺省时新建（测试可注入替身） */
  gatewayManager?: GatewayManager;
  /** 共享草稿库；缺省时新建 */
  drafts?: GraphDraftStore;
  /** 空闲回收扫描间隔（毫秒），默认 60 秒 */
  sweepIntervalMs?: number;
}

export interface RunningHttpServer {
  host: string;
  port: number;
  url: string;
  httpServer: http.Server;
  gatewayManager: GatewayManager;
  sessionCount(): number;
  close(): Promise<void>;
}

interface SessionEntry {
  transport: StreamableHTTPServerTransport;
  server: McpServer;
  lastSeen: number;
  /** 进行中的请求数（含客户端常驻的 GET SSE 流），大于 0 时不回收 */
  active: number;
}

// ==================== 配置解析 ====================

/** 是否回环地址（只有本机能访问） */
export function isLoopbackHost(host: string): boolean {
  const h = host.trim().toLowerCase().replace(/^\[|\]$/g, "");
  return h === "localhost" || h === "::1" || /^127\.\d+\.\d+\.\d+$/.test(h);
}

function isWildcardHost(host: string): boolean {
  const h = host.trim().replace(/^\[|\]$/g, "");
  return h === "0.0.0.0" || h === "::" || h === "";
}

/** 规范化主机名：小写，IPv6 加方括号（与 URL.hostname 一致） */
function normalizeHostname(host: string): string {
  const h = host.trim().toLowerCase();
  if (h.includes(":") && !h.startsWith("[")) return `[${h}]`;
  return h;
}

/** 默认允许的 Host：回环地址 + 非通配的监听地址 */
export function defaultAllowedHosts(bindHost: string): string[] {
  const hosts = new Set(LOOPBACK_HOSTS);
  if (!isWildcardHost(bindHost)) hosts.add(normalizeHostname(bindHost));
  return [...hosts];
}

/** 从环境变量解析 HTTP 配置 */
export function resolveHttpOptions(env: Record<string, string | undefined>): HttpOptions {
  const host = (env.MCP_HTTP_HOST || DEFAULT_HTTP_HOST).trim();
  const portText = (env.MCP_HTTP_PORT || "").trim();
  const port = portText ? Number(portText) : DEFAULT_HTTP_PORT;
  if (!Number.isInteger(port) || port < 0 || port > 65535) {
    throw new Error(`MCP_HTTP_PORT 无效: ${portText}`);
  }
  const ttlText = (env.MCP_SESSION_TTL_MINUTES || "").trim();
  const ttlMinutes = ttlText ? Number(ttlText) : DEFAULT_SESSION_TTL_MS / 60000;
  if (!Number.isFinite(ttlMinutes) || ttlMinutes <= 0) {
    throw new Error(`MCP_SESSION_TTL_MINUTES 无效: ${ttlText}`);
  }
  const allowed = (env.MCP_ALLOWED_HOSTS || "")
    .split(",")
    .map((h) => h.trim())
    .filter(Boolean)
    .map(normalizeHostname);
  return {
    host,
    port,
    authToken: env.MCP_AUTH_TOKEN || undefined,
    allowedHosts: allowed.length > 0 ? [...new Set([...LOOPBACK_HOSTS, ...allowed])] : defaultAllowedHosts(host),
    sessionTtlMs: ttlMinutes * 60000,
  };
}

// ==================== HTTP 工具函数 ====================

function sendJson(res: http.ServerResponse, status: number, body: unknown, headers: Record<string, string> = {}): void {
  if (res.headersSent) {
    res.end();
    return;
  }
  res.writeHead(status, { "Content-Type": "application/json", ...headers });
  res.end(JSON.stringify(body));
}

function sendRpcError(res: http.ServerResponse, status: number, code: number, message: string, headers?: Record<string, string>): void {
  sendJson(res, status, { jsonrpc: "2.0", error: { code, message }, id: null }, headers);
}

/** 解析 Host 头中的主机名（不含端口）；无效返回 null */
function hostnameOf(hostHeader: string | undefined): string | null {
  if (!hostHeader) return null;
  try {
    return new URL(`http://${hostHeader}`).hostname.toLowerCase();
  } catch {
    return null;
  }
}

/** 定长比较 token：先做 SHA-256，避免长度差异泄露信息 */
function tokenMatches(header: string | undefined, expected: string): boolean {
  if (!header) return false;
  const match = /^Bearer\s+(.+)$/i.exec(header.trim());
  if (!match) return false;
  const a = createHash("sha256").update(match[1]).digest();
  const b = createHash("sha256").update(expected).digest();
  return timingSafeEqual(a, b);
}

function readBody(req: http.IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    let size = 0;
    req.on("data", (chunk: Buffer) => {
      size += chunk.length;
      if (size > MAX_BODY_BYTES) {
        reject(new Error("请求体过大"));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

function containsInitialize(body: unknown): boolean {
  if (Array.isArray(body)) return body.some((msg) => isInitializeRequest(msg));
  return isInitializeRequest(body);
}

// ==================== 启动 ====================

/**
 * 启动 Streamable HTTP MCP 服务。
 * 非回环地址监听且未配置 token 时拒绝启动（抛出错误）。
 */
export async function startHttpServer(options: StartHttpOptions = {}): Promise<RunningHttpServer> {
  const host = options.host ?? DEFAULT_HTTP_HOST;
  const port = options.port ?? DEFAULT_HTTP_PORT;
  const authToken = options.authToken || undefined;
  const allowedHosts = (options.allowedHosts ?? defaultAllowedHosts(host)).map(normalizeHostname);
  const sessionTtlMs = options.sessionTtlMs ?? DEFAULT_SESSION_TTL_MS;

  if (!isLoopbackHost(host) && !authToken) {
    throw new Error(
      `拒绝启动：监听地址 ${host} 不是回环地址，必须设置 MCP_AUTH_TOKEN（Bearer token）以防局域网内任何人控制网关`
    );
  }

  const ownsManager = !options.gatewayManager;
  const gatewayManager = options.gatewayManager ?? createGatewayManager();
  const drafts = options.drafts ?? new GraphDraftStore();
  const sessions = new Map<string, SessionEntry>();

  // ==================== 会话 ====================

  const createSession = async (): Promise<SessionEntry> => {
    const server = createServer(options.userConfig, gatewayManager, drafts);
    const entry = {} as SessionEntry;
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: () => randomUUID(),
      onsessioninitialized: (sessionId) => {
        sessions.set(sessionId, entry);
      },
    });
    transport.onclose = () => {
      const sid = transport.sessionId;
      if (sid && sessions.get(sid) === entry) sessions.delete(sid);
    };
    entry.transport = transport;
    entry.server = server;
    entry.lastSeen = Date.now();
    entry.active = 0;
    await server.connect(transport);
    return entry;
  };

  /** 交给 SDK 处理请求，期间计入活跃数（GET SSE 流会一直保持活跃） */
  const dispatch = async (entry: SessionEntry, req: http.IncomingMessage, res: http.ServerResponse, body?: unknown): Promise<void> => {
    entry.active++;
    entry.lastSeen = Date.now();
    res.once("close", () => {
      entry.active--;
      entry.lastSeen = Date.now();
    });
    await entry.transport.handleRequest(req, res, body);
  };

  const closeSession = async (entry: SessionEntry): Promise<void> => {
    try {
      await entry.server.close();
    } catch {
      // 忽略关闭错误
    }
  };

  // 空闲回收：只回收没有进行中请求、且超过 TTL 未活动的会话
  const sweepTimer = setInterval(() => {
    const now = Date.now();
    for (const entry of [...sessions.values()]) {
      if (entry.active <= 0 && now - entry.lastSeen > sessionTtlMs) void closeSession(entry);
    }
  }, options.sweepIntervalMs ?? 60_000);
  sweepTimer.unref();

  // ==================== 路由 ====================

  const handleMcp = async (req: http.IncomingMessage, res: http.ServerResponse): Promise<void> => {
    // 防 DNS rebinding：校验 Host（按主机名比较，与端口映射无关）
    const hostname = hostnameOf(req.headers.host);
    if (!hostname || !allowedHosts.includes(hostname)) {
      sendRpcError(res, 403, -32000, `Host 不在允许列表中: ${req.headers.host ?? "(缺失)"}，请设置 MCP_ALLOWED_HOSTS`);
      return;
    }

    if (authToken && !tokenMatches(req.headers.authorization, authToken)) {
      sendRpcError(res, 401, -32001, "未授权：缺少或错误的 Bearer token", { "WWW-Authenticate": 'Bearer realm="oh-my-sage"' });
      return;
    }

    const method = req.method || "";
    if (!["POST", "GET", "DELETE"].includes(method)) {
      sendRpcError(res, 405, -32000, "Method not allowed", { Allow: "POST, GET, DELETE" });
      return;
    }

    const sessionHeader = req.headers["mcp-session-id"];
    const sessionId = Array.isArray(sessionHeader) ? sessionHeader[0] : sessionHeader;

    let body: unknown;
    if (method === "POST") {
      let text: string;
      try {
        text = await readBody(req);
      } catch (error) {
        sendRpcError(res, 413, -32000, String(error instanceof Error ? error.message : error));
        return;
      }
      try {
        body = JSON.parse(text);
      } catch {
        sendRpcError(res, 400, -32700, "Parse error: 请求体不是合法 JSON");
        return;
      }
    }

    if (sessionId) {
      const entry = sessions.get(sessionId);
      if (!entry) {
        // 规范要求：未知会话返回 404，客户端应重新初始化
        sendRpcError(res, 404, -32001, "Session not found");
        return;
      }
      await dispatch(entry, req, res, body);
      return;
    }

    if (method === "POST" && containsInitialize(body)) {
      const entry = await createSession();
      await dispatch(entry, req, res, body);
      // 初始化失败（未分配会话 ID）时释放实例
      if (!entry.transport.sessionId) void closeSession(entry);
      return;
    }

    sendRpcError(res, 400, -32000, "Bad Request: 缺少 Mcp-Session-Id，且不是 initialize 请求");
  };

  const httpServer = http.createServer((req, res) => {
    const pathname = (req.url || "/").split("?")[0];

    // 健康检查：无需认证，不含敏感信息
    if (pathname === HEALTH_PATH && (req.method === "GET" || req.method === "HEAD")) {
      sendJson(res, 200, { ok: true, connected: gatewayManager.isConnected() });
      return;
    }

    if (pathname !== MCP_PATH) {
      sendJson(res, 404, { error: "Not found" });
      return;
    }

    handleMcp(req, res).catch((error) => {
      console.error("MCP HTTP 请求处理失败:", error);
      sendRpcError(res, 500, -32603, "Internal server error");
    });
  });

  await new Promise<void>((resolve, reject) => {
    httpServer.once("error", reject);
    httpServer.listen(port, host, () => {
      httpServer.off("error", reject);
      resolve();
    });
  });

  const address = httpServer.address();
  const actualPort = typeof address === "object" && address ? address.port : port;
  const urlHost = isWildcardHost(host) ? "127.0.0.1" : host.includes(":") && !host.startsWith("[") ? `[${host}]` : host;

  if (isWildcardHost(host) && allowedHosts.every((h) => LOOPBACK_HOSTS.includes(h))) {
    console.error(`提示：监听 ${host} 但未设置 MCP_ALLOWED_HOSTS，只接受 Host 为 ${allowedHosts.join(",")} 的请求`);
  }

  let closed = false;
  return {
    host,
    port: actualPort,
    url: `http://${urlHost}:${actualPort}${MCP_PATH}`,
    httpServer,
    gatewayManager,
    sessionCount: () => sessions.size,
    async close(): Promise<void> {
      if (closed) return;
      closed = true;
      clearInterval(sweepTimer);
      await Promise.all([...sessions.values()].map(closeSession));
      sessions.clear();
      await new Promise<void>((resolve) => {
        httpServer.close(() => resolve());
        httpServer.closeAllConnections();
      });
      if (ownsManager) {
        try {
          await gatewayManager.disconnect();
        } catch {
          // 忽略断开错误
        }
      }
    },
  };
}
