<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import type { Editor } from '@tiptap/vue-3'

const props = defineProps<{ editor: Editor | null }>()
const emit = defineEmits<{ (e: 'edit-link'): void }>()

const visible = ref(false)
const position = ref({ x: 0, y: 0 })

function isActive(name: string): boolean {
  return props.editor?.isActive(name) ?? false
}

function run(fn: () => void) {
  if (props.editor) fn()
}

function toggleLink() {
  if (!props.editor) return
  emit('edit-link')
}

function updatePosition() {
  if (!props.editor) { visible.value = false; return }

  const { state } = props.editor
  const { from, to, empty } = state.selection

  if (empty || from === to) {
    visible.value = false
    return
  }

  const view = props.editor.view
  const start = view.coordsAtPos(from)
  const end = view.coordsAtPos(to)

  // Position above the selection center
  const centerX = (start.left + end.right) / 2
  const topY = Math.min(start.top, end.top)

  position.value = {
    x: centerX,
    y: topY - 8,
  }
  visible.value = true
}

let rafId: number | null = null

function onSelectionUpdate() {
  if (rafId) cancelAnimationFrame(rafId)
  rafId = requestAnimationFrame(updatePosition)
}

onMounted(() => {
  if (props.editor) {
    props.editor.on('selectionUpdate', onSelectionUpdate)
    props.editor.on('blur', () => {
      // Delay to allow toolbar click
      setTimeout(() => {
        if (!props.editor?.isFocused) visible.value = false
      }, 200)
    })
  }
})

watch(() => props.editor, (ed, oldEd) => {
  if (oldEd) oldEd.off('selectionUpdate', onSelectionUpdate)
  if (ed) ed.on('selectionUpdate', onSelectionUpdate)
})

onBeforeUnmount(() => {
  if (rafId) cancelAnimationFrame(rafId)
  if (props.editor) props.editor.off('selectionUpdate', onSelectionUpdate)
})
</script>

<template>
  <div
    v-if="visible && editor"
    class="fixed z-50 -translate-x-1/2 -translate-y-full"
    :style="{ left: position.x + 'px', top: position.y + 'px' }"
  >
    <div class="flex items-center gap-0.5 bg-gray-800 rounded-lg shadow-xl px-1 py-0.5 border border-gray-700">
      <button
        class="sel-btn"
        :class="{ 'text-blue-400': isActive('bold') }"
        @mousedown.prevent="run(() => editor!.chain().focus().toggleBold().run())"
        title="Bold"
      ><strong>B</strong></button>
      <button
        class="sel-btn"
        :class="{ 'text-blue-400': isActive('italic') }"
        @mousedown.prevent="run(() => editor!.chain().focus().toggleItalic().run())"
        title="Italic"
      ><em>I</em></button>
      <button
        class="sel-btn"
        :class="{ 'text-blue-400': isActive('underline') }"
        @mousedown.prevent="run(() => editor!.chain().focus().toggleUnderline().run())"
        title="Underline"
      ><span class="underline">U</span></button>
      <button
        class="sel-btn"
        :class="{ 'text-blue-400': isActive('strike') }"
        @mousedown.prevent="run(() => editor!.chain().focus().toggleStrike().run())"
        title="Strikethrough"
      ><span class="line-through">S</span></button>
      <span class="w-px h-4 bg-gray-600 mx-0.5" />
      <button
        class="sel-btn"
        :class="{ 'text-blue-400': isActive('code') }"
        @mousedown.prevent="run(() => editor!.chain().focus().toggleCode().run())"
        title="Code"
      ><span class="font-mono text-[10px]">&lt;/&gt;</span></button>
      <button
        class="sel-btn"
        :class="{ 'text-blue-400': isActive('link') }"
        @mousedown.prevent="toggleLink"
        title="Link"
      >&#x1F517;</button>
      <button
        class="sel-btn"
        :class="{ 'text-blue-400': isActive('highlight') }"
        @mousedown.prevent="run(() => editor!.chain().focus().toggleHighlight({ color: '#fef08a' }).run())"
        title="Highlight"
      ><span class="px-0.5 rounded" style="background:#fef08a;color:#333;">H</span></button>
      <span class="w-px h-4 bg-gray-600 mx-0.5" />
      <button
        v-for="c in ['#ef4444', '#3b82f6', '#22c55e', '#000000']"
        :key="c"
        class="w-4 h-4 rounded-full border border-gray-600 hover:scale-125 transition-transform flex-shrink-0"
        :style="{ background: c }"
        @mousedown.prevent="run(() => editor!.chain().focus().setColor(c).run())"
        :title="`Color: ${c}`"
      />
    </div>
    <!-- Arrow -->
    <div class="flex justify-center">
      <div class="w-2.5 h-2.5 bg-gray-800 rotate-45 -mt-1.5 border-r border-b border-gray-700" />
    </div>
  </div>
</template>

<style scoped>
.sel-btn {
  @apply w-7 h-7 rounded flex items-center justify-center text-sm text-gray-300
         hover:bg-gray-700 transition-colors cursor-pointer select-none;
}
</style>
