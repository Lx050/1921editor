<script setup lang="ts">
import { ref, computed } from 'vue'
import { nodeViewProps, NodeViewWrapper } from '@tiptap/vue-3'
import type { ImageSlotData } from '@/types/editor'

const props = defineProps(nodeViewProps)

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

const emptySlotCount = computed(() => {
  const slots = imageSlots.value as Record<string, ImageSlotData | null>
  return Object.values(slots).filter(s => !s?.url).length
})
</script>

<template>
  <NodeViewWrapper class="manifold-svg-block" data-drag-handle>
    <div class="relative group border border-transparent hover:border-blue-300 rounded-lg transition-colors">
      <!-- SVG Render Area -->
      <div class="svg-container" v-html="renderedSvg" />

      <!-- Overlay indicators for empty slots -->
      <div
        v-if="emptySlotCount > 0"
        class="absolute top-2 right-2 bg-amber-100 text-amber-700 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
      >
        {{ emptySlotCount }} 个图片槽位待填充
      </div>

      <!-- Delete button -->
      <button
        v-if="editor?.isEditable"
        class="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
        @click="deleteNode"
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
}
.svg-container :deep([data-image-slot][href="placeholder"]) {
  opacity: 0.4;
}
</style>
