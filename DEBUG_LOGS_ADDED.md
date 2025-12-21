# ✅ 详细调试日志已添加

## 修改内容

### 1. AuthService (`auth.service.ts`)

添加了完整的飞书登录流程日志：

```
========== 飞书登录开始 ==========
Authorization Code: xxx...
Tenant Slug: default

使用默认租户
租户已找到: 默认租户 (ID: xxx)
租户未配置飞书凭证，使用全局配置

步骤 2: 用 authorization code 换取 access_token...
Token API 响应码: 0
Token API 响应消息: success
✅ Access Token 获取成功: xxx...

步骤 3: 用 access_token 获取用户信息...
使用 user_access_token: xxx...
User Info API 响应码: 0
User Info API 响应消息: success
✅ 用户信息获取成功
用户名称: 张三
用户 OpenID: ou_xxx

步骤 4: 检查用户白名单...
查找用户 - TenantID: xxx, FeishuID: ou_xxx
✅ 用户在白名单中: 张三 (EDITOR)
更新用户信息...
用户 张三 登录到租户 默认租户

步骤 5: 签发 JWT Token...
✅ JWT Token 签发成功
========== 飞书登录完成 ==========
```

**错误时的日志**：
```
========== 飞书登录失败 ==========
错误类型: UnauthorizedException
错误消息: Failed to get user info: invalid access token
堆栈跟踪: ...
```

### 2. AuthController (`auth.controller.ts`)

添加了回调处理的日志：

```
========== 飞书回调接收 ==========
Authorization Code: xxx...
Tenant Slug: default

调用 AuthService.feishuLogin...
✅ AuthService 返回成功
Token: xxx...
User: 张三

重定向到前端: http://localhost:1921/auth/callback?token=xxx...
========== 飞书回调处理完成 ==========
```

---

## 现在重新测试登录

### 步骤 1: 清除浏览器缓存

```javascript
localStorage.clear()
sessionStorage.clear()
location.reload()
```

### 步骤 2: 点击飞书登录

访问 `http://localhost:1921` → 点击"飞书登录"

### 步骤 3: 查看后端Terminal

后端应该会输出非常详细的日志，显示：
- ✅ 每个步骤的进度
- ✅ API响应码和消息
- ✅ 获取的数据（Token、用户信息等）
- ❌ 如果失败，会显示具体在哪一步失败了

### 步骤 4: 分析日志

根据后端日志定位问题：

#### 场景 A: 步骤 2 失败（获取 access_token 失败）

```
步骤 2: 用 authorization code 换取 access_token...
❌ 获取 Access Token 失败
错误码: 99991663
错误消息: invalid code
```

**原因**: 
- authorization code 过期或已被使用
- AppID 和 AppSecret 不匹配

**解决**: 
- 刷新页面重试
- 检查飞书应用凭证

#### 场景 B: 步骤 3 失败（获取用户信息失败） ← **你当前的问题**

```
步骤 3: 用 access_token 获取用户信息...
❌ 获取用户信息失败
错误码: 99991663
错误消息: invalid access token
```

**可能原因**:
1. **AppID/AppSecret 不匹配** - 最常见
2. **飞书应用权限不足** - 缺少获取用户信息权限
3. **SDK版本问题** - Lark SDK 与飞书API不兼容

**解决方案**:

**检查1: 验证环境变量**
```bash
# 查看 .env 文件
cat content-backend/.env | grep FEISHU_APP
```

**检查2: 测试飞书API**
```bash
# 手动测试获取 app_access_token
curl -X POST https://open.feishu.cn/open-apis/auth/v3/app_access_token/internal \
  -H "Content-Type: application/json" \
  -d '{
    "app_id": "你的AppID",
    "app_secret": "你的AppSecret"
  }'
```

如果这个请求返回错误，说明AppID/AppSecret不对。

#### 场景 C: 步骤 4 失败（白名单检查失败）

```
步骤 4: 检查用户白名单...
❌ 用户不在白名单中
FeishuID: ou_xxx
Tenant: default (ID: xxx)
用户名称: 张三
```

**原因**: 用户未在数据库的 `users` 表中

**解决**: 
- 运行用户同步：从飞书多维表格同步用户
- 或手动添加用户到数据库

---

## 常见错误码对照

### 飞书API错误码

| 错误码 | 错误消息 | 原因 | 解决方案 |
|--------|---------|------|---------|
| 99991663 | invalid code | authorization code 无效 | 重新登录，获取新code |
| 99991663 | invalid access token | access_token 无效 | 检查AppID/AppSecret |
| 99991400 | invalid app access token | app_access_token 无效 | AppID/AppSecret 错误 |
| 10012 | app has no permission | 应用缺少权限 | 飞书平台开通权限 |

---

## 下一步行动

### 如果日志显示"步骤 2"失败：
→ 检查飞书应用的 AppID和AppSecret

### 如果日志显示"步骤 3"失败：
→ 检查飞书应用权限配置

### 如果日志显示"步骤 4"失败：
→ 运行用户同步或手动添加用户

### 如果看不到任何日志：
→ 检查后端是否正常运行
→ 检查是否真的触发了回调

---

**请现在重新测试登录，并把后端Terminal的完整日志发给我！**

这样我就能准确定位问题出在哪个步骤了。

---

**更新时间**: 2025-12-21 02:44  
**状态**: ✅ 详细日志已添加
