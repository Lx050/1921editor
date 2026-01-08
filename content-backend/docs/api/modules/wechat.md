# 微信模块架构文档 (Wechat Module)

## 模块职责
负责对接微信第三方平台 (开放平台)，实现通过“扫码授权”方式管理租户的微信公众号，并提供图片上传、草稿创建等核心发布功能。

## 架构设计
- **Controller:** `src/wechat/wechat.controller.ts` - 处理授权回调、票据接收及前端发布请求
- **Service:** `src/wechat/wechat.service.ts` - 封装微信 API 调用逻辑、令牌刷新机制及多租户授权逻辑
- **Entities:** 
  - `src/entities/wechat-authorizer.entity.ts` - 存储租户授权公众号的令牌与基本信息
  - `src/entities/wechat-platform-config.entity.ts` - 存储第三方平台全局配置 (如 VerifyTicket)
- **Module:** `src/wechat/wechat.module.ts` - 模块定义与依赖注入配置

## 核心功能

### 1. 第三方平台授权流 (Flow B)
- **实现位置:** `wechat.service.ts:getPreAuthCode()` / `exchangeAuthCode()`
- **设计说明:** 
  - 系统作为“第三方平台”运行，通过微信推送的 `ComponentVerifyTicket` 获取 `ComponentAccessToken`。
  - 用户在前端触发生成的 `pre_auth_code` 跳转至微信授权页。
  - 授权成功后通过回调换取 `authorizer_access_token` 并持久化。

### 2. 令牌自动刷新机制
- **实现位置:** `wechat.service.ts:getAuthorizerAccessToken()` (第 145 行)
- **设计说明:** 在每次调用微信业务接口前检查 `authorizer_access_token` 是否过期，若过期则使用 `refresh_token` 自动续期。

### 3. 多租户发布接口
- **实现位置:** `wechat.controller.ts:uploadImage()` / `createDraft()`
- **设计说明:** 接口通过 `JwtAuthGuard` 自动识别 `tenantId`，服务层根据租户 ID 检索对应的已授权公众号令牌进行发布操作。

## 数据库关联
- **wechat_authorizers:** 存储 AppID、令牌、过期时间及公众号名称/头像。
- **wechat_platform_config:** 存储第三方平台运行所需的全局票据。

## 接口文档
详细接口参数和返回值见自动生成的 API 文档：`docs/api/README.md` 或 Swagger UI (`/api-docs`)。
