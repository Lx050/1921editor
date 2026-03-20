<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  visible: boolean
  html: string
}>()

const emit = defineEmits<{ (e: 'close'): void }>()

const iframeRef = ref<HTMLIFrameElement | null>(null)
const viewMode = ref<'preview' | 'source'>('preview')

watch(() => props.visible, (v) => {
  if (v && iframeRef.value) {
    updateIframe()
  }
})

watch(() => props.html, () => {
  if (props.visible && iframeRef.value) {
    updateIframe()
  }
})

function updateIframe() {
  if (!iframeRef.value) return
  const doc = iframeRef.value.contentDocument
  if (!doc) return
  doc.open()
  doc.write(`<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  color: #333;
  font-size: 14px;
  line-height: 1.75;
}
img { max-width: 100%; height: auto; }
</style>
</head>
<body>${props.html}</body>
</html>`)
  doc.close()
}

function onIframeLoad() {
  updateIframe()
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="visible"
      class="fixed inset-0 z-[200] flex items-center justify-center bg-black/50"
      @click.self="emit('close')"
    >
      <div class="bg-white rounded-xl shadow-2xl w-[700px] max-w-[90vw] max-h-[85vh] flex flex-col">
        <!-- Header -->
        <div class="flex items-center justify-between px-5 py-3 border-b">
          <div class="flex items-center gap-3">
            <h2 class="text-sm font-semibold text-gray-800">HTML Preview</h2>
            <div class="flex bg-gray-100 rounded p-0.5">
              <button
                class="text-xs px-2 py-0.5 rounded transition-colors"
                :class="viewMode === 'preview' ? 'bg-white shadow text-gray-800' : 'text-gray-500'"
                @click="viewMode = 'preview'"
              >Preview</button>
              <button
                class="text-xs px-2 py-0.5 rounded transition-colors"
                :class="viewMode === 'source' ? 'bg-white shadow text-gray-800' : 'text-gray-500'"
                @click="viewMode = 'source'"
              >Source</button>
            </div>
          </div>
          <button
            class="text-gray-400 hover:text-gray-600 text-lg leading-none"
            @click="emit('close')"
          >&times;</button>
        </div>

        <!-- Content -->
        <div class="flex-1 overflow-hidden">
          <iframe
            v-show="viewMode === 'preview'"
            ref="iframeRef"
            class="w-full h-full border-0"
            sandbox="allow-same-origin"
            @load="onIframeLoad"
          />
          <pre
            v-show="viewMode === 'source'"
            class="w-full h-full overflow-auto p-4 text-xs text-gray-700 font-mono bg-gray-50 m-0 whitespace-pre-wrap"
          >{{ html }}</pre>
        </div>
      </div>
    </div>
  </Teleport>
</template>
