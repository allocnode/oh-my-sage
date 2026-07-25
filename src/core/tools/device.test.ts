import assert from 'node:assert/strict';
import { normalizeMiotSpec } from './device.js';

const normalized = normalizeMiotSpec({
  services: [{
    iid: 2,
    description: '人体传感器',
    properties: [{
      iid: 2,
      description: '无人移动时长',
      format: 'uint16',
      unit: 'minutes',
      access: ['read', 'notify'],
      'value-list': [
        { value: 2, description: '2 分钟' },
        { value: 5, description: '5 分钟' },
      ],
    }, {
      iid: 3,
      description: '亮度',
      format: 'uint8',
      access: ['read', 'write', 'notify'],
      'value-range': [1, 100, 1],
    }],
    events: [{ iid: 1, description: '检测到移动', arguments: [2] }],
    actions: [{ iid: 1, description: '设置亮度', in: [3] }],
  }],
});

assert.equal(normalized.properties?.[0]?.unit, 'minutes');
assert.deepEqual(normalized.properties?.[0]?.list, [
  { value: 2, description: '2 分钟' },
  { value: 5, description: '5 分钟' },
]);
assert.deepEqual(normalized.properties?.[1]?.range, { min: 1, max: 100, step: 1 });
assert.deepEqual(normalized.events?.[0]?.arguments[0]?.list, normalized.properties?.[0]?.list);
const action = normalized.actions?.find((candidate) => candidate.type === 'action');
assert.equal(action?.in?.[0]?.piid, 3);
assert.deepEqual(action?.in?.[0]?.range, { min: 1, max: 100, step: 1 });
assert.throws(() => normalizeMiotSpec({ services: [] }), /不包含 services/);

console.log('设备能力规范化测试通过');
