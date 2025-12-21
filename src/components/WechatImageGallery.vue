<template>
  <!-- 桌面端（纵向布局）-->
  <div v-if="!mobileLayout" class="h-full flex flex-col bg-gray-50">
    <!-- 标题栏 -->
    <div class="flex-shrink-0 px-4 py-3 bg-white border-b">
      <h3 class="text-sm font-semibold text-gray-700">微信图片库</h3>
      <p class="text-xs text-gray-500 mt-1">
        {{ successfulImages.length }} 张图片可用
        <span v-if="selectedPlaceholder" class="text-blue-600 ml-2">
          | 点击图片进行替换
        </span>
      </p>
    </div>

    <!-- 图片网格 - 两列布局 -->
    <div class="flex-1 overflow-y-auto p-4">
      <!-- 空状态 -->
      <div v-if="successfulImages.length === 0" class="flex flex-col items-center justify-center h-full text-gray-400">
        <svg class="w-12 h-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p class="text-sm">暂无可用图片</p>
        <p class="text-xs mt-1">上传 ZIP 压缩包以提取图片</p>
      </div>

      <!-- 图片列表 - 两列网格布局，增加间距 -->
      <div v-else class="grid grid-cols-2 gap-4">
        <div
          v-for="image in successfulImages"
          :key="image.id"
          @click="selectImage(image)"
          :class="[
            'relative rounded-lg overflow-hidden cursor-pointer transition-all',
            selectedPlaceholder
              ? 'hover:ring-4 hover:ring-blue-400 hover:shadow-lg transform hover:scale-[1.02]'
              : 'opacity-60 cursor-not-allowed'
          ]"
        >
          <!-- 图片 - 4:3 比例，使用懒加载 -->
          <LazyImage
            :src="image.localPreviewUrl || image.url"
            :alt="image.name"
            :width="200"
            :height="150"
            class="aspect-[4/3]"
            img-class="w-full h-full object-cover"
            :placeholder="true"
            :threshold="0.1"
          />

          <!-- 图片名称 -->
          <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-2 py-1.5">
            <p class="text-xs text-white truncate">{{ image.name }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部提示 -->
    <div v-if="!selectedPlaceholder && successfulImages.length > 0" class="flex-shrink-0 px-4 py-3 bg-amber-50 border-t border-amber-100">
      <p class="text-xs text-amber-700">
        💡 请先点击右侧预览中的占位符图片
      </p>
    </div>
  </div>

  <!-- 移动端（横向布局）-->
  <div v-else class="h-full flex flex-row items-center gap-2 px-3 py-2 overflow-x-auto overflow-y-hidden bg-gray-50">
    <div
      v-for="image in successfulImages"
      :key="image.id"
      @click="selectImage(image)"
      class="flex-shrink-0 w-20 h-24 rounded-lg overflow-hidden cursor-pointer transition-all bg-gray-200"
      :class="{
        'ring-2 ring-blue-500 shadow-lg': selectedPlaceholder,
        'opacity-60 cursor-not-allowed': !selectedPlaceholder,
        'hover:ring-4 hover:ring-blue-400 hover:shadow-lg': selectedPlaceholder
      }"
    >
      <LazyImage
        :src="image.localPreviewUrl || image.url"
        :alt="image.name"
        width="80"
        height="96"
        class="w-full h-full"
        img-class="w-full h-full object-cover"
        :placeholder="true"
        :threshold="0.1"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { WechatImage } from '@/types'
import LazyImage from './LazyImage.vue'

interface Props {
  images: WechatImage[]
  selectedPlaceholder?: string | null
  mobileLayout?: boolean
}

interface Emits {
  (e: 'select', image: WechatImage): void
}

const props = withDefaults(defineProps<Props>(), {
  mobileLayout: false
})

const emit = defineEmits<Emits>()

// 只显示上传成功的图片
const successfulImages = computed(() => {
  return props.images.filter(img => img.status === 'success' && (img.localPreviewUrl || img.url))
})

const selectImage = (image: WechatImage) => {
  if (!props.selectedPlaceholder) {
    console.log('[Gallery] 请先选择占位符')
    return
  }
  
  emit('select', image)
}
</script>
