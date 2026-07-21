import assert from 'node:assert/strict';
import { CreateVariableInputSchema } from './variable';

assert.equal(CreateVariableInputSchema.safeParse({ id: 'valid123', type: 'number', value: 0 }).success, true);
assert.equal(CreateVariableInputSchema.safeParse({ id: 'valid123', type: 'string', value: 'ready' }).success, true);
assert.equal(CreateVariableInputSchema.safeParse({ id: 'invalid_id', type: 'number', value: 0 }).success, false);
assert.equal(CreateVariableInputSchema.safeParse({ id: 'valid123', type: 'number', value: '0' }).success, false);

console.log('variable MCP schema tests passed');
