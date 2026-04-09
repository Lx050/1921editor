<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount, defineAsyncComponent } from 'vue'
import { useRouter } from 'vue-router'
import { EditorContent } from '@tiptap/vue-3'
import { storeToRefs } from 'pinia'
import { useAppStore } from '../stores/appStore'
import { useConfigStore } from '../stores/configStore'
import { useOrgConfigStore } from '../stores/orgConfigStore'
import { createManifoldEditor } from '../editor/core/createEditor'
import { contentBlocksToTiptap } from '../editor/serializers/jsonImporter'
import { smartTextParser } from '../utils/textParser'
import EditorToolbar from '../components/EditorToolbar.vue'
import EditorSidebar from '../components/EditorSidebar.vue'
import ImageSlotPopover from '../components/ImageSlotPopover.vue'
const KeyboardShortcutHelp = defineAsyncComponent(() => import('../components/KeyboardShortcutHelp.vue'))
const FindReplace = defineAsyncComponent(() => import('../components/FindReplace.vue'))
import TableBubbleMenu from '../components/TableBubbleMenu.vue'
import BlockquoteBubbleMenu from '../components/BlockquoteBubbleMenu.vue'
const HtmlPreviewModal = defineAsyncComponent(() => import('../components/HtmlPreviewModal.vue'))
import SelectionToolbar from '../components/SelectionToolbar.vue'
import LinkEditPopover from '../components/LinkEditPopover.vue'
import LinkHoverTooltip from '../components/LinkHoverTooltip.vue'
const CommandPalette = defineAsyncComponent(() => import('../components/CommandPalette.vue'))
const RecoveryDialog = defineAsyncComponent(() => import('../components/RecoveryDialog.vue'))
const EmojiPicker = defineAsyncComponent(() => import('../components/EmojiPicker.vue'))
const VersionSnapshots = defineAsyncComponent(() => import('../components/VersionSnapshots.vue'))
import EditorToast from '../components/EditorToast.vue'
import { generateAndUpload, buildPromptFromContext } from '../utils/aiImageService'
import toast from '../composables/useToast'
import { useEditorPrefs } from '../composables/useEditorPrefs'
import { useEditorStats } from '../composables/useEditorStats'
import { useEditorKeyboardShortcuts } from '../composables/useEditorKeyboardShortcuts'
import { serializeToWechatHtml } from '../editor/serializers/htmlSerializer'
import { serializeToMarkdown } from '../editor/serializers/markdownSerializer'
import { copyRichText, copyToClipboard } from '../utils/clipboard'
import type { Editor } from '@tiptap/vue-3'
import type { EditorDocument, ImageSlotData } from '@/types/editor'

const router = useRouter()
const appStore = useAppStore()
const configStore = useConfigStore()
const orgConfigStore = useOrgConfigStore()
const { contentBlocks } = storeToRefs(appStore)

// Live style preview: inject org style preset as CSS custom properties
const editorPresetStyle = computed(() => {
  const p = orgConfigStore.stylePreset
  return {
    '--preset-body-font': p.bodyFontFamily,
    '--preset-body-size': p.bodyFontSize + 'px',
    '--preset-body-lh': String(p.bodyLineHeight),
    '--preset-body-ls': p.bodyLetterSpacing + 'px',
    '--preset-body-indent': p.bodyIndent ? '2em' : '0',
    '--preset-title-font': p.titleFontFamily,
    '--preset-title-size': p.titleFontSize + 'px',
    '--preset-title-bold': p.titleBold ? 'bold' : 'normal',
    '--preset-intro-font': p.introFontFamily,
    '--preset-intro-size': p.introFontSize + 'px',
  }
})

const editor = ref<Editor | null>(null)
const sidebarRef = ref<InstanceType<typeof EditorSidebar> | null>(null)
const toastRef = ref<InstanceType<typeof EditorToast> | null>(null)
const editorError = ref<string>('')
const editorRetryCount = ref(0)

function showToast(message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') {
  toastRef.value?.addToast(message, type)
}

// Image slot popover state
const popoverVisible = ref(false)
const popoverPosition = ref({ x: 0, y: 0 })
const popoverSlotId = ref('')
const popoverSlotLabel = ref('')
const popoverNodePos = ref<number | null>(null)
const popoverCurrentData = ref<ImageSlotData | null>(null)
const popoverContextText = ref('')

// AI batch fill state
const aiFilling = ref(false)
const aiFillProgress = ref({ total: 0, done: 0 })

function getContextAroundNode(nodePos: number): string {
  if (!editor.value) return ''
  const doc = editor.value.state.doc
  const texts: string[] = []
  doc.forEach((node, offset) => {
    if (Math.abs(offset - nodePos) < 500 && node.textContent) {
      texts.push(node.textContent)
    }
  })
  return texts.join('\n').slice(0, 500)
}

const shortcutHelpVisible = ref(false)
const isDragOver = ref(false)
const isFullscreen = ref(false)
const mobileSidebarOpen = ref(false)
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
const { editorTheme, isFocusMode, isTypewriter, wordCountGoal, zoomLevel, savePrefs } = useEditorPrefs()
const lastSavedAt = ref<string>('')

const zoomLevels = [80, 90, 100, 110, 120, 130, 150]
function cycleZoom(direction: 1 | -1) {
  const idx = zoomLevels.indexOf(zoomLevel.value)
  const newIdx = Math.max(0, Math.min(zoomLevels.length - 1, idx + direction))
  zoomLevel.value = zoomLevels[newIdx]
}

let dragLeaveTimer: ReturnType<typeof setTimeout> | null = null
let autosaveTimer: ReturnType<typeof setTimeout> | null = null
const autosaveFadeTimerRef = { current: null as ReturnType<typeof setTimeout> | null }

function handleEditorUpdate(json: EditorDocument) {
  appStore.editorJson = json
  autosaveStatus.value = 'saving'
  // Debounced autosave to localStorage
  if (autosaveTimer) clearTimeout(autosaveTimer)
  if (autosaveFadeTimerRef.current) clearTimeout(autosaveFadeTimerRef.current)
  autosaveTimer = setTimeout(() => {
    try {
      localStorage.setItem('manifold_editor_autosave', JSON.stringify(json))
      localStorage.setItem('manifold_editor_autosave_ts', String(Date.now()))
      autosaveStatus.value = 'saved'
      lastSavedAt.value = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
      autosaveFadeTimerRef.current = setTimeout(() => { autosaveStatus.value = 'idle' }, 3000)
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
  const result = await copyRichText(html)
  if (!result.ok) {
    // Last resort: plain text copy
    const textResult = await copyToClipboard(html)
    if (!textResult.ok) {
      showToast('复制失败，请手动选择代码复制', 'error')
      return
    }
  }
  copyStatus.value = 'copied'
  showToast('微信 HTML 已复制到剪贴板', 'success')
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
  const result = await copyToClipboard(md)
  if (result.ok) {
    copyStatus.value = 'copied'
    showToast('Markdown 已复制到剪贴板', 'success')
    setTimeout(() => { copyStatus.value = 'idle' }, 2000)
  } else {
    // Fallback: download as file
    const blob = new Blob([md], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'article.md'
    a.click()
    URL.revokeObjectURL(url)
    showToast('Markdown 已下载为文件', 'info')
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
  popoverSlotLabel.value = slotEl.getAttribute('aria-label') || slotId
  popoverPosition.value = { x: rect.left + rect.width / 2, y: rect.bottom + 8 }
  popoverVisible.value = true

  if (editor.value) {
    const view = editor.value.view
    const pos = view.posAtDOM(svgBlockEl, 0)
    popoverNodePos.value = pos > 0 ? pos - 1 : 0
    popoverContextText.value = getContextAroundNode(popoverNodePos.value)

    const node = editor.value.state.doc.nodeAt(popoverNodePos.value)
    if (node) {
      const slots = node.attrs.imageSlots || {}
      popoverCurrentData.value = slots[slotId] || null
    }
  }

  event.stopPropagation()
}

async function aiAutoFillSlots() {
  if (!editor.value || aiFilling.value) return
  aiFilling.value = true

  const doc = editor.value.state.doc
  const emptySlots: Array<{ nodePos: number; slotId: string; label: string; contextText: string }> = []

  const { getSvgTemplateById } = await import('../styles/svgTemplates')

  doc.forEach((node, offset) => {
    if (node.type.name === 'manifoldSvgBlock') {
      const slots = node.attrs.imageSlots || {}
      const templateId = node.attrs.templateId
      const tpl = templateId ? getSvgTemplateById(templateId) : null
      const slotDefs = (tpl as any)?.imageSlots || []

      for (const slotDef of slotDefs) {
        if (!slots[slotDef.id] || !slots[slotDef.id]?.url) {
          emptySlots.push({
            nodePos: offset,
            slotId: slotDef.id,
            label: slotDef.label || slotDef.id,
            contextText: getContextAroundNode(offset),
          })
        }
      }
    }
  })

  if (emptySlots.length === 0) {
    toast.info('所有SVG图片槽位已填充')
    aiFilling.value = false
    return
  }

  aiFillProgress.value = { total: emptySlots.length, done: 0 }
  toast.info(`开始AI生图，共 ${emptySlots.length} 个槽位...`)

  let failedCount = 0

  for (const slot of emptySlots) {
    try {
      const prompt = buildPromptFromContext(slot.contextText, slot.label)
      const result = await generateAndUpload(prompt)

      const node = editor.value!.state.doc.nodeAt(slot.nodePos)
      if (node && node.type.name === 'manifoldSvgBlock') {
        const newSlots = { ...(node.attrs.imageSlots || {}) }
        newSlots[slot.slotId] = { url: result.proxyUrl, mediaId: result.mediaId, name: result.prompt.slice(0, 20) }
        const tr = editor.value!.state.tr
        tr.setNodeMarkup(slot.nodePos, undefined, { ...node.attrs, imageSlots: newSlots })
        editor.value!.view.dispatch(tr)
      }

      appStore.addWechatImage({
        id: result.mediaId || `ai-${Date.now()}`,
        mediaId: result.mediaId,
        url: result.url,
        proxyUrl: result.proxyUrl,
        name: `AI-${slot.label}`,
        uploadedAt: new Date().toISOString()
      })
    } catch (err: any) {
      console.error(`AI fill failed for slot ${slot.slotId}:`, err)
      failedCount++
    }
    aiFillProgress.value.done++
  }

  aiFilling.value = false
  if (failedCount > 0) {
    toast.warning(`AI填充完成，${failedCount}个插槽失败`)
  } else {
    toast.success(`AI已填充 ${aiFillProgress.value.done}/${aiFillProgress.value.total} 个图片槽位`)
  }
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
  let contentSource = 'empty' // Track where content came from for diagnostics

  try {
    if (appStore.editorJson) {
      // Case 1: returning to editor (has saved JSON state)
      initialContent = appStore.editorJson as EditorDocument
      contentSource = 'editorJson'

    } else if (contentBlocks.value.length > 0) {
      // Case 2: freshly navigated from Step1 (blocks pre-parsed there)
      initialContent = contentBlocksToTiptap(contentBlocks.value)
      contentSource = 'contentBlocks'

    } else {
      // Case 3: fallback chain — try store rawText → localStorage rawText → sessionStorage blocks → autosave

      // 3a. Try sessionStorage pre-parsed blocks (written by Step1.goToNextStep)
      let recovered = false
      try {
        const savedBlocks = sessionStorage.getItem('manifold_step1_blocks')
        if (savedBlocks) {
          const blocks = JSON.parse(savedBlocks)
          if (Array.isArray(blocks) && blocks.length > 0) {
            appStore.setContentBlocks(blocks)
            initialContent = contentBlocksToTiptap(blocks)
            contentSource = 'sessionStorage'
            recovered = true
          }
        }
      } catch (e) { console.warn('[Step2] sessionStorage recovery failed:', e) }

      // 3b. Try rawText from store or localStorage
      if (!recovered) {
        let rawText = appStore.rawText
        if (!rawText) {
          try {
            rawText = localStorage.getItem('manifold_step1_rawText') || ''
            if (rawText) {
              appStore.setRawText(rawText)
            }
          } catch (e) { console.warn('[Step2] localStorage recovery failed:', e) }
        }
        if (rawText) {
          console.debug('[Step2] parsing rawText, len:', rawText.length)
          const blocks = smartTextParser(rawText)
          appStore.setContentBlocks(blocks)
          initialContent = contentBlocksToTiptap(blocks)
          contentSource = 'rawText'
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
              contentSource = 'autosave-pending'
              console.debug('[Step2] autosave found, prompting recovery')
            }
          }
        } catch (e) { console.warn('[Step2] autosave recovery failed:', e) }
      }
    }
  } catch (e) {
    console.error('[Step2] Error initializing content:', e)
    contentSource = 'error'
    initialContent = undefined as any
  }

  if (!initialContent) {
    console.warn('[Step2] No content found from any source! Content source was:', contentSource)
    initialContent = {
      type: 'doc',
      content: [
        { type: 'manifoldHeading', attrs: { level: 1 }, content: [{ type: 'text', text: '' }] },
        { type: 'paragraph', content: [{ type: 'text', text: '' }] },
      ]
    }
  }

  console.debug('[Step2] Creating editor with content source:', contentSource,
    'nodes:', initialContent.content?.length)

  try {
    editor.value = createManifoldEditor({
      content: initialContent,
      onUpdate: handleEditorUpdate,
      isTypewriterEnabled: () => isTypewriter.value,
    })
    console.debug('[Step2] Editor created successfully, text length:', editor.value.getText().length)
    editorError.value = ''
  } catch (e: any) {
    const errMsg = e?.message || String(e)
    console.error('[Step2] Editor creation with content failed, trying empty fallback:', errMsg, e)
    try {
      // Try creating editor without content as last resort
      editor.value = createManifoldEditor({
        onUpdate: handleEditorUpdate,
        isTypewriterEnabled: () => isTypewriter.value,
      })
      console.debug('[Step2] Fallback editor created successfully')
      editorError.value = ''
    } catch (e2: any) {
      const errMsg2 = e2?.message || String(e2)
      console.error('[Step2] FATAL: Fallback editor creation also failed:', errMsg2, e2)
      editor.value = null
      editorError.value = `编辑器初始化失败: ${errMsg}${errMsg2 !== errMsg ? ' | 备用: ' + errMsg2 : ''}`
    }
  }

  // Track selection changes for word count and cursor position
  if (!editor.value) return
  editor.value.on('selectionUpdate', ({ editor: e }) => {
    const { from, to, empty } = e.state.selection
    selectionLength.value = empty ? 0 : e.state.doc.textBetween(from, to, '\n').length

    // Track current block index and offset within block
    const $from = e.state.selection.$from
    cursorBlock.value = $from.index(0) + 1
    cursorOffset.value = $from.parentOffset

    // Track current node type for status bar
    const nodeName = $from.parent.type.name
    const nodeLabel: Record<string, string> = {
      'manifoldHeading': `H${$from.parent.attrs?.level || 1}`,
      'paragraph': $from.parent.attrs?.blockRole === 'intro' ? '引言' : $from.parent.attrs?.blockRole === 'outro' ? '结尾' : '正文',
      'manifoldCodeBlock': '代码',
      'manifoldBlockquote': '引用',
      'listItem': '列表项',
      'tableCell': '表格',
      'tableHeader': '表头',
    }
    currentNodeType.value = nodeLabel[nodeName] || nodeName
  })

  window.addEventListener('manifold:open-svg-panel', handleOpenSvgPanel)
})

const selectionLength = ref(0)
const cursorBlock = ref(0)
const cursorOffset = ref(0)
const currentNodeType = ref('')

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
  if (dragLeaveTimer) clearTimeout(dragLeaveTimer)
  if (autosaveTimer) clearTimeout(autosaveTimer)
  if (autosaveFadeTimerRef.current) clearTimeout(autosaveFadeTimerRef.current)
  editor.value?.destroy()
  window.removeEventListener('manifold:open-svg-panel', handleOpenSvgPanel)
})

// Live editor stats
const {
  WECHAT_CHAR_LIMIT,
  wordCount,
  isOverLimit,
  readingTime,
  sentenceCount,
  avgSentenceLength,
  detailedStats,
  canUndo,
  canRedo,
  topKeywords,
  readabilityScore,
  goalProgress,
} = useEditorStats(editor, wordCountGoal, statsVisible)

useEditorKeyboardShortcuts({
  editor,
  commandPaletteVisible,
  findReplaceVisible,
  shortcutHelpVisible,
  statsVisible,
  isFullscreen,
  isFocusMode,
  zoomLevel,
  autosaveStatus,
  lastSavedAt,
  autosaveFadeTimerRef,
  cycleZoom,
  openLinkEditor,
  copyAsWechatHtml,
  exportMarkdown,
  downloadAsHtml,
  showToast,
})

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
  showToast('已恢复上次编辑内容', 'success')
}

function handleDiscardRecovery() {
  showRecoveryDialog.value = false
  recoveryData.value = null
  // Clear stale autosave
  try { localStorage.removeItem('manifold_editor_autosave') } catch { /* ignore */ }
  try { localStorage.removeItem('manifold_editor_autosave_ts') } catch { /* ignore */ }
}

function retryEditorCreation() {
  editorRetryCount.value++
  editorError.value = ''
  console.debug('[Step2] Retrying editor creation, attempt:', editorRetryCount.value)

  try {
    // Try with empty content
    editor.value = createManifoldEditor({
      onUpdate: handleEditorUpdate,
      isTypewriterEnabled: () => isTypewriter.value,
    })
    console.debug('[Step2] Retry succeeded!')

    // Re-attach selection handler
    editor.value.on('selectionUpdate', ({ editor: e }) => {
      const { from, to, empty } = e.state.selection
      selectionLength.value = empty ? 0 : e.state.doc.textBetween(from, to, '\n').length
    })
  } catch (e: any) {
    console.error('[Step2] Retry failed:', e)
    editorError.value = `重试失败 (#${editorRetryCount.value}): ${e?.message || String(e)}`
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
    class="flex flex-col h-full w-full transition-all"
    style="background:var(--color-bg-warm);"
    :class="isFullscreen ? 'fixed inset-0 z-[100]' : ''"
  >
    <EditorToolbar :editor="editor" :ai-filling="aiFilling" @open-svg-panel="handleOpenSvgPanel" @edit-link="openLinkEditor" @ai-fill-slots="aiAutoFillSlots" />
    <!-- Reading progress bar -->
    <div v-if="scrollProgress > 0" class="h-0.5 relative" style="background:var(--color-bg-warm);">
      <div class="h-full transition-all duration-150" :style="{ width: scrollProgress + '%', backgroundColor: 'var(--color-accent-primary)' }" />
    </div>
    <TableBubbleMenu :editor="editor" />
    <BlockquoteBubbleMenu :editor="editor" />

    <div class="flex flex-1 overflow-hidden relative">
      <!-- Mobile sidebar overlay backdrop -->
      <div
        v-if="mobileSidebarOpen"
        class="md:hidden fixed inset-0 bg-black/40 z-30"
        @click="mobileSidebarOpen = false"
      />
      <!-- Sidebar wrapper: hidden on mobile by default, block on desktop -->
      <div
        class="flex-shrink-0 h-full md:relative"
        :class="mobileSidebarOpen
          ? 'fixed inset-y-0 left-0 z-40 shadow-xl'
          : 'hidden md:block'"
      >
        <EditorSidebar ref="sidebarRef" :editor="editor" @insert-svg="insertSvgTemplate" @insert-image="handleInsertImage" />
      </div>

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
          class="max-w-[680px] mx-auto py-4 md:py-8 px-3 md:px-6 min-h-full shadow-sm my-1 md:my-4 rounded transition-all"
          :class="[
            isDragOver ? 'ring-2 ring-offset-2' : '',
            editorTheme === 'light' ? 'bg-white' : '',
            editorTheme === 'sepia' ? 'bg-[#f8f0e3]' : '',
            editorTheme === 'sepia' ? 'editor-sepia' : '',
            editorTheme === 'dark' ? 'bg-[#1e1e2e] editor-dark' : '',
          ]"
        >
          <EditorContent v-if="editor" :editor="editor" class="manifold-editor-content" :class="{ 'focus-mode': isFocusMode }" :style="{ ...editorPresetStyle, ...(zoomLevel !== 100 ? { fontSize: (zoomLevel / 100) + 'em' } : {}) }" />
          <div v-else class="flex items-center justify-center py-20" style="color:var(--color-text-muted);">
            <div v-if="editorError" class="text-center max-w-md">
              <div class="text-red-500 text-lg mb-2 font-medium">编辑器加载失败</div>
              <div class="text-red-400 text-sm mb-4 bg-red-50 rounded p-3 text-left font-mono break-all">{{ editorError }}</div>
              <div class="flex gap-3 justify-center">
                <button
                  class="px-4 py-2 text-white rounded-lg text-sm transition-colors"
                  style="background-color: var(--color-accent-primary);"
                  @mouseover="($event.target as HTMLElement).style.backgroundColor = 'var(--color-accent-hover)'"
                  @mouseout="($event.target as HTMLElement).style.backgroundColor = 'var(--color-accent-primary)'"
                  @click="retryEditorCreation"
                >重试加载</button>
                <button
                  class="px-4 py-2 rounded-lg text-sm transition-colors"
                  style="background:rgba(0,0,0,0.08); color:rgba(0,0,0,0.65);"
                  onmouseover="this.style.background='rgba(0,0,0,0.12)'"
                  onmouseout="this.style.background='rgba(0,0,0,0.08)'"
                  @click="goBack"
                >返回上一步</button>
              </div>
            </div>
            <div v-else class="text-center">
              <div class="text-lg mb-2">编辑器加载中...</div>
              <div class="text-sm">如果持续显示此消息，请刷新页面或返回上一步重试</div>
            </div>
          </div>
          <SelectionToolbar :editor="editor" @edit-link="openLinkEditor" />
          <LinkHoverTooltip :editor="editor" @edit-link="openLinkEditor" />
        </div>
        <!-- Drag overlay hint -->
        <div
          v-if="isDragOver"
          class="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
          style="background-color: rgba(242, 249, 255, 0.6);"
        >
          <span class="text-sm font-medium bg-white px-4 py-2 rounded-lg shadow" style="color: var(--color-accent-primary);">松开以插入图片</span>
        </div>
        <!-- Scroll to top -->
        <button
          v-if="showScrollTop"
          class="absolute bottom-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-sm shadow-lg transition-all z-20"
          style="background:rgba(0,0,0,0.06); color:rgba(0,0,0,0.5); border:1px solid rgba(0,0,0,0.1);"
          onmouseover="this.style.background='rgba(0,0,0,0.1)'"
          onmouseout="this.style.background='rgba(0,0,0,0.06)'"
          @click="scrollToTop"
          title="回到顶部"
          aria-label="回到顶部"
        >&#x2191;</button>
      </div>
    </div>

    <!-- Character limit bar -->
    <div v-if="wordCount > WECHAT_CHAR_LIMIT * 0.7" class="flex-shrink-0 h-1 relative" style="background:var(--color-bg-warm);">
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

    <!-- Footer: mobile-first, two-row layout on small screens -->
    <div class="flex-shrink-0 border-t bg-white">
      <!-- Mobile footer: single row with essentials only -->
      <div class="flex md:hidden items-center justify-between px-3 py-2 gap-2">
        <button
          class="flex items-center gap-1 text-sm transition-colors"
          style="color:rgba(0,0,0,0.45);"
          onmouseover="this.style.color='rgba(0,0,0,0.55)'"
          onmouseout="this.style.color='rgba(0,0,0,0.45)'"
          @click="goBack"
        >&larr; 返回</button>
        <!-- Mobile sidebar toggle -->
        <button
          class="flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs"
          style="border:1px solid rgba(0,0,0,0.08); color:rgba(0,0,0,0.45);"
          @click="mobileSidebarOpen = !mobileSidebarOpen"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7"/></svg>
          <span>侧栏</span>
        </button>
        <span
          class="text-xs transition-colors flex-shrink-0"
          :class="isOverLimit ? 'text-red-500 font-medium' : ''"
          :style="isOverLimit ? '' : 'color:var(--color-text-muted)'"
        >{{ wordCount }}字</span>
        <button
          class="px-3 py-1.5 rounded-lg text-xs"
          style="border:1px solid rgba(0,0,0,0.12); color:rgba(0,0,0,0.55);"
          @click="copyAsWechatHtml"
        >{{ copyStatus === 'copied' ? '已复制!' : '复制HTML' }}</button>
        <button
          class="px-4 py-1.5 text-white rounded-lg text-xs font-medium"
          style="background-color: var(--color-accent-primary);"
          @mouseover="($event.target as HTMLElement).style.backgroundColor = 'var(--color-accent-hover)'"
          @mouseout="($event.target as HTMLElement).style.backgroundColor = 'var(--color-accent-primary)'"
          @click="goToPublish"
        >下一步</button>
      </div>

      <!-- Desktop footer: full controls -->
      <div class="hidden md:flex items-center justify-between px-6 py-3">
        <button
          class="text-sm transition-colors"
          style="color:rgba(0,0,0,0.45);"
          onmouseover="this.style.color='rgba(0,0,0,0.65)'"
          onmouseout="this.style.color='rgba(0,0,0,0.45)'"
          @click="goBack"
        >
          &larr; 返回文本输入
        </button>
        <div class="flex items-center gap-2">
          <span v-if="currentNodeType" class="text-[10px] px-1.5 py-0.5 rounded font-medium" style="background:var(--color-bg-warm); color:rgba(0,0,0,0.45);">{{ currentNodeType }}</span>
          <span v-if="cursorBlock > 0" class="text-[10px] font-mono" style="color:rgba(0,0,0,0.25);">B{{ cursorBlock }}:{{ cursorOffset }}</span>
          <span v-if="currentHeading" class="text-xs truncate max-w-[200px]" style="color:rgba(0,0,0,0.25);" :title="currentHeading">{{ currentHeading }}</span>
        </div>
        <div class="flex items-center gap-4">
          <span v-if="autosaveStatus === 'saving'" class="text-xs text-amber-500">保存中...</span>
          <span v-else-if="autosaveStatus === 'saved'" class="text-xs text-green-500">已保存{{ lastSavedAt ? ` ${lastSavedAt}` : '' }}</span>
          <span v-else-if="lastSavedAt" class="text-xs" style="color:rgba(0,0,0,0.25);" :title="`上次保存: ${lastSavedAt}`">{{ lastSavedAt }}</span>
          <div class="relative">
            <button
              class="text-xs transition-colors"
              :class="isOverLimit ? 'text-red-500 font-medium' : ''"
              :style="isOverLimit ? '' : 'color:var(--color-text-muted);'"
              onmouseover="if(!this.classList.contains('text-red-500')) this.style.color='rgba(0,0,0,0.55)'"
              onmouseout="if(!this.classList.contains('text-red-500')) this.style.color='var(--color-text-muted)'"
              @click="statsVisible = !statsVisible"
              :title="isOverLimit ? `超出微信字数限制 (${WECHAT_CHAR_LIMIT} 字)` : '文档统计'"
            >{{ selectionLength > 0 ? `${selectionLength} / ` : '' }}{{ wordCount }} 字 / ~{{ readingTime }}min</button>
            <Transition
              enter-active-class="transition-all duration-150 ease-out"
              leave-active-class="transition-all duration-100 ease-in"
              enter-from-class="opacity-0 scale-95"
              leave-to-class="opacity-0 scale-95"
            >
            <div
              v-if="statsVisible"
              class="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-white border rounded-lg shadow-lg p-3 z-50 w-48"
            >
              <div class="text-xs font-medium mb-2" style="color:rgba(0,0,0,0.65);">文档统计</div>
              <div class="space-y-1 text-xs" style="color:rgba(0,0,0,0.45);">
                <div class="flex justify-between"><span>字数</span><span class="font-medium" style="color:rgba(0,0,0,0.75);">{{ wordCount }}</span></div>
                <div class="flex justify-between"><span>字符数</span><span style="color:rgba(0,0,0,0.75);">{{ detailedStats.charCount }} ({{ detailedStats.charNoSpaces }})</span></div>
                <div class="flex justify-between"><span>阅读时间</span><span style="color:rgba(0,0,0,0.75);">~{{ readingTime }} 分钟</span></div>
                <div class="flex justify-between"><span>标题</span><span style="color:rgba(0,0,0,0.75);">{{ detailedStats.headings }}</span></div>
                <div class="flex justify-between"><span>段落</span><span style="color:rgba(0,0,0,0.75);">{{ detailedStats.paragraphs }}</span></div>
                <div class="flex justify-between"><span>句子</span><span style="color:rgba(0,0,0,0.75);">{{ sentenceCount }}</span></div>
                <div class="flex justify-between"><span>句均字数</span><span style="color:rgba(0,0,0,0.75);">{{ avgSentenceLength }}</span></div>
                <div class="flex justify-between"><span>可读性</span><span :class="readabilityScore.colorClass" :style="readabilityScore.colorStyle" class="font-medium">{{ readabilityScore.label }} ({{ readabilityScore.score }})</span></div>
                <div class="flex justify-between"><span>图片</span><span style="color:rgba(0,0,0,0.75);">{{ detailedStats.images }}</span></div>
                <div v-if="detailedStats.svgs > 0" class="flex justify-between"><span>SVG</span><span style="color:rgba(0,0,0,0.75);">{{ detailedStats.svgs }}</span></div>
                <div v-if="detailedStats.tables > 0" class="flex justify-between"><span>表格</span><span style="color:rgba(0,0,0,0.75);">{{ detailedStats.tables }}</span></div>
                <div v-if="detailedStats.codeBlocks > 0" class="flex justify-between"><span>代码块</span><span style="color:rgba(0,0,0,0.75);">{{ detailedStats.codeBlocks }}</span></div>
                <template v-if="topKeywords.length > 0">
                  <div class="border-t pt-1 mt-1">
                    <span class="text-[10px]" style="color:var(--color-text-muted);">高频词</span>
                    <div class="flex flex-wrap gap-1 mt-0.5">
                      <span
                        v-for="kw in topKeywords"
                        :key="kw.word"
                        class="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px]"
                        style="background-color: var(--color-badge-bg); color: var(--color-accent-primary);"
                      >{{ kw.word }}<span style="color: var(--color-accent-primary); opacity: 0.5;">{{ kw.count }}</span></span>
                    </div>
                  </div>
                </template>
                <div class="border-t pt-1 mt-1 flex justify-between"><span>撤销/重做</span><span class="font-mono text-[10px]" style="color:rgba(0,0,0,0.75);">{{ canUndo ? '&#x21A9;' : '' }} {{ canRedo ? '&#x21AA;' : '' }}</span></div>
                <div class="border-t pt-2 mt-2">
                  <div class="flex items-center gap-1 mb-1">
                    <span style="color:rgba(0,0,0,0.45);">字数目标</span>
                    <input
                      type="number"
                      :value="wordCountGoal || ''"
                      @change="wordCountGoal = parseInt(($event.target as HTMLInputElement).value) || 0"
                      placeholder="--"
                      class="w-14 text-right rounded px-1 py-0.5 text-[10px]"
                      style="color:rgba(0,0,0,0.75); border:1px solid rgba(0,0,0,0.08);"
                      min="0"
                      step="100"
                    />
                  </div>
                  <div v-if="wordCountGoal > 0" class="flex items-center gap-1">
                    <div class="flex-1 h-1.5 rounded-full overflow-hidden" style="background:rgba(0,0,0,0.08);">
                      <div
                        class="h-full rounded-full transition-all duration-500"
                        :class="goalProgress >= 100 ? 'bg-green-500' : goalProgress >= 75 ? '' : 'bg-amber-500'"
                        :style="{ width: goalProgress + '%', backgroundColor: goalProgress >= 100 ? '' : goalProgress >= 75 ? 'var(--color-accent-primary)' : '' }"
                      />
                    </div>
                    <span class="text-[10px] font-medium" :class="goalProgress >= 100 ? 'text-green-600' : ''" :style="goalProgress >= 100 ? '' : 'color:rgba(0,0,0,0.45);'">{{ goalProgress }}%</span>
                  </div>
                </div>
              </div>
            </div>
            </Transition>
          </div>
          <div v-if="wordCountGoal > 0" class="flex items-center gap-1" :title="`目标: ${wordCountGoal} 字 (${goalProgress}%)`">
            <div class="w-12 h-1 rounded-full overflow-hidden" style="background:rgba(0,0,0,0.08);">
              <div
                class="h-full rounded-full transition-all"
                :class="goalProgress >= 100 ? 'bg-green-500' : ''"
                :style="{ width: goalProgress + '%', backgroundColor: goalProgress >= 100 ? '' : 'var(--color-accent-primary)' }"
              />
            </div>
            <span class="text-[10px]" :class="goalProgress >= 100 ? 'text-green-600' : ''" :style="goalProgress >= 100 ? '' : 'color:var(--color-text-muted);'">{{ goalProgress }}%</span>
          </div>
          <button
            class="text-xs w-5 h-5 rounded border flex items-center justify-center transition-colors"
            :style="isFocusMode ? { backgroundColor: 'var(--color-badge-bg)', color: 'var(--color-accent-primary)', borderColor: 'rgba(0,117,222,0.3)' } : { color: 'var(--color-text-muted)', borderColor: 'rgba(0,0,0,0.12)' }"
            @click="isFocusMode = !isFocusMode"
            title="专注模式 (Ctrl+Shift+F)"
            aria-label="专注模式"
          >F</button>
          <button
            class="text-xs w-5 h-5 rounded border flex items-center justify-center transition-colors"
            :class="isTypewriter ? 'bg-green-100 text-green-600 border-green-300' : ''"
            :style="isTypewriter ? '' : 'color:var(--color-text-muted); border-color:rgba(0,0,0,0.08);'"
            onmouseover="if(!this.classList.contains('text-green-600')) { this.style.color='rgba(0,0,0,0.55)' }"
            onmouseout="if(!this.classList.contains('text-green-600')) { this.style.color='var(--color-text-muted)' }"
            @click="isTypewriter = !isTypewriter"
            title="打字机滚动模式"
            aria-label="打字机滚动模式"
          >W</button>
          <button
            class="text-xs w-5 h-5 rounded border flex items-center justify-center transition-colors"
            :class="{
              'bg-amber-100 text-amber-700 border-amber-300': editorTheme === 'sepia',
              'bg-gray-700 text-gray-200 border-gray-600': editorTheme === 'dark',
            }"
            :style="editorTheme === 'light' ? 'color:var(--color-text-muted); border-color:rgba(0,0,0,0.08);' : ''"
            @click="editorTheme = editorTheme === 'light' ? 'sepia' : editorTheme === 'sepia' ? 'dark' : 'light'"
            title="切换主题 (明/暖/暗)"
            aria-label="切换编辑主题"
          >T</button>
          <div class="flex items-center gap-0.5">
            <button class="text-[10px] w-4 h-5 flex items-center justify-center" style="color:var(--color-text-muted);" onmouseover="this.style.color='rgba(0,0,0,0.55)'" onmouseout="this.style.color='var(--color-text-muted)'" @click="cycleZoom(-1)" :disabled="zoomLevel <= 80" :class="zoomLevel <= 80 ? 'opacity-30' : ''" title="缩小" aria-label="缩小字体">-</button>
            <span class="text-[10px] w-7 text-center select-none" style="color:var(--color-text-muted);" :title="`缩放 ${zoomLevel}%`">{{ zoomLevel }}%</span>
            <button class="text-[10px] w-4 h-5 flex items-center justify-center" style="color:var(--color-text-muted);" onmouseover="this.style.color='rgba(0,0,0,0.55)'" onmouseout="this.style.color='var(--color-text-muted)'" @click="cycleZoom(1)" :disabled="zoomLevel >= 150" :class="zoomLevel >= 150 ? 'opacity-30' : ''" title="放大" aria-label="放大字体">+</button>
          </div>
          <button class="text-xs w-5 h-5 rounded border flex items-center justify-center" style="color:var(--color-text-muted); border-color:rgba(0,0,0,0.08);" onmouseover="this.style.color='rgba(0,0,0,0.55)'" onmouseout="this.style.color='var(--color-text-muted)'" @click="toggleFullscreen" :title="isFullscreen ? '退出全屏 (Esc)' : '全屏编辑'" :aria-label="isFullscreen ? '退出全屏' : '全屏编辑'">{{ isFullscreen ? '&#x2716;' : '&#x26F6;' }}</button>
          <button class="text-xs w-5 h-5 rounded border flex items-center justify-center" style="color:var(--color-text-muted); border-color:rgba(0,0,0,0.08);" onmouseover="this.style.color='rgba(0,0,0,0.55)'" onmouseout="this.style.color='var(--color-text-muted)'" @click="shortcutHelpVisible = true" title="键盘快捷键 (?)" aria-label="键盘快捷键帮助">?</button>
          <span
            class="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
            :class="{
              'bg-orange-100 text-orange-600': configStore.mode === 'daily',
              'bg-green-100 text-green-600': configStore.mode === 'three_rural',
              'bg-purple-100 text-purple-600': configStore.mode === 'reprint'
            }"
          >{{ configStore.mode === 'daily' ? '日常' : configStore.mode === 'three_rural' ? '三下乡' : '转载' }}</span>
          <span class="text-xs" style="color:rgba(0,0,0,0.25);">Manifold v2</span>
        </div>
        <div class="flex items-center gap-2">
          <button class="px-3 py-2 rounded-lg transition-colors text-sm" style="border:1px solid rgba(0,0,0,0.12); color:rgba(0,0,0,0.55);" onmouseover="this.style.background='var(--color-bg-warm)'" onmouseout="this.style.background=''" @click="emojiPickerVisible = true" title="插入表情">Emoji</button>
          <button class="px-3 py-2 rounded-lg transition-colors text-sm" style="border:1px solid rgba(0,0,0,0.12); color:rgba(0,0,0,0.55);" onmouseover="this.style.background='var(--color-bg-warm)'" onmouseout="this.style.background=''" @click="snapshotsVisible = true" title="版本快照">Snap</button>
          <button class="px-3 py-2 rounded-lg transition-colors text-sm" style="border:1px solid rgba(0,0,0,0.12); color:rgba(0,0,0,0.55);" onmouseover="this.style.background='var(--color-bg-warm)'" onmouseout="this.style.background=''" @click="exportMarkdown" title="Export as Markdown">MD</button>
          <button class="px-3 py-2 rounded-lg transition-colors text-sm" style="border:1px solid rgba(0,0,0,0.12); color:rgba(0,0,0,0.55);" onmouseover="this.style.background='var(--color-bg-warm)'" onmouseout="this.style.background=''" @click="openPreview" title="Preview HTML output">Preview</button>
          <button class="px-4 py-2 rounded-lg transition-colors text-sm" style="border:1px solid rgba(0,0,0,0.12); color:rgba(0,0,0,0.55);" onmouseover="this.style.background='var(--color-bg-warm)'" onmouseout="this.style.background=''" @click="copyAsWechatHtml">
            {{ copyStatus === 'copied' ? '已复制!' : '复制微信HTML' }}
          </button>
          <button
            class="px-6 py-2 text-white rounded-lg transition-colors text-sm"
            style="background-color: var(--color-accent-primary);"
            @mouseover="($event.target as HTMLElement).style.backgroundColor = 'var(--color-accent-hover)'"
            @mouseout="($event.target as HTMLElement).style.backgroundColor = 'var(--color-accent-primary)'"
            @click="goToPublish"
          >
            下一步: 发布确认
          </button>
        </div>
      </div>
    </div>

    <ImageSlotPopover
      :visible="popoverVisible"
      :position="popoverPosition"
      :slot-id="popoverSlotId"
      :slot-label="popoverSlotLabel"
      :current-data="popoverCurrentData"
      :context-text="popoverContextText"
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

    <EditorToast ref="toastRef" />
  </div>
</template>

<style>
@import '../styles/editor-content.css';
</style>
