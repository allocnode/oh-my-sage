import assert from 'node:assert/strict';
import { getConfig } from './config.js';

// 无 gateway_url 参数、无环境变量时，getConfig 返回空字符串（不再回退到硬编码 IP）
const saved = process.env.GATEWAY_URL;
delete process.env.GATEWAY_URL;
assert.equal(getConfig().gatewayUrl, '', '缺省时不应返回硬编码默认地址');
assert.equal(getConfig({ gatewayUrl: 'http://10.0.0.1' }).gatewayUrl, 'http://10.0.0.1', '应优先使用传入参数');
process.env.GATEWAY_URL = 'http://10.0.0.2';
assert.equal(getConfig().gatewayUrl, 'http://10.0.0.2', '应使用环境变量');
if (saved === undefined) delete process.env.GATEWAY_URL; else process.env.GATEWAY_URL = saved;

console.log('config gateway url tests passed');
