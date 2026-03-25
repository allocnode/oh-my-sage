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
| outputs | object | 不能为 null |

**⚠️ cfg.simplified 字段已废弃，不要添加。**
**⚠️ props 字段必须存在，即使没有属性也要写 `"props": {}`。**

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
  "roomId": "52001132047",     // 所属房间ID
  "roomName": "客厅",          // 所属房间名称
  "icon": "https://..."        // 设备图标URL
}
```

| 字段 | 类型 | 说明 |
|------|------|------|
| specV2Access | boolean | 是否支持 MIOT Spec V2（必须为 true 才能创建规则） |
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

**筛选可用设备**：`specV2Access === true && online === true`

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
    "did": "950058664",
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
| preload | boolean | 必须为 `false` |
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
    "did": "1179053616",
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
| preload | boolean | 必须为 `false` |
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
    "name": "deviceInput",
    "version": 1,
    "pos": {"x": 700, "y": 100, "width": 528, "height": 164}
  },
  "props": {
    "did": "950058664",
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
  "id": "var_xxx",
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
    "did": "950058664",
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

**用途**：查询设备当前属性值，根据结果决定走哪个分支

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
    "did": "950058664",
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

**⚠️ deviceGet 的 outputs 必须同时有 `output` 和 `output2`**。
**⚠️ inputs 必须使用 `"input": null`，不能用 `"trigger": null`**。

---

## 时间类节点

### alarmClock — 定时触发

```json
{
  "id": "timer1",
  "type": "alarmClock",
  "cfg": {
    "name": "deviceInput",
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
  "outputs": {"output": ["nextNode.trigger"]}
}
```

- `cfg.name`：必须为 `"timeRange"`
- `start`/`end` 的 `hour`/`minute`/`second` 范围同 `alarmClock`
- `filter.day`：整数数组，0=周日, 1=周一, ..., 6=周六

---

### delay — 延时

```json
{
  "id": "delay1",
  "type": "delay",
  "cfg": {
    "name": "deviceInput",
    "version": 1,
    "unit": "s",
    "value": 5,
    "pos": {...}
  },
  "props": {"timeout": 5000},
  "inputs": {"trigger": null},
  "outputs": {"output": ["nextNode.trigger"]}
}
```

- `props.timeout`：毫秒（网关实际执行用这个值）
- `cfg.unit`：`"ms"` / `"s"` / `"min"` / `"hour"`（UI 显示用）
- `cfg.value`：数值（UI 显示用）

---

### statusLast — 状态维持了一段时间

```json
{
  "id": "last1",
  "type": "statusLast",
  "cfg": {"version": 1, "pos": {...}},
  "props": {"timeout": 300000},
  "inputs": {"input": null},
  "outputs": {"output": ["nextNode.trigger"]}
}
```

- `props.timeout`：整数，毫秒，必须 > 0
- 当 `input` 输入的状态持续达到 timeout 毫秒时触发 output

---

### eventSequence — 事件先后发生

```json
{
  "id": "seq1",
  "type": "eventSequence",
  "cfg": {"version": 1, "pos": {...}},
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
2. 如果 `condition` 为 `true`（或 `null` 且条件满足），触发 `met`
3. 否则触发 `unmet`

**与 deviceGet 配合**：
```json
// deviceGet 的 output 触发 condition
"query1.outputs.output": ["cond1.trigger"]
// deviceGet 的 output2 也可以连接到 condition.condition
"query1.outputs.output2": ["cond1.condition"]
```

---

### loop — 循环

```json
{
  "id": "loop1",
  "type": "loop",
  "cfg": {"version": 1, "pos": {...}},
  "props": {"interval": 600000},
  "inputs": {"start": null, "stop": null},
  "outputs": {"output": ["nextNode.trigger"]}
}
```

- `props.interval`：整数，毫秒
- `start` 触发时开始循环，每个 interval 触发一次 output
- `stop` 触发时停止循环

---

### onlyNTimes — 最多触发指定次数

```json
{
  "id": "ntimes1",
  "type": "onlyNTimes",
  "cfg": {"version": 1, "pos": {...}},
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
  "cfg": {"version": 1, "pos": {...}},
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
  "cfg": {"version": 1, "pos": {...}},
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
  "cfg": {"version": 1, "pos": {...}},
  "inputs": {"input0": null, "input1": null},
  "outputs": {"output": ["nextNode.trigger"]}
}
```

**⚠️ signalOr 的 inputs 值必须是 `null`**（不能是 boolean）。输入的是事件信号。

**输入名格式**：必须是 `input` + 数字（如 `input0`, `input1`, `input2`...），数字必须连续。

---

### logicOr — 满足任一条件

```json
{
  "id": "lor1",
  "type": "logicOr",
  "cfg": {"version": 1, "pos": {...}},
  "inputs": {"input0": null, "input1": true},
  "outputs": {"output": ["nextNode.trigger"]}
}
```

**inputs 值可以是 `boolean | null`**。输入的是状态条件。

---

### logicAnd — 满足全部条件

```json
{
  "id": "land1",
  "type": "logicAnd",
  "cfg": {"version": 1, "pos": {...}},
  "inputs": {"input0": null, "input1": null},
  "outputs": {"output": ["nextNode.trigger"]}
}
```

同 logicOr，所有输入都为 true 时触发。

---

### logicNot — 状态取反

```json
{
  "id": "not1",
  "type": "logicNot",
  "cfg": {"version": 1, "pos": {...}},
  "inputs": {"input": null},
  "outputs": {"output": ["nextNode.trigger"]}
}
```

- `inputs.input`：`boolean | null`
- 输出为输入状态的取反

---

## 其他类节点

### register — 自定义布尔状态

```json
{
  "id": "reg1",
  "type": "register",
  "cfg": {"version": 1, "pos": {...}},
  "inputs": {"setTrue": null, "setFalse": null},
  "outputs": {"output": ["nextNode.trigger"]}
}
```

- `setTrue` 触发时状态设为 true，触发 output
- `setFalse` 触发时状态设为 false，触发 output

---

### onLoad — 本自动化启用时

```json
{
  "id": "load1",
  "type": "onLoad",
  "cfg": {"version": 1, "pos": {...}},
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
    "name": "deviceInput",
    "version": 1,
    "pos": {"x": 100, "y": 100, "width": 528, "height": 200},
    "name": "备注标题",
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

### deviceInputSetVar — 设备触发赋值

监听设备事件/属性变化，将设备值赋给变量。

```json
{
  "id": "inputvar1",
  "type": "deviceInputSetVar",
  "cfg": {
    "urn": "urn:...",
    "name": "deviceInput",
    "version": 1,
    "pos": {...}
  },
  "props": {
    "did": "950058664",
    "siid": 2,
    "piid": 1,
    "dtype": "number",
    "scope": "global",
    "id": "var_temperature",
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
      {"piid": 1, "dtype": "string", "scope": "global", "id": "var_scene"}
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
  "cfg": {"urn": "urn:...", "version": 1, "pos": {...}},
  "props": {
    "did": "950058664",
    "siid": 2,
    "piid": 2,
    "dtype": "number",
    "scope": "global",
    "id": "var_brightness"
  },
  "inputs": {"input": null},
  "outputs": {
    "output": ["nextNode.trigger"],
    "output2": ["fallbackNode.trigger"]
  }
}
```

---

### varChange — 变量值更新时触发

```json
{
  "id": "varchange1",
  "type": "varChange",
  "cfg": {"version": 1, "pos": {...}},
  "props": {
    "scope": "global",
    "id": "var_temperature",
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

---

### varGet — 查询变量值

```json
{
  "id": "varget1",
  "type": "varGet",
  "cfg": {"version": 1, "pos": {...}},
  "props": {
    "scope": "global",
    "id": "var_count",
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
  "cfg": {"version": 1, "pos": {...}},
  "props": {
    "scope": "global",
    "id": "var_result",
    "elements": [
      {"type": "const", "value": "$"},
      {"type": "const", "value": "+"},
      {"type": "const", "value": "1"}
    ]
  },
  "inputs": {"trigger": null},
  "outputs": {"output": ["nextNode.trigger"]}
}
```

**elements**：表达式元素数组
- `{"type": "const", "value": "数字或运算符"}` — 常量
- `{"type": "var", "scope": "global", "id": "var_xxx"}` — 变量引用（用 `$` 占位）

所有 const 元素的 value 拼接后（var 元素替换为 `$`）必须是合法的数学表达式。

**支持的运算符**：`+`, `-`, `*`, `/`, `%`

**支持的函数**：

| 函数 | 参数个数 | 说明 |
|------|----------|------|
| abs(x) | 1 | 绝对值 |
| pow(x,y) | 2 | 幂 |
| log(x,y) | 2 | 对数 |
| sin/cos/tan | 1 | 三角函数 |
| asin/acos/atan | 1 | 反三角函数 |
| max/min | ≥1 | 最大/最小值 |
| round/floor/ceil | 1 | 取整 |
| rand() | 0 | 随机数 |
| randint(a,b) | 2 | 随机整数 |
| now() | 0 | 当前时间戳 |
| year/month/date/day | 0 | 日期 |
| hours/minutes/seconds | 0 | 时间 |
| pi()/e() | 0 | 数学常量 |

---

### varSetString — 文本拼接

```json
{
  "id": "varsetstr1",
  "type": "varSetString",
  "cfg": {"version": 1, "pos": {...}},
  "props": {
    "scope": "global",
    "id": "var_message",
    "elements": [
      {"type": "const", "value": "温度是"},
      {"type": "var", "scope": "global", "id": "var_temp"},
      {"type": "const", "value": "度"}
    ]
  },
  "inputs": {"trigger": null},
  "outputs": {"output": ["nextNode.trigger"]}
}
```

- `{"type": "const", "value": "文本"}` — 常量字符串
- `{"type": "var", "scope": "global", "id": "var_xxx"}` — 变量值

结果是所有元素的文本拼接。

---

## 完整规则结构

### setGraph API

```json
{
  "id": "graph_1710000000000",
  "nodes": [节点1, 节点2, ...],
  "cfg": {
    "id": "graph_1710000000000",
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
- `cfg.enable` 必须是 boolean
- `nodes` 必须是数组
- 每个节点通过 `Pr[t.type].checkWebNode(t)` 校验

### changeGraphConfig API

```json
{
  "params": {
    "id": "graph_1710000000000",
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
  "id": "graph_1710000000000",
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
        "did": "1179053616",
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
        "did": "950058664",
        "siid": 2,
        "aiid": 1,
        "ins": [{"piid": 1, "value": true}]
      },
      "inputs": {"trigger": null},
      "outputs": {"output": []}
    }
  ],
  "cfg": {
    "id": "graph_1710000000000",
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
  "id": "graph_1710000000001",
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
      "outputs": {"output": ["delay1.trigger"]}
    },
    {
      "id": "delay1",
      "type": "delay",
      "cfg": {"name": "delay", "version": 1, "unit": "s", "value": 5, "pos": {"x": 700, "y": 100, "width": 528, "height": 164}},
      "props": {"timeout": 5000},
      "inputs": {"trigger": null},
      "outputs": {"output": ["action1.trigger"]}
    },
    {
      "id": "action1",
      "type": "deviceOutput",
      "cfg": {"urn": "urn:miot-spec-v2:device:light:0000A001:xiaomi-btlm2p:2", "version": 1, "pos": {"x": 1300, "y": 100, "width": 528, "height": 164}},
      "props": {"did": "950058664", "siid": 2, "aiid": 1, "ins": [{"piid": 1, "value": false}]},
      "inputs": {"trigger": null},
      "outputs": {"output": []}
    }
  ],
  "cfg": {
    "id": "graph_1710000000001",
    "enable": true,
    "uiType": "graph",
    "userData": {"name": "定时关灯", "lastUpdateTime": 1710000000000, "transform": {"x": 0, "y": 0, "scale": 1, "rotate": 0}}
  }
}
```

### 示例3：多场景触发（signalOr）

```json
{
  "id": "graph_1710000000002",
  "nodes": [
    {
      "id": "input1",
      "type": "deviceInput",
      "cfg": {"urn": "urn:miot-spec-v2:device:gateway:0000A019:xiaomi-hub1:3", "version": 1, "pos": {"x": 100, "y": 100, "width": 528, "height": 164}},
      "props": {"did": "1179053616", "siid": 4, "eiid": 1, "preload": false, "arguments": [{"piid": 1, "dtype": "string", "operator": "=", "v1": "客厅明亮"}]},
      "inputs": {},
      "outputs": {"output": ["or1.input0"]}
    },
    {
      "id": "input2",
      "type": "deviceInput",
      "cfg": {"urn": "urn:miot-spec-v2:device:gateway:0000A019:xiaomi-hub1:3", "version": 1, "pos": {"x": 100, "y": 300, "width": 528, "height": 164}},
      "props": {"did": "1179053616", "siid": 4, "eiid": 1, "preload": false, "arguments": [{"piid": 1, "dtype": "string", "operator": "=", "v1": "客厅温馨"}]},
      "inputs": {},
      "outputs": {"output": ["or1.input1"]}
    },
    {
      "id": "or1",
      "type": "signalOr",
      "cfg": {"version": 1, "pos": {"x": 700, "y": 200, "width": 528, "height": 164}},
      "inputs": {"input0": null, "input1": null},
      "outputs": {"output": ["action1.trigger"]}
    },
    {
      "id": "action1",
      "type": "deviceOutput",
      "cfg": {"urn": "urn:miot-spec-v2:device:light:0000A001:lemesh-wy0d02:1", "version": 1, "pos": {"x": 1300, "y": 200, "width": 528, "height": 164}},
      "props": {"did": "2076971127", "siid": 2, "aiid": 1, "ins": [{"piid": 2, "value": 80}]},
      "inputs": {"trigger": null},
      "outputs": {"output": []}
    }
  ],
  "cfg": {
    "id": "graph_1710000000002",
    "enable": true,
    "uiType": "graph",
    "userData": {"name": "多场景开灯", "lastUpdateTime": 1710000000000, "transform": {"x": 0, "y": 0, "scale": 1, "rotate": 0}}
  }
}
```
