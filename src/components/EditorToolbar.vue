<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Editor } from '@tiptap/vue-3'
import HrStylePicker from './HrStylePicker.vue'

const props = defineProps<{ editor: Editor | null }>()
const emit = defineEmits<{
  (e: 'open-svg-panel'): void
  (e: 'edit-link'): void
}>()

const imageInput = ref<HTMLInputElement | null>(null)
const colorInput = ref<HTMLInputElement | null>(null)

const presetColors = ['#000000', '#374151', '#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6']
const highlightColors = ['#fef08a', '#fed7aa', '#bbf7d0', '#bae6fd', '#e9d5ff', '#fecdd3']

// Recent custom colors
const recentColors = ref<string[]>([])
try {
  const saved = JSON.parse(localStorage.getItem('manifold_recent_colors') || '[]')
  if (Array.isArray(saved)) recentColors.value = saved.slice(0, 5)
} catch { /* ignore */ }

function addRecentColor(color: string) {
  if (presetColors.includes(color)) return
  recentColors.value = [color, ...recentColors.value.filter(c => c !== color)].slice(0, 5)
  try { localStorage.setItem('manifold_recent_colors', JSON.stringify(recentColors.value)) } catch { /* ignore */ }
}

const canUndo = computed(() => props.editor?.can().undo() ?? false)
const canRedo = computed(() => props.editor?.can().redo() ?? false)
const fontSizes = ['12', '13', '14', '15', '16', '18', '20', '24']
const lineHeights = ['1', '1.25', '1.5', '1.75', '2']

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
  props.editor.chain().focus().updateAttributes('paragraph', { blockRole: role }).run()
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
  addRecentColor(value)
}

function setHighlight(color: string) {
  if (!props.editor) return
  props.editor.chain().focus().toggleHighlight({ color }).run()
}

function setFontSize(size: string) {
  if (!props.editor) return
  props.editor.chain().focus().setFontSize(`${size}px`).run()
}

function indent() {
  if (!props.editor) return
  const { $from } = props.editor.state.selection
  if ($from.parent.type.name === 'paragraph') {
    const current = $from.parent.attrs.textIndent || 0
    if (current < 4) {
      props.editor.commands.updateAttributes('paragraph', { textIndent: current + 1 })
    }
  }
}

function outdent() {
  if (!props.editor) return
  const { $from } = props.editor.state.selection
  if ($from.parent.type.name === 'paragraph') {
    const current = $from.parent.attrs.textIndent || 0
    if (current > 0) {
      props.editor.commands.updateAttributes('paragraph', { textIndent: current - 1 })
    }
  }
}

function setLineHeight(value: string) {
  if (!props.editor) return
  props.editor.commands.updateAttributes('paragraph', { lineHeight: value })
}

function clearFormatting() {
  if (!props.editor) return
  props.editor.chain().focus().clearNodes().unsetAllMarks().run()
}

function toggleLink() {
  if (!props.editor) return
  emit('edit-link')
}
</script>

<template>
  <div v-if="editor" role="toolbar" aria-label="编辑器工具栏" class="flex items-center gap-1 px-4 py-2 border-b bg-white flex-wrap overflow-x-auto scrollbar-thin">
    <!-- Text formatting -->
    <button
      class="toolbar-btn"
      :class="{ active: isActive('bold') }"
      @click="run(() => editor!.chain().focus().toggleBold().run())"
      title="加粗 (Ctrl+B)"
      aria-label="加粗"
    >B</button>
    <button
      class="toolbar-btn"
      :class="{ active: isActive('italic') }"
      @click="run(() => editor!.chain().focus().toggleItalic().run())"
      title="斜体 (Ctrl+I)"
      aria-label="斜体"
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
      class="toolbar-btn text-[10px]"
      :class="{ active: isActive('superscript') }"
      @click="run(() => editor!.chain().focus().toggleSuperscript().run())"
      title="上标 (Ctrl+.)"
    >X<sup>2</sup></button>
    <button
      class="toolbar-btn text-[10px]"
      :class="{ active: isActive('subscript') }"
      @click="run(() => editor!.chain().focus().toggleSubscript().run())"
      title="下标 (Ctrl+,)"
    >X<sub>2</sub></button>
    <button
      class="toolbar-btn text-xs"
      :class="{ active: isActive('code') }"
      @click="run(() => editor!.chain().focus().toggleCode().run())"
      title="行内代码 (Ctrl+E)"
    ><span class="font-mono text-[10px] bg-gray-100 px-0.5 rounded">&lt;/&gt;</span></button>
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
        <template v-if="recentColors.length > 0">
          <div class="w-full border-t my-0.5" />
          <button
            v-for="c in recentColors"
            :key="'r-' + c"
            class="w-5 h-5 rounded border border-gray-200 hover:scale-110 transition-transform"
            :style="{ background: c }"
            @mousedown.prevent="setColor(c)"
            :title="c"
          />
        </template>
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

    <!-- 字号、行高由排版样式预设统一控制，不在工具栏显示 -->

    <span class="w-px h-5 bg-gray-300 mx-1" />

    <!-- Headings -->
    <button
      v-for="level in [1, 2, 3]"
      :key="level"
      class="toolbar-btn text-xs"
      :class="{ active: isActive('manifoldHeading', { level }) }"
      @click="run(() => editor!.chain().focus().toggleNode('manifoldHeading', 'paragraph', { level }).run())"
    >H{{ level }}</button>

    <span class="w-px h-5 bg-gray-300 mx-1" />

    <!-- Block role (for paragraphs) -->
    <select
      v-if="isActive('paragraph')"
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

    <!-- Lists & Blockquote -->
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
    <button
      class="toolbar-btn text-xs"
      :class="{ active: isActive('blockquote') }"
      @click="run(() => editor!.chain().focus().toggleBlockquote().run())"
      title="引用"
    >&#x201C;</button>

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
    <button
      class="toolbar-btn text-xs"
      :class="{ active: isActive({ textAlign: 'justify' }) }"
      @click="run(() => editor!.chain().focus().setTextAlign('justify').run())"
      title="两端对齐"
    >&#x2630;</button>

    <!-- Indent/Outdent -->
    <button class="toolbar-btn text-xs" @click="outdent" title="减少缩进 (Shift+Tab)">&#x21E4;</button>
    <button class="toolbar-btn text-xs" @click="indent" title="增加缩进 (Tab)">&#x21E5;</button>

    <span class="w-px h-5 bg-gray-300 mx-1" />

    <!-- Insert items -->
    <HrStylePicker :editor="editor" />
    <button class="toolbar-btn" @click="triggerImageUpload" title="插入图片">IMG</button>
    <button class="toolbar-btn" @click="emit('open-svg-panel')" title="插入SVG模板">SVG</button>
    <button
      class="toolbar-btn text-xs"
      @click="run(() => editor!.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run())"
      title="插入表格"
    >TBL</button>
    <button
      class="toolbar-btn text-xs font-mono"
      :class="{ active: isActive('codeBlock') }"
      @click="run(() => editor!.chain().focus().toggleCodeBlock().run())"
      title="代码块"
    >{}</button>
    <input ref="imageInput" type="file" accept="image/*" class="hidden" @change="handleImageUpload" />

    <span class="w-px h-5 bg-gray-300 mx-1" />

    <!-- Undo/Redo -->
    <button class="toolbar-btn" :class="{ 'opacity-30': !canUndo }" @click="run(() => editor!.chain().focus().undo().run())" title="撤销 (Ctrl+Z)">&#x21A9;</button>
    <button class="toolbar-btn" :class="{ 'opacity-30': !canRedo }" @click="run(() => editor!.chain().focus().redo().run())" title="重做 (Ctrl+Shift+Z)">&#x21AA;</button>
    <button class="toolbar-btn text-xs text-gray-400" @click="clearFormatting" title="清除格式">Tx</button>

    <div class="flex-1" />
    <span class="text-xs text-gray-400 select-none">Manifold Editor</span>
  </div>
</template>

<style scoped>
.toolbar-btn {
  @apply w-8 h-8 rounded flex items-center justify-center text-sm text-gray-600
         hover:bg-gray-100 transition-colors cursor-pointer select-none flex-shrink-0;
}
.toolbar-btn.active {
  @apply bg-blue-100 text-blue-700;
}
.scrollbar-thin::-webkit-scrollbar {
  height: 2px;
}
.scrollbar-thin::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 1px;
}
</style>
