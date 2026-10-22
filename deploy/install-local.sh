#!/usr/bin/env bash
# 将 oh-my-sage MCP Server 安装为本机常驻服务（HTTP 模式，仅监听 127.0.0.1）
#   macOS: launchd LaunchAgent（登录时启动，退出后自动重启）
#   Linux: systemd --user 服务（Restart=on-failure）
#
# 用法（先在仓库根目录 npm run build:mcp）：
#   deploy/install-local.sh [-g 网关地址] [-p 端口] [-t token] [-n 服务名]
#   deploy/install-local.sh -u            # 卸载
set -euo pipefail

GATEWAY_URL="${GATEWAY_URL:-}"
PORT=3790
TOKEN=""
NAME="oh-my-sage-mcp"
UNINSTALL=0

while [ $# -gt 0 ]; do
  case "$1" in
    -g|--gateway) GATEWAY_URL="$2"; shift 2 ;;
    -p|--port) PORT="$2"; shift 2 ;;
    -t|--token) TOKEN="$2"; shift 2 ;;
    -n|--name) NAME="$2"; shift 2 ;;
    -u|--uninstall) UNINSTALL=1; shift ;;
    -h|--help) sed -n '2,8p' "$0"; exit 0 ;;
    *) echo "未知参数: $1" >&2; exit 1 ;;
  esac
done

REPO="$(cd "$(dirname "$0")/.." && pwd)"
ENTRY="$REPO/dist/mcp/mcp/index.js"
OS="$(uname -s)"
LABEL="com.oh-my-sage.$NAME"
PLIST="$HOME/Library/LaunchAgents/$LABEL.plist"
UNIT="$HOME/.config/systemd/user/$NAME.service"

# ==================== 卸载 ====================
if [ "$UNINSTALL" = 1 ]; then
  if [ "$OS" = Darwin ]; then
    launchctl bootout "gui/$(id -u)/$LABEL" 2>/dev/null || true
    rm -f "$PLIST"
  else
    systemctl --user disable --now "$NAME.service" 2>/dev/null || true
    rm -f "$UNIT"
    systemctl --user daemon-reload
  fi
  echo "已卸载 $NAME"
  exit 0
fi

# ==================== 前置检查 ====================
[ -f "$ENTRY" ] || { echo "未找到 $ENTRY，请先执行 npm run build:mcp" >&2; exit 1; }
NODE="$(command -v node)" || { echo "未找到 node" >&2; exit 1; }
[ -n "$GATEWAY_URL" ] || echo "提示：未设置 -g 网关地址，首次调用 mijia_auth 时需要传 gateway_url" >&2

# ==================== 注册服务 ====================
if [ "$OS" = Darwin ]; then
  mkdir -p "$(dirname "$PLIST")" "$HOME/Library/Logs"
  cat > "$PLIST" <<EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key><string>$LABEL</string>
  <key>ProgramArguments</key>
  <array><string>$NODE</string><string>$ENTRY</string><string>--http</string></array>
  <key>WorkingDirectory</key><string>$REPO</string>
  <key>EnvironmentVariables</key>
  <dict>
    <key>MCP_HTTP_HOST</key><string>127.0.0.1</string>
    <key>MCP_HTTP_PORT</key><string>$PORT</string>
    <key>GATEWAY_URL</key><string>$GATEWAY_URL</string>
    <key>MCP_AUTH_TOKEN</key><string>$TOKEN</string>
  </dict>
  <key>RunAtLoad</key><true/>
  <key>KeepAlive</key><true/>
  <key>StandardErrorPath</key><string>$HOME/Library/Logs/$NAME.log</string>
</dict>
</plist>
EOF
  chmod 600 "$PLIST"
  launchctl bootout "gui/$(id -u)/$LABEL" 2>/dev/null || true
  launchctl bootstrap "gui/$(id -u)" "$PLIST"
else
  mkdir -p "$(dirname "$UNIT")"
  cat > "$UNIT" <<EOF
[Unit]
Description=oh-my-sage MCP Server (HTTP, 127.0.0.1)
After=network-online.target

[Service]
WorkingDirectory=$REPO
ExecStart="$NODE" "$ENTRY" --http
Environment=MCP_HTTP_HOST=127.0.0.1
Environment=MCP_HTTP_PORT=$PORT
Environment="GATEWAY_URL=$GATEWAY_URL"
Environment="MCP_AUTH_TOKEN=$TOKEN"
Restart=on-failure
RestartSec=5

[Install]
WantedBy=default.target
EOF
  chmod 600 "$UNIT"
  systemctl --user daemon-reload
  systemctl --user enable "$NAME.service"
  systemctl --user restart "$NAME.service"
  echo "提示：如需未登录时也运行，执行 loginctl enable-linger $USER"
fi

# ==================== 健康检查 ====================
URL="http://127.0.0.1:$PORT"
for _ in $(seq 1 20); do
  if curl -fsS "$URL/healthz" >/dev/null 2>&1; then OK=1; break; fi
  sleep 0.5
done
[ "${OK:-0}" = 1 ] || { echo "服务未在 $URL/healthz 响应，请查看日志" >&2; exit 1; }
echo "已启动：$URL/mcp"

# ==================== 客户端配置 ====================
HEADERS=""
[ -n "$TOKEN" ] && HEADERS=",
      \"headers\": { \"Authorization\": \"Bearer $TOKEN\" }"
cat <<EOF

OpenCode（opencode.json）：
{
  "mcp": {
    "oh-my-sage": {
      "type": "remote",
      "url": "$URL/mcp",
      "oauth": false$HEADERS
    }
  }
}

其他支持 Streamable HTTP 的客户端：
{
  "mcpServers": {
    "oh-my-sage": {
      "url": "$URL/mcp"$HEADERS
    }
  }
}
EOF
