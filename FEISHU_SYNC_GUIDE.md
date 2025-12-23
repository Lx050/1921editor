# 飞书多维表格配置指南

## ✅ 配置完成

系统现在使用**两个独立的飞书多维表格**：

---

## 📋 表格 1: 人员管理表（必需）⭐

### 用途
管理系统登录白名单 - 控制谁可以登录系统

### 环境变量
```env
FEISHU_USER_BASE_APP_TOKEN=Gcnnw2yujiqmxXkv5mTc8cftnMc
FEISHU_USER_BASE_TABLE_ID=tblO6V58nUVEQX5U
```

### 表格URL
```
https://pcn0utfudhj3.feishu.cn/wiki/Gcnnw2yujiqmxXkv5mTc8cftnMc?table=tblO6V58nUVEQX5U
```

### 表格结构要求
需要包含以下列（列名可使用中文或英文）：

| 列名（中文） | 列名（英文） | 必需 | 说明 | 示例 |
|------------|------------|------|------|------|
| 姓名 | Name / name | ✅ | 用户姓名 | 张三 |
| 岗位 | Role / role | ✅ | 用户角色 | 文案 / 策划 |
| FeishuID | FeishuID / OpenID / ID | ✅ | 飞书OpenID | ou_abc123... |

### 角色映射
```typescript
岗位列值 → 系统角色
"文案"    → COPYWRITER
"策划"    → PLANNER
其他      → EDITOR（默认）
```

### 如何获取 FeishuID？

**方法 1: 查看登录失败日志**
```
用户首次登录失败时，后端日志会显示：
[AuthService] ❌ 用户不在白名单中
[AuthService] 用户 OpenID: ou_b3621aab085726884c90f58fec27db7f

将这个 OpenID 填入表格的 FeishuID 列
```

**方法 2: 让用户自助查询**
```
访问: http://localhost:1921/my-feishu-id
（需要先实现这个页面）
```

### 同步流程
```
HR在飞书表格中添加/修改人员
  ↓
管理员触发同步: POST /api/sync/users
  ↓
系统读取表格数据
  ↓
自动创建/更新 users 表
  ↓
用户可以登录系统
```

---

## 📊 表格 2: 文章管理表（可选）

### 用途
记录文章元数据 - 统计和追踪文章信息

### 环境变量
```env
FEISHU_ARTICLE_BASE_APP_TOKEN=X3kVbw0fRapfjMsIW1AcN2MvnLe
FEISHU_ARTICLE_BASE_TABLE_ID=tblz3wXPfgHVmLG0
```

### 表格结构建议

| 文章标题 | 作者 | 创建时间 | 发布状态 | 微信链接 | 阅读量 |
|---------|------|---------|---------|---------|--------|
| xxx指南 | 张三 | 2024-12-21 | 已发布 | https://... | 1000 |

### 同步方式
**暂未实现自动同步**（可选功能）

如需实现，可以：
1. 文章发布时自动写入表格
2. 定时从表格读取统计数据
3. 用于数据分析和报表

---

## 🔄 使用说明

### 1. 初始化人员白名单

**步骤 1**: 在飞书人员管理表中添加用户
```
姓名: 张三
岗位: 文案
FeishuID: ou_abc123456...
```

**步骤 2**: 触发同步（后台需运行）
```bash
# Windows PowerShell
Invoke-WebRequest -Uri "http://localhost:3001/api/sync/users" -Method POST

# 或访问浏览器
http://localhost:3001/api/sync/users  (POST)
```

**步骤 3**: 查看同步日志
```
后端控制台会显示：
[SyncService] Starting User Sync from Feishu Base...
[SyncService] Found 3 records in Base.
[SyncService] Processing: name=张三, role=文案, id=ou_abc123...
[SyncService] User Sync Completed.
```

**步骤 4**: 验证数据库
```sql
SELECT * FROM users;
```

### 2. 用户登录流程
```
1. 用户访问 http://localhost:1921
2. 点击"飞书登录"
3. 飞书授权
4. 系统验证：
   - FeishuID 在 users 表中？✅
   - 签发 JWT Token
   - 登录成功
```

---

## 🔍 常见问题

### Q1: 同步失败，提示找不到表格
**A**: 检查 app_token 是否正确
```bash
# 访问飞书表格，从URL获取正确的token
https://xxx.feishu.cn/base/[这里是app_token]?table=[这里是table_id]

# 或者 wiki 格式：
https://xxx.feishu.cn/wiki/[wiki_id]?table=[table_id]
# wiki_id 可能就是 app_token
```

### Q2: 用户登录失败，提示不在白名单
**A**: 两步排查
1. 确认用户的 FeishuID 已添加到表格
2. 运行同步：`POST /api/sync/users`
3. 检查数据库：`SELECT * FROM users WHERE "feishuId" = 'ou_xxx';`

### Q3: 如何批量导入用户？
**A**: 在飞书表格中：
1. 复制粘贴 Excel 数据
2. 或使用飞书表格的导入功能
3. 运行一次同步即可

### Q4: 离职人员如何处理？
**A**: 两种方式
1. **软删除**：在表格中删除该行，下次同步会保留数据库记录（当前实现）
2. **硬删除**：修改代码实现自动删除不在表格中的用户

---

## ⚙️ 高级配置

### 定时自动同步（可选）
```typescript
// 在 sync.service.ts 中添加
import { Cron } from '@nestjs/schedule';

@Cron('0 2 * * *')  // 每天凌晨2点
async scheduledSync() {
  await this.syncUsersFromBase();
}
```

### 同步 Webhook（可选）
```typescript
// 表格修改时自动触发同步
@Post('webhook/table-change')
async handleTableChange(@Body() event) {
  await this.syncUsersFromBase();
}
```

---

## 📞 技术支持

如遇问题：
1. 查看后端日志：控制台输出
2. 检查 .env 配置
3. 验证表格列名是否正确
4. 确认表格权限（应用需要读取权限）

---

**文档更新**: 2025-12-21  
**状态**: ✅ 已配置完成
