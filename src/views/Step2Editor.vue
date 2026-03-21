<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
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
import BlockquoteBubbleMenu from '../components/BlockquoteBubbleMenu.vue'
import HtmlPreviewModal from '../components/HtmlPreviewModal.vue'
import SelectionToolbar from '../components/SelectionToolbar.vue'
import LinkEditPopover from '../components/LinkEditPopover.vue'
import LinkHoverTooltip from '../components/LinkHoverTooltip.vue'
import CommandPalette from '../components/CommandPalette.vue'
import RecoveryDialog from '../components/RecoveryDialog.vue'
import EmojiPicker from '../components/EmojiPicker.vue'
import VersionSnapshots from '../components/VersionSnapshots.vue'
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
const commandPaletteVisible = ref(false)
const emojiPickerVisible = ref(false)
const snapshotsVisible = ref(false)
const showScrollTop = ref(false)
const editorScrollContainer = ref<HTMLElement | null>(null)
const scrollProgress = ref(0)
const showRecoveryDialog = ref(false)
const recoveryData = ref<EditorDocument | null>(null)
const previewHtml = ref('')
const linkPopoverVisible = ref(false)
const linkPopoverPosition = ref({ x: 0, y: 0 })
const linkPopoverInitialUrl = ref('')
const isFocusMode = ref(false)
const wordCountGoal = ref(0) // 0 = no goal set
const editorTheme = ref<'light' | 'sepia' | 'dark'>('light')
const isTypewriter = ref(false)
const zoomLevel = ref(100) // percentage: 80, 90, 100, 110, 120, 130, 150
const lastSavedAt = ref<string>('')

// Restore editor preferences from localStorage
try {
  const prefs = JSON.parse(localStorage.getItem('manifold_editor_prefs') || '{}')
  if (prefs.theme) editorTheme.value = prefs.theme
  if (prefs.focusMode) isFocusMode.value = prefs.focusMode
  if (prefs.typewriter) isTypewriter.value = prefs.typewriter
  if (prefs.wordCountGoal) wordCountGoal.value = prefs.wordCountGoal
  if (prefs.zoom) zoomLevel.value = prefs.zoom
} catch { /* ignore */ }

// Persist preferences on change
function savePrefs() {
  try {
    localStorage.setItem('manifold_editor_prefs', JSON.stringify({
      theme: editorTheme.value,
      focusMode: isFocusMode.value,
      typewriter: isTypewriter.value,
      wordCountGoal: wordCountGoal.value,
      zoom: zoomLevel.value,
    }))
  } catch { /* ignore */ }
}
watch([editorTheme, isFocusMode, isTypewriter, wordCountGoal, zoomLevel], savePrefs)

const zoomLevels = [80, 90, 100, 110, 120, 130, 150]
function cycleZoom(direction: 1 | -1) {
  const idx = zoomLevels.indexOf(zoomLevel.value)
  const newIdx = Math.max(0, Math.min(zoomLevels.length - 1, idx + direction))
  zoomLevel.value = zoomLevels[newIdx]
}

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
      localStorage.setItem('manifold_editor_autosave_ts', String(Date.now()))
      autosaveStatus.value = 'saved'
      lastSavedAt.value = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
      autosaveFadeTimer = setTimeout(() => { autosaveStatus.value = 'idle' }, 3000)
    } catch { /* ignore quota errors */ }
  }, 2000)
}

function toggleFullscreen() {
  isFullscreen.value = !isFullscreen.value
}

function scrollToTop() {
  editorScrollContainer.value?.scrollTo({ top: 0, behavior: 'smooth' })
}

function onEditorScroll(e: Event) {
  const el = e.target as HTMLElement
  showScrollTop.value = el.scrollTop > 300
  const scrollable = el.scrollHeight - el.clientHeight
  scrollProgress.value = scrollable > 0 ? Math.round((el.scrollTop / scrollable) * 100) : 0
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

function downloadAsHtml() {
  if (!editor.value) return
  const doc = editor.value.getJSON() as EditorDocument
  const html = serializeToWechatHtml(doc, configStore.resolvedStyle, null)
  const fullHtml = `<!DOCTYPE html>
<html lang="zh-CN">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Article</title></head>
<body style="max-width:600px;margin:0 auto;padding:20px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">${html}</body>
</html>`
  const blob = new Blob([fullHtml], { type: 'text/html' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'article.html'
  a.click()
  URL.revokeObjectURL(url)
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

  console.log('[Step2] onMounted — editorJson:', !!appStore.editorJson, 'contentBlocks:', contentBlocks.value.length, 'rawText len:', appStore.rawText?.length || 0)

  try {
    if (appStore.editorJson) {
      // Case 1: returning to editor (has saved JSON state)
      console.log('[Step2] using editorJson')
      initialContent = appStore.editorJson as EditorDocument

    } else if (contentBlocks.value.length > 0) {
      // Case 2: freshly navigated from Step1 (blocks pre-parsed there)
      console.log('[Step2] using pre-parsed contentBlocks:', contentBlocks.value.length)
      initialContent = contentBlocksToTiptap(contentBlocks.value)

    } else {
      // Case 3: fallback chain — try store rawText → localStorage rawText → sessionStorage blocks → autosave
      console.log('[Step2] fallback chain triggered')

      // 3a. Try sessionStorage pre-parsed blocks (written by Step1.goToNextStep)
      let recovered = false
      try {
        const savedBlocks = sessionStorage.getItem('manifold_step1_blocks')
        if (savedBlocks) {
          const blocks = JSON.parse(savedBlocks)
          if (Array.isArray(blocks) && blocks.length > 0) {
            console.log('[Step2] recovered', blocks.length, 'blocks from sessionStorage')
            appStore.setContentBlocks(blocks)
            initialContent = contentBlocksToTiptap(blocks)
            recovered = true
          }
        }
      } catch { /* ignore */ }

      // 3b. Try rawText from store
      if (!recovered) {
        let rawText = appStore.rawText
        if (!rawText) {
          try {
            rawText = localStorage.getItem('manifold_step1_rawText') || ''
            if (rawText) {
              console.log('[Step2] recovered rawText from localStorage, len:', rawText.length)
              appStore.setRawText(rawText)
            }
          } catch { /* ignore */ }
        }
        if (rawText) {
          console.log('[Step2] parsing rawText, len:', rawText.length)
          const blocks = smartTextParser(rawText)
          appStore.setContentBlocks(blocks)
          initialContent = contentBlocksToTiptap(blocks)
          recovered = true
        }
      }

      // 3c. Last resort: check for autosave and prompt recovery
      if (!recovered) {
        try {
          const saved = localStorage.getItem('manifold_editor_autosave')
          if (saved) {
            const parsed = JSON.parse(saved) as EditorDocument
            // Check if autosave has actual content (not just empty doc)
            const hasContent = parsed.content && parsed.content.length > 0 &&
              parsed.content.some((n: any) => n.content && n.content.some((c: any) => c.text?.trim()))
            if (hasContent) {
              recoveryData.value = parsed
              showRecoveryDialog.value = true
              console.log('[Step2] autosave found, prompting recovery')
            }
          }
        } catch { /* ignore */ }
      }
    }
  } catch (e) {
    console.error('[Step2] Error initializing content:', e)
    initialContent = undefined as any
  }

  if (!initialContent) {
    initialContent = {
      type: 'doc',
      content: [
        { type: 'manifoldHeading', attrs: { level: 1 }, content: [{ type: 'text', text: '' }] },
        { type: 'manifoldParagraph', content: [{ type: 'text', text: '' }] },
      ]
    }
  }

  editor.value = createManifoldEditor({
    content: initialContent,
    onUpdate: handleEditorUpdate,
    isTypewriterEnabled: () => isTypewriter.value,
  })

  // Track selection changes for word count
  editor.value.on('selectionUpdate', ({ editor: e }) => {
    const { from, to, empty } = e.state.selection
    selectionLength.value = empty ? 0 : e.state.doc.textBetween(from, to, '\n').length
  })

  window.addEventListener('manifold:open-svg-panel', handleOpenSvgPanel)
  window.addEventListener('keydown', handleGlobalKeydown)
})

const selectionLength = ref(0)

/** Breadcrumb: find the nearest heading above cursor */
const currentHeading = computed(() => {
  if (!editor.value) return ''
  const cursorPos = editor.value.state.selection.from
  let lastHeading = ''
  editor.value.state.doc.descendants((node, pos) => {
    if (node.type.name === 'manifoldHeading' && pos < cursorPos) {
      lastHeading = node.textContent || ''
    }
  })
  return lastHeading
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

const sentenceCount = computed(() => {
  if (!editor.value) return 0
  const text = editor.value.getText()
  // Chinese sentence endings + English sentence endings
  const sentences = text.split(/[。！？!?.]+/).filter(s => s.trim().length > 0)
  return sentences.length
})

const avgSentenceLength = computed(() => {
  if (sentenceCount.value === 0) return 0
  return Math.round(wordCount.value / sentenceCount.value)
})

const detailedStats = computed(() => {
  if (!editor.value) return { paragraphs: 0, headings: 0, images: 0, svgs: 0, tables: 0, codeBlocks: 0, charCount: 0, charNoSpaces: 0 }
  let paragraphs = 0, headings = 0, images = 0, svgs = 0, tables = 0, codeBlocks = 0
  editor.value.state.doc.descendants((node) => {
    if (node.type.name === 'manifoldParagraph') paragraphs++
    else if (node.type.name === 'manifoldHeading') headings++
    else if (node.type.name === 'manifoldImage') images++
    else if (node.type.name === 'manifoldSvgBlock') svgs++
    else if (node.type.name === 'table') tables++
    else if (node.type.name === 'codeBlock') codeBlocks++
  })
  const fullText = editor.value.getText()
  const charCount = fullText.length
  const charNoSpaces = fullText.replace(/\s/g, '').length
  return { paragraphs, headings, images, svgs, tables, codeBlocks, charCount, charNoSpaces }
})

const canUndo = computed(() => editor.value?.can().undo() ?? false)
const canRedo = computed(() => editor.value?.can().redo() ?? false)

/** Top keywords (Chinese bigrams + single chars, excluding common stop words) */
const topKeywords = computed(() => {
  if (!editor.value) return []
  const text = editor.value.getText()
  if (text.length < 20) return []
  // Chinese stop words
  const stops = new Set(['的', '了', '在', '是', '我', '有', '和', '就', '不', '人', '都', '一', '一个', '上', '也', '很', '到', '说', '要', '去', '你', '会', '着', '没有', '看', '好', '自己', '这', '他', '她', '它', '们', '那', '被', '从', '把', '让', '用', '对', '中', '等', '能', '下', '过', '与', '而', '及', '所', '但', '如', '为', '以', '其', '可', '之', '更', '来', '这个', '那个', '还', '又', '做', '比', '已', '吗', '呢', '吧', '啊', '哦', '嗯'])
  const freq = new Map<string, number>()
  // Extract Chinese bigrams
  const chinese = text.replace(/[^\u4e00-\u9fff]/g, '')
  for (let i = 0; i < chinese.length - 1; i++) {
    const bigram = chinese.slice(i, i + 2)
    if (!stops.has(bigram[0]) && !stops.has(bigram[1]) && !stops.has(bigram)) {
      freq.set(bigram, (freq.get(bigram) || 0) + 1)
    }
  }
  return [...freq.entries()]
    .filter(([, c]) => c >= 2)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([word, count]) => ({ word, count }))
})

const goalProgress = computed(() => {
  if (wordCountGoal.value <= 0) return 0
  return Math.min(100, Math.round((wordCount.value / wordCountGoal.value) * 100))
})

/** Chinese text readability score (0-100, higher = easier) */
const readabilityScore = computed(() => {
  if (!editor.value || wordCount.value < 20) return { score: 0, label: '--', color: 'text-gray-400' }
  const text = editor.value.getText()
  const sentences = text.split(/[。！？!?.]+/).filter(s => s.trim().length > 0)
  if (sentences.length === 0) return { score: 0, label: '--', color: 'text-gray-400' }
  const avgLen = wordCount.value / sentences.length
  const longSentences = sentences.filter(s => s.trim().length > 40).length
  const longRatio = longSentences / sentences.length
  // Score formula: penalize long avg sentences and high long-sentence ratio
  const score = Math.max(0, Math.min(100, Math.round(100 - avgLen * 1.5 - longRatio * 30)))
  if (score >= 70) return { score, label: '易读', color: 'text-green-600' }
  if (score >= 40) return { score, label: '适中', color: 'text-amber-600' }
  return { score, label: '偏难', color: 'text-red-500' }
})

function handleGlobalKeydown(event: KeyboardEvent) {
  const mod = event.ctrlKey || event.metaKey
  // Ctrl+P opens command palette
  if (mod && event.key === 'p') {
    event.preventDefault()
    commandPaletteVisible.value = !commandPaletteVisible.value
    return
  }
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
        localStorage.setItem('manifold_editor_autosave_ts', String(Date.now()))
        autosaveStatus.value = 'saved'
        lastSavedAt.value = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
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
  // Ctrl+Shift+M export Markdown
  if (mod && event.shiftKey && event.key === 'M') {
    event.preventDefault()
    exportMarkdown()
    return
  }
  // Ctrl+Shift+D download as HTML file
  if (mod && event.shiftKey && event.key === 'D') {
    event.preventDefault()
    downloadAsHtml()
    return
  }
  // Ctrl+= zoom in, Ctrl+- zoom out, Ctrl+0 reset zoom
  if (mod && (event.key === '=' || event.key === '+')) {
    event.preventDefault()
    cycleZoom(1)
    return
  }
  if (mod && event.key === '-') {
    event.preventDefault()
    cycleZoom(-1)
    return
  }
  if (mod && event.key === '0') {
    event.preventDefault()
    zoomLevel.value = 100
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

function insertEmoji(emoji: string) {
  if (!editor.value) return
  editor.value.chain().focus().insertContent(emoji).run()
  emojiPickerVisible.value = false
}

function handleRestore() {
  if (!editor.value || !recoveryData.value) return
  editor.value.commands.setContent(recoveryData.value)
  appStore.editorJson = recoveryData.value
  showRecoveryDialog.value = false
  recoveryData.value = null
}

function handleDiscardRecovery() {
  showRecoveryDialog.value = false
  recoveryData.value = null
  // Clear stale autosave
  try { localStorage.removeItem('manifold_editor_autosave') } catch { /* ignore */ }
  try { localStorage.removeItem('manifold_editor_autosave_ts') } catch { /* ignore */ }
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
    <!-- Reading progress bar -->
    <div v-if="scrollProgress > 0" class="h-0.5 bg-gray-100 relative">
      <div class="h-full bg-blue-400 transition-all duration-150" :style="{ width: scrollProgress + '%' }" />
    </div>
    <TableBubbleMenu :editor="editor" />
    <BlockquoteBubbleMenu :editor="editor" />

    <div class="flex flex-1 overflow-hidden">
      <EditorSidebar ref="sidebarRef" :editor="editor" @insert-svg="insertSvgTemplate" @insert-image="handleInsertImage" />

      <div
        ref="editorScrollContainer"
        class="flex-1 overflow-y-auto relative transition-colors"
        :class="editorTheme === 'dark' ? 'bg-[#11111b]' : editorTheme === 'sepia' ? 'bg-[#f0e6d3]' : ''"
        @scroll="onEditorScroll($event)"
        @click="handleCanvasClick"
        @drop="handleDrop"
        @dragover="handleDragOver"
        @dragleave="handleDragLeave"
      >
        <FindReplace :editor="editor" :visible="findReplaceVisible" @close="findReplaceVisible = false" />
        <div
          class="max-w-[680px] mx-auto py-8 px-6 min-h-full shadow-sm my-4 rounded transition-all"
          :class="[
            isDragOver ? 'ring-2 ring-blue-400 ring-offset-2' : '',
            editorTheme === 'light' ? 'bg-white' : '',
            editorTheme === 'sepia' ? 'bg-[#f8f0e3]' : '',
            editorTheme === 'sepia' ? 'editor-sepia' : '',
            editorTheme === 'dark' ? 'bg-[#1e1e2e] editor-dark' : '',
          ]"
        >
          <EditorContent v-if="editor" :editor="editor" class="manifold-editor-content" :class="{ 'focus-mode': isFocusMode }" :style="zoomLevel !== 100 ? { fontSize: (zoomLevel / 100) + 'em' } : {}" />
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
        <!-- Scroll to top -->
        <button
          v-if="showScrollTop"
          class="absolute bottom-4 right-4 w-8 h-8 rounded-full bg-gray-800/70 text-white flex items-center justify-center text-sm shadow-lg hover:bg-gray-800 transition-all z-20"
          @click="scrollToTop"
          title="回到顶部"
        >&#x2191;</button>
      </div>
    </div>

    <!-- Character limit bar -->
    <div v-if="wordCount > WECHAT_CHAR_LIMIT * 0.7" class="flex-shrink-0 h-1 bg-gray-100 relative">
      <div
        class="h-full transition-all duration-300"
        :class="isOverLimit ? 'bg-red-500' : wordCount > WECHAT_CHAR_LIMIT * 0.9 ? 'bg-amber-400' : 'bg-green-400'"
        :style="{ width: Math.min(100, (wordCount / WECHAT_CHAR_LIMIT) * 100) + '%' }"
      />
      <span
        v-if="isOverLimit"
        class="absolute right-1 -top-4 text-[10px] text-red-500 font-medium"
      >超出 {{ wordCount - WECHAT_CHAR_LIMIT }} 字</span>
    </div>

    <div class="flex-shrink-0 border-t bg-white px-6 py-3 flex items-center justify-between">
      <button
        class="text-sm text-gray-500 hover:text-gray-700 transition-colors"
        @click="goBack"
      >
        &larr; 返回文本输入
      </button>
      <span v-if="currentHeading" class="hidden md:block text-xs text-gray-300 truncate max-w-[200px]" :title="currentHeading">{{ currentHeading }}</span>
      <div class="flex items-center gap-4">
        <span v-if="autosaveStatus === 'saving'" class="text-xs text-amber-500">保存中...</span>
        <span v-else-if="autosaveStatus === 'saved'" class="text-xs text-green-500">已保存{{ lastSavedAt ? ` ${lastSavedAt}` : '' }}</span>
        <span v-else-if="lastSavedAt" class="text-xs text-gray-300" :title="`上次保存: ${lastSavedAt}`">{{ lastSavedAt }}</span>
        <div class="relative">
          <button
            class="text-xs transition-colors"
            :class="isOverLimit ? 'text-red-500 font-medium' : 'text-gray-400 hover:text-gray-600'"
            @click="statsVisible = !statsVisible"
            :title="isOverLimit ? `超出微信字数限制 (${WECHAT_CHAR_LIMIT} 字)` : '文档统计'"
          >{{ selectionLength > 0 ? `${selectionLength} / ` : '' }}{{ wordCount }} 字 / ~{{ readingTime }}min</button>
          <div
            v-if="statsVisible"
            class="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-white border rounded-lg shadow-lg p-3 z-50 w-48"
          >
            <div class="text-xs font-medium text-gray-700 mb-2">文档统计</div>
            <div class="space-y-1 text-xs text-gray-500">
              <div class="flex justify-between"><span>字数</span><span class="text-gray-700 font-medium">{{ wordCount }}</span></div>
              <div class="flex justify-between"><span>字符数</span><span class="text-gray-700">{{ detailedStats.charCount }} ({{ detailedStats.charNoSpaces }})</span></div>
              <div class="flex justify-between"><span>阅读时间</span><span class="text-gray-700">~{{ readingTime }} 分钟</span></div>
              <div class="flex justify-between"><span>标题</span><span class="text-gray-700">{{ detailedStats.headings }}</span></div>
              <div class="flex justify-between"><span>段落</span><span class="text-gray-700">{{ detailedStats.paragraphs }}</span></div>
              <div class="flex justify-between"><span>句子</span><span class="text-gray-700">{{ sentenceCount }}</span></div>
              <div class="flex justify-between"><span>句均字数</span><span class="text-gray-700">{{ avgSentenceLength }}</span></div>
              <div class="flex justify-between"><span>可读性</span><span :class="readabilityScore.color" class="font-medium">{{ readabilityScore.label }} ({{ readabilityScore.score }})</span></div>
              <div class="flex justify-between"><span>图片</span><span class="text-gray-700">{{ detailedStats.images }}</span></div>
              <div v-if="detailedStats.svgs > 0" class="flex justify-between"><span>SVG</span><span class="text-gray-700">{{ detailedStats.svgs }}</span></div>
              <div v-if="detailedStats.tables > 0" class="flex justify-between"><span>表格</span><span class="text-gray-700">{{ detailedStats.tables }}</span></div>
              <div v-if="detailedStats.codeBlocks > 0" class="flex justify-between"><span>代码块</span><span class="text-gray-700">{{ detailedStats.codeBlocks }}</span></div>
              <!-- Top keywords -->
              <template v-if="topKeywords.length > 0">
                <div class="border-t pt-1 mt-1">
                  <span class="text-gray-400 text-[10px]">高频词</span>
                  <div class="flex flex-wrap gap-1 mt-0.5">
                    <span
                      v-for="kw in topKeywords"
                      :key="kw.word"
                      class="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded text-[10px]"
                    >{{ kw.word }}<span class="text-blue-300">{{ kw.count }}</span></span>
                  </div>
                </div>
              </template>
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
          class="text-xs w-5 h-5 rounded border flex items-center justify-center transition-colors"
          :class="isTypewriter ? 'bg-green-100 text-green-600 border-green-300' : 'text-gray-400 hover:text-gray-600 border-gray-200'"
          @click="isTypewriter = !isTypewriter"
          title="打字机滚动模式"
        >W</button>
        <button
          class="text-xs w-5 h-5 rounded border flex items-center justify-center transition-colors"
          :class="{
            'text-gray-400 hover:text-gray-600 border-gray-200': editorTheme === 'light',
            'bg-amber-100 text-amber-700 border-amber-300': editorTheme === 'sepia',
            'bg-gray-700 text-gray-200 border-gray-600': editorTheme === 'dark',
          }"
          @click="editorTheme = editorTheme === 'light' ? 'sepia' : editorTheme === 'sepia' ? 'dark' : 'light'"
          title="切换主题 (明/暖/暗)"
        >T</button>
        <!-- Zoom control -->
        <div class="flex items-center gap-0.5">
          <button
            class="text-[10px] text-gray-400 hover:text-gray-600 w-4 h-5 flex items-center justify-center"
            @click="cycleZoom(-1)"
            :disabled="zoomLevel <= 80"
            :class="zoomLevel <= 80 ? 'opacity-30' : ''"
            title="缩小"
          >-</button>
          <span class="text-[10px] text-gray-400 w-7 text-center select-none" :title="`缩放 ${zoomLevel}%`">{{ zoomLevel }}%</span>
          <button
            class="text-[10px] text-gray-400 hover:text-gray-600 w-4 h-5 flex items-center justify-center"
            @click="cycleZoom(1)"
            :disabled="zoomLevel >= 150"
            :class="zoomLevel >= 150 ? 'opacity-30' : ''"
            title="放大"
          >+</button>
        </div>
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
          @click="emojiPickerVisible = true"
          title="插入表情"
        >Emoji</button>
        <button
          class="px-3 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors text-sm"
          @click="snapshotsVisible = true"
          title="版本快照"
        >Snap</button>
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

    <CommandPalette
      :editor="editor"
      :visible="commandPaletteVisible"
      @close="commandPaletteVisible = false"
    />

    <RecoveryDialog
      :visible="showRecoveryDialog"
      :recovery-data="recoveryData"
      @restore="handleRestore"
      @discard="handleDiscardRecovery"
    />

    <EmojiPicker
      :visible="emojiPickerVisible"
      @select="insertEmoji"
      @close="emojiPickerVisible = false"
    />

    <VersionSnapshots
      :editor="editor"
      :visible="snapshotsVisible"
      @close="snapshotsVisible = false"
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
.manifold-editor-content .ProseMirror blockquote[data-variant="tip"] {
  border-left-color: #22c55e;
  background: #f0fdf4;
  padding: 8px 12px;
  border-radius: 0 6px 6px 0;
  color: #15803d;
}
.manifold-editor-content .ProseMirror blockquote[data-variant="warning"] {
  border-left-color: #f59e0b;
  background: #fffbeb;
  padding: 8px 12px;
  border-radius: 0 6px 6px 0;
  color: #92400e;
}
.manifold-editor-content .ProseMirror blockquote[data-variant="quote"] {
  border-left-color: #3b82f6;
  background: #eff6ff;
  padding: 8px 12px;
  border-radius: 0 6px 6px 0;
  color: #1e40af;
  font-style: italic;
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
  background: #dbeafe !important;
}
/* Support cell background color attribute */
.manifold-editor-content .ProseMirror td[style*="background"],
.manifold-editor-content .ProseMirror th[style*="background"] {
  transition: background-color 0.15s ease;
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
/* Dark theme */
.editor-dark .manifold-editor-content .ProseMirror {
  color: #cdd6f4;
}
.editor-dark .manifold-editor-content .ProseMirror h1,
.editor-dark .manifold-editor-content .ProseMirror h2,
.editor-dark .manifold-editor-content .ProseMirror h3 {
  color: #e2e8f0;
}
.editor-dark .manifold-editor-content .ProseMirror .is-empty::before {
  color: #585b70;
}
.editor-dark .manifold-editor-content .ProseMirror blockquote {
  border-left-color: #585b70;
  color: #a6adc8;
}
.editor-dark .manifold-editor-content .ProseMirror blockquote[data-variant="tip"] {
  border-left-color: #22c55e;
  background: #052e16;
  color: #86efac;
}
.editor-dark .manifold-editor-content .ProseMirror blockquote[data-variant="warning"] {
  border-left-color: #f59e0b;
  background: #451a03;
  color: #fcd34d;
}
.editor-dark .manifold-editor-content .ProseMirror blockquote[data-variant="quote"] {
  border-left-color: #3b82f6;
  background: #172554;
  color: #93c5fd;
}
.editor-dark .manifold-editor-content .ProseMirror hr {
  border-top-color: #313244;
}
.editor-dark .manifold-editor-content .ProseMirror code {
  background: #313244;
  color: #f38ba8;
}
.editor-dark .manifold-editor-content .ProseMirror th {
  background: #313244;
  color: #cdd6f4;
}
.editor-dark .manifold-editor-content .ProseMirror th,
.editor-dark .manifold-editor-content .ProseMirror td {
  border-color: #45475a;
}
.editor-dark .manifold-editor-content .ProseMirror .selectedCell {
  background: #313244;
}
.editor-dark .manifold-editor-content .ProseMirror a {
  color: #89b4fa;
}
.editor-dark .paragraph-number {
  color: #585b70 !important;
}
/* Dark code block */
.editor-dark .manifold-codeblock .rounded-lg {
  border-color: #45475a;
  background: #1e1e2e;
}
.editor-dark .manifold-codeblock .bg-gray-100 {
  background: #181825;
}
.editor-dark .manifold-codeblock .border-gray-200 {
  border-color: #45475a;
}
.editor-dark .manifold-codeblock .text-gray-500,
.editor-dark .manifold-codeblock .text-gray-400 {
  color: #6c7086;
}
.editor-dark .manifold-codeblock-content {
  color: #cdd6f4;
}
/* Sepia theme */
.editor-sepia .manifold-editor-content .ProseMirror {
  color: #5c4b37;
}
.editor-sepia .manifold-editor-content .ProseMirror h1,
.editor-sepia .manifold-editor-content .ProseMirror h2,
.editor-sepia .manifold-editor-content .ProseMirror h3 {
  color: #3e2f1e;
}
.editor-sepia .manifold-editor-content .ProseMirror .is-empty::before {
  color: #c4a882;
}
.editor-sepia .manifold-editor-content .ProseMirror blockquote {
  border-left-color: #c4a882;
  color: #7a6450;
}
.editor-sepia .manifold-editor-content .ProseMirror hr {
  border-top-color: #d4c4a8;
}
/* Sepia code block */
.editor-sepia .manifold-codeblock .rounded-lg {
  border-color: #d4c4a8;
  background: #f5ebe0;
}
.editor-sepia .manifold-codeblock .bg-gray-100 {
  background: #ede0d0;
}
.editor-sepia .manifold-codeblock-content {
  color: #5c4b37;
}
/* Print stylesheet */
@media print {
  .manifold-editor-content .ProseMirror {
    color: #000 !important;
    background: #fff !important;
  }
  .manifold-editor-content .ProseMirror h1,
  .manifold-editor-content .ProseMirror h2,
  .manifold-editor-content .ProseMirror h3 {
    color: #000 !important;
    page-break-after: avoid;
  }
  .manifold-editor-content .ProseMirror img {
    max-width: 100% !important;
    page-break-inside: avoid;
  }
  .manifold-editor-content .ProseMirror pre {
    background: #f5f5f5 !important;
    color: #333 !important;
    border: 1px solid #ddd;
    page-break-inside: avoid;
  }
  .manifold-editor-content .ProseMirror table {
    page-break-inside: avoid;
  }
  .manifold-editor-content .ProseMirror blockquote {
    color: #555 !important;
    border-left-color: #999 !important;
    background: none !important;
  }
  .paragraph-number { display: none !important; }
  .focus-mode .ProseMirror > * { opacity: 1 !important; }
}
</style>
