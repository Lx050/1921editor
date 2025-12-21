// 性能优化工具函数

/**
 * 防抖函数 - 延迟执行，频繁调用时重置计时器
 * @param {Function} func 要防抖的函数
 * @param {number} wait 等待时间（毫秒）
 * @param {boolean} immediate 是否立即执行第一次调用
 * @returns {Function} 防抖后的函数
 */
export function debounce(func, wait, immediate = false) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      timeout = null
      if (!immediate) func.apply(this, args)
    }
    const callNow = immediate && !timeout
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    if (callNow) func.apply(this, args)
  }
}

/**
 * 节流函数 - 限制执行频率
 * @param {Function} func 要节流的函数
 * @param {number} limit 时间间隔（毫秒）
 * @returns {Function} 节流后的函数
 */
export function throttle(func, limit) {
  let inThrottle
  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

/**
 * 空闲时执行 - 利用 requestIdleCallback 在浏览器空闲时执行任务
 * @param {Function} callback 要执行的回调
 * @param {Object} options 选项
 * @returns {number} 任务 ID
 */
export function runWhenIdle(callback, options = {}) {
  if ('requestIdleCallback' in window) {
    return window.requestIdleCallback(callback, options)
  } else {
    // 回退到 setTimeout
    return setTimeout(callback, 1)
  }
}

/**
 * 批量 DOM 更新 - 使用 requestAnimationFrame 优化 DOM 操作
 * @param {Function} callback DOM 更新回调
 */
export function batchDOMUpdate(callback) {
  if ('requestAnimationFrame' in window) {
    requestAnimationFrame(callback)
  } else {
    callback()
  }
}

/**
 * 懒加载组件
 * @param {Function} loadComponent 动态导入函数
 * @param {Component} fallback 加载中的占位组件
 * @returns {Component} 懒加载的组件
 */
export function lazyLoad(loadComponent, fallback = null) {
  return defineAsyncComponent({
    loader: loadComponent,
    loadingComponent: fallback,
    errorComponent: {
      template: '<div>加载失败</div>'
    },
    delay: 200,
    timeout: 10000
  })
}

/**
 * 预加载资源
 * @param {Array} resources 资源列表
 */
export function preloadResources(resources) {
  resources.forEach(resource => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.href = resource.url
    link.as = resource.as || 'script'

    if (resource.type) {
      link.type = resource.type
    }

    if (resource.crossorigin) {
      link.crossOrigin = resource.crossorigin
    }

    document.head.appendChild(link)
  })
}

/**
 * 监控性能指标
 */
export class PerformanceMonitor {
  constructor() {
    this.metrics = {}
    this.observers = new Map()
  }

  // 开始监控
  start() {
    // 监控 FCP
    this.observeFCP()

    // 监控 LCP
    this.observeLCP()

    // 监控 CLS
    this.observeCLS()

    // 监控 FID
    this.observeFID()
  }

  // 监控首次内容绘制 (FCP)
  observeFCP() {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name === 'first-contentful-paint') {
          this.metrics.fcp = entry.startTime
          console.log('FCP:', this.metrics.fcp)
        }
      }
    })

    observer.observe({ type: 'paint', buffered: true })
    this.observers.set('fcp', observer)
  }

  // 监控最大内容绘制 (LCP)
  observeLCP() {
    new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const lastEntry = entries[entries.length - 1]
      this.metrics.lcp = lastEntry.startTime
      console.log('LCP:', this.metrics.lcp)
    }).observe({ type: 'largest-contentful-paint', buffered: true })
  }

  // 监控累积布局偏移 (CLS)
  observeCLS() {
    let clsValue = 0

    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value
        }
      }
      this.metrics.cls = clsValue
      console.log('CLS:', this.metrics.cls)
    })

    observer.observe({ type: 'layout-shift', buffered: true })
    this.observers.set('cls', observer)
  }

  // 监控首次输入延迟 (FID)
  observeFID() {
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        this.metrics.fid = entry.processingStart - entry.startTime
        console.log('FID:', this.metrics.fid)
      }
    }).observe({ type: 'first-input', buffered: true })
  }

  // 获取所有指标
  getMetrics() {
    return { ...this.metrics }
  }

  // 停止监控
  stop() {
    this.observers.forEach(observer => {
      observer.disconnect()
    })
    this.observers.clear()
  }
}

/**
 * 优化图片加载
 * @param {HTMLImageElement} img 图片元素
 * @param {Object} options 选项
 */
export function optimizeImageLoad(img, options = {}) {
  const {
    src,
    srcset,
    sizes,
    loading = 'lazy',
    decoding = 'async',
    crossorigin = null
  } = options

  // 设置属性
  if (src) img.src = src
  if (srcset) img.srcset = srcset
  if (sizes) img.sizes = sizes
  if (loading) img.loading = loading
  if (decoding) img.decoding = decoding
  if (crossorigin) img.crossOrigin = crossorigin

  // 添加加载事件监听
  return new Promise((resolve, reject) => {
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('Image load failed'))
  })
}

/**
 * 检测网络状态
 */
export function checkNetworkConnection() {
  if ('connection' in navigator) {
    const connection = navigator.connection
    return {
      effectiveType: connection.effectiveType,
      downlink: connection.downlink,
      rtt: connection.rtt,
      saveData: connection.saveData
    }
  }
  return null
}

/**
 * 根据网络状况调整加载策略
 */
export function adaptiveLoading() {
  const connection = checkNetworkConnection()

  if (connection) {
    if (connection.effectiveType === 'slow-2g' ||
        connection.effectiveType === '2g' ||
        connection.saveData) {
      // 低速网络：禁用预加载，减少资源
      return {
        preload: false,
        lazyLoad: true,
        quality: 'low'
      }
    } else if (connection.effectiveType === '3g') {
      // 3G 网络：适中策略
      return {
        preload: true,
        lazyLoad: true,
        quality: 'medium'
      }
    } else {
      // 高速网络：完整功能
      return {
        preload: true,
        lazyLoad: false,
        quality: 'high'
      }
    }
  }

  // 默认策略
  return {
    preload: true,
    lazyLoad: true,
    quality: 'medium'
  }
}