# 版式装配引擎 - 完整业务流程文档

## 系统架构概览

### 技术栈
- **前端**: Vue 3 + Vite + TypeScript
- **后端**: NestJS + TypeORM + PostgreSQL
- **认证**: JWT + 飞书 OAuth
- **集成**: 飞书机器人 + 微信公众号

---

## 核心业务流程

### 1️⃣ 用户认证流程（飞书登录）

#### 1.1 前端发起登录
```
用户访问 http://localhost:1921
  ↓
点击"飞书登录"按钮
  ↓
前端跳转: GET /api/auth/feishu/login?tenant=default
```

**前端代码位置**: 
- `src/stores/userStore.ts` - `loginWithFeishu()`
- `src/router/index.ts` - 路由守卫

#### 1.2 后端处理授权
```
AuthController.login()
  ↓
重定向到飞书授权页面
  ↓
用户在飞书完成授权
  ↓
飞书回调: GET /api/auth/feishu/callback?code=xxx
```

**后端代码位置**:
- `content-backend/src/auth/auth.controller.ts` - 登录入口
- `content-backend/src/auth/auth.service.ts` - 核心逻辑

#### 1.3 Token 交换与用户验证
```
AuthService.feishuLogin(code, tenantSlug)
  ↓
1. 查找租户 (TenantService)
  ↓
2. 用 code 换取 access_token (飞书 API)
   POST /open-apis/authen/v1/access_token
  ↓
3. 从 token 响应中提取用户信息
   { name, open_id, avatar_url, email }
  ↓
4. 白名单验证 (查询 users 表)
   WHERE tenantId = ? AND feishuId = ?
  ↓
5. 签发 JWT Token
   JwtService.sign({ userId, tenantId, role })
  ↓
6. 重定向到前端
   http://localhost:1921/auth/callback?token=xxx
```

**数据库表**:
- `tenants` - 租户配置
- `users` - 用户白名单

#### 1.4 前端保存 Token
```
AuthCallback.vue
  ↓
从 URL 提取 token
  ↓
保存到 sessionStorage
  ↓
设置 axios 默认 header: Authorization: Bearer xxx
  ↓
跳转到首页
```

**关键文件**:
- `src/views/AuthCallback.vue`
- `src/utils/api.ts` - axios 拦截器

---

### 2️⃣ 文章创建流程（飞书机器人）

#### 2.1 用户上传文件到飞书
```
用户在飞书私聊/群聊中
  ↓
上传 .docx 或 .zip 文件
  ↓
飞书推送事件: im.message.receive_v1
  ↓
POST /api/webhook/feishu
```

**飞书配置**:
- 事件订阅: `im.message.receive_v1`
- 权限: `im:message`, `im:message.file`

#### 2.2 后端接收 Webhook
```
FeishuController.handleEvent()
  ↓
验证签名 (FeishuWebhookGuard)
  ↓
FeishuMessageHandler.handleMessage()
```

**后端代码**:
- `content-backend/src/feishu/feishu.controller.ts`
- `content-backend/src/feishu/feishu-message.handler.ts`
- `content-backend/src/feishu/feishu-webhook.guard.ts`

#### 2.3 文件处理与草稿创建
```
FeishuMessageHandler.handleMessage()
  ↓
1. 提取消息中的文件 (file_key)
  ↓
2. 下载文件到 uploads/ 目录
   GET /open-apis/im/v1/messages/{message_id}/resources/{file_key}
  ↓
3. 解析文件内容
   - .docx: FileParserService.parseDocx()
   - .zip: 解压并提取图片
  ↓
4. 创建草稿文章
   ArticleService.create({
     title: 文件名,
     status: 'DRAFT',
     ownerId: 发送者的 userId
   })
  ↓
5. 发送成功通知
   FeishuService.sendMessage(chatId, {
     msg_type: 'interactive',
     card: { ... 配置链接 }
   })
```

**关键服务**:
- `content-backend/src/feishu/file-parser.service.ts`
- `content-backend/src/article/article.service.ts`

#### 2.4 用户收到通知
```
飞书消息卡片
  ↓
显示: "文章草稿已创建"
  ↓
点击"配置文章"按钮
  ↓
跳转: http://localhost:1921/articles/{id}/config
```

---

### 3️⃣ 文章编辑流程（前端三步骤）

#### Step 1: 样式配置
```
Step1TextInput.vue
  ↓
用户配置:
  - 主题色
  - 字体大小
  - 段落间距
  - 图片样式
  ↓
PUT /api/articles/:id/config
  ↓
ArticleService.updateStep1(id, config)
```

**前端组件**:
- `src/views/Step1TextInput.vue`
- `src/components/StyleConfig.vue`

#### Step 2: 内容编辑
```
Step2Curtain.vue
  ↓
用户编辑:
  - 文本内容
  - 图片上传
  - 排版调整
  ↓
PUT /api/articles/:id/content
  ↓
ArticleService.updateStep2(id, content)
```

**前端组件**:
- `src/views/Step2Curtain.vue`

#### Step 3: 预览与发布
```
Step3Preview.vue
  ↓
实时预览渲染后的 HTML
  ↓
用户点击"发布到微信"
  ↓
POST /api/articles/:id/publish
  ↓
ArticleService.publish(id)
  ↓
返回微信文章链接
```

**前端组件**:
- `src/views/Step3Preview.vue`

---

### 4️⃣ 微信发布流程（企业授权）

#### 4.1 企业微信授权（待实现）
```
管理员访问授权页面
  ↓
扫码授权企业微信
  ↓
保存 access_token 到租户配置
```

**数据库字段**:
- `tenants.wechatAppId`
- `tenants.wechatAppSecret`

#### 4.2 发布到微信公众号
```
ArticleService.publish(id)
  ↓
1. 获取文章内容
  ↓
2. 转换为微信格式
   - 图片上传到微信 CDN
   - HTML 转为微信支持的样式
  ↓
3. 调用微信 API
   POST /cgi-bin/draft/add
  ↓
4. 保存发布结果
   article.wechatResult = { url, media_id }
```

**待实现服务**:
- `content-backend/src/wechat/wechat.service.ts`

---

## 数据库设计

### 核心表结构

#### tenants (租户表)
```sql
id: UUID (主键)
name: VARCHAR (租户名称)
slug: VARCHAR (唯一标识)
feishuAppId: VARCHAR (飞书应用ID)
feishuAppSecret: VARCHAR (飞书应用密钥)
wechatAppId: VARCHAR (微信AppID)
wechatAppSecret: VARCHAR (微信密钥)
isActive: BOOLEAN (是否启用)
```

#### users (用户表)
```sql
id: UUID (主键)
tenantId: UUID (外键 -> tenants)
feishuId: VARCHAR (飞书 OpenID)
name: VARCHAR (用户名)
role: ENUM (ADMIN, EDITOR, VIEWER)
email: VARCHAR
```

**唯一索引**: `(tenantId, feishuId)`

#### articles (文章表)
```sql
id: UUID (主键)
ownerId: UUID (外键 -> users)
title: VARCHAR (标题)
content: TEXT (内容)
config: JSONB (样式配置)
images: JSONB (图片列表)
status: ENUM (DRAFT, PARSED, ADJUSTED, PUBLISHED)
wechatResult: JSONB (发布结果)
createdAt: TIMESTAMP
updatedAt: TIMESTAMP
```

---

## API 端点总览

### 认证相关
- `GET /api/auth/feishu/login` - 发起飞书登录
- `GET /api/auth/feishu/callback` - 飞书回调

### 文章管理
- `POST /api/articles` - 创建文章
- `GET /api/articles` - 获取文章列表
- `GET /api/articles/:id` - 获取文章详情
- `PUT /api/articles/:id/config` - 更新配置
- `PUT /api/articles/:id/content` - 更新内容
- `PUT /api/articles/:id/images` - 更新图片
- `POST /api/articles/:id/publish` - 发布到微信
- `DELETE /api/articles/:id` - 删除文章

### Webhook
- `POST /api/webhook/feishu` - 飞书事件回调

---

## 环境变量配置

### 后端 (.env)
```env
# 数据库
DATABASE_URL=postgresql://user:pass@localhost:5433/dbname

# JWT
JWT_SECRET=your-secret-key

# 飞书全局配置
FEISHU_APP_ID=cli_xxx
FEISHU_APP_SECRET=xxx
FEISHU_VERIFICATION_TOKEN=xxx

# 前端地址
FRONTEND_URL=http://localhost:1921
CORS_ORIGIN=http://localhost:1921,http://localhost:5173
```

### 前端 (vite.config.js)
```javascript
server: {
  port: 1921,
  proxy: {
    '/api': {
      target: 'http://localhost:3001',
      changeOrigin: true
    }
  }
}
```

---

## 安全机制

### 1. 认证与授权
- ✅ JWT Token 验证
- ✅ 租户隔离（多租户）
- ✅ 用户白名单机制
- ✅ 飞书 Webhook 签名验证

### 2. 数据隔离
- ✅ 每个租户独立的用户列表
- ✅ 文章按 ownerId 过滤
- ✅ 外键约束保证数据完整性

### 3. 文件安全
- ✅ 路径遍历防护（Path Traversal）
- ✅ 文件类型验证
- ✅ 文件大小限制（待实现）

---

## 待优化项

### 功能层面
- [ ] 微信公众号授权与发布
- [ ] 文章协作编辑
- [ ] 版本历史管理
- [ ] 图片 CDN 集成

### 性能层面
- [ ] Redis 缓存 Token
- [ ] 图片压缩与优化
- [ ] 数据库查询优化
- [ ] 前端资源懒加载

### 安全层面
- [ ] Rate Limiting
- [ ] CSRF 防护
- [ ] XSS 过滤
- [ ] 敏感信息加密

---

**文档版本**: v1.0  
**最后更新**: 2025-12-21  
**维护者**: 梁博星
