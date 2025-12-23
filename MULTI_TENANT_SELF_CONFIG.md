# 多租户自助配置方案（最简化）

## 🎯 设计目标

**核心原则**：租户管理员只需**粘贴一个链接**，系统自动完成配置

---

## 📋 使用流程（3步完成）

### 租户 A 的配置流程

```
步骤1: 管理员登录
  ↓
访问 http://localhost:1921
点击"飞书登录"
  ↓
步骤2: 访问租户设置页面
  ↓
访问 http://localhost:1921/settings/tenant
  ↓
步骤3: 粘贴飞书表格链接
  ↓
输入框：https://pcn0utfudhj3.feishu.cn/wiki/Gcnnw2yujiqmxXkv5mTc8cftnMc?table=tblO6V58nUVEQX5U
点击"保存"
  ↓
✅ 配置完成！系统自动提取：
   - app_token: Gcnnw2yujiqmxXkv5mTc8cftnMc
   - table_id: tblO6V58nUVEQX5U
```

### 租户 B，C，D... 流程完全相同

**每个租户独立配置，互不干扰！**

---

## 🏗️ 技术实现

### 后端 API（已创建）

#### 1. 配置人员管理表
```http
POST /api/tenant/config/user-table
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "tableUrl": "https://xxx.feishu.cn/wiki/xxx?table=xxx"
}

响应：
{
  "success": true,
  "message": "人员管理表配置成功",
  "config": {
    "appToken": "Gcnnw2yujiqmxXkv5mTc8cftnMc",
    "tableId": "tblO6V58nUVEQX5U"
  }
}
```

#### 2. 获取当前配置
```http
GET /api/tenant/config
Authorization: Bearer <jwt_token>

响应：
{
  "success": true,
  "config": {
    "userTable": {
      "appToken": "xxx",
      "tableId": "xxx"
    },
    "tenantName": "XX医院",
    "tenantSlug": "hospital-a"
  }
}
```

### 前端页面示例

```vue
<!-- src/views/TenantSettings.vue -->
<template>
  <div class="tenant-settings">
    <h1>租户配置</h1>
    
    <div class="config-section">
      <h2>人员管理表（必需）</h2>
      <p class="hint">
        在飞书创建多维表格，包含列：姓名、岗位、FeishuID<br>
        然后复制表格链接粘贴到下方：
      </p>
      
      <el-input
        v-model="userTableUrl"
        placeholder="https://xxx.feishu.cn/wiki/xxx?table=xxx"
        @blur="configureUserTable"
      />
      
      <div v-if="currentConfig.userTable" class="config-status">
        ✅ 已配置
        <div class="config-details">
          App Token: {{ currentConfig.userTable.appToken }}<br>
          Table ID: {{ currentConfig.userTable.tableId }}
        </div>
      </div>
    </div>

    <div class="config-section">
      <h2>文章管理表（可选）</h2>
      <p class="hint">用于统计文章数据</p>
      
      <el-input
        v-model="articleTableUrl"
        placeholder="https://xxx.feishu.cn/wiki/xxx?table=xxx"
        @blur="configureArticleTable"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '@/utils/api';
import { ElMessage } from 'element-plus';

const userTableUrl = ref('');
const articleTableUrl = ref('');
const currentConfig = ref({});

// 加载当前配置
onMounted(async () => {
  try {
    const res = await api.get('/tenant/config');
    currentConfig.value = res.data.config;
  } catch (error) {
    console.error('加载配置失败', error);
  }
});

// 配置人员管理表
async function configureUserTable() {
  if (!userTableUrl.value) return;
  
  try {
    const res = await api.post('/tenant/config/user-table', {
      tableUrl: userTableUrl.value,
    });
    
    ElMessage.success('人员管理表配置成功！');
    currentConfig.value.userTable = res.data.config;
  } catch (error) {
    ElMessage.error(error.response?.data?.message || '配置失败');
  }
}

// 配置文章管理表
async function configureArticleTable() {
  if (!articleTableUrl.value) return;
  
  try {
    const res = await api.post('/tenant/config/article-table', {
      tableUrl: articleTableUrl.value,
    });
    
    ElMessage.success('文章管理表配置成功！');
    currentConfig.value.articleTable = res.data.config;
  } catch (error) {
    ElMessage.error(error.response?.data?.message || '配置失败');
  }
}
</script>
```

---

## 📊 数据存储

### tenants 表使用 settings 字段

```typescript
// Tenant Entity
@Entity('tenants')
export class Tenant {
  @Column('jsonb', { nullable: true })
  settings: {
    userTable?: {
      appToken: string;
      tableId: string;
      tableUrl: string;
      configuredAt: string;
    };
    articleTable?: {
      appToken: string;
      tableId: string;
      tableUrl: string;
      configuredAt: string;
    };
    // 其他配置...
  };
}
```

**数据示例**：
```json
{
  "userTable": {
    "appToken": "Gcnnw2yujiqmxXkv5mTc8cftnMc",
    "tableId": "tblO6V58nUVEQX5U",
    "tableUrl": "https://pcn0utfudhj3.feishu.cn/wiki/...",
    "configuredAt": "2025-12-21T15:30:00.000Z"
  }
}
```

---

## 🔄 修改 Sync Service 使用租户配置

```typescript
// sync.service.ts
async syncUsersFromBase(tenantId?: string) {
  const client = this.feishuService.getClient();
  
  let appToken: string;
  let tableId: string;
  
  if (tenantId) {
    // 使用租户自己的配置
    const tenant = await this.tenantRepository.findOne({ where: { id: tenantId } });
    const config = tenant.settings?.userTable;
    
    if (!config) {
      throw new Error('租户尚未配置人员管理表');
    }
    
    appToken = config.appToken;
    tableId = config.tableId;
  } else {
    // 使用全局配置（兼容）
    appToken = this.configService.get('FEISHU_USER_BASE_APP_TOKEN');
    tableId = this.configService.get('FEISHU_USER_BASE_TABLE_ID');
  }
  
  // 原有同步逻辑...
  const records = await client.bitable.appTableRecord.list({
    path: { app_token: appToken, table_id: tableId },
  });
  
  // 同步到该租户的 users 表
  for (const record of records.data.items) {
    // ...
  }
}
```

---

## 🎯 完整使用场景

### 场景1: 新租户入驻

```
1. 系统管理员创建租户
   INSERT INTO tenants (name, slug) VALUES ('XX医院', 'hospital-a');

2. 告知租户管理员登录URL
   http://localhost:1921?tenant=hospital-a

3. 租户管理员：
   - 飞书登录
   - 在飞书创建人员管理表格
   - 在系统中粘贴链接
   - 触发同步

4. 租户成员：
   - 直接飞书登录即可使用
```

### 场景2: 多个租户并存

```
租户A（默认租户）
  ├─ 表格: wiki/Gcnnw2yujiqmxXkv5mTc8cftnMc?table=tblO6V58nUVEQX5U
  ├─ 用户: 张三、李四、王五
  └─ 文章: 10篇

租户B（XX医院）
  ├─ 表格: wiki/AAAAbbbbbCCCCC?table=tblYYYYZZZZ
  ├─ 用户: 赵六、孙七
  └─ 文章: 5篇

租户C（YY公司）
  ├─ 表格: wiki/XXXXyyyyZZZZ?table=tblPPPQQQ
  ├─ 用户: 周八、吴九
  └─ 文章: 8篇
```

**完全隔离，互不影响！**

---

## ✅ 优势总结

### 对租户管理员

| 传统方式 | 自助配置方式 |
|---------|------------|
| 联系系统管理员 → 提供表格信息 → 等待配置 → 测试 | 粘贴链接 → 立即完成 |
| **5-10分钟** | **10秒** |

### 对系统管理员

| 传统方式 | 自助配置方式 |
|---------|------------|
| 每个租户都要手动配置 | 无需介入 |
| **每个租户5分钟** | **0分钟** |

### 对开发者

| 传统方式 | 自助配置方式 |
|---------|------------|
| 手动修改数据库 | API自动处理 |
| 容易出错 | 自动验证 |

---

## 🚀 立即使用

### 1. 更新 TenantModule

```typescript
// tenant.module.ts
import { TenantConfigService } from './tenant-config.service';
import { TenantConfigController } from './tenant-config.controller';

@Module({
  controllers: [TenantConfigController],
  providers: [TenantService, TenantConfigService],
  exports: [TenantService, TenantConfigService],
})
export class TenantModule {}
```

### 2. 前端创建配置页面

按照上面的 Vue 示例创建 `src/views/TenantSettings.vue`

### 3. 添加路由

```typescript
// src/router/index.ts
{
  path: '/settings/tenant',
  component: () => import('@/views/TenantSettings.vue'),
  meta: { requiresAuth: true, roles: ['ADMIN'] }
}
```

### 4. 测试

```bash
# 登录后访问
http://localhost:1921/settings/tenant

# 粘贴表格链接
https://pcn0utfudhj3.feishu.cn/wiki/Gcnnw2yujiqmxXkv5mTc8cftnMc?table=tblO6V58nUVEQX5U

# 点击保存
✅ 配置成功！
```

---

## 🎓 总结

**最简化原则实现**：
- ✅ **租户视角**：粘贴1个链接，10秒完成
- ✅ **管理员视角**：无需任何操作
- ✅ **开发者视角**：自动提取，自动验证
- ✅ **可扩展性**：支持无限租户

**这就是最简单的多租户配置方案！** 🎉

需要我帮您实现前端页面吗？
