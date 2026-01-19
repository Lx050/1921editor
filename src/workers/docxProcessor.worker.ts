/**
 * Web Worker - DOCX文件处理器
 * 将大文件处理从主线程移到后台，避免阻塞UI
 */

// 导入mammoth库（需要在worker中处理）
declare const importScripts: (url: string) => void

// 动态加载mammoth库
// 动态加载mammoth库
importScripts('/vendor/mammoth.browser.min.js')

// Mammoth 类型定义
interface MammothOptions {
  styleMap?: string[]
  includeDefaultStyleMap?: boolean
  ignoreEmptyParagraphs?: boolean
  convertImage?: boolean
}

interface MammothResult {
  value: string
  messages: Array<{ type: string; message: string }>
}

interface Mammoth {
  extractRawText(input: { arrayBuffer: ArrayBuffer }, options: MammothOptions): Promise<MammothResult>
  convertToHtml(input: { arrayBuffer: ArrayBuffer }, options: MammothOptions): Promise<MammothResult>
  extractImages(input: { arrayBuffer: ArrayBuffer }): Promise<Array<{ src: string; buffer: Blob }>>
}

declare const mammoth: Mammoth

// 类型定义
interface DocxProcessOptions {
  includeDefaultStyleMap?: boolean
  styleMap?: string[]
  convertImage?: boolean
  ignoreEmptyParagraphs?: boolean
}

interface DocxProcessResult {
  html: string
  images: { [key: string]: string }
  metadata: {
    title?: string
    author?: string
    created?: Date
  }
}

// 处理DOCX文件的主函数
self.onmessage = async (event) => {
  const { type, payload, id } = event.data

  try {
    switch (type) {
      case 'PROCESS_DOCX':
        await processDocx(payload.file, payload.options, id)
        break

      case 'EXTRACT_IMAGES':
        await extractImages(payload.file, id)
        break

      case 'PROCESS_WITH_IMAGES':
        await processWithImages(payload.file, payload.options, id)
        break

      default:
        throw new Error(`Unknown message type: ${type}`)
    }
  } catch (error) {
    self.postMessage({
      id,
      type: 'ERROR',
      payload: {
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      }
    })
  }
}

/**
 * 处理DOCX文件
 */
async function processDocx(
  file: File,
  options: DocxProcessOptions = {},
  id: string
): Promise<void> {
  try {
    // 发送进度开始
    sendProgress(id, 0, '开始解析DOCX文件...')

    // 配置mammoth选项
    const mammothOptions = {
      styleMap: [
        "p[style-name='Heading 1'] => h1:fresh",
        "p[style-name='Heading 2'] => h2:fresh",
        "p[style-name='Heading 3'] => h3:fresh",
        "p[style-name='Title'] => h1.title:fresh",
        "p[style-name='Subtitle'] => h2.subtitle:fresh",
        "r[style-name='Strong'] => strong",
        "r[style-name='Emphasis'] => em",
        ...(options.styleMap || [])
      ],
      includeDefaultStyleMap: options.includeDefaultStyleMap !== false,
      ignoreEmptyParagraphs: options.ignoreEmptyParagraphs !== false,
      convertImage: options.convertImage !== false
    }

    sendProgress(id, 10, '读取文件内容...')

    // 读取文件
    const arrayBuffer = await file.arrayBuffer()

    sendProgress(id, 30, '解析文档结构...')

    // 使用mammoth解析
    const result = await mammoth.extractRawText({ arrayBuffer }, mammothOptions)

    sendProgress(id, 70, '生成HTML内容...')

    // 转换为HTML
    const htmlResult = await mammoth.convertToHtml({ arrayBuffer }, mammothOptions)

    sendProgress(id, 90, '处理完成...')

    // 提取元数据
    const metadata = extractMetadata(file, htmlResult)

    // 发送结果
    self.postMessage({
      id,
      type: 'SUCCESS',
      payload: {
        html: htmlResult.value,
        text: result.value,
        metadata,
        messages: htmlResult.messages
      }
    })

  } catch (error) {
    console.error('[DocxWorker] 处理失败:', error)
    throw error
  }
}

/**
 * 提取图片
 */
async function extractImages(file: File, id: string): Promise<void> {
  try {
    sendProgress(id, 0, '提取文档中的图片...')

    const arrayBuffer = await file.arrayBuffer()
    sendProgress(id, 50, '解析图片数据...')

    // 使用mammoth提取图片
    const result = await mammoth.extractImages({ arrayBuffer })

    sendProgress(id, 90, '处理图片完成...')

    // 转换图片为base64
    const images: { [key: string]: string } = {}
    for (const image of result) {
      const reader = new FileReader()
      const base64 = await new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = reject
        reader.readAsDataURL(image.buffer)
      })
      images[image.src] = base64
    }

    self.postMessage({
      id,
      type: 'IMAGES_EXTRACTED',
      payload: { images }
    })

  } catch (error) {
    console.error('[DocxWorker] 图片提取失败:', error)
    throw error
  }
}

/**
 * 带图片处理的文档解析
 */
async function processWithImages(
  file: File,
  options: DocxProcessOptions = {},
  id: string
): Promise<void> {
  try {
    sendProgress(id, 0, '解析文档和图片...')

    const arrayBuffer = await file.arrayBuffer()

    // 配置图片转换
    const mammothOptions = {
      convertImage: true,
      styleMap: options.styleMap || [],
      includeDefaultStyleMap: options.includeDefaultStyleMap !== false
    }

    sendProgress(id, 30, '处理文档内容...')

    const htmlResult = await mammoth.convertToHtml({ arrayBuffer }, mammothOptions)

    sendProgress(id, 80, '处理完成...')

    // 提取元数据
    const metadata = extractMetadata(file, htmlResult)

    self.postMessage({
      id,
      type: 'PROCESS_WITH_IMAGES_SUCCESS',
      payload: {
        html: htmlResult.value,
        metadata,
        messages: htmlResult.messages
      }
    })

  } catch (error) {
    console.error('[DocxWorker] 带图片处理失败:', error)
    throw error
  }
}

/**
 * 发送进度更新
 */
function sendProgress(id: string, progress: number, message: string): void {
  self.postMessage({
    id,
    type: 'PROGRESS',
    payload: { progress, message }
  })
}

/**
 * 提取文档元数据
 */
function extractMetadata(file: File, htmlResult: MammothResult): DocxProcessResult['metadata'] {
  const metadata: DocxProcessResult['metadata'] = {
    title: file.name.replace(/\.[^/.]+$/, ""),
    created: new Date(file.lastModified)
  }

  // 尝试从HTML中提取标题
  if (htmlResult.value) {
    const titleMatch = htmlResult.value.match(/<h1[^>]*>(.*?)<\/h1>/i)
    if (titleMatch) {
      metadata.title = titleMatch[1].replace(/<[^>]*>/g, '')
    }
  }

  return metadata
}

// 监听错误
self.onerror = (error: string | Event) => {
  console.error('[DocxWorker] Worker错误:', error)
  const message = typeof error === 'string' ? error : error.type
  self.postMessage({
    type: 'WORKER_ERROR',
    payload: {
      error: message,
      filename: typeof error === 'object' && 'filename' in error ? error.filename : undefined,
      lineno: typeof error === 'object' && 'lineno' in error ? error.lineno : undefined
    }
  })
}

console.log('[DocxWorker] DOCX处理Worker已加载')