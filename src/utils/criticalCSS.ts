/**
 * 关键CSS优化工具
 * 用于提取和内联首屏关键CSS，优化渲染性能
 */

export class CriticalCSS {
  private static criticalCSS: string = ''
  private static isExtracted = false

  /**
   * 提取首屏关键CSS
   */
  static async extractCriticalCSS(): Promise<string> {
    if (this.isExtracted) {
      return this.criticalCSS
    }

    const styles = Array.from(document.styleSheets)
    let critical = ''

    try {
      for (const stylesheet of styles) {
        try {
          const rules = Array.from(stylesheet.cssRules || stylesheet.rules || [])

          for (const rule of rules) {
            if (this.isCriticalRule(rule)) {
              critical += rule.cssText + '\n'
            }
          }
        } catch (e) {
          console.warn('无法访问 stylesheet:', stylesheet.href, e)
        }
      }
    } catch (e) {
      console.warn('Critical CSS extraction failed:', e)
    }

    this.criticalCSS = this.minifyCSS(critical)
    this.isExtracted = true

    return this.criticalCSS
  }

  /**
   * 判断是否为关键CSS规则
   */
  private static isCriticalRule(rule: CSSRule): boolean {
    if (!rule.cssText) return false

    const cssText = rule.cssText.toLowerCase()

    // 关键选择器模式
    const criticalPatterns = [
      // HTML基础结构
      /^html|^body|^#\w+/, // html, body, #app
      /\.(header|nav|main|footer|container)/, // 主要布局
      /\.(btn|button|input|form)/, // 交互元素
      // 首屏组件相关
      /\.(hero|landing|welcome|splash)/,
      /\.(loading|spinner|skeleton)/, // 加载状态
      // 响应式基础
      /@media.*max-width/,
      // 伪类和动画
      /:hover$|:focus$|:active$/,
      /transition|animation/
    ]

    // 排除非关键样式
    const excludePatterns = [
      /display:\s*none/,
      /visibility:\s*hidden/,
      /z-index:\s*-\d+/, // 负z-index（通常是背景）
      /\.(modal|popup|dropdown)/, // 弹窗类
      /\.(sidebar|offcanvas)/ // 侧边栏
    ]

    // 检查是否应该排除
    for (const pattern of excludePatterns) {
      if (pattern.test(cssText)) {
        return false
      }
    }

    // 检查是否匹配关键模式
    return criticalPatterns.some(pattern => pattern.test(cssText))
  }

  /**
   * 简单的CSS压缩
   */
  private static minifyCSS(css: string): string {
    return css
      .replace(/\/\*[\s\S]*?\*\//g, '') // 移除注释
      .replace(/\s+/g, ' ') // 压缩空白
      .replace(/;\s*}/g, '}') // 移除最后的分号
      .replace(/\s*{\s*/g, '{') // 压缩大括号
      .replace(/\s*}\s*/g, '}')
      .replace(/\s*;\s*/g, ';') // 压缩分号
      .replace(/\s*:\s*/g, ':') // 压缩冒号
      .replace(/\s*,\s*/g, ',') // 压缩逗号
      .trim()
  }

  /**
   * 内联关键CSS到页面
   */
  static inlineCriticalCSS(): void {
    // 检查是否已经内联
    if (document.getElementById('critical-css')) {
      return
    }

    const style = document.createElement('style')
    style.id = 'critical-css'
    style.textContent = this.criticalCSS

    // 插入到最前面
    const firstStyle = document.querySelector('style')
    if (firstStyle) {
      firstStyle.parentNode?.insertBefore(style, firstStyle)
    } else {
      document.head.insertBefore(style, document.head.firstChild)
    }
  }

  /**
   * 异步加载非关键CSS
   */
  static loadNonCriticalCSS(href: string): Promise<void> {
    return new Promise((resolve, reject) => {
      // 检查是否已经加载
      const existingLink = document.querySelector(`link[href="${href}"]`)
      if (existingLink) {
        resolve()
        return
      }

      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = href
      link.media = 'print' // 先设置为print以避免阻塞渲染

      link.onload = () => {
        link.media = 'all' // 加载完成后改为all
        resolve()
      }

      link.onerror = () => {
        console.warn(`Failed to load CSS: ${href}`)
        // 即使失败也要设置为all，避免样式完全缺失
        link.media = 'all'
        reject(new Error(`Failed to load CSS: ${href}`))
      }

      document.head.appendChild(link)
    })
  }

  /**
   * 预加载CSS文件
   */
  static preloadCSS(href: string): void {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'style'
    link.href = href

    // 添加onload回调，转换为stylesheet
    link.onload = () => {
      link.rel = 'stylesheet'
    }

    document.head.appendChild(link)
  }

  /**
   * 初始化关键CSS优化
   */
  static async init(): Promise<void> {
    try {
      // 等待DOM加载完成
      if (document.readyState === 'loading') {
        await new Promise(resolve => {
          document.addEventListener('DOMContentLoaded', resolve, { once: true })
        })
      }

      // 提取关键CSS
      await this.extractCriticalCSS()

      // 内联关键CSS
      this.inlineCriticalCSS()

      // 标记非关键样式
      this.markNonCriticalStyles()

      console.log('✅ Critical CSS optimization completed')
    } catch (error) {
      console.warn('⚠️ Critical CSS optimization failed:', error)
    }
  }

  /**
   * 标记非关键样式为异步加载
   */
  private static markNonCriticalStyles(): void {
    const links = document.querySelectorAll('link[rel="stylesheet"]')

    links.forEach(link => {
      const href = (link as HTMLLinkElement).href

      // 跳过内联的关键CSS
      if (href.includes('critical') || !href) {
        return
      }

      // 将非关键CSS改为异步加载
      this.loadNonCriticalCSS(href).catch(() => {
        // 静默处理错误，避免影响页面功能
      })
    })
  }

  /**
   * 生成首屏CSS快照（用于静态优化）
   */
  static async generateSnapshot(): Promise<string> {
    // 获取首屏可见元素的样式
    const visibleElements = document.elementsFromPoint(
      window.innerWidth / 2,
      window.innerHeight / 2
    )

    let snapshotCSS = ''

    for (const element of visibleElements) {
      const styles = window.getComputedStyle(element)
      const importantStyles = [
        'display', 'position', 'width', 'height', 'margin', 'padding',
        'background', 'color', 'font-size', 'font-weight', 'line-height',
        'transform', 'opacity', 'visibility'
      ]

      for (const style of importantStyles) {
        const value = styles.getPropertyValue(style)
        if (value && value !== 'initial' && value !== 'normal') {
          snapshotCSS += `${style}: ${value};\n`
        }
      }
    }

    return this.minifyCSS(snapshotCSS)
  }

  /**
   * 清理和重置
   */
  static reset(): void {
    this.criticalCSS = ''
    this.isExtracted = false

    // 移除内联的关键CSS
    const criticalStyle = document.getElementById('critical-css')
    if (criticalStyle) {
      criticalStyle.remove()
    }
  }
}

// 自动初始化（可选）
if (typeof window !== 'undefined') {
  // 可以通过设置全局变量控制是否自动初始化
  if ((window as any).__ENABLE_CRITICAL_CSS__ !== false) {
    // 延迟初始化，确保不影响页面加载
    if (document.readyState === 'complete') {
      CriticalCSS.init()
    } else {
      window.addEventListener('load', () => {
        setTimeout(CriticalCSS.init, 0)
      })
    }
  }
}