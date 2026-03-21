<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

interface Toast {
  id: number
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  duration: number
}

const toasts = ref<Toast[]>([])
let nextId = 0

function addToast(message: string, type: Toast['type'] = 'info', duration = 3000) {
  const id = nextId++
  toasts.value.push({ id, message, type, duration })
  if (duration > 0) {
    setTimeout(() => removeToast(id), duration)
  }
}

function removeToast(id: number) {
  toasts.value = toasts.value.filter(t => t.id !== id)
}

// Listen for custom toast events
function handleToastEvent(e: Event) {
  const detail = (e as CustomEvent).detail
  if (detail?.message) {
    addToast(detail.message, detail.type || 'info', detail.duration || 3000)
  }
}

onMounted(() => {
  window.addEventListener('manifold:toast', handleToastEvent)
})

onBeforeUnmount(() => {
  window.removeEventListener('manifold:toast', handleToastEvent)
})

const typeStyles = {
  info: 'bg-gray-800 text-white',
  success: 'bg-green-600 text-white',
  warning: 'bg-amber-500 text-white',
  error: 'bg-red-600 text-white',
}

defineExpose({ addToast })
</script>

<template>
  <div class="fixed bottom-20 right-4 z-[300] flex flex-col gap-2 items-end pointer-events-none">
    <TransitionGroup name="toast">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="pointer-events-auto px-4 py-2 rounded-lg shadow-lg text-sm font-medium max-w-[300px] cursor-pointer transition-all"
        :class="typeStyles[toast.type]"
        @click="removeToast(toast.id)"
      >
        {{ toast.message }}
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toast-enter-active {
  transition: all 0.3s ease;
}
.toast-leave-active {
  transition: all 0.2s ease;
}
.toast-enter-from {
  opacity: 0;
  transform: translateX(30px);
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
