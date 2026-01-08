import { Injectable, Logger, Scope } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs/promises';
import * as path from 'path';

export enum LogLevel {
  ERROR = 'ERROR',
  WARN = 'WARN',
  INFO = 'INFO',
  DEBUG = 'DEBUG',
}

export interface LogEntry {
  timestamp: Date;
  level: LogLevel;
  context: string;
  message: string;
  metadata?: Record<string, any>;
  stack?: string;
  userId?: string;
  articleId?: string;
  requestId?: string;
}

@Injectable({ scope: Scope.DEFAULT })
export class AuditLoggerService {
  private readonly logger = new Logger(AuditLoggerService.name);
  private readonly logDir: string;
  private readonly enableFileLogging: boolean;
  private logBuffer: LogEntry[] = [];
  private flushInterval: NodeJS.Timeout;

  constructor(private configService: ConfigService) {
    this.logDir = path.join(process.cwd(), 'logs');
    this.enableFileLogging =
      this.configService.get('ENABLE_FILE_LOGGING', 'true') === 'true';

    if (this.enableFileLogging) {
      this.initializeLogDirectory();
      // 每 10 秒刷新一次日志缓冲区
      this.flushInterval = setInterval(() => this.flushLogs(), 10000);
    }
  }

  /**
   * 初始化日志目录
   */
  private async initializeLogDirectory() {
    try {
      await fs.mkdir(this.logDir, { recursive: true });
      await fs.mkdir(path.join(this.logDir, 'errors'), { recursive: true });
      await fs.mkdir(path.join(this.logDir, 'audit'), { recursive: true });
    } catch (error) {
      this.logger.error(`Failed to initialize log directory: ${error.message}`);
    }
  }

  /**
   * 记录操作审计日志
   */
  async logAudit(
    context: string,
    action: string,
    metadata: Record<string, any> = {},
  ): Promise<void> {
    const entry: LogEntry = {
      timestamp: new Date(),
      level: LogLevel.INFO,
      context,
      message: action,
      metadata,
      ...this.extractIds(metadata),
    };

    // 控制台输出
    this.logger.log(`[AUDIT] ${context}: ${action}`, JSON.stringify(metadata));

    // 添加到缓冲区
    if (this.enableFileLogging) {
      this.logBuffer.push(entry);
    }
  }

  /**
   * 记录错误
   */
  async logError(
    context: string,
    error: Error | string,
    metadata: Record<string, any> = {},
  ): Promise<void> {
    const errorMessage = error instanceof Error ? error.message : error;
    const stack = error instanceof Error ? error.stack : undefined;

    const entry: LogEntry = {
      timestamp: new Date(),
      level: LogLevel.ERROR,
      context,
      message: errorMessage,
      metadata,
      stack,
      ...this.extractIds(metadata),
    };

    // 控制台输出
    this.logger.error(`[ERROR] ${context}: ${errorMessage}`, stack);

    // 添加到缓冲区
    if (this.enableFileLogging) {
      this.logBuffer.push(entry);
      // 错误立即刷新
      await this.flushErrorLogs([entry]);
    }
  }

  /**
   * 记录警告
   */
  async logWarning(
    context: string,
    message: string,
    metadata: Record<string, any> = {},
  ): Promise<void> {
    const entry: LogEntry = {
      timestamp: new Date(),
      level: LogLevel.WARN,
      context,
      message,
      metadata,
      ...this.extractIds(metadata),
    };

    this.logger.warn(`[WARN] ${context}: ${message}`, JSON.stringify(metadata));

    if (this.enableFileLogging) {
      this.logBuffer.push(entry);
    }
  }

  /**
   * 刷新日志到文件
   */
  private async flushLogs(): Promise<void> {
    if (this.logBuffer.length === 0) return;

    const logs = [...this.logBuffer];
    this.logBuffer = [];

    try {
      // 按日期和类型分组
      const today = new Date().toISOString().split('T')[0];
      const auditLogPath = path.join(this.logDir, 'audit', `${today}.log`);

      const logLines =
        logs
          .filter((entry) => entry.level !== LogLevel.ERROR)
          .map((entry) => JSON.stringify(entry))
          .join('\n') + '\n';

      if (logLines.trim()) {
        await fs.appendFile(auditLogPath, logLines);
      }
    } catch (error) {
      this.logger.error(`Failed to flush logs: ${error.message}`);
    }
  }

  /**
   * 刷新错误日志到文件
   */
  private async flushErrorLogs(errors: LogEntry[]): Promise<void> {
    try {
      const today = new Date().toISOString().split('T')[0];
      const errorLogPath = path.join(this.logDir, 'errors', `${today}.log`);

      const logLines =
        errors.map((entry) => JSON.stringify(entry)).join('\n') + '\n';

      await fs.appendFile(errorLogPath, logLines);
    } catch (error) {
      this.logger.error(`Failed to flush error logs: ${error.message}`);
    }
  }

  /**
   * 从 metadata 中提取常用 ID
   */
  private extractIds(metadata: Record<string, any>): Partial<LogEntry> {
    return {
      userId: metadata.userId,
      articleId: metadata.articleId,
      requestId: metadata.requestId,
    };
  }

  /**
   * 查询日志（简单实现）
   */
  async queryLogs(
    startDate: Date,
    endDate: Date,
    filters?: { context?: string; level?: LogLevel },
  ): Promise<LogEntry[]> {
    try {
      const logs: LogEntry[] = [];
      const auditDir = path.join(this.logDir, 'audit');
      const files = await fs.readdir(auditDir);

      for (const file of files) {
        const filePath = path.join(auditDir, file);
        const content = await fs.readFile(filePath, 'utf-8');
        const lines = content.split('\n').filter((line) => line.trim());

        for (const line of lines) {
          try {
            const entry: LogEntry = JSON.parse(line);
            const entryDate = new Date(entry.timestamp);

            if (entryDate >= startDate && entryDate <= endDate) {
              if (filters?.context && entry.context !== filters.context)
                continue;
              if (filters?.level && entry.level !== filters.level) continue;
              logs.push(entry);
            }
          } catch (parseError) {
            // 忽略解析错误的行
          }
        }
      }

      return logs.sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      );
    } catch (error) {
      this.logger.error(`Failed to query logs: ${error.message}`);
      return [];
    }
  }

  /**
   * 清理
   */
  onModuleDestroy() {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
    }
    // 最后一次刷新
    this.flushLogs();
  }
}
