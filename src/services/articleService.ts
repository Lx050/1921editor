import { useAppStore } from '../stores/appStore'
import { createArticle, updateArticleConfig, updateArticleContent, saveArticleDraft } from '../api/article'

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

            // 递归清理 Block 数据，保留 children
            const cleanBlockRecursive = (block: any): any => {
                const blockMeta = block.meta as Record<string, any> | undefined;
                const cleaned: any = {
                    type: block.type,
                    text: block.text || '',
                    ...(blockMeta?.aiImageUrl ? { aiImageUrl: blockMeta.aiImageUrl } : {})
                };

                if (block.children && Array.isArray(block.children) && block.children.length > 0) {
                    cleaned.children = block.children.map(cleanBlockRecursive);
                }

                return cleaned;
            };

            const cleanedBlocks = appStore.contentBlocks.map(cleanBlockRecursive)
            const cleanContent = JSON.stringify(cleanedBlocks)

            // 1. 更新配置 (包含 rawText 和从文档提取的元数据)
            saveTasks.push(updateArticleConfig(articleId, {
                rawText: appStore.rawText,
                config: appStore.styleConfig, // 同时保存样式配置
                // V5: 添加从文档提取的元数据，用于飞书同步
                metadata: {
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

            // 3. 更新图片库
            if (appStore.wechatImages.length > 0) {
                const { updateArticleImages } = await import('../api/article')
                saveTasks.push(updateArticleImages(articleId, appStore.wechatImages))
            }

            await Promise.all(saveTasks)

            // 调用保存草稿API
            await saveArticleDraft(articleId)

            console.log('草稿保存成功:', articleId)
            return articleId
        } catch (error: any) {
            console.error('保存草稿失败:', error)

            let errorMessage = '保存草稿失败'
            if (error.response?.data?.message) {
                errorMessage = `保存失败: ${error.response.data.message}`
            } else if (error.message) {
                errorMessage = `保存失败: ${error.message}`
            }

            throw new Error(errorMessage)
        }
    }
}
