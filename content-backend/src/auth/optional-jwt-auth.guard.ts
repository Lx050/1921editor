import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * 可选的 JWT 认证守卫
 * 与 JwtAuthGuard 不同，此守卫允许未认证的请求通过
 * 如果请求包含有效的 JWT token，则会解析 user 信息
 * 如果没有 token 或 token 无效，请求仍然可以继续，但 req.user 为 undefined
 */
@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
    handleRequest(err: any, user: any) {
        // 不抛出错误，允许请求继续
        // 如果认证失败，user 为 undefined
        return user || null;
    }

    canActivate(context: ExecutionContext) {
        // 调用父类的 canActivate，它会尝试验证 token
        // 但由于我们重写了 handleRequest，即使验证失败也不会抛出错误
        return super.canActivate(context);
    }
}
