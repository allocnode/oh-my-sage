'use client';

import React, { useState, useCallback, useRef } from 'react';
import { Layout, Typography, Space, theme, message, Tabs } from 'antd';
import { RobotOutlined, HomeOutlined, ApartmentOutlined } from '@ant-design/icons';
import Chat from '@/components/Chat';
import DevicePanel from '@/components/DevicePanel';
import GraphPanel from '@/components/GraphPanel';
import SessionPanel from '@/components/SessionPanel';
import LoginPage from '@/components/LoginPage';

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

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
  role: 'user' | 'assistant';
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

/**
 * 主页面组件
 * 登录成功后显示聊天界面、设备面板和 Session 面板
 */
export default function HomePage() {
  const { token: { colorBgContainer, borderRadiusLG } } = theme.useToken();
  const [collapsed, setCollapsed] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [devicesLoading, setDevicesLoading] = useState(false);
  const [devices, setDevices] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, online: 0, offline: 0, rooms: 0 });

  // Session 状态
  const [sessions, setSessions] = useState<SessionMeta[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | undefined>();
  const [currentMessages, setCurrentMessages] = useState<SessionMessage[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(false);

  // Graph 状态
  const [graphs, setGraphs] = useState<GraphSummary[]>([]);
  const [graphsLoading, setGraphsLoading] = useState(false);
  const graphsLoadedRef = useRef(false);

  /**
   * 加载设备列表
   */
  const loadDevices = useCallback(async () => {
    setDevicesLoading(true);
    try {
      const response = await fetch('/api/devices');
      const result = await response.json();

      if (result.success) {
        setDevices(result.devices || []);
        setStats(result.stats || { total: 0, online: 0, offline: 0, rooms: 0 });
      } else {
        message.error(result.message || '加载设备失败');
      }
    } catch (error) {
      message.error('加载设备失败: ' + String(error));
    } finally {
      setDevicesLoading(false);
    }
  }, []);

  /**
   * 加载 Session 列表
   */
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

  /**
   * 加载 Graph 列表
   */
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

  /**
   * 登录成功回调
   */
  const handleLoginSuccess = async (code: string) => {
    setPasscode(code);
    setIsLoggedIn(true);

    // 进入首页后异步加载设备和session
    await Promise.all([
      loadDevices(),
      loadSessions(),
    ]);
  };

  /**
   * 选择 Session
   */
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

  /**
   * 删除 Session
   */
  const handleDeleteSession = async (sessionId: string) => {
    try {
      const response = await fetch(`/api/sessions/${sessionId}`, {
        method: 'DELETE',
      });
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

  /**
   * Session 创建成功回调（由 Chat 组件触发）
   */
  const handleSessionCreated = (sessionId: string) => {
    setActiveSessionId(sessionId);
    loadSessions();
  };

  /**
   * 切换 Graph 状态
   */
  const handleToggleGraph = async (id: string, enable: boolean) => {
    try {
      const response = await fetch('/api/graphs', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, enable }),
      });
      const result = await response.json();

      if (result.success) {
        // 更新本地状态
        setGraphs(prev => prev.map(g =>
          g.id === id ? { ...g, enable } : g
        ));
        message.success(enable ? '规则已启用' : '规则已禁用');
      } else {
        message.error(result.message || '操作失败');
      }
    } catch (error) {
      message.error('切换规则状态失败');
    }
  };

  /**
   * 删除 Graph
   */
  const handleDeleteGraph = async (id: string) => {
    try {
      const response = await fetch(`/api/graphs?id=${id}`, {
        method: 'DELETE',
      });
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

  /**
   * 处理 Tab 切换
   */
  const handleTabChange = (key: string) => {
    if (key === 'graphs' && !graphsLoadedRef.current) {
      loadGraphs();
    }
  };

  // 如果未登录，显示登录页面
  if (!isLoggedIn) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* 顶部标题栏 */}
      <Header style={{
        background: colorBgContainer,
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        borderBottom: '1px solid #f0f0f0',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        <Space>
          <RobotOutlined style={{ fontSize: 24, color: '#1890ff' }} />
          <Title level={4} style={{ margin: 0 }}>
            Oh My Sage
          </Title>
          <Text type="secondary">
            米家自动化极客版 AI Agent
          </Text>
          <Text type="success" style={{ marginLeft: 16 }}>
            已连接 | 设备: {stats.online}/{stats.total} 在线
          </Text>
        </Space>
      </Header>

      <Layout>
        {/* 左侧面板 - 设备和规则 */}
        <Sider
          width={320}
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          style={{ background: colorBgContainer }}
          breakpoint="lg"
        >
          {!collapsed && (
            <Tabs
              defaultActiveKey="devices"
              onChange={handleTabChange}
              items={[
                {
                  key: 'devices',
                  label: (
                    <Space>
                      <HomeOutlined />
                      设备
                    </Space>
                  ),
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
                  label: (
                    <Space>
                      <ApartmentOutlined />
                      规则
                    </Space>
                  ),
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
              style={{ padding: '0 8px' }}
            />
          )}
          {collapsed && (
            <div style={{ padding: 16, textAlign: 'center' }}>
              <HomeOutlined style={{ fontSize: 24 }} />
            </div>
          )}
        </Sider>

        {/* 主内容区域 */}
        <Content style={{ padding: 24, background: '#f5f5f5' }}>
          <div style={{ display: 'flex', gap: 24, height: 'calc(100vh - 64px - 48px)' }}>
            {/* 聊天区域 */}
            <div style={{
              flex: 1,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}>
              <Chat
                passcode={passcode}
                sessionId={activeSessionId}
                initialMessages={currentMessages}
                onSessionCreated={handleSessionCreated}
              />
            </div>

            {/* Session 面板 */}
            <div style={{
              width: 320,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
              overflow: 'hidden',
            }}>
              <SessionPanel
                sessions={sessions}
                activeSessionId={activeSessionId}
                loading={sessionsLoading}
                onSelectSession={handleSelectSession}
                onDeleteSession={handleDeleteSession}
                onRefresh={loadSessions}
              />
            </div>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
