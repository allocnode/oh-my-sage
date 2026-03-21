# Oh My Sage (智者)

> 米家自动化极客版 AI Agent - 用自然语言控制你的智能家居

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Vercel AI SDK](https://img.shields.io/badge/Vercel%20AI%20SDK-3-purple)](https://sdk.vercel.ai/)

Oh My Sage 是一个**工具驱动的 AI Agent**，通过自然语言对话帮助你创建和管理小米米家自动化极客版规则。

## ✨ 核心特性

- 🤖 **Agent 循环** - 持续运行的思考-行动循环，非一次性响应
- 🛠️ **工具驱动** - 所有能力通过工具实现，灵活可扩展
- 💭 **思考可见** - 输出思考过程，让你了解 Agent 在做什么
- 💡 **多方案建议** - 为你提供多种实现方案供选择
- ✅ **确认后执行** - 重要操作前获取你的确认
- 🔄 **流式输出** - 实时显示处理过程
- 📚 **Agent Skills** - 支持可扩展的专业技能系统

## 🏗️ 架构概览

```
用户输入 → Agent Loop → LLM 思考 → 调用工具 → 输出结果
                            │
                            ├── think (思考)
                            ├── get_devices (获取设备)
                            ├── generate_suggestions (生成建议)
                            ├── create_graph (创建规则)
                            ├── ask_user (询问用户)
                            └── activate_skill (激活技能)
```

## 🚀 Quick Start

### 前置要求

- Node.js 18+
- Git
- 小米米家自动化极客版网关
- LLM API Key（支持 OpenAI 兼容接口）

### 方式一：让 AI Agent 帮你安装（推荐）

如果你在使用 **OpenCode**、**Claude Code**、**Cursor** 等 AI 编程助手，直接告诉它：

```
帮我安装 oh-my-sage: https://github.com/Vinci-9527/oh-my-sage

我需要：
1. LLM 模型：qwen-max（或 kimi-128k / deepseek-chat / gpt-4o / claude-3.5-sonnet）
2. API Key：你的key
3. 米家网关地址：http://192.168.0.5（改成你的）
```

Agent 会自动完成克隆、安装、配置和启动。

### 方式二：手动安装

```bash
# 克隆并安装
git clone https://github.com/Vinci-9527/oh-my-sage.git && cd oh-my-sage && npm install

# 配置环境变量
cp .env.example .env
```

然后编辑 `.env` 文件，填入你的配置：

```env
# 选择模型（qwen-max / kimi-128k / deepseek-chat / glm-4 / gpt-4o / claude-3.5-sonnet / local-ollama）
DEFAULT_MODEL=qwen-max

# 对应的 API Key
QWEN_API_KEY=your_api_key_here

# 米家网关地址（默认 http://192.168.0.5）
GATEWAY_URL=http://192.168.0.5
```

启动服务：

```bash
npm run dev
```

访问 http://localhost:3000

### 使用

1. 在网页中输入米家网关的 **6 位登录码**
2. 等待设备加载完成
3. 开始对话，例如：
   - "帮我查看设备状态"
   - "创建一个自动化规则，晚上8点关灯"
   - "次卧灯太亮了，帮我调暗一点"

## 📱 使用示例

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

## 🔧 支持的模型

| 模型 | 配置方式 | 说明 |
|------|----------|------|
| **通义千问** | `qwen-max` | 阿里云，中文优秀 |
| **Kimi** | `kimi-128k` | 月之暗面，长上下文 |
| **DeepSeek** | `deepseek-chat` | 深度求索，性价比高 |
| **智谱 GLM** | `glm-4` | 智谱 AI，中文理解强 |
| **OpenAI** | `gpt-4o` | OpenAI，综合能力 |
| **Claude** | `claude-3.5-sonnet` | Anthropic，推理强 |
| **本地 Ollama** | `local-ollama` | 本地部署，隐私保护 |

## 🛠️ 工具列表

| 工具 | 描述 |
|------|------|
| `think` | 思考问题并输出思考过程 |
| `ask_user` | 向用户提问或请求确认 |
| `get_devices` | 获取智能家居设备列表 |
| `search_devices` | 根据名称、房间搜索设备 |
| `get_device` | 获取指定设备的详细信息 |
| `get_graphs` | 获取自动化规则列表 |
| `get_graph` | 获取指定规则的详细信息 |
| `create_graph` | 创建新的自动化规则 |
| `update_graph` | 更新现有规则 |
| `delete_graph` | 删除规则 |
| `toggle_graph` | 启用/禁用规则 |
| `generate_suggestions` | 生成多个实现方案 |
| `activate_skill` | 激活专业技能 |
| `read_skill_file` | 读取技能资源文件 |

## 📁 项目结构

```
oh-my-sage/
├── .agents/
│   └── skills/              # Agent Skills
│       └── mijia-automation/ # 米家自动化技能
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/        # 认证接口
│   │   │   ├── chat/        # 对话接口
│   │   │   ├── devices/     # 设备接口
│   │   │   ├── graphs/      # 规则接口
│   │   │   └── sessions/    # 会话接口
│   │   ├── layout.tsx       # 布局
│   │   └── page.tsx         # 主页面
│   ├── components/
│   │   ├── Chat.tsx         # 聊天组件
│   │   ├── DevicePanel.tsx  # 设备面板
│   │   ├── GraphPanel.tsx   # 规则面板
│   │   ├── SessionPanel.tsx # 会话面板
│   │   └── LoginPage.tsx    # 登录页面
│   ├── server/
│   │   ├── agent/
│   │   │   ├── agent.ts     # Agent 核心
│   │   │   └── suggestions.ts # 建议生成器
│   │   ├── ai/
│   │   │   ├── model.ts     # 模型配置
│   │   │   ├── tools.ts     # 工具定义
│   │   │   └── prompts.ts   # 提示词
│   │   ├── gateway/
│   │   │   ├── client.ts    # 网关客户端
│   │   │   └── shared.ts    # 网关单例
│   │   ├── session/
│   │   │   └── store.ts     # 会话存储
│   │   └── skills/
│   │       └── loader.ts    # 技能加载器
│   └── shared/
│       ├── types.ts         # 类型定义
│       └── constants.ts     # 常量定义
├── ref/
│   └── GUIDE.md             # 米家网关参考文档
├── docs/
│   ├── AGENT_DESIGN-0.0.0.md
│   └── AGENT_DESIGN-0.0.1.md
└── package.json
```

## 📚 文档

- [米家网关参考文档](ref/GUIDE.md) - 网关 API、设备结构、规则格式
- [Agent Skills 规范](.agents/skills/mijia-automation/SKILL.md) - 自动化规则创建指南
- [设计文档](docs/) - 架构设计和重构说明

## 🔌 Agent Skills

Oh My Sage 支持可扩展的 Agent Skills 系统，遵循 [Agent Skills 规范](https://agentskills.io/specification)。

### 渐进式披露

Skills 使用三层渐进式披露机制：

| 层级 | 内容 | Token 成本 | 触发时机 |
|------|------|-----------|----------|
| Catalog | name + description | ~50-100/skill | 系统初始化 |
| Instructions | 完整 SKILL.md | <5000 tokens | activate_skill |
| Resources | references/ 等 | 按需加载 | read_skill_file |

### 添加新 Skill

1. 在 `.agents/skills/` 下创建目录
2. 创建 `SKILL.md`（包含 frontmatter + 内容）
3. 可选：创建 `references/` 存放详细参考
4. 重启服务后自动加载

## 🤝 Contributing

欢迎贡献！请遵循以下步骤：

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 开启 Pull Request

## 📄 License

MIT License - 详见 [LICENSE](LICENSE) 文件

## 🙏 致谢

- [Vercel AI SDK](https://sdk.vercel.ai/) - AI 应用框架
- [Next.js](https://nextjs.org/) - React 框架
- [Ant Design](https://ant.design/) - UI 组件库
- [Agent Skills](https://agentskills.io/) - 技能规范
