/**
 * 应用配置文件
 * 用于存储全局配置，避免硬编码
 */

interface AppConfig {
  // API基础URL，默认为当前origin，可在不同环境覆盖
  apiBaseUrl: string
  // 是否启用调试模式
  debug: boolean
  // 微信相关配置
  wechat: {
    // 上传超时时间（毫秒）
    uploadTimeout: number
    // 最大重试次数
    maxRetryCount: number
  }
  // 预览配置
  preview: {
    // 最大内容长度（用于URL生成）
    maxContentLength: number
  }
}

// 默认配置
const defaultConfig: AppConfig = {
  apiBaseUrl: typeof window !== 'undefined' ? window.location.origin : '',
  debug: process.env.NODE_ENV !== 'production',
  wechat: {
    uploadTimeout: 30000,
    maxRetryCount: 3
  },
  preview: {
    maxContentLength: 1024 * 50 // 50KB
  }
}

// 环境-specific配置
const environmentConfig: Partial<AppConfig> = {}

// 获取配置
export function getConfig(): AppConfig {
  return {
    ...defaultConfig,
    ...environmentConfig,
    wechat: {
      ...defaultConfig.wechat,
      ...environmentConfig.wechat
    },
    preview: {
      ...defaultConfig.preview,
      ...environmentConfig.preview
    }
  }
}

// 更新配置（用于运行时动态修改）
export function updateConfig(updates: Partial<AppConfig>): void {
  Object.assign(environmentConfig, updates)
}

export type { AppConfig }
