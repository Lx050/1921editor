<template>
  <div class="relative flex h-full w-full overflow-hidden" style="background: var(--color-content-bg);">
    <!-- 移动端样式选择开关 -->
    <button
      @click="showMobileSidebar = !showMobileSidebar"
      class="md:hidden fixed right-4 bottom-32 z-50 w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-300"
      style="background: var(--color-accent-primary); color: white;"
      title="切换样式面板"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
      </svg>
    </button>

    <!-- 移动端遮罩层 -->
    <div
      v-if="showMobileSidebar"
      @click="showMobileSidebar = false"
      class="fixed inset-0 bg-black/30 backdrop-blur-sm z-20 md:hidden transition-opacity"
    ></div>

    <!-- 左侧面板 — 无硬边框，通过背景色差与微阴影分区 -->
    <div
      :class="[
        'w-72 flex-shrink-0 h-full transition-transform duration-300 ease-in-out md:translate-x-0 overflow-hidden flex flex-col',
        showMobileSidebar ? 'translate-x-0 fixed left-0 top-0 bottom-0 z-30' : '-translate-x-full fixed md:relative md:translate-x-0'
      ]"
      style="background: var(--color-content-bg-soft); box-shadow: 1px 0 0 var(--color-content-border-subtle);"
    >
      <!-- 面板切换 — 简洁线条指示器 -->
      <div class="flex flex-shrink-0" style="background: var(--color-content-bg-soft);">
        <button
          @click="sidebarPanel = 'styles'"
          :class="[
            'flex-1 px-3 py-3 text-xs font-semibold transition-all relative',
            sidebarPanel === 'styles' ? 'text-[var(--color-accent-primary)]' : 'text-[var(--color-content-text-muted)] hover:text-[var(--color-content-text-secondary)]'
          ]"
        >
          &#x1F3A8; 样式
          <div
            v-if="sidebarPanel === 'styles'"
            class="absolute bottom-0 left-3 right-3 h-[2px] rounded-full"
            style="background: var(--color-accent-primary);"
          ></div>
        </button>
        <button
          @click="sidebarPanel = 'svg'"
          :class="[
            'flex-1 px-3 py-3 text-xs font-semibold transition-all relative',
            sidebarPanel === 'svg' ? 'text-[var(--color-ai-primary)]' : 'text-[var(--color-content-text-muted)] hover:text-[var(--color-content-text-secondary)]'
          ]"
        >
          &#x2728; SVG
          <div
            v-if="sidebarPanel === 'svg'"
            class="absolute bottom-0 left-3 right-3 h-[2px] rounded-full"
            style="background: var(--color-ai-primary);"
          ></div>
        </button>
      </div>
      <!-- 面板内容 -->
      <div class="flex-1 overflow-hidden">
        <StyleSelector v-show="sidebarPanel === 'styles'" />
        <SvgTemplatePanel v-show="sidebarPanel === 'svg'" @insert-svg="insertSvgDecoration" />
      </div>
    </div>

    <!-- 右侧编辑区 — 主内容，呼吸感布局 -->
    <div class="flex-1 flex flex-col h-full w-full relative overflow-hidden" style="background: var(--color-content-bg);">
      <!-- 精简头部 — 去掉硬边框，用背景渐变过渡 -->
      <div class="flex-shrink-0 w-full px-5 py-3" style="background: linear-gradient(180deg, var(--color-content-bg-soft) 0%, var(--color-content-bg) 100%);">
        <div class="flex items-center justify-between gap-3">
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2">
              <span class="text-[10px] px-2.5 py-1 rounded-full font-medium" style="background: var(--color-accent-soft); color: var(--color-accent-primary);">2 / 3</span>
              <h2 class="text-base font-bold" style="color: var(--color-content-text);">编辑内容</h2>
            </div>
            <p class="text-[10px] mt-1 ml-0.5" style="color: var(--color-content-text-muted);">拖拽调整顺序 &#xB7; 左侧切换样式 &#xB7; 点击块激活编辑</p>
          </div>
          <UploadProgress
            :progress="uploadProgress"
            :isUploading="isUploading"
            @retry="retryFailedUploads"
            class="flex-shrink-0"
          />
        </div>
      </div>

      <!-- 幕布工作区 — 宽松间距，无 border 纯卡片 -->
      <div
        class="flex-1 overflow-y-auto px-5 pb-24"
        @dragover.prevent="onAreaDragOver"
        @drop.prevent="onAreaDrop"
      >
        <div class="max-w-2xl mx-auto py-4">
          <TransitionGroup name="block-list" tag="div" class="space-y-2">
            <div
              v-for="(block, index) in contentBlocks"
              :key="block.id"
              class="relative group"
              :class="{ 'drag-over-top': dragOverIndex === index && dragOverHalf === 'top', 'drag-over-bottom': dragOverIndex === index && dragOverHalf === 'bottom' }"
              @dragover.prevent="onDragOver($event, index)"
              @dragleave="onDragLeave"
              @drop.prevent="onDrop($event, index)"
            >
              <!-- 内容块 — 无边框卡片，选中态用柔和光晕，可拖拽 -->
              <div
                @click="selectBlock(block.id)"
                draggable="true"
                @dragstart="onDragStart($event, index)"
                @dragend="onDragEnd"
                :class="[
                  'rounded-xl transition-all duration-200 relative cursor-pointer',
                  draggingIndex === index ? 'opacity-40 scale-[0.97]' : '',
                  selectedBlockId === block.id
                    ? 'bg-white shadow-[0_0_0_2px_rgba(232,96,60,0.15),0_4px_20px_rgba(0,0,0,0.06)]'
                    : 'bg-white/60 hover:bg-white hover:shadow-[0_2px_12px_rgba(0,0,0,0.04)]'
                ]"
              >
                <!-- 顶部栏 — 拖拽手柄 + 标签 + 操作 -->
                <div class="flex items-center justify-between px-4 pt-3 pb-1">
                  <div class="flex items-center gap-2">
                    <!-- 拖拽手柄 -->
                    <div class="cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-40 transition-opacity" title="拖拽排序">
                      <svg class="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor" style="color: var(--color-content-text-muted);">
                        <path d="M6 2a1 1 0 110 2 1 1 0 010-2zm4 0a1 1 0 110 2 1 1 0 010-2zM6 7a1 1 0 110 2 1 1 0 010-2zm4 0a1 1 0 110 2 1 1 0 010-2zM6 12a1 1 0 110 2 1 1 0 010-2zm4 0a1 1 0 110 2 1 1 0 010-2z"/>
                      </svg>
                    </div>
                    <select
                      v-if="selectedBlockId === block.id"
                      :value="block.type"
                      @change="changeBlockType(block.id, ($event.target as HTMLSelectElement).value as BlockType)"
                      class="px-2 py-1 text-[11px] font-medium rounded-md border-none outline-none cursor-pointer transition-colors"
                      style="background: var(--color-content-bg-muted); color: var(--color-content-text);"
                      @click.stop
                    >
                      <option v-for="option in getBlockTypeOptions()" :key="option.value" :value="option.value">
                        {{ option.icon }} {{ option.label }}
                      </option>
                    </select>
                    <span
                      v-else
                      class="px-2 py-1 rounded-md text-[10px] font-medium"
                      style="background: var(--color-content-bg-muted); color: var(--color-content-text-muted);"
                    >
                      {{ getBlockTypeDisplayName(block.type) }}
                    </span>
                  </div>

                  <!-- 操作按钮区 — 统一风格 -->
                  <div class="flex items-center gap-0.5">
                    <!-- AI 图像化按钮（SVG块不显示） -->
                    <button
                      v-if="block.type !== 'svg_decoration'"
                      @click.stop="generateAiImage(block)"
                      :disabled="generatingBlockId === block.id"
                      :class="[
                        'inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-medium transition-all',
                        generatingBlockId === block.id
                          ? 'bg-[var(--color-ai-primary)] text-white animate-pulse'
                          : selectedBlockId === block.id
                            ? 'text-[var(--color-ai-primary)] hover:bg-[var(--color-ai-hover)]'
                            : 'text-[var(--color-content-text-muted)] opacity-0 group-hover:opacity-60 hover:!opacity-100 hover:bg-[var(--color-ai-hover)] hover:!text-[var(--color-ai-primary)]'
                      ]"
                      title="AI 图像化"
                    >
                      <svg v-if="generatingBlockId !== block.id" class="w-3 h-3" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M8 1a.75.75 0 01.75.75v2a.75.75 0 01-1.5 0v-2A.75.75 0 018 1zm0 10a.75.75 0 01.75.75v2a.75.75 0 01-1.5 0v-2A.75.75 0 018 11zm7-3a.75.75 0 01-.75.75h-2a.75.75 0 010-1.5h2A.75.75 0 0115 8zM5 8a.75.75 0 01-.75.75h-2a.75.75 0 010-1.5h2A.75.75 0 015 8zm8.14-3.14a.75.75 0 010 1.06l-1.41 1.41a.75.75 0 11-1.06-1.06l1.41-1.41a.75.75 0 011.06 0zm-8.56 5.7a.75.75 0 010 1.06l-1.41 1.41a.75.75 0 11-1.06-1.06l1.41-1.41a.75.75 0 011.06 0zm8.56 0a.75.75 0 01-1.06 1.06l-1.41-1.41a.75.75 0 011.06-1.06l1.41 1.41zm-8.56-5.7a.75.75 0 01-1.06 0L2.1 3.45a.75.75 0 011.06-1.06l1.41 1.41a.75.75 0 010 1.06z"/>
                      </svg>
                      <span v-if="generatingBlockId === block.id" class="text-[10px]">生成中...</span>
                      <span v-else-if="selectedBlockId === block.id" class="text-[10px]">AI</span>
                    </button>
                    <!-- 删除按钮 -->
                    <button
                      v-if="selectedBlockId === block.id"
                      @click.stop="confirmDeleteBlock(index, block.id)"
                      class="p-1.5 rounded-md text-[var(--color-content-text-muted)] hover:text-red-500 hover:bg-red-50 transition-colors"
                      title="删除"
                    >
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                    </button>
                  </div>
                </div>

                <!-- SVG 装饰块 -->
                <div v-if="block.type === 'svg_decoration'" class="px-4 pb-4">
                  <div class="relative rounded-lg overflow-hidden" style="background: var(--color-content-bg-muted);">
                    <!-- SVG 预览（pointer-events:none 确保点击穿透到父容器） -->
                    <div class="svg-block-preview flex items-center justify-center p-4 min-h-[60px] pointer-events-none">
                      <div
                        v-if="block.meta?.svgContent"
                        class="svg-render-wrapper"
                        v-html="block.meta.svgContent"
                      ></div>
                      <div v-else class="text-center py-3">
                        <p class="text-[10px]" style="color: var(--color-content-text-muted);">SVG 内容缺失</p>
                      </div>
                    </div>
                    <!-- SVG 操作栏 -->
                    <div class="flex items-center justify-between px-3 py-2" style="background: rgba(124, 92, 252, 0.04);">
                      <div class="flex items-center gap-1.5">
                        <svg class="w-3 h-3" style="color: var(--color-ai-primary);" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"/>
                        </svg>
                        <span class="text-[9px] font-medium" style="color: var(--color-ai-primary);">
                          {{ block.meta?.svgName || 'SVG 装饰' }}
                        </span>
                        <span class="text-[8px] px-1.5 py-0.5 rounded" style="background: var(--color-ai-soft); color: var(--color-ai-primary);">
                          {{ block.meta?.svgTemplateId || '' }}
                        </span>
                      </div>
                      <div class="flex items-center gap-1">
                        <button
                          @click.stop="replaceSvgBlock(block)"
                          class="text-[9px] px-2 py-1 rounded-md font-medium transition-colors"
                          style="color: var(--color-ai-primary); background: var(--color-ai-soft);"
                          title="更换SVG模板"
                        >
                          更换
                        </button>
                        <button
                          @click.stop="confirmDeleteBlock(contentBlocks.indexOf(block), block.id)"
                          class="text-[9px] px-2 py-1 rounded-md font-medium transition-colors text-red-400 hover:text-red-600 hover:bg-red-50"
                          title="删除"
                        >
                          删除
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 文本内容区 -->
                <div v-if="!isImageBlock(block.type) && block.type !== 'svg_decoration'" class="px-4 pb-4">
                  <!-- AI 生成的图片 -->
                  <div v-if="block.meta?.aiImageUrl" class="mb-3 relative rounded-lg overflow-hidden">
                    <LazyImage
                      :src="block.meta.aiImageUrl as string"
                      alt="AI Generated"
                      :width="400"
                      :height="300"
                      class="w-full rounded-lg"
                      img-class="w-full rounded-lg"
                      :placeholder="true"
                      :threshold="0.3"
                    />
                    <span class="absolute top-2 right-2 text-[9px] font-bold px-2 py-0.5 rounded-full" style="background: var(--color-ai-primary); color: white;">AI</span>
                  </div>

                  <!-- 输入框 — 无边框，聚焦态底线 -->
                  <input
                    v-if="block.type === 'title'"
                    type="text"
                    v-model="block.text"
                    class="w-full px-0 py-2 border-0 border-b border-transparent focus:border-[var(--color-accent-primary)] bg-transparent text-center text-lg font-bold transition-colors outline-none"
                    style="color: var(--color-content-text);"
                    :placeholder="getBlockPlaceholder(block.type)"
                    @click.stop
                  />
                  <textarea
                    v-else
                    v-model="block.text"
                    class="w-full px-0 py-2 border-0 border-b border-transparent focus:border-[var(--color-accent-primary)] bg-transparent resize-none transition-colors outline-none text-sm leading-relaxed"
                    :class="{ 'text-[var(--color-content-text-muted)] text-xs': block.meta?.aiImageUrl }"
                    style="color: var(--color-content-text);"
                    :placeholder="getBlockPlaceholder(block.type)"
                    rows="2"
                    @click.stop
                  ></textarea>
                </div>

                <!-- 图片模板 -->
                <div v-if="isImageBlock(block.type)" class="px-4 pb-4">
                  <div class="flex flex-col items-center justify-center py-6 rounded-lg" style="background: var(--color-content-bg-muted);">
                    <div class="flex items-center gap-2 mb-2">
                      <span class="text-lg opacity-40">
                        <span v-if="block.type === 'image_single' || block.type === 'image_single_caption'">&#x1F5BC;&#xFE0F;</span>
                        <span v-else>&#x1F5BC;&#xFE0F;&#x1F5BC;&#xFE0F;</span>
                      </span>
                      <span class="text-xs font-medium" style="color: var(--color-content-text-muted);">
                        {{ getImagePlaceholder(block.type) }}
                      </span>
                    </div>
                    <!-- 单图注 -->
                    <div v-if="block.type === 'image_single_caption'" class="w-full max-w-xs mt-2">
                      <input
                        type="text"
                        v-model="block.text"
                        class="w-full px-3 py-1.5 bg-white/80 border-0 rounded-md text-xs text-center outline-none focus:ring-1 focus:ring-[var(--color-accent-primary)]"
                        placeholder="图片说明"
                        @click.stop
                      />
                    </div>
                    <!-- 双图注 -->
                    <div v-if="block.type === 'image_double_caption'" class="w-full max-w-sm flex gap-2 mt-2">
                      <input
                        type="text"
                        :value="getCaptionParts(block.text)[0]"
                        @input="updateDoubleCaption(block, 0, ($event.target as HTMLInputElement).value)"
                        class="w-1/2 px-3 py-1.5 bg-white/80 border-0 rounded-md text-xs text-center outline-none focus:ring-1 focus:ring-[var(--color-accent-primary)]"
                        placeholder="左图说明"
                        @click.stop
                      />
                      <input
                        type="text"
                        :value="getCaptionParts(block.text)[1]"
                        @input="updateDoubleCaption(block, 1, ($event.target as HTMLInputElement).value)"
                        class="w-1/2 px-3 py-1.5 bg-white/80 border-0 rounded-md text-xs text-center outline-none focus:ring-1 focus:ring-[var(--color-accent-primary)]"
                        placeholder="右图说明"
                        @click.stop
                      />
                    </div>
                  </div>
                </div>
              </div>

              <!-- 版式插入器 — 居中细线+按钮 -->
              <div class="flex justify-center py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <LayoutInserter
                  @insert-image="insertImageBlock(index, $event)"
                  @insert-text="insertTextBlock(index, $event)"
                  @insert-svg="insertSvgAtIndex(index)"
                />
              </div>
            </div>
          </TransitionGroup>

          <!-- 尾部拖放提示 -->
          <div
            v-if="contentBlocks.length > 0"
            class="drop-zone-empty mt-2"
          >
            <div class="text-center py-6 opacity-30">
              <p class="text-[10px]" style="color: var(--color-content-text-muted);">从左侧拖入SVG或拖拽排序</p>
            </div>
          </div>

          <div
            v-if="contentBlocks.length === 0"
            class="text-center py-20"
          >
            <div class="text-3xl mb-3 opacity-30">&#x1F4DD;</div>
            <div class="text-sm font-medium" style="color: var(--color-content-text-muted);">没有内容块</div>
            <div class="text-xs mt-1" style="color: var(--color-content-text-muted);">请返回上一步输入文本，或从左侧拖入SVG装饰</div>
          </div>
        </div>
      </div>

      <!-- 底部操作栏 — 毛玻璃融入背景 -->
      <div class="absolute bottom-0 left-0 right-0 px-5 py-3 z-10" style="background: linear-gradient(180deg, transparent 0%, var(--color-content-bg) 30%); backdrop-filter: blur(8px);">
        <div class="max-w-2xl mx-auto flex items-center gap-3">
          <button
            @click="goToPreviousStep"
            class="flex-1 h-10 bg-white/80 hover:bg-white text-sm font-medium rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-1"
            style="color: var(--color-content-text); box-shadow: var(--shadow-content-card);"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
            <span>上一步</span>
          </button>
          <button
            @click="goToNextStep"
            :disabled="contentBlocks.length === 0 || isUploading"
            class="flex-[2] h-10 text-white text-sm font-bold rounded-xl transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            style="background: var(--color-accent-primary); box-shadow: var(--shadow-accent);"
          >
            <template v-if="isUploading">
              <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>上传中...</span>
            </template>
            <template v-else>
              <span>预览效果</span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
            </template>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '../stores/appStore'
import { smartTextParser } from '../utils/textParser'
import { getBlockTypeDisplayName } from '../utils/styleAssembler'
import { uploadManager } from '../utils/uploadManager'
import StyleSelector from '../components/StyleSelector.vue'
import SvgTemplatePanel from '../components/SvgTemplatePanel.vue'
import LayoutInserter from '../components/LayoutInserter.vue'
import UploadProgress from '../components/UploadProgress.vue'
import LazyImage from '../components/LazyImage.vue'
import type { ContentBlock, BlockType } from '../types'

const router = useRouter()
const appStore = useAppStore()
const selectedBlockId = ref<string | null>(null)
const showMobileSidebar = ref(false)
const sidebarPanel = ref<'styles' | 'svg'>('styles')
const generatingBlockId = ref<string | null>(null)
const LOCAL_DRAFT_KEY = 'local_step2_draft'

// 拖拽排序状态
const draggingIndex = ref<number | null>(null)
const dragOverIndex = ref<number | null>(null)
const dragOverHalf = ref<'top' | 'bottom' | null>(null)
const pendingSvgInsertIndex = ref<number | null>(null)

const contentBlocks = computed(() => appStore.contentBlocks)
const uploadProgress = computed(() => appStore.uploadProgress)
const isUploading = computed(() => appStore.isUploading)

const retryFailedUploads = () => {
  uploadManager.retryFailed()
}

watch(() => appStore.rawText, (newText) => {
  if (newText && contentBlocks.value.length === 0) {
    const parsedBlocks = smartTextParser(newText)
    appStore.setContentBlocks(parsedBlocks)
  }
}, { immediate: true })

const selectBlock = (blockId: string) => {
  selectedBlockId.value = blockId === selectedBlockId.value ? null : blockId
}

const getBlockTypeOptions = () => {
  return [
    { value: 'title', label: '标题', icon: '📰' },
    { value: 'body', label: '正文', icon: '📝' },
    { value: 'intro', label: '引言', icon: '💭' },
    { value: 'outro', label: '结尾', icon: '🏁' },
    { value: 'image_single', label: '单图', icon: '🖼️' },
    { value: 'image_single_caption', label: '单图+注', icon: '🖼️📝' },
    { value: 'image_double', label: '双图', icon: '🖼️🖼️' },
    { value: 'image_double_caption', label: '双图+注', icon: '🖼️📝' }
  ]
}

const changeBlockType = (blockId: string, newType: BlockType) => {
  appStore.updateBlockType(blockId, newType)
}

const insertImageBlock = (index: number, imageType: string) => {
  appStore.insertImageBlock(index, imageType as 'single' | 'single_caption' | 'double' | 'double_caption')
}

const insertTextBlock = (index: number, textType: string) => {
  const defaultTexts: Record<string, string> = {
    'title': '新的标题内容',
    'body': '新的正文内容，点击这里开始编辑...',
    'intro': '新的引言内容，点击这里开始编辑...',
    'outro': '新的结尾内容，点击这里开始编辑...'
  }
  const defaultText = defaultTexts[textType] || '新内容，点击编辑...'
  appStore.insertTextBlock(index + 1, textType as BlockType, defaultText)
}

// --- 拖拽排序 & 跨面板SVG拖入 ---
const onDragStart = (e: DragEvent, index: number) => {
  draggingIndex.value = index
  e.dataTransfer!.effectAllowed = 'move'
  e.dataTransfer!.setData('application/block-index', String(index))
}

const onDragOver = (e: DragEvent, index: number) => {
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
  const midY = rect.top + rect.height / 2
  dragOverIndex.value = index
  dragOverHalf.value = e.clientY < midY ? 'top' : 'bottom'

  const hasSvg = e.dataTransfer!.types.includes('application/svg-template')
  const hasBlock = e.dataTransfer!.types.includes('application/block-index')
  if (hasSvg) {
    e.dataTransfer!.dropEffect = 'copy'
  } else if (hasBlock) {
    e.dataTransfer!.dropEffect = 'move'
  } else {
    e.dataTransfer!.dropEffect = 'none'
  }
}

const onDragLeave = () => {
  dragOverIndex.value = null
  dragOverHalf.value = null
}

const onDrop = (e: DragEvent, index: number) => {
  const insertPos = dragOverHalf.value === 'bottom' ? index + 1 : index

  // 情况1: 从SVG面板拖入
  if (e.dataTransfer?.types.includes('application/svg-template')) {
    try {
      const svgData = JSON.parse(e.dataTransfer.getData('application/svg-template'))
      appStore.insertSvgBlock(insertPos, svgData)
    } catch (err) {
      console.warn('[Drop] Failed to parse SVG template data:', err)
    }
  }
  // 情况2: 块内排序
  else if (draggingIndex.value !== null) {
    let toIndex = insertPos
    // 如果从上方拖到下方，需要补偿被移除元素的偏移
    if (draggingIndex.value < toIndex) toIndex--
    if (draggingIndex.value !== toIndex) {
      appStore.moveBlock(draggingIndex.value, toIndex)
    }
  }

  // 清理状态
  draggingIndex.value = null
  dragOverIndex.value = null
  dragOverHalf.value = null
}

const onDragEnd = () => {
  draggingIndex.value = null
  dragOverIndex.value = null
  dragOverHalf.value = null
}

// 整个编辑区的拖放 — 作为全局 fallback
const onAreaDragOver = (e: DragEvent) => {
  const hasSvg = e.dataTransfer!.types.includes('application/svg-template')
  const hasBlock = e.dataTransfer!.types.includes('application/block-index')
  if (hasSvg) {
    e.dataTransfer!.dropEffect = 'copy'
  } else if (hasBlock) {
    e.dataTransfer!.dropEffect = 'move'
  }
}

const onAreaDrop = (e: DragEvent) => {
  // 如果已经被子元素（具体block）处理过，不重复处理
  if (dragOverIndex.value !== null) {
    // 已经有具体目标，让 onDrop 处理
    return
  }
  // 在空白区域释放 → 插入到末尾
  const insertPos = contentBlocks.value.length
  if (e.dataTransfer?.types.includes('application/svg-template')) {
    try {
      const svgData = JSON.parse(e.dataTransfer.getData('application/svg-template'))
      appStore.insertSvgBlock(insertPos, svgData)
    } catch (err) {
      console.warn('[Drop] Failed to parse SVG template data:', err)
    }
  } else if (draggingIndex.value !== null) {
    appStore.moveBlock(draggingIndex.value, Math.max(0, insertPos - 1))
  }
  draggingIndex.value = null
  dragOverIndex.value = null
  dragOverHalf.value = null
}

const insertSvgAtIndex = (index: number) => {
  pendingSvgInsertIndex.value = index + 1
  sidebarPanel.value = 'svg'
  // 仅移动端需要展开侧栏覆盖层，桌面端左侧面板始终可见
  if (window.innerWidth < 768) {
    showMobileSidebar.value = true
  }
}

const insertSvgDecoration = (svgTpl: { id: string; name: string; svg: string }) => {
  // 如果是替换模式，替换指定块的SVG内容
  if (replacingSvgBlockId.value) {
    appStore.updateBlockMeta(replacingSvgBlockId.value, {
      svgTemplateId: svgTpl.id,
      svgName: svgTpl.name,
      svgContent: svgTpl.svg
    })
    replacingSvgBlockId.value = null
    return
  }

  const insertAt = pendingSvgInsertIndex.value
  if (insertAt !== null && insertAt >= 0) {
    appStore.insertSvgBlock(insertAt, svgTpl)
  } else {
    // 默认追加到末尾
    appStore.insertSvgBlock(contentBlocks.value.length, svgTpl)
  }
  pendingSvgInsertIndex.value = null
}

// SVG块替换
const replacingSvgBlockId = ref<string | null>(null)
const replaceSvgBlock = (block: ContentBlock) => {
  replacingSvgBlockId.value = block.id
  sidebarPanel.value = 'svg'
  // 仅移动端需要展开侧栏覆盖层，桌面端左侧面板始终可见
  if (window.innerWidth < 768) {
    showMobileSidebar.value = true
  }
}

const deleteBlock = (index: number) => {
  const newBlocks = [...contentBlocks.value]
  const removedBlock = newBlocks.splice(index, 1)[0]
  appStore.setContentBlocks(newBlocks)
  if (removedBlock?.id === selectedBlockId.value) {
    selectedBlockId.value = null
  }
}

const confirmDeleteBlock = (index: number, _blockId: string) => {
  const block = contentBlocks.value[index]
  const blockType = block ? getBlockTypeDisplayName(block.type) : '内容块'
  if (confirm(`确定要删除这个${blockType}吗？`)) {
    deleteBlock(index)
  }
}

const getImagePlaceholder = (type: string) => {
  const placeholders: Record<string, string> = {
    'image_single': '单图模板 — 在预览阶段替换图片',
    'image_single_caption': '单图+注 — 在预览阶段替换图片',
    'image_double': '双图模板 — 在预览阶段替换图片',
    'image_double_caption': '双图+注 — 在预览阶段替换图片'
  }
  return placeholders[type] || '[图片]'
}

const isImageBlock = (type: string) => {
  return ['image_single', 'image_single_caption', 'image_double', 'image_double_caption'].includes(type)
}

const getBlockPlaceholder = (type: string) => {
  const placeholders: Record<string, string> = {
    'title': '请输入标题...',
    'body': '请输入正文内容...',
    'intro': '请输入引言...',
    'outro': '请输入结尾...'
  }
  return placeholders[type] || '请输入内容...'
}

const goToPreviousStep = () => {
  router.push('/step1')
}

const goToNextStep = () => {
  if (contentBlocks.value.length > 0) {
    const styleConfig = appStore.styleConfig
    const hasTitleStyle = styleConfig?.title && styleConfig.title.fullExample
    const hasBodyStyle = styleConfig?.body && styleConfig.body.fullExample
    const hasIntroStyle = styleConfig?.intro && styleConfig.intro.fullExample
    if (!hasTitleStyle && !hasBodyStyle && !hasIntroStyle) {
      alert('请先在左侧选择装饰样式后再进入预览阶段！')
      return
    }
    router.push('/step3')
  }
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
  appStore.updateBlockText(block.id, newText)
}

onMounted(() => {
  if (contentBlocks.value.length === 0 && !appStore.rawText) {
    const savedDraft = localStorage.getItem(LOCAL_DRAFT_KEY)
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft)
        if (parsed?.rawText) appStore.setRawText(parsed.rawText)
        if (parsed?.styleConfig) appStore.setStyleConfig(parsed.styleConfig)
        if (Array.isArray(parsed?.contentBlocks) && parsed.contentBlocks.length > 0) {
          const restoredBlocks = parsed.contentBlocks.map((block: any, index: number) => ({
            id: `local_${index}_${Date.now()}`,
            type: block.type || 'body',
            text: block.text || '',
            source: 'local',
            meta: block.meta || {}
          }))
          appStore.setContentBlocks(restoredBlocks)
        }
      } catch (e) {
        console.warn('[Step2] Failed to restore local draft:', e)
      }
    }
  }
  if (contentBlocks.value.length === 0 && !appStore.rawText) {
    router.push('/step1')
  }
})

const generateAiImage = async (block: ContentBlock) => {
  if (!block.text || generatingBlockId.value) return
  generatingBlockId.value = block.id
  try {
    let apiType = 'body'
    if (block.type === 'title') apiType = 'title'
    if (block.type === 'intro') apiType = 'quote'
    const response = await fetch('/api/nano-banana/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: block.text, type: apiType })
    })
    if (!response.ok) {
      const errText = await response.text()
      throw new Error(errText || 'Generation failed')
    }
    const data = await response.json()
    if (data.url) {
      appStore.updateBlockMeta(block.id, {
        aiImageUrl: data.url,
        originalText: block.text,
        isAiGenerated: true
      })
    }
  } catch (e: any) {
    console.error('AI Generation Failed:', e)
    alert('AI生成失败: ' + e.message)
  } finally {
    generatingBlockId.value = null
  }
}
</script>

<style scoped>
.block-list-move,
.block-list-enter-active,
.block-list-leave-active {
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
}
.block-list-enter-from,
.block-list-leave-to {
  opacity: 0;
  transform: translateY(12px);
}
.block-list-leave-active {
  position: absolute;
  width: 100%;
}

/* 拖拽指示器 */
.drag-over-top {
  position: relative;
}
.drag-over-top::before {
  content: '';
  position: absolute;
  top: -2px;
  left: 8px;
  right: 8px;
  height: 3px;
  background: var(--color-ai-primary);
  border-radius: 2px;
  z-index: 10;
  animation: pulse-indicator 1s ease-in-out infinite;
}
.drag-over-bottom {
  position: relative;
}
.drag-over-bottom::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 8px;
  right: 8px;
  height: 3px;
  background: var(--color-ai-primary);
  border-radius: 2px;
  z-index: 10;
  animation: pulse-indicator 1s ease-in-out infinite;
}

@keyframes pulse-indicator {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}

/* SVG 块预览 */
.svg-block-preview {
  max-height: 200px;
  overflow: hidden;
}
.svg-render-wrapper {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.svg-render-wrapper :deep(svg) {
  max-width: 100%;
  max-height: 180px;
  width: auto;
  height: auto;
}

/* 空区域拖放区 */
.drop-zone-empty {
  min-height: 80px;
  border: 2px dashed transparent;
  border-radius: 12px;
  transition: all 0.2s ease;
}
.drop-zone-empty.drag-active {
  border-color: var(--color-ai-primary);
  background: rgba(124, 92, 252, 0.04);
}
</style>
