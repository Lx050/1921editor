<script setup lang="ts">
import { computed } from 'vue'
import type { Editor } from '@tiptap/vue-3'

const props = defineProps<{ editor: Editor | null }>()

interface OutlineItem {
  level: number
  text: string
  pos: number
  wordCount: number
}

const outline = computed<OutlineItem[]>(() => {
  if (!props.editor) return []
  const items: OutlineItem[] = []
  const doc = props.editor.state.doc

  // Collect heading positions
  const headingPositions: { level: number; text: string; pos: number; nodeEnd: number }[] = []
  doc.descendants((node, pos) => {
    if (node.type.name === 'manifoldHeading') {
      const text = node.textContent || ''
      if (text.trim()) {
        headingPositions.push({ level: node.attrs?.level || 1, text, pos, nodeEnd: pos + node.nodeSize })
      }
    }
  })

  // Calculate word count per section (text between this heading and next)
  for (let i = 0; i < headingPositions.length; i++) {
    const start = headingPositions[i].nodeEnd
    const end = i + 1 < headingPositions.length ? headingPositions[i + 1].pos : doc.content.size
    let chars = 0
    doc.nodesBetween(start, end, (node) => {
      if (node.isText) chars += (node.text || '').length
    })
    items.push({
      level: headingPositions[i].level,
      text: headingPositions[i].text,
      pos: headingPositions[i].pos,
      wordCount: chars,
    })
  }

  return items
})

/** Find which heading the cursor is currently under */
const activeHeadingPos = computed(() => {
  if (!props.editor) return -1
  const cursorPos = props.editor.state.selection.from
  let lastHeadingPos = -1
  for (const item of outline.value) {
    if (item.pos <= cursorPos) lastHeadingPos = item.pos
    else break
  }
  return lastHeadingPos
})

function scrollToHeading(pos: number) {
  if (!props.editor) return
  props.editor.chain().setTextSelection(pos + 1).scrollIntoView().run()
}
</script>

<template>
  <div class="h-full flex flex-col p-3">
    <h3 class="text-sm font-medium text-gray-700 mb-3">文档大纲</h3>

    <div v-if="outline.length === 0" class="flex-1 flex items-center justify-center text-gray-400 text-sm">
      <p>暂无标题</p>
    </div>

    <div v-else class="flex-1 overflow-y-auto space-y-0.5">
      <button
        v-for="(item, i) in outline"
        :key="i"
        class="w-full text-left px-2 py-1.5 rounded text-sm hover:bg-blue-50 hover:text-blue-700 transition-colors flex items-center gap-1"
        :class="[
          item.pos === activeHeadingPos ? 'bg-blue-50 text-blue-700' : '',
          item.level === 1 ? 'font-semibold text-gray-800' : '',
          item.level === 2 ? 'text-gray-600 pl-5' : '',
          item.level === 3 ? 'text-gray-500 pl-8 text-xs' : '',
        ]"
        @click="scrollToHeading(item.pos)"
      >
        <span class="truncate flex-1">{{ item.text }}</span>
        <span v-if="item.wordCount > 0" class="text-[10px] text-gray-300 flex-shrink-0">{{ item.wordCount }}</span>
      </button>
    </div>
  </div>
</template>
