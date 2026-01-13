/**
 * 图片替换 Composable
 * 处理 Step3 预览页面的图片替换逻辑
 */
import { ref, type Ref } from 'vue'
import { createLogger } from '@/utils/logger'
import { getWechatProxyUrl, restoreWechatUrl } from '@/utils/wechatApi'
import type { WechatImage } from '@/types'
import type { ImageReplacement } from '@/types/preview'

const step3Logger = createLogger('Step3:ImageReplacement')
const previewLogger = createLogger('Preview:ImageReplacement')

export function useImageReplacement(
  previewFrame: Ref<HTMLIFrameElement | null>,
  updatePreviewHtmlRef: () => void
) {
  // 状态
  const selectedPlaceholder = ref<string | null>(null)
  const imageReplacements = ref<Record<string, ImageReplacement>>({})

  /**
   * 处理微信图片选择 - 直接替换，无需确认
   */
  const handleImageSelect = (image: WechatImage): void => {
    const placeholderId = selectedPlaceholder.value
    if (!placeholderId) {
      step3Logger.debug('请先选择右侧预览中的占位符')
      return
    }

    // 使用本地预览 URL 进行预览显示
    const previewUrl = image.localPreviewUrl || image.proxyUrl || getWechatProxyUrl(image.url)
    const wechatUrl = restoreWechatUrl(image.url || image.proxyUrl || previewUrl)

    // 记录替换（保存微信 URL 用于最终输出，本地 URL 用于预览）
    imageReplacements.value[placeholderId] = {
      previewUrl: previewUrl,
      wechatUrl: wechatUrl
    }
    step3Logger.debug('直接替换:', placeholderId, '->', previewUrl)

    // 优化：直接修改 iframe 中的 DOM，避免 reload 导致的闪烁
    updateIframeImageDom(placeholderId, previewUrl)

    // 清除选择状态
    selectedPlaceholder.value = null
  }

  /**
   * 直接更新 iframe DOM
   */
  const updateIframeImageDom = (placeholderId: string, newUrl: string): void => {
    const doc = previewFrame.value?.contentDocument
    if (!doc) return

    try {
      // 查找具有指定占位符标识的图片元素
      const imgs = doc.querySelectorAll<HTMLImageElement>(`img[data-placeholder="${placeholderId}"]`)

      imgs.forEach((img) => {
        // 更新其 src 属性
        img.src = newUrl
        // 清除可能存在的选中样式
        img.style.outline = 'none'
        img.style.boxShadow = 'none'
      })

      previewLogger.debug('DOM 更新成功，已直接反映在 iframe 中')
    } catch (e) {
      previewLogger.warn('DOM 更新失败:', e)
      // 如果 DOM 操作失败，回退到整体刷新 HTML
      updatePreviewHtmlRef()
    }
  }

  /**
   * 应用图片替换到 HTML 字符串
   */
  const applyImageReplacements = (html: string, useWechatUrl = false): string => {
    let result = html

    for (const [placeholderId, urls] of Object.entries(imageReplacements.value) as Array<[string, ImageReplacement]>) {
      const imageUrl = useWechatUrl ? (urls.wechatUrl || urls.previewUrl) : urls.previewUrl
      const imgTagRegex = new RegExp(`<img([^>]*data-placeholder="${placeholderId}"[^>]*)>`, 'g')
      result = result.replace(imgTagRegex, (match, attributes) => {
        // void match - 未使用
        const newAttributes = attributes.replace(/src="[^"]*"/, `src="${imageUrl}"`)
        return `<img${newAttributes}>`
      })
    }

    return result
  }

  /**
   * 清除图片替换记录
   */
  const clearImageReplacements = (): void => {
    imageReplacements.value = {}
    selectedPlaceholder.value = null
  }

  /**
   * 移除 data-placeholder 属性（最终输出不需要）
   */
  const removePlaceholderAttributes = (html: string): string => {
    return html.replace(/ data-placeholder="[^"]*"/g, '')
  }

  return {
    selectedPlaceholder,
    imageReplacements,
    handleImageSelect,
    updateIframeImageDom,
    applyImageReplacements,
    clearImageReplacements,
    removePlaceholderAttributes
  }
}
