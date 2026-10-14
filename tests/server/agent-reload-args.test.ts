import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { Agent } from '../../src/server/agent/agent';
import { SessionStore } from '../../src/server/session/store';
import type { GatewayClient } from '../../src/core/gateway/client';

/**
 * Issue #25 回归：会话历史中的 toolCall 若缺 args，
 * reloadMessages 重建出的 tool-call 必须以 {} 兜底。
 *
 * 否则 AI SDK 出站会执行 JSON.stringify(undefined) → 直接省略
 * tool_calls[].function.arguments 字段，DeepSeek 等严格校验的服务端
 * 会返回 422 missing field `arguments`。
 */

function tempStore(): { store: SessionStore; dir: string } {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'oh-my-sage-agent-'));
    return { store: new SessionStore(dir), dir };
}

test('reloadMessages 对缺 args 的 toolCall 兜底为空对象', async () => {
    const { store, dir } = tempStore();
    try {
        const session = await store.createSession();
        await store.appendMessage(session.id, {
            role: 'assistant',
            content: '',
            timestamp: new Date().toISOString(),
            // 模拟历史遗留数据：toolCall 缺 args
            toolCalls: [{ tool: 'get_devices', result: { success: true }, success: true } as any],
        });

        const agent = new Agent({} as GatewayClient, {
            baseURL: 'http://127.0.0.1:1/v1',
            apiKey: 'x',
            model: 'x',
        });
        (agent as any).sessionStore = store;
        agent.setSession(session.id);
        await (agent as any).reloadMessages();

        const messages = agent.getHistory() as any[];
        const assistant = messages.find(m => m.role === 'assistant' && Array.isArray(m.content));
        assert.ok(assistant, '应重建出带 tool-call 的 assistant 消息');

        const part = assistant.content.find((p: any) => p.type === 'tool-call');
        assert.ok(part, '应包含 tool-call part');
        assert.notEqual(part.args, undefined, 'args 不得为 undefined（否则出站会丢 arguments 字段）');
        assert.deepEqual(part.args, {}, 'args 应兜底为 {}');
    } finally {
        fs.rmSync(dir, { recursive: true, force: true });
    }
});

test('reloadMessages 保留已有的 args', async () => {
    const { store, dir } = tempStore();
    try {
        const session = await store.createSession();
        await store.appendMessage(session.id, {
            role: 'assistant',
            content: '',
            timestamp: new Date().toISOString(),
            toolCalls: [{ toolCallId: 'c1', tool: 'get_device', args: { dids: ['d1'] }, result: { success: true }, success: true }],
        });

        const agent = new Agent({} as GatewayClient, {
            baseURL: 'http://127.0.0.1:1/v1',
            apiKey: 'x',
            model: 'x',
        });
        (agent as any).sessionStore = store;
        agent.setSession(session.id);
        await (agent as any).reloadMessages();

        const assistant = (agent.getHistory() as any[]).find(m => m.role === 'assistant' && Array.isArray(m.content));
        const part = assistant.content.find((p: any) => p.type === 'tool-call');
        assert.deepEqual(part.args, { dids: ['d1'] }, '已有 args 必须原样保留');
        assert.equal(part.toolCallId, 'c1');
    } finally {
        fs.rmSync(dir, { recursive: true, force: true });
    }
});
