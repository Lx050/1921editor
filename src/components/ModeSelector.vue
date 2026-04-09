<template>
  <div class="space-y-3">
    <div
      v-for="mode in modes"
      :key="mode.value"
      @click="$emit('update:modelValue', mode.value)"
      :class="[
        'border rounded-lg p-4 cursor-pointer flex items-center space-x-4 transition-all',
        modelValue === mode.value ? '' : ''
      ]"
      :style="modelValue === mode.value
        ? 'border-color: var(--color-accent-primary); box-shadow: 0 0 0 2px var(--color-accent-primary); background: var(--color-badge-bg);'
        : 'border-color: rgba(0,0,0,0.08);'"
      @mouseover="(e) => { if (modelValue !== mode.value) (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,117,222,0.4)'; }"
      @mouseout="(e) => { if (modelValue !== mode.value) (e.currentTarget as HTMLElement).style.borderColor = ''; }"
    >
      <div class="text-2xl">{{ mode.icon }}</div>
      <div>
        <h4 class="font-bold" style="color:rgba(0,0,0,0.85);">{{ mode.label }}</h4>
        <p class="text-sm" style="color:rgba(0,0,0,0.45);">{{ mode.description }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: string
}>()

defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const modes = [
  { value: 'daily', label: '日常模式', icon: '📝', description: '日常公众号内容排版' },
  { value: 'three_rural', label: '三下乡模式', icon: '🏡', description: '三下乡专项活动排版' },
  { value: 'reprint', label: '转载模式', icon: '📋', description: '转载文章排版模板' }
]
</script>
