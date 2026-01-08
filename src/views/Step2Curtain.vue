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
          <TransitionGroup name="block-list" tag="div" class="space-y-3">
            <div
              v-for="(block, index) in contentBlocks" 
              :key="block.id"
              class="relative group"
            >
              <!-- 内容块 - 简洁样式 -->
              <div
                @click="selectBlock(block.id)"
                :class="[
                  'p-4 rounded-xl transition-all duration-200 relative content-card',
                  selectedBlockId === block.id
                    ? 'ring-2 ring-blue-400 shadow-md'
                    : 'hover:shadow-sm'
                ]"
              >
                <!-- 顶部栏：类型标签 + 操作按钮 -->
                <div class="flex items-center justify-between mb-3">
                  <!-- 左侧：类型标签/选择器 -->
                  <div class="flex items-center gap-2">
                    <!-- 选中时显示下拉选择器 -->
                    <select
                      v-if="selectedBlockId === block.id"
                      :value="block.type"
                      @change="changeBlockType(block.id, ($event.target as HTMLSelectElement).value as BlockType)"
                      class="px-2 py-1 bg-white border border-gray-300 rounded text-xs font-medium text-black hover:border-blue-400 focus:border-blue-500 focus:outline-none cursor-pointer"
                      @click.stop
                    >
                      <option v-for="option in getBlockTypeOptions()" :key="option.value" :value="option.value">
                        {{ option.icon }} {{ option.label }}
                      </option>
                    </select>
                    <!-- 未选中时显示静态标签 -->
                    <span 
                      v-else 
                      class="px-2 py-1 rounded text-xs font-medium border"
                      style="background: var(--color-content-bg); color: var(--color-content-text-secondary); border-color: var(--color-content-border);"
                    >
                      {{ getBlockTypeDisplayName(block.type) }}
                    </span>
                  </div>

                  <!-- 右侧：操作按钮（仅选中时显示） -->
                  <div v-if="selectedBlockId === block.id" class="flex items-center gap-1">
                    <!-- AI 按钮 -->
                    <button 
                      @click.stop="generateAiImage(block)"
                      class="p-1.5 rounded hover:bg-purple-100 text-purple-500 transition-colors"
                      :class="{ 'animate-pulse': generatingBlockId === block.id }"
                      :disabled="generatingBlockId === block.id"
                      title="AI 图像化"
                    >
                      <span v-if="generatingBlockId === block.id" class="text-xs">⏳</span>
                      <span v-else>✨</span>
                    </button>
                    <!-- 删除按钮 -->
                    <button
                      @click.stop="confirmDeleteBlock(index, block.id)"
                      class="p-1.5 rounded text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                      title="删除"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                    </button>
                  </div>
                  <!-- 未选中时右上角的 AI 图标 -->
                  <button 
                    v-else
                    @click.stop="generateAiImage(block)"
                    class="p-1 rounded hover:bg-purple-100 text-purple-400 hover:text-purple-600 transition-colors opacity-50 hover:opacity-100"
                    :class="{ 'animate-pulse opacity-100': generatingBlockId === block.id }"
                    :disabled="generatingBlockId === block.id"
                    title="AI 图像化"
                  >
                    <span v-if="generatingBlockId === block.id" class="text-xs">⏳</span>
                    <span v-else>✨</span>
                  </button>
                </div>

                <!-- 文本内容区：始终显示为可编辑输入框 -->
                <div v-if="!isImageBlock(block.type)" class="relative">
                  <!-- AI 生成的图片展示 -->
                  <div v-if="block.meta?.aiImageUrl" class="mb-3 relative">
                    <LazyImage
                      :src="block.meta.aiImageUrl as string"
                      alt="AI Generated"
                      :width="400"
                      :height="300"
                      class="w-full rounded-lg shadow-sm border border-gray-200"
                      img-class="w-full rounded-lg shadow-sm border border-gray-200"
                      :placeholder="true"
                      :threshold="0.3"
                    />
                    <span class="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-0.5 rounded">AI</span>
                  </div>

                  <!-- 直接编辑的输入框 -->
                  <input
                    v-if="block.type === 'title'"
                    type="text"
                    v-model="block.text"
                    class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-blue-400 focus:ring-1 focus:ring-blue-400 focus:outline-none transition-colors text-center text-lg font-bold"
                    :placeholder="getBlockPlaceholder(block.type)"
                    @click.stop
                  />
                  <!-- 正文等使用 textarea -->
                  <textarea
                    v-else
                    v-model="block.text"
                    class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-blue-400 focus:ring-1 focus:ring-blue-400 focus:outline-none transition-colors resize-none"
                    :class="{ 'text-gray-400 text-sm': block.meta?.aiImageUrl }"
                    :placeholder="getBlockPlaceholder(block.type)"
                    rows="2"
                    @click.stop
                  ></textarea>
                </div>

                <!-- 图片模板显示 -->
                <div
                  v-if="isImageBlock(block.type)"
                  class="py-4 text-center"
                >
                    <div class="flex flex-col items-center justify-center space-y-3">
                      <div class="flex items-center space-x-3">
                        <span class="text-2xl">
                          <span v-if="block.type === 'image_single' || block.type === 'image_single_caption'">🖼️</span>
                          <span v-else-if="block.type === 'image_double' || block.type === 'image_double_caption'">🖼️🖼️</span>
                        </span>
                        <span class="text-sm text-gray-600 font-medium">
                          {{ getImagePlaceholder(block.type) }}
                        </span>
                      </div>
                      
                      <!-- 单图注编辑区 -->
                      <div v-if="block.type === 'image_single_caption'" class="w-full max-w-lg">
                        <input 
                          type="text" 
                          v-model="block.text"
                          class="w-full px-3 py-2 border rounded-md text-sm text-center focus:ring-blue-500 focus:border-blue-500"
                          placeholder="请输入图片说明"
                          @click.stop
                        />
                      </div>

                      <!-- 双图注编辑区 (分别编辑) -->
                      <div v-if="block.type === 'image_double_caption'" class="w-full max-w-lg flex space-x-2">
                        <!-- 左图注 -->
                        <input 
                          type="text" 
                          :value="getCaptionParts(block.text)[0]"
                          @input="updateDoubleCaption(block, 0, ($event.target as HTMLInputElement).value)"
                          class="w-1/2 px-3 py-2 border rounded-md text-sm text-center focus:ring-blue-500 focus:border-blue-500"
                          placeholder="左图说明"
                          @click.stop
                        />
                        <!-- 右图注 -->
                        <input 
                          type="text" 
                          :value="getCaptionParts(block.text)[1]"
                          @input="updateDoubleCaption(block, 1, ($event.target as HTMLInputElement).value)"
                          class="w-1/2 px-3 py-2 border rounded-md text-sm text-center focus:ring-blue-500 focus:border-blue-500"
                          placeholder="右图说明"
                          @click.stop
                        />
                      </div>
                    </div>
                </div>
              </div>

              <!-- 版式插入器 -->
              <div class="flex justify-center mt-2">
                <LayoutInserter
                  @insert-image="insertImageBlock(index, $event)"
                  @insert-text="insertTextBlock(index, $event)"
                />
              </div>
            </div>
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '../stores/appStore'
import { smartTextParser } from '../utils/textParser'
import { getBlockTypeDisplayName } from '../utils/styleAssembler'
import { uploadManager } from '../utils/uploadManager'
import StyleSelector from '../components/StyleSelector.vue'
import LayoutInserter from '../components/LayoutInserter.vue'
import UploadProgress from '../components/UploadProgress.vue'
import LazyImage from '../components/LazyImage.vue'
import type { ContentBlock, BlockType } from '../types'

const router = useRouter()
const appStore = useAppStore()
const selectedBlockId = ref<string | null>(null)
const showMobileSidebar = ref(false)
const generatingBlockId = ref<string | null>(null)
const LOCAL_DRAFT_KEY = 'local_step2_draft'

// 计算属性
const contentBlocks = computed(() => appStore.contentBlocks)

// V2: 上传状态计算属性
const uploadProgress = computed(() => appStore.uploadProgress)
const isUploading = computed(() => appStore.isUploading)

// V2: 重试失败的上传
const retryFailedUploads = () => {
  uploadManager.retryFailed()
}

// 监听原始文本变化，解析内容块
watch(() => appStore.rawText, (newText) => {
  console.log('[Step2] watch triggered:', {
    rawTextLength: newText?.length || 0,
    contentBlocksLength: contentBlocks.value.length,
    willParse: newText && contentBlocks.value.length === 0
  })
  if (newText && contentBlocks.value.length === 0) {
    console.log('[Step2] ⚠️ contentBlocks为空，从rawText重新解析')
    const parsedBlocks = smartTextParser(newText)
    appStore.setContentBlocks(parsedBlocks)
  }
}, { immediate: true })

// 选择内容块
const selectBlock = (blockId: string) => {
  selectedBlockId.value = blockId === selectedBlockId.value ? null : blockId
}

// 获取块类型选项
const getBlockTypeOptions = () => {
  return [
    { value: 'title', label: '标题', icon: '📰' },
    { value: 'body', label: '正文', icon: '📝' },
    { value: 'intro', label: '引言', icon: '💭' },
    { value: 'outro', label: '结尾', icon: '🏁' },
    { value: 'image_single', label: '单图', icon: '🖼️' },
    { value: 'image_single_caption', label: '单图+注', icon: '🖼️📝' },
    { value: 'image_double', label: '双图', icon: '🖼️🖼️' },
    { value: 'image_double_caption', label: '双图+注', icon: '🖼️📝' }
  ]
}

// 改变块类型
const changeBlockType = (blockId: string, newType: BlockType) => {
  appStore.updateBlockType(blockId, newType)
}

// 插入图片块
const insertImageBlock = (index: number, imageType: string) => {
  appStore.insertImageBlock(index, imageType as 'single' | 'single_caption' | 'double' | 'double_caption')
}

// 插入文本内容块
const insertTextBlock = (index: number, textType: string) => {
  const defaultTexts: Record<string, string> = {
    'title': '新的标题内容',
    'body': '新的正文内容，点击这里开始编辑...',
    'intro': '新的引言内容，点击这里开始编辑...',
    'outro': '新的结尾内容，点击这里开始编辑...'
  }

  const defaultText = defaultTexts[textType] || '新内容，点击编辑...'

  appStore.insertTextBlock(index + 1, textType as BlockType, defaultText)
}

// 删除块
const deleteBlock = (index: number) => {
  const newBlocks = [...contentBlocks.value]
  const removedBlock = newBlocks.splice(index, 1)[0]
  appStore.setContentBlocks(newBlocks)

  // 如果删除的是当前选中的块，取消选中
  if (removedBlock?.id === selectedBlockId.value) {
    selectedBlockId.value = null
  }
}

// 确认删除块 - 防止误删除
const confirmDeleteBlock = (index: number, _blockId: string) => {
  const block = contentBlocks.value[index]
  const blockType = block ? getBlockTypeDisplayName(block.type) : '内容块'

  // 使用更友好的确认对话框
  if (confirm(`确定要删除这个${blockType}吗？\n\n内容：${block?.text?.substring(0, 50)}${block?.text?.length > 50 ? '...' : ''}\n\n此操作不可恢复。`)) {
    deleteBlock(index)
  }
}
// 获取图片占位符文本
const getImagePlaceholder = (type: string) => {
  const placeholders: Record<string, string> = {
    'image_single': '[单图模板]',
    'image_single_caption': '[单图+注模板]',
    'image_double': '[双图模板]',
    'image_double_caption': '[双图+注模板]'
  }
  return placeholders[type] || '[图片]'
}

// 判断是否为图片块
const isImageBlock = (type: string) => {
  return ['image_single', 'image_single_caption', 'image_double', 'image_double_caption'].includes(type)
}

// 获取不同类型的占位符文本
const getBlockPlaceholder = (type: string) => {
  const placeholders: Record<string, string> = {
    'title': '请输入标题内容...',
    'body': '请输入正文内容...',
    'intro': '请输入引言内容...',
    'outro': '请输入结尾内容...'
  }
  return placeholders[type] || '请输入内容...'
}


// 导航操作
const goToPreviousStep = () => {
  router.push('/step1')
}

const goToNextStep = () => {
  if (contentBlocks.value.length > 0) {
    // 验证是否有装饰样式配置
    const styleConfig = appStore.styleConfig
    const hasTitleStyle = styleConfig?.title && styleConfig.title.fullExample
    const hasBodyStyle = styleConfig?.body && styleConfig.body.fullExample
    const hasIntroStyle = styleConfig?.intro && styleConfig.intro.fullExample

    if (!hasTitleStyle && !hasBodyStyle && !hasIntroStyle) {
      alert('请先在左侧选择装饰样式后再进入预览阶段！')
      return
    }
    router.push('/step3')
  }
}

// 获取双图注的分隔部分
const getCaptionParts = (text: string) => {
  if (!text) return ['', '']
  
  // 优先支持原来的 | 分隔 (用于兼容)
  if (text.includes('|') || text.includes('｜')) {
    const parts = text.split(/[|｜]/)
    return [parts[0] ? parts[0].trim() : '', parts[1] ? parts[1].trim() : '']
  }
  
  // 支持空格分隔
  if (text.trim().includes(' ')) {
      const parts = text.trim().split(/\s+/)
      if (parts.length >= 2) {
          return [parts[0], parts.slice(1).join(' ')]
      }
  }

  return [text, text] // 如果没有分隔符，默认相同？
}

// 更新双图注
const updateDoubleCaption = (block: ContentBlock, index: number, newValue: string) => {
  const parts = getCaptionParts(block.text)
  parts[index] = newValue
  
  // 使用空格连接
  const newText = `${parts[0]} ${parts[1]}`
  appStore.updateBlockText(block.id, newText)
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
          const restoredBlocks = parsed.contentBlocks.map((block: any, index: number) => ({
            id: `local_${index}_${Date.now()}`,
            type: block.type || 'body',
            text: block.text || '',
            source: 'local',
            meta: block.meta || {}
          }))
          appStore.setContentBlocks(restoredBlocks)
        }
      } catch (e) {
        console.warn('[Step2] Failed to restore local draft:', e)
      }
    }
  }

  if (contentBlocks.value.length === 0 && !appStore.rawText) {
    router.push('/step1')
  }
})

// AI 生成图像 (调用后端 - 火山引擎豆包)
const generateAiImage = async (block: ContentBlock) => {
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
        console.error('Backend API Error (Volcengine):', errText)
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
  } catch (e: any) {
    console.error('Volcengine Generation Failed:', e)
    alert('火山引擎生成失败: ' + e.message)
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
