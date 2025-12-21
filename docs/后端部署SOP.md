# 后端数据存储服务部署SOP

## 概述

本文档记录了后端数据存储服务（content-backend）从本地构建到服务器部署的完整操作流程（Standard Operating Procedure）。

## 服务器信息

- **服务器地址**: 101.42.158.32
- **SSH密钥**: `c:/Users/Lx050/.ssh/editor135.pem`
- **用户**: root
- **项目目录**: `/root/content-backend`
- **服务运行目录**: `/var/www/content-backend`
- **服务端口**: 3001
- **API域名**: https://api.lx05.art
- **PM2应用名**: content-backend
- **飞书插件地址**: https://api.lx05.art/sync-plugin

## 环境要求

- Node.js 18+ LTS
- PM2 进程管理器
- 1GB内存，20GB硬盘

## 部署流程

### 1. 本地准备

```bash
# 在后端项目根目录执行
npm install --production
npm run build  # 如果有构建步骤

# 检查package.json确保有start命令
{
  "scripts": {
    "start": "node src/app.js",
    "dev": "nodemon src/app.js"
  }
}
```

### 2. 创建部署包

```bash
# 创建部署包（排除node_modules）
tar -czf content-backend.tar.gz \
  --exclude=node_modules \
  --exclude=.git \
  --exclude=data \
  --exclude=logs \
  .

# 或者使用更好的方式，创建部署目录
mkdir deploy
cp -r src package.json ecosystem.config.js deploy/
cp -r config deploy/  # 如果有配置文件
cp -r sync-plugin deploy/  # 飞书同步插件

# 打包deploy目录
tar -czf content-backend-deploy.tar.gz deploy/
```

### 3. 上传到服务器

```bash
# 上传部署包
scp -o StrictHostKeyChecking=no -i "c:/Users/Lx050/.ssh/editor135.pem" content-backend-deploy.tar.gz root@101.42.158.32:/root/
```

### 4. 服务器部署

```bash
# 连接服务器
ssh -o StrictHostKeyChecking=no -i "c:/Users/Lx050/.ssh/editor135.pem" root@101.42.158.32

# 解压部署包
cd /root
tar -xzf content-backend-deploy.tar.gz

# 创建项目目录（如果不存在）
mkdir -p /var/www/content-backend
mkdir -p /var/www/content-backend/data/{metadata,config,logs}

# 复制文件
rm -rf /var/www/content-backend/*
cp -r deploy/* /var/www/content-backend/

# 进入服务目录
cd /var/www/content-backend

# 安装依赖（使用淘宝镜像加速）
npm install --production --registry=https://registry.npmmirror.com

# 创建数据目录
mkdir -p data/{metadata,config,logs}
mkdir -p data/metadata/$(date +%Y)/$(date +%m)

# 设置文件权限
chown -R root:root /var/www/content-backend/
chmod +x /var/www/content-backend/src/*.js  # 确保脚本可执行
```

### 5. 配置环境变量

```bash
# 创建.env文件
cat > /var/www/content-backend/.env << EOF
NODE_ENV=production
PORT=3001
DATA_DIR=/var/www/content-backend/data

# 飞书配置
FEISHU_APP_ID=YOUR_APP_ID
FEISHU_APP_SECRET=YOUR_APP_SECRET
FEISHU_VERIFICATION_TOKEN=YOUR_TOKEN

# 日志级别
LOG_LEVEL=info
EOF

# 设置权限
chmod 600 /var/www/content-backend/.env
```

### 6. PM2配置

创建或更新PM2配置文件 `/var/www/content-backend/ecosystem.config.js`：

```javascript
module.exports = {
  apps: [{
    name: 'content-backend',
    script: './src/app.js',
    cwd: '/var/www/content-backend',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    },
    error_file: './data/logs/pm2-error.log',
    out_file: './data/logs/pm2-out.log',
    log_file: './data/logs/pm2-combined.log',
    time: true,
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true
  }]
};
```

### 7. 启动服务

```bash
# 启动服务
cd /var/www/content-backend
pm2 start ecosystem.config.js

# 查看服务状态
pm2 list

# 查看服务日志
pm2 logs content-backend --lines 20

# 保存PM2配置
pm2 save
pm2 startup
```

## Nginx配置

在 `/etc/nginx/conf.d/api.lx05.art.conf` 添加：

```nginx
# 后端API服务
server {
    listen 80;
    server_name api.lx05.art;

    # 限制请求体大小
    client_max_body_size 10M;

    # 访问日志
    access_log /var/log/nginx/api.lx05.art.access.log;
    error_log /var/log/nginx/api.lx05.art.error.log;

    # API路由
    location /api/ {
        proxy_pass http://127.0.0.1:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # 超时设置
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Webhook路由
    location /webhook/ {
        proxy_pass http://127.0.0.1:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Webhook需要更长的超时时间
        proxy_connect_timeout 30s;
        proxy_send_timeout 30s;
        proxy_read_timeout 30s;
    }

    # 飞书同步插件（静态文件）
    location /sync-plugin/ {
        alias /var/www/content-backend/sync-plugin/;
        try_files $uri $uri/ =404;

        # 缓存设置
        expires 1h;
        add_header Cache-Control "public, immutable";
    }

    # 健康检查
    location /health {
        proxy_pass http://127.0.0.1:3001/health;
        access_log off;
    }
}
```

重新加载Nginx配置：

```bash
# 测试配置
nginx -t

# 重新加载
nginx -s reload
```

## 监控和维护脚本

### 1. 创建监控脚本

```bash
# 创建 /var/www/content-backend/scripts/monitor.sh
cat > /var/www/content-backend/scripts/monitor.sh << 'EOF'
#!/bin/bash

LOG_FILE="/var/www/content-backend/data/logs/monitor.log"
DATE=$(date '+%Y-%m-%d %H:%M:%S')

# 检查服务状态
check_service() {
    if ! pm2 list | grep -q "content-backend.*online"; then
        echo "[$DATE] 服务未运行，正在重启..." | tee -a $LOG_FILE
        pm2 restart content-backend
        echo "[$DATE] 服务重启完成" | tee -a $LOG_FILE
    fi
}

# 检查磁盘空间
check_disk() {
    DISK_USAGE=$(df /var/www/content-backend | tail -1 | awk '{print $5}' | sed 's/%//')
    if [ $DISK_USAGE -gt 80 ]; then
        echo "[$DATE] 警告：磁盘使用率超过80% (${DISK_USAGE}%)" | tee -a $LOG_FILE
    fi
}

# 检查内存使用
check_memory() {
    MEM_INFO=$(pm2 jlist | jq '.[0] | {memory: .monit.memory, cpu: .monit.cpu}' 2>/dev/null)
    if [ $? -eq 0 ]; then
        echo "[$DATE] 内存使用: $MEM_INFO" >> $LOG_FILE
    fi
}

# 执行检查
check_service
check_disk
check_memory
EOF

chmod +x /var/www/content-backend/scripts/monitor.sh
```

### 2. 创建备份脚本

```bash
# 创建 /var/www/content-backend/scripts/backup.sh
cat > /var/www/content-backend/scripts/backup.sh << 'EOF'
#!/bin/bash

BACKUP_DIR="/var/backups/content-backend"
DATE=$(date +%Y%m%d-%H%M%S)
DATA_DIR="/var/www/content-backend/data"

# 创建备份目录
mkdir -p $BACKUP_DIR

# 备份数据目录
tar -czf "$BACKUP_DIR/data-$DATE.tar.gz" -C $DATA_DIR .

# 备份配置文件
tar -czf "$BACKUP_DIR/config-$DATE.tar.gz" ecosystem.config.js .env

# 清理30天前的备份
find $BACKUP_DIR -name "*.tar.gz" -mtime +30 -delete

echo "备份完成: data-$DATE.tar.gz"
EOF

chmod +x /var/www/content-backend/scripts/backup.sh
```

### 3. 配置定时任务

```bash
# 编辑crontab
crontab -e

# 添加以下内容
# 每5分钟监控服务
*/5 * * * * /var/www/content-backend/scripts/monitor.sh

# 每天凌晨2点备份
0 2 * * * /var/www/content-backend/scripts/backup.sh

# 每周日凌晨3点重启服务
0 3 * * 0 pm2 restart content-backend
```

## 快速部署命令汇总

```bash
# 1. 本地打包
tar -czf content-backend-deploy.tar.gz deploy/

# 2. 上传到服务器
scp -o StrictHostKeyChecking=no -i "c:/Users/Lx050/.ssh/editor135.pem" content-backend-deploy.tar.gz root@101.42.158.32:/root/

# 3. 服务器部署（一步到位）
ssh -o StrictHostKeyChecking=no -i "c:/Users/Lx050/.ssh/editor135.pem" root@101.42.158.32 << 'EOF'
cd /root
tar -xzf content-backend-deploy.tar.gz
rm -rf /var/www/content-backend/*
cp -r deploy/* /var/www/content-backend/
cd /var/www/content-backend
npm install --production --registry=https://registry.npmmirror.com
mkdir -p data/{metadata,config,logs}
pm2 restart content-backend || pm2 start ecosystem.config.js
EOF
```

## 测试验证

### 1. API测试

```bash
# 测试服务是否正常运行
curl http://localhost:3001/health

# 测试Webhook接收
curl -X POST http://localhost:3001/webhook/content \
  -H "Content-Type: application/json" \
  -d '{"event":"test","data":{}}'

# 测试飞书插件
curl https://api.lx05.art/sync-plugin/meta.json
```

### 2. 日志检查

```bash
# PM2日志
pm2 logs content-backend --lines 50

# 应用日志
tail -f /var/www/content-backend/data/logs/app.log

# Nginx日志
tail -f /var/log/nginx/api.lx05.art.access.log
```

## 故障排查

### 1. 服务无法启动

```bash
# 查看PM2日志
pm2 logs content-backend --err

# 检查端口占用
netstat -tlnp | grep 3001

# 手动启动测试
cd /var/www/content-backend
node src/app.js
```

### 2. 飞书同步失败

```bash
# 检查飞书配置
cat /var/www/content-backend/.env | grep FEISHU

# 查看同步日志
tail -f /var/www/content-backend/data/logs/sync.log

# 测试飞书API连接
curl -X GET "https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal/" \
  -H "Content-Type: application/json" \
  -d '{"app_id":"YOUR_APP_ID","app_secret":"YOUR_APP_SECRET"}'
```

### 3. 数据问题

```bash
# 检查数据目录
ls -la /var/www/content-backend/data/

# 检查文件权限
ls -la /var/www/content-backend/data/metadata/

# 备份当前数据
cp -r /var/www/content-backend/data /var/www/content-backend/data.bak.$(date +%Y%m%d_%H%M%S)
```

## 更新部署

### 1. 零停机更新（推荐）

```bash
# 1. 构建新版本
npm run build
tar -czf content-backend-v2.tar.gz deploy/

# 2. 上传
scp content-backend-v2.tar.gz root@101.42.158.32:/root/

# 3. 零停机更新
ssh root@101.42.158.32 << 'EOF'
cd /root
tar -xzf content-backend-v2.tar.gz

# 备份当前版本
cp -r /var/www/content-backend /var/www/content-backend.bak.$(date +%Y%m%d_%H%M%S)

# 更新文件（保留data目录）
cp -r deploy/* /var/www/content-backend/
cd /var/www/content-backend
npm install --production

# 重载服务（而不是重启）
pm2 reload content-backend
EOF
```

### 2. 滚动更新（多实例）

如果使用多实例部署：

```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'content-backend',
    script: './src/app.js',
    instances: 2,  // 使用2个实例
    exec_mode: 'cluster',
    // ... 其他配置
  }]
};
```

更新命令：

```bash
pm2 reload content-backend
```

## 安全加固

### 1. 防火墙配置

```bash
# 只开放必要端口
ufw allow 22/tcp  # SSH
ufw allow 80/tcp  # HTTP
ufw allow 443/tcp # HTTPS
ufw enable
```

### 2. SSL证书（使用Let's Encrypt）

```bash
# 安装certbot
apt install certbot python3-certbot-nginx

# 申请证书
certbot --nginx -d api.lx05.art

# 自动续期
echo "0 12 * * * /usr/bin/certbot renew --quiet" | crontab -
```

### 3. 限制访问

```nginx
# 在Nginx配置中添加
location /api/ {
    # 限制IP访问（可选）
    # allow 192.168.1.0/24;
    # deny all;

    # 限制请求频率
    limit_req zone=api burst=10 nodelay;

    proxy_pass http://127.0.0.1:3001;
    # ... 其他配置
}
```

## 部署历史

| 部署时间 | 操作人 | 版本 | 备注 |
|---------|--------|------|------|
| 2024-12-20 10:00 | 待定 | v1.0 | 初始部署 |

## 联系方式

如有部署相关问题，请联系：
- 技术支持：[在此处填写联系方式]
- 紧急联系：[在此处填写紧急联系方式]

---

## 注意事项

1. **数据备份**：每次更新前务必备份数据目录
2. **环境变量**：确保.env文件包含正确的配置
3. **权限问题**：确保文件权限正确，特别是日志目录
4. **监控告警**：配置监控告警，及时发现问题
5. **版本回滚**：保留旧版本，以便快速回滚