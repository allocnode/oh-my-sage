'use client';

import {useEffect} from 'react';

export default function PwaRegister() {
    useEffect(() => {
        // 仅生产环境且安全上下文（HTTPS 或 localhost）注册；局域网 HTTP 非安全上下文，自动跳过
        if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator && window.isSecureContext) {
            navigator.serviceWorker.register('/sw.js').catch(() => {
            });
        }
    }, []);

    return null;
}
