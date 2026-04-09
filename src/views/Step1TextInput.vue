<template>
  <div class="h-full flex flex-col" style="background:var(--color-bg-page);">
    <!-- Top bar -->
    <div style="flex-shrink:0; border-bottom:var(--border-whisper); padding:10px 24px; display:flex; align-items:center; justify-content:space-between; background:var(--color-bg-card);">
      <div style="display:flex; align-items:center; gap:10px;">
        <span class="text-[10px] px-2.5 py-1 rounded-full font-medium" style="background: var(--color-accent-soft); color: var(--color-accent-primary);">1 / 3</span>
        <h2 style="font-size:14px; font-weight:600; color:rgba(0,0,0,0.85); margin:0;">输入文章文本</h2>
      </div>
      <div style="display:flex; align-items:center; gap:4px;">
        <button
          @click="isMarkdownMode = !isMarkdownMode"
          :style="{
            padding: '4px 10px',
            fontSize: '12px',
            fontWeight: '600',
            borderRadius: '4px',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 150ms',
            fontFamily: 'monospace',
            background: isMarkdownMode ? 'var(--color-badge-bg)' : 'transparent',
            color: isMarkdownMode ? 'var(--color-badge-text)' : 'var(--color-text-muted)',
          }"
          :title="isMarkdownMode ? 'Markdown 模式 (点击切换回普通模式)' : '切换到 Markdown 模式'"
        >{{ isMarkdownMode ? 'MD ON' : 'MD' }}</button>
        <button
          @click="insertSampleText"
          style="padding:4px 10px; font-size:12px; color:var(--color-text-muted); background:transparent; border:none; border-radius:4px; cursor:pointer; transition:all 150ms;"
          onmouseover="this.style.background='var(--color-bg-warm)'; this.style.color='rgba(0,0,0,0.7)'"
          onmouseout="this.style.background='transparent'; this.style.color=''"
        >示例文本</button>
        <button
          @click="clearText"
          :disabled="!localText"
          style="padding:4px 10px; font-size:12px; color:var(--color-text-muted); background:transparent; border:none; border-radius:4px; cursor:pointer; transition:all 150ms;"
          onmouseover="if(!this.disabled){this.style.background='var(--color-error-light)'; this.style.color='var(--color-error)'}"
          onmouseout="this.style.background='transparent'; this.style.color=''"
        >清空</button>
      </div>
    </div>

    <!-- Main content -->
    <div class="flex-1 min-h-0 overflow-y-auto">
      <div class="max-w-2xl mx-auto px-6 py-5 flex flex-col gap-4" style="min-height: 100%;">

        <!-- Textarea card -->
        <div
          :style="{
            flex: '1',
            display: 'flex',
            flexDirection: 'column',
            borderRadius: 'var(--radius-sm)',
            border: isDragging ? '1.5px solid var(--color-accent-primary)' : 'var(--border-input)',
            background: isDragging ? 'rgba(0,117,222,0.03)' : 'var(--color-bg-card)',
            boxShadow: isDragging ? '0 0 0 3px var(--color-accent-focus)' : 'var(--shadow-content-card)',
            transition: 'all 200ms',
          }"
        >
          <textarea
            id="textInput"
            v-model="localText"
            @drop.prevent="handleDrop"
            @dragover.prevent="handleDragOver"
            @dragleave.prevent="handleDragLeave"
            style="
              flex:1;
              width:100%;
              min-height:280px;
              padding:16px 20px;
              background:transparent;
              resize:none;
              font-size:14px;
              color:rgba(0,0,0,0.85);
              line-height:1.7;
              outline:none;
              font-family:var(--font-body);
            "
            onfocus="this.style.boxShadow='inset 0 0 0 2px var(--color-accent-primary)'"
            onblur="this.style.boxShadow=''"
            :placeholder="isMarkdownMode
              ? '在此粘贴 Markdown 格式文本...\n\n# 一级标题\n## 二级标题\n正文内容\n**加粗** *斜体* `代码`'
              : '在此粘贴文章正文…\n\n支持直接粘贴 Word 内容，也可将 .docx 或 .zip 文件拖拽到此处自动提取。'"
          ></textarea>
          <!-- Textarea footer row -->
          <div style="display:flex; align-items:center; justify-content:space-between; padding:8px 20px; border-top:var(--border-subtle);">
            <span style="font-size:12px; color:var(--color-text-muted);">
              <template v-if="localText">{{ localText.length }} 字</template>
              <template v-else>拖入 .docx / .zip 文件可自动提取文本和图片</template>
            </span>
            <div v-if="extractedImages.length > 0" class="notion-badge notion-badge-success" style="display:flex; align-items:center; gap:4px;">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
              已提取 {{ extractedImages.length }} 张图片
            </div>
          </div>
        </div>

        <!-- Metadata row -->
        <div style="border-radius:var(--radius-sm); border:var(--border-whisper); background:var(--color-bg-card); box-shadow:var(--shadow-content-card);">
          <div style="display:flex; align-items:center; gap:8px; padding:10px 16px 8px; border-bottom:var(--border-subtle);">
            <span
              :style="{
                padding: '2px 8px',
                borderRadius: '9999px',
                fontSize: '11px',
                fontWeight: '600',
                background: configStore.mode === 'daily' ? '#fff7ed' : configStore.mode === 'three_rural' ? '#f0fdf4' : '#faf5ff',
                color: configStore.mode === 'daily' ? '#c2410c' : configStore.mode === 'three_rural' ? '#16a34a' : '#7c3aed',
              }"
            >{{ configStore.mode === 'daily' ? '日常' : configStore.mode === 'three_rural' ? '三下乡' : '转载' }}</span>
            <span style="font-size:12px; color:var(--color-text-muted);">尾部信息</span>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3 px-4 py-3">
            <div>
              <label style="display:block; font-size:12px; font-weight:600; color:rgba(0,0,0,0.55); margin-bottom:5px;">编辑人员</label>
              <input
                v-model="appStore.editorInput"
                type="text"
                placeholder="姓名"
                class="notion-input"
                style="font-size:13px; padding:7px 10px;"
              />
            </div>
            <div v-if="configStore.mode === 'three_rural'">
              <label style="display:block; font-size:12px; font-weight:600; color:rgba(0,0,0,0.55); margin-bottom:5px;">项目名称</label>
              <input
                v-model="appStore.teamName"
                type="text"
                placeholder="如：青春筑梦社会实践队"
                class="notion-input"
                style="font-size:13px; padding:7px 10px;"
              />
            </div>
            <div v-if="configStore.mode === 'reprint'">
              <label style="display:block; font-size:12px; font-weight:600; color:rgba(0,0,0,0.55); margin-bottom:5px;">来源公众号</label>
              <input
                v-model="appStore.sourceAccount"
                type="text"
                placeholder="如：人民日报"
                class="notion-input"
                style="font-size:13px; padding:7px 10px;"
              />
            </div>
          </div>
        </div>

        <!-- Format syntax reference (collapsible) -->
        <details style="border-radius:var(--radius-sm); border:var(--border-whisper); background:var(--color-bg-card);">
          <summary style="display:flex; align-items:center; gap:6px; padding:10px 16px; font-size:12px; font-weight:500; color:var(--color-text-muted); cursor:pointer; list-style:none;">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
            格式标注语法参考
          </summary>
          <div style="padding:4px 16px 16px; display:grid; grid-template-columns:1fr 1fr; gap:16px;">
            <div style="display:flex; flex-direction:column; gap:8px;">
              <p style="font-size:12px; font-weight:600; color:rgba(0,0,0,0.6); margin:0 0 4px;">图片</p>
              <div v-for="item in [['&', '单图占位'], ['&图注', '单图 + 图注'], ['&&', '双图占位']]" :key="item[0]" style="display:flex; align-items:center; gap:8px; font-size:12px; color:var(--color-text-secondary);">
                <code style="background:var(--color-bg-warm); color:rgba(0,0,0,0.7); padding:2px 6px; border-radius:4px; font-family:monospace; font-size:11px; border:var(--border-subtle);">{{ item[0] }}</code>
                <span>{{ item[1] }}</span>
              </div>
            </div>
            <div style="display:flex; flex-direction:column; gap:8px;">
              <p style="font-size:12px; font-weight:600; color:rgba(0,0,0,0.6); margin:0 0 4px;">文字结构</p>
              <div v-for="item in [['## 标题', '小标题'], ['# 正文', '强制正文'], ['> 引言', '引言段落']]" :key="item[0]" style="display:flex; align-items:center; gap:8px; font-size:12px; color:var(--color-text-secondary);">
                <code style="background:var(--color-bg-warm); color:rgba(0,0,0,0.7); padding:2px 6px; border-radius:4px; font-family:monospace; font-size:11px; border:var(--border-subtle);">{{ item[0] }}</code>
                <span>{{ item[1] }}</span>
              </div>
            </div>
          </div>
        </details>

        <!-- Error -->
        <div v-if="errorMessage" style="display:flex; align-items:flex-start; gap:10px; padding:12px 14px; background:var(--color-error-light); border:1px solid var(--color-error-border); border-radius:8px; font-size:13px; color:var(--color-error);">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="flex-shrink:0; margin-top:1px;"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          {{ errorMessage }}
        </div>

        <div style="height:16px;"></div>
      </div>
    </div>

    <!-- Footer -->
    <div style="flex-shrink:0; padding:12px 24px; background:linear-gradient(180deg, transparent 0%, var(--color-bg-page) 30%); backdrop-filter:blur(8px);">
      <input type="file" ref="fileInput" accept=".docx,.zip,.rar,.7z" class="hidden" @change="handleFileUpload">
      <div style="max-width:672px; margin:0 auto; display:flex; align-items:center; gap:12px;">
        <button
          @click="triggerFileUpload"
          class="flex-1 h-10 bg-white/80 hover:bg-white text-sm font-medium rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-1.5"
          style="color:rgba(0,0,0,0.65); box-shadow:var(--shadow-content-card);"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/></svg>
          导入文件
        </button>
        <button
          @click="goToNextStep"
          :disabled="!localText.trim()"
          class="flex-[2] h-10 text-white text-sm font-bold rounded-xl transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          style="background:var(--color-accent-primary); box-shadow:var(--shadow-accent);"
          onmouseover="if(!this.disabled) this.style.background='var(--color-accent-hover)'"
          onmouseout="this.style.background='var(--color-accent-primary)'"
        >
          <span>开始编辑排版</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { showConfirm } from '@/composables/useConfirm'
import { useAppStore } from '../stores/appStore'
import { useConfigStore } from '../stores/configStore'
import { extractArchive, isArchiveFile } from '../utils/archiveProcessor'
import { uploadManager } from '../utils/uploadManager'
import { smartTextParser } from '../utils/textParser'
import { markdownToTiptap } from '../utils/markdownImporter'
import {
  getImageDimensionsFromBuffer,
  convertHtmlToCustomFormat,
} from '../utils/docxProcessor'

const router = useRouter()
const appStore = useAppStore()
const configStore = useConfigStore()
const localText = ref('')
const errorMessage = ref('')
const fileInput = ref(null)
const extractedImages = ref([])  // V2: 存储从ZIP中提取的图片
const isMarkdownMode = ref(false) // Toggle for Markdown input mode

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
    const result = await extractArchive(file)

    extractedImages.value = result.imageFiles

    // 如果有 docx 文件，处理第一个 (V2: 文档直接替换)
    if (result.docxFiles.length > 0) {
      // 排序优化：避免识别到奇怪的文档，优先处理第一个，但可以添加过滤逻辑
      const mainDoc = result.docxFiles[0]
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
    // 动态导入 mammoth（仅在需要时加载）
    const { default: mammoth } = await import('mammoth')

    const arrayBuffer = await file.arrayBuffer()

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
        return paragraph
      })
    }

    const result = await mammoth.convertToHtml({ arrayBuffer }, options)
    let html = result.value

    // 将 HTML 转换为我们需要的文本格式
    const text = convertHtmlToCustomFormat(html)

    // V4: 从文本中提取元数据（项目名称、来源公众号等）
    extractMetadataFromText(text)

    // 检查是否全屏乱码
    const replacementCharCount = (text.match(/\ufffd/g) || []).length
    if (replacementCharCount > text.length * 0.1) {
      console.error('[Step1] 检测到大量替换字符 (乱码):', replacementCharCount)
      errorMessage.value = '文档解析成功但内容包含大量乱码，请检查文档编码或是否为旧版 .doc 格式。'
    }

    localText.value = text
    appStore.setRawText(text)

    // 清空 input 以便重复上传同名文件
    if (fileInput.value) {
      fileInput.value.value = ''
    }

    if (result.messages.length > 0) {
      console.warn('[Step1] 解析警告:', result.messages)
    }
  } catch (error) {
    console.error('[Step1] 文档解析失败:', error)
    errorMessage.value = `文档解析失败: ${error.message || '请检查文件是否损坏'}`
  }
}

// V4: 从文档文本中提取元数据
const extractMetadataFromText = (text) => {
  // 提取模式：
  // 1. 队伍名称：xxx  或  队伍名称:xxx
  // 2. 项目名称：xxx
  // 3. 来源：xxx  或  来源:xxx
  // 4. 文案：xxx  或  图文来源：xxx
  
  const patterns = {
    // 三下乡模式 - 项目名称
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
  
  // 提取项目名称
  for (const pattern of patterns.teamName) {
    const match = text.match(pattern)
    if (match && match[1]) {
      const teamName = match[1].trim()
      appStore.teamName = `"${teamName}"社会实践队`
      break
    }
  }
  
  // 提取来源公众号
  for (const pattern of patterns.sourceAccount) {
    const match = text.match(pattern)
    if (match && match[1]) {
      const source = match[1].trim()
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
        appStore.copywriterNames = authors
        break
      }
    }
  }
  
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
const clearText = async () => {
  const confirmed = await showConfirm({
    title: '确认清空',
    message: '将清除所有输入的文本和图片，是否继续？',
    confirmText: '清空',
    cancelText: '取消',
    type: 'danger',
  })
  if (!confirmed) return
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

  const text = localText.value

  // 1. 同步 rawText 到 store 和 localStorage
  appStore.setRawText(text)
  try { localStorage.setItem('manifold_step1_rawText', text) } catch { /* ignore */ }

  // 2. Parse content based on mode
  if (isMarkdownMode.value) {
    // Markdown mode: parse directly to tiptap document JSON
    const doc = markdownToTiptap(text)
    appStore.editorJson = doc
    appStore.setContentBlocks([]) // Not using blocks in MD mode
    try { sessionStorage.setItem('manifold_step1_blocks', '[]') } catch { /* ignore */ }
  } else {
    // Normal mode: parse to content blocks
    const blocks = smartTextParser(text)
    appStore.setContentBlocks(blocks)
    try {
      sessionStorage.setItem('manifold_step1_blocks', JSON.stringify(blocks))
      sessionStorage.setItem('manifold_step1_rawText_len', String(text.length))
    } catch { /* ignore */ }
    appStore.clearEditorJson()
  }

  // V2: 如果有提取的图片，启动后台上传
  if (extractedImages.value.length > 0) {
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
      .onComplete(() => {
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
