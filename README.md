# Oh My Sage

> 米家自动化极客版 AI Agent - 用自然语言创建复杂的米家极客版自动化规则

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Vercel AI SDK](https://img.shields.io/badge/Vercel%20AI%20SDK-3-purple)](https://sdk.vercel.ai/)
[![MCP](https://img.shields.io/badge/MCP-Protocol-green)](https://modelcontextprotocol.io/)

Oh My Sage 是一个**工具驱动的 AI Agent**，通过自然语言对话帮助你创建和管理小米米家自动化极客版规则。

---

## ✨ 核心特性

- 🤖 **Agent 循环** - 持续运行的思考-行动循环，非一次性响应
- 🛠️ **工具驱动** - 所有能力通过工具实现，灵活可扩展
- 💭 **思考可见** - 输出思考过程，让你了解 Agent 在做什么
- 💡 **多方案建议** - 为你提供多种实现方案供选择
- ✅ **确认后执行** - 重要操作前获取你的确认
- 🔄 **流式输出** - 实时显示处理过程
- 📐 **自动布局** - 规则节点自动排版，清晰展示流程
- 🔌 **MCP 支持** - 通过 Model Context Protocol 集成到 AI 编程助手

---

## 🚀 快速开始

**两种使用方式，任选其一：**

| 方式 | 适用场景 | 特点 |
|------|----------|------|
| 🔌 **MCP Server** | 开发场景 | 集成到 AI 编程助手，作为工具直接调用 |
| 🌐 **Web 界面** | 日常使用 | 浏览器交互，可视化界面 |

**环境要求**：Node.js 18.17 或更高版本（Windows 本机常驻脚本需要 20.6+，Docker 镜像自带 Node.js 22），以及与米家极客版网关处于同一局域网。

### MCP 方式（一行命令安装）

```bash
# 克隆、构建并链接到系统 PATH
git clone https://github.com/allocnode/oh-my-sage.git && cd oh-my-sage && npm install && npm run build:mcp && npm link
```

接着在 AI 助手中配置 MCP Server：最简单的是 stdio 方式，也可以改为本机常驻或部署到私有服务器，三种方式的配置见下文 [选择部署方式](#选择部署方式)。

配置好后直接对话使用：
- "帮我查看米家设备"
- "创建一个每天晚上8点关闭客厅灯的自动化规则"

> ⚠️ **关于 Skill**：创建/修改自动化规则需要让 AI 助手能读到 `mijia-automation` Skill，安装方式见下文 Step 3。

### Web 方式（一行命令启动）

```bash
# 克隆并安装
git clone https://github.com/allocnode/oh-my-sage.git && cd oh-my-sage && npm install

# 配置环境变量
cp .env.example .env
# 编辑 .env 填入 LLM API 和网关地址

# 启动
npm run dev
```

访问 http://localhost:3000 即可使用。Web 方式直接读取仓库内的 Skill，无需另行安装。

---

## 📖 详细文档

### 🔌 MCP Server（推荐开发场景）

通过 Model Context Protocol 将 oh-my-sage 集成到 AI 编程助手。

#### 完整安装步骤

**Step 1: 构建并安装 MCP Server**（已按快速开始执行过可跳过）

```bash
cd oh-my-sage
npm install
npm run build:mcp
npm link
```

构建完成后，`oh-my-sage-mcp` 命令会被链接到系统 PATH。

**Step 2: 选择部署方式并配置 MCP Server**

#### 选择部署方式

三种方式任选其一，工具和功能完全相同，区别在于 MCP Server 进程跑在哪里：

| 方式 | 进程位置 | 特点 |
|------|----------|------|
| **stdio（默认）** | 由 AI 助手按需启动 | 最简单，但在 OpenCode 1.19.x 上大量并发调用会刷屏；客户端重启后需重新输入登录码 |
| **本机 PC 常驻** | 本机后台服务，只监听 `127.0.0.1` | 登录一次网关，客户端重启后无需重新输入登录码；多个客户端共享 |
| **私有服务器** | NAS / 家庭服务器上的 Docker 容器 | 同上，且多台电脑共用一个网关登录；需设置访问 token |

> 关于刷屏：OpenCode 1.19.x 内置的 Bun 运行时与 MCP SDK 的 stdio 客户端配合时，每个并发请求都会挂一个 `drain` 监听器，十余个并发调用就会在界面上打印大段 `MaxListenersExceededWarning`，看起来像渲染崩溃（相关讨论：[anomalyco/opencode#42724](https://github.com/anomalyco/opencode/issues/42724)、[modelcontextprotocol/typescript-sdk#842](https://github.com/modelcontextprotocol/typescript-sdk/issues/842)）。后两种方式走 HTTP，不经过这条路径。

`GATEWAY_URL` 是米家网关的局域网地址（下文以 `http://192.168.0.5` 为例，请改成你的）。不设置也能启动，但首次调用 `mijia_auth` 时需要传 `gateway_url` 参数。

**方式一：stdio（默认）**

OpenCode（`opencode.json`）：

```json
{
  "mcp": {
    "oh-my-sage": {
      "type": "local",
      "command": ["oh-my-sage-mcp"],
      "environment": { "GATEWAY_URL": "http://192.168.0.5" }
    }
  }
}
```

Claude Desktop、Cursor 等使用 `mcpServers` 格式的客户端：

```json
{
  "mcpServers": {
    "oh-my-sage": {
      "command": "oh-my-sage-mcp",
      "env": { "GATEWAY_URL": "http://192.168.0.5" }
    }
  }
}
```

**方式二：本机 PC 常驻**

构建后运行安装脚本，注册为当前用户登录时自动启动的后台服务（默认端口 3790）：

```bash
# Windows（计划任务，无需管理员权限，需要 Node.js 20.6+）
pwsh deploy/install-local.ps1 -GatewayUrl http://192.168.0.5
# macOS（launchd）/ Linux（systemd --user）
bash deploy/install-local.sh -g http://192.168.0.5
```

可选参数：端口 `-Port` / `-p`，访问 token `-Token` / `-t`（本机回环地址可不设）。卸载：`-Uninstall` / `-u`。脚本结束时会打印下面的客户端配置。

**方式三：私有服务器（Docker）**

```bash
cp deploy/.env.example deploy/.env   # 填入 GATEWAY_URL、MCP_AUTH_TOKEN、MCP_ALLOWED_HOSTS
cd deploy && docker compose up -d --build
```

监听非回环地址时必须设置 `MCP_AUTH_TOKEN`，否则拒绝启动。容器需要能访问局域网内的网关和公网 `miot-spec.org`。

**HTTP 方式的客户端配置（方式二、三）**

OpenCode（`opencode.json`）：

```json
{
  "mcp": {
    "oh-my-sage": {
      "type": "remote",
      "url": "http://127.0.0.1:3790/mcp",
      "oauth": false,
      "headers": { "Authorization": "Bearer <MCP_AUTH_TOKEN>" }
    }
  }
}
```

其他支持 Streamable HTTP 的客户端：

```json
{
  "mcpServers": {
    "oh-my-sage": {
      "url": "http://127.0.0.1:3790/mcp",
      "headers": { "Authorization": "Bearer <MCP_AUTH_TOKEN>" }
    }
  }
}
```

私有服务器把地址换成服务器的主机名或 IP（需列入 `MCP_ALLOWED_HOSTS`）；未设置 token 时去掉 `headers`。健康检查：`GET /healthz`。

HTTP 模式也可手动启动：`oh-my-sage-mcp --http`（或 `MCP_TRANSPORT=http`），环境变量：

| 变量 | 默认值 | 说明 |
|------|--------|------|
| `MCP_HTTP_HOST` | `127.0.0.1` | 监听地址 |
| `MCP_HTTP_PORT` | `3790` | 监听端口 |
| `MCP_AUTH_TOKEN` | 无 | Bearer token，监听非回环地址时必填 |
| `MCP_ALLOWED_HOSTS` | 回环地址及非通配的监听地址 | 额外允许的 Host 主机名，逗号分隔（防 DNS rebinding；回环地址始终允许） |
| `MCP_SESSION_TTL_MINUTES` | `30` | 空闲会话回收时间 |

**Step 3: 安装 Skill（创建/修改规则必需）**

创建或修改规则前，AI 助手需要读取 `mijia-automation` Skill 中的节点模板和连接规则。支持 Skill 的客户端安装后会在需要时自动加载，无需手动操作。

Skill 位于 `.agents/skills/mijia-automation/`，安装时请复制**整个目录**（`references/` 下的参考文档会被按需读取）：

- **OpenCode**：在本仓库目录内启动时会自动发现 `.agents/skills/`；在其他目录使用时，复制到 `~/.config/opencode/skills/` 或 `~/.agents/skills/`
- **Claude Code**：复制到 `~/.claude/skills/`
- **不支持 Skill 的客户端**：将 `SKILL.md` 内容添加到项目规则文件（如 `AGENTS.md`）或对话中

**Step 4: 连接并使用**

在 AI 助手中直接对话：

1. **连接网关**（登录码是一次性的，每次连接都要从网关获取新的；HTTP 方式下已有会话登录过则无需再输入）：
   ```
   帮我连接米家网关，登录码是 123456
   ```

2. **查看设备**：
   ```
   查看我有哪些米家设备
   ```

3. **创建自动化规则**：
   ```
   帮我创建一个自动化规则：每天晚上8点关闭客厅灯
   ```

#### MCP 工具列表

共 28 个工具。

**连接**

| 工具 | 描述 |
|------|------|
| `mijia_auth` | 连接米家网关（需 6 位一次性登录码；已连接时无需再次认证） |
| `mijia_disconnect` | 断开网关连接 |
| `mijia_status` | 检查连接状态 |

**设备**

| 工具 | 描述 |
|------|------|
| `mijia_get_devices` | 获取设备列表 |
| `mijia_get_device` | 获取设备详情+MIOT Spec能力（默认精简摘要，`detail=full` 取完整对象，`siids` 只看指定服务） |
| `mijia_find_device_usage` | 一次扫描全部规则，找出引用指定设备的规则和节点，并列出残留引用 |

**规则**

| 工具 | 描述 |
|------|------|
| `mijia_get_graphs` | 获取自动化规则列表 |
| `mijia_get_graph` | 获取规则详情（默认紧凑摘要，可按 `node_ids` 取指定节点；返回 `hash`） |
| `mijia_create_graph` | 创建规则，可同时创建本规则变量（⚠️需 Skill 支持） |
| `mijia_patch_graph` | 增量修改规则：只发送变化的节点，`baseHash` 防止覆盖他人修改（修改规则首选） |
| `mijia_update_graph` | 整图替换规则（兼容保留，⚠️更新 nodes 需 Skill） |
| `mijia_delete_graph` | 删除规则，并清理对应的本规则变量 |
| `mijia_toggle_graph` | 启用/禁用规则 |
| `mijia_validate_graph` | 校验规则结构完整性（可传已保存规则的 `id`） |
| `mijia_validate_graph_capabilities` | 按真实 MIOT Spec 校验设备能力和变量引用（可传 `id`，结果看 `valid` 字段） |

**复杂规则草稿**（超过 10 个节点时分块上传，草稿 30 分钟后过期）

| 工具 | 描述 |
|------|------|
| `mijia_graph_draft_begin` | 开始草稿 |
| `mijia_graph_draft_append` | 追加一批节点（每批最多 25 个） |
| `mijia_graph_draft_edit` | 按节点 ID 替换、增加或删除草稿节点 |
| `mijia_graph_draft_status` | 查看草稿状态 |
| `mijia_graph_draft_commit` | 校验并提交草稿，创建规则 |
| `mijia_graph_draft_discard` | 丢弃草稿（不删除已创建的规则） |

**变量**

| 工具 | 描述 |
|------|------|
| `mijia_get_variables` | 获取变量列表 |
| `mijia_get_variable_value` | 获取单个变量的当前值 |
| `mijia_get_variable_config` | 获取单个变量的配置 |
| `mijia_create_variable` | 创建变量（id 只能是字母数字） |
| `mijia_set_variable` | 设置变量值 |
| `mijia_delete_variable` | 删除变量（仍被规则引用时拒绝删除） |

**维护**

| 工具 | 描述 |
|------|------|
| `mijia_call_api` | 直接调用网关原始 API，仅限白名单内的只读方法，用于排障 |

**⚠️ 关于创建/修改规则**：

`mijia_create_graph`、`mijia_patch_graph`、`mijia_update_graph` 和草稿工具构建节点时需要 `mijia-automation` Skill 的支持，安装方式见上面的 Step 3。

**Skill 提供的内容**：
- 完整的节点类型模板（deviceInput, deviceOutput, condition, timeRange, delay 等）
- 节点连接规则（outputs 格式、state/event 节点区别）
- 关键校验规则（节点ID格式、inputs/outputs 要求）
- dtype 映射规则（bool/int/float/string）
- 变量的创建、引用与生命周期
- 常用自动化模式库与案例索引（`references/`）

---

### 🌐 Web 界面（适合日常使用）

适合喜欢浏览器交互的用户，提供可视化界面。

#### 安装步骤

**让 AI 帮你安装（推荐）**：

如果你在使用 **OpenCode**、**Claude Code**、**Cursor** 等 AI 编程助手，直接告诉它：

```
帮我安装 oh-my-sage: https://github.com/allocnode/oh-my-sage

我需要：
1. LLM API 地址：https://api.openai.com/v1（或其他 OpenAI 兼容接口）
2. API Key：你的key
3. 模型名称：gpt-4o（或其他模型）
4. 米家网关地址：http://192.168.0.5（改成你的）
```

**手动安装**：

```bash
# 克隆并安装
git clone https://github.com/allocnode/oh-my-sage.git && cd oh-my-sage && npm install

# 配置环境变量
cp .env.example .env
```

编辑 `.env` 文件：

```env
# OpenAI 兼容接口配置
LLM_BASE_URL=https://api.openai.com/v1
LLM_API_KEY=your_api_key_here
LLM_MODEL=gpt-4o

# 米家网关地址
GATEWAY_URL=http://192.168.0.5
```

启动服务：

```bash
npm run dev
```

访问 http://localhost:3000，输入网关登录码即可使用。Web 方式必须在 `.env` 中设置 `GATEWAY_URL`；`LLM_TEMPERATURE` 可选，默认 0.7。会话记录保存在仓库下的 `.sessionstore/` 目录。

---

## 💡 使用示例

### MCP 方式示例

```
用户: 帮我查看米家设备

Agent: 我来帮你查看米家设备。首先连接到网关。

[mijia_auth] passcode: 123456, gateway_url: http://192.168.0.5
→ 连接成功

[mijia_get_devices] 
→ 获取到 82 台设备，包括：
  - 小米智能中控屏 (在线)
  - 客厅灯 (在线)
  - 智能窗帘 (在线)

你的智能家居共有 82 台设备，大部分都在线运行良好！
```

### Web 方式示例

```
用户: 每天晚上8点关闭客厅灯

Agent: [思考中...] 我来帮你设置这个自动化。
       [正在获取设备列表...]
       
       我看到你有这些灯：
       - 客厅灯 (在线)
       - 卧室灯 (在线)
       
       [正在生成建议方案...]
       
       我为你准备了几个方案：
       
       ⭐ 方案1: 简单方案
       - 每天 20:00 准时关闭客厅灯
       - 优点: 简单直接
       
       方案2: 智能方案  
       - 每天 20:00，如果灯开着就关闭
       - 优点: 避免无效操作
       
       你选择哪个方案？
```

---

## 🤖 支持的模型

Web 界面支持任何 **OpenAI 兼容接口**的模型（MCP 方式使用 AI 助手自身的模型，无需配置）：

| 服务商 | Base URL | 模型示例 |
|--------|----------|----------|
| OpenAI | `https://api.openai.com/v1` | `gpt-4o` |
| 通义千问 | `https://dashscope.aliyuncs.com/compatible-mode/v1` | `qwen-max` |
| DeepSeek | `https://api.deepseek.com/v1` | `deepseek-chat` |
| Kimi | `https://api.moonshot.cn/v1` | `moonshot-v1-128k` |
| 本地 Ollama | `http://localhost:11434/v1` | `qwen2:72b` |

---

## 📁 项目结构

```
oh-my-sage/
├── .agents/
│   └── skills/
│       └── mijia-automation/ # 米家自动化 Skill（创建/修改规则必需）
├── src/
│   ├── app/                 # Next.js Web 界面与 API 路由
│   ├── components/          # React 组件
│   ├── server/             # Web 后端（Agent、LLM、会话、Skill 加载）
│   ├── core/               # Core 库（MCP 和 Web 共用）
│   │   ├── gateway/        # 网关客户端
│   │   ├── tools/         # 工具实现
│   │   └── types/         # 类型定义
│   └── mcp/                # MCP Server
│       ├── index.ts        # 入口（stdio / --http）
│       ├── http.ts         # Streamable HTTP 传输
│       ├── config.ts       # 配置
│       ├── utils.ts        # 工具函数
│       └── tools/          # MCP 工具
├── tests/                  # 单元测试（npm run test:unit）
├── deploy/                 # 部署：docker-compose、本机常驻安装脚本
├── Dockerfile              # MCP Server 镜像（HTTP 模式）
├── dist/mcp/               # MCP 构建输出
├── ref/                    # 参考文档
└── docs/                   # 设计文档与验证记录
```

---

## 📚 参考文档

- [米家网关参考文档](ref/GUIDE.md) - 网关 API、设备结构、规则格式
- [Agent Skills 规范](.agents/skills/mijia-automation/SKILL.md) - 自动化规则创建指南
- [自动化知识索引](.agents/skills/mijia-automation/references/index.md) - 模式库与案例索引
- [设计文档](docs/) - 架构设计和重构说明

---

## 🔧 Agent Skills

Oh My Sage 支持可扩展的 Agent Skills 系统。Web 界面启动时加载仓库 `.agents/skills/` 和用户目录 `~/.agents/skills/` 下的 Skill（同名时仓库优先）；MCP 方式由 AI 助手自身的 Skill 机制加载，见上文 Step 3。

### 渐进式披露

| 层级 | 内容 | Token 成本 | 触发时机 |
|------|------|-----------|----------|
| Catalog | name + description | ~50-100/Skill | 系统初始化 |
| Instructions | 完整 SKILL.md | 数千 tokens | `activate_skill` 自动/手动激活 |
| Resources | references/ 等 | 按需加载 | `read_skill_file` |

---

## 🤝 Contributing

欢迎贡献！请遵循以下步骤：

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add amazing feature'`)，提交前运行 `npm run lint` 和 `npm run test:unit`
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 开启 Pull Request

---

## 📄 License

MIT License - 详见 [LICENSE](LICENSE) 文件

---

## 🙏 致谢

- [Vercel AI SDK](https://sdk.vercel.ai/) - AI 应用框架
- [Next.js](https://nextjs.org/) - React 框架
- [Ant Design](https://ant.design/) - UI 组件库
- [MCP](https://modelcontextprotocol.io/) - Model Context Protocol
