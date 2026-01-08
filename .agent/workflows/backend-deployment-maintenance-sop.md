---
name: backend-deployment-maintenance-sop
description: 后端 NestJS + PostgreSQL 服务部署与日常运维 SOP。涵盖环境搭建、PM2 进程管理、备份与监控。
---

# 后端部署与运维 SOP

## 1. 环境初始化

**执行命令：**
```bash
# 安装基础依赖
sudo apt update && sudo apt install -y nodejs npm postgresql pm2
# 初始化数据库
sudo -u postgres psql -c "CREATE DATABASE content_db;"
```

---

## 2. 生产部署工作流

1. **配置环境变量**: 创建 `.env` 文件，包含 `DATABASE_URL`, `FEISHU_APP_ID`, `WECHAT_COMP_SECRET` 等。
2. **构建与启动**:
   ```bash
   cd content-backend
   npm install
   npm run build
   pm2 start dist/main.js --name "layout-backend"
   pm2 save
   ```

---

## 3. 自动化备份与监控 (Maintenance)

**磁盘监控**:
设定 crontab 每小时检查 `uploads/` 目录大小，防止磁盘溢出。

**数据库备份**:
```bash
# 每日凌晨 2 点全量备份
pg_dump content_db > /backup/db_$(date +%F).sql
```

**日志滚动**:
配置 `pm2-logrotate` 插件，防止单个日志文件超过 100MB。

---

## 相关 Skills 协作
- **代码质量**: 合并前必须通过 `.agent/workflows/git-merge-to-develop.md`。
- **Lint 检查**: 详见 `.agent/workflows/nestjs-code-review.md`。

## 参考文献 (References)
- **文档**: `docs/部署SOP.md`
- **文档**: `docs/后端部署SOP.md`
- **脚本**: `content-backend/ecosystem.config.js`
