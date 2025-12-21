# 🔴 后端服务器未运行

## 问题诊断

```
前端代理错误: ECONNREFUSED at /api/auth/feishu/login
后端测试: 无响应
后端Terminal: 无输出
```

**结论**: 后端NestJS服务器没有正常运行！

---

## 原因分析

可能的原因：
1. 后端在代码修改后崩溃
2. 数据库连接失败
3. TypeScript编译错误导致无法启动
4. TenantModule初始化失败

---

## ⚡ 立即修复

### 步骤 1: 停止后端

在运行 `npm run start:dev` 的Terminal中：
```
按 Ctrl + C
```

### 步骤 2: 清理并重新启动

```bash
cd content-backend

# 清理旧的编译文件
rm -rf dist

# 重新编译
npm run build

# 如果编译成功，启动开发服务器
npm run start:dev
```

### 步骤 3: 查看输出

启动后应该看到：
```
[Nest] xxx  - 2025/12/21 03:11:00     LOG [NestFactory] Starting Nest application...
[Nest] xxx  - 2025/12/21 03:11:00     LOG [InstanceLoader] AppModule dependencies initialized
[Nest] xxx  - 2025/12/21 03:11:00     LOG [InstanceLoader] TypeOrmModule dependencies initialized
[Nest] xxx  - 2025/12/21 03:11:00     LOG [InstanceLoader] TenantModule dependencies initialized
...
[Nest] xxx  - 2025/12/21 03:11:01     LOG [RoutesResolver] Mapped {/api/auth/feishu/login, GET} route
...
[Nest] xxx  - 2025/12/21 03:11:01     LOG [NestApplication] Nest application successfully started
[Nest] xxx  - 2025/12/21 03:11:01     LOG [Bootstrap] Application is running on: http://localhost:3001
[Nest] xxx  - 2025/12-21 03:11:01     LOG [Bootstrap] CORS enabled for origins: http://localhost:1921, ...
```

如果看到错误，请把**完整的错误信息**发给我！

---

## 🔍 常见错误及解决方案

### 错误 A: 数据库连接失败

```
Error: connect ECONNREFUSED 127.0.0.1:5433
```

**解决**: 
- 检查PostgreSQL是否运行
- 检查 `.env` 中的 `DATABASE_URL`

### 错误 B: TenantModule初始化失败

```
Error: Cannot find module './tenant/tenant.entity'
```

**解决**:
- 确保迁移已运行
- 检查 `tenants` 表是否存在

### 错误 C: 端口被占用

```
Error: listen EADDRINUSE: address already in use :::3001
```

**解决**:
```powershell
# 查找占用端口的进程
Get-NetTCPConnection -LocalPort 3001 | Select-Object OwningProcess
# 结束进程
Stop-Process -Id <ProcessId> -Force
```

---

## 📝 验证后端启动成功

运行以下命令测试：

```powershell
Invoke-WebRequest -Uri "http://localhost:3001/api/auth/feishu/login" -UseBasicParsing
```

应该返回：
- **状态码 302** (重定向到飞书)
- 或 **状态码 200** (飞书授权页面)

---

## ✅ 后端启动成功后

1. **前端代理错误会消失**
2. **可以正常访问** `http://localhost:1921`
3. **可以测试飞书登录**

---

**现在请：**
1. 停止后端 (Ctrl+C)
2. 运行 `npm run build` 检查编译
3. 运行 `npm run start:dev` 重新启动
4. 把启动过程的**所有输出**发给我

如果有错误，我会帮你修复！

---

**创建时间**: 2025-12-21 03:11  
**状态**: 后端未运行，需要重启
