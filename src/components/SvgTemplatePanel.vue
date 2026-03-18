<template>
  <div class="h-full flex flex-col" style="background: var(--color-content-bg-soft);">
    <!-- 标题栏 -->
    <div class="p-3 border-b flex items-center justify-between" style="border-color: var(--color-content-border);">
      <div>
        <h3 class="text-sm font-bold" style="color: var(--color-content-text);">SVG 装饰库</h3>
        <p class="text-[10px] mt-0.5" style="color: var(--color-content-text-secondary);">点击插入到文章中</p>
      </div>
      <span class="text-[10px] px-2 py-0.5 rounded-full bg-purple-100 text-purple-600 font-bold">{{ totalCount }}</span>
    </div>

    <!-- 分类选择器 (分组下拉 + 快捷标签) -->
    <div class="border-b px-2 py-1.5" style="border-color: var(--color-content-border);">
      <!-- 分组下拉选择 -->
      <select
        v-model="activeCategory"
        class="w-full mb-1.5 px-2 py-1.5 text-[11px] bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-purple-300 appearance-none cursor-pointer"
        style="background-image: url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%236B7280%22 stroke-width=%222%22><path d=%22M6 9l6 6 6-6%22/></svg>'); background-repeat: no-repeat; background-position: right 8px center;"
      >
        <optgroup v-for="group in categoryGroups" :key="group.label" :label="group.label">
          <option v-for="cat in group.items" :key="cat.id" :value="cat.id">
            {{ cat.icon }} {{ cat.name }} ({{ cat.data.length }})
          </option>
        </optgroup>
      </select>
      <!-- 快捷标签行 -->
      <div class="flex flex-wrap gap-0.5">
        <button
          v-for="cat in categories"
          :key="cat.id"
          @click="activeCategory = cat.id"
          :class="[
            'px-1.5 py-0.5 text-[9px] font-medium rounded transition-all duration-200 whitespace-nowrap',
            activeCategory === cat.id
              ? 'bg-purple-100 text-purple-700 ring-1 ring-purple-200'
              : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
          ]"
        >
          {{ cat.icon }}{{ cat.name.slice(0, 2) }}
        </button>
      </div>
    </div>

    <!-- 搜索栏 -->
    <div class="px-3 py-2 border-b" style="border-color: var(--color-content-border);">
      <div class="relative">
        <svg class="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="搜索SVG模板..."
          class="w-full pl-7 pr-3 py-1.5 text-xs bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-purple-300 focus:ring-1 focus:ring-purple-200"
        />
      </div>
    </div>

    <!-- SVG 模板网格 -->
    <div class="flex-1 overflow-y-auto scrollbar-hide p-2.5">
      <div v-if="filteredTemplates.length > 0" class="grid grid-cols-2 gap-2">
        <div
          v-for="tpl in filteredTemplates"
          :key="tpl.id"
          @click="insertSvg(tpl)"
          class="relative cursor-pointer border-2 rounded-lg p-2 transition-all duration-200 border-transparent hover:border-purple-200 bg-white hover:shadow-md group"
        >
          <!-- SVG 预览 -->
          <div :class="['overflow-hidden rounded bg-gray-50 border border-gray-100 flex items-center justify-center p-1', tallPreview ? 'h-24' : 'h-16']">
            <div class="svg-preview-wrapper" v-html="tpl.svg"></div>
          </div>

          <!-- 名称 -->
          <div class="mt-1.5 text-[9px] text-center font-bold text-gray-500 group-hover:text-purple-600 truncate">
            {{ tpl.name }}
          </div>

          <!-- 颜色标签 -->
          <div class="absolute top-1.5 right-1.5 w-3 h-3 rounded-full border border-white shadow-sm" :style="{ background: tpl.colorScheme }"></div>

          <!-- 插入提示 -->
          <div class="absolute inset-0 flex items-center justify-center bg-purple-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            <span class="text-[10px] font-bold text-purple-600 bg-white/90 px-2 py-1 rounded-full shadow-sm">+&nbsp;插入</span>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-else class="text-center py-10">
        <div class="text-2xl mb-2 opacity-50">&#x1F50D;</div>
        <p class="text-xs text-gray-400">未找到匹配的SVG模板</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { SVG_TEMPLATE_CATEGORIES, getAllSvgTemplates, searchSvgTemplates } from '../styles/svgTemplates'

const emit = defineEmits(['insertSvg'])

const activeCategory = ref('borders')
const searchQuery = ref('')

const categories = SVG_TEMPLATE_CATEGORIES

const totalCount = computed(() => getAllSvgTemplates().length)

// 分组导航 - 21个分类按功能分成4组
const categoryGroups = computed(() => {
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

// 需要更高预览区域的分类
const tallCategories = new Set(['gradients', 'progress', 'callouts', 'dataviz', 'waves', 'chinese', 'cards', 'editorial', 'botanical', 'tech', 'music', 'lifestyle'])
const tallPreview = computed(() => tallCategories.has(activeCategory.value))

const filteredTemplates = computed(() => {
  if (searchQuery.value.trim()) {
    return searchSvgTemplates(searchQuery.value.trim())
  }
  const cat = categories.find(c => c.id === activeCategory.value)
  return cat ? cat.data : []
})

const insertSvg = (tpl) => {
  emit('insertSvg', tpl)
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
