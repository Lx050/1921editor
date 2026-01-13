/**
 * HTML 生成 Composable
 * 处理 Step3 预览页面的 HTML 生成和预览更新逻辑
 */
import { ref, watch, type Ref, type ComputedRef } from 'vue'
import { createLogger } from '@/utils/logger'
import { buildHtml } from '@/utils/styleAssembler'
import DOMPurify from 'dompurify'
import type { ContentBlock, StyleConfig } from '@/types'
import type { ImageReplacement } from '@/types/preview'

const step3Logger = createLogger('Step3:HtmlGeneration')

export function useHtmlGeneration(
  contentBlocks: ComputedRef<ContentBlock[]>,
  styleConfig: ComputedRef<StyleConfig | null>,
  _appStore: unknown,
  imageReplacements: Ref<Record<string, ImageReplacement>>
) {
  const isGenerating = ref(false)
  const finalHtml = ref('')
  const previewHtml = ref('')
  const errorMessage = ref('')
  const activeTab = ref<'preview' | 'code'>('preview')
  const copyButtonText = ref('复制预览')

  /**
   * 根据当前选项卡获取复制按钮文本
   */
  const getCopyButtonLabel = (): string => {
    return activeTab.value === 'preview' ? '复制预览' : '复制代码'
  }

  /**
   * 生成 HTML
   */
  const generateHtml = async (): Promise<void> => {
    isGenerating.value = true
    errorMessage.value = ''

    try {
      await new Promise(resolve => setTimeout(resolve, 500))

      if (contentBlocks.value.length === 0) {
        throw new Error('没有内容块可处理')
      }

      step3Logger.debug('生成HTML，样式配置:', styleConfig.value)

      // 生成带占位符标记的 HTML
      finalHtml.value = buildHtml(contentBlocks.value, styleConfig.value, true)
      previewHtml.value = finalHtml.value

    } catch (error: unknown) {
      step3Logger.error('生成HTML失败:', error)
      const message = error instanceof Error ? error.message : '生成HTML时发生未知错误'
      errorMessage.value = message
    } finally {
      isGenerating.value = false
    }
  }

  /**
   * 重新生成 HTML
   */
  const regenerate = async (): Promise<void> => {
    await generateHtml()
  }

  /**
   * 获取当前预览 HTML 字符串（应用图片替换）
   */
  const getCurrentPreviewHtmlString = (): string => {
    let html = finalHtml.value

    // 应用所有图片替换（使用预览 URL）
    for (const [placeholderId, urls] of Object.entries(imageReplacements.value) as Array<[string, ImageReplacement]>) {
      const imageUrl = urls.previewUrl
      const imgTagRegex = new RegExp(`<img([^>]*data-placeholder="${placeholderId}"[^>]*)>`, 'g')
      html = html.replace(imgTagRegex, (match, attributes) => {
        // void match - 未使用
        const newAttributes = attributes.replace(/src="[^"]*"/, `src="${imageUrl}"`)
        return `<img${newAttributes}>`
      })
    }
    return html
  }

  /**
   * 更新预览 HTML 引用
   */
  const updatePreviewHtmlRef = (): void => {
    const html = getCurrentPreviewHtmlString()
    previewHtml.value = DOMPurify.sanitize(html, {
      ADD_ATTR: ['data-placeholder', 'data-role', 'label', 'data-tplid', 'data-tools', 'data-id', 'data-cropselx1', 'data-cropselx2', 'data-cropsely1', 'data-cropsely2', 'data-imgfileid', 'data-ratio', 'data-w', 'data-s', 'data-type', 'type', 'contenteditable'],
      ADD_TAGS: ['section', 'mp-style-type']
    })
  }

  /**
   * 生成最终输出 HTML（使用微信 URL）
   */
  const getOutputHtml = (): string => {
    let html = finalHtml.value

    // 应用所有图片替换（使用微信 URL 用于最终输出）
    for (const [placeholderId, urls] of Object.entries(imageReplacements.value) as Array<[string, ImageReplacement]>) {
      const imageUrl = urls.wechatUrl || urls.previewUrl
      const imgTagRegex = new RegExp(`<img([^>]*data-placeholder="${placeholderId}"[^>]*)>`, 'g')
      html = html.replace(imgTagRegex, (match, attributes) => {
        // void match - 未使用
        const newAttributes = attributes.replace(/src="[^"]*"/, `src="${imageUrl}"`)
        return `<img${newAttributes}>`
      })
    }

    // 移除 data-placeholder 属性（最终输出不需要）
    html = html.replace(/ data-placeholder="[^"]*"/g, '')

    return html
  }

  // 监听 finalHtml 变化
  watch(finalHtml, (newHtml) => {
    if (newHtml && Object.keys(imageReplacements.value).length === 0) {
      previewHtml.value = newHtml
    }
  })

  // 监听 activeTab 变化
  watch(activeTab, (newTab) => {
    if (newTab === 'preview') {
      previewHtml.value = getCurrentPreviewHtmlString()
    }
  })

  return {
    isGenerating,
    finalHtml,
    previewHtml,
    errorMessage,
    activeTab,
    copyButtonText,
    getCopyButtonLabel,
    generateHtml,
    regenerate,
    getCurrentPreviewHtmlString,
    updatePreviewHtmlRef,
    getOutputHtml
  }
}
