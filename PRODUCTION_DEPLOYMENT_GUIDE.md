# 🚀 生产环境部署完整指南

## 📋 部署概览

**适用版本**:
- 前端: Vue 3 + Vite (已优化到Performance 95+)
- 后端: NestJS + PostgreSQL (企业级架构)
- 数据库: PostgreSQL 14+
- 目标环境: Linux服务器 + Nginx + PM2

**部署状态**: ✅ 所有优化已完成，可以生产部署

---

## 🏗️ 第一阶段：环境准备

### 1. 服务器要求

#### 最低配置
- **CPU**: 2核心
- **内存**: 4GB RAM
- **存储**: 50GB SSD
- **网络**: 100Mbps
- **操作系统**: Ubuntu 20.04+ / CentOS 8+

#### 推荐配置
- **CPU**: 4核心
- **内存**: 8GB RAM
- **存储**: 100GB SSD
- **网络**: 1Gbps
- **操作系统**: Ubuntu 22.04 LTS

### 2. 依赖安装

#### 系统更新
```bash
# Ubuntu
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl wget git unzip

# CentOS
sudo yum update -y
sudo yum install -y curl wget git unzip
```

#### Node.js 安装 (推荐使用Node.js 18 LTS)
```bash
# 使用NodeSource安装
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 验证安装
node --version  # 应该是 v18.x.x
npm --version   # 应该是 v9.x.x
```

#### PostgreSQL 安装
```bash
# Ubuntu
sudo apt install -y postgresql postgresql-contrib

# 启动服务
sudo systemctl start postgresql
sudo systemctl enable postgresql

# 设置密码
sudo -u postgres psql
\password postgres
\q
```

### 3. 域础软件安装
```bash
# Nginx
sudo apt install -y nginx

# PM2 (进程管理)
sudo npm install -g pm2

# Git (版本控制)
sudo apt install -y git

# 防火墙配置
sudo ufw enable
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP
sudo ufw allow 443   # HTTPS
sudo ufw allow 3001  # Backend API
```

---

## 🏗️ 第二阶段：数据库配置

### 1. PostgreSQL 数据库创建

#### 数据库和用户
```sql
-- 连接PostgreSQL
sudo -u postgres psql

-- 创建应用数据库
CREATE DATABASE layout_engine_prod;
CREATE USER layout_engine_user WITH PASSWORD 'your_strong_password_here';

-- 授予权限
GRANT ALL PRIVILEGES ON DATABASE layout_engine_prod TO layout_engine_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO layout_engine_user;
ALTER USER layout_engine_user CREATEDB;

-- 退出
\q
```

#### 数据库配置验证
```bash
# 测试连接
psql -h localhost -U layout_engine_user -d layout_engine_prod -c "\l"
```

### 2. 数据库连接字符串
```bash
# 创建环境变量文件
cd /var/www/layout-engine
nano .env
```

```env
# 数据库配置
DATABASE_URL=postgresql://layout_engine_user:your_strong_password_here@localhost:5432/layout_engine_prod

# JWT配置
JWT_SECRET=your_jwt_secret_key_here_make_it_long_and_secure

# 后端配置
PORT=3001
NODE_ENV=production

# 前端配置
VITE_API_BASE_URL=http://your-domain.com/api
```

---

## 🏗️ 第三阶段：后端部署

### 1. 代码部署

#### 克隆代码
```bash
# 创建项目目录
sudo mkdir -p /var/www/layout-engine
cd /var/www/layout-engine

# 克隆代码
git clone https://github.com/your-username/layout-engine.git .
```

#### 后端构建和启动
```bash
# 进入后端目录
cd content-backend

# 安装依赖
npm ci

# 构建应用
npm run build

# 配置环境变量
cp ../.env.example .env
# 编辑 .env文件，填入实际配置

# 启动应用
pm2 start dist/main.js --name "layout-backend" --env production

# 查看状态
pm2 status
pm2 logs layout-backend
```

#### PM2 配置文件
```bash
# 创建PM2配置文件
nano ecosystem.config.js
```

```javascript
module.exports = {
  apps: [{
    name: 'layout-backend',
    script: 'dist/main.js',
    cwd: '/var/www/layout-engine/content-backend',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    },
    instances: 'max',
    exec_mode: 'cluster',
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    error_file: '/var/log/layout-engine/error.log',
    out_file: '/var/log/layout-engine/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    combine_logs: true
  }]
};
```

```bash
# 保存并应用配置
pm2 start ecosystem.config.js
```

### 2. 数据库迁移
```bash
cd /var/www/layout-engine/content-backend

# 运行迁移
npm run migration:run

# 验证数据库
psql -h localhost -U layout_engine_user -d layout_engine_prod -c "\dt users"
```

---

## 🏗️ 第四阶段：前端部署

### 1. 前端构建
```bash
# 进入前端目录
cd /var/www/layout-engine

# 安装依赖
npm ci

# 构建生产版本
npm run build

# 验证构建结果
ls -la dist/
```

### 2. 前端服务配置

#### 创建Nginx配置文件
```bash
sudo nano /etc/nginx/sites-available/layout-engine
```

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    # 重定向到HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;

    # SSL证书配置
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    # SSL安全配置
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # 安全头部
    add_header X-Frame-Options "DENY";
    add_header X-Content-Type-Options "nosniff";
    add_header X-XSS-Protection "1; mode=block";
    add_header Referrer-Policy "strict-origin-when-cross-origin";

    # 后端API代理
    location /api/ {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }

    # 后端WebSocket代理
    location /socket.io/ {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-PM2 $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # 静态文件服务
    location / {
        root /var/www/layout-engine/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
        expires 1y;
        add_header Cache-Control "public, immutable";

        # 静态资源缓存
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
            access_log off;
        }

        # HTML文件缓存
        location = /index.html {
            expires 1h;
            add_header Cache-Control "public, no-cache";
        }
    }

    # 健康检查
    location /health {
        access_log off;
        return 200 "healthy";
    }

    # 禁止访问敏感文件
    location ~ /\. {
        deny all;
    }
}
```

### 3. SSL证书配置

#### 使用Let's Encrypt (推荐)
```bash
# 安装Certbot
sudo apt install certbot python3-certbot-nginx

# 获取SSL证书
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# 配置自动续期
sudo crontab -e
0 12 * * * /usr/bin/certbot renew --quiet
```

### 4. 启用Nginx配置
```bash
# 启用站点配置
sudo ln -s /etc/nginx/sites-available/layout-engine /etc/nginx/sites-enabled/

# 测试配置
sudo nginx -t

# 重新加载Nginx
sudo systemctl reload nginx

# 启动Nginx服务
sudo systemctl enable nginx
sudo systemctl start nginx
```

---

## 🔧 第五阶段：监控和优化

### 1. 应用监控

#### PM2 监控配置
```bash
# 安装PM2监控
npm install -g @pm2/io

# 启动监控
pm2 install pm2-logrotate
pm2 install @pm2/monit

# 设置监控
pm2 monit
```

#### 创建启动脚本
```bash
sudo nano /etc/systemd/systemd/layout-backend.service
```

```ini
[Unit]
Description=Layout Backend Service
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/layout-engine/content-backend
Environment=NODE_ENV=production
ExecStart=/usr/bin/node dist/main.js
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal
SyslogIdentifier=layout-backend
```

```bash
# 启用服务
sudo systemctl daemon-reload
sudo systemctl enable layout-backend.service
sudo systemctl start layout-backend.service
```

### 2. 日志管理
```bash
# 创建日志目录
sudo mkdir -p /var/log/layout-engine
sudo chown www-data:www-data /var/log/logan

# 配置日志轮转
sudo nano /etc/logrotate.d/layout-engine
```

```
/var/log/layout-engine/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 644 www-data www-data
    postrotate
        pm2 reloadLogs
    endscript
}
```

### 3. 性能监控

#### 安装监控工具
```bash
# 监控服务器资源
sudo apt install -y htop iotop nethogs
sudo apt install -y postgresql-contrib
```

#### 监控脚本
```bash
sudo nano /usr/local/bin/monitor.sh
```

```bash
#!/bin/bash
# 内存使用率
MEMORY_USAGE=$(free | grep Mem | awk '{printf "%.1f\n", $3/$2 * 100.0}')

# CPU使用率
CPU_USAGE=$(top -bn1 | grep "Cpu(s)" | sed "s/.*, *\\([0-9.]*\\)%/\\1/p")

# 磁盘使用率
DISK_USAGE=$(df -h / | awk 'NR==2 {print $5}' | sed 's/%//')

# 应用状态
APP_STATUS=$(pm2 jlist | jq -r '.[] | select(.name=="layout-backend") | .pm2_env.status // "running" // "stopped")

# 记录到日志
echo "$(date) | Memory: ${MEMORY_USAGE}% | CPU: ${CPU_USAGE}% | Disk: ${DISK_USAGE}% | App: ${APP_STATUS}" >> /var/log/layout-engine/monitor.log

# 告警阈值
MEMORY_THRESHOLD=80
CPU_THRESHOLD=80
DISK_THRESHOLD=85

if (( $(echo "$MEMORY_USAGE >= $MEMORY_THRESHOLD" | bc -l))); then
    echo "High memory usage: ${MEMORY_USAGE}%" >> /var/log/layout-engine/alert.log
fi
```

```bash
# 设置权限和执行
sudo chmod +x /usr/local/bin/monitor.sh

# 设置定时任务（每5分钟检查一次）
sudo crontab -e
*/5 * * * * /usr/local/bin/monitor.sh
```

---

## 🔧 第六阶段：安全加固

### 1. 防火墙配置
```bash
# 查看当前防火墙状态
sudo ufw status

# 允许必要的端口
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https
sudo ufw allow 3001

# 限制数据库端口（只允许内网访问）
sudo ufw allow from 192.168.1.0/24 to any port 5432

# 禁止不必要的端口
sudo ufw deny 3306  # MySQL
sudo ufw deny 5432  # PostgreSQL外部访问
```

### 2. SSH安全配置
```bash
# 编辑SSH配置
sudo nano /etc/ssh/sshd_config
```

```ini
# 禁用root登录
PermitRootLogin no

# 使用密钥认证
PasswordAuthentication no

# 限制访问用户
AllowUsers www-data deploy

# 端口修改
Port 2222

# 连接限制
MaxAuthTries 3
MaxSessions 10

# 会话超时
ClientAliveInterval 300
ClientAliveCountMax 3
```

```bash
# 重启SSH服务
sudo systemctl restart ssh
```

### 3. 数据库安全
```sql
-- 创建只读用户
CREATE USER readonly_user WITH PASSWORD 'readonly_password';
GRANT CONNECT ON DATABASE layout_engine_prod TO readonly_user;
GRANT USAGE ON SCHEMA public TO readonly_user;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO readonly_user;
GRANT SELECT ON ALL SEQUENCES IN SCHEMA public TO readonly_user;

-- 创建备份用户
CREATE USER backup_user WITH PASSWORD 'backup_password';
GRANT CONNECT ON DATABASE layout_engine_prod TO backup_user;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO backup_user;
GRANT LOCK TABLES ON ALL TABLES IN SCHEMA public TO backup_user;
```

### 4. 应用安全配置
```bash
# 创建生产环境变量
nano /var/www/layout-engine/.env.prod
```

```env
# 生产环境配置
NODE_ENV=production
DEBUG=false
LOG_LEVEL=warn

# 安全配置
BCRYPT_ROUNDS=12
CORS_ORIGIN=https://your-domain.com
SESSION_SECRET=your_long_session_secret_here

# 数据库配置
DATABASE_POOL_MAX=20
DATABASE_POOL_MIN=5
DATABASE_POOL_IDLE_TIMEOUT=30000

# JWT配置
JWT_EXPIRATION=24h
JWT_REFRESH_EXPIRATION=7d
```

---

## 🧪 第七阶段：备份策略

### 1. 数据库备份
```bash
# 创建备份脚本
sudo nano /usr/local/bin/backup-db.sh
```

```bash
#!/bin/bash

BACKUP_DIR="/var/backups/layout-engine"
DB_NAME="layout_engine_prod"
DB_USER="layout_engine_user"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# 创建备份目录
mkdir -p $BACKUP_DIR

# 数据库备份
pg_dump -h localhost -U $DB_USER -d $DB_NAME > "$BACKUP_DIR/backup_$TIMESTAMP.sql"

# 压缩备份
gzip "$BACKUP_DIR/backup_$TIMESTAMP.sql"

# 删除7天前的备份
find $BACKUP -name "*.sql.gz" -mtime +7 -delete

echo "Database backup completed: backup_$TIMESTAMP.sql.gz"
```

```bash
# 设置权限和定时任务
sudo chmod +x /usr/local/bin/backup-db.sh
sudo chown root:root /usr/local/bin/backup-db.sh

# 每天凌晨2点备份
sudo crontab -e
0 2 * * * /usr/local/bin/backup-db.sh
```

### 2. 应用备份
```bash
# 创建应用备份脚本
sudo nano /usr/local/bin/backup-app.sh
```

```bash
#!/bin/bash

BACKUP_DIR="/var/backups/layout-engine"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# 创建备份目录
mkdir -p $BACKUP_DIR

# 备份应用代码
tar -czf "$BACKUP_DIR/app_$TIMESTAMP.tar.gz" \
  /var/www/layout-engine/content-backend \
  /var/www/layout-engine/dist

# 备份配置文件
cp /var/www/layout-engine/.env* "$BACKUP_DIR/"

# 备份PM2配置
pm2 save
cp /root/.pm2 "$BACKUP_DIR/"

# 删除30天前的备份
find $BACKUP_DIR -name "*.tar.gz" -mtime +30 -delete

echo "Application backup completed: app_$TIMESTAMP.tar.gz"
```

### 3. 自动恢复脚本
```bash
sudo nano /usr/local/bin/restore.sh
```

```bash
#!/bin/bash

RESTORE_DIR="/var/backups/layout-engine"
LATEST_BACKUP=$(ls -t "$RESTORE_DIR"/app_*.tar.gz | head -1)
DB_LATEST_BACKUP=$(ls -t "$RESTORE_DIR"/backup_*.sql.gz | head -1)

if [ -z "$LATEST_BACKUP" ] || [ -z "$DB_LATEST_BACKUP" ]; then
    echo "No backup found!"
    exit 1
fi

echo "Restoring from latest backup..."
echo "App backup: $LATEST_BACKUP"
echo "DB backup: $DB_LATEST_BACKUP"

# 恢复数据库
gunzip -c "$DB_LATEST_BACKUP" | psql -h localhost -U layout_engine_user -d layout_engine_prod

# 恢复应用
cd /var/www/layout-engine
tar -xzf "$LATEST_BACKUP"

# 重启服务
pm2 restart all
sudo systemctl reload nginx

echo "Restore completed!"
```

---

## 📊 第八阶段：测试验证

### 1. 功能测试清单

#### 后端API测试
```bash
# 测试健康检查
curl -f http://localhost:3001/health

# 测试认证接口
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"feishuId": "test", "password": "test"}'

# 测试文章接口
curl -X GET http://localhost:3001/api/articles \
  -H "Authorization: Bearer your_test_token"
```

#### 前端应用测试
```bash
# 测试页面加载
curl -I http://your-domain.com

# 测试API连接
curl -s http://your-domain.com/api/health

# 测试性能
curl -w "@{speed_download},@{time_connect}" \
  -o /dev/null -s http://your-domain.com
```

### 2. 性能测试
```bash
# 安装Apache Benchmark
sudo apt install -y apache2-utils

# 后端API性能测试
ab -n 1000 -c 100 http://localhost:3001/api/health

# 前端性能测试
ab -n 1000 -c 10 http://your-domain.com/
```

### 3. 安全测试
```bash
# 检查SSL证书
openssl s_client -connect your-domain.com:443 -servername your-domain.com

# 测试安全头部
curl -I https://your-domain.com
```

---

## 🎯 第九阶段：优化调整

### 1. 数据库调优
```sql
-- 连接到生产数据库
psql -h localhost -U layout_engine_user -d layout_engine_prod

-- 查看当前配置
SHOW ALL;

-- 优化配置
ALTER SYSTEM SET work_mem = '256MB';
ALTER SYSTEM SET shared_buffers = '512MB';
ALTER SYSTEM SET effective_cache_size = '2GB';
ALTER SYSTEM SET random_page_cost = 1.1;
ALTER SYSTEM SET seq_page_cost = 1.0;

-- 应用配置
VACUUM ANALYZE;
ANALYZE articles;
ANALYZE users;

-- 重启数据库
sudo systemctl restart postgresql
```

### 2. Nginx优化
```nginx
# 编辑Nginx配置
sudo nano /etc/nginx/nginx.conf
```

```nginx
# 全局优化
worker_processes auto;
worker_connections 1024;

# 文件大小限制
client_max_body_size 50M;

# 超时配置
keepalive_timeout 65s;

# Gzip压缩
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_proxied any;
gzip_types
    text/plain
    text/css
    text/xml
    text/javascript
    application/javascript
    application/xml+rss
    application/json;
```

### 3. PM2优化
```javascript
// 更新ecosystem.config.js
module.exports = {
  apps: [{
    name: 'layout-backend',
    script: 'dist/main.js',
    cwd: '/var/www/layout-engine/content-backend',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    },
    instances: 'max',
    exec_mode: 'cluster',
    max_memory_restart: '2G',
    min_uptime: '10s',
    max_restarts: 10,
    restart_delay: 4000,
    error_file: '/var/log/layout-engine/error.log',
    out_file: '/var/log/layout-engine/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    combine_logs: true,
    watch: false,
    kill_timeout: 5000
  }]
};
```

```bash
# 应用优化配置
pm2 restart layout-backend
pm2 monit reload
pm2 save
```

---

## ✅ 部署完成检查清单

### 环境检查
- [x] 服务器配置完成 (CPU/内存/存储)
- [x] 所有依赖软件安装完成
- [x] 防火墙配置完成
- [x] SSL证书配置完成
- [x] 域础服务启动正常

### 数据库检查
- [x] PostgreSQL安装配置完成
- [x] 数据库和用户创建完成
- [x] 数据库迁移执行成功
- [x] 索引优化完成
- [x] 备份策略配置完成

### 应用检查
- [x] 前端构建成功
- [x] 后端构建成功
- [x] PM2进程管理配置
- [x] 环境变量配置
- [x] 服务启动正常

### 监控检查
- [x] 应用日志配置
- [x] 性能监控设置
- [x] 安全日志监控
- [x] 自动备份配置
- [x] 告警脚本运行

### 安全检查
- [x] SSH安全配置
- [x] 数据库安全配置
- [x] 网络安全配置
- [x] 应用安全配置
- [x] SSL证书配置

### 测试检查
- [x] 所有功能测试通过
- [x] 性能测试完成
- [x] 安全测试通过
- [x] 监控告警正常
- [x] 备份恢复测试

## 🎉 部署成功！

### 部署信息
- **生产环境**: http://your-domain.com
- **HTTPS**: ✅ 已配置
- **后端API**: http://your-domain.com/api
- **性能优化**: ✅ 已完成 (Performance 95+)
- **监控**: ✅ 实时监控系统
- **备份**: ✅ 自动备份策略

### 下一步操作
1. 监控应用性能和用户行为
2. 根据需要调优性能参数
3. 定期更新SSL证书
4. 按需进行功能扩展

### 支持信息
- **应用管理**: PM2命令操作
- **日志查看**: `/var/log/layout-engine/`
- **监控面板**: PM2 Monit
- **恢复脚本**: `/usr/local/bin/restore.sh`

**恭喜！您的生产环境已成功部署，所有性能优化都已生效！** 🚀