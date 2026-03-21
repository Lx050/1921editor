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
    <div
      v-if="visible"
      class="fixed inset-0 z-[150]"
      @click="emit('close')"
    >
      <div
        class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl border w-[320px] overflow-hidden"
        @click.stop
      >
        <div class="px-3 pt-3 pb-2">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜索表情..."
            class="w-full px-3 py-1.5 text-sm border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-400"
          />
        </div>

        <div v-if="!searchQuery" class="flex border-b px-2 gap-0.5">
          <button
            v-for="(cat, i) in categories"
            :key="cat.name"
            class="px-2 py-1.5 text-[11px] rounded-t transition-colors"
            :class="activeCategory === i ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-400 hover:text-gray-600'"
            @click="activeCategory = i"
          >{{ cat.name }}</button>
        </div>

        <div class="grid grid-cols-8 gap-0.5 p-2 max-h-[200px] overflow-y-auto">
          <button
            v-for="emoji in filteredEmojis"
            :key="emoji"
            class="w-8 h-8 flex items-center justify-center text-lg rounded hover:bg-gray-100 transition-colors cursor-pointer"
            @click="selectEmoji(emoji)"
          >{{ emoji }}</button>
        </div>

        <div v-if="filteredEmojis.length === 0" class="py-6 text-center text-sm text-gray-400">
          无匹配表情
        </div>
      </div>
    </div>
  </Teleport>
</template>
