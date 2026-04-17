# Oh My Sage

> 米家自动化极客版 AI Agent - 用自然语言控制你的智能家居

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Vercel AI SDK](https://img.shields.io/badge/Vercel%20AI%20SDK-3-purple)](https://sdk.vercel.ai/)
[![MCP](https://img.shields.io/badge/MCP-Protocol-green)](https://modelcontextprotocol.io/)

Oh My Sage 是一个**工具驱动的 AI Agent**，通过自然语言对话帮助你创建和管理小米米家自动化极客版规则。

**两种使用方式**：
1. 🔌 **MCP 方式** - 通过 Model Context Protocol 集成到 AI 编程助手（推荐开发场景）
2. 🌐 **Web 方式** - 基于浏览器的交互界面（适合日常使用）

---

## ✨ 核心特性

- 🤖 **Agent 循环** - 持续运行的思考-行动循环，非一次性响应
- 🛠️ **工具驱动** - 所有能力通过工具实现，灵活可扩展
- 💭 **思考可见** - 输出思考过程，让你了解 Agent 在做什么
- 💡 **多方案建议** - 为你提供多种实现方案供选择
- ✅ **确认后执行** - 重要操作前获取你的确认
- 🔄 **流式输出** - 实时显示处理过程
- 📚 **Agent Skills** - 支持可扩展的专业技能系统
- 📐 **自动布局** - 规则节点自动排版，清晰展示流程
- 🔌 **MCP 支持** - 通过 MCP 协议集成到任何支持 MCP 的 AI 助手

---

## 🚀 使用方式

### 方式一：MCP Server（推荐开发场景）

通过 Model Context Protocol 将 oh-my-sage 集成到 AI 编程助手，作为工具直接调用。

#### 安装步骤

**Step 1: 构建并安装 MCP Server**

```bash
cd oh-my-sage
npm install
npm run build:mcp
npm link
```

构建完成后，`oh-my-sage-mcp` 命令会被链接到系统 PATH，可以直接在命令行使用。

**Step 2: 配置 MCP Server**

在 MCP Host 配置文件中添加：

```json
{
  "mcpServers": {
     "oh-my-sage-mcp": {
        "command": ["oh-my-sage-mcp"],
        "environment": {
           "GATEWAY_URL": "http://192.168.0.4"
        }
     }
  }
}
```

**Step 3: 安装 Skill（⚠️ 创建/更新规则必需）**

**关于 Skill 的自动激活**：
- 如果涉及到**创建规则**或**更新规则**，你需要先安装 `mijia-automation` skill
- 一旦安装了 skill，AI 助手会在需要时**自动激活**，无需手动操作
- 如果你没有安装 skill，AI 助手会提示你需要先安装

**安装方式**：

Skill 位于 `.agents/skills/mijia-automation/` 目录下：

- **OpenCode**: 复制到 `~/.config/opencode/skills/`
- **Claude/Cursor**: 将 `SKILL.md` 内容添加到 `AGENTS.md` 或对话中

**Step 4: 连接并使用**

在 OpenCode 中：

1. **连接网关**：
   ```
   调用 mijia_auth，传入登录码和网关地址
   ```

2. **查看设备**：
   ```
   调用 mijia_get_devices 获取设备列表
   ```

3. **创建自动化规则**（已安装 skill 会自动激活）：
   ```
   帮我创建一个自动化规则：每天晚上8点关闭客厅灯
   ```

---

### 方式二：Web 界面（适合日常使用）

适合喜欢浏览器交互的用户，提供可视化界面。

#### 快速开始

**让 AI 帮你安装（推荐）**：

如果你在使用 **OpenCode**、**Claude Code**、**Cursor** 等 AI 编程助手，直接告诉它：

```
帮我安装 oh-my-sage: https://github.com/Vinci-9527/oh-my-sage

我需要：
1. LLM API 地址：https://api.openai.com/v1（或其他 OpenAI 兼容接口）
2. API Key：你的key
3. 模型名称：gpt-4o（或其他模型）
4. 米家网关地址：http://192.168.0.5（改成你的）
```

**手动安装**：

```bash
# 克隆并安装
git clone https://github.com/Vinci-9527/oh-my-sage.git && cd oh-my-sage && npm install

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

访问 http://localhost:3000，输入网关登录码即可使用。

---

## 🛠️ MCP 工具列表

| 工具 | 描述 |
|------|------|
| `mijia_auth` | 连接米家网关（必须先调用） |
| `mijia_disconnect` | 断开网关连接 |
| `mijia_status` | 检查连接状态 |
| `mijia_get_devices` | 获取设备列表 |
| `mijia_get_device` | 获取设备详情+MIOT Spec能力 |
| `mijia_get_graphs` | 获取自动化规则列表 |
| `mijia_get_graph` | 获取规则详情 |
| `mijia_create_graph` | 创建规则（⚠️需先加载 mijia-automation skill） |
| `mijia_update_graph` | 更新规则（⚠️更新 nodes 需先加载 skill） |
| `mijia_delete_graph` | 删除规则 |
| `mijia_toggle_graph` | 启用/禁用规则 |
| `mijia_validate_graph` | 校验规则完整性 |
| `mijia_get_variables` | 获取变量列表 |
| `mijia_set_variable` | 设置变量值 |

### ⚠️ 重要：创建/更新规则需要 Skill 支持

`mijia_create_graph` 和 `mijia_update_graph` 工具需要 `mijia-automation` skill 的支持才能正确工作。

**关于自动激活**：
- 如果你已经安装了 skill，AI 助手会在需要时**自动激活**，无需手动操作
- 如果 AI 助手提示需要安装 skill，请参考上面的 "Step 3: 安装 Skill" 部分进行安装

**Skill 提供的内容**：
- 完整的节点类型模板（deviceInput, deviceOutput, condition, timeRange, delay 等）
- 节点连接规则（outputs 格式、state/event 节点区别）
- 关键校验规则（节点ID格式、inputs/outputs 要求）
- dtype 映射规则（bool/int/float/string）
- 设备控制常见模式

**正确的工作流程**：
1. 确保已安装 skill → 2. AI 自动激活 → 3. 理解规则 → 4. 构建 nodes → 5. 校验 → 6. 创建/更新

---

## 📱 使用示例

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

### MCP 方式示例

```
用户: 帮我查看米家设备

Agent: 我来帮你查看米家设备。首先连接到网关。

[mijia_auth] passcode: 960622, gateway_url: http://192.168.0.4
→ 连接成功

[mijia_get_devices] 
→ 获取到 82 台设备，包括：
  - 小米智能中控屏 (在线)
  - 客厅灯 (在线)
  - 智能窗帘 (在线)

你的智能家居共有 82 台设备，大部分都在线运行良好！
```

---

## 🔧 支持的模型

支持任何 **OpenAI 兼容接口**的模型：

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
│       └── mijia-automation/ # 米家自动化技能（MCP方式必需）
├── src/
│   ├── app/                 # Next.js Web 界面
│   ├── components/          # React 组件
│   ├── server/             # Web 后端
│   ├── core/               # Core 库（MCP 和 Web 共用）
│   │   ├── gateway/        # 网关客户端
│   │   ├── tools/         # 工具实现
│   │   └── types/         # 类型定义
│   └── mcp/                # MCP Server
│       ├── index.ts        # 入口
│       ├── config.ts       # 配置
│       ├── utils.ts        # 工具函数
│       └── tools/          # MCP 工具
├── dist/mcp/               # MCP 构建输出
├── ref/                    # 参考文档
└── docs/                   # 设计文档
```

---

## 📚 文档

- [米家网关参考文档](ref/GUIDE.md) - 网关 API、设备结构、规则格式
- [Agent Skills 规范](.agents/skills/mijia-automation/SKILL.md) - 自动化规则创建指南
- [设计文档](docs/) - 架构设计和重构说明

---

## 🔌 Agent Skills

Oh My Sage 支持可扩展的 Agent Skills 系统。

### 渐进式披露

| 层级 | 内容 | Token 成本 | 触发时机 |
|------|------|-----------|----------|
| Catalog | name + description | ~50-100/skill | 系统初始化 |
| Instructions | 完整 SKILL.md | <5000 tokens | activate_skill |
| Resources | references/ 等 | 按需加载 | read_skill_file |

---

## 🤝 Contributing

欢迎贡献！请遵循以下步骤：

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add amazing feature'`)
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
