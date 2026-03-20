<script setup lang="ts">
import type { Editor } from '@tiptap/vue-3'

const props = defineProps<{ editor: Editor | null }>()

function isActive(name: string, attrs?: Record<string, unknown>): boolean {
  return props.editor?.isActive(name, attrs) ?? false
}

function run(fn: () => boolean | void) {
  if (props.editor) fn()
}
</script>

<template>
  <div v-if="editor" class="flex items-center gap-1 px-4 py-2 border-b bg-white flex-wrap">
    <button
      class="toolbar-btn"
      :class="{ active: isActive('bold') }"
      @click="run(() => editor!.chain().focus().toggleBold().run())"
      title="加粗"
    >B</button>
    <button
      class="toolbar-btn"
      :class="{ active: isActive('italic') }"
      @click="run(() => editor!.chain().focus().toggleItalic().run())"
      title="斜体"
    >I</button>

    <span class="w-px h-5 bg-gray-300 mx-1" />

    <button
      v-for="level in [1, 2, 3]"
      :key="level"
      class="toolbar-btn text-xs"
      :class="{ active: isActive('manifoldHeading', { level }) }"
      @click="run(() => editor!.chain().focus().toggleNode('manifoldHeading', 'manifoldParagraph', { level }).run())"
    >H{{ level }}</button>

    <span class="w-px h-5 bg-gray-300 mx-1" />

    <button
      class="toolbar-btn"
      :class="{ active: isActive('bulletList') }"
      @click="run(() => editor!.chain().focus().toggleBulletList().run())"
    >UL</button>
    <button
      class="toolbar-btn"
      :class="{ active: isActive('orderedList') }"
      @click="run(() => editor!.chain().focus().toggleOrderedList().run())"
    >OL</button>

    <span class="w-px h-5 bg-gray-300 mx-1" />

    <button class="toolbar-btn" @click="run(() => editor!.chain().focus().undo().run())" title="撤销">&#x21A9;</button>
    <button class="toolbar-btn" @click="run(() => editor!.chain().focus().redo().run())" title="重做">&#x21AA;</button>

    <div class="flex-1" />
    <span class="text-xs text-gray-400 select-none">Manifold Editor</span>
  </div>
</template>

<style scoped>
.toolbar-btn {
  @apply w-8 h-8 rounded flex items-center justify-center text-sm text-gray-600
         hover:bg-gray-100 transition-colors cursor-pointer select-none;
}
.toolbar-btn.active {
  @apply bg-blue-100 text-blue-700;
}
</style>
