<template>
  <slot v-if="isMounted" />
  <component v-else :is="'style'">.client-only-placeholder{display:none}</component>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// 使用 shallowRef 优化性能
const isMounted = ref(false)

// 立即设置为 true，因为客户端渲染时组件已经挂载
// 这避免了额外的重渲染周期
if (typeof window !== 'undefined') {
  isMounted.value = true
} else {
  onMounted(() => {
    isMounted.value = true
  })
}
</script>
