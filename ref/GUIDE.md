# 米家网关参考文档

> 小米米家自动化极客版网关 API 参考

## 目录

1. [概述](#概述)
2. [认证流程](#认证流程)
3. [API 接口文档](#api-接口文档)
4. [设备信息结构](#设备信息结构)
5. [MIOT Spec 规范](#miot-spec-规范)
6. [自动化规则结构](#自动化规则结构)
7. [节点类型详解](#节点类型详解)
8. [构建自动化规则指南](#构建自动化规则指南)

---

## 概述

本文档描述了小米米家自动化极客版网关的 WebSocket 协议和 API 接口，用于创建和管理智能家居自动化规则（GRAPH）。

### 网关连接

- **协议**: WebSocket + ECJPAKE 加密
- **默认地址**: `ws://192.168.0.5:80/centrallinkws/`
- **认证方式**: 6 位数字登录码（每次连接生成）

### 数据格式

- **请求/响应**: JSON-RPC 2.0
- **压缩**: deflateRaw
- **加密**: AES-GCM

---

## 认证流程

### 完整流程

```
1. WebSocket 连接: ws://192.168.0.5:80/centrallinkws/
2. 协议协商: ["passcode"]
3. ECJPAKE Round One (客户端 → 服务器)
4. ECJPAKE Round One (服务器 → 客户端)
5. ECJPAKE Round Two (客户端 → 服务器) ← 收到服务器 Round One 后立即发送
6. ECJPAKE Round Two (服务器 → 客户端)
7. SESSION_KEY_EXCHANGE (客户端先发送)
8. 安全会话建立
```

---

## API 接口文档

### 请求格式（JSON-RPC 2.0）

```json
{
  "jsonrpc": "2.0",
  "id": 递增ID,
  "method": "/api/{方法名}",
  "params": {参数}
}
```

### 加密流程

1. JSON 序列化为 UTF-8 字节
2. 压缩: `原始长度(4字节小端) + deflateRaw压缩数据`
3. AES-GCM 加密: `counter(4字节小端) + ciphertext + tag(16字节)`
4. 添加 DATA_TYPE 前缀 (DATA_TYPE=5)

---

### 1. getDevList - 获取设备列表

**请求**:
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "/api/getDevList",
  "params": {}
}
```

**响应**:
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "devList": {
      "434802569": {
        "specV2Access": true,
        "specV3Access": false,
        "online": false,
        "pushAvailable": false,
        "name": "米家空调",
        "model": "xiaomi.aircondition.c16",
        "modelName": "米家空调 巨省电",
        "urn": "urn:miot-spec-v2:device:air-conditioner:0000A004:xiaomi-c16:1",
        "roomId": "52001404362",
        "roomName": "客厅",
        "icon": "https://..."
      }
    }
  }
}
```

**设备信息字段说明**:

| 字段 | 类型 | 说明 |
|------|------|------|
| specV2Access | boolean | 是否支持 MIOT Spec V2 协议 |
| specV3Access | boolean | 是否支持 MIOT Spec V3 协议 |
| online | boolean | 设备是否在线 |
| pushAvailable | boolean | 设备是否可接收推送消息 |
| name | string | 用户自定义的设备名称 |
| model | string | 设备型号标识符（如 xiaomi.aircondition.c16） |
| modelName | string | 设备产品名称（如 米家空调 巨省电） |
| urn | string | MIOT 设备类型标识符 |
| roomId | string | 所属房间ID |
| roomName | string | 所属房间名称 |
| icon | string | 设备图标URL |

---

### 2. getGraphList - 获取自动化规则列表

**请求**:
```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "/api/getGraphList",
  "params": {}
}
```

**响应**:
```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "result": [
    {
      "id": "rule_123456",
      "name": "回家自动开灯",
      "enabled": true,
      "createTime": 1710000000000,
      "updateTime": 1710000000000
    }
  ]
}
```

---

### 3. getGraph - 获取自动化规则详情

**请求**:
```json
{
  "jsonrpc": "2.0",
  "id": 3,
  "method": "/api/getGraph",
  "params": {
    "id": "rule_123456"
  }
}
```

**响应**:
```json
{
  "jsonrpc": "2.0",
  "id": 3,
  "result": {
    "nodes": [
      {
        "id": "node_1",
        "type": "deviceInput",
        "cfg": {
          "urn": "urn:miot-spec-v2:device:sensor:0000A077:linp-es2:1",
          "simplified": false,
          "pos": {"x": 100, "y": 100, "width": 200, "height": 100}
        },
        "props": {
          "did": "blt.3.xxx",
          "siid": 2,
          "piid": 1,
          "dtype": "bool",
          "operator": "eq",
          "value": true,
          "preload": false
        },
        "inputs": {},
        "outputs": {"output": [["node_2", "trigger"]]}
      },
      {
        "id": "node_2",
        "type": "deviceOutput",
        "cfg": {
          "urn": "urn:miot-spec-v2:device:light:0000A001:xiaomi-btlm2p:2",
          "simplified": false,
          "pos": {"x": 300, "y": 100, "width": 200, "height": 100}
        },
        "props": {
          "did": "950058664",
          "siid": 2,
          "aiid": 1,
          "dtype": "",
          "params": [true]
        },
        "inputs": {"trigger": null},
        "outputs": {}
      }
    ]
  }
}
```

**节点 cfg 字段说明**:

| 字段 | 类型 | 说明 |
|------|------|------|
| urn | string | 关联设备的 URN（如 deviceInput, deviceOutput 等设备节点） |
| simplified | boolean | 是否为简化显示模式 |
| pos | object | 节点在画布上的位置和大小 |
| pos.x | number | X 坐标（像素） |
| pos.y | number | Y 坐标（像素） |
| pos.width | number | 节点宽度（像素） |
| pos.height | number | 节点高度（像素） |
| name | string | 节点名称（仅 nop 类型使用） |
| contents | array | 节点内容（仅 nop 类型使用） |
| background | string | 背景颜色（仅 nop 类型使用） |

**deviceInput 节点的 props 字段**:

| 字段 | 类型 | 说明 |
|------|------|------|
| did | string | 设备ID |
| siid | number | 服务ID（Service ID） |
| piid | number | 属性ID（Property ID，用于属性触发） |
| eiid | number | 事件ID（Event ID，用于事件触发） |
| dtype | string | 数据类型（bool, int, float, string） |
| operator | string | 比较操作符（eq, ne, gt, lt, ge, le） |
| value | any | 比较值 |
| preload | boolean | 是否预加载设备状态 |

**deviceOutput 节点的 props 字段**:

| 字段 | 类型 | 说明 |
|------|------|------|
| did | string | 设备ID |
| siid | number | 服务ID |
| aiid | number | 动作ID（Action ID） |
| piid | number | 属性ID（用于直接设置属性时，与 aiid 二选一） |
| dtype | string | 数据类型 |
| params | array | 动作参数列表，如 `[true]`, `[50]`, `["value"]` |

**timer 节点的 props 字段**:

| 字段 | 类型 | 说明 |
|------|------|------|
| type | string | 定时类型，固定为 "periodicAlarm" |
| isSunset | boolean | 是否基于日落时间触发 |
| hour | number | 小时（0-23） |
| minute | number | 分钟（0-59） |
| second | number | 秒（0-59） |
| offset | number | 偏移量（毫秒），用于日落模式 |
| filter | object | 星期过滤器 |
| filter.type | string | 过滤器类型，固定为 "weekday" |
| filter.days | array | 星期数组，1=周一，7=周日 |

**delay 节点的 props 字段**:

| 字段 | 类型 | 说明 |
|------|------|------|
| timeout | number | 延迟时间（毫秒） |

**cfg 中的额外字段（定时器相关）**:

| 字段 | 类型 | 说明 |
|------|------|------|
| happenType | string | 触发时间类型："now"（立即）, "before"（之前）, "after"（之后） |
| tempOffset | number | 临时偏移量 |
| unit | string | 时间单位："s"（秒）, "m"（分）, "h"（时） |
| value | number | 时间值 |

---

### 4. setGraph - 保存自动化规则

**请求**:
```json
{
  "jsonrpc": "2.0",
  "id": 4,
  "method": "/api/setGraph",
  "params": {
    "id": "rule_123456",
    "nodes": [
      {
        "id": "node_1",
        "type": "deviceInput",
        "cfg": {
          "urn": "urn:miot-spec-v2:device:sensor:0000A077:linp-es2:1",
          "simplified": false,
          "pos": {"x": 100, "y": 100, "width": 200, "height": 100}
        },
        "props": {
          "did": "blt.3.xxx",
          "siid": 2,
          "piid": 1,
          "dtype": "bool",
          "operator": "eq",
          "value": true,
          "preload": false
        },
        "inputs": {},
        "outputs": {"output": [["node_2", "trigger"]]}
      },
      {
        "id": "node_2",
        "type": "deviceOutput",
        "cfg": {
          "urn": "urn:miot-spec-v2:device:light:0000A001:xiaomi-btlm2p:2",
          "simplified": false,
          "pos": {"x": 300, "y": 100, "width": 200, "height": 100}
        },
        "props": {
          "did": "950058664",
          "siid": 2,
          "aiid": 1,
          "dtype": "",
          "params": [true]
        },
        "inputs": {"trigger": null},
        "outputs": {}
      }
    ],
    "cfg": {
      "id": "rule_123456",
      "enable": true,
      "uiType": "graph",
      "userData": {
        "name": "规则名称",
        "lastUpdateTime": 1710000000000,
        "transform": {"x": 0, "y": 0, "scale": 1, "rotate": 0}
      }
    }
  }
}
```

**cfg 字段说明**:

| 字段 | 类型 | 说明 |
|------|------|------|
| id | string | 规则ID（与 params.id 相同） |
| enable | boolean | 是否启用规则 |
| uiType | string | UI 类型，固定为 "graph" |
| userData | object | 用户数据 |
| userData.name | string | 规则名称 |
| userData.lastUpdateTime | number | 最后更新时间戳（毫秒） |
| userData.transform | object | 画布变换信息 |
| userData.transform.x | number | 画布 X 偏移 |
| userData.transform.y | number | 画布 Y 偏移 |
| userData.transform.scale | number | 画布缩放比例 |
| userData.transform.rotate | number | 画布旋转角度 |

**响应**:
```json
{"jsonrpc": "2.0", "id": 4, "result": {}}
```

---

### 5. deleteGraph - 删除自动化规则

**请求**:
```json
{
  "jsonrpc": "2.0",
  "id": 5,
  "method": "/api/deleteGraph",
  "params": {"id": "rule_123456"}
}
```

**响应**:
```json
{"jsonrpc": "2.0", "id": 5, "result": {}}
```

---

### 6. changeGraphConfig - 更改规则配置

**请求**:
```json
{
  "jsonrpc": "2.0",
  "id": 6,
  "method": "/api/changeGraphConfig",
  "params": {
    "id": "rule_123456",
    "enable": true,
    "userData": {
      "name": "新规则名称",
      "lastUpdateTime": 1710000000000,
      "transform": {"x": 0, "y": 0, "scale": 1, "rotate": 0}
    }
  }
}
```

**响应**:
```json
{"jsonrpc": "2.0", "id": 6, "result": {}}
```

---

### 7. getVarScopeList - 获取变量作用域列表

**请求**:
```json
{"jsonrpc": "2.0", "id": 7, "method": "/api/getVarScopeList", "params": {}}
```

**响应**:
```json
{"jsonrpc": "2.0", "id": 7, "result": {"scopes": ["global", "rule_123456"]}}
```

---

### 8. getVarList - 获取变量列表

**请求**:
```json
{
  "jsonrpc": "2.0",
  "id": 8,
  "method": "/api/getVarList",
  "params": {"scope": "global"}
}
```

**响应**:
```json
{
  "jsonrpc": "2.0",
  "id": 8,
  "result": {
    "var_001": {"type": "number", "value": 25, "userData": {"name": "室内温度"}},
    "var_002": {"type": "string", "value": "home", "userData": {"name": "场景模式"}}
  }
}
```

**变量字段说明**:

| 字段 | 类型 | 说明 |
|------|------|------|
| type | string | 变量类型: "number" 或 "string" |
| value | number/string | 变量当前值 |
| userData | object | 用户自定义数据 |
| userData.name | string | 变量显示名称 |

---

### 9. createVar - 创建变量

**请求**:
```json
{
  "jsonrpc": "2.0",
  "id": 9,
  "method": "/api/createVar",
  "params": {
    "scope": "global",
    "id": "var_new",
    "type": "number",
    "value": 0,
    "userData": {"name": "新变量"}
  }
}
```

**请求参数说明**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| scope | string | 是 | 变量作用域: "global" 或 "rule_xxx" |
| id | string | 是 | 变量ID |
| type | string | 是 | 变量类型: "number" 或 "string" |
| value | number/string | 否 | 初始值（number类型默认0，string类型默认""，不能为 NaN） |
| userData | object | 否 | 用户自定义数据 |
| userData.name | string | 否 | 变量名称 |

**响应**:
```json
{"jsonrpc": "2.0", "id": 9, "result": {}}
```

---

### 10. deleteVar - 删除变量

**请求** (删除单个):
```json
{
  "jsonrpc": "2.0",
  "id": 10,
  "method": "/api/deleteVar",
  "params": {"scope": "global", "id": "var_001"}
}
```

**请求** (删除该作用域所有变量):
```json
{
  "jsonrpc": "2.0",
  "id": 10,
  "method": "/api/deleteVar",
  "params": {"scope": "global", "all": true}
}
```

**响应**:
```json
{"jsonrpc": "2.0", "id": 10, "result": {}}
```

---

### 11. getVarValue - 获取变量值

**请求**:
```json
{
  "jsonrpc": "2.0",
  "id": 11,
  "method": "/api/getVarValue",
  "params": {"scope": "global", "id": "var_001"}
}
```

**响应**:
```json
{"jsonrpc": "2.0", "id": 11, "result": {"value": 25}}
```

---

### 12. setVarValue - 设置变量值

**请求**:
```json
{
  "jsonrpc": "2.0",
  "id": 12,
  "method": "/api/setVarValue",
  "params": {"scope": "global", "id": "var_001", "value": 26}
}
```

**请求参数说明**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| scope | string | 是 | 变量作用域 |
| id | string | 是 | 变量ID |
| value | number/string | 是 | 变量值（必须与变量类型匹配，不能为 NaN） |

**响应**:
```json
{"jsonrpc": "2.0", "id": 12, "result": {}}
```

---

### 13. getLog - 获取日志

**请求**:
```json
{
  "jsonrpc": "2.0",
  "id": 13,
  "method": "/api/getLog",
  "params": {"num": 0}
}
```

**请求参数说明**:

| 参数 | 类型 | 说明 |
|------|------|------|
| num | number | 日志页码（从0开始，每页包含多行日志） |

**响应**:
```json
{"jsonrpc": "2.0", "id": 13, "result": "2024-03-21 10:00:00 [规则] 规则启用: 回家自动开灯\n2024-03-21 10:00:01 [设备] 人体传感器 触发\n2024-03-21 10:00:01 [动作] 筒灯 打开"}
```

返回空字符串表示没有更多日志。

---

### 14. getBackupList - 获取备份列表

**请求**:
```json
{
  "jsonrpc": "2.0",
  "id": 14,
  "method": "/api/getBackupList",
  "params": {"from": "fds"}
}
```

**请求参数说明**:

| 参数 | 类型 | 说明 |
|------|------|------|
| from | string | 备份来源: "fds"（云端备份） |

**响应**:
```json
{
  "jsonrpc": "2.0",
  "id": 14,
  "result": [
    {
      "did": "1179053616",
      "ts": "1710000000000",
      "fileName": "auto_backup_20240321",
      "size": 12345
    }
  ]
}
```

**备份信息字段说明**:

| 字段 | 类型 | 说明 |
|------|------|------|
| did | string | 网关设备ID |
| ts | string | 备份时间戳（毫秒，字符串格式） |
| fileName | string | 备份文件名 |
| size | number | 备份大小（字节） |

---

### 15. createBackup - 创建备份

**请求**:
```json
{
  "jsonrpc": "2.0",
  "id": 15,
  "method": "/api/createBackup",
  "params": {
    "from": "fds",
    "params": {
      "fileName": "my_backup_20240321"
    }
  }
}
```

**响应**:
```json
{"jsonrpc": "2.0", "id": 15, "result": 123}
```
返回 progress_id，用于查询备份进度。

---

### 16. downloadBackup - 下载备份到网关

**请求**:
```json
{
  "jsonrpc": "2.0",
  "id": 16,
  "method": "/api/downloadBackup",
  "params": {
    "from": "fds",
    "params": {
      "did": "1179053616",
      "ts": "1710000000000",
      "fileName": "my_backup"
    }
  }
}
```

**响应**:
```json
{"jsonrpc": "2.0", "id": 16, "result": 124}
```
返回 progress_id（如果为 0 表示已存在，无需下载）。

---

### 17. generateBackup - 生成备份数据

**请求**:
```json
{
  "jsonrpc": "2.0",
  "id": 17,
  "method": "/api/generateBackup",
  "params": {
    "from": "fds",
    "params": {
      "did": "1179053616",
      "ts": "1710000000000",
      "fileName": "my_backup"
    }
  }
}
```

**响应**: 返回备份数据（二进制格式，包含规则和变量的完整备份）

---

### 18. loadBackup - 从网关加载备份

**请求**:
```json
{
  "jsonrpc": "2.0",
  "id": 18,
  "method": "/api/loadBackup",
  "params": {
    "from": "fds",
    "params": {
      "did": "1179053616",
      "ts": "1710000000000",
      "fileName": "my_backup"
    }
  }
}
```

**响应**:
```json
{"jsonrpc": "2.0", "id": 18, "result": {}}
```

---

### 19. deleteBackup - 删除备份

**请求**:
```json
{
  "jsonrpc": "2.0",
  "id": 19,
  "method": "/api/deleteBackup",
  "params": {
    "from": "fds",
    "params": {
      "did": "1179053616",
      "ts": "1710000000000",
      "fileName": "my_backup"
    }
  }
}
```

**响应**:
```json
{"jsonrpc": "2.0", "id": 19, "result": {}}
```

---

### 20. getBackupProgress - 获取备份/恢复进度

**请求**:
```json
{
  "jsonrpc": "2.0",
  "id": 20,
  "method": "/api/getBackupProgress",
  "params": {
    "from": "fds",
    "params": {
      "progress_id": 123
    }
  }
}
```

**响应**:
```json
{"jsonrpc": "2.0", "id": 20, "result": {"progress": 50}}
```

progress 为 0-100 的整数，100 表示完成。

---

### 21. setBackupConfig - 设置备份配置

**请求**:
```json
{
  "jsonrpc": "2.0",
  "id": 21,
  "method": "/api/setBackupConfig",
  "params": {
    "from": "fds",
    "params": {
      "autoBackup": true,
      "autoBackupLimit": 5
    }
  }
}
```

**请求参数说明**:

| 参数 | 类型 | 说明 |
|------|------|------|
| autoBackup | boolean | 是否开启自动备份 |
| autoBackupLimit | number | 自动备份保留数量上限 |

**响应**:
```json
{"jsonrpc": "2.0", "id": 21, "result": {}}
```

---

### 22. getBackupConfig - 获取备份配置

**请求**:
```json
{
  "jsonrpc": "2.0",
  "id": 22,
  "method": "/api/getBackupConfig",
  "params": {"from": "fds"}
}
```

**响应**:
```json
{"jsonrpc": "2.0", "id": 22, "result": {"autoBackup": true, "autoBackupLimit": 5}}
```

---

### 推送接口 (Push)

服务端可能主动推送以下消息:

**属性变化 (push/property_changed)**:
```json
{
  "jsonrpc": "2.0",
  "method": "/push/property_changed",
  "params": {
    "did": "434802569",
    "siid": 2,
    "piid": 1,
    "value": true
  }
}
```

**推送参数说明**:

| 参数 | 类型 | 说明 |
|------|------|------|
| did | string | 设备ID |
| siid | number | 服务ID |
| piid | number | 属性ID |
| value | any | 属性新值（类型取决于属性定义） |

**事件触发 (push/event_triggered)**:
```json
{
  "jsonrpc": "2.0",
  "method": "/push/event_triggered",
  "params": {
    "did": "434802569",
    "siid": 3,
    "eiid": 1,
    "arguments": []
  }
}
```

**推送参数说明**:

| 参数 | 类型 | 说明 |
|------|------|------|
| did | string | 设备ID |
| siid | number | 服务ID |
| eiid | number | 事件ID |
| arguments | array | 事件参数列表 |

---

## 设备信息结构

### 设备基本信息（来自 getDevList）

```json
{
  "434802569": {
    "specV2Access": true,      // 是否支持 MIOT Spec V2
    "specV3Access": false,     // 是否支持 MIOT Spec V3
    "online": true,            // 是否在线
    "pushAvailable": true,     // 是否可推送
    "name": "客厅灯",          // 用户自定义名称
    "model": "xiaomi.light.btlm2p",  // 设备型号
    "modelName": "米家筒灯2 Pro",    // 产品名称
    "urn": "urn:miot-spec-v2:device:light:0000A001:xiaomi-btlm2p:2:0000C802",
    "roomId": "52001132047",   // 房间ID
    "roomName": "客厅",        // 房间名称
    "icon": "https://..."      // 图标URL
  }
}
```

### 设备详细信息（来自 URN 解析）

设备详细信息通过 MIOT Spec 网站获取：
- URL: `https://miot-spec.org/miot-spec-v2/instance?type={urn}`

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
      "properties": [...],
      "events": [...],
      "actions": [...]
    }
  ]
}
```

---

## MIOT Spec 规范

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

### 服务（Service）

每个设备包含多个服务，每个服务有唯一的 `siid`（Service ID）

常见服务类型：
- `device-information` - 设备信息（通常不可操作）
- `light` - 灯光控制
- `switch` - 开关控制
- `environment` - 环境传感器
- `occupancy-sensor` - 人体传感器

### 属性（Property）

属性用于读取或设置设备状态。

属性结构：
```json
{
  "siid": 2,           // 服务ID
  "piid": 1,           // 属性ID
  "urn": "urn:miot-spec-v2:property:on:00000006",
  "sUrn": "urn:miot-spec-v2:service:light:00007802",
  "description": "开关",
  "dtype": "boolean",  // 数据类型: int, float, boolean, string
  "access": ["read", "write", "notify"],  // 访问权限
  "valueRange": {      // 值范围（仅部分属性）
    "min": 1,
    "max": 100,
    "step": 1
  },
  "valueList": [       // 枚举值列表（仅部分属性）
    {"value": 0, "description": "关闭"},
    {"value": 1, "description": "开启"}
  ]
}
```

属性分类：
- **propertyGet** - 可查询的属性（用于条件判断）
- **propertySet** - 可设置的属性（用于执行操作）
- **propertyNotify** - 可监听的属性（用于触发器）

### 事件（Event）

事件是设备主动触发的动作（如按钮按下、传感器报警）

事件结构：
```json
{
  "siid": 3,
  "eiid": 1,
  "urn": "urn:miot-spec-v2:event:physical-button:00000001",
  "sUrn": "urn:miot-spec-v2:service:physical-button:00007803",
  "description": "物理按键",
  "arguments": [     // 事件参数
    {
      "piid": 1,
      "dtype": "int",
      "description": "按键编号"
    }
  ]
}
```

### 动作（Action）

动作是可执行的操作（如打开空调、调整温度）

动作结构：
```json
{
  "siid": 2,
  "aiid": 1,
  "urn": "urn:miot-spec-v2:action:toggle:00002801",
  "sUrn": "urn:miot-spec-v2:service:light:00007802",
  "description": "开关",
  "in": [            // 输入参数
    {
      "piid": 1,
      "dtype": "boolean",
      "description": "开关状态"
    }
  ]
}
```

### 数据类型（dtype）

| 类型 | 说明 | 示例值 |
|------|------|--------|
| int | 整数 | 25 |
| float | 浮点数 | 25.5 |
| boolean | 布尔 | true/false |
| string | 字符串 | "hello" |

### 常用属性 URN

| URN | 说明 | 值类型 |
|-----|------|--------|
| `urn:miot-spec-v2:property:on:00000006` | 开关 | boolean |
| `urn:miot-spec-v2:property:brightness:00000005` | 亮度 | int (1-100) |
| `urn:miot-spec-v2:property:color-temperature:0000000F` | 色温 | int (2700-6500) |
| `urn:miot-spec-v2:property:temperature:00000020` | 温度 | float |
| `urn:miot-spec-v2:property:relative-humidity:00000022` | 湿度 | float |
| `urn:miot-spec-v2:property:motion-state:0000007D` | 人体移动 | boolean |
| `urn:miot-spec-v2:property:contact-state:0000007C` | 门窗状态 | boolean |
| `urn:miot-spec-v2:property:illumination:0000007A` | 光照度 | int |

---

## 自动化规则结构

### 规则组成

一个自动化规则包含：
1. **触发器（Trigger）** - 什么情况下触发
2. **条件（Condition）** - 满足什么条件才执行
3. **动作（Action）** - 执行什么操作

### 规则 JSON 结构

```json
{
  "id": "rule_123456",        // 规则ID
  "name": "回家自动开灯",      // 规则名称
  "enabled": true,            // 是否启用
  "createTime": 1710000000000,
  "updateTime": 1710000000000,
  "nodes": [                  // 节点列表
    {
      "id": "node_1",
      "type": "deviceInput",
      "cfg": {
        "urn": "urn:...",
        "pos": {"x": 100, "y": 100, "width": 200, "height": 100}
      },
      "props": {
        "did": "blt.3.xxx",
        "siid": 2,
        "piid": 1,
        "dtype": "bool",
        "operator": "eq",
        "value": true
      },
      "inputs": {},
      "outputs": {
        "output": [["node_2", "trigger"]]
      }
    },
    {
      "id": "node_2",
      "type": "deviceOutput",
      "cfg": {"urn": "urn:..."},
      "props": {
        "did": "950058664",
        "siid": 2,
        "aiid": 1,
        "params": [true]
      },
      "inputs": {
        "trigger": null
      },
      "outputs": {}
    }
  ]
}
```

### 连接方式

节点之间通过 `inputs` 和 `outputs` 连接：

```json
// 节点1的输出连接到节点2的输入
{
  "id": "node_1",
  "outputs": {
    "output": [["node_2", "trigger"]]  // [目标节点ID, 目标输入端口]
  }
}

// 节点2的输入
{
  "id": "node_2",
  "inputs": {
    "trigger": null  // null 表示由外部触发
  }
}
```

---

## 节点类型详解

### 1. deviceInput - 设备触发器

**用途**: 监听设备事件或状态变化

**配置**:
```json
{
  "type": "deviceInput",
  "cfg": {"urn": "urn:miot-spec-v2:device:sensor:..."},
  "props": {
    "did": "设备ID",
    "siid": 2,
    "piid": 1,        // 属性触发时使用
    "dtype": "bool",
    "operator": "eq",  // 比较操作符: eq, ne, gt, lt, ge, le
    "value": true
  }
}
```

**触发条件**:
- 当 `props.piid` 存在时：属性值满足条件时触发
- 当 `props.eiid` 存在时：事件发生时触发

**操作符说明**:
| 操作符 | 说明 | 适用类型 |
|--------|------|----------|
| eq | 等于 | 所有类型 |
| ne | 不等于 | 所有类型 |
| gt | 大于 | int, float |
| lt | 小于 | int, float |
| ge | 大于等于 | int, float |
| le | 小于等于 | int, float |

### 2. deviceOutput - 执行操作

**用途**: 控制设备执行某个操作

**配置**:
```json
{
  "type": "deviceOutput",
  "cfg": {"urn": "urn:miot-spec-v2:device:light:..."},
  "props": {
    "did": "设备ID",
    "siid": 2,
    "aiid": 1,        // 动作ID
    "params": [true]  // 动作参数
  }
}
```

**无动作设置属性**:
```json
{
  "type": "deviceOutput",
  "props": {
    "did": "设备ID",
    "siid": 2,
    "piid": 1,        // 属性ID（代替aiid）
    "dtype": "int",
    "params": [50]    // 属性值
  }
}
```

### 3. deviceGet - 查询状态

**用途**: 查询设备当前状态

**配置**:
```json
{
  "type": "deviceGet",
  "cfg": {"urn": "urn:..."},
  "props": {
    "did": "设备ID",
    "siid": 2,
    "piid": 1,
    "dtype": "int"
  }
}
```

**输出**:
- `output`: 满足条件时触发
- `output2`: 不满足条件时触发

### 4. condition - 当-如果-就

**用途**: 条件分支判断

**配置**:
```json
{
  "type": "condition",
  "inputs": {
    "trigger": null,   // 触发事件
    "condition": null  // 条件状态
  },
  "outputs": {
    "met": [["node_3", "trigger"]],    // 条件满足时
    "unmet": [["node_4", "trigger"]]   // 条件不满足时
  }
}
```

### 5. timer - 定时触发

**用途**: 按时间触发规则

**配置**:
```json
{
  "type": "timer",
  "props": {
    "type": "periodicAlarm",
    "hour": 8,
    "minute": 0,
    "second": 0,
    "filter": {
      "type": "weekday",
      "days": [1, 2, 3, 4, 5]  // 周一到周五
    },
    "offset": 0
  }
}
```

**filter 类型**:
- `weekday` - 工作日筛选
- `custom` - 自定义日期

### 6. delay - 延时

**用途**: 延迟指定时间后执行

**配置**:
```json
{
  "type": "delay",
  "props": {
    "timeout": 60000  // 延迟时间（毫秒）
  }
}
```

### 7. loop - 循环

**用途**: 按间隔循环执行

**配置**:
```json
{
  "type": "loop",
  "inputs": {
    "start": null,  // 开始循环
    "stop": null    // 停止循环
  },
  "props": {
    "interval": 600000  // 循环间隔（毫秒）
  }
}
```

### 8. signalOr - 事件或

**用途**: 任一事件发生时触发

**配置**:
```json
{
  "type": "signalOr",
  "inputs": {
    "input0": null,
    "input1": null
  }
}
```

### 9. logicAnd - 满足全部条件

**用途**: 所有条件都满足时触发

**配置**:
```json
{
  "type": "logicAnd",
  "inputs": {
    "input0": null,
    "input1": null
  }
}
```

### 10. logicOr - 满足任一条件

**用途**: 任一条件满足时触发

**配置**:
```json
{
  "type": "logicOr",
  "inputs": {
    "input0": null,
    "input1": null
  }
}
```

### 11. logicNot - 状态取反

**用途**: 状态取反

### 12. modeSwitch - 模式切换

**用途**: 轮流触发不同输出

### 13. onLoad - 本自动化启用时

**用途**: 规则启用时触发

### 14. register - 自定义状态

**用途**: 自定义布尔状态

### 15. counter - 达到指定次数时

**用途**: 计数达到阈值时触发

**配置**:
```json
{
  "type": "counter",
  "props": {"n": 3}  // 达到3次时触发
}
```

### 16. timeRange - 时间段

**用途**: 时间范围判断

**配置**:
```json
{
  "type": "timeRange",
  "props": {
    "start": {"hour": 8, "minute": 0, "second": 0},
    "end": {"hour": 22, "minute": 0, "second": 0},
    "filter": {"type": "weekday", "days": [1,2,3,4,5]}
  }
}
```

### 17. eventSequence - 事件先后发生

**用途**: 多个事件按顺序发生

**配置**:
```json
{
  "type": "eventSequence",
  "inputs": {
    "input1": null,  // 第一事件
    "input2": null   // 第二事件
  },
  "props": {
    "timeout": 10000  // 两个事件的最大间隔
  }
}
```

### 18. statusLast - 状态持续一段时间

**用途**: 状态持续指定时间后触发

**配置**:
```json
{
  "type": "statusLast",
  "inputs": {
    "input": null  // 状态输入
  },
  "props": {
    "timeout": 300000  // 持续5分钟
  }
}
```

---

## 构建自动化规则指南

### 常见场景示例

#### 示例1: 人来灯亮

```
触发器: 人体传感器 - 移动检测
条件: 无
动作: 打开筒灯
```

节点配置:
```json
{
  "nodes": [
    {
      "id": "trigger",
      "type": "deviceInput",
      "cfg": {"urn": "urn:miot-spec-v2:device:occupancy-sensor:..."},
      "props": {
        "did": "传感器DID",
        "siid": 2,
        "piid": 1,
        "dtype": "bool",
        "operator": "eq",
        "value": true
      },
      "inputs": {},
      "outputs": {"output": [["action", "trigger"]]}
    },
    {
      "id": "action",
      "type": "deviceOutput",
      "cfg": {"urn": "urn:miot-spec-v2:device:light:..."},
      "props": {
        "did": "灯DID",
        "siid": 2,
        "aiid": 1,
        "params": [true]
      },
      "inputs": {"trigger": null},
      "outputs": {}
    }
  ]
}
```

#### 示例2: 温度超过阈值开空调

```
触发器: 温湿度计 - 温度变化
条件: 温度 > 28
动作: 打开空调制冷
```

#### 示例3: 定时开关灯

```
触发器: 定时 - 每天18:00
条件: 无
动作: 打开客厅灯
```

#### 示例4: 离家模式

```
触发器: 门锁 - 上锁
条件: 时间在 8:00-18:00
动作: 关闭所有灯、关闭空调
```

### 节点 ID 生成规则

建议使用有意义的 ID:
- `trigger_1` - 触发器
- `condition_1` - 条件
- `action_1` - 动作
- `delay_1` - 延时

---

## AGENT 设计建议

### 1. 设备能力发现

在创建规则前，需要先获取设备的能力：

```javascript
// 1. 获取设备列表
const devices = await client.callApi('getDevList');

// 2. 获取设备详细信息（通过 URN）
const deviceDetail = await fetch(
  `https://miot-spec.org/miot-spec-v2/instance?type=${device.urn}`
).then(r => r.json());

// 3. 提取可用的能力
const capabilities = {
  triggers: deviceDetail.services.flatMap(s => 
    s.properties?.filter(p => p.access.includes('notify'))
      .map(p => ({siid: s.iid, piid: p.iid, ...p})) || []
  ),
  actions: deviceDetail.services.flatMap(s => 
    s.actions?.map(a => ({siid: s.iid, aiid: a.iid, ...a})) || []
  ),
  readable: deviceDetail.services.flatMap(s => 
    s.properties?.filter(p => p.access.includes('read'))
      .map(p => ({siid: s.iid, piid: p.iid, ...p})) || []
  ),
  writable: deviceDetail.services.flatMap(s => 
    s.properties?.filter(p => p.access.includes('write'))
      .map(p => ({siid: s.iid, piid: p.iid, ...p})) || []
  )
};
```

### 2. 规则生成流程

```
1. 理解用户意图
   - 什么时候触发？（触发器）
   - 需要什么条件？（条件）
   - 要做什么？（动作）

2. 匹配设备能力
   - 查找支持的触发器
   - 查找支持的动作
   - 检查参数格式

3. 构建节点
   - 创建触发器节点
   - 创建条件节点（如需要）
   - 创建动作节点
   - 建立连接

4. 验证规则
   - 检查节点类型正确
   - 检查连接有效
   - 检查参数格式

5. 保存规则
   - 调用 setGraph API
```

### 3. AGENT 输入输出格式

**输入**:
```json
{
  "intent": "创建自动化",
  "description": "当客厅灯打开时，延迟5秒后关闭走廊灯",
  "devices": ["客厅灯", "走廊灯"]
}
```

**输出**:
```json
{
  "success": true,
  "rule_id": "rule_123456",
  "nodes": [...],
  "message": "已创建规则：客厅灯开 → 延迟5秒 → 关走廊灯"
}
```

### 4. 错误处理

常见错误：
- 设备离线
- 设备不支持指定操作
- 参数格式错误
- 规则验证失败

### 5. 缓存策略

- 缓存设备列表
- 缓存设备详细信息（URN 解析结果）
- 定期刷新缓存

---

## 附录：获取设备能力的完整示例

```javascript
const { GatewayClient } = require('./gateway_client.js');
const fetch = require('node-fetch');

async function getDeviceCapabilities(client, did) {
  // 获取设备基本信息
  const devices = await client.callApi('getDevList');
  const device = devices.devList[did];
  if (!device) throw new Error('Device not found');
  
  // 获取设备详细信息
  const detail = await fetch(
    `https://miot-spec.org/miot-spec-v2/instance?type=${device.urn}`
  ).then(r => r.json());
  
  // 解析能力
  const capabilities = {
    name: device.name,
    model: device.model,
    online: device.online,
    services: detail.services.map(s => ({
      siid: s.iid,
      type: s.type,
      description: s.description,
      properties: s.properties?.map(p => ({
        piid: p.iid,
        type: p.type,
        description: p.description,
        dtype: p.format,
        access: p.access,
        valueRange: p['value-range'],
        valueList: p['value-list']
      })),
      actions: s.actions?.map(a => ({
        aiid: a.iid,
        type: a.type,
        description: a.description,
        in: a.in
      })),
      events: s.events?.map(e => ({
        eiid: e.iid,
        type: e.type,
        description: e.description,
        arguments: e.arguments
      }))
    }))
  };
  
  return capabilities;
}

// 使用示例
async function main() {
  const client = new GatewayClient();
  await client.connect('http://192.168.0.5');
  await client.authenticate('123456');
  
  const devices = await client.callApi('getDevList');
  for (const [did, device] of Object.entries(devices.devList)) {
    console.log(`\n设备: ${device.name}`);
    const caps = await getDeviceCapabilities(client, did);
    
    // 显示可触发的能力
    console.log('可触发:');
    caps.services.forEach(s => {
      s.events?.forEach(e => console.log(`  - ${s.description}.${e.description}`));
      s.properties?.filter(p => p.access.includes('notify'))
        .forEach(p => console.log(`  - ${s.description}.${p.description} (变化时)`));
    });
    
    // 显示可执行的操作
    console.log('可操作:');
    caps.services.forEach(s => {
      s.actions?.forEach(a => console.log(`  - ${s.description}.${a.description}`));
      s.properties?.filter(p => p.access.includes('write'))
        .forEach(p => console.log(`  - 设置 ${s.description}.${p.description}`));
    });
  }
  
  await client.close();
}
```

---

## 更新日志

- 2026-03-21: 初始文档，包含完整的 API、设备结构、节点类型和 AGENT 设计指南

---

# 其他补充信息（来自 AGENTS.md）

## 重要提醒

> **每次测试前，都必须向用户获取最新的登录码！**
> 登录码是一次性的，每次登录后都会变化，所以每次测试都必须使用新的登录码。

---

## 项目文件结构

```
gateway/
├── gateway_client.js    # 主要客户端（Node.js）
├── AGENT_GUIDE.md       # AGENT 开发完整指南（主要参考文档，包含API文档）
├── AGENT_DESIGN.md      # AGENT 详细设计文档（架构、MCP、Skill、Prompt等）
├── analysis.md          # 认证流程分析文档
├── ai-config-v5/        # 参考JS代码（米家前端）
├── gateway/             # 参考JS代码（网关SDK）
├── lib/                 # 参考库文件
├── react/               # 参考代码
├── node_modules/        # Node.js 依赖
├── package.json         # 包配置
└── cache/               # 数据缓存目录（自动生成）
    └── gateway_data.json
```

## 文档说明

- **AGENT_GUIDE.md** - 主要参考文档，包含设备结构、节点类型、MIOT Spec、API 接口等基础信息
- **AGENT_DESIGN.md** - AGENT 详细设计文档，包含架构、MCP、Skill、Prompt、对话流程等

---

## gateway_client.js 使用说明

### 基本用法

```bash
# 使用登录码连接网关获取数据
node gateway_client.js <6位登录码>

# 使用登录码连接指定网关
node gateway_client.js <6位登录码> <网关URL>

# 查看缓存数据（不需要登录码）
node gateway_client.js --cached
```

### 默认配置

- 默认网关地址: `http://192.168.0.5`

---

# 测试记录（来自 analysis.md）

## 6. 测试记录

### 测试 1 (登录码: 712360)
- 状态: **失败**
- 错误: ZKP verification failed for g_x3
- 原因分析: 公钥解码格式问题
- 修复: 修改 `_decode_point` 使用 ecdsa 库的正确方式

### 测试 3 (Node.js 实现 - 登录码: 509046)
- 状态: **成功** ✅
- 关键修复:
  1. 使用 Node.js 的 `elliptic` 库（与原 JS 代码一致）
  2. 修正流程：收到服务器 Round One 后 **先发送** 客户端 Round Two
  3. 然后接收服务器 Round Two，计算共享密钥
  4. 客户端先发送 SESSION_KEY_EXCHANGE
- 结果：成功获取设备列表

---

## 7. 更新日志

- 2026-03-21: 
  - 初始文档，完成JS代码分析和现有Python代码问题梳理
  - 验证了关键参数：secp256k1曲线、AES-GCM格式、压缩格式
  - 创建了新的Python实现 `gateway_client.py`
  - 第一次测试：ZKP验证失败，修复了公钥解码问题
  - 第二次测试：登录码过期，需要新登录码
