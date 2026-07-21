import assert from 'node:assert/strict';
import { formatDeviceDetailsMarkdown } from './utils.js';

const output = formatDeviceDetailsMarkdown([{
  did: 'sensor-1',
  name: 'Motion Sensor',
  properties: [{
    siid: 2, piid: 2, desc: 'Motion Sensor-No Motion Duration', dtype: 'uint16',
    access: ['read', 'notify'], unit: 'minutes', list: [{ value: 2, description: '2 Minutes' }],
  }],
  events: [{ siid: 2, eiid: 1, desc: 'Motion Sensor-Motion Detected', arguments: [] }],
  actions: [{
    siid: 2, aiid: 1, desc: 'Light-Set Brightness', type: 'action',
    in: [{ siid: 2, piid: 3, desc: 'Light-Brightness', dtype: 'uint8', access: ['write'], range: { min: 1, max: 100, step: 1 } }],
  }],
}]);

assert.match(output, /unit=minutes/);
assert.match(output, /values=\[{"value":2,"description":"2 Minutes"}\]/);
assert.match(output, /range=\{"min":1,"max":100,"step":1\}/);
assert.match(output, /参数 piid=3: Light-Brightness/);
console.log('device Markdown formatting tests passed');
