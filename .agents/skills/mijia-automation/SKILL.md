---
name: mijia-automation
description: 米家自动化极客版规则与变量管理指南。当用户想要创建智能场景、设备联动、定时任务、条件触发，或创建、读取、修改、删除自动化变量时使用此skill。
metadata:
  author: oh-my-sage
  version: "3.5"
---

# 米家自动化规则创建

## 变量生命周期能力

变量管理分为三层，不能把其中一层的限制误判成网关不支持：

| 层级 | 能力与限制 |
|------|------------|
| 网关 API | 支持 `createVar`、`deleteVar`、`getVarValue`、`getVarConfig`、`setVarValue` |
| 专用 MCP 工具 | 使用 `mijia_create_variable`、`mijia_delete_variable`、`mijia_get_variable_value`、`mijia_get_variable_config`、`mijia_set_variable` |
| 通用原始 API 工具 | `mijia_call_api` 故意只允许只读方法；写方法被拒绝不代表网关没有写能力 |

关键规则：

- 新建变量必须调用 `mijia_create_variable`；`mijia_set_variable` 只修改已存在变量，不会自动创建。
- `varSetNumber`、`varSetString`、`deviceInputSetVar` 和 `deviceGetSetVar` 只写已存在变量，不能用作变量创建器。
- 变量 ID 必须匹配 `^[a-zA-Z0-9]+$`，不能含下划线、连字符或中文；显示名称 `name` 可以包含中文。
- `type` 只能是 `number` 或 `string`，初始值和后续值必须与类型一致。
- 删除变量前检查所有规则引用；删除是不可恢复操作。

### 工具缺失或写入失败时

按以下顺序判断，不要直接宣布“网关无法读写变量”：

1. 查看当前 MCP 工具列表是否包含上述专用变量工具。
2. 工具缺失时检查运行中的 MCP 是否为旧构建；源码新增工具后必须重新构建并重启 MCP，当前进程不会动态注册新工具。
3. 检查 `src/core/tools/variable.ts`、`src/mcp/tools/variable.ts` 和实际运行的 `dist`，确认功能是未实现、未构建还是未加载。
4. `mijia_set_variable` 返回变量不存在时，改用 `mijia_create_variable`，不要尝试用规则节点自动创建。
5. `mijia_call_api` 拒绝 `createVar` 等写方法时，改用专用工具，不要放宽通用工具的只读白名单。
6. 若怀疑功能曾存在但被回归删除，检查 Git 历史或会话中的真实工具调用记录，再下结论。

实机验证过的生命周期：创建临时变量 -> 读取配置和值 -> 修改 -> 回读 -> 删除 -> 再次读取确认不存在。创建或恢复变量工具后应完整执行一次该流程，并清理临时变量。

发现网关尚未封装的新能力时，读取 [网关能力发现方法](references/gateway-capability-discovery.md)。不要靠猜测 API 名称，也不要因为当前 MCP 没有工具就判定网关不支持。

## 规则结构

```json
{
  "id": "graph_时间戳",
  "nodes": [节点1, 节点2, ...],
  "cfg": {
    "id": "graph_时间戳",
    "enable": true,
    "uiType": "graph",
    "userData": {
      "name": "规则名称",
      "lastUpdateTime": 1710000000000,
      "transform": {"x": 0, "y": 0, "scale": 1, "rotate": 0}
    }
  }
}
```

**节点位置自动布局**：create_graph 会根据节点连接关系自动计算位置，无需手动设置 `cfg.pos`。布局规则：
- 从左到右表示流程方向
- 分支节点上下排列
- 节点尺寸：528×164

## 关键校验规则

1. **节点 id**：只允许 `[0-9a-zA-Z]`，不能用下划线、连字符
2. **outputs 连接格式**：`"portName": ["nodeId.inputPort"]`（必须是点分隔，如 `"cond1.trigger"`）
   - ❌ 错误：`"output": ["range1"]`（缺少 `.inputPort`）
   - ✅ 正确：`"output": ["range1.trigger"]`
3. **outputs 值必须是数组**：`"output": []` ✓，`"output": null` ✗
4. **所有节点必须声明 outputs 端口**：即使没有输出连接，也要声明端口（如 `"outputs": {"output": []}`）
5. **deviceGet**：必须有 `outputs.output` 和 `outputs.output2`
6. **inputs 命名**：
   - `deviceGet`, `varGet`, `statusLast`, **`delay`** 用 `input`
   - `deviceOutput`, `condition` 等用 `trigger`
   - `timeRange`, `alarmClock` 等**状态节点没有输入端口**（`inputs: {}`）
7. **dtype 映射**：`bool`→`boolean`，`uint8`/`int32`→`int`，`float`→`float`
8. **props 必须存在**：`"props": {}` 不能省略
9. **cfg.name**：值为节点类型名（如 `"deviceInput"`）
10. **cfg.unit/value**：delay 节点的 `cfg.unit` 和 `cfg.value` 是可选的（UI 显示用）

## inputs/outputs 工作机制

### inputs 中的 null 是什么？

`"inputs": {"trigger": null}` 中的 `null` **不是"未连接"**，而是**声明端口存在**。信号实际由上游节点的 `outputs` 数组传来。

```
上游 outputs 数组 ──→ 决定 → 下游 inputs 端口
"output": ["cond1.trigger"]      "inputs": {"trigger": null}  ← 端口声明，null 是正确的
```

### outputs 数组决定连接关系

整个规则的**连接关系完全由每个节点的 outputs 数组决定**，inputs 只是端口声明。生成规则后必须逐个检查每个节点的 outputs 数组，确保：
1. 引用的目标节点 ID 存在
2. 引用的端口名是目标节点 inputs 中声明的端口名
3. 点分隔格式正确：`"目标节点ID.目标端口名"`

### state 节点 vs event 节点

| 类型 | 特征 | inputs | 代表节点 |
|------|------|--------|----------|
| **event 节点** | 可被触发 | 有 trigger/input 端口 | deviceOutput, condition, delay |
| **state 节点** | 不能被触发 | `inputs: {}`（空） | timeRange, alarmClock, deviceInputSetVar |

**⚠️ state 条件节点通常连接 `condition.condition`，也可以先进入 `logicOr` / `logicAnd` / `logicNot`，再连接 `condition.condition`。state 节点没有输入端口，不能接收事件触发。**

### ⚠️ 网关不检查连接完整性（已验证）

网关 `setGraph` **只校验节点级别结构**（字段类型、必填字段），**不校验连接级别的逻辑完整性**。以下错误都能通过网关校验但在运行时不工作：
- condition 的 condition 端口未连接 → 网关允许保存，但实测不会执行 met 分支
- deviceGet.output2 连到 state 节点 → 通过校验，但语义错误

**因此，生成规则后必须自行验证连接完整性**，不能依赖网关报错。

## 工作流程（必须遵循）

当用户要求创建/修改自动化规则时，按以下步骤执行：

1. **理解需求**：分析用户的自动化逻辑，确定需要哪些节点
2. **生成节点列表**：按照节点模板和连接规则构建 nodes 数组
3. **调用 validate_graph 校验**：使用 `validate_graph` 工具传入完整的 graph JSON（nodes + cfg），检查连接完整性
4. **修复错误**：如果校验器报告 error 级别的问题，修复节点连接后重新校验，直到全部通过
5. **调用 create_graph 或 update_graph**：校验通过后调用创建/更新工具（注意：create_graph 和 update_graph 内部也会自动校验，如有错误会拒绝执行）
6. **确认结果**：向用户确认规则创建成功

**⚠️ create_graph / update_graph 内置了校验逻辑。如果节点连接有 error 级别的问题，工具会返回错误并拒绝调用 setGraph。修复后重新调用即可。**

## 节点模板（直接复制使用）

### deviceInput - 设备触发（属性变化）
```json
{"id":"$ID","type":"deviceInput","cfg":{"urn":"$URN","name":"deviceInput","version":1},"props":{"did":"$DID","siid":$SIID,"piid":$PIID,"preload":false,"dtype":"$DTYPE","operator":"=","v1":$V1},"inputs":{},"outputs":{"output":["$NEXT.trigger"]}}
```

### deviceInput - 设备触发（事件）
```json
{"id":"$ID","type":"deviceInput","cfg":{"urn":"$URN","name":"deviceInput","version":1},"props":{"did":"$DID","siid":$SIID,"eiid":$EIID,"preload":false},"inputs":{},"outputs":{"output":["$NEXT.trigger"]}}
```

### deviceOutput - 控制设备（设置属性）
```json
{"id":"$ID","type":"deviceOutput","cfg":{"urn":"$URN","name":"deviceOutput","version":1},"props":{"did":"$DID","siid":$SIID,"piid":$PIID,"value":$VALUE},"inputs":{"trigger":null},"outputs":{"output":[]}}
```

### deviceOutput - 控制设备（执行动作）
```json
{"id":"$ID","type":"deviceOutput","cfg":{"urn":"$URN","name":"deviceOutput","version":1},"props":{"did":"$DID","siid":$SIID,"aiid":$AIID,"ins":[{"piid":$PIID,"value":$VALUE}]},"inputs":{"trigger":null},"outputs":{"output":[]}}
```

### deviceGet - 查询状态
```json
{"id":"$ID","type":"deviceGet","cfg":{"urn":"$URN","name":"deviceGet","version":1},"props":{"did":"$DID","siid":$SIID,"piid":$PIID,"dtype":"$DTYPE","operator":"=","v1":$V1},"inputs":{"input":null},"outputs":{"output":["$NEXT1.trigger"],"output2":["$NEXT2.trigger"]}}
```
⚠️ `inputs` 必须用 `input`，不是 `trigger`。`output` 和 `output2` 都应连到 event 节点（如 condition.trigger）。禁止将 output2 连到 state 节点。

### alarmClock - 定时触发（state 节点）
```json
{"id":"$ID","type":"alarmClock","cfg":{"name":"alarmClock","version":1,"happenType":"now","tempOffset":0},"props":{"type":"periodicAlarm","hour":$H,"minute":$M,"second":0,"filter":{"day":[0,1,2,3,4,5,6]}},"inputs":{},"outputs":{"output":["$NEXT.input"]}}
```
⚠️ state 节点，`inputs: {}`。连 delay 用 `delay1.input`，连 condition 用 `cond1.trigger`。禁止任何节点的 output 连到 alarmClock。

### timeRange - 时间段（state 节点）
```json
{"id":"$ID","type":"timeRange","cfg":{"name":"timeRange","version":1},"props":{"start":{"hour":$SH,"minute":$SM,"second":0},"end":{"hour":$EH,"minute":$EM,"second":0},"filter":{"day":[0,1,2,3,4,5,6]}},"inputs":{},"outputs":{"output":["$NEXT.condition"]}}
```
⚠️ state 节点，`inputs: {}`。`output` 可直接连到 `condition.condition`，也可连到 `logicOr.inputN` / `logicAnd.inputN` / `logicNot.input` 后再进入 `condition.condition`。多分支时 output 数组可包含多个目标。禁止任何节点的 output 连到 timeRange。禁止使用 output2。

### delay - 延时
```json
{"id":"$ID","type":"delay","cfg":{"name":"delay","version":1,"unit":"s","value":$SEC},"props":{"timeout":$MS},"inputs":{"input":null},"outputs":{"output":["$NEXT.input"]}}
```
⚠️ `inputs` 必须是 `{"input": null}`（用 input，不是 trigger）。`props.timeout` 是实际执行的毫秒数（整数）。`cfg.unit` 和 `cfg.value` 是 UI 显示用的，可选。

### condition - 当-如果-就（条件判断）
```json
{"id":"$ID","type":"condition","cfg":{"name":"condition","version":1},"props":{},"inputs":{"trigger":null,"condition":null},"outputs":{"met":["$NEXT1.trigger"],"unmet":["$NEXT2.trigger"]}}
```
⚠️ **`trigger` 和 `condition` 必须都有信号来源**，缺一不可。`trigger` = "当"（event 节点触发），`condition` = "如果"（state/logic 节点提供条件值）。`condition` 未连接时网关虽允许保存，但实测不会执行 met 分支；`trigger` 未连接时节点不会被触发。

### signalOr - 任一事件
```json
{"id":"$ID","type":"signalOr","cfg":{"name":"signalOr","version":1},"props":{},"inputs":{"input0":null,"input1":null},"outputs":{"output":["$NEXT.trigger"]}}
```
⚠️ 输入名格式必须是 `input` + 连续数字（input0, input1, ...）。

### logicOr - 满足任一条件
```json
{"id":"$ID","type":"logicOr","cfg":{"name":"logicOr","version":1},"props":{},"inputs":{"input0":null,"input1":null},"outputs":{"output":["$NEXT.condition"]}}
```
⚠️ inputs 值可以是 `boolean | null`（状态条件）。

### logicAnd - 满足全部条件
```json
{"id":"$ID","type":"logicAnd","cfg":{"name":"logicAnd","version":1},"props":{},"inputs":{"input0":null,"input1":null},"outputs":{"output":["$NEXT.condition"]}}
```

### logicNot - 状态取反
```json
{"id":"$ID","type":"logicNot","cfg":{"name":"logicNot","version":1},"props":{},"inputs":{"input":null},"outputs":{"output":["$NEXT.condition"]}}
```

### loop - 循环
```json
{"id":"$ID","type":"loop","cfg":{"name":"loop","version":1},"props":{"interval":$MS},"inputs":{"start":null,"stop":null},"outputs":{"output":["$NEXT.trigger"]}}
```
⚠️ `inputs` 是 `{start, stop}`，不是 `input`。已验证。

### onlyNTimes - 最多触发N次
```json
{"id":"$ID","type":"onlyNTimes","cfg":{"name":"onlyNTimes","version":1},"props":{"n":$N},"inputs":{"input":null,"zero":null},"outputs":{"output":["$NEXT.trigger"]}}
```

### counter - 达到N次时触发
```json
{"id":"$ID","type":"counter","cfg":{"name":"counter","version":1},"props":{"n":$N},"inputs":{"input":null,"zero":null},"outputs":{"output":["$NEXT.trigger"]}}
```

### modeSwitch - 模式切换
```json
{"id":"$ID","type":"modeSwitch","cfg":{"name":"modeSwitch","version":1},"props":{},"inputs":{"input":null},"outputs":{"output0":[],"output1":[],"output2":[]}}
```
⚠️ outputs 根据模式数量声明 output0, output1, ...

### register - 自定义布尔状态
```json
{"id":"$ID","type":"register","cfg":{"name":"register","version":1},"props":{},"inputs":{"setTrue":null,"setFalse":null},"outputs":{"output":["$NEXT.trigger"]}}
```

### onLoad - 启用时触发（state 节点）
```json
{"id":"$ID","type":"onLoad","cfg":{"name":"onLoad","version":1},"props":{},"inputs":{},"outputs":{"output":["$NEXT.trigger"]}}
```

### statusLast - 状态持续一段时间
```json
{"id":"$ID","type":"statusLast","cfg":{"name":"statusLast","version":1},"props":{"timeout":$MS},"inputs":{"input":null},"outputs":{"output":["$NEXT.trigger"]}}
```

### eventSequence - 事件先后发生
```json
{"id":"$ID","type":"eventSequence","cfg":{"name":"eventSequence","version":1},"props":{"timeout":$MS},"inputs":{"input1":null,"input2":null},"outputs":{"output":["$NEXT.trigger"]}}
```

### varSetNumber - 数值运算
```json
{"id":"$ID","type":"varSetNumber","cfg":{"name":"varSetNumber","version":1},"props":{"scope":"global","id":"$VAR_ID","elements":[{"type":"const","value":"$ + 1"}]},"inputs":{"input":null},"outputs":{"output":["$NEXT.trigger"]}}
```
⚠️ inputs 是 `input`，不是 `trigger`。

### varSetString - 文本拼接
```json
{"id":"$ID","type":"varSetString","cfg":{"name":"varSetString","version":1},"props":{"scope":"global","id":"$VAR_ID","elements":[{"type":"const","value":"文本"}]},"inputs":{"input":null},"outputs":{"output":["$NEXT.trigger"]}}
```

### deviceInputSetVar - 设备触发赋值（state 节点）
```json
{"id":"$ID","type":"deviceInputSetVar","cfg":{"urn":"$URN","name":"deviceInputSetVar","version":1},"props":{"did":"$DID","siid":$SIID,"piid":$PIID,"dtype":"number","scope":"global","id":"$VAR_ID","preload":false},"inputs":{},"outputs":{"output":["$NEXT.trigger"]}}
```
⚠️ state 节点，`inputs: {}`。dtype 用 `"number"` 而非 `"int"`/`"float"`。

### deviceGetSetVar - 查询设备赋值
```json
{"id":"$ID","type":"deviceGetSetVar","cfg":{"urn":"$URN","name":"deviceGetSetVar","version":1},"props":{"did":"$DID","siid":$SIID,"piid":$PIID,"dtype":"number","scope":"global","id":"$VAR_ID"},"inputs":{"input":null},"outputs":{"output":["$NEXT1.trigger"],"output2":["$NEXT2.trigger"]}}
```
⚠️ 同 deviceGet，`inputs` 用 `input`，outputs 必须有 `output` 和 `output2`。

### varChange - 变量值更新时触发（state 节点）
```json
{"id":"$ID","type":"varChange","cfg":{"name":"varChange","version":1},"props":{"scope":"global","id":"$VAR_ID","varType":"number","preload":true,"operator":">=","v1":$V1},"inputs":{},"outputs":{"output":["$NEXT.trigger"]}}
```

### varGet - 查询变量值
```json
{"id":"$ID","type":"varGet","cfg":{"name":"varGet","version":1},"props":{"scope":"global","id":"$VAR_ID","varType":"number","operator":">=","v1":$V1},"inputs":{"input":null},"outputs":{"output":["$NEXT1.trigger"],"output2":["$NEXT2.trigger"]}}
```
⚠️ 同 deviceGet，`inputs` 用 `input`，outputs 必须有 `output` 和 `output2`。

## 操作符与 dtype

| dtype | 允许的 operator | v1 值类型 |
|-------|----------------|----------|
| boolean | `=` | true/false |
| int | `>=`, `<=`, `=`, `!=`, `>`, `<`, `between`, `include` | 整数 |
| float | `>`, `<`, `between` | 数字 |
| string | `=` | 字符串 |

## 设备控制常见模式

- 开关灯：`siid=2, piid=1, value=true/false`
- 亮度：`siid=2, piid=2, value=1-100`
- 窗帘开合：`siid=2, piid=1, value=0-100`

## 详细参考

- [完整节点定义与校验规则](references/mijia-complete-reference.md)
