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

test('Markdown 对不存在的设备ID给出明确提示，不伪装成离线设备', () => {
    const markdown = formatDeviceDetailsMarkdown([{
        name: '',
        did: 'missingDev',
        found: false,
        model: '',
        modelName: '',
        online: false,
        roomName: '',
    }]);

    assert.match(markdown, /不存在该设备ID/);
    assert.match(markdown, /这不是「设备离线」/);
    assert.doesNotMatch(markdown, /\[离线\]/, '不得渲染成普通离线设备');
    assert.doesNotMatch(markdown, /型号: 未知/, '不得渲染出会被误读为真实设备的占位型号');
});
