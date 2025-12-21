# JWT 认证调试指南

## 问题描述

飞书登录后似乎没有生效，可以登录但是和没登录一样。这是因为前端没有正确携带JWT Token到后端API请求中。

## 已完成的修复

### 1. 后端认证机制 ✅

后端已经配置了JWT认证：
- `AuthGuard('jwt')` 保护需要认证的路由
- `JwtStrategy` 验证Token并解析用户信息
- Token 包含 `sub`（用户ID）、`username`、`feishuId`、`tenantId`、`role`

### 2. 前端Token存储 ✅

- `LoginCallback.vue` 已正确保存Token到 `tokenStorage`
- `userStore` 已保存用户信息和租户信息

### 3. 前端API客户端修复 ✅

**修改文件**：`src/utils/api.ts`

添加了请求拦截器，自动注入JWT Token：

```typescript
api.interceptors.request.use((config) => {
  // 🔒 注入 JWT Token
  const token = tokenStorage.getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
```

添加了响应拦截器，处理401错误：

```typescript
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error('认证失效，请重新登录')
      tokenStorage.clearAuth()
    }
    return Promise.reject(error)
  }
)
```

### 4. Article API 重构 ✅

**修改文件**：`src/api/article.ts`

- ❌ 之前：使用原生 `axios` 直接调用，**不会携带Token**
- ✅ 现在：使用配置好的 `api` 实例，**自动携带Token**

```typescript
// ❌ 旧代码
import axios from 'axios'
const response = await axios.get(`${API_BASE}/articles/${id}`)

// ✅ 新代码
import api from '../utils/api'
const response = await api.get(`/articles/${id}`)
```

新增的API方法：
- `createArticle(title)` - 创建文章
- `getArticles()` - 获取用户的所有文章
- `updateArticleConfig(id, config)` - 更新文章配置
- `updateArticleContent(id, content)` - 更新文章内容
- `updateArticleImages(id, images)` - 更新文章图片
- `publishArticle(id)` - 发布文章

## 测试步骤

### 步骤 1：清除旧的缓存和Token

打开浏览器开发者工具：

```javascript
// 清除所有localStorage
localStorage.clear()

// 清除所有sessionStorage
sessionStorage.clear()

// 刷新页面
location.reload()
```

### 步骤 2：重新登录

1. 访问 `http://localhost:1921`
2. 点击「飞书登录」
3. 选择租户（或使用默认租户）
4. 完成飞书OAuth授权
5. 回调到系统

### 步骤 3：检查Token是否正确存储

打开浏览器开发者工具 Console：

```javascript
// 检查 sessionStorage 中的 Token
console.log('Token:', sessionStorage.getItem('auth_token'))

// 检查 localStorage 中的用户信息
console.log('User Info:', JSON.parse(localStorage.getItem('userInfo')))

// 检查租户信息
console.log('Tenant:', JSON.parse(localStorage.getItem('currentTenant')))
```

**预期输出**：
```javascript
Token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6..."
User Info: { id: "xxx", name: "张三", role: "EDITOR", tenantId: "..." }
Tenant: { id: "xxx", name: "医疗公司", slug: "medical-corp" }
```

### 步骤 4：测试API请求是否携带Token

打开浏览器开发者工具 Network 面板，然后执行任何API调用（例如访问文章配置页面）：

**查看请求头**：
```
Request Headers:
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  Content-Type: application/json
```

### 步骤 5：测试受保护的API

在 Console 中手动测试：

```javascript
import { getArticles } from './src/api/article'

// 获取文章列表（需要认证）
getArticles()
  .then(articles => console.log('✅ 认证成功，文章列表：', articles))
  .catch(error => console.error('❌ 认证失败：', error))
```

**预期结果**：
- ✅ 成功：返回当前用户的文章列表
- ❌ 失败：401 Unauthorized（说明认证失败）

### 步骤 6：检查后端日志

在后端终端查看日志：

```bash
# 正常的认证请求日志
[Nest] INFO  [AuthGuard] Validating JWT
[Nest] INFO  [JwtStrategy] Validating user: { sub: 'xxx', username: '张三' }
[Nest] INFO  [ArticleController] GET /articles - User: 张三
```

**如果看到 401 错误**：
```bash
[Nest] WARN  [AuthGuard] Unauthorized - Invalid token
```

## 常见问题排查

### 问题 1：Token 没有被保存

**症状**：`sessionStorage.getItem('auth_token')` 返回 `null`

**排查**：
1. 检查 `LoginCallback.vue` 是否正确调用 `userStore.setToken()`
2. 检查飞书回调URL是否包含 `token` 参数
3. 检查后端 `/auth/feishu/callback` 是否正确返回token

**解决**：查看浏览器地址栏回调URL格式：
```
http://localhost:1921/auth/callback?token=xxx&userInfo=xxx&tenant=xxx
```

### 问题 2：请求没有携带 Authorization 头

**症状**：Network面板中看不到 `Authorization` 头

**排查**：
1. 确认是否使用了正确的 `api` 实例
2. 确认 `tokenStorage.getToken()` 能正确返回token
3. 检查拦截器是否正确注册

**解决**：
```typescript
// ❌ 错误：直接使用 axios
import axios from 'axios'
axios.get('/api/articles')

// ✅ 正确：使用配置好的 api 实例
import api from '@/utils/api'
api.get('/articles')
```

### 问题 3：后端验证失败（401）

**症状**：请求携带了Token，但后端返回401

**排查**：
1. 检查Token是否过期（默认7天有效期）
2. 检查后端 `JWT_SECRET` 是否配置正确
3. 检查Token格式是否正确（Bearer + 空格 + Token）

**解决**：
- 在后端 `.env` 中确认 `JWT_SECRET` 至少64位
- 重新登录获取新Token
- 检查后端日志中的错误详情

### 问题 4：跨域问题

**症状**：请求被CORS策略拦截

**解决方案**：
后端已配置CORS（在 `main.ts`），确保允许前端域名：

```typescript
app.enableCors({
  origin: 'http://localhost:1921',
  credentials: true
})
```

## 后端受保护的路由

以下路由需要JWT认证：

```typescript
// ArticleController
POST   /api/articles           @UseGuards(AuthGuard('jwt'))
GET    /api/articles           @UseGuards(AuthGuard('jwt'))
PUT    /api/articles/:id/config   @UseGuards(AuthGuard('jwt'))
PUT    /api/articles/:id/content  @UseGuards(AuthGuard('jwt'))
PUT    /api/articles/:id/images   @UseGuards(AuthGuard('jwt'))
POST   /api/articles/:id/publish  @UseGuards(AuthGuard('jwt'))
```

**不需要认证的路由**：
```typescript
GET    /api/articles/:id          // 公开访问
GET    /api/articles/:id/file     // 公开访问
```

## 调试技巧

### 1. 开启详细日志

在 `.env` 文件中：

```env
# 前端
VITE_ENABLE_DEBUG=true

# 后端（已默认启用开发模式日志）
LOG_LEVEL=debug
```

### 2. 解码JWT Token

使用 [jwt.io](https://jwt.io) 或浏览器Console：

```javascript
const token = sessionStorage.getItem('auth_token')
const payload = JSON.parse(atob(token.split('.')[1]))
console.log('Token Payload:', payload)
```

**预期Payload**：
```json
{
  "username": "张三",
  "sub": "user-uuid",
  "feishuId": "ou_xxx",
  "tenantId": "tenant-uuid",
  "role": "EDITOR",
  "iat": 1703088000,
  "exp": 1703692800
}
```

### 3. 手动测试API

使用 Postman 或 curl：

```bash
# 获取文章列表
curl -H "Authorization: Bearer YOUR_TOKEN_HERE" \
     http://localhost:3001/api/articles
```

## 完成标志

✅ 所有测试通过后，你应该能够：

1. 成功登录并看到用户名和租户信息
2. 调用受保护的API（如创建文章、获取文章列表）
3. Network面板显示请求携带 `Authorization: Bearer xxx`
4. 后端日志显示用户身份验证成功
5. 401错误时自动清除本地Token

---

**最后更新**: 2025-12-21  
**修复版本**: v2.0 - 多租户JWT认证
