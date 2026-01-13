<template>
  <div class="relative group">
    <!-- 内容块 - 简洁样式 -->
    <div
      @click.stop="$emit('select', block.id)"
      @dragover.prevent="onDragOver"
      @drop.stop="onDrop"
      @dragstart="onDragStart"
      :draggable="true"
      :class="[
        'p-4 rounded-xl transition-all duration-200 relative content-card',
        isSelected
          ? 'ring-2 ring-blue-400 shadow-md bg-white'
          : 'hover:shadow-sm bg-white/50',
        block.type === 'container' ? 'border-2 border-dashed border-purple-200 bg-purple-50/20' : ''
      ]"
    >
      <!-- 顶部栏：类型标签 + 操作按钮 -->
      <div class="flex items-center justify-between mb-3">
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
            class="px-2 py-1 rounded text-xs font-medium border"
            style="background: var(--color-content-bg); color: var(--color-content-text-secondary); border-color: var(--color-content-border);"
          >
            {{ getBlockTypeDisplayName(block.type) }}
          </span>
        </div>

        <!-- 右侧：操作按钮 -->
        <div v-if="isSelected" class="flex items-center gap-1">
          <button 
            v-if="block.type !== 'container'"
            @click.stop="$emit('generateAi', block)"
            class="p-1.5 rounded hover:bg-purple-100 text-purple-500 transition-colors"
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
      <div v-if="block.type === 'container'" class="space-y-3 min-h-[60px] p-2 bg-white/40 rounded-lg border border-purple-100">
        <div v-if="!block.children || block.children.length === 0" class="text-center py-4 text-xs text-purple-300 italic">
          拖拽其他块到此处进行嵌套
        </div>
        <ContentBlockItem
          v-for="(child, childIndex) in block.children"
          :key="child.id"
          :block="child"
          :index="childIndex"
          :selectedId="selectedId"
          :typeOptions="typeOptions"
          @select="$emit('select', $event)"
          @delete="$emit('delete', $event)"
          @changeType="$emit('changeType', $event.id, $event.type)"
          @generateAi="$emit('generateAi', $event)"
          @insertText="$emit('insertText', $event)"
          @insertImage="$emit('insertImage', $event)"
          @move="$emit('move', $event)"
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
          class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-blue-400 focus:ring-1 focus:ring-blue-400 focus:outline-none transition-colors text-center text-lg font-bold"
          @click.stop
        />
        <textarea
          v-else
          :value="block.text"
          @input="$emit('updateText', block.id, ($event.target as HTMLTextAreaElement).value)"
          class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-blue-400 focus:ring-1 focus:ring-blue-400 focus:outline-none transition-colors resize-none"
          rows="2"
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
                class="w-full px-3 py-2 border rounded-md text-sm text-center focus:ring-blue-500 focus:border-blue-500"
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
                class="w-1/2 px-3 py-2 border rounded-md text-sm text-center focus:ring-blue-500 focus:border-blue-500"
                placeholder="左图说明"
                @click.stop
              />
              <!-- 右图注 -->
              <input 
                type="text" 
                :value="getCaptionParts(block.text)[1]"
                @input="updateDoubleCaption(block, 1, ($event.target as HTMLInputElement).value)"
                class="w-1/2 px-3 py-2 border rounded-md text-sm text-center focus:ring-blue-500 focus:border-blue-500"
                placeholder="右图说明"
                @click.stop
              />
            </div>
          </div>
      </div>
    </div>

    <!-- 底部插入器 -->
    <div class="flex justify-center mt-2">
      <LayoutInserter
        @insert-image="$emit('insertImage', { index, type: $event })"
        @insert-text="$emit('insertText', { index, type: $event })"
        @insert-container="$emit('insertContainer', index)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ContentBlock, BlockType } from '../types'
import { getBlockTypeDisplayName } from '../utils/styleAssembler'
import LayoutInserter from './LayoutInserter.vue'

const props = defineProps<{
  block: ContentBlock
  index: number
  selectedId: string | null
  typeOptions: any[]
}>()

const emit = defineEmits(['select', 'delete', 'updateText', 'changeType', 'generateAi', 'insertText', 'insertImage', 'insertContainer', 'move'])

const isSelected = computed(() => props.selectedId === props.block.id)

const isImageBlock = (type: string) => {
  return ['image_single', 'image_single_caption', 'image_double', 'image_double_caption'].includes(type)
}

// 获取图片占位符文本
const getImagePlaceholder = (type: string) => {
  const placeholders: Record<string, string> = {
    'image_single': '[单图模板]',
    'image_single_caption': '[单图+注模板]',
    'image_double': '[双图模板]',
    'image_double_caption': '[双图+注模板]'
  }
  return placeholders[type] || '[图片]'
}

// 获取双图注的分隔部分
const getCaptionParts = (text: string) => {
  if (!text) return ['', '']
  
  // 优先支持原来的 | 分隔 (用于兼容)
  if (text.includes('|') || text.includes('｜')) {
    const parts = text.split(/[|｜]/)
    return [parts[0] ? parts[0].trim() : '', parts[1] ? parts[1].trim() : '']
  }
  
  // 支持空格分隔
  if (text.trim().includes(' ')) {
      const parts = text.trim().split(/\s+/)
      if (parts.length >= 2) {
          return [parts[0], parts.slice(1).join(' ')]
      }
  }

  return [text, text]
}

// 更新双图注
const updateDoubleCaption = (block: ContentBlock, index: number, newValue: string) => {
  const parts = getCaptionParts(block.text)
  parts[index] = newValue
  
  // 使用空格连接
  const newText = `${parts[0]} ${parts[1]}`
  emit('updateText', block.id, newText)
}

// 拖拽逻辑
const onDragStart = (e: DragEvent) => {
  if (e.dataTransfer) {
    e.dataTransfer.setData('blockId', props.block.id)
    e.dataTransfer.effectAllowed = 'move'
  }
}

const onDragOver = (e: DragEvent) => {
  if (props.block.type === 'container') {
    e.dataTransfer!.dropEffect = 'move'
  }
}

const onDrop = (e: DragEvent) => {
  const draggedId = e.dataTransfer?.getData('blockId')
  if (draggedId && draggedId !== props.block.id) {
    emit('move', { blockId: draggedId, containerId: props.block.id })
  }
}
</script>
