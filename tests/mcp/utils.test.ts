import assert from 'node:assert/strict';
import test from 'node:test';
import { formatDeviceDetailsMarkdown } from '../../src/mcp/utils';

test('Markdown 展示事件 ID 和参数取值', () => {
    const markdown = formatDeviceDetailsMarkdown([{
        name: '测试双键',
        did: 'dev1',
        triggers: [{
            desc: 'remote-control-click',
            type: 'event',
            siid: 3,
            eiid: 1012,
            arguments: [{
                piid: 1,
                desc: 'button-id',
                dtype: 'uint8',
                list: [{ value: 1, description: 'left' }],
            }],
        }],
    }]);

    assert.match(markdown, /siid=3, eiid=1012/);
    assert.match(markdown, /参数 piid=1: button-id, uint8/);
    assert.match(markdown, /left/);
});
