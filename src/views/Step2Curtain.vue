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
import UploadProgress from '../components/UploadProgress.vue'
import ContentBlockItem from '../components/ContentBlockItem.vue'
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

// 移动块
const onMoveBlock = (params: { blockId: string, targetId: string, position: 'top' | 'bottom' | 'inside' }) => {
  appStore.moveBlock(params.blockId, params.targetId, params.position)
}

// 确认删除块 - 防止误删除
const confirmDeleteBlock = (blockId: string) => {
  // 递归查找块以确认删除
  const findBlock = (blocks: ContentBlock[], id: string): ContentBlock | undefined => {
    for (const b of blocks) {
      if (b.id === id) return b
      if (b.children) {
        const found = findBlock(b.children, id)
        if (found) return found
      }
    }
    return undefined
  }

  const block = findBlock(contentBlocks.value, blockId)
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
const goToPreviousStep = () => {
  router.push('/step1')
}

const goToNextStep = () => {
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
