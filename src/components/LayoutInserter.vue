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
      class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-white border border-gray-200 rounded-xl shadow-xl p-3 z-20 min-w-[280px]"
    >
      <div class="text-xs font-bold text-gray-400 mb-3 text-center uppercase tracking-wider">插入内容</div>
      
      <div class="grid grid-cols-2 gap-4">
        <!-- 文本内容区 -->
        <div class="space-y-2">
          <div class="text-[10px] font-bold text-gray-400 px-1">文本</div>
          <div class="grid grid-cols-2 gap-1.5">
            <button
              v-for="option in textOptions"
              :key="option.value"
              @click="insertContent(option.value)"
              class="p-2 text-sm rounded-lg hover:bg-blue-50 active:bg-blue-100 text-gray-700 flex flex-col items-center justify-center transition-all border border-transparent hover:border-blue-100"
            >
              <span class="text-xl mb-1">{{ option.icon }}</span>
              <span class="text-[10px] font-bold">{{ option.label }}</span>
            </button>
          </div>
        </div>

        <!-- 图文模板区 -->
        <div class="space-y-2">
          <div class="text-[10px] font-bold text-gray-400 px-1">图文</div>
          <div class="grid grid-cols-2 gap-1.5">
            <button
              v-for="option in imageOptions"
              :key="option.value"
              @click="insertContent(option.value)"
              class="p-2 text-sm rounded-lg hover:bg-orange-50 active:bg-orange-100 text-gray-700 flex flex-col items-center justify-center transition-all border border-transparent hover:border-orange-100"
            >
              <span class="text-xl mb-1">{{ option.icon }}</span>
              <span class="text-[10px] font-bold">{{ option.label }}</span>
            </button>
          </div>
        </div>

        <!-- 容器区块 -->
        <div class="col-span-2 border-t pt-3 space-y-2">
           <div class="text-[10px] font-bold text-gray-400 px-1">功能/嵌套</div>
           <button
              @click="insertContent('container')"
              class="w-full p-2 text-sm rounded-lg hover:bg-purple-50 active:bg-purple-100 text-gray-700 flex items-center justify-center gap-3 transition-all border border-transparent hover:border-purple-100"
            >
              <span class="text-xl">📦</span>
              <span class="text-xs font-bold">内容组合 (Content Group)</span>
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
  insertContainer: []
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
const insertOptions = [
  ...textOptions, 
  ...imageOptions,
  { value: 'container', label: '容器', icon: '📦', type: 'container' }
]

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
    } else if (option.type === 'container') {
      // 插入容器
      emit('insertContainer')
    }
  }
  closeMenu()
}
</script>

<style scoped>
/* 组件特定的样式 */
</style>