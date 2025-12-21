# 多租户架构实施指南

## 📋 概述

本系统已升级为多租户 SaaS 架构，支持多个团体使用各自的微信公众号和飞书配置。

## 🏗️ 架构变更

### 1. 数据库变更

#### 新增表：`tenants`
- 存储租户信息
- 每个租户拥有独立的飞书和微信配置

#### 修改表：`users`
- 添加 `tenantId` 字段
- `feishuId` 不再全局唯一，而是与 `tenant Id` 组合唯一
- 新增 `ADMIN` 角色

#### 修改表：`articles`
- 添加 `tenantId` 字段
- 所有数据查询自动按租户隔离

### 2. 代码变更

- **新增实体**: `Tenant`
- **新增模块**: `TenantModule`, `TenantService`
- **修改模块**: `AuthService`, `AuthController` 支持多租户登录
- **新增拦截器**: `TenantContextInterceptor` 自动注入租户上下文

## 🚀 部署步骤

### 步骤 1: 运行数据库迁移

```bash
# 编译 TypeScript 代码
cd content-backend
npm run build

# 运行迁移
npm run typeorm migration:run -- -d dist/data-source.js
```

**迁移脚本会自动**：
- 创建 `tenants` 表
- 创建默认租户（ID: `00000000-0000-0000-0000-000000000001`）
- 将所有现有用户和文章分配给默认租户

### 步骤 2: 配置默认租户

默认租户会使用当前环境变量中的配置：

```env
# .env 文件中的配置会被默认租户使用
FEISHU_APP_ID=cli_xxx
FEISHU_APP_SECRET=xxx
FEISHU_BASE_APP_TOKEN=xxx
FEISHU_BASE_TABLE_ID=xxx
WECHAT_APPID=wxxx
WECHAT_APPSECRET=xxx
```

可以通过数据库直接更新默认租户的配置：

```sql
UPDATE tenants 
SET 
  "feishuAppId" = 'cli_xxx',
  "feishuAppSecret" = 'xxx',
  "feishuBaseAppToken" = 'xxx',
  "feishuBaseTableId" = 'xxx',
  "wechatAppId" = 'wxxx',
  "wechatAppSecret" = 'xxx'
WHERE id = '00000000-0000-0000-0000-000000000001';
```

### 步骤 3: 添加新租户

#### 方法 A：通过数据库直接添加

```sql
INSERT INTO tenants (
  id, name, slug, 
  "feishuAppId", "feishuAppSecret",
  "feishuBaseAppToken", "feishuBaseTableId",
  "wechatAppId", "wechatAppSecret",
  "isActive"
)
VALUES (
  gen_random_uuid(), 
  '医疗公司', 
  'medical-corp',
  'cli_医疗公司的飞书AppId', 
  '医疗公司的飞书AppSecret',
  '医疗公司的多维表格AppToken',
  '医疗公司的多维表格TableId',
  '医疗公司的微信AppId',
  '医疗公司的微信AppSecret',
  true
);
```

#### 方法 B：通过代码创建（TODO）

后续可以开发租户管理后台界面，允许超级管理员创建和管理租户。

### 步骤 4: 为租户创建用户白名单

每个租户需要在自己的飞书多维表格中维护用户白名单。

#### 飞书多维表格格式

| FeishuID (ou_xxx) | 姓名 | 岗位        | 状态 |
|-------------------|------|-------------|------|
| ou_xxx001         | 张三 | 策划/PLANNER | ✅   |
| ou_xxx002         | 李四 | 文案/COPYWRITER | ✅   |
| ou_xxx003         | 王五 | 编辑/EDITOR | ❌   |

**字段说明**：
- **FeishuID**: 用户的飞书 open_id（可通过飞书"人员/单选人员"字段自动获取）
- **姓名**: 用户显示名称
- **岗位**: 映射到角色
  - `策划` → `PLANNER`
  - `文案` → `COPYWRITER`
  - `编辑` → `EDITOR`
  - `管理员` → `ADMIN`
- **状态**: 只有 ✅ 的用户会被同步

#### 配置 SyncService

修改 `sync.service.ts` 支持多租户同步：

```typescript
// 同步指定租户的用户
async syncUsersForTenant(tenantId: string) {
  const tenant = await this.tenantService.findById(tenantId);
  
  // 使用租户的飞书配置
  const client = new Lark.Client({
    appId: tenant.feishuAppId,
    appSecret: tenant.feishuAppSecret,
    // ...
  });
  
  // 从该租户的多维表格同步
  // ...
}
```

## 🔐 登录流程

### 单租户模式（向后兼容）

```
用户访问: http://localhost:1921/
点击登录: http://localhost:3001/api/auth/feishu/login
飞书回调: http://localhost:3001/api/auth/feishu/callback
前端回调: http://localhost:1921/auth/callback?token=xxx
```

### 多租户模式

```
租户A用户访问: http://localhost:1921/?tenant=medical-corp
点击登录: http://localhost:3001/api/auth/feishu/login?tenant=medical-corp
        (使用medical-corp的飞书AppId)
飞书回调: http://localhost:3001/api/auth/feishu/callback?tenant=medical-corp
        (验证用户是否在medical-corp的白名单中)
前端回调: http://localhost:1921/auth/callback?token=xxx&tenant=medical-corp
```

**关键参数**：
- `tenant`: 租户的 slug（如 `medical-corp`）
- 前端需要在登录链接中包含此参数
- JWT Token 会包含用户的 `tenantId`

## 🛡️ 权限隔离

### JWT Payload 结构

```json
{
  "sub": "user-uuid",
  "username": "张三",
  "feishuId": "ou_xxx",
  "tenantId": "tenant-uuid",  // 🔑 关键字段
  "role": "EDITOR",
  "iat": 1703088000,
  "exp": 1703692800
}
```

### 后端查询示例

```typescript
// ❌ 错误：没有租户过滤
const articles = await this.articleRepo.find();

// ✅ 正确：添加租户过滤
const articles = await this.articleRepo.find({
  where: { tenantId: user.tenantId }
});
```

### 使用租户上下文

```typescript
// 在控制器中
@Get('articles')
@UseGuards(JwtAuthGuard)
async getArticles(@Request() req) {
  const tenantId = req.user.tenantId; // 从JWT中获取
  return this.articleService.findByTenant(tenantId);
}
```

## 📝 最佳实践

### 1. 每个租户的飞书多维表格

- ✅ 每个租户创建独立的飞书多维表格
- ✅ 表格权限仅该租户管理员可编辑
- ✅ 定期同步（建议每小时一次）

### 2. 微信公众号配置

- ✅ 每个租户使用各自的微信公众号
- ✅ APPID/SECRET 加密存储在数据库中
- ⚠️ 生产环境建议使用 KMS（密钥管理服务）

### 3. 数据隔离

- 🔒 所有查询必须包含 `tenantId` 过滤
- 🔒 API 响应前验证数据属于当前租户
- 🔒 定期审计跨租户数据泄露

### 4. 监控和日志

- 📊 记录每个租户的 API 调用量
- 📊 监控每个租户微信 API 配额使用情况
- 🚨 异常登录尝试告警

## 🔧 故障排查

### 问题 1: 登录后提示"没有权限"

**原因**: 用户不在该租户的用户白名单中

**解决**:
1. 检查飞书多维表格中是否有该用户记录
2. 确认用户的 `FeishuID` 是否正确
3. 检查用户状态是否为 ✅
4. 手动运行同步: `POST /api/sync/users`

### 问题 2: 登录时跳转到错误的租户

**原因**: 前端没有正确传递 `tenant` 参数

**解决**:
1. 检查登录链接是否包含 `?tenant=xxx`
2. 确认前端路由是否正确处理租户参数
3. 验证 `slug` 是否与数据库中一致

### 问题 3: 微信API调用失败

**原因**: 租户的微信配置不正确

**解决**:
1. 验证数据库中 `wechatAppId` 和 `wechatAppSecret` 是否正确
2. 检查微信公众号 IP 白名单
3. 验证租户的微信 Token 是否过期

## 📚 后续开发建议

### 短期（1-2周）

- [ ] 添加租户管理 API
- [ ] 修改 `SyncService` 支持多租户同步
- [ ] 前端添加租户选择界面
- [ ] 添加租户使用量统计

### 中期（1个月）

- [ ] 开发超级管理员后台
- [ ] 实现租户配额管理
- [ ] 添加租户数据导出功能
- [ ] 审计日志系统

### 长期（3个月+）

- [ ] 租户自助注册流程
- [ ] 按租户计费系统
- [ ] 多区域部署支持
- [ ] 租户独立域名支持

## 🎉 测试验证

### 验证清单

- [ ] 数据库迁移成功执行
- [ ] 默认租户可以正常登录
- [ ] 新租户可以成功创建
- [ ] 新租户用户可以登录
- [ ] 不同租户用户看到的数据完全隔离
- [ ] 微信 API 使用各租户独立凭证
- [ ] 飞书登录使用各租户独立配置
- [ ] JWT Token 包含正确的 tenantId

---

**重要提示**: 
- 📌 备份数据库后再运行迁移
- 📌 在测试环境充分验证后再部署到生产环境
- 📌 迁移过程不可逆，请谨慎操作
