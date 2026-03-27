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
      <label class="text-xs text-gray-500 mb-1 block">图片描述</label>
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

    <div v-if="generating" class="flex items-center gap-2 text-sm text-blue-600 py-2">
      <span class="inline-block w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
      AI正在生成图片，请稍候...
    </div>

    <div v-if="error" class="text-sm text-red-500 py-1">{{ error }}</div>

    <div v-if="previewUrl" class="mt-2 rounded-lg overflow-hidden border">
      <img :src="previewUrl" class="w-full h-auto" alt="AI生成预览" />
      <div class="text-xs text-green-600 p-1 bg-green-50 text-center">已生成并上传</div>
    </div>
  </div>
</template>
