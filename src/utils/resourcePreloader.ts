/**
 * 资源预加载工具
 * 用于优化关键资源的加载顺序和时机
 */

export interface PreloadResource {
  url: string
  type: 'script' | 'style' | 'image' | 'font' | 'document'
  priority?: 'high' | 'low' | 'auto'
  crossOrigin?: boolean
  integrity?: string
}

export class ResourcePreloader {
  private static preloadedResources = new Set<string>()
  private static preloadingPromises = new Map<string, Promise<void>>()

  /**
   * 预加载单个资源
   */
  static preload(resource: PreloadResource): Promise<void> {
    const { url } = resource

    // 检查是否已经预加载
    if (this.preloadedResources.has(url)) {
      return Promise.resolve()
    }

    // 检查是否正在预加载
    const existingPromise = this.preloadingPromises.get(url)
    if (existingPromise) {
      return existingPromise
    }

    // 创建预加载Promise
    const promise = this.createPreloadPromise(resource)
    this.preloadingPromises.set(url, promise)

    return promise
  }

  /**
   * 批量预加载资源
   */
  static async preloadBatch(resources: PreloadResource[]): Promise<void[]> {
    const promises = resources.map(resource => this.preload(resource))
    return Promise.all(promises)
  }

  /**
   * 创建预加载Promise
   */
  private static createPreloadPromise(resource: PreloadResource): Promise<void> {
    return new Promise((resolve, reject) => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.href = resource.url

      // 设置资源类型
      switch (resource.type) {
        case 'script':
          link.as = 'script'
          break
        case 'style':
          link.as = 'style'
          break
        case 'image':
          link.as = 'image'
          break
        case 'font':
          link.as = 'font'
          link.type = this.getFontMimeType(resource.url)
          break
        case 'document':
          link.as = 'document'
          break
      }

      // 设置优先级
      if (resource.priority) {
        link.setAttribute('importance', resource.priority)
      }

      // 设置跨域
      if (resource.crossOrigin || resource.type === 'font') {
        link.crossOrigin = 'anonymous'
      }

      // 设置完整性校验
      if (resource.integrity) {
        link.integrity = resource.integrity
      }

      link.onload = () => {
        this.preloadedResources.add(resource.url)
        this.preloadingPromises.delete(resource.url)
        resolve()
      }

      link.onerror = () => {
        this.preloadingPromises.delete(resource.url)
        reject(new Error(`Failed to preload: ${resource.url}`))
      }

      document.head.appendChild(link)
    })
  }

  /**
   * 获取字体MIME类型
   */
  private static getFontMimeType(url: string): string {
    const extension = url.split('.').pop()?.toLowerCase()
    switch (extension) {
      case 'woff':
        return 'font/woff'
      case 'woff2':
        return 'font/woff2'
      case 'ttf':
        return 'font/ttf'
      case 'eot':
        return 'application/vnd.ms-fontobject'
      default:
        return 'font/woff2'
    }
  }

  /**
   * 智能预加载 - 根据用户行为预加载
   */
  static initSmartPreloading(): void {
    // 预加载关键资源
    this.preloadCriticalResources()

    // 预取可能访问的页面
    this.setupLinkPrefetching()

    // 监听用户交互，预加载相关资源
    this.setupInteractionPreloading()
  }

  /**
   * 预加载关键资源
   */
  private static preloadCriticalResources(): void {
    const criticalResources: PreloadResource[] = []

    // 注释掉不存在的资源，避免404错误
    // 如需要，请确保文件存在后再启用

    // 关键字体
    // {
    //   url: '/fonts/inter-var.woff2',
    //   type: 'font',
    //   priority: 'high',
    //   crossOrigin: true
    // },

    // 关键CSS
    // {
    //   url: '/styles/critical.css',
    //   type: 'style',
    //   priority: 'high'
    // },

    // 关键脚本
    // {
    //   url: '/js/critical.js',
    //   type: 'script',
    //   priority: 'high'
    // }

    // 只预加载实际存在的资源
    if (criticalResources.length > 0) {
      this.preloadBatch(criticalResources).catch(() => {
        // 静默处理错误，不影响应用运行
      })
    }
  }

  /**
   * 设置链接预取
   */
  private static setupLinkPrefetching(): void {
    // 监听链接悬停
    document.addEventListener('mouseover', (event) => {
      const link = (event.target as HTMLElement).closest('a[href]')
      if (link && this.shouldPrefetch(link)) {
        this.prefetchLink((link as HTMLAnchorElement).href)
      }
    }, { passive: true })

    // 监听触摸开始（移动端）
    document.addEventListener('touchstart', (event) => {
      const link = (event.target as HTMLElement).closest('a[href]')
      if (link && this.shouldPrefetch(link)) {
        this.prefetchLink((link as HTMLAnchorElement).href)
      }
    }, { passive: true })
  }

  /**
   * 判断是否应该预取链接
   */
  private static shouldPrefetch(link: Element): boolean {
    const href = (link as HTMLAnchorElement).href

    // 排除外部链接
    if (href.startsWith('http') && !href.includes(window.location.hostname)) {
      return false
    }

    // 排除锚点链接
    if (href.includes('#')) {
      return false
    }

    // 排除当前页面
    if (href === window.location.href) {
      return false
    }

    // 排除特殊链接
    const excludePatterns = [/mailto:/, /tel:/, /javascript:/, /download/]
    return !excludePatterns.some(pattern => pattern.test(href))
  }

  /**
   * 预取链接页面
   */
  private static prefetchLink(href: string): void {
    if (this.preloadedResources.has(href)) {
      return
    }

    const link = document.createElement('link')
    link.rel = 'prefetch'
    link.href = href
    document.head.appendChild(link)
  }

  /**
   * 设置交互预加载
   */
  private static setupInteractionPreloading(): void {
    // 监听路由变化（Vue Router）
    this.setupRouterPreloading()

    // 监听滚动，预加载可视区域内容
    this.setupScrollPreloading()
  }

  /**
   * 设置路由预加载
   */
  private static setupRouterPreloading(): void {
    // 监听导航事件
    window.addEventListener('popstate', () => {
      // 预加载后退/前进页面
      this.preloadRoutePages()
    })
  }

  /**
   * 预加载路由页面
   */
  private static preloadRoutePages(): void {
    // 根据当前路由预加载可能访问的页面
    const currentPath = window.location.pathname

    const routeResources: PreloadResource[] = []

    // 根据不同页面预加载不同资源
    switch (currentPath) {
      case '/':
        // 首页预加载下一步资源
        routeResources.push({
          url: '/step1',
          type: 'document',
          priority: 'low'
        })
        break
      case '/step1':
        // Step1预加载Step2相关资源
        routeResources.push({
          url: '/step2',
          type: 'document',
          priority: 'low'
        })
        break
      case '/step2':
        // Step2预加载Step3相关资源
        routeResources.push({
          url: '/step3',
          type: 'document',
          priority: 'low'
        })
        break
    }

    this.preloadBatch(routeResources).catch(console.warn)
  }

  /**
   * 设置滚动预加载
   */
  private static setupScrollPreloading(): void {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const element = entry.target as HTMLElement
            this.preloadElementResources(element)
          }
        })
      },
      {
        rootMargin: '100px' // 提前100px开始预加载
      }
    )

    // 观察所有图片和懒加载元素
    document.querySelectorAll('img[data-src], [data-preload]').forEach(el => {
      observer.observe(el)
    })
  }

  /**
   * 预加载元素相关资源
   */
  private static preloadElementResources(element: HTMLElement): void {
    const preloadUrl = element.getAttribute('data-preload')
    if (preloadUrl) {
      this.preload({
        url: preloadUrl,
        type: 'image',
        priority: 'low'
      }).catch(console.warn)
    }
  }

  /**
   * 预连接到域名
   */
  static preconnect(origins: string[]): void {
    origins.forEach(origin => {
      if (!this.preloadedResources.has(origin)) {
        const link = document.createElement('link')
        link.rel = 'preconnect'
        link.href = origin
        link.crossOrigin = 'anonymous'
        document.head.appendChild(link)
        this.preloadedResources.add(origin)
      }
    })
  }

  /**
   * DNS预解析
   */
  static dnsPrefetch(origins: string[]): void {
    origins.forEach(origin => {
      if (!this.preloadedResources.has(origin)) {
        const link = document.createElement('link')
        link.rel = 'dns-prefetch'
        link.href = origin
        document.head.appendChild(link)
        this.preloadedResources.add(origin)
      }
    })
  }

  /**
   * 清理预加载记录
   */
  static cleanup(): void {
    this.preloadedResources.clear()
    this.preloadingPromises.clear()
  }

  /**
   * 获取预加载统计
   */
  static getStats(): {
    preloaded: number
    preloading: number
    resources: string[]
  } {
    return {
      preloaded: this.preloadedResources.size,
      preloading: this.preloadingPromises.size,
      resources: Array.from(this.preloadedResources)
    }
  }
}

// 自动初始化（已禁用，避免预加载不存在的资源）
// 如需启用，请确保已配置有效的预加载资源
// if (typeof window !== 'undefined') {
//   // 等待DOM加载完成后初始化
//   if (document.readyState === 'loading') {
//     document.addEventListener('DOMContentLoaded', () => {
//       ResourcePreloader.initSmartPreloading()
//     })
//   } else {
//     ResourcePreloader.initSmartPreloading()
//   }
// }