'use client';

import React from 'react';
import {
    Typography,
    Button,
    Empty,
    Spin,
    Space,
    Tag,
    Popconfirm,
    Switch,
} from 'antd';
import {
    SyncOutlined,
    DeleteOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    ClockCircleOutlined,
} from '@ant-design/icons';

const {Text} = Typography;

interface GraphSummary {
    id: string;
    name: string;
    enable: boolean;
    lastUpdateTime?: number;
}

interface GraphPanelProps {
    graphs: GraphSummary[];
    loading?: boolean;
    onRefresh: () => void;
    onToggle: (id: string, enable: boolean) => void;
    onDelete: (id: string) => void;
}

/**
 * 格式化时间
 */
function formatTime(timestamp?: number): string {
    if (!timestamp) return '未知';

    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    // 1分钟内
    if (diff < 60 * 1000) {
        return '刚刚';
    }

    // 1小时内
    if (diff < 60 * 60 * 1000) {
        const minutes = Math.floor(diff / (60 * 1000));
        return `${minutes}分钟前`;
    }

    // 24小时内
    if (diff < 24 * 60 * 60 * 1000) {
        const hours = Math.floor(diff / (60 * 60 * 1000));
        return `${hours}小时前`;
    }

    // 更早
    return date.toLocaleDateString('zh-CN', {month: 'numeric', day: 'numeric'});
}

export default function GraphPanel({
                                       graphs,
                                       loading = false,
                                       onRefresh,
                                       onToggle,
                                       onDelete,
                                   }: GraphPanelProps) {
    return (
        <div style={{height: '100%', display: 'flex', flexDirection: 'column'}}>
            {/* 头部 */}
            <div style={{padding: '12px 0', borderBottom: '1px solid #f0f0f0'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <Text strong>自动化规则</Text>
                    <Button
                        icon={<SyncOutlined/>}
                        size="small"
                        onClick={onRefresh}
                        loading={loading}
                    >
                        刷新
                    </Button>
                </div>
                {graphs.length > 0 && (
                    <div style={{marginTop: 8}}>
                        <Tag color="success">启用: {graphs.filter(g => g.enable).length}</Tag>
                        <Tag color="default">禁用: {graphs.filter(g => !g.enable).length}</Tag>
                    </div>
                )}
            </div>

            {/* Graph 列表 */}
            <div style={{flex: 1, overflow: 'auto'}}>
                {loading ? (
                    <div style={{textAlign: 'center', padding: 40}}>
                        <Spin/>
                    </div>
                ) : graphs.length === 0 ? (
                    <div style={{padding: 24}}>
                        <Empty
                            description="暂无自动化规则"
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                        />
                    </div>
                ) : (
                    graphs.map(graph => (
                        <div
                            key={graph.id}
                            style={{
                                padding: '12px 0',
                                borderBottom: '1px solid #f5f5f5',
                            }}
                        >
                            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                                <div style={{flex: 1, minWidth: 0}}>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        marginBottom: 6,
                                        gap: 8,
                                    }}>
                                        {graph.enable ? (
                                            <CheckCircleOutlined style={{color: '#52c41a', fontSize: 14}}/>
                                        ) : (
                                            <CloseCircleOutlined style={{color: '#d9d9d9', fontSize: 14}}/>
                                        )}
                                        <Text
                                            strong
                                            style={{
                                                fontSize: 14,
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                            }}
                                        >
                                            {graph.name}
                                        </Text>
                                        <Tag color={graph.enable ? 'success' : 'default'}>
                                            {graph.enable ? '启用' : '禁用'}
                                        </Tag>
                                    </div>

                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 12,
                                        paddingLeft: 22,
                                        marginBottom: 8,
                                    }}>
                                        <Space size={4}>
                                            <ClockCircleOutlined style={{fontSize: 11, color: '#8c8c8c'}}/>
                                            <Text type="secondary" style={{fontSize: 11}}>
                                                {formatTime(graph.lastUpdateTime)}
                                            </Text>
                                        </Space>
                                    </div>

                                    <div style={{paddingLeft: 22}}>
                                        <Space size={8}>
                                            <Switch
                                                size="small"
                                                checked={graph.enable}
                                                onChange={(checked) => onToggle(graph.id, checked)}
                                            />
                                            <Popconfirm
                                                title="确定删除此规则？"
                                                onConfirm={() => onDelete(graph.id)}
                                                okText="删除"
                                                cancelText="取消"
                                            >
                                                <Button
                                                    type="text"
                                                    size="small"
                                                    danger
                                                    icon={<DeleteOutlined/>}
                                                >
                                                    删除
                                                </Button>
                                            </Popconfirm>
                                        </Space>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
