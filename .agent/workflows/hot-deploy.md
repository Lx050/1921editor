---
description: 极速热重载部署：本地构建并仅同步编译后产物到服务器，实现秒级热更新。
---

此工作流绕过服务器端的 Docker Build，通过本地构建产物同步实现极速更新。适用于纯逻辑和 UI 修改。

## 执行流程

### 阶段 1：本地极速构建
// turbo
1. **执行前端构建**
   ```powershell
   npm run build
   ```
   本地高性能编译 Vue 产物到 `dist/`

// turbo
2. **执行后端构建**
   ```powershell
   cd content-backend; npm run build; cd ..
   ```
   本地编译 NestJS 产物到 `content-backend/dist/`

### 阶段 2：产物精简打包
// turbo
3. **打包编译产物**
   ```powershell
   tar -czf hot-dist.tar.gz src/dist/ content-backend/dist/ content-backend/package.json
   ```
   仅包含运行必需的静态资源和 JS 脚本

### 阶段 3：增量上传与同步
// turbo
4. **上传到服务器**
   ```powershell
   scp -o StrictHostKeyChecking=no -i "C:/Users/Lx050/Desktop/排版/paiban.pem" hot-dist.tar.gz root@101.42.158.32:/root/
   ```

// turbo
5. **远程热重载替换**
   ```powershell
   ssh -o StrictHostKeyChecking=no -i "C:/Users/Lx050/Desktop/排版/paiban.pem" root@101.42.158.32 "cd /root/paiban && tar -xzf /root/hot-dist.tar.gz -C . && docker compose restart frontend backend && echo '✨ 热更新部署完成！'"
   ```

### 阶段 4：清理
// turbo
6. **清理本地临时包**
   ```powershell
   rm hot-dist.tar.gz
   ```

## 注意事项
1. **依赖变更**：如果修改了 `package.json` 中的新依赖，请使用 `/deploy-app` 进行全量 Docker 构建。
2. **环境配置**：如果修改了 `.env`，建议使用 `/deploy-app` 以确保各容器镜像同步更新。
3. **适用场景**：日常功能逻辑修复、UI 样式调整。
