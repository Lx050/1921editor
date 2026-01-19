import { useAppStore } from '../stores/appStore'
import { createArticle, updateArticleConfig, updateArticleContent, saveArticleDraft } from '../api/article'
import type { ContentBlock } from '@/types'

export class ArticleService {
    /**
     * 保存当前文章为草稿
     */
    static async saveCurrentAsDraft(): Promise<string | null> {
        const appStore = useAppStore()

        try {
            let articleId = appStore.currentArticleId

            // 如果没有当前文章ID，需要先创建文章
            if (!articleId) {
                const title = appStore.rawText ? appStore.rawText.substring(0, 20) + '...' : '未命名文章'
                const newArticle = await createArticle(title)
                articleId = newArticle.id
                appStore.setCurrentArticleId(articleId)
            }

            // 并行更新配置、内容和图片库
            const saveTasks = []

            // 递归清理 Block 数据，保留 children 和所有元数据
            const cleanBlockRecursive = (block: ContentBlock): ContentBlock => {
                return {
                    id: block.id,
                    type: block.type,
                    text: block.text || '',
                    meta: block.meta || {},
                    children: block.children && Array.isArray(block.children) ?
                        block.children.map(cleanBlockRecursive) : undefined
                };
            };

            const cleanedBlocks = appStore.contentBlocks.map(cleanBlockRecursive)
            const cleanContent = JSON.stringify(cleanedBlocks)

            // 1. 更新配置 (包含 rawText 和从文档提取的元数据)
            saveTasks.push(updateArticleConfig(articleId, {
                ...appStore.styleConfig,
                // V5: 添加从文档提取的元数据，用于飞书同步
                metadata: {
                    rawText: appStore.rawText,
                    teamName: appStore.teamName,
                    teamProject: appStore.teamProject,
                    teamDepartment: appStore.teamDepartment,
                    teamLeader: appStore.teamLeader,
                    teamContact: appStore.teamContact,
                    editorInput: appStore.editorInput,
                    sourceAccount: appStore.sourceAccount,
                    copywriterNames: appStore.copywriterNames,
                }
            }))

            // 2. 更新内容
            saveTasks.push(updateArticleContent(articleId, cleanContent))

            // 3. 更新图片库 (V2: 只要有图片库就同步，确保持久化)
            if (appStore.wechatImages && Array.isArray(appStore.wechatImages)) {
                // 过滤掉临时的 blob URL 以防污染数据库
                const persistentImages = appStore.wechatImages.filter(img =>
                    img.url && !img.url.startsWith('blob:') && img.mediaId
                )

                if (persistentImages.length > 0) {
                    const { updateArticleImages } = await import('../api/article')
                    saveTasks.push(updateArticleImages(articleId, persistentImages))
                }
            }

            await Promise.all(saveTasks)

            // 调用保存草稿API
            await saveArticleDraft(articleId)

            console.log('草稿保存成功:', articleId)
            return articleId
        } catch (error: unknown) {
            console.error('保存草稿失败:', error)

            let errorMessage = '保存草稿失败'
            const err = error as { response?: { data?: { message?: string } }; message?: string }
            if (err.response?.data?.message) {
                errorMessage = `保存失败: ${err.response.data.message}`
            } else if (err.message) {
                errorMessage = `保存失败: ${err.message}`
            }

            throw new Error(errorMessage)
        }
    }

    /**
     * 仅保存内容和图片（用于 Step 2/3 切换）
     */
    static async saveContentAndImages(): Promise<void> {
        const appStore = useAppStore()
        const articleId = appStore.currentArticleId
        if (!articleId) return

        try {
            const cleanBlockRecursive = (block: ContentBlock): ContentBlock => {
                return {
                    id: block.id,
                    type: block.type,
                    text: block.text || '',
                    meta: block.meta || {},
                    children: block.children ? block.children.map(cleanBlockRecursive) : undefined
                }
            }
            const cleanContent = JSON.stringify(appStore.contentBlocks.map(cleanBlockRecursive))

            const tasks = [updateArticleContent(articleId, cleanContent)]

            if (appStore.wechatImages.length > 0) {
                const persistentImages = appStore.wechatImages.filter(img =>
                    img.url && !img.url.startsWith('blob:') && img.mediaId
                )
                if (persistentImages.length > 0) {
                    const { updateArticleImages } = await import('../api/article')
                    tasks.push(updateArticleImages(articleId, persistentImages))
                }
            }

            await Promise.all(tasks)
            console.log('内容与图片保存成功')
        } catch (e) {
            console.error('静默保存失败:', e)
        }
    }
}
