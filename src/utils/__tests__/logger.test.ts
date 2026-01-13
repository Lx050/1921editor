/**
 * Logger 工具测试
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createLogger, step1Logger } from '../../utils/logger'

describe('Logger', () => {
  // 保存原始 console 方法
  const originalConsole = {
    log: console.log,
    info: console.info,
    warn: console.warn,
    error: console.error
  }

  beforeEach(() => {
    // Mock console 方法
    console.log = vi.fn()
    console.info = vi.fn()
    console.warn = vi.fn()
    console.error = vi.fn()
  })

  afterEach(() => {
    // 恢复原始 console 方法
    console.log = originalConsole.log
    console.info = originalConsole.info
    console.warn = originalConsole.warn
    console.error = originalConsole.error
  })

  describe('createLogger', () => {
    it('应该创建带有前缀的 logger', () => {
      const logger = createLogger('TestModule')

      logger.debug('test message')

      if (import.meta.env.DEV) {
        expect(console.log).toHaveBeenCalledWith('[TestModule]', 'test message')
      }
    })

    it('应该支持 info 日志', () => {
      const logger = createLogger('TestModule')

      logger.info('info message')

      expect(console.info).toHaveBeenCalledWith('[TestModule]', 'info message')
    })

    it('应该支持 warn 日志', () => {
      const logger = createLogger('TestModule')

      logger.warn('warn message')

      expect(console.warn).toHaveBeenCalledWith('[TestModule]', 'warn message')
    })

    it('应该支持 error 日志', () => {
      const logger = createLogger('TestModule')

      logger.error('error message')

      expect(console.error).toHaveBeenCalledWith('[TestModule]', 'error message')
    })

    it('应该支持多个参数', () => {
      const logger = createLogger('TestModule')

      logger.info('message', { data: 123 }, 'extra')

      expect(console.info).toHaveBeenCalledWith('[TestModule]', 'message', { data: 123 }, 'extra')
    })
  })

  describe('createChild', () => {
    it('应该创建带有子前缀的 logger', () => {
      const parentLogger = createLogger('Parent')
      const childLogger = parentLogger.createChild('Child')

      childLogger.debug('child message')

      if (import.meta.env.DEV) {
        expect(console.log).toHaveBeenCalledWith('[Parent:Child]', 'child message')
      }
    })
  })

  describe('step1Logger 预设实例', () => {
    it('step1Logger 应该可用', () => {
      expect(step1Logger).toBeDefined()
      step1Logger.info('test')
      expect(console.info).toHaveBeenCalledWith('[Step1]', 'test')
    })
  })
})
