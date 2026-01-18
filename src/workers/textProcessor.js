// Web Worker 用于处理文本相关的 CPU 密集型任务
// 将这些任务移出主线程以提高 TTI

let processingQueue = []
let isProcessing = false

// 处理文本解析任务
async function processText(data) {
  const { text, options } = data

  try {
    // 模拟文本处理
    const paragraphs = text.split(/\n\s*\n/)
    const blocks = []

    for (const paragraph of paragraphs) {
      if (paragraph.trim()) {
        const block = {
          id: Math.random().toString(36).substr(2, 9),
          content: paragraph.trim(),
          type: options.detectType ? detectBlockType(paragraph) : 'paragraph',
          timestamp: Date.now()
        }

        // 处理样式
        if (options.enableStyling) {
          block.styles = processStyles(paragraph)
        }

        blocks.push(block)
      }
    }

    return {
      success: true,
      blocks: blocks,
      count: blocks.length
    }
  } catch (error) {
    return {
      success: false,
      error: error.message
    }
  }
}

// 检测块类型
function detectBlockType(text) {
  if (/^\d+\./.test(text.trim())) return 'ordered-list'
  if (/^[•·-]/.test(text.trim())) return 'unordered-list'
  if (text.trim().length < 50 && !text.includes('。')) return 'heading'
  return 'paragraph'
}

// 处理样式
function processStyles(text) {
  const styles = {}

  // 检测加粗
  if (/\*\*.*?\*\*/.test(text)) {
    styles.bold = true
  }

  // 检测斜体
  if (/\*.*?\*/.test(text)) {
    styles.italic = true
  }

  return styles
}

// 处理队列中的任务
async function processQueue() {
  if (isProcessing || processingQueue.length === 0) return

  isProcessing = true
  const { data, resolve, reject } = processingQueue.shift()

  try {
    const result = await processText(data)
    resolve(result)
  } catch (error) {
    reject(error)
  } finally {
    isProcessing = false
    // 继续处理队列
    if (processingQueue.length > 0) {
      setTimeout(processQueue, 0)
    }
  }
}

// 消息处理器
self.onmessage = function(event) {
  const { id, type, data } = event.data

  switch (type) {
    case 'process-text': {
      // 使用 Promise 链处理
      const promise = new Promise((resolve, reject) => {
        processingQueue.push({ id, data, resolve, reject })
        processQueue()
      })

      promise
        .then(result => {
          self.postMessage({ id, type: 'process-text-success', result })
        })
        .catch(error => {
          self.postMessage({ id, type: 'process-text-error', error: error.message })
        })
      break
    }

    case 'clear-queue':
      processingQueue = []
      self.postMessage({ type: 'queue-cleared' })
      break

    case 'get-queue-length':
      self.postMessage({ type: 'queue-length', length: processingQueue.length })
      break

    default:
      self.postMessage({ type: 'error', error: 'Unknown message type: ' + type })
  }
}

// 错误处理
self.onerror = function(error) {
  self.postMessage({ type: 'worker-error', error: error.message })
}

// 导出函数供测试使用
self.processText = processText
self.detectBlockType = detectBlockType
self.processStyles = processStyles