<template>
  <div class="relative">
    <!-- 添加按钮 -->
    <button
      @click="toggleMenu"
      class="w-8 h-8 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-full flex items-center justify-center transition-colors group"
      title="插入内容"
    >
      <svg
        class="w-4 h-4 group-hover:scale-110 transition-transform"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
      </svg>
    </button>

    <!-- 下拉菜单 -->
    <div
      v-if="menuVisible"
      class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-20"
    >
      <div class="text-xs text-gray-500 mb-2 text-center">插入内容</div>

      <!-- 文本内容区 -->
      <div class="mb-3">
        <div class="text-xs font-medium text-gray-700 mb-1">文本内容</div>
        <div class="flex space-x-2">
          <button
            v-for="option in textOptions"
            :key="option.value"
            @click="insertContent(option.value)"
            class="px-3 py-2 text-sm rounded-md hover:bg-blue-100 text-gray-700 flex flex-col items-center space-y-1 transition-colors min-w-[70px]"
          >
            <span class="text-lg">{{ option.icon }}</span>
            <span class="text-xs font-medium">{{ option.label }}</span>
          </button>
        </div>
      </div>

      <!-- 图片模板区 -->
      <div>
        <div class="text-xs font-medium text-gray-700 mb-1">图片模板</div>
        <div class="flex space-x-2">
          <button
            v-for="option in imageOptions"
            :key="option.value"
            @click="insertContent(option.value)"
            class="px-3 py-2 text-sm rounded-md hover:bg-orange-100 text-gray-700 flex flex-col items-center space-y-1 transition-colors min-w-[70px]"
          >
            <span class="text-lg">{{ option.icon }}</span>
            <span class="text-xs font-medium">{{ option.label }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- 点击外部关闭菜单的遮罩 -->
    <div
      v-if="menuVisible"
      class="fixed inset-0 z-10"
      @click="closeMenu"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface EmitEvents {
  insertImage: [imageType: string]
  insertText: [textType: string]
}

const emit = defineEmits<EmitEvents>()

const menuVisible = ref(false)

// 文本内容块选项
const textOptions = [
  {
    value: 'title',
    label: '标题',
    icon: '📰',
    type: 'text'
  },
  {
    value: 'body',
    label: '正文',
    icon: '📝',
    type: 'text'
  },
  {
    value: 'intro',
    label: '引言',
    icon: '💭',
    type: 'text'
  },
  {
    value: 'outro',
    label: '结尾',
    icon: '🎯',
    type: 'text'
  }
]

// 图片模板选项
const imageOptions = [
  {
    value: 'single',
    label: '单图',
    icon: '🖼️',
    type: 'image'
  },
  {
    value: 'single_caption',
    label: '单图+注',
    icon: '🖼️📝',
    type: 'image'
  },
  {
    value: 'double',
    label: '双图',
    icon: '🖼️🖼️',
    type: 'image'
  },
  {
    value: 'double_caption',
    label: '双图+注',
    icon: '🖼️📝',
    type: 'image'
  }
]

// 合并所有选项（用于查找）
const insertOptions = [...textOptions, ...imageOptions]

// 切换菜单显示
const toggleMenu = (event: MouseEvent) => {
  event.stopPropagation()
  menuVisible.value = !menuVisible.value
}

// 关闭菜单
const closeMenu = () => {
  menuVisible.value = false
}

// 插入内容
const insertContent = (optionValue: string) => {
  const option = insertOptions.find(opt => opt.value === optionValue)
  if (option) {
    if (option.type === 'text') {
      // 插入文本内容块
      emit('insertText', optionValue)
    } else if (option.type === 'image') {
      // 插入图片模板
      emit('insertImage', optionValue)
    }
  }
  closeMenu()
}
</script>

<style scoped>
/* 组件特定的样式 */
</style>