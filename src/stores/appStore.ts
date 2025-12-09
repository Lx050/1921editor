import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Ref } from 'vue'
import type { ContentBlock, StyleConfig, BlockType } from '@/types'

// V2新增：微信图片接口
export interface WechatImage {
  id: string
  mediaId: string
  url: string
  originalName: string
  status: 'uploading' | 'completed' | 'failed'
}

// V2新增：上传状态接口
export interface UploadStatus {
  total: number
  completed: number
  failed: number
  status: 'idle' | 'uploading' | 'completed' | 'failed'
  errors: Array<{ fileName: string; error: string }>
}

export const useAppStore = defineStore('app', () => {
  // 状态（明确类型注解，无向后兼容）
  const currentStep: Ref<number> = ref(1)
  const rawText: Ref<string> = ref('')
  const contentBlocks: Ref<ContentBlock[]> = ref([])
  const styleConfig: Ref<StyleConfig | null> = ref(null)

  // V2新增：微信图片状态
  const wechatImages: Ref<WechatImage[]> = ref([])
  const uploadStatus: Ref<UploadStatus> = ref({
    total: 0,
    completed: 0,
    failed: 0,
    status: 'idle',
    errors: []
  })

  // 操作（严格类型注解）
  const setStep = (step: number): void => {
    if (typeof step !== 'number' || step < 1 || step > 3) {
      throw new Error('Invalid step: must be a number between 1 and 3')
    }
    currentStep.value = step
  }

  const setRawText = (text: string): void => {
    if (typeof text !== 'string') {
      throw new Error('Invalid text: must be a string')
    }
    rawText.value = text
  }

  const setContentBlocks = (blocks: ContentBlock[]): void => {
    if (!Array.isArray(blocks)) {
      throw new Error('Invalid blocks: must be an array')
    }
    contentBlocks.value = blocks
  }

  const updateBlockType = (id: string, type: BlockType): void => {
    if (typeof id !== 'string' || typeof type !== 'string') {
      throw new Error('Invalid parameters: id and type must be strings')
    }

    const block: ContentBlock | undefined = contentBlocks.value.find(
      (b: ContentBlock): boolean => b.id === id
    )

    if (block) {
      block.type = type
    }
  }

  const updateBlockText = (id: string, text: string): void => {
    if (typeof id !== 'string' || typeof text !== 'string') {
      throw new Error('Invalid parameters: id and text must be strings')
    }

    const block: ContentBlock | undefined = contentBlocks.value.find(
      (b: ContentBlock): boolean => b.id === id
    )

    if (block) {
      block.text = text
    }
  }

  const insertImageBlock = (index: number, imageType: 'single' | 'double'): void => {
    if (typeof index !== 'number' || index < 0) {
      throw new Error('Invalid index: must be a non-negative number')
    }

    // 转换图片类型名称
    const blockType: 'image_single' | 'image_double' =
      imageType === 'single' ? 'image_single' : 'image_double'

    contentBlocks.value.splice(index + 1, 0, {
      id: `image_${Date.now()}`,
      type: blockType,
      text: ''
    } as ContentBlock)
  }

  const insertTextBlock = (
    index: number,
    textType: BlockType,
    text: string
  ): void => {
    if (typeof index !== 'number' || index < 0) {
      throw new Error('Invalid index: must be a non-negative number')
    }
    if (typeof textType !== 'string' || typeof text !== 'string') {
      throw new Error('Invalid parameters: textType and text must be strings')
    }

    contentBlocks.value.splice(index, 0, {
      id: `text_${Date.now()}`,
      type: textType,
      text: text
    } as ContentBlock)
  }

  const setStyleConfig = (config: Partial<StyleConfig>): void => {
    if (typeof config !== 'object' || config === null) {
      throw new Error('Invalid config: must be a non-null object')
    }

    styleConfig.value = { ...(styleConfig.value || {}), ...config }
  }

  const resetApp = (): void => {
    currentStep.value = 1
    rawText.value = ''
    contentBlocks.value = []
    styleConfig.value = null
    wechatImages.value = []
    uploadStatus.value = {
      total: 0,
      completed: 0,
      failed: 0,
      status: 'idle',
      errors: []
    }
  }

  // V2新增：设置微信图片列表
  const setWechatImages = (images: WechatImage[]): void => {
    if (!Array.isArray(images)) {
      throw new Error('Invalid images: must be an array')
    }
    wechatImages.value = images
  }

  // V2新增：添加微信图片
  const addWechatImage = (image: WechatImage): void => {
    if (typeof image !== 'object' || !image.id) {
      throw new Error('Invalid image: must be an object with id')
    }
    wechatImages.value.push(image)
  }

  // V2新增：更新微信图片状态
  const updateWechatImage = (id: string, updates: Partial<WechatImage>): void => {
    const index = wechatImages.value.findIndex(img => img.id === id)
    if (index !== -1) {
      wechatImages.value[index] = { ...wechatImages.value[index], ...updates }
    }
  }

  // V2新增：设置上传状态
  const setUploadStatus = (status: Partial<UploadStatus>): void => {
    uploadStatus.value = { ...uploadStatus.value, ...status }
  }

  // V2新增：重置上传状态
  const resetUploadStatus = (): void => {
    uploadStatus.value = {
      total: 0,
      completed: 0,
      failed: 0,
      status: 'idle',
      errors: []
    }
  }

  // V2新增：清除所有微信图片
  const clearWechatImages = (): void => {
    wechatImages.value = []
  }

  return {
    // 状态
    currentStep,
    rawText,
    contentBlocks,
    styleConfig,
    wechatImages,
    uploadStatus,
    // 操作
    setStep,
    setRawText,
    setContentBlocks,
    updateBlockType,
    updateBlockText,
    insertImageBlock,
    insertTextBlock,
    setStyleConfig,
    resetApp,
    // V2新增
    setWechatImages,
    addWechatImage,
    updateWechatImage,
    setUploadStatus,
    resetUploadStatus,
    clearWechatImages
  }
})
