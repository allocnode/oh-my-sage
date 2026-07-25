# oh-my-sage Core 与 MCP Server 设计文档

## 1. 背景与目标

### 1.1 问题

当前 oh-my-sage 采用单一 Web 前端模式，用户必须打开浏览器页面与 Agent 交互。对于已集成 AI 编程助手（OpenCode、Claude Code、Cursor 等）的用户而言，这种方式显得冗余——他们希望直接在自己的 Agent 中调用 oh-my-sage 的能力。

### 1.2 目标

1. **抽取 Core 库**：仅抽取 **Gateway 连接管理** + **基础工具函数**，不包含 Agent 循环
2. **保持 Web 端兼容**：现有前端无需修改，继续正常工作
3. **提供 MCP Server**：暴露原子工具，让外部 Agent 自己决定如何组合调用

### 1.3 设计原则

- **Core 是工具库，不是 Agent**：外部已有完整的 Skill/记忆/对话能力
- **MCP 只暴露原子工具**：get_devices、create_graph 等，不提供对话接口
- **工具必须先认证**：mijia_auth 是所有工具的前置条件

---

## 2. 现有架构分析

### 2.1 当前交互流程

```
┌─────────────────────────────────────────────────────────────────┐
│                         Web 前端                                  │
├─────────────────────────────────────────────────────────────────┤
│  LoginPage.tsx                                                  │
│    └─ POST /api/auth { passcode }                               │
│        └─ connectGateway(passcode) → GatewayClient              │
│                                                                  │
│  Chat.tsx                                                       │
│    └─ POST /api/chat { message, sessionId }                     │
│        └─ Agent.run() → SSE 流式输出                            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Next.js API Routes                          │
├─────────────────────────────────────────────────────────────────┤
│  /api/auth → connectGateway() → globalThis 单例                 │
│  /api/chat → Agent.run() → streamText + tools                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Core Logic (server/)                        │
├─────────────────────────────────────────────────────────────────┤
│  gateway/client.ts     - WebSocket + ECJPAKE + AES-GCM          │
│  gateway/shared.ts     - 全局单例管理                            │
│  ai/tools.ts           - 工具定义（依赖 GatewayClient）          │
│  ai/model.ts          - 模型配置                                │
│  ai/prompts.ts        - 系统提示词                              │
│  agent/agent.ts       - Agent 循环 + 流式输出                   │
│  session/store.ts      - JSON 文件会话存储                      │
│  skills/loader.ts      - Skill 动态加载                          │
│  validator/            - 规则校验                               │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Xiaomi Gateway                                 │
│  WebSocket (ECJPAKE Auth + AES-GCM Encrypted)                   │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 关键依赖关系

```
GatewayClient (gateway/client.ts)
    │
    ├── 需要: WebSocket, crypto, elliptic, zlib
    └── 提供: connect(), authenticate(), callApi()

工具函数 (tools/*.ts)
    │
    ├── 依赖: GatewayClient (所有工具都调用 gateway.callApi)
    ├── 依赖: validateGraph
    └── 返回: { success: boolean, ... } | { success: false, error: string }
```

### 2.3 连接生命周期

**重要约束**：
1. Gateway WebSocket 连接建立后必须**保持长连接**
2. 所有工具调用都通过同一个连接
3. 连接断开后需要用户**重新输入 6 位登录码**重建连接
4. 使用 `globalThis` 实现跨请求共享单例（Web 端）

```typescript
// gateway/shared.ts
const globalKey = '__oh_my_sage_gateway__';

export async function connectGateway(passcode: string, gatewayUrl?: string): Promise<GatewayClient> {
    // 1. 关闭已有连接
    const existing = getGlobalGateway();
    if (existing) await existing.close();

    // 2. 创建新连接 + ECJPAKE 认证
    const gateway = new GatewayClient();
    await gateway.connect(url);
    await gateway.authenticate(passcode);

    // 3. 保存到全局变量
    setGlobalGateway(gateway);
    return gateway;
}
```

### 2.4 工具返回格式

所有工具函数遵循统一返回格式：

```typescript
// 成功
{ success: true, data: ..., message?: string }

// 失败
{ success: false, error: string }
```

---

## 3. 重构设计

### 3.1 目标目录结构

```
oh-my-sage/
├── src/                          # Web 端 Agent 实现 (Next.js 标准结构)
│   ├── app/                     # Next.js App Router
│   │   ├── api/                # API Routes
│   │   ├── page.tsx
│   │   └── layout.tsx
│   ├── components/              # React 组件
│   ├── server/
│   │   ├── agent/              # Agent 循环
│   │   ├── gateway/            # Gateway 客户端
│   │   ├── ai/
│   │   │   ├── tools.ts       # 工具定义（使用 Core 工具 + Agent 专用工具）
│   │   │   └── prompts.ts     # 系统提示词
│   │   ├── skills/             # Skill 加载器
│   │   └── validator/          # 规则校验
│   ├── shared/
│   │   ├── types.ts
│   │   └── constants.ts
│   ├── core/                    # 核心库（纯工具库）
│   │   ├── index.ts            # 统一导出
│   │   ├── gateway/
│   │   │   ├── client.ts       # ECJPAKE + AES-GCM + callApi
│   │   │   └── manager.ts      # 连接管理器
│   │   ├── tools/
│   │   │   ├── device.ts       # 设备工具
│   │   │   ├── graph.ts        # 规则工具
│   │   │   ├── variable.ts     # 变量工具
│   │   │   └── base.ts         # 通用工具辅助（validateGraph, layoutNodes）
│   │   └── types/
│   │       ├── device.ts
│   │       ├── graph.ts
│   │       └── index.ts
│   └── mcp/                     # MCP Server
│       └── index.ts             # 入口
└── .agents/skills/             # Skill 文件（标准协议）
    └── mijia-automation/
        └── SKILL.md
```

> **注意**：所有代码都在 `src/` 下，包括 core 和 mcp。core 是纯工具库，供 server 和 mcp 共用。

### 3.2 Core 模块设计

Core 是**唯一真相源**，包含所有可复用逻辑：

1. **Gateway 连接管理** - Web 和 MCP 共享
2. **原子工具函数** - 返回 `{ success, data?, error? }`
3. **类型定义** - 所有共享类型
4. **辅助函数** - 校验、布局等

#### 3.2.1 Core 导出

```typescript
// src/core/index.ts

// Gateway
export { GatewayClient } from './gateway/client';
export { createGatewayManager } from './gateway/manager';
export type { GatewayManager } from './gateway/manager';

// 工具函数（Web 和 MCP 都调用这些）
export { getDevices, getDevice } from './tools/device';
export { getGraphs, getGraph, createGraph, updateGraph, deleteGraph, toggleGraph } from './tools/graph';
export { getVariables, setVariable } from './tools/variable';
export { validateGraph, layoutNodes } from './tools/base';

// 类型
export type { Device, DeviceInfo } from './types/device';
export type { Graph, GraphNode, GraphConfig, CreateGraphInput } from './types/graph';
export type { ToolResult, ToolError, ValidationError } from './types/index';
```

#### 3.2.2 Skill 能力保留

**Web Agent 的 Skill 能力保留在 `src/server/skills/` 目录**：

```
src/server/skills/
└── loader.ts         # Skill 加载器
```

| 功能 | 位置 | 说明 |
|------|------|------|
| Skill 加载 | `src/server/skills/loader.ts` | 保留，依赖 fs |
| Skill 工具 | `src/server/ai/tools.ts` | `activate_skill`, `read_skill_file` |
| Skill 目录注入 | `src/server/ai/prompts.ts` | `formatSkillCatalogForPrompt()` |

Core **不包含** Skill 代码：
- Skill 加载依赖 `fs` 模块
- Core 是纯工具库，不应依赖文件系统
- 避免 Core 与 Agent 逻辑耦合

**兼容性说明**：
- 现有 Web Agent 的 Skill 能力**完全保留**，路径为 `src/server/skills/`
- 外部 Agent 可通过标准 [Agent Skills 协议](https://agentskills.io/specification) 直接读取 `.agents/skills/` 目录
- MCP Server 不提供 Skill 工具，外部 Agent 使用自己的 Skill 机制

#### 3.2.3 工具分层

现有 16 个工具按归属分层：

| 工具 | 归属 | 说明 |
|------|------|------|
| `get_devices` | Core | 设备列表 |
| `get_device` | Core | 设备详情 |
| `get_graphs` | Core | 规则列表 |
| `get_graph` | Core | 规则详情 |
| `create_graph` | Core | 创建规则 |
| `update_graph` | Core | 更新规则 |
| `delete_graph` | Core | 删除规则 |
| `toggle_graph` | Core | 启用/禁用 |
| `get_variables` | Core | 变量列表 |
| `set_variable` | Core | 设置变量 |
| `validate_graph` | Core | 校验规则 |
| `layoutNodes` | Core | 节点布局（辅助） |
| `think` | Agent | 思考过程 |
| `ask_user` | Agent | 向用户提问 |
| `activate_skill` | Agent | 激活 Skill |
| `read_skill_file` | Agent | 读取 Skill 文件 |

#### 3.2.4 GatewayManager 接口

```typescript
// src/core/gateway/manager.ts

export interface GatewayManager {
    /** GatewayClient 实例 */
    gateway: GatewayClient | null;
    /** 是否已连接 */
    isConnected(): boolean;
    /** 连接网关 */
    connect(passcode: string, gatewayUrl?: string): Promise<void>;
    /** 断开连接 */
    disconnect(): Promise<void>;
    /** 确保已连接，未连接时抛出错误 */
    ensureConnected(): void;
}

/**
 * 创建 GatewayManager 实例
 * 用于 Web 端和 MCP 端统一管理连接状态
 */
export function createGatewayManager(): GatewayManager;
```

#### 3.2.5 工具函数签名

所有工具函数遵循统一签名：

```typescript
// src/core/types/index.ts
export interface ToolResult<T = any> {
    success: true;
    data: T;
    message?: string;
}

export interface ToolError {
    success: false;
    error: string;
}

export type ToolResponse<T = any> = ToolResult<T> | ToolError;
```

```typescript
// 设备工具
function getDevices(gateway: GatewayClient): Promise<ToolResult<Device[]>>;
function getDevice(gateway: GatewayClient, dids: string[]): Promise<ToolResult<DeviceInfo[]>>;

// 规则工具
function getGraphs(gateway: GatewayClient): Promise<ToolResult<Graph[]>>;
function getGraph(gateway: GatewayClient, id: string): Promise<ToolResult<Graph>>;
function createGraph(gateway: GatewayClient, input: CreateGraphInput): Promise<ToolResult<{ graphId: string }>>;
function updateGraph(gateway: GatewayClient, id: string, input: CreateGraphInput): Promise<ToolResult>;
function deleteGraph(gateway: GatewayClient, id: string): Promise<ToolResult>;
function toggleGraph(gateway: GatewayClient, id: string, enable: boolean): Promise<ToolResult>;

// 变量工具
function getVariables(gateway: GatewayClient, scope?: string): Promise<ToolResult<Variable[]>>;
function setVariable(gateway: GatewayClient, id: string, value: string | number, scope?: string): Promise<ToolResult>;

// 辅助函数
function validateGraph(graph: Graph): ValidationError[];
function layoutNodes(nodes: GraphNode[]): void;
```

#### 3.2.6 Web 工具适配器

Web 端需要一个薄薄的适配层，将 Core 工具转换为 AI SDK 格式：

```typescript
// src/server/ai/tools-adapter.ts

import { tool } from 'ai';
import { z } from 'zod';
import { getGateway } from '../gateway/shared';
import { getDevices, getDevice, createGraph, /* ... */ } from '@/core';

/**
 * 创建 AI SDK 工具
 * 适配 Core 工具函数为 Vercel AI SDK 格式
 */
export function createTools(gatewayManager: GatewayManager) {
    const gateway = gatewayManager.gateway!;

    return {
        get_devices: tool({
            description: '...',
            parameters: z.object({}),
            execute: async () => {
                const result = await getDevices(gateway);
                return result;  // Core 工具直接返回 ToolResult
            },
        }),
        // ... 其他工具
    };
}
```

#### 3.2.7 MCP Server

MCP Server 直接使用 Core 工具，无需适配：

```typescript
// src/mcp/index.ts

import { createGatewayManager } from "@/core";
import {
    getDevices,
    getDevice,
    createGraph,
    // ...
} from "@/core";

const gatewayManager = createGatewayManager();

server.registerTool("mijia_get_devices", {
    inputSchema: { /* ... */ },
    async execute() {
        gatewayManager.ensureConnected();
        const result = await getDevices(gatewayManager.gateway!);
        return { content: [{ type: "text", text: JSON.stringify(result) }] };
    },
});
```

---

## 4. MCP Server 设计

### 4.1 设计原则

- **只暴露原子工具**：外部 Agent 自己决定调用顺序和组合
- **不提供对话接口**：避免 Agent 嵌套 Agent
- **单例连接**：整个 MCP 进程共享一个 Gateway 连接
- **STDIO 日志规范**：使用 `console.error()` 记录日志，禁止使用 `console.log()`

### 4.2 依赖

```bash
npm install @modelcontextprotocol/sdk zod
```

> 注意：使用 `@modelcontextprotocol/sdk`，包含 McpServer 和 StdioServerTransport

### 4.3 工具列表

**Core 工具（MCP 暴露）**：

| MCP 工具名 | 描述 | 参数 |
|-----------|------|------|
| `mijia_auth` | 连接米家网关（6位登录码）。必须首先调用此工具，连接建立后需保持活跃，断开需重新认证。 | `{ passcode: string, gateway_url?: string }` |
| `mijia_disconnect` | 断开网关连接。调用后可重新调用 mijia_auth 建立新连接。 | `{}` |
| `mijia_status` | 检查网关连接状态。返回 `{ connected: boolean }`。 | `{}` |
| `mijia_get_devices` | 获取设备列表（预览模式）。返回设备ID、名称、型号、在线状态、房间名。 | `{}` |
| `mijia_get_device` | 获取设备详情及 MIOT Spec 能力（siid/piid/eiid/aiid）。支持批量。返回设备属性、可触发能力、可执行能力、可查询能力。 | `{ dids: string[] }` |
| `mijia_get_graphs` | 获取所有自动化规则列表。返回规则ID、名称、启用状态、创建/更新时间。 | `{}` |
| `mijia_get_graph` | 获取指定规则的详细信息，包括所有节点和连接。返回完整 graph JSON。 | `{ id: string }` |
| `mijia_create_graph` | 创建新的自动化规则。自动布局节点位置，校验连接完整性后提交。返回规则ID。 | `{ name: string, nodes: any[], enable?: boolean }` |
| `mijia_update_graph` | 更新现有规则。可更新名称、节点、启用状态。先获取现有规则详情再修改。 | `{ id: string, name?: string, nodes?: any[], enable?: boolean }` |
| `mijia_delete_graph` | 删除指定的自动化规则。删除前请确认。 | `{ id: string }` |
| `mijia_toggle_graph` | 启用或禁用指定的自动化规则。 | `{ id: string, enable: boolean }` |
| `mijia_validate_graph` | 校验规则连接完整性。校验节点ID、连接有效性、state节点约束等。返回错误和警告列表。 | `{ graph: { id, nodes, cfg } }` |
| `mijia_get_variables` | 获取变量列表。变量可用于规则中的状态存储。 | `{ scope?: string }` |
| `mijia_set_variable` | 设置变量的值。变量可用于规则间的数据传递。 | `{ id: string, value: string\|number, scope?: string }` |

**Agent 专用工具（不暴露）**：
- `think` - Agent 思考过程（仅复杂任务）
- `ask_user` - 向用户提问（需要选择或确认时）
- `activate_skill` - 激活 Skill（规则创建指导）
- `read_skill_file` - 读取 Skill 文件（详细参考文档）

### 4.4 实现

```typescript
// src/mcp/index.ts

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio";
import { z } from "zod";
import { createGatewayManager } from "@/core";
import {
    getDevices,
    getDevice,
    getGraphs,
    getGraph,
    createGraph,
    updateGraph,
    deleteGraph,
    toggleGraph,
    getVariables,
    setVariable,
    validateGraph,
} from "@/core";

const gatewayManager = createGatewayManager();

const server = new McpServer({
    name: "oh-my-sage",
    version: "1.0.0",
});

// ==================== 认证工具 ====================

server.registerTool(
    "mijia_auth",
    {
        description: "连接米家网关（6位登录码）。必须首先调用此工具，连接建立后需保持活跃，断开需重新认证。",
        inputSchema: {
            passcode: z.string().regex(/^\d{6}$/, "必须是6位数字").describe("6位数字登录码"),
            gateway_url: z.string().optional().describe("可选，默认从环境变量读取"),
        },
    },
    async ({ passcode, gateway_url }) => {
        if (gatewayManager.isConnected()) {
            return {
                content: [{ type: "text", text: JSON.stringify({ success: false, error: "已连接，请先调用 mijia_disconnect" }) }],
                isError: true,
            };
        }
        try {
            await gatewayManager.connect(passcode, gateway_url);
            return {
                content: [{ type: "text", text: JSON.stringify({ success: true, message: "连接成功" }) }],
            };
        } catch (error) {
            return {
                content: [{ type: "text", text: JSON.stringify({ success: false, error: String(error) }) }],
                isError: true,
            };
        }
    }
);

server.registerTool(
    "mijia_disconnect",
    {
        description: "断开网关连接。调用后可重新调用 mijia_auth 建立新连接。",
        inputSchema: {},
    },
    async () => {
        try {
            await gatewayManager.disconnect();
            return { content: [{ type: "text", text: JSON.stringify({ success: true, message: "已断开" }) }] };
        } catch (error) {
            return {
                content: [{ type: "text", text: JSON.stringify({ success: false, error: String(error) }) }],
                isError: true,
            };
        }
    }
);

server.registerTool(
    "mijia_status",
    {
        description: "检查网关连接状态。返回 { connected: boolean }。",
        inputSchema: {},
    },
    async () => {
        return {
            content: [{ type: "text", text: JSON.stringify({ connected: gatewayManager.isConnected() }) }],
        };
    }
);

// ==================== 设备工具 ====================

server.registerTool(
    "mijia_get_devices",
    {
        description: "获取设备列表（预览模式）。返回设备ID、名称、型号、在线状态、房间名。如需设备能力信息，用 mijia_get_device。",
        inputSchema: {},
    },
    async () => {
        gatewayManager.ensureConnected();
        const result = await getDevices(gatewayManager.gateway!);
        return { content: [{ type: "text", text: JSON.stringify(result) }] };
    }
);

server.registerTool(
    "mijia_get_device",
    {
        description: "获取设备详情及 MIOT Spec 能力（siid/piid/eiid/aiid）。支持批量：传入多个 did 一次获取。返回设备属性、可触发能力、可执行能力、可查询能力。",
        inputSchema: {
            dids: z.array(z.string()).describe("设备ID数组，如 ['950058664', '2076971215']"),
        },
    },
    async ({ dids }) => {
        gatewayManager.ensureConnected();
        const result = await getDevice(gatewayManager.gateway!, dids);
        return { content: [{ type: "text", text: JSON.stringify(result) }] };
    }
);

// ==================== 规则工具 ====================

server.registerTool(
    "mijia_get_graphs",
    {
        description: "获取所有自动化规则列表。返回规则ID、名称、启用状态、创建/更新时间。",
        inputSchema: {},
    },
    async () => {
        gatewayManager.ensureConnected();
        const result = await getGraphs(gatewayManager.gateway!);
        return { content: [{ type: "text", text: JSON.stringify(result) }] };
    }
);

server.registerTool(
    "mijia_get_graph",
    {
        description: "获取指定规则的详细信息，包括所有节点和连接。返回完整 graph JSON（包含 nodes、cfg）。",
        inputSchema: {
            id: z.string().describe("规则ID"),
        },
    },
    async ({ id }) => {
        gatewayManager.ensureConnected();
        const result = await getGraph(gatewayManager.gateway!, id);
        return { content: [{ type: "text", text: JSON.stringify(result) }] };
    }
);

server.registerTool(
    "mijia_create_graph",
    {
        description: "创建新的自动化规则。自动布局节点位置，校验连接完整性后提交。返回规则ID。",
        inputSchema: {
            name: z.string().describe("规则名称"),
            nodes: z.array(z.any()).describe("节点列表"),
            enable: z.boolean().default(true).describe("是否启用，默认 true"),
        },
    },
    async ({ name, nodes, enable }) => {
        gatewayManager.ensureConnected();
        const result = await createGraph(gatewayManager.gateway!, { name, nodes, enable });
        return { content: [{ type: "text", text: JSON.stringify(result) }] };
    }
);

// ... 其他规则工具 (update_graph, delete_graph, toggle_graph)

// ==================== 变量工具 ====================

server.registerTool(
    "mijia_get_variables",
    {
        description: "获取变量列表。变量可用于规则中的状态存储。scope 默认为 'global'，可选 'rule_xxx'。",
        inputSchema: {
            scope: z.string().optional().default("global").describe("变量作用域，默认为 'global'，可选 'rule_xxx'"),
        },
    },
    async ({ scope }) => {
        gatewayManager.ensureConnected();
        const result = await getVariables(gatewayManager.gateway!, scope);
        return { content: [{ type: "text", text: JSON.stringify(result) }] };
    }
);

server.registerTool(
    "mijia_set_variable",
    {
        description: "设置变量的值。变量可用于规则间的数据传递。scope 默认为 'global'。",
        inputSchema: {
            id: z.string().describe("变量ID"),
            value: z.union([z.string(), z.number()]).describe("变量值"),
            scope: z.string().optional().default("global").describe("变量作用域，默认为 'global'"),
        },
    },
    async ({ id, value, scope }) => {
        gatewayManager.ensureConnected();
        const result = await setVariable(gatewayManager.gateway!, id, value, scope);
        return { content: [{ type: "text", text: JSON.stringify(result) }] };
    }
);

// ==================== 校验工具 ====================

server.registerTool(
    "mijia_validate_graph",
    {
        description: "校验规则连接完整性。校验节点ID、连接有效性、state节点约束等。返回错误和警告列表。创建或更新规则前必须调用。",
        inputSchema: {
            graph: z.object({
                id: z.string().describe("规则ID"),
                nodes: z.array(z.any()).describe("节点列表"),
                cfg: z.object({
                    id: z.string().describe("规则ID"),
                    enable: z.boolean().describe("是否启用"),
                    uiType: z.string().describe("UI类型，固定为 'graph'"),
                    userData: z.object({
                        name: z.string().describe("规则名称"),
                        lastUpdateTime: z.number().describe("最后更新时间戳"),
                        transform: z.object({
                            x: z.number(),
                            y: z.number(),
                            scale: z.number(),
                            rotate: z.number()
                        }).describe("画布变换参数"),
                    }),
                }).describe("规则配置"),
            }).describe("完整规则对象（包含 nodes 和 cfg）"),
        },
    },
    async ({ graph }) => {
        const result = validateGraph(graph);
        return { content: [{ type: "text", text: JSON.stringify(result) }] };
    }
);

// ==================== 启动 ====================

async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("oh-my-sage MCP Server running on stdio");
}

main().catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
});
```

### 4.5 package.json 配置

```json
{
  "name": "@oh-my-sage/mcp",
  "version": "1.0.0",
  "type": "module",
  "bin": {
    "oh-my-sage-mcp": "./dist/index.js"
  },
  "scripts": {
    "build": "tsc && chmod 755 dist/index.js"
  },
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.0.0",
    "zod": "^3.23.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "typescript": "^5.0.0"
  }
}
```

> 注意：MCP 和 Web 共用同一个 TypeScript 配置，不需要单独引用 core 包

### 4.6 tsconfig.json

MCP 使用主项目的 tsconfig.json，不需要单独的 tsconfig。

主项目 tsconfig 已包含 `src/**/*.ts`，会自动编译 `src/core/` 和 `src/mcp/`。

### 4.7 单独打包 MCP Server

由于 MCP Server 是独立进程，需要将其打包为可执行文件。需要创建独立的构建配置：

#### 4.7.1 MCP 专用 tsconfig

```json
// tsconfig.mcp.json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "outDir": "./dist/mcp",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "declaration": false,
    "sourceMap": true
  },
  "include": ["src/core/**/*", "src/mcp/**/*"],
  "exclude": ["node_modules", "src/app", "src/components", "src/server"]
}
```

#### 4.7.2 入口文件

```typescript
// src/mcp/index.ts

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio";
import { createGatewayManager, getDevices, /* ... */ } from "../core/index.js";

// 确保使用 ESM 导入
const gatewayManager = createGatewayManager();

// 注册所有工具...
const server = new McpServer({ name: "oh-my-sage", version: "1.0.0" });

async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("oh-my-sage MCP Server running on stdio");
}

main().catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
});
```

#### 4.7.3 构建脚本

```json
// package.json
{
  "scripts": {
    "build:mcp": "tsc -p tsconfig.mcp.json",
    "build:mcp:watch": "tsc -p tsconfig.mcp.json --watch"
  }
}
```

#### 4.7.4 构建步骤

```bash
# 1. 安装依赖
npm install

# 2. 构建 MCP Server
npm run build:mcp

# 3. 设置可执行权限
chmod +x dist/mcp/mcp/index.js

# 4. 验证构建产物
ls -la dist/mcp/mcp/
```

#### 4.7.5 构建产物结构

```
dist/mcp/
├── core/                    # Core 库
│   ├── gateway/
│   │   ├── client.js
│   │   └── manager.js
│   ├── tools/
│   │   ├── device.js
│   │   ├── graph.js
│   │   └── ...
│   └── types/
│       └── index.js
└── mcp/                     # MCP Server
    └── index.js              # 入口文件 (可执行)
```

#### 4.7.6 使用构建产物

```bash
# 直接运行
./dist/mcp/mcp/index.js

# 或配置到 AI 编程助手
{
  "mcpServers": {
    "oh-my-sage": {
      "command": "node",
      "args": ["/absolute/path/to/oh-my-sage/dist/mcp/mcp/index.js"]
    }
  }
}
```

#### 4.7.7 注意事项

1. **ESM 模块**：MCP Server 必须使用 ESM (`"type": "module"`) 或 `.mjs` 扩展名
2. **相对导入**：使用 `from "../core/index.js"` 而非路径别名 `@/core`
3. **独立进程**：MCP Server 是独立 Node.js 进程，不依赖 Next.js 环境
4. **环境变量**：如需配置，在启动时通过 shell 环境变量传入

---

## 5. Web 端适配

### 5.1 策略

Web 端**逐步迁移**使用 Core：

1. **Gateway 层**：从 Core 重新导出
2. **工具层**：使用 `tools-adapter.ts` 生成 AI SDK 工具
3. **Agent 层**：使用 Core 工具函数，无需改动

### 5.2 具体改动

#### 5.2.1 Gateway 重新导出

```typescript
// src/server/gateway/client.ts
// 直接 re-export Core 的实现

export { GatewayClient } from '@/core';
```

#### 5.2.2 Gateway 重新导出

```typescript
// src/server/gateway/client.ts
// 直接 re-export Core 的实现

export { GatewayClient } from '@/core';
```

#### 5.2.3 shared.ts 使用 Core Manager

```typescript
// src/server/gateway/shared.ts

import { createGatewayManager, type GatewayManager } from '@/core';

let gatewayManager: GatewayManager;

export async function connectGateway(passcode: string, gatewayUrl?: string) {
    gatewayManager = createGatewayManager();
    await gatewayManager.connect(passcode, gatewayUrl);
    return gatewayManager.gateway!;
}

export function getGateway() {
    return gatewayManager?.gateway ?? null;
}

export function isGatewayConnected() {
    return gatewayManager?.isConnected() ?? false;
}
```

#### 5.2.4 工具适配器

tools-adapter.ts 是**关键适配层**，需要合并 Core 工具和 Agent 专用工具：

```typescript
// src/server/ai/tools-adapter.ts

import { tool } from 'ai';
import { z } from 'zod';
import { getDevices, getDevice, createGraph, updateGraph, deleteGraph, toggleGraph, getGraphs, getGraph, getVariables, setVariable, validateGraph, layoutNodes } from '@/core';
import { getSkillByName, formatSkillContent, readSkillFile, getSkillCatalog } from '../skills/loader';

function createCoreTools(gateway: any) {
    return {
        // ==================== 设备工具 ====================
        get_devices: tool({
            description: '获取设备列表（预览模式）',
            parameters: z.object({}),
            execute: async () => getDevices(gateway),
        }),
        get_device: tool({
            description: '获取设备详情',
            parameters: z.object({ dids: z.array(z.string()) }),
            execute: async ({ dids }) => getDevice(gateway, dids),
        }),

        // ==================== 规则工具 ====================
        get_graphs: tool({ /* ... */ }),
        get_graph: tool({ /* ... */ }),
        create_graph: tool({
            description: '创建自动化规则',
            parameters: z.object({
                name: z.string(),
                nodes: z.array(z.any()),
                enable: z.boolean().optional(),
            }),
            execute: async ({ name, nodes, enable }) => {
                layoutNodes(nodes);  // 自动布局节点位置
                return createGraph(gateway, { name, nodes, enable });
            },
        }),
        update_graph: tool({ /* ... */ }),
        delete_graph: tool({ /* ... */ }),
        toggle_graph: tool({ /* ... */ }),

        // ==================== 变量工具 ====================
        get_variables: tool({ /* ... */ }),
        set_variable: tool({ /* ... */ }),

        // ==================== 校验工具 ====================
        validate_graph: tool({
            description: '校验规则连接完整性',
            parameters: z.object({
                graph: z.object({
                    id: z.string(),
                    nodes: z.array(z.any()),
                    cfg: z.any(),
                }),
            }),
            execute: async ({ graph }) => {
                return validateGraph(graph as any);
            },
        }),

        // ==================== 思考工具 ====================
        think: tool({
            description: '仅用于复杂任务的思考（如创建规则）',
            parameters: z.object({
                thought: z.string(),
                nextAction: z.string().optional(),
            }),
            execute: async ({ thought, nextAction }) => ({ success: true, thought, nextAction }),
        }),

        // ==================== 提问工具 ====================
        ask_user: tool({
            description: '仅用于需要用户选择或确认时',
            parameters: z.object({
                question: z.string(),
                options: z.array(z.string()),
                needConfirm: z.boolean().optional(),
            }),
            execute: async ({ question, options, needConfirm }) => ({
                success: true,
                needsUserInput: true,
                question,
                options,
                needConfirm,
            }),
        }),

        // ==================== Skill 工具 ====================
        activate_skill: tool({
            description: '激活指定的 skill',
            parameters: z.object({ name: z.string() }),
            execute: async ({ name }) => {
                const skill = getSkillByName(name);
                if (!skill) {
                    const catalog = getSkillCatalog();
                    return { success: false, error: `Skill "${name}" 不存在` };
                }
                return { success: true, skill: skill.name, content: formatSkillContent(skill) };
            },
        }),
        read_skill_file: tool({
            description: '读取 skill 目录中的资源文件',
            parameters: z.object({
                skillName: z.string(),
                filePath: z.string(),
            }),
            execute: async ({ skillName, filePath }) => {
                const content = readSkillFile(skillName, filePath);
                if (content === null) {
                    return { success: false, error: `无法读取文件: ${filePath}` };
                }
                return { success: true, skillName, filePath, content };
            },
        }),
    };
}

export { createCoreTools };
```

**注意**：
- `layoutNodes` 和 `validateGraph` 都从 Core 导出
- Skill 工具依赖 `src/server/skills/loader.ts`

#### 5.2.5 Agent 使用适配后的工具

```typescript
// src/server/agent/agent.ts

import { createCoreTools } from '../ai/tools-adapter';
import { getGateway } from '../gateway/shared';

export class Agent {
    constructor(gateway: GatewayClient) {
        const gw = gateway || getGateway();
        if (!gw) throw new Error('Gateway not connected');
        this.tools = createCoreTools(gw);  // 合并 Core 工具和 Agent 专用工具
    }
    // ...
}
```

#### 5.2.6 Skill 能力保留

```typescript
// src/server/skills/loader.ts
// 保留现有实现，无需修改

import fs from 'fs';
import path from 'path';

export function loadSkills(): Skill[] { /* ... */ }
export function getSkillCatalog(): SkillMeta[] { /* ... */ }
export function getSkillByName(name: string): Skill | null { /* ... */ }
export function formatSkillContent(skill: Skill): string { /* ... */ }
export function readSkillFile(skillName: string, filePath: string): string | null { /* ... */ }
```

### 5.3 迁移顺序

1. **阶段 1**：创建 Core，Web 端 gateway 改为从 Core 重新导出
2. **阶段 2**：抽取工具函数到 Core，Web 使用 tools-adapter
3. **阶段 3**：验证 Web 和 MCP 功能一致

---

## 6. MCP Server 使用方式

### 6.1 安装

```bash
cd mcp && npm install && npm run build
```

### 6.2 配置 AI 编程助手

```json
// OpenCode / Claude Code / Cursor 的 MCP 配置
{
  "mcpServers": {
    "oh-my-sage": {
      "command": "node",
      "args": ["/absolute/path/to/oh-my-sage/mcp/dist/index.js"]
    }
  }
}
```

> 注意：必须使用绝对路径

### 6.3 使用示例

外部 Agent 直接调用原子工具：

```
用户: 帮我连接到米家网关，登录码是 123456
Agent: 调用 mijia_auth({ passcode: "123456" })
       → { success: true, message: "连接成功" }

用户: 查看我的设备
Agent: 调用 mijia_get_devices()
       → { success: true, devices: [...], count: 10 }

用户: 创建一个晚上8点关灯的规则
Agent: 
  1. 调用 mijia_get_devices() 获取设备
  2. 调用 mijia_create_graph({ name: "晚8点关灯", nodes: [...] })
     → { success: true, graphId: "graph_xxx" }
```

### 6.4 注意事项

- **必须先认证**：调用其他工具前必须先调用 `mijia_auth`
- **单次连接**：MCP 进程生命周期内只维护一个 Gateway 连接
- **断开重连**：调用 `mijia_disconnect` 后可重新认证

---

## 7. 连接状态管理

### 7.1 状态检查

MCP Server 在每次工具调用前检查连接状态：

```typescript
// mcp/src/server.ts

function ensureConnected(): void {
    if (!gatewayManager.isConnected()) {
        throw new Error('网关未连接，请先调用 mijia_auth');
    }
}

function ensureNotConnected(): void {
    if (gatewayManager.isConnected()) {
        throw new Error('已连接，请先调用 mijia_disconnect');
    }
}
```

### 7.2 不自动重连

- 6位登录码无法自动获取
- 用户需主动确认重新认证
- 避免在未知状态下执行操作

---

## 8. 依赖关系

### 8.1 Core 依赖

Core 使用主项目的依赖，无需单独的 package.json：

```json
// 主项目 package.json 中的依赖
{
  "dependencies": {
    "ws": "^8.16.0",
    "elliptic": "^6.6.0",
    "bn.js": "^5.2.1"
  }
}
```

### 8.2 MCP Server 依赖

```json
// 主项目 package.json 中已包含
{
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.0.0",
    "zod": "^3.23.0"
  }
}
```

> 注意：MCP 和 Web 共用主项目的 package.json，通过 `@/core` 路径别名导入

---

## 9. 实施计划

### 阶段 1：Core 模块（2-3 天）

1. **创建 core 目录结构**
   ```
   src/core/
   ├── index.ts
   ├── gateway/
   │   ├── client.ts      # 从 src/server/gateway/client.ts 复制
   │   └── manager.ts      # 新建，封装连接管理
   ├── tools/
   │   ├── device.ts      # 从 src/server/ai/tools.ts 拆分
   │   ├── graph.ts       # 从 src/server/ai/tools.ts 拆分
   │   ├── variable.ts    # 从 src/server/ai/tools.ts 拆分
   │   └── base.ts        # validateGraph（从 validator/） + layoutNodes（从 tools/）
   └── types/
       ├── device.ts      # 从 src/shared/types.ts 拆分
       ├── graph.ts       # 从 src/server/validator/ 拆分
       └── index.ts
   ```

2. **抽取现有代码**

   **Gateway 层**：
   - 复制 `src/server/gateway/client.ts` 到 `src/core/gateway/`
   - 新建 `src/core/gateway/manager.ts`

   **工具层**（从 `src/server/ai/tools.ts` 拆分）：
   - `device.ts`: `getDevices`, `getDevice`
   - `graph.ts`: `getGraphs`, `getGraph`, `createGraph`, `updateGraph`, `deleteGraph`, `toggleGraph`
   - `variable.ts`: `getVariables`, `setVariable`
   - `base.ts`: `validateGraph`（来自 validator/） + `layoutNodes`（来自 tools.ts）

   **注意**：
   - **不要抽取** `think`, `ask_user`, `activate_skill`, `read_skill_file` → 保留在 src 层
   - **不要抽取** `skills/loader.ts` → 保留在 src 目录
   - `layoutNodes` 需要作为独立函数导出，因为 src 层需要调用

3. **创建 Core 索引**
   ```typescript
   // src/core/index.ts
   export { GatewayClient } from './gateway/client';
   export { createGatewayManager } from './gateway/manager';
   // ... 其他导出
   ```

### 阶段 2：Web 端迁移（1 天）

1. **Gateway 层改为从 Core 重新导出**
   - `src/server/gateway/client.ts` → 从 Core 重新导出
   - `src/server/gateway/shared.ts` → 使用 createGatewayManager

2. **创建 tools-adapter.ts**
   - 合并 Core 工具函数和 Agent 专用工具
   - 保留 `think`, `ask_user`, `activate_skill`, `read_skill_file`

3. **验证功能不变**
   - 启动 Web，测试登录、对话、工具调用
   - **重点测试 Skill 功能**：激活 Skill、读取 Skill 文件等

### 阶段 3：MCP Server（1-2 天）

1. **创建 mcp 目录**
   - 在 `src/mcp/` 下实现（TypeScript + ESM）

2. **实现 MCP Server**
   - 直接调用 Core 工具函数
   - 注册 14 个工具（Core 工具）

3. **测试验证**
   - 使用 OpenCode/Claude Code 连接测试

### 阶段 4：文档（1 天）

- [ ] 更新 README
- [ ] 编写 MCP 使用指南

---

## 10. 附录

### A. 工具返回格式

```typescript
// 成功
{ success: true, data: ..., message?: string }

// 失败
{ success: false, error: string }

// MCP 返回格式
{
    content: [{ type: "text", text: JSON.stringify(...) }],
    isError?: boolean  // 可选，标记为错误
}
```

### B. 错误处理

所有工具错误统一捕获，返回 JSON 格式错误信息：

```typescript
try {
    const result = await createGraph(gateway, args);
    return { content: [{ type: "text", text: JSON.stringify(result) }] };
} catch (error) {
    return {
        content: [{ type: "text", text: JSON.stringify({ success: false, error: String(error) }) }],
        isError: true
    };
}
```

### C. STDIO 日志规范

```typescript
// ✅ 正确 - 使用 console.error
console.error("Server started");
console.error("Error:", error);

// ❌ 错误 - 禁止使用 console.log
console.log("Processing");  // 会破坏 JSON-RPC 协议
```

### D. 参考资料

- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk) - 注意：实际使用 `@modelcontextprotocol/sdk`
- [MCP 官方文档 - Build Server](https://modelcontextprotocol.io/docs/develop/build-server)
- [MCP 规范](https://spec.modelcontextprotocol.io)
- [现有项目架构](./docs/)
