<template>
  <div
    class="md:w-[360px] flex-shrink-0 bg-gray-50 border-r-0 md:border-r border-b md:border-b-0"
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

    <!-- 移动端顶部横向滚动图片库（固定高度）-->
    <div class="md:hidden bg-white border-b">
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
import { computed } from 'vue'
import WechatImageGallery from './WechatImageGallery.vue'
import type { WechatImage } from '../types/wechat'

const props = defineProps<{
  wechatImages: WechatImage[]
  selectedPlaceholder: string | null
}>()

const emit = defineEmits<{
  select: [image: WechatImage, placeholder: string]
}>()

const hasWechatImages = computed(() => props.wechatImages.length > 0)

const handleImageSelect = (image: WechatImage) => {
  if (props.selectedPlaceholder) {
    emit('select', image, props.selectedPlaceholder)
  }
}
</script>