import assert from 'node:assert/strict';
import test from 'node:test';
import { CreateVariableInputSchema } from '../../src/mcp/tools/variable';

test('创建变量 Schema 校验 ID、类型和值', () => {
    assert.equal(CreateVariableInputSchema.safeParse({ id: 'valid123', type: 'number', value: 0 }).success, true);
    assert.equal(CreateVariableInputSchema.safeParse({ id: 'valid123', type: 'string', value: 'ready' }).success, true);
    assert.equal(CreateVariableInputSchema.safeParse({ id: 'invalid_id', type: 'number', value: 0 }).success, false);
    assert.equal(CreateVariableInputSchema.safeParse({ id: 'valid123', type: 'number', value: '0' }).success, false);
    assert.equal(CreateVariableInputSchema.safeParse({ id: 'valid123', type: 'number', value: 0, name: '   ' }).success, false);
});
