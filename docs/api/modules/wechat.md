# 微信模块 (Wechat Module)

## 模块职责
负责微信第三方平台 (Standard Flow B) 的授权管理、公众号令牌维护、素材上传、草稿创建以及图片代理功能。

## 架构设计
- **Controller:** `src/wechat/wechat.controller.ts` - 暴露授权回调、预授权码生成、素材上传及图片代理接口。
- **Service:** `src/wechat/wechat.service.ts` - 封装了微信 API 调用逻辑、令牌刷新机制及数据库交互。
- **Entity:**
  - `src/entities/wechat-authorizer.entity.ts` - 存储已授权公众号的令牌 (Access/Refresh Token) 及基本信息 (昵称、头像)。
  - `src/entities/wechat-platform-config.entity.ts` - 存储第三方平台的全局配置 (ComponentVerifyTicket, ComponentAccessToken)。
- **Module:** `src/wechat/wechat.module.ts` - 模块定义，注入了 `HttpModule` 及相关 Repository。

## 核心功能

### 1. 第三方平台授权 (Standard Flow B)
- **预授权码生成:** `wechat.service.ts:getPreAuthCode()` (第 66 行) - 获取引导用户扫码所需的临时凭证。
- **授权码换取令牌:** `wechat.service.ts:exchangeAuthCode()` (第 86 行) - 用户扫码回调后，通过 `auth_code` 换取并持久化公众号的授权信息。
- **账号解约:** `wechat.service.ts:removeAuth()` (第 263 行) - 在本系统中逻辑禁用 (isActive=false) 特定的公众号授权。

### 2. 令牌自动刷新机制
- **平台令牌刷新:** `wechat.service.ts:getComponentAccessToken()` (第 29 行) - 基于 `ComponentVerifyTicket` 自动刷新第三方平台令牌。
- **公众号令牌刷新:** `wechat.service.ts:getAuthorizerAccessToken()` (第 131 行) - 在调用业务接口前检查 `authorizer_access_token` 是否过期，若过期则使用 `refresh_token` 自动续期。

### 3. 内容同步与素材管理
- **图片上传:** `wechat.service.ts:uploadImage()` (第 235 行) - 将本地图片上传至微信服务器，获取 `url` 用于图文插图。
- **草稿创建:** `wechat.service.ts:createDraft()` (第 246 行) - 将组装好的图文数据发送至微信草稿箱。

### 4. 稳定性优化
- **VerifyTicket 接收:** `wechat.controller.ts:receiveTicket()` (第 45 行) - 兼容 XML 和明文模式接收微信每 10 分钟推送一次的安全票据。
- **图片代理流:** `wechat.service.ts:getProxyImageStream()` (第 279 行) - 伪造 `Referer` 头请求微信图片，绕过防盗链保护，确保预览区图片正常显示。

## 数据库关联
- **主表:** `wechat_authorizer` - 关联 `tenant` (租户)，实现多租户隔离。
- **配置表:** `wechat_platform_config` - 全局单表，存储平台级敏感信息。

## 接口文档
详细接口定义请参考后端 Swagger 文档：`http://localhost:3001/api/docs` (Wechat Tags)
