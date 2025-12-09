import axios from 'axios'

interface AccessTokenResponse {
  access_token: string
  expires_in: number
}

interface UploadImageResponse {
  media_id: string
  url: string
  errcode: number
  errmsg: string
}

interface WechatImage {
  id: string
  mediaId: string
  url: string
  originalName: string
}

interface UploadStatus {
  total: number
  completed: number
  failed: number
  status: 'idle' | 'uploading' | 'completed' | 'failed'
  errors: Array<{ fileName: string; error: string }>
}

export class WechatApiService {
  private appId: string
  private appSecret: string
  private accessToken: string | null = null
  private tokenExpiresAt: number = 0
  private maxRetries = 3
  private retryDelay = 1000

  constructor(appId: string, appSecret: string) {
    this.appId = appId
    this.appSecret = appSecret
  }

  /**
   * 获取微信access_token（带缓存）
   */
  async getAccessToken(): Promise<string> {
    const now = Date.now()

    // 如果token未过期，直接返回
    if (this.accessToken && now < this.tokenExpiresAt) {
      return this.accessToken
    }

    try {
      const response = await axios.post<AccessTokenResponse>(
        'https://api.weixin.qq.com/cgi-bin/stable_token',
        {
          grant_type: 'client_credential',
          appid: this.appId,
          secret: this.appSecret,
          force_refresh: false
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )

      if (response.data.access_token) {
        this.accessToken = response.data.access_token
        // 提前5分钟过期，避免临界时间点问题
        this.tokenExpiresAt = now + (response.data.expires_in - 300) * 1000
        return this.accessToken
      } else {
        throw new Error(`获取token失败: ${JSON.stringify(response.data)}`)
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.data?.errcode === 40164) {
          throw new Error('IP不在白名单中，请在微信公众号后台配置IP白名单')
        } else if (error.response?.data?.errcode === 40013) {
          throw new Error('APPID错误，请检查配置')
        } else {
          throw new Error(`获取token失败: ${error.response?.data?.errmsg || error.message}`)
        }
      }
      throw error
    }
  }

  /**
   * 上传图片到微信素材库（带重试机制）
   */
  async uploadImage(file: File, fileName: string): Promise<WechatImage> {
    let lastError: Error | null = null

    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        return await this.uploadImageWithRetry(file, fileName)
      } catch (error) {
        lastError = error as Error

        // 如果不是网络错误，不重试
        if (axios.isAxiosError(error) && error.response) {
          throw error
        }

        // 最后一次尝试，抛出错误
        if (attempt === this.maxRetries) {
          break
        }

        // 指数退避延迟
        const delay = this.retryDelay * Math.pow(2, attempt - 1)
        await this.sleep(delay)
      }
    }

    throw lastError || new Error('上传失败')
  }

  /**
   * 单次上传图片（内部方法）
   */
  private async uploadImageWithRetry(file: File, fileName: string): Promise<WechatImage> {
    const token = await this.getAccessToken()

    const formData = new FormData()
    formData.append('media', file, fileName)
    formData.append('type', 'image')

    try {
      const response = await axios.post<UploadImageResponse>(
        `https://api.weixin.qq.com/cgi-bin/material/add_material?access_token=${token}&type=image`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          // 设置超时
          timeout: 30000
        }
      )

      const data = response.data

      // 检查返回码
      if (data.errcode && data.errcode !== 0) {
        throw new Error(`上传失败: ${data.errmsg} (errcode: ${data.errcode})`)
      }

      if (!data.media_id) {
        throw new Error('上传成功但未返回media_id')
      }

      return {
        id: `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        mediaId: data.media_id,
        url: data.url,
        originalName: fileName
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED') {
          throw new Error('上传超时，请检查网络连接')
        } else if (error.response?.status === 413) {
          throw new Error('文件过大，请确保图片小于2MB')
        } else if (error.response?.data?.errcode === 41005) {
          throw new Error('文件格式不正确，请上传jpg/png/gif格式')
        } else {
          throw new Error(`上传失败: ${error.response?.data?.errmsg || error.message}`)
        }
      }
      throw error
    }
  }

  /**
   * 批量上传图片（限制并发数）
   */
  async uploadImages(
    files: Array<{ file: File; fileName: string }>,
    onProgress?: (progress: UploadStatus) => void,
    maxConcurrent = 3
  ): Promise<{ success: WechatImage[]; failed: Array<{ fileName: string; error: string }> }> {
    const results: { success: WechatImage[]; failed: Array<{ fileName: string; error: string }> } = {
      success: [],
      failed: []
    }

    const uploadStatus: UploadStatus = {
      total: files.length,
      completed: 0,
      failed: 0,
      status: 'uploading',
      errors: []
    }

    // 分批上传，控制并发
    for (let i = 0; i < files.length; i += maxConcurrent) {
      const batch = files.slice(i, i + maxConcurrent)

      const batchResults = await Promise.allSettled(
        batch.map(async ({ file, fileName }) => {
          try {
            const image = await this.uploadImage(file, fileName)
            return { success: true, image, fileName }
          } catch (error) {
            return {
              success: false,
              error: error instanceof Error ? error.message : String(error),
              fileName
            }
          }
        })
      )

      // 处理批处理结果
      batchResults.forEach((result) => {
        if (result.status === 'fulfilled' && result.value.success) {
          results.success.push(result.value.image as WechatImage)
          uploadStatus.completed++
        } else {
          const errorResult = result.status === 'fulfilled' ? result.value : { error: '未知错误', fileName: '' }
          results.failed.push({
            fileName: errorResult.fileName || '',
            error: errorResult.error || '未知错误'
          })
          uploadStatus.failed++
          uploadStatus.errors.push({
            fileName: errorResult.fileName || '',
            error: errorResult.error || '未知错误'
          })
        }
      })

      // 更新进度
      if (onProgress) {
        onProgress(uploadStatus)
      }
    }

    // 更新最终状态
    uploadStatus.status = uploadStatus.failed > 0 ? 'failed' : 'completed'
    if (onProgress) {
      onProgress(uploadStatus)
    }

    return results
  }

  /**
   * 延迟函数
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }
}

// 创建单例服务
let wechatApiInstance: WechatApiService | null = null

/**
 * 初始化微信API服务
 */
export function initWechatApi(appId: string, appSecret: string): WechatApiService {
  wechatApiInstance = new WechatApiService(appId, appSecret)
  return wechatApiInstance
}

/**
 * 获取微信API服务实例
 */
export function getWechatApi(): WechatApiService {
  if (!wechatApiInstance) {
    throw new Error('微信API服务未初始化，请先调用 initWechatApi()')
  }
  return wechatApiInstance
}
