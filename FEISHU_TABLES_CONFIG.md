# 双飞书多维表格配置说明

## 当前配置分析

### 表格 1: 文章管理表格（当前使用）
```env
FEISHU_BASE_APP_TOKEN=X3kVbw0fRapfjMsIW1AcN2MvnLe
FEISHU_BASE_TABLE_ID=tblz3wXPfgHVmLG0
```

**用途**: 
- 记录文章元数据
- 追踪谁写了哪些文章
- 统计文章数量
- 文章状态管理

**表格结构示例**:
```
| 文章标题 | 作者 | 创建时间 | 状态 | 发布链接 |
|---------|------|---------|------|---------|
| xxx指南 | 张三 | 2024-12-20 | 已发布 | https://... |
```

---

### 表格 2: 人员管理表格（新配置）
```
URL: https://pcn0utfudhj3.feishu.cn/wiki/Gcnnw2yujiqmxXkv5mTc8cftnMc?table=tblO6V58nUVEQX5U

提取信息：
- table_id: tblO6V58nUVEQX5U
- app_token: 需要从完整URL获取
```

**用途**:
- 管理用户白名单
- 控制谁可以登录系统
- 分配用户角色权限

**表格结构示例**:
```
| 姓名 | 岗位 | FeishuID | 状态 |
|------|------|----------|------|
| 张三 | 文案 | ou_abc123 | 启用 |
| 李四 | 策划 | ou_def456 | 启用 |
```

---

## 🔍 如何获取完整的 app_token？

### 方法 1: 从浏览器URL获取
1. 在飞书中打开人员管理表格
2. 查看浏览器地址栏，完整URL格式：
   ```
   https://xxx.feishu.cn/base/[app_token]?table=[table_id]&view=[view_id]
   ```

3. 或者：
   ```
   https://xxx.feishu.cn/wiki/[wiki_id]?table=[table_id]
   ```
   在这种情况下，wiki_id 可能就是 app_token

### 方法 2: 通过表格分享链接
1. 在表格中点击"分享"
2. 获取分享链接
3. 链接中会包含完整的 app_token

### 方法 3: 使用API查询（如果有权限）
```bash
# 列出所有可访问的base
curl -X GET "https://open.feishu.cn/open-api/bitable/v1/apps" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## ⚙️ 推荐的环境变量配置

### .env 更新建议

```env
# ========== 飞书多维表格配置 ==========

# 表格1: 文章管理表（记录文章元数据）
FEISHU_ARTICLE_BASE_APP_TOKEN=X3kVbw0fRapfjMsIW1AcN2MvnLe
FEISHU_ARTICLE_BASE_TABLE_ID=tblz3wXPfgHVmLG0

# 表格2: 人员管理表（用户白名单）
FEISHU_USER_BASE_APP_TOKEN=Gcnnw2yujiqmxXkv5mTc8cftnMc  # 从wiki_id推测
FEISHU_USER_BASE_TABLE_ID=tblO6V58nUVEQX5U

# 兼容旧配置（默认使用文章表）
FEISHU_BASE_APP_TOKEN=${FEISHU_ARTICLE_BASE_APP_TOKEN}
FEISHU_BASE_TABLE_ID=${FEISHU_ARTICLE_BASE_TABLE_ID}
```

---

## 🔄 修改建议

### 1. 更新 SyncService 支持人员表

当前 `sync.service.ts` 使用的是：
```typescript
const appToken = this.configService.get<string>('FEISHU_BASE_APP_TOKEN');
const tableId = this.configService.get<string>('FEISHU_BASE_TABLE_ID');
```

应该改为：
```typescript
const appToken = this.configService.get<string>('FEISHU_USER_BASE_APP_TOKEN');
const tableId = this.configService.get<string>('FEISHU_USER_BASE_TABLE_ID');
```

### 2. 创建独立的文章同步服务

如果需要从飞书表格同步文章元数据，创建新的服务：

```typescript
// article-sync.service.ts
async syncArticlesFromBase() {
  const appToken = this.configService.get('FEISHU_ARTICLE_BASE_APP_TOKEN');
  const tableId = this.configService.get('FEISHU_ARTICLE_BASE_TABLE_ID');
  
  // 从文章管理表读取数据
  const records = await client.bitable.appTableRecord.list({
    path: { app_token: appToken, table_id: tableId },
  });
  
  // 同步到 articles 表（可选）
}
```

---

## 📊 表格用途对比

| 特性 | 文章管理表 | 人员管理表 |
|------|-----------|-----------|
| **用途** | 记录文章元数据 | 管理用户白名单 |
| **同步到** | articles 表（可选） | users 表（必需） |
| **更新频率** | 文章发布时 | 人员变动时 |
| **维护者** | 系统自动/编辑 | HR/管理员 |
| **是否必需** | 可选 | 必需（用于登录） |

---

## 🎯 下一步操作

### 立即行动

1. **确认人员管理表的 app_token**:
   ```
   访问您的飞书表格，复制完整URL
   提取格式: https://xxx.feishu.cn/base/[这里是app_token]
   
   或者 wiki 格式中，wiki_id 可能就是 app_token:
   Gcnnw2yujiqmxXkv5mTc8cftnMc
   ```

2. **更新 .env 配置**:
   ```env
   FEISHU_USER_BASE_APP_TOKEN=<从上面获取>
   FEISHU_USER_BASE_TABLE_ID=tblO6V58nUVEQX5U
   ```

3. **修改 sync.service.ts**:
   将读取配置改为：
   ```typescript
   const appToken = this.configService.get('FEISHU_USER_BASE_APP_TOKEN');
   const tableId = this.configService.get('FEISHU_USER_BASE_TABLE_ID');
   ```

4. **测试同步**:
   ```bash
   curl -X POST http://localhost:3001/api/sync/users
   ```

---

## 💡 建议

**目前看来，您应该：**

1. ✅ **人员管理表**（刚提供的）→ 用于同步 users 表
   - 这是登录白名单，**必需**
   - `sync.service.ts` 应该读取这个表

2. ✅ **文章管理表**（原配置）→ 用于统计/追踪
   - 这是文章元数据，**可选**
   - 可以作为文章统计看板

**所以当前需要做的是：**
把 `sync.service.ts` 改为读取人员管理表，而不是文章管理表。

---

## 📞 需要帮助？

请告诉我：
1. 人员管理表的完整URL（或浏览器地址栏内容）
2. 我帮您提取正确的 app_token
3. 修改代码完成配置

**或者直接告诉我，我帮您修改代码！**
