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
    <div
      v-if="visible"
      class="fixed inset-0 z-[150]"
      @mousedown.self="emit('close')"
    >
      <div
        class="fixed z-[151] bg-white rounded-lg shadow-xl border border-gray-200 p-3 w-[320px]"
        :style="{ left: position.x + 'px', top: position.y + 'px', transform: 'translate(-50%, 4px)' }"
        @mousedown.stop
      >
        <div class="text-xs font-medium text-gray-600 mb-2">Edit Link</div>
        <div class="flex gap-2">
          <input
            ref="inputRef"
            v-model="urlInput"
            type="url"
            placeholder="https://example.com"
            class="flex-1 text-sm border border-gray-300 rounded px-2 py-1.5 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
            @keydown="handleKeydown"
          />
          <button
            class="px-3 py-1.5 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors flex-shrink-0"
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
            class="text-xs text-gray-400 hover:text-gray-600 transition-colors"
            @click="emit('close')"
          >Cancel</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
