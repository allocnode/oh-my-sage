/**
 * oh-my-sage - AI 模型配置
 * 仅支持 OpenAI 兼容接口
 */

import {createOpenAI} from '@ai-sdk/openai';

/**
 * 模型配置
 */
export interface ModelConfig {
    /** API 地址 */
    baseURL: string;
    /** API Key */
    apiKey: string;
    /** 模型名称 */
    model: string;
    /** 温度（可选，默认 0.7） */
    temperature?: number;
}

/**
 * 创建模型实例
 */
export function createModel(config: ModelConfig) {
    if (!config.baseURL) throw new Error('缺少 API Base URL 配置');
    if (!config.apiKey) throw new Error('缺少 API Key 配置');
    if (!config.model) throw new Error('缺少模型名称配置');

    return createOpenAI({
        apiKey: config.apiKey,
        baseURL: config.baseURL,
    })(config.model);
}

/**
 * 从环境变量读取模型配置
 *
 * 环境变量：
 *   LLM_BASE_URL  - API 地址，如 https://api.openai.com/v1
 *   LLM_API_KEY   - API Key
 *   LLM_MODEL     - 模型名称，如 gpt-6.1-terra
 */
export function getModelConfigFromEnv(): ModelConfig {
    return {
        baseURL: process.env.LLM_BASE_URL || '',
        apiKey: process.env.LLM_API_KEY || '',
        model: process.env.LLM_MODEL || '',
        temperature: parseFloat(process.env.LLM_TEMPERATURE || '0.7'),
    };
}
