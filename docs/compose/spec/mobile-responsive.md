---
feature: mobile-responsive
status: delivered
updated: 2026-05-02
source: feat/mobile-responsive
---

# 移动端响应式重构 + PWA

## Report

**What was built** — 网页版改为桌面/移动两档布局：≥768px 保持原三栏结构不变；<768px 隐藏 Sider，改为紧凑顶栏 + 底部导航（对话/设备/规则/历史）+ 四面板保活（聊天流切换不中断），历史选会话或点新对话自动跳回对话。登录卡片响应式（maxWidth 380），聊天输入框移动端 16px 防 iOS 聚焦缩放，`100dvh` + `viewport-fit=cover` + safe-area 适配刘海屏。PWA：`manifest.ts`（standalone + 192/512 图标）、SVG 源图标栅格化 PNG、`sw.js`（导航 network-first / 静态 cache-first，仅安全上下文注册，API 不过缓存）、layout 服务端化 + Providers 拆分。设备/规则面板边框统一暗色主题变量。

**Verification** —
- `npx tsc --noEmit` → PASS（EXIT 0，多次）
- `npm run test:unit` → PASS（188 通过 / 1 跳过 / 0 失败）
- `npm run build` → PASS（EXIT 0，生成 `/manifest.webmanifest` 路由）
- `npm run lint` → FAIL，PRE-EXISTING（LINT-RUSHSTACK-NODE24：`eslint-config-next` 的 `@rushstack/eslint-patch` 在 Node v24.22.0 下加载即抛错，`--print-config` 零源码文件同样失败，与本次 diff 无关）
- Playwright 实测（stub /api/auth|devices|sessions）：375x812 登录页与登录后界面无横向滚动；底部四 Tab 切换、Chat 保活、设备/规则/历史面板渲染、历史选会话自动跳回对话；1440x900 桌面布局与改动前一致；manifest/sw/图标/head 元信息全部就位
- 独立评审（general-1）：5 条验收标准全部满足、无 critical；4 条次要意见已修复（T6），修复后 tsc/build 复验通过

## [S1] Problem

当前网页版是纯桌面布局，手机（<768px 视口）上完全不可用：

- 三栏横排（`Sider` 300px + 聊天 + `SessionPanel` 300px）在 375px 屏上被挤压成不可读的一团，两个固定 300px 面板吃掉全部宽度；
- `.app-shell` 固定 `100vh` + `overflow: hidden`，无纵向滚动；移动浏览器地址栏伸缩时视口不稳定；
- 登录卡片固定 `width: 380`，窄屏溢出；
- 顶栏副标题 + 设备统计挤占空间；
- 聊天输入框默认 14px，iOS Safari 聚焦时自动放大页面；
- 触控目标偏小，无底部导航，无 `safe-area` 适配（刘海屏）。

用户诉求：手机随时打开就能用，像 App 一样顺手。

## [S2] Design

### S2.1 断点与布局模式

- 两档：**桌面**（≥768px，保持现有三栏布局与交互不变）与**移动**（<768px）。
- 移动端 `.app-shell` 高度改为 `100dvh`（回退 `100vh`）；`viewport` 增加 `viewport-fit=cover`，底部栏与面板使用 `env(safe-area-inset-bottom)` 适配刘海屏。
- 布局切换用 `useMediaQuery('(max-width: 767px)')` hook（`matchMedia` + 事件监听），`'use client'` 下 SSR 首帧默认桌面值，挂载后 effect 校正——移动端仅在登录成功后那一帧可能有极短桌面布局闪现，可接受，不做挂载门禁。
- 桌面端渲染逻辑与改动前完全一致（不改桌面结构）。

### S2.2 移动端导航与面板保活

- 移动端隐藏 `Sider`，渲染固定底部导航栏（高 56px + 安全区），四个 Tab：**对话 / 设备 / 规则 / 历史**，默认对话。
- 四个面板全部**保持挂载**，用 `display` 切换显隐，保证聊天流式输出在切换 Tab 时不中断。
- 移动端各面板复用现有组件（`Chat` / `DevicePanel` / `GraphPanel` / `SessionPanel`）与现有 props/回调；规则列表沿用桌面端"首次打开才拉取"的 `graphsLoadedRef` 惰性加载语义——移动端在"规则"Tab 首次激活时触发 `loadGraphs`。
- 历史 Tab 中选中一条 Session：`handleSelectSession` 照常加载消息，同时把当前 Tab 切回"对话"。
- 顶栏移动端紧凑化：只保留 logo + "Oh My Sage"；副标题与设备在线统计隐藏（统计仍可见于设备面板头部）。

### S2.3 登录页响应式

- 登录卡片 `width: 380` 改为 `width: '100%', maxWidth: 380`，外层容器加左右 padding（`calc(100vw - 40px)` 兜底），320px 视口内完整显示、无横向滚动。桌面外观不变。

### S2.4 移动端文本与触控

- 聊天输入框（`TextArea`）移动端字号 ≥16px，避免 iOS 聚焦缩放；给消息区与输入区容器加稳定 `className`，用媒体查询覆盖 padding（如 20px→12px）。
- `body` 增加 `-webkit-tap-highlight-color: transparent` 与 `touch-action: manipulation`；底部导航项高度 ≥44px。

### S2.5 PWA

- `src/app/manifest.ts`（`MetadataRoute.Manifest`）：name/short_name "Oh My Sage"、`start_url: "/"`、`display: "standalone"`、`theme_color: #0f0f1e`、`background_color: #0a0a14`、icons 192/512（`purpose: any maskable`）。
- 图标：手写 SVG（渐变圆角方块 + 闪电，与登录页 logo 同源），用 sharp 栅格化为 `public/icons/icon-192.png`、`icon-512.png`、`apple-touch-icon.png`(180)。
- `public/sw.js`：极简 Service Worker——导航请求 network-first（回退缓存），静态资源 cache-first，版本化缓存名。仅用于离线兜底静态壳；聊天数据实时，不做离线缓存。
- 注册：独立小组件在 `navigator.serviceWorker` 可用且 `window.isSecureContext` 时注册 `/sw.js`。**边界**：局域网 HTTP（README 部署方式）不是安全上下文，SW 不注册、静默跳过，但 manifest/图标对 Android Chrome 与 iOS Safari"添加到主屏幕"均生效——这与 S2.5 目标（全屏启动、无地址栏）一致。
- `src/app/layout.tsx` 改为**服务端组件**以导出 `metadata`（manifest 链接、`appleWebApp`、`appleTouchIcon`）与 `viewport`；现有 `ConfigProvider`/`StyleProvider`/`App` 原样迁移到新的客户端组件 `src/app/Providers.tsx`，`layout.tsx` 只做 `<html><body><Providers>{children}</Providers>` 包装——Next 14 + antd 的标准模式，规避 antd 旧版组件文件无 `'use client'` 边界在 RSC 下的渲染风险（用 `next build` 验证）。

### S2.6 暗色主题一致性小修复

- `DevicePanel`/`GraphPanel` 中写死的浅色边框（`#f0f0f0`/`#f5f5f5`）统一为 `var(--border-subtle)`。全断点生效，移动端整屏面板上更明显。

## [S3] Out of Scope

- 不改后端 API 与 MCP；不新增接口。
- 不做登录状态持久化（刷新后仍需输码，沿用现状）。
- 不做独立 `/m` 路由；不做平板专门布局（≥768px 一律走桌面档）。
- 不做聊天内容离线缓存；不做亮/暗主题切换。

## Tasks

- [x] T1: 响应式基础设施——`useMediaQuery` hook + `globals.css` 移动端样式（100dvh、safe-area、tap 优化、输入字号 ≥16px） — acceptance: 375px 视口无横向滚动，输入框聚焦不触发 iOS 缩放 (covers: S2.1, S2.4)
- [x] T2: `page.tsx` 移动端布局——底部导航四 Tab、面板保活、桌面布局不变 — acceptance: 移动端四面板可切换且聊天流不中断、历史选中跳回对话；桌面端渲染与改动前一致 (covers: S2.2)
- [x] T3: `LoginPage` 响应式卡片 — acceptance: 320px 视口登录卡完整在屏内 (covers: S2.3)
- [x] T4: PWA——`manifest.ts`、图标生成、`sw.js` 注册、`layout.tsx` 服务端化 + metadata — acceptance: `next build` 通过，manifest 可解析且含 standalone 与图标，桌面/移动渲染正常 (covers: S2.5)
- [x] T5: `DevicePanel`/`GraphPanel` 边框主题化 — acceptance: 暗色主题下无浅色边框 (covers: S2.6)

## Journey log

- Next 14 的 file-based manifest（`manifest.ts` → `/manifest.webmanifest`）会**覆盖** `metadata.manifest` 链接，`layout.tsx` 里手写 `manifest: '/manifest.json'` 是死配置（评审发现，已删）——将来做 PWA 直接建 `manifest.ts` 即可，别在 metadata 里重复声明。
- `sw.js` 作为 `public/` 静态文件，浏览器按字节比对决定是否重装；缓存版本号 `CACHE_NAME` 必须随文件内容一起改动才能生效（已在文件头注释标注）。
