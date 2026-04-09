<script setup lang="ts">
import { ref, computed } from 'vue'

const emit = defineEmits<{
  (e: 'select', emoji: string): void
  (e: 'close'): void
}>()

const props = defineProps<{ visible: boolean }>()

const searchQuery = ref('')

const categories = [
  {
    name: '常用',
    emojis: ['😊', '👍', '❤️', '🎉', '🔥', '✅', '⭐', '💡', '📌', '🎯', '💪', '👏', '🤝', '🙏', '💯', '🚀', '📣', '📢', '🎊', '✨', '🌟', '💐', '🌹', '🎁', '🏆']
  },
  {
    name: '表情',
    emojis: ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '😉', '😍', '🥰', '😘', '😋', '😎', '🤩', '🤔', '😏', '😔', '😢', '😭', '😤', '🥺', '😱', '🤗']
  },
  {
    name: '手势',
    emojis: ['👋', '🤚', '✋', '🖖', '🫱', '🫲', '👌', '🤌', '✌️', '🤞', '🫰', '🤙', '👈', '👉', '👆', '👇', '☝️', '🫵', '🤲', '🤝', '🙌', '👐', '🤜', '🤛', '✊']
  },
  {
    name: '符号',
    emojis: ['❗', '❓', '‼️', '⁉️', '💬', '💭', '🗯️', '♨️', '🔴', '🟠', '🟡', '🟢', '🔵', '🟣', '⚫', '⚪', '🔶', '🔷', '▶️', '⏩', '⏸️', '⏹️', '🔔', '📎', '🔗']
  },
  {
    name: '自然',
    emojis: ['🌸', '🌺', '🌻', '🌷', '🌱', '🌿', '🍀', '🍃', '🌲', '🌳', '🌾', '☀️', '🌤️', '⛅', '🌈', '❄️', '💧', '🌊', '🍎', '🍊', '🍋', '🍇', '🍓', '🍑', '🍒']
  }
]

const activeCategory = ref(0)

const filteredEmojis = computed(() => {
  if (!searchQuery.value) return categories[activeCategory.value].emojis
  const q = searchQuery.value.toLowerCase()
  return categories.flatMap(c => c.emojis).filter(e => e.includes(q))
})

function selectEmoji(emoji: string) {
  emit('select', emoji)
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
      @click="emit('close')"
    >
      <div
        class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl border w-[320px] overflow-hidden"
        style="box-shadow:var(--shadow-float);"
        @click.stop
      >
        <div class="px-3 pt-3 pb-2">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜索表情..."
            class="w-full px-3 py-1.5 text-sm border rounded-lg focus:outline-none"
            style="--tw-ring-color: var(--color-accent-focus);"
          />
        </div>

        <div v-if="!searchQuery" class="flex border-b px-2 gap-0.5">
          <button
            v-for="(cat, i) in categories"
            :key="cat.name"
            class="px-2 py-1.5 text-[11px] rounded-t transition-colors"
            :class="activeCategory === i ? 'font-medium' : ''"
            :style="activeCategory === i ? 'background: var(--color-badge-bg); color: var(--color-accent-primary);' : 'color:var(--color-text-muted);'"
            @mouseover="(e) => { if (activeCategory !== i) (e.currentTarget as HTMLElement).style.color = 'rgba(0,0,0,0.55)'; }"
            @mouseout="(e) => { if (activeCategory !== i) (e.currentTarget as HTMLElement).style.color = 'var(--color-text-muted)'; }"
            @click="activeCategory = i"
          >{{ cat.name }}</button>
        </div>

        <div class="grid grid-cols-8 gap-0.5 p-2 max-h-[200px] overflow-y-auto">
          <button
            v-for="emoji in filteredEmojis"
            :key="emoji"
            class="w-8 h-8 flex items-center justify-center text-lg rounded transition-colors cursor-pointer"
            @mouseover="($event.currentTarget as HTMLElement).style.background='var(--color-bg-warm)'"
            @mouseout="($event.currentTarget as HTMLElement).style.background=''"
            @click="selectEmoji(emoji)"
          >{{ emoji }}</button>
        </div>

        <div v-if="filteredEmojis.length === 0" class="py-6 text-center text-sm" style="color:var(--color-text-muted);">
          无匹配表情
        </div>
      </div>
    </div>
    </Transition>
  </Teleport>
</template>
