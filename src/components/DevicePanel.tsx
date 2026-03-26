'use client';

import React, {useState, useEffect} from 'react';
import {
    Typography,
    Space,
    Tag,
    Collapse,
    Badge,
    Empty,
    Spin,
    Input,
    Button,
    message,
} from 'antd';
import {
    HomeOutlined,
    SearchOutlined,
    LoadingOutlined,
    BulbOutlined,
    ThunderboltOutlined,
    LockOutlined,
    CameraOutlined,
    SyncOutlined,
} from '@ant-design/icons';

const {Text} = Typography;

interface Device {
    did: string;
    name: string;
    model: string;
    modelName?: string;
    online: boolean;
    roomName?: string;
}

interface DevicePanelProps {
    collapsed?: boolean;
    devices?: Device[];
    stats?: {
        total: number;
        online: number;
        offline: number;
        rooms: number;
    };
    loading?: boolean;
    onRefresh?: () => void;
}

interface Room {
    name: string;
    deviceCount: number;
    devices: Device[];
}

/**
 * 获取设备图标
 */
function getDeviceIcon(model: string) {
    if (model.includes('light') || model.includes('lamp')) return <BulbOutlined/>;
    if (model.includes('switch') || model.includes('plug')) return <ThunderboltOutlined/>;
    if (model.includes('camera')) return <CameraOutlined/>;
    if (model.includes('lock') || model.includes('door')) return <LockOutlined/>;
    return <BulbOutlined/>;
}

export default function DevicePanel({
                                        collapsed = false,
                                        devices: propDevices,
                                        stats: propStats,
                                        loading: propLoading,
                                        onRefresh,
                                    }: DevicePanelProps) {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [searchText, setSearchText] = useState('');

    // 当 props 变化时更新房间分组
    useEffect(() => {
        if (propDevices) {
            const roomMap: Record<string, Device[]> = {};
            propDevices.forEach(device => {
                const roomName = device.roomName || '未分组';
                if (!roomMap[roomName]) {
                    roomMap[roomName] = [];
                }
                roomMap[roomName].push(device);
            });
            setRooms(Object.entries(roomMap).map(([name, devs]) => ({
                name,
                deviceCount: devs.length,
                devices: devs,
            })));
        }
    }, [propDevices]);

    // 过滤设备
    const filteredRooms = rooms.map(room => ({
        ...room,
        devices: room.devices.filter(d =>
            d.name.toLowerCase().includes(searchText.toLowerCase()) ||
            d.model.toLowerCase().includes(searchText.toLowerCase())
        ),
    })).filter(room => room.devices.length > 0);

    if (collapsed) {
        return (
            <div style={{padding: 16, textAlign: 'center'}}>
                <Badge count={propStats?.online || 0} showZero>
                    <HomeOutlined style={{fontSize: 24}}/>
                </Badge>
            </div>
        );
    }

    return (
        <div style={{height: '100%', display: 'flex', flexDirection: 'column'}}>
            {/* 头部 */}
            <div style={{padding: '16px', borderBottom: '1px solid #f0f0f0'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12}}>
                    <Text strong>设备列表</Text>
                    <Button
                        icon={<SyncOutlined/>}
                        size="small"
                        onClick={onRefresh}
                        loading={propLoading}
                    >
                        刷新
                    </Button>
                </div>

                {propStats && (
                    <div style={{marginBottom: 12}}>
                        <Tag color="success">在线: {propStats.online}</Tag>
                        <Tag color="error">离线: {propStats.offline}</Tag>
                        <Tag>房间: {propStats.rooms}</Tag>
                    </div>
                )}

                <Input
                    placeholder="搜索设备"
                    prefix={<SearchOutlined/>}
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    allowClear
                />
            </div>

            {/* 设备列表 */}
            <div style={{flex: 1, overflow: 'auto', padding: '0 16px'}}>
                {propLoading ? (
                    <div style={{textAlign: 'center', padding: 40}}>
                        <Spin indicator={<LoadingOutlined style={{fontSize: 24}} spin/>}/>
                        <Text type="secondary" style={{display: 'block', marginTop: 16}}>加载中...</Text>
                    </div>
                ) : filteredRooms.length === 0 ? (
                    <Empty description="暂无设备" style={{marginTop: 40}}/>
                ) : (
                    <Collapse
                        defaultActiveKey={filteredRooms.map((_, i) => i.toString())}
                        items={filteredRooms.map((room, index) => ({
                            key: index.toString(),
                            label: (
                                <Space>
                                    <HomeOutlined/>
                                    <Text>{room.name}</Text>
                                    <Badge count={room.deviceCount} size="small"/>
                                </Space>
                            ),
                            children: (
                                <div>
                                    {room.devices.map(device => (
                                        <div
                                            key={device.did}
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                padding: '8px 0',
                                                borderBottom: '1px solid #f5f5f5',
                                            }}
                                        >
                                            <Space>
                                                {getDeviceIcon(device.model)}
                                                <Text>{device.name}</Text>
                                            </Space>
                                            <Tag color={device.online ? 'success' : 'default'}>
                                                {device.online ? '在线' : '离线'}
                                            </Tag>
                                        </div>
                                    ))}
                                </div>
                            ),
                        }))}
                    />
                )}
            </div>
        </div>
    );
}
