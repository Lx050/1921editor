<template>
  <div ref="containerRef" class="smart-image-container" :class="containerClass">
    <!-- 关键图片（首屏可见）- 立即加载 -->
    <img
      v-if="isCritical"
      :src="optimizedSrc"
      :alt="alt"
      :width="width"
      :height="height"
      :class="imgClass"
      :loading="'eager'"
      :decoding="'sync'"
      :style="imgStyle"
      @load="handleLoad"
      @error="handleError"
    />

    <!-- 非关键图片 - 使用Intersection Observer懒加载 -->
    <img
      v-else-if="isVisible"
      :src="optimizedSrc"
      :alt="alt"
      :width="width"
      :height="height"
      :class="imgClass"
      :loading="'lazy'"
      :decoding="'async'"
      :style="imgStyle"
      @load="handleLoad"
      @error="handleError"
    />

    <!-- 占位符 -->
    <div
      v-else
      :class="[
        'image-placeholder',
        imgClass,
        { 'animate-pulse': placeholderAnimated }
      ]"
      :style="placeholderStyle"
    >
      <svg
        v-if="showPlaceholderIcon"
        class="w-8 h-8 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="1.5"
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

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
    type: [Number, String],
    default: null
  },
  height: {
    type: [Number, String],
    default: null
  },
  imgClass: {
    type: String,
    default: ''
  },
  containerClass: {
    type: String,
    default: ''
  },
  // 是否为关键图片（首屏可见）
  critical: {
    type: Boolean,
    default: false
  },
  // 占位符动画
  placeholderAnimated: {
    type: Boolean,
    default: true
  },
  // 显示占位符图标
  showPlaceholderIcon: {
    type: Boolean,
    default: false
  },
  // 交叉观察器的阈值
  threshold: {
    type: Number,
    default: 0.1
  },
  // 根距（提前多少像素开始加载）
  rootMargin: {
    type: String,
    default: '50px'
  },
  // 图片质量 (1-100)
  quality: {
    type: Number,
    default: 80
  }
})

const emit = defineEmits(['load', 'error'])

const containerRef = ref(null)
const isVisible = ref(false)
const hasLoaded = ref(false)
const hasError = ref(false)
const isCritical = ref(props.critical)

// 检测图片是否在首屏
const checkIfCritical = () => {
  if (props.critical) {
    isCritical.value = true
    return
  }

  // 检查图片是否在视口内
  if (containerRef.value) {
    const rect = containerRef.value.getBoundingClientRect()
    const isInViewport = rect.top >= 0 && rect.top <= window.innerHeight
    if (isInViewport) {
      isCritical.value = true
    }
  }
}

// 优化后的图片URL（添加WebP支持）
const optimizedSrc = computed(() => {
  const url = props.src

  // 如果是外部URL或已经包含查询参数，直接返回
  if (url.startsWith('http') || url.includes('?')) {
    return url
  }

  // 检测浏览器是否支持WebP
  const supportsWebP = document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') === 0

  // 生成优化后的URL
  const optimized = new URL(url, window.location.origin)

  if (supportsWebP) {
    // 优先使用WebP格式
    optimized.searchParams.set('format', 'webp')
  }

  // 设置图片质量
  if (props.quality !== 80) {
    optimized.searchParams.set('quality', props.quality.toString())
  }

  return optimized.toString()
})

// 图片样式
const imgStyle = computed(() => ({
  opacity: hasLoaded.value ? 1 : 0,
  transition: 'opacity 0.3s ease'
}))

// 占位符样式
const placeholderStyle = computed(() => ({
  width: props.width ? `${props.width}px` : '100%',
  height: props.height ? `${props.height}px` : 'auto',
  backgroundColor: '#f3f4f6'
}))

// 处理图片加载
const handleLoad = () => {
  hasLoaded.value = true
  emit('load')
}

// 处理加载错误
const handleError = () => {
  hasError.value = true
  emit('error')
}

// Intersection Observer
let observer = null

const setupObserver = () => {
  if (isCritical.value) return

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          isVisible.value = true
          observer.unobserve(entry.target)
        }
      })
    },
    {
      threshold: props.threshold,
      rootMargin: props.rootMargin
    }
  )

  if (containerRef.value) {
    observer.observe(containerRef.value)
  }
}

onMounted(() => {
  // 延迟检测，确保DOM已经渲染
  setTimeout(() => {
    checkIfCritical()

    if (!isCritical.value) {
      setupObserver()
    }
  }, 100)
})

onUnmounted(() => {
  if (observer) {
    observer.disconnect()
  }
})
</script>

<style scoped>
.smart-image-container {
  display: inline-block;
}

.image-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f3f4f6;
  border-radius: 0.375rem;
}
</style>