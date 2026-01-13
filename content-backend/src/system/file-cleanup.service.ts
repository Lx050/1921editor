import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FileCleanupService {
  private readonly logger = new Logger(FileCleanupService.name);
  // 90天 (毫秒)
  private readonly MAX_AGE_MS = 90 * 24 * 60 * 60 * 1000;
  private readonly UPLOAD_DIR = path.join(process.cwd(), 'uploads');
  private readonly CACHE_DIR = path.join(this.UPLOAD_DIR, 'cache');

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  handleCron() {
    this.logger.log('执行每日缓存清理任务...');
    this.cleanupCache();
  }

  private cleanupCache() {
    if (!fs.existsSync(this.CACHE_DIR)) {
      this.logger.log(`缓存目录不存在: ${this.CACHE_DIR}，跳过清理`);
      return;
    }

    try {
      const files = fs.readdirSync(this.CACHE_DIR);
      const now = Date.now();
      let deletedCount = 0;
      let freedSpace = 0;

      for (const file of files) {
        const filePath = path.join(this.CACHE_DIR, file);
        try {
          const stats = fs.statSync(filePath);
          const age = now - stats.mtimeMs;

          if (age > this.MAX_AGE_MS) {
            fs.unlinkSync(filePath);
            deletedCount++;
            freedSpace += stats.size;
            // this.logger.debug(`已删除过期文件: ${file} (Age: ${(age / 86400000).toFixed(1)} days)`);
          }
        } catch (err) {
          this.logger.error(`无法处理文件 ${file}:`, err);
        }
      }

      if (deletedCount > 0) {
        this.logger.log(
          `清理完成: 删除了 ${deletedCount} 个过期文件 (90天前), 释放了 ${(
            freedSpace /
            1024 /
            1024
          ).toFixed(2)} MB 空间`,
        );
      } else {
        this.logger.log('清理完成: 没有发现过期文件');
      }
    } catch (err) {
      this.logger.error('缓存清理任务失败:', err);
    }
  }
}
