import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Ref } from 'vue'
import type { ContentBlock, StyleConfig, BlockType } from '@/types'

export const useAppStore = defineStore('app', () => {
  // 状态（明确类型注解，无向后兼容）
  const currentStep: Ref<number> = ref(1)
  const rawText: Ref<string> = ref('')
  const contentBlocks: Ref<ContentBlock[]> = ref([])
  const styleConfig: Ref<StyleConfig | null> = ref(null)

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
  }

  return {
    // 状态
    currentStep,
    rawText,
    contentBlocks,
    styleConfig,
    // 操作
    setStep,
    setRawText,
    setContentBlocks,
    updateBlockType,
    updateBlockText,
    insertImageBlock,
    insertTextBlock,
    setStyleConfig,
    resetApp
  }
})
