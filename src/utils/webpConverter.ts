/**
 * WebP 图片格式转换工具
 * 自动检测浏览器支持并返回最优的图片URL
 */

export class WebPConverter {
  private static instance: WebPConverter
  private supportsWebP: boolean | null = null

  private constructor() { }

  public static getInstance(): WebPConverter {
    if (!WebPConverter.instance) {
      WebPConverter.instance = new WebPConverter()
    }
    return WebPConverter.instance
  }

  /**
   * 检测浏览器是否支持 WebP
   */
  public checkWebPSupport(): boolean {
    if (this.supportsWebP !== null) {
      return this.supportsWebP
    }

    const canvas = document.createElement('canvas')
    canvas.width = 1
    canvas.height = 1

    try {
      const ctx = canvas.getContext('2d')
      if (ctx) {
        // 尝试解码 WebP
        this.supportsWebP = canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0
      } else {
        this.supportsWebP = false
      }
    } catch {
      this.supportsWebP = false
    }

    return this.supportsWebP
  }

  /**
   * 获取优化后的图片 URL
   * @param src 原始图片URL
   * @param options 优化选项
   */
  public getOptimizedUrl(
    src: string,
    options: {
      width?: number
      height?: number
      quality?: number
      format?: 'webp' | 'avif' | 'jpeg' | 'png'
    } = {}
  ): string {
    // 如果是外部URL且不支持修改，直接返回
    if (src.startsWith('http') && !src.includes(window.location.hostname)) {
      return src
    }

    // 如果已经包含查询参数，直接返回
    if (src.includes('?')) {
      return src
    }

    const supportsWebP = this.checkWebPSupport()
    const quality = options.quality || 80
    const format = options.format || (supportsWebP ? 'webp' : 'jpeg')

    try {
      const url = new URL(src, window.location.origin)

      // 添加优化参数（这些参数需要在后端图片处理服务中支持）
      url.searchParams.set('format', format)

      if (quality !== 80) {
        url.searchParams.set('quality', quality.toString())
      }

      if (options.width) {
        url.searchParams.set('width', options.width.toString())
      }

      if (options.height) {
        url.searchParams.set('height', options.height.toString())
      }

      return url.toString()
    } catch {
      // 如果 URL 解析失败，返回原始 URL
      return src
    }
  }

  /**
   * 转换为 WebP 格式（需要服务端支持）
   */
  public convertToWebP(src: string, quality: number = 80): string {
    return this.getOptimizedUrl(src, { format: 'webp', quality })
  }

  /**
   * 生成响应式图片 srcset
   */
  public generateSrcSet(
    baseSrc: string,
    sizes: Array<{ width: number; height?: number; descriptor?: string }>
  ): string {
    return sizes
      .map((size) => {
        const url = this.getOptimizedUrl(baseSrc, {
          width: size.width,
          height: size.height
        })
        const descriptor = size.descriptor || `${size.width}w`
        return `${url} ${descriptor}`
      })
      .join(', ')
  }

  /**
   * 预加载优化后的图片
   */
  public preloadOptimizedImage(
    src: string,
    options: {
      width?: number
      height?: number
      quality?: number
      format?: 'webp' | 'avif' | 'jpeg' | 'png'
    } = {}
  ): Promise<void> {
    const optimizedSrc = this.getOptimizedUrl(src, options)

    return new Promise((resolve, reject) => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'image'
      link.href = optimizedSrc
      link.fetchPriority = 'high'

      link.onload = () => {
        document.head.removeChild(link)
        resolve()
      }

      link.onerror = () => {
        document.head.removeChild(link)
        reject(new Error(`Failed to preload image: ${optimizedSrc}`))
      }

      document.head.appendChild(link)
    })
  }
}

// 导出单例
export const webpConverter = WebPConverter.getInstance()
export default webpConverter