/**
 * Core - 核心库导出
 * 包含所有可复用逻辑：Gateway 连接管理、原子工具函数、类型定义
 */

// Gateway
export { GatewayClient } from './gateway/client';
export { createGatewayManager } from './gateway/manager';
export type { GatewayManager } from './gateway/manager';

// 工具函数
export { getDevices, getDevice } from './tools/device';
export { getGraphs, getGraph, createGraph, updateGraph, deleteGraph, toggleGraph } from './tools/graph';
export { getVariables, setVariable, createVariable, deleteVariable, getVariableConfig, getVariableValue } from './tools/variable';
export { callGatewayApi, READ_ONLY_GATEWAY_METHODS } from './tools/misc';
export { validateGraphCapabilitiesWithGateway } from './tools/capabilityValidation';
export { validateGraph, layoutNodes } from './tools/base';

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
export type { Graph, GraphNode, GraphConfig, GraphSummary, CreateGraphInput, ValidationError } from './types/graph';
export type { ToolResult, ToolError, ToolResponse, Variable } from './types';
