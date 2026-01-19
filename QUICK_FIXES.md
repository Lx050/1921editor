# 快速修复清单 - 提升到 90+ 分

## 1. Accessibility 快速修复 (89 → 95+)

### A. 添加跳过导航链接
在 `src/App.vue` 中添加：
```vue
<template>
  <a href="#main-content" class="skip-link">跳转到主要内容</a>
  <div id="app">
    <main id="main-content">
      <router-view />
    </main>
  </div>
</template>

<style>
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: #000;
  color: #fff;
  padding: 8px;
  z-index: 100;
}

.skip-link:focus {
  top: 0;
}
</style>
```

### B. 确保所有交互元素有焦点样式
在全局 CSS 中添加：
```css
*:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

button:focus-visible,
a:focus-visible,
select:focus-visible,
input:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}
```

### C. 添加 ARIA 地标
```vue
<div id="app" role="application">
  <header role="banner">
    <!-- 头部内容 -->
  </header>

  <main role="main" id="main-content">
    <router-view />
  </main>

  <footer role="contentinfo">
    <!-- 页脚内容 -->
  </footer>
</div>
```

### D. 修复所有 form-input 关联
```vue
<!-- 错误 ❌ -->
<input v-model="name" placeholder="姓名" />

<!-- 正确 ✅ -->
<label for="name-input">姓名</label>
<input id="name-input" v-model="name" />

<!-- 或者使用 aria-label -->
<input v-model="name" aria-label="姓名" />
```

## 2. Performance 快速修复 (63 → 75+)

### A. 移除 console.log（生产环境）
```javascript
// vite.config.js
export default defineConfig({
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  }
})
```

### B. 优化图片加载
```vue
<!-- 添加 loading="lazy" -->
<img
  :src="imageSrc"
  :alt="imageAlt"
  loading="lazy"
  decoding="async"
  width="800"
  height="600"
/>
```

### C. 预连接关键域名
```html
<!-- index.html -->
<link rel="preconnect" href="https://api.example.com">
<link rel="dns-prefetch" href="https://cdn.example.com">
```

### D. 延迟加载非关键 JS
```javascript
// 延迟加载重型组件
const HeavyComponent = defineAsyncComponent({
  loader: () => import('./HeavyComponent.vue'),
  loadingComponent: LoadingSpinner,
  delay: 200,
  timeout: 3000
})
```

## 3. Best Practices 快速修复 (96 → 99+)

### A. 添加 CSP 头
```html
<!-- index.html -->
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https: http://localhost:1921;
  font-src 'self' data:;
  connect-src 'self' http://localhost:* ws://localhost:*;
">
```

### B. 启用 doctype
```html
<!DOCTYPE html>
<html lang="zh-CN">
<!-- 确保 lang 属性正确 -->
```

### C. 添加视口 meta 标签
```html
<meta name="viewport" content="width=device-width, initial-scale=1">
```

---

## 阶段 2: 深度优化 (1-2 天)

### Performance 深度优化

#### 1. 代码分割优化
```javascript
// vite.config.js
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Vue 核心单独打包
          if (id.includes('/node_modules/vue/')) {
            return 'vue-core';
          }
          // 路由单独打包
          if (id.includes('/src/views/')) {
            const match = id.match(/src\\/views\\/(\w+)/);
            if (match) {
              return `view-${match[1]}`;
            }
          }
          // 大型库按需加载
          if (id.includes('mammoth')) return 'vendor-docx';
          if (id.includes('heic2any')) return 'vendor-heic';
          if (id.includes('jszip')) return 'vendor-zip';
        }
      }
    }
  }
})
```

#### 2. 添加资源提示
```html
<!-- index.html -->
<head>
  <!-- 预加载关键资源 -->
  <link rel="modulepreload" href="/src/main.ts">
  <link rel="modulepreload" href="/src/App.vue">

  <!-- 预连接 API -->
  <link rel="preconnect" href="http://localhost:3001">

  <!-- 预加载字体 -->
  <link rel="preload" as="font" href="/fonts/main.woff2" crossorigin>
</head>
```

#### 3. 使用 Web Workers
```javascript
// workers/image-processor.worker.js
self.importScripts('https://cdn.jsdelivr.net/npm/heic2any@0.0.4/dist/heic2any.min.js');

self.addEventListener('message', async (e) => {
  const { file, type } = e.data;
  try {
    if (type === 'heic') {
      const converted = await heic2any({
        blob: file,
        toType: 'image/jpeg',
        quality: 0.8
      });
      self.postMessage({ success: true, result: converted });
    }
  } catch (error) {
    self.postMessage({ success: false, error: error.message });
  }
});
```

#### 4. 实现虚拟滚动
```vue
<script setup>
import { useVirtualList } from '@vueuse/core'

const items = ref(/* 大量数据 */)

const { list: virtualList, containerProps, wrapperProps } = useVirtualList(
  items,
  { itemHeight: 50, overscan: 10 }
)
</script>
```

---

## 阶段 3: 生产环境优化

### 构建优化配置

```javascript
// vite.config.js - 生产优化
export default defineConfig({
  build: {
    // 压缩配置
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info']
      },
      format: {
        comments: false
      }
    },

    // 代码分割
    rollupOptions: {
      output: {
        manualChunks,
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: '[ext]/[name]-[hash].[ext]'
      }
    },

    // 资源内联限制
    assetsInlineLimit: 4096,

    // 源映射
    sourcemap: false,

    // 目标浏览器
    target: 'es2020'
  },

  // CSS 代码分割
  cssCodeSplit: true,

  // 压缩
  css: {
    devSourcemap: false,
    postcss: './postcss.config.js'
  }
})
```

### 运行生产构建测试

```bash
# 1. 构建生产版本
npm run build

# 2. 预览生产构建
npm run preview

# 3. 对预览 URL 运行 Lighthouse
# 通常是 http://localhost:4173
npx lighthouse http://localhost:4173 --output=html --output-path=./lighthouse-reports/prod.html
```

---

## 预期结果

| 环境 | Performance | Accessibility | Best Practices | SEO |
|------|-------------|---------------|----------------|-----|
| 开发 (当前) | 63-66 | 89 | 96 | 100 |
| 开发 (阶段1后) | 75+ | 95+ | 99 | 100 |
| 生产 (完整优化) | 85-95+ | 95-100 | 100 | 100 |

---

## 监控工具

### 1. 开发环境监控
```bash
# 实时监控 bundle 大小
npm install --save-dev rollup-plugin-visualizer

# vite.config.js
import { visualizer } from 'rollup-plugin-visualizer'
export default defineConfig({
  plugins: [
    visualizer({ open: true })
  ]
})
```

### 2. CI/CD 集成
```yaml
# .github/workflows/lighthouse.yml
name: Lighthouse CI
on: [push]
jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run Lighthouse
        uses: treosh/lighthouse-ci-action@v9
        with:
          urls: |
            https://your-site.com
          uploadArtifacts: true
```
