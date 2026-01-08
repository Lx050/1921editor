---
name: feishu-oauth-bot-integration
description: 飞书 OAuth 2.0 登录与机器人集成实现流程。涵盖从身份认证到多维表格同步的核心逻辑。当需要实现或调试飞书登录、机器人消息处理、多维表格 (Bitable) 数据同步时使用。集成 NestJS 规范。
---

# 飞书 OAuth & 机器人集成工作流

## 1. 飞书 OAuth 2.0 登录实现

基于飞书官方登录流程，实现企业级身份认证。

**触发示例：**
- "如何实现飞书登录？"
- "调试飞书回调 code 换取 token 流程"
- "用户登录后无法获取 open_id"

**执行流程：**

1.  **后端授权地址生成**: 
    - 逻辑：拼接 `app_id`, `redirect_uri`, `state`。
    - 参考: `content-backend/src/auth/auth.controller.ts` 中的 `getFeishuUrl`。
2.  **前端跳转与回调**: 
    - 页面: `src/views/Home/LandingPage.vue` -> `src/views/LoginCallback.vue`。
3.  **Code 换取 Token**: 
    - 接口: `POST /open-apis/authen/v1/access_token`。
    - 服务: `content-backend/src/auth/auth.service.ts` -> `loginWithFeishu`。

**检查清单 (Checklist):**
- [ ] 飞书后台已配置正确的 Redirect URI（本地调试需使用内网穿透域名）。
- [ ] 后端 `.env` 中 `FEISHU_APP_ID` 和 `FEISHU_APP_SECRET` 正确。
- [ ] **安全**: `state` 参数在前后端是否一致，防止 CSRF 攻击。

---

## 2. 机器人 Webhook 消息处理

实现自动接收飞书消息（如文件上传）并触发业务逻辑。

**执行流程：**

1.  **事件订阅**: 在飞书后台订阅 `im.message.receive_v1` 或 `im.message.file_received`。
2.  **消息验证**: 
    - 校验 `verification_token`。参考: `content-backend/src/webhook/feishu-webhook.service.ts`。
3.  **文件处理**: 
    - 下载流式文件并存入 `uploads/` 目录。

---

## 3. 多维表格 (Bitable) 自动同步

将文章状态实时同步至飞书多维表格。

**关键服务**:
- `ArticleSyncService` (`content-backend/src/sync/article-sync.service.ts`)。
- **并发控制**: 使用 `syncInProgress` 内存锁防止重叠同步。

---

## 相关 Skills 协作
- **代码审查**: 遵循 `.agent/workflows/nestjs-code-review.md` 中的架构规范。
- **数据库同步**: 若涉及表结构变更，使用 `.agent/workflows/typeorm-migration-writer.md`。

## 参考文献 (References)
- **核心源码**: `content-backend/src/auth/`
- **核心源码**: `content-backend/src/sync/`
- **官方文档**: [飞书开发文档 - 服务端 API](https://open.feishu.cn/document/server-docs/getting-started/api-list)
- **配置**: `docs/FEISHU_SYNC_GUIDE.md`
