<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

interface DialogState {
  visible: boolean
  title: string
  message: string
  confirmText: string
  cancelText: string
  type: 'info' | 'warning' | 'danger'
  alertMode: boolean
  onConfirm: (() => void) | null
  onCancel: (() => void) | null
}

const state = ref<DialogState>({
  visible: false,
  title: '',
  message: '',
  confirmText: '确定',
  cancelText: '取消',
  type: 'info',
  alertMode: false,
  onConfirm: null,
  onCancel: null,
})

function handleShow(e: Event) {
  const detail = (e as CustomEvent).detail
  state.value = {
    visible: true,
    title: detail.title || '',
    message: detail.message || '',
    confirmText: detail.confirmText || '确定',
    cancelText: detail.cancelText || '取消',
    type: detail.type || 'info',
    alertMode: detail.alertMode || false,
    onConfirm: detail.onConfirm || null,
    onCancel: detail.onCancel || null,
  }
}

function handleConfirm() {
  state.value.onConfirm?.()
  state.value.visible = false
}

function handleCancel() {
  state.value.onCancel?.()
  state.value.visible = false
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') handleCancel()
  if (e.key === 'Enter') handleConfirm()
}

onMounted(() => {
  window.addEventListener('show-confirm', handleShow)
})

onBeforeUnmount(() => {
  window.removeEventListener('show-confirm', handleShow)
})

const typeStyles = {
  info: {
    icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    iconColor: 'var(--color-accent-primary)',
    btnBg: 'var(--color-accent-primary)',
    btnHover: 'var(--color-accent-hover)',
  },
  warning: {
    icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z',
    iconColor: '#d97706',
    btnBg: '#d97706',
    btnHover: '#b45309',
  },
  danger: {
    icon: 'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16',
    iconColor: 'var(--color-danger)',
    btnBg: 'var(--color-danger)',
    btnHover: '#b91c1c',
  },
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
        v-if="state.visible"
        class="fixed inset-0 z-[200] flex items-center justify-center"
        style="background:rgba(0,0,0,0.35);"
        role="dialog"
        aria-modal="true"
        @click.self="handleCancel"
        @keydown="handleKeydown"
        tabindex="-1"
      >
        <div
          class="bg-white rounded-xl w-[360px] max-w-[90vw] overflow-hidden"
          style="box-shadow:var(--shadow-content-card);"
        >
          <!-- Header -->
          <div class="px-5 pt-5 pb-3 flex items-start gap-3">
            <div class="flex-shrink-0 mt-0.5">
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                :style="{ color: typeStyles[state.type].iconColor }"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  :d="typeStyles[state.type].icon"
                />
              </svg>
            </div>
            <div class="flex-1 min-w-0">
              <h3 v-if="state.title" class="text-sm font-semibold mb-1" style="color:rgba(0,0,0,0.85);">
                {{ state.title }}
              </h3>
              <p class="text-sm leading-relaxed whitespace-pre-line" style="color:rgba(0,0,0,0.55);">
                {{ state.message }}
              </p>
            </div>
          </div>

          <!-- Actions -->
          <div class="px-5 pb-4 pt-2 flex justify-end gap-2">
            <button
              v-if="!state.alertMode && state.cancelText"
              class="px-4 py-2 text-sm rounded-lg transition-colors"
              style="color:rgba(0,0,0,0.6); background:rgba(0,0,0,0.04);"
              @mouseover="($event.target as HTMLElement).style.background='rgba(0,0,0,0.08)'"
              @mouseout="($event.target as HTMLElement).style.background='rgba(0,0,0,0.04)'"
              @click="handleCancel"
            >
              {{ state.cancelText }}
            </button>
            <button
              class="px-4 py-2 text-sm text-white rounded-lg transition-colors"
              :style="{ background: typeStyles[state.type].btnBg }"
              @mouseover="($event.target as HTMLElement).style.background = typeStyles[state.type].btnHover"
              @mouseout="($event.target as HTMLElement).style.background = typeStyles[state.type].btnBg"
              @click="handleConfirm"
            >
              {{ state.confirmText }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
