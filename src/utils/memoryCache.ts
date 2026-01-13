/**
 * 内存缓存管理器
 * 用于缓存计算结果、API响应等，减少重复计算和网络请求
 */

export interface CacheItem<T = any> {
  data: T
  timestamp: number
  expires: number
  accessCount: number
  lastAccessed: number
}

export interface CacheOptions {
  maxSize?: number      // 最大缓存条目数
  maxMemory?: number    // 最大内存使用量（字节）
  ttl?: number         // 默认TTL（毫秒）
  checkInterval?: number // 清理检查间隔
}

export class MemoryCache {
  private static instance: MemoryCache
  private cache = new Map<string, CacheItem>()
  private options: Required<CacheOptions>
  private cleanupTimer: ReturnType<typeof setInterval> | null = null
  private currentMemorySize = 0

  private constructor(options: CacheOptions = {}) {
    this.options = {
      maxSize: options.maxSize || 100,
      maxMemory: options.maxMemory || 10 * 1024 * 1024, // 10MB
      ttl: options.ttl || 5 * 60 * 1000, // 5分钟
      checkInterval: options.checkInterval || 60 * 1000 // 1分钟
    }

    this.startCleanupTimer()
  }

  static getInstance(options?: CacheOptions): MemoryCache {
    if (!MemoryCache.instance) {
      MemoryCache.instance = new MemoryCache(options)
    }
    return MemoryCache.instance
  }

  /**
   * 设置缓存
   */
  set<T>(key: string, data: T, ttl?: number): void {
    // 如果已存在，先删除旧的
    if (this.cache.has(key)) {
      this.delete(key)
    }

    // 检查是否超过最大条目数
    if (this.cache.size >= this.options.maxSize) {
      this.evictLRU()
    }

    const expires = Date.now() + (ttl || this.options.ttl)
    const item: CacheItem<T> = {
      data,
      timestamp: Date.now(),
      expires,
      accessCount: 1,
      lastAccessed: Date.now()
    }

    const size = this.calculateItemSize(item)

    // 检查内存限制
    if (this.currentMemorySize + size > this.options.maxMemory) {
      this.evictByMemory(size)
    }

    this.cache.set(key, item)
    this.currentMemorySize += size
  }

  /**
   * 获取缓存
   */
  get<T>(key: string): T | null {
    const item = this.cache.get(key)
    if (!item) return null

    // 检查是否过期
    if (Date.now() > item.expires) {
      this.delete(key)
      return null
    }

    // 更新访问统计
    item.accessCount++
    item.lastAccessed = Date.now()

    return item.data as T
  }

  /**
   * 检查是否存在且未过期
   */
  has(key: string): boolean {
    const item = this.cache.get(key)
    if (!item) return false

    if (Date.now() > item.expires) {
      this.delete(key)
      return false
    }

    return true
  }

  /**
   * 删除缓存
   */
  delete(key: string): boolean {
    const item = this.cache.get(key)
    if (item) {
      const size = this.calculateItemSize(item)
      this.currentMemorySize -= size
      return this.cache.delete(key)
    }
    return false
  }

  /**
   * 清空所有缓存
   */
  clear(): void {
    this.cache.clear()
    this.currentMemorySize = 0
  }

  /**
   * 获取或设置缓存（如果不存在则执行函数）
   */
  async getOrSet<T>(
    key: string,
    factory: () => T | Promise<T>,
    ttl?: number
  ): Promise<T> {
    const cached = this.get<T>(key)
    if (cached !== null) {
      return cached
    }

    const data = await factory()
    this.set(key, data, ttl)
    return data
  }

  /**
   * 获取缓存统计信息
   */
  getStats() {
    const now = Date.now()
    let expiredCount = 0
    let totalAccessCount = 0
    let oldestTimestamp = now
    let newestTimestamp = 0

    this.cache.forEach(item => {
      if (now > item.expires) {
        expiredCount++
      }
      totalAccessCount += item.accessCount
      oldestTimestamp = Math.min(oldestTimestamp, item.timestamp)
      newestTimestamp = Math.max(newestTimestamp, item.timestamp)
    })

    return {
      size: this.cache.size,
      memorySize: this.currentMemorySize,
      maxSize: this.options.maxSize,
      maxMemory: this.options.maxMemory,
      expiredCount,
      hitRate: totalAccessCount > 0 ? (totalAccessCount - expiredCount) / totalAccessCount : 0,
      averageAccessCount: this.cache.size > 0 ? totalAccessCount / this.cache.size : 0,
      oldestAge: this.cache.size > 0 ? now - oldestTimestamp : 0,
      newestAge: this.cache.size > 0 ? now - newestTimestamp : 0
    }
  }

  /**
   * 预热缓存
   */
  async warmup<T>(entries: Array<{ key: string; factory: () => T | Promise<T>; ttl?: number }>): Promise<void> {
    const promises = entries.map(async ({ key, factory, ttl }) => {
      try {
        const data = await factory()
        this.set(key, data, ttl)
      } catch (error) {
        console.warn(`[MemoryCache] 预热失败 ${key}:`, error)
      }
    })

    await Promise.all(promises)
  }

  /**
   * 清理过期缓存
   */
  private cleanup(): void {
    const now = Date.now()
    const keysToDelete: string[] = []

    this.cache.forEach((item, key) => {
      if (now > item.expires) {
        keysToDelete.push(key)
      }
    })

    keysToDelete.forEach(key => this.delete(key))
  }

  /**
   * LRU淘汰
   */
  private evictLRU(): void {
    let oldestKey: string | null = null
    let oldestTime = Date.now()

    this.cache.forEach((item, key) => {
      if (item.lastAccessed < oldestTime) {
        oldestTime = item.lastAccessed
        oldestKey = key
      }
    })

    if (oldestKey) {
      this.delete(oldestKey)
    }
  }

  /**
   * 按内存大小淘汰
   */
  private evictByMemory(requiredSize: number): void {
    const items = Array.from(this.cache.entries())
      .map(([key, item]) => ({
        key,
        item,
        size: this.calculateItemSize(item),
        score: this.calculateEvictionScore(item)
      }))
      .sort((a, b) => a.score - b.score) // 低分优先淘汰

    let freedSize = 0
    for (const { key, size } of items) {
      this.delete(key)
      freedSize += size
      if (freedSize >= requiredSize) break
    }
  }

  /**
   * 计算淘汰分数（低分优先淘汰）
   */
  private calculateEvictionScore(item: CacheItem): number {
    const now = Date.now()
    const age = now - item.timestamp
    const lastAccessAge = now - item.lastAccessed
    const accessFrequency = item.accessCount / Math.max(1, age / 1000) // 每秒访问次数

    // 综合评分：最近访问时间、访问频率、存储时间
    return lastAccessAge * 0.4 + (age - lastAccessAge) * 0.3 - accessFrequency * 10000 * 0.3
  }

  /**
   * 估算条目大小
   */
  private calculateItemSize(item: CacheItem): number {
    try {
      const dataSize = this.estimateObjectSize(item.data)
      const metadataSize = 200 // 估算元数据大小
      return dataSize + metadataSize
    } catch {
      return 1024 // 默认1KB
    }
  }

  /**
   * 估算对象大小
   */
  private estimateObjectSize(obj: unknown): number {
    if (obj === null || obj === undefined) return 0
    if (typeof obj === 'boolean') return 4
    if (typeof obj === 'number') return 8
    if (typeof obj === 'string') return obj.length * 2
    if (typeof obj === 'object') {
      if (Array.isArray(obj)) {
        return obj.reduce((sum, item) => sum + this.estimateObjectSize(item), 0) + 24
      } else {
        return Object.keys(obj).reduce((sum, key) => {
          return sum + key.length * 2 + this.estimateObjectSize((obj as Record<string, unknown>)[key])
        }, 0) + 24
      }
    }
    return 0
  }

  /**
   * 启动清理定时器
   */
  private startCleanupTimer(): void {
    this.cleanupTimer = setInterval(() => {
      this.cleanup()
    }, this.options.checkInterval)
  }

  /**
   * 停止清理定时器
   */
  private stopCleanupTimer(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer)
      this.cleanupTimer = null
    }
  }

  /**
   * 销毁缓存
   */
  destroy(): void {
    this.stopCleanupTimer()
    this.clear()
  }
}

// 便捷的全局缓存实例
export const memoryCache = MemoryCache.getInstance()

// 缓存装饰器
export function cached(ttl?: number, keyGenerator?: (...args: unknown[]) => string) {
  return (_target: unknown, propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value

    descriptor.value = async function (this: unknown, ...args: unknown[]) {
      const cacheKey = keyGenerator ? keyGenerator(...args) : `${propertyKey}:${JSON.stringify(args)}`

      return memoryCache.getOrSet(cacheKey, () => originalMethod.apply(this, args as never), ttl)
    }

    return descriptor
  }
}