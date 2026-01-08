<template>
  <!-- 全屏容器：固定布局，不滚动 -->
  <div class="fixed inset-0 flex overflow-hidden">
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
          <div class="flex items-center justify-between">
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-3">
                <span class="text-xs px-2 py-0.5 rounded-full bg-orange-100 text-orange-600 font-medium whitespace-nowrap">Step 3/3</span>
                <h2 class="text-lg font-bold truncate" style="color: var(--color-content-text);">生成预览</h2>
              </div>
              <p class="text-xs mt-0.5 truncate" style="color: var(--color-content-text-secondary);">
                {{ hasWechatImages ? '点击预览占位符，选择图片替换' : '预览效果并获取 HTML' }}
              </p>
            </div>
            
            <div class="flex items-center gap-2">
              <!-- 新增：协作分享按钮 -->
              <button
                @click="copyShareLink"
                class="px-3 py-1.5 bg-white border border-blue-200 hover:border-blue-400 text-blue-600 text-xs font-bold rounded-md transition-all flex items-center space-x-1 shadow-sm h-8"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>
                <span>协作分享</span>
              </button>

              <div class="h-4 w-[1px] bg-gray-200 mx-1"></div>

              <div class="flex bg-gray-100 p-1 rounded-lg">
                <button
                  @click="activeTab = 'preview'"
                  :class="['px-4 py-1.5 text-xs font-bold rounded-md transition-all', activeTab === 'preview' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700']"
                >预览</button>
                <button
                  @click="activeTab = 'code'"
                  :class="['px-4 py-1.5 text-xs font-bold rounded-md transition-all', activeTab === 'code' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700']"
                >代码</button>
              </div>

              <div class="h-6 w-[1px] bg-gray-200 mx-1"></div>

              <button
                @click="copyHtml"
                class="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded-md transition-all flex items-center space-x-1 shadow-sm"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                <span>{{ copyButtonText }}</span>
              </button>
            </div>
          </div>
        </div>

        <!-- 主体区域 - 直接放置预览框 -->
        <div class="flex-1 flex flex-col relative overflow-hidden">
          <!-- 预览模式: 手机框直接填充 -->
          <div v-show="activeTab === 'preview'" class="flex-1 flex pb-20 overflow-hidden">
            <div :class="[showMobileFrame ? 'w-[390px] h-full mobile-frame flex flex-col overflow-hidden mx-auto shadow-2xl' : 'flex-1 flex flex-col overflow-hidden bg-white']">
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
              <!-- 底部指示条 -->
              <div v-if="showMobileFrame" class="h-8 w-full flex justify-center items-end pb-2 shrink-0 bg-white">
                <div class="w-36 h-1 bg-gray-800 rounded-full opacity-20"></div>
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

        <!-- 底部栏 - 固定在右侧视图底部 -->
        <div class="absolute bottom-0 left-0 right-0 flex flex-row justify-between items-center p-4 border-t z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.06)] h-20" style="background: var(--color-content-card); border-color: var(--color-content-border); backdrop-filter: blur(12px);">
          <div class="flex items-center space-x-2">
            <button
              @click="goToPreviousStep"
              class="px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-lg transition-all active:scale-95 shadow-sm"
            >
              ← 上一步
            </button>
            <button
              @click="startNew"
              class="px-4 py-2 text-gray-400 hover:text-red-500 hover:bg-red-50 text-sm font-medium rounded-lg transition-all"
            >
              重新开始
            </button>
          </div>

          <div class="flex gap-4">
            <button
              @click="regenerate"
              class="px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-lg transition-all active:scale-95 disabled:opacity-50"
              :disabled="isGenerating"
            >
              <span v-if="isGenerating" class="flex items-center gap-2">
                <span class="w-3 h-3 border-2 border-current border-t-transparent animate-spin rounded-full"></span>
                生成中
              </span>
              <span v-else>↻ 重新生成</span>
            </button>

            <button
              @click="openDraftModal"
              class="px-8 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-sm font-bold rounded-xl transition-all shadow-[0_4px_15px_rgba(124,58,237,0.3)] hover:shadow-[0_8px_25px_rgba(124,58,237,0.4)] flex items-center space-x-2 transform hover:-translate-y-0.5 active:translate-y-0 active:scale-95"
            >
              <span class="text-lg">🚀</span>
              <span>创建微信草稿</span>
            </button>
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
            <button @click="goToPreviousStep" class="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium">返回编辑</button>
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
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAppStore } from '../stores/appStore'
import { useConfigStore } from '../stores/configStore'
import { buildHtml } from '../utils/styleAssembler'
import { createDraft, uploadImage, getWechatProxyUrl } from '../utils/wechatApi'
import ImageReplacer from '../components/ImageReplacer.vue'
import CreateDraftFormModal from '../components/CreateDraftFormModal.vue'
import { articleApi } from '../utils/api'
import toast from '../composables/useToast'
import DOMPurify from 'dompurify'
import type { DraftArticle, WechatImage, WechatUploadResponse } from '@/types'

const router = useRouter()
const route = useRoute()
const appStore = useAppStore()
const configStore = useConfigStore()

const isGenerating = ref(false)
const finalHtml = ref('')
const previewHtml = ref('')
const errorMessage = ref('')
const activeTab = ref('preview')
const copyButtonText = ref('复制HTML代码')
const previewFrame = ref<HTMLIFrameElement | null>(null)

// V2: 图片替换相关状态
const selectedPlaceholder = ref<string | null>(null)

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
type ImageReplacement = {
  previewUrl: string
  wechatUrl?: string
}

type DraftFormState = {
  title: string
  coverImageId: string
  author: string
  digest: string
  showCover: boolean
}

const imageReplacements = ref<Record<string, ImageReplacement>>({})
const lastScrollTop = ref(0) // 记录 iframe 滚动位置

// V2: 草稿创建相关状态
const showDraftModal = ref(false)
const showMobileFrame = ref(false)
const isCreatingDraft = ref(false)
const isUploadingCover = ref(false)
const isSharing = ref(false) // 新增：分享状态
const showMobileSidebar = ref(false)
const draftError = ref('')
const draftSuccess = ref('')
const aiImageProgress = ref('') // 新增：AI 图片上传进度提示
const isSaving = ref(false)
const hasAutoSaved = ref(false)
const draftForm = ref<DraftFormState>({
  title: '',
  coverImageId: '',
  author: '',
  digest: '',
  showCover: true
})

// V2: 从内容块中提取标题（第一行通常是大标题）
const extractTitleFromContent = () => {
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
const openDraftModal = () => {
  if (!draftForm.value.title) {
    draftForm.value.title = extractTitleFromContent()
  }
  
  draftError.value = ''
  draftSuccess.value = ''
  showDraftModal.value = true
}

// V2: 处理封面上传
const handleCoverUpload = async (file: File | null) => {
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
      localPreviewUrl: URL.createObjectURL(file), // 用于本地显示（虽然在select中不直接显示图片，但为了数据完整性）
      name: file.name,
      status: 'success',
      file: file
    }
    
    // 添加到 store
    appStore.addWechatImages([newImage])
    
    // 3. 自动选中
    draftForm.value.coverImageId = mediaId
    
  } catch (error: unknown) {
    console.error('[Step3] 封面上传失败:', error)
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

// V2: 处理微信图片选择 - 直接替换，无需确认
const handleImageSelect = (image: WechatImage) => {
  const placeholderId = selectedPlaceholder.value
  if (!placeholderId) {
    console.log('[Step3] 请先选择右侧预览中的占位符')
    return
  }
  
  // 使用本地预览 URL 进行预览显示
  const previewUrl = image.localPreviewUrl || image.url
  
  // 记录替换（保存微信 URL 用于最终输出，本地 URL 用于预览）
  imageReplacements.value[placeholderId] = {
    previewUrl: previewUrl,
    wechatUrl: image.url
  }
  console.log('[Step3] 直接替换:', placeholderId, '->', previewUrl)
  
  // 优化：直接修改 iframe 中的 DOM，避免 reload 导致的闪烁
  updateIframeImageDom(placeholderId, previewUrl)
  
  // 清除选择状态
  selectedPlaceholder.value = null
}

// 监听路由变化，切换文章时通过清空 store 防止图片串台
watch(
  () => route.params.id,
  (newId, oldId) => {
    const nextId = resolveArticleId(newId)
    const prevId = resolveArticleId(oldId)
    // 只有当从一个文章切换到另一个文章时才清空 (避免 Step2 -> Step3 或 刷新页面时的误清空)
    if (nextId && prevId && nextId !== prevId) {
      console.log('[Step3] 切换文章，清空图片 Store')
      appStore.setWechatImages([])
      isGenerating.value = true // 重置加载状态
    }
  }
)

// 自动保存图片逻辑 (增加 loading 检查，防止初始加载时覆盖为空)
watch(wechatImages, async (newImages) => {
  if (isGenerating.value) {
    console.log('[Step3] 正在加载中，跳过自动保存')
    return
  }
  
  const articleId = resolveArticleId(route.params.id)
  if (!articleId) return

  // 安全检查：如果有图片仅仅是 blob 且没有 mediaId，说明正在上传中
  // 此时绝对不能保存，否则会因为“净化逻辑”把这张图当作垃圾丢弃，导致图片丢失
  const hasPendingUpload = newImages.some(img => 
    img.url && img.url.startsWith('blob:') && !img.mediaId
  )

  if (hasPendingUpload) {
    console.log('[Step3] 检测到正在上传的图片 (Blob)，暂停自动保存，等待上传完成...')
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
    console.warn('[Step3] 警告：部分图片未通过持久化检查，将不被保存', newImages.length, '->', persistentImages.length)
  }

  console.log('[Step3] 自动保存图片到后端:', persistentImages.length)
  try {
    await articleApi.updateStep3(articleId, persistentImages)
  } catch (e) {
    console.error('保存图片失败', e)
  }
}, { deep: true })

// 同步 Modal 表单数据
const updateDraftForm = (newForm: Partial<DraftFormState>) => {
  draftForm.value = { ...draftForm.value, ...newForm }
}

// 新增：直接更新 iframe DOM
const updateIframeImageDom = (placeholderId: string, newUrl: string) => {
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

    console.log('[Step3] DOM 更新成功，已直接反映在 iframe 中')
  } catch (e) {
    console.warn('[Step3] DOM 更新失败:', e)
    // 如果 DOM 操作失败，回退到整体刷新 HTML
    updatePreviewHtmlRef()
  }
}

const updatePreviewHtmlRef = () => {
  const html = getCurrentPreviewHtmlString()
  // 净化 HTML 以防注入，同时保留 data-placeholder 等自定义属性
  previewHtml.value = DOMPurify.sanitize(html, {
    ADD_ATTR: ['data-placeholder', 'data-role', 'label', 'data-tplid', 'data-tools', 'data-id', 'data-cropselx1', 'data-cropselx2', 'data-cropsely1', 'data-cropsely2', 'data-imgfileid', 'data-ratio', 'data-w', 'data-s', 'data-type', 'type'],
    ADD_TAGS: ['section', 'mp-style-type']
  })
}

// 初始化加载文章数据
onMounted(async () => {
  const articleId = resolveArticleId(route.params.id)
  if (articleId) {
    try {
      isGenerating.value = true

      const res = await articleApi.getArticleById(articleId)
      const article = res.data

      if (article) {
        appStore.setCurrentArticleId(article.id)
        draftForm.value.title = article.title

        appStore.plannerNames = article.plannerNames || []
        appStore.copywriterNames = article.copywriterNames || []
        appStore.editorNames = article.editorNames || []
        console.log('[Step3] 文章配置加载完成')

        if (article.config) {
          appStore.setStyleConfig(article.config)
        }

        if (article.content) {
          try {
            const savedBlocks = JSON.parse(article.content)
            if (Array.isArray(savedBlocks) && savedBlocks.length > 0) {
              const restoredBlocks = savedBlocks.map((block: any, index: number) => ({
                id: `restored_${index}_${Date.now()}`,
                type: block.type || 'body',
                text: block.text || '',
                source: 'restored',
                meta: block.aiImageUrl ? { aiImageUrl: block.aiImageUrl } : {}
              }))

              appStore.setContentBlocks(restoredBlocks)

              const rawText = savedBlocks.map((b: any) => b.text || '').join('\n\n')
              appStore.setRawText(rawText)
            } else {
              appStore.setRawText(article.content)
            }
          } catch (parseError) {
            appStore.setRawText(article.content)
          }
        }

        console.log('[Step3] 后端返回的图片数据:', JSON.stringify(article.images))
        const backendImages = (article.images || []) as WechatImage[]
        const validImages = backendImages.map((img) => {
          if (img.url && img.url.startsWith('blob:')) {
            return null
          }
          return img
        }).filter((img): img is WechatImage => Boolean(img))

        console.log('[Step3] 有效图片数量:', validImages.length, '张（已过滤 blob）')
        appStore.setWechatImages(validImages)
      }
    } catch (e) {
      console.error('[Step3] 加载文章失败:', e)
      errorMessage.value = '加载文章数据失败'
    } finally {
      isGenerating.value = false
    }
  }

  if (contentBlocks.value.length === 0) {
    router.push('/step2')
    return
  }

  const styleConfig = appStore.styleConfig
  const hasTitleStyle = styleConfig?.title && styleConfig.title.fullExample
  const hasBodyStyle = styleConfig?.body && styleConfig.body.fullExample
  const hasIntroStyle = styleConfig?.intro && styleConfig.intro.fullExample

  if (!hasTitleStyle && !hasBodyStyle && !hasIntroStyle) {
    alert('Please configure styles before preview.')
    router.push('/style-config')
    return
  }

  await regenerate()

  if (!hasAutoSaved.value) {
    hasAutoSaved.value = true
    await saveDraft()
  }
})

// V2: 设置 iframe 点击处理器
const setupIframeClickHandler = () => {
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
    console.log('[Step3] 找到占位符图片数量:', placeholderImages.length)
    
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
        
        console.log('[Step3] 选中占位符:', placeholderId)
      })
    })

    // --- Footer 编辑逻辑 ---
    // 假设 Footer 是最后一个 data-role="outer" 或者具有特定标识，这里简单假设倒数第二个 outer (因为 styleAssembler 里 header/body/footer 都是 section)
    // 准确点：styleAssembler 中 footer 是在循环后 push 的，所以通常是最后一个子节点
    // 但是 buildHTML 只是简单的 join('\n')，所以我们需要在 iframeDoc 中找到对应的 DOM
    // 我们尝试查找包含 "校团委青年媒体中心" 这一特征文本的 section 作为 footer，或者约定 footer 的结构
    
    // 为了更准确，我们可以约定 footer 的最外层 section 有个 id 或 class
    // 但现在 styleAssembler.ts 里的 HTML_FOOTER 只要是一个 outer section
    
    // 尝试找到最后一个 class="article135" 的元素，通常是 footer (Header, Body*N, Footer)
    const outers = iframeDoc.querySelectorAll<HTMLElement>('.article135[data-role="outer"]')
    if (outers.length > 0) {
      const footer = outers[outers.length - 1] // 最后一个通常是 footer
      
      // 简单判断一下内容以免误判（比如没有 footer 的情况）
      if (footer.innerHTML.includes('校团委青年媒体中心') || footer.innerHTML.includes('责编：')) {
         footer.setAttribute('contenteditable', 'true')
         footer.style.outline = '1px dashed #ddd' // 提示可编辑
         
         // 监听输入事件更新 store
         footer.addEventListener('input', () => {
            const newHtml = footer.outerHTML
            // 更新 store
            configStore.setFooter(newHtml)
            // 注意：这里更新了 store，会导致 finalHtml 重新计算 -> previewHtml 重新计算 -> iframe 刷新
            //这会导致输入焦点丢失！
            // 解决方案：
            // 1. Debounce 更新
            // 2. 或者，不直接依赖 finalHtml 的自动刷新，而是像图片替换一样，先只改 DOM，最后再同步
            
            // 为了用户体验，我们应该延迟同步到 store，或者只在 blur 时同步
         })
         
         // 聚焦时高亮
         footer.addEventListener('focus', () => {
            footer.style.outline = '2px solid #3b82f6'
         })
         footer.addEventListener('blur', () => {
             footer.style.outline = '1px dashed #ddd'
             configStore.setFooter(footer.outerHTML)
             console.log('[Step3] Footer 更新已保存')
         })
      }
    }

  } catch (e) {
    console.warn('[Step3] 无法设置 iframe 点击处理器:', e)
  }
}

// 辅助：生成当前预览 HTML 字符串
const getCurrentPreviewHtmlString = () => {
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
const generateHtml = async () => {
  isGenerating.value = true
  errorMessage.value = ''

  try {
    await new Promise(resolve => setTimeout(resolve, 500))

    if (contentBlocks.value.length === 0) {
      throw new Error('没有内容块可处理')
    }

    const styleConfig = appStore.styleConfig
    console.log('[Step3] 生成HTML，样式配置:', styleConfig)

    // V2: 生成带占位符标记的 HTML
    finalHtml.value = buildHtml(contentBlocks.value, styleConfig, true)
    previewHtml.value = finalHtml.value
    
    // 清除之前的替换记录
    imageReplacements.value = {}
    selectedPlaceholder.value = null
  } catch (error: unknown) {
    console.error('[Step3] 生成HTML失败:', error)
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
const getOutputHtml = () => {
  let html = finalHtml.value
  
  // 应用所有图片替换（使用微信 URL 用于最终输出）
  for (const [placeholderId, urls] of Object.entries(imageReplacements.value) as Array<[string, ImageReplacement]>) {
    const imageUrl = urls.wechatUrl || urls.previewUrl
    const imgTagRegex = new RegExp(`<img([^>]*data-placeholder="${placeholderId}"[^>]*)>`, 'g')
    html = html.replace(imgTagRegex, (match, attributes) => {
      void match
      const newAttributes = attributes.replace(/src="[^"]*"/, `src="${imageUrl}"`)
      return `<img${newAttributes}>`
    })
  }
  
  // 移除 data-placeholder 属性（最终输出不需要）
  html = html.replace(/ data-placeholder="[^"]*"/g, '')
  
  return html
}

// 复制HTML代码（使用微信 URL）
const copyHtml = async () => {
  const htmlToCopy = getOutputHtml()
  
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(htmlToCopy)
      showCopySuccess()
    } else {
      throw new Error('Clipboard API not available')
    }
  } catch (error) {
    console.warn('Clipboard API failed, trying fallback:', error)
    try {
      const textarea = document.createElement('textarea')
      textarea.value = htmlToCopy
      textarea.style.position = 'fixed'
      textarea.style.left = '-9999px'
      textarea.style.top = '0'
      document.body.appendChild(textarea)
      
      textarea.focus()
      textarea.select()
      
      const successful = document.execCommand('copy')
      document.body.removeChild(textarea)
      
      if (successful) {
        showCopySuccess()
      } else {
        throw new Error('execCommand copy failed')
      }
    } catch (fallbackError) {
      console.error('Copy failed:', fallbackError)
      alert('复制失败，请手动选择代码进行复制')
    }
  }
}

const showCopySuccess = () => {
  copyButtonText.value = '已复制!'
  setTimeout(() => {
    copyButtonText.value = '复制HTML代码'
  }, 2000)
}



const submitDraft = async () => {
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
    type ExternalImage = { original: string; tag: string }
    const externalImages: ExternalImage[] = []
    
    let match: RegExpExecArray | null = null
    while ((match = externalImageRegex.exec(content)) !== null) {
      externalImages.push({
        original: match[1],  // URL
        tag: match[0]        // 完整的 img 标签
      })
    }

    if (externalImages.length > 0) {
      console.log(`[Step3] 检测到 ${externalImages.length} 张外部AI图片，开始优化并发上传...`)
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

          console.log(`[Step3] ${progress.taskId}: ${progress.message}`)
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
          console.log(`[Step3] AI图片处理完成 - 成功: ${replacedCount}, 失败: ${errors.length}`)
        }

        // 处理错误（如果有部分失败）
        if (errors.length > 0) {
          console.error(`[Step3] 部分AI图片处理失败:`, errors)
          // 不抛出错误，允许部分成功的情况
        }

      } catch (uploadError: unknown) {
        console.error('[Step3] AI图片批量处理失败:', uploadError)
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
    console.log('[Step3] 草稿创建成功:', result)

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
    console.error('[Step3] 创建草稿失败:', error)
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


const regenerate = async () => {
  await generateHtml()
}

const startNew = () => {
  appStore.resetApp()
  router.push('/step1')
}

const goToPreviousStep = () => {
  router.push('/step2')
}



// 保存草稿到后端 - 保存内容和样式配置
const saveDraft = async () => {
  if (isSaving.value) return
  
  isSaving.value = true
  console.log('=== [Step3] 开始保存草稿 ===')
  
  try {
    // 清理内容块，移除编辑器内部字段
    const cleanedBlocks = contentBlocks.value.map(block => ({
      type: block.type,
      text: block.text || '',
      ...(block.meta?.aiImageUrl ? { aiImageUrl: block.meta.aiImageUrl } : {})
    }))
    
    const cleanContent = JSON.stringify(cleanedBlocks)
    const articleId = appStore.currentArticleId
    
    console.log('[Step3] 当前文章ID:', articleId)
    console.log('[Step3] 清理后的内容块数量:', cleanedBlocks.length)
    console.log('[Step3] 内容预览:', cleanContent.substring(0, 200) + '...')
    console.log('[Step3] 样式配置:', appStore.styleConfig)
    
    if (articleId) {
      // 🚀 并行优化：内容、图片库、样式配置同时保存
      console.log('[Step3] 正在并行保存内容、图片和配置...')
      
      const saveTasks = []

      // 1. 保存内容 (使用 Step3 专用端点)
      saveTasks.push(fetch(`/api/articles/${articleId}/step3-content`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
        },
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
          let proxyUrl = ''
          if (img.url && !img.url.startsWith('blob:')) {
            proxyUrl = getWechatProxyUrl(img.url)
          }
          return {
            id: img.id,
            mediaId: img.mediaId,
            url: proxyUrl,
            name: img.name,
            status: img.status
          }
        })
      
      if (imagesToSave.length > 0) {
        saveTasks.push(fetch(`/api/articles/${articleId}/images`, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ images: imagesToSave })
        }).then(r => {
          if (!r.ok) throw new Error('保存图片库失败')
          return 'images'
        }))
      }

      // 3. 保存样式配置
      saveTasks.push(fetch(`/api/articles/${articleId}/config`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ config: appStore.styleConfig })
      }).then(r => {
        if (!r.ok) throw new Error('保存样式配置失败')
        return 'config'
      }))

      // 等待所有任务完成
      const results = await Promise.all(saveTasks)
      console.log('[Step3] 并行保存完成:', results)
      
      toast.success('草稿已保存（内容、图片、样式同步完成）')
    } else {
      // 创建新文章 - 先创建，再更新内容
      const title = contentBlocks.value.find(b => b.type === 'title')?.text || '未命名文章'
      
      // Step 1: 创建文章（只传 title 和 config）
      const createResponse = await fetch('/api/articles', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
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
      appStore.setCurrentArticleId(data.id)
      
      // Step 2: Step3 内容保存（设置状态为 ADJUSTED）
      const updateResponse = await fetch(`/api/articles/${data.id}/step3-content`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: cleanContent })
      })
      
      if (!updateResponse.ok) {
        const errorData = await updateResponse.json().catch(() => ({}))
        throw new Error(errorData.message || '保存Step3内容失败')
      }

      // V2: 创建后保存微信图片库 (使用代理 URL)
      const newArticleImages = appStore.wechatImages
        .filter(img => img.status === 'success' && img.mediaId)
        .map(img => {
          let proxyUrl = ''
          if (img.url && !img.url.startsWith('blob:')) {
            proxyUrl = getWechatProxyUrl(img.url)
          }
          return {
            id: img.id,
            mediaId: img.mediaId,
            url: proxyUrl,
            name: img.name,
            status: img.status
          }
        })
      
      if (newArticleImages.length > 0) {
        console.log('[Step3] 新文章保存图片:', newArticleImages.length, '张')
        await fetch(`/api/articles/${data.id}/images`, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ images: newArticleImages })
        })
      }
      
      toast.success('文章已创建并保存！')
    }
    
    return true // 返回成功状态
  } catch (error: unknown) {
    console.error('保存失败:', error)
    const message = error instanceof Error ? error.message : String(error)
    toast.error('保存失败: ' + message)
    return false
  } finally {
    isSaving.value = false
  }
}

// 协作分享链接生成
const copyShareLink = async () => {
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
    try {
      await navigator.clipboard.writeText(shareUrl)
      toast.success('协作链接已复制到剪贴板！发送给他人即可同步编辑。', 5000)
    } catch (copyErr) {
      // 备选方案：通过弹窗显示
      console.warn('剪贴板 API 失败，尝试备选方案', copyErr)
      alert(`协作链接（请手动复制）:\n${shareUrl}`)
    }
    
  } catch (err: unknown) {
    console.error('[Step3] 分享失败:', err)
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
