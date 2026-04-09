<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Editor } from '@tiptap/vue-3'

const props = defineProps<{ editor: Editor | null }>()

const isInTable = computed(() => {
  if (!props.editor) return false
  return props.editor.isActive('table')
})

const cellBgColors = ['transparent', '#f3f4f6', '#dbeafe', '#dcfce7', '#fef9c3', '#fee2e2', '#f3e8ff', '#e0e7ff']

function run(fn: () => void) {
  if (props.editor) fn()
}

function setCellBackground(color: string) {
  if (!props.editor) return
  props.editor.chain().focus().setCellAttribute('backgroundColor', color === 'transparent' ? null : color).run()
}

const showBgPicker = ref(false)
</script>

<template>
  <div
    v-if="isInTable"
    class="flex items-center gap-0.5 px-2 py-1 border-b text-[11px]"
    style="background:var(--color-bg-warm);"
  >
    <span class="mr-1 select-none" style="color:var(--color-text-muted);">Table:</span>

    <button
      class="tbl-btn"
      @click="run(() => editor!.chain().focus().addColumnBefore().run())"
      title="Insert column before"
    >+Col&#x2190;</button>
    <button
      class="tbl-btn"
      @click="run(() => editor!.chain().focus().addColumnAfter().run())"
      title="Insert column after"
    >+Col&#x2192;</button>
    <button
      class="tbl-btn"
      @click="run(() => editor!.chain().focus().addRowBefore().run())"
      title="Insert row above"
    >+Row&#x2191;</button>
    <button
      class="tbl-btn"
      @click="run(() => editor!.chain().focus().addRowAfter().run())"
      title="Insert row below"
    >+Row&#x2193;</button>

    <span class="w-px h-4 mx-1" style="background:rgba(0,0,0,0.12);" />

    <button
      class="tbl-btn text-red-500 hover:bg-red-50"
      @click="run(() => editor!.chain().focus().deleteColumn().run())"
      title="Delete column"
    >-Col</button>
    <button
      class="tbl-btn text-red-500 hover:bg-red-50"
      @click="run(() => editor!.chain().focus().deleteRow().run())"
      title="Delete row"
    >-Row</button>

    <span class="w-px h-4 mx-1" style="background:rgba(0,0,0,0.12);" />

    <button
      class="tbl-btn"
      @click="run(() => editor!.chain().focus().mergeCells().run())"
      title="Merge selected cells"
    >Merge</button>
    <button
      class="tbl-btn"
      @click="run(() => editor!.chain().focus().splitCell().run())"
      title="Split merged cell"
    >Split</button>
    <button
      class="tbl-btn"
      @click="run(() => editor!.chain().focus().toggleHeaderRow().run())"
      title="Toggle header row"
    >Header</button>

    <span class="w-px h-4 mx-1" style="background:rgba(0,0,0,0.12);" />

    <!-- Cell text alignment -->
    <button
      class="tbl-btn"
      :style="editor?.isActive({ textAlign: 'left' }) ? 'color: var(--color-accent-primary); background: var(--color-badge-bg);' : ''"
      @click="run(() => editor!.chain().focus().setTextAlign('left').run())"
      title="Align left"
    >&#x21E4;</button>
    <button
      class="tbl-btn"
      :style="editor?.isActive({ textAlign: 'center' }) ? 'color: var(--color-accent-primary); background: var(--color-badge-bg);' : ''"
      @click="run(() => editor!.chain().focus().setTextAlign('center').run())"
      title="Align center"
    >&#x2194;</button>
    <button
      class="tbl-btn"
      :style="editor?.isActive({ textAlign: 'right' }) ? 'color: var(--color-accent-primary); background: var(--color-badge-bg);' : ''"
      @click="run(() => editor!.chain().focus().setTextAlign('right').run())"
      title="Align right"
    >&#x21E5;</button>

    <span class="w-px h-4 mx-1" style="background:rgba(0,0,0,0.12);" />

    <!-- Cell background color -->
    <div class="relative">
      <button
        class="tbl-btn"
        @click="showBgPicker = !showBgPicker"
        title="Cell background color"
      >BG</button>
      <div
        v-if="showBgPicker"
        class="absolute top-full left-0 mt-1 bg-white border rounded-lg shadow-lg p-1.5 flex gap-1 z-50"
      >
        <button
          v-for="c in cellBgColors"
          :key="c"
          class="w-5 h-5 rounded hover:scale-110 transition-transform"
          style="border:1px solid rgba(0,0,0,0.08);"
          :style="{ background: c === 'transparent' ? 'repeating-conic-gradient(#e5e7eb 0% 25%, white 0% 50%) 50% / 8px 8px' : c }"
          @mousedown.prevent="setCellBackground(c); showBgPicker = false"
          :title="c === 'transparent' ? 'No background' : c"
        />
      </div>
    </div>

    <span class="w-px h-4 mx-1" style="background:rgba(0,0,0,0.12);" />

    <button
      class="tbl-btn text-red-500 hover:bg-red-50"
      @click="run(() => editor!.chain().focus().deleteTable().run())"
      title="Delete table"
    >Delete Table</button>
  </div>
</template>

<style scoped>
.tbl-btn {
  @apply px-1.5 py-0.5 rounded text-gray-600 hover:bg-gray-200 transition-colors cursor-pointer select-none whitespace-nowrap;
}
</style>
