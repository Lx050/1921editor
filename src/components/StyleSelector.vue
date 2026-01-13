<template>
  <div class="h-full flex flex-col" style="background: var(--color-content-bg-soft);">
    <!-- 标题 -->
    <div class="p-3 md:p-4 border-b" style="border-color: var(--color-content-border);">
      <h3 class="text-sm md:text-base font-bold" style="color: var(--color-content-text);">样式选择</h3>
      <p class="text-[10px] md:text-xs mt-0.5 md:mt-1" style="color: var(--color-content-text-secondary);">已选样式将应用于当前块</p>
    </div>

    <!-- Tab 切换 -->
    <div class="flex border-b" style="border-color: var(--color-content-border);">
      <button
        v-for="tab in tabs"
        :key="tab.value"
        @click="activeTab = tab.value"
        :class="[
          'flex-1 px-2 py-2 text-xs md:text-sm font-medium transition-all duration-200 relative',
          activeTab === tab.value
            ? 'text-[#ff6b4a]'
            : 'text-gray-500 hover:text-black'
        ]"
      >
        {{ tab.label }}
        <div
          v-if="activeTab === tab.value"
          class="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#ff6b4a] to-[#d4a574]"
        ></div>
      </button>
    </div>

    <!-- 缩略图网格 -->
    <div class="flex-1 overflow-y-auto scrollbar-hide">
      <!-- API 样式区域（上面） -->
      <div v-if="currentApiStyles.length > 0" class="p-2 md:p-3">
        <div class="flex items-center justify-between mb-2 px-1">
          <span class="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-tight">Backend</span>
          <span class="text-[10px] text-gray-400">{{ currentApiStyles.length }}</span>
        </div>
        <div class="grid grid-cols-2 gap-2">
          <div
            v-for="style in currentApiStyles"
            :key="`api-${style.id}`"
            @click="selectStyle(style)"
            :class="[
              'relative cursor-pointer border-2 rounded-lg p-1.5 md:p-2 transition-all duration-200',
              isSelected(style)
                ? 'border-[#ff6b4a] bg-orange-50 shadow-md transform scale-[1.02]'
                : 'border-transparent hover:border-gray-200 bg-white hover:shadow-sm'
            ]"
          >
            <!-- 缩略图预览 -->
            <div class="h-16 md:h-20 overflow-hidden rounded bg-white border border-gray-200 flex items-center justify-center p-2">
              <div class="preview-wrapper">
                <div class="preview-container" v-html="sanitizeHtmlForPreview(getPreviewWithContent(style))"></div>
              </div>
            </div>

            <!-- 样式名称 -->
            <div class="mt-1 text-[9px] md:text-[10px] text-center font-bold truncate" :class="isSelected(style) ? 'text-[#ff6b4a]' : 'text-gray-500'">
              {{ style.name }}
            </div>

            <!-- 选中标记 -->
            <div v-if="isSelected(style)" class="absolute top-1 right-1 w-4 h-4 md:w-5 md:h-5 bg-gradient-to-br from-[#ff6b4a] to-[#ff8566] rounded-full flex items-center justify-center shadow-lg">
              <svg class="w-2.5 h-2.5 md:w-3 md:h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- 本地样式区域（下面） -->
      <div v-if="currentLocalStyles.length > 0" class="p-2 md:p-3 border-t" style="border-color: var(--color-content-border);">
        <div class="flex items-center justify-between mb-2 px-1">
          <span class="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-tight">Local</span>
          <span class="text-[10px] text-gray-400">{{ currentLocalStyles.length }}</span>
        </div>
        <div class="grid grid-cols-2 gap-2">
          <div
            v-for="style in currentLocalStyles"
            :key="`local-${style.id}`"
            @click="selectStyle(style)"
            :class="[
              'relative cursor-pointer border-2 rounded-lg p-1.5 md:p-2 transition-all duration-200',
              isSelected(style)
                ? 'border-[#ff6b4a] bg-orange-50 shadow-md transform scale-[1.02]'
                : 'border-transparent hover:border-gray-200 bg-white hover:shadow-sm'
            ]"
          >
            <!-- 缩略图预览 -->
            <div class="h-16 md:h-20 overflow-hidden rounded bg-white border border-gray-200 flex items-center justify-center p-2">
              <div class="preview-wrapper">
                <div class="preview-container" v-html="sanitizeHtmlForPreview(getPreviewWithContent(style))"></div>
              </div>
            </div>

            <!-- 样式名称 -->
            <div class="mt-1 text-[9px] md:text-[10px] text-center font-bold truncate" :class="isSelected(style) ? 'text-[#ff6b4a]' : 'text-gray-500'">
              {{ style.name }}
            </div>

            <!-- 选中标记 -->
            <div v-if="isSelected(style)" class="absolute top-1 right-1 w-4 h-4 md:w-5 md:h-5 bg-gradient-to-br from-[#ff6b4a] to-[#ff8566] rounded-full flex items-center justify-center shadow-lg">
              <svg class="w-2.5 h-2.5 md:w-3 md:h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-if="currentApiStyles.length === 0 && currentLocalStyles.length === 0" class="text-center py-8 text-[#606070] text-sm">
        暂无样式
      </div>
    </div>

    <!-- 管理样式库按钮 -->
    <div class="p-2 md:p-3 border-t" style="border-color: var(--color-content-border);">
      <button
        @click="goToStyleConfig"
        class="w-full px-3 md:px-4 py-2 bg-white hover:bg-gray-50 text-black font-bold rounded-lg transition-all duration-200 text-[10px] md:text-xs flex items-center justify-center space-x-2 border border-gray-200 shadow-sm"
      >
        <span>🎨</span>
        <span>管理样式库</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '../stores/appStore'
import { useStyleStore } from '../stores/styleStore'
import { sanitizeHtml, sanitizeHtmlForPreview } from '../utils/sanitizeHtml'

const router = useRouter()
const appStore = useAppStore()
const styleStore = useStyleStore()

// Tab 配置
const tabs = [
  { value: 'title', label: '标题' },
  { value: 'body', label: '正文' },
  { value: 'intro', label: '引言' },
  { value: 'container', label: '容器' }
]

// 当前激活的 Tab
const activeTab = ref('title')

// 当前显示的 API 样式列表
const currentApiStyles = computed(() => {
  switch (activeTab.value) {
    case 'title': return styleStore.apiTitleStyles
    case 'body': return styleStore.apiBodyStyles
    case 'intro': return styleStore.apiIntroStyles
    case 'container': return styleStore.apiContainerStyles || []
    default: return []
  }
})

// 当前显示的本地样式列表
const currentLocalStyles = computed(() => {
  switch (activeTab.value) {
    case 'title': return styleStore.localTitleStyles
    case 'body': return styleStore.localBodyStyles
    case 'intro': return styleStore.localIntroStyles
    case 'container': return styleStore.localContainerStyles || []
    default: return []
  }
})

// 判断样式是否被选中
const isSelected = (style) => {
  const config = appStore.styleConfig
  if (!config) return false

  switch (style.type) {
    case 'title':
      return config.title?.id === style.id
    case 'body':
      return config.body?.id === style.id
    case 'intro':
      return config.intro?.id === style.id
    case 'container':
      return config.container?.id === style.id
    default:
      return false
  }
}

// 获取带示例文字的预览HTML
const getPreviewWithContent = (style) => {
  const sampleText = '西大'
  let html = style.fullExample || style.preview || ''

  // 替换任意占位符为示例文字
  html = html.replace(/\{\{[^}]+\}\}/g, sampleText)

  // 若模板未包含占位符，追加一个可见示例
  if (!html.includes(sampleText)) {
    html += `<div style="margin-top: 6px; text-align: center; font-size: 14px; color: #333;">${sampleText}</div>`
  }

  return html
}

// 选择样式
const selectStyle = (style) => {
  const currentConfig = appStore.styleConfig || {}

  const newConfig = {
    ...currentConfig,
    [style.type]: {
      ...style,
      fullExample: style.fullExample
    }
  }

  appStore.setStyleConfig(newConfig)
}

// 跳转到样式管理页面
const goToStyleConfig = () => {
  router.push('/style-config')
}

// 组件挂载时加载样式
onMounted(() => {
  styleStore.fetchStyles()
})
</script>

<style scoped>
/* 组件特定样式 */

/* 缩略图预览包装器 */
.preview-wrapper {
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  align-items: flex-start;
  justify-content: center;
}

/* 缩略图预览容器缩放 */
.preview-container {
  width: 320px;
  transform: scale(0.28);
  transform-origin: top center;
  max-width: none;
}

@media (min-width: 768px) {
  .preview-container {
    transform: scale(0.26);
  }
}

/* 确保预览内容中的文字显示清晰 */
.preview-container :deep(*) {
  box-sizing: border-box !important;
}
</style>
