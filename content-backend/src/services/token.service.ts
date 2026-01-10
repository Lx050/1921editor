import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

/**
 * 令牌生成和验证服务
 * 用于生成邮箱验证令牌和密码重置令牌
 */
@Injectable()
export class TokenService {
  /**
   * 生成邮箱验证令牌
   * @returns UUID 令牌
   */
  generateEmailVerificationToken(): string {
    return uuidv4();
  }

  /**
   * 生成密码重置令牌
   * @returns UUID 令牌
   */
  generatePasswordResetToken(): string {
    return uuidv4();
  }

  /**
   * 生成微信密钥变更令牌
   * @returns UUID 令牌
   */
  generateWechatCredentialToken(): string {
    return uuidv4();
  }

  /**
   * 计算令牌过期时间
   * @param seconds 秒数
   * @returns 过期时间 Date 对象
   */
  calculateExpiry(seconds: number): Date {
    const now = new Date();
    now.setSeconds(now.getSeconds() + seconds);
    return now;
  }

  /**
   * 检查令牌是否过期
   * @param expiresAt 过期时间
   * @returns 是否已过期
   */
  isExpired(expiresAt: Date): boolean {
    return new Date() > expiresAt;
  }

  /**
   * 邮箱验证令牌过期时间（24小时）
   */
  readonly EMAIL_VERIFICATION_EXPIRY = 24 * 60 * 60; // 86400 秒

  /**
   * 密码重置令牌过期时间（1小时）
   */
  readonly PASSWORD_RESET_EXPIRY = 60 * 60; // 3600 秒

  /**
   * 微信密钥变更令牌过期时间（30分钟）
   */
  readonly WECHAT_CREDENTIAL_CHANGE_EXPIRY = 30 * 60; // 1800 秒
}
