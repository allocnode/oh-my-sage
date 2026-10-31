import assert from 'node:assert/strict';
import test from 'node:test';
import type { GatewayClient } from '../../src/core/gateway/client';
import { getDeviceList, getDeviceListFor, scanGraphs, invalidateGraph, DEVICE_LIST_TTL_MS } from '../../src/core/tools/gatewayCache';
import { getGraph } from '../../src/core/tools/graph';

function fake(options: { delay?: number; versions?: Record<string, number> } = {}) {
    const calls: Array<{ method: string; params: any; start: number; end: number }> = [];
    let devices: Record<string, unknown> = { d1: { name: '灯', urn: 'u' } };
    const versions = options.versions || { a: 1, b: 1 };
    const gateway = {
        async callApi(method: string, params: any): Promise<unknown> {
            const start = Date.now();
            await new Promise((resolve) => setTimeout(resolve, options.delay ?? 0));
            calls.push({ method, params, start, end: Date.now() });
            if (method === 'getDevList') return { devList: devices };
            if (method === 'getGraphList') return Object.entries(versions).map(([id, version]) => ({ id, enable: true, userData: { name: id, lastUpdateTime: version } }));
            if (method === 'getGraph') return { id: params.id, nodes: [{ id: `n${versions[params.id]}`, type: 'onLoad', cfg: {}, props: {}, inputs: {}, outputs: {} }] };
            throw new Error(method);
        },
    } as unknown as GatewayClient;
    return { gateway, calls, setDevices: (next: Record<string, unknown>) => { devices = next; }, versions };
}

test('设备表在有效期内复用，并发调用只发一次请求', async () => {
    const { gateway, calls } = fake({ delay: 5 });
    await Promise.all([getDeviceList(gateway), getDeviceList(gateway), getDeviceList(gateway)]);
    await getDeviceList(gateway);
    assert.equal(calls.filter((call) => call.method === 'getDevList').length, 1);
    assert.ok(DEVICE_LIST_TTL_MS >= 10_000);
});

test('查找的设备不在缓存中时强制刷新一次', async () => {
    const { gateway, calls, setDevices } = fake();
    await getDeviceList(gateway);
    setDevices({ d1: { name: '灯', urn: 'u' }, d2: { name: '新音箱', urn: 'v' } });
    const known = await getDeviceListFor(gateway, ['d1', '灯']);
    assert.equal(Object.keys(known).length, 1);
    const refreshed = await getDeviceListFor(gateway, ['新音箱']);
    assert.ok(refreshed.d2);
    assert.equal(calls.filter((call) => call.method === 'getDevList').length, 2);
});

test('scanGraphs 只重读更新时间变化或已失效的规则', async () => {
    const { gateway, calls, versions } = fake();
    await scanGraphs(gateway);
    assert.equal(calls.filter((call) => call.method === 'getGraph').length, 2);
    await scanGraphs(gateway);
    assert.equal(calls.filter((call) => call.method === 'getGraph').length, 2, '未变化时不应重读');
    versions.b = 2;
    const second = await scanGraphs(gateway);
    assert.deepEqual(calls.filter((call) => call.method === 'getGraph').slice(2).map((call) => call.params.id), ['b']);
    assert.equal(second.find((item) => item.summary.id === 'b')!.nodes![0].id, 'n2');
    invalidateGraph(gateway, 'a');
    await scanGraphs(gateway);
    assert.deepEqual(calls.filter((call) => call.method === 'getGraph').slice(3).map((call) => call.params.id), ['a']);
    await scanGraphs(gateway, { fresh: true });
    assert.equal(calls.filter((call) => call.method === 'getGraph').length, 6, 'fresh 时全部重读');
});

test('getGraph 同时请求规则与规则列表', async () => {
    const { gateway, calls } = fake({ delay: 20 });
    const result = await getGraph(gateway, 'a');
    assert.equal(result.success, true);
    const graph = calls.find((call) => call.method === 'getGraph')!;
    const list = calls.find((call) => call.method === 'getGraphList')!;
    assert.ok(list.start < graph.end && graph.start < list.end, '两个请求应重叠');
});
