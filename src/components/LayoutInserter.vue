<template>
  <div class="relative">
    <!-- 添加按钮 — 细线+圆点 -->
    <button
      @click="toggleMenu"
      class="w-6 h-6 rounded-full flex items-center justify-center transition-all group"
      style="background: var(--color-content-bg-muted); color: var(--color-content-text-muted);"
      onmouseover="this.style.background='var(--color-accent-soft)';this.style.color='var(--color-accent-primary)'"
      onmouseout="this.style.background='var(--color-content-bg-muted)';this.style.color='var(--color-content-text-muted)'"
      title="插入内容"
    >
      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"></path>
      </svg>
    </button>

    <!-- 下拉菜单 — 无硬边框，浮层毛玻璃 -->
    <div
      v-if="menuVisible"
      class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 rounded-xl p-3 z-20 min-w-[260px]"
      style="background: rgba(255,255,255,0.95); backdrop-filter: blur(12px); box-shadow: var(--shadow-float);"
    >
      <div class="text-[9px] font-bold uppercase tracking-widest text-center mb-3" style="color: var(--color-content-text-muted);">插入内容</div>

      <div class="grid grid-cols-3 gap-2">
        <!-- 文本 -->
        <div>
          <div class="text-[8px] font-bold uppercase tracking-wider px-1 mb-1.5" style="color: var(--color-content-text-muted);">文本</div>
          <div class="space-y-1">
            <button
              v-for="option in textOptions"
              :key="option.value"
              @click="insertContent(option.value)"
              class="w-full p-1.5 text-[10px] rounded-lg flex items-center gap-1.5 transition-all"
              style="color: var(--color-content-text-secondary);"
              onmouseover="this.style.background='var(--color-content-bg-muted)'"
              onmouseout="this.style.background='transparent'"
            >
              <span class="text-sm">{{ option.icon }}</span>
              <span class="font-medium">{{ option.label }}</span>
            </button>
          </div>
        </div>

        <!-- 图文 -->
        <div>
          <div class="text-[8px] font-bold uppercase tracking-wider px-1 mb-1.5" style="color: var(--color-content-text-muted);">图文</div>
          <div class="space-y-1">
            <button
              v-for="option in imageOptions"
              :key="option.value"
              @click="insertContent(option.value)"
              class="w-full p-1.5 text-[10px] rounded-lg flex items-center gap-1.5 transition-all"
              style="color: var(--color-content-text-secondary);"
              onmouseover="this.style.background='var(--color-content-bg-muted)'"
              onmouseout="this.style.background='transparent'"
            >
              <span class="text-sm">{{ option.icon }}</span>
              <span class="font-medium">{{ option.label }}</span>
            </button>
          </div>
        </div>

        <!-- 装饰 -->
        <div>
          <div class="text-[8px] font-bold uppercase tracking-wider px-1 mb-1.5" style="color: var(--color-content-text-muted);">装饰</div>
          <div class="space-y-1">
            <button
              @click="insertSvgBlock"
              class="w-full p-1.5 text-[10px] rounded-lg flex items-center gap-1.5 transition-all"
              style="color: var(--color-ai-primary);"
              onmouseover="this.style.background='var(--color-ai-soft)'"
              onmouseout="this.style.background='transparent'"
            >
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"/></svg>
              <span class="font-medium">SVG</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 遮罩 -->
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
  insertSvg: []
}

const emit = defineEmits<EmitEvents>()
const menuVisible = ref(false)

const textOptions = [
  { value: 'title', label: '标题', icon: '📰', type: 'text' },
  { value: 'body', label: '正文', icon: '📝', type: 'text' },
  { value: 'intro', label: '引言', icon: '💭', type: 'text' },
  { value: 'outro', label: '结尾', icon: '🎯', type: 'text' }
]

const imageOptions = [
  { value: 'single', label: '单图', icon: '🖼️', type: 'image' },
  { value: 'single_caption', label: '单图+注', icon: '🖼️📝', type: 'image' },
  { value: 'double', label: '双图', icon: '🖼️🖼️', type: 'image' },
  { value: 'double_caption', label: '双图+注', icon: '🖼️📝', type: 'image' }
]

const insertOptions = [...textOptions, ...imageOptions]

const toggleMenu = (event: MouseEvent) => {
  event.stopPropagation()
  menuVisible.value = !menuVisible.value
}

const closeMenu = () => {
  menuVisible.value = false
}

const insertSvgBlock = () => {
  emit('insertSvg')
  closeMenu()
}

const insertContent = (optionValue: string) => {
  const option = insertOptions.find(opt => opt.value === optionValue)
  if (option) {
    if (option.type === 'text') emit('insertText', optionValue)
    else if (option.type === 'image') emit('insertImage', optionValue)
  }
  closeMenu()
}
</script>
