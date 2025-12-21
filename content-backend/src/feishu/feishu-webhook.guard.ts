import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

@Injectable()
export class FeishuWebhookGuard implements CanActivate {
  constructor(private configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    // 开发环境可以选择跳过验证
    if (this.configService.get<boolean>('SKIP_WEBHOOK_VERIFY') === true) {
      console.warn('⚠️  Webhook verification is skipped in development mode');
      return true;
    }

    // 获取请求头中的签名和时间戳
    const signature = request.headers['x-lark-signature'] as string;
    const timestamp = request.headers['x-lark-timestamp'] as string;

    if (!signature || !timestamp) {
      console.error(
        'Missing required headers: x-lark-signature or x-lark-timestamp',
      );
      throw new ForbiddenException('Missing required headers');
    }

    // 验证时间戳，防止重放攻击（5分钟有效期）
    const currentTime = Math.floor(Date.now() / 1000);
    const requestTime = parseInt(timestamp);
    const timeDifference = currentTime - requestTime;

    if (Math.abs(timeDifference) > 300) {
      // 5分钟
      console.error(`Timestamp expired: ${timestamp}, current: ${currentTime}`);
      throw new ForbiddenException('Request timestamp expired');
    }

    // 获取配置的验证令牌
    const verificationToken = this.configService.get<string>(
      'FEISHU_VERIFICATION_TOKEN',
    );
    if (!verificationToken) {
      console.error('FEISHU_VERIFICATION_TOKEN is not configured');
      throw new ForbiddenException('Server configuration error');
    }

    // 构建签名原文
    const body = JSON.stringify(request.body);
    const signBase = timestamp + verificationToken + body;

    // 计算签名
    const computedSignature = crypto
      .createHash('sha256')
      .update(signBase, 'utf8')
      .digest('base64');

    // 比较签名（使用恒定时间比较防止时序攻击）
    if (!this.safeCompare(signature, computedSignature)) {
      console.error(
        `Signature mismatch: expected ${computedSignature}, got ${signature}`,
      );
      throw new ForbiddenException('Invalid signature');
    }

    // 记录成功验证（生产环境可考虑更详细的日志）
    console.log('✅ Webhook signature verified successfully');

    return true;
  }

  /**
   * 恒定时间比较，防止时序攻击
   */
  private safeCompare(a: string, b: string): boolean {
    if (a.length !== b.length) {
      return false;
    }

    let result = 0;
    for (let i = 0; i < a.length; i++) {
      result |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }

    return result === 0;
  }
}
