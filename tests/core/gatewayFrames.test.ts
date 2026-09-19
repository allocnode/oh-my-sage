import assert from 'node:assert/strict';
import test from 'node:test';
import { GatewayClient } from '../../src/core/gateway/client';

// Exercise the in-memory handshake queue without a gateway or listening socket.
function handshake(client: GatewayClient) {
    return client as unknown as {
        recv(timeout?: number): Promise<Buffer>;
        handshakeFrames: Buffer[];
        handshakeWaiters: unknown[];
        handshakeError: Error | null;
        connected: boolean;
        secureEstablished: boolean;
    };
}

test('authentication consumes early frames in arrival order', async () => {
    const client = new GatewayClient();
    const state = handshake(client);
    state.handshakeFrames.push(Buffer.from([1]), Buffer.from([2]));
    assert.deepEqual(await state.recv(), Buffer.from([1]));
    assert.deepEqual(await state.recv(), Buffer.from([2]));
    assert.equal(state.handshakeWaiters.length, 0);
    await client.close();
});

test('authentication timeout removes its waiter without consuming a later frame', async () => {
    const client = new GatewayClient();
    const state = handshake(client);
    await assert.rejects(state.recv(1), /authentication timed out/);
    assert.equal(state.handshakeWaiters.length, 0);
    state.handshakeFrames.push(Buffer.from([3]));
    assert.deepEqual(await state.recv(), Buffer.from([3]));
    await client.close();
});

test('close rejects authentication waiters and clears secure connection state', async () => {
    const client = new GatewayClient();
    const state = handshake(client);
    state.connected = true;
    state.secureEstablished = true;
    const pending = assert.rejects(state.recv(), /connection closed/);
    await client.close();
    await pending;
    assert.equal(client.isConnected(), false);
    assert.equal(state.handshakeWaiters.length, 0);
    assert.equal(state.handshakeFrames.length, 0);
    await assert.rejects(state.recv(), /connection closed/);
});

test('connection errors take priority over buffered authentication frames', async () => {
    const client = new GatewayClient();
    const state = handshake(client);
    state.handshakeFrames.push(Buffer.from([1]));
    state.handshakeError = new Error('Disconnected');
    await assert.rejects(state.recv(), /Disconnected/);
    await client.close();
});
