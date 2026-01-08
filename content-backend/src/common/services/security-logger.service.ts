import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export enum SecurityEventType {
  // 认证相关
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',
  LOGIN_FAILED = 'LOGIN_FAILED',
  LOGOUT = 'LOGOUT',
  TOKEN_INVALID = 'TOKEN_INVALID',

  // 权限相关
  ACCESS_DENIED = 'ACCESS_DENIED',
  UNAUTHORIZED_ACCESS = 'UNAUTHORIZED_ACCESS',

  // 攻击相关
  XSS_ATTEMPT = 'XSS_ATTEMPT',
  SQL_INJECTION_ATTEMPT = 'SQL_INJECTION_ATTEMPT',
  PATH_TRAVERSAL_ATTEMPT = 'PATH_TRAVERSAL_ATTEMPT',
  CSRF_ATTEMPT = 'CSRF_ATTEMPT',
  BRUTE_FORCE_ATTEMPT = 'BRUTE_FORCE_ATTEMPT',

  // Webhook 相关
  WEBHOOK_INVALID_SIGNATURE = 'WEBHOOK_INVALID_SIGNATURE',
  WEBHOOK_REPLAY_ATTACK = 'WEBHOOK_REPLAY_ATTACK',

  // 速率限制
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',

  // 其他安全事件
  SUSPICIOUS_REQUEST = 'SUSPICIOUS_REQUEST',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
}

export interface SecurityEvent {
  type: SecurityEventType;
  userId?: string;
  ip: string;
  userAgent?: string;
  endpoint?: string;
  method?: string;
  details?: any;
  timestamp: Date;
}

@Injectable()
export class SecurityLoggerService {
  private readonly securityLogger = new Logger('Security');
  private readonly isProduction: boolean;
  private readonly logFile: string;

  constructor(private configService: ConfigService) {
    this.isProduction = configService.get('NODE_ENV') === 'production';
    this.logFile = configService.get('LOG_FILE') || './data/logs/security.log';
  }

  /**
   * 记录安全事件
   */
  logSecurityEvent(event: SecurityEvent) {
    const logMessage = this.formatSecurityEvent(event);

    // 根据事件类型确定日志级别
    switch (event.type) {
      case SecurityEventType.LOGIN_SUCCESS:
      case SecurityEventType.LOGOUT:
        this.securityLogger.log(logMessage);
        break;

      case SecurityEventType.LOGIN_FAILED:
      case SecurityEventType.TOKEN_INVALID:
      case SecurityEventType.ACCESS_DENIED:
      case SecurityEventType.WEBHOOK_INVALID_SIGNATURE:
        this.securityLogger.warn(logMessage);
        break;

      case SecurityEventType.XSS_ATTEMPT:
      case SecurityEventType.SQL_INJECTION_ATTEMPT:
      case SecurityEventType.PATH_TRAVERSAL_ATTEMPT:
      case SecurityEventType.CSRF_ATTEMPT:
      case SecurityEventType.BRUTE_FORCE_ATTEMPT:
      case SecurityEventType.WEBHOOK_REPLAY_ATTACK:
      case SecurityEventType.RATE_LIMIT_EXCEEDED:
        this.securityLogger.error(logMessage);
        this.triggerAlert(event); // 触发安全告警
        break;

      default:
        this.securityLogger.log(logMessage);
    }

    // 生产环境写入文件
    if (this.isProduction) {
      this.writeToLogFile(logMessage);
    }
  }

  /**
   * 记录成功的登录
   */
  logLoginSuccess(userId: string, ip: string, userAgent?: string) {
    this.logSecurityEvent({
      type: SecurityEventType.LOGIN_SUCCESS,
      userId,
      ip,
      userAgent,
      timestamp: new Date(),
    });
  }

  /**
   * 记录失败的登录
   */
  logLoginFailed(ip: string, reason: string, userAgent?: string) {
    this.logSecurityEvent({
      type: SecurityEventType.LOGIN_FAILED,
      ip,
      userAgent,
      details: { reason },
      timestamp: new Date(),
    });
  }

  /**
   * 记录访问拒绝
   */
  logAccessDenied(
    userId: string | undefined,
    ip: string,
    endpoint: string,
    method: string,
  ) {
    this.logSecurityEvent({
      type: SecurityEventType.ACCESS_DENIED,
      userId,
      ip,
      endpoint,
      method,
      timestamp: new Date(),
    });
  }

  /**
   * 记录攻击尝试
   */
  logAttackAttempt(
    type: SecurityEventType,
    ip: string,
    endpoint?: string,
    method?: string,
    details?: any,
  ) {
    this.logSecurityEvent({
      type,
      ip,
      endpoint,
      method,
      details,
      timestamp: new Date(),
    });
  }

  /**
   * 记录速率限制触发
   */
  logRateLimitExceeded(ip: string, endpoint: string, limit: number) {
    this.logSecurityEvent({
      type: SecurityEventType.RATE_LIMIT_EXCEEDED,
      ip,
      endpoint,
      details: { limit },
      timestamp: new Date(),
    });
  }

  private formatSecurityEvent(event: SecurityEvent): string {
    return JSON.stringify({
      event: event.type,
      userId: event.userId,
      ip: event.ip,
      userAgent: event.userAgent,
      endpoint: event.endpoint,
      method: event.method,
      details: event.details,
      timestamp: event.timestamp.toISOString(),
    });
  }

  private async writeToLogFile(message: string) {
    try {
      const fs = require('fs').promises;
      await fs.appendFile(this.logFile, message + '\n');
    } catch (error) {
      this.securityLogger.error('Failed to write to security log file', error);
    }
  }

  private triggerAlert(event: SecurityEvent) {
    // TODO: 实现告警机制
    // 1. 发送邮件通知
    // 2. 发送 Slack/钉钉通知
    // 3. 集成监控系统 (Prometheus, Sentry等)
    // 4. 自动阻止 IP（可选）

    const alertMessage = `🚨 Security Alert: ${event.type} from IP ${event.ip}`;

    // 开发环境直接打印
    if (!this.isProduction) {
      console.warn(alertMessage);
      console.warn('Event details:', event);
    }
  }
}
