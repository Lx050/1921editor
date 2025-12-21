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

      <!-- 图片列表 - 两列网格布局，使用懒加载 -->
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
          <!-- 图片 - 4:3 比例，使用懒加载组件 -->
          <LazyImage
            :src="image.localPreviewUrl || image.url"
            :alt="image.name"
            :width="200"
            :height="150"
            class="aspect-[4/3]"
            img-class="w-full h-full object-cover"
            :placeholder="true"
            :threshold="0.1"
            @load="() => handleImageLoad(image)"
          />

          <!-- 图片名称 -->
          <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
            <p class="text-white text-xs font-medium truncate drop-shadow-lg">
              {{ image.name }}
            </p>
            <p v-if="image.size" class="text-white/70 text-xs truncate drop-shadow">
              {{ formatFileSize(image.size) }}
            </p>
          </div>

          <!-- 选中状态指示器 -->
          <div
            v-if="selectedPlaceholder"
            class="absolute top-2 right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white shadow-lg"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-8-8a1 1 0 011.414-1.414l8 8zm0 0a1 1 0 001.414 1.414l-8-8a1 1 0 10-1.414-1.414l8 8z" clip-rule="evenodd" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 移动端（横向滚动） -->
  <div v-else class="bg-white border-t">
    <!-- 标题栏 -->
    <div class="p-3 border-b bg-gray-50">
      <h3 class="text-sm font-semibold text-gray-700">微信图片库</h3>
      <p class="text-xs text-gray-500 mt-1">
        {{ successfulImages.length }} 张图片可用
      </p>
    </div>

    <!-- 图片列表 - 横向滚动 -->
    <div class="overflow-x-auto p-3">
      <div class="flex space-x-3" style="min-width: max-content;">
        <div
          v-for="image in successfulImages"
          :key="image.id"
          @click="selectImage(image)"
          :class="[
            'flex-shrink-0 w-24 rounded-lg overflow-hidden cursor-pointer transition-all',
            selectedPlaceholder
              ? 'ring-2 ring-blue-500'
              : 'opacity-90 hover:opacity-100'
          ]"
        >
          <!-- 图片 -->
          <LazyImage
            :src="image.localPreviewUrl || image.url"
            :alt="image.name"
            width="96"
            height="72"
            class="aspect-[4/3]"
            img-class="w-full h-full object-cover"
            :placeholder="true"
            :threshold="0.1"
          />

          <!-- 图片名称（移动端） -->
          <div class="mt-1 px-1">
            <p class="text-xs text-gray-800 truncate">
              {{ image.name }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import LazyImage from './LazyImage.vue'

const props = defineProps({
  images: {
    type: Array,
    default: () => []
  },
  selectedPlaceholder: {
    type: String,
    default: null
  },
  mobileLayout: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['select'])

const successfulImages = computed(() => {
  return props.images.filter(img => img.status === 'success')
})

const selectImage = (image) => {
  if (!props.selectedPlaceholder) return

  emit('select', image)
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const handleImageLoad = (image) => {
  console.log(`[WechatImageGallery] Image loaded: ${image.name}`)
}
</script>

<style scoped>
/* 组件特定的样式 */
</style>