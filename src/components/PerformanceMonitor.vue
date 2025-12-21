<template>
  <div v-if="showMetrics" class="performance-metrics fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 text-xs font-mono z-50">
    <h3 class="font-bold mb-2 text-gray-700">性能指标</h3>
    <div v-for="(value, key) in metrics" :key="key" class="flex justify-between mb-1">
      <span class="text-gray-600">{{ getMetricName(key) }}:</span>
      <span :class="getMetricClass(key, value)">{{ formatMetric(key, value) }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { PerformanceMonitor } from '../utils/performance'

const metrics = ref({})
const showMetrics = ref(false)
let monitor = null

// 显示/隐藏快捷键
const toggleMetrics = () => {
  showMetrics.value = !showMetrics.value
}

onMounted(() => {
  // 开发环境默认显示
  if (process.env.NODE_ENV === 'development') {
    showMetrics.value = true
  }

  // 设置快捷键 Ctrl+Shift+P 切换显示
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key === 'P') {
      e.preventDefault()
      toggleMetrics()
    }
  })

  // 启动性能监控
  monitor = new PerformanceMonitor()
  monitor.start()

  // 定期更新指标
  const updateInterval = setInterval(() => {
    metrics.value = monitor.getMetrics()
  }, 1000)

  onUnmounted(() => {
    clearInterval(updateInterval)
    if (monitor) {
      monitor.stop()
    }
  })
})

function getMetricName(key) {
  const names = {
    fcp: 'FCP',
    lcp: 'LCP',
    cls: 'CLS',
    clsFinal: 'CLS (Final)',
    fid: 'FID',
    ttfb: 'TTFB'
  }
  return names[key] || key.toUpperCase()
}

function formatMetric(key, value) {
  if (typeof value !== 'number') return 'N/A'

  switch (key) {
    case 'fcp':
    case 'lcp':
    case 'fid':
    case 'ttfb':
      return `${(value / 1000).toFixed(2)}s`
    case 'cls':
    case 'clsFinal':
      return value.toFixed(3)
    default:
      return value.toFixed(2)
  }
}

function getMetricClass(key, value) {
  if (typeof value !== 'number') return 'text-gray-500'

  switch (key) {
    case 'fcp':
      if (value < 1800) return 'text-green-600'
      if (value < 3000) return 'text-yellow-600'
      return 'text-red-600'
    case 'lcp':
      if (value < 2500) return 'text-green-600'
      if (value < 4000) return 'text-yellow-600'
      return 'text-red-600'
    case 'fid':
      if (value < 100) return 'text-green-600'
      if (value < 300) return 'text-yellow-600'
      return 'text-red-600'
    case 'cls':
    case 'clsFinal':
      if (value < 0.1) return 'text-green-600'
      if (value < 0.25) return 'text-yellow-600'
      return 'text-red-600'
    default:
      return 'text-gray-600'
  }
}
</script>

<style scoped>
.performance-metrics {
  min-width: 200px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(4px);
}
</style>