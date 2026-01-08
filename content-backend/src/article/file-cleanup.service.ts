import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article } from '../entities/article.entity';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class FileCleanupService {
  private readonly logger = new Logger(FileCleanupService.name);
  private readonly uploadDir: string;
  private readonly maxFileAgeDays: number = 30; // 文件保留天数

  constructor(
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
  ) {
    this.uploadDir = path.join(process.cwd(), 'uploads');
  }

  /**
   * 定期清理旧文件（每天凌晨 3 点执行）
   */
  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  async cleanupOldFiles() {
    this.logger.log('Starting scheduled file cleanup...');

    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - this.maxFileAgeDays);

      // 1. 查找旧的 Articles
      const oldArticles = await this.articleRepository
        .createQueryBuilder('article')
        .where('article.createdAt < :cutoffDate', { cutoffDate })
        .andWhere('article.status = :status', { status: 'DRAFT' }) // 只删除草稿
        .getMany();

      this.logger.log(
        `Found ${oldArticles.length} old draft articles to clean up`,
      );

      let deletedFiles = 0;
      let errors = 0;

      // 2. 清理关联文件
      for (const article of oldArticles) {
        try {
          await this.cleanupArticleFiles(article.id);
          deletedFiles++;
        } catch (error) {
          this.logger.error(
            `Failed to cleanup files for article ${article.id}: ${error.message}`,
          );
          errors++;
        }
      }

      // 3. 删除过期的 Articles
      if (oldArticles.length > 0) {
        await this.articleRepository.remove(oldArticles);
      }

      // 4. 清理孤立文件（没有关联 Article 的文件）
      const orphanedFiles = await this.findOrphanedFiles();
      await this.deleteOrphanedFiles(orphanedFiles);

      this.logger.log(
        `Cleanup completed: ${deletedFiles} article files deleted, ${errors} errors, ${orphanedFiles.length} orphaned files removed`,
      );
    } catch (error) {
      this.logger.error(
        `Scheduled cleanup failed: ${error.message}`,
        error.stack,
      );
    }
  }

  /**
   * 清理指定 Article 的所有关联文件
   */
  async cleanupArticleFiles(articleId: string): Promise<void> {
    this.logger.debug(`Cleaning up files for article: ${articleId}`);

    try {
      // 查找该 Article 的上传文件
      const article = await this.articleRepository.findOne({
        where: { id: articleId },
      });

      if (!article) {
        this.logger.warn(`Article ${articleId} not found, skipping cleanup`);
        return;
      }

      const filesToDelete: string[] = [];

      // 1. 上传的原始文件
      if (article.config?.uploadedFile) {
        const uploadPath = path.join(
          this.uploadDir,
          article.config.uploadedFile,
        );
        filesToDelete.push(uploadPath);
      }

      // 2. 图片文件
      if (article.images && Array.isArray(article.images)) {
        for (const img of article.images) {
          if (img.url || img.path) {
            // 将 URL 路径转为文件系统路径
            const imagePath = this.urlToFilePath(img.url || img.path);
            if (imagePath) {
              filesToDelete.push(imagePath);
            }
          }
        }
      }

      // 3. config 中的图片
      if (
        article.config?.imageUrls &&
        Array.isArray(article.config.imageUrls)
      ) {
        for (const url of article.config.imageUrls) {
          const imagePath = this.urlToFilePath(url);
          if (imagePath) {
            filesToDelete.push(imagePath);
          }
        }
      }

      // 删除文件
      let deletedCount = 0;
      for (const filePath of filesToDelete) {
        try {
          await fs.unlink(filePath);
          deletedCount++;
          this.logger.debug(`Deleted file: ${filePath}`);
        } catch (error) {
          // 文件可能已经不存在，忽略错误
          if (error.code !== 'ENOENT') {
            this.logger.warn(
              `Failed to delete file ${filePath}: ${error.message}`,
            );
          }
        }
      }

      this.logger.log(
        `Cleaned up ${deletedCount} files for article ${articleId}`,
      );
    } catch (error) {
      this.logger.error(
        `Cleanup failed for article ${articleId}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * 查找孤立文件（没有关联 Article 的文件）
   */
  private async findOrphanedFiles(): Promise<string[]> {
    try {
      const orphanedFiles: string[] = [];

      // 获取所有 Article 的文件引用
      const articles = await this.articleRepository.find();
      const referencedFiles = new Set<string>();

      for (const article of articles) {
        if (article.config?.uploadedFile) {
          referencedFiles.add(article.config.uploadedFile);
        }
        // 也可以添加图片路径的检查
      }

      // 扫描 uploads 目录
      const files = await fs.readdir(this.uploadDir);

      for (const file of files) {
        // 跳过目录
        const filePath = path.join(this.uploadDir, file);
        const stat = await fs.stat(filePath);

        if (stat.isDirectory()) continue;

        // 检查是否被引用
        if (!referencedFiles.has(file)) {
          // 检查文件年龄
          const ageInDays = (Date.now() - stat.mtimeMs) / (1000 * 60 * 60 * 24);
          if (ageInDays > this.maxFileAgeDays) {
            orphanedFiles.push(filePath);
          }
        }
      }

      return orphanedFiles;
    } catch (error) {
      this.logger.error(`Failed to find orphaned files: ${error.message}`);
      return [];
    }
  }

  /**
   * 删除孤立文件
   */
  private async deleteOrphanedFiles(files: string[]): Promise<void> {
    for (const file of files) {
      try {
        await fs.unlink(file);
        this.logger.debug(`Deleted orphaned file: ${file}`);
      } catch (error) {
        this.logger.warn(
          `Failed to delete orphaned file ${file}: ${error.message}`,
        );
      }
    }
  }

  /**
   * 将 URL 路径转为文件系统路径
   */
  private urlToFilePath(url: string): string | null {
    try {
      // 假设 URL 格式是 /uploads/images/xxx.png
      if (url.startsWith('/uploads/')) {
        return path.join(process.cwd(), url);
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  /**
   * 手动触发清理（用于测试或管理接口）
   */
  async manualCleanup(articleId?: string): Promise<void> {
    if (articleId) {
      await this.cleanupArticleFiles(articleId);
    } else {
      await this.cleanupOldFiles();
    }
  }

  /**
   * 获取磁盘使用统计
   */
  async getDiskUsageStats(): Promise<{
    totalFiles: number;
    totalSize: number;
    oldestFile: Date | null;
  }> {
    try {
      const files = await fs.readdir(this.uploadDir, { withFileTypes: true });
      let totalSize = 0;
      let totalFiles = 0;
      let oldestTime = Date.now();

      for (const file of files) {
        if (file.isFile()) {
          const filePath = path.join(this.uploadDir, file.name);
          const stat = await fs.stat(filePath);
          totalSize += stat.size;
          totalFiles++;
          if (stat.mtimeMs < oldestTime) {
            oldestTime = stat.mtimeMs;
          }
        }
      }

      return {
        totalFiles,
        totalSize,
        oldestFile: totalFiles > 0 ? new Date(oldestTime) : null,
      };
    } catch (error) {
      this.logger.error(`Failed to get disk usage stats: ${error.message}`);
      return { totalFiles: 0, totalSize: 0, oldestFile: null };
    }
  }
}
