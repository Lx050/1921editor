# 🔧 修改user_info API调用方式

## 问题分析

步骤2成功，步骤3失败：
- ✅ Access Token 获取成功
- ❌ 错误码 20005: invalid access token

## 修改内容

### 之前的调用方式（失败）

```typescript
const userInfoRes = await client.request({
    method: 'GET',
    url: '/open-apis/authen/v1/user_info',
    headers: {
        'Authorization': `Bearer ${access_token}`,  // ❌ 不工作
    },
});
```

### 新的调用方式

```typescript
const userInfoRes = await client.request({
    method: 'GET',
    url: `/open-apis/authen/v1/user_info?user_access_token=${access_token}`,  // ✅ 使用查询参数
});
```

## 原因

飞书OIDC的`user_info`端点要求通过**URL查询参数**传递`user_access_token`，而不是HTTP请求头。

参考飞书文档：
https://open.feishu.cn/document/common-capabilities/sso/api/get-user-info

---

## 🧪 重新测试

1. **清除浏览器缓存**
   ```javascript
   localStorage.clear()
   sessionStorage.clear()
   location.reload()
   ```

2. **重新登录**
   - 访问 `http://localhost:1921`
   - 点击"飞书登录"
   - 完成授权

3. **查看后端日志**

应该看到：
```
步骤 3: 用 access_token 获取用户信息...
User Info API 响应码: 0  ✅
✅ 用户信息获取成功
用户名称: 张三
用户 OpenID: ou_xxx
```

---

**请现在重新测试并告诉我结果！**

---

**修改时间**: 2025-12-21 03:19  
**状态**: 已修改API调用方式，使用查询参数
