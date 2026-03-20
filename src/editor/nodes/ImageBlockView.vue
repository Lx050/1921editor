<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { nodeViewProps, NodeViewWrapper } from '@tiptap/vue-3'

const props = defineProps(nodeViewProps)

const src = computed(() => props.node.attrs.src || '')
const layout = computed(() => props.node.attrs.layout || 'full_width')
const caption = computed(() => props.node.attrs.caption || '')

const isEditing = ref(false)
const captionInput = ref('')

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
  if (e.key === 'Enter') {
    e.preventDefault()
    saveCaption()
  }
  if (e.key === 'Escape') {
    e.preventDefault()
    cancelCaption()
  }
}

function setLayout(newLayout: string) {
  props.updateAttributes({ layout: newLayout })
}

const layoutLabel = computed(() => {
  switch (layout.value) {
    case 'full_width': return '全宽'
    case 'inline': return '行内'
    case 'left': return '左浮'
    case 'right': return '右浮'
    default: return '全宽'
  }
})

const containerClass = computed(() => {
  switch (layout.value) {
    case 'inline': return 'max-w-[60%] mx-auto'
    case 'left': return 'float-left mr-4 max-w-[50%]'
    case 'right': return 'float-right ml-4 max-w-[50%]'
    default: return 'w-full'
  }
})
</script>

<template>
  <NodeViewWrapper class="manifold-image-block my-3" data-drag-handle>
    <div
      class="relative group rounded-lg transition-all"
      :class="[containerClass, selected ? 'ring-2 ring-blue-400' : 'hover:ring-1 hover:ring-gray-300']"
    >
      <!-- Image -->
      <img
        v-if="src"
        :src="src"
        draggable="false"
        class="block max-w-full h-auto rounded"
        :class="layout === 'full_width' ? 'w-full' : ''"
      />
      <div
        v-else
        class="w-full h-32 bg-gray-100 rounded flex items-center justify-center text-gray-400 text-sm"
      >
        No image
      </div>

      <!-- Caption area -->
      <div class="mt-1.5 text-center">
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
              { value: 'inline', label: '行内', icon: '&#x25A1;' },
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
