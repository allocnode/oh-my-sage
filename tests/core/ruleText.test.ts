import assert from 'node:assert/strict';
import test from 'node:test';
import type { GatewayClient } from '../../src/core/gateway/client';
import type { GraphNode } from '../../src/core/types/graph';
import { nodesToText, textToNodes, sameNode, type RuleTextContext } from '../../src/core/tools/ruleText';
import { applyNoteOperations, markdownToNoteContents, noteToMarkdown } from '../../src/core/tools/ruleNote';
import { focusIds, parseGatewayLog, patchGraphV2, putGraphText, queryRules } from '../../src/core/tools/graphText';
import { graphHash } from '../../src/core/tools/graphEdit';
import { clearMiotSpecCache } from '../../src/core/tools/device';

const LAMP_URN = 'urn:test:lamp';
const SPEAKER_URN = 'urn:test:speaker';

function context(): RuleTextContext {
    return {
        scope: 'R100',
        devices: new Map([
            ['lamp1', { name: '客厅灯', urn: LAMP_URN }],
            ['spk1', { name: '客厅音箱', urn: SPEAKER_URN }],
        ]),
        specs: new Map([
            [LAMP_URN, {
                properties: [
                    { siid: 2, piid: 1, desc: 'Light-Switch Status', dtype: 'bool', access: ['read', 'write', 'notify'] },
                    { siid: 2, piid: 2, desc: 'Light-Brightness', dtype: 'uint8', access: ['read', 'write', 'notify'], range: { min: 1, max: 100, step: 1 } },
                ],
                actions: [],
            }],
            [SPEAKER_URN, {
                properties: [{ siid: 2, piid: 1, desc: 'Speaker-Volume', dtype: 'uint8', access: ['read', 'write', 'notify'], range: { min: 5, max: 100, step: 1 } }],
                actions: [{ siid: 7, aiid: 3, desc: 'Intelligent Speaker-Play Text', type: 'action' }],
            }],
        ]),
    };
}

const n = (id: string, type: string, extra: Partial<GraphNode>): GraphNode => ({ id, type, cfg: { name: type, version: 1 }, props: {}, inputs: {}, outputs: { output: [] }, ...extra });

function sample(): GraphNode[] {
    return [
        n('note1', 'nop', { cfg: { name: 'nop', version: 0, background: '#80CAFF', pos: { x: 1, y: 2, width: 528, height: 200 }, contents: [{ attributes: { bold: true }, insert: '用途' }, { insert: '\n第一行' }, { attributes: { list: 'bullet' }, insert: '\n' }] } }),
        n('occ', 'varChange', { props: { scope: 'global', id: 'home', varType: 'number', operator: '=', v1: 1, preload: false }, outputs: { output: ['slp.input'] } }),
        n('slp', 'varGet', { props: { scope: 'global', id: 'sleepMode', varType: 'number', operator: '=', v1: 1 }, inputs: { input: null }, outputs: { output: ['on.trigger'], output2: ['cond.trigger'] } }),
        n('range', 'timeRange', { props: { start: { hour: 16, minute: 0, second: 0 }, end: { hour: 20, minute: 59, second: 59 }, filter: { day: [0, 1, 2, 3, 4, 5, 6] } }, outputs: { output: ['cond.condition'] } }),
        n('cond', 'condition', { inputs: { trigger: null, condition: null }, outputs: { met: ['bri.trigger'], unmet: [] } }),
        n('on', 'deviceOutput', { cfg: { name: 'deviceOutput', version: 1, urn: LAMP_URN, pos: { x: 9, y: 9 } }, props: { did: 'lamp1', siid: 2, piid: 1, value: true }, inputs: { trigger: null }, outputs: { output: ['wait.input'] } }),
        n('bri', 'deviceOutput', { cfg: { name: 'deviceOutput', version: 1, urn: LAMP_URN }, props: { did: 'lamp1', siid: 2, piid: 2, id: 'm2Bright', scope: 'global', dtype: 'number', min: 1, max: 100, step: 1 }, inputs: { trigger: null } }),
        n('wait', 'delay', { cfg: { name: 'delay', version: 1, unit: 's', value: 1.5 }, props: { timeout: 1500 }, inputs: { input: null }, outputs: { output: ['calc.input', 'or1.input1'] } }),
        n('calc', 'varSetNumber', { props: { scope: 'R100', id: 'ms', elements: [{ type: 'const', value: 'now()-' }, { type: 'var', id: 'at', scope: 'R100' }] }, inputs: { input: null } }),
        n('or1', 'signalOr', { inputs: { input0: null, input1: null } }),
        n('get', 'deviceGet', { cfg: { name: 'deviceGet', version: 1, urn: LAMP_URN }, props: { did: 'lamp1', siid: 2, piid: 1, operator: '=', v1: false, dtype: 'boolean' }, inputs: { input: null }, outputs: { output: [], output2: [] } }),
        n('odd', 'deviceOutput', { cfg: { name: 'deviceOutput', version: 0, urn: LAMP_URN, extra: 'x' }, props: { did: 'lamp1', siid: 2, piid: 1, value: false }, inputs: { trigger: null } }),
    ];
}

test('紧凑文本对真实节点结构无损往返', () => {
    const ctx = context();
    const nodes = sample();
    const text = nodesToText(nodes, ctx);
    assert.doesNotMatch(text, / raw \{/);
    const back = textToNodes(text, ctx).nodes;
    assert.equal(back.length, nodes.length);
    nodes.forEach((node, index) => assert.ok(sameNode(back[index], node), `${node.id}\n${JSON.stringify(back[index])}\n${JSON.stringify(node)}`));
});

test('紧凑文本省略默认端口并用变量简写', () => {
    const text = nodesToText(sample(), context());
    assert.match(text, /^slp vget \$sleepMode = 1 -> on \| cond$/m);
    assert.match(text, /^range range 16:00:00-20:59:59 -> cond\.condition$/m);
    assert.match(text, /^calc vset \$R\.ms = "now\(\)-\{\{\$R\.at\}\}"$/m);
    assert.match(text, /^bri set lamp1 2\/2 = \$m2Bright$/m);
    assert.match(text, /^wait delay 1\.5s -> calc, or1\.input1$/m);
    assert.match(text, /^odd set lamp1 2\/1 = false \+\{"cfg":\{"version":0,"extra":"x"\}\}$/m);
    assert.match(text, /^<<< note1\n\*\*用途\*\*\n- 第一行\n>>>$/m);
});

test('文本可写设备名称并自动补全 URN、dtype 与动态范围', () => {
    const ctx = context();
    const { nodes } = textToNodes('a in 客厅灯 2/1 = true -> b\nb set "客厅灯" 2/2 = $m1Bright', ctx);
    assert.equal(nodes[0].props.did, 'lamp1');
    assert.equal(nodes[0].props.dtype, 'boolean');
    assert.equal(nodes[0].cfg.urn, LAMP_URN);
    assert.deepEqual(nodes[0].outputs, { output: ['b.trigger'] });
    assert.deepEqual(nodes[1].props, { did: 'lamp1', siid: 2, piid: 2, id: 'm1Bright', scope: 'global', dtype: 'number', min: 1, max: 100, step: 1 });
});

test('文本解析报告行号与常见错误', () => {
    const ctx = context();
    assert.throws(() => textToNodes('a delay 5 -> b', ctx), /第 1 行：时长/);
    assert.throws(() => textToNodes('a delay 5s -> ghost', ctx), /连线目标 ghost 不存在/);
    assert.throws(() => textToNodes('a delay 5s\na delay 3s', ctx), /重复/);
    assert.throws(() => textToNodes('o signalOr\na delay 5s -> o', ctx), /需要写明端口/);
});

test('@tts 宏展开为读音量、设音量、播报和恢复，并声明变量', () => {
    const { nodes, variables } = textToNodes('next delay 1s\n@tts hi 客厅音箱 volume=50 text=$R.say -> next', context());
    assert.deepEqual(nodes.map((node) => node.id), ['next', 'hi', 'hiSet', 'hiWait', 'hiSay', 'hiRest', 'hiBack']);
    assert.equal(nodes.find((node) => node.id === 'hiSet')!.props.value, 50);
    assert.deepEqual(nodes.find((node) => node.id === 'hiSay')!.props.ins, [{ dtype: 'string', id: 'say', piid: 1, scope: 'R100' }]);
    assert.deepEqual(nodes.find((node) => node.id === 'hiSay')!.outputs, { output: ['next.input'] });
    assert.deepEqual(nodes.find((node) => node.id === 'hiWait')!.outputs, { output: ['hiSay.trigger', 'hiRest.input'] });
    assert.equal(nodes.find((node) => node.id === 'hiBack')!.props.id, 'hiVol');
    assert.deepEqual(variables, [{ id: 'hiVol', scope: 'R100', type: 'number', value: 0, name: 'hi 播报前音量' }]);
});

test('@pulse 宏先置 0 再置 1 并在保持后回 0', () => {
    const { nodes } = textToNodes('@pulse arr $homeArrival hold=3min', context());
    assert.deepEqual(nodes.map((node) => [node.id, node.type]), [['arr', 'varSetNumber'], ['arrOn', 'varSetNumber'], ['arrHold', 'delay'], ['arrOff', 'varSetNumber']]);
    assert.equal(nodes[2].props.timeout, 180000);
});

test('备注 Markdown 往返，并支持按段追加、替换和变更记录', () => {
    const contents = markdownToNoteContents('**用途**\n- 一\n\n**变更**\n- 2026-01-01 旧');
    assert.equal(noteToMarkdown(contents), '**用途**\n- 一\n\n**变更**\n- 2026-01-01 旧');
    const md = applyNoteOperations(noteToMarkdown(contents)!, [
        { section: '用途', append: '二' },
        { replace: '一', with: '壹' },
        { changelog: '2026-02-02 新' },
        { section: '陷阱', append: '新段' },
    ]);
    assert.equal(md, '**用途**\n- 壹\n- 二\n\n**变更**\n- 2026-02-02 新\n- 2026-01-01 旧\n\n**陷阱**\n- 新段');
    assert.throws(() => applyNoteOperations('甲甲', [{ replace: '甲', with: '乙' }]), /出现 2 次/);
});

test('不支持的备注格式返回 null，由调用方保留原始 JSON', () => {
    assert.equal(noteToMarkdown([{ insert: '红字', attributes: { color: 'red' } }, { insert: '\n' }]), null);
    const ctx = context();
    const nodes = [n('note1', 'nop', { cfg: { name: 'nop', version: 0, contents: [{ insert: 'a', attributes: { italic: true } }, { insert: '\n' }] } })];
    const text = nodesToText(nodes, ctx);
    assert.match(text, /^note1 nop \+\{/);
    assert.ok(sameNode(textToNodes(text, ctx).nodes[0], nodes[0]));
});

test('focusIds 返回上下游指定步数内的节点', () => {
    const ids = focusIds(sample(), ['wait'], 1);
    assert.deepEqual([...ids].sort(), ['calc', 'on', 'or1', 'wait']);
});

test('parseGatewayLog 按规则、节点和时间过滤并统计次数', () => {
    const now = Date.UTC(2026, 0, 1, 12, 0, 0);
    const raw = [
        `3|${now - 30 * 60000}|l|g1|a.output|b.input|null`,
        `3|${now - 30 * 60000}|i|g1|b|1`,
        `3|${now - 20 * 60000}|i|g1|c|[true]`,
        `3|${now - 20 * 60000}|i|g1|c|success`,
        `3|${now - 10 * 60000}|i|g2|b|0`,
        `3|${now - 90 * 60000}|i|g1|b|old`,
    ].join('\n');
    const { entries, counts } = parseGatewayLog(raw, { graph: 'g1', minutes: 60 }, now);
    assert.equal(entries.length, 4);
    assert.equal(entries[0].time, '2026-01-01 19:30:00.000');
    assert.deepEqual(counts, { 'g1/b': 1, 'g1/c': 1 });
    assert.equal(parseGatewayLog(raw, { graph: 'g1', nodes: ['c'], minutes: 60 }, now).entries.length, 2);
});

// ==================== 写入事务 ====================

function fakeGateway(initial: GraphNode[], vars: Record<string, Record<string, { type: string }>> = {}) {
    let nodes = structuredClone(initial);
    const calls: Array<{ method: string; params: any }> = [];
    const devList = { lamp1: { name: '客厅灯', model: 'm', modelName: 'M', online: true, roomName: 'R', urn: LAMP_URN } };
    const gateway = {
        async callApi(method: string, params: any): Promise<unknown> {
            calls.push({ method, params });
            if (method === 'getGraph') return { id: '100', nodes: structuredClone(nodes), cfg: { id: '100', enable: true, uiType: 'graph', userData: { name: 'R', lastUpdateTime: 0, transform: { x: 0, y: 0, scale: 1, rotate: 0 } } } };
            if (method === 'getGraphList') return [{ id: '100', enable: true, userData: { name: 'R' } }];
            if (method === 'getDevList') return { devList };
            if (method === 'getVarList') return vars[params.scope] || {};
            if (method === 'createVar') {
                vars[params.scope] = vars[params.scope] || {};
                vars[params.scope][params.id] = { type: params.type };
                return undefined;
            }
            if (method === 'deleteVar') return undefined;
            if (method === 'setGraph') {
                nodes = structuredClone(params.nodes);
                return undefined;
            }
            throw new Error(`意外的方法 ${method}`);
        },
    } as unknown as GatewayClient;
    return { gateway, calls, current: () => nodes };
}

const specOk = { services: [{ iid: 2, description: 'Light', properties: [{ iid: 1, description: 'Switch Status', format: 'bool', access: ['read', 'write', 'notify'] }, { iid: 2, description: 'Brightness', format: 'uint8', access: ['read', 'write', 'notify'], 'value-range': [1, 100, 1] }] }] };

async function withSpec<T>(fn: () => Promise<T>): Promise<T> {
    clearMiotSpecCache();
    const original = globalThis.fetch;
    globalThis.fetch = (async () => new Response(JSON.stringify(specOk), { status: 200 })) as typeof fetch;
    try {
        return await fn();
    } finally {
        globalThis.fetch = original;
        clearMiotSpecCache();
    }
}

const base = (): GraphNode[] => [
    n('note1', 'nop', { cfg: { name: 'nop', version: 0, background: '#80CAFF', pos: { x: 100, y: -500, width: 528, height: 200 }, contents: markdownToNoteContents('**用途**\n- 开灯\n\n**变更**\n- 2026-01-01 新建') } }),
    n('start', 'onLoad', { cfg: { name: 'onLoad', version: 1, pos: { x: 1, y: 2 } }, outputs: { output: ['on.trigger'] } }),
    n('on', 'deviceOutput', { cfg: { name: 'deviceOutput', version: 1, urn: LAMP_URN, pos: { x: 3, y: 4 } }, props: { did: 'lamp1', siid: 2, piid: 1, value: true }, inputs: { trigger: null } }),
];

test('patchGraphV2 一次完成新增、改连线、备注、建变量并回读', async () => {
    await withSpec(async () => {
        const { gateway, calls, current } = fakeGateway(base());
        const result = await patchGraphV2(gateway, '100', {
            baseHash: graphHash(base()),
            add: 'var $R.at number 0 "时间"\nwait delay 2s -> dim\ndim set 客厅灯 2/2 = 1',
            merge: [{ id: 'on', outputs: { output: ['wait.input'] } }],
            note: [{ section: '用途', append: '两秒后调暗' }, { changelog: '2026-02-01 增加调暗' }],
        });
        assert.equal(result.success, true, JSON.stringify(result));
        const data = result.success ? result.data! : undefined;
        assert.deepEqual(data!.added, ['wait', 'dim']);
        assert.deepEqual(data!.changed.sort(), ['note1', 'on']);
        assert.equal(data!.noteChanged, true);
        assert.deepEqual(data!.createdVariables, ['R100/at']);
        assert.match(data!.diff, /^wait delay 2s -> dim$/m);
        assert.match(data!.diff, /<<< note1 改动\n\+ - 两秒后调暗\n\+ - 2026-02-01 增加调暗\n>>>/);
        assert.doesNotMatch(data!.diff, /开灯/);
        assert.equal(calls.filter((call) => call.method === 'setGraph').length, 1);
        const saved = current();
        assert.deepEqual(saved.find((node) => node.id === 'on')!.cfg.pos, { x: 3, y: 4 });
        assert.equal(noteToMarkdown(saved.find((node) => node.id === 'note1')!.cfg.contents), '**用途**\n- 开灯\n- 两秒后调暗\n\n**变更**\n- 2026-02-01 增加调暗\n- 2026-01-01 新建');
        assert.equal((saved.find((node) => node.id === 'note1')!.cfg.pos as any).x, 100);
        assert.equal(data!.hash, graphHash(saved));
    });
});

test('patchGraphV2 add 遇到已有 ID 拒绝，replace 遇到不存在 ID 拒绝，均不写入', async () => {
    await withSpec(async () => {
        const { gateway, calls } = fakeGateway(base());
        const added = await patchGraphV2(gateway, '100', { add: 'on set 客厅灯 2/1 = false' });
        assert.equal(added.success, false);
        assert.match('error' in added ? added.error : '', /已存在/);
        const replaced = await patchGraphV2(gateway, '100', { replace: 'ghost delay 1s' });
        assert.equal(replaced.success, false);
        assert.match('error' in replaced ? replaced.error : '', /不存在/);
        assert.equal(calls.some((call) => call.method === 'setGraph' || call.method === 'createVar'), false);
    });
});

test('patchGraphV2 校验失败时回滚本次新建的变量', async () => {
    await withSpec(async () => {
        const { gateway, calls } = fakeGateway(base());
        const result = await patchGraphV2(gateway, '100', { add: 'var $R.x number 0\nbad set 客厅灯 2/2 = 500' });
        assert.equal(result.success, false);
        assert.ok(calls.some((call) => call.method === 'createVar'));
        assert.ok(calls.some((call) => call.method === 'deleteVar' && call.params.id === 'x'));
        assert.equal(calls.some((call) => call.method === 'setGraph'), false);
    });
});

test('patchGraphV2 dryRun 只返回改动不写入', async () => {
    await withSpec(async () => {
        const { gateway, calls } = fakeGateway(base());
        const result = await patchGraphV2(gateway, '100', { replace: 'on set 客厅灯 2/1 = false', dryRun: true });
        assert.equal(result.success, true);
        assert.deepEqual(result.success && result.data!.changed, ['on']);
        assert.equal(calls.some((call) => call.method === 'setGraph'), false);
    });
});

test('putGraphText 按文本差异写入，拒绝过期 hash', async () => {
    await withSpec(async () => {
        const { gateway } = fakeGateway(base());
        const stale = await putGraphText(gateway, '100', { text: 'x onLoad', baseHash: '0000000000000000' });
        assert.equal(stale.success, false);
        const first = await patchGraphV2(gateway, '100', { dryRun: true, replace: 'on set 客厅灯 2/1 = true' });
        assert.equal(first.success && first.data!.message, '无变化');
    });
    await withSpec(async () => {
        const { gateway, current } = fakeGateway(base());
        const ctx = { scope: 'R100', devices: new Map([['lamp1', { name: '客厅灯', urn: LAMP_URN }]]), specs: new Map() } as RuleTextContext;
        const text = nodesToText(base(), ctx).replace('on set lamp1 2/1 = true', 'on set lamp1 2/1 = false');
        const result = await putGraphText(gateway, '100', { text, baseHash: graphHash(base()) });
        assert.equal(result.success, true, JSON.stringify(result));
        assert.deepEqual(result.success && result.data!.changed, ['on']);
        assert.equal(current().find((node) => node.id === 'on')!.props.value, false);
        assert.ok(result.success && result.data!.text?.includes('on set lamp1 2/1 = false'));
    });
});

test('queryRules 按变量与设备在服务端筛选节点', async () => {
    const nodes = sample();
    const gateway = {
        async callApi(method: string, params: any): Promise<unknown> {
            if (method === 'getGraphList') return [{ id: '100', enable: true, userData: { name: '客厅' } }];
            if (method === 'getDevList') return { devList: { lamp1: { name: '客厅灯', urn: LAMP_URN } } };
            if (method === 'getGraph') return { id: params.id, nodes };
            throw new Error(method);
        },
    } as unknown as GatewayClient;
    const byVar = await queryRules(gateway, { variable: '$sleepMode' });
    assert.equal(byVar.success, true);
    assert.equal(byVar.success && byVar.data!.hits[0].lines, 'slp vget $sleepMode = 1 -> on | cond');
    const byDevice = await queryRules(gateway, { device: '客厅灯', property: '2/2' });
    assert.equal(byDevice.success && byDevice.data!.hits[0].lines.split('\n').length, 1);
});
