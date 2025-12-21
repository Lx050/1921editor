import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import {
  SecurityLoggerService,
  SecurityEventType,
} from '../services/security-logger.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  constructor(private securityLogger: SecurityLoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, ip, headers } = request;
    const userAgent = headers['user-agent'];
    const now = Date.now();

    // 记录请求开始
    this.logger.log(`${method} ${url} - ${ip} - ${userAgent}`);

    return next.handle().pipe(
      tap({
        next: (data) => {
          const duration = Date.now() - now;
          this.logger.log(`${method} ${url} - ${duration}ms - Success`);

          // 记录成功的认证事件
          if (url.includes('/auth/login') && data.access_token) {
            this.securityLogger.logLoginSuccess(data.user?.id, ip, userAgent);
          }
        },
        error: (error) => {
          const duration = Date.now() - now;
          this.logger.error(
            `${method} ${url} - ${duration}ms - Error: ${error.message}`,
            error.stack,
          );

          // 记录安全相关错误
          this.logSecurityError(error, context, ip, userAgent);
        },
      }),
    );
  }

  private logSecurityError(
    error: any,
    context: ExecutionContext,
    ip: string,
    userAgent?: string,
  ) {
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;

    // 根据错误类型记录不同的安全事件
    if (error.status === 401) {
      this.securityLogger.logSecurityEvent({
        type: SecurityEventType.UNAUTHORIZED_ACCESS,
        ip,
        userAgent,
        endpoint: url,
        method,
        details: { message: error.message },
        timestamp: new Date(),
      });
    } else if (error.status === 403) {
      this.securityLogger.logAccessDenied(request.user?.id, ip, url, method);
    } else if (error.status === 429) {
      this.securityLogger.logRateLimitExceeded(ip, url, error.limit || 10);
    } else if (url.includes('/auth/login') && error.status === 401) {
      this.securityLogger.logLoginFailed(
        ip,
        error.message || 'Invalid credentials',
        userAgent,
      );
    }

    // 检测潜在的攻击模式
    this.detectSuspiciousPatterns(request, ip, userAgent);
  }

  private detectSuspiciousPatterns(
    request: any,
    ip: string,
    userAgent?: string,
  ) {
    const { method, url, query, body } = request;

    // 检测 SQL 注入模式
    const sqlPatterns = [
      /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/i,
      /(--|\/\*|\*\/)/,
      /(\bOR\b.*=.*\bOR\b)/i,
    ];

    const checkSqlInjection = (value: string) => {
      return sqlPatterns.some((pattern) => pattern.test(value));
    };

    const checkValues = [JSON.stringify(query), JSON.stringify(body)];
    if (checkValues.some((value) => checkSqlInjection(value))) {
      this.securityLogger.logAttackAttempt(
        SecurityEventType.SQL_INJECTION_ATTEMPT,
        ip,
        url,
        method,
        { query, body },
      );
    }

    // 检测 XSS 模式
    const xssPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
    ];

    const checkXss = (value: string) => {
      return xssPatterns.some((pattern) => pattern.test(value));
    };

    if (checkValues.some((value) => checkXss(value))) {
      this.securityLogger.logAttackAttempt(
        SecurityEventType.XSS_ATTEMPT,
        ip,
        url,
        method,
        { query, body },
      );
    }

    // 检测路径遍历
    const pathTraversalPatterns = [/\.\.\//g, /%2e%2e%2f/gi, /\\(\.\.)\\/g];
    if (pathTraversalPatterns.some((pattern) => pattern.test(url))) {
      this.securityLogger.logAttackAttempt(
        SecurityEventType.PATH_TRAVERSAL_ATTEMPT,
        ip,
        url,
        method,
      );
    }

    // 检测异常的用户代理
    const suspiciousAgents = [/bot/i, /crawler/i, /scanner/i, /wget/i, /curl/i];

    if (
      userAgent &&
      suspiciousAgents.some((pattern) => pattern.test(userAgent))
    ) {
      this.securityLogger.logSecurityEvent({
        type: SecurityEventType.SUSPICIOUS_REQUEST,
        ip,
        userAgent,
        endpoint: url,
        method,
        details: { reason: 'Suspicious user agent' },
        timestamp: new Date(),
      });
    }
  }
}
