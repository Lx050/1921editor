<script setup lang="ts">
import { ref, computed, onBeforeUnmount } from 'vue'
import { nodeViewProps, NodeViewWrapper } from '@tiptap/vue-3'

const props = defineProps(nodeViewProps)

const src = computed(() => props.node.attrs.src || '')
const layout = computed(() => props.node.attrs.layout || 'full_width')
const caption = computed(() => props.node.attrs.caption || '')
const imageWidth = computed(() => props.node.attrs.width as number | null)

const isEditing = ref(false)
const captionInput = ref('')
const isResizing = ref(false)
const resizeWidth = ref(0)
const imgRef = ref<HTMLImageElement | null>(null)

function startEditCaption() {
  captionInput.value = caption.value
  isEditing.value = true
}

function saveCaption() {
  props.updateAttributes({ caption: captionInput.value })
  isEditing.value = false
}

function cancelCaption() {
  isEditing.value = false
}

function handleCaptionKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter') { e.preventDefault(); saveCaption() }
  if (e.key === 'Escape') { e.preventDefault(); cancelCaption() }
}

function setLayout(newLayout: string) {
  props.updateAttributes({ layout: newLayout })
}

// --- Resize logic ---
let startX = 0
let startWidth = 0

function onResizeStart(e: MouseEvent) {
  e.preventDefault()
  e.stopPropagation()
  if (!imgRef.value) return
  isResizing.value = true
  startX = e.clientX
  startWidth = imgRef.value.offsetWidth
  resizeWidth.value = startWidth
  document.addEventListener('mousemove', onResizeMove)
  document.addEventListener('mouseup', onResizeEnd)
}

function onResizeMove(e: MouseEvent) {
  if (!isResizing.value) return
  const diff = e.clientX - startX
  const newWidth = Math.max(100, startWidth + diff)
  resizeWidth.value = newWidth
}

function onResizeEnd() {
  if (!isResizing.value) return
  isResizing.value = false
  props.updateAttributes({ width: Math.round(resizeWidth.value) })
  document.removeEventListener('mousemove', onResizeMove)
  document.removeEventListener('mouseup', onResizeEnd)
}

function resetWidth() {
  props.updateAttributes({ width: null })
}

onBeforeUnmount(() => {
  document.removeEventListener('mousemove', onResizeMove)
  document.removeEventListener('mouseup', onResizeEnd)
})

const containerClass = computed(() => {
  switch (layout.value) {
    case 'inline': return 'max-w-[60%] mx-auto'
    case 'left': return 'float-left mr-4 max-w-[50%]'
    case 'right': return 'float-right ml-4 max-w-[50%]'
    default: return 'w-full'
  }
})

const imageStyle = computed(() => {
  if (isResizing.value) return { width: `${resizeWidth.value}px`, height: 'auto', maxWidth: '100%' }
  if (imageWidth.value) return { width: `${imageWidth.value}px`, height: 'auto', maxWidth: '100%' }
  if (layout.value === 'full_width') return { width: '100%', height: 'auto' }
  return { maxWidth: '100%', height: 'auto' }
})

const widthDisplay = computed(() => {
  if (isResizing.value) return `${Math.round(resizeWidth.value)}px`
  if (imageWidth.value) return `${imageWidth.value}px`
  return null
})
</script>

<template>
  <NodeViewWrapper class="manifold-image-block my-3" data-drag-handle>
    <div
      class="relative group rounded-lg transition-all"
      :class="[containerClass, selected ? 'ring-2 ring-blue-400' : 'hover:ring-1 hover:ring-gray-300']"
    >
      <!-- Image with resize wrapper -->
      <div class="relative inline-block w-full">
        <img
          v-if="src"
          ref="imgRef"
          :src="src"
          draggable="false"
          class="block rounded"
          :style="imageStyle"
        />
        <div
          v-else
          class="w-full h-32 bg-gray-100 rounded flex items-center justify-center text-gray-400 text-sm"
        >
          No image
        </div>

        <!-- Resize handle (right edge) -->
        <div
          v-if="src && editor?.isEditable && selected"
          class="absolute top-0 right-0 w-2 h-full cursor-ew-resize flex items-center justify-center group/handle"
          @mousedown="onResizeStart"
        >
          <div class="w-1 h-8 rounded-full bg-blue-400 opacity-60 group-hover/handle:opacity-100 transition-opacity" />
        </div>

        <!-- Width indicator during resize or when custom width set -->
        <div
          v-if="(isResizing || imageWidth) && selected"
          class="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] bg-black/70 text-white px-1.5 py-0.5 rounded whitespace-nowrap"
        >
          {{ widthDisplay }}
          <button
            v-if="imageWidth && !isResizing"
            class="ml-1 text-white/60 hover:text-white"
            @click.stop="resetWidth"
            title="Reset to auto"
          >&#x21BA;</button>
        </div>
      </div>

      <!-- Caption area -->
      <div class="mt-1.5 text-center" :class="imageWidth ? 'mt-7' : ''">
        <div
          v-if="isEditing"
          class="flex items-center gap-1 justify-center"
        >
          <input
            v-model="captionInput"
            class="text-xs text-gray-500 border-b border-blue-300 bg-transparent outline-none text-center px-1 py-0.5 w-full max-w-[300px]"
            placeholder="Enter caption..."
            @keydown="handleCaptionKeydown"
            @blur="saveCaption"
            autofocus
          />
        </div>
        <div
          v-else-if="caption"
          class="text-xs text-gray-500 cursor-pointer hover:text-gray-700 transition-colors"
          @click="startEditCaption"
        >
          {{ caption }}
        </div>
        <div
          v-else
          class="text-xs text-gray-300 cursor-pointer hover:text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity"
          @click="startEditCaption"
        >
          + Add caption
        </div>
      </div>

      <!-- Overlay controls -->
      <div class="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <!-- Layout switcher -->
        <div class="flex bg-white/90 backdrop-blur rounded shadow-sm border border-gray-200 text-[10px]">
          <button
            v-for="l in [
              { value: 'full_width', label: '全宽', icon: '&#x2194;' },
              { value: 'inline', label: '居中', icon: '&#x25A1;' },
              { value: 'left', label: '左浮', icon: '&#x21E4;' },
              { value: 'right', label: '右浮', icon: '&#x21E5;' },
            ]"
            :key="l.value"
            class="px-1.5 py-1 hover:bg-gray-100 transition-colors"
            :class="layout === l.value ? 'bg-blue-50 text-blue-600' : 'text-gray-600'"
            @click="setLayout(l.value)"
            :title="l.label"
            v-html="l.icon"
          />
        </div>

        <!-- Delete button -->
        <button
          v-if="editor?.isEditable"
          class="w-5 h-5 bg-red-500 text-white rounded text-xs flex items-center justify-center hover:bg-red-600 shadow"
          @click="deleteNode"
          title="Delete image"
        >x</button>
      </div>
    </div>
  </NodeViewWrapper>
</template>
