<template>
  <div
    class="virtual-scroll-container"
    :style="containerStyle"
    @scroll="handleScroll"
  >
    <!-- 总高度占位符 -->
    <div class="virtual-scroll-spacer" :style="{ height: `${totalHeight}px` }"></div>

    <!-- 可见项目容器 -->
    <div class="virtual-scroll-viewport" :style="viewportStyle">
      <div
        v-for="item in visibleItems"
        :key="getItemKey(item)"
        class="virtual-scroll-item"
        :style="getItemStyle(item)"
      >
        <slot :item="item" :index="item.index"></slot>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="virtual-scroll-loading">
      <slot name="loading">
        <div class="loading-placeholder">加载中...</div>
      </slot>
    </div>

    <!-- 空状态 -->
    <div v-if="!loading && items.length === 0" class="virtual-scroll-empty">
      <slot name="empty">
        <div class="empty-placeholder">暂无数据</div>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';

interface Props {
  items: any[]
  itemHeight?: number | ((index: number) => number)
  containerHeight?: number
  overscan?: number
  keyField?: string
  loading?: boolean
  buffer?: number
}

interface VirtualItem {
  index: number
  data: any
  top: number
  height: number
  bottom: number
}

const props = withDefaults(defineProps<Props>(), {
  itemHeight: 50,
  containerHeight: 400,
  overscan: 5,
  keyField: 'id',
  loading: false,
  buffer: 200
})

const emit = defineEmits<{
  scroll: [{ scrollTop: number; scrollLeft: number }]
  itemVisible: [{ item: any; index: number }]
}>()

const containerRef = ref<HTMLElement>()
const scrollTop = ref(0)
const containerHeight = ref(props.containerHeight)

// 计算总高度
const totalHeight = computed(() => {
  if (typeof props.itemHeight === 'function') {
    return props.items.reduce((sum, _, index) => sum + props.itemHeight!(index), 0)
  }
  return props.items.length * props.itemHeight
})

// 计算可见项目
const visibleItems = computed(() => {
  if (props.items.length === 0) return []

  const start = Math.max(0, Math.floor(scrollTop.value / getAverageItemHeight()) - props.overscan)
  const end = Math.min(
    props.items.length,
    Math.ceil((scrollTop.value + containerHeight.value) / getAverageItemHeight()) + props.overscan
  )

  const items: VirtualItem[] = []
  let currentTop = 0

  for (let i = 0; i < props.items.length; i++) {
    const itemHeight = getItemHeight(i)
    const itemBottom = currentTop + itemHeight

    if (i >= start && i < end) {
      items.push({
        index: i,
        data: props.items[i],
        top: currentTop,
        height: itemHeight,
        bottom: itemBottom
      })
    }

    currentTop = itemBottom
  }

  return items
})

// 容器样式
const containerStyle = computed(() => ({
  height: `${containerHeight.value}px`,
  overflow: 'auto',
  position: 'relative'
}))

// 视口样式
const viewportStyle = computed(() => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  transform: `translateY(${Math.min(...visibleItems.value.map(item => item.top))}px)`
}))

// 获取项目高度
const getItemHeight = (index: number): number => {
  if (typeof props.itemHeight === 'function') {
    return props.itemHeight!(index)
  }
  return props.itemHeight
}

// 获取平均项目高度
const getAverageItemHeight = (): number => {
  if (typeof props.itemHeight === 'function') {
    return props.items.length > 0
      ? props.items.reduce((sum, _, index) => sum + props.itemHeight!(index), 0) / props.items.length
      : props.itemHeight
  }
  return props.itemHeight
}

// 获取项目唯一标识
const getItemKey = (item: VirtualItem): any => {
  return item.data[props.keyField] ?? item.index
}

// 获取项目样式
const getItemStyle = (item: VirtualItem): object => {
  return {
    position: 'absolute',
    top: `${item.top}px`,
    left: '0',
    right: '0',
    height: `${item.height}px`
  }
}

// 处理滚动
const handleScroll = (event: Event) => {
  const target = event.target as HTMLElement
  scrollTop.value = target.scrollTop

  emit('scroll', {
    scrollTop: target.scrollTop,
    scrollLeft: target.scrollLeft
  })

  // 通知可见项目
  visibleItems.value.forEach(item => {
    emit('itemVisible', { item: item.data, index: item.index })
  })
}

// 滚动到指定项目
const scrollToItem = (index: number, alignment: 'auto' | 'smart' | 'center' | 'end' | 'start' = 'auto') => {
  if (!containerRef.value || index < 0 || index >= props.items.length) return

  let targetScrollTop = 0
  let currentTop = 0

  // 计算目标项目的位置
  for (let i = 0; i < index; i++) {
    currentTop += getItemHeight(i)
  }

  const itemHeight = getItemHeight(index)
  const viewportHeight = containerHeight.value

  switch (alignment) {
    case 'start':
      targetScrollTop = currentTop
      break
    case 'end':
      targetScrollTop = currentTop + itemHeight - viewportHeight
      break
    case 'center':
      targetScrollTop = currentTop - (viewportHeight - itemHeight) / 2
      break
    case 'smart':
    default:
      if (currentTop < scrollTop.value) {
        targetScrollTop = currentTop
      } else if (currentTop + itemHeight > scrollTop.value + viewportHeight) {
        targetScrollTop = currentTop + itemHeight - viewportHeight
      }
      break
  }

  containerRef.value.scrollTo({
    top: Math.max(0, targetScrollTop),
    behavior: 'smooth'
  })
}

// 滚动到指定位置
const scrollToPosition = (position: number) => {
  if (containerRef.value) {
    containerRef.value.scrollTo({
      top: Math.max(0, position),
      behavior: 'smooth'
    })
  }
}

// 获取滚动信息
const getScrollInfo = () => {
  return {
    scrollTop: scrollTop.value,
    scrollHeight: totalHeight.value,
    clientHeight: containerHeight.value,
    scrollPercentage: totalHeight.value > 0
      ? (scrollTop.value / (totalHeight.value - containerHeight.value)) * 100
      : 0
  }
}

// 暴露方法给父组件
defineExpose({
  scrollToItem,
  scrollToPosition,
  getScrollInfo,
  containerRef
})

// 监听容器高度变化
watch(() => props.containerHeight, (newHeight) => {
  containerHeight.value = newHeight
})

// 监听项目变化，重置滚动位置
watch(() => props.items.length, () => {
  if (props.items.length === 0) {
    scrollTop.value = 0
  }
})
</script>

<style scoped>
.virtual-scroll-container {
  position: relative;
}

.virtual-scroll-spacer {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  pointer-events: none;
}

.virtual-scroll-viewport {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
}

.virtual-scroll-item {
  box-sizing: border-box;
}

.virtual-scroll-loading,
.virtual-scroll-empty {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.8);
}

.loading-placeholder,
.empty-placeholder {
  padding: 20px;
  color: #666;
  font-size: 14px;
  text-align: center;
}

/* 优化滚动性能 */
.virtual-scroll-container {
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
}

/* 自定义滚动条 */
.virtual-scroll-container::-webkit-scrollbar {
  width: 8px;
}

.virtual-scroll-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.virtual-scroll-container::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.virtual-scroll-container::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>