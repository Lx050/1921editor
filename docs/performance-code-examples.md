# 性能优化代码示例

## 1. 图片优化组件

### 1.1 响应式图片组件
```vue
<!-- src/components/OptimizedImage.vue -->
<template>
  <picture>
    <!-- 现代格式优先 -->
    <source
      :srcset="webpSrcset"
      type="image/webp"
      :media="`(max-width: ${breakpoint}px)`"
      v-if="webpSrc"
    />
    <source
      :srcset="avifSrcset"
      type="image/avif"
      :media="`(max-width: ${breakpoint}px)`"
      v-if="avifSrc"
    />

    <!-- 降级到传统格式 -->
    <img
      :src="src"
      :srcset="srcset"
      :sizes="sizes"
      :alt="alt"
      :loading="lazy ? 'lazy' : 'eager'"
      :width="width"
      :height="height"
      @load="onImageLoad"
      @error="onImageError"
      class="optimized-image"
      :class="{ 'loaded': isLoaded }"
    />
  </picture>
</template>

<script setup lang="ts">
interface Props {
  src: string
  alt: string
  webpSrc?: string
  avifSrc?: string
  width?: number
  height?: number
  lazy?: boolean
  sizes?: string
  breakpoint?: number
}

const props = withDefaults(defineProps<Props>(), {
  lazy: true,
  breakpoint: 768,
  sizes: '100vw'
})

const isLoaded = ref(false)

// 生成响应式srcset
const srcset = computed(() => {
  const widths = [320, 640, 768, 1024, 1280]
  return widths
    .filter(w => w <= (props.width || 1280))
    .map(w => `${props.src}?w=${w} ${w}w`)
    .join(', ')
})

const onImageLoad = () => {
  isLoaded.value = true
}

const onImageError = (e: Event) => {
  // 错误处理，可以显示占位图
  const img = e.target as HTMLImageElement
  img.src = '/images/placeholder.jpg'
}
</script>

<style scoped>
.optimized-image {
  transition: opacity 0.3s ease;
  opacity: 0;
}

.optimized-image.loaded {
  opacity: 1;
}
</style>
```

### 1.2 图片预加载工具
```typescript
// src/utils/imagePreloader.ts
export class ImagePreloader {
  private cache = new Map<string, HTMLImageElement>()

  // 预加载关键图片
  static preloadCriticalImages(urls: string[]): Promise<void[]> {
    return Promise.all(
      urls.map(url => this.preloadImage(url))
    )
  }

  // 预加载单张图片
  static preloadImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image()

      img.onload = () => resolve(img)
      img.onerror = reject

      // 使用低优先级预加载
      img.fetchPriority = 'low'
      img.src = url
    })
  }

  // 智能预加载（根据用户行为）
  static smartPreload(): void {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement
            const src = img.dataset.src
            if (src && !img.src) {
              img.src = src
              observer.unobserve(img)
            }
          }
        })
      },
      { rootMargin: '50px 0px' }
    )

    // 观察所有需要懒加载的图片
    document.querySelectorAll('img[data-src]').forEach(img => {
      observer.observe(img)
    })
  }
}
```

## 2. 关键CSS优化

### 2.1 关键CSS提取器
```typescript
// src/utils/criticalCSS.ts
export class CriticalCSS {
  // 提取首屏关键CSS
  static async extractCritical(): Promise<string> {
    const styles = Array.from(document.styleSheets)
    let criticalCSS = ''

    for (const stylesheet of styles) {
      try {
        const rules = Array.from(stylesheet.cssRules || [])

        for (const rule of rules) {
          if (this.isCriticalRule(rule)) {
            criticalCSS += rule.cssText + '\n'
          }
        }
      } catch (e) {
        console.warn('无法访问 stylesheet:', stylesheet.href)
      }
    }

    return criticalCSS
  }

  // 判断是否为关键CSS规则
  private static isCriticalRule(rule: CSSRule): boolean {
    if (rule.type !== CSSRule.STYLE_RULE) return false

    const styleRule = rule as CSSStyleRule
    const selector = styleRule.selectorText

    // 关键选择器模式
    const criticalPatterns = [
      /^html/, /^body/, /^#app/, // 基础结构
      /\.header/, /\.nav/, /\.hero/, // 首屏组件
      /:hover$/, /:focus$/, // 交互状态
      /@media/ // 响应式媒体查询
    ]

    return criticalPatterns.some(pattern => pattern.test(selector))
  }

  // 内联关键CSS到页面
  static inlineCriticalCSS(css: string): void {
    const style = document.createElement('style')
    style.id = 'critical-css'
    style.textContent = css
    document.head.insertBefore(style, document.head.firstChild)
  }

  // 异步加载非关键CSS
  static loadNonCriticalCSS(href: string): void {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = href
    link.media = 'print'
    link.onload = () => {
      link.media = 'all'
    }
    document.head.appendChild(link)
  }
}
```

### 2.2 CSS优化配置
```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // 分离第三方库CSS
          'vendor-css': ['element-plus/dist/index.css'],
          // 分离组件CSS
          'components-css': [
            './src/components/**/*.vue',
            './src/views/**/*.vue'
          ]
        }
      }
    },
    cssCodeSplit: true, // 启用CSS代码分割
    cssTarget: 'chrome80' // 设置CSS目标
  },
  css: {
    devSourcemap: false, // 生产环境关闭sourcemap
    preprocessorOptions: {
      scss: {
        // 启用CSS压缩
        outputStyle: 'compressed'
      }
    }
  }
})
```

## 3. JavaScript性能优化

### 3.1 代码分割和懒加载
```typescript
// src/utils/lazyLoader.ts
export class LazyLoader {
  // 模块懒加载
  static async loadModule<T>(modulePath: string): Promise<T> {
    const module = await import(/* webpackChunkName: "[request]" */ modulePath)
    return module.default || module
  }

  // 组件懒加载
  static lazyLoadComponent(importFn: () => Promise<any>) {
    return defineAsyncComponent({
      loader: importFn,
      loadingComponent: () => h('div', 'Loading...'),
      errorComponent: () => h('div', 'Error loading component'),
      delay: 200,
      timeout: 5000
    })
  }

  // 路由级别的懒加载
  static createLazyRoutes() {
    return [
      {
        path: '/',
        component: () => import('../views/Home.vue')
      },
      {
        path: '/about',
        component: () => import('../views/About.vue')
      },
      {
        path: '/contact',
        component: () => import('../views/Contact.vue')
      }
    ]
  }
}
```

### 3.2 Web Worker示例
```typescript
// src/workers/imageProcessor.worker.ts
export interface ProcessImageData {
  imageData: ImageData
  options: {
    quality: number
    format: 'webp' | 'jpeg' | 'png'
  }
}

export interface ProcessedResult {
  processedData: ImageData
  size: number
  format: string
}

// 在Worker中处理图片
self.onmessage = async (e: MessageEvent<ProcessImageData>) => {
  const { imageData, options } = e.data

  try {
    // 模拟图片处理
    const processed = await processImage(imageData, options)

    self.postMessage({
      success: true,
      result: processed
    })
  } catch (error) {
    self.postMessage({
      success: false,
      error: error.message
    })
  }
}

async function processImage(
  imageData: ImageData,
  options: ProcessImageData['options']
): Promise<ProcessedResult> {
  // 图片处理逻辑
  return {
    processedData: imageData,
    size: imageData.width * imageData.height * 4,
    format: options.format
  }
}
```

### 3.3 性能监控工具
```typescript
// src/utils/performanceMonitor.ts
export class PerformanceMonitor {
  private static metrics = new Map<string, number>()

  // Core Web Vitals监控
  static observeWebVitals(): void {
    this.observeLCP()
    this.observeFID()
    this.observeCLS()
  }

  // Largest Contentful Paint
  private static observeLCP(): void {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const lastEntry = entries[entries.length - 1]

      this.metrics.set('LCP', lastEntry.renderTime || lastEntry.loadTime)
      this.reportMetric('LCP', this.metrics.get('LCP')!)
    })

    observer.observe({ entryTypes: ['largest-contentful-paint'] })
  }

  // First Input Delay
  private static observeFID(): void {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        this.metrics.set('FID', entry.duration)
        this.reportMetric('FID', entry.duration)
      }
    })

    observer.observe({ entryTypes: ['first-input'] })
  }

  // Cumulative Layout Shift
  private static observeCLS(): void {
    let clsValue = 0
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value
          this.metrics.set('CLS', clsValue)
        }
      }
    })

    observer.observe({ entryTypes: ['layout-shift'] })
  }

  // 自定义性能指标
  static measureMark(name: string, startMark: string, endMark: string): void {
    performance.measure(name, startMark, endMark)
    const measure = performance.getEntriesByName(name)[0]

    if (measure) {
      this.metrics.set(name, measure.duration)
      this.reportMetric(name, measure.duration)
    }
  }

  // 上报性能数据
  private static reportMetric(name: string, value: number): void {
    // 发送到分析服务
    console.log(`[Performance] ${name}: ${value.toFixed(2)}ms`)

    // 可以发送到后端或第三方服务
    // this.sendToAnalytics(name, value)
  }

  // 获取所有性能指标
  static getMetrics(): Record<string, number> {
    return Object.fromEntries(this.metrics)
  }

  // 清除性能指标
  static clearMetrics(): void {
    this.metrics.clear()
  }
}
```

## 4. 缓存策略实现

### 4.1 Service Worker缓存
```typescript
// public/sw.ts
const CACHE_NAME = 'landing-page-v1'
const STATIC_CACHE = 'static-v1'
const DYNAMIC_CACHE = 'dynamic-v1'

// 需要缓存的静态资源
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  // 其他静态资源
]

// 安装事件
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => cache.addAll(STATIC_ASSETS))
  )
})

// 激活事件
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then(keys => {
        return Promise.all(
          keys
            .filter(key => key !== STATIC_CACHE && key !== DYNAMIC_CACHE)
            .map(key => caches.delete(key))
        )
      })
  )
})

// 拦截请求
self.addEventListener('fetch', (event) => {
  const { request } = event

  // 只处理GET请求
  if (request.method !== 'GET') return

  event.respondWith(
    caches.match(request)
      .then(response => {
        // 缓存命中，直接返回
        if (response) {
          return response
        }

        // 网络请求
        return fetch(request)
          .then(response => {
            // 检查是否是有效的响应
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response
            }

            // 克隆响应
            const responseToCache = response.clone()

            // 缓存响应
            caches.open(DYNAMIC_CACHE)
              .then(cache => {
                cache.put(request, responseToCache)
              })

            return response
          })
      })
  )
})
```

### 4.2 智能预取
```typescript
// src/utils/prefetcher.ts
export class SmartPrefetcher {
  private static observer: IntersectionObserver | null = null
  private static prefetched = new Set<string>()

  // 初始化预取
  static init(): void {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const link = entry.target as HTMLElement
            const href = link.getAttribute('data-prefetch')

            if (href && !this.prefetched.has(href)) {
              this.prefetch(href)
              this.prefetched.add(href)
            }
          }
        })
      },
      { rootMargin: '100px' }
    )

    // 观察所有可预取的链接
    document.querySelectorAll('[data-prefetch]').forEach(link => {
      this.observer!.observe(link)
    })
  }

  // 预取资源
  private static prefetch(url: string): void {
    const link = document.createElement('link')
    link.rel = 'prefetch'
    link.href = url

    // 使用低优先级
    link.setAttribute('importance', 'low')

    document.head.appendChild(link)
  }

  // 预取关键页面
  static prefetchCriticalPages(): void {
    const criticalPages = ['/features', '/pricing', '/about']

    criticalPages.forEach(page => {
      if (!this.prefetched.has(page)) {
        this.prefetch(page)
        this.prefetched.add(page)
      }
    })
  }

  // 预取API数据
  static async prefetchData(url: string): Promise<void> {
    try {
      const response = await fetch(url, {
        headers: { 'X-Prefetch': 'true' }
      })

      if (response.ok) {
        // 缓存数据到IndexedDB或内存
        const data = await response.json()
        this.cacheData(url, data)
      }
    } catch (error) {
      console.warn('Prefetch failed:', error)
    }
  }

  // 缓存数据
  private static cacheData(key: string, data: any): void {
    // 实现数据缓存逻辑
    sessionStorage.setItem(`prefetch_${key}`, JSON.stringify(data))
  }
}
```

## 5. 资源优化配置

### 5.1 Vite构建优化
```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],

  build: {
    // 启用压缩
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // 移除console
        drop_debugger: true // 移除debugger
      }
    },

    // 代码分割策略
    rollupOptions: {
      output: {
        manualChunks: {
          // 第三方库分离
          'vendor': ['vue', 'vue-router', 'pinia'],
          'ui': ['element-plus'],
          'utils': ['lodash-es', 'dayjs']
        },

        // 优化文件命名
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name?.split('.') || []
          const ext = info[info.length - 1]

          if (/\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/i.test(assetInfo.name || '')) {
            return `media/[name]-[hash][extname]`
          }

          if (/\.(png|jpe?g|gif|svg)(\?.*)?$/.test(assetInfo.name || '')) {
            return `img/[name]-[hash][extname]`
          }

          if (/\.(woff2?|eot|ttf|otf)(\?.*)?$/i.test(assetInfo.name || '')) {
            return `fonts/[name]-[hash][extname]`
          }

          return `${ext}/[name]-[hash][extname]`
        }
      }
    },

    // 构建目标
    target: 'es2020',

    // 启用CSS代码分割
    cssCodeSplit: true,

    // 资源内联阈值
    assetsInlineLimit: 4096 // 4kb以下内联
  },

  // 开发服务器配置
  server: {
    // 启用压缩
    compress: true,

    // 代理配置
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true
      }
    }
  },

  // 优化选项
  optimizeDeps: {
    include: [
      'vue',
      'vue-router',
      'pinia',
      'element-plus'
    ],
    exclude: ['@iconify/json']
  }
})
```

### 5.2 资源预加载策略
```typescript
// src/main.ts
import { createApp } from 'vue'
import App from './App.vue'

// 预加载关键资源
const preloadCriticalResources = async () => {
  const criticalResources = [
    { url: '/fonts/inter-var.woff2', as: 'font', type: 'font/woff2' },
    { url: '/images/hero-banner.webp', as: 'image' },
    { url: '/js/critical.js', as: 'script' }
  ]

  criticalResources.forEach(resource => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.href = resource.url
    link.as = resource.as

    if (resource.type) {
      link.type = resource.type
    }

    // 字体需要crossorigin
    if (resource.as === 'font') {
      link.crossOrigin = 'anonymous'
    }

    document.head.appendChild(link)
  })
}

// 应用启动
const app = createApp(App)

// 预加载资源
preloadCriticalResources()

// 挂载应用
app.mount('#app')

// 延迟加载非关键资源
setTimeout(() => {
  const nonCriticalScript = document.createElement('script')
  nonCriticalScript.src = '/js/analytics.js'
  nonCriticalScript.async = true
  document.body.appendChild(nonCriticalScript)
}, 2000)
```

这些代码示例涵盖了着陆页性能优化的主要方面，包括图片优化、关键CSS、JavaScript性能、缓存策略和构建优化。可以根据项目需求选择性实施。