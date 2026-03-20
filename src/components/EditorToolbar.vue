<script setup lang="ts">
import { ref } from 'vue'
import type { Editor } from '@tiptap/vue-3'

const props = defineProps<{ editor: Editor | null }>()
const emit = defineEmits<{
  (e: 'open-svg-panel'): void
}>()

const imageInput = ref<HTMLInputElement | null>(null)

function isActive(name: string, attrs?: Record<string, unknown>): boolean {
  return props.editor?.isActive(name, attrs) ?? false
}

function run(fn: () => boolean | void) {
  if (props.editor) fn()
}

function getCurrentRole(): string {
  if (!props.editor) return 'body'
  const { $from } = props.editor.state.selection
  return $from.parent.attrs?.blockRole || 'body'
}

function setBlockRole(role: string) {
  if (!props.editor) return
  props.editor.chain().focus().updateAttributes('manifoldParagraph', { blockRole: role }).run()
}

function insertHR() {
  if (!props.editor) return
  props.editor.chain().focus().setHorizontalRule().run()
}

function triggerImageUpload() {
  imageInput.value?.click()
}

function handleImageUpload(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file || !props.editor) return
  const localUrl = URL.createObjectURL(file)
  props.editor.chain().focus().insertContent({
    type: 'manifoldImage',
    attrs: { src: localUrl, caption: '', layout: 'full_width' },
  }).run()
  input.value = ''
}
</script>

<template>
  <div v-if="editor" class="flex items-center gap-1 px-4 py-2 border-b bg-white flex-wrap">
    <!-- Text formatting -->
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

    <!-- Headings -->
    <button
      v-for="level in [1, 2, 3]"
      :key="level"
      class="toolbar-btn text-xs"
      :class="{ active: isActive('manifoldHeading', { level }) }"
      @click="run(() => editor!.chain().focus().toggleNode('manifoldHeading', 'manifoldParagraph', { level }).run())"
    >H{{ level }}</button>

    <span class="w-px h-5 bg-gray-300 mx-1" />

    <!-- Block role (for paragraphs) -->
    <select
      v-if="isActive('manifoldParagraph')"
      class="text-xs border rounded px-1 h-7 text-gray-600 bg-white"
      :value="getCurrentRole()"
      @change="setBlockRole(($event.target as HTMLSelectElement).value)"
      title="段落角色"
    >
      <option value="body">正文</option>
      <option value="intro">引言</option>
      <option value="outro">结尾</option>
    </select>

    <span class="w-px h-5 bg-gray-300 mx-1" />

    <!-- Lists -->
    <button
      class="toolbar-btn"
      :class="{ active: isActive('bulletList') }"
      @click="run(() => editor!.chain().focus().toggleBulletList().run())"
      title="无序列表"
    >UL</button>
    <button
      class="toolbar-btn"
      :class="{ active: isActive('orderedList') }"
      @click="run(() => editor!.chain().focus().toggleOrderedList().run())"
      title="有序列表"
    >OL</button>

    <span class="w-px h-5 bg-gray-300 mx-1" />

    <!-- Insert items -->
    <button class="toolbar-btn" @click="insertHR" title="分隔线">&#x2015;</button>
    <button class="toolbar-btn" @click="triggerImageUpload" title="插入图片">IMG</button>
    <button class="toolbar-btn" @click="emit('open-svg-panel')" title="插入SVG模板">SVG</button>
    <input ref="imageInput" type="file" accept="image/*" class="hidden" @change="handleImageUpload" />

    <span class="w-px h-5 bg-gray-300 mx-1" />

    <!-- Undo/Redo -->
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
