# 端到端测试指南 - 多租户自助配置

## 📋 测试准备

### 前置条件
- ✅ 后端服务运行：`npm run start:dev`（content-backend目录）
- ✅ 前端服务运行：`npm run dev`（根目录）
- ✅ 数据库运行：PostgreSQL
- ✅ 用户已通过飞书登录

---

## 🧪 测试场景 1: 配置人员管理表

### 步骤 1: 在飞书创建表格

1. 打开飞书，创建一个新的多维表格
2. 添加以下列：
   - **姓名**（文本）
   - **岗位**（单选：文案/策划）
   - **FeishuID**（文本）

3. 添加测试数据：
   ```
   姓名    岗位    FeishuID
   张三    文案    ou_test_user_123
   李四    策划    ou_test_user_456
   ```

### 步骤 2: 获取表格链接

1. 在飞书表格中，复制浏览器地址栏URL
2. 示例：`https://pcn0utfudhj3.feishu.cn/wiki/Gcnnw2yujiqmxXkv5mTc8cftnMc?table=tblO6V58nUVEQX5U`

### 步骤 3: 访问配置页面

```
1. 打开浏览器访问：http://localhost:1921/settings/tenant
2. 如果未登录，会自动跳转到登录页
3. 使用飞书扫码登录
4. 登录后自动返回配置页面
```

### 步骤 4: 粘贴表格链接

```
1. 在"人员管理表（必需）"部分
2. 粘贴步骤2复制的URL到输入框
3. 点击"保存配置"按钮
```

**预期结果**：
- ✅ 显示成功提示："人员管理表配置成功！"
- ✅ 下方显示配置详情：
  - App Token: Gcnnw2yujiqmxXkv5mTc8cftnMc
  - Table ID: tblO6V58nUVEQX5U
- ✅ 标签从"未配置"变为"已配置"

### 步骤 5: 验证后端存储

```bash
# 在数据库中查询
SELECT settings FROM tenants WHERE id = '<your_tenant_id>';

# 预期结果：
{
  "userTable": {
    "appToken": "Gcnnw2yujiqmxXkv5mTc8cftnMc",
    "tableId": "tblO6V58nUVEQX5U",
    "tableUrl": "https://...",
    "configuredAt": "2025-12-21T15:40:00.000Z"
  }
}
```

---

## 🧪 测试场景 2: API 直接测试

### 测试 1: 获取当前配置

```bash
# PowerShell
$token = "your_jwt_token"
$response = Invoke-RestMethod -Uri "http://localhost:3001/api/tenant/config" `
  -Headers @{ "Authorization" = "Bearer $token" } `
  -Method GET

$response | ConvertTo-Json
```

**预期响应**：
```json
{
  "success": true,
  "config": {
    "userTable": null,
    "articleTable": null,
    "tenantName": "默认租户",
    "tenantSlug": "default"
  }
}
```

### 测试 2: 配置人员表

```bash
$body = @{
  tableUrl = "https://pcn0utfudhj3.feishu.cn/wiki/Gcnnw2yujiqmxXkv5mTc8cftnMc?table=tblO6V58nUVEQX5U"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:3001/api/tenant/config/user-table" `
  -Headers @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
  } `
  -Method POST `
  -Body $body

$response | ConvertTo-Json
```

**预期响应**：
```json
{
  "success": true,
  "message": "人员管理表配置成功",
  "config": {
    "appToken": "Gcnnw2yujiqmxXkv5mTc8cftnMc",
    "tableId": "tblO6V58nUVEQX5U"
  }
}
```

### 测试 3: 测试无效URL

```bash
$body = @{
  tableUrl = "https://invalid-url.com"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:3001/api/tenant/config/user-table" `
  -Headers @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
  } `
  -Method POST `
  -Body $body
```

**预期响应**：
```json
{
  "statusCode": 400,
  "message": "无效的飞书表格链接: URL中未找到table参数"
}
```

---

## 🧪 测试场景 3: 多租户隔离测试

### 步骤 1: 创建第二个租户

```sql
INSERT INTO tenants (id, name, slug, "isActive")
VALUES (
  gen_random_uuid(),
  'XX医院',
  'hospital-a',
  true
);
```

### 步骤 2: 租户A配置表格

```
1. 租户A用户登录
2. 访问 /settings/tenant
3. 配置表格A: https://xxx.feishu.cn/wiki/AAA?table=BBB
```

### 步骤 3: 租户B配置表格

```
1. 租户B用户登录
2. 访问 /settings/tenant
3. 配置表格B: https://xxx.feishu.cn/wiki/CCC?table=DDD
```

### 步骤 4: 验证隔离

```sql
-- 租户A的配置
SELECT settings FROM tenants WHERE slug = 'default';

-- 租户B的配置
SELECT settings FROM tenants WHERE slug = 'hospital-a';
```

**预期结果**：
- ✅ 两个租户的配置完全独立
- ✅ 互不影响
- ✅ 各自使用自己的表格

---

## 🧪 测试场景 4: 前端UI测试

### 测试点

1. **加载状态**
   - ✅ 页面加载时显示loading
   - ✅ 配置保存时按钮显示loading

2. **错误处理**
   - ✅ 无效URL显示错误提示
   - ✅ 网络错误显示友好提示
   - ✅ 未授权自动跳转登录

3. **成功反馈**
   - ✅ 配置成功显示成功消息
   - ✅ 配置详情立即显示
   - ✅ 标签状态更新

4. **帮助文档**
   -✅ 折叠面板可展开/折叠
   - ✅ 示例清晰易懂
   - ✅ 链接可点击

---

## 🧪 测试场景 5: 异常情况测试

### 测试 1: 未登录访问

```
1. 清除浏览器sessionStorage中的token
2. 访问 /settings/tenant
```

**预期结果**：
- ✅ API返回401
- ✅ 自动跳转到登录页（如果实现了401拦截器）

### 测试 2: 表格权限不足

```
1. 配置一个当前飞书应用无权访问的表格
2. 尝试同步
```

**预期结果**：
- ✅ 显示权限错误
- ✅ 提示用户检查权限配置

### 测试 3: 重复配置

```
1. 配置过一次后
2. 再次配置相同的URL
```

**预期结果**：
- ✅ 覆盖旧配置
- ✅ 更新configuredAt时间戳

---

## ✅ 测试检查清单

### 后端API
- [ ] GET /api/tenant/config - 返回当前配置
- [ ] POST /api/tenant/config/user-table - 保存人员表配置
- [ ] POST /api/tenant/config/article-table - 保存文章表配置
- [ ] URL解析正确提取appToken和tableId
- [ ] 无效URL返回400错误
- [ ] 未授权返回401错误

### 前端页面
- [ ] 页面正常加载
- [ ] 输入框可输入URL
- [ ] 保存按钮正常工作
- [ ] 成功提示显示
- [ ] 配置详情展示
- [ ] 帮助文档可展开
- [ ] 响应式布局正常

### 数据持久化
- [ ] 配置保存到数据库
- [ ] 刷新页面配置不丢失
- [ ] 多租户配置隔离
- [ ] settings字段结构正确

### 用户体验
- [ ] 操作流程简单直观
- [ ] 错误提示友好清晰
- [ ] 加载状态明确
- [ ] 帮助文档易理解

---

## 🐛 已知问题

1. **TypeScript编译警告**
   - 位置: `feishu-org-sync.service.ts`
   - 影响: 无（可选功能）
   - 修复: 添加null检查或禁用该文件编译

2. **同步触发**
   - 当前: 需要手动调用API
   - 改进: 添加"立即同步"按钮

---

## 📝 测试报告模板

```markdown
## 测试报告

**测试时间**: 2025-12-21
**测试人**: XXX
**测试环境**: 
- 后端: http://localhost:3001
- 前端: http://localhost:1921
- 数据库: PostgreSQL

### 测试结果

| 场景 | 预期 | 实际 | 状态 |
|------|------|------|------|
| 配置人员表 | 成功保存 | ✅ | ✅ |
| 配置文章表 | 成功保存 | ✅ | ✅ |
| 无效URL | 错误提示 | ✅ | ✅ |
| 多租户隔离 | 配置独立 | ✅ | ✅ |

### 发现的问题

1. XXX
2. XXX

### 建议改进

1. XXX
2. XXX
```

---

## 🎯 快速测试步骤

**5分钟快速测试**：

```bash
# 1. 启动服务
cd content-backend && npm run start:dev &
cd .. && npm run dev &

# 2. 访问页面
open http://localhost:1921/settings/tenant

# 3. 粘贴URL
# https://pcn0utfudhj3.feishu.cn/wiki/Gcnnw2yujiqmxXkv5mTc8cftnMc?table=tblO6V58nUVEQX5U

# 4. 点击保存

# 5. 验证
# 查看页面显示 + 查看数据库
```

**完成！** ✅
