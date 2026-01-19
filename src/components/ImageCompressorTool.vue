<template>
  <div
    class="group relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100/50 p-6 hover:shadow-xl transition-all duration-300 overflow-hidden"
  >
    <!-- 背景装饰 -->
    <div class="absolute inset-0 bg-gradient-to-br from-cyan-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    <div class="absolute -top-4 -right-4 w-20 h-20 bg-cyan-100/30 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"></div>

    <div class="relative">
      <!-- 标题区域 -->
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center space-x-3">
          <div class="h-12 w-12 bg-gradient-to-br from-cyan-400 to-teal-500 rounded-xl flex items-center justify-center text-2xl shadow-lg shadow-cyan-500/25">
            🗜️
          </div>
          <div>
            <h3 class="text-lg font-bold text-gray-900">图片压缩</h3>
            <span class="text-xs text-cyan-700 font-medium">支持 HEIC/JPEG/PNG</span>
          </div>
        </div>
      </div>

      <!-- 上传区域 -->
      <div class="relative">
        <input
          ref="fileInput"
          type="file"
          accept="image/*"
          multiple
          @change="handleFileSelect"
          class="hidden"
        />
        
        <!-- 拖拽上传区 -->
        <div
          v-if="!isProcessing && processedFiles.length === 0"
          @click="triggerFileInput"
          @dragover.prevent="isDragging = true"
          @dragleave.prevent="isDragging = false"
          @drop.prevent="handleDrop"
          :class="[
            'border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all',
            isDragging ? 'border-cyan-400 bg-cyan-50' : 'border-gray-200 hover:border-cyan-300 hover:bg-cyan-50/50'
          ]"
        >
          <svg class="w-10 h-10 mx-auto text-gray-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p class="text-sm text-gray-600 mb-1">点击或拖拽图片到这里</p>
          <p class="text-xs text-gray-500">支持 JPG, PNG, HEIC 等格式</p>
        </div>

        <!-- 处理中 -->
        <div v-else-if="isProcessing" class="text-center py-8">
          <div class="inline-block animate-spin rounded-full h-10 w-10 border-4 border-cyan-600/30 border-t-cyan-600 mb-4"></div>
          <p class="text-gray-600 font-medium">{{ processingStatus }}</p>
          <p class="text-sm text-gray-500 mt-1">{{ currentFile }}</p>
        </div>

        <!-- 处理结果 -->
        <div v-else class="space-y-3">
          <div
            v-for="(result, index) in processedFiles"
            :key="index"
            class="flex items-center justify-between bg-gray-50 rounded-lg p-3"
          >
            <div class="flex items-center space-x-3 min-w-0 flex-1">
              <div class="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg class="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div class="min-w-0">
                <p class="text-sm font-medium text-gray-900 truncate">{{ result.name }}</p>
                <p class="text-xs text-gray-500">
                  {{ result.originalSize }} → {{ result.compressedSize }}
                  <span class="text-green-600 font-medium ml-1">(-{{ result.savings }}%)</span>
                </p>
              </div>
            </div>
            <button
              @click="downloadFile(result)"
              class="flex-shrink-0 ml-3 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-medium rounded-lg transition-colors"
            >
              下载
            </button>
          </div>

          <!-- 操作按钮 -->
          <div class="flex items-center gap-2 pt-2">
            <button
              @click="downloadAll"
              class="flex-1 px-4 py-2 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white text-sm font-medium rounded-lg transition-all shadow-md"
            >
              全部下载
            </button>
            <button
              @click="reset"
              class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors"
            >
              重新选择
            </button>
          </div>
        </div>
      </div>

      <!-- 设置选项 -->
      <div v-if="!isProcessing && processedFiles.length === 0" class="mt-4 pt-4 border-t border-gray-100">
        <div class="flex items-center justify-between text-sm">
          <span class="text-gray-600">目标大小限制</span>
          <select
            v-model="maxSizeMB"
            aria-label="选择目标大小限制"
            class="px-3 py-1 bg-gray-100 border-0 rounded-lg text-sm focus:ring-2 focus:ring-cyan-500"
          >
            <option :value="2">2 MB</option>
            <option :value="5">5 MB</option>
            <option :value="9">9 MB</option>
            <option :value="10">10 MB</option>
          </select>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { formatFileSize, needsConversion, needsCompression, processImage } from '../utils/imageConverter'

interface ProcessedFile {
  name: string
  originalSize: string
  compressedSize: string
  savings: string
  file: File
}

const fileInput = ref<HTMLInputElement | null>(null)
const isDragging = ref(false)
const isProcessing = ref(false)
const processingStatus = ref('')
const currentFile = ref('')
const processedFiles = ref<ProcessedFile[]>([])
const maxSizeMB = ref(9)

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileSelect = async (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files.length > 0) {
    await processFiles(Array.from(input.files))
  }
}

const handleDrop = async (event: DragEvent) => {
  isDragging.value = false
  const files = event.dataTransfer?.files
  if (files && files.length > 0) {
    const imageFiles = Array.from(files).filter(f => f.type.startsWith('image/') || /\.(heic|heif)$/i.test(f.name))
    if (imageFiles.length > 0) {
      await processFiles(imageFiles)
    }
  }
}

const processFiles = async (files: File[]) => {
  isProcessing.value = true
  processedFiles.value = []
  
  const maxSize = maxSizeMB.value * 1024 * 1024
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    currentFile.value = file.name
    
    try {
      // 判断处理类型
      if (needsConversion(file)) {
        processingStatus.value = `正在转换格式 (${i + 1}/${files.length})...`
      } else if (needsCompression(file, maxSize)) {
        processingStatus.value = `正在压缩 (${i + 1}/${files.length})...`
      } else {
        processingStatus.value = `正在处理 (${i + 1}/${files.length})...`
      }
      
      const processed = await processImage(file, { maxSize })
      
      const savings = file.size > 0 ? ((1 - processed.size / file.size) * 100).toFixed(1) : '0'
      
      processedFiles.value.push({
        name: processed.name,
        originalSize: formatFileSize(file.size),
        compressedSize: formatFileSize(processed.size),
        savings: savings,
        file: processed
      })
    } catch (error) {
      console.error('处理失败:', file.name, error)
      // 失败时保留原文件
      processedFiles.value.push({
        name: file.name,
        originalSize: formatFileSize(file.size),
        compressedSize: formatFileSize(file.size),
        savings: '0',
        file: file
      })
    }
  }
  
  isProcessing.value = false
  currentFile.value = ''
  processingStatus.value = ''
}

const downloadFile = (result: ProcessedFile) => {
  const url = URL.createObjectURL(result.file)
  const a = document.createElement('a')
  a.href = url
  a.download = result.file.name
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

const downloadAll = () => {
  processedFiles.value.forEach(result => {
    downloadFile(result)
  })
}

const reset = () => {
  processedFiles.value = []
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}
</script>
