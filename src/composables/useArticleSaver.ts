import { ref } from 'vue'
import { getWechatProxyUrl, restoreWechatUrl } from '../utils/wechatApi'
import type { WechatImage } from '../types/wechat'

// Minimal slice of appStore properties consumed by saveDraft
interface AppStoreLike {
  currentArticleId: string | null
  setCurrentArticleId(id: string | null): void
  contentBlocks: Array<{ type: string; text?: string; meta?: { aiImageUrl?: string } }>
  wechatImages: WechatImage[]
  styleConfig: Record<string, unknown> | null
  editorInput: string
  teamName: string
  sourceAccount: string
  copywriterNames: string[]
  plannerNames: string[]
  editorNames: string[]
}

// Minimal slice of configStore properties consumed by saveDraft
// (currently none are used, but typed here for future-proofing)
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ConfigStoreLike {}

// Minimal interface for tokenStorage
interface TokenStorageLike {
  getToken(): string | null
}

// Minimal interface for the toast service
interface ToastLike {
  success(msg: string): void
  error(msg: string): void
  warning(msg: string): void
}

export function useArticleSaver(
  appStore: AppStoreLike,
  _configStore: ConfigStoreLike,
  tokenStorage: TokenStorageLike,
  toast: ToastLike
) {
  const isSaving = ref(false)

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

  // 保存草稿到后端 - 保存内容和样式配置
  const saveDraft = async (): Promise<boolean> => {
    if (isSaving.value) return false

    isSaving.value = true

    try {
      if (!tokenStorage.getToken()) {
        toast.warning('请先登录后再保存')
        return false
      }

      // 清理内容块，移除编辑器内部字段
      const cleanedBlocks = appStore.contentBlocks.map(block => ({
        type: block.type,
        text: block.text || '',
        ...(block.meta?.aiImageUrl ? { aiImageUrl: block.meta.aiImageUrl } : {})
      }))

      const cleanContent = JSON.stringify(cleanedBlocks)
      const articleId = appStore.currentArticleId

      if (articleId) {
        // 🚀 并行优化：内容、图片库、样式配置同时保存

        const saveTasks: Promise<string>[] = []

        // 1. 保存内容 (使用 Step3 专用端点)
        saveTasks.push(
          fetch(`/api/articles/${articleId}/step3-content`, {
            method: 'PUT',
            headers: buildAuthHeaders(),
            body: JSON.stringify({ content: cleanContent })
          }).then(async r => {
            if (!r.ok) {
              const err = await r.json().catch(() => ({ message: 'Unknown error' }))
              throw new Error(`保存内容失败: ${r.status} ${err.message}`)
            }
            return 'content'
          })
        )

        // 2. 保存图片库
        const imagesToSave = appStore.wechatImages
          .filter(img => img.status === 'success' && img.mediaId)
          .map(img => {
            const normalizedUrl = restoreWechatUrl(img.url || img.proxyUrl || '')
            const proxyUrl = normalizedUrl ? getWechatProxyUrl(normalizedUrl) : ''
            return {
              id: img.id,
              mediaId: img.mediaId,
              url: normalizedUrl || img.url,
              proxyUrl: proxyUrl,
              name: img.name,
              status: img.status
            }
          })

        if (imagesToSave.length > 0) {
          saveTasks.push(
            fetch(`/api/articles/${articleId}/images`, {
              method: 'PUT',
              headers: buildAuthHeaders(),
              body: JSON.stringify({ images: imagesToSave })
            }).then(r => {
              if (!r.ok) throw new Error('保存图片库失败')
              return 'images'
            })
          )
        }

        // 3. 保存样式配置与元数据
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

        saveTasks.push(
          fetch(`/api/articles/${articleId}/config`, {
            method: 'PUT',
            headers: buildAuthHeaders(),
            body: JSON.stringify({ config: fullConfig })
          }).then(r => {
            if (!r.ok) throw new Error('保存配置失败')
            return 'config'
          })
        )

        // 等待所有任务完成
        await Promise.all(saveTasks)

        toast.success('草稿已保存（内容、图片、样式同步完成）')
      } else {
        // 创建新文章 - 先创建，再更新内容
        const title =
          appStore.contentBlocks.find(b => b.type === 'title')?.text || '未命名文章'

        // Step 1: 创建文章（只传 title 和 config）
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
          throw new Error((errorData as { message?: string }).message || '创建文章失败')
        }

        const data = await createResponse.json() as { id: string }
        appStore.setCurrentArticleId(data.id)

        // Step 2: Step3 内容保存（设置状态为 ADJUSTED）
        const updateResponse = await fetch(`/api/articles/${data.id}/step3-content`, {
          method: 'PUT',
          headers: buildAuthHeaders(),
          body: JSON.stringify({ content: cleanContent })
        })

        if (!updateResponse.ok) {
          const errorData = await updateResponse.json().catch(() => ({}))
          throw new Error(
            (errorData as { message?: string }).message || '保存Step3内容失败'
          )
        }

        // V2: 创建后保存微信图片库 (使用代理 URL)
        const newArticleImages = appStore.wechatImages
          .filter(img => img.status === 'success' && img.mediaId)
          .map(img => {
            const normalizedUrl = restoreWechatUrl(img.url || img.proxyUrl || '')
            const proxyUrl = normalizedUrl ? getWechatProxyUrl(normalizedUrl) : ''
            return {
              id: img.id,
              mediaId: img.mediaId,
              url: normalizedUrl || img.url,
              proxyUrl: proxyUrl,
              name: img.name,
              status: img.status
            }
          })

        if (newArticleImages.length > 0) {
          const imgRes = await fetch(`/api/articles/${data.id}/images`, {
            method: 'PUT',
            headers: buildAuthHeaders(),
            body: JSON.stringify({ images: newArticleImages })
          })
          if (!imgRes.ok) {
            console.warn('[useArticleSaver] Failed to save article images:', imgRes.status)
          }
        }

        toast.success('文章已创建并保存！')
      }

      return true // 返回成功状态
    } catch (error: unknown) {
      console.error('保存失败:', error)
      const message = error instanceof Error ? error.message : String(error)
      toast.error('保存失败: ' + message)
      return false
    } finally {
      isSaving.value = false
    }
  }

  return { isSaving, saveDraft }
}
