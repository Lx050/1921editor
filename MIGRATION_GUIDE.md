# 1921Editor 一键迁移与备份指南

本项目已实现“基础设施即代码”，通过以下步骤，你可以在 5 分钟内将整个服务（包含所有数据）迁移到新服务器。

## 1. 核心原理
- **GitHub Secrets 控制中心**: 服务器地址、密钥、证书路径等均由 GitHub Actions 驱动。
- **Docker 卷持久化**: 数据库数据存储在名为 `paiban_postgres_data` 的 Docker 卷中。
- **自动化 Nginx**: CI 流程会自动识别服务器 IP 并生成/加载对应的 Nginx 配置。

## 2. 导出数据（原服务器）
在旧服务器上运行以下命令，导出数据库镜像：
```bash
docker exec paiban-db-1 pg_dump -U paiban_admin paiban_prod > backup.sql
```
并导出上传的媒体文件：
```bash
tar -czvf uploads.tar.gz /opt/1921editor/content-backend/uploads
```

## 3. 导入数据（新服务器）
1. 在新服务器创建目录：`mkdir -p /opt/1921editor`
2. 将 `backup.sql` 和 `uploads.tar.gz` 传输到新服务器。
3. 执行恢复（在启动容器后）：
```bash
cat backup.sql | docker exec -i paiban-db-1 psql -U paiban_admin paiban_prod
```

## 4. GitHub 环境切换
1. 进入 GitHub 仓库 `Settings -> Secrets and variables -> Actions`。
2. **更新变量**:
   - `REMOTE_HOST`: 修改为 **新服务器 IP**。
   - `ENV_FILE`: 粘贴你最新的 `.env` 文件内容（CI 会自动将其分发到新服务器）。
   - `SERVER_SSH_KEY`: 如果更换了密钥，请在此更新。
3. **点击 Run Workflow**: 自动安装 Nginx 规则、重建环境变量、同步前端、启动后端。

---

> [!TIP]
> 只要保持 GitHub 上的证书和 IP 是最新的，你的域名 `paiban.lx05.art` 只需在 DNS 处修改指向，即可完成无缝迁移。
