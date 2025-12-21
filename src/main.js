import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

// 导入 Element Plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

// 导入样式文件
import './styles/main.css'
import './styles/compatibility.css'
import './styles/loader.css'

// 性能监控（开发环境） - 暂时禁用
// if (import.meta.env.DEV) {
//   import('./utils/performanceDashboard').then(({ initPerformanceMonitoring }) => {
//     initPerformanceMonitoring({
//       thresholds: {
//         lcp: 2500,
//         fid: 100,
//         cls: 0.1,
//         fcp: 1800,
//         ttfb: 600
//       },
//       reportUrl: '/api/performance',
//       enableResourceTiming: true,
//       enableUserTiming: true,
//       enableLongTask: true
//     })
//   })
// }

// 关键CSS优化 - 暂时禁用
// import('./utils/criticalCSS').then(({ CriticalCSS }) => {
//   CriticalCSS.init().catch(console.warn)
// })

// 资源预加载优化 - 暂时禁用
// import('./utils/resourcePreloader').then(({ ResourcePreloader }) => {
//   // 预连接到常用域名
//   ResourcePreloader.preconnect([
//     'https://fonts.googleapis.com',
//     'https://fonts.gstatic.com'
//   ])

//   // DNS预解析
//   ResourcePreloader.dnsPrefetch([
//     'https://api.weixin.qq.com'
//   ])
// })

// Service Worker注册（仅生产环境） - 暂时禁用
// if (import.meta.env.PROD) {
//   import('./utils/serviceWorker').then((swManager) => {
//     console.log('[SW] Service Worker loaded')

//     // 监听更新事件
//     window.addEventListener('sw-update-available', () => {
//       console.log('[SW] Update available - user will be prompted')
//     })
//   })
// }

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(ElementPlus) // 注册 Element Plus

// 性能标记
if (typeof window !== 'undefined' && window.performance) {
  // 标记应用启动时间
  performance.mark('vue-app-start')

  // 启用 Vue 性能追踪（仅开发环境）
  if (import.meta.env.DEV) {
    app.config.performance = true
  }
}

app.mount('#app')

// 应用启动完成标记
if (typeof window !== 'undefined' && window.performance) {
  performance.mark('vue-app-mounted')

  // 延迟执行，确保 DOM 完全渲染
  requestAnimationFrame(() => {
    performance.measure('vue-app-load', 'vue-app-start', 'vue-app-mounted')

    // 输出加载时间
    const loadTime = performance.getEntriesByName('vue-app-load')[0]
    if (loadTime && import.meta.env.DEV) {
      console.log(`🚀 App load time: ${loadTime.duration.toFixed(2)}ms`)
    }
  })
}