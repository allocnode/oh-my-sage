/**
 * Core - 共享类型定义
 */

/** 工具成功结果 */
export interface ToolResult<T = unknown> {
    success: true;
    data?: T;
    message?: string;
}

/** 工具错误结果 */
export interface ToolError {
    success: false;
    error: string;
}

/** 工具响应类型 */
export type ToolResponse<T = unknown> = ToolResult<T> | ToolError;

/** 变量 */
export interface Variable {
    id?: string;
    scope?: string;
    type: 'number' | 'string';
    value: number | string;
    userData: {
        name: string;
    };
}
