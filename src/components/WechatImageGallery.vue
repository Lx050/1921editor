<template>
  <!-- 桌面端（纵向布局）-->
  <div v-if="!mobileLayout" class="h-full flex flex-col" style="background:var(--color-bg-warm);">
    <!-- 标题栏 -->
    <div class="flex-shrink-0 px-4 py-3 bg-white border-b">
      <h3 class="text-sm font-semibold" style="color:rgba(0,0,0,0.65);">微信图片库</h3>
      <p class="text-xs mt-1" style="color:rgba(0,0,0,0.45);">
        {{ successfulImages.length }} 张图片可用
        <span v-if="selectedPlaceholder" class="ml-2" style="color: var(--color-accent-primary);">
          | 点击图片进行替换
        </span>
      </p>
    </div>

    <!-- 图片网格 - 两列布局，保持原始比例 -->
    <div class="flex-1 overflow-y-auto p-3">
      <!-- 空状态 -->
      <div v-if="successfulImages.length === 0" class="flex flex-col items-center justify-center h-full" style="color:var(--color-text-muted);">
        <svg class="w-12 h-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p class="text-sm">暂无可用图片</p>
        <p class="text-xs mt-1">上传 ZIP 压缩包以提取图片</p>
      </div>

      <!-- 图片列表 - 两列瀑布流布局 -->
      <div v-else class="grid grid-cols-2 gap-3">
        <div
          v-for="image in successfulImages"
          :key="image.id"
          @click="selectImage(image)"
          class="relative rounded-xl overflow-hidden cursor-pointer transition-all duration-200 group" style="background:var(--color-bg-warm);"
          :class="[
            selectedPlaceholder
              ? 'hover:shadow-lg hover:-translate-y-0.5'
              : 'opacity-50 cursor-not-allowed'
          ]"
        >
          <!-- 图片容器 - 保持原始比例 -->
          <div 
            class="relative w-full overflow-hidden"
            :style="getImageContainerStyle(image)"
          >
            <img
              :src="image.localPreviewUrl || getWechatProxyUrl(image.url)"
              :alt="image.name"
              class="absolute inset-0 w-full h-full object-cover"
              @load="handleImageLoad($event, image)"
              @error="handleImageError(image)"
            />
            
            <!-- 比例指示器 -->
            <div 
              v-if="imageRatios[image.id]"
              class="absolute top-1.5 right-1.5 text-[10px] font-bold text-white bg-black/50 backdrop-blur-sm rounded px-1.5 py-0.5"
            >
              {{ formatRatio(imageRatios[image.id]) }}
            </div>
            
            <!-- hover 遮罩 -->
            <div 
              v-if="selectedPlaceholder"
              class="absolute inset-0 transition-colors duration-200"
              style="background:transparent;"
              onmouseover="this.style.background='rgba(0,117,222,0.08)'"
              onmouseout="this.style.background='transparent'"
            />
          </div>
          
          <!-- 图片名称 - 始终显示完整名称 -->
          <div class="bg-white px-2 py-2 border-t" style="border-color:rgba(0,0,0,0.08);">
            <p
              class="text-xs font-medium leading-tight break-words" style="color:rgba(0,0,0,0.65);"
              :title="image.name"
            >
              {{ getDisplayName(image.name) }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- 提示区域 -->
    <div v-if="!selectedPlaceholder && successfulImages.length > 0" class="flex-shrink-0 px-3 py-2 bg-amber-50 border-t border-amber-100">
      <p class="text-xs text-amber-700">
        请先点击右侧预览中的占位符图片
      </p>
    </div>
  </div>

  <!-- 移动端（横向布局）-->
  <div v-else class="h-full flex flex-row items-center gap-2 px-3 py-2 overflow-x-auto overflow-y-hidden bg-white scrollbar-hide">
    <div v-if="successfulImages.length === 0" class="text-center py-4 w-full" style="color:var(--color-text-muted);">
      <p class="text-sm">暂无图片</p>
    </div>
    <div
      v-for="image in successfulImages"
      :key="image.id"
      @click="selectImage(image)"
      class="flex-shrink-0 rounded-lg overflow-hidden cursor-pointer transition-all shadow-sm" style="background:var(--color-bg-warm); border:1px solid rgba(0,0,0,0.08);"
      :class="{
        'shadow-lg': selectedPlaceholder,
        'opacity-60 cursor-not-allowed': !selectedPlaceholder,
        'active:scale-95': selectedPlaceholder
      }"
      :style="getMobileImageStyle(image)"
    >
      <img
        :src="image.localPreviewUrl || getWechatProxyUrl(image.url)"
        :alt="image.name"
        class="w-full h-full object-cover"
        @load="handleImageLoad($event, image)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue'
import type { WechatImage } from '@/types'
import { getWechatProxyUrl } from '../utils/wechatApi'

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

// 存储每张图片的实际宽高比
const imageRatios = reactive<Record<string, number>>({})

// 移动端基准高度 - 增大一点更适合点击
const MOBILE_BASE_HEIGHT = 64

// 只显示上传成功的图片
const successfulImages = computed(() => {
  return props.images.filter(img => img.status === 'success' && (img.localPreviewUrl || img.url))
})

// 处理图片加载，获取真实比例
const handleImageLoad = (event: Event, image: WechatImage) => {
  const img = event.target as HTMLImageElement
  if (img.naturalWidth && img.naturalHeight) {
    imageRatios[image.id] = img.naturalWidth / img.naturalHeight
  }
}

// 处理图片加载失败
const handleImageError = (image: WechatImage) => {
  console.warn('[Gallery] 图片加载失败:', image.name)
}

// 桌面端：根据图片比例计算容器高度（宽度固定，高度自适应）
const getImageContainerStyle = (image: WechatImage) => {
  const ratio = imageRatios[image.id]
  
  if (ratio) {
    // 根据比例计算高度（宽度占满容器）
    // 使用 padding-bottom 技巧保持比例
    const paddingBottom = (1 / ratio) * 100
    return {
      paddingBottom: `${Math.min(Math.max(paddingBottom, 60), 150)}%` // 限制在 60%-150% 之间
    }
  }
  
  // 默认使用 4:3 比例
  return {
    paddingBottom: '75%'
  }
}

// 移动端：根据图片比例计算容器尺寸
const getMobileImageStyle = (image: WechatImage) => {
  const ratio = imageRatios[image.id]
  
  if (ratio) {
    const width = Math.round(MOBILE_BASE_HEIGHT * ratio)
    const clampedWidth = Math.min(Math.max(width, 40), 100)
    return {
      width: `${clampedWidth}px`,
      height: `${MOBILE_BASE_HEIGHT}px`
    }
  }
  
  // 默认正方形
  return {
    width: `${MOBILE_BASE_HEIGHT}px`,
    height: `${MOBILE_BASE_HEIGHT}px`
  }
}

// 格式化比例显示
const formatRatio = (ratio: number): string => {
  if (ratio >= 1.2 && ratio <= 1.4) return '4:3'
  if (ratio >= 1.7 && ratio <= 1.8) return '16:9'
  if (ratio >= 0.7 && ratio <= 0.85) return '3:4'
  if (ratio >= 0.5 && ratio <= 0.6) return '9:16'
  if (ratio >= 0.95 && ratio <= 1.05) return '1:1'
  return ''
}

// 提取显示名称（移除扩展名，保留更多字符）
const getDisplayName = (name: string): string => {
  // 移除常见图片扩展名
  const cleanName = name.replace(/\.(jpe?g|png|gif|webp|bmp|svg)$/i, '')
  // 限制长度，但比移动端宽松
  return cleanName.length > 20 ? cleanName.substring(0, 20) + '...' : cleanName
}

const selectImage = (image: WechatImage) => {
  if (!props.selectedPlaceholder) {
    return
  }
  
  emit('select', image)
}
</script>

<style scoped>
/* 隐藏滚动条 */
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>

