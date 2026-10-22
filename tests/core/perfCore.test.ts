import assert from 'node:assert/strict';
import test from 'node:test';
import { deflateRawSync } from 'node:zlib';
import { GatewayClient } from '../../src/core/gateway/client';
import type { GatewayClient as GatewayClientType } from '../../src/core/gateway/client';
import { mapLimit } from '../../src/core/tools/base';
import { clearMiotSpecCache, fetchMiotSpec, getDevice } from '../../src/core/tools/device';
import { validateGraphVariablesWithGateway } from '../../src/core/tools/capabilityValidation';
import type { GraphNode } from '../../src/core/types/graph';

// ==================== mapLimit ====================

test('mapLimit 保持输入顺序且并发不超过上限', async () => {
    let active = 0;
    let peak = 0;
    const result = await mapLimit([30, 5, 20, 1, 10, 15, 2], 3, async (delay, index) => {
        active++;
        peak = Math.max(peak, active);
        await new Promise((resolve) => setTimeout(resolve, delay));
        active--;
        return `${index}:${delay}`;
    });
    assert.deepEqual(result, ['0:30', '1:5', '2:20', '3:1', '4:10', '5:15', '6:2']);
    assert.equal(peak, 3);
    assert.deepEqual(await mapLimit([], 6, async () => 1), []);
});

test('mapLimit 任一任务失败整体 reject', async () => {
    await assert.rejects(mapLimit([1, 2, 3], 2, async (value) => {
        if (value === 2) throw new Error('boom');
        return value;
    }), /boom/);
});

// ==================== fetchMiotSpec ====================

const SPEC = { services: [{ iid: 2, description: 'light', properties: [{ iid: 1, description: 'on', format: 'bool', access: ['read', 'write'] }] }] };

test('fetchMiotSpec 并发调用共享一次请求，且带超时信号', async () => {
    clearMiotSpecCache();
    const originalFetch = globalThis.fetch;
    let count = 0;
    let signal: AbortSignal | undefined;
    globalThis.fetch = (async (_url: string, init?: RequestInit) => {
        count++;
        signal = init?.signal ?? undefined;
        await new Promise((resolve) => setTimeout(resolve, 5));
        return new Response(JSON.stringify(SPEC), { status: 200 });
    }) as typeof fetch;
    try {
        const [a, b] = await Promise.all([fetchMiotSpec('urn:cache:a'), fetchMiotSpec('urn:cache:a')]);
        await fetchMiotSpec('urn:cache:a');
        assert.equal(count, 1);
        assert.ok(signal);
        assert.equal(a, b);
        assert.equal(a.properties?.[0].desc, 'light-on');
    } finally {
        globalThis.fetch = originalFetch;
        clearMiotSpecCache();
    }
});

test('fetchMiotSpec 失败不缓存，可重试', async () => {
    clearMiotSpecCache();
    const originalFetch = globalThis.fetch;
    let count = 0;
    globalThis.fetch = (async () => {
        count++;
        return count === 1 ? new Response('no', { status: 503 }) : new Response(JSON.stringify(SPEC), { status: 200 });
    }) as typeof fetch;
    try {
        await assert.rejects(fetchMiotSpec('urn:cache:b'), /HTTP 503/);
        const spec = await fetchMiotSpec('urn:cache:b');
        assert.equal(count, 2);
        assert.equal(spec.properties?.length, 1);
    } finally {
        globalThis.fetch = originalFetch;
        clearMiotSpecCache();
    }
});

test('getDevice 对相同 URN 只拉取一次 Spec，失败写入 specError', async () => {
    clearMiotSpecCache();
    const originalFetch = globalThis.fetch;
    const urls: string[] = [];
    globalThis.fetch = (async (url: string) => {
        urls.push(url);
        return url.includes('bad') ? new Response('x', { status: 404 }) : new Response(JSON.stringify(SPEC), { status: 200 });
    }) as typeof fetch;
    const gateway = {
        callApi: async () => ({
            devList: {
                d1: { name: 'A', model: 'm', modelName: 'M', online: true, roomName: 'R', urn: 'urn:same' },
                d2: { name: 'B', model: 'm', modelName: 'M', online: true, roomName: 'R', urn: 'urn:same' },
                d3: { name: 'C', model: 'm', modelName: 'M', online: true, roomName: 'R', urn: 'urn:bad' },
            },
        }),
    } as unknown as GatewayClientType;
    try {
        const result = await getDevice(gateway, ['d1', 'd2', 'd3']);
        assert.equal(result.success, true);
        assert.equal(urls.length, 2);
        assert.equal(result.success && result.data?.[1].properties?.length, 1);
        assert.equal(result.success && result.data?.[2].specError, 'HTTP 404');
    } finally {
        globalThis.fetch = originalFetch;
        clearMiotSpecCache();
    }
});

// ==================== GatewayClient 请求生命周期 ====================

interface ClientInternals {
    secureEstablished: boolean;
    connected: boolean;
    cipherOut: { encrypt(data: Buffer): Buffer } | null;
    cipherIn: { decrypt(data: Buffer): Buffer } | null;
    ws: { send(data: Buffer): void; close(): void } | null;
    pendingRequests: Map<number, { timer?: NodeJS.Timeout }>;
    handleMessage(data: Buffer): void;
}

function fakeSecureClient(): { client: GatewayClient; state: ClientInternals; sent: Buffer[] } {
    const client = new GatewayClient();
    const state = client as unknown as ClientInternals;
    const sent: Buffer[] = [];
    state.secureEstablished = true;
    state.connected = true;
    state.cipherOut = { encrypt: (data) => data };
    state.cipherIn = { decrypt: (data) => data };
    state.ws = { send: (data) => { sent.push(data); }, close: () => undefined };
    return { client, state, sent };
}

function frame(payload: unknown): Buffer {
    const json = Buffer.from(JSON.stringify(payload), 'utf8');
    const header = Buffer.alloc(4);
    header.writeUInt32LE(json.length, 0);
    return Buffer.concat([Buffer.from([5]), header, deflateRawSync(json)]);
}

test('callApi 收到响应后清理超时计时器', async () => {
    const { state } = fakeSecureClient();
    const client = state as unknown as GatewayClient;
    const pending = client.callApi<number>('ping', {}, 60000);
    const entry = state.pendingRequests.get(0);
    assert.ok(entry?.timer);
    state.handleMessage(frame({ id: 0, result: 42 }));
    assert.equal(await pending, 42);
    assert.equal(state.pendingRequests.size, 0);
    // 计时器已清理：若未清理，60 秒计时器会让测试进程悬挂
});

test('关闭连接立即拒绝所有等待中的 API 调用', async () => {
    const { client, state } = fakeSecureClient();
    const first = client.callApi('a', {}, 60000);
    const second = client.callApi('b', {}, 60000);
    assert.equal(state.pendingRequests.size, 2);
    await client.close();
    await assert.rejects(first, /Gateway connection closed/);
    await assert.rejects(second, /Gateway connection closed/);
    assert.equal(state.pendingRequests.size, 0);
});

test('坏帧错误节流：只打印首条', () => {
    const { state } = fakeSecureClient();
    const original = console.error;
    const lines: string[] = [];
    console.error = (...args: unknown[]) => { lines.push(args.map(String).join(' ')); };
    try {
        for (let i = 0; i < 5; i++) state.handleMessage(Buffer.from([5, 1, 2, 3]));
    } finally {
        console.error = original;
    }
    assert.equal(lines.length, 1);
    assert.match(lines[0], /Error handling message/);
});

test('坏帧错误节流：close 输出剩余计数并重置，下一次连接首条立即打印', async () => {
    const { client, state } = fakeSecureClient();
    const original = console.error;
    const lines: string[] = [];
    console.error = (...args: unknown[]) => { lines.push(args.map(String).join(' ')); };
    try {
        for (let i = 0; i < 4; i++) state.handleMessage(Buffer.from([5, 1, 2, 3]));
        await client.close();
        assert.equal(lines.length, 2);
        assert.match(lines[1], /suppressed 3 gateway frame errors/);

        // 模拟重新建立会话
        state.secureEstablished = true;
        state.cipherIn = { decrypt: (data) => data };
        state.handleMessage(Buffer.from([5, 1, 2, 3]));
        await client.close();
    } finally {
        console.error = original;
    }
    assert.equal(lines.length, 3);
    assert.match(lines[2], /Error handling message/);
});

// ==================== 本规则变量校验 ====================

const varNode = (props: Record<string, unknown>): GraphNode => ({ id: 'calc', type: 'varSetNumber', cfg: {}, props, inputs: {}, outputs: {} });

test('rule 作用域引用按 ruleVariables 解析且不访问网关', async () => {
    const calls: string[] = [];
    const gateway = { async callApi(method: string): Promise<unknown> { calls.push(method); return {}; } } as unknown as GatewayClientType;
    const nodes = [
        varNode({ id: 'count', scope: 'rule', elements: [{ type: 'var', id: 'label', scope: 'rule' }, { type: 'var', id: 'ghost', scope: 'rule' }] }),
        { ...varNode({ id: 'label', scope: 'rule', elements: [] }), id: 'str', type: 'varSetString' },
        { ...varNode({ id: 'count', scope: 'rule', elements: [] }), id: 'str2', type: 'varSetString' },
    ];
    const errors = await validateGraphVariablesWithGateway(gateway, nodes, {
        ruleVariables: [{ id: 'count', type: 'number' }, { id: 'label', type: 'string' }],
    });
    assert.deepEqual(calls, []);
    assert.deepEqual(errors.map((item) => item.type), ['variable_type_mismatch', 'unknown_variable', 'variable_type_mismatch']);
});

test('未提供 ruleVariables 时 rule 作用域引用给出明确错误', async () => {
    const calls: string[] = [];
    const gateway = { async callApi(method: string): Promise<unknown> { calls.push(method); return {}; } } as unknown as GatewayClientType;
    const errors = await validateGraphVariablesWithGateway(gateway, [varNode({ id: 'count', scope: 'rule', elements: [] })]);
    assert.deepEqual(calls, []);
    assert.equal(errors.length, 1);
    assert.equal(errors[0].type, 'unknown_variable');
    assert.equal(errors[0].message, '本规则变量 rule/count 未声明；请在 variables 中声明');
});
