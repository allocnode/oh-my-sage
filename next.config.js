const withPWA = require('@ducanh2912/next-pwa').default({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  workboxOptions: {
    // API 恒实时（设备/规则/会话/聊天数据不缓存），页面导航 network-first，
    // 其余同源静态资源 stale-while-revalidate（Workbox 策略在运行时按声明顺序匹配）
    runtimeCaching: [
      {
        urlPattern: ({url}) => url.pathname.startsWith('/api/'),
        handler: 'NetworkOnly',
      },
      {
        urlPattern: ({request}) => request.mode === 'navigate',
        handler: 'NetworkFirst',
        options: {
          cacheName: 'oh-my-sage-pages',
          networkTimeoutSeconds: 5,
          expiration: {maxEntries: 32, maxAgeSeconds: 86400},
          cacheableResponse: {statuses: [0, 200]},
        },
      },
      {
        urlPattern: ({request, url}) =>
          url.origin === self.location.origin && request.destination !== 'document',
        handler: 'StaleWhileRevalidate',
        options: {
          cacheName: 'oh-my-sage-static',
          expiration: {maxEntries: 128, maxAgeSeconds: 30 * 24 * 3600},
          cacheableResponse: {statuses: [0, 200]},
        },
      },
    ],
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 服务器端外部包
  serverExternalPackages: ['ws', 'elliptic', 'bn.js'],

  // 实验性功能
  experimental: {
    // 启用服务器操作
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },

  // Webpack 配置
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // 客户端不包含这些模块
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        ws: false,
      };
    }
    return config;
  },
};

module.exports = withPWA(nextConfig);
