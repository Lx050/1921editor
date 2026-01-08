# Docker 部署指南

## 部署概览

- **应用**: paiban (前端 + 后端 + PostgreSQL)
- **域名**: paiban.lx05.art
- **服务器**: 101.42.158.32 (CentOS Stream 9)
- **部署路径**: /root/paiban

## 架构说明

```
┌─────────────────────────────────────────────────┐
│              Host Nginx (80/443)                │
│         paiban.lx05.art → 127.0.0.1:1922        │
└─────────────────┬───────────────────────────────┘
                  │
        ┌─────────▼──────────┐
        │  Frontend (Docker) │
        │  Nginx + Vue 3     │
        │  127.0.0.1:1922    │
        └────────────────────┘
                  │
        ┌─────────▼──────────┐
        │  Backend (Docker)  │
        │  NestJS + TypeORM  │
        │  Port 3001         │
        └─────────┬──────────┘
                  │
        ┌─────────▼──────────┐
        │  PostgreSQL        │
        │  Port 5432         │
        └────────────────────┘
```

## 部署步骤

### 1. 服务器环境准备

```bash
# 安装 Docker (CentOS Stream 9)
dnf install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
systemctl enable --now docker

# 配置镜像加速
cat > /etc/docker/daemon.json <<EOF
{
  "registry-mirrors": [
    "https://docker.m.daocloud.io",
    "https://docker.nju.edu.cn"
  ]
}
EOF

systemctl restart docker
```

### 2. 上传代码

```bash
# 本地打包
tar -czf paiban.tar.gz \
  --exclude=node_modules \
  --exclude=dist \
  --exclude=.git \
  .

# 上传到服务器
scp paiban.tar.gz root@101.42.158.32:/root/

# 服务器上解压
cd /root
mkdir -p paiban
tar -xzf paiban.tar.gz -C paiban
```

### 3. 配置环境变量

```bash
cd /root/paiban
cp .env.example .env
nano .env
```

关键配置项：
```env
# 数据库
DB_HOST=db
DB_PORT=5432
DB_USERNAME=paiban_user
DB_PASSWORD=your_secure_password
DB_DATABASE=paiban

# JWT
JWT_SECRET=your_jwt_secret_min_32_chars

# 微信公众号
WECHAT_APP_ID=your_app_id
WECHAT_APP_SECRET=your_app_secret

# 前端 URL
FRONTEND_URL=http://paiban.lx05.art
```

### 4. 配置 Host Nginx

```bash
cat > /etc/nginx/conf.d/paiban.lx05.art.conf <<'EOF'
server {
    listen 80;
    server_name paiban.lx05.art;

    location / {
        proxy_pass http://127.0.0.1:1922;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

nginx -t && nginx -s reload
```

### 5. 启动服务

```bash
cd /root/paiban

# 构建并启动
docker compose up -d --build

# 运行数据库迁移
docker compose run --rm backend npm run migration:run

# 查看服务状态
docker compose ps
docker compose logs -f backend
```

### 6. 验证部署

```bash
# 检查前端
curl -I http://127.0.0.1:1922

# 检查外部访问
curl -I http://paiban.lx05.art

# 检查后端健康状态
docker compose exec backend curl http://localhost:3001/health
```

## 更新部署

```bash
cd /root/paiban

# 1. 拉取最新代码
git pull

# 2. 更新环境变量（如需要）
nano .env

# 3. 重新构建并启动
docker compose build --no-cache backend
docker compose up -d --build

# 4. 运行迁移
docker compose run --rm backend npm run migration:run

# 5. 验证
docker compose ps
docker compose logs --tail=50 backend
```

## 常用命令

```bash
# 查看服务状态
docker compose ps

# 查看日志
docker compose logs -f [frontend|backend|db]

# 重启服务
docker compose restart [frontend|backend|db]

# 停止服务
docker compose down

# 进入容器
docker compose exec backend sh
docker compose exec db psql -U paiban_user -d paiban

# 备份数据库
docker compose exec db pg_dump -U paiban_user paiban > backup.sql

# 恢复数据库
docker compose exec -T db psql -U paiban_user paiban < backup.sql
```

## 故障排查

### 前端无法访问

```bash
# 检查容器状态
docker compose ps frontend

# 检查容器日志
docker compose logs frontend

# 检查 Nginx 配置
docker compose exec frontend nginx -t

# 进入容器调试
docker compose exec frontend sh
```

### 后端启动失败

```bash
# 查看详细日志
docker compose logs backend

# 检查数据库连接
docker compose exec backend npm run migration:show

# 检查环境变量
docker compose exec backend env | grep DB_
```

### 数据库问题

```bash
# 连接数据库
docker compose exec db psql -U paiban_user -d paiban

# 检查表结构
\dt

# 检查迁移记录
SELECT * FROM migrations;

# 手动运行迁移
docker compose run --rm backend npm run migration:run
```

## 回滚策略

```bash
# 1. 停止当前服务
docker compose down

# 2. 恢复备份代码
cd /root
mv paiban paiban-failed
mv paiban-backup paiban

# 3. 重新启动
cd paiban
docker compose up -d

# 4. 恢复数据库（如需要）
docker compose exec -T db psql -U paiban_user paiban < backup.sql
```

## 维护建议

1. **定期备份** - 每天自动备份数据库
2. **日志轮转** - 防止日志文件过大
3. **监控告警** - 配置服务监控和告警
4. **安全更新** - 定期更新系统和 Docker 镜像

## 端口映射

| 服务 | 容器内端口 | 主机端口 | 说明 |
|------|-----------|---------|------|
| Frontend | 80 | 127.0.0.1:1922 | 仅本地访问 |
| Backend | 3001 | - | Docker 内部网络 |
| PostgreSQL | 5432 | 5433 | 开发调试用 |

## 目录权限

```bash
# 确保上传目录可写
mkdir -p content-backend/uploads
chmod 755 content-backend/uploads

# 日志目录
mkdir -p content-backend/logs
chmod 755 content-backend/logs
```
