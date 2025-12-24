<template>
  <div class="h-screen w-full flex flex-col overflow-hidden fixed inset-0">
    <!-- 精简头部 - 绝对固定 -->
    <div class="flex-shrink-0 w-full bg-white border-b p-3 md:p-4">
      <div class="flex flex-col md:flex-row md:justify-between md:items-center space-y-2 md:space-y-0">
        <div class="flex-1 min-w-0">
          <h2 class="text-lg md:text-xl font-bold text-gray-900 truncate">步骤 3/3: 生成预览</h2>
          <p class="text-xs md:text-sm text-gray-600 mt-0.5 md:mt-1 truncate">
            {{ hasWechatImages ? '点击预览中的占位符图片，再点击下方图片替换' : '预览最终效果，并复制HTML代码' }}
          </p>
        </div>
        <!-- 快速操作按钮 -->
        <div class="flex flex-wrap gap-1 md:gap-2 justify-end">
          <!-- 移动端：只显示图标 -->

          <button
            @click="activeTab = 'preview'"
            :class="[
              'px-2 md:px-3 py-1.5 text-xs md:text-sm rounded-md transition-colors flex-shrink-0',
              activeTab === 'preview'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]"
          >
            预览
          </button>
          <button
            @click="activeTab = 'code'"
            :class="[
              'px-2 md:px-3 py-1.5 text-xs md:text-sm rounded-md transition-colors flex-shrink-0',
              activeTab === 'code'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]"
          >
            代码
          </button>
          
          <!-- 真机预览开关 (仅在预览Tab显示) -->
          <button
            v-if="activeTab === 'preview'"
            @click="showMobileFrame = !showMobileFrame"
            :class="[
              'px-2 md:px-3 py-1.5 text-xs md:text-sm rounded-md transition-colors flex items-center space-x-1 flex-shrink-0',
              showMobileFrame
                ? 'bg-gray-800 text-white shadow-md'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            ]"
            title="切换真机外壳预览"
          >
            <span>📱</span>
            <span class="hidden md:inline">{{ showMobileFrame ? '关闭真机' : '真机预览' }}</span>
          </button>

          <button
            @click="copyHtml"
            class="md:px-3 px-2 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs md:text-sm rounded-md transition-colors flex items-center space-x-1 flex-shrink-0"
          >
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
            </svg>
            <span class="hidden md:inline">{{ copyButtonText }}</span>
            <span class="md:hidden">复制</span>
          </button>
        </div>
      </div>
    </div>

    <!-- 内容滚动区域 - 绝对固定高度，不滚动 -->
    <div class="flex-1 overflow-hidden">
      <!-- 生成状态 -->
      <div v-if="isGenerating" class="h-full flex items-center justify-center">
        <div class="text-center">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p class="mt-4 text-gray-600">正在生成版式...</p>
        </div>
      </div>

      <!-- V3: 响应式内容区域 -->
      <!-- 移动端：顶部横向图片选择器（固定高度）+ 下方预览区（占据剩余空间） -->
      <!-- 桌面端：左侧图片列表 + 右侧预览区 -->
      <div v-else-if="finalHtml && !errorMessage" class="h-full overflow-hidden flex flex-col md:flex-row">
        <!-- 使用新的 ImageReplacer 组件 -->
        <ImageReplacer
          :wechat-images="wechatImages"
          :selected-placeholder="selectedPlaceholder"
          @select="handleImageSelect"
        />



        <!-- 主内容区：预览与代码 -->
        <div class="flex-1 flex flex-row md:h-full">
          <!-- 预览与代码区 -->
          <div class="flex-1 h-full overflow-y-auto">
            <!-- 预览模式 -->
            <div v-if="activeTab === 'preview'" class="min-h-full bg-gray-100 md:bg-gray-200 flex justify-center p-2 md:py-4 overflow-y-auto">
              <!-- 模式 A: 沉浸式真机外壳 -->
              <div v-if="showMobileFrame" class="relative w-[375px] h-[812px] bg-black rounded-[50px] shadow-2xl border-[8px] border-gray-900 flex flex-col overflow-hidden shrink-0 transform scale-90 sm:scale-100 origin-top">
                <!-- 顶部刘海/状态栏 -->
                <div class="absolute top-0 w-full h-11 bg-black z-20 flex justify-between px-6 items-center pointer-events-none">
                    <div class="w-12 h-full flex items-center text-white text-[10px] font-medium pl-2">9:41</div>
                     <!-- 灵动岛区域 -->
                    <div class="w-[120px] h-[34px] bg-black rounded-3xl absolute left-1/2 -translate-x-1/2 top-2"></div>
                    <div class="w-16 flex space-x-1.5 justify-end items-center pr-2">
                       <svg class="w-4 h-3 text-white" viewBox="0 0 18 12" fill="currentColor"><path d="M1 9.5C1 10.3284 1.67157 11 2.5 11H13.5C14.3284 11 15 10.3284 15 9.5V2.5C15 1.67157 14.3284 1 13.5 1H2.5C1.67157 1 1 1.67157 1 2.5V9.5Z" stroke="white"/><path d="M16.5 4V8" stroke="white" stroke-linecap="round"/></svg>
                    </div>
                </div>

                <!-- 模拟微信顶部栏 -->
                <div class="mt-11 h-11 bg-[#ededed] flex items-center justify-between px-4 border-b border-gray-300 z-10 shrink-0 select-none">
                    <div class="flex items-center text-gray-800 font-medium text-[16px]">
                        <span class="mr-1 text-2xl leading-none" style="margin-top: -2px;">‹</span> 公众号
                    </div>
                    <div class="text-gray-800 font-semibold text-[16px] tracking-wide">
                        {{ draftForm.title || '文章预览' }}
                    </div>
                    <div class="w-12 flex justify-end">
                        <div class="w-8 h-6 bg-white border border-gray-300 rounded-full flex justify-center items-center space-x-0.5">
                             <div class="w-0.5 h-0.5 bg-black rounded-full"></div>
                             <div class="w-1 h-0.5 bg-black rounded-full"></div>
                             <div class="w-0.5 h-0.5 bg-black rounded-full"></div>
                        </div>
                    </div>
                </div>

                <!-- iframe 容器 -->
                <div class="flex-1 bg-white relative overflow-hidden">
                   <iframe
                    ref="previewFrame"
                    :srcdoc="previewHtml"
                    class="w-full h-full border-0"
                    title="版式预览"
                    @load="setupIframeClickHandler"
                  ></iframe>
                </div>

                <!-- 底部 Home Indicator (覆盖在iframe之上但允许点击穿透或者位于底部区域) -->
                <div class="h-8 bg-white w-full flex justify-center items-end pb-2 shrink-0 z-10 pointer-events-none">
                    <div class="w-36 h-1 bg-gray-800 rounded-full opacity-20"></div>
                </div>
              </div>

              <!-- 模式 B: 默认简洁框 (适合快速编辑) -->
              <div v-else class="w-full md:w-[375px] max-w-md md:max-w-none bg-white shadow md:shadow-lg rounded md:rounded-lg flex-shrink-0 h-[calc(100vh-200px)] flex flex-col">
                 <!-- 简单的顶部示意 -->
                 <div class="h-8 bg-gray-50 border-b flex items-center justify-center text-xs text-gray-400 rounded-t-lg">
                    预览视图
                 </div>
                 <div class="flex-1 overflow-hidden relative">
                    <iframe
                      ref="previewFrame"
                      :srcdoc="previewHtml"
                      class="w-full h-full border-0 absolute inset-0"
                      title="版式预览"
                      @load="setupIframeClickHandler"
                    ></iframe>
                 </div>
              </div>
            </div>

            <!-- 代码模式 -->
            <div v-else class="min-h-full p-3 md:p-4">
              <div class="flex justify-between items-center mb-2">
                <div class="text-xs md:text-sm text-gray-600">HTML代码 ({{ finalHtml.length }} 字符)</div>
              </div>
              <div class="bg-gray-900 text-gray-100 rounded md:rounded-lg p-3 md:p-4">
                <pre class="text-xs md:text-sm font-mono whitespace-pre-wrap">{{ finalHtml }}</pre>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 错误状态 -->
      <div v-else-if="errorMessage" class="h-full flex items-center justify-center">
        <div class="text-center">
          <div class="text-red-400 text-lg mb-4">⚠️</div>
          <div class="text-red-600 font-medium mb-2">生成失败</div>
          <div class="text-gray-600">{{ errorMessage }}</div>
          <div class="mt-4 space-x-2">
            <button
              @click="regenerate"
              class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
            >
              重新生成
            </button>
            <button
              @click="goToPreviousStep"
              class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-lg transition-colors"
            >
              返回上一步
            </button>
          </div>
        </div>
      </div>

      <!-- 无内容的情况 -->
      <div v-else class="h-full flex items-center justify-center">
        <div class="text-center">
          <div class="text-gray-400 text-lg mb-2">没有可预览的内容</div>
          <button
            @click="goToPreviousStep"
            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors mt-4"
          >
            返回上一步
          </button>
        </div>
      </div>
    </div>

    <!-- 底部操作栏 - 固定不动 -->
    <div v-if="finalHtml && !errorMessage" class="flex-shrink-0 flex flex-wrap gap-2 justify-between items-center p-4 border-t bg-white z-10 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
      <div class="flex items-center space-x-2">
        <button
          @click="goToPreviousStep"
          class="px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-lg transition-colors"
        >
          ← 上一步
        </button>
        <button
          @click="startNew"
          class="px-4 py-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 text-sm font-medium rounded-lg transition-colors"
          title="清空当前内容重新开始"
        >
          重新开始
        </button>
      </div>

      <!-- 中间：保存草稿按钮 -->
      <div class="flex items-center">
        <button
          @click="saveDraftAndGoHome"
          :disabled="isSaving"
          class="px-6 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors shadow-md flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg v-if="!isSaving" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path>
          </svg>
          <div v-else class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          <span>{{ isSaving ? '保存中...' : '💾 保存并返回首页' }}</span>
        </button>
      </div>

      <div class="flex gap-3">
        <button
          @click="regenerate"
          class="px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-lg transition-colors"
          :disabled="isGenerating"
        >
          <span v-if="isGenerating">生成中...</span>
          <span v-else>↻ 重新生成</span>
        </button>

        <!-- Primary Action -->
        <button
          @click="openDraftModal"
          class="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold rounded-lg transition-all shadow-md hover:shadow-lg flex items-center space-x-2 transform hover:-translate-y-0.5"
        >
          <span>🚀 创建微信草稿</span>
        </button>
      </div>
    </div>

    <!-- 如果没有finalHtml，显示一个空的底部占位符保持布局 -->
    <div v-else-if="contentBlocks.length > 0" class="flex-shrink-0 p-4 border-t bg-white"></div>



    <!-- 创建草稿弹窗组件 -->
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

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAppStore } from '../stores/appStore'
import { useConfigStore } from '../stores/configStore'
import { buildHtml } from '../utils/styleAssembler'
import { createDraft, uploadImage, getWechatProxyUrl } from '../utils/wechatApi'
import ImageReplacer from '../components/ImageReplacer.vue'
import CreateDraftFormModal from '../components/CreateDraftFormModal.vue'
import { getConfig } from '../config'
import { articleApi } from '../utils/api'
import toast from '../composables/useToast'
import DOMPurify from 'dompurify'

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
const previewFrame = ref(null)

// V2: 图片替换相关状态
const selectedPlaceholder = ref(null)

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
const imageReplacements = ref({})
const lastScrollTop = ref(0) // 记录 iframe 滚动位置

// V2: 草稿创建相关状态
const showDraftModal = ref(false)
const showMobileFrame = ref(false)
const isCreatingDraft = ref(false)
const isUploadingCover = ref(false)
const draftError = ref('')
const draftSuccess = ref('')
const aiImageProgress = ref('') // 新增：AI 图片上传进度提示
const isSaving = ref(false)
const draftForm = ref({
  title: '',
  coverImageId: '',
  author: '',
  digest: '',
  showCover: true
})

// V2: 从内容块中提取标题（第一行一定是大标题）
const extractTitleFromContent = () => {
  const blocks = contentBlocks.value
  // 直接取第一个内容块，不管是什么类型
  const firstBlock = blocks[0]
  if (firstBlock && firstBlock.text && firstBlock.text.trim()) {
    // 如果有多行，只取第一行
    const lines = firstBlock.text.split('\n').filter(line => line.trim())
    if (lines.length > 0) {
      return lines[0].trim()
    }
  }
  return ''
}

// V2: 打开草稿弹窗，自动填充标题
const openDraftModal = () => {
  // 重置表单
  draftForm.value = {
    title: extractTitleFromContent(), // 自动提取标题
    coverImageId: '',
    author: '',
    digest: '',
    showCover: true
  }
  draftError.value = ''
  draftSuccess.value = ''

  // 显示弹窗
  showDraftModal.value = true
}

// V2: 处理封面上传
const handleCoverUpload = async (file) => {
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
    const response = await uploadImage(file)
    
    // 2. 创建图片对象并添加到 Store
    const newImage = {
      id: `cover_${Date.now()}`,
      mediaId: response.media_id,
      url: response.url,
      localPreviewUrl: URL.createObjectURL(file), // 用于本地显示（虽然在select中不直接显示图片，但为了数据完整性）
      name: file.name,
      status: 'success',
      file: file
    }
    
    // 添加到 store
    appStore.addWechatImages([newImage])
    
    // 3. 自动选中
    draftForm.value.coverImageId = response.media_id
    
  } catch (error) {
    console.error('[Step3] 封面上传失败:', error)
    draftError.value = error.message || '封面上传失败，请重试'
  } finally {
    isUploadingCover.value = false
  }
}


// 计算属性
const contentBlocks = computed(() => appStore.contentBlocks)
const isMobile = computed(() => appStore.isMobile || window.innerWidth < 768)
const wechatImages = computed(() => appStore.wechatImages)
const hasWechatImages = computed(() => wechatImages.value.length > 0)
const successfulWechatImages = computed(() => 
  wechatImages.value.filter(img => img.status === 'success' && img.mediaId)
)

// V2: 处理微信图片选择 - 直接替换，无需确认
const handleImageSelect = (image) => {
  if (!selectedPlaceholder.value) {
    console.log('[Step3] 请先选择右侧预览中的占位符')
    return
  }
  
  // 使用本地预览 URL 进行预览显示
  const previewUrl = image.localPreviewUrl || image.url
  
  // 记录替换（保存微信 URL 用于最终输出，本地 URL 用于预览）
  imageReplacements.value[selectedPlaceholder.value] = {
    previewUrl: previewUrl,
    wechatUrl: image.url
  }
  console.log('[Step3] 直接替换:', selectedPlaceholder.value, '->', previewUrl)
  
  // 优化：直接修改 iframe 中的 DOM，避免 reload 导致的闪烁
  updateIframeImageDom(selectedPlaceholder.value, previewUrl)
  
  // 清除选择状态
  selectedPlaceholder.value = null
}

// 监听路由变化，切换文章时通过清空 store 防止图片串台
watch(
  () => route.params.id,
  (newId, oldId) => {
    // 只有当从一个文章切换到另一个文章时才清空 (避免 Step2 -> Step3 或 刷新页面时的误清空)
    if (newId && oldId && newId !== oldId) {
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
  
  if (!route.params.id) return

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
  const persistentImages = newImages.map(img => {
    // 再次检查，如果还是 blob，说明有问题，但为了不丢数据，我们暂时记录 log 并保留原样(虽然后端存 blob 没用)
    // 或者我们仍然保留它? 不，后端存 blob 会导致 dirty data. 
    // 上面的 hasPendingUpload 应该能拦截绝大多数情况。
    // 这里我们只保留正常的。
    if (img.url && img.url.startsWith('blob:') && !img.mediaId) return null
    
    return {
      id: img.id,
      mediaId: img.mediaId,
      url: img.url,
      name: img.name,
      status: img.status
    }
  }).filter(Boolean)

  if (persistentImages.length !== newImages.length) {
    // 如果数量不一致，说明有被过滤的图，这很不正常 (因为 Pending 的已经被拦截了)
    console.warn('[Step3] 警告：部分图片未通过持久化检查，将不被保存', newImages.length, '->', persistentImages.length)
  }

  console.log('[Step3] 自动保存图片到后端:', persistentImages.length)
  try {
    await articleApi.updateStep3(route.params.id, persistentImages)
  } catch (e) {
    console.error('保存图片失败', e)
  }
}, { deep: true })

// 同步 Modal 表单数据
const updateDraftForm = (newForm) => {
  draftForm.value = { ...newForm }
}

// 新增：直接更新 iframe DOM
const updateIframeImageDom = (placeholderId, newUrl) => {
  if (!previewFrame.value || !previewFrame.value.contentDocument) return
  
  try {
    const doc = previewFrame.value.contentDocument
    // 查找对应占位符的图片
    const imgs = doc.querySelectorAll(`img[data-placeholder="${placeholderId}"]`)
    
    imgs.forEach(img => {
      // 直接修改 src
      img.src = newUrl
      // 保持选中状态的样式清除（可选，因为 handleImageSelect 紧接着会清除 selectedPlaceholder）
      img.style.outline = 'none'
      img.style.boxShadow = 'none'
    })
    
    console.log('[Step3] DOM 更新完成，未刷新 iframe')
  } catch (e) {
    console.warn('[Step3] DOM 更新失败:', e)
    // 如果 DOM 更新失败，回退到全量更新
    updatePreviewHtmlRef()
  }
}// 修改：使用 DOMPurify 净化 HTML
const updatePreviewHtmlRef = () => {
  const html = getCurrentPreviewHtmlString()
  // 净化 HTML 以防注入，同时保留 data-placeholder 等自定义属性
  previewHtml.value = DOMPurify.sanitize(html, {
    ADD_ATTR: ['data-placeholder', 'data-role', 'label', 'data-tplid', 'data-tools', 'data-id', 'data-cropselx1', 'data-cropselx2', 'data-cropsely1', 'data-cropsely2', 'data-imgfileid', 'data-ratio', 'data-w', 'data-s', 'data-type', 'type'],
    ADD_TAGS: ['section', 'mp-style-type']
  })
}

// 初始化加载文章数据
// 初始化加载文章数据
onMounted(async () => {
  // 基础校验
  if (contentBlocks.value.length === 0) {
    router.push('/step2')
    return
  }

  const styleConfig = appStore.styleConfig
  const hasTitleStyle = styleConfig?.title && styleConfig.title.fullExample
  const hasBodyStyle = styleConfig?.body && styleConfig.body.fullExample
  const hasIntroStyle = styleConfig?.intro && styleConfig.intro.fullExample

  if (!hasTitleStyle && !hasBodyStyle && !hasIntroStyle) {
    alert('请先配置装饰样式后再进入预览阶段！')
    router.push('/style-config')
    return
  }

  if (route.params.id) {
    try {
      isGenerating.value = true
      
      const res = await articleApi.getArticleById(route.params.id)
      const article = res.data
      
      if (article) {
        // 设置标题
        draftForm.value.title = article.title
        
        // 🚀 V3: 并行同步参与者姓名到 Store，无需额外请求
        appStore.plannerNames = article.plannerNames || []
        appStore.copywriterNames = article.copywriterNames || []
        appStore.editorNames = article.editorNames || []
        console.log('[Step3] 已同步参与者姓名')

        // 如果后端有保存的图片，同步到 store
        // 🛡️ 关键修复：无论后端返回什么，都替换 Store（包括空列表），防止旧图片残留
        console.log('[Step3] 后端返回的原始图片数据:', JSON.stringify(article.images))
        const backendImages = article.images || []
        const validImages = backendImages.map(img => {
           // 如果 url 是 blob 开头，说明是旧数据，尝试用 media_id 或 proxy 恢复，或者标记为失效
           if (img.url && img.url.startsWith('blob:')) {
             return null 
           }
           return img
        }).filter(Boolean)
        
        console.log('[Step3] 从后端加载文章图片:', validImages.length, '张 (已过滤 blob)')
        appStore.setWechatImages(validImages) // 💡 始终设置，即使为空也清空旧数据
        
        // 生成初始 HTML
        regenerate()
      }
    } catch (e) {
      console.error('[Step3] 加载文章失败:', e)
      errorMessage.value = '加载文章详情失败'
    } finally {
      isGenerating.value = false
    }
  } else {
    // 无 ID 模式，直接从 store 生成
    regenerate()
  }
})

// V2: 设置 iframe 点击处理器
const setupIframeClickHandler = () => {
  if (!previewFrame.value) return
  
  try {
    const iframeWindow = previewFrame.value.contentWindow
    const iframeDoc = previewFrame.value.contentDocument || iframeWindow.document

    // V2: 恢复滚动条位置
    if (lastScrollTop.value > 0) {
      iframeWindow.scrollTo(0, lastScrollTop.value)
      // console.log('[Step3] 恢复滚动条位置:', lastScrollTop.value)
    }
    
    // 查找所有占位符图片并添加点击事件
    const placeholderImages = iframeDoc.querySelectorAll('img[data-placeholder]')
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
    const outers = iframeDoc.querySelectorAll('.article135[data-role="outer"]')
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
         
         footer.addEventListener('blur', () => {
            configStore.setFooter(footer.outerHTML)
            console.log('[Step3] Footer 更新已保存')
         })
         
         // 聚焦时高亮
         footer.addEventListener('focus', () => {
            footer.style.outline = '2px solid #3b82f6'
         })
         footer.addEventListener('blur', () => {
             footer.style.outline = '1px dashed #ddd'
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
  for (const [placeholderId, urls] of Object.entries(imageReplacements.value)) {
    const imageUrl = urls.previewUrl
    const imgTagRegex = new RegExp(`<img([^>]*data-placeholder="${placeholderId}"[^>]*)>`, 'g')
    html = html.replace(imgTagRegex, (match, attributes) => {
      const newAttributes = attributes.replace(/src="[^"]*"/, `src="${imageUrl}"`)
      return `<img${newAttributes}>`
    })
  }
  return html
}

// 废弃原 updatePreviewHtml，保留兼容性命名或直接移除引用
const updatePreviewHtml = updatePreviewHtmlRef

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
  } catch (error) {
    console.error('[Step3] 生成HTML失败:', error)
    errorMessage.value = error.message || '生成HTML时发生未知错误'
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
  for (const [placeholderId, urls] of Object.entries(imageReplacements.value)) {
    const imageUrl = urls.wechatUrl || urls.previewUrl
    const imgTagRegex = new RegExp(`<img([^>]*data-placeholder="${placeholderId}"[^>]*)>`, 'g')
    html = html.replace(imgTagRegex, (match, attributes) => {
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



// V2: 生成草稿编辑链接（用于预览）
const generateDraftEditLink = (draftId) => {
  // 微信公众号后台草稿编辑页面的基本URL
  // 注意：实际访问时需要在微信浏览器或已登录环境下
  return `https://mp.weixin.qq.com/cgi-bin/appmsg?t=media/appmsg_edit&action=edit&type=10&appmsgid=${draftId}&lang=zh_CN`
}



// V2: 提交草稿
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
    const externalImages = []
    
    let match = null
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
            return await uploadImage(file)
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

      } catch (uploadError) {
        console.error('[Step3] AI图片批量处理失败:', uploadError)
        throw new Error(`AI图片处理失败: ${uploadError.message}`)
      }
    }
    // ========== 处理完毕 ==========

    // 构建文章对象
    const article = {
      title: draftForm.value.title,
      thumb_media_id: draftForm.value.coverImageId,
      author: draftForm.value.author,
      digest: draftForm.value.digest,
      show_cover_pic: draftForm.value.showCover ? 1 : 0,
      content: content,
      need_open_comment: 1, // 默认开启留言
      only_fans_can_comment: 0
    }

    // 调用 API 创建草稿
    const result = await createDraft(article)

    // 成功处理
    const draftId = result.draft_id || result.media_id
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

  } catch (error) {
    console.error('[Step3] 创建草稿失败:', error)
    draftError.value = error.message || '创建草稿失败，请检查网络或配置'
    aiImageProgress.value = '' // 清除进度提示
  } finally {
    isCreatingDraft.value = false
    // 延迟清除进度提示（让用户看到完成状态）
    setTimeout(() => {
      aiImageProgress.value = ''
    }, 2000)
  }
}


const regenerate = () => {
  generateHtml()
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
      ...(block.meta?.aiImageUrl && { aiImageUrl: block.meta.aiImageUrl })
    }))
    
    const cleanContent = JSON.stringify(cleanedBlocks)
    const articleId = appStore.currentArticleId
    
    console.log('[Step3] 当前文章ID:', articleId)
    console.log('[Step3] 清理后的内容块数量:', cleanedBlocks.length)
    console.log('[Step3] 内容预览:', cleanContent.substring(0, 200) + '...')
    console.log('[Step3] 样式配置:', appStore.styleConfig)
    console.log('[Step3] Auth Token:', localStorage.getItem('auth_token') ? '存在' : '不存在')
    
    if (articleId) {
      // 🚀 并行优化：内容、图片库、样式配置同时保存
      console.log('[Step3] 正在并行保存内容、图片和配置...')
      
      const saveTasks = []

      // 1. 保存内容 (使用 Step3 专用端点)
      saveTasks.push(fetch(`/api/articles/${articleId}/step3-content`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
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
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
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
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
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
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
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
      
      // Step 2: 更新内容
      const updateResponse = await fetch(`/api/articles/${data.id}/content`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({ content: cleanContent })
      })
      
      if (!updateResponse.ok) {
        const errorData = await updateResponse.json().catch(() => ({}))
        throw new Error(errorData.message || '保存内容失败')
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
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
          },
          body: JSON.stringify({ images: newArticleImages })
        })
      }
      
      toast.success('文章已创建并保存！')
    }
    
    return true // 返回成功状态
  } catch (error) {
    console.error('保存失败:', error)
    toast.error('保存失败: ' + error.message)
    return false
  } finally {
    isSaving.value = false
  }
}

// 保存并返回首页
const saveDraftAndGoHome = async () => {
  const success = await saveDraft()
  if (success) {
    router.push('/')
  }
}
</script>

<style scoped>
/* 组件特定的样式 */
</style>