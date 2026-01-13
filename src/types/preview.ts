/**
 * Step3Preview 相关类型定义
 */

/** 图片替换记录 */
export interface ImageReplacement {
  previewUrl: string
  wechatUrl?: string
}

/** 草稿表单状态 */
export interface DraftFormState {
  title: string
  coverImageId: string
  author: string
  digest: string
  showCover: boolean
}

/** 外部图片（AI 生成） */
export interface ExternalImage {
  original: string
  tag: string
}

/** 保存的内容块 */
export interface SavedBlock {
  type?: string
  text?: string
  aiImageUrl?: string
  meta?: {
    aiImageUrl?: string
  }
}
