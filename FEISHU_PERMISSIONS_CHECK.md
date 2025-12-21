# ✅ 飞书凭证验证成功！

## 测试结果

```
✅ AppID: cli_a9cca040e5f89bcb
✅ AppSecret: 正确
✅ app_access_token: 获取成功
```

**结论**: 飞书应用凭证配置正确！

---

## 🔍 问题诊断

既然凭证正确，但登录时报 `invalid access token` 错误，问题99%是：

### 🎯 **飞书应用权限配置不足**

---

## 🛠️ 立即修复步骤

### 步骤 1: 登录飞书开放平台

访问：https://open.feishu.cn/app

### 步骤 2: 找到你的应用

搜索 AppID: `cli_a9cca040e5f89bcb`

### 步骤 3: 检查权限配置

点击左侧菜单 **"权限管理"** 或 **"Permissions & Scopes"**

#### 必需的权限：

以下权限必须全部开通，否则无法获取用户信息：

| 权限名称 | 英文名称 | 权限ID | 说明 |
|---------|---------|--------|------|
| ✅ 获取用户基本信息 | View user information | `authen:v1:user_info` | **必须** |
| ✅ 获取用户统一ID | Get ID of a user | `contact:user:id` | **必须** |
| ✅ 获取用户邮箱 | View user email addresses | `contact:user:email:readonly` | 推荐 |
| ✅ 通过手机号或邮箱获取用户ID | Get user ID | `contact:user.phone:readonly` | 推荐 |

### 步骤 4: 申请权限

1. 点击每个权限旁边的 **"申请"** 或 **"添加"** 按钮
2. 选择权限范围：**"所有用户"**
3. 填写申请理由（如果需要）
4. 提交申请

**注意**: 
- 有些权限需要**管理员审批**
- 审批通过后权限才生效
- 权限生效可能需要几分钟

### 步骤 5: 配置重定向URI

点击左侧 **"安全设置"** → **"重定向URL"**

添加以下URI（如果还没有）：
```
http://localhost:3001/api/auth/feishu/callback
```

**重要**: URI必须**完全匹配**，包括：
- 协议 (http/https)
- 域名/IP
- 端口号
- 路径

### 步骤 6: 检查应用状态

确保应用：
- ✅ **已启用** (not disabled)
- ✅ **可用范围**: 包含你的测试用户

---

## 📝 重新测试步骤

### 1. 等待权限生效（2-5分钟）

### 2. 清除浏览器缓存
```javascript
localStorage.clear()
sessionStorage.clear()
location.reload()
```

### 3. 重新登录
访问 `http://localhost:1921` → 点击"飞书登录"

### 4. 查看后端日志

如果权限配置正确，你应该看到：
```
========== 飞书登录开始 ==========
使用默认租户
租户未配置飞书凭证，使用全局配置

步骤 2: 用 authorization code 换取 access_token...
Token API 响应码: 0
✅ Access Token 获取成功

步骤 3: 用 access_token 获取用户信息...
User Info API 响应码: 0
✅ 用户信息获取成功
用户名称: 张三
用户 OpenID: ou_xxx

步骤 4: 检查用户白名单...
✅ 用户在白名单中

步骤 5: 签发 JWT Token...
✅ JWT Token 签发成功
========== 飞书登录完成 ==========
```

如果步骤3仍然失败，后端会显示详细的错误码，请把错误码发给我。

---

## 🎯 其他可能的问题

### 问题A: 用户不在白名单中

**症状**: 步骤4失败
```
❌ 用户不在白名单中
```

**解决**: 
运行用户同步，或手动添加用户到数据库

```sql
INSERT INTO users (id, "feishuId", name, "tenantId", role)
VALUES (
  gen_random_uuid(),
  'ou_你的FeishuID',
  '你的名字',
  '00000000-0000-0000-0000-000000000001',
  'EDITOR'
);
```

### 问题B: 飞书SDK版本问题

**症状**: API调用方式不兼容

**解决**: 
检查 `package.json` 中的 `@larksuiteoapi/node-sdk` 版本

当前版本应该是 `^1.55.0`

### 问题C: 网络/防火墙问题

**症状**: 间歇性失败

**解决**:
- 检查服务器能否访问 `open.feishu.cn`
- 检查防火墙设置
- 尝试使用代理

---

## 🔥 快速自检清单

在飞书开放平台检查以下项目：

- [ ] AppID 正确且应用已启用
- [ ] AppSecret 最近没有重置过
- [ ] 重定向URI 已配置且完全匹配
- [ ] 权限 `authen:v1:user_info` 已开通
- [ ] 权限 `contact:user:id` 已开通
- [ ] 应用可用范围包含测试用户
- [ ] 应用没有被禁用或暂停

---

**现在请按照上述步骤检查飞书应用的权限配置，特别是 "获取用户基本信息" 权限！**

这应该能解决问题。检查完权限后，请告诉我结果或遇到的任何问题。

---

**创建时间**: 2025-12-21 02:53  
**问题根源**: 飞书应用权限不足  
**解决方案**: 开通用户信息相关权限
