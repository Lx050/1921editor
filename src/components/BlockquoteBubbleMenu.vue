<script setup lang="ts">
import { computed } from 'vue'
import type { Editor } from '@tiptap/vue-3'

const props = defineProps<{ editor: Editor | null }>()

const isInBlockquote = computed(() => {
  if (!props.editor) return false
  return props.editor.isActive('blockquote')
})

const currentVariant = computed(() => {
  if (!props.editor) return 'default'
  for (const v of ['tip', 'warning', 'quote']) {
    if (props.editor.isActive('blockquote', { variant: v })) return v
  }
  return 'default'
})

const variants = [
  { value: 'default', label: '默认', color: '', dotStyle: 'background:rgba(0,0,0,0.25);' },
  { value: 'tip', label: '提示', color: 'bg-green-400', dotStyle: '' },
  { value: 'warning', label: '警告', color: 'bg-amber-400', dotStyle: '' },
  { value: 'quote', label: '引述', color: 'bg-sky-400', dotStyle: '' },
]

function setVariant(variant: string) {
  if (!props.editor) return
  props.editor.chain().focus().updateAttributes('blockquote', { variant }).run()
}

function removeBlockquote() {
  if (!props.editor) return
  props.editor.chain().focus().toggleBlockquote().run()
}
</script>

<template>
  <div
    v-if="isInBlockquote"
    class="flex items-center gap-0.5 px-2 py-1 border-b text-[11px]"
    style="background:var(--color-bg-warm);"
  >
    <span class="mr-1 select-none" style="color:var(--color-text-muted);">Quote:</span>

    <button
      v-for="v in variants"
      :key="v.value"
      class="bq-btn flex items-center gap-1"
      :style="currentVariant === v.value ? 'background:rgba(0,0,0,0.08); color:rgba(0,0,0,0.85);' : ''"
      @click="setVariant(v.value)"
      :title="v.label"
    >
      <span class="w-2 h-2 rounded-full" :class="v.dotStyle ? '' : v.color" :style="v.dotStyle" />
      {{ v.label }}
    </button>

    <span class="w-px h-4 mx-1" style="background:rgba(0,0,0,0.25);" />

    <button
      class="bq-btn text-red-500 hover:bg-red-50"
      @click="removeBlockquote"
      title="Remove blockquote"
    >Remove</button>
  </div>
</template>

<style scoped>
.bq-btn {
  @apply px-1.5 py-0.5 rounded text-gray-600 hover:bg-gray-200 transition-colors cursor-pointer select-none whitespace-nowrap;
}
</style>
