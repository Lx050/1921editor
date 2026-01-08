import axios from 'axios'
import { tokenStorage } from './tokenStorage'

// 创建 axios 实例
const api = axios.create({
  // 开发环境使用代理，生产环境使用完整地址
  baseURL: import.meta.env.PROD
    ? (import.meta.env.VITE_API_BASE_URL || '/api')
    : '/api',
  timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '20000'), // 增加超时时间
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    // 🔒 注入 JWT Token
    const token = tokenStorage.getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // 添加 API Key（如果配置了，通常用于后台服务调用）
    const apiKey = import.meta.env.VITE_API_KEY
    if (apiKey) {
      config.headers['X-API-Key'] = apiKey
    }

    // 调试日志
    if (import.meta.env.VITE_ENABLE_DEBUG === 'true' || import.meta.env.DEV) {
      console.log('🚀 API Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        headers: config.headers,
      })
    }

    return config
  },
  (error) => {
    console.error('❌ Request Error:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    // 调试日志
    if (import.meta.env.VITE_ENABLE_DEBUG === 'true' || import.meta.env.DEV) {
      console.log('✅ API Response:', {
        status: response.status,
        url: response.config.url,
      })
    }

    return response
  },
  (error) => {
    // 调试日志
    if (import.meta.env.VITE_ENABLE_DEBUG === 'true' || import.meta.env.DEV) {
      console.error('❌ API Error:', {
        status: error.response?.status,
        url: error.config?.url,
        message: error.message,
        data: error.response?.data
      })
    }

    // 🔒 统一错误处理
    if (error.response?.status === 401) {
      console.error('Unauthorized request')
      if (typeof window !== 'undefined') {
        tokenStorage.clearAuth()
        if (window.ElMessage) {
          window.ElMessage.warning('Unauthorized request')
        }
      }
    } else if (error.response?.status === 403) {
      console.error('❌ 权限不足，拒绝访问')
      if (typeof window !== 'undefined' && window.ElMessage) {
        window.ElMessage.error('您没有权限访问该资源')
      }
    } else if (error.response?.status === 404) {
      console.error('❌ 请求的资源不存在')
    } else if (error.response?.status >= 500) {
      console.error('❌ 服务器错误，请稍后重试')
      if (typeof window !== 'undefined' && window.ElMessage) {
        window.ElMessage.error('服务器错误，请稍后重试')
      }
    } else if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      console.error('⏱️ 请求超时，请检查网络连接')
      if (typeof window !== 'undefined' && window.ElMessage) {
        window.ElMessage.error('请求超时，请检查网络连接')
      }
    }

    return Promise.reject(error)
  }
)

// API 方法封装
export const contentApi = {
  // 获取内容列表
  getContents: (params?: any) => {
    return api.get('/content', { params })
  },

  // 获取内容详情
  getContentById: (id: string) => {
    return api.get(`/content/${id}`)
  },

  // 创建内容
  createContent: (data: any) => {
    return api.post('/content', data)
  },

  // 更新内容
  updateContent: (id: string, data: any) => {
    return api.put(`/content/${id}`, data)
  },

  // 删除内容
  deleteContent: (id: string) => {
    return api.delete(`/content/${id}`)
  },

  // 批量创建
  batchCreateContent: (contents: any[]) => {
    return api.post('/content/batch', { contents })
  },

  // 批量更新状态
  batchUpdateStatus: (ids: string[], status: string) => {
    return api.put('/content/batch/status', { ids, status })
  },

  // 搜索内容
  searchContent: (q: string, params?: any) => {
    return api.get('/content/search', { params: { q, ...params } })
  },

  // 获取统计信息
  getStatistics: () => {
    return api.get('/content/statistics')
  },
}

// 📦 文章 API (后端逻辑)
export const articleApi = {
  // 获取文章列表
  getArticles: () => {
    return api.get('/articles')
  },

  // 获取单个文章详情
  getArticleById: (id: string) => {
    return api.get(`/articles/${id}`)
  },

  // 保存文章草稿
  saveDraft: (id: string) => {
    return api.post(`/articles/${id}/save-draft`)
  },

  // 更新文章图片 (Step3)
  updateStep3: (id: string, images: any[]) => {
    return api.put(`/articles/${id}/images`, { images })
  },
}

// Webhook API
export const webhookApi = {
  // 测试 Webhook
  testWebhook: (type: string = 'ping') => {
    return api.post('/webhook/test', { type })
  },

  // 推送内容
  pushContent: (content: any, source?: string) => {
    return api.post('/webhook/content', { content, source })
  },
}

// 健康检查
export const healthApi = {
  checkHealth: () => {
    return api.get('/health')
  },
}

// 租户 API
export const tenantApi = {
  getWechatConfig: (tenantId: string) => {
    return api.get(`/tenants/${tenantId}/wechat-config`)
  },
}

// 导出默认实例
export default api

// 使用示例：
/*
import { contentApi } from '@/utils/api'

// 获取内容列表
const fetchContents = async () => {
  try {
    const response = await contentApi.getContents({
      page: 1,
      pageSize: 20,
      category: '资讯'
    })
    console.log(response.data)
  } catch (error) {
    console.error('获取内容失败:', error)
  }
}

// 创建内容
const createContent = async (contentData) => {
  try {
    const response = await contentApi.createContent(contentData)
    console.log('创建成功:', response.data)
  } catch (error) {
    console.error('创建失败:', error)
  }
}
*/