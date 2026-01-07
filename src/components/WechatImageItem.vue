<template>
  <div
    @click="$emit('select', image)"
    :class="[
      'relative overflow-hidden cursor-pointer transition-all bg-gray-100',
      mobileLayout ? 'flex-shrink-0 w-14 h-14 rounded' : 'rounded-lg',
      selectedPlaceholder
        ? (mobileLayout 
            ? 'ring-2 ring-blue-500 active:scale-95' 
            : 'hover:ring-4 hover:ring-blue-400 hover:shadow-lg transform hover:scale-[1.02]')
        : 'opacity-60 cursor-not-allowed'
    ]"
  >
    <LazyImage
      :src="image.displayUrl"
      :alt="image.name"
      :width="mobileLayout ? 56 : 200"
      :height="mobileLayout ? 56 : 150"
      :class="mobileLayout ? 'w-full h-full' : 'aspect-[4/3]'"
      img-class="w-full h-full object-cover"
      :placeholder="true"
      :threshold="0.1"
    />

    <!-- 桌面端显示名称 -->
    <div v-if="!mobileLayout" class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-2 py-1.5">
      <p class="text-xs text-white truncate">{{ image.name }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import LazyImage from './LazyImage.vue'

defineProps<{
  image: any & { displayUrl: string }
  selectedPlaceholder?: string | null
  mobileLayout?: boolean
}>()

defineEmits<{
  (e: 'select', image: any): void
}>()
</script>
