---
feature: truenas-deploy
status: delivered
updated: 2026-11-20
source: https://github.com/KevinZjYang/oh-my-sage/tree/truenas-web-docker
---

# TrueNAS Docker 部署（MCP + 网页版）

## Report

**What was built** — 为 oh-my-sage 在 TrueNAS SCALE 上部署 MCP 常驻服务与网页版：新增 `deploy/Dockerfile.web`（Next.js 多阶段镜像，运行时只带编译产物与依赖、预建 `.sessionstore`、HEALTHCHECK），扩展 `deploy/docker-compose.yml` 增加 `oh-my-sage-web` 服务（运行时注入 LLM/网关环境变量、命名卷持久化会话），更新 `deploy/.env.example`。实际部署在 NAS 的 `/home/truenas_admin/oh-my-sage/repo`，`docker compose up -d --build` 后双容器运行：MCP `:3790`、网页版 `:3000`。

**Verification** —
- NAS 与局域网双侧 curl：MCP `/healthz` → `{"ok":true}`；网页版 → HTTP 200
- MCP 认证：无 token 请求 `/mcp` → 401；带 token `initialize` 握手 → `serverInfo oh-my-sage 0.1.4`
- 独立 review（general 子代理）：spec 全部合规，无 critical/major 问题，可 finalize

## [S1] Problem

用户要在自己的 TrueNAS SCALE（24.10+）上部署 oh-my-sage 两个部分：

1. **MCP 常驻服务**（Streamable HTTP，端口 3790）：局域网内所有 AI Agent（Claude Code、Cursor 等）共用一次网关登录。
2. **网页版**（端口 3000）：浏览器直接聊天，用 DeepSeek 大模型 API。

官方仓库只提供了 MCP 容器的 `Dockerfile` 和 `deploy/docker-compose.yml`；网页版没有 Docker 镜像，需要新增 `Dockerfile.web` 并扩展 compose。

环境事实（用户提供）：

- 米家中枢网关：`192.168.31.2`（极客版已开启）
- TrueNAS：`192.168.31.5`，SSH 端口 22，用户 `truenas_admin`，密码登录
- LLM：DeepSeek，`https://api.deepseek.com/v1`，模型 `deepseek-flash`
- 部署方式：SSH 直接在 NAS 上 `docker compose up -d --build`
- 本机（Windows）无 Docker，镜像在 NAS 上构建

## [S2] Design

### S2.1 新增 `deploy/Dockerfile.web`

多阶段构建 Next.js 网页版：

- build 阶段：`node:22-alpine`，`npm ci --ignore-scripts --no-audit --no-fund`，`npm run build`
- runtime 阶段：`node:22-alpine`，复制 `package.json`、`node_modules`、`.next`、`next.config.js`；预建 `/app/.sessionstore` 并 `chown node:node`（会话存储写 `process.cwd()/.sessionstore`，见 `src/server/session/store.ts`）；`USER node`；`EXPOSE 3000`；`CMD ["npm","start"]`
- 不需要复制 `src/`（已编译进 `.next`）和 `public/`（仓库没有该目录）
- 环境变量 `LLM_BASE_URL` / `LLM_MODEL` / `LLM_API_KEY` / `GATEWAY_URL` 由 compose `environment:` 在**运行时**注入——服务端代码是运行时读 `process.env`（`src/server/ai/model.ts`），不写进镜像层，避免密钥进镜像历史
- 会话存储挂命名卷 `/app/.sessionstore`，容器重启不丢对话

### S2.2 扩展 `deploy/docker-compose.yml`

保留官方 `oh-my-sage-mcp` 服务不动，新增 `oh-my-sage-web`：

- build context 为仓库根，`dockerfile: deploy/Dockerfile.web`
- 端口 `${WEB_PORT:-3000}:3000`
- `environment:` 注入四个 LLM/网关变量，缺失时用 `${VAR:?...}` 让 compose 报错拒绝启动
- `restart: unless-stopped`，`watchtower.enable=false` 标签（本地构建镜像）

### S2.3 NAS 上的 `deploy/.env`（不入库）

`.gitignore` 已忽略 `.env`。内容（真实值只存在于 NAS 文件系统）：

```
GATEWAY_URL=http://192.168.31.2
MCP_AUTH_TOKEN=<openssl rand -hex 32 生成>
MCP_ALLOWED_HOSTS=192.168.31.5
MCP_PORT=3790
LLM_BASE_URL=https://api.deepseek.com/v1
LLM_MODEL=deepseek-flash
LLM_API_KEY=<用户提供>
WEB_PORT=3000
```

### S2.4 更新 `deploy/.env.example`

新增网页版变量，保持占位符风格（遵循仓库 AGENTS.md：不在用户复制的配置里写具体 IP / 密钥 / token）。

### S2.5 NAS 部署路径与步骤

仓库放 `/mnt/<pool>/apps/oh-my-sage`（SSH 登录后先 `zfs list` 看池名，无法建目录则退回 `/root/oh-my-sage`）。步骤：

1. 确认 `docker` 与 compose 插件可用（TrueNAS Apps 服务需已启用；未启用则提示用户在 UI 开启）
2. `git clone https://github.com/allocnode/oh-my-sage.git`
3. 写入 `deploy/.env`（含生成的 token）
4. 写入 `deploy/Dockerfile.web`、覆盖 `deploy/docker-compose.yml`（从本地 worktree 用 scp 传输，或 apply git 分支）
5. `docker compose up -d --build`
6. `curl http://127.0.0.1:3790/healthz` 与 `curl -I http://127.0.0.1:3000` 验证

### S2.6 客户端接入

- MCP：`http://192.168.31.5:3790/mcp`，请求头 `Authorization: Bearer <MCP_AUTH_TOKEN>`；客户端配置见仓库 `deploy/README.md`
- 网页版：浏览器打开 `http://192.168.31.5:3000`，首次输入一次性登录码
- MCP 容器与网页版容器各自连接网关一次，需要各自的登录码（登录码一次性）

## [S3] Out of Scope

- 不改仓库功能代码（仅 `deploy/` 下新增/修改部署文件）
- 不推送分支、不开 PR（除非用户要求）
- 不把网页版暴露公网（官方明令网页版无账号系统）
- 不用 TrueNAS Apps UI 安装成托管应用；SSH 的 `docker compose` 部署即可运行，容器不进入 Apps 管理列表

## Tasks

- [x] T1: 新增 `deploy/Dockerfile.web` — acceptance: NAS 上 `docker build` 成功（随 compose 一起验证）
- [x] T2: 扩展 `deploy/docker-compose.yml` — acceptance: NAS 上 `docker compose config` 通过，双服务定义正确
- [x] T3: 写 NAS `deploy/.env`（真实值 + 生成的 token） — acceptance: 双容器启动后 `healthz` 返回 `{"ok":true}`、网页版 HTTP 200
- [x] T4: SSH 部署（clone、传文件、`docker compose up -d --build`） — acceptance: 两容器 `running`
- [x] T5: 验证 — acceptance: 3790 `healthz` ok；3000 返回 200；MCP_HOSTS/认证参数与客户端配置一致
- [x] T6: 独立 review + finalize spec — acceptance: review 通过，spec `status: delivered`

## Journey log

- 部署中发现 TrueNAS 的 `docker` 组（gid 999）是 middleware 数据库里的 builtin 组，`user.update` 拒绝修改其成员（`EINVAL: membership of this builtin group may not be altered`），所以 `truenas_admin` 无法获得 docker CLI 权限（UI 里也看不到该选项）；sudo 需要密码、本环境无法交互输密码。最终方案：SSH（密钥认证）只负责准备（克隆、写 .env/部署文件、验证），`docker compose up -d --build` 由用户在 TrueNAS WebUI 自带 Shell（root 身份）执行一条 `bash .../run.sh`。
- 仓库实际部署路径定为 `/home/truenas_admin/oh-my-sage/repo`（S2.5 计划是 `/mnt/<pool>/apps/...`，因非 root 无法在数据池建目录/改 ACL 而简化）。
- MCP 会话语义验证：Streamable HTTP 下 initialize 之后需要 `Mcp-Session-Id`，用 curl 直接测 tools/list 会报 400 —— 属规范行为，真实 MCP 客户端会自动处理。
- 网关地址排障：用户初始提供 `192.168.31.2`，但该 IP 的 80 端口是「小米路由器」管理页，`/centrallinkws/` 全部 404，网页登录报 `Unexpected server response: 404`。扫描整个 192.168.31.0/24（80/54321/9527/5666/30001/51234/8888/18080 + WS 路径探测）无设备应答，后经用户从米家 App 核对：设备是 **小米路由器 BE3600 Pro（带中枢网关功能）**，极客版自动化服务在 **`http://192.168.31.2:8086`**，`ws://192.168.31.2:8086/centrallinkws/` 握手返回 101 确认。`.env` 的 `GATEWAY_URL` 已改为 `http://192.168.31.2:8086` 并重建容器。
- 移动端响应式 + PWA 特性（`mobile-responsive`，见同目录 `docs/compose/spec/mobile-responsive.md`）合并进本部署分支；`run.sh` 从 NAS 取回并入版本库，NAS 部署改为拉取 fork 的 `truenas-web-docker` 后以 root 执行 `bash deploy/run.sh`。本分支自此接管 fork 部署工作流（spec source 由 PR #47 改为 fork 分支）。
