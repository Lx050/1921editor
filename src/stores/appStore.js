import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  // 状态
  const currentStep = ref(1)
  const rawText = ref('')
  const contentBlocks = ref([])
  const styleConfig = ref(null)

  // 操作
  const setStep = (step) => {
    currentStep.value = step
  }

  const setRawText = (text) => {
    rawText.value = text
  }

  const setContentBlocks = (blocks) => {
    contentBlocks.value = blocks
  }

  const updateBlockType = (id, type) => {
    const block = contentBlocks.value.find(b => b.id === id)
    if (block) {
      block.type = type
    }
  }

  const updateBlockText = (id, text) => {
    const block = contentBlocks.value.find(b => b.id === id)
    if (block) {
      block.text = text
    }
  }

  const insertImageBlock = (index, imageType) => {
    // 转换图片类型名称
    const blockType = imageType === 'single' ? 'image_single' : 'image_double'

    contentBlocks.value.splice(index + 1, 0, {
      id: `image_${Date.now()}`,
      type: blockType,
      text: ''
    })
  }

  const insertTextBlock = (index, textType, text) => {
    contentBlocks.value.splice(index, 0, {
      id: `text_${Date.now()}`,
      type: textType,
      text: text
    })
  }

  const setStyleConfig = (config) => {
    styleConfig.value = { ...styleConfig.value, ...config }
  }

  const resetApp = () => {
    currentStep.value = 1
    rawText.value = ''
    contentBlocks.value = []
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