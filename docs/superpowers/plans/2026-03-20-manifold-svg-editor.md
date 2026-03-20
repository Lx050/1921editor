# Manifold SVG Editor Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the block-based Step2 editor + Step3 preview with a unified tiptap WYSIWYG editor that supports SVG image slot editing.

**Architecture:** tiptap (ProseMirror) editor with custom Vue 3 NodeViews for SVG blocks. Image slots in SVG templates are marked with `data-image-slot` attributes and populated via an inline popover. Left sidebar has 3 tabs (Styles, SVG, Images). Step3 becomes a lightweight publish confirmation page.

**Tech Stack:** Vue 3, tiptap 2.x, Pinia, TypeScript, TailwindCSS, Vite 4, Element Plus

**Spec:** `docs/superpowers/specs/2026-03-20-manifold-svg-editor-design.md`

---

## File Structure

### New Files

```
src/editor/
├── core/
│   └── createEditor.ts          # tiptap instance factory
├── nodes/
│   ├── ManifoldHeading.ts       # Heading node extension
│   ├── ManifoldParagraph.ts     # Paragraph node extension
│   ├── ManifoldImage.ts         # Image node extension
│   ├── ManifoldSvgBlock.ts      # SVG interactive block (core)
│   ├── SvgBlockView.vue         # NodeView component for SVG blocks
│   └── index.ts                 # Re-export all nodes
├── extensions/
│   ├── SlashCommand.ts          # Slash menu extension
│   └── index.ts                 # Re-export all extensions
├── serializers/
│   ├── htmlSerializer.ts        # tiptap JSON → WeChat HTML
│   └── jsonImporter.ts          # contentBlocks → tiptap JSON
└── api/
    └── ManifoldEditorAPI.ts     # Programmatic editor API (stub)

src/components/
├── ImageSlotPopover.vue         # Image slot picker popup
├── EditorToolbar.vue            # Top toolbar
├── EditorSidebar.vue            # Left sidebar (3 tabs)
└── ImageManagerTab.vue          # Image management tab

src/views/
├── Step2Editor.vue              # New WYSIWYG editor view
└── Step3Confirm.vue             # Lightweight publish confirmation

src/styles/
└── svgTemplatesImageDriven.js   # 36 image-driven SVG templates

src/types/
└── editor.ts                    # Editor-specific type definitions
```

### Modified Files

```
src/stores/appStore.ts           # Add editorJson, imageSlotRegistry
src/types/index.ts               # Add BlockType 'svg_image_interactive'
src/router/index.ts              # Add feature-flagged v2 routes
src/styles/svgTemplates.js       # Register 6 new image-driven categories
src/components/SvgTemplatePanel.vue  # Add 6th tier group
package.json                     # Add tiptap dependencies
vite.config.js                   # Add tiptap to optimizeDeps
```

---

## Chunk 1: Phase 0 — Dependencies + Type Foundation

### Task 1: Install tiptap Dependencies

**Files:**
- Modify: `package.json`
- Modify: `vite.config.js`

- [ ] **Step 1: Install tiptap packages to /tmp (JuiceFS workaround)**

```bash
cd /tmp/1921editor-nm
cp /home/node/a0/workspace/197f49cc-2d25-4398-a8d3-6aaf7415ff27/workspace/tmp/1921editor/src/package.json .
npm install @tiptap/vue-3 @tiptap/starter-kit @tiptap/extension-image @tiptap/extension-placeholder @tiptap/extension-dropcursor @tiptap/pm
```

Then symlink node_modules back if not already linked.

- [ ] **Step 2: Add tiptap to Vite optimizeDeps**

In `vite.config.js`, add to the `optimizeDeps.include` array (or create it):

```javascript
optimizeDeps: {
  include: ['@tiptap/vue-3', '@tiptap/starter-kit', '@tiptap/pm']
}
```

- [ ] **Step 3: Verify dev server starts**

```bash
cd /home/node/.../tmp/1921editor/src && npx vite --port 1921
```

Expected: Server starts on port 1921 without import errors.

- [ ] **Step 4: Commit**

```bash
git add package.json vite.config.js
git commit -m "chore: add tiptap dependencies for Manifold editor"
```

---

### Task 2: Add Editor Type Definitions

**Files:**
- Create: `src/types/editor.ts`
- Modify: `src/types/index.ts`

- [ ] **Step 1: Create editor type definitions**

Create `src/types/editor.ts`:

```typescript
import type { JSONContent } from '@tiptap/vue-3'

/** Image slot definition within an SVG template */
export interface ImageSlotDef {
  id: string
  label: string
  width: number
  height: number
}

/** Filled image slot data */
export interface ImageSlotData {
  url: string
  mediaId?: string
  name?: string
}

/** SVG template with image slots */
export interface ImageDrivenSvgTemplate {
  id: string
  name: string
  category: string
  tags: string[]
  colorScheme: string
  interactive: boolean
  interactionType?: string
  source: 'manifold'
  imageSlots: ImageSlotDef[]
  svg: string
}

/** ManifoldSvgBlock node attrs */
export interface SvgBlockAttrs {
  templateId: string
  source: string
  svgContent: string
  imageSlots: Record<string, ImageSlotData | null>
  config: Record<string, unknown>
}

/** ManifoldImage node attrs */
export interface ImageBlockAttrs {
  src: string
  mediaId?: string
  caption?: string
  layout: 'full_width' | 'inline' | 'float_left' | 'float_right'
}

/** Editor document JSON (alias for tiptap JSONContent) */
export type EditorDocument = JSONContent

/** Image slot registry entry (derived from all SVG blocks) */
export interface SlotRegistryEntry {
  nodeId: string
  templateId: string
  slotId: string
  slotLabel: string
  data: ImageSlotData | null
}
```

- [ ] **Step 2: Add new BlockType to index.ts**

In `src/types/index.ts`, add `'svg_image_interactive'` to the `BlockType` union:

```typescript
export type BlockType =
  | 'title'
  | 'body'
  | 'intro'
  | 'outro'
  | 'image_single'
  | 'image_single_caption'
  | 'image_double'
  | 'image_double_caption'
  | 'svg_decoration'
  | 'svg_image_interactive'
```

- [ ] **Step 3: Commit**

```bash
git add src/types/editor.ts src/types/index.ts
git commit -m "feat: add editor type definitions for Manifold SVG editor"
```

---

## Chunk 2: Phase 1a — tiptap Editor Core + Custom Nodes

### Task 3: Create Editor Instance Factory

**Files:**
- Create: `src/editor/core/createEditor.ts`

- [ ] **Step 1: Create the editor factory**

Create `src/editor/core/createEditor.ts`:

```typescript
import { Editor } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import Dropcursor from '@tiptap/extension-dropcursor'
import { ManifoldHeading } from '../nodes/ManifoldHeading'
import { ManifoldParagraph } from '../nodes/ManifoldParagraph'
import { ManifoldImage } from '../nodes/ManifoldImage'
import { ManifoldSvgBlock } from '../nodes/ManifoldSvgBlock'
import { SlashCommand } from '../extensions/SlashCommand'
import type { EditorDocument } from '@/types/editor'

export interface CreateEditorOptions {
  content?: EditorDocument
  onUpdate?: (json: EditorDocument) => void
  editable?: boolean
}

export function createManifoldEditor(options: CreateEditorOptions = {}): Editor {
  const { content, onUpdate, editable = true } = options

  return new Editor({
    editable,
    content: content || {
      type: 'doc',
      content: [
        {
          type: 'manifoldHeading',
          attrs: { level: 1 },
          content: [{ type: 'text', text: '' }]
        }
      ]
    },
    extensions: [
      StarterKit.configure({
        // Disable built-in nodes we're replacing with custom ones
        heading: false,
        paragraph: false,
      }),
      ManifoldHeading,
      ManifoldParagraph,
      ManifoldImage,
      ManifoldSvgBlock,
      Placeholder.configure({
        placeholder: ({ node }) => {
          if (node.type.name === 'manifoldHeading') return '输入标题...'
          return '输入内容... 输入 / 打开命令菜单'
        }
      }),
      Dropcursor.configure({ color: '#3b82f6', width: 2 }),
      SlashCommand,
    ],
    onUpdate: ({ editor }) => {
      if (onUpdate) {
        onUpdate(editor.getJSON() as EditorDocument)
      }
    }
  })
}
```

- [ ] **Step 2: Commit**

```bash
git add src/editor/core/createEditor.ts
git commit -m "feat: create tiptap editor instance factory"
```

---

### Task 4: Create Custom Node — ManifoldHeading

**Files:**
- Create: `src/editor/nodes/ManifoldHeading.ts`

- [ ] **Step 1: Implement ManifoldHeading node**

```typescript
import { Node, mergeAttributes } from '@tiptap/vue-3'

export const ManifoldHeading = Node.create({
  name: 'manifoldHeading',
  group: 'block',
  content: 'inline*',
  defining: true,

  addAttributes() {
    return {
      level: { default: 1, parseHTML: el => parseInt(el.tagName.replace('H', ''), 10) || 1 },
      styleId: { default: null },
    }
  },

  parseHTML() {
    return [1, 2, 3].map(level => ({
      tag: `h${level}`,
      attrs: { level },
    }))
  },

  renderHTML({ node, HTMLAttributes }) {
    const level = node.attrs.level || 1
    return [`h${level}`, mergeAttributes(HTMLAttributes, {
      'data-node-type': 'manifold-heading',
      'data-style-id': node.attrs.styleId || '',
    }), 0]
  },

  addKeyboardShortcuts() {
    return {
      'Mod-Alt-1': () => this.editor.commands.toggleNode(this.name, 'manifoldParagraph', { level: 1 }),
      'Mod-Alt-2': () => this.editor.commands.toggleNode(this.name, 'manifoldParagraph', { level: 2 }),
      'Mod-Alt-3': () => this.editor.commands.toggleNode(this.name, 'manifoldParagraph', { level: 3 }),
    }
  },
})
```

- [ ] **Step 2: Commit**

```bash
git add src/editor/nodes/ManifoldHeading.ts
git commit -m "feat: ManifoldHeading tiptap node"
```

---

### Task 5: Create Custom Node — ManifoldParagraph

**Files:**
- Create: `src/editor/nodes/ManifoldParagraph.ts`

- [ ] **Step 1: Implement ManifoldParagraph node**

```typescript
import { Node, mergeAttributes } from '@tiptap/vue-3'

export const ManifoldParagraph = Node.create({
  name: 'manifoldParagraph',
  group: 'block',
  content: 'inline*',
  defining: true,

  addAttributes() {
    return {
      styleId: { default: null },
      blockRole: { default: 'body' },  // body | intro | outro
    }
  },

  parseHTML() {
    return [{ tag: 'p' }]
  },

  renderHTML({ node, HTMLAttributes }) {
    return ['p', mergeAttributes(HTMLAttributes, {
      'data-node-type': 'manifold-paragraph',
      'data-style-id': node.attrs.styleId || '',
      'data-role': node.attrs.blockRole || 'body',
    }), 0]
  },
})
```

- [ ] **Step 2: Commit**

```bash
git add src/editor/nodes/ManifoldParagraph.ts
git commit -m "feat: ManifoldParagraph tiptap node"
```

---

### Task 6: Create Custom Node — ManifoldImage

**Files:**
- Create: `src/editor/nodes/ManifoldImage.ts`

- [ ] **Step 1: Implement ManifoldImage node**

```typescript
import { Node, mergeAttributes } from '@tiptap/vue-3'

export const ManifoldImage = Node.create({
  name: 'manifoldImage',
  group: 'block',
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      src: { default: null },
      mediaId: { default: null },
      caption: { default: '' },
      layout: { default: 'full_width' },
    }
  },

  parseHTML() {
    return [{
      tag: 'figure[data-node-type="manifold-image"]',
    }]
  },

  renderHTML({ HTMLAttributes }) {
    const src = HTMLAttributes.src || ''
    const caption = HTMLAttributes.caption || ''
    return ['figure', mergeAttributes({ 'data-node-type': 'manifold-image' }, HTMLAttributes),
      ['img', { src, draggable: false }],
      caption ? ['figcaption', {}, caption] : '',
    ]
  },
})
```

- [ ] **Step 2: Commit**

```bash
git add src/editor/nodes/ManifoldImage.ts
git commit -m "feat: ManifoldImage tiptap node"
```

---

### Task 7: Create Custom Node — ManifoldSvgBlock (Core)

**Files:**
- Create: `src/editor/nodes/ManifoldSvgBlock.ts`
- Create: `src/editor/nodes/SvgBlockView.vue`

- [ ] **Step 1: Implement ManifoldSvgBlock node extension**

Create `src/editor/nodes/ManifoldSvgBlock.ts`:

```typescript
import { Node, mergeAttributes, VueNodeViewRenderer } from '@tiptap/vue-3'
import SvgBlockView from './SvgBlockView.vue'

export const ManifoldSvgBlock = Node.create({
  name: 'manifoldSvgBlock',
  group: 'block',
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      templateId: { default: '' },
      source: { default: 'manifold' },
      svgContent: { default: '' },
      imageSlots: { default: {} },
      config: { default: {} },
    }
  },

  parseHTML() {
    return [{
      tag: 'section[data-node-type="manifold-svg-block"]',
    }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['section', mergeAttributes({
      'data-node-type': 'manifold-svg-block',
      'data-template-id': HTMLAttributes.templateId || '',
    })]
  },

  addNodeView() {
    return VueNodeViewRenderer(SvgBlockView)
  },
})
```

- [ ] **Step 2: Implement SvgBlockView.vue NodeView component**

Create `src/editor/nodes/SvgBlockView.vue`:

```vue
<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { nodeViewProps, NodeViewWrapper } from '@tiptap/vue-3'
import type { ImageSlotData } from '@/types/editor'

const props = defineProps(nodeViewProps)

const svgContent = computed(() => props.node.attrs.svgContent || '')
const imageSlots = computed(() => props.node.attrs.imageSlots || {})
const templateId = computed(() => props.node.attrs.templateId || '')

const activeSlotId = ref<string | null>(null)
const popoverPosition = ref({ x: 0, y: 0 })
const showPopover = ref(false)

/** Render SVG with filled image slots */
const renderedSvg = computed(() => {
  let svg = svgContent.value
  const slots = imageSlots.value as Record<string, ImageSlotData | null>
  for (const [slotId, data] of Object.entries(slots)) {
    if (data?.url) {
      // Replace placeholder href with actual image URL
      const regex = new RegExp(`data-image-slot="${slotId}"([^>]*?)href="[^"]*"`, 'g')
      svg = svg.replace(regex, `data-image-slot="${slotId}"$1href="${data.url}"`)
    }
  }
  return svg
})

/** Check if a slot has an image */
function isSlotFilled(slotId: string): boolean {
  const slots = imageSlots.value as Record<string, ImageSlotData | null>
  return Boolean(slots[slotId]?.url)
}

/** Handle click on SVG — detect image slot clicks */
function handleSvgClick(event: MouseEvent) {
  const target = event.target as Element
  const slotEl = target.closest('[data-image-slot]')
  if (slotEl) {
    const slotId = slotEl.getAttribute('data-image-slot')
    if (slotId) {
      activeSlotId.value = slotId
      const rect = slotEl.getBoundingClientRect()
      popoverPosition.value = { x: rect.left + rect.width / 2, y: rect.bottom + 8 }
      showPopover.value = true
      event.stopPropagation()
    }
  }
}

/** Update a single image slot */
function setSlotImage(slotId: string, data: ImageSlotData) {
  const currentSlots = { ...imageSlots.value } as Record<string, ImageSlotData | null>
  currentSlots[slotId] = data
  props.updateAttributes({ imageSlots: currentSlots })
  showPopover.value = false
}

/** Emit to parent for popover */
defineExpose({ activeSlotId, popoverPosition, showPopover, setSlotImage })
</script>

<template>
  <NodeViewWrapper class="manifold-svg-block" data-drag-handle>
    <div class="relative group border border-transparent hover:border-blue-300 rounded-lg transition-colors">
      <!-- SVG Render Area -->
      <div
        class="svg-container"
        @click="handleSvgClick"
        v-html="renderedSvg"
      />

      <!-- Overlay indicators for empty slots -->
      <div
        v-if="Object.values(imageSlots).some(s => !s?.url)"
        class="absolute top-2 right-2 bg-amber-100 text-amber-700 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
      >
        {{ Object.values(imageSlots).filter(s => !s?.url).length }} 个图片槽位待填充
      </div>

      <!-- Delete button -->
      <button
        v-if="editor.isEditable"
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
```

- [ ] **Step 3: Create nodes index**

Create `src/editor/nodes/index.ts`:

```typescript
export { ManifoldHeading } from './ManifoldHeading'
export { ManifoldParagraph } from './ManifoldParagraph'
export { ManifoldImage } from './ManifoldImage'
export { ManifoldSvgBlock } from './ManifoldSvgBlock'
```

- [ ] **Step 4: Commit**

```bash
git add src/editor/nodes/
git commit -m "feat: ManifoldSvgBlock node with SvgBlockView NodeView"
```

---

### Task 8: Create SlashCommand Extension

**Files:**
- Create: `src/editor/extensions/SlashCommand.ts`
- Create: `src/editor/extensions/index.ts`

- [ ] **Step 1: Implement slash command extension**

Create `src/editor/extensions/SlashCommand.ts`:

```typescript
import { Extension } from '@tiptap/vue-3'
import { PluginKey, Plugin } from '@tiptap/pm/state'
import { Decoration, DecorationSet } from '@tiptap/pm/view'

export interface SlashMenuItem {
  title: string
  icon: string
  command: (editor: any) => void
}

export const slashMenuItems: SlashMenuItem[] = [
  {
    title: '标题',
    icon: 'H',
    command: (editor) => editor.chain().focus().toggleNode('manifoldHeading', 'manifoldParagraph', { level: 1 }).run(),
  },
  {
    title: '正文',
    icon: 'P',
    command: (editor) => editor.chain().focus().setNode('manifoldParagraph', { blockRole: 'body' }).run(),
  },
  {
    title: '引言',
    icon: 'Q',
    command: (editor) => editor.chain().focus().setNode('manifoldParagraph', { blockRole: 'intro' }).run(),
  },
  {
    title: '图片',
    icon: 'I',
    command: (editor) => editor.chain().focus().insertContent({ type: 'manifoldImage', attrs: { src: '', layout: 'full_width' } }).run(),
  },
  {
    title: 'SVG交互模板',
    icon: 'S',
    command: (_editor) => {
      // Emit event to open SVG panel — handled by Step2Editor.vue
      window.dispatchEvent(new CustomEvent('manifold:open-svg-panel'))
    },
  },
  {
    title: '分隔线',
    icon: '—',
    command: (editor) => editor.chain().focus().setHorizontalRule().run(),
  },
]

export const SlashCommand = Extension.create({
  name: 'slashCommand',

  addKeyboardShortcuts() {
    return {
      '/': () => {
        // Emit event for the Vue component to show slash menu
        window.dispatchEvent(new CustomEvent('manifold:slash-menu', {
          detail: { items: slashMenuItems }
        }))
        return false  // Don't prevent the '/' from being typed
      },
    }
  },
})
```

- [ ] **Step 2: Create extensions index**

Create `src/editor/extensions/index.ts`:

```typescript
export { SlashCommand, slashMenuItems } from './SlashCommand'
export type { SlashMenuItem } from './SlashCommand'
```

- [ ] **Step 3: Commit**

```bash
git add src/editor/extensions/
git commit -m "feat: slash command extension with menu items"
```

---

## Chunk 2: Phase 1b — Editor UI Components + Feature-Flagged Route

### Task 9: Create EditorToolbar.vue

**Files:**
- Create: `src/components/EditorToolbar.vue`

- [ ] **Step 1: Implement the toolbar**

Create `src/components/EditorToolbar.vue`:

```vue
<script setup lang="ts">
import type { Editor } from '@tiptap/vue-3'

const props = defineProps<{ editor: Editor | null }>()

function isActive(name: string, attrs?: Record<string, unknown>): boolean {
  return props.editor?.isActive(name, attrs) ?? false
}

function run(fn: () => boolean | void) {
  if (props.editor) fn()
}
</script>

<template>
  <div v-if="editor" class="flex items-center gap-1 px-4 py-2 border-b bg-white flex-wrap">
    <!-- Text formatting -->
    <button
      class="toolbar-btn"
      :class="{ active: isActive('bold') }"
      @click="run(() => editor!.chain().focus().toggleBold().run())"
      title="加粗"
    >B</button>
    <button
      class="toolbar-btn"
      :class="{ active: isActive('italic') }"
      @click="run(() => editor!.chain().focus().toggleItalic().run())"
      title="斜体"
    >I</button>

    <span class="w-px h-5 bg-gray-300 mx-1" />

    <!-- Headings -->
    <button
      v-for="level in [1, 2, 3]"
      :key="level"
      class="toolbar-btn text-xs"
      :class="{ active: isActive('manifoldHeading', { level }) }"
      @click="run(() => editor!.chain().focus().toggleNode('manifoldHeading', 'manifoldParagraph', { level }).run())"
    >H{{ level }}</button>

    <span class="w-px h-5 bg-gray-300 mx-1" />

    <!-- Lists -->
    <button
      class="toolbar-btn"
      :class="{ active: isActive('bulletList') }"
      @click="run(() => editor!.chain().focus().toggleBulletList().run())"
    >UL</button>
    <button
      class="toolbar-btn"
      :class="{ active: isActive('orderedList') }"
      @click="run(() => editor!.chain().focus().toggleOrderedList().run())"
    >OL</button>

    <span class="w-px h-5 bg-gray-300 mx-1" />

    <!-- Undo/Redo -->
    <button class="toolbar-btn" @click="run(() => editor!.chain().focus().undo().run())" title="撤销">
      &#x21A9;
    </button>
    <button class="toolbar-btn" @click="run(() => editor!.chain().focus().redo().run())" title="重做">
      &#x21AA;
    </button>

    <!-- Spacer -->
    <div class="flex-1" />

    <!-- Brand -->
    <span class="text-xs text-gray-400 select-none">Manifold Editor</span>
  </div>
</template>

<style scoped>
.toolbar-btn {
  @apply w-8 h-8 rounded flex items-center justify-center text-sm text-gray-600
         hover:bg-gray-100 transition-colors cursor-pointer select-none;
}
.toolbar-btn.active {
  @apply bg-blue-100 text-blue-700;
}
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/EditorToolbar.vue
git commit -m "feat: EditorToolbar component"
```

---

### Task 10: Create EditorSidebar.vue

**Files:**
- Create: `src/components/EditorSidebar.vue`

- [ ] **Step 1: Implement 3-tab sidebar**

Create `src/components/EditorSidebar.vue`:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import StyleSelector from './StyleSelector.vue'
import SvgTemplatePanel from './SvgTemplatePanel.vue'
import ImageManagerTab from './ImageManagerTab.vue'

const emit = defineEmits<{
  (e: 'insert-svg', tpl: { id: string; name: string; svg: string }): void
}>()

const activeTab = ref<'styles' | 'svg' | 'images'>('styles')
const collapsed = ref(false)

function switchToSvg() {
  activeTab.value = 'svg'
  collapsed.value = false
}

defineExpose({ activeTab, collapsed, switchToSvg })
</script>

<template>
  <div
    class="h-full border-r bg-white transition-all duration-200 flex flex-col"
    :class="collapsed ? 'w-12' : 'w-72'"
  >
    <!-- Collapse toggle -->
    <button
      class="self-end p-1 m-1 text-gray-400 hover:text-gray-600"
      @click="collapsed = !collapsed"
    >
      {{ collapsed ? '>' : '<' }}
    </button>

    <template v-if="!collapsed">
      <!-- Tab buttons -->
      <div class="flex border-b px-2">
        <button
          v-for="tab in [
            { key: 'styles', label: '样式' },
            { key: 'svg', label: 'SVG' },
            { key: 'images', label: '图片' }
          ]"
          :key="tab.key"
          class="flex-1 py-2 text-sm text-center transition-colors"
          :class="activeTab === tab.key ? 'text-blue-600 border-b-2 border-blue-600 font-medium' : 'text-gray-500 hover:text-gray-700'"
          @click="activeTab = tab.key as typeof activeTab"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- Tab content -->
      <div class="flex-1 overflow-hidden">
        <StyleSelector v-show="activeTab === 'styles'" />
        <SvgTemplatePanel v-show="activeTab === 'svg'" @insert-svg="emit('insert-svg', $event)" />
        <ImageManagerTab v-show="activeTab === 'images'" />
      </div>
    </template>
  </div>
</template>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/EditorSidebar.vue
git commit -m "feat: EditorSidebar with 3-tab layout"
```

---

### Task 11: Create ImageManagerTab.vue (Stub)

**Files:**
- Create: `src/components/ImageManagerTab.vue`

- [ ] **Step 1: Create stub component (full implementation in Phase 2)**

Create `src/components/ImageManagerTab.vue`:

```vue
<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useAppStore } from '../stores/appStore'

const appStore = useAppStore()
const { wechatImages } = storeToRefs(appStore)

const imageCount = computed(() => wechatImages.value.length)
</script>

<template>
  <div class="h-full flex flex-col p-4">
    <h3 class="text-sm font-medium text-gray-700 mb-3">图片管理</h3>

    <div v-if="imageCount === 0" class="flex-1 flex items-center justify-center text-gray-400 text-sm">
      <div class="text-center">
        <p>暂无图片</p>
        <p class="text-xs mt-1">上传图片或从微信素材库选择</p>
      </div>
    </div>

    <div v-else class="flex-1 overflow-y-auto">
      <div class="grid grid-cols-2 gap-2">
        <div
          v-for="img in wechatImages"
          :key="img.id"
          class="aspect-square rounded border overflow-hidden cursor-pointer hover:border-blue-400 transition-colors"
        >
          <img
            :src="img.proxyUrl || img.localPreviewUrl || img.url"
            :alt="img.name"
            class="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  </div>
</template>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ImageManagerTab.vue
git commit -m "feat: ImageManagerTab stub component"
```

---

### Task 12: Create ImageSlotPopover.vue (Stub)

**Files:**
- Create: `src/components/ImageSlotPopover.vue`

- [ ] **Step 1: Create the image slot popover**

Create `src/components/ImageSlotPopover.vue`:

```vue
<script setup lang="ts">
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useAppStore } from '../stores/appStore'
import type { ImageSlotData } from '@/types/editor'

const props = defineProps<{
  visible: boolean
  position: { x: number; y: number }
  slotId: string
  currentData: ImageSlotData | null
}>()

const emit = defineEmits<{
  (e: 'select', data: ImageSlotData): void
  (e: 'close'): void
}>()

const appStore = useAppStore()
const { wechatImages } = storeToRefs(appStore)

const uploadInput = ref<HTMLInputElement | null>(null)

function selectFromLibrary(img: { url: string; mediaId: string; name: string }) {
  emit('select', { url: img.proxyUrl || img.url, mediaId: img.mediaId, name: img.name })
}

function triggerUpload() {
  uploadInput.value?.click()
}

async function handleFileUpload(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  // Create local preview URL for immediate display
  const localUrl = URL.createObjectURL(file)
  emit('select', { url: localUrl, name: file.name })

  // TODO Phase 2: trigger actual WeChat upload and update mediaId
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="visible"
      class="fixed inset-0 z-50"
      @click.self="emit('close')"
    >
      <div
        class="absolute bg-white rounded-lg shadow-xl border p-3 w-72"
        :style="{ left: position.x + 'px', top: position.y + 'px', transform: 'translateX(-50%)' }"
      >
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-medium text-gray-700">选择图片</span>
          <button class="text-gray-400 hover:text-gray-600 text-xs" @click="emit('close')">x</button>
        </div>

        <!-- Upload button -->
        <button
          class="w-full py-2 mb-2 border-2 border-dashed border-gray-300 rounded text-sm text-gray-500 hover:border-blue-400 hover:text-blue-500 transition-colors"
          @click="triggerUpload"
        >
          + 上传本地图片
        </button>
        <input ref="uploadInput" type="file" accept="image/*" class="hidden" @change="handleFileUpload" />

        <!-- WeChat image library -->
        <div v-if="wechatImages.length" class="max-h-48 overflow-y-auto">
          <p class="text-xs text-gray-400 mb-1">素材库</p>
          <div class="grid grid-cols-3 gap-1">
            <div
              v-for="img in wechatImages"
              :key="img.id"
              class="aspect-square rounded overflow-hidden cursor-pointer border hover:border-blue-400 transition-colors"
              @click="selectFromLibrary(img)"
            >
              <img :src="img.proxyUrl || img.localPreviewUrl || img.url" class="w-full h-full object-cover" />
            </div>
          </div>
        </div>

        <div v-else class="text-center py-3 text-xs text-gray-400">
          暂无素材库图片
        </div>
      </div>
    </div>
  </Teleport>
</template>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ImageSlotPopover.vue
git commit -m "feat: ImageSlotPopover component"
```

---

### Task 13: Create Step2Editor.vue

**Files:**
- Create: `src/views/Step2Editor.vue`

- [ ] **Step 1: Implement the main editor view**

Create `src/views/Step2Editor.vue`:

```vue
<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, provide } from 'vue'
import { useRouter } from 'vue-router'
import { EditorContent } from '@tiptap/vue-3'
import { storeToRefs } from 'pinia'
import { useAppStore } from '../stores/appStore'
import { createManifoldEditor } from '../editor/core/createEditor'
import EditorToolbar from '../components/EditorToolbar.vue'
import EditorSidebar from '../components/EditorSidebar.vue'
import ImageSlotPopover from '../components/ImageSlotPopover.vue'
import type { Editor } from '@tiptap/vue-3'
import type { EditorDocument, ImageSlotData } from '@/types/editor'

const router = useRouter()
const appStore = useAppStore()
const { contentBlocks, styleConfig } = storeToRefs(appStore)

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

/** Insert SVG template at current cursor position */
function insertSvgTemplate(tpl: { id: string; name: string; svg: string; imageSlots?: any[] }) {
  if (!editor.value) return

  // Build initial imageSlots map from template definition
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

/** Handle image slot selection from popover */
function handleSlotImageSelect(data: ImageSlotData) {
  if (!editor.value || popoverNodePos.value === null) return

  // Find the SVG node and update its imageSlots
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

/** Listen for SVG block image slot clicks (bubbled from SvgBlockView) */
function handleCanvasClick(event: MouseEvent) {
  // Check if click was on an image slot within an SVG block
  const slotEl = (event.target as Element).closest?.('[data-image-slot]')
  if (!slotEl) return

  const slotId = slotEl.getAttribute('data-image-slot')
  if (!slotId) return

  // Find the parent SVG block node
  const svgBlockEl = slotEl.closest('[data-node-type="manifold-svg-block"]')
  if (!svgBlockEl) return

  const rect = slotEl.getBoundingClientRect()
  popoverSlotId.value = slotId
  popoverPosition.value = { x: rect.left + rect.width / 2, y: rect.bottom + 8 }
  popoverVisible.value = true

  // Find node position in tiptap document
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

// Listen for slash command events
function handleOpenSvgPanel() {
  sidebarRef.value?.switchToSvg()
}

onMounted(() => {
  // Create editor with initial content (convert from contentBlocks if available)
  const initialContent: EditorDocument = appStore.editorJson || {
    type: 'doc',
    content: [
      { type: 'manifoldHeading', attrs: { level: 1 }, content: [{ type: 'text', text: '输入标题' }] },
      { type: 'manifoldParagraph', content: [{ type: 'text', text: '' }] },
    ]
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
    <!-- Toolbar -->
    <EditorToolbar :editor="editor" />

    <div class="flex flex-1 overflow-hidden">
      <!-- Sidebar -->
      <EditorSidebar ref="sidebarRef" @insert-svg="insertSvgTemplate" />

      <!-- Canvas -->
      <div class="flex-1 overflow-y-auto" @click="handleCanvasClick">
        <div class="max-w-[680px] mx-auto py-8 px-6 bg-white min-h-full shadow-sm my-4 rounded">
          <EditorContent v-if="editor" :editor="editor" class="manifold-editor-content" />
        </div>
      </div>
    </div>

    <!-- Bottom bar -->
    <div class="flex-shrink-0 border-t bg-white px-6 py-3 flex items-center justify-between">
      <span class="text-xs text-gray-400">Manifold SVG Editor v2</span>
      <button
        class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
        @click="goToPublish"
      >
        下一步: 发布确认
      </button>
    </div>

    <!-- Image Slot Popover -->
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
  @apply text-2xl font-bold mb-4;
}
.manifold-editor-content .ProseMirror h2 {
  @apply text-xl font-bold mb-3;
}
.manifold-editor-content .ProseMirror h3 {
  @apply text-lg font-semibold mb-2;
}
.manifold-editor-content .ProseMirror p {
  @apply mb-3 leading-relaxed;
}
.manifold-editor-content .ProseMirror .is-empty::before {
  @apply text-gray-300;
  content: attr(data-placeholder);
  float: left;
  height: 0;
  pointer-events: none;
}
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/views/Step2Editor.vue
git commit -m "feat: Step2Editor WYSIWYG view with tiptap"
```

---

### Task 14: Update AppStore for Editor JSON

**Files:**
- Modify: `src/stores/appStore.ts`

- [ ] **Step 1: Add editorJson and imageSlotRegistry to appStore**

In `src/stores/appStore.ts`, after the existing state declarations (around line 16), add:

```typescript
const editorJson: Ref<any> = ref(null)
const imageSlotRegistry: Ref<Record<string, any>> = ref({})
```

At the end of the return statement (around line 290), add these to the returned object:

```typescript
editorJson,
imageSlotRegistry,
```

- [ ] **Step 2: Commit**

```bash
git add src/stores/appStore.ts
git commit -m "feat: add editorJson and imageSlotRegistry to appStore"
```

---

### Task 15: Add Feature-Flagged Route

**Files:**
- Modify: `src/router/index.ts`

- [ ] **Step 1: Add v2 editor route**

In `src/router/index.ts`, after the existing Step2 route (around line 20), add:

```typescript
{
  path: '/step2v2',
  name: 'Step2v2',
  component: () => import('../views/Step2Editor.vue'),
  meta: { title: 'Manifold Editor' }
},
```

- [ ] **Step 2: Update Step2 route guard to support editorJson**

In the routeGuards object (around line 182), update the `/step2` guard:

```typescript
'/step2': {
  validator: (appStore) => Boolean(appStore.rawText) || Boolean(appStore.contentBlocks?.length) || Boolean(appStore.editorJson),
  redirect: '/step1',
  description: 'step2需要文本内容或内容块'
},
'/step2v2': {
  validator: (appStore) => Boolean(appStore.rawText) || Boolean(appStore.contentBlocks?.length) || Boolean(appStore.editorJson),
  redirect: '/step1',
  description: 'step2v2需要文本内容或内容块'
},
```

- [ ] **Step 3: Verify route works**

```bash
# Start dev server, navigate to localhost:1921/step2v2
# Should show the new Manifold editor (or redirect to step1 if no content)
```

- [ ] **Step 4: Commit**

```bash
git add src/router/index.ts
git commit -m "feat: add feature-flagged /step2v2 route for Manifold editor"
```

---

### Task 16: Build + Verify Phase 1

- [ ] **Step 1: Run Vite build to check for compilation errors**

```bash
cd /home/node/.../tmp/1921editor/src
npx vite build --outDir /tmp/1921editor-dist-p1
```

Expected: Build succeeds with 0 errors. May have chunk size warnings (expected).

- [ ] **Step 2: Commit all Phase 1 work**

```bash
git add -A
git commit -m "feat: Phase 1 complete — tiptap WYSIWYG editor with feature flag

Manifold SVG Editor Phase 1:
- tiptap editor core with custom nodes (Heading, Paragraph, Image, SvgBlock)
- SvgBlockView NodeView with image slot click detection
- EditorToolbar, EditorSidebar (3-tab), ImageSlotPopover
- Step2Editor.vue as WYSIWYG editing view
- Feature-flagged route at /step2v2
- Slash command extension (/title, /image, /svg, /divider)"
```

- [ ] **Step 3: Push to main**

```bash
git push origin main
```

---

## Chunk 3: Phase 2 — SVG Image-Driven Templates + Registry

### Task 17: Create svgTemplatesImageDriven.js — Categories 1-3

**Files:**
- Create: `src/styles/svgTemplatesImageDriven.js`

- [ ] **Step 1: Create file with first 3 categories (18 templates)**

Create `src/styles/svgTemplatesImageDriven.js` with categories:
1. **click_expand_image** (6 templates) — 点击展开大图
2. **tab_switch_image** (6 templates) — 标签页切换图片
3. **before_after_image** (6 templates) — 前后对比滑块

Each template MUST include:
- `imageSlots` array defining slot dimensions and labels
- `data-image-slot` attributes on `<image>` elements in the SVG
- `href="placeholder"` for unfilled slots
- `source: 'manifold'` metadata
- SMIL `<set>` / `<animate>` for interactivity (WeChat-compatible, no JS)

Template structure:

```javascript
export const SVG_CLICK_EXPAND_IMAGE = [
  {
    id: 'click_expand_single_v',
    name: '单图竖展开',
    category: 'click_expand_image',
    tags: ['展开', '图片', '点击', 'GQ风格'],
    colorScheme: '#1a1a2e',
    interactive: true,
    interactionType: 'click_expand_image',
    source: 'manifold',
    imageSlots: [
      { id: 'main_image', label: '主图', width: 600, height: 400 }
    ],
    svg: `<svg viewBox="0 0 600 500" xmlns="http://www.w3.org/2000/svg">
      <!-- Manifold SVG Engine -->
      <!-- Collapsed state: title bar -->
      <rect id="ce1_trigger" x="0" y="0" width="600" height="80" fill="#1a1a2e" rx="8"/>
      <text x="300" y="48" text-anchor="middle" fill="#e0e0e0" font-size="18">点击展开查看</text>
      <!-- Expandable image area (initially hidden) -->
      <g id="ce1_content" opacity="0">
        <image data-image-slot="main_image" x="0" y="90" width="600" height="400"
               href="placeholder" preserveAspectRatio="xMidYMid slice"/>
        <animate attributeName="opacity" from="0" to="1" dur="0.4s" fill="freeze"
                 begin="ce1_trigger.click"/>
      </g>
      <!-- Height animation for container -->
      <animate attributeName="viewBox" from="0 0 600 80" to="0 0 600 500"
               dur="0.4s" fill="freeze" begin="ce1_trigger.click"/>
    </svg>`
  },
  // ... 5 more variants
]
```

Use AI Gateway (Gemini Flash or Claude Sonnet) to help generate the 6 SVG variants per category, ensuring all use `data-image-slot` attributes and SMIL-only animations.

- [ ] **Step 2: Commit**

```bash
git add src/styles/svgTemplatesImageDriven.js
git commit -m "feat: image-driven SVG templates categories 1-3 (18 templates)"
```

---

### Task 18: Add Categories 4-6 to svgTemplatesImageDriven.js

**Files:**
- Modify: `src/styles/svgTemplatesImageDriven.js`

- [ ] **Step 1: Append categories 4-6 (18 more templates)**

4. **image_sequence** (6 templates) — 多图序列翻页
5. **grid_zoom_image** (6 templates) — 网格点击放大
6. **card_flip_image** (6 templates) — 卡牌翻转揭秘

Same structure as Task 17. Each template must have `imageSlots`, `data-image-slot`, and SMIL animations.

- [ ] **Step 2: Commit**

```bash
git add src/styles/svgTemplatesImageDriven.js
git commit -m "feat: image-driven SVG templates categories 4-6 (36 total)"
```

---

### Task 19: Register Image-Driven Templates in Registry

**Files:**
- Modify: `src/styles/svgTemplates.js`
- Modify: `src/components/SvgTemplatePanel.vue`

- [ ] **Step 1: Update svgTemplates.js header comment (61 → 67 categories)**

Add after the `=== 2025 SOTA 交互 (Ultra) ===` section:

```javascript
 * === 图片交互模板 (Manifold Image-Driven) ===
 * 62. click_expand_image  - 点击展开大图
 * 63. tab_switch_image    - 标签页切换图片
 * 64. before_after_image  - 前后对比滑块
 * 65. image_sequence      - 多图序列翻页
 * 66. grid_zoom_image     - 网格点击放大
 * 67. card_flip_image     - 卡牌翻转揭秘
```

- [ ] **Step 2: Add import block**

After the `svgTemplatesUltra` import:

```javascript
import {
  SVG_CLICK_EXPAND_IMAGE,
  SVG_TAB_SWITCH_IMAGE,
  SVG_BEFORE_AFTER_IMAGE,
  SVG_IMAGE_SEQUENCE,
  SVG_GRID_ZOOM_IMAGE,
  SVG_CARD_FLIP_IMAGE
} from './svgTemplatesImageDriven'
```

- [ ] **Step 3: Add 6 entries to SVG_TEMPLATE_CATEGORIES**

After the Ultra entries:

```javascript
  // Manifold 图片交互模板
  { id: 'click_expand_image', name: '点击展开大图', icon: '🖼', data: SVG_CLICK_EXPAND_IMAGE, interactive: true },
  { id: 'tab_switch_image', name: '标签切换图片', icon: '🏷', data: SVG_TAB_SWITCH_IMAGE, interactive: true },
  { id: 'before_after_image', name: '前后对比', icon: '🔀', data: SVG_BEFORE_AFTER_IMAGE, interactive: true },
  { id: 'image_sequence', name: '序列翻页', icon: '📖', data: SVG_IMAGE_SEQUENCE, interactive: true },
  { id: 'grid_zoom_image', name: '网格放大', icon: '🔍', data: SVG_GRID_ZOOM_IMAGE, interactive: true },
  { id: 'card_flip_image', name: '卡牌翻转', icon: '🃏', data: SVG_CARD_FLIP_IMAGE, interactive: true },
```

- [ ] **Step 4: Add 6 arrays to getAllSvgTemplates()**

```javascript
    // Manifold 图片交互模板
    ...SVG_CLICK_EXPAND_IMAGE,
    ...SVG_TAB_SWITCH_IMAGE,
    ...SVG_BEFORE_AFTER_IMAGE,
    ...SVG_IMAGE_SEQUENCE,
    ...SVG_GRID_ZOOM_IMAGE,
    ...SVG_CARD_FLIP_IMAGE
```

- [ ] **Step 5: Update SvgTemplatePanel.vue — add 6th tier**

In `SvgTemplatePanel.vue`, add after `ultraIds`:

```javascript
const imageDrivenIds = ['click_expand_image', 'tab_switch_image', 'before_after_image', 'image_sequence', 'grid_zoom_image', 'card_flip_image']
```

Add to the return array:

```javascript
{ label: 'Manifold 图片交互', items: imageDrivenIds.map(id => categories.find(c => c.id === id)).filter(Boolean) }
```

Update `tallCategories` Set:

```javascript
'click_expand_image', 'tab_switch_image', 'before_after_image',
'image_sequence', 'grid_zoom_image', 'card_flip_image'
```

Update `getInteractionLabel`:

```javascript
'click_expand_image': '展开', 'tab_switch_image': '切换',
'before_after_image': '对比', 'image_sequence': '翻页',
'grid_zoom_image': '放大', 'card_flip_image': '翻转'
```

- [ ] **Step 6: Build and verify**

```bash
npx vite build --outDir /tmp/1921editor-dist-p2
```

- [ ] **Step 7: Commit and push**

```bash
git add src/styles/svgTemplates.js src/styles/svgTemplatesImageDriven.js src/components/SvgTemplatePanel.vue
git commit -m "feat: Phase 2 complete — 6 image-driven SVG categories registered (67 total)"
git push origin main
```

---

## Chunk 4: Phase 3-6 — Serializers, Step3Confirm, Switch, Cleanup

### Task 20: Create HTML Serializer

**Files:**
- Create: `src/editor/serializers/htmlSerializer.ts`

- [ ] **Step 1: Implement tiptap JSON to WeChat HTML serializer**

Create `src/editor/serializers/htmlSerializer.ts`:

```typescript
import DOMPurify from 'dompurify'
import { useConfigStore } from '@/stores/configStore'
import { useAppStore } from '@/stores/appStore'
import { getSvgTemplateById } from '@/styles/svgTemplates'
import type { EditorDocument, ImageSlotData } from '@/types/editor'

/**
 * Serialize tiptap JSON document to WeChat-compatible HTML.
 * Replaces SVG image slot placeholders with actual URLs.
 */
export function serializeToWechatHtml(doc: EditorDocument): string {
  const parts: string[] = []

  // Add header
  const configStore = useConfigStore()
  parts.push(configStore.currentHeader)

  // Process each node
  if (doc.content) {
    for (const node of doc.content) {
      parts.push(serializeNode(node))
    }
  }

  // Add footer
  const appStore = useAppStore()
  let footer = configStore.currentFooter
  footer = footer
    .replace(/\{\{PLANNERS\}\}/g, appStore.plannerNames.join(' ') || ' ')
    .replace(/\{\{COPYWRITERS\}\}/g, appStore.copywriterNames.join(' ') || ' ')
    .replace(/\{\{EDITORS\}\}/g, appStore.editorNames.join(' ') || ' ')
    .replace(/\{\{TEAM_NAME\}\}/g, appStore.teamName || '')
    .replace(/\{\{SOURCE_ACCOUNT\}\}/g, appStore.sourceAccount || '')
    .replace(/\{\{EDITOR_INPUT\}\}/g, appStore.editorInput || ' ')
  parts.push(footer)

  return parts.join('\n')
}

function serializeNode(node: any): string {
  switch (node.type) {
    case 'manifoldHeading':
      return serializeHeading(node)
    case 'manifoldParagraph':
      return serializeParagraph(node)
    case 'manifoldImage':
      return serializeImage(node)
    case 'manifoldSvgBlock':
      return serializeSvgBlock(node)
    case 'horizontalRule':
      return '<hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;" />'
    case 'bulletList':
    case 'orderedList':
      return serializeList(node)
    case 'listItem':
      return `<li>${serializeInlineContent(node)}</li>`
    default:
      return serializeInlineContent(node)
  }
}

function serializeHeading(node: any): string {
  const level = node.attrs?.level || 1
  const text = serializeInlineContent(node)
  // TODO: Apply styleConfig based on attrs.styleId
  return `<h${level}>${text}</h${level}>`
}

function serializeParagraph(node: any): string {
  const text = serializeInlineContent(node)
  // TODO: Apply styleConfig based on attrs.styleId and blockRole
  return `<p>${text}</p>`
}

function serializeImage(node: any): string {
  const src = node.attrs?.src || ''
  const caption = node.attrs?.caption || ''
  const sanitizedSrc = DOMPurify.sanitize(src)
  let html = `<section style="margin: 15px 0; text-align: center;"><img src="${sanitizedSrc}" style="max-width: 100%;" /></section>`
  if (caption) {
    html = `<section style="margin: 15px 0; text-align: center;"><img src="${sanitizedSrc}" style="max-width: 100%;" /><p style="font-size: 12px; color: #999; margin-top: 5px;">${DOMPurify.sanitize(caption)}</p></section>`
  }
  return html
}

function serializeSvgBlock(node: any): string {
  const templateId = node.attrs?.templateId
  const imageSlots = node.attrs?.imageSlots || {}
  let svgContent = node.attrs?.svgContent || ''

  // If svgContent is empty, try to load from template registry
  if (!svgContent && templateId) {
    const tpl = getSvgTemplateById(templateId)
    if (tpl) svgContent = tpl.svg
  }

  // Replace image slot placeholders with actual URLs
  for (const [slotId, data] of Object.entries(imageSlots)) {
    const slotData = data as ImageSlotData | null
    if (slotData?.url) {
      const regex = new RegExp(`(data-image-slot="${slotId}"[^>]*?)href="[^"]*"`, 'g')
      svgContent = svgContent.replace(regex, `$1href="${slotData.url}"`)
    }
  }

  return `<section class="_135editor" data-role="svg-decoration" style="margin: 15px 0; text-align: center;"><!-- Manifold SVG Engine -->${svgContent}</section>`
}

function serializeList(node: any): string {
  const tag = node.type === 'bulletList' ? 'ul' : 'ol'
  const items = (node.content || []).map((item: any) => serializeNode(item)).join('')
  return `<${tag}>${items}</${tag}>`
}

function serializeInlineContent(node: any): string {
  if (!node.content) return ''
  return node.content.map((child: any) => {
    if (child.type === 'text') {
      let text = DOMPurify.sanitize(child.text || '')
      if (child.marks) {
        for (const mark of child.marks) {
          if (mark.type === 'bold') text = `<strong>${text}</strong>`
          if (mark.type === 'italic') text = `<em>${text}</em>`
        }
      }
      return text
    }
    return ''
  }).join('')
}
```

- [ ] **Step 2: Commit**

```bash
git add src/editor/serializers/htmlSerializer.ts
git commit -m "feat: tiptap JSON to WeChat HTML serializer"
```

---

### Task 21: Create JSON Importer (contentBlocks → tiptap)

**Files:**
- Create: `src/editor/serializers/jsonImporter.ts`

- [ ] **Step 1: Implement contentBlocks to tiptap JSON converter**

Create `src/editor/serializers/jsonImporter.ts`:

```typescript
import type { ContentBlock } from '@/types'
import type { EditorDocument } from '@/types/editor'

/**
 * Convert legacy contentBlocks array to tiptap JSON document.
 * Used for backward compatibility during migration.
 */
export function contentBlocksToTiptap(blocks: ContentBlock[]): EditorDocument {
  const content: any[] = []

  for (const block of blocks) {
    switch (block.type) {
      case 'title':
        content.push({
          type: 'manifoldHeading',
          attrs: { level: 1 },
          content: block.text ? [{ type: 'text', text: block.text }] : [],
        })
        break

      case 'body':
        content.push({
          type: 'manifoldParagraph',
          attrs: { blockRole: 'body' },
          content: block.text ? [{ type: 'text', text: block.text }] : [],
        })
        break

      case 'intro':
        content.push({
          type: 'manifoldParagraph',
          attrs: { blockRole: 'intro' },
          content: block.text ? [{ type: 'text', text: block.text }] : [],
        })
        break

      case 'outro':
        content.push({
          type: 'manifoldParagraph',
          attrs: { blockRole: 'outro' },
          content: block.text ? [{ type: 'text', text: block.text }] : [],
        })
        break

      case 'image_single':
      case 'image_single_caption':
      case 'image_double':
      case 'image_double_caption':
        content.push({
          type: 'manifoldImage',
          attrs: {
            src: (block.meta?.aiImageUrl as string) || '',
            caption: block.text || '',
            layout: 'full_width',
          },
        })
        break

      case 'svg_decoration':
        content.push({
          type: 'manifoldSvgBlock',
          attrs: {
            templateId: (block.meta?.svgTemplateId as string) || '',
            source: 'manifold',
            svgContent: (block.meta?.svgContent as string) || '',
            imageSlots: {},
            config: {},
          },
        })
        break

      default:
        content.push({
          type: 'manifoldParagraph',
          attrs: { blockRole: 'body' },
          content: block.text ? [{ type: 'text', text: block.text }] : [],
        })
    }
  }

  // Ensure doc has at least one node
  if (content.length === 0) {
    content.push({
      type: 'manifoldParagraph',
      content: [{ type: 'text', text: '' }],
    })
  }

  return { type: 'doc', content }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/editor/serializers/jsonImporter.ts
git commit -m "feat: contentBlocks to tiptap JSON importer"
```

---

### Task 22: Create ManifoldEditorAPI Stub

**Files:**
- Create: `src/editor/api/ManifoldEditorAPI.ts`

- [ ] **Step 1: Create API stub for future CLI Agent integration**

Create `src/editor/api/ManifoldEditorAPI.ts`:

```typescript
import type { Editor } from '@tiptap/vue-3'
import type { EditorDocument, ImageSlotData } from '@/types/editor'

/**
 * Manifold Editor API — programmatic interface for agent/CLI operations.
 * Stub implementation for Phase 1. Full implementation in Phase 7+.
 */
export class ManifoldEditorAPI {
  private editor: Editor | null = null

  attach(editor: Editor) {
    this.editor = editor
  }

  detach() {
    this.editor = null
  }

  getDocument(): EditorDocument | null {
    return this.editor?.getJSON() as EditorDocument ?? null
  }

  insertSvgTemplate(templateId: string, svgContent: string, imageSlots: Record<string, null> = {}) {
    this.editor?.chain().focus().insertContent({
      type: 'manifoldSvgBlock',
      attrs: { templateId, source: 'manifold', svgContent, imageSlots, config: {} },
    }).run()
  }

  setImageSlot(nodePos: number, slotId: string, data: ImageSlotData) {
    if (!this.editor) return
    const node = this.editor.state.doc.nodeAt(nodePos)
    if (node?.type.name === 'manifoldSvgBlock') {
      const slots = { ...(node.attrs.imageSlots || {}) }
      slots[slotId] = data
      this.editor.chain().setNodeSelection(nodePos).updateAttributes('manifoldSvgBlock', { imageSlots: slots }).run()
    }
  }
}

/** Singleton instance */
export const manifoldEditorAPI = new ManifoldEditorAPI()
```

- [ ] **Step 2: Commit**

```bash
git add src/editor/api/ManifoldEditorAPI.ts
git commit -m "feat: ManifoldEditorAPI stub for future agent integration"
```

---

### Task 23: Create Step3Confirm.vue

**Files:**
- Create: `src/views/Step3Confirm.vue`

- [ ] **Step 1: Implement lightweight publish confirmation view**

Create `src/views/Step3Confirm.vue`:

```vue
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAppStore } from '../stores/appStore'
import { serializeToWechatHtml } from '../editor/serializers/htmlSerializer'
import type { EditorDocument } from '@/types/editor'

const router = useRouter()
const appStore = useAppStore()
const { editorJson } = storeToRefs(appStore)

const finalHtml = ref('')
const copied = ref(false)

// Article metadata
const articleTitle = ref('')
const articleAuthor = ref('')
const articleSummary = ref('')

onMounted(() => {
  if (editorJson.value) {
    finalHtml.value = serializeToWechatHtml(editorJson.value as EditorDocument)
  }
})

function copyHtml() {
  if (!finalHtml.value) return
  navigator.clipboard.writeText(finalHtml.value).then(() => {
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  })
}

function goBack() {
  router.push('/step2v2')
}
</script>

<template>
  <div class="flex flex-col h-full w-full bg-gray-50">
    <!-- Header -->
    <div class="flex-shrink-0 border-b bg-white px-6 py-3 flex items-center justify-between">
      <button class="text-sm text-gray-500 hover:text-gray-700" @click="goBack">
        ← 返回编辑
      </button>
      <span class="text-sm font-medium text-gray-700">Manifold 发布确认</span>
      <div class="w-20" />
    </div>

    <!-- Content -->
    <div class="flex-1 flex overflow-hidden">
      <!-- Left: Article Config -->
      <div class="w-72 flex-shrink-0 border-r bg-white p-4 overflow-y-auto">
        <h3 class="text-sm font-medium text-gray-700 mb-4">文章配置</h3>

        <label class="block mb-3">
          <span class="text-xs text-gray-500">标题</span>
          <input v-model="articleTitle" type="text" class="mt-1 w-full px-3 py-2 border rounded text-sm" placeholder="文章标题" />
        </label>

        <label class="block mb-3">
          <span class="text-xs text-gray-500">作者</span>
          <input v-model="articleAuthor" type="text" class="mt-1 w-full px-3 py-2 border rounded text-sm" placeholder="作者名称" />
        </label>

        <label class="block mb-3">
          <span class="text-xs text-gray-500">摘要</span>
          <textarea v-model="articleSummary" class="mt-1 w-full px-3 py-2 border rounded text-sm" rows="3" placeholder="文章摘要" />
        </label>

        <hr class="my-4" />

        <button
          class="w-full py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors mb-2"
          @click="copyHtml"
        >
          {{ copied ? '已复制!' : '复制 HTML 代码' }}
        </button>

        <button
          class="w-full py-2 border border-green-600 text-green-700 rounded text-sm hover:bg-green-50 transition-colors"
          disabled
        >
          同步到微信 (即将上线)
        </button>
      </div>

      <!-- Right: Preview -->
      <div class="flex-1 overflow-y-auto p-4">
        <div class="max-w-[680px] mx-auto bg-white shadow-sm rounded p-6">
          <div v-if="finalHtml" v-html="finalHtml" class="wechat-preview" />
          <div v-else class="text-center py-12 text-gray-400">
            没有可预览的内容
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.wechat-preview :deep(img) {
  max-width: 100%;
  height: auto;
}
.wechat-preview :deep(section) {
  margin: 10px 0;
}
</style>
```

- [ ] **Step 2: Add route for Step3 confirm**

In `src/router/index.ts`, add after the Step2v2 route:

```typescript
{
  path: '/step3confirm',
  name: 'Step3Confirm',
  component: () => import('../views/Step3Confirm.vue'),
  meta: { title: 'Manifold 发布确认' }
},
```

Add route guard:

```typescript
'/step3confirm': {
  validator: (appStore) => Boolean(appStore.editorJson),
  redirect: '/step2v2',
  description: 'step3confirm需要编辑器内容'
},
```

- [ ] **Step 3: Commit**

```bash
git add src/views/Step3Confirm.vue src/router/index.ts
git commit -m "feat: Step3Confirm lightweight publish page"
```

---

### Task 24: Phase 3-4 Build + Verify

- [ ] **Step 1: Build**

```bash
npx vite build --outDir /tmp/1921editor-dist-p34
```

Expected: 0 errors.

- [ ] **Step 2: Commit and push**

```bash
git add -A
git commit -m "feat: Phase 3-4 complete — serializers + Step3Confirm

- htmlSerializer: tiptap JSON → WeChat HTML with SVG slot replacement
- jsonImporter: contentBlocks → tiptap JSON migration
- ManifoldEditorAPI: stub for CLI agent integration
- Step3Confirm: lightweight publish confirmation page"

git push origin main
```

---

### Task 25: Phase 5 — Switch Default Routes

**Files:**
- Modify: `src/router/index.ts`
- Modify: `src/views/Step2Editor.vue` (update Step3 navigation)

- [ ] **Step 1: Update Step2Editor to navigate to step3confirm**

In `src/views/Step2Editor.vue`, update the `goToPublish` function:

```typescript
function goToPublish() {
  router.push('/step3confirm')
}
```

- [ ] **Step 2: Update Step1TextInput to offer v2 editor option**

In the Step1 text input view, update the "next step" navigation to go to `/step2v2` when editorJson is the target:

In `src/router/index.ts`, update the `/step2` route to point to the new editor:

```typescript
{ path: '/step2', name: 'Step2', component: () => import('../views/Step2Editor.vue') },
```

Keep old routes as fallback:

```typescript
{ path: '/step2-legacy', name: 'Step2Legacy', component: () => import('../views/Step2Curtain.vue') },
{ path: '/step3-legacy', name: 'Step3Legacy', component: () => import('../views/Step3Preview.vue') },
```

- [ ] **Step 3: Update Step2 route guard**

```typescript
'/step2': {
  validator: (appStore) => Boolean(appStore.rawText) || Boolean(appStore.contentBlocks?.length) || Boolean(appStore.editorJson),
  redirect: '/step1',
  description: 'step2需要文本内容或内容块'
},
```

- [ ] **Step 4: Build and verify**

```bash
npx vite build --outDir /tmp/1921editor-dist-p5
```

- [ ] **Step 5: Commit and push**

```bash
git add src/router/index.ts src/views/Step2Editor.vue
git commit -m "feat: Phase 5 — switch default /step2 to Manifold editor, legacy routes preserved"
git push origin main
```

---

### Task 26: Phase 6 — Cleanup (Optional, after validation)

**Note:** Only execute this task AFTER the new editor has been validated in production.

- [ ] **Step 1: Remove legacy route definitions**

Remove `/step2-legacy` and `/step3-legacy` routes and their guards.

- [ ] **Step 2: Remove old view files**

Delete `src/views/Step2Curtain.vue` and `src/views/Step3Preview.vue`.
Delete `src/views/Step2Editor.vue` `/step2v2` route (now redundant).

- [ ] **Step 3: Remove deprecated appStore fields**

Remove `contentBlocks` from appStore.ts (after confirming zero usage).

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: Phase 6 — remove legacy Step2Curtain and Step3Preview"
git push origin main
```

---

## Execution Summary

| Phase | Tasks | Key Deliverables |
|-------|-------|------------------|
| 0 | 1-2 | tiptap deps + type definitions |
| 1a | 3-8 | Editor core, 4 custom nodes, slash commands |
| 1b | 9-16 | UI components, Step2Editor, route, build verify |
| 2 | 17-19 | 36 image-driven SVG templates, registry update |
| 3 | 20-22 | HTML serializer, JSON importer, API stub |
| 4 | 23-24 | Step3Confirm, build verify |
| 5 | 25 | Switch default routes |
| 6 | 26 | Cleanup (deferred) |

**Total new files:** ~20
**Total modified files:** ~6
**Estimated commits:** 18-20
