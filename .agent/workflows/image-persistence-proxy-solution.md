---
name: image-persistence-proxy-solution
description: 微信图片跨域显示与数据持久化解决方案。解决微信反盗链导致 preview 不可见问题，以及多人协同编辑时的图片丢失问题。
---

# 微信图片代理与持久化解决方案

## 1. 跨域显示问题 (Anti-Hotlinking)

**背景**: 微信图片 `*.qpic.cn` 禁止直接在非微信后台域名下引用展示。

**解决方案**:
1. **拦截接口**: 在 `content-backend/src/article/article.controller.ts` 中实现：
   - `GET /api/articles/proxy-image?url={ENCODED_URL}`。
2. **协议透传**: 后端使用 HTTP 客户端带上 `Referer: https://mp.weixin.qq.com` 请求原始图片并返回。

---

## 2. 数据持久化逻辑 (Persistence)

**背景**: `URL.createObjectURL` 生成的 `blob:` 链接仅在当前会话有效，跨设备或刷新后即失效。

**执行流程：**
1. **保存处理**: 在前端 `Step2` 或 `Step3` 保存草稿前，调用后端保存接口。
2. **URL 转换**: 后端在 `ArticleService.updateStep3` 中将临时链接提取并替换为持久化的代理链接。
3. **隔离机制**: 确保 `main.ts` 中的 `ValidationPipe` 允许 JSONB 数组深层保存。

---

## 3. 跨用户共享

**实现保证：**
- **统一存储**: 文章图片存入 `articles` 表的 `images` 字段，而非本地存储。
- **全局代理**: 前端渲染预览 HTML 时，正则匹配并全局替换为 `/api/wechat-image-proxy/...`。

**检查清单 (Checklist):**
- [ ] 提交保存时，是否移除了 `blob:` 格式？
- [ ] 切换文章 ID 时，Store 状态是否重置？

---

## 相关 Skills 协作
- **后端最佳实践**: 见 `.agent/workflows/nestjs-code-review.md`。
- **Vue 优化**: 见 `.agent/workflows/vue-code-review.md`。

## 参考文献 (References)
- **文档**: `docs/代码修复总结.md`
- **代码位置**: `content-backend/src/article/article.service.ts` -> `updateStep3`
- **代码位置**: `src/views/Step3Preview.vue` -> `saveDraft`
