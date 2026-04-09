<template>
  <!-- 横向图片快速选择条 - 一键替换 -->
  <div 
    v-if="images.length > 0 && hasPlaceholder"
    class="flex-shrink-0 w-full border-b overflow-hidden"
    style="background: var(--color-bg-warm); border-color: var(--color-content-border);"
  >
    <!-- 提示文字 -->
    <div class="px-3 pt-2 pb-1 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <span class="text-xs font-medium" style="color:rgba(0,0,0,0.45);">📷 图片快选</span>
        <span 
          v-if="selectedPlaceholder" 
          class="text-xs px-2 py-0.5 rounded-full font-medium animate-pulse"
          style="background: var(--color-badge-bg); color: var(--color-accent-primary);"
        >
          已选中占位符，点击图片一键替换
        </span>
        <span v-else class="text-xs" style="color:var(--color-text-muted);">
          请先点击下方预览中的占位符
        </span>
      </div>
      <!-- 图片数量 -->
      <span class="text-xs" style="color:var(--color-text-muted);">{{ images.length }} 张</span>
    </div>

    <!-- 横向滚动图片区 -->
    <div 
      ref="scrollContainer"
      class="flex items-center gap-2 px-3 pb-3 pt-1 overflow-x-auto scrollbar-hide"
      @wheel.passive="handleHorizontalScroll"
    >
      <div
        v-for="image in images"
        :key="image.id"
        @click="handleQuickSelect(image)"
        class="flex-shrink-0 relative rounded-lg overflow-hidden transition-all duration-200 group"
        :class="[
          selectedPlaceholder
            ? 'cursor-pointer hover:shadow-lg hover:-translate-y-0.5 active:scale-95'
            : 'opacity-50 cursor-not-allowed',
        ]"
        @mouseover="(e) => { if (props.selectedPlaceholder) (e.currentTarget as HTMLElement).style.outline = '2px solid var(--color-accent-primary)'; }"
        @mouseout="(e) => { (e.currentTarget as HTMLElement).style.outline = ''; }"
        :style="getImageContainerStyle(image)"
      >
        <!-- 图片缩略图 - 保持原始宽高比 -->
        <img
          :src="image.localPreviewUrl || getProxiedUrl(image.url)"
          :alt="image.name"
          loading="lazy"
          class="w-full h-full object-cover"
          @load="handleImageLoad($event, image)"
          @error="handleImageError(image)"
        />

        <!-- 图片名称标签 - 底部渐变遮罩 -->
        <div 
          class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent px-1.5 py-1"
        >
          <p 
            class="text-[10px] text-white font-medium truncate leading-tight"
            :title="image.name"
          >
            {{ getDisplayName(image.name) }}
          </p>
        </div>

        <!-- 选中反馈动画 -->
        <div 
          v-if="selectedPlaceholder"
          class="absolute inset-0 bg-transparent group-hover:bg-[rgba(0,117,222,0.1)] transition-colors duration-200 pointer-events-none"
        />

        <!-- 比例指示器 (小角标) -->
        <div 
          v-if="imageRatios[image.id]"
          class="absolute top-1 right-1 text-[8px] font-bold text-white bg-black/50 rounded px-1 py-0.5"
        >
          {{ formatRatio(imageRatios[image.id]) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import type { WechatImage } from '@/types'
import { getWechatProxyUrl } from '../utils/wechatApi'

interface Props {
  images: WechatImage[]
  selectedPlaceholder: string | null
}

interface Emits {
  (e: 'select', image: WechatImage): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const scrollContainer = ref<HTMLElement | null>(null)

// 存储每张图片的实际宽高比
const imageRatios = reactive<Record<string, number>>({})

// 基准高度 (px)
const BASE_HEIGHT = 56

// 是否有占位符可替换
const hasPlaceholder = computed(() => props.images.length > 0)

// 代理 URL
const getProxiedUrl = (url: string) => {
  return getWechatProxyUrl(url)
}

// 处理图片加载，获取真实比例
const handleImageLoad = (event: Event, image: WechatImage) => {
  const img = event.target as HTMLImageElement
  if (img.naturalWidth && img.naturalHeight) {
    imageRatios[image.id] = img.naturalWidth / img.naturalHeight
  }
}

// 处理图片加载失败
const handleImageError = (image: WechatImage) => {
  console.warn('[QuickImageStrip] 图片加载失败:', image.name)
}

// 根据图片比例计算容器宽度，保持高度固定
const getImageContainerStyle = (image: WechatImage) => {
  const ratio = imageRatios[image.id]
  
  if (ratio) {
    // 根据真实比例计算宽度
    const width = Math.round(BASE_HEIGHT * ratio)
    // 限制最小/最大宽度
    const clampedWidth = Math.min(Math.max(width, 40), 100)
    return {
      width: `${clampedWidth}px`,
      height: `${BASE_HEIGHT}px`
    }
  }
  
  // 默认使用正方形
  return {
    width: `${BASE_HEIGHT}px`,
    height: `${BASE_HEIGHT}px`
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

// 提取显示名称 (移除扩展名，截断)
const getDisplayName = (name: string): string => {
  // 移除常见图片扩展名
  const cleanName = name.replace(/\.(jpe?g|png|gif|webp|bmp|svg)$/i, '')
  // 限制长度
  return cleanName.length > 10 ? cleanName.substring(0, 10) + '...' : cleanName
}

// 横向滚动支持 (鼠标滚轮转横向)
const handleHorizontalScroll = (e: WheelEvent) => {
  if (scrollContainer.value && Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
    scrollContainer.value.scrollLeft += e.deltaY
  }
}

// 一键替换逻辑
const handleQuickSelect = (image: WechatImage) => {
  if (!props.selectedPlaceholder) {
    return
  }

  emit('select', image)
}
</script>

<style scoped>
/* 隐藏滚动条但保留滚动功能 */
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

/* 平滑滚动 */
.overflow-x-auto {
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
}
</style>
