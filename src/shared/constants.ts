/**
 * oh-my-sage - 常量定义
 */

// ==================== 数据类型常量 ====================

export const DATA_TYPE = {
    PROTOCOL_LIST: 1,
    SELECTED_PROTOCOL: 2,
    SESSION_KEY_EXCHANGE: 3,
    ERROR: 4,
    DATA: 5,
    SERVER_PUB_KEY: 16,
    ECJPAKE_ROUND_ONE: 32,
    ECJPAKE_ROUND_TWO: 33,
} as const;
