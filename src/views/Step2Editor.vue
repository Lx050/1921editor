<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { EditorContent } from '@tiptap/vue-3'
import { storeToRefs } from 'pinia'
import { useAppStore } from '../stores/appStore'
import { createManifoldEditor } from '../editor/core/createEditor'
import { contentBlocksToTiptap } from '../editor/serializers/jsonImporter'
import EditorToolbar from '../components/EditorToolbar.vue'
import EditorSidebar from '../components/EditorSidebar.vue'
import ImageSlotPopover from '../components/ImageSlotPopover.vue'
import type { Editor } from '@tiptap/vue-3'
import type { EditorDocument, ImageSlotData } from '@/types/editor'

const router = useRouter()
const appStore = useAppStore()
const { contentBlocks } = storeToRefs(appStore)

const editor = ref<Editor | null>(null)
const sidebarRef = ref<InstanceType<typeof EditorSidebar> | null>(null)

// Image slot popover state
const popoverVisible = ref(false)
const popoverPosition = ref({ x: 0, y: 0 })
const popoverSlotId = ref('')
const popoverNodePos = ref<number | null>(null)
const popoverCurrentData = ref<ImageSlotData | null>(null)

let autosaveTimer: ReturnType<typeof setTimeout> | null = null

function handleEditorUpdate(json: EditorDocument) {
  appStore.editorJson = json
  // Debounced autosave to localStorage
  if (autosaveTimer) clearTimeout(autosaveTimer)
  autosaveTimer = setTimeout(() => {
    try {
      localStorage.setItem('manifold_editor_autosave', JSON.stringify(json))
    } catch { /* ignore quota errors */ }
  }, 2000)
}

function insertSvgTemplate(tpl: { id: string; name: string; svg: string; imageSlots?: any[] }) {
  if (!editor.value) return

  const slots: Record<string, null> = {}
  if (tpl.imageSlots) {
    for (const slot of tpl.imageSlots) {
      slots[slot.id] = null
    }
  }

  editor.value
    .chain()
    .focus()
    .insertContent({
      type: 'manifoldSvgBlock',
      attrs: {
        templateId: tpl.id,
        source: 'manifold',
        svgContent: tpl.svg,
        imageSlots: slots,
        config: {},
      },
    })
    .run()
}

function handleSlotImageSelect(data: ImageSlotData) {
  if (!editor.value || popoverNodePos.value === null) return

  const { state } = editor.value
  const node = state.doc.nodeAt(popoverNodePos.value)
  if (node && node.type.name === 'manifoldSvgBlock') {
    const currentSlots = { ...(node.attrs.imageSlots || {}) }
    currentSlots[popoverSlotId.value] = data
    editor.value.chain()
      .setNodeSelection(popoverNodePos.value)
      .updateAttributes('manifoldSvgBlock', { imageSlots: currentSlots })
      .run()
  }

  popoverVisible.value = false
}

function handleCanvasClick(event: MouseEvent) {
  const slotEl = (event.target as Element).closest?.('[data-image-slot]')
  if (!slotEl) return

  const slotId = slotEl.getAttribute('data-image-slot')
  if (!slotId) return

  const svgBlockEl = slotEl.closest('[data-node-type="manifold-svg-block"]')
  if (!svgBlockEl) return

  const rect = slotEl.getBoundingClientRect()
  popoverSlotId.value = slotId
  popoverPosition.value = { x: rect.left + rect.width / 2, y: rect.bottom + 8 }
  popoverVisible.value = true

  if (editor.value) {
    const view = editor.value.view
    const pos = view.posAtDOM(svgBlockEl, 0)
    popoverNodePos.value = pos > 0 ? pos - 1 : 0

    const node = editor.value.state.doc.nodeAt(popoverNodePos.value)
    if (node) {
      const slots = node.attrs.imageSlots || {}
      popoverCurrentData.value = slots[slotId] || null
    }
  }

  event.stopPropagation()
}

function handleOpenSvgPanel() {
  sidebarRef.value?.switchToSvg()
}

/** Handle drag-drop images onto the editor canvas */
function handleDrop(event: DragEvent) {
  if (!editor.value || !event.dataTransfer?.files.length) return
  const file = event.dataTransfer.files[0]
  if (!file.type.startsWith('image/')) return

  event.preventDefault()
  const localUrl = URL.createObjectURL(file)
  editor.value.chain().focus().insertContent({
    type: 'manifoldImage',
    attrs: { src: localUrl, caption: '', layout: 'full_width' },
  }).run()
}

function handleDragOver(event: DragEvent) {
  if (event.dataTransfer?.types.includes('Files')) {
    event.preventDefault()
  }
}

onMounted(() => {
  let initialContent: EditorDocument

  if (appStore.editorJson) {
    initialContent = appStore.editorJson as EditorDocument
  } else if (contentBlocks.value.length > 0) {
    initialContent = contentBlocksToTiptap(contentBlocks.value)
  } else {
    // Try restoring from autosave
    try {
      const saved = localStorage.getItem('manifold_editor_autosave')
      if (saved) {
        initialContent = JSON.parse(saved) as EditorDocument
      }
    } catch { /* ignore */ }
    if (!initialContent!) {
      initialContent = {
        type: 'doc',
        content: [
          { type: 'manifoldHeading', attrs: { level: 1 }, content: [{ type: 'text', text: '' }] },
          { type: 'manifoldParagraph', content: [{ type: 'text', text: '' }] },
        ]
      }
    }
  }

  editor.value = createManifoldEditor({
    content: initialContent,
    onUpdate: handleEditorUpdate,
  })

  window.addEventListener('manifold:open-svg-panel', handleOpenSvgPanel)
})

onBeforeUnmount(() => {
  if (autosaveTimer) clearTimeout(autosaveTimer)
  editor.value?.destroy()
  window.removeEventListener('manifold:open-svg-panel', handleOpenSvgPanel)
})

function goBack() {
  router.push('/step1')
}

function goToPublish() {
  router.push('/step3')
}
</script>

<template>
  <div class="flex flex-col h-full w-full bg-gray-50">
    <EditorToolbar :editor="editor" @open-svg-panel="handleOpenSvgPanel" />

    <div class="flex flex-1 overflow-hidden">
      <EditorSidebar ref="sidebarRef" @insert-svg="insertSvgTemplate" />

      <div
        class="flex-1 overflow-y-auto"
        @click="handleCanvasClick"
        @drop="handleDrop"
        @dragover="handleDragOver"
      >
        <div class="max-w-[680px] mx-auto py-8 px-6 bg-white min-h-full shadow-sm my-4 rounded">
          <EditorContent v-if="editor" :editor="editor" class="manifold-editor-content" />
        </div>
      </div>
    </div>

    <div class="flex-shrink-0 border-t bg-white px-6 py-3 flex items-center justify-between">
      <button
        class="text-sm text-gray-500 hover:text-gray-700 transition-colors"
        @click="goBack"
      >
        &larr; 返回文本输入
      </button>
      <span class="text-xs text-gray-400">Manifold SVG Editor v2</span>
      <button
        class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
        @click="goToPublish"
      >
        下一步: 发布确认
      </button>
    </div>

    <ImageSlotPopover
      :visible="popoverVisible"
      :position="popoverPosition"
      :slot-id="popoverSlotId"
      :current-data="popoverCurrentData"
      @select="handleSlotImageSelect"
      @close="popoverVisible = false"
    />
  </div>
</template>

<style>
.manifold-editor-content .ProseMirror {
  outline: none;
  min-height: 400px;
}
.manifold-editor-content .ProseMirror h1 {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
}
.manifold-editor-content .ProseMirror h2 {
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 0.75rem;
}
.manifold-editor-content .ProseMirror h3 {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}
.manifold-editor-content .ProseMirror p {
  margin-bottom: 0.75rem;
  line-height: 1.625;
}
.manifold-editor-content .ProseMirror hr {
  border: none;
  border-top: 1px solid #e5e7eb;
  margin: 1.5rem 0;
}
.manifold-editor-content .ProseMirror .is-empty::before {
  color: #d1d5db;
  content: attr(data-placeholder);
  float: left;
  height: 0;
  pointer-events: none;
}
/* BlockRole visual indicators */
.manifold-editor-content .ProseMirror p[data-role="intro"] {
  border-left: 3px solid #60a5fa;
  padding-left: 12px;
  color: #4b5563;
  font-style: italic;
}
.manifold-editor-content .ProseMirror p[data-role="outro"] {
  border-left: 3px solid #a78bfa;
  padding-left: 12px;
  color: #4b5563;
  font-style: italic;
}
/* Image nodes */
.manifold-editor-content .ProseMirror figure[data-node-type="manifold-image"] {
  margin: 1rem 0;
  text-align: center;
}
.manifold-editor-content .ProseMirror figure[data-node-type="manifold-image"] img {
  max-width: 100%;
  height: auto;
  border-radius: 4px;
}
.manifold-editor-content .ProseMirror figure[data-node-type="manifold-image"]:hover {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
  border-radius: 4px;
}
</style>
