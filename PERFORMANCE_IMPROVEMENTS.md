# Lighthouse 性能优化方案

## 当前分数
- Performance: 63-66
- Accessibility: 89
- Best Practices: 96
- SEO: 100

## 待修复问题

### Performance (主要问题)

#### 1. LCP 过大 (9.9s → 目标 < 2.5s)

**问题：**
- Largest Contentful Paint 仍然过大
- 主要原因：未优化的 JavaScript 和 CSS

**解决方案：**

##### A. 添加关键资源预加载
```html
<!-- 在 index.html 中添加 -->
<link rel="preload" href="/src/main.ts" as="script">
<link rel="modulepreload" href="/src/App.vue">
```

##### B. 优化首屏加载
```javascript
// vite.config.js - 添加 preload 配置
build: {
  rollupOptions: {
    output: {
      experimentalMinChunkSize: 10000,
    }
  }
}
```

##### C. 添加 Service Worker 缓存策略
```javascript
// public/sw.js - 添加静态资源缓存
const CACHE_NAME = 'v1';
const urlsToCache = [
  '/',
  '/src/main.ts',
  '/src/App.vue'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});
```

#### 2. 未使用的 JavaScript (302 KB)

**问题库：**
- chunk-HYSUWUZI.js: 186 KB
- axios.js: 54 KB
- pinia.js: 34 KB
- vue-router.js: 33 KB

**解决方案：**

##### A. 按路由拆分代码
```javascript
// router/index.ts - 确保懒加载正确配置
const routes = [
  {
    path: '/step1',
    component: () => import(/* webpackChunkName: "step1" */ '../views/Step1TextInput.vue')
  },
  {
    path: '/step2',
    component: () => import(/* webpackChunkName: "step2" */ '../views/Step2Curtain.vue')
  }
]
```

##### B. 动态导入大型库
```javascript
// 不要在顶部导入
import mammoth from 'mammoth' // ❌

// 使用动态导入
const loadMammoth = async () => {
  const mammoth = await import('mammoth')
  return mammoth.default
}
```

#### 3. 减少 Total Blocking Time

**解决方案：**

##### A. 使用 Web Workers 处理重计算
```javascript
// workers/docx-processor.js
self.addEventListener('message', async (e) => {
  const { file } = e.data
  // 在 worker 中处理文档
  const result = await processDocx(file)
  self.postMessage(result)
})

// 在组件中使用
const worker = new Worker('/workers/docx-processor.js', { type: 'module' })
worker.postMessage({ file })
```

##### B. 代码分割优化
```javascript
// vite.config.js
build: {
  rollupOptions: {
    output: {
      manualChunks(id) {
        // 将大型依赖分离到单独的 chunk
        if (id.includes('mammoth')) {
          return 'vendor-docx'
        }
        if (id.includes('heic2any')) {
          return 'vendor-image'
        }
        if (id.includes('jszip')) {
          return 'vendor-zip'
        }
      }
    }
  }
}
```

### Accessibility (当前 89 → 目标 99+)

#### 剩余问题：
1. 1 个颜色对比度问题
2. 1 个 select 元素缺少标签

#### 解决方案：

##### A. 修复颜色对比度
```css
/* 将 text-cyan-600 改为 text-cyan-700 */
.text-cyan-600 {
  color: #0891b2; /* 对比度 3.9:1 - 不合格 */
}

.text-cyan-700 {
  color: #0e7490; /* 对比度 4.6:1 - 合格 */
}
```

##### B. 为 Select 添加标签
```vue
<!-- 找到剩余的 select 元素并添加 label -->
<div class="relative mt-4">
  <label for="compression-level" class="sr-only">压缩级别</label>
  <select
    id="compression-level"
    v-model="compression"
    aria-label="选择图片压缩级别"
    class="px-3 py-2 border rounded-lg"
  >
    <option value="low">低</option>
    <option value="medium">中</option>
    <option value="high">高</option>
  </select>
</div>
```

##### C. 添加跳过导航链接
```vue
<!-- 在 App.vue 中添加 -->
<a href="#main-content" class="sr-only focus:not-sr-only">
  跳转到主要内容
</a>

<main id="main-content">
  <!-- 主要内容 -->
</main>

<style>
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.sr-only-focus {
  position: fixed;
  top: 10px;
  left: 10px;
  z-index: 9999;
  padding: 10px;
  background: white;
  border: 2px solid blue;
}
</style>
```

### Best Practices (当前 96 → 目标 99+)

#### 可能的问题：

##### A. 添加 HTTPS 提示
```html
<!-- 在生产环境确保使用 HTTPS -->
<meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">
```

##### B. 添加 CSP 头
```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  font-src 'self' data:;
">
```

##### C. 启用浏览器缓存
```javascript
// vite.config.js - 添加缓存策略
build: {
  rollupOptions: {
    output: {
      assetFileNames: 'assets/[name].[hash].[ext]'
    }
  }
}
```

## 优先级排序

### 高优先级 (立即执行)
1. ✅ 修复剩余的颜色对比度问题
2. ✅ 为 select 元素添加标签
3. ✅ 优化首屏加载 - 移除不必要的导入

### 中优先级 (本周完成)
1. 实现更细粒度的代码分割
2. 添加 Service Worker 缓存
3. 使用 Web Workers 处理重计算

### 低优先级 (长期优化)
1. 图片懒加载和优化
2. 字体优化 (使用 system fonts)
3. CDN 配置优化

## 生产环境优化

以上优化在开发模式下效果有限。**强烈建议**在生产构建后测试：

```bash
npm run build
npm run preview
# 然后对 http://localhost:4173 运行 Lighthouse
```

生产构建通常会带来：
- 30-50% 的性能提升
- 更小的 bundle 体积
- 更快的加载速度
