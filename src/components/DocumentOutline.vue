<script setup lang="ts">
import { computed } from 'vue'
import type { Editor } from '@tiptap/vue-3'

const props = defineProps<{ editor: Editor | null }>()

interface OutlineItem {
  level: number
  text: string
  pos: number
}

const outline = computed<OutlineItem[]>(() => {
  if (!props.editor) return []
  const items: OutlineItem[] = []
  props.editor.state.doc.descendants((node, pos) => {
    if (node.type.name === 'manifoldHeading') {
      const text = node.textContent || ''
      if (text.trim()) {
        items.push({
          level: node.attrs?.level || 1,
          text,
          pos,
        })
      }
    }
  })
  return items
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
        class="w-full text-left px-2 py-1.5 rounded text-sm hover:bg-blue-50 hover:text-blue-700 transition-colors truncate"
        :class="{
          'font-semibold text-gray-800': item.level === 1,
          'text-gray-600 pl-5': item.level === 2,
          'text-gray-500 pl-8 text-xs': item.level === 3,
        }"
        @click="scrollToHeading(item.pos)"
      >
        {{ item.text }}
      </button>
    </div>
  </div>
</template>
