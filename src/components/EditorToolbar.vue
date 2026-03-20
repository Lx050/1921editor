<script setup lang="ts">
import { ref } from 'vue'
import type { Editor } from '@tiptap/vue-3'

const props = defineProps<{ editor: Editor | null }>()
const emit = defineEmits<{
  (e: 'open-svg-panel'): void
}>()

const imageInput = ref<HTMLInputElement | null>(null)
const colorInput = ref<HTMLInputElement | null>(null)

const presetColors = ['#000000', '#374151', '#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6']
const highlightColors = ['#fef08a', '#fed7aa', '#bbf7d0', '#bae6fd', '#e9d5ff', '#fecdd3']
const fontSizes = ['12', '13', '14', '15', '16', '18', '20', '24']

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

function setColor(color: string) {
  if (!props.editor) return
  props.editor.chain().focus().setColor(color).run()
}

function handleColorInput(event: Event) {
  const value = (event.target as HTMLInputElement).value
  setColor(value)
}

function setHighlight(color: string) {
  if (!props.editor) return
  props.editor.chain().focus().toggleHighlight({ color }).run()
}

function setFontSize(size: string) {
  if (!props.editor) return
  props.editor.chain().focus().setFontSize(`${size}px`).run()
}

function clearFormatting() {
  if (!props.editor) return
  props.editor.chain().focus().clearNodes().unsetAllMarks().run()
}

function toggleLink() {
  if (!props.editor) return
  if (props.editor.isActive('link')) {
    props.editor.chain().focus().unsetLink().run()
    return
  }
  const url = window.prompt('输入链接地址', 'https://')
  if (url) {
    props.editor.chain().focus().setLink({ href: url }).run()
  }
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
    <button
      class="toolbar-btn"
      :class="{ active: isActive('underline') }"
      @click="run(() => editor!.chain().focus().toggleUnderline().run())"
      title="下划线 (Ctrl+U)"
    ><span class="underline">U</span></button>
    <button
      class="toolbar-btn"
      :class="{ active: isActive('strike') }"
      @click="run(() => editor!.chain().focus().toggleStrike().run())"
      title="删除线 (Ctrl+Shift+S)"
    ><span class="line-through">S</span></button>
    <button
      class="toolbar-btn text-xs"
      :class="{ active: isActive('link') }"
      @click="toggleLink"
      title="链接 (Ctrl+K)"
    >&#x1F517;</button>

    <!-- Color picker -->
    <div class="relative group">
      <button
        class="toolbar-btn text-xs"
        title="文字颜色"
      >
        <span class="font-bold" :style="{ color: editor?.getAttributes('textStyle').color || '#000' }">A</span>
        <span class="absolute bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded" :style="{ background: editor?.getAttributes('textStyle').color || '#000' }" />
      </button>
      <div class="hidden group-hover:flex absolute top-full left-0 mt-1 bg-white border rounded-lg shadow-lg p-2 gap-1 flex-wrap w-[140px] z-50">
        <button
          v-for="c in presetColors"
          :key="c"
          class="w-5 h-5 rounded border border-gray-200 hover:scale-110 transition-transform"
          :style="{ background: c }"
          @mousedown.prevent="setColor(c)"
        />
        <button
          class="w-5 h-5 rounded border border-gray-200 text-[10px] hover:bg-gray-100"
          @mousedown.prevent="colorInput?.click()"
          title="自定义颜色"
        >...</button>
        <input ref="colorInput" type="color" class="sr-only" @input="handleColorInput" />
      </div>
    </div>

    <!-- Highlight -->
    <div class="relative group">
      <button
        class="toolbar-btn text-xs"
        :class="{ active: isActive('highlight') }"
        title="背景高亮"
      >
        <span class="font-bold px-1 rounded" style="background: #fef08a;">H</span>
      </button>
      <div class="hidden group-hover:flex absolute top-full left-0 mt-1 bg-white border rounded-lg shadow-lg p-2 gap-1 flex-wrap w-[120px] z-50">
        <button
          v-for="c in highlightColors"
          :key="c"
          class="w-5 h-5 rounded border border-gray-200 hover:scale-110 transition-transform"
          :style="{ background: c }"
          @mousedown.prevent="setHighlight(c)"
        />
        <button
          class="w-5 h-5 rounded border border-gray-200 text-[10px] hover:bg-gray-100"
          @mousedown.prevent="run(() => editor!.chain().focus().unsetHighlight().run())"
          title="清除高亮"
        >x</button>
      </div>
    </div>

    <!-- Font size -->
    <select
      class="text-xs border rounded px-1 h-7 text-gray-600 bg-white w-14"
      @change="setFontSize(($event.target as HTMLSelectElement).value)"
      title="字号"
    >
      <option v-for="s in fontSizes" :key="s" :value="s">{{ s }}px</option>
    </select>

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

    <!-- Alignment -->
    <button
      class="toolbar-btn text-xs"
      :class="{ active: isActive({ textAlign: 'left' }) }"
      @click="run(() => editor!.chain().focus().setTextAlign('left').run())"
      title="左对齐"
    >&#x2261;</button>
    <button
      class="toolbar-btn text-xs"
      :class="{ active: isActive({ textAlign: 'center' }) }"
      @click="run(() => editor!.chain().focus().setTextAlign('center').run())"
      title="居中"
    >&#x2550;</button>
    <button
      class="toolbar-btn text-xs"
      :class="{ active: isActive({ textAlign: 'right' }) }"
      @click="run(() => editor!.chain().focus().setTextAlign('right').run())"
      title="右对齐"
    >&#x2263;</button>

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
    <button class="toolbar-btn text-xs text-gray-400" @click="clearFormatting" title="清除格式">Tx</button>

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
