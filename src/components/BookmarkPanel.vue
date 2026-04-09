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
    <h3 class="text-sm font-medium mb-3" style="color:rgba(0,0,0,0.65);">书签</h3>

    <!-- Add bookmark -->
    <div class="flex items-center gap-1 mb-3">
      <input
        v-model="newLabel"
        type="text"
        placeholder="书签名称"
        class="flex-1 px-2 py-1 text-xs border rounded focus:outline-none focus:ring-1"
        style="--tw-ring-color: var(--color-accent-primary);"
        @keydown.enter="addBookmark"
      />
      <button
        class="px-2 py-1 text-xs text-white rounded transition-colors whitespace-nowrap"
        style="background: var(--color-accent-primary);"
        onmouseover="this.style.background='var(--color-accent-hover)';"
        onmouseout="this.style.background='var(--color-accent-primary)';"
        @click="addBookmark"
        title="添加书签"
        aria-label="添加书签"
      >+</button>
    </div>

    <div v-if="bookmarks.length === 0" class="flex-1 flex items-center justify-center text-xs" style="color:var(--color-text-muted);">
      <p>暂无书签，点击 + 添加</p>
    </div>

    <div v-else class="flex-1 overflow-y-auto space-y-1">
      <div
        v-for="bm in bookmarks"
        :key="bm.id"
        class="group flex items-center gap-1 px-2 py-1.5 rounded transition-colors cursor-pointer"
        onmouseover="this.style.background='var(--color-badge-bg)';"
        onmouseout="this.style.background='';"
        @click="jumpTo(bm.id)"
      >
        <div class="flex-1 min-w-0">
          <div class="text-xs font-medium truncate" style="color:rgba(0,0,0,0.65);">{{ bm.label }}</div>
          <div class="text-[10px] truncate" style="color:var(--color-text-muted);">{{ getPreviewText(bm.pos) }}</div>
        </div>
        <button
          class="text-[10px] text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
          @click.stop="remove(bm.id)"
          title="删除书签"
          aria-label="删除书签"
        >x</button>
      </div>
    </div>
  </div>
</template>
