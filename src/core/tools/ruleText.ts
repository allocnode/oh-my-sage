/**
 * Core - 规则紧凑文本格式
 *
 * 一行一个节点，服务端负责补全 cfg.name/version/urn、inputs 端口、outputs 端口声明、dtype 等固定内容。
 * 目标：Agent 读写规则时只处理有意义的部分，体积约为 JSON 的几分之一。
 *
 * 无损保证：编码时先用「行头」解码出基线节点，再把基线与真实节点的差异写成 +{...}，
 * 并逐个节点校验「解码(编码(节点)) == 节点」，不一致时退回完整 JSON 写法。
 * 卡片坐标 cfg.pos 不进入文本，写回时按节点 ID 保留原坐标。
 *
 * 语法摘要（完整说明见 docs/rule-text-format.md）：
 *   id in   <did> 2/1 = true [preload]         deviceInput 属性
 *   id in   <did> 3.e1012 [args=[...]]         deviceInput 事件
 *   id get  <did> 2/1 = false                  deviceGet
 *   id set  <did> 2/2 = 30 | = $m2Bright       deviceOutput 属性（常量或变量）
 *   id do   <did> 7.a3 [{"piid":1,"value":"你好"}]   deviceOutput 动作
 *   id getvar <did> 2/1 $R.savedVol            deviceGetSetVar
 *   id vget $sleepMode = 1                     varGet（$名=全局，$R.名=本规则，$作用域.名=其他）
 *   id vchange $homeArrival = 1 [preload]      varChange
 *   id vset $R.x = "now()-{{$R.y}}"            varSetNumber；sset 为 varSetString
 *   id delay 1.5s | last 5s | loop 2min        delay / statusLast / loop
 *   id ntimes 1 | counter 3                    onlyNTimes / counter
 *   id range 16:00:00-20:59:59 [days=1,2]      timeRange
 *   id at 21:00:00 | sunset -30 @31.2,121.4    alarmClock
 *   id condition | signalOr | logicAnd ...     无参数节点直接写类型名
 *   ... -> a, b.input | c                      连线：| 分隔第一、第二输出端口；端口与目标默认端口相同时可省略
 *   <<< note1 ... >>>                          备注节点，正文为 Markdown（粗体标题、- 列表）
 *   var $R.x number 0 "显示名"                 声明变量（不存在时创建）
 *   @tts / @pulse                              宏，写入时展开为普通节点
 */

import type { GraphNode } from '../types/graph';
import type { MiotPropertyCapability } from '../types/device';
import { markdownToNoteContents, noteToMarkdown } from './ruleNote';

// ==================== 上下文 ====================

export interface RuleTextSpec {
    properties: MiotPropertyCapability[];
    actions: Array<{ siid: number; aiid?: number; desc: string; type: string }>;
}

export interface RuleTextContext {
    /** 本规则变量作用域，即 "R" + 规则 ID */
    scope: string;
    /** did -> 设备名称与 URN */
    devices: Map<string, { name: string; urn: string }>;
    /** URN -> MIOT 能力（可缺省，缺省时按取值推断 dtype） */
    specs: Map<string, RuleTextSpec>;
}

export interface RuleTextVariable {
    id: string;
    scope: string;
    type: 'number' | 'string';
    value: number | string;
    name?: string;
}

export interface ParsedRuleText {
    nodes: GraphNode[];
    variables: RuleTextVariable[];
}

// ==================== 类型表 ====================

const NO_INPUT_TYPES = new Set(['deviceInput', 'alarmClock', 'timeRange', 'onLoad', 'varChange', 'deviceInputSetVar', 'nop']);

const DEFAULT_INPUTS: Record<string, string[]> = {
    deviceOutput: ['trigger'],
    condition: ['trigger', 'condition'],
    deviceGet: ['input'],
    varGet: ['input'],
    varSetNumber: ['input'],
    varSetString: ['input'],
    delay: ['input'],
    statusLast: ['input'],
    deviceGetSetVar: ['input'],
    logicNot: ['input'],
    modeSwitch: ['input'],
    loop: ['start', 'stop'],
    onlyNTimes: ['input', 'zero'],
    counter: ['input', 'zero'],
    register: ['setTrue', 'setFalse'],
    eventSequence: ['input1', 'input2'],
};

const MULTI_INPUT_TYPES = new Set(['logicOr', 'logicAnd', 'signalOr']);

const DEFAULT_OUTPUTS: Record<string, string[]> = {
    deviceGet: ['output', 'output2'],
    varGet: ['output', 'output2'],
    condition: ['met', 'unmet'],
};

const TIMER_UNITS: Record<string, number> = { ms: 1, s: 1000, min: 60000, h: 3600000 };
const TIMER_TYPES: Record<string, { alias: string; key: string }> = {
    delay: { alias: 'delay', key: 'timeout' },
    statusLast: { alias: 'last', key: 'timeout' },
    loop: { alias: 'loop', key: 'interval' },
};

const ALL_DAYS = [0, 1, 2, 3, 4, 5, 6];
const DEFAULT_NOTE_BACKGROUND = '#80CAFF';

/** 与类型同名的关键字，不能当作通用类型解析 */
const ALIASES = new Set(['in', 'get', 'set', 'do', 'getvar', 'vget', 'vchange', 'vset', 'sset', 'delay', 'last', 'loop', 'ntimes', 'counter', 'range', 'at', 'sunset', 'sunrise']);

function defaultInputPorts(type: string): string[] {
    if (NO_INPUT_TYPES.has(type)) return [];
    return DEFAULT_INPUTS[type] || [];
}

function defaultOutputPorts(type: string): string[] {
    return DEFAULT_OUTPUTS[type] || ['output'];
}

function primaryInput(type: string): string | undefined {
    if (MULTI_INPUT_TYPES.has(type)) return undefined;
    return defaultInputPorts(type)[0];
}

// ==================== 通用工具 ====================

function canonicalize(value: unknown): unknown {
    if (Array.isArray(value)) return value.map(canonicalize);
    if (!value || typeof value !== 'object') return value;
    const record = value as Record<string, unknown>;
    return Object.fromEntries(Object.keys(record).sort().map((key) => [key, canonicalize(record[key])]));
}

function same(a: unknown, b: unknown): boolean {
    return JSON.stringify(canonicalize(a)) === JSON.stringify(canonicalize(b));
}

function withoutPos(node: GraphNode): GraphNode {
    const { pos: _pos, ...cfg } = (node.cfg || {}) as Record<string, unknown>;
    return { ...node, cfg };
}

/** 规则节点语义比较（忽略坐标与键顺序） */
export function sameNode(a: GraphNode, b: GraphNode): boolean {
    return same(withoutPos(a), withoutPos(b));
}

function fail(line: number, message: string): never {
    throw new Error(`第 ${line} 行：${message}`);
}

// ==================== 词法 ====================

interface Token {
    text: string;
    start: number;
    end: number;
}

/** 按空白切分，双引号字符串与 [] {} 内部整体保留 */
function tokenize(line: string): Token[] {
    const tokens: Token[] = [];
    let i = 0;
    while (i < line.length) {
        while (i < line.length && /\s/.test(line[i])) i++;
        if (i >= line.length) break;
        const start = i;
        let depth = 0;
        let inString = false;
        while (i < line.length) {
            const ch = line[i];
            if (inString) {
                if (ch === '\\') i++;
                else if (ch === '"') inString = false;
            } else if (ch === '"') inString = true;
            else if (ch === '[' || ch === '{') depth++;
            else if (ch === ']' || ch === '}') depth--;
            else if (/\s/.test(ch) && depth <= 0) break;
            i++;
        }
        tokens.push({ text: line.slice(start, i), start, end: i });
    }
    return tokens;
}

function parseLiteral(text: string, line: number): unknown {
    try {
        return JSON.parse(text);
    } catch {
        return fail(line, `无法解析取值 ${text}（字符串请加双引号）`);
    }
}

function literal(value: unknown): string {
    return JSON.stringify(value);
}

// ==================== 变量引用 ====================

function formatVar(scope: unknown, id: unknown, ctx: RuleTextContext): string {
    if (scope === 'global') return `$${id}`;
    if (scope === ctx.scope) return `$R.${id}`;
    return `$${scope}.${id}`;
}

function parseVar(text: string, ctx: RuleTextContext, line: number): { scope: string; id: string } {
    const match = /^\$(?:([A-Za-z0-9_]+)\.)?([A-Za-z0-9]+)$/.exec(text);
    if (!match) return fail(line, `变量引用格式应为 $名、$R.名 或 $作用域.名，当前 ${text}`);
    const scope = match[1] === undefined ? 'global' : match[1] === 'R' ? ctx.scope : match[1];
    return { scope, id: match[2] };
}

const ELEMENT_VAR = /\{\{(\$[A-Za-z0-9_.]+)\}\}/g;

function formatElements(elements: unknown, ctx: RuleTextContext): string | null {
    if (!Array.isArray(elements) || elements.length === 0) return null;
    if (elements.length === 1 && same(elements[0], { type: 'const', value: '' })) return '""';
    let text = '';
    let previousConst = false;
    for (const element of elements) {
        if (!element || typeof element !== 'object') return null;
        const entry = element as Record<string, unknown>;
        if (entry.type === 'const' && typeof entry.value === 'string' && Object.keys(entry).length === 2) {
            if (previousConst || entry.value === '' || entry.value.includes('{{') || entry.value.includes('}}')) return null;
            text += entry.value;
            previousConst = true;
        } else if (entry.type === 'var' && typeof entry.id === 'string' && typeof entry.scope === 'string' && Object.keys(entry).length === 3) {
            text += `{{${formatVar(entry.scope, entry.id, ctx)}}}`;
            previousConst = false;
        } else {
            return null;
        }
    }
    return literal(text);
}

function parseElements(text: string, ctx: RuleTextContext, line: number): Array<Record<string, unknown>> {
    const value = parseLiteral(text, line);
    if (typeof value !== 'string') return fail(line, '表达式必须是双引号字符串');
    if (value === '') return [{ type: 'const', value: '' }];
    const elements: Array<Record<string, unknown>> = [];
    let last = 0;
    for (const match of value.matchAll(ELEMENT_VAR)) {
        if (match.index! > last) elements.push({ type: 'const', value: value.slice(last, match.index) });
        const ref = parseVar(match[1], ctx, line);
        elements.push({ type: 'var', id: ref.id, scope: ref.scope });
        last = match.index! + match[0].length;
    }
    if (last < value.length) elements.push({ type: 'const', value: value.slice(last) });
    return elements;
}

// ==================== 设备能力 ====================

function deviceProperty(ctx: RuleTextContext, did: unknown, siid: unknown, piid: unknown): MiotPropertyCapability | undefined {
    const urn = typeof did === 'string' ? ctx.devices.get(did)?.urn : undefined;
    const spec = urn ? ctx.specs.get(urn) : undefined;
    return spec?.properties.find((item) => item.siid === siid && item.piid === piid);
}

function compareDtype(format: string | undefined, value: unknown): string {
    if (format) {
        if (format === 'bool') return 'boolean';
        if (/^u?int\d*$/.test(format)) return 'int';
        return format;
    }
    if (typeof value === 'boolean') return 'boolean';
    if (typeof value === 'string') return 'string';
    if (typeof value === 'number' && !Number.isInteger(value)) return 'float';
    return 'int';
}

function resolveDevice(token: string, ctx: RuleTextContext, line: number): string {
    const raw = token.startsWith('"') ? parseLiteral(token, line) : token;
    if (typeof raw !== 'string') return fail(line, `设备应为 did 或名称，当前 ${token}`);
    if (ctx.devices.has(raw)) return raw;
    const byName = [...ctx.devices.entries()].filter(([, device]) => device.name.trim() === raw.trim());
    if (byName.length === 1) return byName[0][0];
    if (byName.length > 1) return fail(line, `设备名称「${raw}」不唯一：${byName.map(([did]) => did).join(', ')}`);
    // 设备表中不存在：保留原值，由能力校验报错（已删除设备的旧规则仍需能读写）
    return raw;
}

function parseSiidPiid(text: string, line: number): { siid: number; piid: number } {
    const match = /^(\d+)\/(\d+)$/.exec(text);
    if (!match) return fail(line, `属性应写成 siid/piid，当前 ${text}`);
    return { siid: Number(match[1]), piid: Number(match[2]) };
}

// ==================== 时间 ====================

function formatDuration(value: unknown, unit: unknown, ms: unknown): string {
    if (typeof unit === 'string' && TIMER_UNITS[unit] && typeof value === 'number' && value * TIMER_UNITS[unit] === ms) return `${value}${unit}`;
    return `${ms}ms`;
}

function parseDuration(text: string, line: number): { ms: number; value?: number; unit?: string } {
    const match = /^(\d+(?:\.\d+)?)(ms|s|min|h)$/.exec(text);
    if (!match) return fail(line, `时长应写成 5s、2min、1h 或 500ms，当前 ${text}`);
    const value = Number(match[1]);
    const ms = Math.round(value * TIMER_UNITS[match[2]]);
    return match[2] === 'ms' ? { ms } : { ms, value, unit: match[2] };
}

function formatClock(time: unknown): string | null {
    if (!time || typeof time !== 'object') return null;
    const { hour, minute, second } = time as Record<string, unknown>;
    if (![hour, minute, second].every((item) => typeof item === 'number')) return null;
    if (Object.keys(time).length !== 3) return null;
    return [hour, minute, second].map((item) => String(item).padStart(2, '0')).join(':');
}

function parseClock(text: string, line: number): { hour: number; minute: number; second: number } {
    const match = /^(\d{1,2}):(\d{2}):(\d{2})$/.exec(text);
    if (!match) return fail(line, `时间应写成 HH:MM:SS，当前 ${text}`);
    return { hour: Number(match[1]), minute: Number(match[2]), second: Number(match[3]) };
}

function formatDays(filter: unknown): string | null {
    if (!filter || typeof filter !== 'object' || Object.keys(filter).length !== 1) return null;
    const days = (filter as Record<string, unknown>).day;
    if (!Array.isArray(days)) return null;
    return same(days, ALL_DAYS) ? '' : `days=${days.join(',')}`;
}

function takeDays(rest: string[], line: number): { filter: { day: number[] }; rest: string[] } {
    const index = rest.findIndex((token) => token.startsWith('days='));
    if (index === -1) return { filter: { day: [...ALL_DAYS] }, rest };
    const day = rest[index].slice(5).split(',').filter(Boolean).map((item) => {
        const value = Number(item);
        if (!Number.isInteger(value)) fail(line, `days 只能是 0-6 的数字，当前 ${rest[index]}`);
        return value;
    });
    return { filter: { day }, rest: rest.filter((_, i) => i !== index) };
}

// ==================== 行头编码 ====================

function opValue(props: Record<string, unknown>): string | null {
    if (typeof props.operator !== 'string' || props.v1 === undefined) return null;
    return `${props.operator} ${literal(props.v1)}${props.v2 !== undefined ? ` ${literal(props.v2)}` : ''}`;
}

/** 生成行头（不含差异与连线）；无法用简写表达时返回类型名 */
function encodeHead(node: GraphNode, ctx: RuleTextContext): string {
    const p = node.props || {};
    const c = (node.cfg || {}) as Record<string, unknown>;
    const id = node.id;
    switch (node.type) {
        case 'deviceInput':
            if (typeof p.eiid === 'number') {
                const args = Array.isArray(p.arguments) && p.arguments.length > 0 ? ` args=${literal(p.arguments)}` : '';
                return `${id} in ${p.did} ${p.siid}.e${p.eiid}${args}${p.preload === true ? ' preload' : ''}`;
            }
            if (typeof p.piid === 'number' && opValue(p)) return `${id} in ${p.did} ${p.siid}/${p.piid} ${opValue(p)}${p.preload === true ? ' preload' : ''}`;
            break;
        case 'deviceGet':
            if (typeof p.piid === 'number' && opValue(p)) return `${id} get ${p.did} ${p.siid}/${p.piid} ${opValue(p)}`;
            break;
        case 'deviceOutput':
            if (typeof p.aiid === 'number') return `${id} do ${p.did} ${p.siid}.a${p.aiid} ${literal(p.ins ?? [])}`;
            if (typeof p.piid === 'number') {
                if (typeof p.id === 'string' && typeof p.scope === 'string') return `${id} set ${p.did} ${p.siid}/${p.piid} = ${formatVar(p.scope, p.id, ctx)}`;
                if (p.value !== undefined) return `${id} set ${p.did} ${p.siid}/${p.piid} = ${literal(p.value)}`;
            }
            break;
        case 'deviceGetSetVar':
            if (typeof p.piid === 'number' && typeof p.id === 'string') return `${id} getvar ${p.did} ${p.siid}/${p.piid} ${formatVar(p.scope, p.id, ctx)}`;
            break;
        case 'varGet':
        case 'varChange':
            if (typeof p.id === 'string' && opValue(p)) {
                const alias = node.type === 'varGet' ? 'vget' : 'vchange';
                return `${id} ${alias} ${formatVar(p.scope, p.id, ctx)} ${opValue(p)}${node.type === 'varChange' && p.preload === true ? ' preload' : ''}`;
            }
            break;
        case 'varSetNumber':
        case 'varSetString': {
            const expression = formatElements(p.elements, ctx);
            if (typeof p.id === 'string' && expression !== null) return `${id} ${node.type === 'varSetNumber' ? 'vset' : 'sset'} ${formatVar(p.scope, p.id, ctx)} = ${expression}`;
            break;
        }
        case 'delay':
        case 'statusLast':
        case 'loop': {
            const timer = TIMER_TYPES[node.type];
            if (typeof p[timer.key] === 'number') return `${id} ${timer.alias} ${formatDuration(c.value, c.unit, p[timer.key])}`;
            break;
        }
        case 'onlyNTimes':
        case 'counter':
            if (typeof p.n === 'number') return `${id} ${node.type === 'onlyNTimes' ? 'ntimes' : 'counter'} ${p.n}`;
            break;
        case 'timeRange': {
            const start = formatClock(p.start);
            const end = formatClock(p.end);
            const days = formatDays(p.filter);
            if (start && end && days !== null) return `${id} range ${start}-${end}${days ? ` ${days}` : ''}`;
            break;
        }
        case 'alarmClock': {
            const days = formatDays(p.filter);
            if (days === null) break;
            const suffix = days ? ` ${days}` : '';
            if (p.type === 'periodicAlarm') {
                const time = formatClock({ hour: p.hour, minute: p.minute, second: p.second });
                if (time) return `${id} at ${time}${suffix}`;
            }
            if (p.type === 'sunset' && typeof p.offset === 'number' && typeof p.latitude === 'number' && typeof p.longitude === 'number') {
                const offset = p.offset >= 0 ? `+${p.offset}` : String(p.offset);
                return `${id} ${p.isSunset === false ? 'sunrise' : 'sunset'} ${offset} @${p.latitude},${p.longitude}${suffix}`;
            }
            break;
        }
        default:
            break;
    }
    return `${id} ${node.type}`;
}

// ==================== 行头解码 ====================

function deviceUrn(ctx: RuleTextContext, did: string): Record<string, unknown> {
    const urn = ctx.devices.get(did)?.urn;
    return urn ? { urn } : {};
}

function parseOperator(rest: string[], line: number): { operator: string; v1: unknown; v2?: unknown; rest: string[] } {
    const [operator, v1, ...others] = rest;
    if (!operator || v1 === undefined) fail(line, '缺少比较运算符或比较值');
    const result: { operator: string; v1: unknown; v2?: unknown; rest: string[] } = { operator, v1: parseLiteral(v1, line), rest: others };
    if (others[0] !== undefined && others[0] !== 'preload' && !others[0].startsWith('days=')) {
        result.v2 = parseLiteral(others[0], line);
        result.rest = others.slice(1);
    }
    return result;
}

function takeFlag(rest: string[], flag: string): { on: boolean; rest: string[] } {
    const index = rest.indexOf(flag);
    return index === -1 ? { on: false, rest } : { on: true, rest: rest.filter((_, i) => i !== index) };
}

function expectEnd(rest: string[], line: number): void {
    if (rest.length > 0) fail(line, `多余的内容：${rest.join(' ')}`);
}

/** 由行头解码出基线节点（outputs 只声明端口，连线另行填充） */
function decodeHead(id: string, alias: string, args: string[], ctx: RuleTextContext, line: number): GraphNode {
    const node = (type: string, props: Record<string, unknown>, cfg: Record<string, unknown> = {}): GraphNode => ({
        id,
        type,
        cfg: { name: type, version: 1, ...cfg },
        props,
        inputs: Object.fromEntries(defaultInputPorts(type).map((port) => [port, null])),
        outputs: Object.fromEntries(defaultOutputPorts(type).map((port) => [port, []])),
    });

    switch (alias) {
        case 'in': {
            const did = resolveDevice(args[0] ?? fail(line, '缺少设备'), ctx, line);
            const target = args[1] ?? fail(line, '缺少 siid/piid 或 siid.e事件号');
            const event = /^(\d+)\.e(\d+)$/.exec(target);
            if (event) {
                let rest = args.slice(2);
                let argumentsValue: unknown = [];
                const argIndex = rest.findIndex((token) => token.startsWith('args='));
                if (argIndex !== -1) {
                    argumentsValue = parseLiteral(rest[argIndex].slice(5), line);
                    rest = rest.filter((_, i) => i !== argIndex);
                }
                const preload = takeFlag(rest, 'preload');
                expectEnd(preload.rest, line);
                return node('deviceInput', { did, siid: Number(event[1]), eiid: Number(event[2]), preload: preload.on, arguments: argumentsValue }, deviceUrn(ctx, did));
            }
            const { siid, piid } = parseSiidPiid(target, line);
            const parsed = parseOperator(args.slice(2), line);
            const preload = takeFlag(parsed.rest, 'preload');
            expectEnd(preload.rest, line);
            const dtype = compareDtype(deviceProperty(ctx, did, siid, piid)?.dtype, parsed.v1);
            return node('deviceInput', { did, siid, piid, operator: parsed.operator, v1: parsed.v1, ...(parsed.v2 !== undefined ? { v2: parsed.v2 } : {}), preload: preload.on, dtype }, deviceUrn(ctx, did));
        }
        case 'get': {
            const did = resolveDevice(args[0] ?? fail(line, '缺少设备'), ctx, line);
            const { siid, piid } = parseSiidPiid(args[1] ?? '', line);
            const parsed = parseOperator(args.slice(2), line);
            expectEnd(parsed.rest, line);
            const dtype = compareDtype(deviceProperty(ctx, did, siid, piid)?.dtype, parsed.v1);
            return node('deviceGet', { did, siid, piid, operator: parsed.operator, v1: parsed.v1, ...(parsed.v2 !== undefined ? { v2: parsed.v2 } : {}), dtype }, deviceUrn(ctx, did));
        }
        case 'set': {
            const did = resolveDevice(args[0] ?? fail(line, '缺少设备'), ctx, line);
            const { siid, piid } = parseSiidPiid(args[1] ?? '', line);
            if (args[2] !== '=' || args[3] === undefined) fail(line, 'set 写法为 set <设备> siid/piid = 值');
            expectEnd(args.slice(4), line);
            if (args[3].startsWith('$')) {
                const ref = parseVar(args[3], ctx, line);
                const property = deviceProperty(ctx, did, siid, piid);
                const range = property?.range ? { min: property.range.min, max: property.range.max, step: property.range.step } : {};
                return node('deviceOutput', { did, siid, piid, id: ref.id, scope: ref.scope, dtype: property?.dtype === 'string' ? 'string' : 'number', ...range }, deviceUrn(ctx, did));
            }
            return node('deviceOutput', { did, siid, piid, value: parseLiteral(args[3], line) }, deviceUrn(ctx, did));
        }
        case 'do': {
            const did = resolveDevice(args[0] ?? fail(line, '缺少设备'), ctx, line);
            const match = /^(\d+)\.a(\d+)$/.exec(args[1] ?? '');
            if (!match) fail(line, 'do 写法为 do <设备> siid.a动作号 [参数]');
            const ins = args[2] !== undefined ? parseLiteral(args[2], line) : [];
            expectEnd(args.slice(3), line);
            return node('deviceOutput', { did, siid: Number(match![1]), aiid: Number(match![2]), ins }, deviceUrn(ctx, did));
        }
        case 'getvar': {
            const did = resolveDevice(args[0] ?? fail(line, '缺少设备'), ctx, line);
            const { siid, piid } = parseSiidPiid(args[1] ?? '', line);
            const ref = parseVar(args[2] ?? fail(line, '缺少目标变量'), ctx, line);
            expectEnd(args.slice(3), line);
            const dtype = deviceProperty(ctx, did, siid, piid)?.dtype === 'string' ? 'string' : 'number';
            return node('deviceGetSetVar', { did, siid, piid, id: ref.id, scope: ref.scope, dtype }, deviceUrn(ctx, did));
        }
        case 'vget':
        case 'vchange': {
            const ref = parseVar(args[0] ?? fail(line, '缺少变量'), ctx, line);
            const parsed = parseOperator(args.slice(1), line);
            const preload = takeFlag(parsed.rest, 'preload');
            if (alias === 'vget' && preload.on) fail(line, 'vget 没有 preload');
            expectEnd(preload.rest, line);
            const props: Record<string, unknown> = { id: ref.id, scope: ref.scope, operator: parsed.operator, v1: parsed.v1, varType: typeof parsed.v1 === 'string' ? 'string' : 'number' };
            if (parsed.v2 !== undefined) props.v2 = parsed.v2;
            if (alias === 'vchange') props.preload = preload.on;
            return node(alias === 'vget' ? 'varGet' : 'varChange', props);
        }
        case 'vset':
        case 'sset': {
            const ref = parseVar(args[0] ?? fail(line, '缺少变量'), ctx, line);
            if (args[1] !== '=' || args[2] === undefined) fail(line, `${alias} 写法为 ${alias} $变量 = "表达式"`);
            expectEnd(args.slice(3), line);
            return node(alias === 'vset' ? 'varSetNumber' : 'varSetString', { id: ref.id, scope: ref.scope, elements: parseElements(args[2], ctx, line) });
        }
        case 'delay':
        case 'last':
        case 'loop': {
            const type = alias === 'delay' ? 'delay' : alias === 'last' ? 'statusLast' : 'loop';
            const duration = parseDuration(args[0] ?? fail(line, '缺少时长'), line);
            expectEnd(args.slice(1), line);
            return node(type, { [TIMER_TYPES[type].key]: duration.ms }, duration.unit ? { unit: duration.unit, value: duration.value } : {});
        }
        case 'ntimes':
        case 'counter': {
            const n = Number(args[0]);
            if (!Number.isInteger(n) || n < 1) fail(line, '次数必须是正整数');
            expectEnd(args.slice(1), line);
            return node(alias === 'ntimes' ? 'onlyNTimes' : 'counter', { n });
        }
        case 'range': {
            const match = /^([\d:]+)-([\d:]+)$/.exec(args[0] ?? '');
            if (!match) fail(line, 'range 写法为 range HH:MM:SS-HH:MM:SS');
            const days = takeDays(args.slice(1), line);
            expectEnd(days.rest, line);
            return node('timeRange', { start: parseClock(match![1], line), end: parseClock(match![2], line), filter: days.filter });
        }
        case 'at': {
            const time = parseClock(args[0] ?? '', line);
            const days = takeDays(args.slice(1), line);
            expectEnd(days.rest, line);
            return node('alarmClock', { type: 'periodicAlarm', ...time, filter: days.filter }, { happenType: 'now', tempOffset: 0 });
        }
        case 'sunset':
        case 'sunrise': {
            const offset = Number(args[0]);
            if (!Number.isFinite(offset)) fail(line, `${alias} 写法为 ${alias} ±分钟 @纬度,经度`);
            const location = /^@(-?[\d.]+),(-?[\d.]+)$/.exec(args[1] ?? '');
            if (!location) fail(line, '缺少位置 @纬度,经度');
            const days = takeDays(args.slice(2), line);
            expectEnd(days.rest, line);
            return node('alarmClock', {
                type: 'sunset',
                isSunset: alias === 'sunset',
                latitude: Number(location![1]),
                longitude: Number(location![2]),
                offset,
                filter: days.filter,
            }, { happenType: offset < 0 ? 'before' : offset > 0 ? 'after' : 'now', tempOffset: Math.abs(offset) });
        }
        default:
            if (!/^[A-Za-z][A-Za-z0-9]*$/.test(alias)) fail(line, `未知节点类型 ${alias}`);
            expectEnd(args, line);
            return node(alias, {});
    }
}

// ==================== 差异 ====================

interface NodeDiff {
    props?: Record<string, unknown>;
    cfg?: Record<string, unknown>;
    inputs?: Record<string, unknown>;
    /** 实际声明的输出端口（与默认端口不同时才出现） */
    ports?: string[];
}

function shallowDiff(base: Record<string, unknown>, actual: Record<string, unknown>): Record<string, unknown> | undefined {
    const diff: Record<string, unknown> = {};
    for (const key of Object.keys(actual)) if (!same(base[key], actual[key])) diff[key] = actual[key];
    for (const key of Object.keys(base)) if (!(key in actual)) diff[key] = null;
    return Object.keys(diff).length > 0 ? diff : undefined;
}

function applyShallow(base: Record<string, unknown>, diff: Record<string, unknown> | undefined): Record<string, unknown> {
    const result = { ...base };
    for (const [key, value] of Object.entries(diff || {})) {
        if (value === null) delete result[key];
        else result[key] = structuredClone(value);
    }
    return result;
}

function diffNode(baseline: GraphNode, actual: GraphNode): NodeDiff {
    const target = withoutPos(actual);
    const diff: NodeDiff = {};
    const props = shallowDiff(baseline.props, target.props || {});
    const cfg = shallowDiff(baseline.cfg, target.cfg || {});
    const inputs = shallowDiff(baseline.inputs, target.inputs || {});
    if (props) diff.props = props;
    if (cfg) diff.cfg = cfg;
    if (inputs) diff.inputs = inputs;
    const ports = Object.keys(target.outputs || {}).sort();
    if (!same(ports, Object.keys(baseline.outputs).sort())) diff.ports = ports;
    return diff;
}

function applyDiff(node: GraphNode, diff: NodeDiff | undefined): GraphNode {
    if (!diff) return node;
    const result: GraphNode = {
        ...node,
        props: applyShallow(node.props, diff.props),
        cfg: applyShallow(node.cfg, diff.cfg),
        inputs: applyShallow(node.inputs, diff.inputs),
    };
    if (diff.ports) result.outputs = Object.fromEntries(diff.ports.map((port) => [port, node.outputs[port] || []]));
    return result;
}

function diffText(diff: NodeDiff): string {
    return Object.keys(diff).length > 0 ? ` +${JSON.stringify(diff)}` : '';
}

// ==================== 连线 ====================

function splitTarget(target: string): { id: string; port?: string } {
    const dot = target.lastIndexOf('.');
    return dot === -1 ? { id: target } : { id: target.slice(0, dot), port: target.slice(dot + 1) };
}

function formatTargets(targets: string[], types: Map<string, string>): string {
    return targets.map((target) => {
        const { id, port } = splitTarget(target);
        const type = types.get(id);
        return port && type && primaryInput(type) === port ? id : target;
    }).join(', ');
}

function formatOutputs(node: GraphNode, types: Map<string, string>): string {
    const defaults = defaultOutputPorts(node.type);
    const segments = defaults.map((port) => formatTargets(Array.isArray(node.outputs?.[port]) ? node.outputs[port] : [], types));
    while (segments.length > 0 && segments[segments.length - 1] === '') segments.pop();
    for (const [port, targets] of Object.entries(node.outputs || {})) {
        if (defaults.includes(port) || !Array.isArray(targets) || targets.length === 0) continue;
        segments.push(`${port}: ${formatTargets(targets, types)}`);
    }
    return segments.length > 0 ? ` -> ${segments.join(' | ')}` : '';
}

function parseOutputs(text: string, type: string, line: number): Record<string, string[]> {
    const defaults = defaultOutputPorts(type);
    const outputs: Record<string, string[]> = {};
    text.split('|').forEach((segment, index) => {
        let body = segment.trim();
        let port: string | undefined = defaults[index];
        const named = /^([A-Za-z0-9]+):\s*(.*)$/.exec(body);
        if (named) {
            port = named[1];
            body = named[2];
        }
        if (!port) fail(line, `${type} 没有第 ${index + 1} 个输出端口，请写成 端口名: 目标`);
        outputs[port] = body ? body.split(',').map((item) => item.trim()).filter(Boolean) : [];
    });
    return outputs;
}

function referencedInputs(nodes: GraphNode[]): Map<string, Set<string>> {
    const refs = new Map<string, Set<string>>();
    for (const node of nodes) {
        for (const targets of Object.values(node.outputs || {})) {
            if (!Array.isArray(targets)) continue;
            for (const target of targets) {
                if (typeof target !== 'string') continue;
                const { id, port } = splitTarget(target);
                if (!port) continue;
                if (!refs.has(id)) refs.set(id, new Set());
                refs.get(id)!.add(port);
            }
        }
    }
    return refs;
}

/** logicOr/logicAnd/signalOr 的基线输入端口：input0 至被引用的最大编号，至少两个 */
function multiInputs(id: string, refs: Map<string, Set<string>>): Record<string, null> {
    let max = 1;
    for (const port of refs.get(id) || []) {
        const match = /^input(\d+)$/.exec(port);
        if (match) max = Math.max(max, Number(match[1]));
    }
    return Object.fromEntries(Array.from({ length: max + 1 }, (_, i) => [`input${i}`, null]));
}

// ==================== 单行解析 ====================

interface ParsedLine {
    /** 基线节点；raw 写法时为最终节点 */
    node: GraphNode;
    raw: boolean;
    targets?: Record<string, string[]>;
    diff?: NodeDiff;
    line: number;
}

function parseNodeLine(text: string, ctx: RuleTextContext, line: number): ParsedLine {
    const tokens = tokenize(text);
    const arrow = tokens.findIndex((token) => token.text === '->');
    const head = (arrow === -1 ? tokens : tokens.slice(0, arrow)).map((token) => token.text);
    const [id, alias] = head;
    if (!id || !alias) fail(line, '每行至少包含 节点ID 和 类型');
    if (!/^[A-Za-z0-9]+$/.test(id)) fail(line, `节点 ID 只能包含字母和数字：${id}`);

    if (alias === 'raw') {
        if (arrow !== -1 || head.length !== 3) fail(line, 'raw 写法为 节点ID raw {完整JSON}，连线写在 JSON 的 outputs 里');
        const full = parseLiteral(head[2], line) as Record<string, unknown>;
        if (!full || typeof full !== 'object' || typeof full.type !== 'string') fail(line, 'raw JSON 必须包含 type');
        return {
            node: {
                id,
                type: full.type as string,
                cfg: (full.cfg as Record<string, unknown>) || {},
                props: (full.props as Record<string, unknown>) || {},
                inputs: (full.inputs as Record<string, unknown>) || {},
                outputs: (full.outputs as Record<string, string[]>) || {},
            },
            raw: true,
            line,
        };
    }

    let args = head.slice(2);
    let diff: NodeDiff | undefined;
    if (args.length > 0 && args[args.length - 1].startsWith('+{')) {
        diff = parseLiteral(args[args.length - 1].slice(1), line) as NodeDiff;
        args = args.slice(0, -1);
    }
    const node = decodeHead(id, alias, args, ctx, line);
    const targets = arrow === -1 ? undefined : parseOutputs(text.slice(tokens[arrow].end), node.type, line);
    return { node, raw: false, targets, diff, line };
}

/** 填充连线、补全多输入端口、应用差异 */
function finalize(parsed: ParsedLine[]): GraphNode[] {
    const types = new Map(parsed.map((item) => [item.node.id, item.node.type]));
    const withTargets = parsed.map((item) => {
        if (item.raw || !item.targets) return item.node;
        const outputs = { ...item.node.outputs };
        for (const [port, targets] of Object.entries(item.targets)) {
            outputs[port] = targets.map((target) => {
                if (target.includes('.')) return target;
                const type = types.get(target);
                const port = type ? primaryInput(type) : undefined;
                if (!type) fail(item.line, `连线目标 ${target} 不存在`);
                if (!port) fail(item.line, `连到 ${target}（${type}）需要写明端口，如 ${target}.input0`);
                return `${target}.${port}`;
            });
        }
        return { ...item.node, outputs };
    });
    const refs = referencedInputs(withTargets);
    return withTargets.map((node, index) => {
        const item = parsed[index];
        if (item.raw) return node;
        const base = MULTI_INPUT_TYPES.has(node.type) ? { ...node, inputs: multiInputs(node.id, refs) } : node;
        return applyDiff(base, item.diff);
    });
}

// ==================== 编码 ====================

function noteBaseline(id: string, md: string): GraphNode {
    return {
        id,
        type: 'nop',
        cfg: { name: 'nop', version: 0, background: DEFAULT_NOTE_BACKGROUND, contents: markdownToNoteContents(md) },
        props: {},
        inputs: {},
        outputs: { output: [] },
    };
}

function rawLine(node: GraphNode): string {
    const { id, ...rest } = withoutPos(node);
    return `${id} raw ${JSON.stringify(rest)}`;
}

function encodeNote(node: GraphNode): string[] | null {
    const md = noteToMarkdown((node.cfg as Record<string, unknown>)?.contents);
    if (md === null) return null;
    const baseline = noteBaseline(node.id, md);
    const diff = diffNode(baseline, node);
    if (!sameNode(applyDiff(baseline, diff), node)) return null;
    return [`<<< ${node.id}${diffText(diff)}`, ...(md ? [md] : []), '>>>'];
}

/** 把规则节点编码为紧凑文本；任何节点无法无损简写时退回 raw JSON 行 */
export function nodesToText(nodes: GraphNode[], ctx: RuleTextContext): string {
    const types = new Map(nodes.map((node) => [node.id, node.type]));
    const refs = referencedInputs(nodes);
    const out: string[] = [];
    for (const node of nodes) {
        if (node.type === 'nop') {
            const note = encodeNote(node);
            if (note) {
                out.push(...note);
                continue;
            }
        }
        let line: string | null = null;
        try {
            const head = encodeHead(node, ctx);
            const headTokens = tokenize(head).map((token) => token.text);
            const baseline = decodeHead(headTokens[0], headTokens[1], headTokens.slice(2), ctx, 0);
            if (MULTI_INPUT_TYPES.has(baseline.type)) baseline.inputs = multiInputs(baseline.id, refs);
            const candidate = `${head}${diffText(diffNode(baseline, node))}${formatOutputs(node, types)}`;
            const parsed = parseNodeLine(candidate, ctx, 0);
            // 用整图的类型表与引用表复原，确保与真实节点一致
            const resolved = finalizeOne(parsed, types, refs);
            if (sameNode(resolved, node)) line = candidate;
        } catch {
            line = null;
        }
        out.push(line ?? rawLine(node));
    }
    return out.join('\n');
}

function finalizeOne(item: ParsedLine, types: Map<string, string>, refs: Map<string, Set<string>>): GraphNode {
    if (item.raw) return item.node;
    let node = item.node;
    if (item.targets) {
        const outputs = { ...node.outputs };
        for (const [port, targets] of Object.entries(item.targets)) {
            outputs[port] = targets.map((target) => {
                if (target.includes('.')) return target;
                const type = types.get(target);
                const inputPort = type ? primaryInput(type) : undefined;
                if (!inputPort) throw new Error('unresolved');
                return `${target}.${inputPort}`;
            });
        }
        node = { ...node, outputs };
    }
    if (MULTI_INPUT_TYPES.has(node.type)) node = { ...node, inputs: multiInputs(node.id, refs) };
    return applyDiff(node, item.diff);
}

// ==================== 宏 ====================

function findProperty(ctx: RuleTextContext, did: string, pattern: RegExp): MiotPropertyCapability | undefined {
    const urn = ctx.devices.get(did)?.urn;
    return urn ? ctx.specs.get(urn)?.properties.find((item) => pattern.test(item.desc)) : undefined;
}

function findAction(ctx: RuleTextContext, did: string, pattern: RegExp): { siid: number; aiid: number } | undefined {
    const urn = ctx.devices.get(did)?.urn;
    const action = urn ? ctx.specs.get(urn)?.actions.find((item) => item.type === 'action' && typeof item.aiid === 'number' && pattern.test(item.desc)) : undefined;
    return action ? { siid: action.siid, aiid: action.aiid! } : undefined;
}

function macroArgs(args: string[], line: number): { positional: string[]; options: Record<string, string> } {
    const positional: string[] = [];
    const options: Record<string, string> = {};
    for (const arg of args) {
        const match = /^([A-Za-z]+)=(.+)$/.exec(arg);
        if (match) options[match[1]] = match[2];
        else positional.push(arg);
    }
    if (!positional[0] || !/^[A-Za-z0-9]+$/.test(positional[0])) fail(line, '宏的第一个参数是节点 ID 前缀（字母数字），也是宏的入口节点 ID');
    return { positional, options };
}

interface MacroResult {
    lines: string[];
    variables: RuleTextVariable[];
}

/**
 * 展开宏（入口节点 ID 即前缀）：
 *   @tts <前缀> <音箱> volume=<数值或$变量> text=<"文本"或$变量> [restore=40s] [-> 播报之后]
 *     记住原音量 → 设音量 → 等 1.5 秒 → 播报并开始恢复计时 → 恢复原音量；自动声明 $R.<前缀>Vol
 *   @pulse <前缀> <$变量> hold=<时长> [-> 置 1 之后]
 *     先置 0 再置 1（保证 varChange 收到变化），保持一段时间后回 0
 */
function expandMacro(text: string, ctx: RuleTextContext, line: number): MacroResult {
    const tokens = tokenize(text);
    const arrow = tokens.findIndex((token) => token.text === '->');
    const head = (arrow === -1 ? tokens : tokens.slice(0, arrow)).map((token) => token.text);
    const after = arrow === -1 ? '' : text.slice(tokens[arrow].end).trim();
    const name = head[0].slice(1);
    const { positional, options } = macroArgs(head.slice(1), line);
    const p = positional[0];

    if (name === 'pulse') {
        const ref = positional[1] ?? fail(line, '@pulse 需要变量，如 $homeArrival');
        parseVar(ref, ctx, line);
        const hold = options.hold ?? fail(line, '@pulse 需要 hold=时长');
        parseDuration(hold, line);
        return {
            variables: [],
            lines: [
                `${p} vset ${ref} = "0" -> ${p}On`,
                `${p}On vset ${ref} = "1" -> ${[`${p}Hold`, after].filter(Boolean).join(', ')}`,
                `${p}Hold delay ${hold} -> ${p}Off`,
                `${p}Off vset ${ref} = "0"`,
            ],
        };
    }

    if (name === 'tts') {
        const did = resolveDevice(positional[1] ?? fail(line, '@tts 需要音箱'), ctx, line);
        const volume = findProperty(ctx, did, /volume/i);
        const play = findAction(ctx, did, /play[ -]?text/i);
        if (!volume || !play) fail(line, `设备 ${did} 找不到音量属性或播放文本动作`);
        const level = options.volume ?? fail(line, '@tts 需要 volume=');
        const say = options.text ?? fail(line, '@tts 需要 text=');
        const restore = options.restore ?? '40s';
        parseDuration(restore, line);
        let ins: unknown;
        if (say.startsWith('$')) {
            const ref = parseVar(say, ctx, line);
            ins = [{ dtype: 'string', id: ref.id, piid: 1, scope: ref.scope }];
        } else {
            ins = [{ piid: 1, value: parseLiteral(say, line) }];
        }
        const v = `${volume!.siid}/${volume!.piid}`;
        return {
            variables: [{ id: `${p}Vol`, scope: ctx.scope, type: 'number', value: 0, name: `${p} 播报前音量` }],
            lines: [
                `${p} getvar ${did} ${v} $R.${p}Vol -> ${p}Set`,
                `${p}Set set ${did} ${v} = ${level} -> ${p}Wait`,
                `${p}Wait delay 1.5s -> ${p}Say, ${p}Rest`,
                `${p}Say do ${did} ${play!.siid}.a${play!.aiid} ${JSON.stringify(ins)}${after ? ` -> ${after}` : ''}`,
                `${p}Rest delay ${restore} -> ${p}Back`,
                `${p}Back set ${did} ${v} = $R.${p}Vol`,
            ],
        };
    }

    return fail(line, `未知宏 @${name}（可用 @tts、@pulse）`);
}

// ==================== 解析入口 ====================

function parseVariableLine(text: string, ctx: RuleTextContext, line: number): RuleTextVariable {
    const tokens = tokenize(text).map((token) => token.text);
    const ref = parseVar(tokens[1] ?? fail(line, 'var 写法为 var $R.名 number 0 "显示名"'), ctx, line);
    const type = tokens[2];
    if (type !== 'number' && type !== 'string') fail(line, '变量类型只能是 number 或 string');
    const value = parseLiteral(tokens[3] ?? fail(line, '缺少初始值'), line);
    if (typeof value !== type) fail(line, `初始值类型必须是 ${type}`);
    const name = tokens[4] !== undefined ? parseLiteral(tokens[4], line) : undefined;
    if (name !== undefined && typeof name !== 'string') fail(line, '显示名必须是字符串');
    expectEnd(tokens.slice(5), line);
    return { id: ref.id, scope: ref.scope, type: type as 'number' | 'string', value: value as number | string, ...(name ? { name: name as string } : {}) };
}

/** 收集文本中引用的设备（did 或名称），供服务端预先拉取设备能力 */
export function collectDeviceTokens(text: string): string[] {
    const found = new Set<string>();
    const deviceAliases = new Set(['in', 'get', 'set', 'do', 'getvar']);
    let inNote = false;
    for (const raw of text.split(/\r?\n/)) {
        const trimmed = raw.trim();
        if (inNote) {
            if (trimmed === '>>>') inNote = false;
            continue;
        }
        if (trimmed.startsWith('<<<')) {
            inNote = true;
            continue;
        }
        const tokens = tokenize(trimmed).map((token) => token.text);
        const device = tokens[0] === '@tts' ? tokens[2] : deviceAliases.has(tokens[1]) ? tokens[2] : undefined;
        if (!device) continue;
        if (device.startsWith('"')) {
            try {
                found.add(String(JSON.parse(device)));
            } catch {
                found.add(device);
            }
        } else {
            found.add(device);
        }
    }
    return [...found];
}

/** 把紧凑文本解析为规则节点与需要创建的变量 */
export function textToNodes(text: string, ctx: RuleTextContext): ParsedRuleText {
    const lines = text.replace(/\r\n?/g, '\n').split('\n');
    const parsed: ParsedLine[] = [];
    const variables: RuleTextVariable[] = [];

    for (let index = 0; index < lines.length; index++) {
        const line = index + 1;
        const trimmed = lines[index].trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        if (trimmed.startsWith('<<<')) {
            const header = tokenize(trimmed.slice(3).trim()).map((token) => token.text);
            const id = header[0] ?? fail(line, '备注块写法为 <<< 备注节点ID');
            if (!/^[A-Za-z0-9]+$/.test(id)) fail(line, `节点 ID 只能包含字母和数字：${id}`);
            const diff = header[1]?.startsWith('+{') ? parseLiteral(header[1].slice(1), line) as NodeDiff : undefined;
            const body: string[] = [];
            index++;
            while (index < lines.length && lines[index].trim() !== '>>>') body.push(lines[index++]);
            if (index >= lines.length) fail(line, `备注块 ${id} 缺少结束行 >>>`);
            let baseline: GraphNode;
            try {
                baseline = noteBaseline(id, body.join('\n'));
            } catch (error) {
                return fail(line, String(error instanceof Error ? error.message : error));
            }
            parsed.push({ node: baseline, raw: false, diff, line });
            continue;
        }
        if (trimmed.startsWith('var ')) {
            variables.push(parseVariableLine(trimmed, ctx, line));
            continue;
        }
        if (trimmed.startsWith('@')) {
            const macro = expandMacro(trimmed, ctx, line);
            variables.push(...macro.variables);
            for (const item of macro.lines) parsed.push(parseNodeLine(item, ctx, line));
            continue;
        }
        parsed.push(parseNodeLine(trimmed, ctx, line));
    }

    const seen = new Set<string>();
    for (const item of parsed) {
        if (seen.has(item.node.id)) fail(item.line, `节点 ID ${item.node.id} 重复`);
        seen.add(item.node.id);
    }
    const seenVars = new Set<string>();
    for (const variable of variables) {
        const key = `${variable.scope}/${variable.id}`;
        if (seenVars.has(key)) throw new Error(`变量 ${key} 重复声明`);
        seenVars.add(key);
    }
    return { nodes: finalize(parsed), variables };
}

/** 节点的单行文本（用于返回改动明细） */
export function nodeLines(nodes: GraphNode[], ids: string[], ctx: RuleTextContext): string {
    const wanted = new Set(ids);
    const text = nodesToText(nodes, ctx).split('\n');
    const out: string[] = [];
    let inNote = false;
    let keepNote = false;
    for (const line of text) {
        if (inNote) {
            if (keepNote) out.push(line);
            if (line === '>>>') inNote = false;
            continue;
        }
        if (line.startsWith('<<< ')) {
            inNote = true;
            keepNote = wanted.has(line.slice(4).split(' ')[0]);
            if (keepNote) out.push(line);
            continue;
        }
        if (wanted.has(line.split(' ')[0])) out.push(line);
    }
    return out.join('\n');
}
