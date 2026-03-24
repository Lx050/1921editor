<script setup lang="ts">
import { computed } from 'vue'
import type { EditorDocument } from '@/types/editor'

const props = defineProps<{
  visible: boolean
  recoveryData: EditorDocument | null
}>()

const emit = defineEmits<{
  (e: 'restore'): void
  (e: 'discard'): void
}>()

const previewInfo = computed(() => {
  if (!props.recoveryData?.content) return { headings: 0, paragraphs: 0, firstHeading: '' }
  let headings = 0
  let paragraphs = 0
  let firstHeading = ''
  for (const node of props.recoveryData.content) {
    if (node.type === 'manifoldHeading') {
      headings++
      if (!firstHeading && node.content) {
        firstHeading = node.content.map((c: any) => c.text || '').join('') || ''
      }
    }
    if (node.type === 'paragraph') paragraphs++
  }
  return { headings, paragraphs, firstHeading }
})

const savedTime = computed(() => {
  try {
    const ts = localStorage.getItem('manifold_editor_autosave_ts')
    if (!ts) return ''
    const d = new Date(parseInt(ts))
    return d.toLocaleString('zh-CN', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })
  } catch {
    return ''
  }
})
</script>

<template>
  <Teleport to="body">
    <div
      v-if="visible"
      class="fixed inset-0 z-[200] flex items-center justify-center bg-black/40"
      @click.self="emit('discard')"
    >
      <div class="bg-white rounded-xl shadow-2xl w-[400px] max-w-[90vw] overflow-hidden">
        <div class="px-6 pt-5 pb-3">
          <h3 class="text-base font-semibold text-gray-800 mb-1">恢复上次编辑内容?</h3>
          <p class="text-sm text-gray-500">检测到上次未保存的编辑内容，是否恢复?</p>
        </div>

        <div class="px-6 py-3 bg-gray-50 border-y text-xs text-gray-500 space-y-1">
          <div v-if="previewInfo.firstHeading" class="flex items-center gap-2">
            <span class="text-gray-400">标题</span>
            <span class="text-gray-700 font-medium truncate">{{ previewInfo.firstHeading }}</span>
          </div>
          <div class="flex items-center gap-4">
            <span>{{ previewInfo.headings }} 个标题</span>
            <span>{{ previewInfo.paragraphs }} 个段落</span>
          </div>
          <div v-if="savedTime" class="text-gray-400">
            保存于 {{ savedTime }}
          </div>
        </div>

        <div class="px-6 py-4 flex items-center justify-end gap-3">
          <button
            class="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            @click="emit('discard')"
          >
            放弃
          </button>
          <button
            class="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            @click="emit('restore')"
          >
            恢复内容
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
