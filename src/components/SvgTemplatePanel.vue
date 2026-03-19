<template>
  <div class="h-full flex flex-col" style="background: var(--color-content-bg-soft);">
    <!-- 标题 — 无边框，融入背景 -->
    <div class="px-4 pt-4 pb-2 flex items-center justify-between">
      <div>
        <h3 class="text-xs font-bold" style="color: var(--color-content-text);">SVG 装饰库</h3>
        <p class="text-[10px] mt-0.5" style="color: var(--color-content-text-muted);">点击或拖拽插入到文章</p>
      </div>
      <div class="flex items-center gap-1">
        <span class="text-[9px] px-1.5 py-0.5 rounded-full font-medium" style="background: var(--color-ai-soft); color: var(--color-ai-primary);">{{ staticCount }}</span>
        <span class="text-[9px] px-1.5 py-0.5 rounded-full font-medium" style="background: var(--color-accent-soft); color: var(--color-accent-primary);">{{ interactiveCount }} &#x26A1;</span>
      </div>
    </div>

    <!-- 静态/交互 — 胶囊切换 -->
    <div class="px-4 pb-2">
      <div class="flex gap-1 p-0.5 rounded-lg" style="background: var(--color-content-bg-muted);">
        <button
          @click="viewMode = 'static'"
          :class="[
            'flex-1 py-1.5 text-[10px] font-semibold rounded-md transition-all duration-200',
            viewMode === 'static'
              ? 'bg-white shadow-sm'
              : 'hover:bg-white/50'
          ]"
          :style="{ color: viewMode === 'static' ? 'var(--color-ai-primary)' : 'var(--color-content-text-muted)' }"
        >
          静态 ({{ staticCount }})
        </button>
        <button
          @click="viewMode = 'interactive'"
          :class="[
            'flex-1 py-1.5 text-[10px] font-semibold rounded-md transition-all duration-200',
            viewMode === 'interactive'
              ? 'bg-white shadow-sm'
              : 'hover:bg-white/50'
          ]"
          :style="{ color: viewMode === 'interactive' ? 'var(--color-accent-primary)' : 'var(--color-content-text-muted)' }"
        >
          &#x26A1; 交互 ({{ interactiveCount }})
        </button>
      </div>
    </div>

    <!-- 分类选择器 -->
    <div class="px-3 pb-2">
      <select
        v-model="activeCategory"
        class="w-full mb-1.5 px-2 py-1.5 text-[10px] rounded-lg border-0 cursor-pointer outline-none appearance-none"
        style="background: var(--color-content-bg-muted); color: var(--color-content-text-secondary); background-image: url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2210%22 height=%2210%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%239a9a9a%22 stroke-width=%222%22><path d=%22M6 9l6 6 6-6%22/></svg>'); background-repeat: no-repeat; background-position: right 8px center;"
      >
        <optgroup v-for="group in currentGroups" :key="group.label" :label="group.label">
          <option v-for="cat in group.items" :key="cat.id" :value="cat.id">
            {{ cat.icon }} {{ cat.name }} ({{ cat.data.length }})
          </option>
        </optgroup>
      </select>
      <div class="flex flex-wrap gap-0.5">
        <button
          v-for="cat in currentCategories"
          :key="cat.id"
          @click="activeCategory = cat.id"
          :class="[
            'px-1.5 py-0.5 text-[8px] font-medium rounded-md transition-all duration-200 whitespace-nowrap',
            activeCategory === cat.id
              ? 'bg-white shadow-sm'
              : 'hover:bg-white/50'
          ]"
          :style="{ color: activeCategory === cat.id ? (viewMode === 'interactive' ? 'var(--color-accent-primary)' : 'var(--color-ai-primary)') : 'var(--color-content-text-muted)' }"
        >
          {{ cat.icon }}{{ cat.name.slice(0, 2) }}
        </button>
      </div>
    </div>

    <!-- 搜索 — 无边框输入 -->
    <div class="px-3 pb-2">
      <div class="relative">
        <svg class="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3" style="color: var(--color-content-text-muted);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
        <input
          v-model="searchQuery"
          type="text"
          :placeholder="viewMode === 'interactive' ? '搜索交互模板...' : '搜索模板...'"
          class="w-full pl-7 pr-3 py-1.5 text-[10px] rounded-lg border-0 outline-none"
          style="background: var(--color-content-bg-muted); color: var(--color-content-text);"
        />
      </div>
    </div>

    <!-- 交互提示 -->
    <div v-if="viewMode === 'interactive' && !searchQuery" class="px-3 pb-2">
      <p class="text-[9px] leading-relaxed px-3 py-2 rounded-lg" style="background: var(--color-accent-soft); color: var(--color-accent-primary);">
        SMIL 交互模板 — 微信公众号原生 SVG 动画技术，灵感来自智族GQ实验室
      </p>
    </div>

    <!-- 模板网格 -->
    <div class="flex-1 overflow-y-auto scrollbar-hide px-3 pb-3">
      <div v-if="filteredTemplates.length > 0" class="grid grid-cols-2 gap-1.5">
        <div
          v-for="tpl in filteredTemplates"
          :key="tpl.id"
          @click="insertSvg(tpl)"
          draggable="true"
          @dragstart="onTplDragStart($event, tpl)"
          @dragend="onTplDragEnd"
          :class="[
            'relative cursor-pointer rounded-xl p-1.5 transition-all duration-200 bg-white/50 hover:bg-white hover:shadow-[0_2px_10px_rgba(0,0,0,0.04)] group',
            isDragging ? 'cursor-grabbing' : ''
          ]"
        >
          <!-- 交互角标 -->
          <div v-if="tpl.interactive" class="absolute top-1 left-1 z-10">
            <span class="text-[7px] font-bold px-1 py-0.5 rounded" style="background: var(--color-accent-primary); color: white;">
              &#x26A1;{{ tpl.interactionType === 'click-expand' ? '展开' : tpl.interactionType === 'click-switch' ? '切换' : tpl.interactionType === 'auto-animate' ? '动画' : tpl.interactionType === 'auto-parallax' ? '视差' : tpl.interactionType === 'click-game' ? '游戏' : '动效' }}
            </span>
          </div>

          <!-- SVG 预览 -->
          <div :class="['overflow-hidden rounded-lg flex items-center justify-center p-1', tallPreview ? 'h-20' : 'h-14']" style="background: var(--color-content-bg-muted);">
            <div class="svg-preview-wrapper" v-html="tpl.svg"></div>
          </div>

          <!-- 名称 -->
          <div class="mt-1 text-[8px] text-center font-medium truncate" style="color: var(--color-content-text-secondary);">
            {{ tpl.name }}
          </div>

          <!-- 色标 -->
          <div class="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full" :style="{ background: tpl.colorScheme }"></div>

          <!-- hover 插入提示 -->
          <div class="absolute inset-0 flex items-center justify-center rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" style="background: rgba(124, 92, 252, 0.06);">
            <div class="flex flex-col items-center gap-0.5">
              <span class="text-[9px] font-bold px-2 py-0.5 rounded-full" style="background: white; color: var(--color-ai-primary); box-shadow: var(--shadow-content-card);">+ 点击插入</span>
              <span class="text-[7px] font-medium" style="color: var(--color-ai-primary); opacity: 0.6;">或拖拽到编辑区</span>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-12">
        <div class="text-xl mb-2 opacity-20">&#x1F50D;</div>
        <p class="text-[10px]" style="color: var(--color-content-text-muted);">未找到匹配的模板</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { SVG_TEMPLATE_CATEGORIES, getAllSvgTemplates, searchSvgTemplates } from '../styles/svgTemplates'

const emit = defineEmits(['insertSvg'])

const viewMode = ref('static')
const activeCategory = ref('borders')
const searchQuery = ref('')

const categories = SVG_TEMPLATE_CATEGORIES

const staticCategories = computed(() => categories.filter(c => !c.interactive))
const interactiveCategories = computed(() => categories.filter(c => c.interactive))
const currentCategories = computed(() => viewMode.value === 'interactive' ? interactiveCategories.value : staticCategories.value)

const staticCount = computed(() => staticCategories.value.reduce((sum, c) => sum + c.data.length, 0))
const interactiveCount = computed(() => interactiveCategories.value.reduce((sum, c) => sum + c.data.length, 0))

watch(viewMode, (mode) => {
  const cats = mode === 'interactive' ? interactiveCategories.value : staticCategories.value
  if (cats.length > 0 && !cats.find(c => c.id === activeCategory.value)) {
    activeCategory.value = cats[0].id
  }
})

const currentGroups = computed(() => {
  if (viewMode.value === 'interactive') {
    return [{ label: '交互式 SMIL 模板', items: interactiveCategories.value }]
  }
  const groups = [
    { label: '基础装饰', ids: ['borders', 'dividers', 'badges', 'patterns', 'icons', 'seasonal', 'text_deco'] },
    { label: '版式组件', ids: ['waves', 'progress', 'callouts', 'dataviz', 'arrows', 'gradients'] },
    { label: '风格主题', ids: ['chinese', 'sketch', 'cards', 'editorial', 'botanical'] },
    { label: '场景插图', ids: ['tech', 'music', 'lifestyle'] }
  ]
  return groups.map(g => ({
    label: g.label,
    items: g.ids.map(id => categories.find(c => c.id === id)).filter(Boolean)
  }))
})

const tallCategories = new Set([
  'gradients', 'progress', 'callouts', 'dataviz', 'waves',
  'chinese', 'cards', 'editorial', 'botanical', 'tech', 'music', 'lifestyle',
  'expand', 'switch', 'parallax', 'game', 'deco_anim'
])
const tallPreview = computed(() => tallCategories.has(activeCategory.value))

const filteredTemplates = computed(() => {
  if (searchQuery.value.trim()) {
    const results = searchSvgTemplates(searchQuery.value.trim())
    if (viewMode.value === 'interactive') return results.filter(t => t.interactive)
    return results.filter(t => !t.interactive)
  }
  const cat = categories.find(c => c.id === activeCategory.value)
  return cat ? cat.data : []
})

const isDragging = ref(false)

const insertSvg = (tpl) => {
  emit('insertSvg', tpl)
}

const onTplDragStart = (e, tpl) => {
  isDragging.value = true
  e.dataTransfer.effectAllowed = 'copyMove'
  e.dataTransfer.setData('application/svg-template', JSON.stringify({
    id: tpl.id,
    name: tpl.name,
    svg: tpl.svg
  }))
  // 设置拖拽预览图像的透明度
  if (e.dataTransfer.setDragImage) {
    const el = e.currentTarget
    e.dataTransfer.setDragImage(el, el.offsetWidth / 2, el.offsetHeight / 2)
  }
}

const onTplDragEnd = () => {
  isDragging.value = false
}
</script>

<style scoped>
.svg-preview-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.svg-preview-wrapper :deep(svg) {
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
}
</style>
