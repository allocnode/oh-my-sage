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

**环境要求**：Node.js 18.17+，以及与米家极客版网关处于同一局域网。Windows 本机常驻脚本需要 Node.js 20.6+，Docker 镜像自带 Node.js 22。

### MCP 方式（一行命令安装）

```bash
# 克隆、构建并链接到系统 PATH
git clone https://github.com/allocnode/oh-my-sage.git && cd oh-my-sage && npm install && npm run build:mcp && npm link
```

在 AI 助手的 MCP 配置中添加（Claude Desktop、Cursor 等使用 `mcpServers` 格式的客户端），把 `GATEWAY_URL` 改成你的网关地址：

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

配置好后直接对话使用：

- "帮我查看米家设备"
- "创建一个每天晚上8点关闭客厅灯的自动化规则"

> ⚠️ **关于 Skill**：创建/修改自动化规则需要让 AI 助手能读到 `mijia-automation` Skill，见下文 [Step 2](#step-2-安装-skill创建修改规则必需)。

**其他客户端的配置格式**，以及**本机常驻 / 私有服务器部署**（登录一次网关，客户端重启后无需重输登录码），见 [deploy/README.md](deploy/README.md)。

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

通过 Model Context Protocol 将 oh-my-sage 集成到 AI 编程助手。安装就是快速开始第三条命令（`npm install && npm run build:mcp && npm link`），执行过可直接跳到 Step 2；`oh-my-sage-mcp` 会被链接到系统 PATH，包未发布到 npm，`npx -y oh-my-sage-mcp` 不可用。

#### Step 1: 配置 MCP Server

按需要选择部署方式，工具和功能完全相同：

| 方式 | 进程位置 | 特点 |
|------|----------|------|
| **stdio（默认）** | 由 AI 助手按需启动 | 最简单；客户端重启后需重新输入登录码 |
| **本机常驻** | 本机后台服务，仅监听 `127.0.0.1` | 登录一次，多个客户端共享 |
| **私有服务器** | NAS / 家庭服务器上的 Docker | 同上，多台电脑共用一个网关登录；需设置访问 token |

stdio 的配置就是上面快速开始里那段 JSON。本机常驻与私有服务器的安装步骤、环境变量、全部客户端配置格式，统一见 [deploy/README.md](deploy/README.md)。

#### Step 2: 安装 Skill（创建/修改规则必需）

创建或修改规则前，AI 助手需要读取 `mijia-automation` Skill 中的节点模板和连接规则。支持 Skill 的客户端安装后会在需要时自动加载，无需手动操作。

Skill 位于 `.agents/skills/mijia-automation/`，安装时请复制**整个目录**（`references/` 下的参考文档会被按需读取）。复制到客户端扫描的 skills 目录即可：

- **支持 `.agents/skills/` 的客户端**：在本仓库目录内启动时会自动发现，无需复制
- **其他情况**：复制到该客户端的 skills 目录（如 `~/.agents/skills/`、Claude Code 的 `~/.claude/skills/`）
- **不支持 Skill 的客户端**：将 `SKILL.md` 内容添加到项目规则文件（如 `AGENTS.md`）或对话中

Skill 提供节点类型模板、节点连接规则、关键校验规则、dtype 映射规则、变量的创建与生命周期，以及 `references/` 下的模式库与案例索引。

#### Step 3: 连接并使用

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

共 28 个工具。`mijia_create_graph`、`mijia_patch_graph`、`mijia_update_graph` 和草稿工具构建节点时需要 `mijia-automation` Skill 支持。

<details>
<summary><b>展开完整工具列表</b></summary>

<table>
  <thead>
    <tr><th>分类</th><th>工具</th><th>描述</th></tr>
  </thead>
  <tbody>
    <tr>
      <td rowspan="3">连接</td>
      <td><code>mijia_auth</code></td>
      <td>连接米家网关（需 6 位一次性登录码；已连接时无需再次认证）</td>
    </tr>
    <tr>
      <td><code>mijia_disconnect</code></td>
      <td>断开网关连接</td>
    </tr>
    <tr>
      <td><code>mijia_status</code></td>
      <td>检查连接状态</td>
    </tr>
    <tr>
      <td rowspan="3">设备</td>
      <td><code>mijia_get_devices</code></td>
      <td>获取设备列表</td>
    </tr>
    <tr>
      <td><code>mijia_get_device</code></td>
      <td>设备详情 + MIOT Spec 能力（默认精简摘要，<code>detail=full</code> 取完整对象，<code>siids</code> 只看指定服务）</td>
    </tr>
    <tr>
      <td><code>mijia_find_device_usage</code></td>
      <td>一次扫描全部规则，找出引用指定设备的规则和节点，并列出残留引用</td>
    </tr>
    <tr>
      <td rowspan="9">规则</td>
      <td><code>mijia_get_graphs</code></td>
      <td>获取规则列表</td>
    </tr>
    <tr>
      <td><code>mijia_get_graph</code></td>
      <td>获取规则详情（默认紧凑摘要，可按 <code>node_ids</code> 取指定节点；返回 <code>hash</code>）</td>
    </tr>
    <tr>
      <td><code>mijia_create_graph</code></td>
      <td>创建规则，可同时创建本规则变量</td>
    </tr>
    <tr>
      <td><code>mijia_patch_graph</code></td>
      <td>增量修改：只发送变化的节点，<code>baseHash</code> 防止覆盖他人修改（修改首选）</td>
    </tr>
    <tr>
      <td><code>mijia_update_graph</code></td>
      <td>整图替换（兼容保留）</td>
    </tr>
    <tr>
      <td><code>mijia_delete_graph</code></td>
      <td>删除规则，并清理对应的本规则变量</td>
    </tr>
    <tr>
      <td><code>mijia_toggle_graph</code></td>
      <td>启用/禁用规则</td>
    </tr>
    <tr>
      <td><code>mijia_validate_graph</code></td>
      <td>校验结构完整性（可传已保存规则的 <code>id</code>）</td>
    </tr>
    <tr>
      <td><code>mijia_validate_graph_capabilities</code></td>
      <td>按真实 MIOT Spec 校验设备能力和变量引用（可传 <code>id</code>，结果看 <code>valid</code> 字段）</td>
    </tr>
    <tr>
      <td rowspan="6">草稿</td>
      <td><code>mijia_graph_draft_begin</code></td>
      <td>开始草稿（超过 10 个节点时分块上传，30 分钟后过期）</td>
    </tr>
    <tr>
      <td><code>mijia_graph_draft_append</code></td>
      <td>追加一批节点（每批最多 25 个）</td>
    </tr>
    <tr>
      <td><code>mijia_graph_draft_edit</code></td>
      <td>按节点 ID 替换、增加或删除草稿节点</td>
    </tr>
    <tr>
      <td><code>mijia_graph_draft_status</code></td>
      <td>查看草稿状态</td>
    </tr>
    <tr>
      <td><code>mijia_graph_draft_commit</code></td>
      <td>校验并提交草稿，创建规则</td>
    </tr>
    <tr>
      <td><code>mijia_graph_draft_discard</code></td>
      <td>丢弃草稿（不删除已创建的规则）</td>
    </tr>
    <tr>
      <td rowspan="6">变量</td>
      <td><code>mijia_get_variables</code></td>
      <td>获取变量列表</td>
    </tr>
    <tr>
      <td><code>mijia_get_variable_value</code></td>
      <td>获取单个变量的当前值</td>
    </tr>
    <tr>
      <td><code>mijia_get_variable_config</code></td>
      <td>获取单个变量的配置</td>
    </tr>
    <tr>
      <td><code>mijia_create_variable</code></td>
      <td>创建变量（id 只能是字母数字）</td>
    </tr>
    <tr>
      <td><code>mijia_set_variable</code></td>
      <td>设置变量值</td>
    </tr>
    <tr>
      <td><code>mijia_delete_variable</code></td>
      <td>删除变量（仍被规则引用时拒绝删除）</td>
    </tr>
    <tr>
      <td>维护</td>
      <td><code>mijia_call_api</code></td>
      <td>直接调用网关原始 API，仅限白名单内的只读方法，用于排障</td>
    </tr>
  </tbody>
</table>

</details>

---

### 🌐 Web 界面（适合日常使用）

适合喜欢浏览器交互的用户，提供可视化界面。

#### 安装步骤

**让 AI 帮你安装（推荐）**：

如果你在使用 **Claude Code**、**Cursor** 等 AI 编程助手，直接告诉它：

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
git clone https://github.com/allocnode/oh-my-sage.git && cd oh-my-sage && npm install
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
│       └── mijia-automation/  # 米家自动化 Skill（创建/修改规则必需）
├── src/
│   ├── app/                   # Next.js Web 界面与 API 路由
│   ├── components/            # React 组件
│   ├── server/                # Web 后端（Agent、LLM、会话、Skill 加载）
│   ├── core/                  # Core 库（MCP 和 Web 共用）
│   │   ├── gateway/           # 网关客户端
│   │   ├── tools/             # 工具实现
│   │   └── types/             # 类型定义
│   └── mcp/                   # MCP Server
│       ├── index.ts           # 入口（stdio / --http）
│       ├── http.ts            # Streamable HTTP 传输
│       ├── config.ts          # 配置
│       ├── utils.ts           # 工具函数
│       └── tools/             # MCP 工具
├── tests/                     # 单元测试（npm run test:unit）
├── deploy/                    # 部署：Docker、本机常驻脚本（见 deploy/README.md）
├── Dockerfile                 # MCP Server 镜像（HTTP 模式）
├── dist/mcp/                  # MCP 构建输出
├── docs/                      # 设计文档
└── ref/                       # 参考文档
```

---

## 📚 参考文档

- [部署指南](deploy/README.md) - 三种部署方式、全部客户端配置、环境变量、排障
- [米家网关参考文档](ref/GUIDE.md) - 网关 API、设备结构、规则格式
- [Agent Skills 规范](.agents/skills/mijia-automation/SKILL.md) - 自动化规则创建指南
- [自动化知识索引](.agents/skills/mijia-automation/references/index.md) - 模式库与案例索引
- [设计文档](docs/) - 架构设计和重构说明

---

## 🔧 Agent Skills

Oh My Sage 支持可扩展的 Agent Skills 系统。Web 界面启动时加载仓库 `.agents/skills/` 和用户目录 `~/.agents/skills/` 下的 Skill（同名时仓库优先）；MCP 方式由 AI 助手自身的 Skill 机制加载，见上文 [Step 2](#step-2-安装-skill创建修改规则必需)。

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
