'use client';

import React from 'react';
import {ConfigProvider, App, theme as antdTheme} from 'antd';
import zhCN from 'antd/locale/zh_CN';
import {StyleProvider} from '@ant-design/cssinjs';
import ThemeProvider, {useTheme} from '@/components/ThemeProvider';

// ==================== 暗色主题 ====================
const darkTheme = {
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
};

// ==================== 浅色主题 ====================
const lightTheme = {
    algorithm: antdTheme.defaultAlgorithm,
    token: {
        colorPrimary: '#6366f1',
        colorInfo: '#6366f1',
        colorSuccess: '#10b981',
        colorWarning: '#f59e0b',
        colorError: '#ef4444',
        borderRadius: 8,
        colorBgContainer: '#ffffff',
        colorBgElevated: 'rgba(255,255,255,0.95)',
        colorBgLayout: '#f6f7fb',
        colorText: '#1f2937',
        colorTextSecondary: '#475569',
        colorBorder: 'rgba(15,23,42,0.1)',
        colorBorderSecondary: 'rgba(15,23,42,0.06)',
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
            colorBgContainer: '#ffffff',
        },
        Layout: {
            bodyBg: '#f6f7fb',
            headerBg: 'rgba(255,255,255,0.85)',
            siderBg: '#eef0f6',
        },
        Collapse: {
            contentBg: 'rgba(15,23,42,0.04)',
        },
        Tag: {
            defaultBg: 'rgba(99,102,241,0.08)',
            defaultColor: '#4f46e5',
        },
    },
};

function AntdProviders({children}: {children: React.ReactNode}) {
    const {resolvedTheme} = useTheme();
    return (
        <ConfigProvider
            locale={zhCN}
            theme={resolvedTheme === 'dark' ? darkTheme : lightTheme}
        >
            <App>{children}</App>
        </ConfigProvider>
    );
}

export default function Providers({children}: {children: React.ReactNode}) {
    return (
        <StyleProvider hashPriority="high">
            <ThemeProvider>
                <AntdProviders>{children}</AntdProviders>
            </ThemeProvider>
        </StyleProvider>
    );
}
