#!/usr/bin/env node
/**
 * 生成 MCP 运行时专用的最小 package.json。
 *
 * 根 package.json 同时包含 Web 端依赖（next / antd / react 等，安装后约 380 MB），
 * 而 MCP 服务只需要其中几个包。本脚本扫描编译产物 dist/mcp 中实际 require 的第三方包，
 * 从根 package.json 取对应版本范围，输出只含这些依赖的 package.json。
 * 配合根 package-lock.json 执行 `npm install --omit=dev`，版本仍以锁文件为准。
 *
 * 用法：node deploy/mcp-runtime-package.mjs <根package.json> <dist目录> <输出package.json>
 */

import fs from 'node:fs';
import path from 'node:path';
import { builtinModules } from 'node:module';

const [rootPkgPath = 'package.json', distDir = 'dist/mcp', outPath = 'runtime/package.json'] = process.argv.slice(2);

const rootPkg = JSON.parse(fs.readFileSync(rootPkgPath, 'utf8'));
const builtins = new Set(builtinModules);

// ==================== 扫描编译产物 ====================

function listJs(dir) {
    return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) return listJs(full);
        return entry.name.endsWith('.js') && !entry.name.endsWith('.test.js') ? [full] : [];
    });
}

function packageName(specifier) {
    const parts = specifier.split('/');
    return specifier.startsWith('@') ? parts.slice(0, 2).join('/') : parts[0];
}

const used = new Set();
for (const file of listJs(distDir)) {
    const source = fs.readFileSync(file, 'utf8');
    for (const match of source.matchAll(/require\(["']([^"']+)["']\)/g)) {
        const spec = match[1];
        if (spec.startsWith('.') || spec.startsWith('node:') || builtins.has(packageName(spec))) continue;
        used.add(packageName(spec));
    }
}

// ==================== 生成 package.json ====================

const dependencies = {};
const missing = [];
for (const name of [...used].sort()) {
    const version = rootPkg.dependencies?.[name];
    if (version) dependencies[name] = version;
    else missing.push(name);
}
if (missing.length > 0) {
    console.error(`dist 中引用了未在根 package.json dependencies 声明的包: ${missing.join(', ')}`);
    process.exit(1);
}

const runtimePkg = {
    name: `${rootPkg.name}-mcp-runtime`,
    version: rootPkg.version,
    private: true,
    dependencies,
};

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, `${JSON.stringify(runtimePkg, null, 2)}\n`);
console.log(`MCP 运行时依赖: ${Object.keys(dependencies).join(', ')}`);
