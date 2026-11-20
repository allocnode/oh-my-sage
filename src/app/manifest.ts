import type {MetadataRoute} from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Oh My Sage',
        short_name: 'Oh My Sage',
        description: '米家自动化极客版 AI Agent',
        start_url: '/',
        display: 'standalone',
        background_color: '#0a0a14',
        theme_color: '#0f0f1e',
        icons: [
            {src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any'},
            {src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any'},
            {src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable'},
        ],
    };
}
