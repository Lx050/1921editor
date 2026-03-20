<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useAppStore } from '../stores/appStore'
import type { ImageSlotData } from '@/types/editor'

defineProps<{
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

function selectFromLibrary(img: any) {
  emit('select', { url: img.proxyUrl || img.url, mediaId: img.mediaId, name: img.name })
}

function triggerUpload() {
  uploadInput.value?.click()
}

function handleFileUpload(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  const localUrl = URL.createObjectURL(file)
  emit('select', { url: localUrl, name: file.name })
}
</script>

<template>
  <Teleport to="body">
    <div v-if="visible" class="fixed inset-0 z-50" @click.self="emit('close')">
      <div
        class="absolute bg-white rounded-lg shadow-xl border p-3 w-72"
        :style="{ left: position.x + 'px', top: position.y + 'px', transform: 'translateX(-50%)' }"
      >
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-medium text-gray-700">选择图片</span>
          <button class="text-gray-400 hover:text-gray-600 text-xs" @click="emit('close')">x</button>
        </div>

        <button
          class="w-full py-2 mb-2 border-2 border-dashed border-gray-300 rounded text-sm text-gray-500 hover:border-blue-400 hover:text-blue-500 transition-colors"
          @click="triggerUpload"
        >
          + 上传本地图片
        </button>
        <input ref="uploadInput" type="file" accept="image/*" class="hidden" @change="handleFileUpload" />

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
