import { ref, watch } from 'vue'

const STORAGE_KEY = 'manifold_editor_prefs'

export function useEditorPrefs() {
  const editorTheme = ref<'light' | 'sepia' | 'dark'>('light')
  const isFocusMode = ref(false)
  const isTypewriter = ref(false)
  const wordCountGoal = ref(0) // 0 = no goal set
  const zoomLevel = ref(100) // percentage: 80, 90, 100, 110, 120, 130, 150

  // Restore preferences from localStorage
  try {
    const prefs = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    if (prefs.theme) editorTheme.value = prefs.theme
    if (prefs.focusMode) isFocusMode.value = prefs.focusMode
    if (prefs.typewriter) isTypewriter.value = prefs.typewriter
    if (prefs.wordCountGoal) wordCountGoal.value = prefs.wordCountGoal
    if (prefs.zoom) zoomLevel.value = prefs.zoom
  } catch { /* ignore */ }

  function savePrefs() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        theme: editorTheme.value,
        focusMode: isFocusMode.value,
        typewriter: isTypewriter.value,
        wordCountGoal: wordCountGoal.value,
        zoom: zoomLevel.value,
      }))
    } catch { /* ignore */ }
  }

  watch([editorTheme, isFocusMode, isTypewriter, wordCountGoal, zoomLevel], savePrefs)

  return { editorTheme, isFocusMode, isTypewriter, wordCountGoal, zoomLevel, savePrefs }
}
