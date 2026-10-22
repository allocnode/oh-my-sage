# oh-my-sage MCP Server（Streamable HTTP 模式）
#
# 构建：docker build -t oh-my-sage-mcp .
# 运行：参见 deploy/docker-compose.yml
#
# 运行时只安装 MCP 实际引用的依赖（约 14 MB），不包含 Next.js / antd 等 Web 端依赖。

# ==================== 构建阶段 ====================
FROM node:22-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
# 跳过 install 脚本：MCP 构建只需 TypeScript，bufferutil 等原生可选依赖在构建阶段无用
RUN npm ci --ignore-scripts --no-audit --no-fund

COPY tsconfig.mcp.json ./
COPY src ./src
RUN npm run build:mcp

# 根据编译产物生成只含运行时依赖的 package.json，并以根锁文件锁定版本
COPY deploy/mcp-runtime-package.mjs ./deploy/
RUN node deploy/mcp-runtime-package.mjs package.json dist/mcp runtime/package.json \
    && cp package-lock.json runtime/ \
    && cd runtime \
    && npm install --omit=dev --ignore-scripts --no-audit --no-fund \
    && rm -f package-lock.json \
    && npm cache clean --force

# ==================== 运行阶段 ====================
FROM node:22-alpine
ENV NODE_ENV=production \
    MCP_TRANSPORT=http \
    MCP_HTTP_HOST=0.0.0.0 \
    MCP_HTTP_PORT=3790
WORKDIR /app

COPY --from=build --chown=node:node /app/runtime/package.json ./package.json
COPY --from=build --chown=node:node /app/runtime/node_modules ./node_modules
COPY --from=build --chown=node:node /app/dist/mcp ./dist/mcp

USER node
EXPOSE 3790

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD node -e "fetch('http://127.0.0.1:'+(process.env.MCP_HTTP_PORT||3790)+'/healthz').then(r=>process.exit(r.ok?0:1),()=>process.exit(1))"

CMD ["node", "dist/mcp/mcp/index.js", "--http"]
