import assert from 'node:assert/strict';
import { validateGraphCapabilities } from './capabilityValidation.js';

const device = {
  urn: 'urn:test:motion',
  properties: [{ siid: 2, piid: 2, desc: 'No Motion Duration', dtype: 'uint16', access: ['read', 'notify'], unit: 'minutes', list: [{ value: 2, description: '2 Minutes' }, { value: 5, description: '5 Minutes' }] }],
  events: [],
};
const base = { id: 'n1', type: 'deviceGet', cfg: { urn: 'urn:test:motion' }, inputs: { input: null }, outputs: { output: [], output2: [] } };
const invalid = validateGraphCapabilities([{ ...base, props: { did: 'sensor', siid: 2, piid: 2, dtype: 'int', operator: '>=', v1: 50 } }], new Map([['sensor', device]]));
assert.equal(invalid.valid, false);
assert.match(invalid.errors[0].message, /枚举字段/);
const valid = validateGraphCapabilities([{ ...base, props: { did: 'sensor', siid: 2, piid: 2, dtype: 'int', operator: 'include', v1: [2] } }], new Map([['sensor', device]]));
assert.equal(valid.valid, true);
console.log('capability validation tests passed');
