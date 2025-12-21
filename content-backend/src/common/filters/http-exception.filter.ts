import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import {
  SecurityLoggerService,
  SecurityEventType,
} from '../services/security-logger.service';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  constructor(private securityLogger: SecurityLoggerService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const { method, url, ip, headers } = request;

    let status: number;
    let message: string;
    let details: any;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else {
        message = (exceptionResponse as any).message || exception.message;
        details =
          (exceptionResponse as any).errors ||
          (exceptionResponse as any).details;
      }
    } else {
      // 未知错误
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Internal server error';
      details = process.env.NODE_ENV === 'development' ? exception : undefined;
    }

    // 构建错误响应
    const errorResponse = {
      code: status,
      message,
      details,
      timestamp: new Date().toISOString(),
      path: url,
      method,
    };

    // 记录错误日志
    this.logError(exception, request, status, message);

    // 记录安全事件
    this.logSecurityEvent(exception, request, status);

    // 发送响应
    response.status(status).json(errorResponse);
  }

  private logError(
    exception: unknown,
    request: Request,
    status: number,
    message: string,
  ) {
    const { method, url, ip } = request;

    if (status >= 500) {
      // 服务器错误
      this.logger.error(
        `${method} ${url} - ${status} - ${message}`,
        exception instanceof Error ? exception.stack : exception,
      );
    } else if (status >= 400) {
      // 客户端错误
      this.logger.warn(`${method} ${url} - ${status} - ${message}`);
    }
  }

  private logSecurityEvent(
    exception: unknown,
    request: Request,
    status: number,
  ) {
    const { method, url, ip, headers } = request;
    const userAgent = headers['user-agent'];

    // 记录暴力破解尝试
    if (url.includes('/auth/login') && status === 401) {
      this.securityLogger.logLoginFailed(
        ip || '',
        'Invalid credentials',
        userAgent,
      );
    }

    // 记录权限拒绝
    if (status === 403) {
      this.securityLogger.logAccessDenied(
        (request as any).user?.id,
        ip || '',
        url,
        method,
      );
    }

    // 记录未授权访问
    if (status === 401) {
      this.securityLogger.logSecurityEvent({
        type: SecurityEventType.UNAUTHORIZED_ACCESS,
        ip: ip || '',
        userAgent,
        endpoint: url,
        method,
        details: { reason: 'Invalid or missing token' },
        timestamp: new Date(),
      });
    }

    // 记录验证错误（可能是攻击尝试）
    if (status === 400 && (exception as any).details) {
      const details = (exception as any).details;
      if (Array.isArray(details) && details.length > 0) {
        this.securityLogger.logSecurityEvent({
          type: SecurityEventType.VALIDATION_ERROR,
          ip: ip || '',
          userAgent,
          endpoint: url,
          method,
          details: { validationErrors: details },
          timestamp: new Date(),
        });
      }
    }
  }
}
