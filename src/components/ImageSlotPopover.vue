<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useAppStore } from '../stores/appStore'
import { uploadImage, getWechatProxyUrl } from '../utils/wechatApi'
import AiImageGenerator from './AiImageGenerator.vue'
import type { ImageSlotData } from '@/types/editor'
import type { AiImageResult } from '../utils/aiImageService'

const props = defineProps<{
  visible: boolean
  position: { x: number; y: number }
  slotId: string
  currentData: ImageSlotData | null
  contextText?: string
  slotLabel?: string
}>()

const emit = defineEmits<{
  (e: 'select', data: ImageSlotData): void
  (e: 'close'): void
}>()

const appStore = useAppStore()
const { wechatImages } = storeToRefs(appStore)
const uploadInput = ref<HTMLInputElement | null>(null)
const uploading = ref(false)
const uploadError = ref('')
const tabMode = ref<'upload' | 'library' | 'ai'>('upload')

function selectFromLibrary(img: any) {
  emit('select', { url: img.proxyUrl || img.url, mediaId: img.mediaId, name: img.name })
}

function triggerUpload() {
  uploadInput.value?.click()
}

async function handleFileUpload(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  uploading.value = true
  uploadError.value = ''

  const localUrl = URL.createObjectURL(file)

  try {
    const result = await uploadImage(file)
    const wechatUrl = result.url || ''
    const proxyUrl = wechatUrl ? getWechatProxyUrl(wechatUrl) : localUrl

    if (result.media_id) {
      appStore.addWechatImage({
        id: result.media_id,
        mediaId: result.media_id,
        url: wechatUrl,
        proxyUrl,
        localPreviewUrl: localUrl,
        name: file.name,
        uploadedAt: new Date().toISOString()
      })
    }

    emit('select', { url: proxyUrl, mediaId: result.media_id, name: file.name })
  } catch (err: any) {
    uploadError.value = err.message || '上传失败'
    emit('select', { url: localUrl, name: file.name })
  } finally {
    uploading.value = false
    if (input) input.value = ''
  }
}

function handleAiGenerated(result: AiImageResult) {
  appStore.addWechatImage({
    id: result.mediaId || `ai-${Date.now()}`,
    mediaId: result.mediaId,
    url: result.url,
    proxyUrl: result.proxyUrl,
    name: `AI-${result.prompt.slice(0, 20)}`,
    uploadedAt: new Date().toISOString()
  })
  emit('select', {
    url: result.proxyUrl,
    mediaId: result.mediaId,
    name: `AI-${Date.now()}`,
  })
}
</script>

<template>
  <Teleport to="body">
    <div v-if="visible" class="fixed inset-0 z-50" @click.self="emit('close')">
      <div
        class="absolute bg-white rounded-lg shadow-xl border w-80"
        :style="{ left: position.x + 'px', top: position.y + 'px', transform: 'translateX(-50%)' }"
      >
        <!-- Header -->
        <div class="flex items-center justify-between px-3 pt-3 pb-2">
          <span class="text-sm font-medium text-gray-700">填充图片</span>
          <button class="text-gray-400 hover:text-gray-600 text-xs" @click="emit('close')">x</button>
        </div>

        <!-- Tab buttons -->
        <div class="flex border-b mx-3 mb-2">
          <button
            class="flex-1 text-xs py-1.5 border-b-2 transition-colors"
            :class="tabMode === 'upload' ? 'border-blue-500 text-blue-600 font-medium' : 'border-transparent text-gray-400 hover:text-gray-600'"
            @click="tabMode = 'upload'"
          >
            上传
          </button>
          <button
            class="flex-1 text-xs py-1.5 border-b-2 transition-colors"
            :class="tabMode === 'library' ? 'border-blue-500 text-blue-600 font-medium' : 'border-transparent text-gray-400 hover:text-gray-600'"
            @click="tabMode = 'library'"
          >
            素材库 ({{ wechatImages.length }})
          </button>
          <button
            class="flex-1 text-xs py-1.5 border-b-2 transition-colors"
            :class="tabMode === 'ai' ? 'border-purple-500 text-purple-600 font-medium' : 'border-transparent text-gray-400 hover:text-gray-600'"
            @click="tabMode = 'ai'"
          >
            AI生图
          </button>
        </div>

        <!-- Upload tab -->
        <div v-if="tabMode === 'upload'" class="px-3 pb-3">
          <button
            class="w-full py-2 mb-2 border-2 border-dashed border-gray-300 rounded text-sm text-gray-500 hover:border-blue-400 hover:text-blue-500 transition-colors"
            :class="{ 'opacity-50 cursor-wait': uploading }"
            :disabled="uploading"
            @click="triggerUpload"
          >
            {{ uploading ? '上传中...' : '+ 上传本地图片' }}
          </button>
          <input ref="uploadInput" type="file" accept="image/*" class="hidden" @change="handleFileUpload" />
          <p v-if="uploadError" class="text-xs text-red-500">{{ uploadError }}（已使用本地预览）</p>
        </div>

        <!-- Library tab -->
        <div v-if="tabMode === 'library'" class="px-3 pb-3">
          <div v-if="wechatImages.length" class="max-h-48 overflow-y-auto">
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

        <!-- AI generation tab -->
        <div v-if="tabMode === 'ai'" class="px-3 pb-3">
          <AiImageGenerator
            :context-text="contextText"
            :slot-label="slotLabel"
            @generated="handleAiGenerated"
          />
        </div>
      </div>
    </div>
  </Teleport>
</template>
