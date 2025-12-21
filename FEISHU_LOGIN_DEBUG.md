# 🐛 飞书登录调试指南

## 错误信息
```
Feishu Login Failed: Failed to get user info: invalid access token
```

## 错误分析

这个错误发生在飞书OAuth流程的第3步：

```
1. ✅ 用户授权 → 获取 code
2. ✅ 后端用 code 换取 access_token
3. ❌ 用户 access_token 获取用户信息 → 失败：invalid access token
```

## 可能原因

### 1. 飞书应用配置问题 🔴 最可能

**症状**: `invalid access token`

**原因**: 
- AppID 和 AppSecret 不匹配
- 使用了错误的飞书应用凭证
- 飞书应用类型配置错误（企业自建 vs 应用商店）

**验证方法**:
1. 登录飞书开放平台：https://open.feishu.cn/app
2. 找到你的应用
3. 确认：
   - AppID: `cli_a9cca040e5f89bcb`
   - AppSecret: `E51FjrmxjqFBsHMdoCJ4edcCm8eOGhfK`
   - 应用类型：企业自建应用
   - 重定向URI：`http://localhost:3001/api/auth/feishu/callback`

### 2. 重定向URI配置错误

**检查**:
- 飞书开放平台上配置的重定向URI
- 必须完全匹配：`http://localhost:3001/api/auth/feishu/callback`

### 3. 应用权限不足

**需要的权限**:
- ✅ `通过手机号或邮箱获取用户 ID`
- ✅ `获取用户统一ID`  
- ✅ `获取用户基本信息`

### 4. Code被重复使用

飞书的authorization code只能使用一次。如果：
- 浏览器自动重试
- 用户刷新页面
- 网络问题导致重试

都会导致code失效。

---

## 快速修复步骤

### 步骤 1: 验证环境变量

检查 `.env` 文件：

```env
FEISHU_APP_ID=cli_a9cca040e5f89bcb
FEISHU_APP_SECRET=E51FjrmxjqFBsHMdoCJ4edcCm8eOGhfK
FEISHU_REDIRECT_URI=http://localhost:3001/api/auth/feishu/callback
```

### 步骤 2: 检查飞书应用配置

1. 访问：https://open.feishu.cn/app
2. 找到应用（AppID: cli_a9cca040e5f89bcb）
3. 检查：
   - **应用凭证** → AppID 和 AppSecret
   - **安全设置** → 重定向URL：`http://localhost:3001/api/auth/feishu/callback`
   - **权限管理** → 确保有用户信息相关权限
   - **可用性** → 确保应用已启用

### 步骤 3: 重新获取凭证（如果必要）

如果凭证可能泄露或不正确：
1. 在飞书开放平台重置AppSecret
2. 更新 `.env` 文件
3. 重启后端服务

### 步骤 4: 测试简化流程

创建一个最小测试，跳过租户逻辑：

**临时修改 `auth.service.ts`**:

```typescript
async feishuLogin(code: string, tenantSlug?: string) {
  try {
    // 直接使用全局配置，跳过租户查询
    const client = this.feishuService.getClient();
    this.logger.log('Using GLOBAL Feishu config for debugging');
    
    // ... 继续原有逻辑
```

---

## 详细调试步骤

### 1. 启用详细日志

在 `auth.service.ts` 中添加更多日志：

```typescript
// 在第62行附近
const tokenRes = await client.request({
  method: 'POST',
  url: '/open-apis/authen/v1/oidc/access_token',
  data: {
    grant_type: 'authorization_code',
    code: code,
  },
});

// 添加日志
this.logger.log('Token Response:', JSON.stringify(tokenRes));

if (tokenRes.code !== 0 || !tokenRes.data) {
  this.logger.error(`Token Error Code: ${tokenRes.code}`);
  this.logger.error(`Token Error Message: ${tokenRes.msg}`);
  this.logger.error(`Full Response: ${JSON.stringify(tokenRes)}`);
  // ...
}
```

### 2. 检查后端日志

重新登录，查看后端terminal输出：

应该看到：
```
[AuthService] Using global Feishu config
[AuthService] Token Response: {...}
[AuthService] Got access token: xxx...
[AuthService] User Info Response Code: 0
```

如果看到错误码，参考飞书文档：
- Code 99991400: invalid app access token
- Code 99991401: token expired
- Code 99991403: invalid access token ← **你的错误**

### 3. 手动测试飞书API

使用Postman或curl测试：

```bash
# 1. 获取 app_access_token
curl -X POST https://open.feishu.cn/open-apis/auth/v3/app_access_token/internal \
  -H "Content-Type: application/json" \
  -d '{
    "app_id": "cli_a9cca040e5f89bcb",
    "app_secret": "E51FjrmxjqFBsHMdoCJ4edcCm8eOGhfK"
  }'

# 如果这一步失败，说明AppID/AppSecret不正确
```

---

## 环境变量配置清单

确保 `.env` 包含：

```env
# 飞书配置
FEISHU_APP_ID=cli_a9cca040e5f89bcb
FEISHU_APP_SECRET=E51FjrmxjqFBsHMdoCJ4edcCm8eOGhfK
FEISHU_REDIRECT_URI=http://localhost:3001/api/auth/feishu/callback
FEISHU_VERIFICATION_TOKEN=7cg7LO2kuTwvw85A4lXrgfuQyPvqh2lo
FEISHU_BASE_APP_TOKEN=X3kVbw0fRapfjMsIW1AcN2MvnLe
FEISHU_BASE_TABLE_ID=tblz3wXPfgHVmLG0

# 前端URL（用于回调）
FRONTEND_URL=http://localhost:1921
```

---

## 常见解决方案

### 方案 A: AppSecret错误 ✅ 最常见

**症状**: `invalid access token`
**解决**: 
1. 在飞书开放平台查看正确的AppSecret
2. 更新 `.env`
3. 重启后端：停止 `npm run start:dev`，重新运行

### 方案 B: 重定向URI不匹配

**症状**: 飞书授权页面显示错误
**解决**:
1. 飞书开放平台 → 应用详情 → 安全设置
2. 添加/修改重定向URI：`http://localhost:3001/api/auth/feishu/callback`
3. 保存并重试

### 方案 C: 应用权限不足

**症状**: 获取用户信息时出错
**解决**:
1. 飞书开放平台 → 权限管理
2. 申请并开通以下权限：
   - 获取用户基本信息
   - 获取用户邮箱
   - 获取用户手机号（可选）
3. 重新授权

### 方案 D: 网络/代理问题

**症状**: 间歇性失败
**解决**:
- 检查服务器是否能访问 `open.feishu.cn`
- 检查防火墙设置
- 检查是否有代理干扰

---

## 立即行动

**推荐检查顺序**:

1. ✅ 验证 `.env` 中的 `FEISHU_APP_ID` 和 `FEISHU_APP_SECRET`
2. ✅ 登录飞书开放平台确认凭证正确
3. ✅ 检查重定向URI配置
4. ✅ 查看后端terminal的详细错误日志
5. ✅ 如有必要，重置AppSecret并更新配置

---

**创建时间**: 2025-12-21 02:40  
**优先级**: 🔥 高 - 阻止登录功能
