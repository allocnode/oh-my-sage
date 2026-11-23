import type {Metadata, Viewport} from 'next';
import Providers from './Providers';
import './globals.css';

export const metadata: Metadata = {
    title: 'Oh My Sage',
    description: '米家自动化极客版 AI Agent',
    icons: {
        icon: '/icons/icon-192.png',
        apple: '/icons/apple-touch-icon.png',
    },
    appleWebApp: {
        capable: true,
        statusBarStyle: 'black-translucent',
        title: 'Oh My Sage',
    },
};

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    viewportFit: 'cover',
    themeColor: [
        {media: '(prefers-color-scheme: dark)', color: '#0f0f1e'},
        {media: '(prefers-color-scheme: light)', color: '#f6f7fb'},
    ],
};

// 首帧主题内联脚本：hydration 前按 localStorage + 系统偏好设置 data-theme 与 color-scheme，避免闪烁
const themeInitScript = `
(function () {
    try {
        var stored = localStorage.getItem('oh-my-sage-theme');
        var dark = stored === 'dark' || ((!stored || stored === 'system') && window.matchMedia('(prefers-color-scheme: dark)').matches);
        var theme = dark ? 'dark' : 'light';
        document.documentElement.dataset.theme = theme;
        document.documentElement.style.colorScheme = theme;
    } catch (e) {}
})();
`;

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="zh-CN">
        <body>
        <script dangerouslySetInnerHTML={{__html: themeInitScript}}/>
        <Providers>{children}</Providers>
        </body>
        </html>
    );
}
