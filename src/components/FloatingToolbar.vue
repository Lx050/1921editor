<template>
  <div
    v-if="visible"
    class="absolute z-10 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-2"
    :style="{ left: position.x + 'px', top: position.y + 'px' }"
  >
    <div class="text-xs text-gray-500 mb-2 px-2">设置类型</div>
    <div class="flex flex-col space-y-1">
      <button
        v-for="option in typeOptions"
        :key="option.value"
        @click="selectType(option.value)"
        :class="[
          'px-3 py-2 text-left text-sm rounded-md transition-colors flex items-center justify-between',
          blockType === option.value
            ? 'bg-blue-100 text-blue-700 font-medium'
            : 'hover:bg-gray-100 text-gray-700'
        ]"
      >
        <span>{{ option.label }}</span>
        <span
          v-if="blockType === option.value"
          class="text-blue-600"
        >
          ✓
        </span>
      </button>
    </div>
  </div>
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