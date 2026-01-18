---
description: 自动化构建与部署 Layout Engine 到生产服务器（Docker 模式）
---

此工作流基于团队 2026-01-10 的部署复盘总结，专门针对 Windows 开发环境与 Linux 服务器的兼容性进行了优化。

// turbo
1. **本地环境体检**
   在打包前确保代码无类型错误，避免废包上云：
   ```powershell
   npm run type-check
   ```

2. **本地打包 (自动排除冗余)**
   // turbo
   在项目根目录下执行打包，排除开发依赖与数据：
   ```powershell
   tar -czf paiban.tar.gz --exclude=node_modules --exclude=dist --exclude=.git --exclude=.env --exclude=content-backend/node_modules --exclude=content-backend/dist .
   ```

3. **上传到服务器**
   // turbo
   通过 SSH 密钥将包传输至 root 目录：
   ```powershell
   scp -o StrictHostKeyChecking=no -i "C:/Users/Lx050/Desktop/排版/paiban.pem" paiban.tar.gz root@101.42.158.32:/root/
   ```

4. **服务器自动化解包与重启**
   // turbo
   通过 SSH 执行解包、配置恢复与容器重建逻辑（PowerShell 兼容的单行命令）：
   ```powershell
   ssh -o StrictHostKeyChecking=no -i "C:/Users/Lx050/Desktop/排版/paiban.pem" root@101.42.158.32 "timestamp=\$(date +%Y%m%d_%H%M%S) && mkdir -p /root/paiban_backup_\$timestamp && cp /root/paiban/.env /root/paiban_backup_\$timestamp/ 2>/dev/null || true && rm -rf /root/paiban && mkdir -p /root/paiban && tar -xzf /root/paiban.tar.gz -C /root/paiban && cp /root/paiban_backup_\$timestamp/.env /root/paiban/.env && cd /root/paiban && docker compose build --no-cache backend frontend && docker compose up -d backend frontend && docker compose ps && echo '部署完成!'"
   ```

5. **清理本地废包**
   // turbo
   部署成功后清理本地压缩包：
   ```powershell
   rm paiban.tar.gz
   ```

6. **查看实时日志 (可选)**
   查看后端服务运行状态（过滤微信 API 调用）：
   ```powershell
   ssh -o StrictHostKeyChecking=no -i "C:/Users/Lx050/Desktop/排版/paiban.pem" root@101.42.158.32 'docker logs --tail 50 -f paiban-backend-1'
   ```
