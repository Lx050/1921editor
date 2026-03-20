<script setup lang="ts">
import { ref } from 'vue'
import StyleSelector from './StyleSelector.vue'
import SvgTemplatePanel from './SvgTemplatePanel.vue'
import ImageManagerTab from './ImageManagerTab.vue'

const emit = defineEmits<{
  (e: 'insert-svg', tpl: { id: string; name: string; svg: string }): void
  (e: 'insert-image', data: { src: string; name: string; mediaId?: string }): void
}>()

const activeTab = ref<'styles' | 'svg' | 'images'>('styles')
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
      class="self-end p-1 m-1 text-gray-400 hover:text-gray-600 text-sm"
      @click="collapsed = !collapsed"
    >
      {{ collapsed ? '>' : '<' }}
    </button>

    <template v-if="!collapsed">
      <div class="flex border-b px-2">
        <button
          v-for="tab in [
            { key: 'styles', label: '样式' },
            { key: 'svg', label: 'SVG' },
            { key: 'images', label: '图片' }
          ]"
          :key="tab.key"
          class="flex-1 py-2 text-sm text-center transition-colors"
          :class="activeTab === tab.key
            ? 'text-blue-600 border-b-2 border-blue-600 font-medium'
            : 'text-gray-500 hover:text-gray-700'"
          @click="activeTab = tab.key as typeof activeTab"
        >
          {{ tab.label }}
        </button>
      </div>

      <div class="flex-1 overflow-hidden">
        <StyleSelector v-show="activeTab === 'styles'" />
        <SvgTemplatePanel v-show="activeTab === 'svg'" @insert-svg="emit('insert-svg', $event)" />
        <ImageManagerTab v-show="activeTab === 'images'" @insert-image="emit('insert-image', $event)" />
      </div>
    </template>
  </div>
</template>
