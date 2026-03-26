'use client';

import React from 'react';
import { Typography, Button, Empty, Spin, Space, Popconfirm } from 'antd';
import {
  SyncOutlined, MessageOutlined, DeleteOutlined,
  ClockCircleOutlined, PlusOutlined, HistoryOutlined,
} from '@ant-design/icons';

const { Text } = Typography;

interface SessionMeta {
  id: string;
  title: string;
  summary: string;
  createdAt: string;
  updatedAt: string;
  messageCount: number;
  isActive: boolean;
}

interface SessionPanelProps {
  sessions: SessionMeta[];
  activeSessionId?: string;
  loading?: boolean;
  onSelectSession: (sessionId: string) => void;
  onDeleteSession: (sessionId: string) => void;
  onNewSession: () => void;
  onRefresh: () => void;
}

function formatTime(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  if (diff < 24 * 60 * 60 * 1000 && date.getDate() === now.getDate()) {
    return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
  }
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear()) {
    return '昨天';
  }
  return date.toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' });
}

export default function SessionPanel({
  sessions, activeSessionId, loading = false,
  onSelectSession, onDeleteSession, onNewSession, onRefresh,
}: SessionPanelProps) {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* 头部 */}
      <div style={{
        padding: '16px 16px 12px',
        borderBottom: '1px solid var(--border-subtle)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Space size={8}>
            <HistoryOutlined style={{ color: '#818cf8', fontSize: 15 }} />
            <Text strong style={{ color: 'var(--text-bright)', fontSize: 14 }}>对话历史</Text>
          </Space>
          <Space size={6}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              size="small"
              onClick={onNewSession}
              style={{ borderRadius: 'var(--radius-full)', fontSize: 12, height: 28 }}
            >
              新对话
            </Button>
            <Button
              icon={<SyncOutlined />}
              size="small"
              onClick={onRefresh}
              loading={loading}
              style={{
                borderRadius: 'var(--radius-full)',
                background: 'var(--bg-surface)',
                borderColor: 'var(--border-default)',
                color: 'var(--text-secondary)',
                width: 28, height: 28,
              }}
            />
          </Space>
        </div>
      </div>

      {/* Session 列表 */}
      <div style={{ flex: 1, overflow: 'auto', padding: '8px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <Spin indicator={<SyncOutlined style={{ fontSize: 20, color: '#818cf8' }} spin />} />
          </div>
        ) : sessions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <MessageOutlined style={{ fontSize: 28, color: 'var(--text-muted)', marginBottom: 12 }} />
            <Text style={{ display: 'block', color: 'var(--text-muted)', fontSize: 13 }}>暂无对话历史</Text>
          </div>
        ) : (
          sessions.map(session => {
            const isActive = session.id === activeSessionId;
            return (
              <div
                key={session.id}
                onClick={() => onSelectSession(session.id)}
                style={{
                  padding: '12px 14px',
                  marginBottom: 4,
                  cursor: 'pointer',
                  borderRadius: 'var(--radius-md)',
                  background: isActive ? 'rgba(99,102,241,0.1)' : 'transparent',
                  border: `1px solid ${isActive ? 'rgba(99,102,241,0.2)' : 'transparent'}`,
                  transition: 'all 0.2s var(--ease-out)',
                  position: 'relative',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.background = 'var(--bg-surface-hover)';
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.background = 'transparent';
                }}
              >
                {isActive && (
                  <div style={{
                    position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)',
                    width: 3, height: 20, borderRadius: '0 2px 2px 0',
                    background: 'var(--gradient-primary)',
                  }} />
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <Text strong style={{
                      fontSize: 13,
                      color: isActive ? 'var(--text-bright)' : 'var(--text-primary)',
                      display: 'block',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      marginBottom: 2,
                    }}>
                      {session.title || '新对话'}
                    </Text>

                    {session.summary && (
                      <Text style={{
                        fontSize: 12, color: 'var(--text-muted)',
                        display: 'block',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        marginBottom: 6,
                      }}>
                        {session.summary}
                      </Text>
                    )}

                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <Space size={3}>
                        <ClockCircleOutlined style={{ fontSize: 10, color: 'var(--text-muted)' }} />
                        <Text style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                          {formatTime(session.updatedAt)}
                        </Text>
                      </Space>
                      <Text style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                        {session.messageCount} 条
                      </Text>
                    </div>
                  </div>

                  <Popconfirm
                    title="确定删除？"
                    onConfirm={(e) => { e?.stopPropagation(); onDeleteSession(session.id); }}
                    onCancel={(e) => e?.stopPropagation()}
                    okText="删除" cancelText="取消"
                  >
                    <Button
                      type="text" size="small"
                      icon={<DeleteOutlined />}
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        color: 'var(--text-muted)',
                        opacity: 0.5,
                        transition: 'opacity 0.2s',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                      onMouseLeave={(e) => e.currentTarget.style.opacity = '0.5'}
                    />
                  </Popconfirm>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
