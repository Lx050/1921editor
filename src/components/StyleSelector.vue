<template>
  <div class="h-full flex flex-col" style="background: var(--color-content-bg-soft);">
    <!-- 标题 -->
    <div class="p-4 border-b" style="border-color: var(--color-content-border);">
      <h3 class="magazine-title-sm" style="color: var(--color-content-text);">样式选择</h3>
      <p class="text-xs mt-1" style="color: var(--color-content-text-secondary);">点击卡片实时应用装饰</p>
    </div>

    <!-- Tab 切换 -->
    <div class="flex border-b" style="border-color: var(--color-content-border);">
      <button
        v-for="tab in tabs"
        :key="tab.value"
        @click="activeTab = tab.value"
        :class="[
          'flex-1 px-3 py-2 text-sm font-medium transition-all duration-200 relative',
          activeTab === tab.value
            ? 'text-[#ff6b4a]'
            : 'text-gray-500 hover:text-gray-700'
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
    <div class="flex-1 p-3 overflow-y-auto">
      <div class="grid grid-cols-2 gap-2">
        <div
          v-for="style in currentStyles"
          :key="style.id"
          @click="selectStyle(style)"
          :class="[
            'relative cursor-pointer border-2 rounded-lg p-2 transition-all duration-200',
            isSelected(style)
              ? 'border-[#ff6b4a] bg-orange-50 shadow-md transform scale-[1.02]'
              : 'border-transparent hover:border-gray-200 bg-white hover:shadow-sm'
          ]"
        >
          <!-- 缩略图预览 -->
          <div class="h-16 overflow-hidden rounded bg-gray-50 border border-gray-100 flex items-center justify-center">
            <div v-html="sanitizeHtml(style.preview)" class="transform scale-90"></div>
          </div>

          <!-- 样式名称 -->
          <div class="mt-1 text-[10px] text-center font-medium truncate" :class="isSelected(style) ? 'text-[#ff6b4a]' : 'text-gray-500'">
            {{ style.name }}
          </div>

          <!-- 选中标记 -->
          <div v-if="isSelected(style)" class="absolute top-1 right-1 w-5 h-5 bg-gradient-to-br from-[#ff6b4a] to-[#ff8566] rounded-full flex items-center justify-center shadow-lg">
            <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-if="currentStyles.length === 0" class="text-center py-8 text-[#606070] text-sm">
        暂无样式
      </div>
    </div>

    <!-- 管理样式库按钮 -->
    <div class="p-3 border-t" style="border-color: var(--color-content-border);">
      <button
        @click="goToStyleConfig"
        class="w-full px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-lg transition-all duration-200 text-xs flex items-center justify-center space-x-2 border border-gray-200 shadow-sm"
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
import { sanitizeHtml } from '../utils/sanitizeHtml'
import { getAllStyles } from '../styles/styleStorage'

const router = useRouter()
const appStore = useAppStore()

// Tab 配置
const tabs = [
  { value: 'title', label: '标题' },
  { value: 'body', label: '正文' },
  { value: 'intro', label: '引言' }
]

// 当前激活的 Tab
const activeTab = ref('title')

// 样式数据（默认 + 自定义）
const allStyles = ref({ title: [], body: [], intro: [] })

// 加载所有样式
const loadStyles = () => {
  allStyles.value = getAllStyles()
}

// 当前显示的样式列表
const currentStyles = computed(() => {
  return allStyles.value[activeTab.value] || []
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
    default:
      return false
  }
}

// 选择样式
const selectStyle = (style) => {
  const currentConfig = appStore.styleConfig || {}
  
  // 根据类型更新对应的样式
  const newConfig = {
    ...currentConfig,
    [style.type]: style
  }
  
  appStore.setStyleConfig(newConfig)
}

// 跳转到样式管理页面
const goToStyleConfig = () => {
  router.push('/style-config')
}

// 组件挂载时加载样式
onMounted(() => {
  loadStyles()
})
</script>

<style scoped>
/* 组件特定样式 */
</style>
