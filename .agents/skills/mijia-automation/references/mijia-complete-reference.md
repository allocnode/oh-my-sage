# 米家自动化规则完全参考

> 基于小米米家自动化极客版网关源码（gateway.6cbc85.js）校验逻辑编写
> 每个字段的类型和约束都来自网关 `checkWebNode` 的实际校验

---

## 目录

- [通用规则](#通用规则)
- [设备 URN 与能力发现](#设备-urn-与能力发现)
- [设备类节点](#设备类节点)
- [时间类节点](#时间类节点)
- [流程类节点](#流程类节点)
- [逻辑类节点](#逻辑类节点)
- [其他类节点](#其他类节点)
- [变量类节点](#变量类节点)
- [完整规则结构](#完整规则结构)
- [完整示例](#完整示例)

---

## 通用规则

### 节点基础结构

```json
{
  "id": "node1",
  "type": "deviceInput",
  "cfg": {
    "urn": "urn:miot-spec-v2:device:light:0000A001:xiaomi-btlm2p:2",
    "pos": {"x": 100, "y": 100, "width": 528, "height": 164},
    "name": "deviceInput",
    "version": 1
  },
  "props": { ... },
  "inputs": { ... },
  "outputs": { ... }
}
```

### 全局校验（所有节点）

| 字段 | 类型 | 校验规则 |
|------|------|----------|
| id | string | 只允许 `[0-9a-zA-Z]`，不能含下划线、连字符、空格等 |
| type | string | 必须是已知类型 |
| cfg | object | 不能为 null |
| cfg.version | integer | 必须存在且为整数（实际值 0 或 1，非 2） |
| cfg.name | string | 节点类型名（如 `"deviceInput"`, `"deviceOutput"`） |
| cfg.urn | string | 设备 URN（设备类节点必须） |
| cfg.pos | object | 位置信息 `{x, y, width, height}` |
| props | object | **必须存在**（可以为空对象 `{}`），缺少会报 "Invalid props" |
| inputs | object | 不能为 null |
| outputs | object | 不能为 null，**必须声明输出端口**（如 `{"output": []}`） |

**⚠️ cfg.simplified 字段已废弃，不要添加。**
**⚠️ props 字段必须存在，即使没有属性也要写 `"props": {}`。** ✅ 已验证
**⚠️ outputs 的值必须是数组 `[]`，不能是 `null`。** ✅ 已验证
**⚠️ 所有节点必须声明 outputs 端口，即使没有输出连接。** ✅ 已验证

### outputs 连接格式

```json
"outputs": {
  "output": ["node2.trigger"]
}
```

- 值是字符串数组，每个元素是 `"目标节点ID.目标输入端口名"`（点分隔）
- ✅ `"output": ["node2.trigger"]`
- ❌ `"output": [["node2", "trigger"]]` — 网关校验：`r.split(".").length` 必须等于 2
- ❌ `"output": ["node2"]` — 必须包含 `.` 分隔符
- 空连接：`"output": []`
- 多个目标：`"output": ["cond2.condition", "cond3.condition"]`（一个 output 连多个下游）

### inputs 端口声明机制

`"inputs": {"trigger": null}` 中的 `null` **不是"未连接"**，而是**声明端口存在**。信号由上游节点的 `outputs` 数组传来。

```
上游 node 的 outputs ──→ 下游 node 的 inputs
"output": ["cond1.trigger"]    "inputs": {"trigger": null}  ← 端口声明
```

**连接关系完全由 outputs 数组决定**。inputs 只声明"我有哪些端口"。生成规则后必须逐个检查每个节点的 outputs 数组，确保：
1. 引用的目标节点 ID 存在
2. 引用的端口名是目标节点 inputs 中声明的端口名
3. 点分隔格式正确：`"目标节点ID.目标端口名"`

**⚠️ 一个输入口只能接一条线**（硬约束）：同一个下游输入端口 `目标节点ID.端口名` 在整条规则里**只能被一个上游 `outputs` 数组指向**。多源汇聚（多个事件源触发同一节点）**必须先经过 `signalOr`（任一事件）**，再由 `signalOr.output` 单独连到目标输入。反例：`A.output` 与 `B.output` 都写 `["cond1.trigger"]` 是错误连线；正例：`A.output → or1.input0`、`B.output → or1.input1`，再由 `or1.output → cond1.trigger`。这条规则与下方"一个 output 可以连多个下游"（扇出）**不冲突**——扇出允许，扇入不允许。

### ⚠️ 网关不检查连接完整性（已验证）

网关 `setGraph` **只校验节点级别结构**（字段类型、必填字段），**不校验连接级别的逻辑完整性**。以下错误都能通过网关校验但在运行时不工作：
- condition 的 condition 端口未连接 → 网关允许保存，但实测不会执行 met 分支
- deviceGet.output2 连到 state 节点 → 通过校验，但语义错误
- 任何节点的 output 连到 timeRange → 通过校验，但 timeRange 没有输入端口

**因此，生成规则后必须自行验证连接完整性**，不能依赖网关报错。

### 事件源、条件状态和流程节点

| 类型 | 特征 | 代表节点 |
|------|------|----------|
| **事件源** | 无输入，主动产生流程事件 | deviceInput, alarmClock, onLoad, varChange |
| **条件状态源/变换** | 向 condition 或 logic 提供布尔状态 | timeRange, 设备属性状态, logicOr, logicAnd, logicNot |
| **流程节点** | 接收事件后查询、判断、延时或执行 | deviceGet, condition, delay, deviceOutput |

**无输入节点不能接收上游连接。条件状态可直接连接 `condition.condition`，也可先进入 `logicOr` / `logicAnd` / `logicNot`，再由逻辑节点连接 `condition.condition`。**

### 已知全部节点类型

```
设备类：deviceInput, deviceGet, deviceOutput
时间类：alarmClock, timeRange, delay, statusLast, eventSequence
流程类：condition, loop, onlyNTimes, counter, modeSwitch
逻辑类：signalOr, logicOr, logicAnd, logicNot
其他类：register, onLoad, nop
变量类：deviceInputSetVar, deviceGetSetVar, varChange, varGet, varSetNumber, varSetString
```

---

## 设备 URN 与能力发现

### URN 格式

```
urn:miot-spec-v2:{类型}:{子类型}:{厂商代码}:{型号}:{版本}:{其他}
```

示例：
```
urn:miot-spec-v2:device:light:0000A001:xiaomi-btlm2p:2:0000C802
urn:miot-spec-v2:service:light:00007802:xiaomi-btlm2p:2
urn:miot-spec-v2:property:on:00000006:00000001
```

### 设备基本信息（getDevList 返回）

每个设备的信息结构：

```json
{
  "specV2Access": true,        // 是否支持 MIOT Spec V2 协议
  "specV3Access": false,       // 是否支持 MIOT Spec V3 协议
  "online": true,              // 是否在线
  "pushAvailable": true,       // 是否可接收推送消息
  "name": "客厅灯",            // 用户自定义名称
  "model": "xiaomi.light.btlm2p",    // 设备型号标识符
  "modelName": "米家筒灯2 Pro",      // 产品名称
  "urn": "urn:miot-spec-v2:device:light:0000A001:xiaomi-btlm2p:2:0000C802",
  "roomId": "$ROOM_ID",        // 所属房间ID（合成占位符）
  "roomName": "客厅",          // 所属房间名称
  "icon": "https://..."        // 设备图标URL
}
```

| 字段 | 类型 | 说明 |
|------|------|------|
| specV2Access | boolean | 是否支持 MIOT Spec V2；用于发现可配置字段 |
| specV3Access | boolean | 是否支持 MIOT Spec V3 |
| online | boolean | 设备是否在线（离线设备无法触发） |
| pushAvailable | boolean | 设备是否可推送属性变化 |
| name | string | 用户自定义设备名称（如"客厅灯"） |
| model | string | 设备型号标识符（如 xiaomi.aircondition.c16） |
| modelName | string | 设备产品名称（如 米家空调 巨省电） |
| urn | string | MIOT 设备类型标识符 |
| roomId | string | 所属房间ID |
| roomName | string | 所属房间名称（如"客厅"） |
| icon | string | 设备图标 URL |

**判断层次**：Spec 和字段可发现决定能否建图；`online=true` 决定当前是否适合实测。离线不必然禁止保存规则，但无法证明当前可运行。

### MIOT Spec 网站查询

通过 URN 访问 MIOT Spec 网站获取设备详细能力信息：

```
https://miot-spec.org/miot-spec-v2/instance?type=<设备URN>
```

返回结构：
```json
{
  "description": "米家筒灯2 Pro 蓝牙Mesh版",
  "services": [
    {
      "iid": 1,
      "type": "urn:miot-spec-v2:service:device-information:00007801:xiaomi-btlm2p:2",
      "description": "设备信息",
      "properties": [...],
      "events": [...],
      "actions": [...]
    },
    {
      "iid": 2,
      "type": "urn:miot-spec-v2:service:light:00007802:xiaomi-btlm2p:2",
      "description": "灯光",
      "properties": [
        {
          "iid": 1,
          "type": "urn:miot-spec-v2:property:on:00000006",
          "description": "开关",
          "format": "bool",
          "access": ["read", "write", "notify"]
        }
      ],
      "events": [...],
      "actions": [...]
    }
  ]
}
```

**每个 service 包含**：
- `iid` — 服务ID（即 siid）
- `type` — 服务 URN
- `description` — 服务描述
- `properties` — 属性列表（每个有 iid=piid, format=dtype, access）
- `events` — 事件列表（每个有 iid=eiid, arguments）
- `actions` — 动作列表（每个有 iid=aiid, in=[piid列表])

**每个 property 包含**：
- `iid` — 属性ID（即 piid）
- `format` — 数据类型（bool/uint8/uint16/int32/float/string）
- `access` — 访问权限数组：`read`(查询), `write`(设置), `notify`(上报)
- `value-range` — 值范围 [min, max, step]（可选）
- `value-list` — 枚举值列表 [{value, description}]（可选）

**每个 action 包含**：
- `iid` — 动作ID（即 aiid）
- `in` — 输入参数 piid 数组（引用 property）

### 获取设备信息的完整流程

```
1. 使用 get_devices 获取设备列表
   → 得到每个设备的 did 和 urn

2. 从设备信息中获取 urn 字段
   → 例: "urn:miot-spec-v2:device:light:0000A001:xiaomi-btlm2p:2:0000C802"

3. 访问 MIOT Spec 获取详细信息
   → GET https://miot-spec.org/miot-spec-v2/instance?type=<urn>
   → 或通过网关内置 specParser.parse(urn) 获取

4. 从 services 中找到对应的 siid, piid, eiid, aiid
   → deviceInput:  找 access 含 notify 的 property → siid+piid
                   或找 event → siid+eiid
   → deviceOutput: 找 access 含 write 的 property → siid+piid
                   或找 action → siid+aiid，action.in 给出 ins 中的 piid 列表
   → deviceGet:    找 access 含 read 的 property → siid+piid
```

### 内部能力发现流程（网关 specParser）

网关内置的 specParser 会自动将 MIOT Spec 解析为 5 类能力：

```
设备 URN → specParser.parse(urn) → 返回设备能力

返回 5 类能力：
  propertyNotify  — 属性上报（access 含 "notify"）→ deviceInput 用
  propertySet     — 属性设置（access 含 "write"）→ deviceOutput 用
  propertyGet     — 属性查询（access 含 "read"）→ deviceGet 用
  event           — 事件（如按钮按下、场景触发）
  action          — 可执行动作（如开关、调亮度）
```

每类能力条目结构：
```json
{
  "siid": 2,              // 服务ID
  "piid": 1,              // 属性ID（仅 property 类型有）
  "eiid": 1,              // 事件ID（仅 event 类型有）
  "aiid": 1,              // 动作ID（仅 action 类型有）
  "sUrn": "urn:miot-spec-v2:service:light:00007802:xiaomi-btlm2p:2",
  "urn": "urn:miot-spec-v2:property:on:00000006",
  "sDescription": "灯光",
  "description": "开关",
  "dtype": "boolean",
  "proprietary": false,
  "valueRange": {"min": 1, "max": 100, "step": 1},
  "valueList": [{"value": 0, "description": "关闭"}, {"value": 1, "description": "开启"}]
}
```

### 节点类型 ↔ 能力映射

```javascript
deviceInput:       [event, propertyNotify]   // 事件 或 属性上报
deviceInputSetVar: [event, propertyNotify]   // 同上，触发后赋值
deviceOutput:      [action, propertySet]     // 动作 或 属性设置
deviceGet:         [propertyGet]             // 查询属性
deviceGetSetVar:   [propertyGet]             // 查询后赋值
```

### 常用服务类型

| 服务 | siid | 说明 | 常见操作 |
|------|------|------|----------|
| device-information | 1 | 设备信息 | 只读 |
| light | 2 | 灯光控制 | 开关、亮度、色温 |
| switch | 2 | 开关控制 | 开关 |
| environment | 3 | 环境传感器 | 温度、湿度 |
| occupancy-sensor | 2 | 人体传感器 | 人体存在、移动 |
| physical-button | 3 | 物理按键 | 按钮事件 |
| gateway | 4 | 网关场景 | 场景触发 |

### 常用属性 URN

| URN | 说明 | 值类型 | 范围 |
|-----|------|--------|------|
| `urn:miot-spec-v2:property:on:00000006` | 开关 | boolean | true/false |
| `urn:miot-spec-v2:property:brightness:00000005` | 亮度 | int | 1-100 |
| `urn:miot-spec-v2:property:color-temperature:0000000F` | 色温 | int | 2700-6500 |
| `urn:miot-spec-v2:property:temperature:00000020` | 温度 | float | - |
| `urn:miot-spec-v2:property:relative-humidity:00000022` | 湿度 | float | 0-100 |
| `urn:miot-spec-v2:property:motion-state:0000007D` | 人体移动 | boolean | true/false |
| `urn:miot-spec-v2:property:contact-state:0000007C` | 门窗状态 | boolean | true/false |
| `urn:miot-spec-v2:property:illumination:0000007A` | 光照度 | int | - |

### 常见设备类型 URN

| 设备 | URN 后缀 |
|------|----------|
| 灯光/筒灯/灯带 | `device:light:0000A001` |
| 空调 | `device:air-conditioner:0000A004` |
| 窗帘 | `device:curtain:0000A00C` |
| 人体传感器 | `device:sensor:0000A077` |
| 温湿度传感器 | `device:sensor:0000A07A` |
| 门锁 | `device:lock:0000A06F` |
| 摄像头 | `device:camera:0000A05B` |
| 音箱 | `device:speaker:0000A045` |
| 开关 | `device:switch:0000A023` |
| 网关 | `device:gateway:0000A019` |

### 数据类型（dtype）

**网关校验要求的 dtype（用于 deviceInput/deviceGet）**：

| dtype | 说明 | 示例 |
|-------|------|------|
| boolean | 布尔 | true, false |
| int | 整数 | 25, 100 |
| float | 浮点数 | 25.5 |
| string | 字符串 | "hello" |

**MIOT Spec format → 网关 dtype 映射**：

MIOT Spec 使用的 format 值与网关要求的 dtype 不同，需要转换：

| MIOT Spec format | 网关 dtype | 说明 |
|------------------|-----------|------|
| `bool` | `boolean` | 布尔类型 |
| `uint8`, `uint16`, `uint32`, `uint64` | `int` | 无符号整数 |
| `int8`, `int16`, `int32`, `int64` | `int` | 有符号整数 |
| `float`, `double` | `float` | 浮点数 |
| `string` | `string` | 字符串 |

**⚠️ 关键规则**：
- `deviceInput`（piid 模式）和 `deviceGet` 的 props.dtype 必须是 `int`/`float`/`boolean`/`string`
- MIOT Spec 返回的 `"format": "bool"` 需要转换为 `"dtype": "boolean"`
- MIOT Spec 返回的 `"format": "uint8"` 需要转换为 `"dtype": "int"`
- `deviceInputSetVar` 和 `deviceGetSetVar` 的 dtype 使用 `"number"` 而非 `"int"`/`"float"`

### 操作符（operator）

| 操作符 | 说明 | 适用类型 |
|--------|------|----------|
| `=` | 等于 | 所有类型 |
| `!=` | 不等于 | int, string |
| `>` | 大于 | int, float |
| `<` | 小于 | int, float |
| `>=` | 大于等于 | int |
| `<=` | 小于等于 | int |
| `between` | 范围内 | int, float（需要 v1, v2） |
| `include` | 包含 | int（v1 是整数数组） |

---

## 设备类节点

### deviceInput — 设备触发器

**用途**：监听设备事件或属性变化时触发后续流程

**两种触发模式**：

#### 模式A：属性变化触发（piid）

当设备的某个属性值满足条件时触发。

```json
{
  "id": "trigger1",
  "type": "deviceInput",
  "cfg": {
    "urn": "urn:miot-spec-v2:device:light:0000A001:xiaomi-btlm2p:2",
    "name": "deviceInput",
    "version": 1,
    "pos": {"x": 100, "y": 100, "width": 528, "height": 164}
  },
  "props": {
    "did": "$DID_LIGHT",
    "siid": 2,
    "piid": 1,
    "preload": false,
    "dtype": "boolean",
    "operator": "=",
    "v1": true
  },
  "inputs": {},
  "outputs": {"output": ["action1.trigger"]}
}
```

**props 字段详解**：

| 字段 | 类型 | 说明 |
|------|------|------|
| did | string | 设备ID（来自 getDevList 的 key） |
| siid | integer | 服务ID（属性所属的服务） |
| piid | integer | 属性ID（与 eiid 二选一） |
| preload | boolean | `false`=只在属性变化时触发；`true`=规则启用瞬间也按当前值评估一次（已实机验证） |
| dtype | string | `"boolean"` / `"int"` / `"float"` / `"string"`（由属性 format 决定） |
| operator | string | 操作符，取决于 dtype（见下表） |
| v1 | any | 比较值，类型与 dtype 匹配 |
| v2 | number | 仅 `operator="between"` 时需要 |

**operator 与 dtype 严格对应**：

| dtype | 允许的 operator |
|-------|----------------|
| boolean | `=` |
| int | `>=`, `<=`, `=`, `!=`, `>`, `<`, `between`, `include` |
| float | `>`, `<`, `between` |
| string | `=` |

**v1 类型要求**：

| dtype | v1 类型 |
|-------|---------|
| boolean | `true` / `false` |
| int | integer（`include` 时是整数数组） |
| float | number |
| string | string |

**⚠️ `deviceInput` 在状态变化时触发**：条件（如 `= true`）决定**信号值**（真/假），**不是过滤**。灯变开时发"真"，灯变关时发"假"——状态一变就发，值随条件判定。曾被误解为"只在满足条件时才触发"，导致漏掉反向状态变化（如只想要"开灯"事件却把"关灯"也当触发源）。

#### 模式B：事件触发（eiid）

当设备发生某个事件时触发。

```json
{
  "id": "trigger2",
  "type": "deviceInput",
  "cfg": {
    "urn": "urn:miot-spec-v2:device:gateway:0000A019:xiaomi-hub1:3",
    "name": "deviceInput",
    "version": 1,
    "pos": {"x": 100, "y": 100, "width": 528, "height": 164}
  },
  "props": {
    "did": "$DID_GATEWAY",
    "siid": 4,
    "eiid": 1,
    "preload": false,
    "arguments": [
      {"piid": 1, "dtype": "string", "operator": "=", "v1": "客厅明亮"}
    ]
  },
  "inputs": {},
  "outputs": {"output": ["action1.trigger"]}
}
```

**props 字段详解（事件模式）**：

| 字段 | 类型 | 说明 |
|------|------|------|
| did | string | 设备ID |
| siid | integer | 服务ID |
| eiid | integer | 事件ID（与 piid 二选一） |
| preload | boolean | 同属性模式；事件模式通常用 `false` |
| arguments | array | 事件参数过滤（可选） |

**arguments 元素结构**：

```json
{
  "piid": 1,            // 参数对应的属性ID
  "dtype": "string",    // 参数类型
  "operator": "=",      // 操作符
  "v1": "客厅明亮"      // 匹配值
}
```

不传 arguments 表示任意该事件都触发；传了 arguments 表示只有参数匹配时才触发。

---

### deviceOutput — 执行操作

**用途**：控制设备执行某个操作（开灯、设温度等）

**两种模式**：

#### 模式A：执行动作（aiid + ins）

```json
{
  "id": "action1",
  "type": "deviceOutput",
  "cfg": {
    "urn": "urn:miot-spec-v2:device:light:0000A001:xiaomi-btlm2p:2",
    "name": "deviceOutput",
    "version": 1,
    "pos": {"x": 700, "y": 100, "width": 528, "height": 164}
  },
  "props": {
    "did": "$DID_LIGHT",
    "siid": 2,
    "aiid": 1,
    "ins": [
      {"piid": 1, "value": true}
    ]
  },
  "inputs": {"trigger": null},
  "outputs": {"output": []}
}
```

**props 字段详解**：

| 字段 | 类型 | 说明 |
|------|------|------|
| did | string | 设备ID |
| siid | integer | 服务ID |
| aiid | integer | 动作ID（与 piid 二选一） |
| ins | array | 动作输入参数列表 |

**ins 元素结构（固定值）**：
```json
{"piid": 1, "value": true}
```

**ins 元素结构（变量引用）**：
```json
{
  "piid": 1,
  "scope": "global",
  "id": "varBrightness",
  "dtype": "number",
  "max": 100,
  "min": 0,
  "step": 1
}
```

**ins 从哪来？** 动作（action）的 `in` 字段定义了需要哪些输入参数，每个参数引用一个属性。比如"开/关"动作的 `in: [1]` 表示需要一个参数，对应 piid=1（开关属性）。所以 `ins = [{"piid": 1, "value": true}]`。

#### 模式B：直接设置属性（piid + value）

```json
{
  "props": {
    "did": "$DID_LIGHT",
    "siid": 2,
    "piid": 2,
    "value": 80
  },
  "inputs": {"trigger": null},
  "outputs": {"output": []}
}
```

**⚠️ outputs 必须有 `"output"` 键**，即使没有后续节点也必须是 `"output": []`。否则网关报错 "No output"。

**aiid vs piid 区别**：
- `aiid` = 执行动作（可能涉及多个属性变更，通过 ins 传参）
- `piid` = 直接设置单个属性值

---

### deviceGet — 查询当前状态

**用途**：取得网关可用于判定的设备属性值，根据结果决定走哪个分支

不得默认查询结果等同于物理设备的实时状态。缓存、最近上报、离线和未知值语义需按设备与固件实测；安全动作必须设计旧值和未知值保护。

```json
{
  "id": "query1",
  "type": "deviceGet",
  "cfg": {
    "urn": "urn:miot-spec-v2:device:light:0000A001:xiaomi-btlm2p:2",
    "name": "deviceGet",
    "version": 1,
    "pos": {"x": 100, "y": 300, "width": 528, "height": 164}
  },
  "props": {
    "did": "$DID_LIGHT",
    "siid": 2,
    "piid": 1,
    "dtype": "boolean",
    "operator": "=",
    "v1": true
  },
  "inputs": {"input": null},
  "outputs": {
    "output": ["actionA.trigger"],
    "output2": ["actionB.trigger"]
  }
}
```

**inputs**：
- `input`：触发输入（必须是 `null`），**不是 `trigger`**

**outputs**：
- `output`：查询结果满足条件时触发
- `output2`：查询结果不满足条件时触发

**⚠️ deviceGet 的 outputs 必须同时有 `output` 和 `output2`**。✅ 已验证
**⚠️ inputs 必须使用 `"input": null`，不能用 `"trigger": null`**。✅ 已验证
**⚠️ `output` 和 `output2` 都应连接到 event 节点的 trigger 端口**（如 condition.trigger, deviceOutput.trigger）
**❌ 禁止**将 output2 连到 state 节点（如 timeRange），state 节点不能被触发

---

## 时间类节点

### alarmClock — 定时触发

```json
{
  "id": "timer1",
  "type": "alarmClock",
  "cfg": {
    "name": "alarmClock",
    "version": 1,
    "happenType": "now",
    "tempOffset": 0,
    "pos": {"x": 100, "y": 100, "width": 528, "height": 164}
  },
  "props": {
    "type": "periodicAlarm",
    "hour": 22,
    "minute": 0,
    "second": 0,
    "filter": {
      "day": [0, 1, 2, 3, 4, 5, 6]
    }
  },
  "inputs": {},
  "outputs": {"output": ["action1.trigger"]}
}
```

**props 字段**：

| 字段 | 类型 | 说明 |
|------|------|------|
| type | string | `"periodicAlarm"`（定时）或 `"sunset"`（日落） |
| hour | integer | 0-23 |
| minute | integer | 0-59 |
| second | integer | 0-59 |
| filter | object | 过滤器 |

**filter.day**：整数数组，0=周日, 1=周一, ..., 6=周六
**filter.inHoliday**：boolean（与 day 互斥，不能同时存在）

**cfg 字段**：
- `happenType`：`"now"` / `"before"` / `"after"`
- `tempOffset`：偏移量（仅 before/after 时有意义）

**sunset 类型额外字段**：
```json
{
  "props": {
    "type": "sunset",
    "isSunset": true,
    "latitude": 39.9,
    "longitude": 116.4,
    "offset": 0,
    "filter": {"day": [1, 2, 3, 4, 5]}
  }
}
```

---

### timeRange — 时间段

```json
{
  "id": "range1",
  "type": "timeRange",
  "cfg": {"name": "timeRange", "version": 1, "pos": {...}},
  "props": {
    "start": {"hour": 8, "minute": 0, "second": 0},
    "end": {"hour": 22, "minute": 0, "second": 0},
    "filter": {"day": [1, 2, 3, 4, 5]}
  },
  "inputs": {},
  "outputs": {"output": ["cond1.condition"]}
}
```

- `cfg.name`：必须为 `"timeRange"`
- `start`/`end` 的 `hour`/`minute`/`second` 范围同 `alarmClock`
- `filter.day`：整数数组，0=周日, 1=周一, ..., 6=周六

**⚠️ timeRange 关键规则（已验证）**：
- `inputs` 必须是空对象 `{}`（不能有 `trigger`）✅ 已验证
- `outputs` 只有 `output`（没有 `output2`）✅ 已验证
- 它是**状态节点**，不是事件驱动节点
- `outputs.output` 可直接连接 `condition.condition`，也可先进入 `logicOr/logicAnd/logicNot`，最终连接 `condition.condition` ✅ 已验证
- `outputs.output` 数组可包含**多个目标**（同一个 timeRange 连到多个 condition）
- ❌ **禁止**任何节点的 output 连到 timeRange（timeRange 没有输入端口）
- ❌ **禁止**使用 `output2`（timeRange 只有 `output`，没有 `output2`）

**多分支用法**：当多个 branch 都需要判断时间段时，同一个 timeRange 的 output 数组可以包含多个目标：
```json
{"id":"range1","type":"timeRange","cfg":{"name":"timeRange","version":1},"props":{"start":{"hour":1,"minute":30,"second":0},"end":{"hour":9,"minute":0,"second":0},"filter":{"day":[0,1,2,3,4,5,6]}},"inputs":{},"outputs":{"output":["cond2.condition","cond3.condition"]}}
```

**常见错误示例**：

```
❌ 错误：query.output2 → range1.output
   "outputs": {"output2": ["range1.output"]}
   问题：range1.output 不是输入端口，这是语法错误

❌ 错误：cond2 没有 condition 来源
   query1.output → cond2.trigger     ✅ trigger 有了
   (cond2.condition 没有任何连接)     ❌ condition 没有！
   结果：网关允许保存，但实测不会执行 cond2.met

✅ 正确：
   "query1": {"outputs": {"output": ["cond2.trigger"], "output2": ["cond3.trigger"]}}
   "range1": {"outputs": {"output": ["cond2.condition", "cond3.condition"]}}
```

**生成 timeRange 规则后必须检查**：
- [ ] timeRange 的 `inputs: {}`（空对象）
- [ ] timeRange.outputs.output 中所有目标都是 `xxx.condition` 格式
- [ ] 每个需要判断时间的 condition，其 `inputs.condition` 都被 state 节点的 output 连接
- [ ] 没有任何节点的 output 连到了 timeRange

---

### delay — 延时

```json
{
  "id": "delay1",
  "type": "delay",
  "cfg": {
    "name": "delay",
    "version": 1,
    "unit": "s",
    "value": 5,
    "pos": {...}
  },
      "props": {"timeout": 5000},
      "inputs": {"input": null},
      "outputs": {"output": ["nextNode.trigger"]}
}
```

- `props.timeout`：毫秒（网关实际执行用这个值）
- `cfg.unit`：`"ms"` / `"s"` / `"min"` / `"hour"`（UI 显示用）
- `cfg.value`：数值（UI 显示用）

⚠️ **delay 关键规则（已验证）**：
- `inputs` 必须是 `{"input": null}`（用 input，不是 trigger）✅ 已验证
- `props.timeout` 必须是整数毫秒，不能是小数

---

### statusLast — 状态维持了一段时间

```json
{
  "id": "last1",
  "type": "statusLast",
  "cfg": {"name": "statusLast", "version": 1, "pos": {...}},
  "props": {"timeout": 300000},
  "inputs": {"input": null},
  "outputs": {"output": ["nextNode.trigger"]}
}
```

- `props.timeout`：整数，毫秒，必须 > 0
- 当 `input` 输入的状态持续达到 timeout 毫秒时触发 output

**⚠️ `statusLast.input` 不能接 `signalOr.output`**：`signalOr` 只发事件脉冲（瞬时信号），无法维持到 `timeout`，实测不会触发 `output`。`statusLast.input` 必须来自**持续状态源**，例如 `deviceGet.output`、`varGet.output`、`logicOr.output`、`logicAnd.output`、`timeRange.output`。若需要"多源任一持续 N 秒"，两种正确做法：
1. 各源先各自走 `statusLast`，再由 `signalOr` 汇聚事件；
2. 用 `logicOr` 聚合状态后接 `statusLast.input`。

**⚠️ `statusLast` 再次触发需要状态翻转**：输入必须**先假后真**才能再次触发。**持续为真只触发一次**。曾导致恢复路径卡死——例如"持续有人 5 分钟发提醒"只在第一次满足时发，人一直坐着不会再发；要重复提醒得让输入状态先翻回假（人离开再回来）。设计恢复路径时务必先想清楚"状态何时翻回假"。

---

### eventSequence — 事件先后发生

```json
{
  "id": "seq1",
  "type": "eventSequence",
  "cfg": {"name": "eventSequence", "version": 1, "pos": {...}},
  "props": {"timeout": 10000},
  "inputs": {"input1": null, "input2": null},
  "outputs": {"output": ["nextNode.trigger"]}
}
```

- `props.timeout`：整数，毫秒，必须 > 0
- 当 input1 事件先发生，然后在 timeout 毫秒内 input2 也发生时，触发 output

---

## 流程类节点

### condition — 当-如果-就

```json
{
  "id": "cond1",
  "type": "condition",
  "cfg": {"name": "condition", "version": 1, "pos": {...}},
  "props": {},
  "inputs": {
    "trigger": null,
    "condition": null
  },
  "outputs": {
    "met": ["actionA.trigger"],
    "unmet": ["actionB.trigger"]
  }
}
```

- `cfg.name`：必须为 `"condition"`
- `props`：必须存在（可以是空对象 `{}`），否则报 "Invalid props"
- `inputs.trigger`：必须是 `null`（事件信号）
- `inputs.condition`：`boolean | null`（状态条件）
- `outputs.met`：条件满足时触发
- `outputs.unmet`：条件不满足时触发
- **⚠️ outputs 必须同时有 `met` 和 `unmet`**

**condition 的工作方式**：
1. 当 `trigger` 输入事件到达时，检查 `condition` 的值
2. 如果已连接的 `condition` 状态为 `true`，触发 `met`
3. 否则触发 `unmet`

**⚠️ condition 关键规则**：
- **`trigger` 和 `condition` 必须都有信号来源**，缺一不可
- `trigger` = "当"：由 event 节点的 outputs 触发（如 `deviceInput.output`, `deviceGet.output`）
- `condition` = "如果"：由 state 节点的 outputs 提供条件值（如 `timeRange.output`, `logicAnd.output`）
- ❌ 如果 `condition` 未连接 → 网关允许保存，但实测不会执行 `met`
- ❌ 如果 `trigger` 未连接 → 节点永远不会被触发

**与 deviceGet 配合**：
```json
// deviceGet 的 output 触发 condition
"query1.outputs.output": ["cond1.trigger"]
// deviceGet 的 output2 连到另一个 condition
"query1.outputs.output2": ["cond2.trigger"]
// timeRange 同时连到两个 condition 的 condition 端口
"range1.outputs.output": ["cond1.condition", "cond2.condition"]
```

**与 timeRange 配合（常见模式）**：
```
deviceInput → condition1
                ├─ met → deviceGet → condition2
                │                   ├─ met → action1（设备状态满足 + 时间满足）
                │                   └─ unmet → action2（设备状态满足 + 时间不满足）
                └─ unmet → action3（触发条件不满足）
```

⚠️ **timeRange 不能被直接触发**，它是状态节点，只能作为 condition 的条件输入：
```json
// 正确：timeRange.output 连接到 condition.condition
"range1.outputs.output": ["cond2.condition"]

// 错误：timeRange 没有 trigger 输入
"query1.outputs.output2": ["range1.trigger"]  // ❌
```

---

### loop — 循环

```json
{
  "id": "loop1",
  "type": "loop",
  "cfg": {"name": "loop", "version": 1, "pos": {...}},
  "props": {"interval": 600000},
  "inputs": {"start": null, "stop": null},
  "outputs": {"output": ["nextNode.trigger"]}
}
```

- `props.interval`：整数，毫秒
- `start` 触发时开始循环，每个 interval 触发一次 output
- `stop` 触发时停止循环

⚠️ **loop 关键规则（已验证）**：
- `inputs` 是 `{start: null, stop: null}`，**不是** `{input: null}` ✅ 已验证
- ❌ `{input: null}` 会报错 "No start"

---

### onlyNTimes — 最多触发指定次数

```json
{
  "id": "ntimes1",
  "type": "onlyNTimes",
  "cfg": {"name": "onlyNTimes", "version": 1, "pos": {...}},
  "props": {"n": 3},
  "inputs": {"input": null, "zero": null},
  "outputs": {"output": ["nextNode.trigger"]}
}
```

- `props.n`：整数，≥ 1
- 前 n 次 input 事件触发时，触发 output
- 达到 n 次后不再触发
- `zero` 触发时重置计数

---

### counter — 达到指定次数时

```json
{
  "id": "counter1",
  "type": "counter",
  "cfg": {"name": "counter", "version": 1, "pos": {...}},
  "props": {"n": 5},
  "inputs": {"input": null, "zero": null},
  "outputs": {"output": ["nextNode.trigger"]}
}
```

- `props.n`：整数，≥ 1
- 每次 input 事件计数 +1，达到 n 次时触发 output
- `zero` 触发时重置计数

---

### modeSwitch — 模式切换

```json
{
  "id": "switch1",
  "type": "modeSwitch",
  "cfg": {"name": "modeSwitch", "version": 1, "pos": {...}},
  "inputs": {"input": null},
  "outputs": {
    "output0": ["nodeA.trigger"],
    "output1": ["nodeB.trigger"],
    "output2": ["nodeC.trigger"]
  }
}
```

- `inputs.input`：触发输入
- outputs 有多个分支，每次触发轮流走下一个
- 第 1 次触发 → output0, 第 2 次 → output1, ..., 走完后循环

---

## 逻辑类节点

### signalOr — 当任一事件发生

```json
{
  "id": "or1",
  "type": "signalOr",
  "cfg": {"name": "signalOr", "version": 1, "pos": {...}},
  "inputs": {"input0": null, "input1": null},
  "outputs": {"output": ["nextNode.trigger"]}
}
```

**⚠️ signalOr 的 inputs 值必须是 `null`**（不能是 boolean）。输入的是事件信号。

**输入名格式**：必须是 `input` + 数字（如 `input0`, `input1`, `input2`...），数字必须连续。

**⚠️ `signalOr` 输出不能接到 `statusLast.input`**：`signalOr` 发出的是事件脉冲，不是持续状态；`statusLast` 需要测量"状态持续时长"，脉冲无法维持到 `timeout`。语义上属错误连线，不要用 `signalOr` 喂 `statusLast`。需要"多源任一持续 N 秒"时，各源先各自走 `statusLast`，再由 `signalOr` 汇聚事件；或用 `logicOr` 聚合状态后接 `statusLast.input`。

---

### logicOr — 满足任一条件

```json
{
  "id": "lor1",
  "type": "logicOr",
  "cfg": {"name": "logicOr", "version": 1, "pos": {...}},
  "inputs": {"input0": null, "input1": true},
  "outputs": {"output": ["cond1.condition"]}
}
```

**inputs 值可以是 `boolean | null`**。输入的是状态条件。

---

### logicAnd — 满足全部条件

```json
{
  "id": "land1",
  "type": "logicAnd",
  "cfg": {"name": "logicAnd", "version": 1, "pos": {...}},
  "inputs": {"input0": null, "input1": null},
  "outputs": {"output": ["cond1.condition"]}
}
```

同 logicOr，所有输入都为 true 时触发。

---

### logicNot — 状态取反

```json
{
  "id": "not1",
  "type": "logicNot",
  "cfg": {"name": "logicNot", "version": 1, "pos": {...}},
  "inputs": {"input": null},
  "outputs": {"output": ["cond1.condition"]}
}
```

- `inputs.input`：`boolean | null`
- 输出为输入状态的取反

**⚠️ `logicNot` 语义**：当输入条件**不满足**时，`logicNot` **满足**（输出 true）。曾被理解反以为永不触发。用作"条件不成立就走这条分支"时，把 `logicNot` 接在 `condition.condition` 即可。

---

## 其他类节点

### register — 自定义布尔状态

```json
{
  "id": "reg1",
  "type": "register",
  "cfg": {"name": "register", "version": 1, "pos": {...}},
  "inputs": {"setTrue": null, "setFalse": null},
  "outputs": {"output": ["nextNode.trigger"]}
}
```

- `setTrue` 触发时状态设为 true
- `setFalse` 触发时状态设为 false

**⚠️ `outputs.output` 是上升沿触发（已实机验证）**：只在状态由 false 变为 true 的那一刻发出一次信号。

| 操作 | 是否发出信号 |
|------|-------------|
| `setFalse`（true → false） | 不发 |
| `setTrue`（false → true） | **发一次** |
| `setTrue`（true → true，重复） | 不发 |

因此 `register.output` 有两种用法：接 `condition.condition` 当**状态**读；接 `xxx.trigger` 当**上升沿事件**用。

「有动静 → setFalse；空闲 N 秒 → setTrue → 关灯」是正确写法，`setFalse` 不会误触发关灯动作。需要「变 false 时也执行动作」必须另引事件链，不能依赖 `register.output`。

---

### onLoad — 本自动化启用时

```json
{
  "id": "load1",
  "type": "onLoad",
  "cfg": {"name": "onLoad", "version": 1, "pos": {...}},
  "inputs": {},
  "outputs": {"output": ["nextNode.trigger"]}
}
```

仅在规则被启用的瞬间触发一次。

---

### nop — 备注/分组

```json
{
  "id": "note1",
  "type": "nop",
  "cfg": {
    "name": "nop",
    "version": 1,
    "pos": {"x": 100, "y": 100, "width": 528, "height": 200},
    "contents": "这是备注内容",
    "background": "blue"
  },
  "props": {},
  "inputs": {},
  "outputs": {}
}
```

纯 UI 备注节点，不影响流程。

---

## 变量类节点

**⚠️ 变量创建方式选择（实测踩坑）**：

| 创建方式 | number（数字） | string（字符串） | UI 显示 |
|----------|---------------|-----------------|---------|
| `mijia_create_variable`（API 创建变量） | ❌ 报"value 必须与 type 匹配" | ✅ 成功 | ✅ 正常显示 |
| `mijia_patch_graph`（规则变量声明 `variables`） | ✅ 成功 | ✅ 成功 | ✅ 正常显示 |

**两个结论**：
1. `mijia_create_variable` 的 `type: "number"` 有 bug——数字类型始终报"value 必须与 type 匹配"，字符串类型正常。**创建数字变量请用 `mijia_patch_graph` 的 `variables` 参数**。
2. 早期"变量已丢失"问题已解决——现在无论哪种方式创建，UI 都正常显示。之前可能是命名格式、缓存或网关版本差异导致，现已不再复现。

**标准做法**：
```
mijia_patch_graph (修改规则)
  → variables: [{id: "Vxxxxxxxxxx", name: "显示名", scope: "rule", type: "number", value: 0}]
```
- ID 格式：`V` + 10 位字母数字（如 `VtestNum01`）
- `scope: "rule"` 表示本规则变量
- 数字和字符串都支持

### deviceInputSetVar — 设备触发赋值

监听设备事件/属性变化，将设备值赋给变量。

```json
{
  "id": "inputvar1",
  "type": "deviceInputSetVar",
  "cfg": {
    "urn": "urn:...",
    "name": "deviceInputSetVar",
    "version": 1,
    "pos": {...}
  },
  "props": {
    "did": "$DID_DEVICE",
    "siid": 2,
    "piid": 1,
    "dtype": "number",
    "scope": "global",
    "id": "varTemperature",
    "preload": false
  },
  "inputs": {},
  "outputs": {"output": ["nextNode.trigger"]}
}
```

**props 字段**：

| 字段 | 类型 | 说明 |
|------|------|------|
| did | string | 设备ID |
| siid | integer | 服务ID |
| piid/eiid | integer | 属性/事件ID |
| dtype | string | `"number"` / `"boolean"` / `"string"`（变量用完整名称） |
| scope | string | 变量作用域（`"global"` 或规则 ID） |
| id | string | 变量ID |
| preload | boolean | 是否预加载 |

**⚠️ dtype 差异**：deviceInputSetVar 的 dtype 用 `"number"` 而非 `"int"` / `"float"`。

**事件模式（eiid）**：
```json
{
  "props": {
    "did": "xxx",
    "siid": 4,
    "eiid": 1,
    "arguments": [
      {"piid": 1, "dtype": "string", "scope": "global", "id": "varScene"}
    ]
  }
}
```

---

### deviceGetSetVar — 查询设备并赋值

触发时查询设备属性值并赋给变量。

```json
{
  "id": "getvar1",
  "type": "deviceGetSetVar",
  "cfg": {"urn": "urn:...", "name": "deviceGetSetVar", "version": 1, "pos": {...}},
  "props": {
    "did": "$DID_DEVICE",
    "siid": 2,
    "piid": 2,
    "dtype": "number",
    "scope": "global",
    "id": "varBrightness"
  },
  "inputs": {"input": null},
  "outputs": {"output": ["nextNode.trigger"]}
}
```

极客版 UI 实测该卡片只有一个 `output`，查询成功并完成赋值后触发；它没有 `output2`，不要套用 `deviceGet` 的双分支结构。

---

### varChange — 变量值更新时触发

```json
{
  "id": "varchange1",
  "type": "varChange",
  "cfg": {"name": "varChange", "version": 1, "pos": {...}},
  "props": {
    "scope": "global",
    "id": "varTemperature",
    "varType": "number",
    "preload": true,
    "operator": ">=",
    "v1": 28
  },
  "inputs": {},
  "outputs": {"output": ["nextNode.trigger"]}
}
```

| 字段 | 类型 | 说明 |
|------|------|------|
| scope | string | 变量作用域 |
| id | string | 变量ID |
| varType | string | `"number"` / `"string"`（不是 `"int"`） |
| preload | boolean | 是否预加载 |
| operator | string | number: `>=`, `<=`, `=`, `!=`, `>`, `<`, `between`; string: `=` |
| v1 | number/string | 比较值 |
| v2 | number | 仅 `between` 时需要 |

**⚠️ `varChange` 在值变化时必然触发**：`between`（区间判断）等 operator 只是**卡内计算项**，**无论计算结果如何都输出信号**。曾被误解为"条件过滤"导致逻辑错误——它不做条件过滤，只是带计算的事件源。若要"只在区间内触发"，必须后接 `condition` 或 `logicAnd`/`logicOr` 做真正的过滤。

---

### varGet — 查询变量值

```json
{
  "id": "varget1",
  "type": "varGet",
  "cfg": {"name": "varGet", "version": 1, "pos": {...}},
  "props": {
    "scope": "global",
    "id": "varCount",
    "varType": "number",
    "operator": ">=",
    "v1": 10
  },
  "inputs": {"input": null},
  "outputs": {
    "output": ["nextIfMatch.trigger"],
    "output2": ["nextIfNotMatch.trigger"]
  }
}
```

**⚠️ varGet 的 inputs 必须使用 `"input": null`，不能用 `"trigger": null`**。

---

### varSetNumber — 数值运算

```json
{
  "id": "varsetnum1",
  "type": "varSetNumber",
  "cfg": {"name": "varSetNumber", "version": 1, "pos": {...}},
  "props": {
    "scope": "global",
    "id": "varResult",
    "elements": [
      {"type": "const", "value": "$"},
      {"type": "const", "value": "+"},
      {"type": "const", "value": "1"}
    ]
  },
  "inputs": {"input": null},
  "outputs": {"output": ["nextNode.trigger"]}
}
```

**elements**：表达式元素数组
- `{"type": "const", "value": "数字或运算符"}` — 常量
- `{"type": "var", "scope": "global", "id": "varValue"}` — 变量引用（用 `$` 占位）

所有 const 元素的 value 拼接后（var 元素替换为 `$`）必须是合法的数学表达式。

**支持的运算符**：`+`, `-`, `*`, `/`, `%`

**支持的函数（26 个）**：

*数学（8 个）*

| 函数 | 参数 | 说明 |
|------|------|------|
| `abs(x)` | 1 数值 | 绝对值 |
| `pow(x, y)` | 2（底数, 指数） | x 的 y 次方 |
| `log(x, y)` | 2（底数, 值） | 以 x 为底 y 的对数 |
| `max(x0, x1, ...)` | 可变（≥2） | 取最大值 |
| `min(x0, x1, ...)` | 可变（≥2） | 取最小值 |
| `round(x)` | 1 数值 | 四舍五入取整 |
| `floor(x)` | 1 数值 | 向下取整 |
| `ceil(x)` | 1 数值 | 向上取整 |

*三角（6 个）— 全部使用弧度*

| 函数 | 参数 | 说明 |
|------|------|------|
| `sin(x)` | 1（弧度） | 正弦 |
| `cos(x)` | 1（弧度） | 余弦 |
| `tan(x)` | 1（弧度） | 正切 |
| `asin(x)` | 1 | 反正弦（返回弧度） |
| `acos(x)` | 1 | 反余弦（返回弧度） |
| `atan(x)` | 1 | 反正切（返回弧度） |

*时间（8 个）*

| 函数 | 返回 | 范围 |
|------|------|------|
| `now()` | 当前时间戳 | 毫秒（ms） |
| `year()` | 当前年 | 如 2026 |
| `month()` | 当前月 | 1~12 |
| `date()` | 当前日期（月内第几天） | 从 1 开始 |
| `day()` | 当前星期 | **0~6，0 = 周日，6 = 周六** |
| `hours()` | 当前小时 | 0~23 |
| `minutes()` | 当前分钟 | 0~59 |
| `seconds()` | 当前秒 | 0~59 |

*随机（2 个）*

| 函数 | 返回 | 范围 |
|------|------|------|
| `rand()` | 随机数 | 0 ≤ x < 1（小数） |
| `randint(x, y)` | 随机整数 | x ~ y（**包含端点**） |

*常量（2 个）*

| 函数 | 值 |
|------|-----|
| `e()` | ≈ 2.71828 |
| `pi()` | ≈ 3.14159 |

---

### varSetString — 文本拼接

```json
{
  "id": "varsetstr1",
  "type": "varSetString",
  "cfg": {"name": "varSetString", "version": 1, "pos": {...}},
  "props": {
    "scope": "global",
    "id": "varMessage",
    "elements": [
      {"type": "const", "value": "温度是"},
      {"type": "var", "scope": "global", "id": "varTemperature"},
      {"type": "const", "value": "度"}
    ]
  },
  "inputs": {"input": null},
  "outputs": {"output": ["nextNode.trigger"]}
}
```

- `{"type": "const", "value": "文本"}` — 常量字符串
- `{"type": "var", "scope": "global", "id": "varValue"}` — 变量值

结果是所有元素的文本拼接。

---

## 完整规则结构

### setGraph API

```json
{
  "id": "1710000000000",
  "nodes": [节点1, 节点2, ...],
  "cfg": {
    "id": "1710000000000",
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

**校验规则**：
- `cfg.id === id`（必须一致）
- 规则 ID 为 13 位纯数字；不要使用 `graph_` 前缀
- `cfg.enable` 必须是 boolean
- `nodes` 必须是数组
- 每个节点通过 `Pr[t.type].checkWebNode(t)` 校验

### changeGraphConfig API

```json
{
  "params": {
    "id": "1710000000000",
    "enable": true,
    "userData": {
      "name": "新名称",
      "lastUpdateTime": 1710000000001,
      "transform": {"x": 0, "y": 0, "scale": 1, "rotate": 0}
    }
  }
}
```

**⚠️ changeGraphConfig 必须传完整的 userData**，包括 name、lastUpdateTime、transform，否则名称会丢失。

---

## 完整示例

### 示例1：网关场景触发开灯

```json
{
  "id": "1710000000000",
  "nodes": [
    {
      "id": "trigger1",
      "type": "deviceInput",
      "cfg": {
        "urn": "urn:miot-spec-v2:device:gateway:0000A019:xiaomi-hub1:3",
        "name": "deviceInput",
        "version": 1,
        "pos": {"x": 100, "y": 100, "width": 528, "height": 164}
      },
      "props": {
        "did": "$DID_GATEWAY",
        "siid": 4,
        "eiid": 1,
        "preload": false,
        "arguments": [
          {"piid": 1, "dtype": "string", "operator": "=", "v1": "客厅明亮"}
        ]
      },
      "inputs": {},
      "outputs": {"output": ["action1.trigger"]}
    },
    {
      "id": "action1",
      "type": "deviceOutput",
      "cfg": {
        "urn": "urn:miot-spec-v2:device:light:0000A001:xiaomi-btlm2p:2",
        "name": "deviceOutput",
        "version": 1,
        "pos": {"x": 700, "y": 100, "width": 528, "height": 164}
      },
      "props": {
        "did": "$DID_LIGHT",
        "siid": 2,
        "aiid": 1,
        "ins": [{"piid": 1, "value": true}]
      },
      "inputs": {"trigger": null},
      "outputs": {"output": []}
    }
  ],
  "cfg": {
    "id": "1710000000000",
    "enable": true,
    "uiType": "graph",
    "userData": {
      "name": "客厅明亮开灯",
      "lastUpdateTime": 1710000000000,
      "transform": {"x": 0, "y": 0, "scale": 1, "rotate": 0}
    }
  }
}
```

### 示例2：定时 + 延时链

```json
{
  "id": "1710000000001",
  "nodes": [
    {
      "id": "timer1",
      "type": "alarmClock",
      "cfg": {"name": "alarmClock", "version": 1, "happenType": "now", "tempOffset": 0, "pos": {"x": 100, "y": 100, "width": 528, "height": 164}},
      "props": {
        "type": "periodicAlarm",
        "hour": 22, "minute": 0, "second": 0,
        "filter": {"day": [0, 1, 2, 3, 4, 5, 6]}
      },
      "inputs": {},
      "outputs": {"output": ["delay1.input"]}
    },
    {
      "id": "delay1",
      "type": "delay",
      "cfg": {"name": "delay", "version": 1, "unit": "s", "value": 5, "pos": {"x": 700, "y": 100, "width": 528, "height": 164}},
      "props": {"timeout": 5000},
      "inputs": {"input": null},
      "outputs": {"output": ["action1.trigger"]}
    },
    {
      "id": "action1",
      "type": "deviceOutput",
      "cfg": {"urn": "urn:miot-spec-v2:device:light:0000A001:xiaomi-btlm2p:2", "name": "deviceOutput", "version": 1, "pos": {"x": 1300, "y": 100, "width": 528, "height": 164}},
      "props": {"did": "$DID_LIGHT", "siid": 2, "aiid": 1, "ins": [{"piid": 1, "value": false}]},
      "inputs": {"trigger": null},
      "outputs": {"output": []}
    }
  ],
  "cfg": {
    "id": "1710000000001",
    "enable": true,
    "uiType": "graph",
    "userData": {"name": "定时关灯", "lastUpdateTime": 1710000000000, "transform": {"x": 0, "y": 0, "scale": 1, "rotate": 0}}
  }
}
```

### 示例3：多场景触发（signalOr）

```json
{
  "id": "1710000000002",
  "nodes": [
    {
      "id": "input1",
      "type": "deviceInput",
      "cfg": {"urn": "urn:miot-spec-v2:device:gateway:0000A019:xiaomi-hub1:3", "name": "deviceInput", "version": 1, "pos": {"x": 100, "y": 100, "width": 528, "height": 164}},
      "props": {"did": "$DID_GATEWAY", "siid": 4, "eiid": 1, "preload": false, "arguments": [{"piid": 1, "dtype": "string", "operator": "=", "v1": "客厅明亮"}]},
      "inputs": {},
      "outputs": {"output": ["or1.input0"]}
    },
    {
      "id": "input2",
      "type": "deviceInput",
      "cfg": {"urn": "urn:miot-spec-v2:device:gateway:0000A019:xiaomi-hub1:3", "name": "deviceInput", "version": 1, "pos": {"x": 100, "y": 300, "width": 528, "height": 164}},
      "props": {"did": "$DID_GATEWAY", "siid": 4, "eiid": 1, "preload": false, "arguments": [{"piid": 1, "dtype": "string", "operator": "=", "v1": "客厅温馨"}]},
      "inputs": {},
      "outputs": {"output": ["or1.input1"]}
    },
    {
      "id": "or1",
      "type": "signalOr",
      "cfg": {"name": "signalOr", "version": 1, "pos": {"x": 700, "y": 200, "width": 528, "height": 164}},
      "inputs": {"input0": null, "input1": null},
      "outputs": {"output": ["action1.trigger"]}
    },
    {
      "id": "action1",
      "type": "deviceOutput",
      "cfg": {"urn": "urn:miot-spec-v2:device:light:0000A001:lemesh-wy0d02:1", "name": "deviceOutput", "version": 1, "pos": {"x": 1300, "y": 200, "width": 528, "height": 164}},
      "props": {"did": "$DID_LIGHT", "siid": 2, "aiid": 1, "ins": [{"piid": 2, "value": 80}]},
      "inputs": {"trigger": null},
      "outputs": {"output": []}
    }
  ],
  "cfg": {
    "id": "1710000000002",
    "enable": true,
    "uiType": "graph",
    "userData": {"name": "多场景开灯", "lastUpdateTime": 1710000000000, "transform": {"x": 0, "y": 0, "scale": 1, "rotate": 0}}
  }
}
```
