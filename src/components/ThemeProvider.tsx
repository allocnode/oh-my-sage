'use client';

import React, {createContext, useCallback, useContext, useLayoutEffect, useState} from 'react';

export type ThemeMode = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

const STORAGE_KEY = 'oh-my-sage-theme';

interface ThemeContextValue {
    theme: ThemeMode;
    resolvedTheme: ResolvedTheme;
    setTheme: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function systemPrefersDark(): boolean {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function applyResolved(resolved: ResolvedTheme) {
    const root = document.documentElement;
    root.dataset.theme = resolved;
    root.style.colorScheme = resolved;
}

export default function ThemeProvider({children}: {children: React.ReactNode}) {
    // 首帧主题由 layout 内联脚本在 hydration 前写入 DOM；此处状态仅驱动 antd 算法切换
    const [theme, setThemeState] = useState<ThemeMode>('system');
    const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>('dark');

    useLayoutEffect(() => {
        const domTheme = document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
        setResolvedTheme(domTheme);
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored === 'light' || stored === 'dark' || stored === 'system') {
                setThemeState(stored);
            }
        } catch {
            // localStorage 不可用时保持默认 system
        }
    }, []);

    const setTheme = useCallback((mode: ThemeMode) => {
        setThemeState(mode);
        try {
            localStorage.setItem(STORAGE_KEY, mode);
        } catch {
        }
        if (mode === 'system') {
            const resolved: ResolvedTheme = systemPrefersDark() ? 'dark' : 'light';
            applyResolved(resolved);
            setResolvedTheme(resolved);
        } else {
            applyResolved(mode);
            setResolvedTheme(mode);
        }
    }, []);

    // system 模式下实时跟随系统偏好
    useLayoutEffect(() => {
        if (theme !== 'system') return;
        const mq = window.matchMedia('(prefers-color-scheme: dark)');
        const onChange = () => {
            const resolved: ResolvedTheme = mq.matches ? 'dark' : 'light';
            applyResolved(resolved);
            setResolvedTheme(resolved);
        };
        mq.addEventListener('change', onChange);
        return () => mq.removeEventListener('change', onChange);
    }, [theme]);

    return (
        <ThemeContext.Provider value={{theme, resolvedTheme, setTheme}}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme(): ThemeContextValue {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error('useTheme 必须在 ThemeProvider 内使用');
    return ctx;
}
