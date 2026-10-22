import assert from 'node:assert/strict';
import fs from 'node:fs';
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import type { GatewayManager } from '../../src/core/gateway/manager';
import { defaultAllowedHosts, resolveHttpOptions, startHttpServer, type RunningHttpServer } from '../../src/mcp/http';
import { GraphDraftStore } from '../../src/mcp/tools/graphDraft';

const TOKEN = 'test-token-123';

/** 不会真正连接网关的替身：只暴露可切换的连接状态 */
function stubManager(): GatewayManager & { connected: boolean } {
    return {
        connected: false,
        gateway: null,
        isConnected() { return this.connected; },
        async connect() { throw new Error('stub: 不连接真实网关'); },
        async disconnect() { this.connected = false; },
        ensureConnected() { if (!this.connected) throw new Error('网关未连接，请先调用 mijia_auth'); },
    };
}

function rawRequest(port: number, options: http.RequestOptions, body?: string): Promise<{ status: number; text: string }> {
    return new Promise((resolve, reject) => {
        const req = http.request({ host: '127.0.0.1', port, ...options }, (res) => {
            let text = '';
            res.setEncoding('utf8');
            res.on('data', (chunk) => { text += chunk; });
            res.on('end', () => resolve({ status: res.statusCode ?? 0, text }));
        });
        req.on('error', reject);
        if (body) req.write(body);
        req.end();
    });
}

async function connectClient(server: RunningHttpServer): Promise<Client> {
    const client = new Client({ name: 'http-test', version: '0.0.0' });
    const transport = new StreamableHTTPClientTransport(new URL(server.url), {
        requestInit: { headers: { Authorization: `Bearer ${TOKEN}` } },
    });
    await client.connect(transport);
    return client;
}

function structured(result: unknown): Record<string, unknown> {
    return (result as { structuredContent?: Record<string, unknown> }).structuredContent ?? {};
}

const INIT_BODY = JSON.stringify({
    jsonrpc: '2.0', id: 1, method: 'initialize',
    params: { protocolVersion: '2025-03-26', capabilities: {}, clientInfo: { name: 'raw', version: '0' } },
});

test('HTTP 传输：健康检查、认证、Host 校验、并发与共享网关状态', async (t) => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'oh-my-sage-http-'));
    const manager = stubManager();
    const server = await startHttpServer({
        host: '127.0.0.1',
        port: 0,
        authToken: TOKEN,
        gatewayManager: manager,
        drafts: new GraphDraftStore(path.join(dir, 'drafts.json')),
    });
    const clients: Client[] = [];
    try {
        await t.test('healthz 无需认证且只返回连接状态', async () => {
            const res = await fetch(`http://127.0.0.1:${server.port}/healthz`);
            assert.equal(res.status, 200);
            assert.deepEqual(await res.json(), { ok: true, connected: false });
        });

        await t.test('缺少或错误 token 返回 401', async () => {
            const headers = { 'Content-Type': 'application/json', Accept: 'application/json, text/event-stream' };
            const missing = await rawRequest(server.port, { method: 'POST', path: '/mcp', headers }, INIT_BODY);
            assert.equal(missing.status, 401);
            const wrong = await rawRequest(server.port, { method: 'POST', path: '/mcp', headers: { ...headers, Authorization: 'Bearer nope' } }, INIT_BODY);
            assert.equal(wrong.status, 401);
        });

        await t.test('不在允许列表的 Host 返回 403', async () => {
            const res = await rawRequest(server.port, {
                method: 'POST',
                path: '/mcp',
                headers: {
                    Host: `evil.example.com:${server.port}`,
                    Authorization: `Bearer ${TOKEN}`,
                    'Content-Type': 'application/json',
                    Accept: 'application/json, text/event-stream',
                },
            }, INIT_BODY);
            assert.equal(res.status, 403);
        });

        await t.test('未知会话 ID 返回 404', async () => {
            const res = await rawRequest(server.port, {
                method: 'POST',
                path: '/mcp',
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                    'Mcp-Session-Id': 'no-such-session',
                    'Content-Type': 'application/json',
                    Accept: 'application/json, text/event-stream',
                },
            }, JSON.stringify({ jsonrpc: '2.0', id: 2, method: 'tools/list' }));
            assert.equal(res.status, 404);
        });

        await t.test('SDK 客户端列出工具并并发 50 次 mijia_status', async () => {
            const client = await connectClient(server);
            clients.push(client);
            const { tools } = await client.listTools();
            assert.ok(tools.length >= 20, `工具数量过少: ${tools.length}`);
            assert.ok(tools.some((tool) => tool.name === 'mijia_status'));
            const results = await Promise.all(
                Array.from({ length: 50 }, () => client.callTool({ name: 'mijia_status', arguments: {} }))
            );
            assert.equal(results.length, 50);
            for (const result of results) {
                assert.notEqual(result.isError, true);
                assert.equal(structured(result).connected, false);
            }
        });

        await t.test('两个会话共享同一个网关管理器状态', async () => {
            const a = await connectClient(server);
            const b = await connectClient(server);
            clients.push(a, b);
            assert.ok(server.sessionCount() >= 3);

            manager.connected = true;
            assert.equal(structured(await a.callTool({ name: 'mijia_status', arguments: {} })).connected, true);
            assert.equal(structured(await b.callTool({ name: 'mijia_status', arguments: {} })).connected, true);

            const health = await (await fetch(`http://127.0.0.1:${server.port}/healthz`)).json();
            assert.equal(health.connected, true);

            // 已连接时 mijia_auth 提示可直接使用，不触发真实认证
            const auth = await b.callTool({ name: 'mijia_auth', arguments: { passcode: '123456' } });
            assert.equal(auth.isError, true);
            const text = (auth.content as Array<{ type: string; text: string }>)[0].text;
            assert.match(text, /已连接且可直接使用/);

            // 一个会话断开网关，另一个会话立即看到
            await a.callTool({ name: 'mijia_disconnect', arguments: {} });
            assert.equal(structured(await b.callTool({ name: 'mijia_status', arguments: {} })).connected, false);
        });

        await t.test('客户端终止会话后服务端回收', async () => {
            const before = server.sessionCount();
            const client = await connectClient(server);
            assert.equal(server.sessionCount(), before + 1);
            await (client.transport as StreamableHTTPClientTransport).terminateSession();
            await client.close();
            assert.equal(server.sessionCount(), before);
        });
    } finally {
        await Promise.all(clients.map((client) => client.close().catch(() => undefined)));
        await server.close();
        fs.rmSync(dir, { recursive: true, force: true });
    }
});

test('非回环地址未配置 token 时拒绝启动', async () => {
    await assert.rejects(
        startHttpServer({ host: '0.0.0.0', port: 0, gatewayManager: stubManager() }),
        /MCP_AUTH_TOKEN/
    );
});

test('空闲会话超过 TTL 后被回收', async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'oh-my-sage-http-'));
    const server = await startHttpServer({
        host: '127.0.0.1',
        port: 0,
        authToken: TOKEN,
        gatewayManager: stubManager(),
        drafts: new GraphDraftStore(path.join(dir, 'drafts.json')),
        sessionTtlMs: 50,
        sweepIntervalMs: 20,
    });
    // 只发 initialize，不建立 GET SSE 流，模拟客户端消失
    try {
        const res = await rawRequest(server.port, {
            method: 'POST',
            path: '/mcp',
            headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json', Accept: 'application/json, text/event-stream' },
        }, INIT_BODY);
        assert.equal(res.status, 200);
        assert.equal(server.sessionCount(), 1);
        await new Promise((resolve) => setTimeout(resolve, 200));
        assert.equal(server.sessionCount(), 0);
    } finally {
        await server.close();
        fs.rmSync(dir, { recursive: true, force: true });
    }
});

test('环境变量解析与默认允许 Host', () => {
    const local = resolveHttpOptions({});
    assert.equal(local.host, '127.0.0.1');
    assert.equal(local.port, 3790);
    assert.equal(local.authToken, undefined);
    assert.deepEqual(local.allowedHosts.sort(), ['127.0.0.1', '[::1]', 'localhost']);

    const lan = resolveHttpOptions({ MCP_HTTP_HOST: '0.0.0.0', MCP_HTTP_PORT: '4000', MCP_AUTH_TOKEN: 'x', MCP_ALLOWED_HOSTS: 'nas.lan, 192.168.1.10' });
    assert.equal(lan.port, 4000);
    assert.equal(lan.authToken, 'x');
    assert.ok(lan.allowedHosts.includes('nas.lan'));
    assert.ok(lan.allowedHosts.includes('192.168.1.10'));
    assert.ok(lan.allowedHosts.includes('localhost'));

    assert.ok(defaultAllowedHosts('192.168.1.10').includes('192.168.1.10'));
    assert.ok(!defaultAllowedHosts('0.0.0.0').includes('0.0.0.0'));
    assert.throws(() => resolveHttpOptions({ MCP_HTTP_PORT: 'abc' }), /MCP_HTTP_PORT/);
});
