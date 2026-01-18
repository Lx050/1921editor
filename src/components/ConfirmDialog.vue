<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="visible"
        class="fixed inset-0 z-[9998] flex items-center justify-center p-4"
      >
        <!-- 背景遮罩 -->
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="handleCancel"></div>

        <!-- 对话框 -->
        <div class="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in duration-200">
          <!-- 图标 -->
          <div class="flex justify-center mb-4">
            <div :class="['w-14 h-14 rounded-full flex items-center justify-center', iconBgClass]">
              <span class="text-2xl">{{ icon }}</span>
            </div>
          </div>

          <!-- 标题 -->
          <h3 class="text-lg font-bold text-center text-gray-900 mb-2">
            {{ title }}
          </h3>

          <!-- 消息 -->
          <p class="text-sm text-center text-gray-600 mb-6 whitespace-pre-line">
            {{ message }}
          </p>

          <!-- 按钮组 -->
          <div class="flex gap-3">
            <button
              v-if="showCancel"
              @click="handleCancel"
              class="flex-1 h-11 px-4 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-xl transition-all active:scale-[0.98]"
            >
              {{ cancelText }}
            </button>
            <button
              @click="handleConfirm"
              :class="[
                'flex-1 h-11 px-4 text-white text-sm font-bold rounded-xl transition-all active:scale-[0.98]',
                confirmBtnClass
              ]"
            >
              {{ confirmText }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

interface ConfirmOptions {
  title?: string
  message: string
  confirmText?: string
  cancelText?: string
  type?: 'warning' | 'danger' | 'info'
  showCancel?: boolean
}

const visible = ref(false)
const title = ref('')
const message = ref('')
const confirmText = ref('确定')
const cancelText = ref('取消')
const type = ref<'warning' | 'danger' | 'info'>('warning')
const showCancel = ref(true)
let resolvePromise: ((value: boolean) => void) | null = null

const icon = computed(() => {
  const icons = {
    warning: '⚠️',
    danger: '🗑️',
    info: 'ℹ️'
  }
  return icons[type.value]
})

const iconBgClass = computed(() => {
  const classes = {
    warning: 'bg-yellow-100',
    danger: 'bg-red-100',
    info: 'bg-blue-100'
  }
  return classes[type.value]
})

const confirmBtnClass = computed(() => {
  const classes = {
    warning: 'bg-orange-500 hover:bg-orange-600',
    danger: 'bg-red-500 hover:bg-red-600',
    info: 'bg-blue-500 hover:bg-blue-600'
  }
  return classes[type.value]
})

const show = (options: ConfirmOptions): Promise<boolean> => {
  title.value = options.title || '确认操作'
  message.value = options.message
  confirmText.value = options.confirmText || '确定'
  cancelText.value = options.cancelText || '取消'
  type.value = options.type || 'warning'
  showCancel.value = options.showCancel !== false

  visible.value = true

  return new Promise((resolve) => {
    resolvePromise = resolve
  })
}

const handleConfirm = () => {
  visible.value = false
  if (resolvePromise) {
    resolvePromise(true)
    resolvePromise = null
  }
  window.dispatchEvent(new CustomEvent('confirm-result', { detail: true }))
}

const handleCancel = () => {
  visible.value = false
  if (resolvePromise) {
    resolvePromise(false)
    resolvePromise = null
  }
  window.dispatchEvent(new CustomEvent('confirm-result', { detail: false }))
}

// ESC 键取消
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && visible.value) {
    handleCancel()
  }
}

// 全局事件监听
const handleConfirmEvent = (event: CustomEvent) => {
  const options = event.detail
  show(options)
}

onMounted(() => {
  window.addEventListener('show-confirm', handleConfirmEvent as EventListener)
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('show-confirm', handleConfirmEvent as EventListener)
  window.removeEventListener('keydown', handleKeydown)
})

defineExpose({ show })
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .relative,
.modal-leave-to .relative {
  transform: scale(0.95);
}

@keyframes zoom-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-in.zoom-in {
  animation: zoom-in 0.2s ease-out;
}
</style>
