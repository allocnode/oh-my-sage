'use client';

import React, {useState, useCallback, useRef} from 'react';
import {Layout, Typography, Space, message, Tabs} from 'antd';
import {RobotOutlined, HomeOutlined, ApartmentOutlined, ApiOutlined} from '@ant-design/icons';
import Chat from '@/components/Chat';
import DevicePanel from '@/components/DevicePanel';
import GraphPanel from '@/components/GraphPanel';
import SessionPanel from '@/components/SessionPanel';
import LoginPage from '@/components/LoginPage';

const {Header, Sider, Content} = Layout;
const {Text} = Typography;

interface SessionMeta {
    id: string;
    title: string;
    summary: string;
    createdAt: string;
    updatedAt: string;
    messageCount: number;
    isActive: boolean;
}

interface SessionMessage {
    seq: number;
    role: 'user' | 'assistant' | 'compressed';
    content: string;
    timestamp: string;
    thinking?: string;
    toolCalls?: Array<{ tool: string; args?: any; result?: any; success: boolean }>;
}

interface GraphSummary {
    id: string;
    name: string;
    enable: boolean;
    lastUpdateTime?: number;
}

export default function HomePage() {
    const [collapsed, setCollapsed] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [passcode, setPasscode] = useState('');
    const [devicesLoading, setDevicesLoading] = useState(false);
    const [devices, setDevices] = useState<any[]>([]);
    const [stats, setStats] = useState({total: 0, online: 0, offline: 0, rooms: 0});

    const [sessions, setSessions] = useState<SessionMeta[]>([]);
    const [activeSessionId, setActiveSessionId] = useState<string | undefined>();
    const [currentMessages, setCurrentMessages] = useState<SessionMessage[]>([]);
    const [sessionsLoading, setSessionsLoading] = useState(false);

    const [graphs, setGraphs] = useState<GraphSummary[]>([]);
    const [graphsLoading, setGraphsLoading] = useState(false);
    const graphsLoadedRef = useRef(false);

    const loadDevices = useCallback(async () => {
        setDevicesLoading(true);
        try {
            const response = await fetch('/api/devices');
            const result = await response.json();
            if (result.success) {
                setDevices(result.devices || []);
                setStats(result.stats || {total: 0, online: 0, offline: 0, rooms: 0});
            } else {
                message.error(result.message || '加载设备失败');
            }
        } catch (error) {
            message.error('加载设备失败: ' + String(error));
        } finally {
            setDevicesLoading(false);
        }
    }, []);

    const loadSessions = useCallback(async () => {
        setSessionsLoading(true);
        try {
            const response = await fetch('/api/sessions');
            const result = await response.json();
            if (result.success) {
                setSessions(result.sessions || []);
            }
        } catch (error) {
            console.error('加载 session 列表失败:', error);
        } finally {
            setSessionsLoading(false);
        }
    }, []);

    const loadGraphs = useCallback(async () => {
        setGraphsLoading(true);
        try {
            const response = await fetch('/api/graphs');
            const result = await response.json();
            if (result.success) {
                setGraphs(result.graphs || []);
                graphsLoadedRef.current = true;
            }
        } catch (error) {
            console.error('加载规则列表失败:', error);
        } finally {
            setGraphsLoading(false);
        }
    }, []);

    const handleLoginSuccess = async (code: string) => {
        setPasscode(code);
        setIsLoggedIn(true);
        await Promise.all([loadDevices(), loadSessions()]);
    };

    const handleSelectSession = async (sessionId: string) => {
        setActiveSessionId(sessionId);
        try {
            const response = await fetch(`/api/sessions/${sessionId}`);
            const result = await response.json();
            if (result.success) {
                setCurrentMessages(result.messages || []);
            }
        } catch (error) {
            message.error('加载 session 消息失败');
        }
    };

    const handleDeleteSession = async (sessionId: string) => {
        try {
            const response = await fetch(`/api/sessions/${sessionId}`, {method: 'DELETE'});
            const result = await response.json();
            if (result.success) {
                setSessions(prev => prev.filter(s => s.id !== sessionId));
                if (activeSessionId === sessionId) {
                    setActiveSessionId(undefined);
                    setCurrentMessages([]);
                }
                message.success('Session 已删除');
            }
        } catch (error) {
            message.error('删除 session 失败');
        }
    };

    const handleNewSession = () => {
        setActiveSessionId(undefined);
        setCurrentMessages([]);
    };

    const handleSessionCreated = (sessionId: string, messages: SessionMessage[]) => {
        setActiveSessionId(sessionId);
        setCurrentMessages(messages);
        loadSessions();
    };

    const handleResetSession = useCallback(async (sessionId: string, seq: number) => {
        try {
            const response = await fetch(`/api/sessions/${sessionId}`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({action: 'truncate', seq}),
            });
            const result = await response.json();
            if (result.success) {
                setCurrentMessages(result.messages || []);
                message.success('已回退到指定位置，修改消息后重新发送即可');
            } else {
                message.error(result.error || '回退失败');
            }
        } catch (error) {
            message.error('回退失败: ' + String(error));
        }
    }, []);

    const handleToggleGraph = async (id: string, enable: boolean) => {
        try {
            const response = await fetch('/api/graphs', {
                method: 'PATCH',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({id, enable}),
            });
            const result = await response.json();
            if (result.success) {
                setGraphs(prev => prev.map(g => g.id === id ? {...g, enable} : g));
                message.success(enable ? '规则已启用' : '规则已禁用');
            } else {
                message.error(result.message || '操作失败');
            }
        } catch (error) {
            message.error('切换规则状态失败');
        }
    };

    const handleDeleteGraph = async (id: string) => {
        try {
            const response = await fetch(`/api/graphs?id=${id}`, {method: 'DELETE'});
            const result = await response.json();
            if (result.success) {
                setGraphs(prev => prev.filter(g => g.id !== id));
                message.success('规则已删除');
            } else {
                message.error(result.message || '删除失败');
            }
        } catch (error) {
            message.error('删除规则失败');
        }
    };

    const handleTabChange = (key: string) => {
        if (key === 'graphs' && !graphsLoadedRef.current) {
            loadGraphs();
        }
    };

    if (!isLoggedIn) {
        return <LoginPage onLoginSuccess={handleLoginSuccess}/>;
    }

    return (
        <Layout style={{minHeight: '100vh', background: 'var(--bg-deep)'}}>
            {/* 顶栏 */}
            <Header style={{
                padding: '0 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                position: 'sticky',
                top: 0,
                zIndex: 100,
            }}>
                <Space size={12}>
                    <div style={{
                        width: 32,
                        height: 32,
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--gradient-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: 'var(--shadow-glow)',
                    }}>
                        <RobotOutlined style={{fontSize: 16, color: '#fff'}}/>
                    </div>
                    <span className="gradient-text" style={{fontSize: 17, fontWeight: 700, letterSpacing: -0.3}}>
            Oh My Sage
          </span>
                    <Text style={{color: 'var(--text-muted)', fontSize: 12}}>
                        米家自动化极客版 AI Agent
                    </Text>
                </Space>
                <Space size={6}>
                    <div style={{
                        width: 7,
                        height: 7,
                        borderRadius: '50%',
                        background: '#10b981',
                        boxShadow: '0 0 8px rgba(16,185,129,0.5)',
                    }}/>
                    <Text style={{color: 'var(--text-secondary)', fontSize: 12}}>
                        {stats.online}/{stats.total} 设备在线
                    </Text>
                </Space>
            </Header>

            <Layout>
                {/* 左侧边栏 */}
                <Sider
                    width={300}
                    collapsible
                    collapsed={collapsed}
                    onCollapse={setCollapsed}
                    breakpoint="lg"
                    trigger={null}
                    style={{
                        borderRight: '1px solid var(--border-subtle)',
                    }}
                >
                    {!collapsed ? (
                        <Tabs
                            defaultActiveKey="devices"
                            onChange={handleTabChange}
                            centered
                            size="small"
                            items={[
                                {
                                    key: 'devices',
                                    label: <span><HomeOutlined style={{marginRight: 4}}/>设备</span>,
                                    children: (
                                        <DevicePanel
                                            devices={devices}
                                            stats={stats}
                                            loading={devicesLoading}
                                            onRefresh={loadDevices}
                                        />
                                    ),
                                },
                                {
                                    key: 'graphs',
                                    label: <span><ApartmentOutlined style={{marginRight: 4}}/>规则</span>,
                                    children: (
                                        <GraphPanel
                                            graphs={graphs}
                                            loading={graphsLoading}
                                            onRefresh={loadGraphs}
                                            onToggle={handleToggleGraph}
                                            onDelete={handleDeleteGraph}
                                        />
                                    ),
                                },
                            ]}
                        />
                    ) : (
                        <div style={{padding: 16, textAlign: 'center', color: 'var(--text-muted)'}}>
                            <ApiOutlined style={{fontSize: 22}}/>
                        </div>
                    )}
                </Sider>

                {/* 主内容区 */}
                <Content style={{padding: 16, background: 'var(--bg-deep)'}}>
                    <div style={{
                        display: 'flex',
                        gap: 12,
                        height: 'calc(100vh - 56px - 32px)',
                    }}>
                        {/* 聊天区 */}
                        <div
                            className="glass-panel"
                            style={{
                                flex: 1,
                                borderRadius: 'var(--radius-lg)',
                                overflow: 'hidden',
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                        >
                            <Chat
                                passcode={passcode}
                                sessionId={activeSessionId}
                                initialMessages={currentMessages}
                                onSessionCreated={handleSessionCreated}
                                onResetSession={handleResetSession}
                            />
                        </div>

                        {/* Session 面板 */}
                        <div
                            className="glass-panel"
                            style={{
                                width: 300,
                                borderRadius: 'var(--radius-lg)',
                                overflow: 'hidden',
                            }}
                        >
                            <SessionPanel
                                sessions={sessions}
                                activeSessionId={activeSessionId}
                                loading={sessionsLoading}
                                onSelectSession={handleSelectSession}
                                onDeleteSession={handleDeleteSession}
                                onNewSession={handleNewSession}
                                onRefresh={loadSessions}
                            />
                        </div>
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
}
