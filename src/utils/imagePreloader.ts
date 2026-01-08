/**
 * 图片预加载工具
 * 用于预加载关键图片资源，提升首屏渲染速度
 */

interface PreloadOptions {
  priority?: 'high' | 'low' | 'auto'
  fetchPriority?: 'high' | 'low' | 'auto'
  crossOrigin?: 'anonymous' | 'use-credentials'
}

class ImagePreloader {
  private preloadCache: Map<string, boolean> = new Map()

  /**
   * 预加载单个图片
   */
  async preloadImage(src: string, options: PreloadOptions = {}): Promise<void> {
    if (this.preloadCache.has(src)) {
      return
    }

    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'image'
    link.href = src

    if (options.priority) {
      link.setAttribute('importance', options.priority)
    }

    if (options.fetchPriority) {
      link.setAttribute('fetchpriority', options.fetchPriority)
    }

    if (options.crossOrigin) {
      link.crossOrigin = options.crossOrigin
    }

    document.head.appendChild(link)

    return new Promise((resolve, reject) => {
      link.onload = () => {
        this.preloadCache.set(src, true)
        document.head.removeChild(link)
        resolve()
      }

      link.onerror = () => {
        console.warn(`[ImagePreloader] Failed to preload: ${src}`)
        document.head.removeChild(link)
        reject(new Error(`Failed to preload image: ${src}`))
      }
    })
  }

  /**
   * 预加载多个图片
   */
  async preloadImages(sources: string[], options: PreloadOptions = {}): Promise<void> {
    const promises = sources.map(src => this.preloadImage(src, options))
    await Promise.allSettled(promises)
  }

  /**
   * 使用 JS Image 对象预加载（不创建 DOM 节点）
   */
  preloadImageQuiet(src: string): Promise<void> {
    if (this.preloadCache.has(src)) {
      return Promise.resolve()
    }

    return new Promise((resolve, reject) => {
      const img = new Image()

      img.onload = () => {
        this.preloadCache.set(src, true)
        resolve()
      }

      img.onerror = () => {
        console.warn(`[ImagePreloader] Failed to preload quietly: ${src}`)
        reject(new Error(`Failed to preload image: ${src}`))
      }

      // 开始加载
      img.src = src
    })
  }

  /**
   * 获取图片的 WebP 版本 URL
   */
  getWebPUrl(src: string, quality: number = 80): string {
    // 如果是外部URL或已包含查询参数，直接返回
    if (src.startsWith('http') || src.includes('?')) {
      return src
    }

    const url = new URL(src, window.location.origin)
    url.searchParams.set('format', 'webp')
    url.searchParams.set('quality', quality.toString())

    return url.toString()
  }

  /**
   * 批量预加载首屏关键图片
   */
  preloadCriticalImages(): void {
    // 预加载 Logo 和品牌图片
    const criticalImages: string[] = [
      // 根据实际项目需要添加关键图片URL
    ]

    // 优先级高的关键图片
    const highPriorityImages = criticalImages.slice(0, 3)
    const normalPriorityImages = criticalImages.slice(3)

    // 高优先级图片立即预加载
    this.preloadImages(highPriorityImages, {
      priority: 'high',
      fetchPriority: 'high'
    }).catch(console.error)

    // 其他图片低优先级预加载
    setTimeout(() => {
      this.preloadImages(normalPriorityImages, {
        priority: 'low',
        fetchPriority: 'low'
      }).catch(console.error)
    }, 1000)
  }

  /**
   * 预连接到图片域名
   */
  preconnectToImageDomains(domains: string[]): void {
    domains.forEach(domain => {
      const link = document.createElement('link')
      link.rel = 'preconnect'
      link.href = domain

      // 添加 crossorigin 属性
      link.crossOrigin = 'anonymous'

      document.head.appendChild(link)
    })
  }

  /**
   * DNS 预解析
   */
  dnsPrefetch(domains: string[]): void {
    domains.forEach(domain => {
      const link = document.createElement('link')
      link.rel = 'dns-prefetch'
      link.href = domain
      document.head.appendChild(link)
    })
  }

  /**
   * 清理预加载缓存
   */
  clearCache(): void {
    this.preloadCache.clear()
  }

  /**
   * 获取缓存状态
   */
  isPreloaded(src: string): boolean {
    return this.preloadCache.has(src)
  }
}

// 创建单例
const imagePreloader = new ImagePreloader()

// 导出工具类和单例
export { ImagePreloader, imagePreloader }
export default imagePreloader