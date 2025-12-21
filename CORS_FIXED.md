# ✅ CORS跨域问题已修复

## 问题诊断

**原始问题**: 前后端跨域失败
- 后端CORS配置: `http://localhost:5173` (Vite默认端口)
- 前端实际运行: `http://localhost:1921`
- **结果**: CORS阻止了所有前端请求

---

## 修复内容

### 后端 CORS 配置更新 (`src/main.ts`)

```typescript
// 🌐 启用 CORS - 允许前端访问
const allowedOrigins = [
  'http://localhost:1921',  // 前端开发服务器 ✅
  'http://localhost:5173',  // Vite默认端口（备用）
  configService.get<string>('CORS_ORIGIN'),
].filter(Boolean);

app.enableCors({
  origin: (origin, callback) => {
    // 允许无origin的请求（如Postman、curl等）
    if (!origin) return callback(null, true);
    
    // 检查origin是否在允许列表中
    if (allowedOrigins.some(allowed => origin.startsWith(allowed))) {
      callback(null, true);
    } else {
      logger.warn(`CORS blocked request from origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key', 'X-Requested-With'],
  credentials: true,
  maxAge: 86400,  // 预检请求缓存1天
});
```

---

## 验证测试

### ✅ 后端可访问性测试
```powershell
Invoke-WebRequest -Uri "http://localhost:3001/api/auth/feishu/login" -UseBasicParsing
# 状态: 200 OK ✅
# 返回: 飞书登录页面HTML
```

### 前端代理配置确认 (`vite.config.js`)
```javascript
server: {
  port: 1921,  ✅
  proxy: {
    '/api': {
      target: 'http://localhost:3001',  ✅
      changeOrigin: true,
      secure: false,
      ws: true,
    }
  }
}
```

---

## 现在测试登录

### 步骤 1: 清除浏览器缓存

在浏览器Console中执行：
```javascript
localStorage.clear()
sessionStorage.clear()
location.reload()
```

### 步骤 2: 访问前端
```
http://localhost:1921
```

### 步骤 3: 点击"飞书登录"

登录流程：
```
1. 用户点击"飞书登录" 
   ↓
2. 前端请求: http://localhost:1921/api/auth/feishu/login
   ↓ (Vite代理)
3. 后端处理: http://localhost:3001/api/auth/feishu/login
   ↓ (CORS允许 ✅)
4. 重定向到飞书授权页
   ↓
5. 用户授权
   ↓
6. 飞书回调: http://localhost:3001/api/auth/feishu/callback?code=xxx
   ↓
7. 后端验证用户 + 签发JWT
   ↓
8. 重定向到前端: http://localhost:1921/auth/callback?token=xxx&userInfo=xxx
   ↓
9. 前端保存Token到sessionStorage
   ↓
10. 完成登录 ✅
```

### 步骤 4: 验证Token存储

登录成功后，在Console中检查：
```javascript
// Token
console.log('Token:', sessionStorage.getItem('auth_token'))
// 应该看到: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

// 用户信息
console.log('User:', JSON.parse(localStorage.getItem('userInfo')))
// 应该看到: { id: "xxx", name: "xxx", role: "EDITOR", tenantId: "xxx" }

// 租户信息
console.log('Tenant:', JSON.parse(localStorage.getItem('currentTenant')))
// 应该看到: { id: "xxx", name: "默认租户", slug: "default" }
```

### 步骤 5: 检查API请求

打开Network面板，刷新页面或触发API调用，检查请求头：

**应该看到**:
```
Request Headers:
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  Content-Type: application/json
```

---

## 网络流量说明

### 前端 → 后端
- **开发环境**: 前端(1921) → Vite代理 → 后端(3001)
- **CORS**: 后端允许来自 `http://localhost:1921` 的请求
- **Cookie/credentials**: 启用，支持携带认证信息

### 认证流程
- **飞书OAuth**: 完全在后端处理，前端不接触AppSecret
- **JWT**: 后端签发，前端存储在sessionStorage
- **API调用**: 前端自动注入Bearer Token

---

## 故障排查

### 如果仍然无法登录

1. **检查浏览器Console错误**
   - 打开开发者工具 → Console
   - 查看是否有CORS错误或其他JavaScript错误

2. **检查Network面板**
   - 查看 `/api/auth/feishu/login` 请求状态
   - 如果是CORS错误，会显示红色并有错误消息

3. **检查后端日志**
   - 后端terminal应该显示：
     ```
     [Nest] LOG  CORS enabled for origins: http://localhost:1921, http://localhost:5173
     ```
   - 登录时应该显示:
     ```
     Login endpoint hit, tenant: undefined
     Redirecting to: https://open.feishu.cn/open-apis/authen/v1/index?...
     ```

4. **验证后端是否重启成功**
   ```powershell
   # 检查后端进程
   Get-Process | Where-Object {$_.ProcessName -like "*node*"}
   
   # 测试后端API
   Invoke-WebRequest -Uri "http://localhost:3001/api/auth/feishu/login" -UseBasicParsing
   ```

5. **检查前端dev server**
   - 确认运行在端口1921
   - 确认代理配置正确

---

## 配置文件位置

- **后端CORS**: `content-backend/src/main.ts` (第51-79行)
- **前端代理**: `vite.config.js` (第29-60行)
- **前端端口**: `vite.config.js` (第26行)

---

**修复时间**: 2025-12-21 02:35  
**状态**: ✅ CORS已修复，后端已重启  
**下一步**: 测试飞书登录流程
