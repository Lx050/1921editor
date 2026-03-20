<script setup lang="ts">
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useAppStore } from '../stores/appStore'

const emit = defineEmits<{
  (e: 'insert-image', data: { src: string; name: string; mediaId?: string }): void
}>()

const appStore = useAppStore()
const { wechatImages } = storeToRefs(appStore)
const fileInput = ref<HTMLInputElement | null>(null)

const imageCount = computed(() => wechatImages.value.length)

function getImageSrc(img: { proxyUrl?: string; localPreviewUrl?: string; url: string }) {
  return img.proxyUrl || img.localPreviewUrl || img.url
}

function handleDragStart(event: DragEvent, img: { id: string; url: string; name: string; proxyUrl?: string; localPreviewUrl?: string; mediaId?: string }) {
  if (!event.dataTransfer) return
  const src = getImageSrc(img)
  event.dataTransfer.setData('application/manifold-image', JSON.stringify({
    src,
    name: img.name,
    mediaId: img.mediaId || '',
  }))
  event.dataTransfer.effectAllowed = 'copy'
}

function handleClickInsert(img: { id: string; url: string; name: string; proxyUrl?: string; localPreviewUrl?: string; mediaId?: string }) {
  emit('insert-image', {
    src: getImageSrc(img),
    name: img.name,
    mediaId: img.mediaId,
  })
}

function triggerUpload() {
  fileInput.value?.click()
}

function handleFileUpload(event: Event) {
  const input = event.target as HTMLInputElement
  const files = input.files
  if (!files?.length) return

  for (const file of Array.from(files)) {
    if (!file.type.startsWith('image/')) continue
    const localUrl = URL.createObjectURL(file)
    const newImg = {
      id: `local_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      mediaId: '',
      url: localUrl,
      localPreviewUrl: localUrl,
      name: file.name,
      status: 'pending' as const,
      file,
    }
    appStore.addWechatImages([newImg])
  }
  input.value = ''
}
</script>

<template>
  <div class="h-full flex flex-col p-3">
    <div class="flex items-center justify-between mb-3">
      <h3 class="text-sm font-medium text-gray-700">图片管理</h3>
      <button
        class="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
        @click="triggerUpload"
      >+ 上传</button>
    </div>
    <input ref="fileInput" type="file" accept="image/*" multiple class="hidden" @change="handleFileUpload" />

    <div v-if="imageCount === 0" class="flex-1 flex items-center justify-center text-gray-400 text-sm">
      <div class="text-center">
        <p>暂无图片</p>
        <p class="text-xs mt-1">点击上传或拖入编辑器</p>
      </div>
    </div>

    <div v-else class="flex-1 overflow-y-auto">
      <p class="text-xs text-gray-500 mb-2">{{ imageCount }} 张 &middot; 拖入编辑器或点击插入</p>
      <div class="grid grid-cols-2 gap-2">
        <div
          v-for="img in wechatImages"
          :key="img.id"
          class="group relative aspect-square rounded border overflow-hidden cursor-grab hover:border-blue-400 transition-colors"
          draggable="true"
          @dragstart="handleDragStart($event, img)"
          @click="handleClickInsert(img)"
        >
          <img
            :src="getImageSrc(img)"
            :alt="img.name"
            class="w-full h-full object-cover pointer-events-none"
          />
          <div class="absolute inset-x-0 bottom-0 bg-black/50 text-white text-[10px] px-1 py-0.5 truncate opacity-0 group-hover:opacity-100 transition-opacity">
            {{ img.name }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
