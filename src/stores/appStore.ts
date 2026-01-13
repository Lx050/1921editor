import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Ref } from 'vue'
import type { ContentBlock, StyleConfig, BlockType, WechatImage, UploadProgress } from '@/types'
import { useUserStore } from './userStore'

export const useAppStore = defineStore('app', () => {
  // 状态
  const currentStep: Ref<number> = ref(1)
  const currentArticleId: Ref<string | null> = ref(null)
  const rawText: Ref<string> = ref('')
  const contentBlocks: Ref<ContentBlock[]> = ref([])
  const styleConfig: Ref<StyleConfig | null> = ref(null)

  // V3 新增状态：参与者姓名（用于自动化尾部）
  const plannerNames: Ref<string[]> = ref(['王雪', '宋欣翼'])
  const copywriterNames: Ref<string[]> = ref([])
  const editorNames: Ref<string[]> = ref(['朱梦鹤'])

  // V4 新增状态：尾部可变字段
  const teamName: Ref<string> = ref('')
  const teamProject: Ref<string> = ref('')
  const teamDepartment: Ref<string> = ref('')
  const teamLeader: Ref<string> = ref('')
  const teamContact: Ref<string> = ref('')
  const sourceAccount: Ref<string> = ref('')
  const imageSource: Ref<string> = ref('')
  const editorInput: Ref<string> = ref('')

  // V2 新增状态：微信图片上传相关
  const wechatImages: Ref<WechatImage[]> = ref([])
  const uploadProgress: Ref<UploadProgress> = ref({
    total: 0,
    completed: 0,
    failed: 0,
    uploading: 0,
  })
  const isUploading: Ref<boolean> = ref(false)

  // 辅助函数：递归查找 Block
  const findBlockRecursive = (blocks: ContentBlock[], id: string): ContentBlock | undefined => {
    for (const block of blocks) {
      if (block.id === id) return block
      if (block.children) {
        const found = findBlockRecursive(block.children, id)
        if (found) return found
      }
    }
    return undefined
  }

  // 辅助函数：找到包含某个 block 的父级列表
  const findParentList = (list: ContentBlock[], targetId: string): ContentBlock[] | null => {
    const idx = list.findIndex(b => b.id === targetId)
    if (idx !== -1) return list
    for (const b of list) {
      if (b.children) {
        const res = findParentList(b.children, targetId)
        if (res) return res
      }
    }
    return null
  }

  // 辅助函数：递归删除 Block
  const deleteBlockRecursive = (blocks: ContentBlock[], id: string): boolean => {
    const index = blocks.findIndex(b => b.id === id)
    if (index !== -1) {
      blocks.splice(index, 1)
      return true
    }
    for (const block of blocks) {
      if (block.children && deleteBlockRecursive(block.children, id)) return true
    }
    return false
  }

  // 操作
  const setStep = (step: number): void => {
    currentStep.value = step
  }

  const setCurrentArticleId = (id: string | null): void => {
    currentArticleId.value = id
  }

  const setRawText = (text: string): void => {
    rawText.value = text
  }

  const setContentBlocks = (blocks: ContentBlock[]): void => {
    contentBlocks.value = blocks
  }

  const updateBlockType = (id: string, type: BlockType): void => {
    const block = findBlockRecursive(contentBlocks.value, id)
    if (block) block.type = type
  }

  const updateBlockText = (id: string, text: string): void => {
    const block = findBlockRecursive(contentBlocks.value, id)
    if (block) block.text = text
  }

  const updateBlockMeta = (id: string, meta: Record<string, unknown>): void => {
    const block = findBlockRecursive(contentBlocks.value, id)
    if (block) block.meta = { ...(block.meta || {}), ...meta }
  }

  /**
   * 核心插入函数：支持递归插入
   */
  const insertBlockAt = (index: number, newBlock: ContentBlock, relativeToId?: string): void => {
    if (relativeToId) {
      const parentList = findParentList(contentBlocks.value, relativeToId)
      if (parentList) {
        const idx = parentList.findIndex(b => b.id === relativeToId)
        parentList.splice(idx + 1, 0, newBlock)
        return
      }
    }
    // 默认插入到顶层
    contentBlocks.value.splice(index, 0, newBlock)
  }

  const insertImageBlock = (index: number, imageType: 'single' | 'single_caption' | 'double' | 'double_caption', relativeToId?: string): void => {
    let blockType: BlockType
    if (imageType === 'single') blockType = 'image_single'
    else if (imageType === 'single_caption') blockType = 'image_single_caption'
    else if (imageType === 'double') blockType = 'image_double'
    else blockType = 'image_double_caption'

    const newBlock: ContentBlock = {
      id: `image_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      type: blockType,
      text: ''
    }
    insertBlockAt(index, newBlock, relativeToId)
  }

  const insertTextBlock = (index: number, textType: BlockType, text: string, relativeToId?: string): void => {
    const newBlock: ContentBlock = {
      id: `text_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      type: textType,
      text: text
    }
    insertBlockAt(index, newBlock, relativeToId)
  }

  const insertContainerBlock = (index: number, relativeToId?: string): void => {
    const newBlock: ContentBlock = {
      id: `container_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      type: 'container',
      text: '',
      children: []
    }
    insertBlockAt(index, newBlock, relativeToId)
  }

  const deleteBlock = (id: string): void => {
    deleteBlockRecursive(contentBlocks.value, id)
  }

  const moveBlock = (blockId: string, targetId: string, position: 'top' | 'bottom' | 'inside', options: { flatten?: boolean } = {}): void => {
    let blockToMove: ContentBlock | undefined

    // 1. 从原位置移除
    const findAndRemove = (list: ContentBlock[]): boolean => {
      const idx = list.findIndex(b => b.id === blockId)
      if (idx !== -1) {
        blockToMove = list.splice(idx, 1)[0]
        return true
      }
      for (const b of list) {
        if (b.children && findAndRemove(b.children)) return true
      }
      return false
    }

    findAndRemove(contentBlocks.value)
    if (!blockToMove) return

    // 2. 如果需要拆散嵌套 (Flatten)
    let blocksToInsert: ContentBlock[] = [blockToMove]
    if (options.flatten && blockToMove.type === 'container' && blockToMove.children) {
      blocksToInsert = blockToMove.children
    }

    // 3. 插入到新位置
    if (position === 'inside') {
      const target = findBlockRecursive(contentBlocks.value, targetId)
      if (target && target.type === 'container') {
        if (!target.children) target.children = []
        target.children.push(...blocksToInsert)
      } else {
        contentBlocks.value.push(...blocksToInsert)
      }
    } else {
      const findTargetParent = (list: ContentBlock[]): { parent: ContentBlock[], index: number } | null => {
        const idx = list.findIndex(b => b.id === targetId)
        if (idx !== -1) return { parent: list, index: idx }
        for (const b of list) {
          if (b.children) {
            const res = findTargetParent(b.children)
            if (res) return res
          }
        }
        return null
      }

      const info = findTargetParent(contentBlocks.value)
      if (info) {
        const insertIdx = position === 'top' ? info.index : info.index + 1
        info.parent.splice(insertIdx, 0, ...blocksToInsert)
      } else {
        contentBlocks.value.push(...blocksToInsert)
      }
    }
  }

  const mergeBlocks = (newBlocks: ContentBlock[], options: { index?: number, relativeToId?: string, asGroup?: boolean } = {}): void => {
    let blocksToInsert = newBlocks

    if (options.asGroup) {
      const container: ContentBlock = {
        id: `container_merge_${Date.now()}`,
        type: 'container',
        text: '',
        children: newBlocks
      }
      blocksToInsert = [container]
    }

    if (options.relativeToId) {
      const parentList = findParentList(contentBlocks.value, options.relativeToId)
      if (parentList) {
        const idx = parentList.findIndex(b => b.id === options.relativeToId)
        parentList.splice(idx + 1, 0, ...blocksToInsert)
        return
      }
    }

    const insertIdx = options.index !== undefined ? options.index : contentBlocks.value.length
    contentBlocks.value.splice(insertIdx, 0, ...blocksToInsert)
  }

  const setStyleConfig = (config: Partial<StyleConfig>): void => {
    styleConfig.value = { ...(styleConfig.value || {}), ...config } as StyleConfig
  }

  const addWechatImage = (image: WechatImage): void => {
    wechatImages.value.push(image)
  }

  const addWechatImages = (images: WechatImage[]): void => {
    wechatImages.value.push(...images)
  }

  const setWechatImages = (images: WechatImage[]): void => {
    wechatImages.value = [...images]
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

  const initializeUserMetadata = (userInfo: any): void => {
    if (userInfo) {
      const name = userInfo.displayName || userInfo.name || userInfo.nickname || userInfo.username || userInfo.email || ''
      if (name) editorInput.value = name
    }
  }

  const resetApp = (): void => {
    currentStep.value = 1
    currentArticleId.value = null
    rawText.value = ''
    contentBlocks.value = []
    styleConfig.value = null
    wechatImages.value = []
    uploadProgress.value = { total: 0, completed: 0, failed: 0, uploading: 0 }
    isUploading.value = false
    plannerNames.value = ['王雪', '宋欣翼']
    copywriterNames.value = []
    editorNames.value = ['朱梦鹤']
    teamName.value = ''
    teamProject.value = ''
    teamDepartment.value = ''
    teamLeader.value = ''
    teamContact.value = ''
    sourceAccount.value = ''
    imageSource.value = ''
    editorInput.value = ''

    const userStore = useUserStore()
    if (userStore.userInfo) {
      initializeUserMetadata(userStore.userInfo)
    }
  }

  return {
    currentStep,
    currentArticleId,
    rawText,
    contentBlocks,
    styleConfig,
    wechatImages,
    uploadProgress,
    isUploading,
    plannerNames,
    copywriterNames,
    editorNames,
    teamName,
    teamProject,
    teamDepartment,
    teamLeader,
    teamContact,
    sourceAccount,
    imageSource,
    editorInput,
    setStep,
    setCurrentArticleId,
    setRawText,
    setContentBlocks,
    updateBlockType,
    updateBlockText,
    updateBlockMeta,
    insertImageBlock,
    insertTextBlock,
    insertContainerBlock,
    mergeBlocks,
    deleteBlock,
    moveBlock,
    setStyleConfig,
    addWechatImage,
    addWechatImages,
    setWechatImages,
    updateUploadProgress,
    setIsUploading,
    clearWechatImages,
    initializeUserMetadata,
    resetApp
  }
})
