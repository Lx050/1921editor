<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'

const props = defineProps<{
  visible: boolean
  initialUrl: string
  position: { x: number; y: number }
}>()

const emit = defineEmits<{
  (e: 'confirm', url: string): void
  (e: 'remove'): void
  (e: 'close'): void
}>()

const urlInput = ref('')
const inputRef = ref<HTMLInputElement | null>(null)

watch(() => props.visible, async (v) => {
  if (v) {
    urlInput.value = props.initialUrl || 'https://'
    await nextTick()
    inputRef.value?.focus()
    inputRef.value?.select()
  }
})

function handleConfirm() {
  const url = urlInput.value.trim()
  if (url && url !== 'https://') {
    emit('confirm', url)
  }
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter') {
    event.preventDefault()
    handleConfirm()
  }
  if (event.key === 'Escape') {
    event.preventDefault()
    emit('close')
  }
}
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-all duration-150 ease-out"
      leave-active-class="transition-all duration-100 ease-in"
      enter-from-class="opacity-0 scale-95"
      leave-to-class="opacity-0 scale-95"
    >
    <div
      v-if="visible"
      class="fixed inset-0 z-[150]"
      @mousedown.self="emit('close')"
    >
      <div
        class="fixed z-[151] bg-white rounded-lg shadow-xl p-3 w-[320px]"
        style="border:1px solid rgba(0,0,0,0.08);"
        :style="{ left: position.x + 'px', top: position.y + 'px', transform: 'translate(-50%, 4px)' }"
        @mousedown.stop
      >
        <div class="text-xs font-medium mb-2" style="color:rgba(0,0,0,0.55);">Edit Link</div>
        <div class="flex gap-2">
          <input
            ref="inputRef"
            v-model="urlInput"
            type="url"
            placeholder="https://example.com"
            class="flex-1 text-sm rounded px-2 py-1.5 outline-none focus:ring-1"
            style="border:1px solid rgba(0,0,0,0.12); --tw-ring-color: var(--color-accent-primary);"
            @keydown="handleKeydown"
          />
          <button
            class="px-3 py-1.5 text-white text-xs rounded transition-colors flex-shrink-0"
            style="background: var(--color-accent-primary);"
            onmouseover="this.style.background='var(--color-accent-hover)';"
            onmouseout="this.style.background='var(--color-accent-primary)';"
            @click="handleConfirm"
          >OK</button>
        </div>
        <div class="flex justify-between items-center mt-2">
          <button
            v-if="initialUrl"
            class="text-xs text-red-500 hover:text-red-700 transition-colors"
            @click="emit('remove')"
          >Remove link</button>
          <span v-else />
          <button
            class="text-xs transition-colors"
            style="color:var(--color-text-muted);"
            @mouseover="($event.target as HTMLElement).style.color='rgba(0,0,0,0.55)'"
            @mouseout="($event.target as HTMLElement).style.color='var(--color-text-muted)'"
            @click="emit('close')"
          >Cancel</button>
        </div>
      </div>
    </div>
    </Transition>
  </Teleport>
</template>
