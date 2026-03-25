---
name: mijia-automation
description: 米家自动化极客版规则创建指南。当用户想要创建智能场景、设备联动、定时任务、条件触发等自动化规则时使用此skill。
metadata:
  author: oh-my-sage
  version: "2.0"
---

# 米家自动化规则创建

## 规则结构

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

## 节点结构

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
  "inputs": {},
  "outputs": {"output": ["node2.trigger"]}
}
```

## 关键校验规则

1. **节点 id**：只允许 `[0-9a-zA-Z]`，不能用下划线、连字符
2. **outputs 格式**：`"portName": ["nodeId.inputPort"]`（点分隔字符串）
3. **deviceOutput**：即使无后续节点，必须有 `"output": []`
4. **deviceGet**：必须有 `outputs.output` 和 `outputs.output2`（两个分支）
5. **inputs 命名**：
   - `deviceGet`, `varGet`, `statusLast`, `varSetNumber`, `varSetString`, `deviceGetSetVar` 等使用 `input`
   - `deviceOutput`, `delay`, `condition` 等使用 `trigger`
   - 搞混会导致 "No input" 错误！
6. **dtype 映射**：MIOT Spec 的 `bool`→`boolean`，`uint8`/`int32` 等→`int`，`float`→`float`
7. **props 必须存在**：所有节点必须有 `props` 字段（可以是空对象 `{}`），否则报 "Invalid props"
8. **cfg.name**：所有节点的 `cfg` 应包含 `name` 字段（值为节点类型名）

## 常用操作符

| dtype | 允许的 operator |
|-------|----------------|
| int | `>=`, `<=`, `=`, `!=`, `>`, `<`, `between`, `include` |
| float | `>`, `<`, `between` |
| boolean | `=` |
| string | `=` |

## 快速参考

| 节点类型 | 用途 | inputs | 关键 props | cfg.name |
|----------|------|--------|-----------|----------|
| deviceInput | 设备触发 | `{}` | did, siid, piid/eiid, operator, v1 | deviceInput |
| deviceOutput | 设备控制 | `{"trigger": null}` | did, siid, piid, value | deviceOutput |
| deviceGet | 查询状态 | `{"input": null}` | did, siid, piid, dtype, operator, v1 | deviceGet |
| alarmClock | 定时触发 | `{}` | type, hour, minute, second, filter | alarmClock |
| timeRange | 时间段 | `{}` | start, end, filter | timeRange |
| delay | 延时 | `{"trigger": null}` | timeout (毫秒) | delay |
| condition | 条件判断 | `{"trigger": null, "condition": null}` | 必须有（可空 `{}`） | condition |
| signalOr | 任一事件 | `{input0: null, input1: null}` | - | - |

## 设备控制常见模式

- 开关灯：`siid=2, piid=1, value=true/false`
- 亮度：`siid=2, piid=2, value=1-100`
- 窗帘开合：`siid=2, piid=1, value=0-100`

## MIOT Spec dtype 映射

MIOT Spec 返回的 `format` 需要转换为网关 `dtype`：

| MIOT format | 网关 dtype | v1 值类型 |
|-------------|-----------|----------|
| `bool` | `boolean` | `true`/`false` |
| `uint8`, `int32` 等 | `int` | 整数 |
| `float`, `double` | `float` | 数字 |
| `string` | `string` | 字符串 |

**示例**：MIOT 返回 `"format": "bool"` → 使用 `"dtype": "boolean"`

## 详细参考

- [完整节点定义与校验规则](references/mijia-complete-reference.md)
