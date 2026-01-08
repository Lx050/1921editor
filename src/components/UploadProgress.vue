<template>
  <div 
    v-if="showProgress"
    class="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg px-4 py-3"
  >
    <div class="flex items-center justify-between mb-2">
      <div class="flex items-center space-x-2">
        <!-- 上传图标和状态 -->
        <div v-if="isUploading" class="flex items-center space-x-2">
          <div class="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span class="text-sm font-medium text-blue-700">图片上传中...</span>
        </div>
        <div v-else-if="progress.failed > 0" class="flex items-center space-x-2">
          <span class="text-amber-500">⚠️</span>
          <span class="text-sm font-medium text-amber-700">部分上传失败</span>
        </div>
        <div v-else class="flex items-center space-x-2">
          <span class="text-green-500">✅</span>
          <span class="text-sm font-medium text-green-700">上传完成</span>
        </div>
      </div>

      <!-- 进度统计 -->
      <div class="flex items-center space-x-3 text-sm">
        <span class="text-gray-600">
          <span class="font-semibold text-blue-600">{{ progress.completed }}</span>
          / {{ progress.total }} 完成
        </span>
        <span v-if="progress.failed > 0" class="text-red-600">
          {{ progress.failed }} 失败
        </span>
      </div>
    </div>

    <!-- 进度条 -->
    <div class="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
      <div class="h-full flex">
        <!-- 成功部分 -->
        <div 
          class="bg-green-500 transition-all duration-300"
          :style="{ width: `${successPercentage}%` }"
        ></div>
        <!-- 上传中部分 -->
        <div 
          class="bg-blue-400 animate-pulse transition-all duration-300"
          :style="{ width: `${uploadingPercentage}%` }"
        ></div>
        <!-- 失败部分 -->
        <div 
          class="bg-red-400 transition-all duration-300"
          :style="{ width: `${failedPercentage}%` }"
        ></div>
      </div>
    </div>

    <!-- 失败重试按钮 -->
    <div v-if="progress.failed > 0 && !isUploading" class="mt-2 flex justify-end">
      <button
        @click="$emit('retry')"
        class="px-3 py-1 text-sm bg-amber-100 hover:bg-amber-200 text-amber-700 rounded-md transition-colors flex items-center space-x-1"
      >
        <span>🔄</span>
        <span>重试失败的图片</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { UploadProgress } from '@/types'

const props = defineProps<{
  progress: UploadProgress
  isUploading: boolean
}>()

defineEmits<{
  (e: 'retry'): void
}>()

// 是否显示进度条（有图片需要上传时显示）
const showProgress = computed(() => props.progress.total > 0)

// 计算各部分百分比
const successPercentage = computed(() => {
  if (props.progress.total === 0) return 0
  return (props.progress.completed / props.progress.total) * 100
})

const uploadingPercentage = computed(() => {
  if (props.progress.total === 0) return 0
  return (props.progress.uploading / props.progress.total) * 100
})

const failedPercentage = computed(() => {
  if (props.progress.total === 0) return 0
  return (props.progress.failed / props.progress.total) * 100
})
</script>
