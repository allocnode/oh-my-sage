/**
 * oh-my-sage - AI 模型配置
 * 使用 Vercel AI SDK，支持任何 OpenAI 兼容的 API
 */

import { createOpenAI } from '@ai-sdk/openai';
import { createAnthropic } from '@ai-sdk/anthropic';

/**
 * 模型配置接口
 */
export interface ModelConfig {
  /** 配置名称（用于显示） */
  name: string;
  
  /** 提供商类型 */
  provider: 'openai-compatible' | 'openai' | 'anthropic';
  
  /** API 地址 */
  baseURL: string;
  
  /** API Key */
  apiKey: string;
  
  /** 模型名称 */
  model: string;
  
  /** 温度（可选） */
  temperature?: number;
  
  /** 最大 token 数（可选） */
  maxTokens?: number;
}

/**
 * 预设模型配置
 */
export const PRESET_MODELS: Record<string, ModelConfig> = {
  // ==================== 国产模型 ====================
  
  'qwen-max': {
    name: '通义千问 Max',
    provider: 'openai-compatible',
    baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    apiKey: '',
    model: 'qwen-max',
  },
  
  'qwen-plus': {
    name: '通义千问 Plus',
    provider: 'openai-compatible',
    baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    apiKey: '',
    model: 'qwen-plus',
  },
  
  'mimo-v2-pro': {
    name: 'MiMo v2 Pro (小米)',
    provider: 'openai-compatible',
    baseURL: 'https://api.xiaomimimo.com/v1',
    apiKey: '',
    model: 'mimo-v2-pro',
  },

  'mimo-v2-omni': {
    name: 'MiMo v2 omni (小米)',
    provider: 'openai-compatible',
    baseURL: 'https://api.xiaomimimo.com/v1',
    apiKey: '',
    model: 'mimo-v2-omni',
  },
  
  'kimi-128k': {
    name: 'Kimi 128K',
    provider: 'openai-compatible',
    baseURL: 'https://api.moonshot.cn/v1',
    apiKey: '',
    model: 'moonshot-v1-128k',
  },
  
  'deepseek-chat': {
    name: 'DeepSeek Chat',
    provider: 'openai-compatible',
    baseURL: 'https://api.deepseek.com/v1',
    apiKey: '',
    model: 'deepseek-chat',
  },
  
  'glm-4': {
    name: '智谱 GLM-4',
    provider: 'openai-compatible',
    baseURL: 'https://open.bigmodel.cn/api/paas/v4',
    apiKey: '',
    model: 'glm-4',
  },
  
  'minimax-abab6.5': {
    name: 'MiniMax ABAB6.5',
    provider: 'openai-compatible',
    baseURL: 'https://api.minimax.chat/v1',
    apiKey: '',
    model: 'abab6.5-chat',
  },
  
  'baichuan4': {
    name: '百川 4',
    provider: 'openai-compatible',
    baseURL: 'https://api.baichuan-ai.com/v1',
    apiKey: '',
    model: 'Baichuan4',
  },
  
  'step-2': {
    name: '阶跃星辰 Step-2',
    provider: 'openai-compatible',
    baseURL: 'https://api.stepfun.com/v1',
    apiKey: '',
    model: 'step-2',
  },
  
  'yi-large': {
    name: '零一万物 Yi-Large',
    provider: 'openai-compatible',
    baseURL: 'https://api.lingyiwanwu.com/v1',
    apiKey: '',
    model: 'yi-large',
  },
  
  // ==================== 国际模型 ====================
  
  'gpt-4o': {
    name: 'OpenAI GPT-4o',
    provider: 'openai',
    baseURL: 'https://api.openai.com/v1',
    apiKey: '',
    model: 'gpt-4o',
  },
  
  'claude-3.5-sonnet': {
    name: 'Claude 3.5 Sonnet',
    provider: 'anthropic',
    baseURL: 'https://api.anthropic.com/v1',
    apiKey: '',
    model: 'claude-3-5-sonnet-20241022',
  },
  
  // ==================== 本地部署 ====================
  
  'local-ollama': {
    name: '本地 Ollama',
    provider: 'openai-compatible',
    baseURL: 'http://localhost:11434/v1',
    apiKey: 'ollama',
    model: 'qwen2:72b',
  },
  
  'local-vllm': {
    name: '本地 vLLM',
    provider: 'openai-compatible',
    baseURL: 'http://localhost:8000/v1',
    apiKey: 'dummy',
    model: 'Qwen/Qwen2-72B-Instruct',
  },
  
  // ==================== 自定义 ====================
  
  'custom': {
    name: '自定义',
    provider: 'openai-compatible',
    baseURL: '',
    apiKey: '',
    model: '',
  },
};

/**
 * 创建模型实例
 * 根据配置选择合适的 provider
 * 
 * @param config 模型配置
 * @returns Vercel AI SDK 模型实例
 */
export function createModel(config: ModelConfig) {
  // 验证配置
  if (!config.baseURL) {
    throw new Error('缺少 API Base URL 配置');
  }
  if (!config.apiKey) {
    throw new Error('缺少 API Key 配置');
  }
  if (!config.model) {
    throw new Error('缺少模型名称配置');
  }
  
  switch (config.provider) {
    case 'openai-compatible':
      // 任何兼容 OpenAI API 的服务
      // 包括：Qwen、Kimi、DeepSeek、智谱、本地 Ollama、vLLM 等
      return createOpenAI({
        apiKey: config.apiKey,
        baseURL: config.baseURL,
      })(config.model);
    
    case 'openai':
      // OpenAI 官方
      return createOpenAI({
        apiKey: config.apiKey,
        baseURL: config.baseURL || undefined,
      })(config.model);
    
    case 'anthropic':
      // Anthropic 官方
      return createAnthropic({
        apiKey: config.apiKey,
        baseURL: config.baseURL || undefined,
      })(config.model);
    
    default:
      throw new Error(`不支持的 provider: ${config.provider}`);
  }
}

/**
 * 从环境变量获取模型配置
 */
export function getModelConfigFromEnv(): ModelConfig {
  // 获取预设名称
  const presetName = process.env.DEFAULT_MODEL || 'qwen-max';
  const preset = PRESET_MODELS[presetName];
  
  if (preset) {
    // 使用预设配置，但 API Key 从环境变量获取
    const apiKeyEnvVar = `${presetName.toUpperCase().replace(/[-.]/g, '_')}_API_KEY`;
    const apiKey = process.env[apiKeyEnvVar] || process.env.LLM_API_KEY || '';
    
    return {
      ...preset,
      apiKey,
      baseURL: process.env.LLM_BASE_URL || preset.baseURL,
      model: process.env.LLM_MODEL || preset.model,
    };
  }
  
  // 自定义配置
  return {
    name: '自定义',
    provider: 'openai-compatible',
    baseURL: process.env.LLM_BASE_URL || '',
    apiKey: process.env.LLM_API_KEY || '',
    model: process.env.LLM_MODEL || '',
  };
}


