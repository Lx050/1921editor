<template>
  <div class="p-6 h-full flex flex-col">
    <!-- 精简头部 -->
    <div class="flex justify-between items-center mb-4">
      <div>
        <h2 class="text-xl font-bold text-gray-900">步骤 3/3: 生成预览</h2>
        <p class="text-sm text-gray-600 mt-1">
          预览最终效果，并复制HTML代码到135编辑器中使用。
        </p>
      </div>
      <!-- 快速操作按钮 -->
      <div class="flex space-x-2">
        <button
          @click="goToStyleConfig"
          class="px-3 py-1.5 bg-orange-100 hover:bg-orange-200 text-orange-700 text-sm rounded-md transition-colors flex items-center space-x-1"
        >
          🎨
          <span>装饰样式</span>
        </button>
        <button
          @click="activeTab = 'preview'"
          :class="[
            'px-3 py-1.5 text-sm rounded-md transition-colors',
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
            'px-3 py-1.5 text-sm rounded-md transition-colors',
            activeTab === 'code'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          ]"
        >
          代码
        </button>
        <button
          @click="copyHtml"
          class="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm rounded-md transition-colors flex items-center space-x-1"
        >
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
          </svg>
          <span>{{ copyButtonText }}</span>
        </button>
      </div>
    </div>

    <!-- 生成状态 -->
    <div v-if="isGenerating" class="flex-1 flex items-center justify-center">
      <div class="text-center">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p class="mt-4 text-gray-600">正在生成版式...</p>
      </div>
    </div>

    <!-- 预览区域 -->
    <div v-else-if="finalHtml" class="flex-1 overflow-hidden">
      <!-- 预览模式 -->
      <div v-if="activeTab === 'preview'" class="bg-white rounded-lg border h-full">
        <iframe
          :srcdoc="finalHtml"
          class="w-full h-full border-0 rounded-lg"
          title="版式预览"
        ></iframe>
      </div>

      <!-- 代码模式 -->
      <div v-else class="h-full flex flex-col">
        <div class="flex justify-between items-center mb-2">
          <div class="text-sm text-gray-600">
            HTML代码 ({{ finalHtml.length }} 字符)
          </div>
        </div>

        <div class="flex-1 bg-gray-900 text-gray-100 rounded-lg p-4 overflow-auto">
          <pre class="text-sm font-mono whitespace-pre-wrap">{{ finalHtml }}</pre>
        </div>
      </div>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="errorMessage" class="flex-1 flex items-center justify-center">
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

    <!-- 底部操作栏 -->
    <div class="flex justify-between items-center pt-4 border-t">
      <button
        @click="goToPreviousStep"
        class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors"
      >
        ← 上一步
      </button>

      <div class="flex space-x-2">
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
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '../stores/appStore.js'
import { buildHtml } from '../utils/styleAssembler.js'

const router = useRouter()
const appStore = useAppStore()

const isGenerating = ref(false)
const finalHtml = ref('')
const errorMessage = ref('')
const activeTab = ref('preview')
const copyButtonText = ref('复制HTML代码')

// 计算属性
const contentBlocks = computed(() => appStore.contentBlocks)

// 生成HTML
const generateHtml = async () => {
  isGenerating.value = true
  errorMessage.value = ''

  try {
    // 模拟异步处理
    await new Promise(resolve => setTimeout(resolve, 1000))

    if (contentBlocks.value.length === 0) {
      throw new Error('没有内容块可处理')
    }

    // 获取样式配置并传递给buildHtml函数
    const styleConfig = appStore.styleConfig
    console.log('生成HTML时使用的样式配置:', styleConfig)

    finalHtml.value = buildHtml(contentBlocks.value, styleConfig)
  } catch (error) {
    console.error('生成HTML失败:', error)
    errorMessage.value = error.message || '生成HTML时发生未知错误'
  } finally {
    isGenerating.value = false
  }
}

// 复制HTML代码
const copyHtml = async () => {
  try {
    // 优先尝试现代 Clipboard API
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(finalHtml.value)
      showCopySuccess()
    } else {
      throw new Error('Clipboard API not available')
    }
  } catch (error) {
    console.warn('Clipboard API failed, trying fallback:', error)
    // 降级方案：使用 textarea + execCommand
    try {
      const textarea = document.createElement('textarea')
      textarea.value = finalHtml.value
      // 确保 textarea 不可见但可选中
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

// 重新生成
const regenerate = () => {
  generateHtml()
}

// 开始新的排版
const startNew = () => {
  appStore.resetApp()
  router.push('/step1')
}

// 返回上一步
const goToPreviousStep = () => {
  router.push('/step2')
}

// 前往样式配置
const goToStyleConfig = () => {
  router.push('/style-config')
}

// 组件挂载时生成HTML
onMounted(() => {
  // 验证是否有内容块
  if (contentBlocks.value.length === 0) {
    router.push('/step2')
    return
  }

  // 验证是否有装饰样式配置
  const styleConfig = appStore.styleConfig
  const hasTitleStyle = styleConfig.title && styleConfig.title.fullExample
  const hasBodyStyle = styleConfig.body && styleConfig.body.fullExample
  const hasIntroStyle = styleConfig.intro && styleConfig.intro.fullExample

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