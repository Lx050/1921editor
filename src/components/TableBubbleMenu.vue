<script setup lang="ts">
import { computed } from 'vue'
import type { Editor } from '@tiptap/vue-3'

const props = defineProps<{ editor: Editor | null }>()

const isInTable = computed(() => {
  if (!props.editor) return false
  return props.editor.isActive('table')
})

function run(fn: () => void) {
  if (props.editor) fn()
}
</script>

<template>
  <div
    v-if="isInTable"
    class="flex items-center gap-0.5 px-2 py-1 bg-gray-50 border-b text-[11px]"
  >
    <span class="text-gray-400 mr-1 select-none">Table:</span>

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

    <span class="w-px h-4 bg-gray-300 mx-1" />

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

    <span class="w-px h-4 bg-gray-300 mx-1" />

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

    <span class="w-px h-4 bg-gray-300 mx-1" />

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
