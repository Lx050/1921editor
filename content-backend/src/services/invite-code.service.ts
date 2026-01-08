import { Injectable } from '@nestjs/common';

/**
 * 邀请码服务
 * 用于生成和验证租户邀请码
 */
@Injectable()
export class InviteCodeService {
  // 排除易混淆的字符：0, O, I, 1
  private readonly CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  private readonly DEFAULT_LENGTH = 12;

  /**
   * 生成邀请码
   * @param length 邀请码长度，默认12位
   * @returns 邀请码
   */
  generate(length: number = this.DEFAULT_LENGTH): string {
    let code = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * this.CHARS.length);
      code += this.CHARS.charAt(randomIndex);
    }
    return code;
  }

  /**
   * 验证邀请码格式
   * @param code 邀请码
   * @returns 是否符合格式要求
   */
  validateFormat(code: string): boolean {
    if (!code) {
      return false;
    }

    // 检查长度
    if (code.length !== this.DEFAULT_LENGTH) {
      return false;
    }

    // 检查字符是否都在允许的字符集中
    for (const char of code) {
      if (!this.CHARS.includes(char)) {
        return false;
      }
    }

    return true;
  }

  /**
   * 检查邀请码是否过期
   * @param expiresAt 过期时间（null 表示永不过期）
   * @returns 是否已过期
   */
  isExpired(expiresAt: Date | null): boolean {
    if (!expiresAt) {
      return false; // 永不过期
    }
    return new Date() > expiresAt;
  }

  /**
   * 计算邀请码过期时间
   * @paramDays 天数，默认365天
   * @returns 过期时间 Date 对象
   */
  calculateExpiry(days: number = 365): Date {
    const now = new Date();
    now.setDate(now.getDate() + days);
    return now;
  }

  /**
   * 生成可读的邀请码（每4位用分隔符分开）
   * @param code 原始邀请码
   * @returns 格式化后的邀请码，如 "ABCD-EFGH-IJKL"
   */
  format(code: string): string {
    return code.match(/.{1,4}/g)?.join('-') || code;
  }
}
