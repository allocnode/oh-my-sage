#!/usr/bin/env node
/**
 * 组装发布到 npm 的 oh-my-sage-mcp 包。
 *
 * 根 package.json 是网页版（Next.js / antd 等），不能直接发布。本脚本在 dist/npm/
 * 下生成一个只含 MCP Server 的独立包：
 *   - package.json：名称 oh-my-sage-mcp，版本取根 package.json，依赖只含编译产物实际引用的包
 *   - dist/mcp/：MCP 编译产物（不含 source map，源码不随包发布）
 *   - deploy/：本机常驻安装脚本
 *   - README.md：根 README，图片改为 GitHub 绝对地址（npm 页面无法解析相对路径）
 *   - LICENSE
 *
 * 用法：npm run build:mcp && node scripts/build-npm-package.mjs
 * 发布：npm publish ./dist/npm --access public（必须带 ./，否则 npm 会把 dist/npm 当成 GitHub 仓库）
 */

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const root = process.cwd();
const out = path.join(root, 'dist', 'npm');
const mcpDist = path.join(root, 'dist', 'mcp');
const rootPkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));

if (!fs.existsSync(path.join(mcpDist, 'mcp', 'index.js'))) {
    console.error('未找到 dist/mcp/mcp/index.js，请先执行 npm run build:mcp');
    process.exit(1);
}

fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });

// ==================== 依赖：复用 Docker 镜像的最小依赖扫描 ====================

const runtimePkgPath = path.join(out, '.runtime-package.json');
execFileSync(process.execPath, ['deploy/mcp-runtime-package.mjs', 'package.json', 'dist/mcp', runtimePkgPath], { stdio: 'inherit' });
const { dependencies } = JSON.parse(fs.readFileSync(runtimePkgPath, 'utf8'));
fs.rmSync(runtimePkgPath);

// ==================== 编译产物 ====================

fs.cpSync(mcpDist, path.join(out, 'dist', 'mcp'), {
    recursive: true,
    filter: (source) => !source.endsWith('.map'),
});

// ==================== 本机常驻安装脚本 ====================
// 脚本按自身位置找 ../dist/mcp/mcp/index.js，随包发布后全局安装即可直接使用，无需克隆仓库

fs.mkdirSync(path.join(out, 'deploy'), { recursive: true });
for (const name of ['install-local.ps1', 'install-local.sh']) {
    fs.copyFileSync(path.join(root, 'deploy', name), path.join(out, 'deploy', name));
}

// ==================== package.json ====================

const repoUrl = 'https://github.com/allocnode/oh-my-sage';
const pkg = {
    name: 'oh-my-sage-mcp',
    version: rootPkg.version,
    description: '米家自动化极客版 MCP Server：在任意 AI Agent 里用说话的方式创建和修改米家中枢网关的自动化规则',
    keywords: ['mcp', 'mcp-server', 'model-context-protocol', 'mijia', 'xiaomi', 'smart-home', '米家', '极客版', '中枢网关'],
    homepage: `${repoUrl}#readme`,
    bugs: { url: `${repoUrl}/issues` },
    repository: { type: 'git', url: `git+${repoUrl}.git` },
    license: 'MIT',
    bin: { 'oh-my-sage-mcp': 'dist/mcp/mcp/index.js' },
    main: 'dist/mcp/mcp/index.js',
    types: 'dist/mcp/mcp/index.d.ts',
    files: ['dist', 'deploy'],
    engines: { node: '>=20' },
    dependencies,
};
fs.writeFileSync(path.join(out, 'package.json'), `${JSON.stringify(pkg, null, 2)}\n`);

// ==================== README 与 LICENSE ====================

const rawBase = 'https://raw.githubusercontent.com/allocnode/oh-my-sage/main/';
const readme = fs.readFileSync(path.join(root, 'README.md'), 'utf8')
    .replace(/(\]\(|src=")(docs\/images\/)/g, `$1${rawBase}$2`)
    .replace(/\]\((?!https?:|#|mailto:)([^)]+)\)/g, `](${repoUrl}/blob/main/$1)`);
fs.writeFileSync(path.join(out, 'README.md'), readme);
fs.copyFileSync(path.join(root, 'LICENSE'), path.join(out, 'LICENSE'));

console.log(`已生成 ${path.relative(root, out)}：${pkg.name}@${pkg.version}，依赖 ${Object.keys(dependencies).join(', ')}`);
