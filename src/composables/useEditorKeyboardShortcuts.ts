import { onMounted, onBeforeUnmount, type Ref } from 'vue'
import type { Editor } from '@tiptap/vue-3'
import type { EditorDocument } from '@/types/editor'

export interface EditorKeyboardShortcutsConfig {
  editor: Ref<Editor | null>
  commandPaletteVisible: Ref<boolean>
  findReplaceVisible: Ref<boolean>
  shortcutHelpVisible: Ref<boolean>
  statsVisible: Ref<boolean>
  isFullscreen: Ref<boolean>
  isFocusMode: Ref<boolean>
  zoomLevel: Ref<number>
  autosaveStatus: Ref<'idle' | 'saving' | 'saved'>
  lastSavedAt: Ref<string>
  /** Ref to the fade timer so the composable can clear it on Ctrl+S */
  autosaveFadeTimerRef: { current: ReturnType<typeof setTimeout> | null }
  cycleZoom: (direction: 1 | -1) => void
  openLinkEditor: () => void
  copyAsWechatHtml: () => void
  exportMarkdown: () => void
  downloadAsHtml: () => void
  showToast: (message: string, type?: 'info' | 'success' | 'warning' | 'error') => void
}

export function useEditorKeyboardShortcuts(config: EditorKeyboardShortcutsConfig): void {
  const {
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
  } = config

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
          if (autosaveFadeTimerRef.current) clearTimeout(autosaveFadeTimerRef.current)
          autosaveFadeTimerRef.current = setTimeout(() => { autosaveStatus.value = 'idle' }, 3000)
          showToast('已保存', 'success')
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

  onMounted(() => {
    window.addEventListener('keydown', handleGlobalKeydown)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('keydown', handleGlobalKeydown)
  })
}
