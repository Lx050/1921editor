<template>
  <div
    ref="containerRef"
    class="relative overflow-hidden"
    :style="{ height: computedHeight }"
    :class="wrapperClass"
  >
    <!-- 占位符 -->
    <div
      v-if="!isLoaded && placeholder"
      class="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center"
    >
      <div class="w-full h-full bg-gray-200" />
    </div>

    <!-- 图片 -->
    <img
      v-show="isLoaded"
      ref="imgRef"
      :src="src"
      :alt="alt"
      :class="imgClass"
      :style="{ objectFit }"
      @load="handleLoad"
      @error="handleError"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'

const props = defineProps({
  src: {
    type: String,
    required: true
  },
  alt: {
    type: String,
    default: ''
  },
  placeholder: {
    type: Boolean,
    default: true
  },
  width: {
    type: [String, Number],
    default: null
  },
  height: {
    type: [String, Number],
    default: null
  },
  objectFit: {
    type: String,
    default: 'cover'
  },
  wrapperClass: {
    type: [String, Object],
    default: ''
  },
  imgClass: {
    type: [String, Object],
    default: ''
  },
  threshold: {
    type: Number,
    default: 0.1
  }
})

const emit = defineEmits(['load', 'error'])

const containerRef = ref(null)
const imgRef = ref(null)
const isLoaded = ref(false)
const observer = ref(null)

const computedHeight = computed(() => {
  if (props.height) {
    return typeof props.height === 'number' ? `${props.height}px` : props.height
  }
  return 'auto'
})

const handleLoad = () => {
  isLoaded.value = true
  emit('load')
}

const handleError = () => {
  isLoaded.value = true
  emit('error')
}

onMounted(() => {
  if ('IntersectionObserver' in window && props.threshold) {
    observer.value = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target.querySelector('img')
            if (img && img.dataset.src) {
              img.src = img.dataset.src
            }
            observer.value.unobserve(entry.target)
          }
        })
      },
      {
        threshold: props.threshold
      }
    )

    if (containerRef.value) {
      observer.value.observe(containerRef.value)

      // 如果有图片元素，先将 src 存储到 data-src 中
      const img = containerRef.value.querySelector('img')
      if (img) {
        img.dataset.src = props.src
        img.src = ''
      }
    }
  } else {
    // 不支持 IntersectionObserver 时直接加载
    if (imgRef.value) {
      imgRef.value.src = props.src
    }
  }
})

onUnmounted(() => {
  if (observer.value) {
    observer.value.disconnect()
  }
})
</script>