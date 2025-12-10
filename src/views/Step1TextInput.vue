<template>
  <div class="p-6 h-full flex flex-col">
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-gray-900 mb-2">步骤 1/3: 输入文本</h2>
      <p class="text-gray-600">
        请粘贴您需要排版的大段纯文本。系统支持智能识别和标注语法，自动区分标题、正文等内容。
      </p>
    </div>

    <!-- 格式指导区域 -->
    <div class="mb-4 bg-blue-50 p-4 rounded-lg border border-blue-200">
      <h3 class="text-sm font-semibold text-blue-900 mb-2 flex items-center">
        <span class="mr-2">📝</span> 格式指导
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-blue-800">
        <div>
          <p class="font-medium mb-1">图片标注：</p>
          <p>• <code class="bg-blue-100 px-1">&单图</code> 或 <code class="bg-blue-100 px-1">&图片说明</code></p>
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

    <div class="space-y-4 flex-1 flex flex-col">
      <!-- 文本输入区域 -->
      <div class="flex-1 flex flex-col">
        <label for="textInput" class="block text-sm font-medium text-gray-700 mb-2">
          粘贴您的文本内容
        </label>
        <textarea
          id="textInput"
          v-model="localText"
          @drop.prevent="handleDrop"
          @dragover.prevent="handleDragOver"
          @dragleave.prevent="handleDragLeave"
          :class="[
            'w-full flex-1 min-h-[300px] px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none font-mono text-sm transition-colors',
            isDragging ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500' : 'border-gray-300'
          ]"
          placeholder="请在此粘贴您的文本内容，或直接将 Word 文档拖拽至此...

标注语法示例：
# 这是文章标题

> 这是引言内容

## 第一章：概述
# 这是正文第一段内容，系统会智能识别或使用#标注。

&这是一张单图的说明

## 技术要点
# 这是正文第二段内容。

&&左边的图片说明 右边的图片说明

## 总结
# 这是结尾内容。

注意：使用空行分隔不同内容块"
        ></textarea>
        <div class="mt-2 text-sm text-gray-500">
          <span v-if="localText">{{ localText.length }} 个字符</span>
          <span v-else>请输入文本内容</span>
        </div>
      </div>

  
      <!-- 快速操作按钮 -->
      <div class="flex flex-wrap gap-2">
        <input 
          type="file" 
          ref="fileInput" 
          accept=".docx,.zip,.rar,.7z" 
          class="hidden" 
          @change="handleFileUpload"
        >
        <button
          @click="triggerFileUpload"
          class="px-4 py-2 text-sm bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition-colors flex items-center"
        >
          <span class="mr-1">📄</span> 导入 Word/zip/7z
        </button>
        <button
          @click="insertSampleText"
          class="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
        >
          插入智能示例
        </button>
        <button
          @click="insertMarkedSampleText"
          class="px-4 py-2 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors"
        >
          插入标注示例
        </button>
        <button
          @click="clearText"
          class="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
          :disabled="!localText"
        >
          清空文本
        </button>
        <!-- 显示已提取图片数量 -->
        <div v-if="extractedImages.length > 0" class="flex items-center text-sm text-green-600 bg-green-50 px-3 py-1 rounded ml-2">
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          已提取 {{ extractedImages.length }} 张图片
        </div>
      </div>

      <!-- 错误提示 -->
      <div v-if="errorMessage" class="p-4 bg-red-50 border border-red-200 rounded-lg">
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

      <!-- 操作按钮 -->
      <div class="flex justify-end pt-4">
        <button
          @click="goToNextStep"
          class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          :disabled="!localText.trim()"
        >
          下一步：编辑内容 →
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '../stores/appStore'
import mammoth from 'mammoth'
import { extractZip, isZipFile } from '../utils/zipProcessor'
import { uploadManager } from '../utils/uploadManager'

const router = useRouter()
const appStore = useAppStore()
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
  
  // V2: 检查是否是 ZIP 文件
  if (isZipFile(file)) {
    await processZipFile(file)
    return
  }

  // 原有的 DOCX 处理逻辑
  if (!file.name.endsWith('.docx')) {
    errorMessage.value = '请上传 .docx 格式的 Word 文档或 .zip/.rar/.7z 压缩包'
    return
  }

  await processDocxFile(file)
}

// V2: 处理 ZIP 文件
const processZipFile = async (file) => {
  try {
    console.log('[Step1] 处理 ZIP 文件:', file.name)
    const result = await extractZip(file)
    
    // 累加提取的图片 (V2: 允许图片重复/累加)
    extractedImages.value = [...extractedImages.value, ...result.imageFiles]
    console.log('[Step1] 新增', result.imageFiles.length, '张图片，总计', extractedImages.value.length)
    
    // 如果有 docx 文件，处理第一个 (V2: 文档直接替换)
    if (result.docxFiles.length > 0) {
      console.log('[Step1] ZIP 中发现 Word 文档:', result.docxFiles[0].name)
      await processDocxFile(result.docxFiles[0])
    } else {
      // 仅提示图片提取成功，不报错
      if (result.imageFiles.length > 0) {
        // errorMessage.value = `已提取 ${result.imageFiles.length} 张图片`
      } else {
        errorMessage.value = '压缩包中未找到图片或 Word 文档'
      }
    }
  } catch (error) {
    console.error('[Step1] ZIP 处理失败:', error)
    errorMessage.value = error instanceof Error ? error.message : 'ZIP 文件处理失败'
  }
}

// 处理 DOCX 文件
const processDocxFile = async (file) => {
  try {
    const arrayBuffer = await file.arrayBuffer()
    
    // 配置 mammoth 选项
    const options = {
      // 自定义图片处理：直接替换为占位符
      convertImage: mammoth.images.imgElement(() => {
        return Promise.resolve({ src: "", alt: "&单图" })
      })
    }

    const result = await mammoth.convertToHtml({ arrayBuffer }, options)
    let html = result.value
    
    // 将 HTML 转换为我们需要的文本格式
    const text = convertHtmlToCustomFormat(html)
    
    localText.value = text
    appStore.setRawText(text)
    
    // 清空 input 以便重复上传同名文件
    if (fileInput.value) {
      fileInput.value.value = ''
    }
    
    if (result.messages.length > 0) {
      console.log('解析警告:', result.messages)
    }
  } catch (error) {
    console.error('解析失败:', error)
    errorMessage.value = '文档解析失败，请检查文件是否损坏'
  }
}

// 将 HTML 转换为自定义文本格式
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
    
    // 处理图片占位符 (mammoth 生成的 img 标签)
    if (node.tagName === 'IMG' && node.alt === '&单图') {
      return '\n\n&单图\n\n'
    }
    
    // 递归处理子节点
    node.childNodes.forEach(child => {
      content += processNode(child)
    })
    
    // 根据标签类型添加格式
    switch (node.tagName) {
      case 'H1':
      case 'H2':
      case 'H3':
        return `\n\n# ${content.trim()}\n\n`
      case 'P':
        // 如果段落只包含图片占位符，直接返回
        if (content.trim() === '&单图') return content
        return `\n\n${content.trim()}\n\n`
      case 'BR':
        return '\n'
      default:
        return content
    }
  }
  
  div.childNodes.forEach(node => {
    text += processNode(node)
  })
  
  // 清理多余的空行
  return text.replace(/\n{3,}/g, '\n\n').trim()
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