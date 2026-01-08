import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

/**
 * 密码加密服务
 * 提供密码加密、验证和强度检查功能
 */
@Injectable()
export class PasswordHashService {
  private readonly SALT_ROUNDS = 12; // bcrypt 加密轮数

  /**
   * 加密密码
   * @param password 明文密码
   * @returns 加密后的密码
   */
  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, this.SALT_ROUNDS);
  }

  /**
   * 验证密码
   * @param password 明文密码
   * @param hashedPassword 加密后的密码
   * @returns 是否匹配
   */
  async compare(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  /**
   * 验证密码强度
   * 规则：最少8位，必须包含大小写字母和数字
   * @param password 密码
   * @returns 是否符合强度要求
   */
  validateStrength(password: string): boolean {
    // 最少8位
    if (password.length < 8) {
      return false;
    }

    // 必须包含大写字母
    if (!/[A-Z]/.test(password)) {
      return false;
    }

    // 必须包含小写字母
    if (!/[a-z]/.test(password)) {
      return false;
    }

    // 必须包含数字
    if (!/[0-9]/.test(password)) {
      return false;
    }

    return true;
  }

  /**
   * 生成随机密码
   * @param length 密码长度，默认12位
   * @returns 随机密码
   */
  generateRandom(length: number = 12): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789'; // 排除易混淆字符
    let password = '';
    for (let i = 0; i < length; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }
}
