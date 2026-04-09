<template>
  <!-- 全屏容器：相对于 App.vue 的 flex-1 区域 -->
  <div class="relative flex-1 flex overflow-hidden">
    <!-- 移动端侧边栏切换按钮 -->
    <button
      @click="showMobileSidebar = !showMobileSidebar"
      style="position:fixed; right:16px; bottom:128px; z-index:50; background:var(--color-accent-primary); color:var(--color-text-inverse); padding:12px; border-radius:50%; box-shadow:var(--shadow-float); border:none; cursor:pointer; transition:all 150ms;"
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
        <div class="flex-shrink-0 w-full p-2 md:p-3" style="background:var(--color-bg-card); border-bottom:var(--border-whisper);">
          <div class="flex items-center justify-between gap-2">
            <div class="flex items-center gap-2 min-w-0 flex-1">
              <span class="text-[10px] px-2.5 py-1 rounded-full font-medium" style="background: var(--color-accent-soft); color: var(--color-accent-primary);">3 / 3</span>
              <h2 class="text-sm md:text-base font-bold truncate" style="color:rgba(0,0,0,0.9); letter-spacing:-0.2px;">预览</h2>
              <span
                style="font-size:10px; padding:2px 7px; border-radius:9999px; font-weight:600; white-space:nowrap;"
                :style="{
                  background: configStore.mode === 'daily' ? '#fff7ed' : configStore.mode === 'three_rural' ? '#f0fdf4' : '#faf5ff',
                  color: configStore.mode === 'daily' ? '#c2410c' : configStore.mode === 'three_rural' ? '#15803d' : '#7e22ce'
                }"
              >{{ configStore.mode === 'daily' ? '日常' : configStore.mode === 'three_rural' ? '三下乡' : '转载' }}</span>
            </div>

            <div class="flex items-center gap-1.5">
              <!-- Preview/Code toggle -->
              <div class="flex p-0.5 rounded" style="background:rgba(0,0,0,0.05);">
                <button
                  @click="activeTab = 'preview'"
                  class="px-2 md:px-3 py-1 text-[10px] md:text-xs font-semibold rounded transition-all"
                  :style="activeTab === 'preview' ? 'background:var(--color-bg-card); color:var(--color-accent-primary); box-shadow:var(--shadow-content-card);' : 'background:transparent; color:rgba(0,0,0,0.5);'"
                >预览</button>
                <button
                  @click="activeTab = 'code'"
                  class="px-2 md:px-3 py-1 text-[10px] md:text-xs font-semibold rounded transition-all"
                  :style="activeTab === 'code' ? 'background:var(--color-bg-card); color:var(--color-accent-primary); box-shadow:var(--shadow-content-card);' : 'background:transparent; color:rgba(0,0,0,0.5);'"
                >代码</button>
              </div>

              <!-- Copy button -->
              <button
                @click="copyHtml"
                class="flex items-center gap-1 text-[10px] md:text-xs font-semibold h-7 px-2 md:px-3 transition-all"
                style="background:rgba(0,0,0,0.06); border:none; border-radius:var(--radius-xs); color:rgba(0,0,0,0.7); cursor:pointer;"
                onmouseover="this.style.background='rgba(0,0,0,0.1)'"
                onmouseout="this.style.background='rgba(0,0,0,0.06)'"
              >
                <svg class="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                <span class="hidden sm:inline">{{ copyButtonText.replace('HTML代码', '') || '复制' }}</span>
              </button>

              <!-- Share button -->
              <button
                @click="copyShareLink"
                :disabled="isSharing"
                class="hidden sm:flex items-center gap-1 h-7 px-2 text-[10px] font-semibold transition-all"
                :style="isSharing ? 'background:var(--color-bg-card); border:1px solid rgba(0,0,0,0.12); border-radius:var(--radius-xs); color:rgba(0,0,0,0.35); cursor:not-allowed; opacity:0.6;' : 'background:var(--color-bg-card); border:1px solid rgba(0,0,0,0.12); border-radius:var(--radius-xs); color:rgba(0,0,0,0.65); cursor:pointer;'"
                onmouseover="if(!this.disabled){this.style.background='rgba(0,0,0,0.04)'}"
                onmouseout="if(!this.disabled){this.style.background='var(--color-bg-card)'}"
                title="分享"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>
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
        <div class="flex-1 flex flex-col relative overflow-hidden pb-16 md:pb-0" style="background:var(--color-bg-warm);">
          <!-- 预览模式: 手机框居中，两侧留空 -->
          <div v-show="activeTab === 'preview'" class="flex-1 flex justify-center items-stretch overflow-hidden p-0 md:p-4" style="background:var(--color-bg-warm);">
            <div class="w-full md:w-[390px] h-full flex flex-col overflow-hidden shrink-0 bg-white md:rounded-2xl border-x md:border" style="box-shadow:var(--shadow-content-card); border-color:rgba(0,0,0,0.08);">
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
                <div class="h-11 flex items-center justify-between px-4 border-b shrink-0" style="background:var(--color-bg-warm); border-color:rgba(0,0,0,0.12);">
                  <div class="flex items-center font-medium text-[16px]" style="color:rgba(0,0,0,0.75);"><span class="mr-1 text-2xl leading-none" style="margin-top: -2px;">‹</span> 公众号</div>
                  <div class="font-semibold text-[16px] tracking-wide truncate max-w-[150px]" style="color:rgba(0,0,0,0.75);">{{ draftForm.title || '文章预览' }}</div>
                  <div class="w-12 flex justify-end">
                     <div class="w-8 h-6 bg-white border rounded-full flex justify-center items-center space-x-0.5" style="border-color:rgba(0,0,0,0.12);">
                        <div class="w-0.5 h-0.5 bg-black rounded-full"></div>
                        <div class="w-1 h-0.5 bg-black rounded-full"></div>
                        <div class="w-0.5 h-0.5 bg-black rounded-full"></div>
                     </div>
                  </div>
                </div>
              </template>
              <div v-else class="h-10 border-b flex items-center justify-center text-[10px] font-bold tracking-widest shrink-0 uppercase" style="background:var(--color-bg-warm); color:var(--color-text-muted);">WeChat Article Preview</div>
              <!-- iframe 内容区 - 自动填充剩余高度 -->
              <div class="flex-1 bg-white relative overflow-hidden">
                <iframe ref="previewFrame" :srcdoc="previewHtml" class="w-full h-full border-0 absolute inset-0" title="版式预览" @load="setupIframeClickHandler"></iframe>
              </div>
              
              <!-- 底部操作栏 - desktop only inside frame -->
              <div class="hidden md:block flex-shrink-0 bg-white border-t px-4 py-3" style="border-color:rgba(0,0,0,0.08);">
                <div class="flex items-center justify-between gap-4">
                  <button
                    @click="goToPreviousStep"
                    class="flex-1 h-11 flex items-center justify-center gap-1 text-sm font-medium transition-all"
                    style="background:var(--color-bg-card); border:1px solid rgba(0,0,0,0.15); border-radius:var(--radius-sm); color:rgba(0,0,0,0.75);"
                    onmouseover="this.style.background='rgba(0,0,0,0.04)'"
                    onmouseout="this.style.background='var(--color-bg-card)'"
                  >
                    <span>←</span>
                    <span>上一步</span>
                  </button>
                  <button
                    @click="openDraftModal"
                    :disabled="isSaving"
                    class="flex-[2] h-11 flex items-center justify-center gap-2 text-sm font-bold transition-all"
                    :style="isSaving ? 'background:var(--color-accent-primary); opacity:0.6; color:var(--color-text-inverse); border:none; border-radius:var(--radius-sm); cursor:not-allowed;' : 'background:var(--color-accent-primary); color:var(--color-text-inverse); border:none; border-radius:var(--radius-sm); cursor:pointer;'"
                    onmouseover="if(!this.disabled){this.style.background='var(--color-accent-hover)'}"
                    onmouseout="if(!this.disabled){this.style.background='var(--color-accent-primary)'}"
                  >
                    <span>{{ isSaving ? '保存中...' : '创建微信草稿' }}</span>
                    <span v-if="!isSaving">→</span>
                  </button>
                </div>
              </div>
              
              <!-- 底部指示条（仅真机模式） -->
              <div v-if="showMobileFrame" class="h-6 w-full flex justify-center items-end pb-1.5 shrink-0 bg-white">
                <div class="w-32 h-1 rounded-full" style="background:rgba(0,0,0,0.15);"></div>
              </div>
            </div>
          </div>

          <!-- 代码预览 -->
          <div v-show="activeTab === 'code'" class="flex-1 overflow-y-auto p-6 md:p-8 pb-24" style="background:var(--color-bg-warm);">
            <div class="max-w-4xl mx-auto">
              <div class="text-[10px] font-bold mb-3 tracking-widest uppercase" style="color:var(--color-text-muted);">HTML Output Source</div>
              <div class="rounded-2xl p-6 md:p-8 font-mono text-xs md:text-sm break-all leading-relaxed select-all" style="background:#1e1e2e; color:rgba(255,255,255,0.85); border:1px solid rgba(0,0,0,0.1); box-shadow:var(--shadow-content-card);">{{ finalHtml }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Mobile fixed bottom bar - outside phone frame -->
      <div class="md:hidden fixed bottom-0 left-0 right-0 z-40 px-4 py-3 safe-area-bottom" style="background:var(--color-bg-card); border-top:1px solid rgba(0,0,0,0.08);">
        <div class="flex items-center gap-2">
          <button
            @click="goToPreviousStep"
            class="flex-1 h-10 flex items-center justify-center gap-1 text-sm font-medium"
            style="background:var(--color-bg-card); border:1px solid rgba(0,0,0,0.15); border-radius:var(--radius-sm); color:rgba(0,0,0,0.75); cursor:pointer;"
          >
            <span>← 上一步</span>
          </button>
          <button
            @click="copyShareLink"
            :disabled="isSharing"
            class="h-10 px-3 flex items-center justify-center text-sm font-medium"
            :style="isSharing ? 'background:var(--color-bg-card); border:1px solid rgba(0,0,0,0.15); border-radius:var(--radius-sm); color:rgba(0,0,0,0.35); cursor:not-allowed; opacity:0.6;' : 'background:var(--color-bg-card); border:1px solid rgba(0,0,0,0.15); border-radius:var(--radius-sm); color:rgba(0,0,0,0.65); cursor:pointer;'"
          >
            {{ isSharing ? '分享中...' : '分享' }}
          </button>
          <button
            @click="openDraftModal"
            :disabled="isSaving"
            class="flex-[2] h-10 flex items-center justify-center gap-1 text-sm font-semibold"
            :style="isSaving ? 'background:var(--color-accent-primary); opacity:0.6; color:var(--color-text-inverse); border:none; border-radius:var(--radius-sm); cursor:not-allowed;' : 'background:var(--color-accent-primary); color:var(--color-text-inverse); border:none; border-radius:var(--radius-sm); cursor:pointer;'"
          >
            {{ isSaving ? '保存中...' : '创建草稿 →' }}
          </button>
        </div>
      </div>
    </template>

    <template v-else>
      <div class="flex-1 flex flex-col items-center justify-center p-8 text-center h-full" style="background:var(--color-bg-warm);">
        <div v-if="isGenerating">
          <div class="inline-block animate-spin rounded-full h-10 w-10 mb-4" style="border:4px solid var(--color-accent-focus, rgba(0,117,222,0.15)); border-top-color:var(--color-accent-primary);"></div>
          <p class="font-medium" style="color:rgba(0,0,0,0.55);">正在生成版式，请稍候...</p>
        </div>
        <div v-else-if="errorMessage" class="max-w-md mx-auto">
          <div class="text-red-400 text-4xl mb-4">⚠️</div>
          <h3 class="text-red-600 font-bold text-lg mb-2">生成失败</h3>
          <p class="mb-6" style="color:rgba(0,0,0,0.55);">{{ errorMessage }}</p>
          <div class="flex gap-3 justify-center">
            <button @click="regenerate" class="px-6 py-2 rounded-lg font-medium shadow-md" style="background:var(--color-accent-primary); color:var(--color-text-inverse);">重试</button>
            <button @click="goToPreviousStep" class="px-6 py-2 bg-white border text-black rounded-lg font-medium" style="border-color:rgba(0,0,0,0.12);">返回编辑</button>
          </div>
        </div>
        <div v-else>
          <div class="text-5xl mb-4" style="color:rgba(0,0,0,0.25);">📄</div>
          <p class="mb-6" style="color:rgba(0,0,0,0.45);">暂无可预览的内容</p>
          <button @click="goToPreviousStep" class="px-8 py-2 rounded-lg font-bold shadow-lg" style="background:var(--color-accent-primary); color:var(--color-text-inverse);">去编辑内容</button>
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
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { showAlert } from '@/composables/useConfirm'
import { useAppStore } from '../stores/appStore'
import { useConfigStore } from '../stores/configStore'
import { buildHtml } from '../utils/styleAssembler'
import { createDraft, uploadImage, getWechatProxyUrl, restoreWechatUrl } from '../utils/wechatApi'
import { copyToClipboard, copyRichText } from '../utils/clipboard'
import ImageReplacer from '../components/ImageReplacer.vue'
import QuickImageStrip from '../components/QuickImageStrip.vue'
import CreateDraftFormModal from '../components/CreateDraftFormModal.vue'
import { articleApi } from '../utils/api'
import toast from '../composables/useToast'
import DOMPurify from 'dompurify'
import type { DraftArticle, WechatImage, WechatUploadResponse } from '@/types'
import { tokenStorage } from '../utils/tokenStorage'
import { useArticleSaver } from '../composables/useArticleSaver'

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

// 监听元数据变化，实时更新预览（防抖 400ms，避免快速输入时频繁重生成）
let regenerateTimer: ReturnType<typeof setTimeout> | null = null
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
    if (regenerateTimer) clearTimeout(regenerateTimer)
    regenerateTimer = setTimeout(() => { regenerate() }, 400)
  },
  { deep: true }
)
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
const { isSaving, saveDraft } = useArticleSaver(appStore, configStore, tokenStorage, toast)
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
// On actual mobile, disable phone frame simulation - user IS on a phone
if (typeof window !== 'undefined' && window.innerWidth < 768) {
  showMobileFrame.value = false
}
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
    console.warn('[Step3] 请先选择右侧预览中的占位符')
    return
  }
  
  // 使用本地预览 URL 进行预览显示
  const previewUrl = image.localPreviewUrl || image.proxyUrl || getWechatProxyUrl(image.url)
  const wechatUrl = restoreWechatUrl(image.url || image.proxyUrl || previewUrl)
  
  // 记录替换（保存微信 URL 用于最终输出，本地 URL 用于预览）
  imageReplacements.value[placeholderId] = {
    previewUrl: previewUrl,
    wechatUrl: wechatUrl
  }
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
      appStore.setWechatImages([])
      isGenerating.value = true // 重置加载状态
    }
  }
)

// 自动保存图片逻辑 (增加 loading 检查，防止初始加载时覆盖为空)
watch(wechatImages, async (newImages) => {
  if (isGenerating.value) {
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

  try {
    await articleApi.updateStep3(articleId, persistentImages)
  } catch (e) {
    console.error('保存图片失败', e)
    toast.error('保存失败，请稍后重试')
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

  } catch (e) {
    console.warn('[Step3] DOM 更新失败:', e)
    // 如果 DOM 操作失败，回退到整体刷新 HTML
    updatePreviewHtmlRef()
  }
}

const goToPreviousStep = () => {
  appStore.currentStep = 2
  router.push('/step2')
}



const updatePreviewHtmlRef = () => {
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

  // 🚀 关键逻辑：如果是通过 URL 直接访问已保存的文章，需要从后端加载
  // 此时应该先重置状态，防止残留数据污染
  if (articleId) {
    // 只有在有 articleId 时才重置状态
    appStore.resetApp()
    
    try {
      isGenerating.value = true

      const res = await articleApi.getArticleById(articleId)
      const article = res.data

      if (article) {
        appStore.setCurrentArticleId(article.id)
        draftForm.value.title = article.title

        if (article.config) {
          appStore.setStyleConfig(article.config)
          
          // 恢复元数据
          if (article.config.metadata) {
            const meta = article.config.metadata
            if (meta.editorInput !== undefined) appStore.editorInput = meta.editorInput
            if (meta.teamName !== undefined) appStore.teamName = meta.teamName
            if (meta.sourceAccount !== undefined) appStore.sourceAccount = meta.sourceAccount
            if (meta.copywriterNames) appStore.copywriterNames = meta.copywriterNames
            if (meta.plannerNames) appStore.plannerNames = meta.plannerNames
            if (meta.editorNames) appStore.editorNames = meta.editorNames
          }
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

        appStore.setWechatImages(validImages)
      }
    } catch (e) {
      console.error('[Step3] 加载文章失败:', e)
      errorMessage.value = '加载文章数据失败'
    } finally {
      isGenerating.value = false
    }
  }

  // 改进：如果没有任何内容块，说明是空跳转，应该回到第一步而不是第二步
  if (contentBlocks.value.length === 0) {
    console.warn('[Step3] 无内容块，重定向到第一步')
    router.push('/step1')
    return
  }

  const styleConfig = appStore.styleConfig
  const hasTitleStyle = styleConfig?.title && styleConfig.title.fullExample
  const hasBodyStyle = styleConfig?.body && styleConfig.body.fullExample
  const hasIntroStyle = styleConfig?.intro && styleConfig.intro.fullExample

  if (!hasTitleStyle && !hasBodyStyle && !hasIntroStyle) {
    console.warn('[Step3] 无样式配置，重定向到样式选择')
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

    placeholderImages.forEach((img) => {
      img.style.cursor = 'pointer'
      
      // 防止重复绑定（简单判断）
      if (img.dataset.hasClick) return
      img.dataset.hasClick = 'true'
      
      img.addEventListener('mouseenter', () => {
        if (selectedPlaceholder.value !== img.dataset.placeholder) {
          img.style.outline = '2px dashed rgba(0,117,222,0.3)'
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
        img.style.outline = '3px solid var(--color-accent-primary)'
        img.style.outlineOffset = '2px'
        img.style.boxShadow = '0 0 15px rgba(59, 130, 246, 0.4)'
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
        editableFooter.style.outline = '2px solid var(--color-accent-primary)'
      })
      
      // blur 时保存并移除高亮
      editableFooter.addEventListener('blur', () => {
        editableFooter.style.outline = '1px dashed transparent'
        // 将编辑后的 footer 内容同步回 store
        const newFooterHtml = editableFooter.innerHTML
        configStore.setFooter(newFooterHtml)
      })
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

// 复制HTML代码（使用微信 URL）— 富文本复制，可直接粘贴到微信编辑器
const copyHtml = async () => {
  const htmlToCopy = getOutputHtml()

  // Try rich text copy first (text/html), fall back to plain text
  const result = await copyRichText(htmlToCopy)
  if (result.ok) {
    showCopySuccess()
  } else {
    // Last resort: plain text copy
    const textResult = await copyToClipboard(htmlToCopy)
    if (textResult.ok) {
      showCopySuccess()
    } else {
      console.error('Copy failed:', result.error)
      await showAlert('复制失败，请手动选择代码进行复制')
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
    const result = await copyToClipboard(shareUrl)
    if (result.ok) {
      toast.success('协作链接已复制到剪贴板！发送给他人即可同步编辑。', 5000)
    } else {
      console.warn('剪贴板 API 失败，尝试备选方案', result.error)
      await showAlert(shareUrl, '协作链接')
    }
    
  } catch (err: unknown) {
    console.error('[Step3] 分享失败:', err)
    const message = err instanceof Error ? err.message : '未知错误'
    toast.error('共享生成失败: ' + message)
  } finally {
    isSharing.value = false
  }
}

// Cleanup timers on unmount
onBeforeUnmount(() => {
  if (regenerateTimer) {
    clearTimeout(regenerateTimer)
    regenerateTimer = null
  }
})

</script>

<style scoped>
/* 组件特定的样式 */
</style>
