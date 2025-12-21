# 前端多租户使用指南

## 📋 概述

前端已支持多租户登录，用户可以选择不同的组织/租户进行登录，每个租户使用独立的飞书配置和微信公众号。

## 🎯 使用场景

### 场景 1：管理多个团体的公众号

**示例**：
- 医疗公司公众号
- 教育机构公众号
- 零售品牌公众号

每个团体拥有：
- ✅ 独立的飞书企业账号
- ✅ 独立的微信公众号
- ✅ 独立的用户白名单（在各自的飞书多维表格中）

## 🚀 用户登录流程

### 方式 1：通过租户选择页面登录

```
1. 访问首页
   ↓
2. 点击"飞书登录"
   ↓
3. 进入"选择组织"页面 (/tenant-select)
   ↓
4. 选择要登录的组织
   - 默认组织（使用全局配置）
   - 医疗公司
   - 教育机构
   - ...
   ↓
5. 跳转到对应组织的飞书登录页
   ↓
6. 飞书授权确认
   ↓
7. 回调到系统，完成登录
```

### 方式 2：直接指定租户登录（URL参数）

如果已知租户slug，可以直接通过URL指定：

```
访问: http://localhost:1921/?tenant=medical-corp
↓
点击"飞书登录"按钮会自动使用该租户登录
```

### 方式 3：快速重新登录（使用上次的租户）

```
用户退出登录后
↓
系统记住了上次使用的租户
↓
再次点击"飞书登录"会自动使用上次的租户
```

## 🎨 UI 变化

### 登录按钮区域

**未登录状态**：
```
┌─────────────────────────────────────┐
│ 公众号管理         [飞书登录] [+添加] │
└─────────────────────────────────────┘
```

**已登录状态（默认租户）**：
```
┌──────────────────────────────────────────────┐
│ 公众号管理    张三  [切换] [退出] [+添加]    │
└──────────────────────────────────────────────┘
```

**已登录状态（非默认租户）**：
```
┌──────────────────────────────────────────────────────┐
│ 公众号管理  张三 [医疗公司] [切换] [退出] [+添加]    │
└──────────────────────────────────────────────────────┘
                    ↑
                 租户标识
```

### 租户选择页面

```
╔═══════════════════════════════════╗
║         排版引擎                  ║
║     选择您的组织以继续             ║
╠═══════════════════════════════════╣
║                                   ║
║  ┌─────────────────────────────┐ ║
║  │ 🏢 默认组织                 │ ║
║  │ 使用默认配置登录        →   │ ║
║  └─────────────────────────────┘ ║
║                                   ║
║  ┌─────────────────────────────┐ ║
║  │ 🏥 医疗公司                 │ ║
║  │ medical-corp            →   │ ║
║  └─────────────────────────────┘ ║
║                                   ║
║  ┌─────────────────────────────┐ ║
║  │ 🎓 教育机构                 │ ║
║  │ education-org           →   │ ║
║  └─────────────────────────────┘ ║
║                                   ║
║  如需添加新组织，请联系系统管理员  ║
╚═══════════════════════════════════╝
```

## 💾 数据持久化

### LocalStorage 存储

```javascript
// 用户信息（包含tenantId）
localStorage.setItem('userInfo', JSON.stringify({
  id: 'user-id',
  name: '张三',
  role: 'EDITOR',
  tenantId: 'tenant-uuid'
}))

// 当前租户信息
localStorage.setItem('currentTenant', JSON.stringify({
  id: 'tenant-uuid',
  name: '医疗公司',
  slug: 'medical-corp'
}))
```

### JWT Token（sessionStorage）

```javascript
// Payload 包含租户ID
{
  "sub": "user-uuid",
  "username": "张三",
  "tenantId": "tenant-uuid",  // 🔑 关键
  "role": "EDITOR"
}
```

## 🔧 开发者指南

### 组件中访问租户信息

```vue
<script setup lang="ts">
import { useUserStore } from '@/stores/userStore'

const userStore = useUserStore()

// 获取当前租户
const currentTenant = userStore.currentTenant
console.log(currentTenant?.name)  // "医疗公司"
console.log(currentTenant?.slug)  // "medical-corp"

// 获取租户ID（优先从userInfo，其次从currentTenant）
const tenantId = userStore.tenantId
</script>
```

### API 调用时自动包含租户信息

JWT Token 会自动包含 `tenantId`，后端会根据此字段过滤数据：

```typescript
// 前端调用（不需要手动传tenantId）
const articles = await fetch('/api/articles', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})

// 后端自动从JWT中提取tenantId，只返回该租户的数据
```

### 添加新租户到前端列表

目前租户列表是硬编码的，修改 `src/views/TenantSelect.vue`：

```typescript
const mockTenants: TenantInfo[] = [
  {
    id: '1',
    name: '医疗公司',
    slug: 'medical-corp'
  },
  {
    id: '2',
    name: '教育机构',
    slug: 'education-org'
  },
  // 添加新租户
  {
    id: '4',
    name: '新公司',
    slug: 'new-company'
  }
]
```

**未来改进**：从后端API动态获取租户列表

```typescript
// TODO: 实现从后端获取
const loadTenants = async () => {
  const response = await fetch('/api/tenants/available')
  tenants.value = await response.json()
}
```

## 📝 配置说明

### 环境变量

```env
# .env
VITE_API_BASE_URL=/api
```

### 登录 URL 格式

```
# 默认租户登录
http://localhost:3001/api/auth/feishu/login

# 指定租户登录
http://localhost:3001/api/auth/feishu/login?tenant=medical-corp

# 回调 URL
http://localhost:3001/api/auth/feishu/callback?code=xxx&tenant=medical-corp
```

## 🎯 用户体验优化

### 1. 记住上次选择的租户

✅ **已实现**：用户退出后，系统会记住上次使用的租户

### 2. URL 参数指定租户

✅ **已实现**：通过 `?tenant=xxx` 参数可以直接指定租户

### 3. 租户信息展示

✅ **已实现**：登录后显示当前租户名称（紫色标签）

### 4. 一键切换租户

✅ **已实现**：点击"切换"按钮可快速切换到其他租户

## ⚠️ 注意事项

1. **租户 slug 必须与后端一致**
   - 前端：`medical-corp`
   - 后端数据库 tenants.slug：`medical-corp`

2. **白名单验证**
   - 只有在租户的飞书多维表格中的用户才能登录
   - 如果登录失败，检查用户是否在该租户的白名单中

3. **数据隔离**
   - 用户只能看到自己租户的数据
   - JWT Token 包含 `tenantId`，后端自动过滤

4. **退出登录会清除租户信息**
   - 但会保留在 `currentTenant` 中供下次快速登录使用

## 🐛 故障排查

### 问题1：登录后提示"没有权限"

**原因**：用户不在该租户的用户白名单中

**解决**：
1. 检查飞书多维表格中是否有该用户
2. 确认用户状态为 ✅
3. 联系管理员添加到白名单

### 问题2：点击租户后跳转失败

**原因**：租户的 slug 不正确或后端没有该租户

**解决**：
1. 检查浏览器控制台错误
2. 验证后端数据库中是否存在该租户
3. 检查租户的飞书配置是否完整

### 问题3：切换租户后还是显示旧租户的数据

**原因**：Token 未刷新

**解决**：
1. 完全退出登录
2. 重新选择正确的租户登录
3. 清除浏览器缓存（localStorage）

## 🚀 后续计划

- [ ] 从后端API动态加载租户列表
- [ ] 添加租户Logo/图标展示
- [ ] 优化移动端租户选择界面
- [ ] 添加租户使用统计（文章数、成员数等）
- [ ] 支持租户个性化主题色

---

**更新日期**：2025-12-21  
**版本**：v1.0
