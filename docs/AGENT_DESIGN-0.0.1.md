# oh-my-sage 重构设计文档

## 概述

本次重构解决4个核心问题：
1. **解耦登录与设备加载** - 登录只认证，首页加载设备
2. **会话持久化** - 保存对话历史，支持恢复对话
3. **会话列表 UI** - 替换右侧进度面板
4. **Graph 管理** - 展示和管理自动化规则

---

## 1. 解耦登录与设备加载

### 现有问题

```
LoginPage → POST /api/devices (登录+获取设备耦合)
                ↓
            page.tsx (登录成功直接进入首页，无设备加载状态)
```

- `POST /api/devices` 同时处理登录和设备获取
- 登录成功后没有加载状态

### 目标架构

```
LoginPage → POST /api/auth (只认证)
                ↓
            page.tsx (进入首页，显示 loading)
                ↓
            GET /api/devices (异步加载设备)
                ↓
            设备列表渲染
```

### API 设计

#### 新增：POST /api/auth

**文件**: `src/app/api/auth/route.ts`

```typescript
// 请求
{
  passcode: string,      // 6位登录码
  gatewayUrl?: string    // 可选，网关地址
}

// 响应
{
  success: boolean,
  message: string
}
```

**逻辑**:
1. 验证 passcode 格式（6位数字）
2. 调用 `connectGateway(passcode, gatewayUrl)` 建立连接
3. 只做认证，不获取设备
4. 返回成功/失败

#### 修改：GET /api/devices

**文件**: `src/app/api/devices/route.ts`

**变更**:
- 删除 `POST` 方法（移除登录逻辑）
- 保留 `GET` 方法（获取设备列表）
- 添加连接状态检查

### 前端改造

#### LoginPage.tsx

```typescript
// 调用 /api/auth 而不是 /api/devices
const response = await fetch('/api/auth', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ passcode }),
});
```

#### page.tsx

```typescript
// 新增状态
const [devicesLoading, setDevicesLoading] = useState(false);

// 登录成功回调
const handleLoginSuccess = async (code: string) => {
  setPasscode(code);
  setIsLoggedIn(true);
  // 显示 loading，异步加载设备
  setDevicesLoading(true);
  await loadDevices(code);
  setDevicesLoading(false);
};

// UI 变化
<DevicePanel 
  loading={devicesLoading}  // 传入 loading 状态
  ...
/>
```

---

## 2. 会话持久化

### 现有问题

- 每次发消息创建新 Agent，历史丢失
- `messages` 存储在 Agent 实例中，重建即消失
- 无法查看历史对话

### 目标架构

```
.sessionstore/
├── session_001.jsonl    # Session 1 的对话记录
├── session_002.jsonl    # Session 2 的对话记录
└── index.json           # Session 索引（元数据）
```

### 数据结构

#### index.json - 会话索引

```typescript
interface SessionIndex {
  sessions: SessionMeta[];
}

interface SessionMeta {
  id: string;              // session_xxx
  title: string;           // AI 生成的标题（如"查询客厅灯状态"）
  summary: string;         // 对话摘要（最后一条用户消息）
  createdAt: string;       // ISO 时间戳
  updatedAt: string;       // ISO 时间戳
  messageCount: number;    // 消息数量
  isActive: boolean;       // 是否为当前活跃 session
}
```

#### session_xxx.jsonl - 对话记录

每行一个 JSON 对象，代表一条消息：

```typescript
interface SessionMessage {
  seq: number;             // 序号
  role: 'user' | 'assistant';
  content: string;         // 消息内容
  timestamp: string;       // ISO 时间戳
  // Assistant 消息额外字段
  thinking?: string;       // 思考过程
  toolCalls?: ToolCall[];  // 工具调用记录
}

interface ToolCall {
  tool: string;
  args: any;
  result: any;
  success: boolean;
}
```

### 会话存储实现

**文件**: `src/server/session/store.ts`

```typescript
class SessionStore {
  private baseDir: string;
  
  constructor(baseDir: string = '.sessionstore') {}
  
  // 创建新 session
  async createSession(title?: string): Promise<SessionMeta>
  
  // 获取 session 列表
  async listSessions(): Promise<SessionMeta[]>
  
  // 获取单个 session 的消息历史
  async getMessages(sessionId: string): Promise<SessionMessage[]>
  
  // 追加消息
  async appendMessage(sessionId: string, message: Omit<SessionMessage, 'seq'>): Promise<void>
  
  // 更新 session 元数据
  async updateSessionMeta(sessionId: string, updates: Partial<SessionMeta>): Promise<void>
  
  // 删除 session
  async deleteSession(sessionId: string): Promise<void>
  
  // 生成 session 标题（基于前几条消息）
  async generateTitle(sessionId: string): Promise<string>
}
```

### API 设计

#### GET /api/sessions

获取会话列表

```typescript
// 响应
{
  success: boolean,
  sessions: SessionMeta[]
}
```

#### POST /api/sessions

创建新会话

```typescript
// 请求
{
  title?: string  // 可选标题
}

// 响应
{
  success: boolean,
  session: SessionMeta
}
```

#### GET /api/sessions/[id]

获取会话详情和消息历史

```typescript
// 响应
{
  success: boolean,
  session: SessionMeta,
  messages: SessionMessage[]
}
```

#### DELETE /api/sessions/[id]

删除会话

#### PATCH /api/sessions/[id]

更新会话（如修改标题）

### Agent 改造

**文件**: `src/server/agent/agent.ts`

```typescript
class Agent {
  private sessionId: string | null = null;
  private sessionStore: SessionStore;
  
  constructor(gateway: GatewayClient, modelConfig?: ModelConfig) {
    this.sessionStore = new SessionStore();
  }
  
  // 设置当前 session
  setSession(sessionId: string): void
  
  // 加载 session 历史到 messages
  async loadSession(sessionId: string): Promise<void>
  
  // run 方法改造
  async *run(userInput?: string): AsyncGenerator<AgentOutput> {
    // 1. 保存用户消息到 session
    // 2. 执行 agent 循环
    // 3. 保存 assistant 响应到 session
  }
}
```

### Chat API 改造

**文件**: `src/app/api/chat/route.ts`

```typescript
export async function POST(request: NextRequest) {
  const { message, passcode, sessionId } = await request.json();
  
  const gateway = getGateway()!;
  const agent = new Agent(gateway, config);
  
  // 如果有 sessionId，加载历史
  if (sessionId) {
    await agent.loadSession(sessionId);
  }
  
  // 设置 session 用于保存
  agent.setSession(sessionId);
  
  // 执行对话
  for await (const output of agent.run(message)) {
    // 流式输出...
  }
}
```

---

## 3. 会话列表 UI

### 现有组件

`ProgressPanel.tsx` - 显示任务进度（将被替换）

### 新组件

**文件**: `src/components/SessionPanel.tsx`

```typescript
interface SessionPanelProps {
  sessions: SessionMeta[];
  activeSessionId?: string;
  loading?: boolean;
  onCreateSession: () => void;
  onSelectSession: (sessionId: string) => void;
  onDeleteSession: (sessionId: string) => void;
  onRefresh: () => void;
}
```

### UI 布局

```
┌─────────────────────────────┐
│ 对话历史          [新建] [刷新] │
├─────────────────────────────┤
│ 🔵 查询客厅灯状态           │
│    2024-03-21 10:30         │
│    5条消息                  │
├─────────────────────────────┤
│ ⚪ 创建自动化规则           │
│    2024-03-21 09:15         │
│    12条消息                 │
├─────────────────────────────┤
│ ⚪ 设备状态检查             │
│    2024-03-20 18:00         │
│    8条消息                  │
└─────────────────────────────┘
```

### page.tsx 改造

```typescript
// 移除 ProgressPanel，使用 SessionPanel
import SessionPanel from '@/components/SessionPanel';

// 新增状态
const [sessions, setSessions] = useState<SessionMeta[]>([]);
const [activeSessionId, setActiveSessionId] = useState<string | undefined>();

// 新建 session
const handleCreateSession = async () => {
  const response = await fetch('/api/sessions', { method: 'POST' });
  const { session } = await response.json();
  setSessions(prev => [session, ...prev]);
  setActiveSessionId(session.id);
  // 清空当前聊天
  // ...
};

// 选择 session
const handleSelectSession = async (sessionId: string) => {
  setActiveSessionId(sessionId);
  // 加载 session 消息历史到 Chat 组件
  const response = await fetch(`/api/sessions/${sessionId}`);
  const { messages } = await response.json();
  // 传递给 Chat 组件
};

// UI
<div style={{ width: 320 }}>
  <SessionPanel 
    sessions={sessions}
    activeSessionId={activeSessionId}
    onCreateSession={handleCreateSession}
    onSelectSession={handleSelectSession}
    onDeleteSession={handleDeleteSession}
    onRefresh={loadSessions}
  />
</div>
```

### Chat 组件改造

**文件**: `src/components/Chat.tsx`

```typescript
interface ChatProps {
  passcode?: string;
  sessionId?: string;
  initialMessages?: SessionMessage[];
}

// 当 sessionId 变化时，加载对应的消息
useEffect(() => {
  if (initialMessages) {
    setMessages(initialMessages.map(m => ({
      role: m.role,
      content: m.content,
      process: m.toolCalls ? { toolCalls: m.toolCalls, thinking: m.thinking || '' } : undefined,
    })));
  }
}, [sessionId, initialMessages]);
```

---

## 4. Graph 管理

### 现有 API

`/api/graphs` 已经支持 CRUD 和 PATCH（启用/禁用）

### 新组件

**文件**: `src/components/GraphPanel.tsx`

```typescript
interface GraphPanelProps {
  graphs: GraphSummary[];
  loading?: boolean;
  onRefresh: () => void;
  onToggle: (id: string, enable: boolean) => void;
  onDelete: (id: string) => void;
  onViewDetail: (id: string) => void;
}

interface GraphSummary {
  id: string;
  name: string;
  enable: boolean;
  nodeCount: number;
  lastUpdateTime?: number;
}
```

### UI 布局

```
┌─────────────────────────────┐
│ 自动化规则              [刷新] │
├─────────────────────────────┤
│ ✅ 晚间自动关灯             │
│    3个节点 | 10分钟前        │
│    [禁用] [删除]             │
├─────────────────────────────┤
│ ⭕ 早安唤醒                  │
│    5个节点 | 2小时前         │
│    [启用] [删除]             │
└─────────────────────────────┘
```

### 集成方案

**方案 A**: 在设备面板中添加标签页

```
┌─────────────────────────────┐
│ [设备] [规则]               │
├─────────────────────────────┤
│ 设备列表 / 规则列表         │
└─────────────────────────────┘
```

**方案 B**: 独立的规则面板（推荐）

在页面中间添加可折叠的规则面板，或作为设备面板的子标签。

### page.tsx 改造

```typescript
// 新增状态
const [graphs, setGraphs] = useState<GraphSummary[]>([]);
const [graphsLoading, setGraphsLoading] = useState(false);

// 加载规则列表
const loadGraphs = async () => {
  setGraphsLoading(true);
  try {
    const response = await fetch('/api/graphs');
    const result = await response.json();
    if (result.success) {
      setGraphs(result.graphs);
    }
  } finally {
    setGraphsLoading(false);
  }
};

// 切换规则状态
const handleToggleGraph = async (id: string, enable: boolean) => {
  const response = await fetch('/api/graphs', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, enable }),
  });
  const result = await response.json();
  if (result.success) {
    setGraphs(prev => prev.map(g => 
      g.id === id ? { ...g, enable } : g
    ));
    message.success(enable ? '规则已启用' : '规则已禁用');
  }
};

// 删除规则
const handleDeleteGraph = async (id: string) => {
  const response = await fetch(`/api/graphs?id=${id}`, { method: 'DELETE' });
  const result = await response.json();
  if (result.success) {
    setGraphs(prev => prev.filter(g => g.id !== id));
    message.success('规则已删除');
  }
};
```

### DevicePanel 改造

添加标签页切换设备和规则：

```typescript
// 使用 Tabs 组件
<Tabs
  items={[
    {
      key: 'devices',
      label: '设备',
      children: <DeviceList ... />
    },
    {
      key: 'graphs', 
      label: '规则',
      children: <GraphPanel ... />
    }
  ]}
/>
```

---

## 文件变更清单

### 新增文件

| 文件 | 说明 |
|------|------|
| `src/app/api/auth/route.ts` | 认证 API |
| `src/app/api/sessions/route.ts` | 会话列表 API |
| `src/app/api/sessions/[id]/route.ts` | 会话详情 API |
| `src/server/session/store.ts` | 会话存储实现 |
| `src/components/SessionPanel.tsx` | 会话列表组件 |
| `src/components/GraphPanel.tsx` | Graph 管理组件 |
| `.sessionstore/` | 会话存储目录（运行时创建） |

### 修改文件

| 文件 | 变更 |
|------|------|
| `src/app/api/devices/route.ts` | 删除 POST 方法 |
| `src/app/api/chat/route.ts` | 支持 sessionId |
| `src/server/agent/agent.ts` | 集成会话存储 |
| `src/app/page.tsx` | UI 布局改造 |
| `src/components/LoginPage.tsx` | 调用 /api/auth |
| `src/components/Chat.tsx` | 支持初始消息 |
| `src/components/DevicePanel.tsx` | 添加规则标签页 |

### 删除文件

| 文件 | 说明 |
|------|------|
| `src/components/ProgressPanel.tsx` | 被 SessionPanel 替代 |

---

## 实现顺序

### 阶段 1：解耦登录（低风险）

1. 创建 `src/app/api/auth/route.ts`
2. 修改 `src/app/api/devices/route.ts`（删除 POST）
3. 修改 `src/components/LoginPage.tsx`
4. 修改 `src/app/page.tsx`（添加加载状态）

### 阶段 2：会话存储（核心功能）

1. 创建 `src/server/session/store.ts`
2. 创建 `src/app/api/sessions/route.ts`
3. 创建 `src/app/api/sessions/[id]/route.ts`
4. 修改 `src/server/agent/agent.ts`

### 阶段 3：会话 UI（用户体验）

1. 创建 `src/components/SessionPanel.tsx`
2. 删除 `src/components/ProgressPanel.tsx`
3. 修改 `src/components/Chat.tsx`
4. 修改 `src/app/page.tsx`

### 阶段 4：Graph 管理（增强功能）

1. 创建 `src/components/GraphPanel.tsx`
2. 修改 `src/components/DevicePanel.tsx`
3. 修改 `src/app/page.tsx`

---

## 数据流示例

### 登录流程

```
用户输入 passcode
    ↓
POST /api/auth { passcode }
    ↓
connectGateway(passcode)
    ↓
返回 { success: true }
    ↓
page.tsx: setIsLoggedIn(true), setDevicesLoading(true)
    ↓
GET /api/devices
    ↓
gateway.callApi('getDevList')
    ↓
返回设备列表
    ↓
渲染 DevicePanel
```

### 对话流程

```
用户发送消息
    ↓
POST /api/chat { message, sessionId }
    ↓
agent.loadSession(sessionId)  // 加载历史
    ↓
agent.setSession(sessionId)   // 设置用于保存
    ↓
agent.run(message)
    ↓
// 1. 保存用户消息到 .sessionstore/session_xxx.jsonl
// 2. 执行 agent 循环
// 3. 保存 assistant 响应到 .sessionstore/session_xxx.jsonl
// 4. 更新 index.json
    ↓
流式输出响应
```

### 切换会话流程

```
用户点击 session
    ↓
GET /api/sessions/{id}
    ↓
返回 { session, messages }
    ↓
Chat 组件: setMessages(转换后的消息)
    ↓
显示历史对话
```

---

## 注意事项

1. **并发安全**: 会话写入时需要加锁或使用仅追加模式
2. **文件大小**: 长对话的 JSONL 文件可能很大，考虑分页加载
3. **标题生成**: 可以使用 LLM 生成，也可以简单取前几条消息
4. **向后兼容**: 保留原有 API 接口，新增功能不影响现有逻辑
5. **错误处理**: Session 读写失败不应阻断对话流程

---

## 测试要点

1. 登录流程只认证，不获取设备
2. 首页显示设备加载状态
3. 创建新会话后可以开始对话
4. 历史会话消息可以正确恢复
5. 会话列表显示正确的标题和摘要
6. 规则列表正确显示
7. 规则启用/禁用状态同步
8. 删除会话后清理文件
