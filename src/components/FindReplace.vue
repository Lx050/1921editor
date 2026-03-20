<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import type { Editor } from '@tiptap/vue-3'

const props = defineProps<{ editor: Editor | null; visible: boolean }>()
const emit = defineEmits<{ (e: 'close'): void }>()

const findText = ref('')
const replaceText = ref('')
const matchCount = ref(0)
const currentMatch = ref(0)
const findInputRef = ref<HTMLInputElement | null>(null)

// Decorations stored as positions
let matchPositions: { from: number; to: number }[] = []

watch(() => props.visible, (val) => {
  if (val) {
    nextTick(() => findInputRef.value?.focus())
  } else {
    clearHighlights()
    findText.value = ''
    replaceText.value = ''
  }
})

watch(findText, () => {
  doFind()
})

function doFind() {
  clearHighlights()
  if (!props.editor || !findText.value) {
    matchCount.value = 0
    currentMatch.value = 0
    return
  }

  const doc = props.editor.state.doc
  const search = findText.value.toLowerCase()
  matchPositions = []

  doc.descendants((node, pos) => {
    if (node.isText && node.text) {
      const text = node.text.toLowerCase()
      let idx = text.indexOf(search)
      while (idx !== -1) {
        matchPositions.push({ from: pos + idx, to: pos + idx + findText.value.length })
        idx = text.indexOf(search, idx + 1)
      }
    }
  })

  matchCount.value = matchPositions.length
  currentMatch.value = matchPositions.length > 0 ? 1 : 0

  if (matchPositions.length > 0) {
    scrollToMatch(0)
  }
}

function scrollToMatch(index: number) {
  if (!props.editor || matchPositions.length === 0) return
  const match = matchPositions[index]
  props.editor.chain().setTextSelection(match).scrollIntoView().run()
}

function findNext() {
  if (matchPositions.length === 0) return
  currentMatch.value = currentMatch.value >= matchPositions.length ? 1 : currentMatch.value + 1
  scrollToMatch(currentMatch.value - 1)
}

function findPrev() {
  if (matchPositions.length === 0) return
  currentMatch.value = currentMatch.value <= 1 ? matchPositions.length : currentMatch.value - 1
  scrollToMatch(currentMatch.value - 1)
}

function replaceCurrent() {
  if (!props.editor || matchPositions.length === 0 || currentMatch.value === 0) return
  const match = matchPositions[currentMatch.value - 1]
  props.editor.chain()
    .setTextSelection(match)
    .deleteSelection()
    .insertContent(replaceText.value)
    .run()
  doFind()
}

function replaceAll() {
  if (!props.editor || matchPositions.length === 0) return
  // Replace from end to start to preserve positions
  const sorted = [...matchPositions].sort((a, b) => b.from - a.from)
  const chain = props.editor.chain()
  for (const match of sorted) {
    chain.setTextSelection(match).deleteSelection().insertContent(replaceText.value)
  }
  chain.run()
  doFind()
}

function clearHighlights() {
  matchPositions = []
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    emit('close')
  } else if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    findNext()
  } else if (e.key === 'Enter' && e.shiftKey) {
    e.preventDefault()
    findPrev()
  }
}
</script>

<template>
  <div
    v-if="visible"
    class="absolute top-0 right-4 z-30 bg-white border rounded-lg shadow-lg p-3 w-72"
    @keydown="handleKeydown"
  >
    <div class="flex items-center justify-between mb-2">
      <span class="text-xs font-medium text-gray-700">查找与替换</span>
      <button class="text-gray-400 hover:text-gray-600 text-sm" @click="emit('close')">&times;</button>
    </div>

    <div class="space-y-2">
      <div class="flex items-center gap-1">
        <input
          ref="findInputRef"
          v-model="findText"
          class="flex-1 text-sm border rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-400"
          placeholder="查找..."
        />
        <span class="text-xs text-gray-400 w-12 text-center whitespace-nowrap">
          {{ matchCount > 0 ? `${currentMatch}/${matchCount}` : '0' }}
        </span>
      </div>

      <div class="flex items-center gap-1">
        <input
          v-model="replaceText"
          class="flex-1 text-sm border rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-400"
          placeholder="替换..."
        />
      </div>

      <div class="flex items-center gap-1">
        <button
          class="text-xs px-2 py-1 rounded border border-gray-200 hover:bg-gray-50 text-gray-600"
          @click="findPrev"
          title="上一个 (Shift+Enter)"
        >&#x2191;</button>
        <button
          class="text-xs px-2 py-1 rounded border border-gray-200 hover:bg-gray-50 text-gray-600"
          @click="findNext"
          title="下一个 (Enter)"
        >&#x2193;</button>
        <button
          class="text-xs px-2 py-1 rounded border border-gray-200 hover:bg-gray-50 text-gray-600"
          @click="replaceCurrent"
        >替换</button>
        <button
          class="text-xs px-2 py-1 rounded border border-gray-200 hover:bg-gray-50 text-gray-600"
          @click="replaceAll"
        >全部替换</button>
      </div>
    </div>
  </div>
</template>
