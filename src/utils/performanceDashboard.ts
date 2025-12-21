/**
 * 性能监控仪表板
 * 提供全面的性能指标监控和分析功能
 */

export interface PerformanceMetrics {
  // Core Web Vitals
  lcp?: number // Largest Contentful Paint
  fid?: number // First Input Delay
  cls?: number // Cumulative Layout Shift
  fcp?: number // First Contentful Paint
  ttfb?: number // Time to First Byte

  // 自定义指标
  domContentLoaded?: number
  loadComplete?: number
  resourceTiming?: ResourceTiming[]
  navigationTiming?: PerformanceNavigationTiming

  // 业务指标
  renderTime?: number
  apiResponseTime?: number[]
  userInteractionLatency?: number[]

  // 资源统计
  totalResources?: number
  totalSize?: number
  cachedResources?: number
}

export interface PerformanceAlert {
  type: 'warning' | 'error' | 'info'
  metric: string
  value: number
  threshold: number
  message: string
  timestamp: number
}

export class PerformanceDashboard {
  private metrics: PerformanceMetrics = {}
  private alerts: PerformanceAlert[] = []
  private observers: PerformanceObserver[] = []
  private config = {
    // 性能阈值配置
    thresholds: {
      lcp: 2500, // 2.5s
      fid: 100,  // 100ms
      cls: 0.1,  // 0.1
      fcp: 1800, // 1.8s
      ttfb: 600  // 600ms
    },

    // 监控配置
    enableResourceTiming: true,
    enableUserTiming: true,
    enableLongTask: true,

    // 上报配置
    reportUrl: '/api/performance',
    reportInterval: 30000, // 30秒
    maxRetries: 3
  }

  private reportQueue: any[] = []
  private reportTimer?: NodeJS.Timeout

  constructor(config: Partial<typeof PerformanceDashboard.prototype.config> = {}) {
    this.config = { ...this.config, ...config }
    this.init()
  }

  /**
   * 初始化性能监控
   */
  private init(): void {
    // 检查浏览器支持
    if (!this.isSupported()) {
      console.warn('Performance monitoring not supported in this browser')
      return
    }

    // 开始监控Core Web Vitals
    this.observeWebVitals()

    // 监控资源加载
    if (this.config.enableResourceTiming) {
      this.observeResourceTiming()
    }

    // 监控自定义计时
    if (this.config.enableUserTiming) {
      this.observeUserTiming()
    }

    // 监控长任务
    if (this.config.enableLongTask) {
      this.observeLongTasks()
    }

    // 收集初始指标
    this.collectInitialMetrics()

    // 启动定时上报
    this.startPeriodicReporting()

    // 页面卸载时上报数据
    this.setupUnloadReporting()
  }

  /**
   * 检查浏览器支持
   */
  private isSupported(): boolean {
    return !!(
      window.performance &&
      window.PerformanceObserver &&
      performance.getEntriesByType
    )
  }

  /**
   * 监控Core Web Vitals
   */
  private observeWebVitals(): void {
    // LCP - Largest Contentful Paint
    this.createObserver('largest-contentful-paint', (entries) => {
      const lastEntry = entries[entries.length - 1]
      this.metrics.lcp = lastEntry.renderTime || lastEntry.loadTime
      this.checkThreshold('lcp', this.metrics.lcp)
    })

    // FID - First Input Delay
    this.createObserver('first-input', (entries) => {
      entries.forEach(entry => {
        this.metrics.fid = entry.duration
        this.checkThreshold('fid', this.metrics.fid)
      })
    })

    // CLS - Cumulative Layout Shift
    let clsValue = 0
    this.createObserver('layout-shift', (entries) => {
      entries.forEach(entry => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value
          this.metrics.cls = clsValue
          this.checkThreshold('cls', this.metrics.cls)
        }
      })
    })
  }

  /**
   * 监控资源加载时间
   */
  private observeResourceTiming(): void {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const resources = performance.getEntriesByType('resource') as ResourceTiming[]
        this.metrics.resourceTiming = resources
        this.analyzeResourceMetrics(resources)
      }, 0)
    })
  }

  /**
   * 监控用户自定义计时
   */
  private observeUserTiming(): void {
    this.createObserver('measure', (entries) => {
      entries.forEach(entry => {
        console.log(`[User Timing] ${entry.name}: ${entry.duration.toFixed(2)}ms`)
      })
    })
  }

  /**
   * 监控长任务
   */
  private observeLongTasks(): void {
    try {
      this.createObserver('longtask', (entries) => {
        entries.forEach(entry => {
          console.warn(`[Long Task] Duration: ${entry.duration}ms`)
          this.createAlert('warning', 'longTask', entry.duration, 50,
            `Detected long task blocking main thread for ${entry.duration}ms`)
        })
      })
    } catch (e) {
      // 部分浏览器不支持longtask
      console.warn('Long task monitoring not supported')
    }
  }

  /**
   * 创建PerformanceObserver
   */
  private createObserver(type: string, callback: (entries: any[]) => void): void {
    try {
      const observer = new PerformanceObserver((list) => {
        callback(list.getEntries())
      })

      observer.observe({ type, buffered: true })
      this.observers.push(observer)
    } catch (e) {
      console.warn(`Failed to observe ${type}:`, e)
    }
  }

  /**
   * 收集初始性能指标
   */
  private collectInitialMetrics(): void {
    // Navigation Timing
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    if (navigation) {
      this.metrics.navigationTiming = navigation
      this.metrics.ttfb = navigation.responseStart - navigation.requestStart
      this.metrics.domContentLoaded = navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart
      this.metrics.loadComplete = navigation.loadEventEnd - navigation.loadEventStart
      this.metrics.fcp = navigation.responseStart - navigation.fetchStart

      // 检查初始阈值
      this.checkThreshold('ttfb', this.metrics.ttfb)
      this.checkThreshold('fcp', this.metrics.fcp)
    }

    // Paint Timing
    const paintEntries = performance.getEntriesByType('paint')
    paintEntries.forEach(entry => {
      if (entry.name === 'first-contentful-paint') {
        this.metrics.fcp = entry.startTime
      }
    })
  }

  /**
   * 分析资源加载指标
   */
  private analyzeResourceMetrics(resources: ResourceTiming[]): void {
    let totalSize = 0
    let cachedCount = 0

    resources.forEach(resource => {
      // 估算资源大小（不精确，仅供参考）
      const size = this.estimateResourceSize(resource)
      totalSize += size

      // 检查是否从缓存加载
      if (this.isFromCache(resource)) {
        cachedCount++
      }
    })

    this.metrics.totalResources = resources.length
    this.metrics.totalSize = totalSize
    this.metrics.cachedResources = cachedCount

    // 分析资源加载性能
    const slowResources = resources.filter(r => r.duration > 1000)
    if (slowResources.length > 0) {
      this.createAlert('warning', 'slowResource', slowResources.length, 0,
        `${slowResources.length} resources took more than 1s to load`)
    }
  }

  /**
   * 估算资源大小
   */
  private estimateResourceSize(resource: ResourceTiming): number {
    // 这是一个粗略的估算，实际大小需要服务器支持
    if (resource.transferSize > 0) {
      return resource.transferSize
    }

    // 根据资源类型估算
    if (resource.name.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
      return 500 * 1024 // 500KB
    }
    if (resource.name.match(/\.(js|css)$/i)) {
      return 50 * 1024 // 50KB
    }

    return 10 * 1024 // 10KB default
  }

  /**
   * 检查资源是否来自缓存
   */
  private isFromCache(resource: ResourceTiming): boolean {
    return resource.transferSize === 0 && resource.decodedBodySize > 0
  }

  /**
   * 检查指标是否超过阈值
   */
  private checkThreshold(metric: keyof typeof PerformanceDashboard.prototype.config.thresholds,
                        value?: number): void {
    if (!value) return

    const threshold = this.config.thresholds[metric]
    if (value > threshold) {
      this.createAlert('error', metric, value, threshold,
        `${metric.toUpperCase()} exceeded threshold: ${value.toFixed(2)}ms > ${threshold}ms`)
    }
  }

  /**
   * 创建性能告警
   */
  private createAlert(type: PerformanceAlert['type'],
                     metric: string,
                     value: number,
                     threshold: number,
                     message: string): void {
    const alert: PerformanceAlert = {
      type,
      metric,
      value,
      threshold,
      message,
      timestamp: Date.now()
    }

    this.alerts.push(alert)
    console.warn(`[Performance Alert] ${message}`)

    // 只保留最近的50条告警
    if (this.alerts.length > 50) {
      this.alerts = this.alerts.slice(-50)
    }
  }

  /**
   * 启动定时上报
   */
  private startPeriodicReporting(): void {
    this.reportTimer = setInterval(() => {
      this.reportMetrics()
    }, this.config.reportInterval)
  }

  /**
   * 设置页面卸载上报
   */
  private setupUnloadReporting(): void {
    const reportOnUnload = () => {
      this.reportMetrics(true) // 使用sendBeacon上报
    }

    window.addEventListener('beforeunload', reportOnUnload)
    window.addEventListener('pagehide', reportOnUnload)
  }

  /**
   * 上报性能指标
   */
  private async reportMetrics(isUnload = false): Promise<void> {
    const reportData = {
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: Date.now(),
      metrics: this.metrics,
      alerts: this.alerts.slice(-10), // 只上报最近10条告警
      sessionId: this.getSessionId()
    }

    // 添加到上报队列
    this.reportQueue.push(reportData)

    if (isUnload) {
      // 页面卸载时使用sendBeacon
      this.sendBeacon(reportData)
    } else {
      // 正常上报
      await this.sendReport(reportData)
    }
  }

  /**
   * 发送性能报告
   */
  private async sendReport(data: any, retryCount = 0): Promise<void> {
    try {
      const response = await fetch(this.config.reportUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
        keepalive: true
      })

      if (!response.ok) {
        throw new Error(`Report failed: ${response.status}`)
      }

      // 成功后从队列移除
      this.reportQueue.shift()
    } catch (error) {
      console.warn('Failed to report performance metrics:', error)

      // 重试逻辑
      if (retryCount < this.config.maxRetries) {
        setTimeout(() => {
          this.sendReport(data, retryCount + 1)
        }, 1000 * Math.pow(2, retryCount)) // 指数退避
      }
    }
  }

  /**
   * 使用sendBeacon上报
   */
  private sendBeacon(data: any): void {
    if (navigator.sendBeacon) {
      navigator.sendBeacon(this.config.reportUrl, JSON.stringify(data))
    }
  }

  /**
   * 获取会话ID
   */
  private getSessionId(): string {
    let sessionId = sessionStorage.getItem('performance-session-id')
    if (!sessionId) {
      sessionId = this.generateUUID()
      sessionStorage.setItem('performance-session-id', sessionId)
    }
    return sessionId
  }

  /**
   * 生成UUID
   */
  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0
      const v = c === 'x' ? r : (r & 0x3 | 0x8)
      return v.toString(16)
    })
  }

  /**
   * 手动记录业务指标
   */
  public recordMetric(name: string, value: number, tags?: Record<string, string>): void {
    // 可以扩展为支持更多自定义指标
    console.log(`[Custom Metric] ${name}: ${value}`, tags)
  }

  /**
   * 开始计时
   */
  public startMark(name: string): void {
    performance.mark(`${name}-start`)
  }

  /**
   * 结束计时并记录
   */
  public endMark(name: string): number {
    try {
      performance.mark(`${name}-end`)
      performance.measure(name, `${name}-start`, `${name}-end`)

      const measure = performance.getEntriesByName(name, 'measure')[0]
      return measure.duration
    } catch (e) {
      console.warn(`Failed to measure ${name}:`, e)
      return 0
    }
  }

  /**
   * 获取当前所有指标
   */
  public getMetrics(): PerformanceMetrics {
    return { ...this.metrics }
  }

  /**
   * 获取告警列表
   */
  public getAlerts(): PerformanceAlert[] {
    return [...this.alerts]
  }

  /**
   * 清除所有数据
   */
  public clear(): void {
    this.metrics = {}
    this.alerts = []
    this.reportQueue = []

    // 停止所有观察器
    this.observers.forEach(observer => observer.disconnect())
    this.observers = []

    // 清除定时器
    if (this.reportTimer) {
      clearInterval(this.reportTimer)
    }
  }

  /**
   * 销毁监控实例
   */
  public destroy(): void {
    this.clear()
  }
}

// 单例模式
let performanceDashboard: PerformanceDashboard | null = null

export function initPerformanceMonitoring(config?: any): PerformanceDashboard {
  if (!performanceDashboard) {
    performanceDashboard = new PerformanceDashboard(config)
  }
  return performanceDashboard
}

export function getPerformanceDashboard(): PerformanceDashboard | null {
  return performanceDashboard
}

// TypeScript声明扩展
declare global {
  interface Window {
    performanceDashboard?: PerformanceDashboard
  }
}

// 全局暴露（开发环境）
if (import.meta.env.DEV) {
  initPerformanceMonitoring()
  window.performanceDashboard = performanceDashboard || undefined
}