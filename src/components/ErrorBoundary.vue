<template>
  <div>
    <slot v-if="!error"></slot>
    <div v-else class="min-h-screen flex items-center justify-center p-4" style="background:var(--color-bg-warm);">
      <div class="max-w-md w-full bg-white rounded-lg shadow-lg border border-red-200 p-6">
        <div class="flex items-center mb-4">
          <div class="flex-shrink-0">
            <svg class="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-lg font-medium" style="color:rgba(0,0,0,0.85);">应用出现错误</h3>
            <p class="text-sm mt-1" style="color:rgba(0,0,0,0.45);">我们很抱歉，但似乎出现了问题</p>
          </div>
        </div>

        <div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-4" v-if="error.message">
          <h4 class="text-sm font-medium text-red-800 mb-2">错误信息：</h4>
          <p class="text-sm text-red-700">{{ error.message }}</p>
        </div>

        <div class="rounded-lg p-4 mb-4" style="background:var(--color-bg-warm); border:1px solid rgba(0,0,0,0.08);" v-if="error.stack && showDetails">
          <h4 class="text-sm font-medium mb-2" style="color:rgba(0,0,0,0.75);">详细堆栈：</h4>
          <pre class="text-xs overflow-x-auto" style="color:rgba(0,0,0,0.65);">{{ error.stack }}</pre>
        </div>

        <div class="flex flex-col space-y-3">
          <button
            @click="showDetails = !showDetails"
            class="text-sm font-medium transition-colors"
            style="color: var(--color-accent-primary);"
            onmouseover="this.style.color='var(--color-accent-hover)';"
            onmouseout="this.style.color='var(--color-accent-primary)';"
          >
            {{ showDetails ? '隐藏详情' : '显示详情' }}
          </button>

          <button
            @click="retry"
            class="w-full text-white font-medium px-4 py-2 rounded-lg transition-colors"
            style="background: var(--color-accent-primary);"
            onmouseover="this.style.background='var(--color-accent-hover)';"
            onmouseout="this.style.background='var(--color-accent-primary)';"
          >
            重试
          </button>

          <button
            @click="goHome"
            class="w-full font-medium px-4 py-2 rounded-lg transition-colors"
            style="background:rgba(0,0,0,0.08); color:rgba(0,0,0,0.65);"
            onmouseover="this.style.background='rgba(0,0,0,0.12)'" onmouseout="this.style.background='rgba(0,0,0,0.08)'"
          >
            返回首页
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onErrorCaptured } from 'vue'
import { useRouter } from 'vue-router'

interface Props {
  // 是否显示重试按钮
  showRetry?: boolean
  // 是否自动捕获错误
  captureErrors?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showRetry: true,
  captureErrors: true
})

const emit = defineEmits<{
  (e: 'error', error: Error): void
  (e: 'retry'): void
}>()

const router = useRouter()
const error = ref<Error | null>(null)
const showDetails = ref(false)

// 捕获子组件错误
if (props.captureErrors) {
  onErrorCaptured((err) => {
    console.error('ErrorBoundary captured error:', err)
    error.value = err instanceof Error ? err : new Error(String(err))
    emit('error', error.value)
    return false // 阻止错误继续向上传播
  })
}

// 重试操作
const retry = () => {
  error.value = null
  showDetails.value = false
  emit('retry')
}

// 返回首页
const goHome = () => {
  error.value = null
  router.push('/')
}

// 手动设置错误（用于测试或外部错误处理）
const setError = (err: Error) => {
  error.value = err
  emit('error', err)
}

defineExpose({
  setError
})
</script>
