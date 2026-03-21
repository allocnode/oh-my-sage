---
name: mijia-automation
description: 米家自动化极客版规则创建指南。当用户想要创建智能场景、设备联动、定时任务、条件触发等自动化规则时使用此skill。
metadata:
  author: oh-my-sage
  version: "1.0"
  platform: xiaomi-mijia
---

# 米家自动化规则创建

## 快速参考

### 规则结构

```json
{
  "id": "graph_<timestamp>",
  "nodes": [触发节点, 执行节点],
  "cfg": {
    "id": "graph_<timestamp>",
    "enable": true,
    "uiType": "graph",
    "userData": {
      "name": "规则名称",
      "lastUpdateTime": <timestamp>,
      "transform": {"x": 0, "y": 0, "scale": 1, "rotate": 0}
    }
  }
}
```

### 常用节点类型

| 类型 | 用途 | 关键配置 |
|------|------|----------|
| deviceInput | 设备触发器 | siid, eiid/piid, operator, value |
| deviceOutput | 设备控制 | siid, aiid/piid, params |
| timer | 定时触发 | hour, minute, filter.days |
| delay | 延时执行 | timeout(ms) |
| signalOr | 多触发源 | inputs |
| condition | 条件分支 | inputs.trigger, inputs.condition |

### 设备控制速查

| 设备 | 操作 | siid | piid/aiid | params |
|------|------|------|-----------|--------|
| 灯光 | 开关 | 2 | piid=1 | [true/false] |
| 灯光 | 亮度 | 2 | piid=2 | [1-100] |
| 灯光 | 色温 | 2 | piid=3 | [2700-6500] |
| 空调 | 开关 | 2 | piid=1 | [true/false] |
| 空调 | 温度 | 2 | piid=2 | [16-30] |
| 窗帘 | 开合 | 2 | piid=1 | [0-100] |

## 创建流程

1. **获取设备信息** - 使用 get_devices 了解可用设备
2. **确定触发条件** - 选择触发器类型（设备/定时/场景）
3. **构建节点** - 创建触发节点和执行节点
4. **连接节点** - 通过 outputs/inputs 连接
5. **使用 create_graph 创建** - 传递完整的节点和配置

## 节点连接方式

```json
// 节点A输出连接到节点B输入
{"id": "nodeA", "outputs": {"output": [["nodeB", "trigger"]]}}

// 节点B接收输入
{"id": "nodeB", "inputs": {"trigger": null}, "outputs": {}}
```

## 常见模式

### 单触发单执行
```
deviceInput → deviceOutput
```

### 定时触发
```
timer → deviceOutput
```

### 多触发源
```
deviceInput ─┐
             ├─ signalOr → deviceOutput
deviceInput ─┘
```

### 场景联动（多设备）
```
deviceInput → deviceOutput → deviceOutput → ...
```

## 详细参考

- [节点类型详解](references/node-types.md)
- [设备 URN 查询](references/device-urn.md)
- [网关场景触发](references/gateway-scene.md)

## 注意事项

1. **节点ID唯一** - 使用 `node_<timestamp>` 格式
2. **数据类型匹配** - dtype 必须与设备定义一致
3. **参数格式** - params 必须是数组格式
4. **changeGraphConfig** - 需要传递完整的 userData，否则会丢失规则名称
