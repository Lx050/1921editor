<template>
  <!-- 全屏容器：相对于 App.vue 的 flex-1 区域 -->
  <div class="relative flex-1 flex overflow-hidden">
    <!-- 移动端侧边栏切换按钮 -->
    <button
      @click="showMobileSidebar = !showMobileSidebar"
      class="md:hidden fixed right-4 bottom-32 z-50 bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
      title="切换图片库"
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

    <template v-if="!isGenerating && finalHtml && !errorMessage">
      <!-- 左侧：微信图片库 - 镜像 Step 2 结构 -->
      <div
        :class="[
          'w-72 flex-shrink-0 h-full border-r transition-transform duration-300 ease-in-out md:translate-x-0 overflow-hidden',
          showMobileSidebar ? 'translate-x-0 fixed left-0 top-0 bottom-0 z-30' : '-translate-x-full fixed md:relative md:translate-x-0'
        ]"
        style="background: var(--color-content-bg-soft); border-color: var(--color-content-border);"
      >
        <ImageReplacer
          :wechat-images="wechatImages"
          :selected-placeholder="selectedPlaceholder"
          @select="handleImageSelect"
        />
      </div>

      <!-- 右侧：工作区 (包含 Header, Body, BottomBar) -->
      <div class="flex-1 flex flex-col h-full w-full relative overflow-hidden bg-white">
        <!-- 精简头部 -->
        <div class="flex-shrink-0 w-full border-b p-3 md:p-4" style="background: var(--color-content-card); border-color: var(--color-content-border);">
          <div class="flex items-center justify-between gap-2 md:gap-3">
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 md:gap-3">
                <span class="text-[10px] md:text-xs px-2 py-0.5 rounded-full bg-orange-100 text-orange-600 font-medium whitespace-nowrap">Step 3/3</span>
                <h2 class="text-base md:text-lg font-bold truncate" style="color: var(--color-content-text);">生成预览</h2>
              </div>
              <p class="text-[10px] md:text-xs mt-0.5 truncate" style="color: var(--color-content-text-secondary);">
                {{ hasWechatImages ? (isMobile ? '选择图片替换' : '点击占位符，选择图片替换') : '预览效果并获取 HTML' }}
              </p>
            </div>
            
            <div class="flex items-center gap-1 md:gap-2">
              <button
                @click="copyShareLink"
                class="px-2 md:px-3 py-1.5 bg-white border border-blue-200 hover:border-blue-400 text-blue-600 text-[10px] md:text-xs font-bold rounded-md transition-all flex items-center space-x-1 shadow-sm h-8"
                title="分享"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>
                <span class="hidden sm:inline">协作分享</span>
              </button>

              <div class="h-4 w-[1px] bg-gray-200 mx-1 hidden md:block"></div>

              <div class="flex bg-gray-100 p-0.5 md:p-1 rounded-lg">
                <button
                  @click="activeTab = 'preview'"
                  :class="['px-2 md:px-4 py-1 md:py-1.5 text-[10px] md:text-xs font-bold rounded-md transition-all', activeTab === 'preview' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-black']"
                >预览</button>
                <button
                  @click="activeTab = 'code'"
                  :class="['px-2 md:px-4 py-1 md:py-1.5 text-[10px] md:text-xs font-bold rounded-md transition-all', activeTab === 'code' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-black']"
                >代码</button>
              </div>

              <div class="h-6 w-[1px] bg-gray-200 mx-1 hidden md:block"></div>

              <button
                @click="copyHtml"
                class="px-2 md:px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-[10px] md:text-xs font-bold rounded-md transition-all flex items-center space-x-1 shadow-sm h-8"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                <span class="hidden sm:inline">{{ copyButtonText.replace('HTML代码', '') }}</span>
                <span class="sm:hidden">复制</span>
              </button>
            </div>
          </div>
        </div>

        <!-- 移动端横向图片快选条 - 在工具栏下方 -->
        <QuickImageStrip
          v-if="hasWechatImages"
          :images="successfulWechatImages"
          :selected-placeholder="selectedPlaceholder"
          @select="handleImageSelect"
          class="md:hidden"
        />

        <!-- 主体区域 - 预览框居中，两侧留白 -->
        <div class="flex-1 flex flex-col relative overflow-hidden bg-gray-100">
          <!-- 预览模式: 手机框居中，两侧留空 -->
          <div v-show="activeTab === 'preview'" class="flex-1 flex justify-center items-stretch overflow-hidden p-0 md:p-4 bg-gray-100">
            <div class="w-full md:w-[390px] h-full flex flex-col overflow-hidden shrink-0 shadow-2xl bg-white md:rounded-2xl border-x md:border border-gray-200">
              <template v-if="showMobileFrame">
                <!-- 手机状态栏 -->
                <div class="w-full h-11 flex justify-between px-6 items-center shrink-0" style="background: linear-gradient(180deg, #2a2a30 0%, #1a1a1f 100%);">
                  <div class="w-12 h-full flex items-center text-white text-[10px] font-medium pl-2">9:41</div>
                  <div class="w-[120px] h-[34px] rounded-3xl absolute left-1/2 -translate-x-1/2 top-2" style="background: #1a1a1f;"></div>
                  <div class="w-16 flex space-x-1.5 justify-end items-center pr-2">
                     <svg class="w-4 h-3 text-white" viewBox="0 0 18 12" fill="currentColor"><path d="M1 9.5C1 10.3284 1.67157 11 2.5 11H13.5C14.3284 11 15 10.3284 15 9.5V2.5C15 1.67157 14.3284 1 13.5 1H2.5C1.67157 1 1 1.67157 1 2.5V9.5Z" stroke="white"/><path d="M16.5 4V8" stroke="white" stroke-linecap="round"/></svg>
                  </div>
                </div>
                <!-- 微信导航栏 -->
                <div class="h-11 bg-[#ededed] flex items-center justify-between px-4 border-b border-gray-300 shrink-0">
                  <div class="flex items-center text-gray-800 font-medium text-[16px]"><span class="mr-1 text-2xl leading-none" style="margin-top: -2px;">‹</span> 公众号</div>
                  <div class="text-gray-800 font-semibold text-[16px] tracking-wide truncate max-w-[150px]">{{ draftForm.title || '文章预览' }}</div>
                  <div class="w-12 flex justify-end">
                     <div class="w-8 h-6 bg-white border border-gray-300 rounded-full flex justify-center items-center space-x-0.5">
                        <div class="w-0.5 h-0.5 bg-black rounded-full"></div>
                        <div class="w-1 h-0.5 bg-black rounded-full"></div>
                        <div class="w-0.5 h-0.5 bg-black rounded-full"></div>
                     </div>
                  </div>
                </div>
              </template>
              <div v-else class="h-10 bg-gray-50 border-b flex items-center justify-center text-[10px] text-gray-400 font-bold tracking-widest shrink-0 uppercase">WeChat Article Preview</div>
              <!-- iframe 内容区 - 自动填充剩余高度 -->
              <div class="flex-1 bg-white relative overflow-hidden">
                <iframe ref="previewFrame" :srcdoc="previewHtml" class="w-full h-full border-0 absolute inset-0" title="版式预览" @load="setupIframeClickHandler"></iframe>
              </div>
              
              <!-- 底部操作栏 - 在手机框内部 -->
              <div class="flex-shrink-0 bg-white border-t border-gray-100 px-4 py-3">
                <div class="flex items-center justify-between gap-4">
                  <!-- 上一步按钮 -->
                  <button
                    @click="goToPreviousStep"
                    class="flex-1 h-11 bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 text-black text-sm font-medium rounded-xl transition-all active:scale-[0.98] shadow-sm flex items-center justify-center gap-1"
                  >
                    <span>←</span>
                    <span>上一步</span>
                  </button>
                  
                  <!-- 创建微信草稿按钮 -->
                  <button
                    @click="openDraftModal"
                    class="flex-[2] h-11 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-sm font-bold rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 active:scale-[0.98]"
                  >
                    <span>创建微信草稿</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
              
              <!-- 底部指示条（仅真机模式） -->
              <div v-if="showMobileFrame" class="h-6 w-full flex justify-center items-end pb-1.5 shrink-0 bg-white">
                <div class="w-32 h-1 bg-gray-800 rounded-full opacity-20"></div>
              </div>
            </div>
          </div>

          <!-- 代码预览 -->
          <div v-show="activeTab === 'code'" class="flex-1 overflow-y-auto p-6 md:p-8 pb-24 bg-gray-50">
            <div class="max-w-4xl mx-auto">
              <div class="text-[10px] font-bold text-gray-400 mb-3 tracking-widest uppercase">HTML Output Source</div>
              <div class="bg-gray-900 text-gray-100 rounded-2xl p-6 md:p-8 font-mono text-xs md:text-sm break-all leading-relaxed shadow-2xl border border-white/5 select-all">{{ finalHtml }}</div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template v-else>
      <div class="flex-1 flex flex-col items-center justify-center p-8 text-center bg-gray-50 h-full">
        <div v-if="isGenerating">
          <div class="inline-block animate-spin rounded-full h-10 w-10 border-4 border-blue-600/30 border-t-blue-600 mb-4"></div>
          <p class="text-gray-600 font-medium">正在生成版式，请稍候...</p>
        </div>
        <div v-else-if="errorMessage" class="max-w-md mx-auto">
          <div class="text-red-400 text-4xl mb-4">⚠️</div>
          <h3 class="text-red-600 font-bold text-lg mb-2">生成失败</h3>
          <p class="text-gray-600 mb-6">{{ errorMessage }}</p>
          <div class="flex gap-3 justify-center">
            <button @click="regenerate" class="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium shadow-md">重试</button>
            <button @click="goToPreviousStep" class="px-6 py-2 bg-white border border-gray-300 text-black rounded-lg font-medium">返回编辑</button>
          </div>
        </div>
        <div v-else>
          <div class="text-gray-300 text-5xl mb-4">📄</div>
          <p class="text-gray-500 mb-6">暂无可预览的内容</p>
          <button @click="goToPreviousStep" class="px-8 py-2 bg-blue-600 text-white rounded-lg font-bold shadow-lg">去编辑内容</button>
        </div>
      </div>
    </template>

    <CreateDraftFormModal
      :show="showDraftModal"
      :initial-title="draftForm.title"
      :available-images="successfulWechatImages"
      :error="draftError"
      :success="draftSuccess"
      :ai-progress="aiImageProgress"
      :is-submitting="isCreatingDraft"
      :is-uploading-cover="isUploadingCover"
      @close="showDraftModal = false"
      @submit="submitDraft"
      @upload-cover="handleCoverUpload"
      @update:form="updateDraftForm"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, type Ref } from 'vue'
import { useRouter, useRoute, type Router } from 'vue-router'
import { useAppStore } from '../stores/appStore'
import { useConfigStore } from '../stores/configStore'
import { buildHtml } from '../utils/styleAssembler'
import { createDraft, uploadImage, getWechatProxyUrl, restoreWechatUrl } from '../utils/wechatApi'
import { copyToClipboard, copyHtmlToClipboard } from '../utils/clipboard'
import { createLogger } from '../utils/logger'
import ImageReplacer from '../components/ImageReplacer.vue'
import QuickImageStrip from '../components/QuickImageStrip.vue'
import CreateDraftFormModal from '../components/CreateDraftFormModal.vue'
import { articleApi } from '../utils/api'
import toast from '../composables/useToast'
import DOMPurify from 'dompurify'
import type { DraftArticle, WechatImage, WechatUploadResponse, BlockType, ContentBlock } from '@/types'
import type { ImageReplacement, DraftFormState, ExternalImage } from '@/types/preview'
import { tokenStorage } from '../utils/tokenStorage'

defineOptions({
  name: 'Step3Preview'
})

const router: Router = useRouter()
const route = useRoute()
const appStore = useAppStore()
const configStore = useConfigStore()
const step3Logger = createLogger('Step3')
const previewLogger = createLogger('Preview')

const isGenerating: Ref<boolean> = ref(false)
const finalHtml: Ref<string> = ref('')
const previewHtml: Ref<string> = ref('')
const errorMessage: Ref<string> = ref('')
const activeTab: Ref<'preview' | 'code'> = ref('preview')
const copyButtonText: Ref<string> = ref('复制预览')
const previewFrame: Ref<HTMLIFrameElement | null> = ref(null)

// 根据当前选项卡获取复制按钮文本
const getCopyButtonLabel = (): string => {
  return activeTab.value === 'preview' ? '复制预览' : '复制代码'
}

const buildAuthHeaders = (): Record<string, string> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  }
  const token = tokenStorage.getToken()
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }
  return headers
}

// V2: 图片替换相关状态
const selectedPlaceholder: Ref<string | null> = ref(null)

// 监听选项卡切换，更新复制按钮文本
watch(activeTab, () => {
  copyButtonText.value = getCopyButtonLabel()
})

// 监听占位符选中状态，显示提示
watch(selectedPlaceholder, (newVal) => {
  if (newVal) {
    if (isMobile.value) {
      toast.info('已选中占位符，请点击上方图片库中的图片进行替换')
    } else {
      toast.info('已选中占位符，请点击左侧图片库中的图片进行替换')
    }
  }
})

// 监听元数据变化，实时更新预览
watch(
  [
    () => appStore.editorInput,
    () => appStore.teamName,
    () => appStore.sourceAccount,
    () => appStore.copywriterNames,
    () => appStore.plannerNames,
    () => appStore.editorNames
  ],
  () => {
    step3Logger.debug('检测到元数据变化，重新生成 HTML...')
    regenerate()
  },
  { deep: true }
)

const imageReplacements: Ref<Record<string, ImageReplacement>> = ref({})
const lastScrollTop: Ref<number> = ref(0) // 记录 iframe 滚动位置

// V2: 草稿创建相关状态
const showDraftModal: Ref<boolean> = ref(false)
const showMobileFrame: Ref<boolean> = ref(false)
const isCreatingDraft: Ref<boolean> = ref(false)
const isUploadingCover: Ref<boolean> = ref(false)
const isSharing: Ref<boolean> = ref(false)
const showMobileSidebar: Ref<boolean> = ref(false)
const draftError: Ref<string> = ref('')
const draftSuccess: Ref<string> = ref('')
const aiImageProgress: Ref<string> = ref('')
const isSaving: Ref<boolean> = ref(false)
const hasAutoSaved: Ref<boolean> = ref(false)
const draftForm: Ref<DraftFormState> = ref({
  title: '',
  coverImageId: '',
  author: '',
  digest: '',
  showCover: true
})

// V2: 从内容块中提取标题（第一行通常是大标题）
const extractTitleFromContent = (): string => {
  const blocks = contentBlocks.value
  const firstBlock = blocks[0]
  if (firstBlock && firstBlock.text && firstBlock.text.trim()) {
    const lines = firstBlock.text.split('\n').filter(line => line.trim())
    if (lines.length > 0) {
      return lines[0].trim().substring(0, 64)
    }
  }
  return ''
}

// V2: 打开草稿弹窗，自动填充标题
const openDraftModal = (): void => {
  if (!draftForm.value.title) {
    draftForm.value.title = extractTitleFromContent()
  }

  draftError.value = ''
  draftSuccess.value = ''
  showDraftModal.value = true
}

// V2: 处理封面上传
const handleCoverUpload = async (file: File | null): Promise<void> => {
  if (!file) return

  // 检查文件类型
  if (!file.type.match(/^image\/(jpeg|png)$/)) {
    draftError.value = '封面图仅支持 JPG/PNG 格式'
    return
  }

  // 检查文件大小 (2MB)
  if (file.size > 2 * 1024 * 1024) {
    draftError.value = '封面图大小不能超过 2MB'
    return
  }

  isUploadingCover.value = true
  draftError.value = ''

  try {
    // 1. 上传图片到微信
    const response: WechatUploadResponse = await uploadImage(file)
    const mediaId = response.media_id
    const url = response.url

    if (!mediaId || !url) {
      throw new Error('封面上传失败：缺少 media_id 或 url')
    }

    // 2. 创建图片对象并添加到 Store
    const newImage: WechatImage = {
      id: `cover_${Date.now()}`,
      mediaId,
      url,
      localPreviewUrl: URL.createObjectURL(file),
      name: file.name,
      status: 'success',
      file: file
    }

    // 添加到 store
    appStore.addWechatImages([newImage])

    // 3. 自动选中
    draftForm.value.coverImageId = mediaId

  } catch (error: unknown) {
    step3Logger.error('封面上传失败:', error)
    const message = error instanceof Error ? error.message : '封面上传失败，请重试'
    draftError.value = message
  } finally {
    isUploadingCover.value = false
  }
}


// 计算属性
const contentBlocks = computed(() => appStore.contentBlocks)
const isMobile = computed(() => (typeof window !== 'undefined' ? window.innerWidth < 768 : false))
const wechatImages = computed(() => appStore.wechatImages)
const hasWechatImages = computed(() => wechatImages.value.length > 0)
const successfulWechatImages = computed(() => 
  wechatImages.value.filter(img => img.status === 'success' && img.mediaId)
)

const resolveArticleId = (value: unknown): string | null =>
  typeof value === 'string' ? value : null

// 递归计算块内图片数量
const countImages = (block: ContentBlock): number => {
  let count = 0
  if (block.type === 'image_single' || block.type === 'image_single_caption' || (block.meta && block.meta.aiImageUrl)) {
    count = 1
  } else if (block.type === 'image_double' || block.type === 'image_double_caption') {
    count = 2
  } else if (block.type === 'container' && block.children) {
    count = block.children.reduce((acc: number, child: ContentBlock) => acc + countImages(child), 0)
  }
  return count
}

// 根据全局图片索引查找对应的块和块内偏移
const findBlockByImageIndex = (blocks: ContentBlock[], targetIndex: number): { block: ContentBlock; offset: number } | null => {
  let currentIndex = 0

  const traverse = (list: ContentBlock[]): { block: ContentBlock; offset: number } | null => {
    for (const block of list) {
      const imgCount = countImages(block)
      
      // 如果目标索引在这个块的范围内
      if (targetIndex >= currentIndex && targetIndex < currentIndex + imgCount) {
        if (block.type === 'container') {
           // 递归容器内部
           return traverse(block.children || [])
        } else {
           // 找到了目标叶子节点
           return { block, offset: targetIndex - currentIndex }
        }
      }
      currentIndex += imgCount
    }
    return null
  }
  
  return traverse(blocks)
}

// V2: 根据内容块元数据恢复图片替换关系 (解决刷新后预览失效问题)
const restoreImageReplacementsFromBlocks = () => {
  const map: Record<string, ImageReplacement> = {}
  let imageCounter = 0

  const traverse = (blocks: ContentBlock[]) => {
    blocks.forEach(block => {
      // 单图恢复
      if (block.meta?.replacementUrl) {
        const placeholderId = `image_${imageCounter}`
        map[placeholderId] = {
          previewUrl: getWechatProxyUrl(String(block.meta.replacementUrl)),
          wechatUrl: String(block.meta.replacementUrl)
        }
      } 
      // 双图恢复
      else if (Array.isArray(block.meta?.replacementUrls)) {
        block.meta.replacementUrls.forEach((url, i) => {
          if (url) {
            const placeholderId = `image_${imageCounter}_${i + 1}`
            map[placeholderId] = {
              previewUrl: getWechatProxyUrl(String(url)),
              wechatUrl: String(url)
            }
          }
        })
      }
      
      // 这里的 imageCounter 必须与 styleAssembler 逻辑完全一致
      imageCounter += countImages(block)
    })
  }
  
  traverse(contentBlocks.value)
  imageReplacements.value = map
  step3Logger.debug('已从内容块元数据恢复图片替换关系:', Object.keys(map).length, '项')
}

// V2: 处理微信图片选择 - 直接替换，无需确认
const handleImageSelect = (image: WechatImage): void => {
  const placeholderId = selectedPlaceholder.value
  if (!placeholderId) {
    step3Logger.debug('请先选择右侧预览中的占位符')
    return
  }

  // 使用本地预览 URL 进行预览显示
  const previewUrl = image.localPreviewUrl || image.proxyUrl || getWechatProxyUrl(image.url)
  const wechatUrl = restoreWechatUrl(image.url || image.proxyUrl || previewUrl)

  // 1. 更新前端临时预览 Map (用于 iframe 实时显示)
  imageReplacements.value[placeholderId] = {
    previewUrl: previewUrl,
    wechatUrl: wechatUrl
  }

  // 2. 核心修复：将替换关系持久化到 Block 的 meta 中
  // 解析 placeholderId (格式: image_5 或 image_5_1)
  try {
    const parts = placeholderId.split('_') // ["image", "5", "1"?]
    if (parts.length >= 2) {
      const globalImageIndex = parseInt(parts[1], 10)
      const subIndex = parts.length > 2 ? parseInt(parts[2], 10) : 0 // 1-based index from styleAssembler if double
      
      // 查找对应的块
      const result = findBlockByImageIndex(contentBlocks.value, globalImageIndex)
      
      if (result && result.block) {
        const block = result.block
        step3Logger.debug('找到对应的块:', block.id, block.type)

        const newMeta = { ...block.meta }

        if (block.type === 'image_double' || block.type === 'image_double_caption') {
           // 双图处理
           const existingUrls = Array.isArray(newMeta.replacementUrls) ? newMeta.replacementUrls : undefined
           const urls = existingUrls ? [...existingUrls] : ['', '']
           // styleAssembler 生成的 subIndex 是 1 或 2，对应数组索引 0 或 1
           // 但是 globalImageIndex 是针对 block 的起始索引。
           // 对于 double image，countImages 返回 2。
           // 如果 placeholder 是 image_5_1，说明是第6组图片的第1张？
           // 让我们回顾 styleAssembler:
           // addDoubleImagePlaceholderMarkers 用的是 `image_${imageIndex}_${counter}`
           // 其中 imageIndex 是通过 accumulated count 传进来的。
           // 如果 block 是 double，它占用了 imageIndex 和 imageIndex+1 ? 
           // 不，styleAssembler 的 imageCounter 是一次性加 countImages(block)。
           // 所以 imageIndex 是该 block "起始" 的图片索引。
           // 比如前面有 5 张图，当前是 double，那么 imageIndex 是 5。
           // 生成的 placeholder 是 image_5_1 和 image_5_2。
           
           // 解析出的 subIndex 是 1 或 2
           // 所以数组索引是 subIndex - 1
           if (subIndex === 1) urls[0] = wechatUrl
           if (subIndex === 2) urls[1] = wechatUrl
           
           newMeta.replacementUrls = urls
           step3Logger.debug('更新双图 Block Meta:', urls)
        } else {
           // 单图处理
           newMeta.replacementUrl = wechatUrl
           step3Logger.debug('更新单图 Block Meta:', wechatUrl)
        }
        
        // 更新 Store，触发自动保存
        appStore.updateBlockMeta(block.id, newMeta)
      } else {
        step3Logger.warn('未找到对应的 Block:', placeholderId)
      }
    }
  } catch (e) {
    step3Logger.error('解析 Block 映射失败:', e)
  }

  step3Logger.debug('直接替换:', placeholderId, '->', previewUrl)

  // 优化：直接修改 iframe 中的 DOM，避免 reload 导致的闪烁
  updateIframeImageDom(placeholderId, previewUrl)

  // 清除选择状态
  selectedPlaceholder.value = null

  // 🚀 自动保存：确保替换关系持久化到后端
  saveDraft().catch(e => {
    step3Logger.error('自动保存替换记录失败:', e)
  })
}

// 监听路由变化，切换文章时通过清空 store 防止图片串台
watch(
  () => route.params.id,
  (newId, oldId) => {
    const nextId = resolveArticleId(newId)
    const prevId = resolveArticleId(oldId)
    // 只有当从一个文章切换到另一个文章时才清空 (避免 Step2 -> Step3 或 刷新页面时的误清空)
    if (nextId && prevId && nextId !== prevId) {
      step3Logger.debug('切换文章，清空图片 Store')
      appStore.setWechatImages([])
      isGenerating.value = true // 重置加载状态
    }
  }
)

// 自动保存图片逻辑 (增加 loading 检查，防止初始加载时覆盖为空)
watch(wechatImages, async (newImages) => {
  if (isGenerating.value) {
    step3Logger.debug('正在加载中，跳过自动保存')
    return
  }

  const articleId = resolveArticleId(route.params.id)
  if (!articleId) return

  // 安全检查：如果有图片仅仅是 blob 且没有 mediaId，说明正在上传中
  // 此时绝对不能保存，否则会因为"净化逻辑"把这张图当作垃圾丢弃，导致图片丢失
  const hasPendingUpload = newImages.some(img =>
    img.url && img.url.startsWith('blob:') && !img.mediaId
  )

  if (hasPendingUpload) {
    step3Logger.debug('检测到正在上传的图片 (Blob)，暂停自动保存，等待上传完成...')
    return // ⛔️ 终止保存，等待 upload 完成更新 URL 后再次触发 watch
  }

  // 过滤掉残留的 blob URL (理论上上面拦截了，这里是双重保险，防止极大延迟)
  const persistentImages = newImages
    .map(img => {
      if (img.url && img.url.startsWith('blob:') && !img.mediaId) return null

      if (!img.mediaId || !img.url) return null

      return {
        id: img.id,
        mediaId: img.mediaId,
        url: img.url,
        name: img.name,
        status: img.status
      }
    })
    .filter((img): img is WechatImage => Boolean(img))

  if (persistentImages.length !== newImages.length) {
    // 如果数量不一致，说明有被过滤的图，这很不正常 (因为 Pending 的已经被拦截了)
    step3Logger.warn('警告：部分图片未通过持久化检查，将不被保存', newImages.length, '->', persistentImages.length)
  }

  step3Logger.debug('自动保存图片到后端:', persistentImages.length)
  try {
    await articleApi.updateStep3(articleId, persistentImages as unknown as { [key: string]: unknown }[])
  } catch (e) {
    step3Logger.error('保存图片失败', e)
  }
}, { deep: true })

// 同步 Modal 表单数据
const updateDraftForm = (newForm: Partial<DraftFormState>): void => {
  draftForm.value = { ...draftForm.value, ...newForm }
}

// 新增：直接更新 iframe DOM
const updateIframeImageDom = (placeholderId: string, newUrl: string): void => {
  const doc = previewFrame.value?.contentDocument
  if (!doc) return

  try {
    // 查找具有指定占位符标识的图片元素
    const imgs = doc.querySelectorAll<HTMLImageElement>(`img[data-placeholder="${placeholderId}"]`)

    imgs.forEach((img) => {
      // 更新其 src 属性
      img.src = newUrl
      // 清除可能存在的选中样式
      img.style.outline = 'none'
      img.style.boxShadow = 'none'
    })

    previewLogger.debug('DOM 更新成功，已直接反映在 iframe 中')
  } catch (e) {
    previewLogger.warn('DOM 更新失败:', e)
    // 如果 DOM 操作失败，回退到整体刷新 HTML
    updatePreviewHtmlRef()
  }
}

const goToPreviousStep = (): void => {
  appStore.currentStep = 2
  router.push('/step2')
}



const updatePreviewHtmlRef = (): void => {
  const html = getCurrentPreviewHtmlString()
  // 净化 HTML 以防注入，同时保留 data-placeholder 等自定义属性
  previewHtml.value = DOMPurify.sanitize(html, {
    ADD_ATTR: ['data-placeholder', 'data-role', 'label', 'data-tplid', 'data-tools', 'data-id', 'data-cropselx1', 'data-cropselx2', 'data-cropsely1', 'data-cropsely2', 'data-imgfileid', 'data-ratio', 'data-w', 'data-s', 'data-type', 'type', 'contenteditable'],
    ADD_TAGS: ['section', 'mp-style-type']
  })
}

// 初始化加载文章数据
onMounted(async () => {
  const articleId = resolveArticleId(route.params.id)
  
  // 确保 store 中的步骤与当前路由匹配
  appStore.currentStep = 3

  // 🚀 优化：只有当路由 ID 与当前已加载的文章 ID 不符时，才从后端重新加载
  // 这样如果从 Dashboard 点击跳转过来，由于数据已在 Dashboard 加载好，这里就不会重置和重传了
  if (articleId && appStore.currentArticleId !== articleId) {
    step3Logger.debug('检测到直接访问或切换文章，从后端加载数据:', articleId)
    appStore.resetApp()
    
    try {
      isGenerating.value = true

      const res = await articleApi.getArticleById(articleId)
      const article = res.data

      if (article) {
        appStore.setCurrentArticleId(article.id)
        draftForm.value.title = article.title

        step3Logger.debug('文章数据加载完成')

        if (article.config) {
          appStore.setStyleConfig(article.config)
          
          // 恢复元数据
          if (article.config.metadata) {
            const meta = article.config.metadata
            if (meta.editorInput !== undefined) appStore.editorInput = meta.editorInput
            if (meta.teamName !== undefined) appStore.teamName = meta.teamName
            if (meta.sourceAccount !== undefined) appStore.sourceAccount = meta.sourceAccount
            if (meta.teamProject !== undefined) appStore.teamProject = meta.teamProject
            if (meta.teamDepartment !== undefined) appStore.teamDepartment = meta.teamDepartment
            if (meta.teamLeader !== undefined) appStore.teamLeader = meta.teamLeader
            if (meta.teamContact !== undefined) appStore.teamContact = meta.teamContact
            if (meta.copywriterNames !== undefined) appStore.copywriterNames = meta.copywriterNames
            if (meta.plannerNames !== undefined) appStore.plannerNames = meta.plannerNames
            if (meta.editorNames !== undefined) appStore.editorNames = meta.editorNames
            step3Logger.debug('元数据恢复完成')
          }
        }

        if (article.content) {
          try {
            const savedBlocks = JSON.parse(article.content)
            if (Array.isArray(savedBlocks) && savedBlocks.length > 0) {
              const restoreBlocksRecursively = (blocks: any[]): ContentBlock[] => {
                return blocks.map((block: any) => ({
                  id: block.id || `restored_${Math.random().toString(36).substr(2, 9)}`,
                  type: (block.type || 'body') as BlockType,
                  text: block.text || '',
                  source: 'restored',
                  meta: block.meta || (block.aiImageUrl ? { aiImageUrl: block.aiImageUrl } : {}),
                  children: block.children ? restoreBlocksRecursively(block.children) : undefined
                }))
              }
              const restoredBlocks = restoreBlocksRecursively(savedBlocks)
              appStore.setContentBlocks(restoredBlocks)

              const collectTextRecursively = (blocks: ContentBlock[]): string => {
                return blocks.map(b => {
                  const currentText = b.text || ''
                  const childrenText = b.children ? collectTextRecursively(b.children) : ''
                  return currentText + (childrenText ? '\n' + childrenText : '')
                }).join('\n\n')
              }
              const rawText = collectTextRecursively(restoredBlocks)
              appStore.setRawText(rawText)
            } else {
              appStore.setRawText(article.content)
            }
          } catch {
            appStore.setRawText(article.content)
          }
        }

        step3Logger.debug('后端返回的图片数据:', JSON.stringify(article.images))
        const backendImages = (article.images || []) as WechatImage[]
        const validImages = backendImages.map((img) => {
          const rawUrl = img.url || img.proxyUrl || ''
          if (rawUrl && rawUrl.startsWith('blob:')) {
            return null
          }

          const normalizedUrl = restoreWechatUrl(rawUrl)
          const proxyUrl = img.proxyUrl || getWechatProxyUrl(normalizedUrl)

          return {
            ...img,
            url: normalizedUrl || img.url,
            localPreviewUrl: img.localPreviewUrl || proxyUrl,
            proxyUrl: proxyUrl
          }
        }).filter(Boolean) as WechatImage[]

        step3Logger.debug('有效图片数量:', validImages.length, '张（已过滤 blob）')
        appStore.setWechatImages(validImages)
      }
    } catch (e) {
      step3Logger.error('加载文章失败:', e)
      errorMessage.value = '加载文章数据失败'
    } finally {
      isGenerating.value = false
    }
  }

  // 改进：如果没有任何内容块，说明是空跳转，应该回到第一步而不是第二步
  if (contentBlocks.value.length === 0) {
    step3Logger.warn('无内容块，重定向到第一步')
    router.push('/step1')
    return
  }

// 移除样式强制检查，允许使用默认兜底样式
  
  // 🚀 核心恢复：在渲染前从 Block Meta 恢复替换关系
  restoreImageReplacementsFromBlocks()

  await regenerate()

  if (!hasAutoSaved.value) {
    hasAutoSaved.value = true
    await saveDraft()
  }
})

// V2: 设置 iframe 点击处理器
const setupIframeClickHandler = (): void => {
  if (!previewFrame.value) return

  try {
    const iframeWindow = previewFrame.value.contentWindow
    const iframeDoc = previewFrame.value.contentDocument || iframeWindow?.document

    if (!iframeWindow || !iframeDoc) return

    // V2: 恢复滚动位置
    if (lastScrollTop.value > 0) {
      iframeWindow.scrollTo(0, lastScrollTop.value)
      // console.log('[Step3] 恢复滚动位置', lastScrollTop.value)
    }

    // 查找并绑定所有占位符图片的点击事件
    const placeholderImages = iframeDoc.querySelectorAll<HTMLImageElement>('img[data-placeholder]')
    previewLogger.debug('找到占位符图片数量:', placeholderImages.length)

    placeholderImages.forEach((img) => {
      img.style.cursor = 'pointer'
      
      // 防止重复绑定（简单判断）
      if (img.dataset.hasClick) return
      img.dataset.hasClick = 'true'
      
      img.addEventListener('mouseenter', () => {
        if (selectedPlaceholder.value !== img.dataset.placeholder) {
          img.style.outline = '2px dashed #93c5fd'
          img.style.outlineOffset = '2px'
        }
      })
      
      img.addEventListener('mouseleave', () => {
        if (selectedPlaceholder.value !== img.dataset.placeholder) {
          img.style.outline = 'none'
        }
      })
      
      img.addEventListener('click', (e) => {
        e.preventDefault()
        const placeholderId = img.dataset.placeholder
        if (!placeholderId) return
        
        // 清除所有选中状态
        placeholderImages.forEach(p => {
          p.style.outline = 'none'
          p.style.boxShadow = 'none'
        })
        
        // 设置当前选中状态
        selectedPlaceholder.value = placeholderId
        img.style.outline = '3px solid #3b82f6'
        img.style.outlineOffset = '2px'
        img.style.boxShadow = '0 0 15px rgba(59, 130, 246, 0.4)'

        previewLogger.debug('选中占位符:', placeholderId)
      })
    })

    // --- Footer 编辑逻辑 ---
    // 使用 styleAssembler 中添加的 id="editable-footer" 选择器
    const editableFooter = iframeDoc.querySelector<HTMLElement>('#editable-footer')
    if (editableFooter) {
      editableFooter.style.outline = '1px dashed transparent'
      editableFooter.style.transition = 'outline 0.2s'

      // 聚焦时高亮
      editableFooter.addEventListener('focus', () => {
        editableFooter.style.outline = '2px solid #3b82f6'
      })

      // blur 时保存并移除高亮
      editableFooter.addEventListener('blur', () => {
        editableFooter.style.outline = '1px dashed transparent'
        // 将编辑后的 footer 内容同步回 store
        const newFooterHtml = editableFooter.innerHTML
        configStore.setFooter(newFooterHtml)
        previewLogger.debug('Footer 编辑已同步到 store')
      })

      previewLogger.debug('Footer 已设置为可编辑')
    }

  } catch (e) {
    previewLogger.warn('无法设置 iframe 点击处理器:', e)
  }
}

// 辅助：生成当前预览 HTML 字符串
const getCurrentPreviewHtmlString = (): string => {
  let html = finalHtml.value
  
  // 应用所有图片替换（使用预览 URL）
  for (const [placeholderId, urls] of Object.entries(imageReplacements.value) as Array<[string, ImageReplacement]>) {
    const imageUrl = urls.previewUrl
    const imgTagRegex = new RegExp(`<img([^>]*data-placeholder="${placeholderId}"[^>]*)>`, 'g')
    html = html.replace(imgTagRegex, (match, attributes) => {
      void match
      const newAttributes = attributes.replace(/src="[^"]*"/, `src="${imageUrl}"`)
      return `<img${newAttributes}>`
    })
  }
  return html
}

// 生成HTML
const generateHtml = async (): Promise<void> => {
  if (isGenerating.value) return
  
  isGenerating.value = true
  errorMessage.value = ''

  try {
    await new Promise(resolve => setTimeout(resolve, 500))

    // 确保有样式配置
    if (!appStore.styleConfig) {
       // 尝试加载默认配置...
    }

    // 关键修正：传入 urlTransformer，将微信 URL 转为代理 URL
    const html = buildHtml(
      contentBlocks.value, 
      appStore.styleConfig, 
      true,
      (url) => getWechatProxyUrl(url) // V2: 自动代理化
    )
    
    finalHtml.value = html
    selectedPlaceholder.value = null
  } catch (error: unknown) {
    step3Logger.error('生成HTML失败:', error)
    const message = error instanceof Error ? error.message : '生成HTML时发生未知错误'
    errorMessage.value = message
  } finally {
    isGenerating.value = false
  }
}

// 监听 finalHtml 变化
watch(finalHtml, (newHtml) => {
  if (newHtml && Object.keys(imageReplacements.value).length === 0) {
    previewHtml.value = newHtml
  }
})

// 监听 activeTab 变化，确保切换回预览时内容是最新的
watch(activeTab, (newTab) => {
  if (newTab === 'preview') {
    previewHtml.value = getCurrentPreviewHtmlString()
  }
})

// V2: 生成最终输出 HTML（使用微信 URL）
const getOutputHtml = (): string => {
  let html = finalHtml.value
  
  // 1. 全局还原微信 URL (将代理链接转回原始链接)
  html = html.replace(/src="([^"]+)"/g, (_match, src) => {
      // 解码 HTML 实体 (如果有)
      const cleanSrc = src.replace(/&amp;/g, '&')
      const original = restoreWechatUrl(cleanSrc)
      return `src="${original}"`
  })
  
  // 2. 应用所有图片替换（使用微信 URL 用于最终输出）
  // 虽然 styleAssembler 可能已经处理了大部分，但如果有未保存的临时替换，这里再次覆盖
  for (const [placeholderId, urls] of Object.entries(imageReplacements.value) as Array<[string, ImageReplacement]>) {
    const imageUrl = urls.wechatUrl || urls.previewUrl
    const imgTagRegex = new RegExp(`<img([^>]*data-placeholder="${placeholderId}"[^>]*)>`, 'g')
    html = html.replace(imgTagRegex, (match, attributes) => {
      void match
      const newAttributes = attributes.replace(/src="[^"]*"/, `src="${imageUrl}"`)
      return `<img${newAttributes}>`
    })
  }
  
  // 3. 移除 data-placeholder 属性（最终输出不需要）
  html = html.replace(/ data-placeholder="[^"]*"/g, '')
  
  return html
}

// 智能复制：根据当前选项卡使用不同的复制方法
const copyHtml = async (): Promise<void> => {
  const htmlToCopy = getOutputHtml()

  let result: { ok: boolean; method: string; error?: unknown }

  if (activeTab.value === 'preview') {
    // 预览模式：使用富文本复制，可以直接粘贴到微信编辑器保留格式
    const iframeBody = previewFrame.value?.contentDocument?.body
    const plainText = iframeBody?.innerText || ''
    result = await copyHtmlToClipboard(htmlToCopy, plainText)

    if (result.ok) {
      showCopySuccess()
      toast.success('预览内容已复制，可直接粘贴到微信编辑器')
    } else {
      step3Logger.error('Preview copy failed:', result.error)
      toast.error('复制失败，请切换到代码模式复制')
    }
  } else {
    // 代码模式：使用纯文本复制 HTML 源代码
    result = await copyToClipboard(htmlToCopy)

    if (result.ok) {
      showCopySuccess()
      toast.success('HTML 代码已复制')
    } else {
      step3Logger.error('Code copy failed:', result.error)
      alert('复制失败，请手动选择代码进行复制')
    }
  }
}

const showCopySuccess = (): void => {
  copyButtonText.value = '已复制!'
  setTimeout(() => {
    copyButtonText.value = getCopyButtonLabel()
  }, 2000)
}



const submitDraft = async (): Promise<void> => {
  if (!draftForm.value.title || !draftForm.value.coverImageId) return

  isCreatingDraft.value = true
  draftError.value = ''
  draftSuccess.value = ''

  try {
    let content = getOutputHtml()

    // ========== 新增：处理 AI 生成的外部图片 URL ==========
    // 检测内容中的外部图片 URL（火山引擎、Pollinations 等）
    const externalImageRegex = new RegExp(
      '<img[^>]+src="(https:\\/\\/(?:ark\\.cn-beijing\\.volces\\.com|image\\.pollinations\\.ai)[^"]+)"[^>]*>',
      'g'
    )
    const externalImages: ExternalImage[] = []

    let match: RegExpExecArray | null = null
    while ((match = externalImageRegex.exec(content)) !== null) {
      externalImages.push({
        original: match[1],  // URL
        tag: match[0]        // 完整的 img 标签
      })
    }

    if (externalImages.length > 0) {
      step3Logger.debug(`检测到 ${externalImages.length} 张外部AI图片，开始优化并发上传...`)
      aiImageProgress.value = `初始化上传管理器...`

      try {
        // 动态导入并发上传管理器
        const { ConcurrentUploadManager } = await import('../utils/concurrentUpload')

        // 创建上传管理器实例（优化配置）
        const uploadManager = new ConcurrentUploadManager({
          maxConcurrent: 3, // 最大3个并发
          timeout: 45000,   // 45秒超时
          enableRetry: true,
          maxRetries: 2,    // 最多重试2次
          retryDelay: 1000  // 1秒重试延迟
        })

        // 设置进度监听
        uploadManager.onProgress((progress) => {
          const stats = uploadManager.getStats()
          const overallProgress = Math.round((stats.completed / stats.total) * 100)

          aiImageProgress.value = `${progress.message} (${stats.completed}/${stats.total}) - ${overallProgress}%`

          step3Logger.debug(`${progress.taskId}: ${progress.message}`)
        })

        // 提取所有图片URL
        const imageUrls = externalImages.map(img => img.original)

        aiImageProgress.value = `开始并发下载和上传 ${imageUrls.length} 张图片...`

        // 执行并发下载和上传
        const { results, errors } = await uploadManager.downloadAndUpload(
          imageUrls,
          async (file) => {
            // 上传到微信素材库
            const uploadResult = await uploadImage(file)
            if (!uploadResult.url) {
              throw new Error('上传失败: 缺少图片 URL')
            }
            return { url: uploadResult.url }
          }
        )

        // 处理结果
        if (results.length > 0) {
          // 创建URL映射表
          const urlMap = new Map(results.map(r => [r.original, r.newUrl]))

          // 批量替换URL
          let replacedCount = 0
          externalImages.forEach(({ original, tag }) => {
            const newUrl = urlMap.get(original)
            if (newUrl) {
              const newTag = tag.replace(original, newUrl)
              content = content.replace(tag, newTag)
              replacedCount++
            }
          })

          aiImageProgress.value = `✓ AI图片处理完成: ${replacedCount}/${imageUrls.length} 张成功`
          step3Logger.debug(`AI图片处理完成 - 成功: ${replacedCount}, 失败: ${errors.length}`)
        }

        // 处理错误（如果有部分失败）
        if (errors.length > 0) {
          step3Logger.error(`部分AI图片处理失败:`, errors)
          // 不抛出错误，允许部分成功的情况
        }

      } catch (uploadError: unknown) {
        step3Logger.error('AI图片批量处理失败:', uploadError)
        const message = uploadError instanceof Error ? uploadError.message : String(uploadError)
        throw new Error(`AI图片处理失败: ${message}`)
      }
    }
    // ========== 处理完毕 ==========

    // 构建文章对象
    const showCoverPic: 0 | 1 = draftForm.value.showCover ? 1 : 0
    const article: DraftArticle = {
      title: draftForm.value.title,
      thumb_media_id: draftForm.value.coverImageId,
      author: draftForm.value.author,
      digest: draftForm.value.digest,
      show_cover_pic: showCoverPic,
      content: content,
      need_open_comment: 1, // 默认开启留言
      only_fans_can_comment: 0
    }

    // 调用 API 创建草稿
    const result = await createDraft(article)

    // 成功处理
    const draftId = result.draft_id || result.media_id
    if (!draftId) {
      throw new Error('创建草稿失败: 缺少草稿 ID')
    }
    draftSuccess.value = draftId
    step3Logger.debug('草稿创建成功:', result)

    // 保存草稿数据到sessionStorage（用于预览页面）
    sessionStorage.setItem('wechat_draft_id', draftId)
    sessionStorage.setItem('wechat_draft_title', article.title)
    sessionStorage.setItem('wechat_draft_author', article.author || '')
    sessionStorage.setItem('wechat_draft_digest', article.digest || '')
    sessionStorage.setItem('wechat_draft_content', content)

    // 3秒后关闭弹窗
    setTimeout(() => {
      showDraftModal.value = false
      // 重置成功消息，以便下次打开
      setTimeout(() => {
        draftSuccess.value = ''
      }, 500)
    }, 3000)

  } catch (error: unknown) {
    step3Logger.error('创建草稿失败:', error)
    draftError.value = error instanceof Error ? error.message : '创建草稿失败，请检查网络或配置'
    aiImageProgress.value = '' // 清除进度提示
  } finally {
    isCreatingDraft.value = false
    // 延迟清除进度提示（让用户看到完成状态）
    setTimeout(() => {
      aiImageProgress.value = ''
    }, 2000)
  }
}


const regenerate = async (): Promise<void> => {
  await generateHtml()
}



// 保存草稿到后端 - 保存内容和样式配置
const saveDraft = async (): Promise<boolean> => {
  if (isSaving.value) return false

  isSaving.value = true
  step3Logger.debug('=== 开始保存草稿 ===')

  try {
    if (!tokenStorage.getToken()) {
      toast.warning('请先登录后再保存')
      return false
    }

    // 🚀 核心修复：递归清理内容块，保留嵌套结构和元数据
    const cleanBlocksRecursively = (blocks: ContentBlock[]): any[] => {
      return blocks.map(block => ({
          id: block.id,
          type: block.type,
          text: block.text || '',
          meta: block.meta || {},
          children: block.children ? cleanBlocksRecursively(block.children) : undefined
      }))
    }

    const cleanedBlocks = cleanBlocksRecursively(contentBlocks.value)
    const cleanContent = JSON.stringify(cleanedBlocks)
    let articleId = appStore.currentArticleId
    // 🛡️ 安全检查：防止 invalid ID 导致请求失败
    if (articleId === 'undefined' || articleId === 'null') {
      articleId = null
      appStore.setCurrentArticleId(null)
    }

    step3Logger.debug('当前文章ID:', articleId)
    step3Logger.debug('清理后的内容块数量:', cleanedBlocks.length)
    step3Logger.debug('内容预览:', cleanContent.substring(0, 200) + '...')
    step3Logger.debug('样式配置:', appStore.styleConfig)
    
    if (articleId) {
      // 🚀 并行优化：内容、图片库、样式配置同时保存
      step3Logger.debug('正在并行保存内容、图片和配置...')

      const saveTasks = []

      // 1. 保存内容 (使用 Step3 专用端点)
      saveTasks.push(fetch(`/api/articles/${articleId}/step3-content`, {
        method: 'PUT',
        headers: buildAuthHeaders(),
        body: JSON.stringify({ content: cleanContent })
      }).then(async r => {
        if (!r.ok) {
          const err = await r.json().catch(() => ({ message: 'Unknown error' }))
          throw new Error(`保存内容失败: ${r.status} ${err.message}`)
        }
        return 'content'
      }))

      // 2. 保存图片库
      const imagesToSave = appStore.wechatImages
        .filter(img => img.status === 'success' && img.mediaId)
        .map(img => {
          const normalizedUrl = restoreWechatUrl(img.url || img.proxyUrl || '')
          const proxyUrl = normalizedUrl ? getWechatProxyUrl(normalizedUrl) : ''
          return {
            id: img.id,
            mediaId: img.mediaId,
            url: normalizedUrl || img.url,
            proxyUrl: proxyUrl,
            name: img.name,
            status: img.status
          }
        })

      if (imagesToSave.length > 0) {
        saveTasks.push(fetch(`/api/articles/${articleId}/images`, {
          method: 'PUT',
          headers: buildAuthHeaders(),
          body: JSON.stringify({ images: imagesToSave })
        }).then(r => {
          if (!r.ok) throw new Error('保存图片库失败')
          return 'images'
        }))
      }

      // 3. 保存样式配置与元数据 (注意: 后端 DTO 期望 config 和 metadata 是两个独立的顶层字段)
      const metadata = {
        editorInput: appStore.editorInput,
        teamName: appStore.teamName,
        sourceAccount: appStore.sourceAccount,
        copywriterNames: appStore.copywriterNames,
        plannerNames: appStore.plannerNames,
        editorNames: appStore.editorNames
      }

      saveTasks.push(fetch(`/api/articles/${articleId}/config`, {
        method: 'PUT',
        headers: buildAuthHeaders(),
        body: JSON.stringify({ 
          config: appStore.styleConfig,
          metadata: metadata
        })
      }).then(r => {
        if (!r.ok) throw new Error('保存配置失败')
        return 'config'
      }))

      // 等待所有任务完成
      const results = await Promise.all(saveTasks)
      step3Logger.debug('并行保存完成:', results)
      
      toast.success('草稿已保存（内容、图片、样式同步完成）')
    } else {
      // 创建新文章 - 先创建，再更新内容
      const title = contentBlocks.value.find(b => b.type === 'title')?.text || '未命名文章'
      
      // Step 1: 创建文章（只传 title 和 config）
      step3Logger.debug('正在创建新文章...', { title })
      const createResponse = await fetch('/api/articles', {
        method: 'POST',
        headers: buildAuthHeaders(),
        body: JSON.stringify({ 
          title,
          config: appStore.styleConfig
        })
      })
      
      if (!createResponse.ok) {
        const errorData = await createResponse.json().catch(() => ({}))
        throw new Error(errorData.message || '创建文章失败')
      }
      
      const data = await createResponse.json()
      step3Logger.debug('创建文章响应:', data)

      if (!data || !data.id) {
        step3Logger.error('创建文章响应缺少 ID', data)
        throw new Error('创建文章失败: 服务器未返回有效的文章 ID')
      }

      appStore.setCurrentArticleId(data.id)
      
      // Step 2: Step3 内容保存（设置状态为 ADJUSTED）
      step3Logger.debug('正在保存 Step3 内容...', { id: data.id })
      const updateResponse = await fetch(`/api/articles/${data.id}/step3-content`, {
        method: 'PUT',
        headers: buildAuthHeaders(),
        body: JSON.stringify({ content: cleanContent })
      })
      
      if (!updateResponse.ok) {
        const errorData = await updateResponse.json().catch(() => ({}))
        step3Logger.error('保存 Step3 内容失败', errorData)
        throw new Error(errorData.message || '保存Step3内容失败')
      }

      // V2: 创建后保存微信图片库 (使用代理 URL)
      const newArticleImages = appStore.wechatImages
        .filter(img => img.status === 'success' && img.mediaId)
        .map(img => {
          const normalizedUrl = restoreWechatUrl(img.url || img.proxyUrl || '')
          const proxyUrl = normalizedUrl ? getWechatProxyUrl(normalizedUrl) : ''
          return {
            id: img.id,
            mediaId: img.mediaId,
            url: normalizedUrl || img.url,
            proxyUrl: proxyUrl,
            name: img.name,
            status: img.status
          }
        })
      
      if (newArticleImages.length > 0) {
        step3Logger.debug('新文章保存图片:', newArticleImages.length, '张')
        await fetch(`/api/articles/${data.id}/images`, {
          method: 'PUT',
          headers: buildAuthHeaders(),
          body: JSON.stringify({ images: newArticleImages })
        })
      }

      toast.success('文章已创建并保存！')
    }

    return true // 返回成功状态
  } catch (error: unknown) {
    step3Logger.error('保存失败:', error)
    const message = error instanceof Error ? error.message : String(error)
    toast.error('保存失败: ' + message)
    return false
  } finally {
    isSaving.value = false
  }
}

// 协作分享链接生成
const copyShareLink = async (): Promise<void> => {
  if (isSharing.value) return
  isSharing.value = true
  
  try {
    let articleId = appStore.currentArticleId
    
    // 如果没有 ID，说明尚未保存过，先保存一次
    if (!articleId) {
      toast.info('正在生成协作链接，请稍候...')
      const success = await saveDraft()
      if (!success) return
      articleId = appStore.currentArticleId
    }
    
    if (!articleId) throw new Error('无法获取文章ID')
    
    // 生成完整链接
    const shareUrl = `${window.location.origin}/step3/${articleId}`
    
    // 复制到剪贴板
    const result = await copyToClipboard(shareUrl)
    if (result.ok) {
      toast.success('协作链接已复制到剪贴板！发送给他人即可同步编辑。', 5000)
    } else {
      step3Logger.warn('剪贴板 API 失败，尝试备选方案', result.error)
      alert(`协作链接（请手动复制）:\n${shareUrl}`)
    }
    
  } catch (err: unknown) {
    step3Logger.error('分享失败:', err)
    const message = err instanceof Error ? err.message : '未知错误'
    toast.error('共享生成失败: ' + message)
  } finally {
    isSharing.value = false
  }
}

</script>

<style scoped>
/* 组件特定的样式 */
</style>
