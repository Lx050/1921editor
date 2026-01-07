<template>
  <Teleport to="body">
    <TransitionGroup name="toast" tag="div" class="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] flex flex-col items-center space-y-2">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        :class="[
          'px-4 py-3 rounded-xl shadow-2xl flex items-center space-x-3 min-w-[280px] max-w-md border backdrop-blur-xl animate-slideDown',
          toastTypeClass(toast.type)
        ]"
      >
        <span class="text-lg">{{ toastIcon(toast.type) }}</span>
        <span class="flex-1 text-sm font-medium">{{ toast.message }}</span>
        <button @click="removeToast(toast.id)" class="opacity-60 hover:opacity-100 transition-opacity">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    </TransitionGroup>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface Toast {
  id: number
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
}

const toasts = ref<Toast[]>([])
let toastId = 0

const toastTypeClass = (type: string) => {
  const classes = {
    success: 'bg-[#2dd4a6]/20 text-[#2dd4a6] border-[#2dd4a6]/30',
    error: 'bg-[#f87171]/20 text-[#f87171] border-[#f87171]/30',
    warning: 'bg-[#d4a574]/20 text-[#d4a574] border-[#d4a574]/30',
    info: 'bg-[#60a5fa]/20 text-[#60a5fa] border-[#60a5fa]/30'
  }
  return classes[type] || classes.info
}

const toastIcon = (type: string) => {
  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ'
  }
  return icons[type] || icons.info
}

const addToast = (type: Toast['type'], message: string, duration = 3000) => {
  const id = ++toastId
  toasts.value.push({ id, type, message })

  if (duration > 0) {
    setTimeout(() => removeToast(id), duration)
  }
}

const removeToast = (id: number) => {
  const index = toasts.value.findIndex(t => t.id === id)
  if (index !== -1) {
    toasts.value.splice(index, 1)
  }
}

// 全局事件监听
const handleToastEvent = (event: CustomEvent) => {
  const { type, message, duration } = event.detail
  addToast(type, message, duration)
}

onMounted(() => {
  window.addEventListener('show-toast', handleToastEvent as EventListener)
})

onUnmounted(() => {
  window.removeEventListener('show-toast', handleToastEvent as EventListener)
})

// 暴露方法供直接调用
defineExpose({ addToast, removeToast })
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s var(--ease-out-expo);
}

.toast-enter-from {
  opacity: 0;
  transform: translateY(-20px) scale(0.95);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100px) scale(0.98);
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.animate-slideDown {
  animation: slideDown 0.4s var(--ease-out-expo);
}
</style>
