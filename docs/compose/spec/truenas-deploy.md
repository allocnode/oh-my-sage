---
feature: truenas-deploy
status: delivered
updated: 2026-11-20
source: https://github.com/KevinZjYang/oh-my-sage/tree/truenas-web-docker
---

# TrueNAS Docker 部署（MCP + 网页版）

## Report

**What was built** — 为 oh-my-sage 在 TrueNAS SCALE 上部署 MCP 常驻服务与网页版：新增 `deploy/Dockerfile.web`（Next.js 多阶段镜像，运行时只带编译产物与依赖、预建 `.sessionstore`、HEALTHCHECK），扩展 `deploy/docker-compose.yml` 增加 `oh-my-sage-web` 服务（运行时注入 LLM/网关环境变量、命名卷持久化会话），部署配置以 `<...>` 示例值内嵌 compose（弃用 `.env`，移除 `deploy/.env.example`）。实际部署在 NAS 的 `/home/truenas_admin/oh-my-sage/repo`，双容器运行：MCP `:3790`、网页版 `:3000`。

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

### S2.3 配置直接写在 `deploy/docker-compose.yml`（示例值，不入库）

不使用 `.env` 文件（用户决策）：compose 里直接写 `<...>` 示例值占位，用户在 NAS 上编辑 compose 替换成真实值后 `docker compose up -d` 部署。示例值保持占位符风格（遵循仓库 AGENTS.md：不在用户复制的配置里写具体 IP / 密钥 / token；具体值只以"例如"形式出现在注释里）。填好真实值后不提交 compose。

### S2.4 移除 `deploy/.env.example`

不再需要 `.env` 机制后，删除 `deploy/.env.example`；配置项说明并入 compose 注释与 `deploy/README.md` 的值表。

### S2.5 NAS 部署路径与步骤

仓库放 `/mnt/<pool>/apps/oh-my-sage`（SSH 登录后先 `zfs list` 看池名，无法建目录则退回 `/root/oh-my-sage`）。步骤：

1. 确认 `docker` 与 compose 插件可用（TrueNAS Apps 服务需已启用；未启用则提示用户在 UI 开启）
2. `git clone https://github.com/allocnode/oh-my-sage.git`
3. 在 `deploy/docker-compose.yml` 填入真实值（含生成的 token）
4. 写入 `deploy/Dockerfile.web`、覆盖 `deploy/docker-compose.yml`（从本地 worktree 用 scp 传输，或 apply git 分支）
5. `docker compose up -d --build`
6. `curl http://127.0.0.1:3790/healthz` 与 `curl -I http://127.0.0.1:3000` 验证

### S2.6 客户端接入

- MCP：`http://192.168.31.5:3790/mcp`，请求头 `Authorization: Bearer <MCP_AUTH_TOKEN>`；客户端配置见仓库 `deploy/README.md`
- 网页版：浏览器打开 `http://192.168.31.5:3000`，首次输入一次性登录码
- MCP 容器与网页版容器各自连接网关一次，需要各自的登录码（登录码一次性）

### S2.7 GitHub Actions 自动构建推送 Docker Hub

- 新增 `.github/workflows/docker-images.yml`：触发为推送到部署分支 `truenas-web-docker`（tag `latest`）或打 `v*` tag（tag 版本号），支持手动触发；构建并推送两个镜像——`Dockerfile` → `oh-my-sage-mcp`，`deploy/Dockerfile.web` → `oh-my-sage-web`。
- 仓库 Secrets 需配置 `DOCKERHUB_USERNAME` / `DOCKERHUB_TOKEN`（用户 Docker Hub 账号 + 访问令牌）；未配置时 workflow 明示失败（首次运行前需在 GitHub 设置里添加）。

### S2.8 compose 引用镜像 + 公开 fork 的安全约束

- 两个服务使用纯镜像引用 `image: kevinzjyang/oh-my-sage-{mcp,web}:latest`，**不保留 `build:`**（纯镜像拉取模式，不在服务器编译；镜像由 GitHub Actions 构建推送，见 S2.7）。
- **约束**：fork 是公开仓库，真实敏感值（`LLM_API_KEY`、`GATEWAY_URL`、`MCP_AUTH_TOKEN`）**不得出现在任何提交文件中**——compose 只提交 `<...>` 示例值，真实值由用户在 NAS 上编辑 compose 时填入，填好后不提交（配合 `git update-index --skip-worktree deploy/docker-compose.yml` 可让更新不受本地修改影响）。用户最终选择：不用 `.env`，全部配置内嵌 compose。
- `run.sh` 为纯拉取：`docker compose pull && docker compose up -d`（无本地构建回退）。NAS 更新流程：`git pull` → root 执行 `bash deploy/run.sh`。TrueNAS Apps 的 Custom App 也使用同一份纯镜像 compose（无 build 段，否则 `up` 会因构建上下文缺失失败）。

## [S3] Out of Scope

- 不改仓库功能代码（仅 `deploy/` 下新增/修改部署文件）
- 不推送分支、不开 PR（除非用户要求）
- 不把网页版暴露公网（官方明令网页版无账号系统）
- 部署方式两者皆可：TrueNAS Apps 的 Custom App（托管应用，推荐）或 SSH `docker compose` CLI；同一份纯镜像 compose 通用

## Tasks

- [x] T1: 新增 `deploy/Dockerfile.web` — acceptance: NAS 上 `docker build` 成功（随 compose 一起验证）
- [x] T2: 扩展 `deploy/docker-compose.yml` — acceptance: NAS 上 `docker compose config` 通过，双服务定义正确
- [x] T3: 在 NAS 的 compose 中填入真实值（网关地址、生成的 token、LLM 配置） — acceptance: 双容器启动后 `healthz` 返回 `{"ok":true}`、网页版 HTTP 200
- [x] T4: SSH 部署（clone、传文件、`docker compose up -d --build`） — acceptance: 两容器 `running`
- [x] T5: 验证 — acceptance: 3790 `healthz` ok；3000 返回 200；MCP_HOSTS/认证参数与客户端配置一致
- [x] T6: 独立 review + finalize spec — acceptance: review 通过，spec `status: delivered`
- [x] T7: 新增 GitHub Actions 工作流（`docker-images.yml`）自动构建推送 MCP + 网页镜像到 Docker Hub — acceptance: 工作流文件随分支推送，结构校验通过（Actions 首次运行的确认需用户配置 DOCKERHUB secrets 后完成） (covers: S2.7)
- [x] T8: compose 改为纯镜像引用（去 `build:`）+ `run.sh` 纯拉取 + README 更新 + 移除 `.env.example` — acceptance: 敏感值未进入任何提交文件（提交内容仅占位符），NAS/Apps 部署时 `docker compose config` 通过 (covers: S2.8)

## Journey log

- 部署中发现 TrueNAS 的 `docker` 组（gid 999）是 middleware 数据库里的 builtin 组，`user.update` 拒绝修改其成员（`EINVAL: membership of this builtin group may not be altered`），所以 `truenas_admin` 无法获得 docker CLI 权限（UI 里也看不到该选项）；sudo 需要密码、本环境无法交互输密码。最终方案：SSH（密钥认证）只负责准备（克隆、写 .env/部署文件、验证），`docker compose up -d --build` 由用户在 TrueNAS WebUI 自带 Shell（root 身份）执行一条 `bash .../run.sh`。
- 仓库实际部署路径定为 `/home/truenas_admin/oh-my-sage/repo`（S2.5 计划是 `/mnt/<pool>/apps/...`，因非 root 无法在数据池建目录/改 ACL 而简化）。
- MCP 会话语义验证：Streamable HTTP 下 initialize 之后需要 `Mcp-Session-Id`，用 curl 直接测 tools/list 会报 400 —— 属规范行为，真实 MCP 客户端会自动处理。
- 网关地址排障：用户初始提供 `192.168.31.2`，但该 IP 的 80 端口是「小米路由器」管理页，`/centrallinkws/` 全部 404，网页登录报 `Unexpected server response: 404`。扫描整个 192.168.31.0/24（80/54321/9527/5666/30001/51234/8888/18080 + WS 路径探测）无设备应答，后经用户从米家 App 核对：设备是 **小米路由器 BE3600 Pro（带中枢网关功能）**，极客版自动化服务在 **`http://192.168.31.2:8086`**，`ws://192.168.31.2:8086/centrallinkws/` 握手返回 101 确认。`.env` 的 `GATEWAY_URL` 已改为 `http://192.168.31.2:8086` 并重建容器。
- 移动端响应式 + PWA 特性（`mobile-responsive`，见同目录 `docs/compose/spec/mobile-responsive.md`）合并进本部署分支；`run.sh` 从 NAS 取回并入版本库，NAS 部署改为拉取 fork 的 `truenas-web-docker` 后以 root 执行 `bash deploy/run.sh`。本分支自此接管 fork 部署工作流（spec source 由 PR #47 改为 fork 分支）。
- 用户要求"env 直接写在 compose 里 + 镜像预打包"以简化部署：镜像分发改为 GitHub Actions 自动构建推 Docker Hub（S2.7）；fork 是**公开**仓库，敏感值不能进提交文件，最终方案定为 compose 内 `<...>` 示例值占位、用户在 NAS 上直接编辑 compose 填真实值（不提交）、**弃用 `.env` 文件**（S2.3/S2.4/S2.8 修订）。教训：公开仓库下"部署配置内嵌密钥"与"提交到仓库"不可兼得——占位符进仓库、真实值留在本地编辑过的文件是唯一既方便又安全的折中。
- 用户改用 **TrueNAS Apps 的 Custom App** 部署，首次 `up` 失败（`app_lifecycle.log` 的 CallError）。根因：compose 里的 `build: context: ..` 指向仓库目录，而 Apps 把 compose 存到自己的目录运行，构建上下文缺失。修复：compose **去掉 `build:` 只留 `image:`**（纯镜像模式，与 Docker Hub 拉取一致），`run.sh` 同步去掉构建回退。教训：App 托管/CLI 部署都要用纯镜像 compose，build 只存在于 CI（GitHub Actions）里。
