import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';
import { normalizeMiotSpec } from '../../src/core/tools/device';
import { graphHash } from '../../src/core/tools/graphEdit';
import type { DeviceInfo } from '../../src/core/types/device';
import type { Graph } from '../../src/core/types/graph';
import {
    MAX_RESULT_BYTES,
    MAX_STRUCTURED_BYTES,
    capText,
    formatDeviceListMarkdown,
    formatDeviceSummaryMarkdown,
    formatGraphListMarkdown,
    formatJson,
    shapeGraphOutput,
    summarizeDevice,
    textResult,
} from '../../src/mcp/utils';

const bytes = (text: string): number => Buffer.byteLength(text, 'utf8');
const firstText = (result: ReturnType<typeof textResult>): string => (result.content[0] as { text: string }).text;

// ==================== 输出卫生 ====================

test('formatJson 输出紧凑 JSON', () => {
    assert.equal(formatJson({ a: 1, b: [1, 2], c: { d: 'x' } }), '{"a":1,"b":[1,2],"c":{"d":"x"}}');
});

test('capText 未超限时原样返回，恰好等于上限也不截断', () => {
    assert.equal(capText('hello'), 'hello');
    const exact = 'a'.repeat(MAX_RESULT_BYTES);
    assert.equal(capText(exact), exact);
});

test('capText 超限时不超过上限，并附带包含提示的截断说明', () => {
    const text = 'b'.repeat(MAX_RESULT_BYTES + 1);
    const capped = capText(text, '请使用 node_ids');
    assert.ok(bytes(capped) <= MAX_RESULT_BYTES, `结果 ${bytes(capped)} 字节超过上限`);
    const lastLine = capped.slice(capped.lastIndexOf('\n') + 1);
    assert.match(lastLine, /^\[已截断：原始 40001 字节，仅显示前 \d+ 字节。请使用 node_ids\]$/);
    const shown = Number(/仅显示前 (\d+) 字节/.exec(lastLine)![1]);
    assert.equal(shown, bytes(capped.slice(0, capped.lastIndexOf('\n'))));
});

test('capText 不拆分代理对，多字节字符也不超限', () => {
    const emojiish = '\u{1F600}'.repeat(20_000); // 每个 4 字节、2 个 UTF-16 单元
    const capped = capText(emojiish, 'hint');
    assert.ok(bytes(capped) <= MAX_RESULT_BYTES);
    const body = capped.slice(0, capped.lastIndexOf('\n'));
    assert.equal(body.length % 2, 0);
    assert.ok(!/[\uD800-\uDBFF]$/.test(body), '结尾不应残留高位代理');
    assert.doesNotThrow(() => new TextDecoder('utf-8', { fatal: true }).decode(Buffer.from(body, 'utf8')));

    const chinese = '中'.repeat(20_000);
    assert.ok(bytes(capText(chinese)) <= MAX_RESULT_BYTES);
});

test('capText 优先在最后一个换行处切断', () => {
    const line = `${'x'.repeat(99)}\n`;
    const text = line.repeat(1000);
    const capped = capText(text, 'hint');
    const body = capped.slice(0, capped.lastIndexOf('\n['));
    assert.ok(body.split('\n').every((row) => row.length === 99), '不应出现被截半的行');
});

test('capText 支持更小的自定义上限，但不超过全局上限', () => {
    const text = 'c'.repeat(5000);
    assert.ok(bytes(capText(text, 'h', 2000)) <= 2000);
    assert.ok(bytes(capText('d'.repeat(MAX_RESULT_BYTES * 2), 'h', MAX_RESULT_BYTES * 2)) <= MAX_RESULT_BYTES);
});

test('textResult 默认附带 structuredContent，仅超过 1 MB 省略，错误结果只返回 content', () => {
    const small = textResult('ok', { a: 1 });
    assert.deepEqual(small.structuredContent, { a: 1 });
    assert.equal(small.isError, undefined);

    const medium = { devices: Array.from({ length: 100 }, (_, i) => ({ did: `d${i}`, name: `设备${i}`, roomName: '客厅' })), pad: 'm'.repeat(6_000) };
    assert.ok(bytes(JSON.stringify(medium)) > 10_000);
    assert.deepEqual(textResult('ok', medium).structuredContent, medium);

    const big = { data: 'z'.repeat(MAX_STRUCTURED_BYTES) };
    const omitted = textResult('ok', big);
    assert.equal(omitted.structuredContent, undefined);

    const error = textResult('Error: boom', { a: 1 }, true);
    assert.equal(error.isError, true);
    assert.equal(error.structuredContent, undefined);
    assert.equal(firstText(error), 'Error: boom');
});

test('textResult 对文本应用上限', () => {
    const result = textResult('q'.repeat(MAX_RESULT_BYTES * 2), undefined, false, { hint: '缩小范围' });
    assert.ok(bytes(firstText(result)) <= MAX_RESULT_BYTES);
    assert.match(firstText(result), /缩小范围\]$/);
});

test('src/mcp 与 src/core 非测试源码不含 emoji / 图形符号', () => {
    const pattern = /[\u2600-\u27BF\uFE0F]|[\u{1F300}-\u{1FAFF}]/u;
    const roots = [join(__dirname, '../../src/mcp'), join(__dirname, '../../src/core')];
    const offenders: string[] = [];
    const walk = (dir: string): void => {
        for (const entry of readdirSync(dir)) {
            const full = join(dir, entry);
            if (statSync(full).isDirectory()) { walk(full); continue; }
            if (!full.endsWith('.ts') || full.endsWith('.test.ts')) continue;
            readFileSync(full, 'utf8').split('\n').forEach((line, index) => {
                if (pattern.test(line)) offenders.push(`${full}:${index + 1}`);
            });
        }
    };
    roots.forEach(walk);
    assert.deepEqual(offenders, []);
});

test('列表 Markdown 每项一行并使用文字标签', () => {
    const devices = formatDeviceListMarkdown([
        { did: 'd1', name: '灯', modelName: '吸顶灯', online: true, roomName: '客厅' },
        { did: 'd2', name: '插座', online: false },
    ], 2);
    assert.match(devices, /^- 灯 \(d1\) \| 客厅 \| 吸顶灯 \| \[在线\]$/m);
    assert.match(devices, /^- 插座 \(d2\) \| 未分组 \| 未知 \| \[离线\]$/m);

    const graphs = formatGraphListMarkdown([{ id: 'g1', name: '回家', enable: true }, { id: 'g2', name: '离家', enable: false }]);
    assert.match(graphs, /^- 回家 \(g1\) \[启用\]$/m);
    assert.match(graphs, /^- 离家 \(g2\) \[禁用\]$/m);
});

// ==================== 设备摘要 ====================

function fixtureDevice(): DeviceInfo {
    const valueList = Array.from({ length: 35 }, (_, index) => ({ value: index, description: `mode${index}` }));
    const spec = normalizeMiotSpec({
        services: [
            {
                iid: 2,
                description: 'Light',
                properties: [
                    { iid: 1, description: 'Switch Status', format: 'bool', access: ['read', 'write', 'notify'] },
                    { iid: 2, description: 'Brightness', format: 'uint8', unit: 'percentage', access: ['read', 'write'], 'value-range': [1, 100, 1] },
                    { iid: 3, description: 'Mode', format: 'uint8', access: ['read', 'notify'], 'value-list': valueList },
                ],
                actions: [{ iid: 1, description: 'Toggle', in: [] }],
            },
            {
                iid: 3,
                description: 'Switch',
                properties: [{ iid: 1, description: 'Button', format: 'uint8', access: [] }],
                events: [{ iid: 1, description: 'Click', arguments: [1] }],
                actions: [{ iid: 2, description: 'Set', in: [1] }],
            },
        ],
    } as Parameters<typeof normalizeMiotSpec>[0]);
    return {
        did: 'dev1', found: true, name: '灯', model: 'test.light', modelName: '测试灯', online: true, roomName: '客厅',
        urn: 'urn:miot-spec-v2:device:light:0000A001:test-light:1', ...spec,
    };
}

test('summarizeDevice 每个属性只出现一次并压缩 access/枚举', () => {
    const device = fixtureDevice();
    const summary = summarizeDevice(device);
    assert.equal(summary.urn, device.urn);
    assert.equal(summary.properties!.length, 4);
    assert.deepEqual(summary.properties![0], { siid: 2, piid: 1, desc: 'Light-Switch Status', dtype: 'bool', access: 'rwn' });
    assert.deepEqual(summary.properties![1], { siid: 2, piid: 2, desc: 'Light-Brightness', dtype: 'uint8', access: 'rw', unit: 'percentage', range: { min: 1, max: 100, step: 1 } });
    const mode = summary.properties![2];
    assert.equal(mode.access, 'rn');
    assert.equal(mode.values!.length, 30);
    assert.deepEqual(mode.values![0], { v: 0, d: 'mode0' });
    assert.equal(mode.valuesTruncated, 5);
    assert.deepEqual(summary.events, [{ siid: 3, eiid: 1, desc: 'Switch-Click', args: [1] }]);
    assert.deepEqual(summary.actions, [
        { siid: 2, aiid: 1, desc: 'Light-Toggle', in: [] },
        { siid: 3, aiid: 2, desc: 'Switch-Set', in: [1] },
    ]);
    const keys = Object.keys(summary);
    assert.ok(!keys.includes('triggers') && !keys.includes('readable'));
    assert.ok(bytes(formatJson(summary)) < bytes(formatJson(device)) / 2, '摘要应显著小于完整对象');
});

test('summarizeDevice 支持 siids 过滤，未找到设备只保留 did/found', () => {
    const summary = summarizeDevice(fixtureDevice(), [3]);
    assert.deepEqual(summary.properties!.map((p) => `${p.siid}.${p.piid}`), ['3.1']);
    assert.deepEqual(summary.actions!.map((a) => a.aiid), [2]);
    assert.deepEqual(summarizeDevice({ did: 'x', found: false, name: '', model: '', modelName: '', online: false, roomName: '', urn: '' }), { did: 'x', found: false });
});

test('设备摘要 Markdown 每个属性一行且包含 urn', () => {
    const markdown = formatDeviceSummaryMarkdown([summarizeDevice(fixtureDevice()), { did: 'gone', found: false }]);
    assert.match(markdown, /^urn: urn:miot-spec-v2:device:light:0000A001:test-light:1$/m);
    assert.match(markdown, /^- 2\.2 Light-Brightness \| uint8 \| rw \| unit=percentage range=1\.\.100\/1$/m);
    assert.match(markdown, /values=0:mode0,.*,\.\.\.\(\+5\)/);
    assert.match(markdown, /^- 3\.1 Switch-Click args=1$/m);
    assert.match(markdown, /gone \[注意\] 网关设备表中不存在该设备ID/);
    assert.doesNotMatch(markdown, /\[\{/, '不应输出整段 JSON 列表');
});

// ==================== 规则输出整形 ====================

function fixtureGraph(): Graph {
    return {
        id: 'g1',
        cfg: { id: 'g1', enable: true, uiType: 'graph', userData: { name: '测试规则', lastUpdateTime: 0, transform: { x: 0, y: 0, scale: 1, rotate: 0 } } },
        nodes: [
            { id: 'a1', type: 'deviceInput', cfg: { urn: 'urn:x', pos: { x: 1, y: 2 } }, props: { did: 'dev1', siid: 2, piid: 1 }, inputs: {}, outputs: { output: ['b1.input'] } },
            { id: 'b1', type: 'delay', cfg: { unit: 's', value: 5 }, props: { timeout: 5000 }, inputs: { input: {} }, outputs: { output: [] } },
        ],
    };
}

test('shapeGraphOutput 默认返回摘要并包含 hash', () => {
    const graph = fixtureGraph();
    const output = shapeGraphOutput(graph);
    assert.equal(output.hash, graphHash(graph.nodes));
    assert.equal(output.nodeCount, 2);
    assert.equal(output.name, '测试规则');
    const text = formatJson(output);
    assert.doesNotMatch(text, /urn:x|"pos"/, '摘要不应包含 URN 和坐标');
});

test('shapeGraphOutput full 返回完整规则，node_ids 只返回指定节点', () => {
    const graph = fixtureGraph();
    const full = shapeGraphOutput(graph, { detail: 'full' });
    assert.equal(full.hash, graphHash(graph.nodes));
    assert.deepEqual(full.graph, graph);

    const picked = shapeGraphOutput(graph, { detail: 'full', nodeIds: ['b1', 'zz'] });
    assert.deepEqual(Object.keys(picked).sort(), ['enable', 'hash', 'id', 'missingIds', 'name', 'nodeCount', 'nodes']);
    assert.deepEqual(picked.nodes, [graph.nodes[1]]);
    assert.deepEqual(picked.missingIds, ['zz']);
    assert.equal(picked.nodeCount, 2);
});
