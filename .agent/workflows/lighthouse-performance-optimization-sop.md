---
name: lighthouse-performance-optimization-sop
description: 2025 版 Lighthouse 性能优化标准作业程序 (SOP)。专为 Vue 3 + Vite + NestJS 项目定制，涵盖 LCP、INP、CLS 调优及自动化性能预算。
---

# Lighthouse 性能优化 SOP (2025)

## 1. 建立评估基准 (Baseline)

在执行优化前，必须运行标准化的生产性能测试。

**常用命令：**
```bash
# 1. 生产构建
npm run build
# 2. 本地预览
npm run preview
# 3. Lighthouse 测试 (手机模式模拟)
npx lighthouse http://localhost:4173 --output=html --output-path=./lighthouse-reports/audit_v1.html --form-factor=mobile --screenEmulation.disabled
```

---

## 2. 关键性能指标 (CWV) 调优

### LCP (Largest Contentful Paint) - 加载速度
- 优化静态资源响应：使用 `Vite` 的 `manualChunks` 将第三方库分包。
- 关键图片预加载：在 `App.vue` 或 `ResourcePreloader.vue` 实现 `<link rel="preload">`。

### INP (Interaction to Next Paint) - 相应灵敏度
- **并行化 (Parallelization)**：在 `Step3Preview.vue` 的 `saveDraft` 中使用 `Promise.all` 替代串行 `await`。
- **长任务拆分**：将复杂的文档解析（mammoth）放在 `Web Worker` 中。

### CLS (Cumulative Layout Shift) - 视觉稳定性
- 为所有已加载图片显式设置 `aspect-ratio`。
- 采用骨架屏 (Skeleton Screen) 替代全屏加载 Loading。

---

## 3. Vite 进阶配置

1.  **资源压缩**: 检查是否安装并启用了 `vite-plugin-compression2` (Gzip/Brotli)。
2.  **代码树摇 (Tree Shaking)**: 确保所有工具函数（API、Parser）导出遵循 ES Module 规范。

---

## 相关 Skills 协作
- **性能审查**: 请查阅 `.agent/workflows/vue-code-review.md` 中的“性能优化审查”清单。
- **环境评估**: 请查阅 `.agent/workflows/lighthouse-performance-optimization-sop.md` (当前文件)。

## 参考文献 (References)
- **文档**: `docs/performance-optimization.md`
- **文档**: `docs/advanced-performance-optimization.md`
- **配置**: `vite.config.ts`
- **线上工具**: [PageSpeed Insights](https://pagespeed.web.dev/)
