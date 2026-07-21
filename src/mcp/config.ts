/**
 * MCP Server - 配置管理
 */

import { z } from "zod";

// 默认配置
// 注意：不为 GATEWAY_URL 设置硬编码默认地址。每个家庭的网关地址都不同，
// 静默回退到某个固定 IP 会导致连接错误的设备并超时。缺省时应提示用户提供地址。
export const DEFAULT_CONFIG = {
  CONNECT_TIMEOUT: 10000,
  API_TIMEOUT: 5000,
} as const;

// 配置 Schema
export const ConfigSchema = z.object({
  gatewayUrl: z.string().url().optional(),
  connectTimeout: z.number().positive().optional(),
  apiTimeout: z.number().positive().optional(),
});

export type Config = z.infer<typeof ConfigSchema>;

/**
 * 获取配置值
 * 优先级：传入参数 > 环境变量 > 空（缺省时由调用方提示用户提供地址）
 */
export function getConfig(userConfig?: Config): Required<Config> {
  const config = ConfigSchema.parse(userConfig || {});

  return {
    gatewayUrl: config.gatewayUrl || process.env.GATEWAY_URL || "",
    connectTimeout: config.connectTimeout || DEFAULT_CONFIG.CONNECT_TIMEOUT,
    apiTimeout: config.apiTimeout || DEFAULT_CONFIG.API_TIMEOUT,
  };
}
