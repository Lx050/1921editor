import api from '../utils/api'

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api'

export interface Article {
    id: string
    title: string
    status: 'DRAFT' | 'PARSED' | 'ADJUSTED' | 'PUBLISHED'
    config: any
    content: string | null
    images: any[] | null
    wechatResult: any | null
    ownerId: string
    tenantId?: string  // 🏢 多租户支持
    createdAt: string
    updatedAt: string
}

/**
 * 获取文章详情
 * Token 会由 api 实例自动注入
 */
export const getArticle = async (id: string): Promise<Article> => {
    const response = await api.get(`/articles/${id}`)
    return response.data
}

/**
 * 获取文章文件下载URL
 */
export const getArticleFileUrl = (id: string): string => {
    return `${API_BASE}/articles/${id}/file`
}

/**
 * 创建新文章
 */
export const createArticle = async (title: string): Promise<Article> => {
    const response = await api.post('/articles', { title })
    return response.data
}

/**
 * 获取用户的所有文章
 */
export const getArticles = async (): Promise<Article[]> => {
    const response = await api.get('/articles')
    return response.data
}

/**
 * 更新文章配置 (Step 1)
 */
export const updateArticleConfig = async (id: string, config: any): Promise<Article> => {
    const response = await api.put(`/articles/${id}/config`, { config })
    return response.data
}

/**
 * 更新文章内容 (Step 2)
 */
export const updateArticleContent = async (id: string, content: string): Promise<Article> => {
    const response = await api.put(`/articles/${id}/content`, { content })
    return response.data
}

/**
 * 更新文章图片 (Step 3)
 */
export const updateArticleImages = async (id: string, images: any[]): Promise<Article> => {
    const response = await api.put(`/articles/${id}/images`, { images })
    return response.data
}

/**
 * 发布文章
 */
export const publishArticle = async (id: string): Promise<Article> => {
    const response = await api.post(`/articles/${id}/publish`)
    return response.data
}

/**
 * 保存文章草稿
 */
export const saveArticleDraft = async (id: string): Promise<Article> => {
    const response = await api.post(`/articles/${id}/save-draft`)
    return response.data
}
