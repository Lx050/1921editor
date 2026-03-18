<template>
  <div class="h-full flex flex-col" style="background: var(--color-content-bg-soft);">
    <!-- 标题 — 轻量级，融入背景 -->
    <div class="px-4 pt-4 pb-2">
      <h3 class="text-xs font-bold" style="color: var(--color-content-text);">样式选择</h3>
      <p class="text-[10px] mt-0.5" style="color: var(--color-content-text-muted);">点击应用到对应类型的内容块</p>
    </div>

    <!-- Tab 切换 — 胶囊式，无底线 -->
    <div class="px-4 pb-3">
      <div class="flex gap-1 p-0.5 rounded-lg" style="background: var(--color-content-bg-muted);">
        <button
          v-for="tab in tabs"
          :key="tab.value"
          @click="activeTab = tab.value"
          :class="[
            'flex-1 py-1.5 text-[11px] font-semibold rounded-md transition-all duration-200',
            activeTab === tab.value
              ? 'bg-white text-[var(--color-accent-primary)] shadow-sm'
              : 'text-[var(--color-content-text-muted)] hover:text-[var(--color-content-text-secondary)]'
          ]"
        >
          {{ tab.label }}
        </button>
      </div>
    </div>

    <!-- 缩略图网格 — 无 border，纯卡片 -->
    <div class="flex-1 overflow-y-auto scrollbar-hide px-3 pb-3">
      <!-- API 样式 -->
      <div v-if="currentApiStyles.length > 0" class="mb-4">
        <div class="flex items-center justify-between mb-2 px-1">
          <span class="text-[9px] font-bold uppercase tracking-widest" style="color: var(--color-content-text-muted);">云端</span>
          <span class="text-[9px] px-1.5 py-0.5 rounded-full" style="background: var(--color-content-bg-muted); color: var(--color-content-text-muted);">{{ currentApiStyles.length }}</span>
        </div>
        <div class="grid grid-cols-2 gap-2">
          <div
            v-for="style in currentApiStyles"
            :key="`api-${style.id}`"
            @click="selectStyle(style)"
            :class="[
              'relative cursor-pointer rounded-xl p-2 transition-all duration-200',
              isSelected(style)
                ? 'bg-white shadow-[0_0_0_2px_var(--color-accent-primary),0_4px_16px_rgba(0,0,0,0.06)] scale-[1.02]'
                : 'bg-white/50 hover:bg-white hover:shadow-[0_2px_10px_rgba(0,0,0,0.04)]'
            ]"
          >
            <div class="h-20 overflow-hidden rounded-lg flex items-center justify-center" style="background: var(--color-content-bg-muted);">
              <div class="preview-wrapper">
                <div class="preview-container" v-html="sanitizeHtmlForPreview(getPreviewWithContent(style))"></div>
              </div>
            </div>
            <div class="mt-1.5 text-[9px] text-center font-semibold truncate" :style="{ color: isSelected(style) ? 'var(--color-accent-primary)' : 'var(--color-content-text-secondary)' }">
              {{ style.name }}
            </div>
            <div v-if="isSelected(style)" class="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center" style="background: var(--color-accent-primary);">
              <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- 本地样式 -->
      <div v-if="currentLocalStyles.length > 0">
        <div class="flex items-center justify-between mb-2 px-1">
          <span class="text-[9px] font-bold uppercase tracking-widest" style="color: var(--color-content-text-muted);">本地</span>
          <span class="text-[9px] px-1.5 py-0.5 rounded-full" style="background: var(--color-content-bg-muted); color: var(--color-content-text-muted);">{{ currentLocalStyles.length }}</span>
        </div>
        <div class="grid grid-cols-2 gap-2">
          <div
            v-for="style in currentLocalStyles"
            :key="`local-${style.id}`"
            @click="selectStyle(style)"
            :class="[
              'relative cursor-pointer rounded-xl p-2 transition-all duration-200',
              isSelected(style)
                ? 'bg-white shadow-[0_0_0_2px_var(--color-accent-primary),0_4px_16px_rgba(0,0,0,0.06)] scale-[1.02]'
                : 'bg-white/50 hover:bg-white hover:shadow-[0_2px_10px_rgba(0,0,0,0.04)]'
            ]"
          >
            <div class="h-20 overflow-hidden rounded-lg flex items-center justify-center" style="background: var(--color-content-bg-muted);">
              <div class="preview-wrapper">
                <div class="preview-container" v-html="sanitizeHtmlForPreview(getPreviewWithContent(style))"></div>
              </div>
            </div>
            <div class="mt-1.5 text-[9px] text-center font-semibold truncate" :style="{ color: isSelected(style) ? 'var(--color-accent-primary)' : 'var(--color-content-text-secondary)' }">
              {{ style.name }}
            </div>
            <div v-if="isSelected(style)" class="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center" style="background: var(--color-accent-primary);">
              <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-if="currentApiStyles.length === 0 && currentLocalStyles.length === 0" class="text-center py-12">
        <div class="text-2xl mb-2 opacity-30">&#x1F3A8;</div>
        <p class="text-xs" style="color: var(--color-content-text-muted);">暂无样式</p>
      </div>
    </div>

    <!-- 底部按钮 — 融入背景，无硬边框 -->
    <div class="px-3 py-2.5">
      <button
        @click="goToStyleConfig"
        class="w-full py-2 text-[11px] font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-1.5"
        style="background: var(--color-content-bg-muted); color: var(--color-content-text-secondary);"
        onmouseover="this.style.background='var(--color-accent-soft)';this.style.color='var(--color-accent-primary)'"
        onmouseout="this.style.background='var(--color-content-bg-muted)';this.style.color='var(--color-content-text-secondary)'"
      >
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
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

const tabs = [
  { value: 'title', label: '标题' },
  { value: 'body', label: '正文' },
  { value: 'intro', label: '引言' }
]

const activeTab = ref('title')

const currentApiStyles = computed(() => {
  switch (activeTab.value) {
    case 'title': return styleStore.apiTitleStyles
    case 'body': return styleStore.apiBodyStyles
    case 'intro': return styleStore.apiIntroStyles
    default: return []
  }
})

const currentLocalStyles = computed(() => {
  switch (activeTab.value) {
    case 'title': return styleStore.localTitleStyles
    case 'body': return styleStore.localBodyStyles
    case 'intro': return styleStore.localIntroStyles
    default: return []
  }
})

const isSelected = (style) => {
  const config = appStore.styleConfig
  if (!config) return false
  switch (style.type) {
    case 'title': return config.title?.id === style.id
    case 'body': return config.body?.id === style.id
    case 'intro': return config.intro?.id === style.id
    default: return false
  }
}

const getPreviewWithContent = (style) => {
  const sampleText = '西大'
  let html = style.fullExample || style.preview || ''
  html = html.replace(/\{\{[^}]+\}\}/g, sampleText)
  if (!html.includes(sampleText)) {
    html += `<div style="margin-top: 6px; text-align: center; font-size: 14px; color: #333;">${sampleText}</div>`
  }
  return html
}

const selectStyle = (style) => {
  const currentConfig = appStore.styleConfig || {}
  const newConfig = {
    ...currentConfig,
    [style.type]: { ...style, fullExample: style.fullExample }
  }
  appStore.setStyleConfig(newConfig)
}

const goToStyleConfig = () => {
  router.push('/style-config')
}

onMounted(() => {
  styleStore.fetchStyles()
})
</script>

<style scoped>
.preview-wrapper {
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  align-items: flex-start;
  justify-content: center;
}

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

.preview-container :deep(*) {
  box-sizing: border-box !important;
}
</style>
