# Deployment script for Tencent Cloud
$SSH_HOST = "tencent"
$REMOTE_PATH = "/root/app/layout-editor"

Write-Host "🚀 Starting deployment to $SSH_HOST..." -ForegroundColor Cyan

# 1. Ensure remote directory exists
Write-Host "📁 Preparing remote directory..." -ForegroundColor Gray
ssh $SSH_HOST "mkdir -p $REMOTE_PATH"

# 2. Sync files
# We use a tarball to preserve file structure and speed up transfer
Write-Host "📦 Packaging and syncing files..." -ForegroundColor Gray
tar --exclude="node_modules" --exclude="dist" --exclude=".git" --exclude=".agent" -czf deploy.tar.gz .
scp deploy.tar.gz "$($SSH_HOST):$REMOTE_PATH/"
Remove-Item deploy.tar.gz

# 3. Extract and Build on Server
Write-Host "🏗️ Rebuilding containers on server..." -ForegroundColor Gray
ssh $SSH_HOST "cd $REMOTE_PATH && tar -xzf deploy.tar.gz && rm deploy.tar.gz && docker-compose up -d --build"

Write-Host "✅ Deployment complete! Check the status with: ssh $SSH_HOST 'cd $REMOTE_PATH && docker-compose ps'" -ForegroundColor Green
