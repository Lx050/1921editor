import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

/**
 * 租户上下文拦截器
 * 从JWT中提取租户ID并注入到请求对象中
 */
@Injectable()
export class TenantContextInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (user && user.tenantId) {
      // 将租户ID注入到请求对象中，方便后续使用
      request.tenantId = user.tenantId;
    }

    return next.handle();
  }
}
