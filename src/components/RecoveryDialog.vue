<script setup lang="ts">
import { computed, ref, watch, nextTick } from 'vue'
import type { EditorDocument } from '@/types/editor'

const props = defineProps<{
  visible: boolean
  recoveryData: EditorDocument | null
}>()

const emit = defineEmits<{
  (e: 'restore'): void
  (e: 'discard'): void
}>()

const backdropRef = ref<HTMLElement | null>(null)

watch(() => props.visible, (val) => {
  if (val) {
    nextTick(() => backdropRef.value?.focus())
  }
})

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
    <Transition
      enter-active-class="transition-opacity duration-200"
      leave-active-class="transition-opacity duration-150"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
    >
    <div
      v-if="visible"
      ref="backdropRef"
      class="fixed inset-0 z-[200] flex items-center justify-center bg-black/40"
      role="dialog"
      aria-modal="true"
      tabindex="-1"
      @click.self="emit('discard')"
      @keydown.escape="emit('discard')"
    >
      <div class="bg-white rounded-xl w-[400px] max-w-[90vw] overflow-hidden" style="box-shadow:var(--shadow-float);">
        <div class="px-6 pt-5 pb-3">
          <h3 class="text-base font-semibold mb-1" style="color:rgba(0,0,0,0.75);">恢复上次编辑内容?</h3>
          <p class="text-sm" style="color:rgba(0,0,0,0.45);">检测到上次未保存的编辑内容，是否恢复?</p>
        </div>

        <div class="px-6 py-3 border-y text-xs space-y-1" style="background:var(--color-bg-warm); color:rgba(0,0,0,0.45);">
          <div v-if="previewInfo.firstHeading" class="flex items-center gap-2">
            <span style="color:var(--color-text-muted);">标题</span>
            <span class="font-medium truncate" style="color:rgba(0,0,0,0.65);">{{ previewInfo.firstHeading }}</span>
          </div>
          <div class="flex items-center gap-4">
            <span>{{ previewInfo.headings }} 个标题</span>
            <span>{{ previewInfo.paragraphs }} 个段落</span>
          </div>
          <div v-if="savedTime" style="color:var(--color-text-muted);">
            保存于 {{ savedTime }}
          </div>
        </div>

        <div class="px-6 py-4 flex items-center justify-end gap-3">
          <button
            class="px-4 py-2 text-sm rounded-lg transition-colors"
            style="color:rgba(0,0,0,0.45);"
            onmouseover="this.style.color='rgba(0,0,0,0.65)'; this.style.background='rgba(0,0,0,0.08)';" onmouseout="this.style.color='rgba(0,0,0,0.45)'; this.style.background='';"
            @click="emit('discard')"
          >
            放弃
          </button>
          <button
            class="px-4 py-2 text-sm rounded-lg transition-colors"
            style="background:var(--color-accent-primary); color:var(--color-text-inverse);"
            onmouseover="this.style.background='var(--color-accent-hover)'"
            onmouseout="this.style.background='var(--color-accent-primary)'"
            @click="emit('restore')"
          >
            恢复内容
          </button>
        </div>
      </div>
    </div>
    </Transition>
  </Teleport>
</template>
