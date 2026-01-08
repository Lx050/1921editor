/**
 * 并发上传工具
 * 专门优化AI图片等大文件的并发上传性能
 */

export interface UploadTask {
  id: string
  url: string
  file?: File
  priority?: 'high' | 'normal' | 'low'
  retryCount?: number
  maxRetries?: number
}

export interface UploadProgress {
  taskId: string
  status: 'pending' | 'downloading' | 'uploading' | 'completed' | 'failed' | 'retrying'
  progress: number // 0-100
  message: string
  error?: string
  speed?: number // bytes per second
}

export interface UploadConfig {
  maxConcurrent?: number // 最大并发数
  timeout?: number // 超时时间(ms)
  chunkSize?: number // 分片大小
  enableRetry?: boolean // 是否启用重试
  retryDelay?: number // 重试延迟(ms)
  maxRetries?: number // 最大重试次数
  enableProgressCallback?: boolean // 是否启用进度回调
  enableCompression?: boolean // 是否启用图片压缩
  compressionQuality?: number // 压缩质量 0.1-1.0
}

export class ConcurrentUploadManager {
  private static instance: ConcurrentUploadManager
  private config: Required<UploadConfig>
  private activeTasks = new Map<string, UploadTask>()
  private progressCallbacks = new Set<(progress: UploadProgress) => void>()
  private activeUploads = new Set<string>()
  private stats = {
    total: 0,
    completed: 0,
    failed: 0,
    totalBytes: 0,
    uploadedBytes: 0
  }

  constructor(config: UploadConfig = {}) {
    this.config = {
      maxConcurrent: config.maxConcurrent || 3,
      timeout: config.timeout || 30000,
      chunkSize: config.chunkSize || 1024 * 1024, // 1MB
      enableRetry: config.enableRetry !== false,
      retryDelay: config.retryDelay || 1000,
      maxRetries: config.maxRetries || 3,
      enableProgressCallback: config.enableProgressCallback !== false,
      enableCompression: config.enableCompression || false,
      compressionQuality: config.compressionQuality || 0.8
    }
  }

  static getInstance(config?: UploadConfig): ConcurrentUploadManager {
    if (!ConcurrentUploadManager.instance) {
      ConcurrentUploadManager.instance = new ConcurrentUploadManager(config)
    }
    return ConcurrentUploadManager.instance
  }

  /**
   * 添加进度回调
   */
  onProgress(callback: (progress: UploadProgress) => void): void {
    this.progressCallbacks.add(callback)
  }

  /**
   * 移除进度回调
   */
  offProgress(callback: (progress: UploadProgress) => void): void {
    this.progressCallbacks.delete(callback)
  }

  /**
   * 通知进度更新
   */
  private notifyProgress(progress: UploadProgress): void {
    this.progressCallbacks.forEach(callback => {
      try {
        callback(progress)
      } catch (error) {
        console.error('Progress callback error:', error)
      }
    })
  }

  /**
   * 批量下载并上传图片
   */
  async downloadAndUpload(urls: string[], uploadFn: (file: File) => Promise<{ url: string }>): Promise<{
    results: { original: string; newUrl: string }[]
    errors: { url: string; error: string }[]
  }> {
    console.log(`[ConcurrentUpload] 开始处理 ${urls.length} 个图片，最大并发: ${this.config.maxConcurrent}`)

    this.stats.total = urls.length
    this.stats.completed = 0
    this.stats.failed = 0

    const tasks: UploadTask[] = urls.map((url, index) => ({
      id: `task-${index}-${Date.now()}`,
      url,
      priority: 'normal'
    }))

    this.activeTasks.clear()
    tasks.forEach(task => this.activeTasks.set(task.id, task))

    // 使用并发控制处理任务
    const results = await this.processWithConcurrency(
      tasks,
      (task) => this.downloadAndUploadSingle(task, uploadFn)
    )

    const successful = results.filter((r): r is PromiseFulfilledResult<{ original: string; newUrl: string }> => r.status === 'fulfilled')
    const failed = results.filter((r): r is PromiseRejectedResult => r.status === 'rejected')

    this.stats.completed = successful.length
    this.stats.failed = failed.length

    console.log(`[ConcurrentUpload] 完成 - 成功: ${successful.length}, 失败: ${failed.length}`)

    return {
      results: successful.map(r => r.value),
      errors: failed.map(r => ({ url: '', error: r.reason instanceof Error ? r.reason.message : String(r.reason) }))
    }
  }

  /**
   * 带并发控制的任务处理
   */
  private async processWithConcurrency<T, R>(
    items: T[],
    processor: (item: T) => Promise<R>
  ): Promise<PromiseSettledResult<R>[]> {
    const results: Promise<PromiseSettledResult<R>>[] = []
    const executing: Promise<any>[] = []

    for (const item of items) {
      const promise = processor(item)
        .then(result => ({ status: 'fulfilled', value: result } as PromiseSettledResult<R>))
        .catch(error => ({ status: 'rejected', reason: error } as PromiseSettledResult<R>))

      results.push(promise)

      const e: Promise<any> = promise.finally(() => {
        const index = executing.indexOf(e)
        if (index > -1) {
          executing.splice(index, 1)
        }
      })
      executing.push(e)

      if (executing.length >= this.config.maxConcurrent) {
        await Promise.race(executing)
      }
    }

    return Promise.all(results)
  }

  /**
   * 单个图片下载并上传
   */
  private async downloadAndUploadSingle(
    task: UploadTask,
    uploadFn: (file: File) => Promise<{ url: string }>
  ): Promise<{ original: string; newUrl: string }> {
    const startTime = Date.now()

    try {
      // 下载阶段
      this.notifyProgress({
        taskId: task.id,
        status: 'downloading',
        progress: 0,
        message: `准备下载: ${this.shortenUrl(task.url)}`
      })

      const file = await this.downloadWithProgress(task)

      // 上传阶段
      this.notifyProgress({
        taskId: task.id,
        status: 'uploading',
        progress: 50,
        message: `上传中: ${this.shortenUrl(task.url)}`
      })

      const result = await this.uploadWithProgress(task, file, uploadFn)

      // 完成
      const duration = Date.now() - startTime
      const speed = file.size / (duration / 1000) // bytes per second

      this.notifyProgress({
        taskId: task.id,
        status: 'completed',
        progress: 100,
        message: `✓ 完成: ${this.shortenUrl(task.url)}`,
        speed
      })

      return {
        original: task.url,
        newUrl: result.url
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '未知错误'

      if (this.config.enableRetry && (task.retryCount || 0) < (task.maxRetries || 3)) {
        // 重试
        task.retryCount = (task.retryCount || 0) + 1
        this.notifyProgress({
          taskId: task.id,
          status: 'retrying',
          progress: 0,
          message: `重试 ${task.retryCount}/${task.maxRetries || 3}: ${this.shortenUrl(task.url)}`
        })

        // 延迟重试
        await this.delay(this.config.retryDelay * Math.pow(2, task.retryCount - 1))
        return this.downloadAndUploadSingle(task, uploadFn)
      }

      this.notifyProgress({
        taskId: task.id,
        status: 'failed',
        progress: 0,
        message: `✗ 失败: ${this.shortenUrl(task.url)}`,
        error: errorMessage
      })

      throw new Error(`${this.shortenUrl(task.url)}: ${errorMessage}`)
    }
  }

  /**
   * 带进度的下载
   */
  private async downloadWithProgress(task: UploadTask): Promise<File> {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout)

    try {
      const response = await fetch(task.url, {
        mode: 'cors',
        signal: controller.signal
      })

      if (!response.ok) {
        throw new Error(`下载失败: HTTP ${response.status}`)
      }

      const contentLength = response.headers.get('content-length')
      const total = contentLength ? parseInt(contentLength, 10) : 0

      const reader = response.body!.getReader()
      const chunks: Uint8Array[] = []
      let received = 0

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        if (value) {
          chunks.push(value)
          received += value.length
        }

        // 更新进度
        if (total > 0) {
          const progress = Math.min((received / total) * 25, 25) // 下载占25%
          this.notifyProgress({
            taskId: task.id,
            status: 'downloading',
            progress,
            message: `下载中: ${this.formatBytes(received)}/${this.formatBytes(total)}`
          })
        }
      }

      clearTimeout(timeoutId)

      // 合并所有chunks
      const blob = new Blob(chunks as BlobPart[])
      const fileName = this.extractFileName(task.url) || `image-${Date.now()}.png`
      const mimeType = blob.type || this.getMimeTypeFromUrl(task.url)

      // 图片压缩优化
      let finalFile = new File([blob], fileName, { type: mimeType })

      if (this.config.enableCompression && this.isImageFile(mimeType)) {
        try {
          finalFile = await this.compressImage(finalFile)
          console.log(`[ConcurrentUpload] 图片压缩成功: ${this.formatBytes(blob.size)} -> ${this.formatBytes(finalFile.size)}`)
        } catch (compressError) {
          console.warn(`[ConcurrentUpload] 图片压缩失败，使用原图:`, compressError)
        }
      }

      return finalFile
    } catch (error) {
      clearTimeout(timeoutId)
      throw error
    }
  }

  /**
   * 带进度的上传
   */
  private async uploadWithProgress(
    task: UploadTask,
    file: File,
    uploadFn: (file: File) => Promise<{ url: string }>
  ): Promise<{ url: string }> {
    // 如果uploadFn不支持进度，我们就模拟进度
    const uploadPromise = uploadFn(file)

    // 模拟进度更新
    let progress = 50
    const progressInterval = setInterval(() => {
      progress += 5
      if (progress < 95) {
        this.notifyProgress({
          taskId: task.id,
          status: 'uploading',
          progress,
          message: `上传中: ${Math.round(progress - 50)}%`
        })
      }
    }, 200)

    try {
      const result = await uploadPromise

      clearInterval(progressInterval)

      // 设置完成进度
      this.notifyProgress({
        taskId: task.id,
        status: 'uploading',
        progress: 95,
        message: `处理中...`
      })

      return result
    } catch (error) {
      clearInterval(progressInterval)
      throw error
    }
  }

  /**
   * 获取统计信息
   */
  getStats() {
    return { ...this.stats }
  }

  /**
   * 取消所有任务
   */
  cancelAll(): void {
    this.activeTasks.clear()
    this.activeUploads.clear()
  }

  // 工具方法
  private shortenUrl(url: string): string {
    if (url.length <= 50) return url
    return url.substring(0, 30) + '...' + url.substring(url.length - 20)
  }

  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  private extractFileName(url: string): string | null {
    const matches = url.match(/\/([^\/]+\.(png|jpg|jpeg|gif|webp|avif))/i)
    return matches ? matches[1] : null
  }

  private getMimeTypeFromUrl(url: string): string {
    const ext = url.split('.').pop()?.toLowerCase()
    switch (ext) {
      case 'png': return 'image/png'
      case 'jpg':
      case 'jpeg': return 'image/jpeg'
      case 'gif': return 'image/gif'
      case 'webp': return 'image/webp'
      case 'avif': return 'image/avif'
      default: return 'image/png'
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  /**
   * 判断是否为图片文件
   */
  private isImageFile(mimeType: string): boolean {
    return mimeType.startsWith('image/')
  }

  /**
   * 压缩图片
   */
  private async compressImage(file: File): Promise<File> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()

      img.onload = () => {
        try {
          if (!ctx) {
            reject(new Error('Canvas context not available'))
            return
          }

          // 计算新尺寸（最大宽度限制）
          const maxWidth = 1920
          let { width, height } = img

          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width)
            width = maxWidth
          }

          canvas.width = width
          canvas.height = height

          // 绘制压缩后的图片
          ctx.drawImage(img, 0, 0, width, height)

          // 转换为 Blob
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('Image compression failed'))
                return
              }

              const compressedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now()
              })

              resolve(compressedFile)
            },
            file.type,
            this.config.compressionQuality
          )
        } catch (error) {
          reject(error)
        }
      }

      img.onerror = () => reject(new Error('Image load failed'))

      // 创建 Object URL
      const objectURL = URL.createObjectURL(file)
      img.src = objectURL

      // 清理 Object URL
      img.onload = () => {
        URL.revokeObjectURL(objectURL)
      }

      // 注意：上面的 onload 会覆盖前面的 onload，所以需要合并
      const originalOnload = img.onload;
      img.onload = () => {
        if (originalOnload) (originalOnload as any).call(img);
        URL.revokeObjectURL(objectURL);
      };
    })
  }
}

// 导出单例实例
export const concurrentUpload = ConcurrentUploadManager.getInstance()