#!/bin/bash
# oh-my-sage TrueNAS 部署脚本（以 root 运行，例如 TrueNAS WebUI 的 Shell）
set -e
cd /home/truenas_admin/oh-my-sage/repo/deploy
echo "=== docker compose up -d --build ==="
docker compose up -d --build
echo "=== docker compose ps ==="
docker compose ps
echo "=== MCP healthz ==="
curl -s http://127.0.0.1:3790/healthz
echo
echo "=== web ==="
curl -s -o /dev/null -w "web HTTP %{http_code}\n" http://127.0.0.1:3000
echo "=== done ==="
