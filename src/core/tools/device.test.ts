import assert from 'node:assert/strict';
import { normalizeMiotSpec } from './device.js';

const normalized = normalizeMiotSpec({
  services: [{
    iid: 2,
    description: 'Motion Sensor',
    properties: [{
      iid: 2,
      description: 'No Motion Duration',
      format: 'uint16',
      unit: 'minutes',
      access: ['read', 'notify'],
      'value-list': [
        { value: 2, description: '2 Minutes' },
        { value: 5, description: '5 Minutes' },
      ],
    }, {
      iid: 3,
      description: 'Brightness',
      format: 'uint8',
      access: ['read', 'write', 'notify'],
      'value-range': [1, 100, 1],
    }],
    events: [{ iid: 1, description: 'Motion Detected', arguments: [2] }],
    actions: [{ iid: 1, description: 'Set Brightness', in: [3] }],
  }],
});

assert.equal(normalized.properties?.[0]?.unit, 'minutes');
assert.deepEqual(normalized.properties?.[0]?.list, [
  { value: 2, description: '2 Minutes' },
  { value: 5, description: '5 Minutes' },
]);
assert.deepEqual(normalized.properties?.[1]?.range, { min: 1, max: 100, step: 1 });
assert.deepEqual(normalized.events?.[0]?.arguments[0]?.list, normalized.properties?.[0]?.list);
const action = normalized.actions?.find((candidate) => candidate.type === 'action');
assert.equal(action?.in?.[0]?.piid, 3);
assert.deepEqual(action?.in?.[0]?.range, { min: 1, max: 100, step: 1 });
assert.throws(() => normalizeMiotSpec({ services: [] }), /does not contain services/);

console.log('device capability normalization tests passed');
