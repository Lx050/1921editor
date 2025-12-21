<template>
  <div class="h-full flex flex-col bg-gray-50 border-r border-gray-200">
    <!-- 标题 -->
    <div class="p-4 border-b border-gray-200 bg-white">
      <h3 class="text-sm font-semibold text-gray-900">样式选择</h3>
      <p class="text-xs text-gray-500 mt-1">点击应用样式</p>
    </div>

    <!-- Tab 切换 -->
    <div class="flex border-b border-gray-200 bg-white">
      <button
        v-for="tab in tabs"
        :key="tab.value"
        @click="activeTab = tab.value"
        :class="[
          'flex-1 px-3 py-2 text-sm font-medium transition-colors',
          activeTab === tab.value
            ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
        ]"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- 缩略图网格 - 不滚动，显示所有内容 -->
    <div class="flex-1 p-3 overflow-y-auto">
      <div class="grid grid-cols-2 gap-2">
        <div
          v-for="style in currentStyles"
          :key="style.id"
          @click="selectStyle(style)"
          :class="[
            'relative cursor-pointer border-2 rounded-lg p-2 transition-all hover:shadow-md',
            isSelected(style) ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
          ]"
        >
          <!-- 缩略图预览 -->
          <div class="h-16 overflow-hidden rounded bg-white flex items-center justify-center">
            <div v-html="sanitizeHtml(style.preview)" class="transform scale-90"></div>
          </div>
          
          <!-- 样式名称 -->
          <div class="mt-1 text-xs text-center text-gray-700 font-medium truncate">
            {{ style.name }}
          </div>

          <!-- 选中标记 -->
          <div v-if="isSelected(style)" class="absolute top-1 right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
            <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-if="currentStyles.length === 0" class="text-center py-8 text-gray-400 text-sm">
        暂无样式
      </div>
    </div>

    <!-- 管理样式库按钮 -->
    <div class="p-3 border-t border-gray-200 bg-white">
      <button
        @click="goToStyleConfig"
        class="w-full px-4 py-2 bg-orange-100 hover:bg-orange-200 text-orange-700 font-medium rounded-lg transition-colors text-sm flex items-center justify-center space-x-2"
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
