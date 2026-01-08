<template>
  <div
    class="md:w-72 flex-shrink-0 border-r-0 md:border-r border-b md:border-b-0 h-full flex flex-col"
    style="background: var(--color-content-bg-soft); border-color: var(--color-content-border);"
  >
    <!-- 桌面端左侧图片库（纵向滚动）-->
    <div class="hidden md:flex md:flex-col h-full overflow-hidden">
      <div class="flex-shrink-0 p-4 border-b" style="background: var(--color-content-card); border-color: var(--color-content-border);">
        <h3 class="font-semibold" style="color: var(--color-content-text);">微信图片库</h3>
        <p class="text-sm mt-1" style="color: var(--color-content-text-secondary);">
          点击预览中的占位符图片，再从左侧选择图片替换
        </p>
      </div>
      <div class="flex-1 overflow-y-auto p-2">
        <WechatImageGallery
          v-if="wechatImages.length > 0"
          :images="wechatImages"
          :selectedPlaceholder="selectedPlaceholder"
          @select="handleImageSelect"
        />
        <div v-else class="h-full flex flex-col items-center justify-center p-6 text-center">
          <div class="text-3xl mb-3 opacity-30">🖼️</div>
          <p class="text-sm text-gray-400">微信图片库为空</p>
          <p class="text-xs text-gray-400 mt-1">请在步骤2插入图片或上传图片</p>
        </div>
      </div>
    </div>

    <!-- 移动端顶部横向滚动图片库（固定高度）-->
    <div class="md:hidden bg-white border-b" v-if="wechatImages.length > 0">
      <div class="p-3">
        <h3 class="font-semibold text-gray-900 text-sm">微信图片库</h3>
        <p class="text-xs text-gray-600 mt-1">
          点击下方预览中的占位符，然后在此处选择图片
        </p>
      </div>
      <div class="px-3 pb-3 overflow-x-auto">
        <WechatImageGallery
          :images="wechatImages"
          :selectedPlaceholder="selectedPlaceholder"
          @select="handleImageSelect"
          :mobileLayout="true"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { } from 'vue'
import WechatImageGallery from './WechatImageGallery.vue'
import type { WechatImage } from '../types/wechat'

const props = defineProps<{
  wechatImages: WechatImage[]
  selectedPlaceholder: string | null
}>()

const emit = defineEmits<{
  select: [image: WechatImage, placeholder: string]
}>()


const handleImageSelect = (image: WechatImage) => {
  if (props.selectedPlaceholder) {
    emit('select', image, props.selectedPlaceholder)
  }
}
</script>