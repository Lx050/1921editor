<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Editor } from '@tiptap/vue-3'
import type { Bookmark } from '../editor/extensions/Bookmarks'

const props = defineProps<{ editor: Editor | null }>()

const newLabel = ref('')

const bookmarks = computed<Bookmark[]>(() => {
  if (!props.editor) return []
  return props.editor.storage.bookmarks?.bookmarks || []
})

function addBookmark() {
  if (!props.editor) return
  const label = newLabel.value.trim() || undefined
  props.editor.commands.addBookmark(label)
  newLabel.value = ''
}

function jumpTo(id: string) {
  if (!props.editor) return
  props.editor.commands.jumpToBookmark(id)
}

function remove(id: string) {
  if (!props.editor) return
  props.editor.commands.removeBookmark(id)
}

function getPreviewText(pos: number): string {
  if (!props.editor) return ''
  const doc = props.editor.state.doc
  const resolved = doc.resolve(Math.min(pos, doc.content.size))
  const node = resolved.parent
  const text = node.textContent || ''
  return text.slice(0, 30) + (text.length > 30 ? '...' : '')
}
</script>

<template>
  <div class="h-full flex flex-col p-3">
    <h3 class="text-sm font-medium text-gray-700 mb-3">书签</h3>

    <!-- Add bookmark -->
    <div class="flex items-center gap-1 mb-3">
      <input
        v-model="newLabel"
        type="text"
        placeholder="书签名称"
        class="flex-1 px-2 py-1 text-xs border rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
        @keydown.enter="addBookmark"
      />
      <button
        class="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors whitespace-nowrap"
        @click="addBookmark"
      >+</button>
    </div>

    <div v-if="bookmarks.length === 0" class="flex-1 flex items-center justify-center text-gray-400 text-xs">
      <p>暂无书签，点击 + 添加</p>
    </div>

    <div v-else class="flex-1 overflow-y-auto space-y-1">
      <div
        v-for="bm in bookmarks"
        :key="bm.id"
        class="group flex items-center gap-1 px-2 py-1.5 rounded hover:bg-blue-50 transition-colors cursor-pointer"
        @click="jumpTo(bm.id)"
      >
        <div class="flex-1 min-w-0">
          <div class="text-xs font-medium text-gray-700 truncate">{{ bm.label }}</div>
          <div class="text-[10px] text-gray-400 truncate">{{ getPreviewText(bm.pos) }}</div>
        </div>
        <button
          class="text-[10px] text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
          @click.stop="remove(bm.id)"
          title="删除书签"
        >x</button>
      </div>
    </div>
  </div>
</template>
