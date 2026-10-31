/**
 * Core - 核心库导出
 * 包含所有可复用逻辑：Gateway 连接管理、原子工具函数、类型定义
 */

// Gateway
export { GatewayClient } from './gateway/client';
export { createGatewayManager } from './gateway/manager';
export type { GatewayManager } from './gateway/manager';

// 工具函数
export { getDevices, getDevice, fetchMiotSpec, clearMiotSpecCache } from './tools/device';
export { getGraphs, getGraph, createGraph, updateGraph, deleteGraph, toggleGraph, findDeviceUsage } from './tools/graph';
export { graphHash, summarizeGraph, applyGraphPatch, patchGraph, validateGraphById } from './tools/graphEdit';
export type { GraphCompactSummary, GraphNodeSummary, GraphPatch } from './tools/graphEdit';
export { getGraphText, putGraphText, patchGraphV2, queryRules, getGraphLog, parseGatewayLog, buildTextContext, focusIds, summarizeLayout, checkGraphLayout } from './tools/graphText';
export type { GraphTextResult, GraphChangeReport, PatchV2Input, RuleQuery, RuleQueryHit, LogQuery, LayoutCheckInput, LayoutCheckResult } from './tools/graphText';
export { nodesToText, textToNodes, nodeLines, sameNode } from './tools/ruleText';
export type { RuleTextContext, RuleTextVariable, ParsedRuleText } from './tools/ruleText';
export { noteToMarkdown, markdownToNoteContents, applyNoteOperations } from './tools/ruleNote';
export type { NoteOperation } from './tools/ruleNote';
export { getVariables, setVariable, createVariable, deleteVariable, getVariableValue, getVariableConfig } from './tools/variable';
export { callGatewayApi, READ_ONLY_GATEWAY_METHODS } from './tools/misc';
export { validateGraphCapabilitiesWithGateway, validateGraphVariablesWithGateway } from './tools/capabilityValidation';
export type { CapabilityValidationReport, VariableValidationOptions } from './tools/capabilityValidation';
export { validateGraph, layoutNodes, mapLimit } from './tools/base';
export { arrangeNodes, layoutReport, estimateSize } from './tools/layout';
export type { LayoutOptions, LayoutReport, LayoutResult } from './tools/layout';
export { layoutHash, positionChangedIds } from './tools/graphHash';

// 类型
export type {
    Device,
    DeviceInfo,
    DeviceListResponse,
    MiotActionCapability,
    MiotEventCapability,
    MiotPropertyCapability,
    MiotValueListItem,
    MiotValueRange,
} from './types/device';
export type { Graph, GraphNode, GraphConfig, GraphSummary, CreateGraphInput, UpdateGraphInput, ValidationError, DeviceUsageNode, DeviceUsageGraph, DeviceUsage, DeviceUsageReport } from './types/graph';
export type { ToolResult, ToolError, ToolResponse, Variable } from './types';
