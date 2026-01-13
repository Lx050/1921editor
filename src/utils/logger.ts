/**
 * 日志工具
 * 提供条件日志输出，生产环境自动禁用调试日志
 */

const DEBUG = import.meta.env.DEV

type Loggable = string | number | boolean | null | undefined | object | Error | unknown

class Logger {
  private prefix: string

  constructor(prefix: string) {
    this.prefix = prefix
  }

  /** 调试日志 - 仅开发环境输出 */
  debug(...args: Loggable[]): void {
    if (DEBUG) {
      console.log(`[${this.prefix}]`, ...args)
    }
  }

  /** 信息日志 - 始终输出 */
  info(...args: Loggable[]): void {
    console.info(`[${this.prefix}]`, ...args)
  }

  /** 警告日志 - 始终输出 */
  warn(...args: Loggable[]): void {
    console.warn(`[${this.prefix}]`, ...args)
  }

  /** 错误日志 - 始终输出 */
  error(...args: Loggable[]): void {
    console.error(`[${this.prefix}]`, ...args)
  }

  /** 创建带子前缀的子日志器 */
  createChild(childPrefix: string): Logger {
    return new Logger(`${this.prefix}:${childPrefix}`)
  }
}

/** Step1 页面专用日志器 */
export const step1Logger = new Logger('Step1')

/** Mammoth 解析专用日志器 */
export const mammothLogger = new Logger('Mammoth')

/** 通用日志器工厂 */
export function createLogger(prefix: string): Logger {
  return new Logger(prefix)
}
