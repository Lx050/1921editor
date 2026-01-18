<template>
  <div class="h-screen w-full flex flex-col overflow-hidden">
    <!-- 头部 -->
    <div class="flex-shrink-0 w-full bg-white border-b p-4">
      <div class="flex justify-between items-center">
        <div>
          <h2 class="text-xl font-bold text-gray-900">步骤 3/3: 生成预览</h2>
          <p class="text-sm text-gray-600 mt-1">
            {{ hasWechatImages ? '点击预览中的占位符图片，再选择图片替换' : '预览最终效果，并复制HTML代码' }}
          </p>
        </div>
        <div class="flex gap-2">
          <button
            @click="activeTab = 'preview'"
            :class="[
              'px-3 py-2 rounded-md text-sm',
              activeTab === 'preview' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
            ]"
          >
            预览
          </button>
          <button
            @click="activeTab = 'code'"
            :class="[
              'px-3 py-2 rounded-md text-sm',
              activeTab === 'code' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
            ]"
          >
            代码
          </button>
          <button
            v-if="activeTab === 'preview'"
            @click="showMobileFrame = !showMobileFrame"
            class="px-3 py-2 rounded-md text-sm bg-gray-800 text-white"
          >
            📱 {{ showMobileFrame ? '关闭真机' : '真机预览' }}
          </button>
        </div>
      </div>
    </div>

    <!-- 内容区 -->
    <div class="flex-1 overflow-hidden">
      <!-- 加载中 -->
      <div v-if="isGenerating" class="h-full flex items-center justify-center">
        <div class="text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p class="mt-4 text-gray-600">正在生成版式...</p>
        </div>
      </div>

      <!-- 错误 -->
      <div v-else-if="errorMessage" class="h-full flex items-center justify-center">
        <div class="text-center">
          <div class="text-red-400 text-4xl mb-4">⚠️</div>
          <div class="text-red-600 font-medium mb-2">生成失败</div>
          <div class="text-gray-600">{{ errorMessage }}</div>
          <button
            @click="regenerate"
            class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            重新生成
          </button>
        </div>
      </div>

      <!-- 预览区 -->
      <div v-else-if="finalHtml" class="h-full flex">
        <!-- 图片库（侧边栏） -->
        <ImageReplacer
          v-if="hasWechatImages"
          :wechat-images="wechatImages"
          :selected-placeholder="selectedPlaceholder"
          @select="handleImageSelect"
        />

        <!-- 主内容区 -->
        <div class="flex-1 overflow-hidden flex flex-col">
          <!-- 预览模式 -->
          <div v-if="activeTab === 'preview'" class="flex-1 overflow-auto bg-gray-100 p-4">
            <PreviewFrame
              :preview-html="previewHtml"
              :show-mobile-frame="showMobileFrame"
              wechat-title="公众号文章"
              :article-title="articleTitle"
              @placeholder-click="handlePlaceholderClick"
            />
          </div>

          <!-- 代码模式 -->
          <div v-else class="flex-1 overflow-auto p-4 bg-gray-900">
            <div class="text-gray-400 mb-2 text-sm">HTML代码 ({{ finalHtml.length }} 字符)</div>
            <pre class="text-green-400 font-mono text-sm whitespace-pre-wrap">{{ finalHtml }}</pre>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部操作栏 -->
    <div v-if="finalHtml" class="flex-shrink-0 p-4 border-t bg-white">
      <div class="flex justify-between">
        <button
          @click="router.push('/step2')"
          class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700"
        >
          ← 上一步
        </button>
        <div class="flex gap-2">
          <button
            @click="copyHtml"
            class="px-4 py-2 bg-green-600 text-white rounded-lg"
          >
            {{ copyButtonText }}
          </button>
          <button
            @click="createWechatDraft"
            :disabled="isCreatingDraft"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
          >
            {{ isCreatingDraft ? '创建中...' : '创建草稿' }}
          </button>
        </div>
      </div>
    </div>

    <!-- 草稿弹窗 -->
    <DraftModal
      :show="showDraftModal"
      title="草稿创建成功"
      message="草稿已保存到微信草稿箱"
      :draft-url="draftUrl"
      :qr-code-url="qrCodeUrl"
      :error="draftError"
      :show-cancel="false"
      @confirm="closeDraftModal"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '../stores/appStore'
import { buildHtml } from '../utils/styleAssembler'
import { copyToClipboard } from '../utils/clipboard'
import { createDraft } from '../utils/wechatApi'
import ImageReplacer from '../components/ImageReplacer.vue'
import PreviewFrame from '../components/PreviewFrame.vue'
import DraftModal from '../components/DraftModal.vue'

const router = useRouter()
const appStore = useAppStore()

const isGenerating = ref(false)
const finalHtml = ref('')
const previewHtml = ref('')
const errorMessage = ref('')
const activeTab = ref('preview')
const showMobileFrame = ref(false)
const selectedPlaceholder = ref(null)
const copyButtonText = ref('复制HTML代码')
const isCreatingDraft = ref(false)
const showDraftModal = ref(false)
const draftUrl = ref('')
const qrCodeUrl = ref('')
const draftError = ref('')

const wechatImages = computed(() => appStore.wechatImages)
const hasWechatImages = computed(() => wechatImages.value.length > 0)
const articleTitle = computed(() => appStore.articleTitle || '未命名文章')

const handlePlaceholderClick = (placeholder) => {
  selectedPlaceholder.value = placeholder
}

const handleImageSelect = (image, _placeholder) => {
  // 处理图片替换逻辑
  const placeholderRegex = new RegExp(`&单图[^&]*`, 'g')
  previewHtml.value = previewHtml.value.replace(placeholderRegex, `&单图${image.name}`)
  selectedPlaceholder.value = null
}

const copyHtml = async () => {
  const result = await copyToClipboard(finalHtml.value)
  if (result.ok) {
    copyButtonText.value = '已复制!'
    setTimeout(() => {
      copyButtonText.value = '复制HTML代码'
    }, 2000)
  } else {
    console.error('复制失败:', result.error)
    alert('复制失败，请手动选择代码进行复制')
  }
}

const generatePreview = async () => {
  try {
    isGenerating.value = true
    errorMessage.value = ''

    const html = await buildHtml(appStore.contentBlocks, appStore.styleConfig)
    finalHtml.value = html
    previewHtml.value = html
  } catch (error) {
    console.error('生成预览失败:', error)
    errorMessage.value = error.message || '生成预览失败'
  } finally {
    isGenerating.value = false
  }
}

const regenerate = () => {
  generatePreview()
}

const createWechatDraft = async () => {
  try {
    isCreatingDraft.value = true
    draftError.value = ''

    const result = await createDraft(finalHtml.value)
    draftUrl.value = result.url
    qrCodeUrl.value = result.qrCode
    showDraftModal.value = true
  } catch (error) {
    console.error('创建草稿失败:', error)
    draftError.value = error.message || '创建草稿失败'
    showDraftModal.value = true
  } finally {
    isCreatingDraft.value = false
  }
}

const closeDraftModal = () => {
  showDraftModal.value = false
  draftUrl.value = ''
  qrCodeUrl.value = ''
  draftError.value = ''
}

onMounted(() => {
  if (appStore.contentBlocks?.length) {
    generatePreview()
  } else {
    errorMessage.value = '没有可预览的内容'
  }
})
</script>
