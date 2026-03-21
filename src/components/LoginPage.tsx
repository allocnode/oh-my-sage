'use client';

import React, { useState, useCallback, useRef } from 'react';
import { Input, Button, message, Card } from 'antd';
import { RobotOutlined, LockOutlined } from '@ant-design/icons';

interface LoginPageProps {
  onLoginSuccess: (passcode: string) => void;
}

/**
 * 登录页面
 * 输入米家网关登录码进行验证
 * 输入6位后自动执行登录
 */
export default function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const [passcode, setPasscode] = useState('');
  const [loading, setLoading] = useState(false);
  const isLoggingRef = useRef(false);

  const handleLogin = useCallback(async () => {
    if (!passcode || passcode.length !== 6 || loading || isLoggingRef.current) {
      return;
    }

    isLoggingRef.current = true;
    setLoading(true);
    try {
      // 调用认证接口
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode }),
      });

      const result = await response.json();

      if (result.success) {
        message.success('连接成功！');
        onLoginSuccess(passcode);
      } else {
        message.error(result.message || '连接失败');
        isLoggingRef.current = false;
      }
    } catch (error) {
      message.error('连接失败: ' + String(error));
      isLoggingRef.current = false;
    } finally {
      setLoading(false);
    }
  }, [passcode, loading, onLoginSuccess]);

  const handlePasscodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setPasscode(value);

    // 输入6位后自动登录
    if (value.length === 6 && !loading && !isLoggingRef.current) {
      // 使用 setTimeout 确保状态更新后再执行登录
      setTimeout(() => {
        handleLoginWithCode(value);
      }, 0);
    }
  };

  const handleLoginWithCode = useCallback(async (code: string) => {
    if (code.length !== 6 || loading || isLoggingRef.current) {
      return;
    }

    isLoggingRef.current = true;
    setLoading(true);
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode: code }),
      });

      const result = await response.json();

      if (result.success) {
        message.success('连接成功！');
        onLoginSuccess(code);
      } else {
        message.error(result.message || '连接失败');
        isLoggingRef.current = false;
      }
    } catch (error) {
      message.error('连接失败: ' + String(error));
      isLoggingRef.current = false;
    } finally {
      setLoading(false);
    }
  }, [loading, onLoginSuccess]);

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    }}>
      <Card
        style={{
          width: 400,
          textAlign: 'center',
          borderRadius: 16,
          boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
        }}
      >
        <div style={{ marginBottom: 32 }}>
          <RobotOutlined style={{ fontSize: 48, color: '#1890ff', marginBottom: 16 }} />
          <h1 style={{ margin: '16px 0 8px', fontSize: 24 }}>Oh My Sage</h1>
          <p style={{ color: '#666', margin: 0 }}>米家自动化极客版 AI Agent</p>
        </div>

        <div style={{ marginBottom: 24 }}>
          <Input
            prefix={<LockOutlined />}
            placeholder="请输入6位米家登录码"
            maxLength={6}
            size="large"
            value={passcode}
            onChange={handlePasscodeChange}
            disabled={loading}
          />
          <p style={{ color: '#999', fontSize: 12, marginTop: 8 }}>
            输入6位后自动登录
          </p>
        </div>

        <Button
          type="primary"
          size="large"
          block
          onClick={handleLogin}
          loading={loading}
          disabled={passcode.length !== 6}
        >
          {loading ? '正在连接...' : '连接网关'}
        </Button>
      </Card>
    </div>
  );
}
