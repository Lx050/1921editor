import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Ref } from 'vue'
import type { ContentBlock, StyleConfig, BlockType, WechatImage, UploadProgress } from '@/types'

export const useAppStore = defineStore('app', () => {
  // 状态（明确类型注解，无向后兼容）
  const currentStep: Ref<number> = ref(1)
  const rawText: Ref<string> = ref('')
  const contentBlocks: Ref<ContentBlock[]> = ref([])
  const styleConfig: Ref<StyleConfig | null> = ref(null)

  // V2 新增状态：微信图片上传相关
  const wechatImages: Ref<WechatImage[]> = ref([])
  const uploadProgress: Ref<UploadProgress> = ref({
    total: 0,
    completed: 0,
    failed: 0,
    uploading: 0,
  })
  const isUploading: Ref<boolean> = ref(false)

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

  const updateBlockMeta = (id: string, meta: Record<string, unknown>): void => {
    const block = contentBlocks.value.find(b => b.id === id)
    if (block) {
      block.meta = { ...block.meta, ...meta }
    }
  }

  const insertImageBlock = (index: number, imageType: 'single' | 'single_caption' | 'double' | 'double_caption'): void => {
    if (typeof index !== 'number' || index < 0) {
      throw new Error('Invalid index: must be a non-negative number')
    }

    // 转换图片类型名称
    let blockType: BlockType;
    if (imageType === 'single') blockType = 'image_single';
    else if (imageType === 'single_caption') blockType = 'image_single_caption';
    else if (imageType === 'double') blockType = 'image_double';
    else blockType = 'image_double_caption';

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

  // V2 新增方法：微信图片管理
  const addWechatImage = (image: WechatImage): void => {
    wechatImages.value.push(image)
  }

  const addWechatImages = (images: WechatImage[]): void => {
    wechatImages.value.push(...images)
  }

  const updateUploadProgress = (progress: UploadProgress): void => {
    uploadProgress.value = { ...progress }
    isUploading.value = progress.uploading > 0
  }

  const setIsUploading = (status: boolean): void => {
    isUploading.value = status
  }

  const clearWechatImages = (): void => {
    wechatImages.value = []
    uploadProgress.value = { total: 0, completed: 0, failed: 0, uploading: 0 }
    isUploading.value = false
  }

  const resetApp = (): void => {
    currentStep.value = 1
    rawText.value = ''
    contentBlocks.value = []
    styleConfig.value = null
    // V2: 重置微信图片状态
    wechatImages.value = []
    uploadProgress.value = { total: 0, completed: 0, failed: 0, uploading: 0 }
    isUploading.value = false
  }

  return {
    // 状态
    currentStep,
    rawText,
    contentBlocks,
    styleConfig,
    // V2 新增状态
    wechatImages,
    uploadProgress,
    isUploading,
    // 操作
    setStep,
    setRawText,
    setContentBlocks,
    updateBlockType,
    updateBlockText,
    updateBlockMeta,
    insertImageBlock,
    insertTextBlock,
    setStyleConfig,
    // V2 新增操作
    addWechatImage,
    addWechatImages,
    updateUploadProgress,
    setIsUploading,
    clearWechatImages,
    resetApp
  }
})

