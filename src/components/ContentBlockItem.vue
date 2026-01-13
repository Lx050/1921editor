<template>
  <div 
    class="relative group"
    @dragover.prevent="onDragOver"
    @dragleave="onDragLeave"
    @drop.stop="onDrop"
  >
    <!-- 拖拽上方指示条 -->
    <div 
      v-if="dragPos === 'top'" 
      class="absolute -top-1.5 left-0 right-0 h-1 bg-blue-500 rounded-full z-20 transition-all duration-200"
    ></div>

    <!-- 内容块 - 简洁样式 -->
    <div
      @click.stop="$emit('select', block.id)"
      @dragstart="onDragStart"
      :draggable="true"
      :class="[
        'p-4 rounded-xl transition-all duration-300 relative content-card border',
        isSelected
          ? 'ring-2 ring-blue-400 shadow-lg bg-white border-blue-100'
          : 'bg-white hover:shadow-md border-transparent hover:border-gray-200',
        block.type === 'container' ? 'bg-gray-50/30' : '',
        dragPos === 'inside' ? 'ring-2 ring-blue-400 bg-blue-50/30' : ''
      ]"
    >
      <!-- 顶部栏：类型标签 + 操作按钮 -->
      <div 
        class="flex items-center justify-between mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        :class="{ 'opacity-100': isSelected }"
      >
        <!-- 左侧：类型标签/选择器 -->
        <div class="flex items-center gap-2">
          <select
            v-if="isSelected"
            :value="block.type"
            @change="$emit('changeType', block.id, ($event.target as HTMLSelectElement).value as BlockType)"
            class="px-2 py-1 bg-white border border-gray-300 rounded text-xs font-medium text-black hover:border-blue-400 focus:border-blue-500 focus:outline-none cursor-pointer"
            @click.stop
          >
            <option v-for="option in typeOptions" :key="option.value" :value="option.value">
              {{ option.icon }} {{ option.label }}
            </option>
          </select>
          <span 
            v-else 
            class="px-2 py-1 rounded text-[10px] font-medium border bg-gray-50 text-gray-400 border-gray-100"
          >
            {{ getBlockTypeDisplayName(block.type) }}
          </span>
        </div>

        <!-- 右侧：操作按钮 -->
        <div class="flex items-center gap-1">
          <button 
            v-if="block.type !== 'container'"
            @click.stop="$emit('generateAi', block)"
            class="p-1.5 rounded hover:bg-blue-100 text-blue-500 transition-colors"
            title="AI 图像化"
          >
            <span>✨</span>
          </button>
          <button
            @click.stop="$emit('delete', block.id)"
            class="p-1.5 rounded text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
            title="删除"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- 容器内容：递归渲染子块 -->
      <div v-if="block.type === 'container'" class="space-y-3 min-h-[60px] p-2 bg-gray-50/50 rounded-lg border border-gray-100">
        <div v-if="!block.children || block.children.length === 0" class="text-center py-4 text-xs text-gray-400 italic">
          拖拽其他块到此处进行组合
        </div>
        <ContentBlockItem
          v-for="(child, childIndex) in block.children"
          :key="child.id"
          :block="child"
          :index="childIndex"
          :selectedId="selectedId"
          :typeOptions="typeOptions"
          @select="id => $emit('select', id)"
          @delete="id => $emit('delete', id)"
          @changeType="(id, type) => $emit('changeType', id, type)"
          @generateAi="b => $emit('generateAi', b)"
          @insertText="p => $emit('insertText', p)"
          @insertImage="p => $emit('insertImage', p)"
          @insertContainer="(index, id) => $emit('insertContainer', index, id)"
          @updateText="(id, text) => $emit('updateText', id, text)"
          @move="p => $emit('move', p)"
        />
      </div>

      <!-- 文本内容区 -->
      <div v-else-if="!isImageBlock(block.type)" class="relative">
        <div v-if="block.meta?.aiImageUrl" class="mb-3 relative">
          <img
            :src="block.meta.aiImageUrl as string"
            class="w-full rounded-lg shadow-sm border border-gray-200"
          />
        </div>
        <input
          v-if="block.type === 'title'"
          type="text"
          :value="block.text"
          @input="$emit('updateText', block.id, ($event.target as HTMLInputElement).value)"
          class="w-full px-3 py-2 border-none bg-transparent rounded-lg focus:bg-white focus:ring-1 focus:ring-blue-400 focus:outline-none transition-all text-center text-lg font-bold"
          placeholder="请输入标题..."
          @click.stop
        />
        <textarea
          v-else
          :value="block.text"
          @input="$emit('updateText', block.id, ($event.target as HTMLTextAreaElement).value)"
          class="w-full px-3 py-2 border-none bg-transparent rounded-lg focus:bg-white focus:ring-1 focus:ring-blue-400 focus:outline-none transition-all resize-none"
          rows="2"
          placeholder="请输入正文内容..."
          @click.stop
        ></textarea>
      </div>

      <!-- 图片模板显示 -->
      <div
        v-else-if="isImageBlock(block.type)"
        class="py-4 text-center"
      >
          <div class="flex flex-col items-center justify-center space-y-3">
            <div class="flex items-center space-x-3">
              <span class="text-2xl">
                <span v-if="block.type === 'image_single' || block.type === 'image_single_caption'">🖼️</span>
                <span v-else-if="block.type === 'image_double' || block.type === 'image_double_caption'">🖼️🖼️</span>
              </span>
              <span class="text-sm text-gray-600 font-medium">
                {{ getImagePlaceholder(block.type) }}
              </span>
            </div>
            
            <!-- 单图注编辑区 -->
            <div v-if="block.type === 'image_single_caption'" class="w-full max-w-lg">
              <input 
                type="text" 
                :value="block.text"
                @input="$emit('updateText', block.id, ($event.target as HTMLInputElement).value)"
                class="w-full px-3 py-2 border-none bg-transparent rounded-md text-sm text-center focus:bg-white focus:ring-1 focus:ring-blue-400 focus:outline-none"
                placeholder="请输入图片说明"
                @click.stop
              />
            </div>

            <!-- 双图注编辑区 (分别编辑) -->
            <div v-if="block.type === 'image_double_caption'" class="w-full max-w-lg flex space-x-2">
              <!-- 左图注 -->
              <input 
                type="text" 
                :value="getCaptionParts(block.text)[0]"
                @input="updateDoubleCaption(block, 0, ($event.target as HTMLInputElement).value)"
                class="w-1/2 px-3 py-2 border-none bg-transparent rounded-md text-sm text-center focus:bg-white focus:ring-1 focus:ring-blue-400 focus:outline-none"
                placeholder="左图说明"
                @click.stop
              />
              <!-- 右图注 -->
              <input 
                type="text" 
                :value="getCaptionParts(block.text)[1]"
                @input="updateDoubleCaption(block, 1, ($event.target as HTMLInputElement).value)"
                class="w-1/2 px-3 py-2 border-none bg-transparent rounded-md text-sm text-center focus:bg-white focus:ring-1 focus:ring-blue-400 focus:outline-none"
                placeholder="右图说明"
                @click.stop
              />
            </div>
          </div>
      </div>
    </div>

    <!-- 拖拽下方指示条 -->
    <div 
      v-if="dragPos === 'bottom'" 
      class="absolute -bottom-1.5 left-0 right-0 h-1 bg-blue-500 rounded-full z-20 transition-all duration-200"
    ></div>

    <!-- 底部插入器 -->
    <div class="flex justify-center mt-2">
      <LayoutInserter
        :index="props.index"
        @insert-image="$emit('insertImage', { index: props.index, type: $event, id: props.block.id })"
        @insert-text="$emit('insertText', { index: props.index, type: $event, id: props.block.id })"
        @insert-container="$emit('insertContainer', props.index, props.block.id)"
        @open-merge="$emit('openMerge', { index: props.index, id: props.block.id })"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { ContentBlock, BlockType } from '../types'
import { getBlockTypeDisplayName } from '../utils/styleAssembler'
import LayoutInserter from './LayoutInserter.vue'

interface BlockTypeOption {
  value: BlockType
  label: string
  icon: string
}

const props = defineProps<{
  block: ContentBlock
  index: number
  selectedId: string | null
  typeOptions: BlockTypeOption[]
}>()

const emit = defineEmits(['select', 'delete', 'updateText', 'changeType', 'generateAi', 'insertText', 'insertImage', 'insertContainer', 'move', 'openMerge'])

const dragPos = ref<'none' | 'top' | 'bottom' | 'inside'>('none')

const isSelected = computed(() => props.selectedId === props.block.id)

const isImageBlock = (type: string) => {
  return ['image_single', 'image_single_caption', 'image_double', 'image_double_caption'].includes(type)
}

const getImagePlaceholder = (type: string) => {
  const placeholders: Record<string, string> = {
    'image_single': '[单图模板]',
    'image_single_caption': '[单图+注模板]',
    'image_double': '[双图模板]',
    'image_double_caption': '[双图+注模板]'
  }
  return placeholders[type] || '[图片]'
}

const getCaptionParts = (text: string) => {
  if (!text) return ['', '']
  if (text.includes('|') || text.includes('｜')) {
    const parts = text.split(/[|｜]/)
    return [parts[0] ? parts[0].trim() : '', parts[1] ? parts[1].trim() : '']
  }
  if (text.trim().includes(' ')) {
      const parts = text.trim().split(/\s+/)
      if (parts.length >= 2) return [parts[0], parts.slice(1).join(' ')]
  }
  return [text, text]
}

const updateDoubleCaption = (block: ContentBlock, index: number, newValue: string) => {
  const parts = getCaptionParts(block.text)
  parts[index] = newValue
  const newText = `${parts[0]} ${parts[1]}`
  emit('updateText', block.id, newText)
}

const onDragStart = (e: DragEvent) => {
  if (e.dataTransfer) {
    e.dataTransfer.setData('blockId', props.block.id)
    e.dataTransfer.effectAllowed = 'move'
  }
}

const onDragOver = (e: DragEvent) => {
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
  const y = e.clientY - rect.top
  const height = rect.height

  if (props.block.type === 'container') {
    if (y < height * 0.2) dragPos.value = 'top'
    else if (y > height * 0.8) dragPos.value = 'bottom'
    else dragPos.value = 'inside'
  } else {
    if (y < height / 2) dragPos.value = 'top'
    else dragPos.value = 'bottom'
  }
  if (e.dataTransfer) e.dataTransfer.dropEffect = 'move'
}

const onDragLeave = () => {
  dragPos.value = 'none'
}

const onDrop = (e: DragEvent) => {
  const draggedId = e.dataTransfer?.getData('blockId')
  const pos = dragPos.value
  dragPos.value = 'none'

  if (draggedId && draggedId !== props.block.id) {
    emit('move', { 
      blockId: draggedId, 
      targetId: props.block.id, 
      position: pos 
    })
  }
}
</script>
