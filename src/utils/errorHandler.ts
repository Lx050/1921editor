/**
 * 全局错误处理工具
 */

export interface AppError extends Error {
  code?: string
  status?: number
  details?: unknown
}

/**
 * 创建应用错误
 */
export function createAppError(
  message: string,
  options: { code?: string; status?: number; details?: unknown } = {}
): AppError {
  const error = new Error(message) as AppError
  error.code = options.code
  error.status = options.status
  error.details = options.details
  return error
}

/**
 * 包装异步函数，提供统一错误处理
 */
export function withErrorHandler<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  errorMessage?: string
): (...args: Parameters<T>) => Promise<ReturnType<T> | void> {
  return async (...args: Parameters<T>): Promise<ReturnType<T> | void> => {
    try {
      return await fn(...args)
    } catch (error) {
      const err = error as AppError
      console.error(`[ErrorHandler] ${errorMessage || '操作失败'}:`, err)

      // 抛出更友好的错误信息
      throw createAppError(
        errorMessage || err.message || '未知错误',
        {
          code: err.code || 'UNKNOWN_ERROR',
          status: err.status || 500,
          details: { originalError: err, args }
        }
      )
    }
  }
}

/**
 * 安全执行函数，捕获同步和异步错误
 */
export async function safeExecute<T>(
  fn: () => T | Promise<T>,
  options: { errorMessage?: string; fallback?: T } = {}
): Promise<{ success: boolean; data?: T; error?: AppError }> {
  const { errorMessage, fallback } = options

  try {
    const data = await fn()
    return { success: true, data }
  } catch (error) {
    const err = createAppError(
      errorMessage || (error as Error).message || '执行失败',
      { details: error }
    )

    console.error('[SafeExecute] Error:', err)

    if (fallback !== undefined) {
      return { success: true, data: fallback }
    }

    return { success: false, error: err }
  }
}

/**
 * 错误代码枚举
 */
export const ErrorCode = {
  // 网络错误
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',

  // 文件错误
  FILE_READ_ERROR: 'FILE_READ_ERROR',
  FILE_TYPE_ERROR: 'FILE_TYPE_ERROR',
  FILE_SIZE_ERROR: 'FILE_SIZE_ERROR',

  // API错误
  API_ERROR: 'API_ERROR',
  AUTH_ERROR: 'AUTH_ERROR',

  // 业务错误
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',

  // 系统错误
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
  INITIALIZATION_ERROR: 'INITIALIZATION_ERROR'
} as const

/**
 * 网络错误检查
 */
export function isNetworkError(error: unknown): boolean {
  return (
    error instanceof TypeError &&
    (error.message === 'Failed to fetch' ||
     error.message === 'NetworkError' ||
     error.message.includes('NetworkError'))
  )
}

/**
 * 文件错误检查
 */
export function isFileError(error: unknown): boolean {
  const err = error as AppError
  return err.code ? Object.values(ErrorCode).some(code => code.includes('FILE')) : false
}

/**
 * 获取用户友好的错误消息
 */
export function getUserFriendlyErrorMessage(error: AppError): string {
  const messages: Record<string, string> = {
    [ErrorCode.NETWORK_ERROR]: '网络连接失败，请检查网络设置',
    [ErrorCode.TIMEOUT_ERROR]: '请求超时，请稍后重试',
    [ErrorCode.FILE_READ_ERROR]: '文件读取失败，请检查文件是否损坏',
    [ErrorCode.FILE_TYPE_ERROR]: '文件类型不支持，请选择正确的文件类型',
    [ErrorCode.FILE_SIZE_ERROR]: '文件大小超过限制',
    [ErrorCode.API_ERROR]: '服务暂时不可用，请稍后重试',
    [ErrorCode.AUTH_ERROR]: '认证失败，请重新登录',
    [ErrorCode.VALIDATION_ERROR]: '数据验证失败，请检查输入内容',
    [ErrorCode.NOT_FOUND]: '请求的资源不存在',
    [ErrorCode.UNKNOWN_ERROR]: '发生未知错误，请稍后重试'
  }

  return messages[error.code || ''] || error.message || messages[ErrorCode.UNKNOWN_ERROR]
}

type ErrorHandler = (error: AppError) => void

/**
 * 全局错误处理器
 */
class GlobalErrorHandler {
  private handlers: Set<ErrorHandler> = new Set()
  private initialized = false

  /**
   * 初始化全局错误监听
   */
  init(): void {
    if (this.initialized) return

    // 监听未处理的Promise拒绝
    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled Promise Rejection:', event.reason)
      const error = createAppError(
        event.reason?.message || '未处理的Promise错误',
        { details: event.reason }
      )
      this.notifyHandlers(error)
      event.preventDefault()
    })

    // 监听JavaScript错误
    window.addEventListener('error', (event) => {
      console.error('JavaScript Error:', event.error)
      const error = createAppError(
        event.message || 'JavaScript错误',
        { details: event.error }
      )
      this.notifyHandlers(error)
    })

    this.initialized = true
  }

  /**
   * 添加错误处理器
   */
  addHandler(handler: ErrorHandler): void {
    this.handlers.add(handler)
  }

  /**
   * 移除错误处理器
   */
  removeHandler(handler: ErrorHandler): void {
    this.handlers.delete(handler)
  }

  /**
   * 通知所有处理器
   */
  private notifyHandlers(error: AppError): void {
    this.handlers.forEach(handler => {
      try {
        handler(error)
      } catch (handlerError) {
        console.error('Error in error handler:', handlerError)
      }
    })
  }
}

// 创建单例
export const globalErrorHandler = new GlobalErrorHandler()
