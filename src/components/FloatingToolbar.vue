<template>
  <div
    v-if="visible"
    class="absolute z-10 mt-2 bg-[#141419] border border-white/10 rounded-xl shadow-2xl p-2 backdrop-blur-xl"
    :style="{ left: position.x + 'px', top: position.y + 'px' }"
  >
    <div class="text-xs text-[#606070] mb-2 px-2 uppercase tracking-wider">设置类型</div>
    <div class="flex flex-col space-y-1">
      <button
        v-for="option in typeOptions"
        :key="option.value"
        @click="selectType(option.value)"
        :class="[
          'px-3 py-2 text-left text-sm rounded-md transition-all duration-200 flex items-center justify-between',
          blockType === option.value
            ? 'bg-[#ff6b4a]/20 text-[#ff6b4a] font-medium'
            : 'hover:bg-[#252530] text-[#a0a0b0]'
        ]"
      >
        <span>{{ option.label }}</span>
        <span
          v-if="blockType === option.value"
          class="text-[#ff6b4a]"
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