# oh-my-sage Agent 设计文档

## 核心理念

**Agent 不是一个 if-else 分支，而是一个持续运行的智能循环**

Agent 的本质是：
1. 持续运行在一个思考-行动循环中
2. 通过工具调用与外部世界交互
3. 能够输出思考过程
4. 在需要时暂停等待用户输入
5. 自主决定何时调用哪个工具

---

## 技术栈

- **LLM 框架**: Vercel AI SDK
- **模型支持**: 任何 OpenAI 兼容 API
- **UI 框架**: Next.js 14 + Ant Design
- **网关通信**: WebSocket + ECJPAKE

---

## 模型配置设计

### 支持的模型

```typescript
const PRESET_MODELS = {
  'mimo-v2-pro': {
    name: 'MiMo v2 Pro (小米)',
    provider: 'openai-compatible',
    baseURL: 'https://api.xiaomimimo.com/v1',
    apiKey: '',
    model: 'mimo-v2-pro',
  },
  'qwen-max': { name: '通义千问 Max', provider: 'openai-compatible', ... },
  'kimi-128k': { name: 'Kimi 128K', provider: 'openai-compatible', ... },
  'deepseek-chat': { name: 'DeepSeek Chat', provider: 'openai-compatible', ... },
  'gpt-4o': { name: 'OpenAI GPT-4o', provider: 'openai', ... },
  'claude-3.5-sonnet': { name: 'Claude 3.5 Sonnet', provider: 'anthropic', ... },
  'custom': { name: '自定义', provider: 'openai-compatible', ... },
};
```

---

## 架构设计

```
┌─────────────────────────────────────────────────────────────┐
│                        Agent Loop                            │
│                                                              │
│   ┌─────────────────────────────────────────────────────┐   │
│   │                    Thinking Phase                    │   │
│   │  - 理解用户输入                                      │   │
│   │  - 回顾上下文                                        │   │
│   │  - 决定下一步行动                                    │   │
│   └─────────────────────────────────────────────────────┘   │
│                              │                               │
│                              ▼                               │
│   ┌─────────────────────────────────────────────────────┐   │
│   │                    Action Phase                      │   │
│   │  - 调用工具获取信息                                  │   │
│   │  - 执行操作                                          │   │
│   │  - 流式输出结果                                      │   │
│   └─────────────────────────────────────────────────────┘   │
│                              │                               │
│                              ▼                               │
│   ┌─────────────────────────────────────────────────────┐   │
│   │                    Wait Phase (可选)                 │   │
│   │  - 等待用户输入                                      │   │
│   └─────────────────────────────────────────────────────┘   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 工具定义

### 核心工具

| 工具 | 描述 |
|------|------|
| `think` | 思考问题并输出思考过程 |
| `ask_user` | 向用户提问或请求确认 |
| `get_devices` | 获取所有设备列表 |
| `search_devices` | 根据关键词搜索设备 |
| `get_device` | 获取指定设备详情 |
| `get_graphs` | 获取所有规则列表 |
| `get_graph` | 获取指定规则详情 |
| `create_graph` | 创建新的自动化规则 |
| `update_graph` | 更新现有规则 |
| `delete_graph` | 删除规则 |
| `toggle_graph` | 启用/禁用规则 |
| `generate_suggestions` | 为用户需求生成多个方案 |
| `get_variables` | 获取变量列表 |
| `set_variable` | 设置变量值 |

---

## 系统提示词

```
你是"智者"（oh-my-sage），一个米家智能家居 AI 助手。

## 你的本质

你是一个持续运行的智能 Agent，不是简单的问答机器人。
你需要主动思考、探索、行动，而不是被动地回答问题。

## 你的工作方式

1. **思考优先** - 使用 think 工具输出思考过程
2. **探索获取信息** - 使用 get_devices, get_graphs 等工具
3. **提供选择** - 使用 generate_suggestions 生成方案
4. **确认后执行** - 使用 ask_user 获取确认
5. **输出你的行动** - 告诉用户你正在做什么

## 工具使用原则

- 不要猜测，去查询
- 不要假设，去确认
- 逐步探索，而非一步到位
- 不要沉默，输出你正在做什么
```

---

## 对话流程示例

```
用户: 每天晚上8点关闭客厅灯

Agent: [思考中...]
       我来帮你设置这个自动化。
       [正在获取设备列表...]
       
       我看到你有这些灯：
       - 客厅灯 (在线)
       - 卧室灯 (在线)
       
       [正在生成建议方案...]
       
       我为你准备了几个方案：
       
       方案1: 简单方案
       - 每天 20:00 准时关闭客厅灯
       - 优点: 简单直接
       
       方案2: 智能方案  
       - 每天 20:00，如果灯开着就关闭
       - 优点: 避免无效操作
       
       你选择哪个方案？
```

---

## Graph CRUD 操作

### 创建规则

```typescript
await gateway.callApi('setGraph', {
  id: 'graph_xxx',
  nodes: [...],
  cfg: {
    id: 'graph_xxx',
    enable: true,
    uiType: 'automation',
    userData: { name: '规则名称', lastUpdateTime: Date.now(), ... }
  }
});
```

### 查询规则

```typescript
const graphs = await gateway.callApi('getGraphList');
const graph = await gateway.callApi('getGraph', { id: 'graph_xxx' });
```

### 更新规则

```typescript
await gateway.callApi('setGraph', { id: 'graph_xxx', nodes: [...], cfg: {...} });
```

### 删除规则

```typescript
await gateway.callApi('deleteGraph', { id: 'graph_xxx' });
```

---

## 新旧方案对比

| 方面 | 旧方案 (v1) | 新方案 (v2) |
|------|-------------|-------------|
| 流程控制 | switch-case 硬编码 | Agent 循环 + 工具驱动 |
| 能力实现 | 独立的处理函数 | 统一的工具接口 |
| 意图识别 | 每次都做 | 需要时才做 |
| 思考过程 | 黑盒 | 输出可见 |
| 扩展性 | 低 | 高 |

---

## 文件结构

```
oh-my-sage/
├── src/
│   ├── server/
│   │   ├── ai/           # AI 模块 (Vercel AI SDK)
│   │   ├── agent/        # Agent 模块
│   │   └── gateway/      # 网关模块
│   ├── app/              # Next.js App Router
│   └── components/       # UI 组件
├── gateway_client.js     # 网关客户端（已验证）
└── package.json
```

---

## 更新日志

- v2: 重新设计为工具驱动的 Agent 循环架构
- 2026-03-21: 完成 MiMo 模型集成，Agent 对话测试成功
