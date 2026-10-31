/**
 * Core - 备注节点（nop）富文本与 Markdown 互转
 *
 * 网关备注正文是 Quill Delta 片段数组。这里只支持三种格式：粗体、无序列表、有序列表，
 * 足以覆盖「标题 + 条目」写法。遇到其他格式或会产生歧义的文本时返回 null，
 * 由调用方保留原始 JSON，保证不丢信息。
 */

export interface NoteRun {
    text: string;
    bold: boolean;
}

export interface NoteLine {
    runs: NoteRun[];
    list?: 'bullet' | 'ordered';
}

export interface NoteOperation {
    /** 追加到哪个段落（段落标题为整行粗体），缺省时追加到末尾 */
    section?: string;
    /** 追加一条列表项 */
    append?: string;
    /** 原文中恰好出现一次的片段 */
    replace?: string;
    /** 替换为 */
    with?: string;
    /** 在「变更」段最前面追加一条记录 */
    changelog?: string;
    /** 整体替换为这段 Markdown */
    set?: string;
}

const LINE_HEIGHT = 28;
const NOTE_PADDING = 48;
const NOTE_MIN_HEIGHT = 160;

function mergeRuns(runs: NoteRun[]): NoteRun[] {
    const merged: NoteRun[] = [];
    for (const run of runs) {
        if (!run.text) continue;
        const last = merged[merged.length - 1];
        if (last && last.bold === run.bold) last.text += run.text;
        else merged.push({ ...run });
    }
    return merged;
}

function trimTrailingEmpty(lines: NoteLine[]): NoteLine[] {
    const result = [...lines];
    while (result.length > 0 && result[result.length - 1].runs.length === 0 && !result[result.length - 1].list) result.pop();
    return result;
}

/** 把 Delta 拆成行；遇到不支持的格式返回 null */
export function deltaToLines(contents: unknown): NoteLine[] | null {
    if (!Array.isArray(contents)) return null;
    const lines: NoteLine[] = [];
    let runs: NoteRun[] = [];
    for (const op of contents) {
        if (!op || typeof op !== 'object') return null;
        const { insert, attributes } = op as { insert?: unknown; attributes?: Record<string, unknown> };
        if (typeof insert !== 'string') return null;
        const attrs = attributes || {};
        for (const key of Object.keys(attrs)) if (key !== 'bold' && key !== 'list') return null;
        if (attrs.bold !== undefined && attrs.bold !== true) return null;
        const list = attrs.list;
        if (list !== undefined && list !== 'bullet' && list !== 'ordered') return null;
        const parts = insert.split('\n');
        parts.forEach((part, index) => {
            if (index > 0) {
                lines.push({ runs: mergeRuns(runs), ...(list ? { list: list as 'bullet' | 'ordered' } : {}) });
                runs = [];
            }
            if (part) runs.push({ text: part, bold: attrs.bold === true });
        });
    }
    if (runs.length > 0) lines.push({ runs: mergeRuns(runs) });
    return trimTrailingEmpty(lines);
}

function isAmbiguous(text: string): boolean {
    return text.includes('**');
}

/** 行转 Markdown；有歧义时返回 null */
export function linesToMarkdown(lines: NoteLine[]): string | null {
    const out: string[] = [];
    for (const line of lines) {
        const body = line.runs.map((run) => (run.bold ? `**${run.text}**` : run.text)).join('');
        if (line.runs.some((run) => isAmbiguous(run.text) || (run.bold && run.text.trim() !== run.text))) return null;
        if (!line.list && (/^- /.test(body) || /^\d+\. /.test(body))) return null;
        if (body.trim() === '>>>') return null;
        if (line.list === 'bullet') out.push(`- ${body}`);
        else if (line.list === 'ordered') out.push(`1. ${body}`);
        else out.push(body);
    }
    return out.join('\n');
}

/** Markdown 转行 */
export function markdownToLines(md: string): NoteLine[] {
    const lines: NoteLine[] = [];
    for (const raw of md.replace(/\r\n?/g, '\n').split('\n')) {
        let text = raw;
        let list: NoteLine['list'];
        if (text.startsWith('- ')) {
            list = 'bullet';
            text = text.slice(2);
        } else if (/^\d+\. /.test(text)) {
            list = 'ordered';
            text = text.replace(/^\d+\. /, '');
        }
        const parts = text.split('**');
        if (parts.length % 2 === 0) throw new Error(`备注粗体标记 ** 不成对：${raw}`);
        const runs = parts.map((part, index) => ({ text: part, bold: index % 2 === 1 }));
        lines.push({ runs: mergeRuns(runs), ...(list ? { list } : {}) });
    }
    return trimTrailingEmpty(lines);
}

/** 行转 Delta，并按 Quill 规则合并相邻同格式片段 */
export function linesToDelta(lines: NoteLine[]): Array<Record<string, unknown>> {
    const ops: Array<{ insert: string; attributes?: Record<string, unknown> }> = [];
    const push = (insert: string, attributes?: Record<string, unknown>): void => {
        const last = ops[ops.length - 1];
        if (last && JSON.stringify(last.attributes || null) === JSON.stringify(attributes || null)) last.insert += insert;
        else ops.push(attributes ? { attributes, insert } : { insert });
    };
    for (const line of lines) {
        for (const run of line.runs) push(run.text, run.bold ? { bold: true } : undefined);
        push('\n', line.list ? { list: line.list } : undefined);
    }
    return ops;
}

/** 备注正文转 Markdown；无法无损表示时返回 null */
export function noteToMarkdown(contents: unknown): string | null {
    const lines = deltaToLines(contents);
    return lines ? linesToMarkdown(lines) : null;
}

export function markdownToNoteContents(md: string): Array<Record<string, unknown>> {
    return linesToDelta(markdownToLines(md));
}

/** 两份备注渲染后是否一致（忽略片段拆分方式和末尾空行） */
export function sameNoteText(contents: unknown, md: string): boolean {
    const current = deltaToLines(contents);
    if (!current) return false;
    try {
        return JSON.stringify(current) === JSON.stringify(markdownToLines(md));
    } catch {
        return false;
    }
}

export function noteHeight(md: string): number {
    const count = markdownToLines(md).length;
    return Math.max(NOTE_MIN_HEIGHT, count * LINE_HEIGHT + NOTE_PADDING);
}

const HEADING = /^\*\*(.+)\*\*$/;

function sectionRange(lines: string[], section: string): { start: number; end: number } | null {
    const start = lines.findIndex((line) => HEADING.exec(line.trim())?.[1] === section);
    if (start === -1) return null;
    let end = start + 1;
    while (end < lines.length && !HEADING.test(lines[end].trim())) end++;
    // end 指向下一个标题；回退到本段最后一个非空行之后
    let last = end;
    while (last > start + 1 && lines[last - 1].trim() === '') last--;
    return { start, end: last };
}

/** 对备注 Markdown 执行操作，返回新 Markdown */
export function applyNoteOperations(md: string, operations: NoteOperation[]): string {
    let text = md;
    for (const operation of operations) {
        if (operation.set !== undefined) {
            text = operation.set;
            continue;
        }
        if (operation.replace !== undefined) {
            if (operation.with === undefined) throw new Error('备注 replace 需要同时提供 with');
            const count = text.split(operation.replace).length - 1;
            if (count !== 1) throw new Error(`备注中「${operation.replace}」出现 ${count} 次，必须恰好 1 次`);
            text = text.replace(operation.replace, operation.with);
            continue;
        }
        const lines = text ? text.split('\n') : [];
        if (operation.changelog !== undefined) {
            const range = sectionRange(lines, '变更');
            if (range) lines.splice(range.start + 1, 0, `- ${operation.changelog}`);
            else lines.push(...(lines.length ? [''] : []), '**变更**', `- ${operation.changelog}`);
            text = lines.join('\n');
            continue;
        }
        if (operation.append !== undefined) {
            const item = `- ${operation.append}`;
            if (operation.section) {
                const range = sectionRange(lines, operation.section);
                if (range) lines.splice(range.end, 0, item);
                else lines.push(...(lines.length ? [''] : []), `**${operation.section}**`, item);
            } else {
                lines.push(item);
            }
            text = lines.join('\n');
            continue;
        }
        throw new Error('备注操作必须是 set、replace、changelog 或 append 之一');
    }
    return text;
}
