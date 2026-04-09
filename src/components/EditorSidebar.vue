<script setup lang="ts">
import { ref } from 'vue'
import type { Editor } from '@tiptap/vue-3'
import StyleSelector from './StyleSelector.vue'
import SvgTemplatePanel from './SvgTemplatePanel.vue'
import ImageManagerTab from './ImageManagerTab.vue'
import DocumentOutline from './DocumentOutline.vue'
import BookmarkPanel from './BookmarkPanel.vue'

defineProps<{ editor?: Editor | null }>()

const emit = defineEmits<{
  (e: 'insert-svg', tpl: { id: string; name: string; svg: string }): void
  (e: 'insert-image', data: { src: string; name: string; mediaId?: string }): void
}>()

const activeTab = ref<'styles' | 'svg' | 'images' | 'outline' | 'bookmarks'>('styles')
const collapsed = ref(false)

function switchToSvg() {
  activeTab.value = 'svg'
  collapsed.value = false
}

defineExpose({ activeTab, collapsed, switchToSvg })
</script>

<template>
  <div
    class="h-full border-r bg-white transition-all duration-200 flex flex-col"
    :class="collapsed ? 'w-12' : 'w-72'"
  >
    <button
      class="self-end p-1 m-1 text-sm transition-colors"
      style="color:rgba(0,0,0,0.35);"
      onmouseover="this.style.color='rgba(0,0,0,0.7)'"
      onmouseout="this.style.color='rgba(0,0,0,0.35)'"
      @click="collapsed = !collapsed"
      :title="collapsed ? '展开侧边栏' : '折叠侧边栏'"
      :aria-label="collapsed ? '展开侧边栏' : '折叠侧边栏'"
    >
      {{ collapsed ? '>' : '<' }}
    </button>

    <template v-if="!collapsed">
      <div class="flex border-b px-1">
        <button
          v-for="tab in [
            { key: 'styles', label: '样式' },
            { key: 'svg', label: 'SVG' },
            { key: 'images', label: '图片' },
            { key: 'outline', label: '大纲' },
            { key: 'bookmarks', label: '书签' }
          ]"
          :key="tab.key"
          class="flex-1 py-2 text-xs text-center transition-colors"
          :style="activeTab === tab.key
            ? 'color:var(--color-accent-primary); border-bottom:2px solid var(--color-accent-primary); font-weight:500;'
            : 'color:rgba(0,0,0,0.45);'"
          @mouseover="activeTab !== tab.key && ($event.currentTarget.style.color = 'rgba(0,0,0,0.7)')"
          @mouseout="activeTab !== tab.key && ($event.currentTarget.style.color = 'rgba(0,0,0,0.45)')"
          @click="activeTab = tab.key as typeof activeTab"
        >
          {{ tab.label }}
        </button>
      </div>

      <div class="flex-1 overflow-hidden">
        <StyleSelector v-show="activeTab === 'styles'" />
        <SvgTemplatePanel v-show="activeTab === 'svg'" @insert-svg="emit('insert-svg', $event)" />
        <ImageManagerTab v-show="activeTab === 'images'" @insert-image="emit('insert-image', $event)" />
        <DocumentOutline v-show="activeTab === 'outline'" :editor="editor" />
        <BookmarkPanel v-show="activeTab === 'bookmarks'" :editor="editor" />
      </div>
    </template>
  </div>
</template>
