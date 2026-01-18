/**
 * 高级资源预加载策略
 * 智能预测用户行为，提前加载必要资源
 */

export interface PreloadStrategy {
  type: 'eager' | 'lazy' | 'idle' | 'interaction'
  priority: 'high' | 'normal' | 'low'
  condition?: () => boolean
  delay?: number
}

export interface ResourceInfo {
  url: string
  type: 'script' | 'style' | 'image' | 'font' | 'document' | 'worker'
  strategy: PreloadStrategy
  weight?: number // 权重，用于排序
  dependencies?: string[] // 依赖的其他资源
}

export interface PreloadConfig {
  maxConcurrent?: number
  timeout?: number
  retryAttempts?: number
  enableIdleCallback?: boolean
  enableIntersectionObserver?: boolean
  cacheFirst?: boolean
}

type NetworkInformationLike = {
  saveData?: boolean
  effectiveType?: string
  addEventListener?: (type: 'change', listener: () => void) => void
}

type NavigatorWithConnection = Navigator & {
  connection?: NetworkInformationLike
}

export class AdvancedPreloader {
  private static instance: AdvancedPreloader
  private config: Required<PreloadConfig>
  private queue: ResourceInfo[] = []
  private loading = new Set<string>()
  private loaded = new Set<string>()
  private failed = new Set<string>()
  private observers: IntersectionObserver[] = []
  private abortControllers = new Map<string, AbortController>()

  private constructor(config: PreloadConfig = {}) {
    this.config = {
      maxConcurrent: config.maxConcurrent || 4,
      timeout: config.timeout || 10000,
      retryAttempts: config.retryAttempts || 2,
      enableIdleCallback: config.enableIdleCallback !== false,
      enableIntersectionObserver: config.enableIntersectionObserver !== false,
      cacheFirst: config.cacheFirst || true
    }

    this.init()
  }

  static getInstance(config?: PreloadConfig): AdvancedPreloader {
    if (!AdvancedPreloader.instance) {
      AdvancedPreloader.instance = new AdvancedPreloader(config)
    }
    return AdvancedPreloader.instance
  }

  private init(): void {
    // 初始化Intersection Observer
    if (this.config.enableIntersectionObserver && 'IntersectionObserver' in window) {
      this.setupIntersectionObserver()
    }

    // 初始化Idle Callback
    if (this.config.enableIdleCallback && 'requestIdleCallback' in window) {
      this.setupIdleCallback()
    }

    // 监听用户交互
    this.setupInteractionListeners()
  }

  /**
   * 添加资源到预加载队列
   */
  addResources(resources: ResourceInfo[]): void {
    resources.forEach(resource => this.addResource(resource))
  }

  /**
   * 添加单个资源
   */
  addResource(resource: ResourceInfo): void {
    if (this.loaded.has(resource.url) || this.loading.has(resource.url)) {
      return
    }

    this.queue.push(resource)
    this.sortQueue()
    this.processQueue()
  }

  /**
   * 立即加载资源（高优先级）
   */
  async preloadNow(urls: string[]): Promise<void[]> {
    const promises = urls.map(url => this.preloadSingle(url, 'eager'))
    return Promise.all(promises)
  }

  /**
   * 处理队列
   */
  private async processQueue(): Promise<void> {
    if (this.loading.size >= this.config.maxConcurrent) return

    const availableSlot = this.config.maxConcurrent - this.loading.size

    for (let i = 0; i < availableSlot && this.queue.length > 0; i++) {
      const resource = this.queue.shift()
      if (resource) {
        this.loadResource(resource)
      }
    }
  }

  /**
   * 加载单个资源
   */
  private loadResource(resource: ResourceInfo): void {
    this.loading.add(resource.url)

    const strategy = resource.strategy

    // 根据策略决定何时加载
    switch (strategy.type) {
      case 'eager':
        this.executeLoad(resource)
        break
      case 'lazy':
        this.scheduleLazyLoad(resource)
        break
      case 'idle':
        this.scheduleIdleLoad(resource)
        break
      case 'interaction':
        this.scheduleInteractionLoad(resource)
        break
    }
  }

  /**
   * 执行加载
   */
  private async executeLoad(resource: ResourceInfo, retryCount = 0): Promise<void> {
    const controller = new AbortController()
    this.abortControllers.set(resource.url, controller)

    try {
      // 检查条件
      if (resource.strategy.condition && !resource.strategy.condition()) {
        this.loading.delete(resource.url)
        return
      }

      // 延迟加载
      if (resource.strategy.delay && resource.strategy.delay > 0) {
        await this.delay(resource.strategy.delay)
      }

      // 创建预加载元素
      const link = document.createElement('link')
      link.rel = 'preload'
      link.href = resource.url

      // 设置资源类型
      link.as = resource.type
      if (resource.type === 'font') {
        link.crossOrigin = 'anonymous'
      }

      // 设置优先级
      if (resource.strategy.priority) {
        link.setAttribute('importance', resource.strategy.priority)
      }

      // 设置超时
      const timeoutId = setTimeout(() => {
        controller.abort()
      }, this.config.timeout)

      link.onload = () => {
        clearTimeout(timeoutId)
        this.loading.delete(resource.url)
        this.loaded.add(resource.url)
        this.abortControllers.delete(resource.url)
        this.processQueue()
      }

      link.onerror = () => {
        clearTimeout(timeoutId)
        this.loading.delete(resource.url)
        this.abortControllers.delete(resource.url)

        // 重试
        if (retryCount < this.config.retryAttempts) {
          setTimeout(() => {
            this.executeLoad(resource, retryCount + 1)
          }, 1000 * Math.pow(2, retryCount))
        } else {
          this.failed.add(resource.url)
          this.processQueue()
        }
      }

      document.head.appendChild(link)

    } catch (error) {
      console.error(`[AdvancedPreloader] 加载失败 ${resource.url}:`, error)
      this.loading.delete(resource.url)
      this.failed.add(resource.url)
      this.abortControllers.delete(resource.url)
      this.processQueue()
    }
  }

  /**
   * 懒加载调度
   */
  private scheduleLazyLoad(resource: ResourceInfo): void {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.executeLoad(resource)
            observer.disconnect()
          }
        })
      },
      { rootMargin: '50px' }
    )

    // 创建临时元素用于观察
    const tempElement = document.createElement('div')
    tempElement.style.height = '1px'
    tempElement.style.position = 'absolute'
    tempElement.style.top = '-9999px'
    document.body.appendChild(tempElement)

    observer.observe(tempElement)

    // 清理函数
    setTimeout(() => {
      observer.disconnect()
      if (tempElement.parentNode) {
        tempElement.parentNode.removeChild(tempElement)
      }
    }, 30000) // 30秒后清理
  }

  /**
   * 空闲时间加载调度
   */
  private scheduleIdleLoad(resource: ResourceInfo): void {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(
        () => {
          this.executeLoad(resource)
        },
        { timeout: 5000 }
      )
    } else {
      // 降级到setTimeout
      setTimeout(() => {
        this.executeLoad(resource)
      }, 100)
    }
  }

  /**
   * 交互触发加载
   */
  private scheduleInteractionLoad(resource: ResourceInfo): void {
    const loadOnInteraction = () => {
      if (!this.loaded.has(resource.url)) {
        this.executeLoad(resource)
      }
      // 只触发一次
      document.removeEventListener('mouseover', loadOnInteraction)
      document.removeEventListener('touchstart', loadOnInteraction)
    }

    document.addEventListener('mouseover', loadOnInteraction, { once: true })
    document.addEventListener('touchstart', loadOnInteraction, { once: true })
  }

  /**
   * 设置Intersection Observer
   */
  private setupIntersectionObserver(): void {
    // 监视可能触发资源加载的元素
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // 检查是否有相关资源需要加载
            const relatedResources = this.queue.filter(r =>
              r.dependencies && r.dependencies.includes(entry.target.id)
            )

            relatedResources.forEach(resource => {
              if (resource.strategy.type === 'lazy') {
                this.executeLoad(resource)
              }
            })
          }
        })
      },
      { rootMargin: '100px' }
    )

    this.observers.push(observer)
  }

  /**
   * 设置Idle Callback
   */
  private setupIdleCallback(): void {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        // 在空闲时间加载低优先级资源
        const lowPriorityResources = this.queue.filter(r => r.strategy.priority === 'low')
        lowPriorityResources.forEach(resource => {
          if (resource.strategy.type === 'idle') {
            this.executeLoad(resource)
          }
        })
      })
    }
  }

  /**
   * 设置交互监听器
   */
  private setupInteractionListeners(): void {
    // 监听网络状态
    if ('connection' in navigator) {
      const connection = (navigator as NavigatorWithConnection).connection
      if (connection) {
        const updateNetworkStrategy = () => {
          // 根据网络状况调整策略
          if (connection.saveData || connection.effectiveType === 'slow-2g') {
            this.queue.forEach(resource => {
              if (resource.strategy.priority === 'low') {
                resource.strategy.type = 'idle'
              }
            })
          }
        }

        if (typeof connection.addEventListener === 'function') {
          connection.addEventListener('change', updateNetworkStrategy)
        }
      }
    }

    // 监听页面可见性
    if ('visibilityState' in document) {
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
          this.processQueue()
        } else {
          // 页面隐藏时暂停低优先级加载
          this.loading.forEach(url => {
            const controller = this.abortControllers.get(url)
            if (controller) {
              controller.abort()
            }
          })
        }
      })
    }
  }

  /**
   * 排序队列
   */
  private sortQueue(): void {
    this.queue.sort((a, b) => {
      // 优先级排序
      const priorityOrder = { high: 3, normal: 2, low: 1 }
      const aPriority = priorityOrder[a.strategy.priority]
      const bPriority = priorityOrder[b.strategy.priority]

      if (aPriority !== bPriority) {
        return bPriority - aPriority
      }

      // 权重排序
      return (b.weight || 0) - (a.weight || 0)
    })
  }

  /**
   * 预加载单个资源
   */
  private preloadSingle(url: string, strategy: PreloadStrategy['type'] = 'eager'): Promise<void> {
    return new Promise((resolve, reject) => {
      const resource: ResourceInfo = {
        url,
        type: this.getResourceType(url),
        strategy: { type: strategy, priority: 'high' },
        weight: 100
      }

      this.addResource(resource)

      // 轮询等待加载完成
      const checkInterval = setInterval(() => {
        if (this.loaded.has(url)) {
          clearInterval(checkInterval)
          resolve()
        } else if (this.failed.has(url)) {
          clearInterval(checkInterval)
          reject(new Error(`Failed to preload: ${url}`))
        }
      }, 100)

      // 超时
      setTimeout(() => {
        clearInterval(checkInterval)
        reject(new Error(`Preload timeout: ${url}`))
      }, this.config.timeout)
    })
  }

  /**
   * 推断资源类型
   */
  private getResourceType(url: string): ResourceInfo['type'] {
    const extension = url.split('.').pop()?.toLowerCase()
    switch (extension) {
      case 'js':
        return 'script'
      case 'css':
        return 'style'
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'gif':
      case 'svg':
      case 'webp':
      case 'avif':
        return 'image'
      case 'woff':
      case 'woff2':
      case 'ttf':
      case 'eot':
        return 'font'
      case 'html':
      case 'htm':
        return 'document'
      default:
        return 'script'
    }
  }

  /**
   * 延迟函数
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  /**
   * 获取统计信息
   */
  getStats() {
    return {
      queue: this.queue.length,
      loading: this.loading.size,
      loaded: this.loaded.size,
      failed: this.failed.size,
      total: this.queue.length + this.loading.size + this.loaded.size + this.failed.size
    }
  }

  /**
   * 取消加载
   */
  cancelLoading(url: string): void {
    const controller = this.abortControllers.get(url)
    if (controller) {
      controller.abort()
      this.abortControllers.delete(url)
      this.loading.delete(url)
    }
  }

  /**
   * 取消所有加载
   */
  cancelAllLoading(): void {
    this.abortControllers.forEach(controller => controller.abort())
    this.abortControllers.clear()
    this.loading.clear()
  }

  /**
   * 销毁预加载器
   */
  destroy(): void {
    this.cancelAllLoading()
    this.observers.forEach(observer => observer.disconnect())
    this.observers = []
    this.queue = []
    this.loaded.clear()
    this.failed.clear()
  }
}

// 导出单例
export const advancedPreloader = AdvancedPreloader.getInstance()
