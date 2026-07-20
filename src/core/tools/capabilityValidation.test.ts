import assert from 'node:assert/strict';
import { validateGraphCapabilities } from './capabilityValidation.js';

const device = {
  urn: 'urn:test:motion',
  properties: [{ siid: 2, piid: 2, desc: 'No Motion Duration', dtype: 'uint16', access: ['read', 'notify'], unit: 'minutes', list: [{ value: 2, description: '2 Minutes' }, { value: 5, description: '5 Minutes' }] }],
  events: [],
  actions: [],
};
const base = { id: 'n1', type: 'deviceGet', cfg: { urn: 'urn:test:motion' }, inputs: { input: null }, outputs: { output: [], output2: [] } };
const invalid = validateGraphCapabilities([{ ...base, props: { did: 'sensor', siid: 2, piid: 2, dtype: 'int', operator: '>=', v1: 50 } }], new Map([['sensor', device]]));
assert.equal(invalid.valid, false);
assert.match(invalid.errors[0].message, /枚举字段/);
const valid = validateGraphCapabilities([{ ...base, props: { did: 'sensor', siid: 2, piid: 2, dtype: 'int', operator: 'include', v1: [2] } }], new Map([['sensor', device]]));
assert.equal(valid.valid, true);
const speaker = {
  urn: 'urn:test:speaker',
  properties: [],
  events: [],
  actions: [{ siid: 7, aiid: 3, desc: 'Play Text', in: [{ siid: 7, piid: 1, desc: 'Text Content', dtype: 'string', access: [] }] }],
};
const playText = { id: 'tts', type: 'deviceOutput', cfg: { urn: 'urn:test:speaker' }, props: { did: 'speaker', siid: 7, aiid: 3, ins: [{ piid: 1, value: 'Close the fridge door.' }] }, inputs: { trigger: null }, outputs: { output: [] } };
assert.equal(validateGraphCapabilities([playText], new Map([['speaker', speaker]])).valid, true);
assert.equal(validateGraphCapabilities([{ ...playText, props: { ...playText.props, aiid: 99 } }], new Map([['speaker', speaker]])).valid, false);
assert.equal(validateGraphCapabilities([{ ...playText, props: { ...playText.props, ins: [{ piid: 1, value: 123 }] } }], new Map([['speaker', speaker]])).valid, false);

// Action input with enum/range params: single scalar values are valid (must NOT require operator=include)
const lamp = {
  urn: 'urn:test:lamp',
  properties: [],
  events: [],
  actions: [{ siid: 3, aiid: 15, desc: 'Apply Scene', in: [{ siid: 3, piid: 9, desc: 'Scene', dtype: 'uint8', access: [], list: [{ value: 5, description: 'Reading' }, { value: 6, description: 'Working' }] }] }, { siid: 3, aiid: 2, desc: 'Delay Off', in: [{ siid: 3, piid: 2, desc: 'Minutes', dtype: 'uint8', access: [], range: { min: 1, max: 60, step: 1 } }] }],
};
const lampMap = new Map([['lamp', lamp]]);
const scene = { id: 's', type: 'deviceOutput', cfg: { urn: 'urn:test:lamp' }, props: { did: 'lamp', siid: 3, aiid: 15, ins: [{ piid: 9, value: 5 }] }, inputs: { trigger: null }, outputs: { output: [] } };
assert.equal(validateGraphCapabilities([scene], lampMap).valid, true);
assert.equal(validateGraphCapabilities([{ ...scene, props: { ...scene.props, ins: [{ piid: 9, value: 99 }] } }], lampMap).valid, false);
const delay = { id: 'd', type: 'deviceOutput', cfg: { urn: 'urn:test:lamp' }, props: { did: 'lamp', siid: 3, aiid: 2, ins: [{ piid: 2, value: 10 }] }, inputs: { trigger: null }, outputs: { output: [] } };
assert.equal(validateGraphCapabilities([delay], lampMap).valid, true);
assert.equal(validateGraphCapabilities([{ ...delay, props: { ...delay.props, ins: [{ piid: 2, value: 999 }] } }], lampMap).valid, false);
console.log('capability validation tests passed');
