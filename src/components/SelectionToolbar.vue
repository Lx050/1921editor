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
  <Transition
    enter-active-class="transition-all duration-150 ease-out"
    leave-active-class="transition-all duration-100 ease-in"
    enter-from-class="opacity-0 scale-95"
    leave-to-class="opacity-0 scale-95"
  >
  <div
    v-if="visible && editor"
    class="fixed z-50 -translate-x-1/2 -translate-y-full"
    :style="{ left: position.x + 'px', top: position.y + 'px' }"
  >
    <div class="flex items-center gap-0.5 rounded-lg px-1 py-0.5" style="background:var(--color-bg-card); border:1px solid rgba(0,0,0,0.1); box-shadow:var(--shadow-float);">
      <button
        class="sel-btn"
        :class="{ 'sel-btn-active': isActive('bold') }"
        @mousedown.prevent="run(() => editor!.chain().focus().toggleBold().run())"
        title="Bold"
      ><strong>B</strong></button>
      <button
        class="sel-btn"
        :class="{ 'sel-btn-active': isActive('italic') }"
        @mousedown.prevent="run(() => editor!.chain().focus().toggleItalic().run())"
        title="Italic"
      ><em>I</em></button>
      <button
        class="sel-btn"
        :class="{ 'sel-btn-active': isActive('underline') }"
        @mousedown.prevent="run(() => editor!.chain().focus().toggleUnderline().run())"
        title="Underline"
      ><span class="underline">U</span></button>
      <button
        class="sel-btn"
        :class="{ 'sel-btn-active': isActive('strike') }"
        @mousedown.prevent="run(() => editor!.chain().focus().toggleStrike().run())"
        title="Strikethrough"
      ><span class="line-through">S</span></button>
      <span class="w-px h-4 mx-0.5" style="background:rgba(0,0,0,0.1);" />
      <button
        class="sel-btn"
        :class="{ 'sel-btn-active': isActive('code') }"
        @mousedown.prevent="run(() => editor!.chain().focus().toggleCode().run())"
        title="Code"
      ><span class="font-mono text-[10px]">&lt;/&gt;</span></button>
      <button
        class="sel-btn"
        :class="{ 'sel-btn-active': isActive('link') }"
        @mousedown.prevent="toggleLink"
        title="Link"
      >&#x1F517;</button>
      <button
        class="sel-btn"
        :class="{ 'sel-btn-active': isActive('highlight') }"
        @mousedown.prevent="run(() => editor!.chain().focus().toggleHighlight({ color: '#fef08a' }).run())"
        title="Highlight"
      ><span class="px-0.5 rounded" style="background:#fef08a;color:rgba(0,0,0,0.85);">H</span></button>
      <span class="w-px h-4 mx-0.5" style="background:rgba(0,0,0,0.1);" />
      <button
        v-for="c in ['#ef4444', '#3b82f6', '#22c55e', '#000000']"
        :key="c"
        class="w-4 h-4 rounded-full hover:scale-125 transition-transform flex-shrink-0"
        style="border:1px solid rgba(0,0,0,0.15);"
        :style="{ background: c }"
        @mousedown.prevent="run(() => editor!.chain().focus().setColor(c).run())"
        :title="`Color: ${c}`"
      />
    </div>
    <!-- Arrow -->
    <div class="flex justify-center">
      <div class="w-2.5 h-2.5 rotate-45 -mt-1.5" style="background:var(--color-bg-card); border-right:1px solid rgba(0,0,0,0.1); border-bottom:1px solid rgba(0,0,0,0.1);" />
    </div>
  </div>
  </Transition>
</template>

<style scoped>
.sel-btn {
  @apply w-7 h-7 rounded flex items-center justify-center text-sm transition-colors cursor-pointer select-none;
  color: rgba(0,0,0,0.55);
}
.sel-btn:hover {
  background: rgba(0,0,0,0.05);
  color: rgba(0,0,0,0.85);
}
.sel-btn-active {
  color: var(--color-accent-primary) !important;
  background: var(--color-badge-bg);
}
</style>
