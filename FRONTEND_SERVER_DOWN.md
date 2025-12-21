# 🔴 前端开发服务器故障

## 问题

- **错误**: HTTP 500 / 404
- **页面**: `http://localhost:1921/tenant-select`
- **原因**: Vite开发服务器可能已崩溃

## 立即修复

### 方法 1: 重启前端服务器

1. 在运行前端的Terminal窗口中:
   - 按 `Ctrl + C` 停止服务器
   - 等待完全停止
   - 运行 `npm run dev`

2. 等待看到：
   ```
   VITE v4.x.x  ready in xxx ms

   ➜  Local:   http://localhost:1921/
   ➜  Network: use --host to expose
   ```

3. 然后访问 `http://localhost:1921`

### 方法 2: 检查前端错误

可能的原因：
1. TenantSelect.vue 有运行时错误
2. Vite配置问题
3. 端口被占用

### 检查步骤

1. **查看前端Terminal** - 是否有错误信息
2. **查看浏览器Console** - 是否有JavaScript错误
3. **检查端口** - 1921端口是否被占用

```powershell
# 检查端口
Get-NetTCPConnection -LocalPort 1921 -ErrorAction SilentlyContinue
```

---

## 🚨 重要提醒

**不要继续测试飞书登录**，直到前端服务器恢复正常！

否则即使后端登录成功，也会因为前端500错误而无法完成流程。

---

## ✅ 修复后的测试步骤

1. **确认前端运行正常**
   - 访问 `http://localhost:1921` 
   - 应该能看到首页

2. **清除缓存**
   ```javascript
   localStorage.clear()
   sessionStorage.clear()
   location.reload()
   ```

3. **测试登录**
   - 点击"飞书登录"
   - 查看后端Terminal日志

---

**现在请重启前端开发服务器！**

---

**创建时间**: 2025-12-21 03:08  
**状态**: 前端服务器故障，需要重启
