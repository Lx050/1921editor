<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { EditorContent } from '@tiptap/vue-3'
import { storeToRefs } from 'pinia'
import { useAppStore } from '../stores/appStore'
import { useConfigStore } from '../stores/configStore'
import { createManifoldEditor } from '../editor/core/createEditor'
import { contentBlocksToTiptap } from '../editor/serializers/jsonImporter'
import { smartTextParser } from '../utils/textParser'
import EditorToolbar from '../components/EditorToolbar.vue'
import EditorSidebar from '../components/EditorSidebar.vue'
import ImageSlotPopover from '../components/ImageSlotPopover.vue'
import KeyboardShortcutHelp from '../components/KeyboardShortcutHelp.vue'
import FindReplace from '../components/FindReplace.vue'
import TableBubbleMenu from '../components/TableBubbleMenu.vue'
import HtmlPreviewModal from '../components/HtmlPreviewModal.vue'
import SelectionToolbar from '../components/SelectionToolbar.vue'
import LinkEditPopover from '../components/LinkEditPopover.vue'
import LinkHoverTooltip from '../components/LinkHoverTooltip.vue'
import { serializeToWechatHtml } from '../editor/serializers/htmlSerializer'
import { serializeToMarkdown } from '../editor/serializers/markdownSerializer'
import type { Editor } from '@tiptap/vue-3'
import type { EditorDocument, ImageSlotData } from '@/types/editor'

const router = useRouter()
const appStore = useAppStore()
const configStore = useConfigStore()
const { contentBlocks } = storeToRefs(appStore)

const editor = ref<Editor | null>(null)
const sidebarRef = ref<InstanceType<typeof EditorSidebar> | null>(null)

// Image slot popover state
const popoverVisible = ref(false)
const popoverPosition = ref({ x: 0, y: 0 })
const popoverSlotId = ref('')
const popoverNodePos = ref<number | null>(null)
const popoverCurrentData = ref<ImageSlotData | null>(null)

const shortcutHelpVisible = ref(false)
const isDragOver = ref(false)
const isFullscreen = ref(false)
const autosaveStatus = ref<'idle' | 'saving' | 'saved'>('idle')
const copyStatus = ref<'idle' | 'copied'>('idle')
const statsVisible = ref(false)
const findReplaceVisible = ref(false)
const previewVisible = ref(false)
const previewHtml = ref('')
const linkPopoverVisible = ref(false)
const linkPopoverPosition = ref({ x: 0, y: 0 })
const linkPopoverInitialUrl = ref('')
const isFocusMode = ref(false)
const wordCountGoal = ref(0) // 0 = no goal set
let dragLeaveTimer: ReturnType<typeof setTimeout> | null = null
let autosaveTimer: ReturnType<typeof setTimeout> | null = null
let autosaveFadeTimer: ReturnType<typeof setTimeout> | null = null

function handleEditorUpdate(json: EditorDocument) {
  appStore.editorJson = json
  autosaveStatus.value = 'saving'
  // Debounced autosave to localStorage
  if (autosaveTimer) clearTimeout(autosaveTimer)
  if (autosaveFadeTimer) clearTimeout(autosaveFadeTimer)
  autosaveTimer = setTimeout(() => {
    try {
      localStorage.setItem('manifold_editor_autosave', JSON.stringify(json))
      autosaveStatus.value = 'saved'
      autosaveFadeTimer = setTimeout(() => { autosaveStatus.value = 'idle' }, 3000)
    } catch { /* ignore quota errors */ }
  }, 2000)
}

function toggleFullscreen() {
  isFullscreen.value = !isFullscreen.value
}

async function copyAsWechatHtml() {
  if (!editor.value) return
  const doc = editor.value.getJSON() as EditorDocument
  const html = serializeToWechatHtml(doc)
  try {
    const blob = new Blob([html], { type: 'text/html' })
    const plainBlob = new Blob([html], { type: 'text/plain' })
    await navigator.clipboard.write([
      new ClipboardItem({ 'text/html': blob, 'text/plain': plainBlob })
    ])
  } catch {
    // Fallback to plain text copy
    await navigator.clipboard.writeText(html).catch(() => {})
  }
  copyStatus.value = 'copied'
  setTimeout(() => { copyStatus.value = 'idle' }, 2000)
}

function openPreview() {
  if (!editor.value) return
  const doc = editor.value.getJSON() as EditorDocument
  previewHtml.value = serializeToWechatHtml(doc)
  previewVisible.value = true
}

async function exportMarkdown() {
  if (!editor.value) return
  const doc = editor.value.getJSON() as EditorDocument
  const md = serializeToMarkdown(doc)
  try {
    await navigator.clipboard.writeText(md)
    copyStatus.value = 'copied'
    setTimeout(() => { copyStatus.value = 'idle' }, 2000)
  } catch {
    // Fallback: download as file
    const blob = new Blob([md], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'article.md'
    a.click()
    URL.revokeObjectURL(url)
  }
}

function openLinkEditor() {
  if (!editor.value) return
  const { from, to } = editor.value.state.selection
  const view = editor.value.view
  const start = view.coordsAtPos(from)
  const end = view.coordsAtPos(to)
  const centerX = (start.left + end.right) / 2
  const bottomY = Math.max(start.bottom, end.bottom)
  linkPopoverPosition.value = { x: centerX, y: bottomY }
  linkPopoverInitialUrl.value = editor.value.getAttributes('link').href || ''
  linkPopoverVisible.value = true
}

function handleLinkConfirm(url: string) {
  if (!editor.value) return
  editor.value.chain().focus().setLink({ href: url }).run()
  linkPopoverVisible.value = false
}

function handleLinkRemove() {
  if (!editor.value) return
  editor.value.chain().focus().unsetLink().run()
  linkPopoverVisible.value = false
}

function insertSvgTemplate(tpl: { id: string; name: string; svg: string; imageSlots?: any[] }) {
  if (!editor.value) return

  const slots: Record<string, null> = {}
  if (tpl.imageSlots) {
    for (const slot of tpl.imageSlots) {
      slots[slot.id] = null
    }
  }

  editor.value
    .chain()
    .focus()
    .insertContent({
      type: 'manifoldSvgBlock',
      attrs: {
        templateId: tpl.id,
        source: 'manifold',
        svgContent: tpl.svg,
        imageSlots: slots,
        config: {},
      },
    })
    .run()
}

function handleSlotImageSelect(data: ImageSlotData) {
  if (!editor.value || popoverNodePos.value === null) return

  const { state } = editor.value
  const node = state.doc.nodeAt(popoverNodePos.value)
  if (node && node.type.name === 'manifoldSvgBlock') {
    const currentSlots = { ...(node.attrs.imageSlots || {}) }
    currentSlots[popoverSlotId.value] = data
    editor.value.chain()
      .setNodeSelection(popoverNodePos.value)
      .updateAttributes('manifoldSvgBlock', { imageSlots: currentSlots })
      .run()
  }

  popoverVisible.value = false
}

function handleCanvasClick(event: MouseEvent) {
  const slotEl = (event.target as Element).closest?.('[data-image-slot]')
  if (!slotEl) return

  const slotId = slotEl.getAttribute('data-image-slot')
  if (!slotId) return

  const svgBlockEl = slotEl.closest('[data-node-type="manifold-svg-block"]')
  if (!svgBlockEl) return

  const rect = slotEl.getBoundingClientRect()
  popoverSlotId.value = slotId
  popoverPosition.value = { x: rect.left + rect.width / 2, y: rect.bottom + 8 }
  popoverVisible.value = true

  if (editor.value) {
    const view = editor.value.view
    const pos = view.posAtDOM(svgBlockEl, 0)
    popoverNodePos.value = pos > 0 ? pos - 1 : 0

    const node = editor.value.state.doc.nodeAt(popoverNodePos.value)
    if (node) {
      const slots = node.attrs.imageSlots || {}
      popoverCurrentData.value = slots[slotId] || null
    }
  }

  event.stopPropagation()
}

function handleOpenSvgPanel() {
  sidebarRef.value?.switchToSvg()
}

/** Insert image into editor from sidebar gallery click */
function handleInsertImage(data: { src: string; name: string; mediaId?: string }) {
  if (!editor.value) return
  editor.value.chain().focus().insertContent({
    type: 'manifoldImage',
    attrs: { src: data.src, mediaId: data.mediaId || '', caption: '', layout: 'full_width' },
  }).run()
}

/** Handle drag-drop images onto the editor canvas */
function handleDrop(event: DragEvent) {
  isDragOver.value = false
  if (!editor.value) return

  // Check for gallery drag (application/manifold-image)
  const manifoldData = event.dataTransfer?.getData('application/manifold-image')
  if (manifoldData) {
    event.preventDefault()
    try {
      const parsed = JSON.parse(manifoldData)
      editor.value.chain().focus().insertContent({
        type: 'manifoldImage',
        attrs: { src: parsed.src, mediaId: parsed.mediaId || '', caption: '', layout: 'full_width' },
      }).run()
    } catch { /* ignore parse errors */ }
    return
  }

  // Check for file drop
  if (!event.dataTransfer?.files.length) return
  const file = event.dataTransfer.files[0]
  if (!file.type.startsWith('image/')) return

  event.preventDefault()
  const localUrl = URL.createObjectURL(file)
  editor.value.chain().focus().insertContent({
    type: 'manifoldImage',
    attrs: { src: localUrl, caption: '', layout: 'full_width' },
  }).run()
}

function handleDragOver(event: DragEvent) {
  if (event.dataTransfer?.types.includes('Files') || event.dataTransfer?.types.includes('application/manifold-image')) {
    event.preventDefault()
    isDragOver.value = true
    if (dragLeaveTimer) { clearTimeout(dragLeaveTimer); dragLeaveTimer = null }
  }
}

function handleDragLeave() {
  // Debounce to avoid flickering when moving between child elements
  if (dragLeaveTimer) clearTimeout(dragLeaveTimer)
  dragLeaveTimer = setTimeout(() => { isDragOver.value = false }, 100)
}

onMounted(() => {
  let initialContent: EditorDocument

  if (appStore.editorJson) {
    initialContent = appStore.editorJson as EditorDocument
  } else if (contentBlocks.value.length > 0) {
    initialContent = contentBlocksToTiptap(contentBlocks.value)
  } else if (appStore.rawText) {
    // Parse rawText from Step1 into contentBlocks, then convert to tiptap
    const blocks = smartTextParser(appStore.rawText)
    appStore.setContentBlocks(blocks)
    initialContent = contentBlocksToTiptap(blocks)
  } else {
    // Try restoring from autosave
    try {
      const saved = localStorage.getItem('manifold_editor_autosave')
      if (saved) {
        initialContent = JSON.parse(saved) as EditorDocument
      }
    } catch { /* ignore */ }
    if (!initialContent!) {
      initialContent = {
        type: 'doc',
        content: [
          { type: 'manifoldHeading', attrs: { level: 1 }, content: [{ type: 'text', text: '' }] },
          { type: 'manifoldParagraph', content: [{ type: 'text', text: '' }] },
        ]
      }
    }
  }

  editor.value = createManifoldEditor({
    content: initialContent,
    onUpdate: handleEditorUpdate,
  })

  window.addEventListener('manifold:open-svg-panel', handleOpenSvgPanel)
  window.addEventListener('keydown', handleGlobalKeydown)
})

onBeforeUnmount(() => {
  if (autosaveTimer) clearTimeout(autosaveTimer)
  if (autosaveFadeTimer) clearTimeout(autosaveFadeTimer)
  editor.value?.destroy()
  window.removeEventListener('manifold:open-svg-panel', handleOpenSvgPanel)
  window.removeEventListener('keydown', handleGlobalKeydown)
})

// Live editor stats
const WECHAT_CHAR_LIMIT = 20000

const wordCount = computed(() => {
  if (!editor.value) return 0
  return editor.value.getText().length
})

const isOverLimit = computed(() => wordCount.value > WECHAT_CHAR_LIMIT)

const nodeCount = computed(() => {
  if (!editor.value) return 0
  let count = 0
  editor.value.state.doc.descendants(() => { count++ })
  return count
})

const svgBlockCount = computed(() => {
  if (!editor.value) return 0
  let count = 0
  editor.value.state.doc.descendants((node) => {
    if (node.type.name === 'manifoldSvgBlock') count++
  })
  return count
})

/** Estimated reading time (Chinese: ~400 chars/min) */
const readingTime = computed(() => {
  if (wordCount.value === 0) return '0'
  const mins = Math.ceil(wordCount.value / 400)
  return mins < 1 ? '<1' : String(mins)
})

const detailedStats = computed(() => {
  if (!editor.value) return { paragraphs: 0, headings: 0, images: 0, svgs: 0, tables: 0 }
  let paragraphs = 0, headings = 0, images = 0, svgs = 0, tables = 0
  editor.value.state.doc.descendants((node) => {
    if (node.type.name === 'manifoldParagraph') paragraphs++
    else if (node.type.name === 'manifoldHeading') headings++
    else if (node.type.name === 'manifoldImage') images++
    else if (node.type.name === 'manifoldSvgBlock') svgs++
    else if (node.type.name === 'table') tables++
  })
  return { paragraphs, headings, images, svgs, tables }
})

const canUndo = computed(() => editor.value?.can().undo() ?? false)
const canRedo = computed(() => editor.value?.can().redo() ?? false)

const goalProgress = computed(() => {
  if (wordCountGoal.value <= 0) return 0
  return Math.min(100, Math.round((wordCount.value / wordCountGoal.value) * 100))
})

function handleGlobalKeydown(event: KeyboardEvent) {
  const mod = event.ctrlKey || event.metaKey
  // Ctrl+F opens find & replace
  if (mod && event.key === 'f') {
    event.preventDefault()
    findReplaceVisible.value = !findReplaceVisible.value
    return
  }
  // Ctrl+S manual save
  if (mod && event.key === 's') {
    event.preventDefault()
    if (editor.value) {
      const json = editor.value.getJSON() as EditorDocument
      try {
        localStorage.setItem('manifold_editor_autosave', JSON.stringify(json))
        autosaveStatus.value = 'saved'
        if (autosaveFadeTimer) clearTimeout(autosaveFadeTimer)
        autosaveFadeTimer = setTimeout(() => { autosaveStatus.value = 'idle' }, 3000)
      } catch { /* ignore */ }
    }
    return
  }
  // Ctrl+K open link editor
  if (mod && event.key === 'k') {
    event.preventDefault()
    openLinkEditor()
    return
  }
  // Ctrl+Shift+F toggle focus mode
  if (mod && event.shiftKey && event.key === 'F') {
    event.preventDefault()
    isFocusMode.value = !isFocusMode.value
    return
  }
  // Ctrl+Shift+C copy as WeChat HTML
  if (mod && event.shiftKey && event.key === 'C') {
    event.preventDefault()
    copyAsWechatHtml()
    return
  }
  // Escape exits fullscreen or closes find
  if (event.key === 'Escape') {
    if (findReplaceVisible.value) { findReplaceVisible.value = false; return }
    if (statsVisible.value) { statsVisible.value = false; return }
    if (isFullscreen.value) { isFullscreen.value = false; return }
  }
  // "?" key when not typing in editor (Shift+/ on most keyboards)
  if (event.key === '?' && !editor.value?.isFocused) {
    event.preventDefault()
    shortcutHelpVisible.value = !shortcutHelpVisible.value
  }
}

function goBack() {
  router.push('/step1')
}

function goToPublish() {
  router.push('/step3')
}
</script>

<template>
  <div
    class="flex flex-col h-full w-full bg-gray-50 transition-all"
    :class="isFullscreen ? 'fixed inset-0 z-[100]' : ''"
  >
    <EditorToolbar :editor="editor" @open-svg-panel="handleOpenSvgPanel" @edit-link="openLinkEditor" />
    <TableBubbleMenu :editor="editor" />

    <div class="flex flex-1 overflow-hidden">
      <EditorSidebar ref="sidebarRef" :editor="editor" @insert-svg="insertSvgTemplate" @insert-image="handleInsertImage" />

      <div
        class="flex-1 overflow-y-auto relative"
        @click="handleCanvasClick"
        @drop="handleDrop"
        @dragover="handleDragOver"
        @dragleave="handleDragLeave"
      >
        <FindReplace :editor="editor" :visible="findReplaceVisible" @close="findReplaceVisible = false" />
        <div
          class="max-w-[680px] mx-auto py-8 px-6 bg-white min-h-full shadow-sm my-4 rounded transition-all"
          :class="isDragOver ? 'ring-2 ring-blue-400 ring-offset-2' : ''"
        >
          <EditorContent v-if="editor" :editor="editor" class="manifold-editor-content" :class="{ 'focus-mode': isFocusMode }" />
          <SelectionToolbar :editor="editor" @edit-link="openLinkEditor" />
          <LinkHoverTooltip :editor="editor" @edit-link="openLinkEditor" />
        </div>
        <!-- Drag overlay hint -->
        <div
          v-if="isDragOver"
          class="absolute inset-0 flex items-center justify-center bg-blue-50/60 pointer-events-none z-10"
        >
          <span class="text-blue-600 text-sm font-medium bg-white px-4 py-2 rounded-lg shadow">松开以插入图片</span>
        </div>
      </div>
    </div>

    <div class="flex-shrink-0 border-t bg-white px-6 py-3 flex items-center justify-between">
      <button
        class="text-sm text-gray-500 hover:text-gray-700 transition-colors"
        @click="goBack"
      >
        &larr; 返回文本输入
      </button>
      <div class="flex items-center gap-4">
        <span v-if="autosaveStatus === 'saving'" class="text-xs text-amber-500">保存中...</span>
        <span v-else-if="autosaveStatus === 'saved'" class="text-xs text-green-500">已保存</span>
        <div class="relative">
          <button
            class="text-xs transition-colors"
            :class="isOverLimit ? 'text-red-500 font-medium' : 'text-gray-400 hover:text-gray-600'"
            @click="statsVisible = !statsVisible"
            :title="isOverLimit ? `超出微信字数限制 (${WECHAT_CHAR_LIMIT} 字)` : '文档统计'"
          >{{ wordCount }} 字 / ~{{ readingTime }}min</button>
          <div
            v-if="statsVisible"
            class="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-white border rounded-lg shadow-lg p-3 z-50 w-48"
          >
            <div class="text-xs font-medium text-gray-700 mb-2">文档统计</div>
            <div class="space-y-1 text-xs text-gray-500">
              <div class="flex justify-between"><span>字数</span><span class="text-gray-700 font-medium">{{ wordCount }}</span></div>
              <div class="flex justify-between"><span>阅读时间</span><span class="text-gray-700">~{{ readingTime }} 分钟</span></div>
              <div class="flex justify-between"><span>标题</span><span class="text-gray-700">{{ detailedStats.headings }}</span></div>
              <div class="flex justify-between"><span>段落</span><span class="text-gray-700">{{ detailedStats.paragraphs }}</span></div>
              <div class="flex justify-between"><span>图片</span><span class="text-gray-700">{{ detailedStats.images }}</span></div>
              <div v-if="detailedStats.svgs > 0" class="flex justify-between"><span>SVG</span><span class="text-gray-700">{{ detailedStats.svgs }}</span></div>
              <div v-if="detailedStats.tables > 0" class="flex justify-between"><span>表格</span><span class="text-gray-700">{{ detailedStats.tables }}</span></div>
              <div class="border-t pt-1 mt-1 flex justify-between"><span>撤销/重做</span><span class="text-gray-700 font-mono text-[10px]">{{ canUndo ? '&#x21A9;' : '' }} {{ canRedo ? '&#x21AA;' : '' }}</span></div>
              <!-- Word count goal -->
              <div class="border-t pt-2 mt-2">
                <div class="flex items-center gap-1 mb-1">
                  <span class="text-gray-500">字数目标</span>
                  <input
                    type="number"
                    :value="wordCountGoal || ''"
                    @change="wordCountGoal = parseInt(($event.target as HTMLInputElement).value) || 0"
                    placeholder="--"
                    class="w-14 text-right text-gray-700 border border-gray-200 rounded px-1 py-0.5 text-[10px]"
                    min="0"
                    step="100"
                  />
                </div>
                <div v-if="wordCountGoal > 0" class="flex items-center gap-1">
                  <div class="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      class="h-full rounded-full transition-all duration-500"
                      :class="goalProgress >= 100 ? 'bg-green-500' : goalProgress >= 75 ? 'bg-blue-500' : 'bg-amber-500'"
                      :style="{ width: goalProgress + '%' }"
                    />
                  </div>
                  <span class="text-[10px] font-medium" :class="goalProgress >= 100 ? 'text-green-600' : 'text-gray-500'">{{ goalProgress }}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- Word count goal progress (compact) -->
        <div v-if="wordCountGoal > 0" class="flex items-center gap-1" :title="`目标: ${wordCountGoal} 字 (${goalProgress}%)`">
          <div class="w-12 h-1 bg-gray-200 rounded-full overflow-hidden">
            <div
              class="h-full rounded-full transition-all"
              :class="goalProgress >= 100 ? 'bg-green-500' : 'bg-blue-400'"
              :style="{ width: goalProgress + '%' }"
            />
          </div>
          <span class="text-[10px]" :class="goalProgress >= 100 ? 'text-green-600' : 'text-gray-400'">{{ goalProgress }}%</span>
        </div>
        <button
          class="text-xs w-5 h-5 rounded border flex items-center justify-center transition-colors"
          :class="isFocusMode ? 'bg-blue-100 text-blue-600 border-blue-300' : 'text-gray-400 hover:text-gray-600 border-gray-200'"
          @click="isFocusMode = !isFocusMode"
          title="专注模式 (Ctrl+Shift+F)"
        >F</button>
        <button
          class="text-xs text-gray-400 hover:text-gray-600 w-5 h-5 rounded border border-gray-200 flex items-center justify-center"
          @click="toggleFullscreen"
          :title="isFullscreen ? '退出全屏 (Esc)' : '全屏编辑'"
        >{{ isFullscreen ? '&#x2716;' : '&#x26F6;' }}</button>
        <button
          class="text-xs text-gray-400 hover:text-gray-600 w-5 h-5 rounded border border-gray-200 flex items-center justify-center"
          @click="shortcutHelpVisible = true"
          title="键盘快捷键 (?)"
        >?</button>
        <span
          class="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
          :class="{
            'bg-orange-100 text-orange-600': configStore.mode === 'daily',
            'bg-green-100 text-green-600': configStore.mode === 'three_rural',
            'bg-purple-100 text-purple-600': configStore.mode === 'reprint'
          }"
        >{{ configStore.mode === 'daily' ? '日常' : configStore.mode === 'three_rural' ? '三下乡' : '转载' }}</span>
        <span class="text-xs text-gray-300">Manifold v2</span>
      </div>
      <div class="flex items-center gap-2">
        <button
          class="px-3 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors text-sm"
          @click="exportMarkdown"
          title="Export as Markdown"
        >MD</button>
        <button
          class="px-3 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors text-sm"
          @click="openPreview"
          title="Preview HTML output"
        >Preview</button>
        <button
          class="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors text-sm"
          @click="copyAsWechatHtml"
        >
          {{ copyStatus === 'copied' ? '已复制!' : '复制微信HTML' }}
        </button>
        <button
          class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          @click="goToPublish"
        >
          下一步: 发布确认
        </button>
      </div>
    </div>

    <ImageSlotPopover
      :visible="popoverVisible"
      :position="popoverPosition"
      :slot-id="popoverSlotId"
      :current-data="popoverCurrentData"
      @select="handleSlotImageSelect"
      @close="popoverVisible = false"
    />

    <KeyboardShortcutHelp
      :visible="shortcutHelpVisible"
      @close="shortcutHelpVisible = false"
    />

    <HtmlPreviewModal
      :visible="previewVisible"
      :html="previewHtml"
      @close="previewVisible = false"
    />

    <LinkEditPopover
      :visible="linkPopoverVisible"
      :initial-url="linkPopoverInitialUrl"
      :position="linkPopoverPosition"
      @confirm="handleLinkConfirm"
      @remove="handleLinkRemove"
      @close="linkPopoverVisible = false"
    />
  </div>
</template>

<style>
.manifold-editor-content .ProseMirror {
  outline: none;
  min-height: 400px;
}
/* Paragraph numbers - each top-level block needs relative positioning */
.manifold-editor-content .ProseMirror > * {
  position: relative;
}
.manifold-editor-content .ProseMirror h1 {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
}
.manifold-editor-content .ProseMirror h2 {
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 0.75rem;
}
.manifold-editor-content .ProseMirror h3 {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}
.manifold-editor-content .ProseMirror p {
  margin-bottom: 0.75rem;
  line-height: 1.625;
}
.manifold-editor-content .ProseMirror hr {
  border: none;
  border-top: 1px solid #e5e7eb;
  margin: 1.5rem 0;
}
.manifold-editor-content .ProseMirror .is-empty::before {
  color: #d1d5db;
  content: attr(data-placeholder);
  float: left;
  height: 0;
  pointer-events: none;
}
/* BlockRole visual indicators */
.manifold-editor-content .ProseMirror p[data-role="intro"] {
  border-left: 3px solid #60a5fa;
  padding-left: 12px;
  color: #4b5563;
  font-style: italic;
}
.manifold-editor-content .ProseMirror p[data-role="outro"] {
  border-left: 3px solid #a78bfa;
  padding-left: 12px;
  color: #4b5563;
  font-style: italic;
}
/* Blockquote */
.manifold-editor-content .ProseMirror blockquote {
  border-left: 3px solid #d1d5db;
  padding-left: 12px;
  margin: 1rem 0;
  color: #6b7280;
}
/* Image nodes (NodeView) */
.manifold-editor-content .ProseMirror .manifold-image-block {
  margin: 0.75rem 0;
}
.manifold-editor-content .ProseMirror [data-node-type="manifold-image"] {
  margin: 1rem 0;
  text-align: center;
}
.manifold-editor-content .ProseMirror [data-node-type="manifold-image"] img {
  max-width: 100%;
  height: auto;
  border-radius: 4px;
}
/* Table */
.manifold-editor-content .ProseMirror table {
  border-collapse: collapse;
  width: 100%;
  margin: 1rem 0;
}
.manifold-editor-content .ProseMirror th,
.manifold-editor-content .ProseMirror td {
  border: 1px solid #d1d5db;
  padding: 6px 10px;
  min-width: 80px;
  vertical-align: top;
}
.manifold-editor-content .ProseMirror th {
  background: #f3f4f6;
  font-weight: 600;
}
.manifold-editor-content .ProseMirror .selectedCell {
  background: #dbeafe;
}
/* Inline code */
.manifold-editor-content .ProseMirror code {
  background: #f3f4f6;
  padding: 2px 4px;
  border-radius: 3px;
  font-size: 0.9em;
  font-family: 'SF Mono', 'Fira Code', monospace;
  color: #ef4444;
}
/* Column resize handle */
.manifold-editor-content .ProseMirror .column-resize-handle {
  position: absolute;
  right: -2px;
  top: 0;
  bottom: 0;
  width: 4px;
  background: #3b82f6;
  cursor: col-resize;
}
.manifold-editor-content .ProseMirror.resize-cursor {
  cursor: col-resize;
}
/* Code block */
.manifold-editor-content .ProseMirror pre {
  background: #1e1e2e;
  color: #cdd6f4;
  padding: 12px 16px;
  border-radius: 8px;
  font-family: 'SF Mono', 'Fira Code', 'Consolas', monospace;
  font-size: 13px;
  line-height: 1.6;
  overflow-x: auto;
  margin: 1rem 0;
}
.manifold-editor-content .ProseMirror pre code {
  background: none;
  color: inherit;
  padding: 0;
  border-radius: 0;
  font-size: inherit;
}
/* Lists nested */
.manifold-editor-content .ProseMirror ul {
  list-style: disc;
  padding-left: 1.5em;
  margin: 0.5rem 0;
}
.manifold-editor-content .ProseMirror ol {
  list-style: decimal;
  padding-left: 1.5em;
  margin: 0.5rem 0;
}
.manifold-editor-content .ProseMirror li {
  margin: 0.25rem 0;
}
.manifold-editor-content .ProseMirror li > p {
  margin-bottom: 0.25rem;
}
/* Focus mode - dim non-active blocks */
.manifold-editor-content.focus-mode .ProseMirror > * {
  opacity: 0.25;
  transition: opacity 0.2s ease;
}
.manifold-editor-content.focus-mode .ProseMirror > .focus-active {
  opacity: 1;
}
</style>
