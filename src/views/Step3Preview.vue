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
            @click="goToStyleConfig"
            class="md:px-3 px-2 py-1.5 bg-orange-100 hover:bg-orange-200 text-orange-700 text-xs md:text-sm rounded-md transition-colors flex items-center space-x-1 flex-shrink-0"
            title="装饰样式"
          >
            <span class="text-sm">🎨</span>
            <span class="hidden md:inline">装饰样式</span>
          </button>
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
          <!-- 生成预览按钮 -->
          <button
            @click="generatePreviewLink"
            class="md:px-4 px-2 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs md:text-sm rounded-md transition-colors flex items-center space-x-1 flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="isCreatingPreview || !finalHtml"
            title="生成可分享的预览链接"
          >
            <div v-if="isCreatingPreview" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
            </svg>
            <span class="hidden md:inline">{{ isCreatingPreview ? '生成中...' : '生成预览' }}</span>
            <span class="md:hidden">{{ isCreatingPreview ? '生成中' : '预览' }}</span>
          </button>

          <!-- 创建草稿按钮 -->
          <button
            @click="openDraftModal"
            class="md:px-3 px-2 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs md:text-sm rounded-md transition-colors flex items-center space-x-1 flex-shrink-0"
            title="上传到微信草稿箱"
          >
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
            </svg>
            <span class="hidden md:inline">创建草稿</span>
            <span class="md:hidden">草稿</span>
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
      <div v-else-if="finalHtml && !errorMessage" class="h-full overflow-hidden flex flex-col">
        <!-- 顶部：微信图片库（移动端横向滚动，桌面端独立侧边栏）-->
        <div
          class="md:w-[520px] flex-shrink-0 bg-gray-50 border-r-0 md:border-r border-b md:border-b-0"
          v-if="hasWechatImages"
        >
          <!-- 桌面端左侧图片库（纵向）-->
          <div class="hidden md:block h-full overflow-hidden flex flex-col">
            <div class="flex-shrink-0 p-4 border-b bg-white">
              <h3 class="font-semibold text-gray-900">微信图片库</h3>
              <p class="text-sm text-gray-600 mt-1">
                点击预览中的占位符图片，再从左侧选择图片替换
              </p>
            </div>
            <div class="flex-1 overflow-y-auto">
              <WechatImageGallery
                :images="wechatImages"
                :selectedPlaceholder="selectedPlaceholder"
                @select="handleImageSelect"
              />
            </div>
          </div>

          <!-- 移动端顶部横向图片库 -->
          <div class="md:hidden h-28 w-full overflow-hidden border-b">
            <div class="bg-blue-50 border-b px-3 py-2">
              <p class="text-xs text-blue-700 font-medium">👇 选择图片后，点击预览中的占位符</p>
            </div>
            <div class="overflow-x-auto overflow-y-hidden h-full bg-gray-50">
              <WechatImageGallery
                :images="wechatImages"
                :selectedPlaceholder="selectedPlaceholder"
                @select="handleImageSelect"
                mobile-layout
              />
            </div>
          </div>
        </div>

        <!-- 主内容区：预览与代码 -->
        <div class="flex-1 flex flex-row md:h-full">
          <!-- 预览与代码区 -->
          <div class="flex-1 h-full overflow-y-auto">
            <!-- 预览模式 -->
            <div v-if="activeTab === 'preview'" class="min-h-full bg-gray-100 md:bg-gray-200 flex justify-center p-2 md:py-4">
              <!-- 响应式：手机宽度容器 -->
              <div class="w-full md:w-[375px] max-w-md md:max-w-none bg-white shadow md:shadow-lg rounded md:rounded-lg flex-shrink-0">
                <iframe
                  ref="previewFrame"
                  :srcdoc="previewHtml"
                  class="w-full border-0 rounded md:rounded-lg"
                  style="min-height: 600px;"
                  title="版式预览"
                  @load="setupIframeClickHandler"
                ></iframe>
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
    <div v-if="finalHtml && !errorMessage" class="flex-shrink-0 flex flex-wrap gap-2 justify-between items-center p-4 border-t bg-white">
      <button
        @click="goToPreviousStep"
        class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors"
      >
        ← 上一步
      </button>

      <div class="flex gap-2">
        <button
          @click="regenerate"
          class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors"
          :disabled="isGenerating"
        >
          重新生成
        </button>

        <button
          @click="startNew"
          class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          开始新的排版
        </button>
      </div>
    </div>

    <!-- 如果没有finalHtml，显示一个空的底部占位符保持布局 -->
    <div v-else-if="contentBlocks.length > 0" class="flex-shrink-0 p-4 border-t bg-white"></div>

    <!-- 预览结果展示区域 -->
    <div v-if="previewLink" class="flex-shrink-0 p-4 border-t bg-white border-blue-200">
      <div class="bg-blue-50 rounded-lg p-4">
        <h3 class="font-semibold text-blue-900 mb-3 flex items-center">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          预览链接已生成（可复制分享给他人）
        </h3>

        <!-- 链接和操作 -->
        <div class="flex items-center space-x-2">
          <input
            type="text"
            :value="previewLink"
            readonly
            class="flex-1 px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg font-mono text-blue-600"
            @click="$event.target.select()"
          >
          <button
            @click="copyPreviewLink"
            class="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors whitespace-nowrap"
          >
            复制链接
          </button>
          <a
            :href="previewLink"
            target="_blank"
            class="px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors inline-flex items-center"
          >
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
            </svg>
            测试打开
          </a>
        </div>

        <p class="text-xs text-gray-500 mt-2">
          💡 提示：将此链接发送给任何人，他们都可以查看文章预览
        </p>
      </div>
    </div>

    <!-- 创建草稿弹窗 -->
    <div 
      v-if="showDraftModal" 
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="showDraftModal = false"
    >
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
        <!-- 弹窗头部 -->
        <div class="bg-purple-600 text-white px-6 py-4">
          <h3 class="text-lg font-semibold">创建公众号草稿</h3>
          <p class="text-purple-200 text-sm mt-1">填写文章信息，上传到草稿箱</p>
        </div>

        <!-- 弹窗内容 -->
        <div class="p-6 space-y-4">
          <!-- 标题 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">文章标题 *</label>
            <input
              v-model="draftForm.title"
              type="text"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="请输入文章标题"
            />
          </div>

          <!-- 封面图 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">封面图 *</label>
            <div class="flex items-center space-x-2">
              <select
                v-model="draftForm.coverImageId"
                class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">请选择封面图</option>
                <option 
                  v-for="img in successfulWechatImages" 
                  :key="img.id" 
                  :value="img.mediaId"
                >
                  {{ img.name }}
                </option>
              </select>
              
              <!-- 封面上传按钮 -->
              <div class="relative">
                <input
                  type="file"
                  accept="image/*"
                  class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  @change="handleCoverUpload"
                  :disabled="isUploadingCover"
                />
                <button
                  type="button"
                  class="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-lg transition-colors whitespace-nowrap flex items-center"
                  :class="{'opacity-50': isUploadingCover}"
                >
                  <svg v-if="!isUploadingCover" class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
                  </svg>
                  <div v-else class="w-4 h-4 mr-1 border-2 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
                  {{ isUploadingCover ? '上传中...' : '上传封面' }}
                </button>
              </div>
            </div>
            <p v-if="successfulWechatImages.length === 0" class="text-xs text-orange-500 mt-1">
              * 纯文字排版也需要一张封面图，请上传
            </p>
          </div>

          <!-- 作者 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">作者（选填）</label>
            <input
              v-model="draftForm.author"
              type="text"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="如：小编"
            />
          </div>

          <!-- 摘要 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">摘要（选填）</label>
            <textarea
              v-model="draftForm.digest"
              rows="2"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              placeholder="文章摘要，不填则默认截取正文前54字"
            ></textarea>
          </div>

          <!-- 显示封面 -->
          <div class="flex items-center">
            <input
              v-model="draftForm.showCover"
              type="checkbox"
              id="showCover"
              class="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
            />
            <label for="showCover" class="ml-2 text-sm text-gray-700">在文章内显示封面图</label>
          </div>

          <!-- 错误提示 -->
          <div v-if="draftError" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {{ draftError }}
          </div>

          <!-- 成功提示 -->
          <div v-if="draftSuccess" class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
            <div class="flex items-start space-x-2">
              <div class="text-lg">✅</div>
              <div class="flex-1">
                <div class="font-semibold mb-1">草稿创建成功！</div>
                <div class="text-xs text-green-700">文章已保存到公众号草稿箱</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 弹窗底部 -->
        <div class="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
          <button
            @click="showDraftModal = false"
            class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
          >
            取消
          </button>
          <button
            @click="submitDraft"
            :disabled="isCreatingDraft || !draftForm.title || !draftForm.coverImageId"
            class="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="isCreatingDraft">创建中...</span>
            <span v-else>创建草稿</span>
            <div v-if="isCreatingDraft" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '../stores/appStore'
import { buildHtml } from '../utils/styleAssembler'
import { createDraft, uploadImage } from '../utils/wechatApi'
import WechatImageGallery from '../components/WechatImageGallery.vue'
import QRCode from 'qrcode'
import { getConfig } from '../config'

const router = useRouter()
const appStore = useAppStore()

const isGenerating = ref(false)
const finalHtml = ref('')
const previewHtml = ref('')
const errorMessage = ref('')
const activeTab = ref('preview')
const copyButtonText = ref('复制HTML代码')
const previewFrame = ref(null)

// V2: 图片替换相关状态
const selectedPlaceholder = ref(null)
const imageReplacements = ref({})
const lastScrollTop = ref(0) // 记录 iframe 滚动位置

// V2: 草稿创建相关状态
const showDraftModal = ref(false)
const isCreatingDraft = ref(false)
const isCreatingPreview = ref(false) // 生成预览中
const isUploadingCover = ref(false)
const draftError = ref('')
const draftSuccess = ref('')
const previewLink = ref('')
const qrCodeDataUrl = ref('')
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
const handleCoverUpload = async (event) => {
  const file = event.target.files[0]
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
    
    // 清除 file input
    event.target.value = ''
    
  } catch (error) {
    console.error('[Step3] 封面上传失败:', error)
    draftError.value = error.message || '封面上传失败，请重试'
  } finally {
    isUploadingCover.value = false
  }
}


// 计算属性
const contentBlocks = computed(() => appStore.contentBlocks)
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
}

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

// 更新 previewHtml Ref (会触发 iframe 刷新)
const updatePreviewHtmlRef = () => {
  // 保存当前滚动位置
  if (previewFrame.value && previewFrame.value.contentWindow) {
    lastScrollTop.value = previewFrame.value.contentWindow.scrollY
  }
  previewHtml.value = getCurrentPreviewHtmlString()
  console.log('[Step3] 预览 HTML Ref 已更新')
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

// V2: 生成预览链接（可分享给别人）
const generatePreviewLink = async () => {
  isCreatingPreview.value = true
  draftError.value = ''

  try {
    const content = getOutputHtml()
    const title = extractTitleFromContent()

    // 准备预览数据 - 使用自动提取的标题，其他字段可选
    const previewData = {
      title: title,
      author: draftForm.value.author || '',
      digest: draftForm.value.digest || '',
      content: content,
      timestamp: Date.now()
    }

    // 转换为JSON并编码
    const jsonStr = JSON.stringify(previewData)
    const encoded = btoa(encodeURIComponent(jsonStr))

    // 生成预览链接（整个数据在URL中，可分享）
    // 从配置文件获取服务器URL，可覆盖默认的window.location.origin
    const config = getConfig()
    const serverUrl = config.apiBaseUrl
    const link = `${serverUrl}/preview?data=${encoded}`
    previewLink.value = link

    // 保存到sessionStorage（用于在新标签页打开）
    sessionStorage.setItem('wechat_preview_data', JSON.stringify(previewData))
    sessionStorage.setItem('wechat_preview_link', link)

    // 显示成功消息
    draftSuccess.value = 'preview_generated'
    setTimeout(() => {
      draftSuccess.value = ''
    }, 3000)

    return link
  } catch (error) {
    console.error('[Step3] 生成预览链接失败:', error)
    // 如果是数据过大，给出明确提示
    if (error.message && error.message.includes('too big')) {
      draftError.value = '内容过多，无法生成分享链接。请减少内容或直接使用草稿功能'
    } else {
      draftError.value = '生成预览链接失败，请重试'
    }
    return null
  } finally {
    isCreatingPreview.value = false
  }
}

// V2: 生成草稿编辑链接（用于预览）
const generateDraftEditLink = (draftId) => {
  // 微信公众号后台草稿编辑页面的基本URL
  // 注意：实际访问时需要在微信浏览器或已登录环境下
  return `https://mp.weixin.qq.com/cgi-bin/appmsg?t=media/appmsg_edit&action=edit&type=10&appmsgid=${draftId}&lang=zh_CN`
}

// V2: 复制预览链接
const copyPreviewLink = async () => {
  if (!previewLink.value) return

  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(previewLink.value)
    } else {
      const textarea = document.createElement('textarea')
      textarea.value = previewLink.value
      textarea.style.position = 'fixed'
      textarea.style.left = '-9999px'
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
    }

    // 显示复制成功提示
    const btn = event.target
    const originalText = btn.textContent
    btn.textContent = '已复制!'
    btn.classList.add('bg-green-600')
    setTimeout(() => {
      btn.textContent = originalText
      btn.classList.remove('bg-green-600')
    }, 2000)
  } catch (error) {
    console.error('[Step3] 复制链接失败:', error)
  }
}

// V2: 提交草稿
const submitDraft = async () => {
  if (!draftForm.value.title || !draftForm.value.coverImageId) return

  isCreatingDraft.value = true
  draftError.value = ''
  draftSuccess.value = ''

  try {
    const content = getOutputHtml()

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
  } finally {
    isCreatingDraft.value = false
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

const goToStyleConfig = () => {
  router.push('/style-config')
}

onMounted(() => {
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

  generateHtml()
})
</script>

<style scoped>
/* 组件特定的样式 */
</style>