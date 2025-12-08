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
          <p class="font-medium mb-1">智能识别（推荐）：</p>
          <p>• 使用空行分隔不同内容块</p>
          <p>• 系统自动识别标题、引言、结尾</p>
        </div>
        <div>
          <p class="font-medium mb-1">标注语法：</p>
          <p>• <code class="bg-blue-100 px-1"># 标题</code></p>
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

&单图

## 技术要点
# 这是正文第二段内容。

&&双图

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
          accept=".docx" 
          class="hidden" 
          @change="handleFileUpload"
        >
        <button
          @click="triggerFileUpload"
          class="px-4 py-2 text-sm bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition-colors flex items-center"
        >
          <span class="mr-1">📄</span> 导入 Word
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
import { useAppStore } from '../stores/appStore.js'
import mammoth from 'mammoth'

const router = useRouter()
const appStore = useAppStore()
const localText = ref('')
const errorMessage = ref('')
const fileInput = ref(null)

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

// 统一的文件处理逻辑
const processFile = async (file) => {
  if (!file.name.endsWith('.docx')) {
    errorMessage.value = '请上传 .docx 格式的 Word 文档'
    return
  }

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

&单图

## 第三章：工具推荐

# 市面上有许多优秀的版式设计工具，从专业的Adobe系列到轻量级的在线编辑器。

&&双图

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
}

// 前往下一步
const goToNextStep = () => {
  if (!localText.value.trim()) {
    errorMessage.value = '请输入文本内容'
    return
  }

  // 重置错误信息
  errorMessage.value = ''

  // 清空之前的内容块
  appStore.setContentBlocks([])

  // 导航到下一步
  router.push('/step2')
}
</script>

<style scoped>
/* 组件特定的样式 */
</style>