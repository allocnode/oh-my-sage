// Smoke test for the packed oh-my-sage-mcp: stdio handshake + tool list, then HTTP /healthz + MCP initialize.
// Runs against the installed package in the current directory; never connects to a gateway.
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import path from 'node:path';

const require = createRequire(path.join(process.cwd(), 'x.js'));
const entry = require.resolve('oh-my-sage-mcp/dist/mcp/mcp/index.js');
const fail = (msg) => { console.error('FAIL', msg); process.exit(1); };

// ---------- stdio ----------
const child = spawn(process.execPath, [entry], { env: { ...process.env, GATEWAY_URL: 'http://192.0.2.1' }, stdio: ['pipe', 'pipe', 'pipe'] });
let buf = '';
const pending = new Map();
child.stdout.on('data', (d) => {
  buf += d;
  let i;
  while ((i = buf.indexOf('\n')) >= 0) {
    const line = buf.slice(0, i); buf = buf.slice(i + 1);
    if (!line.trim()) continue;
    const msg = JSON.parse(line);
    pending.get(msg.id)?.(msg);
  }
});
const rpc = (id, method, params) => new Promise((resolve, reject) => {
  pending.set(id, resolve);
  child.stdin.write(JSON.stringify({ jsonrpc: '2.0', id, method, params }) + '\n');
  setTimeout(() => reject(new Error('timeout ' + method)), 15000);
});
const init = await rpc(1, 'initialize', { protocolVersion: '2025-06-18', capabilities: {}, clientInfo: { name: 'smoke', version: '0' } });
child.stdin.write(JSON.stringify({ jsonrpc: '2.0', method: 'notifications/initialized' }) + '\n');
const tools = await rpc(2, 'tools/list', {});
const status = await rpc(3, 'tools/call', { name: 'mijia_status', arguments: {} });
child.kill();
const names = tools.result.tools.map((t) => t.name);
console.log('stdio server', init.result.serverInfo, 'tools', names.length);
if (init.result.serverInfo.version !== process.argv[2]) fail('version mismatch');
if (names.length !== 32) fail('expected 32 tools');
console.log('mijia_status', JSON.stringify(status.result.content?.[0]?.text ?? status.result).slice(0, 120));

// ---------- http ----------
const port = 38790;
const srv = spawn(process.execPath, [entry, '--http'], { env: { ...process.env, MCP_HTTP_PORT: String(port) }, stdio: ['ignore', 'pipe', 'pipe'] });
let ok = false;
for (let i = 0; i < 40 && !ok; i++) {
  await new Promise((r) => setTimeout(r, 250));
  try { const r = await fetch(`http://127.0.0.1:${port}/healthz`); ok = r.ok; if (ok) console.log('healthz', await r.text()); } catch {}
}
if (!ok) { srv.kill(); fail('healthz'); }
const r = await fetch(`http://127.0.0.1:${port}/mcp`, {
  method: 'POST',
  headers: { 'content-type': 'application/json', accept: 'application/json, text/event-stream' },
  body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'initialize', params: { protocolVersion: '2025-06-18', capabilities: {}, clientInfo: { name: 'smoke', version: '0' } } }),
});
const body = await r.text();
srv.kill();
if (!r.ok || !body.includes('oh-my-sage')) fail('http initialize ' + r.status + ' ' + body.slice(0, 200));
console.log('http initialize', r.status, 'session', r.headers.get('mcp-session-id') ? 'yes' : 'no');
console.log('ALL OK');
