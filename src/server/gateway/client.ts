/**
 * oh-my-sage - 网关客户端
 * 封装 gateway_client.js 的功能
 */

import WebSocket from 'ws';
import crypto from 'crypto';
import {deflateRawSync, inflateRawSync} from 'zlib';
import elliptic from 'elliptic';
import BN from 'bn.js';
import {DATA_TYPE} from '../../shared/constants';
import {DeviceListResponse} from '../../shared/types';

const EC = new elliptic.ec('secp256k1');
const EC_N: BN = EC.n!;

// ==================== AES-GCM 加密 ====================

class AESGCMCipher {
    private key: Buffer;
    private nonce: Buffer;
    private encryptCounter: number = 1;
    private decryptCounter: number = 0;

    constructor(key: Buffer, nonce: Buffer) {
        if (key.length !== 16) throw new Error('key must be 16 bytes');
        if (nonce.length !== 8) throw new Error('nonce must be 8 bytes');
        this.key = key;
        this.nonce = nonce;
    }

    private makeIV(counter: number): Buffer {
        const iv = Buffer.alloc(12);
        this.nonce.copy(iv, 0);
        iv.writeUInt32LE(counter, 8);
        return iv;
    }

    encrypt(data: Buffer): Buffer {
        const counter = this.encryptCounter++;
        const iv = this.makeIV(counter);
        const cipher = crypto.createCipheriv('aes-128-gcm', this.key, iv);
        const encrypted = Buffer.concat([cipher.update(data), cipher.final()]);
        const tag = cipher.getAuthTag();

        const result = Buffer.alloc(4 + encrypted.length + tag.length);
        result.writeUInt32LE(counter, 0);
        encrypted.copy(result, 4);
        tag.copy(result, 4 + encrypted.length);
        return result;
    }

    decrypt(data: Buffer): Buffer {
        if (data.length < 20) throw new Error('Data too short');
        const counter = data.readUInt32LE(0);
        if (counter <= this.decryptCounter) throw new Error('Replay attack');
        this.decryptCounter = counter;

        const ciphertext = data.slice(4, data.length - 16);
        const tag = data.slice(data.length - 16);
        const iv = this.makeIV(counter);

        const decipher = crypto.createDecipheriv('aes-128-gcm', this.key, iv);
        decipher.setAuthTag(tag);
        return Buffer.concat([decipher.update(ciphertext), decipher.final()]);
    }
}

// ==================== 压缩/解压 ====================

function compress(data: Buffer): Buffer {
    const compressed = deflateRawSync(data);
    const result = Buffer.alloc(4 + compressed.length);
    result.writeUInt32LE(data.length, 0);
    compressed.copy(result, 4);
    return result;
}

function decompress(data: Buffer): Buffer {
    if (data.length < 4) throw new Error('Data too short');
    return inflateRawSync(data.slice(4));
}

// ==================== ECJPAKE ====================

class ECJPAKE {
    private role: string;
    private peerRole: string;
    private secretBytes: Buffer;
    private x1: BN | null = null;
    private x2: BN | null = null;
    private g_x1: any = null;
    private g_x2: any = null;
    private g_x3: any = null;
    private g_x4: any = null;
    private roundOneSent = false;
    private roundOneReceived = false;
    private roundTwoSent = false;
    private roundTwoReceived = false;

    constructor(secret: string, role: string = 'client') {
        this.role = role;
        this.peerRole = role === 'client' ? 'server' : 'client';
        this.secretBytes = Buffer.from(secret, 'utf8');
    }

    private encodePoint(point: any): Buffer {
        const result = Buffer.alloc(66);
        result[0] = 65;
        result[1] = 4;
        Buffer.from(point.getX().toArray('be', 32)).copy(result, 2);
        Buffer.from(point.getY().toArray('be', 32)).copy(result, 34);
        return result;
    }

    private encodePointForHash(point: any): Buffer {
        const result = Buffer.alloc(69);
        result.writeUInt32BE(65, 0);
        result[4] = 4;
        Buffer.from(point.getX().toArray('be', 32)).copy(result, 5);
        Buffer.from(point.getY().toArray('be', 32)).copy(result, 37);
        return result;
    }

    private decodePoint(data: Buffer): any {
        if (data[0] !== 65 || data[1] !== 4) throw new Error('Invalid point format');
        return EC.keyFromPublic({
            x: data.slice(2, 34).toString('hex'),
            y: data.slice(34, 66).toString('hex')
        }).getPublic();
    }

    private zkpHash(g: any, v: any, publicPoint: any, name: string): BN {
        const nameBytes = Buffer.from(name, 'utf8');
        const data = Buffer.concat([
            this.encodePointForHash(g),
            this.encodePointForHash(v),
            this.encodePointForHash(publicPoint),
            Buffer.alloc(4),
            nameBytes
        ]);
        data.writeUInt32BE(nameBytes.length, 207);
        return new BN(crypto.createHash('sha256').update(data).digest()).umod(EC_N);
    }

    private generateZKP(g: any, publicPoint: any, privateKey: BN, name: string) {
        let k = new BN(crypto.randomBytes(32)).umod(EC_N);
        if (k.isZero()) k.iaddn(1);
        const v = g.mul(k);
        const challenge = this.zkpHash(g, v, publicPoint, name);
        const r = k.sub(challenge.mul(privateKey)).umod(EC_N);
        return {v, r};
    }

    private verifyZKP(g: any, publicPoint: any, v: any, r: BN, name: string): boolean {
        const challenge = this.zkpHash(g, v, publicPoint, name);
        return publicPoint.mul(challenge).add(g.mul(r)).eq(v);
    }

    private encodeZKP(v: any, r: BN): Buffer {
        const result = Buffer.alloc(99);
        this.encodePoint(v).copy(result, 0);
        result[66] = 32;
        Buffer.from(r.toArray('be', 32)).copy(result, 67);
        return result;
    }

    private decodeZKP(data: Buffer) {
        return {
            v: this.decodePoint(data.slice(0, 66)),
            r: new BN(data.slice(67, 99))
        };
    }

    writeRoundOne(): Buffer {
        if (this.roundOneSent) throw new Error('Round one already sent');
        this.roundOneSent = true;

        const g = EC.g;
        this.x1 = new BN(crypto.randomBytes(32)).umod(EC_N);
        this.x2 = new BN(crypto.randomBytes(32)).umod(EC_N);
        this.g_x1 = g.mul(this.x1);
        this.g_x2 = g.mul(this.x2);

        const zkp1 = this.generateZKP(g, this.g_x1, this.x1, this.role);
        const zkp2 = this.generateZKP(g, this.g_x2, this.x2, this.role);

        const result = Buffer.alloc(330);
        this.encodePoint(this.g_x1).copy(result, 0);
        this.encodeZKP(zkp1.v, zkp1.r).copy(result, 66);
        this.encodePoint(this.g_x2).copy(result, 165);
        this.encodeZKP(zkp2.v, zkp2.r).copy(result, 231);
        return result;
    }

    readRoundOne(data: Buffer): void {
        if (this.roundOneReceived) throw new Error('Round one already received');
        this.roundOneReceived = true;

        const g = EC.g;
        this.g_x3 = this.decodePoint(data.slice(0, 66));
        const zkp1 = this.decodeZKP(data.slice(66, 165));
        this.g_x4 = this.decodePoint(data.slice(165, 231));
        const zkp2 = this.decodeZKP(data.slice(231, 330));

        if (!this.verifyZKP(g, this.g_x3, zkp1.v, zkp1.r, this.peerRole))
            throw new Error('ZKP verification failed for g_x3');
        if (!this.verifyZKP(g, this.g_x4, zkp2.v, zkp2.r, this.peerRole))
            throw new Error('ZKP verification failed for g_x4');
    }

    writeRoundTwo(): Buffer {
        if (this.roundTwoSent) throw new Error('Round two already sent');
        if (!this.roundOneSent || !this.roundOneReceived) throw new Error('Round one not completed');
        this.roundTwoSent = true;

        const g_xa = this.g_x1!.add(this.g_x3).add(this.g_x4);
        const random = new BN(crypto.randomBytes(16));
        const y = random.mul(EC_N).add(new BN(this.secretBytes));
        const x2_s = this.x2!.mul(y).umod(EC_N);
        const g_s = g_xa.mul(x2_s);

        const zkp = this.generateZKP(g_xa, g_s, x2_s, this.role);

        const result = Buffer.alloc(165);
        this.encodePoint(g_s).copy(result, 0);
        this.encodeZKP(zkp.v, zkp.r).copy(result, 66);
        return result;
    }

    readRoundTwo(data: Buffer): Buffer {
        if (this.roundTwoReceived) throw new Error('Round two already received');
        if (!this.roundOneSent || !this.roundOneReceived) throw new Error('Round one not completed');
        this.roundTwoReceived = true;

        const offset = this.role === 'client' ? 3 : 0;

        const g_xb = this.g_x1!.add(this.g_x2).add(this.g_x3);
        const g_s_peer = this.decodePoint(data.slice(offset, offset + 66));
        const zkp = this.decodeZKP(data.slice(offset + 66, offset + 165));

        if (!this.verifyZKP(g_xb, g_s_peer, zkp.v, zkp.r, this.peerRole))
            throw new Error('ZKP verification failed for round two');

        const random = new BN(crypto.randomBytes(16));
        const y = random.mul(EC_N).add(new BN(this.secretBytes));
        const m = this.x2!.mul(y).umod(EC_N);
        const v = g_s_peer.add(this.g_x4.mul(m).neg()).mul(this.x2);

        return crypto.createHash('sha256').update(Buffer.from(v.getX().toArray('be', 32))).digest();
    }
}

// ==================== 网关客户端 ====================

export class GatewayClient {
    private ws: WebSocket | null = null;
    private sessionIdCounter = 0;
    private pendingRequests = new Map<number, { resolve: (value: any) => void; reject: (error: Error) => void }>();
    private cipherOut: AESGCMCipher | null = null;
    private cipherIn: AESGCMCipher | null = null;
    private secureEstablished = false;
    private connected = false;

    /** 解析网关URL */
    private static parseUrl(url: string): string {
        const match = url.match(/^(https?):\/\/([^/:]+)(?::(\d+))?((?:\/.*)?)/);
        if (!match) throw new Error('Invalid URL');
        const [, protocol, host, port, path] = match;
        const wsProtocol = protocol === 'https' ? 'wss' : 'ws';
        const wsPort = port || (protocol === 'https' ? '443' : '80');
        const wsPath = (path || '').replace(/\/$/, '');
        return `${wsProtocol}://${host}:${wsPort}${wsPath}/centrallinkws/`;
    }

    /** 连接网关 */
    async connect(gatewayUrl: string): Promise<void> {
        const url = GatewayClient.parseUrl(gatewayUrl);

        return new Promise((resolve, reject) => {
            this.ws = new WebSocket(url);

            this.ws.on('open', () => {
                const protocols = ['passcode'];
                const data = Buffer.from(JSON.stringify(protocols), 'utf8');
                const message = Buffer.alloc(1 + data.length);
                message[0] = DATA_TYPE.PROTOCOL_LIST;
                data.copy(message, 1);
                this.ws!.send(message);
                this.connected = true;
                resolve();
            });

            this.ws.on('error', reject);
        });
    }

    /** 接收消息 */
    private recv(): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            this.ws!.once('message', resolve);
            this.ws!.once('error', reject);
        });
    }

    /** 带超时的接收 */
    private recvTimeout(ms: number): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            const timer = setTimeout(() => {
                this.ws!.removeListener('message', onMessage);
                reject(new Error('timeout'));
            }, ms);

            const onMessage = (data: Buffer) => {
                clearTimeout(timer);
                resolve(data);
            };

            this.ws!.once('message', onMessage);
            this.ws!.once('error', (err) => {
                clearTimeout(timer);
                reject(err);
            });
        });
    }

    /** 认证 */
    async authenticate(passcode: string): Promise<void> {
        const jpake = new ECJPAKE(passcode, 'client');

        // 等待服务器选择协议
        let response = await this.recv();
        if (response[0] !== DATA_TYPE.SELECTED_PROTOCOL) {
            throw new Error('Protocol selection failed');
        }
        console.log('[*] Protocol selected');

        // 发送 Round One
        const roundOne = jpake.writeRoundOne();
        await this.ws!.send(Buffer.concat([Buffer.from([DATA_TYPE.ECJPAKE_ROUND_ONE]), roundOne]));
        console.log('[*] Sent Round One');

        // 接收服务器 Round One
        response = await this.recv();
        if (response[0] !== DATA_TYPE.ECJPAKE_ROUND_ONE) {
            throw new Error(`Unexpected response type: ${response[0]}`);
        }
        jpake.readRoundOne(response.slice(1));
        console.log('[*] Received server Round One');

        // 发送客户端 Round Two（关键：在收到服务器Round One后立即发送！）
        const roundTwo = jpake.writeRoundTwo();
        await this.ws!.send(Buffer.concat([Buffer.from([DATA_TYPE.ECJPAKE_ROUND_TWO]), roundTwo]));
        console.log('[*] Sent Round Two');

        // 接收服务器 Round Two
        response = await this.recv();
        if (response[0] !== DATA_TYPE.ECJPAKE_ROUND_TWO) {
            throw new Error(`Unexpected response type: ${response[0]}`);
        }
        const serverRoundTwo = response.slice(1);
        console.log('[*] Received server Round Two');

        // 计算共享密钥
        const sharedKey = jpake.readRoundTwo(serverRoundTwo);
        console.log(`[*] Shared key: ${sharedKey.toString('hex').substring(0, 16)}...`);

        // SESSION_KEY_EXCHANGE
        const sharedCipher = new AESGCMCipher(sharedKey.slice(0, 16), sharedKey.slice(16, 24));
        const myKeyNonce = crypto.randomBytes(24);

        try {
            response = await this.recvTimeout(3000);
            if (response[0] === DATA_TYPE.SESSION_KEY_EXCHANGE) {
                console.log('[*] Received server SESSION_KEY_EXCHANGE first');
                const serverKeyNonce = sharedCipher.decrypt(response.slice(1));
                const encrypted = sharedCipher.encrypt(myKeyNonce);
                await this.ws!.send(Buffer.concat([Buffer.from([DATA_TYPE.SESSION_KEY_EXCHANGE]), encrypted]));
                console.log('[*] Sent client SESSION_KEY_EXCHANGE');
                this.cipherOut = new AESGCMCipher(myKeyNonce.slice(0, 16), myKeyNonce.slice(16, 24));
                this.cipherIn = new AESGCMCipher(serverKeyNonce.slice(0, 16), serverKeyNonce.slice(16, 24));
                this.secureEstablished = true;
            }
        } catch {
            // 超时，客户端先发送
            console.log('[*] Server did not send first, trying client first...');
            const encrypted = sharedCipher.encrypt(myKeyNonce);
            await this.ws!.send(Buffer.concat([Buffer.from([DATA_TYPE.SESSION_KEY_EXCHANGE]), encrypted]));
            console.log('[*] Sent client SESSION_KEY_EXCHANGE');
            response = await this.recv();
            if (response[0] === DATA_TYPE.SESSION_KEY_EXCHANGE) {
                console.log('[*] Received server SESSION_KEY_EXCHANGE');
                const serverKeyNonce = sharedCipher.decrypt(response.slice(1));
                this.cipherOut = new AESGCMCipher(myKeyNonce.slice(0, 16), myKeyNonce.slice(16, 24));
                this.cipherIn = new AESGCMCipher(serverKeyNonce.slice(0, 16), serverKeyNonce.slice(16, 24));
                this.secureEstablished = true;
            }
        }

        if (!this.secureEstablished) {
            throw new Error('Session key exchange failed');
        }

        console.log('[*] Secure session established!');

        // 启动接收循环
        this.startReceiveLoop();
    }

    /** 启动接收循环 */
    private startReceiveLoop(): void {
        if (!this.ws) return;

        this.ws.on('message', (data: Buffer) => {
            this.handleMessage(data);
        });
    }

    /** 处理消息 */
    private handleMessage(data: Buffer): void {
        if (!data || data.length === 0) return;
        if (data[0] !== DATA_TYPE.DATA || !this.secureEstablished) return;

        try {
            const decrypted = this.cipherIn!.decrypt(data.slice(1));
            const decompressed = decompress(decrypted);
            const response = JSON.parse(decompressed.toString('utf8'));

            if ('id' in response) {
                const future = this.pendingRequests.get(response.id);
                if (future) {
                    this.pendingRequests.delete(response.id);
                    if ('result' in response) {
                        future.resolve(response.result);
                    } else if ('error' in response) {
                        future.reject(new Error(response.error?.message || 'Unknown error'));
                    }
                }
            }
        } catch (e) {
            console.error('[!] Error handling message:', e);
        }
    }

    /** 调用 API */
    async callApi<T = any>(method: string, params: Record<string, any> = {}, timeout: number = 5000): Promise<T> {
        if (!this.secureEstablished) {
            throw new Error('Secure session not established');
        }

        const requestId = this.sessionIdCounter++;
        const request = {
            jsonrpc: '2.0',
            id: requestId,
            method: `/api/${method}`,
            params
        };

        return new Promise<T>((resolve, reject) => {
            this.pendingRequests.set(requestId, {
                resolve: resolve as (value: any) => void,
                reject
            });

            const jsonData = Buffer.from(JSON.stringify(request), 'utf8');
            const compressed = compress(jsonData);
            const encrypted = this.cipherOut!.encrypt(compressed);
            const message = Buffer.alloc(1 + encrypted.length);
            message[0] = DATA_TYPE.DATA;
            encrypted.copy(message, 1);
            this.ws!.send(message);

            setTimeout(() => {
                if (this.pendingRequests.has(requestId)) {
                    this.pendingRequests.delete(requestId);
                    reject(new Error(`API call timeout: ${method}`));
                }
            }, timeout);
        });
    }

    /** 获取设备列表 */
    async getDeviceList(): Promise<DeviceListResponse> {
        return this.callApi<DeviceListResponse>('getDevList', {}, 10000);
    }

    /** 关闭连接 */
    async close(): Promise<void> {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
    }

    /** 是否已连接 */
    isConnected(): boolean {
        return this.connected && this.secureEstablished;
    }
}
