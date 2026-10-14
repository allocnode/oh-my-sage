import assert from 'node:assert/strict';
import http from 'node:http';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { Agent } from '../../src/server/agent/agent';
import { SessionStore } from '../../src/server/session/store';
import type { GatewayClient } from '../../src/core/gateway/client';

/**
 * Issue #25 回归（并行工具调用竞态）：
 * 模型在一次响应里并行发起多个工具调用，且结果乱序返回时，
 * 每个落库的 toolCall 都必须带上自己那一份 args。
 *
 * 旧实现用单个 currentToolCall 变量暂存，会被后一个 tool-call 覆盖，
 * 导致先发起的调用落库时 args 丢失 → 重放历史触发
 * DeepSeek 422 missing field `arguments`。
 */

/** 起一个本地 mock LLM：第 1 步并行发两个工具调用，第 2 步结束 */
function startMock(): Promise<{ port: number; close: () => void }> {
    let step = 0;
    const server = http.createServer((req, res) => {
        let body = '';
        req.on('data', c => (body += c));
        req.on('end', () => {
            res.writeHead(200, { 'Content-Type': 'text/event-stream' });
            if (step++ === 0) {
                const chunk = (id: string, idx: number, name: string) =>
                    `data: ${JSON.stringify({ choices: [{ index: 0, delta: { tool_calls: [{ index: idx, id, type: 'function', function: { name, arguments: '{}' } }] }, finish_reason: null }] })}\n\n`;
                res.write(chunk('call_00_A', 0, 'get_devices'));
                res.write(chunk('call_01_B', 1, 'get_graphs'));
                res.write(`data: ${JSON.stringify({ choices: [{ index: 0, delta: {}, finish_reason: 'tool_calls' }] })}\n\n`);
            } else {
                res.write(`data: ${JSON.stringify({ choices: [{ index: 0, delta: { content: '完成' }, finish_reason: 'stop' }] })}\n\n`);
            }
            res.write('data: [DONE]\n\n');
            res.end();
        });
    });
    return new Promise(resolve =>
        server.listen(0, '127.0.0.1', () => resolve({ port: (server.address() as any).port, close: () => server.close() })),
    );
}

test('并行工具调用且结果乱序时，每个 toolCall 都保留自己的 args', async () => {
    const mock = await startMock();
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'oh-my-sage-race-'));
    try {
        const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));
        // getDevList 故意变慢 → 先发起的调用结果后返回（复现真实乱序）
        const gateway = {
            async callApi(method: string): Promise<unknown> {
                if (method === 'getDevList') {
                    await sleep(300);
                    return { devList: { d1: { name: '客厅灯', online: true } } };
                }
                if (method === 'getGraphList') return [{ id: 'g1', name: '晚安' }];
                return {};
            },
        } as unknown as GatewayClient;

        const store = new SessionStore(dir);
        const session = await store.createSession();
        const agent = new Agent(gateway, {
            baseURL: `http://127.0.0.1:${mock.port}/v1`,
            apiKey: 'k',
            model: 'm',
            temperature: 0,
        } as any);
        (agent as any).sessionStore = store;
        agent.setSession(session.id);

        for await (const _ of agent.run('看设备和规则')) {
            /* drain */
        }

        const messages = await store.getMessages(session.id);
        const assistant = messages.find(m => m.role === 'assistant' && m.toolCalls);
        assert.ok(assistant?.toolCalls, '应落库一条带 toolCalls 的 assistant 消息');
        assert.equal(assistant.toolCalls.length, 2);

        for (const tc of assistant.toolCalls) {
            assert.equal(
                Object.prototype.hasOwnProperty.call(tc, 'args') && tc.args !== undefined,
                true,
                `toolCall ${tc.tool} 缺少 args（重放历史会触发 422 missing field arguments）`,
            );
        }

        // id ↔ tool 必须一一对应，不能错配
        const map = new Map(assistant.toolCalls.map(tc => [tc.toolCallId, tc.tool]));
        assert.equal(map.get('call_00_A'), 'get_devices');
        assert.equal(map.get('call_01_B'), 'get_graphs');
    } finally {
        fs.rmSync(dir, { recursive: true, force: true });
        mock.close();
    }
});
