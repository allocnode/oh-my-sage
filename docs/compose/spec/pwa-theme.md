---
feature: pwa-theme
status: delivered
updated: 2026-11-24
source: feat/pwa-theme
---

# PWA 支持 + 明暗主题切换

## Report

**What was built** — 网页版支持 PWA 与三态主题：
- **PWA**：`@ducanh2912/next-pwa` 包装 next.config，自定义 runtimeCaching（`/api/` NetworkOnly、页面导航 NetworkFirst、同源静态 SWR），构建生成 `public/sw.js` + workbox；file-based `manifest.ts`（standalone + 192/512 图标）；SVG 源图标 + sharp 栅格化 PNG（`npm run generate:icons`）；layout 服务端化导出 metadata/viewport。基线中 mobile-responsive 分支的手写 PWA（sw.js/PwaRegister）按用户决策移除。
- **三态主题**：`ThemeProvider`（localStorage `oh-my-sage-theme` + system 实时跟随 + layout 内联脚本首帧防闪烁）；antd `darkAlgorithm`/`defaultAlgorithm` 双 token 集；`globals.css` `[data-theme='light']` 变量全量覆盖；`ThemeSwitcher` 共享组件提供登录页角落、桌面顶栏、移动端紧凑顶栏三处入口（当前项勾选）。
- **对比度修复**（评审后）：禁用主按钮弃用渐变灰化，改浅灰底+中灰文字；移动导航激活色变量化。
- **Docker 配套**：`deploy/Dockerfile.web` 运行阶段补 `COPY public/`（镜像内 PWA 可访问）；镜像版本 0.1.1 → 0.1.2（CI/compose/README 同步）。

**Verification** —
- `npm exec tsc -- --noEmit` → PASS（多次，含 rebase 与重构后）
- `npm run test:unit` → PASS（188 通过 / 1 跳过 / 0 失败）
- `npm run build` → PASS（生成 `public/sw.js` + workbox + `/manifest.webmanifest`）
- `npm run lint` → FAIL，PRE-EXISTING（LINT-RUSHSTACK-NODE24：`@rushstack/eslint-patch` 在 Node 24 下加载即抛错，与本次 diff 无关）
- Playwright 实测（stub /api/auth|devices|sessions）：375px 移动端底部四 Tab 与移动顶栏主题入口、桌面顶栏与登录页角落三处 Dropdown 三态切换+勾选+localStorage 持久化+刷新无闪烁、SW 注册并控制页面、manifest/图标/theme-color media 分支、禁用主按钮浅色 4.26:1、导航激活态浅色 5.39:1/深色 9.65:1
- 独立评审（general-1）：全部验收项满足、无 critical；"双勾选"观察经 DOM 实测驳回（选中项仅 1 个勾选图标）；重复 Dropdown 配置与 sider 折叠按钮浅色不可见已按观察修复（T8）

## [S1] Problem

网页版（Next.js 14 App Router）现状：

- **无 PWA 支持**：没有 manifest、没有应用图标、没有 Service Worker，手机浏览器无法"添加到主屏幕"以独立窗口全屏启动；
- **主题写死为暗色**：`layout.tsx` 中 `ConfigProvider` 固定 `darkAlgorithm`，`globals.css` 全部 CSS 变量只有暗色取值，用户无法切换到浅色，也无法跟随系统偏好。

用户诉求：① 支持 PWA（可安装、可离线启动壳）；② 支持深色/浅色模式切换。

## [S2] Design

### S2.1 PWA 机制：`@ducanh2912/next-pwa` + file-based manifest

- 引入 `@ducanh2912/next-pwa@^10.2.9`（维护中的 next-pwa 分支，peer 要求 next ≥14），用 `withPWA` 包装 `next.config.js`（保留现有 `serverExternalPackages`、`experimental`、`webpack` 配置）。
- PWA 选项：`dest: 'public'`（构建时向 `public/` 输出 `sw.js` 与 workbox 运行时文件）、`disable: process.env.NODE_ENV === 'development'`（开发模式不生成/不注册，避免 HMR 干扰）、默认自动注册（`register: true`，构建注入注册代码，仅生产构建生效）。
- 缓存策略（`runtimeCaching` 显式声明，防止 API 被缓存）：
  - 页面导航：`NetworkFirst`（离线时回退 precache 的起始页壳）；
  - `/api/` 请求：`NetworkOnly`——设备/规则/会话/聊天数据必须实时，不做任何缓存；
  - 其余同源 GET 静态资源：`StaleWhileRevalidate`。
- 构建产物（`public/sw.js`、`public/workbox-*.js`）加入 `.gitignore`，由 `next build` 生成，不提交。
- 安全上下文边界：局域网 HTTP（README 部署方式）不是安全上下文，`navigator.serviceWorker` 注册会被浏览器拒绝——SW 静默不生效，但 manifest/图标对"添加到主屏幕"（Android Chrome / iOS Safari）仍有效。这是 PWA 的通用限制，不是缺陷。

### S2.2 PWA manifest 与图标

- `src/app/manifest.ts`（`MetadataRoute.Manifest`）：name/short_name "Oh My Sage"、`start_url: "/"`、`display: "standalone"`、`background_color: #0a0a14`、`theme_color: #0f0f1e`（manifest 静态取暗色品牌值；浏览器动态 tab 色由 viewport `themeColor` 的 media 分支提供，见 S2.4）、icons 192/512（`purpose: any maskable` 各一）。
- 图标：`public/icons/icon.svg`（渐变圆角方块 + 白色闪电，与页面 logo 同源视觉），`scripts/generate-icons.mjs` 用 `sharp`（新增 devDependency）栅格化为 `icon-192.png`、`icon-512.png`、`apple-touch-icon.png`(180)，PNG 提交入库；`npm run generate:icons` 脚本可复现。
- `layout.tsx` 服务端导出 `metadata.icons`（icon + apple-touch-icon）与 `appleWebApp` 元信息。

### S2.3 主题状态：三态 + localStorage + 首帧防闪烁（无新依赖）

- 自研 `src/components/ThemeProvider.tsx`（`'use client'`），不引入 next-themes：
  - 状态：`'light' | 'dark' | 'system'`（用户选择），解析值 `resolvedTheme: 'light' | 'dark'`；
  - 持久化：`localStorage['oh-my-sage-theme']`；
  - 解析：`system` 时用 `matchMedia('(prefers-color-scheme: dark)')`，并监听 `change` 事件实时跟随；
  - 应用：写 `document.documentElement.dataset.theme` 与 `style.colorScheme`，SSR 首帧由内联脚本完成（见 S2.4），Provider 挂载后同步一次状态；
  - 对外暴露 `useTheme()` hook 返回 `{theme, resolvedTheme, setTheme}`。
- AntD 双主题 token：`ConfigProvider.theme.algorithm` 按 `resolvedTheme` 在 `darkAlgorithm` 与 `defaultAlgorithm`（浅色）间切换；暗色 token 沿用现有值，浅色 token 新定义（白底容器、深色正文、浅灰边框、同款品牌色）。

### S2.4 CSS 变量双主题 + 无闪烁首帧

- `globals.css`：`:root` 保留现有暗色取值作为默认；新增 `[data-theme='light']` 覆盖全部变量（背景 `#f6f7fb` 系、文本深灰、边框浅灰、玻璃面板白底半透明），保证组件里 `var(--*)` 全部双主题生效；`:root { color-scheme: dark }`、`[data-theme='light'] { color-scheme: light }`。
- 防闪烁内联脚本：`layout.tsx` 的 `<head>` 中放置 `<script dangerouslySetInnerHTML>`（非模块、同步执行）：读取 `localStorage['oh-my-sage-theme']` → 解析 system → 在 hydration 前设置 `documentElement.dataset.theme` 与 `color-scheme`。
- 浏览器动态主题色：`layout.tsx` 的 `viewport.themeColor` 用 media 分支数组——`(prefers-color-scheme: dark)` → `#0f0f1e`，light → 浅色品牌底色；manifest 的静态 `theme_color` 保持暗色品牌值。

### S2.5 切换入口

- `page.tsx` 顶栏右侧（设备在线统计旁）放 `Dropdown`：图标按钮（`SunOutlined`/`MoonOutlined`/`DesktopOutlined` 按当前态显示），菜单三项"浅色 / 深色 / 跟随系统"，当前项打勾；桌面与移动端顶栏均可见。

## [S3] Out of Scope

- 基线（本地 main，含移动端改造）的布局结构与现有交互不改动；移动端仅新增顶栏主题入口。
- 基线中由 mobile-responsive 分支带入的手写 PWA（`public/sw.js`、`PwaRegister.tsx`）按用户决策移除，由 next-pwa 取代。
- 不做聊天/设备数据的离线缓存（API 恒实时，`NetworkOnly`）。
- 不改后端 API 与 MCP。
- 不做登录状态持久化（沿用现状）。

## Tasks

- [x] T1: 依赖与配置——安装 `@ducanh2912/next-pwa` + `sharp`，`next.config.js` 用 `withPWA` 包装，`.gitignore` 忽略 `public/sw.js` 与 `public/workbox-*.js` — acceptance: `next build` 生成 `public/sw.js` 与 workbox 文件 (covers: S2.1)
- [x] T2: manifest 与图标——`manifest.ts`、`public/icons/icon.svg` + `scripts/generate-icons.mjs` 生成 192/512/180 PNG — acceptance: `next build` 产出 `/manifest.webmanifest`（standalone + 图标），图标 PNG 入库 (covers: S2.2)
- [x] T3: 主题基础设施——`ThemeProvider` + `useTheme`、`globals.css` 浅色变量、antd 双算法 token、layout 内联防闪烁脚本与 viewport media themeColor — acceptance: 刷新无闪烁；浅/深/跟随系统三态生效并持久化，系统模式实时跟随 (covers: S2.3, S2.4)
- [x] T4: 切换入口——桌面顶栏与移动端紧凑顶栏 Dropdown，登录页角落同款入口 — acceptance: 三处入口可切换三态，当前项勾选，图标随当前态变化 (covers: S2.5)
- [x] T5: 验证与定稿——tsc / test:unit / build 全过（lint 失败标 PRE-EXISTING），独立评审，spec 收尾 — acceptance: 验证命令全部记录结果，评审无 critical (covers: S2.1–S2.5)
- [x] T6: 基线整合——rebase 到本地 main（含移动端改造 + 手写 PWA），移除手写 PWA，合并移动端布局与主题入口 — acceptance: tsc/单测/build 通过，桌面与移动端 Playwright 实测通过 (covers: S2.1, S2.5)
- [x] T7: Docker 镜像配套——`deploy/Dockerfile.web` 运行阶段分发 `public/`（PWA 图标与生成的 sw.js/workbox），`docker-images.yml` 版本升至 0.1.2，compose/README 版本引用同步 — acceptance: 镜像构建后 `/sw.js`、`/icons/*` 可访问；CI 将产出 `oh-my-sage-web:0.1.2` (covers: S2.1)
- [x] T8: 评审跟进——抽取 `ThemeSwitcher` 共享组件收敛三处重复配置；sider 折叠按钮背景变量化；浅色模式禁用主按钮与导航激活态对比度修复 — acceptance: 重构后三处入口 Playwright 实测正常，tsc/build 通过 (covers: S2.5)

## Journey log

- rebase 到本地 main（98c9eb3，含移动端 + 手写 PWA）时，手写 PWA（`public/sw.js`、`PwaRegister.tsx`）与 next-pwa 重复：`public/sw.js` 同名冲突、`PwaRegister` 会二次注册 SW——按用户决策整体移除手写实现，图标与 `generate-icons.mjs` 保留本项目新版本（sharp 入 devDependencies，`npm run generate:icons` 可复现）。
- `deploy/Dockerfile.web` 运行阶段原先不拷贝 `public/`：镜像里 `/sw.js` 与 `/icons/*` 全部 404，PWA 失效。已补 `COPY public/`。教训：next-pwa 构建产物在 `public/`，任何以文件系统快照方式分发 Next 产物的部署都必须包含它。
- Next 14 的 file-based manifest（`manifest.ts` → `/manifest.webmanifest`）覆盖 `metadata.manifest` 链接，layout 里手写 manifest 链接是死配置（mobile-responsive spec 已有记录，本分支同样不写）。
- 独立评审（general-1）称 `selectable` + 手写 `CheckOutlined` 造成选中项双勾选——DOM 实测选中项仅 1 个 `.anticon-check`（antd `selectable` 只提供高亮背景），观察不成立，未改动。评审发现的三处重复 Dropdown 配置确有价值，已抽为 `ThemeSwitcher.tsx` 共享组件。
