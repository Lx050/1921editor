<template>
  <div
    class="h-full overflow-auto bg-gray-100"
    :class="{
      'md:p-8': showMobileFrame,
      'p-0': !showMobileFrame
    }"
  >
    <!-- 真机预览框架 -->
    <div
      v-if="showMobileFrame"
      class="mx-auto max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
      style="height: 844px; width: 390px;"
    >
      <!-- iPhone 状态栏 -->
      <div class="bg-black text-white text-xs px-6 py-1 flex justify-between items-center">
        <span>{{ currentTime }}</span>
        <div class="flex items-center space-x-1">
          <span>📶</span>
          <span>📶</span>
          <span>🔋</span>
        </div>
      </div>

      <!-- 微信顶部导航栏 -->
      <div class="bg-[#ededed] px-4 py-2 flex items-center justify-between border-b">
        <div class="flex items-center space-x-3">
          <span class="text-lg">◀</span>
          <span class="font-medium">{{ wechatTitle }}</span>
        </div>
        <div class="flex items-center space-x-3">
          <span>🔍</span>
          <span>⋯</span>
        </div>
      </div>

      <!-- 文章标题栏 -->
      <div class="bg-white px-4 py-3 border-b">
        <h1 class="text-lg font-bold text-center text-gray-900">{{ articleTitle }}</h1>
      </div>

      <!-- 预览内容区域 -->
      <div
        class="overflow-auto bg-white"
        style="height: calc(100% - 140px);"
        v-html="previewHtml"
        @click="handlePreviewClick"
      ></div>
    </div>

    <!-- 普通预览（无框架） -->
    <div
      v-else
      class="max-w-3xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden"
      v-html="previewHtml"
      @click="handlePreviewClick"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  previewHtml: string
  showMobileFrame: boolean
  wechatTitle?: string
  articleTitle?: string
}>()

const emit = defineEmits<{
  placeholderClick: [placeholder: string]
}>()

const currentTime = ref('')

const updateTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

let timer: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  updateTime()
  timer = setInterval(updateTime, 60000)
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
})

const handlePreviewClick = (event: MouseEvent) => {
  const target = event.target as HTMLElement

  // 查找最近的占位符父元素
  const placeholderEl = target.closest('[data-placeholder]')
  if (placeholderEl) {
    const placeholder = placeholderEl.getAttribute('data-placeholder')
    if (placeholder) {
      emit('placeholderClick', placeholder)
    }
  }
}
</script>