<template>
  <div class="optimized-image-container" :class="{ 'lazy-loading': lazy }">
    <!-- 加载占位符 -->
    <div
      v-if="loading && !loaded"
      class="image-placeholder skeleton"
      :style="{ width: width, height: height }"
    >
      <div class="placeholder-content">
        <svg class="placeholder-icon" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/>
          <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/>
          <path d="M21 15l-5-5L5 21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
    </div>

    <!-- 优化后的图片 -->
    <img
      ref="imgRef"
      :src="currentSrc"
      :alt="alt"
      :width="width"
      :height="height"
      :loading="lazy ? 'lazy' : 'eager'"
      :decoding="async ? 'async' : 'sync'"
      :class="['optimized-image', { 'image-loaded': loaded }]"
      @load="onImageLoad"
      @error="onImageError"
    />

    <!-- 渐进式增强：低质量图片占位符 -->
    <img
      v-if="placeholderSrc && !loaded"
      :src="placeholderSrc"
      :alt="alt"
      class="placeholder-image"
      :style="{ width: width, height: height }"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  src: {
    type: String,
    required: true
  },
  alt: {
    type: String,
    default: ''
  },
  width: {
    type: [String, Number],
    default: '100%'
  },
  height: {
    type: [String, Number],
    default: 'auto'
  },
  lazy: {
    type: Boolean,
    default: true
  },
  placeholderSrc: {
    type: String,
    default: ''
  },
  sizes: {
    type: String,
    default: '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw'
  },
  formats: {
    type: Array,
    default: () => ['webp', 'avif', 'jpg']
  }
})

const imgRef = ref(null)
const loading = ref(true)
const loaded = ref(false)
const error = ref(false)
const observer = ref(null)

// 响应式图片源
const currentSrc = computed(() => {
  if (!props.src) return ''

  // 根据浏览器支持选择最佳格式
  if (supportsWebP.value && props.formats.includes('webp')) {
    return props.src.replace(/\.(jpg|jpeg|png)$/, '.webp')
  }
  if (supportsAVIF.value && props.formats.includes('avif')) {
    return props.src.replace(/\.(jpg|jpeg|png|webp)$/, '.avif')
  }

  return props.src
})

// 检测 WebP 支持
const supportsWebP = ref(false)
const supportsAVIF = ref(false)

// 检测图片格式支持
function checkFormatSupport() {
  // WebP 支持
  const webp = new Image()
  webp.onload = () => {
    supportsWebP.value = webp.width > 0
  }
  webp.onerror = () => {
    supportsWebP.value = false
  }
  webp.src = 'data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAwA0JaQAA3AA/vuUAAA='

  // AVIF 支持
  const avif = new Image()
  avif.onload = () => {
    supportsAVIF.value = avif.width > 0
  }
  avif.onerror = () => {
    supportsAVIF.value = false
  }
  avif.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAEAAAABAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACJtZGF0EgAKCBgAYhkMDQsBAQxDZwAQIwhvaHlmaWYAAAAAAQIDAAACAmNoZW5ceUAAABFTk1PSIgc3RlbmNpbzo0LjIuMQAAAFNJRklUUQBD'
}

onMounted(() => {
  checkFormatSupport()

  if (props.lazy && imgRef.value) {
    setupIntersectionObserver()
  } else {
    // 如果不是懒加载，立即加载图片
    loadImage()
  }
})

onBeforeUnmount(() => {
  if (observer.value) {
    observer.value.disconnect()
  }
})

function setupIntersectionObserver() {
  observer.value = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          loadImage()
          observer.value.unobserve(entry.target)
        }
      })
    },
    {
      rootMargin: '50px 0px', // 提前 50px 开始加载
      threshold: 0.01
    }
  )

  if (imgRef.value) {
    observer.value.observe(imgRef.value)
  }
}

function loadImage() {
  if (imgRef.value && imgRef.value.src !== currentSrc.value) {
    imgRef.value.src = currentSrc.value
  }
}

function onImageLoad() {
  loading.value = false
  loaded.value = true
  error.value = false
}

function onImageError() {
  loading.value = false
  error.value = true
  console.error('Image load error:', props.src)
}

// 暴露方法供父组件调用
defineExpose({
  reload: loadImage,
  element: imgRef
})
</script>

<style scoped>
.optimized-image-container {
  position: relative;
  display: inline-block;
  overflow: hidden;
}

.image-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f3f4f6;
}

.placeholder-content {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
}

.placeholder-icon {
  width: 24px;
  height: 24px;
}

.optimized-image {
  display: block;
  max-width: 100%;
  height: auto;
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
}

.image-loaded {
  opacity: 1;
}

.placeholder-image {
  position: absolute;
  top: 0;
  left: 0;
  filter: blur(20px);
  transform: scale(1.1);
  opacity: 1;
  transition: opacity 0.3s ease-in-out;
}

.optimized-image.image-loaded + .placeholder-image {
  opacity: 0;
}

/* 骨架屏动画 */
@keyframes shimmer {
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
}

.skeleton {
  background: linear-gradient(
    90deg,
    #f0f0f0 25%,
    #e0e0e0 50%,
    #f0f0f0 75%
  );
  background-size: 1000px 100%;
  animation: shimmer 2s infinite;
}

/* 懒加载优化 */
.lazy-loading {
  contain-intrinsic-size: 0 0;
  content-visibility: auto;
}
</style>