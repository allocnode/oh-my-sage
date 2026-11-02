import assert from 'node:assert/strict';
import test from 'node:test';
import { createGatewayManager, VERIFY_METHOD, type GatewayClientLike } from '../../src/core/gateway/manager';

/** 不连接真实网关的替身客户端：按登录码决定认证成败，可控制只读请求的结果 */
class FakeClient implements GatewayClientLike {
    static created: FakeClient[] = [];
    connected = false;
    closed = false;
    url = '';
    calls: string[] = [];
    callResult: 'ok' | 'fail' = 'ok';
    authDelayMs = 0;

    constructor() {
        FakeClient.created.push(this);
    }

    async connect(url: string): Promise<void> {
        if (url.includes('unreachable')) throw new Error('connect ECONNREFUSED');
        this.url = url;
    }

    async authenticate(passcode: string): Promise<void> {
        if (this.authDelayMs) await new Promise((resolve) => setTimeout(resolve, this.authDelayMs));
        if (passcode === '000000') throw new Error('登录码已被使用或无效');
        this.connected = true;
    }

    async close(): Promise<void> {
        this.closed = true;
        this.connected = false;
    }

    isConnected(): boolean {
        return this.connected;
    }

    async callApi<T = unknown>(method: string): Promise<T> {
        this.calls.push(method);
        if (this.callResult === 'fail') throw new Error(`API call timeout: ${method}`);
        return { scopes: [] } as T;
    }
}

function managerWithFakes(delays: number[] = []) {
    FakeClient.created = [];
    let index = 0;
    return createGatewayManager({
        warmUp: false,
        createClient: () => {
            const client = new FakeClient();
            client.authDelayMs = delays[index++] ?? 0;
            return client;
        },
    });
}

test('重新登录失败时保留原有连接', async () => {
    const manager = managerWithFakes();
    await manager.connect('111111', 'http://gw-a');
    const original = FakeClient.created[0];
    assert.equal(manager.isConnected(), true);

    await assert.rejects(manager.connect('000000', 'http://gw-b'), /登录码/);
    assert.equal(manager.isConnected(), true);
    assert.equal(manager.gateway as unknown, original);
    assert.equal(original.closed, false);
    assert.equal(FakeClient.created[1].closed, true, '失败的新连接要被关闭');

    await assert.rejects(manager.connect('222222', 'http://unreachable'), /ECONNREFUSED/);
    assert.equal(manager.gateway as unknown, original);
});

test('重新登录成功后才替换并关闭旧连接', async () => {
    const manager = managerWithFakes();
    await manager.connect('111111', 'http://gw-a');
    const original = FakeClient.created[0];

    await manager.connect('222222', 'http://gw-b');
    const next = FakeClient.created[1];
    assert.equal(manager.gateway as unknown, next);
    assert.equal(next.url, 'http://gw-b');
    assert.equal(original.closed, true);
    assert.equal(manager.isConnected(), true);
});

test('首次登录失败时保持未连接', async () => {
    const manager = managerWithFakes();
    await assert.rejects(manager.connect('000000', 'http://gw-a'), /登录码/);
    assert.equal(manager.isConnected(), false);
    assert.equal(manager.gateway, null);
});

test('未配置网关地址时报错且不创建客户端', async () => {
    const saved = process.env.GATEWAY_URL;
    delete process.env.GATEWAY_URL;
    try {
        const manager = managerWithFakes();
        await assert.rejects(manager.connect('111111'), /未配置网关地址/);
        assert.equal(FakeClient.created.length, 0);
    } finally {
        if (saved !== undefined) process.env.GATEWAY_URL = saved;
    }
});

test('并发登录按调用顺序串行执行，最后一次成功的连接生效', async () => {
    // 第一次认证更慢：若不串行，第一次会在第二次之后完成并覆盖它
    const manager = managerWithFakes([40, 0]);
    const first = manager.connect('111111', 'http://gw-a');
    const second = manager.connect('222222', 'http://gw-b');
    await Promise.all([first, second]);

    const [a, b] = FakeClient.created;
    assert.equal(manager.gateway as unknown, b);
    assert.equal(a.closed, true);
    assert.equal(b.closed, false);
});

test('前一次登录失败不影响排在后面的登录', async () => {
    const manager = managerWithFakes([20, 0]);
    const failed = manager.connect('000000', 'http://gw-a');
    const ok = manager.connect('222222', 'http://gw-b');
    await assert.rejects(failed);
    await ok;
    assert.equal(manager.isConnected(), true);
    assert.equal((manager.gateway as unknown as FakeClient).url, 'http://gw-b');
});

test('verify：未连接、网关响应、网关不响应三种结果', async () => {
    const manager = managerWithFakes();
    assert.deepEqual(await manager.verify!(), { connected: false, responsive: false, error: '网关未连接' });

    await manager.connect('111111', 'http://gw-a');
    const client = FakeClient.created[0];
    const ok = await manager.verify!();
    assert.equal(ok.responsive, true);
    assert.equal(ok.connected, true);
    assert.equal(typeof ok.latencyMs, 'number');
    assert.deepEqual(client.calls, [VERIFY_METHOD]);

    client.callResult = 'fail';
    const bad = await manager.verify!();
    assert.equal(bad.responsive, false);
    assert.match(bad.error ?? '', /timeout/);
    // 验证失败不会断开或替换连接
    assert.equal(manager.gateway as unknown, client);
    assert.equal(client.closed, false);
});

test('disconnect 关闭当前连接', async () => {
    const manager = managerWithFakes();
    await manager.connect('111111', 'http://gw-a');
    await manager.disconnect();
    assert.equal(manager.isConnected(), false);
    assert.equal(FakeClient.created[0].closed, true);
});
