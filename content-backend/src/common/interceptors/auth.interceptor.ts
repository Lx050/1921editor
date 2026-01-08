import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  SetMetadata,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Response } from 'express';

// 元数据键，用于标记需要设置 cookie 的响应
export const SET_AUTH_COOKIE = 'set_auth_cookie';
export const SetAuthCookie = (token: string) =>
  SetMetadata(SET_AUTH_COOKIE, token);

@Injectable()
export class AuthCookieInterceptor implements NestInterceptor {
  private readonly isProduction = process.env.NODE_ENV === 'production';
  private readonly cookieOptions = {
    httpOnly: true, // 防止 XSS 攻击
    secure: this.isProduction, // 生产环境仅 HTTPS
    sameSite: 'strict' as const, // CSRF 保护
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7天
    path: '/', // 全站可用
    domain: process.env.COOKIE_DOMAIN, // 可选：设置特定域名
  };

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const response = context.switchToHttp().getResponse<Response>();
    const request = context.switchToHttp().getRequest();
    const metadata = Reflect.getMetadata(SET_AUTH_COOKIE, context.getHandler());

    // 如果元数据中有 token，设置 cookie
    if (metadata) {
      const cookieString = this.buildCookieString(
        'auth_token',
        metadata,
        this.cookieOptions,
      );
      response.setHeader('Set-Cookie', cookieString);

      // 清除响应中的 token 字段，避免泄露
      const originalResponse = next.handle();
      return originalResponse
        .pipe
        // 这里可以添加操作符来清理响应数据
        ();
    }

    return next.handle();
  }

  private buildCookieString(name: string, value: string, options: any): string {
    let cookieString = `${name}=${value}`;

    if (options.httpOnly) {
      cookieString += '; HttpOnly';
    }
    if (options.secure) {
      cookieString += '; Secure';
    }
    if (options.sameSite) {
      cookieString += `; SameSite=${options.sameSite}`;
    }
    if (options.maxAge) {
      cookieString += `; Max-Age=${Math.floor(options.maxAge / 1000)}`;
    }
    if (options.path) {
      cookieString += `; Path=${options.path}`;
    }
    if (options.domain) {
      cookieString += `; Domain=${options.domain}`;
    }

    return cookieString;
  }
}
