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
          <div class="flex items-center gap-4">
            <span v-if="localText">{{ localText.length }} 个字符</span>
            <span v-else>请输入文本内容</span>
            <div v-if="extractedImages.length > 0" class="flex items-center gap-1 text-green-600">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              已提取 {{ extractedImages.length }} 张图片
            </div>
          </div>
        </div>
      </div>

      <!-- V5: 元数据确认区域 - 已移除，改为后台静默识别 -->

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

<script setup lang="ts">
import { ref, watch, type Ref } from 'vue'
import { useRouter, type Router } from 'vue-router'
import { useAppStore } from '../stores/appStore'
import { extractArchive, isArchiveFile } from '../utils/archiveProcessor'
import { uploadManager } from '../utils/uploadManager'
import { convertHtmlToCustomFormat } from '../utils/docxConverter'
import { ArticleService } from '../services/articleService'
import { SAMPLE_TEXT, MARKED_SAMPLE_TEXT } from '../constants/sampleTexts'
import { step1Logger, mammothLogger } from '../utils/logger'
import { loadMammoth } from '../utils/mammothLoader'

defineOptions({
  name: 'Step1TextInput'
})

const router: Router = useRouter()
const appStore = useAppStore()
const localText: Ref<string> = ref('')
const errorMessage: Ref<string> = ref('')
const fileInput: Ref<HTMLInputElement | null> = ref(null)
const extractedImages: Ref<File[]> = ref([])
const showGuide: Ref<boolean> = ref(false)
const isDragging: Ref<boolean> = ref(false)

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
  // 如果文本长度较大且之前没有元数据，尝试提取一次（针对粘贴内容）
  if (newText.length > 50 && !appStore.teamName) {
    extractMetadataFromText(newText)
  }
})

// 触发文件选择
const triggerFileUpload = (): void => {
  fileInput.value?.click()
}

// 处理文件上传 (Input Change)
const handleFileUpload = (event: Event): void => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    processFile(file)
  }
}

// 处理拖拽上传 (Drop)
const handleDrop = (event: DragEvent): void => {
  isDragging.value = false
  const file = event.dataTransfer?.files[0]
  if (file) {
    processFile(file)
  }
}

const handleDragOver = (): void => {
  isDragging.value = true
}

const handleDragLeave = (): void => {
  isDragging.value = false
}

// 统一的文件处理逻辑 (V2: 支持 ZIP 和 DOCX)
const processFile = async (file: File): Promise<void> => {
  errorMessage.value = ''
  extractedImages.value = []
  uploadManager.clear()
  appStore.clearWechatImages()
  appStore.updateUploadProgress({ total: 0, completed: 0, failed: 0, uploading: 0 })
  appStore.setIsUploading(false)
  
  // V5: 重置尾部可变字段，避免之前文档的数据遗留
  appStore.teamName = ''
  appStore.sourceAccount = ''
  appStore.copywriterNames = []
  
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
const processArchiveFile = async (file: File): Promise<void> => {
  try {
    step1Logger.debug('处理压缩包文件:', file.name)
    const result = await extractArchive(file)

    step1Logger.debug('提取结果:', {
      docxCount: result.docxFiles.length,
      docxNames: result.docxFiles.map(f => f.name),
      imageCount: result.imageFiles.length
    })

    extractedImages.value = result.imageFiles
    step1Logger.debug('提取', result.imageFiles.length, '张图片')
    
    // 如果有 docx 文件，处理第一个 (V2: 文档直接替换)
    if (result.docxFiles.length > 0) {
      // 排序优化：避免识别到奇怪的文档，优先处理第一个，但可以添加过滤逻辑
      const mainDoc = result.docxFiles[0]
      step1Logger.debug('正在解析主文档:', mainDoc.name, '大小:', mainDoc.size)
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
    step1Logger.error('压缩包处理失败:', error)
    errorMessage.value = error instanceof Error ? error.message : '压缩包处理失败'
  }
}

// 处理 DOCX 文件
const processDocxFile = async (file: File): Promise<void> => {
  try {
    step1Logger.debug('开始处理 Word 文档:', {
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified
    })
    
    const mammoth = await loadMammoth()

    const arrayBuffer = await file.arrayBuffer()
    step1Logger.debug('ArrayBuffer 读取完成，大小:', arrayBuffer.byteLength)

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
          mammothLogger.debug('段落样式:', {
            styleId: paragraph.styleId,
            styleName: paragraph.styleName,
            text: paragraph.children?.map((c) => c.value ?? '').join(' ').substring(0, 50)
          })
        }
        return paragraph
      })
    }

    const result = await mammoth.convertToHtml({ arrayBuffer }, options)
    const html = result.value

    step1Logger.debug('Mammoth 解析完成, HTML 前100字:', html.substring(0, 100))

    // 将 HTML 转换为我们需要的文本格式
    const text = convertHtmlToCustomFormat(html)

    // V4: 从文本中提取元数据（团队名称、来源公众号等）
    extractMetadataFromText(text)

    // 检查是否全屏乱码
    const replacementCharCount = (text.match(/\ufffd/g) || []).length
    if (replacementCharCount > text.length * 0.1) {
      step1Logger.error('检测到大量替换字符 (乱码):', replacementCharCount)
      errorMessage.value = '文档解析成功但内容包含大量乱码，请检查文档编码或是否为旧版 .doc 格式。'
    }

    localText.value = text
    appStore.setRawText(text)

    step1Logger.debug('Word 文档解析完成，文本长度:', text.length)

    // 清空 input 以便重复上传同名文件
    if (fileInput.value) {
      fileInput.value.value = ''
    }

    if (result.messages.length > 0) {
      step1Logger.debug('解析警告:', result.messages)
    }
  } catch (error) {
    step1Logger.error('文档解析失败:', error)
    step1Logger.error('错误详情:', {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : String(error)
    })
    errorMessage.value = `文档解析失败: ${error instanceof Error ? error.message : '请检查文件是否损坏'}`
  }
}

// V4: 从文档文本中提取元数据
const extractMetadataFromText = (text: string): void => {
  if (!text) return
  step1Logger.debug('开始提取文档元数据...')
  
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0)
  
  // 核心提取逻辑：寻找关键词，并尝试获取本行或下一行内容
  const findMetadata = (labels: string[], stopWords: string[] = []): string => {
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i]

        // 1. 尝试匹配 "标签：值" 或 "标签 值"
        for (const label of labels) {
            const regex = new RegExp(`${label}[：:\\s]+(.*)`, 'i')
            const match = line.match(regex)
            if (match) {
                let value = match[1].trim()
                // 如果本行后面没内容，看下一行
                if (!value && i + 1 < lines.length) {
                    value = lines[i+1]
                }
                if (value) return cleanMetadataValue(value, stopWords)
            }
        }

        // 2. 尝试匹配单独的标签行，取下一行为值
        for (const label of labels) {
            if (line === label || line === label + '：' || line === label + ':') {
                if (i + 1 < lines.length) {
                    return cleanMetadataValue(lines[i+1], stopWords)
                }
            }
        }
    }
    return ''
  }

  // 通用清理函数
  const cleanMetadataValue = (value: string, stopWords: string[] = []): string => {
    if (!value) return ''
    let cleaned = value

    // 1. 移除首部标记 (如 ## 或 #)
    cleaned = cleaned.replace(/^[#\s]+/, '')

    // 2. 处理行内后续标签
    const labelStopWords = ['负责人', '专项', '项目', '院系', '学院', '所属', '联系', '电话', '手机', '作者', '文案', ...stopWords]
    for (const word of labelStopWords) {
        if (cleaned.includes(word + '：') || cleaned.includes(word + ':')) {
            cleaned = cleaned.split(new RegExp(`${word}[：:]`))[0]
        }
    }
    
    // 3. 移除常见后缀
    cleaned = cleaned.replace(/\s*(?:社会实践队|实践队|公众号)\s*$/i, '')
    
    // 4. 清理引用和空白
    return cleaned.trim().replace(/^["“'‘]|["”'’]$/g, '').trim()
  }

  // 开始执行提取
  const teamNameLabels = ['队伍名称', '团队名称', '实践队', '团队', '社会实践队', '冬令营团队', '寒假社会实践队']
  const teamName = findMetadata(teamNameLabels, ['负责人', '专项'])

  if (teamName) {
    step1Logger.debug('自动解析团队名称:', teamName)
    appStore.teamName = teamName
  } else {
    // 降级兜底：查找包含 "社会实践队" 的行
    for (const line of lines) {
        if (line.includes('社会实践队') || line.includes('实践队') || line.includes('实践团')) {
            const fallback = cleanMetadataValue(line)
            if (fallback && fallback.length > 2 && fallback.length < 40) {
                 appStore.teamName = fallback
                 break
            }
        }
    }
  }

  appStore.teamProject = findMetadata(['队伍专项', '项目专项', '专项', '项目名称', '项目', '活动名称', '社会实践专项'], ['负责人'])
  appStore.teamDepartment = findMetadata(['所属院系', '院系', '学院', '学校', '单位'], ['负责人', '联系'])
  appStore.teamLeader = findMetadata(['负责人', '队长', '带队老师', '指导老师', '联系人'], ['联系', '电话'])
  appStore.teamContact = findMetadata(['联系方式', '联系电话', '电话', '手机', '联系号码'], ['专项'])
  appStore.sourceAccount = findMetadata(['来源', '转载自', '公众号', '原文来源', '来源出处'])
  
  // 文案作者特殊处理
  const authorsRaw = findMetadata(['文案', '图文', '撰稿', '作者'])
  if (authorsRaw) {
    appStore.copywriterNames = authorsRaw.split(/[、，,\s]+/).filter(Boolean)
  }

  step1Logger.debug('元数据提取最终结果:', {
    teamName: appStore.teamName,
    teamProject: appStore.teamProject,
    leader: appStore.teamLeader
  })
}

// 导出的转换逻辑已移至 src/utils/docxConverter.ts

// 插入智能示例文本（无标注）
const insertSampleText = (): void => {
  localText.value = SAMPLE_TEXT
  appStore.setRawText(SAMPLE_TEXT)
}

// 插入标注示例文本（使用标注语法）
const insertMarkedSampleText = (): void => {
  localText.value = MARKED_SAMPLE_TEXT
  appStore.setRawText(MARKED_SAMPLE_TEXT)
}

// 清空文本
const clearText = (): void => {
  localText.value = ''
  appStore.setRawText('')
  errorMessage.value = ''
  extractedImages.value = []
  uploadManager.clear()
  appStore.clearWechatImages()
  appStore.updateUploadProgress({ total: 0, completed: 0, failed: 0, uploading: 0 })
  appStore.setIsUploading(false)
}

// 前往下一步 (V2: 并行启动图片上传)
const goToNextStep = async (): Promise<void> => {
  if (!localText.value.trim()) {
    errorMessage.value = '请输入文本内容'
    return
  }

  // V5: 重要！在跳转瞬间立即保存一次元数据到后端库，确保同步数据完整
  try {
    step1Logger.debug('正在同步元数据到后端...')
    await ArticleService.saveCurrentAsDraft()
  } catch (err) {
    step1Logger.error('背景保存失败，但不影响跳转:', err)
  }

  // 重置错误信息
  errorMessage.value = ''

  // 清空之前的内容块
  if (appStore.contentBlocks.length === 0) {
    appStore.setContentBlocks([])
  }

  // V2: 如果有提取的图片，启动后台上传
  if (extractedImages.value.length > 0) {
    step1Logger.debug('启动图片上传,', extractedImages.value.length, '张图片')
    
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
        step1Logger.debug('所有图片上传完成:', results.length)
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
