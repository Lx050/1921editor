/**
 * 草稿操作 Composable
 * 处理 Step3 预览页面的草稿创建、保存相关逻辑
 */
import { ref, type ComputedRef } from 'vue'
import { createLogger } from '@/utils/logger'
import { useAppStore } from '@/stores/appStore'
import { uploadImage, createDraft } from '@/utils/wechatApi'
import toast from '@/composables/useToast'
import { tokenStorage } from '@/utils/tokenStorage'
import type { DraftArticle, WechatImage, WechatUploadResponse } from '@/types'
import type { DraftFormState, ExternalImage } from '@/types/preview'
import type { ContentBlock } from '@/types'
import type { Router } from 'vue-router'

const step3Logger = createLogger('Step3:DraftOperations')

export function useDraftOperations(
  appStore: ReturnType<typeof useAppStore>,
  contentBlocks: ComputedRef<ContentBlock[]>,
  getOutputHtml: () => string,
  _router: Router
) {
  // 状态
  const showDraftModal = ref(false)
  const isCreatingDraft = ref(false)
  const isUploadingCover = ref(false)
  const draftError = ref('')
  const draftSuccess = ref('')
  const aiImageProgress = ref('')
  const isSaving = ref(false)

  const draftForm = ref<DraftFormState>({
    title: '',
    coverImageId: '',
    author: '',
    digest: '',
    showCover: true
  })

  /**
   * 从内容块中提取标题（第一行通常是大标题）
   */
  const extractTitleFromContent = (): string => {
    const blocks = contentBlocks.value
    const firstBlock = blocks[0]
    if (firstBlock && firstBlock.text && firstBlock.text.trim()) {
      const lines = firstBlock.text.split('\n').filter(line => line.trim())
      if (lines.length > 0) {
        return lines[0].trim().substring(0, 64)
      }
    }
    return ''
  }

  /**
   * 打开草稿弹窗，自动填充标题
   */
  const openDraftModal = (): void => {
    if (!draftForm.value.title) {
      draftForm.value.title = extractTitleFromContent()
    }

    draftError.value = ''
    draftSuccess.value = ''
    showDraftModal.value = true
  }

  /**
   * 处理封面上传
   */
  const handleCoverUpload = async (file: File | null): Promise<void> => {
    if (!file) return

    // 检查文件类型
    if (!file.type.match(/^image\/(jpeg|png)$/)) {
      draftError.value = '封面图仅支持 JPG/PNG 格式'
      return
    }

    // 检查文件大小 (2MB)
    if (file.size > 2 * 1024 * 1024) {
      draftError.value = '封面图大小不能超过 2MB'
      return
    }

    isUploadingCover.value = true
    draftError.value = ''

    try {
      // 1. 上传图片到微信
      const response: WechatUploadResponse = await uploadImage(file)
      const mediaId = response.media_id
      const url = response.url

      if (!mediaId || !url) {
        throw new Error('封面上传失败：缺少 media_id 或 url')
      }

      // 2. 创建图片对象并添加到 Store
      const newImage: WechatImage = {
        id: `cover_${Date.now()}`,
        mediaId,
        url,
        localPreviewUrl: URL.createObjectURL(file),
        name: file.name,
        status: 'success',
        file: file
      }

      // 添加到 store
      appStore.addWechatImages([newImage])

      // 3. 自动选中
      draftForm.value.coverImageId = mediaId

    } catch (error: unknown) {
      step3Logger.error('封面上传失败:', error)
      const message = error instanceof Error ? error.message : '封面上传失败，请重试'
      draftError.value = message
    } finally {
      isUploadingCover.value = false
    }
  }

  /**
   * 同步 Modal 表单数据
   */
  const updateDraftForm = (newForm: Partial<DraftFormState>): void => {
    draftForm.value = { ...draftForm.value, ...newForm }
  }

  /**
   * 提交草稿（创建微信草稿）
   */
  const submitDraft = async (): Promise<void> => {
    if (!draftForm.value.title || !draftForm.value.coverImageId) return

    isCreatingDraft.value = true
    draftError.value = ''
    draftSuccess.value = ''

    try {
      let content = getOutputHtml()

      // ========== 处理 AI 生成的外部图片 URL ==========
      const externalImageRegex = new RegExp(
        '<img[^>]+src="(https:\\/\\/(?:ark\\.cn-beijing\\.volces\\.com|image\\.pollinations\\.ai)[^"]+)"[^>]*>',
        'g'
      )
      const externalImages: ExternalImage[] = []

      let match: RegExpExecArray | null = null
      while ((match = externalImageRegex.exec(content)) !== null) {
        externalImages.push({
          original: match[1],
          tag: match[0]
        })
      }

      if (externalImages.length > 0) {
        step3Logger.debug(`检测到 ${externalImages.length} 张外部AI图片，开始优化并发上传...`)
        aiImageProgress.value = `初始化上传管理器...`

        try {
          // 动态导入并发上传管理器
          const { ConcurrentUploadManager } = await import('@/utils/concurrentUpload')

          const uploadManager = new ConcurrentUploadManager({
            maxConcurrent: 3,
            timeout: 45000,
            enableRetry: true,
            maxRetries: 2,
            retryDelay: 1000
          })

          uploadManager.onProgress((progress) => {
            const stats = uploadManager.getStats()
            const overallProgress = Math.round((stats.completed / stats.total) * 100)
            aiImageProgress.value = `${progress.message} (${stats.completed}/${stats.total}) - ${overallProgress}%`
            step3Logger.debug(`${progress.taskId}: ${progress.message}`)
          })

          const imageUrls = externalImages.map(img => img.original)
          aiImageProgress.value = `开始并发下载和上传 ${imageUrls.length} 张图片...`

          const { results, errors } = await uploadManager.downloadAndUpload(
            imageUrls,
            async (file) => {
              const uploadResult = await uploadImage(file)
              if (!uploadResult.url) {
                throw new Error('上传失败: 缺少图片 URL')
              }
              return { url: uploadResult.url }
            }
          )

          if (results.length > 0) {
            const urlMap = new Map(results.map(r => [r.original, r.newUrl]))
            let replacedCount = 0
            externalImages.forEach(({ original, tag }) => {
              const newUrl = urlMap.get(original)
              if (newUrl) {
                const newTag = tag.replace(original, newUrl)
                content = content.replace(tag, newTag)
                replacedCount++
              }
            })

            aiImageProgress.value = `✓ AI图片处理完成: ${replacedCount}/${imageUrls.length} 张成功`
            step3Logger.debug(`AI图片处理完成 - 成功: ${replacedCount}, 失败: ${errors.length}`)
          }

          if (errors.length > 0) {
            step3Logger.error(`部分AI图片处理失败:`, errors)
          }

        } catch (uploadError: unknown) {
          step3Logger.error('AI图片批量处理失败:', uploadError)
          const message = uploadError instanceof Error ? uploadError.message : String(uploadError)
          throw new Error(`AI图片处理失败: ${message}`)
        }
      }
      // ========== 处理完毕 ==========

      const showCoverPic: 0 | 1 = draftForm.value.showCover ? 1 : 0
      const article: DraftArticle = {
        title: draftForm.value.title,
        thumb_media_id: draftForm.value.coverImageId,
        author: draftForm.value.author,
        digest: draftForm.value.digest,
        show_cover_pic: showCoverPic,
        content: content,
        need_open_comment: 1,
        only_fans_can_comment: 0
      }

      const result = await createDraft(article)
      const draftId = result.draft_id || result.media_id
      if (!draftId) {
        throw new Error('创建草稿失败: 缺少草稿 ID')
      }
      draftSuccess.value = draftId
      step3Logger.debug('草稿创建成功:', result)

      sessionStorage.setItem('wechat_draft_id', draftId)
      sessionStorage.setItem('wechat_draft_title', article.title)
      sessionStorage.setItem('wechat_draft_author', article.author || '')
      sessionStorage.setItem('wechat_draft_digest', article.digest || '')
      sessionStorage.setItem('wechat_draft_content', content)

      setTimeout(() => {
        showDraftModal.value = false
        setTimeout(() => {
          draftSuccess.value = ''
        }, 500)
      }, 3000)

    } catch (error: unknown) {
      step3Logger.error('创建草稿失败:', error)
      draftError.value = error instanceof Error ? error.message : '创建草稿失败，请检查网络或配置'
      aiImageProgress.value = ''
    } finally {
      isCreatingDraft.value = false
      setTimeout(() => {
        aiImageProgress.value = ''
      }, 2000)
    }
  }

  /**
   * 保存草稿到后端
   */
  const saveDraft = async (): Promise<boolean> => {
    if (isSaving.value) return false

    isSaving.value = true
    step3Logger.debug('=== 开始保存草稿 ===')

    try {
      if (!tokenStorage.getToken()) {
        toast.warning('请先登录后再保存')
        return false
      }

      const cleanedBlocks = contentBlocks.value.map(block => ({
        type: block.type,
        text: block.text || '',
        ...(block.meta?.aiImageUrl ? { aiImageUrl: block.meta.aiImageUrl } : {})
      }))

      const cleanContent = JSON.stringify(cleanedBlocks)
      const articleId = appStore.currentArticleId

      step3Logger.debug('当前文章ID:', articleId)
      step3Logger.debug('清理后的内容块数量:', cleanedBlocks.length)

      const buildAuthHeaders = (): Record<string, string> => {
        const headers: Record<string, string> = {
          'Content-Type': 'application/json'
        }
        const token = tokenStorage.getToken()
        if (token) {
          headers.Authorization = `Bearer ${token}`
        }
        return headers
      }

      if (articleId) {
        step3Logger.debug('正在并行保存内容、图片和配置...')

        const saveTasks = []

        saveTasks.push(fetch(`/api/articles/${articleId}/step3-content`, {
          method: 'PUT',
          headers: buildAuthHeaders(),
          body: JSON.stringify({ content: cleanContent })
        }).then(async r => {
          if (!r.ok) {
            const err = await r.json().catch(() => ({ message: 'Unknown error' }))
            throw new Error(`保存内容失败: ${r.status} ${err.message}`)
          }
          return 'content'
        }))

        const imagesToSave = appStore.wechatImages
          .filter(img => img.status === 'success' && img.mediaId)
          .map(img => {
            const normalizedUrl = img.url || img.proxyUrl || ''
            return {
              id: img.id,
              mediaId: img.mediaId,
              url: normalizedUrl,
              proxyUrl: img.proxyUrl || '',
              name: img.name,
              status: img.status
            }
          })

        if (imagesToSave.length > 0) {
          saveTasks.push(fetch(`/api/articles/${articleId}/images`, {
            method: 'PUT',
            headers: buildAuthHeaders(),
            body: JSON.stringify({ images: imagesToSave })
          }).then(r => {
            if (!r.ok) throw new Error('保存图片库失败')
            return 'images'
          }))
        }

        const fullConfig = {
          ...appStore.styleConfig,
          metadata: {
            editorInput: appStore.editorInput,
            teamName: appStore.teamName,
            sourceAccount: appStore.sourceAccount,
            copywriterNames: appStore.copywriterNames,
            plannerNames: appStore.plannerNames,
            editorNames: appStore.editorNames
          }
        }

        saveTasks.push(fetch(`/api/articles/${articleId}/config`, {
          method: 'PUT',
          headers: buildAuthHeaders(),
          body: JSON.stringify({ config: fullConfig })
        }).then(r => {
          if (!r.ok) throw new Error('保存配置失败')
          return 'config'
        }))

        const results = await Promise.all(saveTasks)
        step3Logger.debug('并行保存完成:', results)

        toast.success('草稿已保存（内容、图片、样式同步完成）')
      } else {
        const title = contentBlocks.value.find(b => b.type === 'title')?.text || '未命名文章'

        const createResponse = await fetch('/api/articles', {
          method: 'POST',
          headers: buildAuthHeaders(),
          body: JSON.stringify({
            title,
            config: appStore.styleConfig
          })
        })

        if (!createResponse.ok) {
          const errorData = await createResponse.json().catch(() => ({}))
          throw new Error(errorData.message || '创建文章失败')
        }

        const data = await createResponse.json()
        appStore.setCurrentArticleId(data.id)

        const updateResponse = await fetch(`/api/articles/${data.id}/step3-content`, {
          method: 'PUT',
          headers: buildAuthHeaders(),
          body: JSON.stringify({ content: cleanContent })
        })

        if (!updateResponse.ok) {
          const errorData = await updateResponse.json().catch(() => ({}))
          throw new Error(errorData.message || '保存Step3内容失败')
        }

        const newArticleImages = appStore.wechatImages
          .filter(img => img.status === 'success' && img.mediaId)
          .map(img => {
            const normalizedUrl = img.url || img.proxyUrl || ''
            return {
              id: img.id,
              mediaId: img.mediaId,
              url: normalizedUrl,
              proxyUrl: img.proxyUrl || '',
              name: img.name,
              status: img.status
            }
          })

        if (newArticleImages.length > 0) {
          step3Logger.debug('新文章保存图片:', newArticleImages.length, '张')
          await fetch(`/api/articles/${data.id}/images`, {
            method: 'PUT',
            headers: buildAuthHeaders(),
            body: JSON.stringify({ images: newArticleImages })
          })
        }

        toast.success('文章已创建并保存！')
      }

      return true
    } catch (error: unknown) {
      step3Logger.error('保存失败:', error)
      const message = error instanceof Error ? error.message : String(error)
      toast.error('保存失败: ' + message)
      return false
    } finally {
      isSaving.value = false
    }
  }

  return {
    showDraftModal,
    isCreatingDraft,
    isUploadingCover,
    draftError,
    draftSuccess,
    aiImageProgress,
    draftForm,
    openDraftModal,
    handleCoverUpload,
    updateDraftForm,
    submitDraft,
    saveDraft
  }
}
