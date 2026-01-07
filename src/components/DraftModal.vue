<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
  >
    <div class="bg-[#141419] rounded-2xl max-w-md w-full p-6 border border-white/10 shadow-2xl">
      <h3 class="magazine-title-md text-[#f5f5f5] mb-2">{{ title }}</h3>
      <p class="text-sm text-[#a0a0b0] mb-4">{{ message }}</p>

      <!-- 草稿链接 -->
      <div v-if="draftUrl" class="mb-4">
        <label class="block text-sm font-medium text-[#a0a0b0] mb-2">草稿链接</label>
        <div class="flex items-center space-x-2">
          <input
            type="text"
            :value="draftUrl"
            readonly
            class="magazine-input flex-1 text-sm"
          />
          <button
            @click="copyDraftUrl"
            class="magazine-btn magazine-btn-secondary text-sm"
          >
            复制
          </button>
        </div>
      </div>

      <!-- 二维码 -->
      <div v-if="qrCodeUrl" class="mb-4">
        <label class="block text-sm font-medium text-[#a0a0b0] mb-2">扫码查看草稿</label>
        <div class="flex justify-center bg-[#0a0a0c] p-4 rounded-lg border border-white/10">
          <img :src="qrCodeUrl" alt="草稿二维码" class="w-32 h-32" />
        </div>
      </div>

      <!-- 错误信息 -->
      <div v-if="error" class="mb-4 p-3 bg-[#f87171]/10 border border-[#f87171]/30 rounded-lg">
        <p class="text-sm text-[#f87171]">{{ error }}</p>
      </div>

      <!-- 按钮 -->
      <div class="flex justify-end space-x-3">
        <button
          v-if="showCancel"
          @click="$emit('cancel')"
          class="magazine-btn magazine-btn-secondary"
        >
          取消
        </button>
        <button
          @click="$emit('confirm')"
          class="magazine-btn bg-gradient-to-r from-[#ff6b4a] to-[#ff8566] text-white"
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