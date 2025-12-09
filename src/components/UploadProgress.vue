<template>
  <div class="mb-4 border rounded-lg p-4" :class="containerClass">
    <!-- 头部信息 -->
    <div class="flex items-center justify-between mb-3">
      <div class="flex items-center">
        <div class="mr-3">
          <!-- 上传中图标 -->
          <svg
            v-if="status === 'uploading'"
            class="animate-spin h-5 w-5 text-blue-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <!-- 完成图标 -->
          <svg
            v-else-if="status === 'completed'"
            class="h-5 w-5 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <!-- 错误图标 -->
          <svg
            v-else-if="status === 'failed'"
            class="h-5 w-5 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            ></path>
          </svg>
        </div>
        <div>
          <h3 class="text-sm font-medium" :class="titleClass">
            {{ statusTitle }}
          </h3>
          <p v-if="subtitle" class="text-xs mt-1" :class="subtitleClass">
            {{ subtitle }}
          </p>
        </div>
      </div>
      <div v-if="!allCompleted" class="text-sm font-medium" :class="percentageClass">
        {{ percentage }}%
      </div>
    </div>

    <!-- 进度条 -->
    <div class="w-full bg-gray-200 rounded-full h-2 mb-3">
      <div
        class="h-2 rounded-full transition-all duration-300 ease-out"
        :class="progressBarClass"
        :style="{ width: `${percentage}%` }"
      ></div>
    </div>

    <!-- 图片列表（折叠） -->
    <div v-if="showDetails" class="space-y-2 max-h-32 overflow-y-auto">
      <div
        v-for="image in images"
        :key="image.id"
        class="flex items-center justify-between py-1 px-2 rounded text-xs"
        :class="getImageItemClass(image.status)"
      >
        <div class="flex items-center">
          <div class="mr-2">
            <!-- 上传中 -->
            <svg
              v-if="image.status === 'uploading'"
              class="animate-spin h-3 w-3 text-blue-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <!-- 完成 -->
            <svg
              v-else-if="image.status === 'completed'"
              class="h-3 w-3 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
            <!-- 失败 -->
            <svg
              v-else-if="image.status === 'failed'"
              class="h-3 w-3 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </div>
          <span class="truncate max-w-48" :title="image.originalName">
            {{ image.originalName }}
          </span>
        </div>
        <span v-if="image.status === 'failed'" class="text-red-600 cursor-pointer" @click="$emit('retry', image)">
          重试
        </span>
      </div>
    </div>

    <!-- 错误提示 -->
    <div v-if="hasErrors" class="mt-3 p-2 bg-red-50 rounded">
      <div class="text-xs text-red-800 mb-2">
        {{ uploadStatus.failed }} 张图片上传失败
      </div>
      <button
        v-if="allFailed"
        @click="$emit('continue-text-only')"
        class="text-xs text-blue-600 hover:text-blue-800"
      >
        继续纯文本模式
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { WechatImage } from '@/stores/appStore'

interface Props {
  uploadStatus: {
    total: number
    completed: number
    failed: number
    status: 'idle' | 'uploading' | 'completed' | 'failed'
    errors: Array<{ fileName: string; error: string }>
  }
  images: WechatImage[]
  showDetails?: boolean
}

interface Emits {
  (e: 'retry', image: WechatImage): void
  (e: 'continue-text-only'): void
}

const props = withDefaults(defineProps<Props>(), {
  showDetails: true
})

defineEmits<Emits>()

const percentage = computed(() => {
  if (props.uploadStatus.total === 0) return 0
  return Math.round((props.uploadStatus.completed / props.uploadStatus.total) * 100)
})

const allCompleted = computed(() => {
  return props.uploadStatus.status === 'completed'
})

const allFailed = computed(() => {
  return props.uploadStatus.status === 'failed'
})

const hasErrors = computed(() => {
  return props.uploadStatus.failed > 0
})

const status = computed(() => props.uploadStatus.status)

const statusTitle = computed(() => {
  switch (props.uploadStatus.status) {
    case 'uploading':
      return `图片上传中 (${props.uploadStatus.completed}/${props.uploadStatus.total})`
    case 'completed':
      return '图片上传完成'
    case 'failed':
      return '部分图片上传失败'
    default:
      return '准备上传图片'
  }
})

const subtitle = computed(() => {
  if (props.uploadStatus.status === 'uploading' && props.uploadStatus.total > 10) {
    return '上传较大文件，请稍候...'
  }
  return ''
})

// 样式类
const containerClass = computed(() => {
  switch (props.uploadStatus.status) {
    case 'uploading':
      return 'bg-blue-50 border-blue-200'
    case 'completed':
      return 'bg-green-50 border-green-200'
    case 'failed':
      return 'bg-red-50 border-red-200'
    default:
      return 'bg-gray-50 border-gray-200'
  }
})

const titleClass = computed(() => {
  switch (props.uploadStatus.status) {
    case 'uploading':
      return 'text-blue-900'
    case 'completed':
      return 'text-green-900'
    case 'failed':
      return 'text-red-900'
    default:
      return 'text-gray-900'
  }
})

const subtitleClass = computed(() => {
  switch (props.uploadStatus.status) {
    case 'uploading':
      return 'text-blue-700'
    default:
      return 'text-gray-600'
  }
})

const percentageClass = computed(() => {
  switch (props.uploadStatus.status) {
    case 'uploading':
      return 'text-blue-900'
    case 'completed':
      return 'text-green-900'
    case 'failed':
      return 'text-red-900'
    default:
      return 'text-gray-900'
  }
})

const progressBarClass = computed(() => {
  switch (props.uploadStatus.status) {
    case 'uploading':
      return 'bg-blue-600'
    case 'completed':
      return 'bg-green-600'
    case 'failed':
      return 'bg-red-600'
    default:
      return 'bg-gray-600'
  }
})

const getImageItemClass = (status: WechatImage['status']) => {
  switch (status) {
    case 'uploading':
      return 'bg-blue-50 text-blue-800'
    case 'completed':
      return 'bg-green-50 text-green-800'
    case 'failed':
      return 'bg-red-50 text-red-800'
    default:
      return 'bg-gray-50 text-gray-800'
  }
}
</script>

<style scoped>
.max-w-48 {
  max-width: 12rem;
}
</style>
