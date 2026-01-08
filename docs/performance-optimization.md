# 前端性能分析与优化指南

## 概述

本文档提供了使用 Lighthouse 分析和优化前端应用性能的指南。

## 使用方法

### 1. 开发环境分析

确保开发服务器正在运行：
```bash
npm run dev
```

然后运行性能分析：
```bash
# 详细分析（推荐）
npm run lighthouse

# 快速分析
npm run lighthouse:quick
```

### 2. 生产环境分析

构建生产版本：
```bash
npm run build
npm run preview
```

然后运行分析：
```bash
# 分析生产版本
npx lighthouse http://localhost:4173 --output=html --output-path=./lighthouse-reports/production-report.html
```

## Lighthouse 性能指标解读

### 核心性能指标 (Core Web Vitals)

1. **LCP (Largest Contentful Paint)**
   - **目标**: < 2.5 秒
   - **含义**: 最大内容绘制时间，衡量加载性能
   - **优化建议**:
     - 优化服务器响应时间
     - 使用 CDN
     - 优化图片资源（使用 WebP、懒加载）
     - 预加载关键资源

2. **FID (First Input Delay)**
   - **目标**: < 100 毫秒
   - **含义**: 首次输入延迟，衡量交互性
   - **优化建议**:
     - 减少主线程工作
     - 使用 Web Workers
     - 优化 JavaScript 执行

3. **CLS (Cumulative Layout Shift)**
   - **目标**: < 0.1
   - **含义**: 累积布局偏移，衡量视觉稳定性
   - **优化建议**:
     - 为图片和视频设置尺寸属性
     - 为动态内容预留空间
     - 避免在现有内容上方插入内容

### 其他重要指标

1. **FCP (First Contentful Paint)**
   - **目标**: < 1.8 秒
   - **优化建议**:
     - 减少 JavaScript 阻塞
     - 使用 HTTP/2
     - 优化 CSS 交付

2. **TTI (Time to Interactive)**
   - **目标**: < 3.8 秒
   - **优化建议**:
     - 延迟加载非关键 JavaScript
     - 代码分割
     - 使用 tree-shaking

3. **Speed Index**
   - **目标**: < 3.4 秒
   - **含义**: 内容可见速度
   - **优化建议**:
     - 优化关键渲染路径
     - 减少服务器响应时间

## 针对本项目的优化建议

### 1. 代码优化

- **Vue 组件懒加载**:
  ```typescript
  const routes = [
    {
      path: '/step1',
      component: () => import('../views/Step1TextInput.vue')
    }
  ];
  ```

- **图片优化**:
  - 使用 WebP 格式
  - 实现懒加载
  - 添加适当的尺寸属性

- **代码分割**:
  ```typescript
  // vite.config.js
  export default defineConfig({
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['vue', 'vue-router', 'pinia'],
            utils: ['dompurify', 'mammoth', 'jszip']
          }
        }
      }
    }
  });
  ```

### 2. 资源优化

- **CSS 优化**:
  - 使用 PurgeCSS 移除未使用的样式
  - 内联关键 CSS

- **JavaScript 优化**:
  - 启用 tree-shaking
  - 使用动态导入

- **字体优化**:
  - 使用 font-display: swap
  - 预加载关键字体

### 3. 运行时优化

- **虚拟滚动**: 对于长列表数据
- **防抖和节流**: 减少频繁操作
- **使用缓存策略**: 减少重复请求

## 自动化性能监控

### 1. CI/CD 集成

在 GitHub Actions 中添加性能检查：

```yaml
- name: Run Lighthouse CI
  uses: treosh/lighthouse-ci-action@v9
  with:
    configPath: './lighthouse.config.js'
    uploadArtifacts: true
    temporaryPublicStorage: true
```

### 2. 性能预算

在 `lighthouse.config.js` 中设置性能预算：

```javascript
module.exports = {
  settings: {
    budgets: [
      {
        path: '/*.js',
        maxSize: 250 * 1024, // 250KB
      },
      {
        path: '/*.css',
        maxSize: 50 * 1024, // 50KB
      }
    ]
  }
};
```

## 性能优化检查清单

- [ ] 图片已优化（WebP、懒加载）
- [ ] 代码已分割
- [ ] 关键资源已预加载
- [ ] CSS 关键路径已优化
- [ ] JavaScript 非阻塞渲染
- [ ] 使用了适当的缓存策略
- [ ] 服务器响应时间 < 200ms
- [ ] 使用 CDN 分发内容
- [ ] 启用了 Gzip/Brotli 压缩
- [ ] 减少了第三方脚本

## 常见问题解决

### Q: Lighthouse 得分低但实际体验良好？
A: Lighthouse 是模拟的 3G 网络和 Moto G4 设备。确保在真实设备上测试。

### Q: 性能得分不稳定？
A: 进行多次测试取平均值。使用 `--quiet` 和 `--chrome-flags="--headless"` 获得更一致的结果。

### Q: 如何平衡功能和性能？
A:
1. 优先优化 Core Web Vitals
2. 使用性能预算约束
3. 渐进式加载非关键功能
4. 对功能进行成本效益分析

## 参考资源

- [Lighthouse 官方文档](https://developer.chrome.com/docs/lighthouse/)
- [Web.dev 性能指南](https://web.dev/performance/)
- [Core Web Vitals](https://web.dev/vitals/)
- [Vue 性能优化指南](https://vuejs.org/guide/best-practices/performance.html)