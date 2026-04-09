<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'

const props = defineProps<{
  visible: boolean
  html: string
}>()

const emit = defineEmits<{ (e: 'close'): void }>()

const iframeRef = ref<HTMLIFrameElement | null>(null)
const backdropRef = ref<HTMLElement | null>(null)
const viewMode = ref<'preview' | 'source'>('preview')

watch(() => props.visible, (v) => {
  if (v) {
    nextTick(() => {
      backdropRef.value?.focus()
      if (iframeRef.value) updateIframe()
    })
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
  color: rgba(0,0,0,0.85);
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
    <Transition
      enter-active-class="transition-opacity duration-200"
      leave-active-class="transition-opacity duration-150"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
    >
    <div
      v-if="visible"
      ref="backdropRef"
      class="fixed inset-0 z-[200] flex items-center justify-center bg-black/50"
      role="dialog"
      aria-modal="true"
      tabindex="-1"
      @click.self="emit('close')"
      @keydown.escape="emit('close')"
    >
      <div class="bg-white rounded-xl w-[700px] max-w-[90vw] max-h-[85vh] flex flex-col" style="box-shadow:var(--shadow-float);">
        <!-- Header -->
        <div class="flex items-center justify-between px-5 py-3 border-b">
          <div class="flex items-center gap-3">
            <h2 class="text-sm font-semibold" style="color:rgba(0,0,0,0.75);">HTML Preview</h2>
            <div class="flex rounded p-0.5" style="background:rgba(0,0,0,0.08);">
              <button
                class="text-xs px-2 py-0.5 rounded transition-colors"
                :style="viewMode === 'preview' ? 'background:var(--color-bg-card); box-shadow:0 1px 2px rgba(0,0,0,0.1); color:rgba(0,0,0,0.75);' : 'color:rgba(0,0,0,0.45);'"
                @click="viewMode = 'preview'"
              >Preview</button>
              <button
                class="text-xs px-2 py-0.5 rounded transition-colors"
                :style="viewMode === 'source' ? 'background:var(--color-bg-card); box-shadow:0 1px 2px rgba(0,0,0,0.1); color:rgba(0,0,0,0.75);' : 'color:rgba(0,0,0,0.45);'"
                @click="viewMode = 'source'"
              >Source</button>
            </div>
          </div>
          <button
            class="text-lg leading-none"
            style="color:var(--color-text-muted);"
            onmouseover="this.style.color='rgba(0,0,0,0.55)'" onmouseout="this.style.color='var(--color-text-muted)'"
            @click="emit('close')"
            title="关闭"
            aria-label="关闭预览"
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
            class="w-full h-full overflow-auto p-4 text-xs font-mono m-0 whitespace-pre-wrap"
            style="color:rgba(0,0,0,0.65); background:var(--color-bg-warm);"
          >{{ html }}</pre>
        </div>
      </div>
    </div>
    </Transition>
  </Teleport>
</template>
