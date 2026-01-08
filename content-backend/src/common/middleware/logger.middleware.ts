import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, ip } = req;
    const userAgent = req.get('user-agent') || '';
    const startTime = Date.now();

    // 记录请求信息
    const userId = (req as any).user?.id;
    const requestLog = userId
      ? `${method} ${originalUrl} - User: ${userId}`
      : `${method} ${originalUrl}`;

    res.on('finish', () => {
      const { statusCode } = res;
      const duration = Date.now() - startTime;
      const message = `${requestLog} ${statusCode} ${duration}ms`;

      // 根据状态码选择日志级别
      if (statusCode >= 500) {
        this.logger.error(message);
      } else if (statusCode >= 400) {
        this.logger.warn(message);
      } else {
        this.logger.log(message);
      }

      // 慢请求告警 (>3秒)
      if (duration > 3000) {
        this.logger.warn(`⚠️ Slow request: ${message}`);
      }
    });

    next();
  }
}
