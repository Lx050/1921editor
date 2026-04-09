<script setup lang="ts">
import { computed } from 'vue'
import { nodeViewProps, NodeViewWrapper } from '@tiptap/vue-3'
import type { ImageSlotData } from '@/types/editor'

const props = defineProps(nodeViewProps)

const templateId = computed(() => props.node.attrs.templateId || '')
const svgContent = computed(() => props.node.attrs.svgContent || '')
const imageSlots = computed(() => props.node.attrs.imageSlots || {})

/** Render SVG with filled image slots */
const renderedSvg = computed(() => {
  let svg = svgContent.value
  const slots = imageSlots.value as Record<string, ImageSlotData | null>
  for (const [slotId, data] of Object.entries(slots)) {
    if (data?.url) {
      const regex = new RegExp(`data-image-slot="${slotId}"([^>]*?)href="[^"]*"`, 'g')
      svg = svg.replace(regex, `data-image-slot="${slotId}"$1href="${data.url}"`)
    }
  }
  return svg
})

const totalSlots = computed(() => Object.keys(imageSlots.value).length)

const filledSlots = computed(() => {
  const slots = imageSlots.value as Record<string, ImageSlotData | null>
  return Object.values(slots).filter(s => s?.url).length
})

const emptySlotCount = computed(() => totalSlots.value - filledSlots.value)

const slotProgress = computed(() => {
  if (totalSlots.value === 0) return ''
  return `${filledSlots.value}/${totalSlots.value}`
})
</script>

<template>
  <NodeViewWrapper class="manifold-svg-block" data-drag-handle data-node-type="manifold-svg-block">
    <div class="relative group border border-transparent rounded-lg transition-colors" style="--hover-border:var(--color-accent-primary);" onmouseover="this.style.borderColor='rgba(0,117,222,0.3)'" onmouseout="this.style.borderColor='transparent'">
      <!-- SVG Render Area -->
      <div class="svg-container" v-html="renderedSvg" />

      <!-- Top-left template ID badge -->
      <div
        v-if="templateId"
        class="absolute top-2 left-2 text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity font-mono"
        style="background:rgba(0,0,0,0.06); color:rgba(0,0,0,0.5); border:1px solid rgba(0,0,0,0.08);"
      >
        {{ templateId }}
      </div>

      <!-- Top-right slot status -->
      <div
        v-if="totalSlots > 0"
        class="absolute top-2 right-2 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <span
          class="text-xs px-2 py-1 rounded"
          :class="emptySlotCount > 0
            ? 'bg-amber-100 text-amber-700'
            : 'bg-green-100 text-green-700'"
        >
          {{ emptySlotCount > 0 ? `${emptySlotCount} 待填充` : '已填充' }}
          <span class="text-[10px] opacity-70 ml-0.5">({{ slotProgress }})</span>
        </span>
      </div>

      <!-- Bottom hint for interaction -->
      <div
        v-if="emptySlotCount > 0"
        class="absolute bottom-2 left-1/2 -translate-x-1/2 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap"
        style="background-color: color-mix(in srgb, var(--color-accent-primary) 80%, transparent);"
      >
        点击图片槽位填充图片
      </div>

      <!-- Delete button -->
      <button
        v-if="editor?.isEditable"
        class="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-red-600"
        @click="deleteNode"
        title="删除SVG块"
        aria-label="删除SVG块"
      >
        x
      </button>
    </div>
  </NodeViewWrapper>
</template>

<style scoped>
.manifold-svg-block {
  margin: 12px 0;
}
.svg-container :deep(svg) {
  max-width: 100%;
  height: auto;
}
.svg-container :deep([data-image-slot]) {
  cursor: pointer;
  transition: opacity 0.2s;
}
.svg-container :deep([data-image-slot]:hover) {
  opacity: 0.8;
  filter: brightness(1.1);
}
.svg-container :deep([data-image-slot][href="placeholder"]) {
  opacity: 0.35;
}
.svg-container :deep([data-image-slot][href="placeholder"]:hover) {
  opacity: 0.6;
}
</style>
