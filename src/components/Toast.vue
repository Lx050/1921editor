<template>
  <Teleport to="body">
    <TransitionGroup name="toast" tag="div" class="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] flex flex-col items-center space-y-2">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="animate-slideDown"
        :style="toastStyle(toast.type)"
      >
        <span class="text-lg">{{ toastIcon(toast.type) }}</span>
        <span class="flex-1 text-sm font-medium">{{ toast.message }}</span>
        <button @click="removeToast(toast.id)" class="opacity-60 hover:opacity-100 transition-opacity" title="关闭通知" aria-label="关闭通知">
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

const toastStyle = (type: string) => {
  const styles: Record<string, string> = {
    success: 'background:var(--color-bg-card); border:1px solid var(--color-success-border); color:var(--color-success); box-shadow:var(--shadow-content-card);',
    error: 'background:var(--color-bg-card); border:1px solid var(--color-error-border); color:var(--color-error); box-shadow:var(--shadow-content-card);',
    warning: 'background:var(--color-bg-card); border:1px solid var(--color-warning-border); color:var(--color-warning); box-shadow:var(--shadow-content-card);',
    info: 'background:var(--color-bg-card); border:1px solid rgba(0,117,222,0.2); color:#0075de; box-shadow:var(--shadow-content-card);'
  }
  const base = 'display:flex; align-items:center; gap:12px; padding:12px 16px; border-radius:8px; min-width:280px; max-width:400px; font-size:13px; font-weight:500;'
  return base + (styles[type] || styles.info)
}

const toastIcon = (type: string) => {
  const icons: Record<string, string> = {
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
  transform: translateY(-20px) scale(0.95);
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
