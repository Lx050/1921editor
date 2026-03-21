<template>
  <div class="h-full flex flex-col bg-white">
    <!-- Top bar -->
    <div class="flex-shrink-0 border-b border-gray-100 px-6 py-3 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <!-- Step indicator dots -->
        <div class="flex items-center gap-1.5">
          <span class="w-2 h-2 rounded-full bg-blue-600"></span>
          <span class="w-2 h-2 rounded-full bg-gray-200"></span>
          <span class="w-2 h-2 rounded-full bg-gray-200"></span>
        </div>
        <span class="text-xs text-gray-400">步骤 1 / 3</span>
        <span class="text-gray-200 select-none">|</span>
        <h2 class="text-sm font-semibold text-gray-700">输入文章文本</h2>
      </div>
      <div class="flex items-center gap-1">
        <button
          @click="insertSampleText"
          class="px-2.5 py-1 text-xs text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
        >示例文本</button>
        <button
          @click="clearText"
          :disabled="!localText"
          class="px-2.5 py-1 text-xs text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >清空</button>
      </div>
    </div>

    <!-- Main content -->
    <div class="flex-1 min-h-0 overflow-y-auto">
      <div class="max-w-2xl mx-auto px-6 py-5 flex flex-col gap-4" style="min-height: 100%;">

        <!-- Textarea card -->
        <div
          class="flex-1 flex flex-col rounded-xl border transition-all duration-200"
          :class="isDragging
            ? 'border-blue-400 bg-blue-50/40 shadow-[0_0_0_3px_rgba(59,130,246,0.12)]'
            : 'border-gray-200 bg-gray-50/50 hover:border-gray-300'"
        >
          <textarea
            id="textInput"
            v-model="localText"
            @drop.prevent="handleDrop"
            @dragover.prevent="handleDragOver"
            @dragleave.prevent="handleDragLeave"
            class="flex-1 w-full min-h-[280px] px-5 py-4 bg-transparent resize-none text-sm text-gray-800 leading-relaxed outline-none placeholder:text-gray-400"
            placeholder="在此粘贴文章正文…&#10;&#10;支持直接粘贴 Word 内容，也可将 .docx 或 .zip 文件拖拽到此处自动提取。"
          ></textarea>
          <!-- Textarea footer row -->
          <div class="flex items-center justify-between px-5 py-2.5 border-t border-gray-100">
            <span class="text-xs text-gray-400">
              <template v-if="localText">{{ localText.length }} 字</template>
              <template v-else>拖入 .docx / .zip 文件可自动提取文本和图片</template>
            </span>
            <div v-if="extractedImages.length > 0" class="flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full font-medium">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
              已提取 {{ extractedImages.length }} 张图片
            </div>
          </div>
        </div>

        <!-- Metadata row -->
        <div class="rounded-xl border border-gray-200 bg-white">
          <div class="flex items-center gap-2 px-4 pt-3 pb-2 border-b border-gray-100">
            <span
              class="text-[10px] px-2 py-0.5 rounded-full font-semibold"
              :class="{
                'bg-orange-100 text-orange-600': configStore.mode === 'daily',
                'bg-emerald-100 text-emerald-600': configStore.mode === 'three_rural',
                'bg-purple-100 text-purple-600': configStore.mode === 'reprint'
              }"
            >{{ configStore.mode === 'daily' ? '日常' : configStore.mode === 'three_rural' ? '三下乡' : '转载' }}</span>
            <span class="text-xs text-gray-400">尾部信息</span>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3 px-4 py-3">
            <div>
              <label class="block text-xs font-medium text-gray-500 mb-1.5">编辑人员</label>
              <input
                v-model="appStore.editorInput"
                type="text"
                placeholder="姓名"
                class="w-full px-3 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-300/60 focus:border-blue-400 transition-all"
              />
            </div>
            <div v-if="configStore.mode === 'three_rural'">
              <label class="block text-xs font-medium text-gray-500 mb-1.5">团队名称</label>
              <input
                v-model="appStore.teamName"
                type="text"
                placeholder="如：青春筑梦社会实践队"
                class="w-full px-3 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-300/60 focus:border-emerald-400 transition-all"
              />
            </div>
            <div v-if="configStore.mode === 'reprint'">
              <label class="block text-xs font-medium text-gray-500 mb-1.5">来源公众号</label>
              <input
                v-model="appStore.sourceAccount"
                type="text"
                placeholder="如：人民日报"
                class="w-full px-3 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-purple-300/60 focus:border-purple-400 transition-all"
              />
            </div>
          </div>
        </div>

        <!-- Format syntax reference (collapsible) -->
        <details class="group rounded-xl border border-gray-200 bg-white">
          <summary class="flex items-center gap-2 px-4 py-2.5 text-xs font-medium text-gray-400 cursor-pointer hover:text-gray-600 select-none list-none transition-colors">
            <svg class="w-3.5 h-3.5 transition-transform group-open:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
            格式标注语法参考
          </summary>
          <div class="px-4 pb-4 pt-1 grid grid-cols-2 gap-4">
            <div class="space-y-1.5">
              <p class="text-xs font-semibold text-gray-600 mb-2">图片</p>
              <div class="flex items-center gap-2 text-xs text-gray-500">
                <code class="bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded font-mono text-[11px]">&</code>
                <span>单图占位</span>
              </div>
              <div class="flex items-center gap-2 text-xs text-gray-500">
                <code class="bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded font-mono text-[11px]">&图注</code>
                <span>单图 + 图注</span>
              </div>
              <div class="flex items-center gap-2 text-xs text-gray-500">
                <code class="bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded font-mono text-[11px]">&&</code>
                <span>双图占位</span>
              </div>
            </div>
            <div class="space-y-1.5">
              <p class="text-xs font-semibold text-gray-600 mb-2">文字结构</p>
              <div class="flex items-center gap-2 text-xs text-gray-500">
                <code class="bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded font-mono text-[11px]">## 标题</code>
                <span>小标题</span>
              </div>
              <div class="flex items-center gap-2 text-xs text-gray-500">
                <code class="bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded font-mono text-[11px]"># 正文</code>
                <span>强制正文</span>
              </div>
              <div class="flex items-center gap-2 text-xs text-gray-500">
                <code class="bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded font-mono text-[11px]">&gt; 引言</code>
                <span>引言段落</span>
              </div>
            </div>
          </div>
        </details>

        <!-- Error -->
        <div v-if="errorMessage" class="flex items-start gap-3 p-3.5 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
          <svg class="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          {{ errorMessage }}
        </div>

        <!-- Bottom spacer so content doesn't hide behind footer -->
        <div class="h-4"></div>
      </div>
    </div>

    <!-- Footer -->
    <div class="flex-shrink-0 bg-white border-t border-gray-100 px-6 py-3">
      <input type="file" ref="fileInput" accept=".docx,.zip,.rar,.7z" class="hidden" @change="handleFileUpload">
      <div class="max-w-2xl mx-auto flex items-center gap-3">
        <button
          @click="triggerFileUpload"
          class="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all text-sm font-medium"
        >
          <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
          导入文件
        </button>
        <button
          @click="goToNextStep"
          :disabled="!localText.trim()"
          class="flex-1 flex items-center justify-center gap-2 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 active:scale-[0.99] transition-all text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed shadow-sm shadow-blue-200"
        >
          <span>开始编辑排版</span>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '../stores/appStore'
import { useConfigStore } from '../stores/configStore'
import { extractArchive, isArchiveFile } from '../utils/archiveProcessor'
import { uploadManager } from '../utils/uploadManager'

const router = useRouter()
const appStore = useAppStore()
const configStore = useConfigStore()
const localText = ref('')
const errorMessage = ref('')
const fileInput = ref(null)
const extractedImages = ref([])  // V2: 存储从ZIP中提取的图片

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

// ── 图片尺寸读取（通过浏览器 Image 解码，无需手动解析二进制）──
const getImageDimensionsFromBuffer = (buffer, contentType) => {
  return new Promise((resolve) => {
    try {
      const blob = new Blob([buffer], { type: contentType })
      const url = URL.createObjectURL(blob)
      const img = new Image()
      img.onload = () => { URL.revokeObjectURL(url); resolve({ width: img.naturalWidth, height: img.naturalHeight }) }
      img.onerror = () => { URL.revokeObjectURL(url); resolve(null) }
      img.src = url
    } catch (e) {
      resolve(null)
    }
  })
}

// 方向判断：横版 / 竖版 / 方形
const getImageOrientation = (dims) => {
  if (!dims || !dims.width || !dims.height) return 'unknown'
  const r = dims.width / dims.height
  if (r > 1.2) return 'landscape'
  if (r < 0.85) return 'portrait'
  return 'square'
}

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
      // 自定义图片处理：将图片alt属性作为图注，并嵌入尺寸信息供后续方向判断
      convertImage: mammoth.images.imgElement(async (image) => {
        const alt = image.alt || ''

        // 读取图片尺寸（格式附在 alt 末尾：|WxH）
        let dimStr = ''
        try {
          const buffer = await image.read()
          const dims = await getImageDimensionsFromBuffer(buffer, image.contentType)
          if (dims) dimStr = `|${dims.width}x${dims.height}`
        } catch (e) {
          console.warn('[Step1] 图片尺寸读取失败:', e)
        }

        if (alt && alt.trim()) {
          return { src: "", alt: `&${alt.trim()}${dimStr}` }
        }
        return { src: "", alt: `&${dimStr}` }
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
      case 'P': {
        const className = node.className || ''

        // ── 同段落双图检测（Word 中两张图并排在同一段落）──
        // 这种情况直接合并为双图，尊重作者的原文布局
        const imgEls = Array.from(node.querySelectorAll('img'))
        if (imgEls.length === 2) {
          const a1 = imgEls[0].getAttribute('alt') || ''
          const a2 = imgEls[1].getAttribute('alt') || ''
          if (a1.startsWith('&') && a2.startsWith('&')) {
            // 去掉 & 前缀，cleanCaption 会在后续处理尺寸后缀
            const raw1 = a1.slice(1)
            const raw2 = a2.slice(1)
            // 保留 |WxH 供 convertConsecutiveImagesToDouble 方向判断时已略过（同段落直接双图）
            // 这里直接清洗输出
            const c1 = cleanCaption(raw1.replace(/\|\d+x\d+$/, ''))
            const c2 = cleanCaption(raw2.replace(/\|\d+x\d+$/, ''))
            if (c1 && c2) return `\n\n&&${c1} ${c2}\n\n`
            if (c1 || c2) return `\n\n&&${c1 || c2}\n\n`
            return '\n\n&&\n\n'
          }
        }

        // 如果是图注段落
        if (className.includes('caption')) {
          if (isLikelyHeading(content)) {
            return `\n\n${content.trim()}\n\n`
          }
          const cleanedContent = content.trim().replace(/\s+/g, ' ')
          return `\n\n&${cleanedContent}\n\n`
        }

        // 如果段落只包含图片占位符，直接返回
        if (content.trim().startsWith('&')) return content
        return `\n\n${content.trim()}\n\n`
      }
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
    
    // 检查是否是单独的图片标记（& 或 &|WxH，没有图注文字）
    const isBareImage = /^&&?(\|\d+x\d+)?$/.test(currentLine)
    const isDoubleBareLine = currentLine.startsWith('&&')
    if (isBareImage) {
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
          
          // 提取当前行的尺寸后缀（如 |750x500），合并后需要保留给后续方向判断
          const dimsSuffix = (currentLine.match(/(\|\d+x\d+)$/) || [])[1] || ''

          if (isDoubleBareLine) {
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
            // 单图情况：合并图注，保留尺寸后缀供方向判断
            if (cleanedCaption) {
              result.push(`&${cleanedCaption}${dimsSuffix}`)
            } else {
              result.push(`&${dimsSuffix}` || '&')
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

// 后处理函数：将连续的单图按方向判断合并或保持独立
// 规则：横+横 / 竖+竖 / 方+方 → 双图；其他组合 → 各自单图
const convertConsecutiveImagesToDouble = (text) => {
  // 从 alt 里解析尺寸后缀 |WxH
  const parseDims = (raw) => {
    const m = raw.match(/\|(\d+)x(\d+)$/)
    return m ? { width: +m[1], height: +m[2] } : null
  }

  // 匹配两个连续 & 行（中间可能有空行）
  // raw1/raw2 包含原始内容（含 |WxH 后缀）
  const regex = /&([^\n&]*?)\n+&([^\n&]*?)(?=\n|$)/g

  let result = text.replace(regex, (match, raw1, raw2) => {
    // ── 方向判断 ──
    const dims1 = parseDims(raw1)
    const dims2 = parseDims(raw2)
    const orient1 = getImageOrientation(dims1)
    const orient2 = getImageOrientation(dims2)

    // 去掉尺寸后缀再清洗图注
    const clean1 = cleanCaption(raw1.replace(/\|\d+x\d+$/, ''))
    const clean2 = cleanCaption(raw2.replace(/\|\d+x\d+$/, ''))

    // 两者都有已知方向且方向不同 → 保持各自单图
    if (orient1 !== 'unknown' && orient2 !== 'unknown' && orient1 !== orient2) {
      const s1 = clean1 ? `&${clean1}` : '&'
      const s2 = clean2 ? `&${clean2}` : '&'
      return `${s1}\n\n${s2}\n\n`
    }

    // 同向（含未知）→ 合并双图
    if (clean1 && clean2) return `&&${clean1} ${clean2}\n\n`
    if (clean1 || clean2) return `&&${clean1 || clean2}\n\n`
    return '&&\n\n'
  })

  // 清除所有残余的尺寸后缀（未被合并的单图行）
  result = result.replace(/&([^&\n]*)\|\d+x\d+/g, (_, caption) => {
    const c = cleanCaption(caption)
    return c ? `&${c}` : '&'
  })

  return result
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

  // 移除尺寸后缀（如 |750x500）——可能残留在未合并的 alt 中
  cleaned = cleaned.replace(/\|\d+x\d+$/, '')
  
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

  // 确保 rawText 已同步到 store（不依赖 watch 时序）
  appStore.setRawText(localText.value)
  // 持久化到 localStorage 作为备份
  try {
    localStorage.setItem('manifold_step1_rawText', localText.value)
  } catch { /* ignore quota errors */ }

  // 清空之前的内容块和 editorJson，确保 Step2 从 rawText 重新解析
  appStore.clearEditorState()

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
