# Manifold SVG Editor — Design Spec

**Date:** 2026-03-20
**Status:** Approved
**Brand:** Manifold

## Overview

Replace the current Step2 (block-based curtain editor) + Step3 (preview/image replacement) with a unified WYSIWYG editor powered by tiptap (ProseMirror). Add SVG image slot editing capabilities, enabling GQ Lab-style image-driven interactive layouts.

## Problem Statement

1. Current SVG templates (390 total) are pure decorations — no image insertion capability
2. Image replacement is isolated in Step3, disconnected from the editing flow
3. No WYSIWYG — users can't see final output while editing
4. SVG interactive templates (GQ Lab style) are fundamentally image-driven, but the editor has no way to place images into SVG slots

## Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Editor engine | tiptap (ProseMirror) | Vue 3 native, custom Node support for SVG blocks, slash commands for AI |
| Step flow | Step1 → Step2 WYSIWYG → Step3 Confirm | 135-editor style, edit=preview |
| Image interaction | Canvas click popover + sidebar tab | Quick ops on canvas, batch management in sidebar |
| Image source | Local upload + WeChat material library | Upload auto-syncs to WeChat for publishing |
| Existing templates | Keep 390 as-is (61 categories, 5 files) | They serve as pure decorations, still useful |
| New templates | 6 categories, 36 image-driven templates | GQ Lab-style image interactions |
| Data model | tiptap JSON document | Replaces contentBlocks array |
| AI-native | Slash commands + ManifoldEditorAPI | Future CLI Agent and AI operations |

## Architecture

### 1. Editor Engine — tiptap

Based on ProseMirror. Chosen for:
- Vue 3 native integration
- Custom Node types (critical for `ManifoldSvgBlock`)
- Built-in drag-and-drop, slash commands, undo/redo
- Extensible for future AI features
- Same architecture family as 135 Editor, Feishu Docs

### 2. Component Architecture

```
Step2Editor.vue (replaces Step2Curtain.vue)
│
├── EditorToolbar.vue         — Top toolbar (bold/italic/align/font/undo)
│
├── EditorSidebar.vue         — Left sidebar (3 tabs)
│   ├── StyleTab.vue            Decoration styles (reuse existing)
│   ├── SvgTemplateTab.vue      SVG template library (reuse SvgTemplatePanel)
│   └── ImageManagerTab.vue     Image management (NEW)
│       ├── Upload area
│       ├── WeChat material library list
│       └── Current article images + slot management
│
├── EditorCanvas.vue          — Core editing canvas (tiptap instance)
│   ├── ManifoldHeading        — Heading node (h1-h3)
│   ├── ManifoldParagraph      — Body text node
│   ├── ManifoldImage          — Standard image node
│   └── ManifoldSvgBlock       — SVG interactive node (CORE)
│       ├── Renders real SVG + image slots
│       ├── Click slot → ImageSlotPopover
│       └── Selection shows SVG config overlay
│
└── ImageSlotPopover.vue      — Image slot picker popup
    ├── Quick local upload
    ├── Select from material library
    └── Recently used images
```

### 3. Page Layout

```
┌─[EditorToolbar]────────────────────────────────┐
│                                                 │
│  ┌──Sidebar──┐  ┌──────Canvas──────────────┐   │
│  │ Styles    │  │                           │   │
│  │ SVG       │  │  [Heading - WYSIWYG]      │   │
│  │ Images    │  │  [Paragraph...]            │   │
│  │           │  │  [SVG Block + img slots]   │   │
│  │ (collaps) │  │  [More content...]         │   │
│  └───────────┘  └───────────────────────────┘   │
│                                                 │
└─────────────────────────────────────────────────┘
```

Canvas IS the final output. No separate "edit mode" vs "preview mode". Sidebar collapses for full-width preview.

### 4. SVG Image Slot System

#### Template Definition

Each image-driven SVG template declares slots via `imageSlots` array and marks them in SVG with `data-image-slot`:

```javascript
{
  id: 'tab_switch_3img',
  name: '三标签图片切换',
  category: 'image_tab_switch',
  source: 'manifold',
  imageSlots: [
    { id: 'tab1', label: '标签1图片', width: 600, height: 400 },
    { id: 'tab2', label: '标签2图片', width: 600, height: 400 },
    { id: 'tab3', label: '标签3图片', width: 600, height: 400 }
  ],
  svg: `<svg viewBox="0 0 600 900">
    <!-- Manifold SVG Engine -->
    <image data-image-slot="tab1" x="0" y="50" width="600" height="400"
           href="placeholder" visibility="visible">
      <set attributeName="visibility" to="visible" begin="..." />
    </image>
    <image data-image-slot="tab2" ... visibility="hidden">...</image>
    <image data-image-slot="tab3" ... visibility="hidden">...</image>
  </svg>`
}
```

#### Interaction Flow

```
User inserts template → Editor parses imageSlots definition
     ↓
Canvas renders SVG, image slots show as gray placeholders with "+" icon
     ↓
User clicks placeholder → ImageSlotPopover appears at click position
     ↓
User selects image (upload / material library)
     ↓
Image URL written to slot → <image href="placeholder"> replaced with real URL
     ↓
Canvas updates in real-time — image visible within SVG
```

#### Node Data Storage (tiptap attrs)

```javascript
{
  type: 'manifoldSvgBlock',
  attrs: {
    templateId: 'tab_switch_3img',
    source: 'manifold',
    svgContent: '<svg>...</svg>',
    imageSlots: {
      'tab1': { url: 'https://mmbiz...jpg', mediaId: 'wx_abc123' },
      'tab2': { url: 'https://mmbiz...jpg', mediaId: 'wx_def456' },
      'tab3': null  // not yet filled
    },
    config: {
      tabLabels: ['产品', '细节', '场景'],
      colorTheme: '#333333'
    }
  }
}
```

#### Export

On export, `imageSlots` URLs replace corresponding `data-image-slot` hrefs in SVG, producing final WeChat-compatible HTML.

### 5. Image-Driven Template Categories

6 categories, 6 variants each = 36 templates. File: `svgTemplatesImageDriven.js`

#### 5.1 click_expand_image — 点击展开大图

Thumbnail/title bar click expands to full-width image + description.

Variants: single vertical expand, single horizontal expand, sequential multi-image expand, accordion expand, titled expand, fade-in expand.

Slots per variant: 1-4 images.

#### 5.2 tab_switch_image — 标签页切换图片

Tab buttons at top/side, click switches image below.

Variants: horizontal 3-tab, horizontal 4-tab, vertical side tabs, circular icon tabs, gradient tabs, magazine-style tabs (GQ Lab).

Slots per variant: 3-4 images.

#### 5.3 before_after_image — 前后对比滑块

Two images overlaid, slider divider for comparison.

Variants: left-right, top-bottom, circular mask, diagonal, sequential multi-pair, annotated.

Slots per variant: 2 images (before/after).

#### 5.4 image_sequence — 多图序列翻页

Click to flip through images like an album.

Variants: left-right flip, top-bottom flip, fade transition, card stack flip, film reel scroll, 3D rotation.

Slots per variant: 4-6 images.

#### 5.5 grid_zoom_image — 网格点击放大

Grid layout, click any image to enlarge fullscreen.

Variants: 2x2, 3x3, 2x3, masonry/uneven height, jigsaw irregular, circular avatar wall.

Slots per variant: 4-9 images.

#### 5.6 card_flip_image — 卡牌翻转揭秘

Front cover image, click flips to reveal back image/content.

Variants: single horizontal flip, single vertical flip, dual card comparison, triple horizontal, flip with text overlay, scratch-card reveal.

Slots per variant: 2 images per card (front/back).

#### Panel Grouping

New 6th tier in SvgTemplatePanel: "📷 图片交互模板 (Manifold)"

### 6. Data Flow & State Management

#### Current (to be replaced)
```
appStore.contentBlocks[] → styleAssembler.buildHtml() → HTML string
```

#### New
```
tiptap Document (JSON) → real-time WYSIWYG rendering → export serializes to WeChat HTML
```

#### tiptap Document Structure

```javascript
{
  type: 'doc',
  content: [
    {
      type: 'manifoldHeading',
      attrs: { level: 1, styleId: 'style_elegant_01' },
      content: [{ type: 'text', text: '文章标题' }]
    },
    {
      type: 'manifoldParagraph',
      attrs: { styleId: 'style_body_default' },
      content: [{ type: 'text', text: '正文内容...' }]
    },
    {
      type: 'manifoldSvgBlock',
      attrs: {
        templateId: 'tab_switch_3img',
        source: 'manifold',
        svgContent: '<svg>...</svg>',
        imageSlots: { ... },
        config: { ... }
      }
    },
    {
      type: 'manifoldImage',
      attrs: {
        src: 'https://mmbiz...',
        mediaId: 'wx_abc',
        caption: '图片说明',
        layout: 'full_width'
      }
    }
  ]
}
```

#### appStore Changes

```typescript
// appStore.ts
state: {
  // Kept
  wechatImages: [],        // WeChat material library
  styleConfig: {},         // Global style config

  // New
  editorJson: null,        // tiptap document JSON (auto-synced)
  imageSlotRegistry: {},   // All SVG slot image mappings

  // Deprecated
  // contentBlocks: []     // Replaced by tiptap document model
}
```

#### Key Data Flows

```
Step1 text input
  → textParser → generates tiptap initial JSON (not contentBlocks)
  → passed to Step2Editor

Step2 editing
  → tiptap real-time editing → WYSIWYG rendering
  → image operations → update imageSlots → SVG refreshes
  → style switch → update node attrs.styleId → re-render

Export/publish
  → tiptap JSON → htmlSerializer
  → SVG placeholders replaced with real image URLs
  → generates final WeChat-compatible HTML
  → passed to Step3Confirm
```

### 7. Step3Confirm — Publish Confirmation Page

Replaces Step3Preview.vue. Lightweight.

```
┌─────────────────────────────────────────────┐
│  ← Back to edit         Manifold Publish     │
├─────────────────────────────────────────────┤
│  ┌──Config───┐  ┌──Read-only Preview────┐   │
│  │ Title:___ │  │                        │   │
│  │ Author:__ │  │  [Final rendered HTML]  │   │
│  │ Cover:    │  │  [All SVG+images]       │   │
│  │  [Select] │  │  [Final effect]         │   │
│  │ Summary:_ │  │                        │   │
│  │ ──────── │  │                        │   │
│  │ [Copy]    │  │                        │   │
│  │ [Publish] │  │                        │   │
│  └───────────┘  └────────────────────────┘   │
│                                              │
└──────────────────────────────────────────────┘
```

Three functions only:
1. Article metadata (title/cover/summary)
2. Read-only final preview
3. Export (copy HTML / publish to WeChat)

### 8. AI-Native Architecture (Future-Ready)

#### Slash Commands

```
/  ← user types slash in editor
├── /image     Insert image
├── /svg       Insert SVG interactive template
├── /title     Insert heading
├── /divider   Insert divider
│
├── /ai        AI command entry (future)
│   ├── /ai write    AI continue writing
│   ├── /ai rewrite  AI rewrite selection
│   ├── /ai image    AI generate image for slot
│   ├── /ai layout   AI recommend layout
│   └── /ai svg      AI generate SVG from description
```

#### ManifoldEditorAPI (CLI Agent Interface)

```typescript
interface ManifoldEditorAPI {
  // Document operations
  insertNode(type: string, attrs: object, position?: number): string
  updateNode(nodeId: string, attrs: object): void
  deleteNode(nodeId: string): void
  getDocument(): JSON

  // SVG operations
  insertSvgTemplate(templateId: string, position?: number): string
  setImageSlot(nodeId: string, slotId: string, imageUrl: string): void
  getSvgSlotStatus(nodeId: string): SlotStatus[]

  // AI operations (future)
  aiRewrite(nodeId: string, prompt: string): Promise<void>
  aiGenerateImage(slotId: string, prompt: string): Promise<string>
  aiSuggestLayout(documentJson: JSON): Promise<LayoutSuggestion>
}
```

Future CLI usage:
```bash
manifold editor insert-svg tab_switch_3img --position after:node_3
manifold editor set-image node_5:tab1 ./photo.jpg
manifold editor ai-layout --style "GQ Lab科技感"
```

### 9. File Structure

#### New Files

```
src/
├── editor/
│   ├── core/
│   │   ├── EditorInstance.ts      # tiptap setup, extensions, config
│   │   └── EditorConfig.ts        # default configuration
│   ├── nodes/
│   │   ├── ManifoldHeading.ts     # heading node definition
│   │   ├── ManifoldParagraph.ts   # paragraph node definition
│   │   ├── ManifoldImage.ts       # image node definition
│   │   ├── ManifoldSvgBlock.ts    # SVG interactive node (CORE)
│   │   └── index.ts               # export all nodes
│   ├── extensions/
│   │   ├── SlashCommand.ts        # slash menu extension
│   │   ├── DragHandle.ts          # drag-to-reorder
│   │   ├── ImageUpload.ts         # image upload handling
│   │   └── index.ts
│   ├── serializers/
│   │   ├── htmlSerializer.ts      # tiptap JSON → WeChat HTML
│   │   ├── jsonImporter.ts        # contentBlocks → tiptap JSON migration
│   │   └── index.ts
│   └── api/
│       └── ManifoldEditorAPI.ts   # programmatic editor API
├── components/
│   ├── ImageSlotPopover.vue       # image slot picker popup
│   ├── EditorToolbar.vue          # top toolbar
│   ├── EditorSidebar.vue          # left sidebar container
│   └── ImageManagerTab.vue        # image management tab
├── views/
│   ├── Step2Editor.vue            # NEW — replaces Step2Curtain.vue
│   └── Step3Confirm.vue           # NEW — replaces Step3Preview.vue
├── styles/
│   └── svgTemplatesImageDriven.js # 36 image-driven templates
```

#### Modified Files

```
src/stores/appStore.ts             # Add editorJson, imageSlotRegistry; deprecate contentBlocks
src/utils/textParser.ts            # Output tiptap JSON instead of contentBlocks
src/styles/svgTemplates.js         # Register 6 new image-driven categories
src/components/SvgTemplatePanel.vue # Add 6th tier "图片交互模板 (Manifold)"
src/router/index.ts (or equivalent) # Update Step2/Step3 route targets
```

#### Unchanged

- All 390 existing SVG templates (4 template files)
- `src/styles/templates.js` (HTML style templates)
- `src/styles/styleTemplates.js` (240+ decoration styles)
- `src/utils/uploadManager.ts` (image upload logic, reused)
- `src/utils/wechatApi.ts` (WeChat API, reused)

### 10. Dependencies

New npm packages:
- `@tiptap/vue-3` — tiptap Vue 3 integration
- `@tiptap/starter-kit` — basic extensions (bold, italic, heading, etc.)
- `@tiptap/extension-image` — image node
- `@tiptap/extension-placeholder` — placeholder text
- `@tiptap/extension-dropcursor` — drag visual feedback
- `@tiptap/pm` — ProseMirror core access (for custom nodes)

### 11. Migration Strategy

Since this replaces core editing views, migration should be incremental:

0. **Phase 0**: Install tiptap dependencies (use `/tmp` workaround per global rules)
1. **Phase 1**: Build tiptap editor alongside existing Step2 (feature-flagged via route query `?editor=v2`)
2. **Phase 2**: Implement SVG image slot system + image-driven templates
3. **Phase 3**: Build htmlSerializer (tiptap JSON → WeChat HTML)
4. **Phase 4**: Wire up Step3Confirm
5. **Phase 5**: Switch default route to new editor, deprecate old Step2/Step3
6. **Phase 6**: Clean up old code

This allows testing new editor without breaking existing functionality.

### 12. State Management During Migration

During Phase 1-4, both `contentBlocks` and `editorJson` will coexist:

```typescript
// Sync strategy: tiptap JSON → contentBlocks for backward compat
watch(() => editorJson.value, (newJson) => {
  contentBlocks.value = tiptapToContentBlocks(newJson)
})

// Route guards updated to support both:
validator: (appStore) =>
  Boolean(appStore.editorJson) || Boolean(appStore.contentBlocks?.length)
```

`imageSlotRegistry` is a **derived index** from tiptap node attrs — it aggregates all SVG block image slots for the ImageManagerTab to display. It is NOT a duplicate of `wechatImages` (which is the full material library).

### 13. Error Handling

| Scenario | Handling |
|----------|----------|
| Malformed SVG template | Wrap in try/catch, show placeholder error block in canvas |
| Missing image slot data | Render gray placeholder with "+" icon, non-blocking |
| Failed image upload | Show error toast, keep placeholder, allow retry |
| Corrupted tiptap JSON | Attempt recovery from last valid state (tiptap history), fallback to contentBlocks |
| WeChat SMIL unsupported | Static fallback — render first frame as image, add `<noscript>` hint |

### 14. Image URL Security

Only allow trusted image sources in SVG `href` attributes:

```typescript
// ManifoldSvgBlock URL validation
const ALLOWED_URL_PATTERNS = [
  /^https:\/\/mmbiz\.qpic\.cn\//,    // WeChat CDN
  /^data:image\/(png|jpeg|gif|svg)/,  // Data URIs
  /^blob:/                             // Local blob URLs (during editing)
]
```

URLs are sanitized via DOMPurify (already in codebase) during export.

### 15. Testing Strategy

- **Unit tests**: tiptap custom nodes (ManifoldSvgBlock attrs, slot parsing)
- **Integration tests**: Image slot fill → SVG update → export HTML pipeline
- **E2E tests**: Full flow — insert SVG template → fill images → export to WeChat HTML
- **WeChat compatibility**: Test exported HTML in WeChat WebView (manual, per release)

### 16. Backward Compatibility

- Existing saved articles with `contentBlocks` format: auto-converted via `jsonImporter.ts` on load
- Conversion is on-the-fly (no batch migration needed)
- Old format supported for 6 months after Phase 5 launch
- `contentBlocks` only removed in Phase 6 after confirming zero usage

### 17. Component Clarifications

**EditorCanvas.vue** is part of Step2Editor.vue (inlined, not a separate file) — the tiptap instance is initialized directly in Step2Editor.

**tiptap Node files** (`.ts` in `src/editor/nodes/`) are **tiptap Node extension definitions**, not Vue components. They define schema, attrs, and NodeView rendering.

**Sidebar tab mapping:**
| New Tab | Wraps Existing Component |
|---------|-------------------------|
| StyleTab.vue | Extracts style selection logic from Step2Curtain.vue |
| SvgTemplateTab.vue | Wraps existing SvgTemplatePanel.vue |
| ImageManagerTab.vue | New component |

### 18. AI-Native Features Scope

Slash commands (`/image`, `/svg`, `/title`, `/divider`) are **MVP** — implemented in Phase 1.

AI commands (`/ai write`, `/ai rewrite`, `/ai image`, etc.) and ManifoldEditorAPI are **post-MVP** — deferred to Phase 7+. The architecture accommodates them but they are not part of the initial 6-phase delivery.
