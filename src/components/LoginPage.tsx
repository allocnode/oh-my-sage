'use client';

import React, { useState, useCallback, useRef } from 'react';
import { Input, Button, message, Typography } from 'antd';
import { RobotOutlined, LockOutlined, ThunderboltFilled } from '@ant-design/icons';

const { Text } = Typography;

interface LoginPageProps {
  onLoginSuccess: (passcode: string) => void;
}

export default function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const [passcode, setPasscode] = useState('');
  const [loading, setLoading] = useState(false);
  const isLoggingRef = useRef(false);

  const doLogin = useCallback(async (code: string) => {
    if (code.length !== 6 || isLoggingRef.current) return;
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
        message.success('连接成功');
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
  }, [onLoginSuccess]);

  const handlePasscodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setPasscode(value);
    if (value.length === 6) {
      setTimeout(() => doLogin(value), 0);
    }
  };

  return (
    <div style={{
      height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center',
      background: 'var(--bg-deep)',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* 动态背景光效 */}
      <div style={{
        position: 'absolute', width: 600, height: 600,
        borderRadius: '50%', filter: 'blur(120px)', opacity: 0.15,
        background: 'var(--gradient-primary)',
        top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        animation: 'gradientShift 8s ease infinite',
        backgroundSize: '200% 200%',
      }} />
      <div style={{
        position: 'absolute', width: 400, height: 400,
        borderRadius: '50%', filter: 'blur(100px)', opacity: 0.1,
        background: 'var(--gradient-accent)',
        top: '30%', left: '60%',
        animation: 'gradientShift 10s ease infinite reverse',
        backgroundSize: '200% 200%',
      }} />

      {/* 登录卡片 */}
      <div
        className="glass-panel"
        style={{
          width: 380, padding: '40px 36px',
          borderRadius: 'var(--radius-xl)',
          textAlign: 'center',
          position: 'relative', zIndex: 1,
          boxShadow: 'var(--shadow-lg)',
          animation: 'fadeInUp 0.6s var(--ease-out)',
        }}
      >
        {/* Logo */}
        <div style={{
          width: 64, height: 64, margin: '0 auto 24px',
          borderRadius: 'var(--radius-lg)',
          background: 'var(--gradient-primary)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 40px rgba(99,102,241,0.3)',
        }}>
          <ThunderboltFilled style={{ fontSize: 28, color: '#fff' }} />
        </div>

        <h1 className="gradient-text" style={{
          fontSize: 26, fontWeight: 800, margin: '0 0 6px',
          letterSpacing: -0.5,
        }}>
          Oh My Sage
        </h1>
        <Text style={{ color: 'var(--text-muted)', fontSize: 13, display: 'block', marginBottom: 32 }}>
          米家自动化极客版 AI Agent
        </Text>

        <div style={{ marginBottom: 20 }}>
          <Input
            prefix={<LockOutlined style={{ color: 'var(--text-muted)' }} />}
            placeholder="输入 6 位米家登录码"
            maxLength={6}
            size="large"
            value={passcode}
            onChange={handlePasscodeChange}
            disabled={loading}
            style={{
              textAlign: 'center', letterSpacing: 6, fontSize: 18, fontWeight: 600,
              borderRadius: 'var(--radius-md)',
            }}
          />
          <Text style={{ color: 'var(--text-muted)', fontSize: 11, marginTop: 8, display: 'block' }}>
            输入 6 位后自动连接
          </Text>
        </div>

        <Button
          type="primary"
          size="large"
          block
          onClick={() => doLogin(passcode)}
          loading={loading}
          disabled={passcode.length !== 6}
          style={{
            borderRadius: 'var(--radius-md)',
            height: 44, fontSize: 15, fontWeight: 600,
          }}
        >
          {loading ? '正在连接网关...' : '连接网关'}
        </Button>
      </div>
    </div>
  );
}
