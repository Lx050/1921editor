<template>
  <Transition
    enter-active-class="transition-all duration-150 ease-out"
    leave-active-class="transition-all duration-100 ease-in"
    enter-from-class="opacity-0 scale-95"
    leave-to-class="opacity-0 scale-95"
  >
  <div
    v-if="visible"
    class="absolute z-10 mt-2 rounded-xl p-2"
    style="background:var(--color-bg-card); border:1px solid rgba(0,0,0,0.1); border-radius:var(--radius-md); box-shadow:var(--shadow-float);"
    :style="{ left: position.x + 'px', top: position.y + 'px' }"
  >
    <div style="font-size:11px; font-weight:600; color:rgba(0,0,0,0.4); text-transform:uppercase; letter-spacing:0.06em; margin-bottom:6px; padding:0 8px;">设置类型</div>
    <div class="flex flex-col space-y-1">
      <button
        v-for="option in typeOptions"
        :key="option.value"
        @click="selectType(option.value)"
        :class="[
          'px-3 py-2 text-left text-sm rounded-md transition-all duration-200 flex items-center justify-between',
          blockType === option.value
            ? 'font-medium'
            : ''
        ]"
        :style="blockType === option.value
          ? 'background:var(--color-badge-bg); color:var(--color-accent-primary);'
          : 'color:rgba(0,0,0,0.6);'"
        @mouseover="blockType !== option.value && ($event.currentTarget.style.background = 'rgba(0,0,0,0.04)')"
        @mouseout="blockType !== option.value && ($event.currentTarget.style.background = '')"
      >
        <span>{{ option.label }}</span>
        <span
          v-if="blockType === option.value"
          style="color:var(--color-accent-primary);"
        >
          ✓
        </span>
      </button>
    </div>
  </div>
  </Transition>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { getBlockTypeOptions } from '../utils/styleAssembler'

const props = defineProps({
  blockType: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['changeType'])

const visible = ref(true)
const position = ref({ x: 0, y: 0 })

const typeOptions = computed(() => getBlockTypeOptions())

// 选择类型
const selectType = (type) => {
  emit('changeType', type)
  visible.value = false
}

// 点击外部关闭工具栏
const handleClickOutside = (event) => {
  if (!event.target.closest('.floating-toolbar')) {
    visible.value = false
  }
}

onMounted(() => {
  // 设置工具栏位置
  position.value = { x: 0, y: 50 }

  // 添加点击外部事件监听
  document.addEventListener('click', handleClickOutside)
  document.body.classList.add('floating-toolbar')
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  document.body.classList.remove('floating-toolbar')
})
</script>

<style scoped>
.floating-toolbar {
  position: relative;
}

/* 确保工具栏在最上层 */
:global(.floating-toolbar) {
  position: relative;
  z-index: 9999;
}
</style>