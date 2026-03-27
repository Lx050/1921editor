<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Editor } from '@tiptap/vue-3'
import HrStylePicker from './HrStylePicker.vue'

const props = defineProps<{ editor: Editor | null; aiFilling?: boolean }>()
const emit = defineEmits<{
  (e: 'open-svg-panel'): void
  (e: 'edit-link'): void
  (e: 'ai-fill-slots'): void
}>()

const imageInput = ref<HTMLInputElement | null>(null)
const inlineImageInput = ref<HTMLInputElement | null>(null)
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

function isActive(name: string, attrs?: Record<string, unknown>): boolean {
  return props.editor?.isActive(name, attrs) ?? false
}

function run(fn: () => boolean | void) {
  if (props.editor) fn()
}

// --- Universal block type switcher ---
type BlockType = 'body' | 'intro' | 'outro' | 'h1' | 'h2' | 'h3' | 'blockquote'

const blockTypeOptions: { value: BlockType; label: string }[] = [
  { value: 'body', label: '正文' },
  { value: 'intro', label: '引言' },
  { value: 'outro', label: '结尾语' },
  { value: 'h1', label: 'H1 大标题' },
  { value: 'h2', label: 'H2 小标题' },
  { value: 'h3', label: 'H3 段标题' },
  { value: 'blockquote', label: '引用块' },
]

const currentBlockType = computed<BlockType>(() => {
  if (!props.editor) return 'body'
  if (isActive('manifoldHeading', { level: 1 })) return 'h1'
  if (isActive('manifoldHeading', { level: 2 })) return 'h2'
  if (isActive('manifoldHeading', { level: 3 })) return 'h3'
  if (isActive('blockquote')) return 'blockquote'
  if (isActive('paragraph')) {
    const { $from } = props.editor.state.selection
    const role = $from.parent.attrs?.blockRole || 'body'
    if (role === 'intro') return 'intro'
    if (role === 'outro') return 'outro'
    return 'body'
  }
  return 'body'
})

function setBlockType(type: BlockType) {
  if (!props.editor) return
  const chain = props.editor.chain().focus()

  switch (type) {
    case 'h1':
      chain.setNode('manifoldHeading', { level: 1 }).run()
      break
    case 'h2':
      chain.setNode('manifoldHeading', { level: 2 }).run()
      break
    case 'h3':
      chain.setNode('manifoldHeading', { level: 3 }).run()
      break
    case 'blockquote':
      // If already in blockquote, this toggles it off; if not, wraps
      if (isActive('blockquote')) {
        chain.lift('blockquote').run()
      } else {
        // First ensure we're in a paragraph, then wrap
        chain.setParagraph().run()
        props.editor.chain().focus().toggleBlockquote().run()
      }
      break
    case 'intro':
      chain.setParagraph().updateAttributes('paragraph', { blockRole: 'intro' }).run()
      break
    case 'outro':
      chain.setParagraph().updateAttributes('paragraph', { blockRole: 'outro' }).run()
      break
    case 'body':
    default:
      chain.setParagraph().updateAttributes('paragraph', { blockRole: 'body' }).run()
      break
  }
}

function triggerImageUpload() {
  imageInput.value?.click()
}

function triggerInlineImageUpload() {
  inlineImageInput.value?.click()
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

function handleInlineImageUpload(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file || !props.editor) return
  const localUrl = URL.createObjectURL(file)
  props.editor.chain().focus().insertContent({
    type: 'manifoldInlineImage',
    attrs: { src: localUrl, width: '100%' },
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
  <div v-if="editor" role="toolbar" aria-label="编辑器工具栏" class="flex items-center gap-1 px-3 py-2 border-b bg-white flex-wrap overflow-x-auto scrollbar-thin">

    <!-- Block type switcher (universal) -->
    <select
      class="text-xs border rounded px-1.5 h-8 text-gray-700 bg-white font-medium min-w-[80px]"
      :value="currentBlockType"
      @change="setBlockType(($event.target as HTMLSelectElement).value as BlockType)"
      title="块类型"
    >
      <option v-for="opt in blockTypeOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
    </select>

    <span class="w-px h-5 bg-gray-300 mx-1" />

    <!-- Text formatting: Bold, Italic, Underline -->
    <button
      class="toolbar-btn"
      :class="{ active: isActive('bold') }"
      @click="run(() => editor!.chain().focus().toggleBold().run())"
      title="加粗 (Ctrl+B)"
      aria-label="加粗"
    ><strong>B</strong></button>
    <button
      class="toolbar-btn"
      :class="{ active: isActive('italic') }"
      @click="run(() => editor!.chain().focus().toggleItalic().run())"
      title="斜体 (Ctrl+I)"
      aria-label="斜体"
    ><em>I</em></button>
    <button
      class="toolbar-btn"
      :class="{ active: isActive('underline') }"
      @click="run(() => editor!.chain().focus().toggleUnderline().run())"
      title="下划线 (Ctrl+U)"
    ><span class="underline">U</span></button>
    <button
      class="toolbar-btn text-xs"
      :class="{ active: isActive('link') }"
      @click="toggleLink"
      title="链接 (Ctrl+K)"
    >&#x1F517;</button>

    <span class="w-px h-5 bg-gray-300 mx-1" />

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

    <span class="w-px h-5 bg-gray-300 mx-1" />

    <!-- Lists -->
    <button
      class="toolbar-btn text-xs"
      :class="{ active: isActive('bulletList') }"
      @click="run(() => editor!.chain().focus().toggleBulletList().run())"
      title="无序列表"
    >UL</button>
    <button
      class="toolbar-btn text-xs"
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
    <button
      class="toolbar-btn text-xs"
      :class="{ active: isActive({ textAlign: 'justify' }) }"
      @click="run(() => editor!.chain().focus().setTextAlign('justify').run())"
      title="两端对齐"
    >&#x2630;</button>

    <span class="w-px h-5 bg-gray-300 mx-1" />

    <!-- Insert: HR, Image (block + inline), SVG -->
    <HrStylePicker :editor="editor" />
    <div class="relative group">
      <button class="toolbar-btn text-xs" title="插入图片">IMG</button>
      <div class="hidden group-hover:flex absolute top-full left-0 mt-1 bg-white border rounded-lg shadow-lg p-1 z-50 flex-col w-[120px]">
        <button
          class="text-left text-xs px-2 py-1.5 rounded hover:bg-gray-100 text-gray-700 whitespace-nowrap"
          @mousedown.prevent="triggerImageUpload"
        >图片块</button>
        <button
          class="text-left text-xs px-2 py-1.5 rounded hover:bg-gray-100 text-gray-700 whitespace-nowrap"
          @mousedown.prevent="triggerInlineImageUpload"
        >段内图片</button>
      </div>
    </div>
    <button class="toolbar-btn text-xs" @click="emit('open-svg-panel')" title="插入SVG模板">SVG</button>
    <input ref="imageInput" type="file" accept="image/*" class="hidden" @change="handleImageUpload" />
    <input ref="inlineImageInput" type="file" accept="image/*" class="hidden" @change="handleInlineImageUpload" />

    <span class="w-px h-5 bg-gray-300 mx-1" />

    <!-- AI Image Generation -->
    <button
      class="toolbar-btn text-xs font-medium"
      :class="aiFilling ? 'bg-purple-100 text-purple-600 animate-pulse' : 'text-purple-500 hover:bg-purple-50'"
      @click="emit('ai-fill-slots')"
      :title="aiFilling ? 'AI生图中...' : 'AI自动填充SVG图片槽位'"
    >AI</button>

    <span class="w-px h-5 bg-gray-300 mx-1" />

    <!-- Undo/Redo -->
    <button class="toolbar-btn" :class="{ 'opacity-30': !canUndo }" @click="run(() => editor!.chain().focus().undo().run())" title="撤销 (Ctrl+Z)">&#x21A9;</button>
    <button class="toolbar-btn" :class="{ 'opacity-30': !canRedo }" @click="run(() => editor!.chain().focus().redo().run())" title="重做 (Ctrl+Shift+Z)">&#x21AA;</button>
    <button class="toolbar-btn text-xs text-gray-400" @click="clearFormatting" title="清除格式">Tx</button>
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
/* Mobile: larger touch targets */
@media (max-width: 768px) {
  .toolbar-btn {
    @apply w-9 h-9;
  }
}
@media (pointer: coarse) {
  .toolbar-btn {
    @apply w-10 h-10;
  }
}
.scrollbar-thin::-webkit-scrollbar {
  height: 2px;
}
.scrollbar-thin::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 1px;
}
</style>
