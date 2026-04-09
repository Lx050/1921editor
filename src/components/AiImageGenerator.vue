<script setup lang="ts">
import { ref, computed } from 'vue'
import { generateAndUpload, IMAGE_MODELS, buildPromptFromContext } from '../utils/aiImageService'
import type { AiImageResult, ImageModel } from '../utils/aiImageService'

const props = defineProps<{
  contextText?: string
  slotLabel?: string
}>()

const emit = defineEmits<{
  (e: 'generated', result: AiImageResult): void
}>()

const prompt = ref('')
const selectedModel = ref<ImageModel>('google/gemini-3.1-flash-image-preview')
const generating = ref(false)
const error = ref('')
const previewUrl = ref('')

// Auto-build prompt from context
if (props.contextText) {
  prompt.value = buildPromptFromContext(props.contextText, props.slotLabel)
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
  <div class="ai-image-gen">
    <div class="mb-2">
      <label class="text-xs mb-1 block" style="color:rgba(0,0,0,0.45);">图片描述</label>
      <textarea
        v-model="prompt"
        class="w-full border rounded-lg p-2 text-sm resize-none outline-none"
        style="--tw-ring-color: var(--color-accent-focus);"
        rows="3"
        placeholder="描述你想要生成的图片..."
      />
    </div>

    <div class="flex items-center gap-2 mb-2">
      <select
        v-model="selectedModel"
        class="text-xs border rounded px-2 h-7 bg-white flex-1"
        style="color:rgba(0,0,0,0.55);"
      >
        <option v-for="m in IMAGE_MODELS" :key="m.id" :value="m.id">{{ m.name }}</option>
      </select>

      <button
        class="px-3 h-7 rounded-lg text-xs text-white font-medium transition-colors"
        :style="canGenerate ? 'background: var(--color-accent-primary);' : 'background: rgba(0,0,0,0.25); cursor: not-allowed;'"
        :disabled="!canGenerate"
        @click="handleGenerate"
        @mouseover="(e) => { if (canGenerate) (e.currentTarget as HTMLElement).style.background = 'var(--color-accent-hover)'; }"
        @mouseout="(e) => { if (canGenerate) (e.currentTarget as HTMLElement).style.background = 'var(--color-accent-primary)'; }"
      >
        {{ generating ? '生成中...' : 'AI 生成' }}
      </button>
    </div>

    <div v-if="generating" class="flex items-center gap-2 text-sm py-2" style="color: var(--color-accent-primary);">
      <span class="inline-block w-4 h-4 border-2 border-t-transparent rounded-full animate-spin" style="border-color: var(--color-accent-primary); border-top-color: transparent;" />
      AI正在生成图片，请稍候...
    </div>

    <div v-if="error" class="text-sm text-red-500 py-1">{{ error }}</div>

    <div v-if="previewUrl" class="mt-2 rounded-lg overflow-hidden border">
      <img :src="previewUrl" class="w-full h-auto" alt="AI生成预览" />
      <div class="text-xs text-green-600 p-1 bg-green-50 text-center">已生成并上传</div>
    </div>
  </div>
</template>
