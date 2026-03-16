#!/bin/bash
# 服务器端自动部署脚本
# 用法：在服务器上通过 webhook 或 cron 触发
set -e

# === 配置区 ===
REPO_DIR="/opt/1921editor"          # Git 仓库目录
DEPLOY_DIR="/var/www/1921editor"    # Nginx 站点目录
BRANCH="main"
LOG_FILE="/var/log/1921editor-deploy.log"

echo "$(date '+%Y-%m-%d %H:%M:%S') - Starting deployment..." | tee -a "$LOG_FILE"

cd "$REPO_DIR"

# 拉取最新代码
git fetch origin "$BRANCH"
git reset --hard "origin/$BRANCH"

# 安装依赖并构建
# 确保 Node >= 22 LTS
npm ci --prefer-offline
npx vite build

# 同步到站点目录
mkdir -p "$DEPLOY_DIR"
rsync -av --delete src/dist/ "$DEPLOY_DIR/"

echo "$(date '+%Y-%m-%d %H:%M:%S') - Deployment completed!" | tee -a "$LOG_FILE"
