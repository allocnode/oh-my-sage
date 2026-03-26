'use client';

import React from 'react';
import { ConfigProvider, App, theme as antdTheme } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { StyleProvider } from '@ant-design/cssinjs';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>
        <StyleProvider hashPriority="high">
          <ConfigProvider
            locale={zhCN}
            theme={{
              algorithm: antdTheme.darkAlgorithm,
              token: {
                colorPrimary: '#6366f1',
                colorInfo: '#6366f1',
                colorSuccess: '#10b981',
                colorWarning: '#f59e0b',
                colorError: '#ef4444',
                borderRadius: 8,
                colorBgContainer: 'rgba(255,255,255,0.04)',
                colorBgElevated: 'rgba(20,20,40,0.95)',
                colorBgLayout: '#0a0a14',
                colorText: '#e2e8f0',
                colorTextSecondary: '#94a3b8',
                colorBorder: 'rgba(255,255,255,0.08)',
                colorBorderSecondary: 'rgba(255,255,255,0.04)',
              },
              components: {
                Button: {
                  controlHeight: 38,
                  primaryShadow: '0 0 16px rgba(99,102,241,0.25)',
                },
                Input: {
                  controlHeight: 40,
                  activeBorderColor: '#6366f1',
                  hoverBorderColor: '#818cf8',
                },
                Card: {
                  colorBgContainer: 'rgba(255,255,255,0.04)',
                },
                Layout: {
                  bodyBg: '#0a0a14',
                  headerBg: 'rgba(15,15,30,0.85)',
                  siderBg: '#0f0f1e',
                },
                Collapse: {
                  contentBg: 'rgba(0,0,0,0.2)',
                },
                Tag: {
                  defaultBg: 'rgba(99,102,241,0.12)',
                  defaultColor: '#a5b4fc',
                },
              },
            }}
          >
            <App>{children}</App>
          </ConfigProvider>
        </StyleProvider>
      </body>
    </html>
  );
}
