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

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(ElementPlus)

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
    const startMark = performance.getEntriesByName('vue-app-start')[0]
    const mountedMark = performance.getEntriesByName('vue-app-mounted')[0]

    if (startMark && mountedMark && import.meta.env.DEV) {
      const duration = mountedMark.startTime - startMark.startTime
      console.log(`🚀 App load time: ${duration.toFixed(2)}ms`)
    }
  })
}