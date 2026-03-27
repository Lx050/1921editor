# SVG AI Pipeline - Full Chain Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Enable AI image generation from text content so SVG templates with image slots become immediately usable - users provide text, AI generates matching images, images auto-fill SVG slots.

**Architecture:** Add an AI image generation service to the frontend that calls the HappyCapy AI Gateway (`/api/v1/images/generations`). Integrate it at two points: (1) a new "AI生图" button in ImageSlotPopover for on-demand slot filling, and (2) an auto-generate flow in Step1→Step2 transition that pre-generates images for all SVG image slots based on article context. The generated images get uploaded to WeChat CDN via the existing `uploadImage()` pipeline, then fill SVG slots.

**Tech Stack:** Vue 3, TypeScript, AI Gateway (OpenRouter-compatible, supports `google/gemini-3.1-flash-image-preview`), existing `wechatApi.ts` upload pipeline, TipTap/ProseMirror editor.

---

## File Structure

| Operation | File | Responsibility |
|-----------|------|----------------|
| **Create** | `src/utils/aiImageService.ts` | AI image generation + prompt engineering service |
| **Create** | `src/components/AiImageGenerator.vue` | Reusable AI image generation UI component (prompt input + preview) |
| **Modify** | `src/components/ImageSlotPopover.vue` | Add "AI生图" tab alongside upload/library |
| **Modify** | `src/views/Step2Editor.vue` | Add "AI自动填充" button for batch SVG slot filling |
| **Modify** | `src/components/EditorToolbar.vue` | Add AI generate button to toolbar |
| **Modify** | `src/stores/appStore.ts` | Add AI generation state tracking |

---

## Chunk 1: AI Image Generation Service

### Task 1: Create `aiImageService.ts`

**Files:**
- Create: `src/utils/aiImageService.ts`

This is the core service that calls the AI Gateway to generate images and returns usable URLs.

- [ ] **Step 1: Create the AI image generation service**

```typescript
// src/utils/aiImageService.ts
import { uploadImage, getWechatProxyUrl } from './wechatApi'

const AI_GATEWAY_URL = 'https://ai-gateway.happycapy.ai/api/v1'
const AI_GATEWAY_KEY = import.meta.env.VITE_AI_GATEWAY_KEY || ''

// Models available for image generation
export const IMAGE_MODELS = [
  { id: 'google/gemini-3.1-flash-image-preview', name: 'Gemini Flash (快速)', default: true },
  { id: 'google/gemini-3-pro-image-preview', name: 'Gemini Pro (高质量)' },
  { id: 'byteplus/seedream-4-5', name: 'Seedream (艺术风格)' },
] as const

export type ImageModel = typeof IMAGE_MODELS[number]['id']

export interface AiImageResult {
  url: string          // URL of the generated image (could be remote URL or data URI)
  proxyUrl: string     // WeChat proxy URL after upload
  mediaId: string      // WeChat media_id after upload
  prompt: string       // The prompt used
  model: string        // Model used
}

/**
 * Generate an image from a text prompt via AI Gateway.
 * Returns a base64 data URI or remote URL.
 */
export async function generateImage(
  prompt: string,
  model: ImageModel = 'google/gemini-3.1-flash-image-preview'
): Promise<{ imageData: string; format: 'b64' | 'url' }> {
  const resp = await fetch(`${AI_GATEWAY_URL}/images/generations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${AI_GATEWAY_KEY}`,
      'Origin': 'https://trickle.so',
      'User-Agent': 'Mozilla/5.0 (compatible; AI-Gateway-Client/1.0)',
    },
    body: JSON.stringify({
      model,
      prompt,
      n: 1,
      response_format: 'b64_json',
    }),
  })

  if (!resp.ok) {
    const errText = await resp.text()
    throw new Error(`AI生图失败 (${resp.status}): ${errText}`)
  }

  const data = await resp.json()
  const imageItem = data.data?.[0]

  if (imageItem?.b64_json) {
    return { imageData: `data:image/png;base64,${imageItem.b64_json}`, format: 'b64' }
  } else if (imageItem?.url) {
    return { imageData: imageItem.url, format: 'url' }
  }

  throw new Error('AI网关返回数据格式异常')
}

/**
 * Generate image and upload to WeChat CDN in one step.
 * Returns everything needed to fill an SVG slot.
 */
export async function generateAndUpload(
  prompt: string,
  model?: ImageModel
): Promise<AiImageResult> {
  const { imageData, format } = await generateImage(prompt, model)

  // Convert to File for WeChat upload
  let file: File
  if (format === 'b64') {
    const b64 = imageData.replace(/^data:image\/\w+;base64,/, '')
    const bytes = Uint8Array.from(atob(b64), c => c.charCodeAt(0))
    const blob = new Blob([bytes], { type: 'image/png' })
    file = new File([blob], `ai-${Date.now()}.png`, { type: 'image/png' })
  } else {
    // Fetch remote URL and convert to File
    const imgResp = await fetch(imageData)
    const blob = await imgResp.blob()
    file = new File([blob], `ai-${Date.now()}.png`, { type: blob.type || 'image/png' })
  }

  // Upload to WeChat
  const result = await uploadImage(file)
  const wechatUrl = result.url || ''
  const proxyUrl = wechatUrl ? getWechatProxyUrl(wechatUrl) : imageData

  return {
    url: wechatUrl || imageData,
    proxyUrl,
    mediaId: result.media_id || '',
    prompt,
    model: model || 'google/gemini-3.1-flash-image-preview',
  }
}

/**
 * Build an image generation prompt from article context.
 * Uses the surrounding text to create a relevant image description.
 */
export function buildPromptFromContext(
  surroundingText: string,
  slotLabel?: string,
  style?: string
): string {
  const base = slotLabel
    ? `为"${slotLabel}"生成一张配图`
    : '生成一张文章配图'

  const styleHint = style || '现代简约风格，适合微信公众号文章'

  return `${base}。文章内容摘要：${surroundingText.slice(0, 300)}。风格要求：${styleHint}。图片应无文字水印，高清，16:9宽幅构图。`
}
```

- [ ] **Step 2: Add VITE_AI_GATEWAY_KEY to env**

Add to `src/vite.config.ts` or `.env` so the frontend can access the key:

```bash
# In the vite config or .env.local
VITE_AI_GATEWAY_KEY=<key from environment>
```

Since this is a sandbox environment, we'll inject it via Vite's `define` config using `process.env.AI_GATEWAY_API_KEY`.

- [ ] **Step 3: Commit**

```bash
git add src/utils/aiImageService.ts
git commit -m "feat: add AI image generation service (aiImageService.ts)"
```

---

### Task 2: Create `AiImageGenerator.vue` Component

**Files:**
- Create: `src/components/AiImageGenerator.vue`

Reusable component for AI image generation with prompt editing, model selection, preview, and generation state.

- [ ] **Step 1: Create the component**

```vue
<script setup lang="ts">
import { ref, computed } from 'vue'
import { generateAndUpload, IMAGE_MODELS, buildPromptFromContext } from '../utils/aiImageService'
import type { AiImageResult, ImageModel } from '../utils/aiImageService'

const props = defineProps<{
  contextText?: string    // Surrounding article text for auto-prompt
  slotLabel?: string      // SVG slot label (e.g. "主图")
  style?: string          // Optional style hint
}>()

const emit = defineEmits<{
  (e: 'generated', result: AiImageResult): void
  (e: 'cancel'): void
}>()

const prompt = ref('')
const selectedModel = ref<ImageModel>('google/gemini-3.1-flash-image-preview')
const generating = ref(false)
const error = ref('')
const previewUrl = ref('')

// Auto-build prompt from context on mount
if (props.contextText) {
  prompt.value = buildPromptFromContext(props.contextText, props.slotLabel, props.style)
}

const canGenerate = computed(() => prompt.value.trim().length > 0 && !generating.value)

async function handleGenerate() {
  if (!canGenerate.value) return
  generating.value = true
  error.value = ''
  previewUrl.value = ''

  try {
    const result = await generateAndUpload(prompt.value, selectedModel.value)
    previewUrl.value = result.proxyUrl || result.url
    emit('generated', result)
  } catch (err: any) {
    error.value = err.message || 'AI生图失败'
  } finally {
    generating.value = false
  }
}
</script>

<template>
  <div class="ai-image-gen p-3">
    <div class="mb-2">
      <label class="text-xs text-gray-500 mb-1 block">图片描述 (Prompt)</label>
      <textarea
        v-model="prompt"
        class="w-full border rounded-lg p-2 text-sm resize-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 outline-none"
        rows="3"
        placeholder="描述你想要生成的图片..."
      />
    </div>

    <div class="flex items-center gap-2 mb-2">
      <select
        v-model="selectedModel"
        class="text-xs border rounded px-2 h-7 text-gray-600 bg-white flex-1"
      >
        <option v-for="m in IMAGE_MODELS" :key="m.id" :value="m.id">{{ m.name }}</option>
      </select>

      <button
        class="px-3 h-7 rounded-lg text-xs text-white font-medium transition-colors"
        :class="canGenerate ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-300 cursor-not-allowed'"
        :disabled="!canGenerate"
        @click="handleGenerate"
      >
        {{ generating ? '生成中...' : 'AI 生成' }}
      </button>
    </div>

    <!-- Loading indicator -->
    <div v-if="generating" class="flex items-center gap-2 text-sm text-blue-600 py-2">
      <span class="inline-block w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
      AI正在生成图片，请稍候...
    </div>

    <!-- Error -->
    <div v-if="error" class="text-sm text-red-500 py-1">{{ error }}</div>

    <!-- Preview -->
    <div v-if="previewUrl" class="mt-2 rounded-lg overflow-hidden border">
      <img :src="previewUrl" class="w-full h-auto" alt="AI生成预览" />
      <div class="text-xs text-green-600 p-1 bg-green-50 text-center">已生成并上传</div>
    </div>
  </div>
</template>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/AiImageGenerator.vue
git commit -m "feat: add AiImageGenerator.vue component"
```

---

## Chunk 2: Integrate into SVG Slot Filling

### Task 3: Add AI Tab to ImageSlotPopover

**Files:**
- Modify: `src/components/ImageSlotPopover.vue`

Add a third tab "AI生图" alongside "上传图片" and "图片库" in the popover that appears when clicking SVG image slots.

- [ ] **Step 1: Add AI generation tab to ImageSlotPopover**

Key changes:
1. Import `AiImageGenerator` component
2. Add a `tabMode` ref: `'upload' | 'library' | 'ai'`
3. Add tab buttons at top of popover
4. Show `AiImageGenerator` when `tabMode === 'ai'`
5. Extract surrounding text context from the editor for auto-prompting
6. On `@generated`, emit `select` with the result (same as upload/library flow)

```typescript
// In ImageSlotPopover.vue <script setup>
import AiImageGenerator from './AiImageGenerator.vue'
import type { AiImageResult } from '../utils/aiImageService'

const tabMode = ref<'upload' | 'library' | 'ai'>('upload')

// Get surrounding text from editor for context
const contextText = computed(() => {
  // Walk the editor document to extract text near the current SVG block
  // This provides context for AI prompt generation
  return props.contextText || ''
})

function handleAiGenerated(result: AiImageResult) {
  // Add to image library
  appStore.addWechatImage({
    url: result.url,
    proxyUrl: result.proxyUrl,
    media_id: result.mediaId,
    name: `AI-${result.prompt.slice(0, 20)}`,
  })
  // Emit to fill the slot
  emit('select', {
    url: result.proxyUrl,
    mediaId: result.mediaId,
    name: `AI生成-${Date.now()}`,
  })
}
```

Add `contextText` as a new prop passed from `Step2Editor.vue`.

- [ ] **Step 2: Pass context text from Step2Editor to ImageSlotPopover**

In `Step2Editor.vue`, when opening the popover, extract surrounding text:

```typescript
function getContextAroundNode(nodePos: number): string {
  if (!editor.value) return ''
  const doc = editor.value.state.doc
  const texts: string[] = []
  // Get text from 2 blocks before and after the SVG node
  doc.forEach((node, offset) => {
    if (Math.abs(offset - nodePos) < 500 && node.textContent) {
      texts.push(node.textContent)
    }
  })
  return texts.join('\n').slice(0, 500)
}
```

Pass this as `:context-text="popoverContextText"` to ImageSlotPopover.

- [ ] **Step 3: Commit**

```bash
git add src/components/ImageSlotPopover.vue src/views/Step2Editor.vue
git commit -m "feat: add AI image generation tab to SVG slot popover"
```

---

### Task 4: Add "AI Fill All Slots" Button to Editor

**Files:**
- Modify: `src/views/Step2Editor.vue`
- Modify: `src/components/EditorToolbar.vue`

Add a toolbar button that batch-fills all empty SVG image slots using AI.

- [ ] **Step 1: Add batch fill function to Step2Editor**

```typescript
import { generateAndUpload, buildPromptFromContext } from '../utils/aiImageService'

const aiFilling = ref(false)
const aiFillProgress = ref({ total: 0, done: 0 })

async function aiAutoFillSlots() {
  if (!editor.value || aiFilling.value) return
  aiFilling.value = true

  const doc = editor.value.state.doc
  const emptySlots: Array<{ nodePos: number; slotId: string; label: string; contextText: string }> = []

  // Scan document for SVG blocks with empty image slots
  doc.forEach((node, offset) => {
    if (node.type.name === 'manifoldSvgBlock') {
      const slots = node.attrs.imageSlots || {}
      const templateId = node.attrs.templateId
      const tpl = templateId ? getSvgTemplateById(templateId) : null
      const slotDefs = (tpl as any)?.imageSlots || []

      for (const slotDef of slotDefs) {
        if (!slots[slotDef.id] || !slots[slotDef.id]?.url) {
          emptySlots.push({
            nodePos: offset,
            slotId: slotDef.id,
            label: slotDef.label || slotDef.id,
            contextText: getContextAroundNode(offset),
          })
        }
      }
    }
  })

  if (emptySlots.length === 0) {
    ElMessage.info('所有SVG图片槽位已填充')
    aiFilling.value = false
    return
  }

  aiFillProgress.value = { total: emptySlots.length, done: 0 }

  for (const slot of emptySlots) {
    try {
      const prompt = buildPromptFromContext(slot.contextText, slot.label)
      const result = await generateAndUpload(prompt)

      // Update the SVG node's imageSlots attribute
      const node = editor.value.state.doc.nodeAt(slot.nodePos)
      if (node && node.type.name === 'manifoldSvgBlock') {
        const newSlots = { ...node.attrs.imageSlots }
        newSlots[slot.slotId] = { url: result.proxyUrl, mediaId: result.mediaId, name: result.prompt.slice(0, 20) }
        const tr = editor.value.state.tr
        tr.setNodeMarkup(slot.nodePos, undefined, { ...node.attrs, imageSlots: newSlots })
        editor.value.view.dispatch(tr)
      }

      appStore.addWechatImage({
        url: result.url,
        proxyUrl: result.proxyUrl,
        media_id: result.mediaId,
        name: `AI-${slot.label}`,
      })
    } catch (err) {
      console.error(`AI fill failed for slot ${slot.slotId}:`, err)
    }
    aiFillProgress.value.done++
  }

  aiFilling.value = false
  ElMessage.success(`AI已填充 ${aiFillProgress.value.done}/${aiFillProgress.value.total} 个图片槽位`)
}
```

- [ ] **Step 2: Add toolbar button**

In `EditorToolbar.vue`, add an "AI" button:

```html
<button
  class="toolbar-btn text-xs"
  :class="{ 'animate-pulse': aiFilling }"
  @click="emit('ai-fill-slots')"
  title="AI自动填充SVG图片"
>AI</button>
```

Wire the event in Step2Editor: `@ai-fill-slots="aiAutoFillSlots"`

- [ ] **Step 3: Commit**

```bash
git add src/views/Step2Editor.vue src/components/EditorToolbar.vue
git commit -m "feat: add AI auto-fill for all SVG image slots"
```

---

## Chunk 3: Vite Config + Environment Setup

### Task 5: Inject AI Gateway Key into Frontend

**Files:**
- Modify: `src/vite.config.ts` (or `vite.config.ts` at project root)

The AI Gateway API key needs to be available to the frontend. Since this is a sandbox with the key in the environment, we inject it via Vite's `define` or `envPrefix`.

- [ ] **Step 1: Find and modify vite config**

Add to the Vite config's `define` section:

```typescript
define: {
  // Inject AI Gateway key from build environment
  'import.meta.env.VITE_AI_GATEWAY_KEY': JSON.stringify(process.env.AI_GATEWAY_API_KEY || ''),
}
```

This makes `import.meta.env.VITE_AI_GATEWAY_KEY` available in the frontend code at build time.

- [ ] **Step 2: Commit**

```bash
git add vite.config.ts
git commit -m "chore: inject AI_GATEWAY_API_KEY into frontend via Vite define"
```

---

## Chunk 4: Integration Testing & Polish

### Task 6: Manual Integration Test

- [ ] **Step 1: Build the project**

```bash
cd tmp/1921editor && node node_modules/vite/bin/vite.js build --outDir /tmp/1921editor-dist
```

Expected: Build succeeds with no TypeScript errors.

- [ ] **Step 2: Verify AI service works end-to-end**

Start dev server, open Step2 editor, insert an SVG template with image slots, click a slot, switch to AI tab, generate an image. Verify:
1. Prompt is auto-generated from surrounding text
2. Image generates without errors
3. Image appears in the slot
4. Image is uploaded to WeChat CDN (has proxy URL)

- [ ] **Step 3: Test batch fill**

Click the "AI" toolbar button with multiple SVG blocks with empty slots. Verify all slots fill sequentially.

- [ ] **Step 4: Final commit and push**

```bash
git add -A
git commit -m "feat: complete SVG AI pipeline - generate + fill + batch"
git push origin main
```

---

## Summary

The pipeline flow after implementation:

```
User writes text in Step1
    ↓
Text is parsed into content blocks (existing)
    ↓
User inserts SVG templates in Step2 editor (existing)
    ↓
SVG templates have empty image slots (existing)
    ↓  ← NEW: Two paths to fill slots ↓
    ├─ Click slot → ImageSlotPopover → "AI生图" tab
    │    → User edits auto-prompt → generateAndUpload()
    │    → Image fills single slot
    │
    └─ Click "AI" toolbar button → aiAutoFillSlots()
         → Scans all SVG blocks for empty slots
         → Generates image for each based on text context
         → Batch fills all slots
    ↓
All slots filled → Step3 preview works with real images (existing)
    ↓
Publish to WeChat with images (existing)
```

**Key design decisions:**
1. AI Gateway key injected at build time via Vite `define` (not hardcoded)
2. Generated images always uploaded to WeChat CDN first (reuses existing pipeline)
3. Auto-prompt builds from surrounding article text (context-aware)
4. Three models available: fast (Gemini Flash), quality (Gemini Pro), artistic (Seedream)
5. Both single-slot and batch-fill workflows supported
