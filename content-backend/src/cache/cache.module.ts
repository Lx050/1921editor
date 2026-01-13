import { Module, Global } from '@nestjs/common';
import { CacheModule as NestCacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

/**
 * 缓存模块
 * 使用内存缓存（cache-manager）
 * 未来可迁移到 Redis
 */
@Global()
@Module({
  imports: [
    NestCacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const ttl = configService.get<number>('CACHE_TTL', 300); // 默认 5 分钟
        const maxItems = configService.get<number>('CACHE_MAX_ITEMS', 100); // 默认最多 100 项

        return {
          ttl: ttl * 1000, // 转换为毫秒
          max: maxItems,
        };
      },
    }),
  ],
  exports: [NestCacheModule],
})
export class CacheModule {}
