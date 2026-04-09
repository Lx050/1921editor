import { computed, type Ref } from 'vue'
import type { Editor } from '@tiptap/vue-3'

export const WECHAT_CHAR_LIMIT = 20000

export function useEditorStats(
  editor: Ref<Editor | null>,
  wordCountGoal: Ref<number>,
  statsVisible: Ref<boolean>,
) {
  const wordCount = computed(() => {
    if (!editor.value) return 0
    return editor.value.getText().length
  })

  const isOverLimit = computed(() => wordCount.value > WECHAT_CHAR_LIMIT)

  /** Estimated reading time (Chinese: ~400 chars/min) */
  const readingTime = computed(() => {
    if (wordCount.value === 0) return '0'
    const mins = Math.ceil(wordCount.value / 400)
    return mins < 1 ? '<1' : String(mins)
  })

  const sentenceCount = computed(() => {
    if (!statsVisible.value) return 0
    if (!editor.value) return 0
    const text = editor.value.getText()
    // Chinese sentence endings + English sentence endings
    const sentences = text.split(/[。！？!?.]+/).filter(s => s.trim().length > 0)
    return sentences.length
  })

  const avgSentenceLength = computed(() => {
    if (!statsVisible.value) return 0
    if (sentenceCount.value === 0) return 0
    return Math.round(wordCount.value / sentenceCount.value)
  })

  const detailedStats = computed(() => {
    if (!statsVisible.value) return { charCount: 0, charNoSpaces: 0, headings: 0, paragraphs: 0, images: 0, svgs: 0, tables: 0, codeBlocks: 0 }
    if (!editor.value) return { paragraphs: 0, headings: 0, images: 0, svgs: 0, tables: 0, codeBlocks: 0, charCount: 0, charNoSpaces: 0 }
    let paragraphs = 0, headings = 0, images = 0, svgs = 0, tables = 0, codeBlocks = 0
    editor.value.state.doc.descendants((node) => {
      if (node.type.name === 'paragraph') paragraphs++
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
    if (!statsVisible.value) return []
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

  /** Chinese text readability score (0-100, higher = easier) */
  const readabilityScore = computed(() => {
    if (!statsVisible.value) return { score: 0, label: '...', colorClass: '', colorStyle: '' }
    if (!editor.value || wordCount.value < 20) return { score: 0, label: '--', colorClass: '', colorStyle: 'color:var(--color-text-muted)' }
    const text = editor.value.getText()
    const sentences = text.split(/[。！？!?.]+/).filter(s => s.trim().length > 0)
    if (sentences.length === 0) return { score: 0, label: '--', colorClass: '', colorStyle: 'color:var(--color-text-muted)' }
    const avgLen = wordCount.value / sentences.length
    const longSentences = sentences.filter(s => s.trim().length > 40).length
    const longRatio = longSentences / sentences.length
    // Score formula: penalize long avg sentences and high long-sentence ratio
    const score = Math.max(0, Math.min(100, Math.round(100 - avgLen * 1.5 - longRatio * 30)))
    if (score >= 70) return { score, label: '易读', colorClass: 'text-green-600', colorStyle: '' }
    if (score >= 40) return { score, label: '适中', colorClass: 'text-amber-600', colorStyle: '' }
    return { score, label: '偏难', colorClass: 'text-red-500', colorStyle: '' }
  })

  const goalProgress = computed(() => {
    if (wordCountGoal.value <= 0) return 0
    return Math.min(100, Math.round((wordCount.value / wordCountGoal.value) * 100))
  })

  return {
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
  }
}
