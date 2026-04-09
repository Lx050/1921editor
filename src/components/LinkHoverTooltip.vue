<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import type { Editor } from '@tiptap/vue-3'

const props = defineProps<{ editor: Editor | null }>()
const emit = defineEmits<{ (e: 'edit-link'): void }>()

const visible = ref(false)
const position = ref({ x: 0, y: 0 })
const linkUrl = ref('')
let hideTimer: ReturnType<typeof setTimeout> | null = null

function handleMouseOver(event: MouseEvent) {
  if (!props.editor) return
  const target = event.target as HTMLElement
  const anchor = target.closest('a')
  if (!anchor) return

  const href = anchor.getAttribute('href')
  if (!href) return

  if (hideTimer) { clearTimeout(hideTimer); hideTimer = null }

  const rect = anchor.getBoundingClientRect()
  linkUrl.value = href
  position.value = { x: rect.left + rect.width / 2, y: rect.bottom + 4 }
  visible.value = true
}

function handleMouseOut(event: MouseEvent) {
  const related = event.relatedTarget as HTMLElement | null
  // Don't hide if moving to the tooltip itself
  if (related?.closest?.('.link-hover-tooltip')) return
  scheduleHide()
}

function scheduleHide() {
  if (hideTimer) clearTimeout(hideTimer)
  hideTimer = setTimeout(() => { visible.value = false }, 300)
}

function cancelHide() {
  if (hideTimer) { clearTimeout(hideTimer); hideTimer = null }
}

function openLink() {
  if (linkUrl.value) {
    window.open(linkUrl.value, '_blank', 'noopener,noreferrer')
  }
  visible.value = false
}

function editLink() {
  emit('edit-link')
  visible.value = false
}

function removeLink() {
  if (!props.editor) return
  props.editor.chain().focus().unsetLink().run()
  visible.value = false
}

function truncateUrl(url: string, max = 40): string {
  if (url.length <= max) return url
  return url.slice(0, max - 3) + '...'
}

onMounted(() => {
  const el = props.editor?.view.dom
  if (el) {
    el.addEventListener('mouseover', handleMouseOver)
    el.addEventListener('mouseout', handleMouseOut)
  }
})

onBeforeUnmount(() => {
  if (hideTimer) clearTimeout(hideTimer)
  const el = props.editor?.view.dom
  if (el) {
    el.removeEventListener('mouseover', handleMouseOver)
    el.removeEventListener('mouseout', handleMouseOut)
  }
})
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
      class="link-hover-tooltip fixed z-[140] rounded-lg px-3 py-2 text-xs"
      style="background:var(--color-bg-card); border:1px solid rgba(0,0,0,0.1); color:rgba(0,0,0,0.7); box-shadow:var(--shadow-float);"
      :style="{ left: position.x + 'px', top: position.y + 'px', transform: 'translateX(-50%)' }"
      @mouseenter="cancelHide"
      @mouseleave="scheduleHide"
    >
      <div class="flex items-center gap-2">
        <span class="truncate max-w-[200px]" style="color:rgba(0,0,0,0.5);" :title="linkUrl">{{ truncateUrl(linkUrl) }}</span>
        <span class="w-px h-3" style="background:rgba(0,0,0,0.1);" />
        <button
          class="transition-colors" style="color:var(--color-accent-primary);"
          @click="openLink"
          title="Open link"
        >Open</button>
        <button
          class="transition-colors" style="color:rgba(0,0,0,0.5);"
          @click="editLink"
          title="Edit link"
        >Edit</button>
        <button
          class="transition-colors" style="color:var(--color-error);"
          @click="removeLink"
          title="Remove link"
        >Remove</button>
      </div>
      <!-- Arrow pointing up -->
      <div class="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45" style="background:var(--color-bg-card); border-left:1px solid rgba(0,0,0,0.1); border-top:1px solid rgba(0,0,0,0.1);" />
    </div>
    </Transition>
  </Teleport>
</template>
