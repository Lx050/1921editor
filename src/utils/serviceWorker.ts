/**
 * Service Worker 注册和管理工具
 */

export class ServiceWorkerManager {
  private static instance: ServiceWorkerManager
  private registration: ServiceWorkerRegistration | null = null
  private isSupported = false

  constructor() {
    this.isSupported = 'serviceWorker' in navigator
  }

  static getInstance(): ServiceWorkerManager {
    if (!ServiceWorkerManager.instance) {
      ServiceWorkerManager.instance = new ServiceWorkerManager()
    }
    return ServiceWorkerManager.instance
  }

  /**
   * 注册Service Worker
   */
  async register(): Promise<boolean> {
    if (!this.isSupported) {
      console.warn('[SW] Service Worker not supported')
      return false
    }

    try {
      this.registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      })

      console.log('[SW] Service Worker registered:', this.registration.scope)

      // 监听更新
      this.registration.addEventListener('updatefound', () => {
        const newWorker = this.registration?.installing
        if (newWorker) {
          this.handleWorkerUpdate(newWorker)
        }
      })

      return true
    } catch (error) {
      console.error('[SW] Service Worker registration failed:', error)
      return false
    }
  }

  /**
   * 处理Service Worker更新
   */
  private handleWorkerUpdate(worker: ServiceWorker) {
    worker.addEventListener('statechange', () => {
      if (worker.state === 'installed' && navigator.serviceWorker.controller) {
        // 有新版本可用
        this.onUpdateAvailable()
      }
    })
  }

  /**
   * 有新版本可用时的回调
   */
  private onUpdateAvailable() {
    console.log('[SW] New version available')

    // 创建更新提示
    this.showUpdatePrompt()

    // 触发自定义事件
    window.dispatchEvent(new CustomEvent('sw-update-available', {
      detail: { version: 'new' }
    }))
  }

  /**
   * 显示更新提示
   */
  private showUpdatePrompt() {
    // 创建简单的提示元素
    const prompt = document.createElement('div')
    prompt.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: #4f46e5;
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      z-index: 9999;
      font-size: 14px;
      cursor: pointer;
      max-width: 300px;
    `

    prompt.innerHTML = `
      <div style="display: flex; align-items: center; gap: 10px;">
        <span>🚀 新版本可用，点击更新</span>
        <button style="background: white; color: #4f46e5; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer;">更新</button>
      </div>
    `

    prompt.querySelector('button')?.addEventListener('click', () => {
      this.applyUpdate()
      prompt.remove()
    })

    document.body.appendChild(prompt)

    // 5秒后自动隐藏
    setTimeout(() => {
      if (document.body.contains(prompt)) {
        prompt.remove()
      }
    }, 5000)
  }

  /**
   * 应用更新
   */
  async applyUpdate() {
    if (this.registration?.waiting) {
      // 告诉waiting worker跳过等待
      this.registration.waiting.postMessage({ type: 'SKIP_WAITING' })
    }

    // 重新加载页面
    window.location.reload()
  }

  /**
   * 检查更新
   */
  async checkForUpdates() {
    if (this.registration) {
      try {
        await this.registration.update()
        console.log('[SW] Checked for updates')
      } catch (error) {
        console.error('[SW] Update check failed:', error)
      }
    }
  }

  /**
   * 获取当前版本信息
   */
  async getVersion(): Promise<string | null> {
    if (!this.registration?.active) {
      return null
    }

    try {
      // 使用消息通道获取版本信息
      const messageChannel = new MessageChannel()

      return new Promise((resolve) => {
        messageChannel.port1.onmessage = (event) => {
          if (event.data.type === 'VERSION') {
            resolve(event.data.payload)
          } else {
            resolve(null)
          }
        }

        this.registration?.active?.postMessage(
          { type: 'GET_VERSION' },
          [messageChannel.port2]
        )

        // 超时处理
        setTimeout(() => resolve(null), 2000)
      })
    } catch (error) {
      console.error('[SW] Failed to get version:', error)
      return null
    }
  }

  /**
   * 预缓存资源
   */
  async precache(urls: string[]) {
    if (!this.registration?.active) {
      return false
    }

    try {
      const messageChannel = new MessageChannel()

      return new Promise((resolve) => {
        messageChannel.port1.onmessage = (event) => {
          if (event.data.type === 'CACHED') {
            resolve(true)
          } else if (event.data.type === 'CACHE_ERROR') {
            console.error('[SW] Cache error:', event.data.payload.error)
            resolve(false)
          } else {
            resolve(false)
          }
        }

        this.registration?.active?.postMessage(
          { type: 'CACHE_URLS', payload: { urls } },
          [messageChannel.port2]
        )

        // 超时处理
        setTimeout(() => resolve(false), 10000)
      })
    } catch (error) {
      console.error('[SW] Precache failed:', error)
      return false
    }
  }

  /**
   * 清理过期缓存
   */
  async cleanupCache() {
    if (!this.registration?.active) {
      return
    }

    this.registration.active.postMessage({ type: 'CLEANUP_CACHE' })
  }

  /**
   * 获取缓存统计
   */
  async getCacheStats(): Promise<{
    size: number
    entries: number
  } | null> {
    if (!('caches' in window)) {
      return null
    }

    try {
      const cacheNames = await caches.keys()
      let totalSize = 0
      let totalEntries = 0

      for (const cacheName of cacheNames) {
        const cache = await caches.open(cacheName)
        const keys = await cache.keys()
        totalEntries += keys.length

        // 估算缓存大小（不精确）
        for (const request of keys) {
          const response = await cache.match(request)
          if (response) {
            const text = await response.text()
            totalSize += new Blob([text]).size
          }
        }
      }

      return {
        size: totalSize,
        entries: totalEntries
      }
    } catch (error) {
      console.error('[SW] Failed to get cache stats:', error)
      return null
    }
  }

  /**
   * 取消注册Service Worker
   */
  async unregister(): Promise<boolean> {
    if (!this.registration) {
      return true
    }

    try {
      const result = await this.registration.unregister()
      console.log('[SW] Service Worker unregistered:', result)
      this.registration = null
      return result
    } catch (error) {
      console.error('[SW] Unregister failed:', error)
      return false
    }
  }

  /**
   * 检查是否受控
   */
  isControlled(): boolean {
    return !!navigator.serviceWorker.controller
  }

  /**
   * 获取注册状态
   */
  getStatus() {
    return {
      supported: this.isSupported,
      registered: !!this.registration,
      controlled: this.isControlled(),
      scope: this.registration?.scope || null
    }
  }
}

// 创建单例实例
const swManager = ServiceWorkerManager.getInstance()

// 自动注册（生产环境）
if (import.meta.env.PROD) {
  swManager.register().then(success => {
    if (success) {
      console.log('[SW] Auto-registration successful')
    }
  })
}

export default swManager