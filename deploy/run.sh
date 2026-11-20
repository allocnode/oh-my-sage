#!/bin/bash
# oh-my-sage TrueNAS 部署脚本（以 root 运行，例如 TrueNAS WebUI 的 Shell）
# 优先拉取 Docker Hub 预构建镜像；镜像尚未推送时自动回退本地构建。
set -e
cd /home/truenas_admin/oh-my-sage/repo/deploy
echo "=== docker compose pull ==="
if docker compose pull; then
  echo "=== docker compose up -d ==="
  docker compose up -d
else
  echo "=== 镜像拉取失败，回退本地构建 ==="
  docker compose up -d --build
fi
echo "=== docker compose ps ==="
docker compose ps
echo "=== MCP healthz ==="
curl -s http://127.0.0.1:3790/healthz
echo
echo "=== web ==="
curl -s -o /dev/null -w "web HTTP %{http_code}\n" http://127.0.0.1:3000
echo "=== done ==="
