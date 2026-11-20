'use client';

import {useEffect} from 'react';

export default function PwaRegister() {
    useEffect(() => {
        // 局域网 HTTP 不是安全上下文，SW 不注册；manifest/图标在 Android/iOS 仍可"添加到主屏幕"
        if ('serviceWorker' in navigator && window.isSecureContext) {
            navigator.serviceWorker.register('/sw.js').catch(() => {
            });
        }
    }, []);

    return null;
}
