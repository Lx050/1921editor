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

function handleEditorUpdate(json: EditorDocument) {
  appStore.editorJson = json
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

onMounted(() => {
  // Build initial content from existing data
  let initialContent: EditorDocument

  if (appStore.editorJson) {
    initialContent = appStore.editorJson as EditorDocument
  } else if (contentBlocks.value.length > 0) {
    initialContent = contentBlocksToTiptap(contentBlocks.value)
  } else {
    initialContent = {
      type: 'doc',
      content: [
        { type: 'manifoldHeading', attrs: { level: 1 }, content: [{ type: 'text', text: '' }] },
        { type: 'manifoldParagraph', content: [{ type: 'text', text: '' }] },
      ]
    }
  }

  editor.value = createManifoldEditor({
    content: initialContent,
    onUpdate: handleEditorUpdate,
  })

  window.addEventListener('manifold:open-svg-panel', handleOpenSvgPanel)
})

onBeforeUnmount(() => {
  editor.value?.destroy()
  window.removeEventListener('manifold:open-svg-panel', handleOpenSvgPanel)
})

function goToPublish() {
  router.push('/step3')
}
</script>

<template>
  <div class="flex flex-col h-full w-full bg-gray-50">
    <EditorToolbar :editor="editor" />

    <div class="flex flex-1 overflow-hidden">
      <EditorSidebar ref="sidebarRef" @insert-svg="insertSvgTemplate" />

      <div class="flex-1 overflow-y-auto" @click="handleCanvasClick">
        <div class="max-w-[680px] mx-auto py-8 px-6 bg-white min-h-full shadow-sm my-4 rounded">
          <EditorContent v-if="editor" :editor="editor" class="manifold-editor-content" />
        </div>
      </div>
    </div>

    <div class="flex-shrink-0 border-t bg-white px-6 py-3 flex items-center justify-between">
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
.manifold-editor-content .ProseMirror .is-empty::before {
  color: #d1d5db;
  content: attr(data-placeholder);
  float: left;
  height: 0;
  pointer-events: none;
}
</style>
