/**
 * oh-my-sage - 米家自动化极客版 AI Agent
 * 共享类型定义
 */

// ==================== 设备相关 ====================

/** 设备信息 */
export interface Device {
  /** 设备ID */
  did: string;
  /** 是否支持 V2 协议 */
  specV2Access: boolean;
  /** 是否支持 V3 协议 */
  specV3Access: boolean;
  /** 是否在线 */
  online: boolean;
  /** 是否可推送 */
  pushAvailable: boolean;
  /** 设备名称 */
  name: string;
  /** 设备型号 */
  model: string;
  /** 产品名称 */
  modelName: string;
  /** URN */
  urn: string;
  /** 房间ID */
  roomId: string;
  /** 房间名称 */
  roomName: string;
  /** 图标 */
  icon?: string;
}

/** 设备列表响应 */
export interface DeviceListResponse {
  devList: Record<string, Device>;
}

// ==================== 规则相关 ====================

/** 节点 */
export interface Node {
  /** 节点ID */
  id: string;
  /** 节点类型 */
  type: string;
  /** 节点配置 */
  cfg: NodeConfig;
  /** 节点属性 */
  props: Record<string, any>;
  /** 输入连接 */
  inputs: Record<string, [string, string] | null>;
  /** 输出连接 */
  outputs: Record<string, [string, string][]>;
}

/** 节点配置 */
export interface NodeConfig {
  /** 设备 URN */
  urn?: string;
  /** 是否简化显示 */
  simplified?: boolean;
  /** 位置信息 */
  pos: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  /** 名称 (用于 nop 节点) */
  name?: string;
  /** 内容 (用于 nop 节点) */
  contents?: any[];
  /** 背景颜色 */
  background?: string;
  /** 触发时间类型 */
  happenType?: string;
  /** 临时偏移量 */
  tempOffset?: number;
  /** 时间单位 */
  unit?: string;
  /** 时间值 */
  value?: number;
}

/** 规则配置 */
export interface GraphConfig {
  /** 规则ID */
  id: string;
  /** 是否启用 */
  enable: boolean;
  /** UI类型 */
  uiType: string;
  /** 用户数据 */
  userData: {
    /** 规则名称 */
    name: string;
    /** 最后更新时间 */
    lastUpdateTime: number;
    /** 画布变换 */
    transform: {
      x: number;
      y: number;
      scale: number;
      rotate: number;
    };
  };
}

/** 规则 */
export interface Graph {
  /** 规则ID */
  id: string;
  /** 节点列表 */
  nodes: Node[];
  /** 规则配置 */
  cfg: GraphConfig;
}

/** 规则摘要 */
export interface GraphSummary {
  /** 规则ID */
  id: string;
  /** 规则名称 */
  name: string;
  /** 是否启用 */
  enable: boolean;
  /** 用户数据 */
  userData: {
    name: string;
    lastUpdateTime: number;
  };
}

// ==================== 变量相关 ====================

/** 变量 */
export interface Variable {
  /** 变量类型 */
  type: 'number' | 'string';
  /** 变量值 */
  value: number | string;
  /** 用户数据 */
  userData: {
    /** 变量名称 */
    name: string;
  };
}

// ==================== 对话相关 ====================

/** 意图类型 */
type IntentType = 
  | 'create_graph'    // 创建规则
  | 'modify_graph'    // 修改规则
  | 'delete_graph'    // 删除规则
  | 'query_graph'     // 查询规则
  | 'query_device'    // 查询设备
  | 'general'         // 一般对话
  | 'clarification'   // 需要澄清
  | 'suggestion'      // 需要建议
  | 'confirmation';   // 需要确认

/** 用户意图 */
export interface Intent {
  /** 意图类型 */
  type: IntentType;
  /** 规则名称 */
  ruleName?: string;
  /** 触发器 */
  trigger?: TriggerIntent;
  /** 条件 */
  conditions?: ConditionIntent[];
  /** 动作 */
  actions?: ActionIntent[];
  /** 延时 */
  delay?: DelayIntent;
  /** 建议 */
  suggestions?: Suggestion[];
  /** 是否需要澄清 */
  needsClarification?: boolean;
  /** 澄清问题 */
  clarificationQuestion?: string;
}

/** 触发器意图 */
export interface TriggerIntent {
  /** 类型 */
  type: 'device' | 'timer' | 'manual';
  /** 设备名称 */
  deviceName?: string;
  /** 属性名称 */
  property?: string;
  /** 操作符 */
  operator?: string;
  /** 比较值 */
  value?: any;
  /** 时间配置 */
  time?: { hour: number; minute: number };
}

/** 条件意图 */
export interface ConditionIntent {
  /** 类型 */
  type: 'device' | 'time';
  /** 设备名称 */
  deviceName?: string;
  /** 属性名称 */
  property?: string;
  /** 操作符 */
  operator?: string;
  /** 比较值 */
  value?: any;
}

/** 动作意图 */
export interface ActionIntent {
  /** 类型 */
  type: 'device';
  /** 设备名称 */
  deviceName?: string;
  /** 动作名称 */
  action?: string;
  /** 动作值 */
  value?: any;
}

/** 延时意图 */
export interface DelayIntent {
  /** 时长 */
  duration: number;
  /** 单位 */
  unit: 'seconds' | 'minutes';
}

/** 建议 */
export interface Suggestion {
  /** 建议ID */
  id: string;
  /** 标题 */
  title: string;
  /** 描述 */
  description: string;
  /** 预览 */
  preview: string;
  /** 优点 */
  advantages?: string[];
  /** 缺点 */
  disadvantages?: string[];
  /** 复杂度 */
  complexity?: 'low' | 'medium' | 'high';
}

