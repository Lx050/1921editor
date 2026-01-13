import { Injectable, Logger, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

/**
 * 缓存服务
 * 提供统一的缓存操作接口
 */
@Injectable()
export class CacheService {
  private readonly logger = new Logger(CacheService.name);
  private readonly DEFAULT_TTL = 300; // 默认 5 分钟

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  /**
   * 获取缓存值
   * @param key 缓存键
   * @returns 缓存值或 null
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await this.cacheManager.get<T>(key);
      if (value) {
        this.logger.debug(`缓存命中: ${key}`);
      } else {
        this.logger.debug(`缓存未命中: ${key}`);
      }
      return value ?? null;
    } catch (error) {
      this.logger.warn(`获取缓存失败: ${key}`, error);
      return null;
    }
  }

  /**
   * 设置缓存值
   * @param key 缓存键
   * @param value 缓存值
   * @param ttl 过期时间（秒），默认 5 分钟
   */
  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    try {
      const ttlSeconds = ttl ?? this.DEFAULT_TTL;
      await this.cacheManager.set(key, value, ttlSeconds * 1000);
      this.logger.debug(`设置缓存: ${key} (TTL: ${ttlSeconds}s)`);
    } catch (error) {
      this.logger.warn(`设置缓存失败: ${key}`, error);
    }
  }

  /**
   * 删除缓存
   * @param key 缓存键
   */
  async del(key: string): Promise<void> {
    try {
      await this.cacheManager.del(key);
      this.logger.debug(`删除缓存: ${key}`);
    } catch (error) {
      this.logger.warn(`删除缓存失败: ${key}`, error);
    }
  }

  /**
   * 按模式删除缓存（删除匹配前缀的所有缓存）
   * @param pattern 缓存键前缀
   */
  async delPattern(pattern: string): Promise<void> {
    try {
      // cache-manager 内存存储需要通过底层存储访问
      // 注意：此功能依赖内存存储实现，迁移到 Redis 时需要调整
      const stores = (this.cacheManager as any).stores;
      if (stores && Array.isArray(stores)) {
        for (const store of stores) {
          const keys: string[] = store.keys?.() ?? [];
          for (const key of keys) {
            if (key.startsWith(pattern)) {
              await this.cacheManager.del(key);
              this.logger.debug(`删除缓存: ${key} (匹配模式: ${pattern})`);
            }
          }
        }
      }
    } catch (error) {
      this.logger.warn(`批量删除缓存失败: ${pattern}`, error);
    }
  }

  /**
   * 清空所有缓存
   */
  async reset(): Promise<void> {
    try {
      // cache-manager 7.x 使用 cache.clear() 而非 reset()
      const store = (this.cacheManager as any).store;
      if (store?.clear) {
        await store.clear();
      }
      this.logger.log('清空所有缓存');
    } catch (error) {
      this.logger.warn('清空缓存失败', error);
    }
  }

  /**
   * 生成用户租户列表缓存键
   * @param userId 用户 ID
   */
  static userTenantsKey(userId: string): string {
    return `user:${userId}:tenants`;
  }

  /**
   * 生成租户信息缓存键
   * @param tenantId 租户 ID
   */
  static tenantKey(tenantId: string): string {
    return `tenant:${tenantId}`;
  }

  /**
   * 生成租户成员显示名缓存键
   * @param userId 用户 ID
   * @param tenantId 租户 ID
   */
  static membershipDisplayNameKey(userId: string, tenantId: string): string {
    return `membership:${userId}:${tenantId}:displayName`;
  }
}
