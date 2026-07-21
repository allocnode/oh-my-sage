import assert from 'node:assert/strict';
import type { Graph } from '../types/graph';
import { validateGraph } from './base';

const graph: Graph = {
    id: 'test',
    nodes: [{
        id: 'queryvar',
        type: 'deviceGetSetVar',
        cfg: { name: 'deviceGetSetVar', version: 1 },
        props: { did: 'device', siid: 2, piid: 1, dtype: 'number', id: 'value1', scope: 'global' },
        inputs: { input: null },
        outputs: { output: [] },
    }],
    cfg: {
        id: 'test',
        enable: true,
        uiType: 'graph',
        userData: {
            name: 'test',
            lastUpdateTime: 0,
            transform: { x: 0, y: 0, scale: 1, rotate: 0 },
        },
    },
};

assert.deepEqual(validateGraph(graph), []);
console.log('graph structure tests passed');
