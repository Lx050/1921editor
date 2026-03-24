import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Ref } from 'vue'
import type { ContentBlock, StyleConfig, BlockType, WechatImage, UploadProgress } from '@/types'
import { useUserStore } from './userStore'
import { getWechatProxyUrl } from '../utils/wechatApi'

export const useAppStore = defineStore('app', () => {
  // 状态（明确类型注解，无向后兼容）
  const currentStep: Ref<number> = ref(1)
  const currentArticleId: Ref<string | null> = ref(null)
  const rawText: Ref<string> = ref('')
  const contentBlocks: Ref<ContentBlock[]> = ref([])
  const styleConfig: Ref<StyleConfig | null> = ref(null)

  // V3 新增状态：参与者姓名（用于自动化尾部）
  // 默认为空，由用户在设置页配置或从文档解析
  const plannerNames: Ref<string[]> = ref([])   // 审核/校对
  const copywriterNames: Ref<string[]> = ref([]) // 文案/图片来源（需从文档解析）
  const editorNames: Ref<string[]> = ref([])     // 责编

  // V4 新增状态：尾部可变字段（用于不同模式）
  const teamName: Ref<string> = ref('')           // 团队名称（三下乡模式，需从文档解析）
  const sourceAccount: Ref<string> = ref('')      // 来源公众号名称（转载模式，需从文档解析）
  const imageSource: Ref<string> = ref('')        // 图片来源（日常模式）
  const editorInput: Ref<string> = ref('')        // 编辑人员（用户填写，默认为空）

  // V2 新增状态：微信图片上传相关
  // Hydrate from localStorage (only images with real URLs, not blob:)
  // Re-apply proxy URLs so WeChat CDN images display in browser
  const _savedImages: WechatImage[] = (() => {
    try {
      const raw = localStorage.getItem('manifold_wechat_images')
      if (raw) {
        return JSON.parse(raw)
          .filter((img: any) => img.url && !img.url.startsWith('blob:'))
          .map((img: any) => ({
            ...img,
            proxyUrl: img.url ? getWechatProxyUrl(img.url) : img.proxyUrl
          }))
      }
    } catch { /* ignore */ }
    return []
  })()
  const wechatImages: Ref<WechatImage[]> = ref(_savedImages)
  const uploadProgress: Ref<UploadProgress> = ref({
    total: 0,
    completed: 0,
    failed: 0,
    uploading: 0,
  })
  const isUploading: Ref<boolean> = ref(false)

  // Manifold Editor 状态
  const editorJson: Ref<any> = ref(null)
  const imageSlotRegistry: Ref<Record<string, any>> = ref({})

  // 操作（严格类型注解）
  const setStep = (step: number): void => {
    if (typeof step !== 'number' || step < 1 || step > 3) {
      throw new Error('Invalid step: must be a number between 1 and 3')
    }
    currentStep.value = step
  }

  const setCurrentArticleId = (id: string | null): void => {
    if (id !== null && typeof id !== 'string') {
      throw new Error('Invalid article ID: must be a string or null')
    }
    currentArticleId.value = id
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

  // 移动内容块位置（拖拽排序）
  const moveBlock = (fromIndex: number, toIndex: number): void => {
    if (fromIndex === toIndex) return
    if (fromIndex < 0 || fromIndex >= contentBlocks.value.length) return
    if (toIndex < 0 || toIndex >= contentBlocks.value.length) return
    const [moved] = contentBlocks.value.splice(fromIndex, 1)
    contentBlocks.value.splice(toIndex, 0, moved)
  }

  // 在指定位置插入SVG装饰块
  const insertSvgBlock = (index: number, svgTpl: { id: string; name: string; svg: string }): void => {
    const newBlock = {
      id: `svg_${Date.now()}`,
      type: 'svg_decoration' as BlockType,
      text: '',
      meta: { svgTemplateId: svgTpl.id, svgName: svgTpl.name, svgContent: svgTpl.svg }
    } as ContentBlock
    if (index < 0 || index > contentBlocks.value.length) {
      contentBlocks.value.push(newBlock)
    } else {
      contentBlocks.value.splice(index, 0, newBlock)
    }
  }

  const setStyleConfig = (config: Partial<StyleConfig>): void => {
    if (typeof config !== 'object' || config === null) {
      throw new Error('Invalid config: must be a non-null object')
    }

    styleConfig.value = { ...(styleConfig.value || {}), ...config }
  }

  // V2 新增方法：微信图片管理
  /** Persist wechatImages to localStorage (exclude ephemeral blob: URLs) */
  const _persistImages = (): void => {
    try {
      const persistable = wechatImages.value.filter(img => img.url && !img.url.startsWith('blob:'))
      localStorage.setItem('manifold_wechat_images', JSON.stringify(persistable))
    } catch { /* quota exceeded or unavailable */ }
  }

  const addWechatImage = (image: WechatImage): void => {
    wechatImages.value.push(image)
    _persistImages()
  }

  const addWechatImages = (images: WechatImage[]): void => {
    wechatImages.value.push(...images)
    _persistImages()
  }

  const setWechatImages = (images: WechatImage[]): void => {
    wechatImages.value = [...images]
    _persistImages()
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
    try { localStorage.removeItem('manifold_wechat_images') } catch {}
  }

  const clearEditorState = (): void => {
    editorJson.value = null
    contentBlocks.value = []
  }

  // 只清空 editorJson，保留 contentBlocks（供 Step2 直接使用）
  const clearEditorJson = (): void => {
    editorJson.value = null
  }

  const resetApp = (): void => {
    currentStep.value = 1
    currentArticleId.value = null
    rawText.value = ''
    contentBlocks.value = []
    editorJson.value = null
    imageSlotRegistry.value = {}
    styleConfig.value = null
    // V2: 重置微信图片状态
    wechatImages.value = []
    uploadProgress.value = { total: 0, completed: 0, failed: 0, uploading: 0 }
    isUploading.value = false
    // V3: 重置参与者名称
    plannerNames.value = []
    copywriterNames.value = []
    editorNames.value = []
    // V4: 重置尾部可变字段（需从文档解析）
    teamName.value = ''
    sourceAccount.value = ''
    imageSource.value = ''
    editorInput.value = ''  // 编辑人员（用户填写）

    // 清除持久化存储，防止旧数据干扰新会话
    try { localStorage.removeItem('manifold_editor_autosave') } catch {}
    try { localStorage.removeItem('manifold_editor_autosave_ts') } catch {}
    try { sessionStorage.removeItem('manifold_step1_blocks') } catch {}
    try { sessionStorage.removeItem('manifold_step1_rawText_len') } catch {}

    // 🚀 核心优化：每次重置时，如果用户已登录，自动填充姓名
    const userStore = useUserStore()
    if (userStore.userInfo) {
      initializeUserMetadata(userStore.userInfo)
    }
  }

  /**
   * 根据登录用户信息初始化元数据
   * @param userInfo 用户信息对象
   */
  const initializeUserMetadata = (userInfo: any): void => {
    // 调试打印，确保我们知道 userInfo 的结构
    console.log('[Store] 初始化用户元数据, userInfo:', userInfo)

    if (userInfo) {
      // 优先级：displayName > name > nickname > username > email
      const name =
        userInfo.displayName ||
        userInfo.name ||
        userInfo.nickname ||
        userInfo.username ||
        userInfo.email ||
        ''
      if (name) {
        console.log('[Store] 自动填充编辑姓名:', name)
        editorInput.value = name
      }
    }
  }

  return {
    // 状态
    currentStep,
    currentArticleId,
    rawText,
    contentBlocks,
    styleConfig,
    // V2 新增状态
    wechatImages,
    uploadProgress,
    isUploading,
    plannerNames,
    copywriterNames,
    editorNames,
    // V4 新增状态：尾部可变字段
    teamName,
    sourceAccount,
    imageSource,
    editorInput,
    // 操作
    setStep,
    setCurrentArticleId,
    setRawText,
    setContentBlocks,
    updateBlockType,
    updateBlockText,
    updateBlockMeta,
    insertImageBlock,
    insertTextBlock,
    moveBlock,
    insertSvgBlock,
    setStyleConfig,
    // V2 新增操作
    addWechatImage,
    addWechatImages,
    setWechatImages,
    updateUploadProgress,
    setIsUploading,
    clearWechatImages,
    clearEditorState,
    clearEditorJson,
    resetApp,
    initializeUserMetadata,
    // Manifold Editor
    editorJson,
    imageSlotRegistry
  }
})

