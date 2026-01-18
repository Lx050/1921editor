// Web Worker 管理器
// 用于管理异步任务和 Worker 实例

class WorkerManager {
  constructor() {
    this.workers = new Map()
    this.taskQueue = []
    this.activeTasks = new Map()
    this.taskId = 0
  }

  // 创建或获取 Worker 实例
  getWorker(workerName) {
    if (this.workers.has(workerName)) {
      return this.workers.get(workerName)
    }

    let worker
    switch (workerName) {
      case 'textProcessor':
        worker = new Worker('/src/workers/textProcessor.js')
        break
      default:
        throw new Error(`Unknown worker: ${workerName}`)
    }

    // 设置消息处理器
    worker.onmessage = (event) => {
      const { id, type, result, error } = event.data
      const task = this.activeTasks.get(id)

      if (task) {
        this.activeTasks.delete(id)

        if (type.includes('success')) {
          task.resolve(result)
        } else {
          task.reject(new Error(error || 'Task failed'))
        }
      }
    }

    worker.onerror = (error) => {
      console.error('Worker error:', error)
      // Note: worker.onerror doesn't provide task ID, so we can't remove specific task
      // The task will timeout if not completed
    }

    this.workers.set(workerName, worker)
    return worker
  }

  // 运行任务
  async runTask(workerName, type, data, options = {}) {
    return new Promise((resolve, reject) => {
      const taskId = `task_${++this.taskId}_${Date.now()}`
      const timeout = options.timeout || 30000 // 默认 30 秒超时

      // 设置超时
      const timeoutId = setTimeout(() => {
        this.activeTasks.delete(taskId)
        reject(new Error(`Task timeout after ${timeout}ms`))
      }, timeout)

      // 保存任务回调
      this.activeTasks.set(taskId, {
        resolve: (result) => {
          clearTimeout(timeoutId)
          resolve(result)
        },
        reject: (error) => {
          clearTimeout(timeoutId)
          reject(error)
        }
      })

      // 发送任务到 Worker
      const worker = this.getWorker(workerName)
      worker.postMessage({
        id: taskId,
        type,
        data
      })
    })
  }

  // 处理文本（使用 textProcessor Worker）
  async processText(text, options = {}) {
    const defaultOptions = {
      detectType: true,
      enableStyling: true,
      ...options
    }

    return this.runTask('textProcessor', 'process-text', {
      text,
      options: defaultOptions
    })
  }

  // 清空队列
  clearQueue(workerName) {
    const worker = this.getWorker(workerName)
    worker.postMessage({ type: 'clear-queue' })
  }

  // 获取队列长度
  getQueueLength(workerName) {
    const worker = this.getWorker(workerName)
    worker.postMessage({ type: 'get-queue-length' })
  }

  // 终止所有 Worker
  terminate() {
    this.workers.forEach(worker => {
      worker.terminate()
    })
    this.workers.clear()
    this.activeTasks.clear()
  }
}

// 创建单例实例
const workerManager = new WorkerManager()

// 页面卸载时清理
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    workerManager.terminate()
  })
}

export default workerManager