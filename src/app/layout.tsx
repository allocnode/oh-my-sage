import type {Metadata, Viewport} from 'next';
import Providers from './Providers';
import './globals.css';

export const metadata: Metadata = {
    title: 'Oh My Sage',
    description: '米家自动化极客版 AI Agent',
    manifest: '/manifest.json',
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
    themeColor: '#0f0f1e',
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="zh-CN">
        <body>
        <Providers>{children}</Providers>
        </body>
        </html>
    );
}
