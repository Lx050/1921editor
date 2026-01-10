<template>
  <!-- 全屏布局（与 Step2/Step3 一致） -->
  <div class="h-full flex flex-col step-content-area overflow-hidden">
    <!-- 精简头部 - 与 Step2/Step3 统一样式 -->
    <div class="flex-shrink-0 w-full border-b p-3 md:p-4" style="background: var(--color-content-card); border-color: var(--color-content-border);">
      <div class="flex items-center justify-between gap-3">
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 md:gap-3">
            <span class="text-[10px] md:text-xs px-2 py-0.5 rounded-full bg-orange-100 text-orange-600 font-medium whitespace-nowrap">Step 1/3</span>
            <h2 class="text-base md:text-lg font-bold truncate" style="color: var(--color-content-text);">输入文本</h2>
          </div>
          <p class="text-[10px] md:text-xs mt-0.5 truncate" style="color: var(--color-content-text-secondary)">
            粘贴文本或导入 Word/ZIP 文件
          </p>
        </div>
        
        <!-- 辅助按钮组 -->
        <div class="flex items-center gap-2">
          <button
            @click="insertSampleText"
            class="px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg transition-colors hidden md:block"
          >
            智能示例
          </button>
          <button
            @click="insertMarkedSampleText"
            class="px-3 py-1.5 text-xs bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors hidden md:block"
          >
            标注示例
          </button>
          <button
            @click="clearText"
            class="px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-lg transition-colors"
            :disabled="!localText"
          >
            清空
          </button>
        </div>
      </div>
    </div>

    <!-- 内容区域 - 独立滚动，底部留出操作栏空间 -->
    <div class="flex-1 min-h-0 overflow-y-auto px-4 md:px-6 pb-24 flex flex-col">
      <!-- 格式指导区域 - 默认收起 -->
      <div class="py-3">
        <button 
          @click="showGuide = !showGuide"
          class="flex items-center text-sm font-medium text-blue-700 hover:text-blue-800 transition-colors focus:outline-none"
        >
          <span class="mr-2">{{ showGuide ? '▼' : '▶' }}</span>
          <span>📝 格式指导语法</span>
        </button>
        
        <transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="transform scale-y-95 opacity-0"
          enter-to-class="transform scale-y-100 opacity-100"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="transform scale-y-100 opacity-100"
          leave-to-class="transform scale-y-95 opacity-0"
        >
          <div v-if="showGuide" class="mt-2 bg-blue-50 p-4 rounded-lg border border-blue-200 origin-top">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-blue-800">
              <div>
                <p class="font-medium mb-1">图片标注：</p>
                <p>• <code class="bg-blue-100 px-1">&</code>（纯单图）或 <code class="bg-blue-100 px-1">&图注内容</code></p>
                <p>• <code class="bg-blue-100 px-1">&&双图</code> 或 <code class="bg-blue-100 px-1">&&左图说明 右图说明</code></p>
                <p class="text-xs text-blue-600 mt-1">注：双图说明请用空格分隔</p>
              </div>
              <div>
                <p class="font-medium mb-1">文字标注：</p>
                <p>• <code class="bg-blue-100 px-1"># 标题</code> (一级标题)</p>
                <p>• <code class="bg-blue-100 px-1">## 小标题</code> (二级标题)</p>
                <p>• <code class="bg-blue-100 px-1">> 引言内容</code></p>
              </div>
            </div>
          </div>
        </transition>
      </div>

      <!-- 文本输入区域 - 适中高度，适合移动端 -->
      <div class="flex flex-col flex-1 min-h-0">
        <label for="textInput" class="block text-sm font-medium text-black mb-2">
          粘贴您的文本内容
        </label>
        <textarea
          id="textInput"
          v-model="localText"
          @drop.prevent="handleDrop"
          @dragover.prevent="handleDragOver"
          @dragleave.prevent="handleDragLeave"
          :class="[
            'w-full flex-1 min-h-0 px-4 py-3 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-orange-400 resize-none font-mono text-sm transition-colors content-textarea',
            isDragging ? 'border-orange-400 ring-2 ring-orange-400' : ''
          ]"
          placeholder="请在此粘贴您的文本内容，或点击下方按钮导入 Word/ZIP 文件..."
        ></textarea>
        <div class="mt-2 flex items-center justify-between text-sm" style="color: var(--color-content-text-secondary);">
          <span v-if="localText">{{ localText.length }} 个字符</span>
          <span v-else>请输入文本内容</span>
          <!-- 已提取图片数量 -->
          <div v-if="extractedImages.length > 0" class="flex items-center text-green-600 bg-green-50 px-2 py-1 rounded text-xs">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            已提取 {{ extractedImages.length }} 张图片
          </div>
        </div>
      </div>

      <!-- 错误提示 -->
      <transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="transform -translate-y-2 opacity-0"
        enter-to-class="transform translate-y-0 opacity-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="transform translate-y-0 opacity-100"
        leave-to-class="transform -translate-y-2 opacity-0"
      >
        <div v-if="errorMessage" class="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div class="flex">
            <div class="flex-shrink-0">
              <span class="text-red-400">⚠</span>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800">输入错误</h3>
              <div class="mt-2 text-sm text-red-700">
                {{ errorMessage }}
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
    
    <!-- 底部操作栏 - 固定在底部，与 Step2/Step3 风格一致 -->
    <div class="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-3 z-10 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      <!-- 隐藏的文件输入 -->
      <input 
        type="file" 
        ref="fileInput" 
        accept=".docx,.zip,.rar,.7z" 
        class="hidden" 
        @change="handleFileUpload"
      >
      
      <div class="flex items-center justify-between gap-4">
        <!-- 导入按钮 -->
        <button
          @click="triggerFileUpload"
          class="flex-1 h-11 bg-white border border-gray-200 hover:bg-green-50 hover:border-green-400 text-black hover:text-green-700 text-sm font-medium rounded-xl transition-all active:scale-[0.98] shadow-sm flex items-center justify-center gap-2"
        >
          <span>📄</span>
          <span>导入 Word/ZIP</span>
        </button>
        
        <!-- 下一步按钮 -->
        <button
          @click="goToNextStep"
          class="flex-[2] h-11 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-sm font-bold rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="!localText.trim()"
        >
          <span>下一步：编辑内容</span>
          <span>→</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '../stores/appStore'
import { extractArchive, isArchiveFile } from '../utils/archiveProcessor'
import { uploadManager } from '../utils/uploadManager'

const router = useRouter()
const appStore = useAppStore()
const localText = ref('')
const errorMessage = ref('')
const fileInput = ref(null)
const extractedImages = ref([])  // V2: 存储从ZIP中提取的图片
const showGuide = ref(false)

// 监听store中的文本变化
watch(() => appStore.rawText, (newText) => {
  if (newText !== localText.value) {
    localText.value = newText
  }
}, { immediate: true })

// 本地文本变化时更新store
watch(localText, (newText) => {
  appStore.setRawText(newText)
  if (errorMessage.value && newText.trim()) {
    errorMessage.value = ''
  }
})

const isDragging = ref(false)

// 触发文件选择
const triggerFileUpload = () => {
  fileInput.value.click()
}

// 处理文件上传 (Input Change)
const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    processFile(file)
  }
}

// 处理拖拽上传 (Drop)
const handleDrop = (event) => {
  isDragging.value = false
  const file = event.dataTransfer.files[0]
  if (file) {
    processFile(file)
  }
}

const handleDragOver = () => {
  isDragging.value = true
}

const handleDragLeave = () => {
  isDragging.value = false
}

// 统一的文件处理逻辑 (V2: 支持 ZIP 和 DOCX)
const processFile = async (file) => {
  errorMessage.value = ''
  extractedImages.value = []
  uploadManager.clear()
  appStore.clearWechatImages()
  appStore.updateUploadProgress({ total: 0, completed: 0, failed: 0, uploading: 0 })
  appStore.setIsUploading(false)
  
  // V2: 检查是否是压缩包文件
  if (isArchiveFile(file)) {
    await processArchiveFile(file)
    return
  }

  // 原有的 DOCX 处理逻辑
  if (!file.name.endsWith('.docx')) {
    errorMessage.value = '请上传 .docx 格式的 Word 文档或 .zip/.rar/.7z 压缩包'
    return
  }

  await processDocxFile(file)
}

// V2: 处理压缩包文件 (ZIP/RAR/7z)
const processArchiveFile = async (file) => {
  try {
    console.log('[Step1] 处理压缩包文件:', file.name)
    const result = await extractArchive(file)
    
    console.log('[Step1] 提取结果:', {
      docxCount: result.docxFiles.length,
      docxNames: result.docxFiles.map(f => f.name),
      imageCount: result.imageFiles.length
    })

    extractedImages.value = result.imageFiles
    console.log('[Step1] 提取', result.imageFiles.length, '张图片')
    
    // 如果有 docx 文件，处理第一个 (V2: 文档直接替换)
    if (result.docxFiles.length > 0) {
      // 排序优化：避免识别到奇怪的文档，优先处理第一个，但可以添加过滤逻辑
      const mainDoc = result.docxFiles[0]
      console.log('[Step1] 正在解析主文档:', mainDoc.name, '大小:', mainDoc.size)
      await processDocxFile(mainDoc)
    } else {
      // 仅提示图片提取成功，不报错
      if (result.imageFiles.length > 0) {
        // errorMessage.value = `已提取 ${result.imageFiles.length} 张图片`
      } else {
        errorMessage.value = '压缩包中未找到图片或 Word 文档'
      }
    }
  } catch (error) {
    console.error('[Step1] 压缩包处理失败:', error)
    errorMessage.value = error instanceof Error ? error.message : '压缩包处理失败'
  }
}

// 处理 DOCX 文件
const processDocxFile = async (file) => {
  try {
    console.log('[Step1] 开始处理 Word 文档:', {
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified
    })
    
    // 动态导入 mammoth（仅在需要时加载）
    const { default: mammoth } = await import('mammoth')

    const arrayBuffer = await file.arrayBuffer()
    console.log('[Step1] ArrayBuffer 读取完成，大小:', arrayBuffer.byteLength)

    // 配置 mammoth 选项 - 增强版：保留样式信息
    const options = {
      // 自定义图片处理：将图片alt属性作为图注
      convertImage: mammoth.images.imgElement((image) => {
        // 如果图片有alt属性，将其作为图注
        const alt = image.alt || ''
        if (alt && alt.trim()) {
          // 有图注，生成 &图注内容 格式
          return Promise.resolve({ src: "", alt: `&${alt.trim()}` })
        }
        // 无图注，生成纯 &
        return Promise.resolve({ src: "", alt: "&" })
      }),
      // 保留段落样式信息
      styleMap: [
        // 将不同样式的段落标记为不同的class
        "p[style-name='Caption'] => p.caption:fresh",
        "p[style-name='图注'] => p.caption:fresh",
        "p[style-name='Image Caption'] => p.caption:fresh",
        "p[style-name='图片说明'] => p.caption:fresh",
        "p[style-name='Heading 1'] => h1:fresh",
        "p[style-name='Heading 2'] => h2:fresh",
        "p[style-name='标题 1'] => h1:fresh",
        "p[style-name='标题 2'] => h2:fresh",
        // 根据字体大小识别图注（小字号）
        "p[style-name='注释'] => p.caption:fresh",
        "p[style-name='说明'] => p.caption:fresh",
        // 更多可能的图注样式名
        "p[style-name='图片备注'] => p.caption:fresh",
        "p[style-name='Figure Caption'] => p.caption:fresh",
      ],
      // 使用 transformDocument 来提取更多样式信息
      transformDocument: mammoth.transforms.paragraph((paragraph) => {
        // 检查段落的样式信息
        if (paragraph.styleId || paragraph.styleName) {
          console.log('[Mammoth] 段落样式:', {
            styleId: paragraph.styleId,
            styleName: paragraph.styleName,
            text: paragraph.children?.map(c => c.value).join(' ').substring(0, 50)
          })
        }
        return paragraph
      })
    }

    const result = await mammoth.convertToHtml({ arrayBuffer }, options)
    let html = result.value

    console.log('[Step1] Mammoth 解析完成, HTML 前100字:', html.substring(0, 100))

    // 将 HTML 转换为我们需要的文本格式
    const text = convertHtmlToCustomFormat(html)

    // V4: 从文本中提取元数据（团队名称、来源公众号等）
    extractMetadataFromText(text)

    // 检查是否全屏乱码
    const replacementCharCount = (text.match(/\ufffd/g) || []).length
    if (replacementCharCount > text.length * 0.1) {
      console.error('[Step1] 检测到大量替换字符 (乱码):', replacementCharCount)
      errorMessage.value = '文档解析成功但内容包含大量乱码，请检查文档编码或是否为旧版 .doc 格式。'
    }

    localText.value = text
    appStore.setRawText(text)
    
    console.log('[Step1] Word 文档解析完成，文本长度:', text.length)

    // 清空 input 以便重复上传同名文件
    if (fileInput.value) {
      fileInput.value.value = ''
    }

    if (result.messages.length > 0) {
      console.log('[Step1] 解析警告:', result.messages)
    }
  } catch (error) {
    console.error('[Step1] 文档解析失败:', error)
    console.error('[Step1] 错误详情:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    })
    errorMessage.value = `文档解析失败: ${error.message || '请检查文件是否损坏'}`
  }
}

// V4: 从文档文本中提取元数据
const extractMetadataFromText = (text) => {
  console.log('[Step1] 开始提取文档元数据...')
  
  // 提取模式：
  // 1. 队伍名称：xxx  或  队伍名称:xxx
  // 2. 团队名称：xxx
  // 3. 来源：xxx  或  来源:xxx
  // 4. 文案：xxx  或  图文来源：xxx
  
  const patterns = {
    // 三下乡模式 - 团队名称
    teamName: [
      /队伍名称[：:]\s*[""]?([^"""\n]+)[""]?/,
      /团队名称[：:]\s*[""]?([^"""\n]+)[""]?/,
      /实践队[：:]\s*[""]?([^"""\n]+)[""]?/,
      /[""]([^"""]+)[""]\s*社会实践队/,
      /[""]([^"""]+)[""]\s*实践队/,
    ],
    // 转载模式 - 来源公众号
    sourceAccount: [
      /来源[：:]\s*[""]?([^"""\n]+)[""]?\s*公众号/,
      /转载自[：:]\s*[""]?([^"""\n]+)[""]?/,
      /原文来源[：:]\s*[""]?([^"""\n]+)[""]?/,
    ],
    // 日常模式 - 文案作者
    copywriters: [
      /文案[：:]\s*([^\n]+)/,
      /图文[：:]\s*([^\n]+)/,
      /撰稿[：:]\s*([^\n]+)/,
      /作者[：:]\s*([^\n]+)/,
    ]
  }
  
  // 提取团队名称
  for (const pattern of patterns.teamName) {
    const match = text.match(pattern)
    if (match && match[1]) {
      const teamName = match[1].trim()
      console.log('[Step1] 解析到团队名称:', teamName)
      appStore.teamName = `"${teamName}"社会实践队`
      break
    }
  }
  
  // 提取来源公众号
  for (const pattern of patterns.sourceAccount) {
    const match = text.match(pattern)
    if (match && match[1]) {
      const source = match[1].trim()
      console.log('[Step1] 解析到来源公众号:', source)
      appStore.sourceAccount = `"${source}"公众号`
      break
    }
  }
  
  // 提取文案作者
  for (const pattern of patterns.copywriters) {
    const match = text.match(pattern)
    if (match && match[1]) {
      // 分割多个作者（支持空格、顿号、逗号分隔）
      const authors = match[1].trim().split(/[、，,\s]+/).filter(Boolean)
      if (authors.length > 0) {
        console.log('[Step1] 解析到文案作者:', authors)
        appStore.copywriterNames = authors
        break
      }
    }
  }
  
  console.log('[Step1] 元数据提取完成:', {
    teamName: appStore.teamName,
    sourceAccount: appStore.sourceAccount,
    copywriterNames: appStore.copywriterNames
  })
}

// 将 HTML 转换为自定义文本格式（增强版：识别样式）
const convertHtmlToCustomFormat = (html) => {
  // 创建临时 DOM 元素来解析 HTML
  const div = document.createElement('div')
  div.innerHTML = html

  let text = ''

  // 遍历子节点
  const processNode = (node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      return node.textContent
    }

    if (node.nodeType !== Node.ELEMENT_NODE) return ''

    let content = ''

    // 递归处理子节点
    node.childNodes.forEach(child => {
      content += processNode(child)
    })

    // 根据标签类型和class添加格式
    switch (node.tagName) {
      case 'H1':
      case 'H2':
      case 'H3':
        // Word 标题转为 ## (标题)，而非 # (正文)
        return `\n\n## ${content.trim()}\n\n`
      case 'P':
        // 检查是否有特定的class
        const className = node.className || ''

        // 如果是图注段落
        if (className.includes('caption')) {
          // 在生成图注前，先检查这段文字是否可能是标题
          // 避免将标题误判为图注
          if (isLikelyHeading(content)) {
            // 如果是标题，按正文段落处理
            return `\n\n${content.trim()}\n\n`
          }

          // 清理内容，移除多余的空格
          const cleanedContent = content.trim().replace(/\s+/g, ' ')
          // 生成 &图注内容 标记
          return `\n\n&${cleanedContent}\n\n`
        }

        // 如果段落只包含图片占位符，直接返回
        if (content.trim().startsWith('&')) return content
        return `\n\n${content.trim()}\n\n`
      case 'IMG':
        // 处理图片占位符
        if (node.alt && node.alt.startsWith('&')) {
          return '\n\n' + node.alt + '\n\n'
        }
        return ''
      case 'BR':
        return '\n'
      case 'UL':
      case 'OL':
        // 列表作为独立段落
        return `\n\n${content.trim()}\n\n`
      case 'LI':
        // 列表项添加项目符号
        return `• ${content.trim()}\n`
      case 'BLOCKQUOTE':
        // 引用块使用 > 语法
        return `\n\n> ${content.trim()}\n\n`
      default:
        return content
    }
  }

  div.childNodes.forEach(node => {
    text += processNode(node)
  })

  // 清理多余的空行
  text = text.replace(/\n{3,}/g, '\n\n').trim()

  // 多阶段后处理
  text = mergeImageWithCaption(text)              // 第0阶段：合并图片标记和后续图注
  text = convertConsecutiveImagesToDouble(text)   // 第1阶段：合并双图
  // 注意：已禁用 fixImageCaptions，改为使用明确的冒号分隔符语法
  // text = fixImageCaptions(text)  // 第2阶段：修复图注识别（已禁用）

  return text
}

// 第0阶段：合并图片标记和后续的图注段落
// 处理模式：& \n\n （图为xxx） → &xxx
const mergeImageWithCaption = (text) => {
  // 匹配：& 后面跟着换行，然后是一个可能的图注段落
  // 图注段落特征：以 （ 或 ( 开头，或者包含 "图为"、"图一" 等关键词
  
  const lines = text.split('\n')
  const result = []
  let i = 0
  
  while (i < lines.length) {
    const currentLine = lines[i].trim()
    
    // 检查是否是单独的图片标记 &
    if (currentLine === '&' || currentLine === '&&') {
      // 查找后面的图注段落
      let nextNonEmpty = i + 1
      while (nextNonEmpty < lines.length && lines[nextNonEmpty].trim() === '') {
        nextNonEmpty++
      }
      
      if (nextNonEmpty < lines.length) {
        const nextLine = lines[nextNonEmpty].trim()
        
        // 检查是否是图注（以括号开头，或包含"图为"等关键词）
        if (isLikelyCaption(nextLine)) {
          // 清洗图注并合并
          const cleanedCaption = cleanCaption(nextLine)
          
          if (currentLine === '&&') {
            // 双图情况：可能需要查找两个图注
            let secondCaption = ''
            let nextNext = nextNonEmpty + 1
            while (nextNext < lines.length && lines[nextNext].trim() === '') {
              nextNext++
            }
            if (nextNext < lines.length && isLikelyCaption(lines[nextNext].trim())) {
              secondCaption = cleanCaption(lines[nextNext].trim())
              i = nextNext + 1
            } else {
              i = nextNonEmpty + 1
            }
            
            if (cleanedCaption && secondCaption) {
              result.push(`&&${cleanedCaption} ${secondCaption}`)
            } else if (cleanedCaption) {
              result.push(`&&${cleanedCaption}`)
            } else {
              result.push('&&')
            }
          } else {
            // 单图情况
            if (cleanedCaption) {
              result.push(`&${cleanedCaption}`)
            } else {
              result.push('&')
            }
            i = nextNonEmpty + 1
          }
          continue
        }
      }
    }
    
    result.push(lines[i])
    i++
  }
  
  return result.join('\n')
}

// 判断是否可能是图注
const isLikelyCaption = (line) => {
  if (!line) return false
  
  // 以括号开头
  if (/^[（(]/.test(line)) return true
  
  // 包含"图为"、"图一"等关键词
  if (/^图[为一二三四五六七八九十\d中示]/.test(line)) return true
  
  // 短文本且看起来像图注（少于50字符，无句号结尾）
  if (line.length < 50 && !line.endsWith('。') && !line.endsWith('.')) {
    return true
  }
  
  return false
}

// 后处理函数：将连续的单图转换为双图
const convertConsecutiveImagesToDouble = (text) => {
  // 先清洗所有图注
  let cleanedText = cleanAllCaptions(text)
  
  // 匹配连续的图片标记（中间可能有空行或换行）
  // 支持 & 或 &caption 格式
  const regex = /&([^\n&]*?)\n+&([^\n&]*?)(?=\n|$)/g
  
  return cleanedText.replace(regex, (match, caption1, caption2) => {
    // 清理图注内容
    const clean1 = cleanCaption(caption1)
    const clean2 = cleanCaption(caption2)
    
    // 两个都有图注
    if (clean1 && clean2) {
      return `&&${clean1} ${clean2}\n\n`
    }
    
    // 只有一个有图注
    if (clean1 || clean2) {
      const caption = clean1 || clean2
      return `&&${caption}\n\n`
    }
    
    // 都没有图注，纯双图
    return '&&\n\n'
  })
}

// 清洗所有图注（遍历整个文本）
const cleanAllCaptions = (text) => {
  // 匹配 &后面跟着的图注内容
  return text.replace(/&([^\n&]+)/g, (match, caption) => {
    const cleaned = cleanCaption(caption)
    return cleaned ? `&${cleaned}` : '&'
  })
}

// 清洗单个图注内容
const cleanCaption = (caption) => {
  if (!caption) return ''
  
  let cleaned = caption.trim()
  
  // 移除外层括号（中文和英文）
  cleaned = cleaned.replace(/^[（(](.+)[）)]$/, '$1')
  
  // 移除常见前缀模式
  const prefixPatterns = [
    /^图为[:：]?\s*/,           // "图为：" 或 "图为"
    /^图[一二三四五六七八九十\d]+[:：、]?\s*/,  // "图一：" 或 "图1、"
    /^图中[:：]?\s*/,           // "图中："
    /^图示[:：]?\s*/,           // "图示："
    /^如图[:：]?\s*/,           // "如图："
    /^上图[:：]?\s*/,           // "上图："
    /^下图[:：]?\s*/,           // "下图："
    /^左图[:：]?\s*/,           // "左图："
    /^右图[:：]?\s*/,           // "右图："
    /^图片[:：]?\s*/,           // "图片："
    /^配图[:：]?\s*/,           // "配图："
  ]
  
  for (const pattern of prefixPatterns) {
    cleaned = cleaned.replace(pattern, '')
  }
  
  // 再次移除可能残留的括号
  cleaned = cleaned.replace(/^[（(]/, '').replace(/[）)]$/, '')
  
  // 移除多余的空格
  cleaned = cleaned.replace(/\s+/g, ' ').trim()
  
  return cleaned
}

// 后处理函数：修复图片后的图注识别问题
const fixImageCaptions = (text) => {
  // 处理模式：识别图片后的短文本段（应为图注但被识别为正文）
  // 识别以下模式：
  // 模式1（高置信度）：图片 → 短文本 → 图片/标题
  // 模式2（中置信度）：图片 → 短文本 → 长文本（图片已结束）

  const paragraphs = text.split(/\n\n/g)
  const result = []
  let i = 0

  while (i < paragraphs.length) {
    const current = paragraphs[i]?.trim() || ''
    const next = paragraphs[i + 1]?.trim() || ''
    const nextNext = paragraphs[i + 2]?.trim() || ''

    result.push(paragraphs[i])

    // 模式1：检查是否是图片 → 短文本 → 图片/标题
    // 这是最高置信度的图注模式
    if (
      current.startsWith('&单图') &&
      next && // 有下一段
      !next.startsWith('&') && // 下一段不是图片标记
      nextNext && // 有下下段
      (nextNext.startsWith('&单图') || isLikelyHeading(nextNext)) // 下下段是图片或标题
    ) {
      // 检查中间段是否是图注
      if (isShortCaptionText(next)) {
        console.log('[Fix] 模式1（高置信度）- 识别到图注:', next)
        // 将中间段标记为图注
        result[result.length - 1] = current + ' ' + next // 合并到图片标记中
        i += 2 // 跳过已经处理的中间段
        continue
      }
    }

    // 模式2：检查是否是图片 → 短文本 → 长文本（图片已结束）
    // 中置信度的图注模式
    if (
      current.startsWith('&单图') &&
      next && // 有下一段
      !next.startsWith('&') && // 下一段不是图片标记
      nextNext && // 有下下段
      nextNext.length > 100 // 下下段是正文（长度>100）
    ) {
      if (isShortCaptionText(next)) {
        console.log('[Fix] 模式2（中置信度）- 识别到图注:', next)
        result[result.length - 1] = current + ' ' + next // 合并到图片标记中
        i += 2 // 跳过已经处理的中间段
        continue
      }
    }

    // 模式3：检查是否是图片 → 短文本 → 结束（末尾的图注）
    if (
      current.startsWith('&单图') &&
      next && // 有下一段
      !next.startsWith('&') && // 下一段不是图片标记
      !nextNext // 没有下下段（已到结尾）
    ) {
      if (isShortCaptionText(next)) {
        console.log('[Fix] 模式3（末尾图注）- 识别到图注:', next)
        result[result.length - 1] = current + ' ' + next // 合并到图片标记中
        i += 2 // 跳过已经处理的中间段
        continue
      }
    }

    i++
  }

  return result.join('\n\n')
}

// 判断是否是标题
const isLikelyHeading = (text) => {
  const trimmed = text.trim()
  return (
    trimmed.startsWith('##') || // 有标注
    trimmed.startsWith('#') || // 有标注
    /^第[一二三四五六七八九十\d]+[章节部分]/.test(trimmed) || // 章节标题
    /^\d+[\.、]/.test(trimmed) || // 编号标题
    (trimmed.length < 30 && !trimmed.includes('，')) // 短且无逗号
  )
}

// 判断是否是可能的图注文本
const isShortCaptionText = (text) => {
  const trimmed = text.trim()
  if (!trimmed) return false

  // 图注特征检查
  const features = {
    length: trimmed.length < 50, // 短文本
    hasKeywords: /图|注|说明|示意|示例|caption|pic|image/i.test(trimmed), // 含关键词
    noPunctuations: !/[，。！？；：“”"]{2,}/.test(trimmed), // 无长句标点
    noCommas: !trimmed.includes('，'), // 无逗号
    noPeriods: !trimmed.includes('。'), // 无句号
    notEmpty: trimmed.length > 0,
    notOnlyNumbers: !/^[\d\s]+$/.test(trimmed) // 非纯数字
  }

  // 如果满足所有条件，极可能是图注
  return Object.values(features).every(v => v === true)
}

// 插入智能示例文本（无标注）
const insertSampleText = () => {
  const sampleText = `这是文章的引言部分，将帮助读者快速了解文章的主要内容。在这个数字化时代，内容排版变得越来越重要。

第一章：基础概念

什么是版式设计？版式设计是指对文字、图形、色彩等视觉元素进行合理组织和安排的艺术。它不仅仅是简单的排版，更是信息的有效传达。

良好的版式设计能够提高阅读体验，增强信息的可读性和吸引力。

第二章：实践应用

在实际应用中，我们需要根据不同的平台和受众来调整版式策略。例如，在微信公众号中，需要考虑移动设备的显示效果。

第三章：工具介绍

市面上有许多优秀的版式设计工具，从专业的Adobe系列到轻量级的在线编辑器，每种工具都有其独特的优势。

总结

通过本文的介绍，相信大家对版式设计有了更深入的了解。在实际工作中，我们需要不断学习和实践。`

  localText.value = sampleText
  appStore.setRawText(sampleText)
}

// 插入标注示例文本（使用标注语法）
const insertMarkedSampleText = () => {
  const sampleText = `# 文章标题：现代版式设计指南

> 本文将介绍现代版式设计的核心概念和实践方法，帮助读者快速掌握内容排版的艺术。

## 第一章：版式设计基础

# 版式设计是指对文字、图形、色彩等视觉元素进行合理组织和安排的艺术。它不仅仅是简单的排版，更是信息的有效传达。

&

## 第二章：实践技巧

# 在实际应用中，我们需要根据不同的平台和受众来调整版式策略。例如，在微信公众号中，需要考虑移动设备的显示效果。

&这是一张单图的说明

## 第三章：工具推荐

# 市面上有许多优秀的版式设计工具，从专业的Adobe系列到轻量级的在线编辑器。

&&左边的图片说明 右边的图片说明

## 总结

# 通过本文的介绍，相信大家对版式设计有了更深入的了解。`

  localText.value = sampleText
  appStore.setRawText(sampleText)
}

// 清空文本
const clearText = () => {
  localText.value = ''
  appStore.setRawText('')
  errorMessage.value = ''
  extractedImages.value = []  // V2: 清空提取的图片
  uploadManager.clear()
  appStore.clearWechatImages()
  appStore.updateUploadProgress({ total: 0, completed: 0, failed: 0, uploading: 0 })
  appStore.setIsUploading(false)
}

// 前往下一步 (V2: 并行启动图片上传)
const goToNextStep = () => {
  if (!localText.value.trim()) {
    errorMessage.value = '请输入文本内容'
    return
  }

  // 重置错误信息
  errorMessage.value = ''

  // 清空之前的内容块
  appStore.setContentBlocks([])

  // V2: 如果有提取的图片，启动后台上传
  if (extractedImages.value.length > 0) {
    console.log('[Step1] 启动图片上传,', extractedImages.value.length, '张图片')
    
    // 清空之前的微信图片
    appStore.clearWechatImages()
    
    // 设置上传管理器回调
    uploadManager
      .onProgress((progress) => {
        appStore.updateUploadProgress(progress)
      })
      .onImageUploaded((image) => {
        appStore.addWechatImage(image)
      })
      .onComplete((results) => {
        console.log('[Step1] 所有图片上传完成:', results.length)
        appStore.setIsUploading(false)
      })
    
    // 启动上传
    appStore.setIsUploading(true)
    uploadManager.addFiles(extractedImages.value)
  }

  // 导航到下一步（不等待上传完成）
  router.push('/step2')
}
</script>

<style scoped>
/* 组件特定的样式 */
</style>
