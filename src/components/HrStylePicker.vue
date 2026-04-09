<script setup lang="ts">
import { ref } from 'vue'
import type { Editor } from '@tiptap/vue-3'

const props = defineProps<{ editor: Editor | null }>()
const showPicker = ref(false)

const hrStyles = [
  { name: '实线', style: 'border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;' },
  { name: '粗线', style: 'border: none; border-top: 3px solid rgba(0,0,0,0.25); margin: 20px 0;' },
  { name: '虚线', style: 'border: none; border-top: 2px dashed rgba(0,0,0,0.25); margin: 20px 0;' },
  { name: '点线', style: 'border: none; border-top: 2px dotted var(--color-text-muted); margin: 20px 0;' },
  { name: '渐变', style: 'border: none; height: 2px; background: linear-gradient(90deg, transparent, var(--color-accent-primary), transparent); margin: 20px 0;' },
  { name: '星号', preview: '* * *' },
]

function insertHrWithStyle(_style: typeof hrStyles[0]) {
  if (!props.editor) return
  props.editor.chain().focus().setHorizontalRule().run()
  showPicker.value = false
}
</script>

<template>
  <div class="relative inline-block">
    <button
      class="toolbar-btn"
      @click="showPicker = !showPicker"
      title="分隔线样式"
    >&#x2015;</button>
    <div
      v-if="showPicker"
      class="absolute top-full left-0 mt-1 bg-white border rounded-lg shadow-lg p-2 z-50 w-[140px] space-y-1"
    >
      <button
        v-for="hr in hrStyles"
        :key="hr.name"
        class="w-full px-2 py-1.5 text-left text-[11px] rounded transition-colors"
        style="color:rgba(0,0,0,0.55);"
        @mouseover="($event.currentTarget as HTMLElement).style.background='var(--color-bg-warm)'"
        @mouseout="($event.currentTarget as HTMLElement).style.background=''"
        @mousedown.prevent="insertHrWithStyle(hr)"
      >
        <span v-if="hr.preview" class="text-center block" style="color:var(--color-text-muted);">{{ hr.preview }}</span>
        <template v-else>
          <div class="mb-0.5">{{ hr.name }}</div>
          <div :style="hr.style" class="w-full" />
        </template>
      </button>
    </div>
  </div>
</template>

<style scoped>
.toolbar-btn {
  @apply w-8 h-8 rounded flex items-center justify-center text-sm text-gray-600
         hover:bg-gray-100 transition-colors cursor-pointer select-none flex-shrink-0;
}
</style>
