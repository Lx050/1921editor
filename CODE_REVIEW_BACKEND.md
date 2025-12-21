# 代码审查报告 - 后端 (NestJS)

## 审查范围
- 架构设计
- 安全性
- 性能优化
- 代码质量
- 最佳实践

---

## 🔴 严重问题 (Critical)

### 1. JWT Secret 硬编码风险
**位置**: `content-backend/src/auth/auth.module.ts`

**问题**: JWT_SECRET 可能使用默认值
```typescript
JwtModule.register({
  secret: process.env.JWT_SECRET || 'default-secret', // ❌ 危险
})
```

**建议**:
```typescript
JwtModule.registerAsync({
  useFactory: (configService: ConfigService) => {
    const secret = configService.get<string>('JWT_SECRET');
    if (!secret) {
      throw new Error('JWT_SECRET is required');
    }
    return { secret, signOptions: { expiresIn: '7d' } };
  },
  inject: [ConfigService],
})
```

---

### 2. 飞书 Webhook 签名验证不完整
**位置**: `content-backend/src/feishu/feishu-webhook.guard.ts`

**当前实现**:
```typescript
const signature = request.headers['x-lark-signature'];
// 仅验证签名存在，未验证内容
```

**建议**: 完整实现签名验证
```typescript
import * as crypto from 'crypto';

canActivate(context: ExecutionContext): boolean {
  const request = context.switchToHttp().getRequest();
  const timestamp = request.headers['x-lark-request-timestamp'];
  const nonce = request.headers['x-lark-request-nonce'];
  const signature = request.headers['x-lark-signature'];
  const body = JSON.stringify(request.body);
  
  // 防重放攻击
  const requestTime = parseInt(timestamp);
  if (Date.now() - requestTime > 5 * 60 * 1000) {
    throw new UnauthorizedException('Request expired');
  }
  
  // 验证签名
  const token = this.configService.get('FEISHU_VERIFICATION_TOKEN');
  const data = `${timestamp}${nonce}${token}${body}`;
  const hash = crypto.createHash('sha256').update(data).digest('hex');
  
  if (hash !== signature) {
    throw new UnauthorizedException('Invalid signature');
  }
  
  return true;
}
```

---

### 3. 文件上传缺少大小限制
**位置**: `content-backend/src/feishu/feishu-message.handler.ts`

**问题**: 下载飞书文件时未限制大小
```typescript
const fileBuffer = await response.arrayBuffer(); // ❌ 可能导致内存溢出
```

**建议**:
```typescript
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

const contentLength = response.headers.get('content-length');
if (contentLength && parseInt(contentLength) > MAX_FILE_SIZE) {
  throw new BadRequestException('File too large');
}

// 使用流式下载
const stream = response.body;
const chunks = [];
let totalSize = 0;

for await (const chunk of stream) {
  totalSize += chunk.length;
  if (totalSize > MAX_FILE_SIZE) {
    throw new BadRequestException('File too large');
  }
  chunks.push(chunk);
}
```

---

## 🟡 重要问题 (High)

### 4. 数据库查询未使用索引
**位置**: `content-backend/src/auth/auth.service.ts`

**问题**:
```typescript
const user = await this.userRepository.findOne({
  where: { tenantId, feishuId: feishuUser.open_id },
  relations: ['tenant'],
});
```

**建议**: 确保数据库有复合索引
```sql
CREATE INDEX idx_users_tenant_feishu 
ON users(tenantId, feishuId);
```

---

### 5. 错误处理不统一
**位置**: 多个 Service 文件

**问题**: 混用 `throw new Error()` 和 `throw new HttpException()`

**建议**: 创建统一的异常过滤器
```typescript
// common/filters/all-exceptions.filter.ts
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status = exception instanceof HttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const message = exception instanceof HttpException
      ? exception.message
      : 'Internal server error';

    this.logger.error({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
      stack: exception instanceof Error ? exception.stack : undefined,
    });

    response.status(status).json({
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
```

---

### 6. 循环依赖风险
**位置**: `ArticleModule` ↔ `FeishuModule`

**当前方案**: 使用 `forwardRef()`

**建议**: 重构为事件驱动
```typescript
// article.service.ts
async create(title: string, metadata?: Partial<Article>) {
  const article = await this.articleRepository.save({...});
  
  // 发布事件而不是直接调用
  this.eventEmitter.emit('article.created', {
    articleId: article.id,
    ownerId: article.ownerId,
  });
  
  return article;
}

// feishu-message.handler.ts
@OnEvent('article.created')
async handleArticleCreated(payload: ArticleCreatedEvent) {
  await this.sendNotification(payload);
}
```

---

## 🟢 建议优化 (Medium)

### 7. 缺少请求日志中间件
**建议**: 添加全局日志中间件
```typescript
// common/middleware/logger.middleware.ts
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, ip } = req;
    const userAgent = req.get('user-agent') || '';
    const startTime = Date.now();

    res.on('finish', () => {
      const { statusCode } = res;
      const duration = Date.now() - startTime;
      
      this.logger.log(
        `${method} ${originalUrl} ${statusCode} ${duration}ms - ${userAgent} ${ip}`
      );
    });

    next();
  }
}
```

---

### 8. 缺少 DTO 验证
**位置**: `content-backend/src/article/article.controller.ts`

**当前**:
```typescript
@Post()
create(@Body('title') title: string, @Request() req) {
  return this.articleService.create(title, req.user);
}
```

**建议**: 使用 class-validator
```typescript
// dto/create-article.dto.ts
export class CreateArticleDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title: string;

  @IsOptional()
  @IsObject()
  config?: Record<string, any>;
}

// controller
@Post()
@UsePipes(new ValidationPipe())
create(@Body() dto: CreateArticleDto, @Request() req) {
  return this.articleService.create(dto.title, req.user);
}
```

---

### 9. 数据库事务缺失
**位置**: `content-backend/src/auth/auth.service.ts`

**问题**: 创建/更新用户时未使用事务

**建议**:
```typescript
async feishuLogin(code: string, tenantSlug: string) {
  return await this.dataSource.transaction(async (manager) => {
    // 所有数据库操作在同一事务中
    const userRepo = manager.getRepository(User);
    
    let user = await userRepo.findOne({...});
    if (!user) {
      user = await userRepo.save({...});
    } else {
      await userRepo.update(user.id, {...});
    }
    
    return this.jwtService.sign({...});
  });
}
```

---

### 10. 缺少健康检查端点
**建议**: 添加健康检查
```typescript
// app.controller.ts
@Get('health')
async healthCheck() {
  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: await this.checkDatabase(),
    feishu: await this.checkFeishu(),
  };
}
```

---

## 📊 性能优化建议

### 11. 添加 Redis 缓存
```typescript
// 缓存用户信息
@Injectable()
export class UserService {
  async findById(id: string): Promise<User> {
    const cacheKey = `user:${id}`;
    const cached = await this.redis.get(cacheKey);
    
    if (cached) {
      return JSON.parse(cached);
    }
    
    const user = await this.userRepository.findOne({ where: { id } });
    await this.redis.setex(cacheKey, 3600, JSON.stringify(user));
    
    return user;
  }
}
```

---

### 12. 数据库连接池优化
```typescript
// data-source.ts
export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  poolSize: 20, // 增加连接池
  extra: {
    max: 20,
    min: 5,
    idleTimeoutMillis: 30000,
  },
});
```

---

## ✅ 做得好的地方

1. ✅ 使用了多租户架构
2. ✅ JWT 认证实现正确
3. ✅ 使用 TypeORM 管理数据库
4. ✅ 模块化设计清晰
5. ✅ 使用了环境变量配置

---

## 🎯 优先级修复清单

### 立即修复 (P0)
- [ ] JWT Secret 验证
- [ ] 飞书 Webhook 签名完整验证
- [ ] 文件上传大小限制

### 本周修复 (P1)
- [ ] 添加数据库索引
- [ ] 统一异常处理
- [ ] 添加 DTO 验证

### 下周优化 (P2)
- [ ] 重构循环依赖
- [ ] 添加请求日志
- [ ] 添加健康检查

---

**审查人**: AI Assistant  
**审查时间**: 2025-12-21  
**代码版本**: v1.0
