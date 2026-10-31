/**
 * Core - 规则哈希
 * 逻辑哈希（graphHash）忽略卡片坐标，只反映规则怎么运行；
 * 布局哈希（layoutHash）只反映卡片坐标与尺寸，用于布局修改的并发检查。两者互不影响。
 */

import { createHash } from 'node:crypto';
import type { GraphNode } from '../types/graph';

/** 递归排序对象键，数组保持原顺序 */
function canonicalize(value: unknown): unknown {
    if (Array.isArray(value)) return value.map(canonicalize);
    if (!value || typeof value !== 'object') return value;
    const record = value as Record<string, unknown>;
    return Object.fromEntries(Object.keys(record).sort().map((key) => [key, canonicalize(record[key])]));
}

/** 去掉 cfg.pos（卡片坐标不影响规则语义） */
function withoutPos(node: GraphNode): unknown {
    const { pos: _pos, ...cfg } = (node.cfg || {}) as Record<string, unknown>;
    return { ...node, cfg };
}

/** 单个节点的逻辑内容（忽略坐标与键顺序） */
export function canonicalNode(node: GraphNode): string {
    return JSON.stringify(canonicalize(withoutPos(node)));
}

/** 规则内容哈希：忽略坐标与对象键顺序，节点顺序参与计算；取 sha256 前 16 位 */
export function graphHash(nodes: GraphNode[]): string {
    const canonical = JSON.stringify(canonicalize((nodes || []).map(withoutPos)));
    return createHash('sha256').update(canonical).digest('hex').slice(0, 16);
}

/** 节点坐标与尺寸的比较键；没有坐标时为空串 */
export function positionKey(node: GraphNode | undefined): string {
    const pos = (node?.cfg as Record<string, unknown> | undefined)?.pos as Record<string, unknown> | undefined;
    if (!pos || typeof pos !== 'object') return '';
    return JSON.stringify([pos.x, pos.y, pos.width, pos.height]);
}

/** 布局哈希：按节点 ID 排序后的坐标与尺寸；与节点顺序和逻辑内容无关 */
export function layoutHash(nodes: GraphNode[]): string {
    const entries = (nodes || []).map((node) => [node.id, positionKey(node)]).sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0));
    return createHash('sha256').update(JSON.stringify(entries)).digest('hex').slice(0, 16);
}

/** 两组节点中都存在、且坐标或尺寸不同的节点 ID */
export function positionChangedIds(before: GraphNode[], after: GraphNode[]): string[] {
    const old = new Map((before || []).map((node) => [node.id, node]));
    return (after || []).filter((node) => old.has(node.id) && positionKey(old.get(node.id)) !== positionKey(node)).map((node) => node.id).sort();
}
