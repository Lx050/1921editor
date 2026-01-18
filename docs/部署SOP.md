# Layout Engine 部署SOP

## 概述

本文档记录了 Layout Engine 项目从本地构建到服务器部署的完整操作流程（Standard Operating Procedure）。

## 服务器信息

- **服务器地址**: 101.42.158.32
- **SSH密钥**: `C:/Users/Lx050/Desktop/排版/paiban.pem`
- **用户**: root
- **项目目录**: `/root/paiban`
- **服务运行目录**: Docker 容器内 Nginx
- **服务端口**: 1922 (宿主) -> 80 (容器)
- **域名**: http://paiban.lx05.art
- **部署方式**: Docker Compose

## 当前生产环境（Docker）

### 关键文件
- **后端运行期配置**: `/root/paiban/.env`
- **前端构建期配置**: `/root/paiban/.env.production`
- **Nginx 配置（容器内）**: `nginx.conf`
- **Compose 配置**: `docker-compose.yml`

### 微信模式说明（当前默认）
- **直连模式**: 直接使用租户的 `wechatAppId/wechatAppSecret`（后台“公众号管理”填写并邮箱确认）。
- **第三方授权**: 需要企业认证的微信开放平台 `component_appid/component_appsecret`；未配置时不会影响直连模式。

## Docker 部署/更新流程（推荐）

### 1. 本地准备（构建期变量）
```bash
# 修改 .env.production（前端构建期变量）
VITE_APP_DOMAIN=http://paiban.lx05.art
VITE_WECHAT_OPEN_APP_ID=REPLACE_ME
```

注意：
- **前端变量必须在构建时注入**：修改 `.env.production` 或 `.env` 后必须重建前端容器。
- **稳定性配置**：涉及超时限制（如 `VITE_API_TIMEOUT`）必须在打包前确认，否则构建出来的静态包会保持旧值。
- **打包前置检查**：**强烈建议**在打包前本地运行 `npm run type-check`（前端）和后端编译检查。不要尝试把 TypeScript 错误带到服务器解决。

### 2. 上传代码到服务器
推荐方式：
- 若服务器目录是 git 仓库：`git pull`
- 若非仓库：打包上传并解压覆盖（见“打包上传示例”）

打包上传示例（在本地 WSL/Git Bash 中）：
```bash
# Windows 用户请在 PowerShell 中确保路径正确，推荐使用相对路径
tar -czf paiban.tar.gz \
  --exclude=node_modules \
  --exclude=dist \
  --exclude=.git \
  --exclude=.env \
  --exclude=content-backend/node_modules \
  --exclude=content-backend/dist \
  .

# 💡 技巧：打包后检查大小，若超过 50MB 说明排除了多余资源（如 uploads）
scp -i "C:/Users/Lx050/Desktop/排版/paiban.pem" paiban.tar.gz root@101.42.158.32:/root/
```

服务器解压与覆盖：
```bash
cd /root
timestamp=$(date +%Y%m%d_%H%M%S)
mkdir -p paiban_backup_$timestamp
cp /root/paiban/.env paiban_backup_$timestamp/ || true
cp -r /root/paiban/content-backend/uploads paiban_backup_$timestamp/ || true
cp -r /root/paiban/content-backend/logs paiban_backup_$timestamp/ || true

rm -rf /root/paiban
mkdir -p /root/paiban
tar -xzf /root/paiban.tar.gz -C /root/paiban

cp /root/paiban_backup_$timestamp/.env /root/paiban/.env
mkdir -p /root/paiban/content-backend
cp -r /root/paiban_backup_$timestamp/uploads /root/paiban/content-backend/ || true
cp -r /root/paiban_backup_$timestamp/logs /root/paiban/content-backend/ || true
```

### 3. 构建并启动容器
```bash
cd /root/paiban
docker compose build frontend backend
docker compose up -d frontend backend
```

### 4. 数据库迁移（如有）
```bash
cd /root/paiban
docker compose run --rm backend npm run migration:run
```

### 5. 检查状态
```bash
docker compose ps
```

## 直连模式配置与验证

1. 登录系统 → 公众号管理  
2. 申请修改密钥（AppID/AppSecret）→ 邮箱确认  
3. 上传图片 / 创建草稿测试  

> 若租户未配置 AppID/Secret，将提示“该租户未授权微信公众号”。

## 常见注意事项（Docker）

1. **前端变量不生效**：
   - 修改 `.env.production` 后必须重建前端容器。
2. **后端变量不生效**：
   - 修改 `/root/paiban/.env` 后需重建 backend 容器。
3. **回滚**：
   - 使用 `/root/paiban_backup_YYYYMMDD_HHMMSS` 恢复 `.env/uploads/logs`。
4. **紧急强制构建**：
   - 如果代码修改了但容器表现仍像旧版，使用 `--no-cache`：
     `docker compose build --no-cache backend frontend`
5. **实时日志观察（Token 锁诊断）**：
   - 查看后端是否在正常工作或排队刷新 Token：
     `docker logs --tail 100 -f paiban-backend-1`
6. **清理**：
   - 部署成功后，记得删除本地的 `paiban.tar.gz` 节省硬盘空间。

---

## 终端环境与编码注意事项（避坑指南）

在执行上述部署命令（特别是 `tar`、`scp` 或涉及内容修改的脚本）时，请务必关注以下技术细节：

### 1. 路径编码陷阱
- **问题描述**: 当项目所在文件夹（如 `C:\Users\Lx050\Desktop\排版`）包含中文字符时，传统的 `tar` 命令行工具或 AI 自动修改工具可能因编码（GBK vs UTF-8）不一致而找不到文件。
- **对策**: 
    - 运行命令前，确保终端（CMD/PowerShell）已进入项目根目录。
    - 在脚本中尽可能使用相对路径（`.`），避免显式书写中文字符路径。

### 2. PowerShell 与 Bash 命令差异
- **问题描述**: Windows PowerShell 默认不支持 `head`、`tail` (非别名情况下) 或 `grep` 等 Linux 标准工具。
- **对策**: 
    - 查看前 N 行：`Get-Content file.ts -TotalCount 20`
    - 查看末尾：`Get-Content file.ts -Tail 20`
    - 搜索：`Select-String "pattern" file.ts`

### 3. 代码修改中的“不可见字符”
- **问题描述**: 中文注释（如 `// 提升并发数`）中可能包含特殊的空格（如 `\u00A0`）或编码格式。直接进行字符串替换时，若匹配字符串不完全一致（即使肉眼看着一样），也会导致“Target content not found”错误。
- **对策**: 
    - 批量修改时，如果涉及中文注释行，优先删除受影响的行并重新插入，或者仅匹配纯英文字符部分。

### 4. 转义字符与 Shell 注入
- **问题描述**: 在通过 `ssh` 连接执行带 `"` 或 `$` 的复杂命令时，本地 Shell 可能会提前解析这些符号。
- **对策**: 
    - 在 `ssh` 命令后的远程脚本部分，务必使用双引号封装整个命令块，或者使用 `-<< 'EOF'` 方式进行多行输入，防止变量在本地被转义。

## 旧版部署流程（PM2，已弃用）

## 部署流程

### 1. 本地构建

```bash
# 在项目根目录执行
npm run build
```

构建输出说明：
- 构建产物位于 `src/dist` 目录（因 vite.config.js 中设置了 `root: './src'`）
- 构建完成后会生成带哈希值的文件名，用于缓存更新

### 2. 上传到服务器

```bash
# 使用scp上传dist目录到服务器
scp -o StrictHostKeyChecking=no -i "C:/Users/Lx050/Desktop/排版/paiban.pem" -r src/dist root@101.42.158.32:/root/layout-engine/
```

### 3. 更新服务器文件

```bash
# 通过SSH连接服务器
ssh -o StrictHostKeyChecking=no -i "C:/Users/Lx050/Desktop/排版/paiban.pem" root@101.42.158.32

# 清理旧文件并复制新文件
rm -rf /var/www/layout-engine/*
cp -r /root/layout-engine/dist/* /var/www/layout-engine/

# 设置正确的文件权限
chown -R nginx:nginx /var/www/layout-engine/
```

### 4. 重启服务

```bash
# 重启PM2服务
pm2 restart layout-engine

# 查看服务状态
pm2 list

# 查看服务日志（可选）
pm2 logs layout-engine --lines 10
```

## Nginx配置

配置文件位置：`/etc/nginx/conf.d/lx05.art.conf`

```nginx
# 子域名 - 排版工程
server {
    listen 80;
    server_name layout.lx05.art;
    client_max_body_size 10M;

    # API请求代理到微信服务器
    location /wechat-api/ {
        proxy_pass https://api.weixin.qq.com/;
        proxy_set_header Host api.weixin.qq.com;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_ssl_server_name on;
        proxy_ssl_verify off;
    }

    # 其他请求转发到layout engine服务
    location / {
        proxy_pass http://127.0.0.1:1921;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## PM2配置

查看PM2管理的应用：
```bash
pm2 list
```

常用PM2命令：
```bash
# 启动服务
pm2 start <app_name>

# 停止服务
pm2 stop <app_name>

# 重启服务
pm2 restart <app_name>

# 查看日志
pm2 logs <app_name>

# 查看实时日志
pm2 logs <app_name> --lines 0

# 更新PM2（当提示版本不匹配时）
pm2 update
```

## 快速部署命令汇总

```bash
# 1. 本地构建
npm run build

# 2. 上传dist
scp -o StrictHostKeyChecking=no -i "C:/Users/Lx050/Desktop/排版/paiban.pem" -r src/dist root@101.42.158.32:/root/layout-engine/

# 3. 更新服务器文件（一步到位）
ssh -o StrictHostKeyChecking=no -i "C:/Users/Lx050/Desktop/排版/paiban.pem" root@101.42.158.32 "rm -rf /var/www/layout-engine/* && cp -r /root/layout-engine/dist/* /var/www/layout-engine/ && chown -R nginx:nginx /var/www/layout-engine/"

# 4. 重启服务
ssh -o StrictHostKeyChecking=no -i "C:/Users/Lx050/Desktop/排版/paiban.pem" root@101.42.158.32 "pm2 restart layout-engine"
```

## 注意事项

1. **vite配置特殊性**:
   - 由于 `vite.config.js` 中设置了 `root: './src'`，构建产物在 `src/dist` 而非项目根目录的 `dist`

2. **文件权限**:
   - 确保上传后的文件所有者为 `nginx:nginx`，避免权限问题

3. **服务目录**:
   - 实际服务运行在 `/var/www/layout-engine`，而非 `/root/layout-engine`

4. **PM2版本**:
   - 如遇到 PM2 版本不匹配提示，可执行 `pm2 update` 更新

5. **备份建议**:
   - 在部署前可以备份旧版本：
   ```bash
   cp -r /var/www/layout-engine /var/www/layout-engine.bak.$(date +%Y%m%d_%H%M%S)
   ```

6. **故障排查**:
   - 查看服务日志：`pm2 logs layout-engine`
   - 查看Nginx错误日志：`tail -f /var/log/nginx/error.log`
   - 检查端口占用：`netstat -tlnp | grep 1921`

## 部署历史

| 部署时间 | 操作人 | 版本 | 备注 |
|---------|--------|------|------|
| 2024-12-09 23:57 | Claude | v1.0 | 初始部署 |
| 2024-12-10 18:22 | Claude | v1.1 | 更新dist，修复构建路径问题 |
| 2024-12-10 18:32 | Claude | v1.2 | 重新构建并部署，文件哈希更新 |
| 2024-12-10 21:28 | Claude | v1.3 | 更新dist部署（CSS: e0d8bce3, JS: bec26c73） |
| 2024-12-10 22:32 | Claude | v1.4 | 重新构建并部署（CSS: eae2ac98, JS: 474ca241） |

## 联系方式

如有部署相关问题，请联系：
- 技术支持：[在此处填写联系方式]
