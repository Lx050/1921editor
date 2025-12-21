<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
  >
    <div class="bg-white rounded-lg max-w-md w-full p-6">
      <h3 class="text-lg font-bold text-gray-900 mb-2">{{ title }}</h3>
      <p class="text-sm text-gray-600 mb-4">{{ message }}</p>

      <!-- 草稿链接 -->
      <div v-if="draftUrl" class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-1">草稿链接</label>
        <div class="flex items-center space-x-2">
          <input
            type="text"
            :value="draftUrl"
            readonly
            class="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm bg-gray-50"
          />
          <button
            @click="copyDraftUrl"
            class="px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
          >
            复制
          </button>
        </div>
      </div>

      <!-- 二维码 -->
      <div v-if="qrCodeUrl" class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-1">扫码查看草稿</label>
        <div class="flex justify-center">
          <img :src="qrCodeUrl" alt="草稿二维码" class="w-32 h-32" />
        </div>
      </div>

      <!-- 错误信息 -->
      <div v-if="error" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
        <p class="text-sm text-red-600">{{ error }}</p>
      </div>

      <!-- 按钮 -->
      <div class="flex justify-end space-x-3">
        <button
          v-if="showCancel"
          @click="$emit('cancel')"
          class="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
        >
          取消
        </button>
        <button
          @click="$emit('confirm')"
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          确定
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

const props = defineProps<{
  show: boolean
  title: string
  message: string
  draftUrl?: string
  qrCodeUrl?: string
  error?: string
  showCancel?: boolean
}>()

const emit = defineEmits<{
  cancel: []
  confirm: []
}>()

const copyDraftUrl = async () => {
  if (props.draftUrl) {
    try {
      await navigator.clipboard.writeText(props.draftUrl)
      // 可以添加成功提示
    } catch (err) {
      console.error('复制失败:', err)
    }
  }
}
</script>