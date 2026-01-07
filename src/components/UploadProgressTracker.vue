<template>
  <div class="upload-progress-tracker">
    <!-- 总体进度 -->
    <div class="mb-3">
      <div class="flex justify-between items-center mb-1">
        <span class="text-sm font-medium text-gray-700">{{ title }}</span>
        <span class="text-sm text-gray-500">{{ overallProgress }}%</span>
      </div>
      <div class="w-full bg-gray-200 rounded-full h-2">
        <div
          class="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
          :style="{ width: `${overallProgress}%` }"
        ></div>
      </div>
    </div>

    <!-- 详细进度列表 -->
    <div class="space-y-2 max-h-60 overflow-y-auto">
      <div
        v-for="task in tasks"
        :key="task.id"
        class="flex items-center p-2 bg-white rounded-lg border border-gray-200"
        :class="{
          'border-green-300 bg-green-50': task.status === 'completed',
          'border-red-300 bg-red-50': task.status === 'failed',
          'border-blue-300 bg-blue-50': ['downloading', 'uploading', 'retrying'].includes(task.status)
        }"
      >
        <!-- 状态图标 -->
        <div class="mr-3 flex-shrink-0">
          <div v-if="task.status === 'pending'" class="w-4 h-4 border-2 border-gray-300 rounded-full"></div>
          <div v-else-if="task.status === 'downloading'" class="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <div v-else-if="task.status === 'uploading'" class="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <div v-else-if="task.status === 'completed'" class="w-4 h-4 bg-green-600 rounded-full flex items-center justify-center">
            <svg class="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
          </div>
          <div v-else-if="task.status === 'failed'" class="w-4 h-4 bg-red-600 rounded-full flex items-center justify-center">
            <svg class="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </div>
          <div v-else-if="task.status === 'retrying'" class="w-4 h-4 border-2 border-yellow-600 border-t-transparent rounded-full animate-spin"></div>
        </div>

        <!-- 任务内容 -->
        <div class="flex-1 min-w-0">
          <div class="text-sm font-medium text-gray-900 truncate">
            {{ getTaskName(task) }}
          </div>
          <div class="text-xs text-gray-500 truncate">
            {{ task.message }}
          </div>
          <!-- 进度条 -->
          <div v-if="task.status !== 'completed' && task.status !== 'failed'" class="mt-1">
            <div class="w-full bg-gray-200 rounded-full h-1">
              <div
                class="bg-blue-600 h-1 rounded-full transition-all duration-300"
                :style="{ width: `${task.progress}%` }"
              ></div>
            </div>
          </div>
        </div>

        <!-- 速度信息 -->
        <div v-if="task.speed" class="ml-3 text-xs text-gray-500 flex-shrink-0">
          {{ formatSpeed(task.speed) }}
        </div>

        <!-- 错误信息 -->
        <div v-if="task.error" class="ml-3 text-xs text-red-600 max-w-xs truncate">
          {{ task.error }}
        </div>
      </div>
    </div>

    <!-- 统计信息 -->
    <div class="mt-3 pt-3 border-t border-gray-200">
      <div class="flex justify-between text-xs text-gray-600">
        <span>总计: {{ totalTasks }}</span>
        <span class="text-green-600">完成: {{ completedTasks }}</span>
        <span v-if="failedTasks > 0" class="text-red-600">失败: {{ failedTasks }}</span>
        <span class="text-blue-600">进行中: {{ activeTasks }}</span>
      </div>
    </div>

    <!-- 操作按钮 -->
    <div v-if="showControls" class="mt-3 flex space-x-2">
      <button
        v-if="canPause"
        @click="pause"
        class="px-3 py-1 text-sm bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition-colors"
      >
        暂停
      </button>
      <button
        v-if="canResume"
        @click="resume"
        class="px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
      >
        继续
      </button>
      <button
        v-if="canCancel"
        @click="cancel"
        class="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
      >
        取消
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

interface Props {
  title?: string
  showControls?: boolean
  autoHide?: boolean // 完成后自动隐藏
}

interface TaskProgress {
  id: string
  url?: string
  status: 'pending' | 'downloading' | 'uploading' | 'completed' | 'failed' | 'retrying'
  progress: number
  message: string
  error?: string
  speed?: number
}

const props = withDefaults(defineProps<Props>(), {
  title: '上传进度',
  showControls: true,
  autoHide: false
})

const emit = defineEmits<{
  pause: []
  resume: []
  cancel: []
}>()

// 任务列表
const tasks = ref<TaskProgress[]>([])
const isPaused = ref(false)
const isCancelled = ref(false)

// 计算属性
const totalTasks = computed(() => tasks.value.length)
const completedTasks = computed(() => tasks.value.filter(t => t.status === 'completed').length)
const failedTasks = computed(() => tasks.value.filter(t => t.status === 'failed').length)
const activeTasks = computed(() => tasks.value.filter(t => ['downloading', 'uploading', 'retrying'].includes(t.status)).length)

const overallProgress = computed(() => {
  if (totalTasks.value === 0) return 0
  return Math.round((completedTasks.value / totalTasks.value) * 100)
})

const canPause = computed(() => activeTasks.value > 0 && !isPaused.value)
const canResume = computed(() => isPaused.value && !isCancelled.value)
const canCancel = computed(() => !isCancelled.value && (activeTasks.value > 0 || completedTasks.value < totalTasks.value))



// 方法
const addTask = (task: Omit<TaskProgress, 'id'>) => {
  const newTask: TaskProgress = {
    ...task,
    id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }
  tasks.value.push(newTask)
  return newTask.id
}

const updateTask = (id: string, updates: Partial<TaskProgress>) => {
  const index = tasks.value.findIndex(t => t.id === id)
  if (index !== -1) {
    tasks.value[index] = { ...tasks.value[index], ...updates }
  }
}

const removeTask = (id: string) => {
  const index = tasks.value.findIndex(t => t.id === id)
  if (index !== -1) {
    tasks.value.splice(index, 1)
  }
}

const clearCompleted = () => {
  tasks.value = tasks.value.filter(t => t.status !== 'completed')
}

const clearAll = () => {
  tasks.value = []
  isPaused.value = false
  isCancelled.value = false
}

const getTaskName = (task: TaskProgress): string => {
  if (task.url) {
    // 从URL提取文件名
    const matches = task.url.match(/\/([^\/]+\.(png|jpg|jpeg|gif|webp|avif))$/i)
    return matches ? matches[1] : task.url
  }
  return task.id
}

const formatSpeed = (bytesPerSecond: number): string => {
  if (bytesPerSecond === 0) return '0 B/s'

  const units = ['B/s', 'KB/s', 'MB/s', 'GB/s']
  let size = bytesPerSecond
  let unitIndex = 0

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex++
  }

  return `${size.toFixed(1)} ${units[unitIndex]}`
}

const pause = () => emit('pause')
const resume = () => emit('resume')
const cancel = () => emit('cancel')

// 暴露方法给父组件
defineExpose({
  addTask,
  updateTask,
  removeTask,
  clearCompleted,
  clearAll,
  pause: () => isPaused.value = true,
  resume: () => isPaused.value = false,
  cancel: () => isCancelled.value = true
})
</script>

<style scoped>
.upload-progress-tracker {
  @apply bg-white border border-gray-200 rounded-lg p-4;
}

/* 自定义滚动条 */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  @apply bg-gray-100 rounded;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  @apply bg-gray-300 rounded;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  @apply bg-gray-400;
}
</style>