<template>
  <!-- 全屏容器：相对于 App.vue 的 flex-1 区域 -->
  <div class="relative flex h-full w-full overflow-hidden">
    <!-- 移动端样式选择开关 -->
    <button
      @click="showMobileSidebar = !showMobileSidebar"
      class="md:hidden fixed right-4 bottom-32 z-50 bg-gradient-to-br from-[#ff6b4a] to-[#ff8566] text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
      title="切换样式面板"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
      </svg>
    </button>

    <!-- 移动端遮罩层 -->
    <div
      v-if="showMobileSidebar"
      @click="showMobileSidebar = false"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm z-20 md:hidden"
    ></div>

    <!-- 左侧样式选择面板 - 桌面端 flex 布局，移动端 fixed 遮罩 -->
    <div
      :class="[
        'w-72 flex-shrink-0 h-full border-r transition-transform duration-300 ease-in-out md:translate-x-0 overflow-hidden',
        showMobileSidebar ? 'translate-x-0 fixed left-0 top-0 bottom-0 z-30' : '-translate-x-full fixed md:relative md:translate-x-0'
      ]"
      style="background: var(--color-content-bg-soft); border-color: var(--color-content-border);"
    >
      <StyleSelector />
    </div>

    <!-- 右侧内容编辑区 - 高度固定，内部滚动 -->
    <div class="flex-1 flex flex-col h-full w-full step-content-area relative overflow-hidden">
      <!-- 精简头部 - 统一高度和样式 -->
      <div class="flex-shrink-0 w-full border-b p-3 md:p-4" style="background: var(--color-content-card); border-color: var(--color-content-border);">
        <div class="flex items-center justify-between gap-3">
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 md:gap-3">
              <span class="text-[10px] md:text-xs px-2 py-0.5 rounded-full bg-orange-100 text-orange-600 font-medium whitespace-nowrap">Step 2/3</span>
              <h2 class="text-base md:text-lg font-bold truncate" style="color: var(--color-content-text)">编辑内容</h2>
            </div>
            <p class="text-[10px] md:text-xs mt-0.5 truncate" style="color: var(--color-content-text-secondary)">点击内容块编辑，左侧实时切换样式</p>
          </div>
          
          <!-- 上传进度 -->
          <UploadProgress
            :progress="uploadProgress"
            :isUploading="isUploading"
            @retry="retryFailedUploads"
            class="flex-shrink-0 ml-4"
          />
        </div>
      </div>

      <!-- 幕布工作区 - 独立滚动，底部留出工具栏空间 -->
      <div class="flex-1 overflow-y-auto px-6 pb-28">
        <div class="space-y-3 pb-4">
          <!-- 顶层起始插入器 -->
          <div class="flex justify-center py-4">
            <LayoutInserter 
              :index="-1" 
              @insert-text="onInsertText" 
              @insert-image="onInsertImage" 
              @insert-container="onInsertContainer"
              @open-merge="onOpenMerge"
            />
          </div>

          <TransitionGroup name="block-list" tag="div" class="space-y-3">
            <ContentBlockItem
              v-for="(block, index) in contentBlocks"
              :key="block.id"
              :block="block"
              :index="index"
              :selectedId="selectedBlockId"
              :typeOptions="getBlockTypeOptions()"
              @select="selectBlock"
              @delete="confirmDeleteBlock"
              @updateText="onUpdateBlockText"
              @changeType="changeBlockType"
              @generateAi="generateAiImage"
              @insertText="onInsertText"
              @insertImage="onInsertImage"
              @insertContainer="onInsertContainer"
              @openMerge="onOpenMerge"
              @move="onMoveBlock"
            />
          </TransitionGroup>
        </div>

        <div v-if="contentBlocks.length === 0" class="text-center py-12">
          <div class="text-gray-400 text-lg mb-2">没有内容块</div>
          <div class="text-gray-500">请返回上一步重新输入文本</div>
        </div>
      </div>
    
      <!-- 操作按钮 - 固定在底部，与第三步风格一致 -->
      <div class="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-3 z-10 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <div class="flex items-center justify-between gap-4">
          <!-- 上一步按钮 -->
          <button
            @click="goToPreviousStep"
            class="flex-1 h-11 bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 text-black text-sm font-medium rounded-xl transition-all active:scale-[0.98] shadow-sm flex items-center justify-center gap-1"
          >
            <span>←</span>
            <span>上一步</span>
          </button>
          
          <!-- 下一步按钮 -->
          <button
            @click="goToNextStep"
            class="flex-[2] h-11 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-sm font-bold rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="contentBlocks.length === 0 || isUploading"
          >
            <template v-if="isUploading">
               <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
               <span class="hidden sm:inline">图片上传中...</span>
               <span class="sm:hidden">上传中</span>
            </template>
            <template v-else>
              <span class="hidden sm:inline">下一步：预览效果</span>
              <span class="sm:hidden">生成预览</span>
              <span>→</span>
            </template>
          </button>
        </div>
      </div>
    </div>

    <!-- 合并文章模态框 -->
    <div v-if="isMergeModalOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="isMergeModalOpen = false"></div>
      <div class="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in duration-300">
        <!-- 头部 -->
        <div class="p-6 border-b flex items-center justify-between bg-gray-50/50">
          <div>
            <h3 class="text-xl font-bold text-gray-900">导入合并文章</h3>
            <p class="text-sm text-gray-500 mt-1">将新内容合并到当前文章中</p>
          </div>
          <button @click="isMergeModalOpen = false" class="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <!-- 隐藏的文件输入 -->
        <input 
          type="file" 
          ref="mergeFileInput" 
          accept=".docx,.zip,.rar,.7z" 
          class="hidden" 
          @change="handleMergeFileUpload"
        >

        <!-- 内容 -->
        <div class="p-6 flex-1 overflow-y-auto space-y-6">
          <div 
            class="space-y-2 transition-all duration-200 rounded-xl"
            :class="[
              isMergeDragging ? 'bg-blue-50 ring-2 ring-blue-500 ring-offset-2 scale-[1.01]' : ''
            ]"
            @dragover.prevent="isMergeDragging = true"
            @dragleave.prevent="isMergeDragging = false"
            @drop.prevent="handleMergeDrop"
          >
            <label class="block text-sm font-bold text-gray-700 flex justify-between items-center">
              <span>粘贴或导入新文章内容</span>
              <span v-if="isMergeDragging" class="text-blue-600 text-xs animate-pulse">释放即可导入文档/压缩包</span>
              <span v-else class="text-gray-400 text-xs font-normal">支持拖拽 .docx 或 .zip 到此处</span>
            </label>
            <textarea
              v-model="mergeContent"
              class="w-full h-64 p-4 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm leading-relaxed"
              :class="{'bg-transparent': isMergeDragging}"
              placeholder="请在这里粘贴您想要合并的内容，或直接将 .docx/.zip 文件拖入此框..."
            ></textarea>
            
            <div v-if="mergeErrorMessage" class="text-xs text-red-500 mt-1 flex items-center gap-1">
              <span>⚠</span>
              <span>{{ mergeErrorMessage }}</span>
            </div>
          </div>

          <div class="flex items-center gap-6 p-4 bg-blue-50/50 rounded-xl border border-blue-100/50">
            <div class="flex items-center gap-3 cursor-pointer group" @click="mergeAsGroup = !mergeAsGroup">
              <div :class="['w-5 h-5 rounded border flex items-center justify-center transition-all', mergeAsGroup ? 'bg-blue-500 border-blue-500' : 'bg-white border-gray-300 group-hover:border-blue-400']">
                <svg v-if="mergeAsGroup" class="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <div class="flex flex-col">
                <span class="text-sm font-bold text-gray-800">作为“内容组合”导入</span>
                <span class="text-xs text-gray-500">勾选后新内容将自动包裹在一个独立容器内，保持结构清晰</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 底部 -->
        <div class="p-6 border-t bg-gray-50/50 flex flex-col sm:flex-row gap-3">
          <button
            @click="isMergeModalOpen = false"
            class="flex-1 h-12 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold rounded-xl transition-all active:scale-[0.98]"
          >
            取消
          </button>
          
          <button
            @click="triggerMergeFileUpload"
            class="h-12 bg-green-50 hover:bg-green-100 border border-green-200 text-green-700 font-bold rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 px-6"
          >
            <span>📄</span>
            <span>导入文档</span>
          </button>

          <button
            @click="handleMerge"
            :disabled="!mergeContent.trim()"
            class="flex-[2] h-12 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <span>🚀</span>
            <span>立即解析并合并</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, type Ref } from 'vue'
import { useRouter, type Router } from 'vue-router'
import { useAppStore } from '../stores/appStore'
import { useConfigStore } from '../stores/configStore'
import { smartTextParser } from '../utils/textParser'
import { getBlockTypeDisplayName } from '../utils/styleAssembler'
import { uploadManager } from '../utils/uploadManager'
import { extractArchive, isArchiveFile } from '../utils/archiveProcessor'
import { convertHtmlToCustomFormat } from '../utils/docxConverter'
import { createLogger } from '../utils/logger'
import { findBlockRecursive, findParentBlock } from '../composables/useBlockFinder'
import StyleSelector from '../components/StyleSelector.vue'
import UploadProgress from '../components/UploadProgress.vue'
import ContentBlockItem from '../components/ContentBlockItem.vue'
import type { ContentBlock, BlockType } from '../types'

defineOptions({
  name: 'Step2Curtain'
})

const router: Router = useRouter()
const appStore = useAppStore()
const configStore = useConfigStore()
const step2Logger = createLogger('Step2')
const mergeLogger = createLogger('MergeModal')

const selectedBlockId: Ref<string | null> = ref(null)
const showMobileSidebar: Ref<boolean> = ref(false)
const generatingBlockId: Ref<string | null> = ref(null)
const LOCAL_DRAFT_KEY = 'local_step2_draft'

// 计算属性
const contentBlocks = computed(() => appStore.contentBlocks)

// V2: 上传状态计算属性
const uploadProgress = computed(() => appStore.uploadProgress)
const isUploading = computed(() => appStore.isUploading)

// V2: 重试失败的上传
const retryFailedUploads = (): void => {
  uploadManager.retryFailed()
}

// 监听原始文本变化，解析内容块
watch(() => appStore.rawText, (newText) => {
  step2Logger.debug('watch triggered:', {
    rawTextLength: newText?.length || 0,
    contentBlocksLength: contentBlocks.value.length,
    willParse: newText && contentBlocks.value.length === 0
  })
  if (newText && contentBlocks.value.length === 0) {
    step2Logger.debug('⚠️ contentBlocks为空，从rawText重新解析')
    const parsedBlocks = smartTextParser(newText)

    // 如果是寒假实践模式，初始内容自动包裹在一个容器内
    if (configStore.mode === 'winter_practice') {
      step2Logger.debug(`${configStore.mode} 模式：初始内容自动包裹为容器`)
      appStore.setContentBlocks([{
        id: `container_initial_${Date.now()}`,
        type: 'container',
        text: '',
        children: parsedBlocks
      }])
    } else {
      appStore.setContentBlocks(parsedBlocks)
    }
  }
}, { immediate: true })

// 选择内容块
const selectBlock = (blockId: string) => {
  selectedBlockId.value = blockId === selectedBlockId.value ? null : blockId
}

// 获取块类型选项
interface BlockTypeOption {
  value: string
  label: string
  icon: string
}

const getBlockTypeOptions = (): BlockTypeOption[] => {
  return [
    { value: 'title', label: '标题', icon: '📰' },
    { value: 'body', label: '正文', icon: '📝' },
    { value: 'intro', label: '引言', icon: '💭' },
    { value: 'outro', label: '结尾', icon: '🏁' },
    { value: 'image_single', label: '单图', icon: '🖼️' },
    { value: 'image_single_caption', label: '单图+注', icon: '🖼️📝' },
    { value: 'image_double', label: '双图', icon: '🖼️🖼️' },
    { value: 'image_double_caption', label: '双图+注', icon: '🖼️📝' },
    { value: 'container', label: '容器', icon: '📦' }
  ]
}

// 改变块类型
const changeBlockType = (blockId: string, newType: BlockType) => {
  appStore.updateBlockType(blockId, newType)
}

// 更新文本
const onUpdateBlockText = (blockId: string, text: string) => {
  appStore.updateBlockText(blockId, text)
}

// 插入文本
const onInsertText = ({ index, type, id }: { index: number, type: string, id?: string }) => {
  const defaultTexts: Record<string, string> = {
    'title': '新的标题内容',
    'body': '新的正文内容，点击这里开始编辑...',
    'intro': '新的引言内容，点击这里开始编辑...',
    'outro': '新的结尾内容，点击这里开始编辑...'
  }
  const defaultText = defaultTexts[type] || '新内容，点击编辑...'
  appStore.insertTextBlock(index + 1, type as BlockType, defaultText, id)
}

// 插入图片
const onInsertImage = ({ index, type, id }: { index: number, type: string, id?: string }) => {
  appStore.insertImageBlock(index + 1, type as 'single' | 'single_caption' | 'double' | 'double_caption', id)
}

// 插入容器
const onInsertContainer = (index: number, id?: string) => {
  appStore.insertContainerBlock(index + 1, id)
}

// 三方文章/新文章合并逻辑
const isMergeModalOpen = ref(false)
const mergeContent = ref('')
const mergeAsGroup = ref(configStore.mode === 'winter_practice')
const mergePosition = ref<{ index: number, id?: string }>({ index: -1 })

const onOpenMerge = (params: { index: number, id?: string } | number): void => {
  if (typeof params === 'number') {
    mergePosition.value = { index: params }
  } else {
    mergePosition.value = params
  }
  mergeContent.value = ''
  mergeErrorMessage.value = ''
  isMergeModalOpen.value = true
}

const mergeFileInput: Ref<HTMLInputElement | null> = ref(null)
const mergeErrorMessage: Ref<string> = ref('')
const isMergeDragging = ref(false)

const triggerMergeFileUpload = (): void => {
  if (mergeFileInput.value) mergeFileInput.value.click()
}

const handleMergeFileUpload = (event: Event): void => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    processMergeFile(file)
  }
}

const handleMergeDrop = (event: DragEvent): void => {
  isMergeDragging.value = false
  const file = event.dataTransfer?.files?.[0]
  if (file) {
    processMergeFile(file)
  }
}

const processMergeFile = async (file: File) => {
  mergeErrorMessage.value = ''
  
  if (isArchiveFile(file)) {
    try {
      const result = await extractArchive(file)
      
      // 处理提取的图片 (V2: 启动后台上传)
      if (result.imageFiles.length > 0) {
        uploadManager.addFiles(result.imageFiles)
        if (!appStore.isUploading) {
          appStore.setIsUploading(true)
          uploadManager
            .onProgress((progress) => appStore.updateUploadProgress(progress))
            .onImageUploaded((image) => appStore.addWechatImage(image))
            .onComplete(() => appStore.setIsUploading(false))
        }
      }
      
      if (result.docxFiles.length > 0) {
        await processMergeDocx(result.docxFiles[0])
      } else if (result.imageFiles.length > 0) {
        alert(`已成功导入 ${result.imageFiles.length} 张图片到媒体库`)
      } else {
        mergeErrorMessage.value = '压缩包中未找到图片或 Word 文档'
      }
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : '未知错误'
      mergeErrorMessage.value = `压缩包处理失败: ${message}`
    }
    return
  }

  if (file.name.endsWith('.docx')) {
    await processMergeDocx(file)
  } else {
    mergeErrorMessage.value = '请上传 .docx 文档或 .zip/.rar/.7z 压缩包'
  }
}

const processMergeDocx = async (file: File | Blob): Promise<void> => {
  try {
    const { default: mammoth } = await import('mammoth')
    const arrayBuffer = await file.arrayBuffer()

    // 配置 mammoth 选项 (与 Step 1 保持一致)
    const options = {
      convertImage: mammoth.images.imgElement((image) => {
        const alt = image.alt || ''
        return Promise.resolve({ src: "", alt: alt.startsWith('&') ? alt : `&${alt}` })
      }),
      styleMap: [
        "p[style-name='Caption'] => p.caption:fresh",
        "p[style-name='图注'] => p.caption:fresh",
        "p[style-name='Image Caption'] => p.caption:fresh",
        "p[style-name='图片说明'] => p.caption:fresh",
        "p[style-name='Heading 1'] => h1:fresh",
        "p[style-name='Heading 2'] => h2:fresh",
        "p[style-name='标题 1'] => h1:fresh",
        "p[style-name='标题 2'] => h2:fresh"
      ]
    }

    const result = await mammoth.convertToHtml({ arrayBuffer }, options)
    const text = convertHtmlToCustomFormat(result.value)
    mergeContent.value = text

    if (result.messages.length > 0) {
      mergeLogger.warn('解析警告:', result.messages)
    }
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : '未知错误'
    mergeErrorMessage.value = `文档解析失败: ${message}`
  }
}

const handleMerge = (): void => {
  if (!mergeContent.value.trim()) return
  
  const parsedBlocks = smartTextParser(mergeContent.value)
  if (parsedBlocks.length > 0) {
    appStore.mergeBlocks(parsedBlocks, {
      index: mergePosition.value.index + 1,
      relativeToId: mergePosition.value.id,
      asGroup: mergeAsGroup.value
    })
    
    // 清空并关闭
    mergeContent.value = ''
    isMergeModalOpen.value = false
    alert(`成功合并 ${parsedBlocks.length} 个内容块`)
  }
}

// 移动块
const onMoveBlock = (params: { blockId: string, targetId: string, position: 'top' | 'bottom' | 'inside' }): void => {
  // 检测嵌套容器逻辑
  const blockToMove = appStore.contentBlocks.find(b => b.id === params.blockId) ||
                      findBlockRecursive(appStore.contentBlocks, params.blockId)

  if (blockToMove?.type === 'container') {
    let isNested = false

    if (params.position === 'inside') {
      //直接拖入容器
      const targetBlock = findBlockRecursive(appStore.contentBlocks, params.targetId)
      if (targetBlock?.type === 'container') {
        isNested = true
      }
    } else {
      // 拖入容器内的某个元素旁边 (top/bottom)
      const parentBlock = findParentBlock(appStore.contentBlocks, params.targetId)
      if (parentBlock && parentBlock.type === 'container') {
        isNested = true
      }
    }

    if (isNested) {
      const confirmFlatten = window.confirm('检测到嵌套容器，是否拆散嵌套并将其内容放入目标容器？\n\n点击"确定"将内容移入，"取消"则直接嵌套。')
      appStore.moveBlock(params.blockId, params.targetId, params.position, { flatten: confirmFlatten })
      return
    }
  }

  appStore.moveBlock(params.blockId, params.targetId, params.position)
}

// 确认删除块 - 防止误删除
const confirmDeleteBlock = (blockId: string): void => {
  const block = findBlockRecursive(contentBlocks.value, blockId)
  if (!block) return

  const blockType = getBlockTypeDisplayName(block.type)

  if (confirm(`确定要删除这个${blockType}吗？\n\n此操作不可恢复。`)) {
    appStore.deleteBlock(blockId)
    if (selectedBlockId.value === blockId) {
      selectedBlockId.value = null
    }
  }
}


// 导航操作
const goToPreviousStep = (): void => {
  router.push('/step1')
}

const goToNextStep = (): void => {
  if (contentBlocks.value.length > 0) {
    router.push('/step3')
  }
}

// 组件挂载时如果没有内容块，返回第一步
onMounted(() => {
  if (contentBlocks.value.length === 0 && !appStore.rawText) {
    const savedDraft = localStorage.getItem(LOCAL_DRAFT_KEY)
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft)
        if (parsed?.rawText) appStore.setRawText(parsed.rawText)
        if (parsed?.styleConfig) appStore.setStyleConfig(parsed.styleConfig)
        if (Array.isArray(parsed?.contentBlocks) && parsed.contentBlocks.length > 0) {
          const restoredBlocks = parsed.contentBlocks.map((block: Partial<ContentBlock>, index: number) => ({
            id: `local_${index}_${Date.now()}`,
            type: block.type || 'body',
            text: block.text || '',
            source: 'local',
            meta: block.meta || {}
          }))
          appStore.setContentBlocks(restoredBlocks)
        }
      } catch (e) {
        step2Logger.warn('Failed to restore local draft:', e)
      }
    }
  }

  if (contentBlocks.value.length === 0 && !appStore.rawText) {
    router.push('/step1')
  }
})

// AI 生成图像 (调用后端 - 火山引擎豆包)
const generateAiImage = async (block: ContentBlock): Promise<void> => {
  if (!block.text || generatingBlockId.value) return

  generatingBlockId.value = block.id

  try {
    // Determine type for API
    let apiType = 'body'
    if (block.type === 'title') apiType = 'title'
    if (block.type === 'intro') apiType = 'quote'

    // Call Backend (Volcengine)
    const response = await fetch('/api/nano-banana/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: block.text,
        type: apiType
      })
    })

    if (!response.ok) {
        const errText = await response.text()
        step2Logger.error('Backend API Error (Volcengine):', errText)
        throw new Error(errText || 'Generation failed')
    }

    const data = await response.json()
    if (data.url) {
      appStore.updateBlockMeta(block.id, {
        aiImageUrl: data.url,
        originalText: block.text,
        isAiGenerated: true
      })
    }
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : '未知错误'
    step2Logger.error('Volcengine Generation Failed:', e)
    alert('火山引擎生成失败: ' + message)
  } finally {
    generatingBlockId.value = null
  }
}

</script>

<style scoped>
/* List Transitions for Silky Smooth Movements */
.block-list-move,
.block-list-enter-active,
.block-list-leave-active {
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.block-list-enter-from,
.block-list-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

/* Ensure leaving items are taken out of layout flow so others move up smoothly */
.block-list-leave-active {
  position: absolute;
  width: 100%;
}
</style>
