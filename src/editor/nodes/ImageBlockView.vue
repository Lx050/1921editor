<script setup lang="ts">
import { ref, computed, onBeforeUnmount } from 'vue'
import { nodeViewProps, NodeViewWrapper } from '@tiptap/vue-3'

const props = defineProps(nodeViewProps)

const src = computed(() => props.node.attrs.src || '')
const layout = computed(() => props.node.attrs.layout || 'full_width')
const caption = computed(() => props.node.attrs.caption || '')
const imageWidth = computed(() => props.node.attrs.width as number | null)
const href = computed(() => props.node.attrs.href || '')

const isEditing = ref(false)
const captionInput = ref('')
const isEditingLink = ref(false)
const linkInput = ref('')
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

function startEditLink() {
  linkInput.value = href.value
  isEditingLink.value = true
}

function saveLink() {
  props.updateAttributes({ href: linkInput.value.trim() })
  isEditingLink.value = false
}

function removeLink() {
  props.updateAttributes({ href: '' })
  isEditingLink.value = false
}

function handleLinkKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter') { e.preventDefault(); saveLink() }
  if (e.key === 'Escape') { e.preventDefault(); isEditingLink.value = false }
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
      :class="containerClass"
      :style="selected ? 'box-shadow:0 0 0 2px var(--color-accent-primary);' : ''"
      @mouseover="(e) => { if (!selected) (e.currentTarget as HTMLElement).style.outline = '1px solid rgba(0,0,0,0.12)'; }"
      @mouseout="(e) => { if (!selected) (e.currentTarget as HTMLElement).style.outline = ''; }"
    >
      <!-- Image with resize wrapper -->
      <div class="relative inline-block w-full">
        <img
          v-if="src"
          ref="imgRef"
          :src="src"
          :alt="caption || ''"
          draggable="false"
          class="block rounded"
          :style="imageStyle"
        />
        <div
          v-else
          class="w-full h-32 rounded flex items-center justify-center text-sm"
          style="background:var(--color-bg-warm); color:var(--color-text-muted);"
        >
          No image
        </div>

        <!-- Resize handle (right edge) -->
        <div
          v-if="src && editor?.isEditable && selected"
          class="absolute top-0 right-0 w-2 h-full cursor-ew-resize flex items-center justify-center group/handle"
          @mousedown="onResizeStart"
        >
          <div class="w-1 h-8 rounded-full opacity-60 group-hover/handle:opacity-100 transition-opacity" style="background:var(--color-accent-primary);" />
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
            class="text-xs bg-transparent outline-none text-center px-1 py-0.5 w-full max-w-[300px]"
            style="color:rgba(0,0,0,0.45); border-bottom:1px solid var(--color-accent-primary);"
            placeholder="Enter caption..."
            @keydown="handleCaptionKeydown"
            @blur="saveCaption"
            autofocus
          />
        </div>
        <div
          v-else-if="caption"
          class="text-xs cursor-pointer transition-colors"
          style="color:rgba(0,0,0,0.45);"
          @mouseover="($event.target as HTMLElement).style.color='rgba(0,0,0,0.65)'"
          @mouseout="($event.target as HTMLElement).style.color='rgba(0,0,0,0.45)'"
          @click="startEditCaption"
        >
          {{ caption }}
        </div>
        <div
          v-else
          class="text-xs cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
          style="color:rgba(0,0,0,0.25);"
          @mouseover="($event.target as HTMLElement).style.color='rgba(0,0,0,0.45)'"
          @mouseout="($event.target as HTMLElement).style.color='rgba(0,0,0,0.25)'"
          @click="startEditCaption"
        >
          + Add caption
        </div>
      </div>

      <!-- Overlay controls -->
      <div class="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <!-- Layout switcher -->
        <div class="flex bg-white/90 backdrop-blur rounded shadow-sm text-[10px]" style="border:1px solid rgba(0,0,0,0.08);">
          <button
            v-for="l in [
              { value: 'full_width', label: '全宽', icon: '&#x2194;' },
              { value: 'inline', label: '居中', icon: '&#x25A1;' },
              { value: 'left', label: '左浮', icon: '&#x21E4;' },
              { value: 'right', label: '右浮', icon: '&#x21E5;' },
            ]"
            :key="l.value"
            class="px-1.5 py-1 transition-colors"
            @mouseover="($event.target as HTMLElement).style.background='var(--color-bg-warm)'"
            @mouseout="($event.target as HTMLElement).style.background=''"
            :style="layout === l.value ? { backgroundColor: 'var(--color-badge-bg)', color: 'var(--color-accent-primary)' } : { color: 'rgba(0,0,0,0.55)' }"
            @click="setLayout(l.value)"
            :title="l.label"
            v-html="l.icon"
          />
        </div>

        <!-- Link button -->
        <button
          class="px-1.5 py-1 bg-white/90 backdrop-blur rounded shadow-sm text-[10px] transition-colors"
          style="border:1px solid rgba(0,0,0,0.08);"
          @mouseover="($event.target as HTMLElement).style.background='var(--color-bg-warm)'"
          @mouseout="($event.target as HTMLElement).style.background='rgba(255,255,255,0.9)'"
          :style="href ? { color: 'var(--color-accent-primary)' } : { color: 'rgba(0,0,0,0.55)' }"
          @click="startEditLink"
          title="设置链接"
        >&#x1F517;</button>

        <!-- Delete button -->
        <button
          v-if="editor?.isEditable"
          class="w-5 h-5 bg-red-500 text-white rounded text-xs flex items-center justify-center hover:bg-red-600 shadow"
          @click="deleteNode"
          title="删除图片"
          aria-label="删除图片"
        >x</button>
      </div>

      <!-- Link indicator (when link is set) -->
      <div
        v-if="href && !isEditingLink"
        class="absolute bottom-2 left-2 right-2 rounded px-2 py-1 text-[10px] truncate opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
        style="background-color: var(--color-badge-bg); border: 1px solid rgba(0,117,222,0.25); color: var(--color-accent-primary);"
        @click="startEditLink"
        :title="href"
      >
        &#x1F517; {{ href }}
      </div>

      <!-- Link editor popup -->
      <div
        v-if="isEditingLink"
        class="absolute bottom-2 left-2 right-2 bg-white rounded-lg shadow-lg p-2 z-30"
        style="border:1px solid rgba(0,0,0,0.12);"
        @click.stop
      >
        <div class="text-[10px] mb-1" style="color:rgba(0,0,0,0.45);">图片链接</div>
        <div class="flex items-center gap-1">
          <input
            v-model="linkInput"
            class="flex-1 text-xs rounded px-2 py-1 outline-none"
            style="border:1px solid rgba(0,0,0,0.08); --focus-border:var(--color-accent-primary);"
            onfocus="this.style.borderColor='var(--color-accent-primary)'"
            onblur="this.style.borderColor=''"
            placeholder="https://..."
            @keydown="handleLinkKeydown"
            autofocus
          />
          <button
            class="text-[10px] px-2 py-1 text-white rounded"
            style="background-color: var(--color-accent-primary);"
            @mouseover="$event.target.style.backgroundColor='var(--color-accent-hover)'"
            @mouseout="$event.target.style.backgroundColor='var(--color-accent-primary)'"
            @click="saveLink"
          >确定</button>
          <button
            v-if="href"
            class="text-[10px] px-2 py-1 bg-red-50 text-red-500 rounded hover:bg-red-100"
            @click="removeLink"
          >删除</button>
        </div>
      </div>
    </div>
  </NodeViewWrapper>
</template>
