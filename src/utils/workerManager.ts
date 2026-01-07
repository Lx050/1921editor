/**
 * Web Worker管理器
 * 专门管理DOCX等大文件处理的Worker
 */

export interface WorkerTask {
  id: string
  type: 'PROCESS_DOCX' | 'EXTRACT_IMAGES' | 'PROCESS_WITH_IMAGES'
  file: File
  options?: any
  timeout?: number
}

export interface WorkerProgress {
  id: string
  progress: number
  message: string
}

export interface WorkerResult {
  id: string
  type: 'SUCCESS' | 'IMAGES_EXTRACTED' | 'PROCESS_WITH_IMAGES_SUCCESS'
  payload: any
}

export interface WorkerError {
  id: string
  error: string
  stack?: string
}

export class DocxWorkerManager {
  private static instance: DocxWorkerManager
  private worker: Worker | null = null
  private activeTasks = new Map<string, WorkerTask>()
  private pendingTasks: WorkerTask[] = []
  private maxConcurrent = 1 // DOCX处理很重，限制并发
  private taskTimeout = 60000 // 60秒超时
  private progressCallbacks = new Map<string, (progress: WorkerProgress) => void>()
  private resolveCallbacks = new Map<string, (result: WorkerResult) => void>()
  private rejectCallbacks = new Map<string, (error: WorkerError) => void>()
  private timeoutTimers = new Map<string, ReturnType<typeof setTimeout>>()

  private constructor() {
    this.initWorker()
  }

  static getInstance(): DocxWorkerManager {
    if (!DocxWorkerManager.instance) {
      DocxWorkerManager.instance = new DocxWorkerManager()
    }
    return DocxWorkerManager.instance
  }

  private initWorker(): void {
    try {
      // 创建Worker实例
      this.worker = new Worker(
        new URL('../workers/docxProcessor.worker.ts', import.meta.url),
        { type: 'module' }
      )

      // 设置消息处理
      this.worker.onmessage = this.handleWorkerMessage.bind(this)
      this.worker.onerror = this.handleWorkerError.bind(this)

      console.log('[DocxWorkerManager] Worker初始化成功')
    } catch (error) {
      console.error('[DocxWorkerManager] Worker初始化失败:', error)
      // 降级到主线程处理
      this.worker = null
    }
  }

  /**
   * 处理Worker消息
   */
  private handleWorkerMessage(event: MessageEvent): void {
    const { id, type, payload } = event.data

    switch (type) {
      case 'PROGRESS':
        this.handleProgress(id, payload as WorkerProgress)
        break

      case 'SUCCESS':
      case 'IMAGES_EXTRACTED':
      case 'PROCESS_WITH_IMAGES_SUCCESS':
        this.handleSuccess(id, { id, type, payload } as WorkerResult)
        break

      case 'ERROR':
        this.handleError(id, payload as WorkerError)
        break

      default:
        console.warn('[DocxWorkerManager] 未知消息类型:', type)
    }
  }

  /**
   * 处理Worker错误
   */
  private handleWorkerError(event: ErrorEvent): void {
    console.error('[DocxWorkerManager] Worker错误:', event)

    // 标记所有任务失败
    this.activeTasks.forEach((_task, id) => {
      this.handleError(id, {
        id,
        error: event.message || 'Worker发生错误',
        stack: event.error?.stack
      })
    })
  }

  /**
   * 处理进度更新
   */
  private handleProgress(id: string, progress: WorkerProgress): void {
    const callback = this.progressCallbacks.get(id)
    if (callback) {
      callback(progress)
    }
  }

  /**
   * 处理成功结果
   */
  private handleSuccess(id: string, result: WorkerResult): void {
    this.clearTask(id)

    const resolve = this.resolveCallbacks.get(id)
    if (resolve) {
      resolve(result)
    }
  }

  /**
   * 处理错误
   */
  private handleError(id: string, error: WorkerError): void {
    this.clearTask(id)

    const reject = this.rejectCallbacks.get(id)
    if (reject) {
      reject(error)
    }
  }

  /**
   * 清理任务
   */
  private clearTask(id: string): void {
    this.activeTasks.delete(id)
    this.progressCallbacks.delete(id)
    this.resolveCallbacks.delete(id)
    this.rejectCallbacks.delete(id)

    const timer = this.timeoutTimers.get(id)
    if (timer) {
      clearTimeout(timer)
      this.timeoutTimers.delete(id)
    }

    // 处理下一个任务
    this.processNextTask()
  }

  /**
   * 处理下一个任务
   */
  private processNextTask(): void {
    if (this.activeTasks.size >= this.maxConcurrent || this.pendingTasks.length === 0) {
      return
    }

    const task = this.pendingTasks.shift()
    if (!task) return

    // 如果Worker未初始化，降级到主线程处理
    if (!this.worker) {
      this.fallbackToMainThread(task)
      return
    }

    // 设置超时
    const timeout = task.timeout || this.taskTimeout
    const timer = setTimeout(() => {
      this.handleError(task.id, {
        id: task.id,
        error: `任务超时 (${timeout}ms)`
      })
    }, timeout)
    this.timeoutTimers.set(task.id, timer)

    // 添加到活跃任务
    this.activeTasks.set(task.id, task)

    // 发送任务到Worker
    this.worker!.postMessage({
      id: task.id,
      type: task.type,
      payload: {
        file: task.file,
        options: task.options
      }
    })
  }

  /**
   * 降级到主线程处理
   */
  private async fallbackToMainThread(task: WorkerTask): Promise<void> {
    console.warn('[DocxWorkerManager] 降级到主线程处理:', task.id)

    try {
      // 动态导入mammoth（主线程）
      const mammoth = await import('mammoth')

      // 模拟进度
      this.handleProgress(task.id, {
        id: task.id,
        progress: 10,
        message: '降级到主线程处理...'
      })

      const arrayBuffer = await task.file.arrayBuffer()
      this.handleProgress(task.id, {
        id: task.id,
        progress: 50,
        message: '解析文档中...'
      })

      const result = await mammoth.convertToHtml({ arrayBuffer })
      this.handleProgress(task.id, {
        id: task.id,
        progress: 90,
        message: '处理完成...'
      })

      this.handleSuccess(task.id, {
        id: task.id,
        type: 'SUCCESS',
        payload: {
          html: result.value,
          metadata: {
            title: task.file.name.replace(/\.[^/.]+$/, ""),
            created: new Date(task.file.lastModified)
          }
        }
      })

    } catch (error) {
      this.handleError(task.id, {
        id: task.id,
        error: error instanceof Error ? error.message : '处理失败',
        stack: error instanceof Error ? error.stack : undefined
      })
    }
  }

  /**
   * 添加任务
   */
  public addTask(task: WorkerTask): Promise<WorkerResult> {
    return new Promise((resolve, reject) => {
      const taskId = task.id || this.generateTaskId()
      task.id = taskId

      // 保存回调
      this.resolveCallbacks.set(taskId, resolve)
      this.rejectCallbacks.set(taskId, reject)

      // 添加到队列
      this.pendingTasks.push(task)

      // 立即尝试处理
      this.processNextTask()
    })
  }

  /**
   * 设置进度回调
   */
  public setProgressCallback(id: string, callback: (progress: WorkerProgress) => void): void {
    this.progressCallbacks.set(id, callback)
  }

  /**
   * 取消任务
   */
  public cancelTask(id: string): boolean {
    const index = this.pendingTasks.findIndex(t => t.id === id)
    if (index !== -1) {
      this.pendingTasks.splice(index, 1)
      this.clearTask(id)
      return true
    }

    if (this.activeTasks.has(id)) {
      this.clearTask(id)
      return true
    }

    return false
  }

  /**
   * 取消所有任务
   */
  public cancelAllTasks(): void {
    // 清理所有待处理任务
    this.pendingTasks = []

    // 清理所有活跃任务
    this.activeTasks.forEach((_, id) => {
      this.clearTask(id)
    })
  }

  /**
   * 获取任务状态
   */
  public getTaskStatus(id: string): 'pending' | 'active' | 'not-found' {
    if (this.pendingTasks.some(t => t.id === id)) return 'pending'
    if (this.activeTasks.has(id)) return 'active'
    return 'not-found'
  }

  /**
   * 获取活跃任务数量
   */
  public getActiveTaskCount(): number {
    return this.activeTasks.size
  }

  /**
   * 获取待处理任务数量
   */
  public getPendingTaskCount(): number {
    return this.pendingTasks.length
  }

  /**
   * 生成任务ID
   */
  private generateTaskId(): string {
    return `docx-task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * 销毁Worker
   */
  public destroy(): void {
    this.cancelAllTasks()

    if (this.worker) {
      this.worker.terminate()
      this.worker = null
    }
  }

  /**
   * 重新初始化Worker
   */
  public reinit(): void {
    this.destroy()
    this.initWorker()
  }
}

// 导出单例
export const docxWorkerManager = DocxWorkerManager.getInstance()