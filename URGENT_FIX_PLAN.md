# 🚨 紧急修复计划 - 安全与稳定性优化

## 执行时间表
- **P0 (立即修复)**: 今天完成
- **P1 (本周修复)**: 3天内完成
- **P2 (下周优化)**: 7天内完成

---

## 🔥 P0 - 立即修复（安全关键）

### 1. JWT Secret 强制验证
**文件**: `content-backend/src/auth/auth.module.ts`

```typescript
// 修改前
JwtModule.register({
  secret: process.env.JWT_SECRET || 'default-secret',
})

// 修改后
JwtModule.registerAsync({
  imports: [ConfigModule],
  useFactory: (configService: ConfigService) => {
    const secret = configService.get<string>('JWT_SECRET');
    if (!secret || secret === 'default-secret') {
      throw new Error('JWT_SECRET must be set in environment variables');
    }
    return {
      secret,
      signOptions: { expiresIn: '7d' },
    };
  },
  inject: [ConfigService],
})
```

**测试命令**:
```bash
# 删除 .env 中的 JWT_SECRET，应该报错
npm run start:dev
```

---

### 2. 飞书 Webhook 签名完整验证
**文件**: `content-backend/src/feishu/feishu-webhook.guard.ts`

```typescript
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

@Injectable()
export class FeishuWebhookGuard implements CanActivate {
  constructor(private configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    
    const timestamp = request.headers['x-lark-request-timestamp'];
    const nonce = request.headers['x-lark-request-nonce'];
    const signature = request.headers['x-lark-signature'];
    
    if (!timestamp || !nonce || !signature) {
      throw new UnauthorizedException('Missing required headers');
    }
    
    // 防重放攻击：5分钟内有效
    const requestTime = parseInt(timestamp) * 1000;
    const now = Date.now();
    if (Math.abs(now - requestTime) > 5 * 60 * 1000) {
      throw new UnauthorizedException('Request timestamp expired');
    }
    
    // 验证签名
    const token = this.configService.get<string>('FEISHU_VERIFICATION_TOKEN');
    const body = JSON.stringify(request.body);
    const data = `${timestamp}${nonce}${token}${body}`;
    const expectedSignature = crypto
      .createHash('sha256')
      .update(data)
      .digest('hex');
    
    if (expectedSignature !== signature) {
      throw new UnauthorizedException('Invalid signature');
    }
    
    return true;
  }
}
```

**测试**:
```bash
# 使用错误的签名发送请求，应该返回 401
curl -X POST http://localhost:3001/api/webhook/feishu \
  -H "x-lark-signature: invalid" \
  -H "Content-Type: application/json" \
  -d '{}'
```

---

### 3. 文件上传大小限制
**文件**: `content-backend/src/feishu/feishu-message.handler.ts`

```typescript
private readonly MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

async downloadFile(fileKey: string, messageId: string): Promise<Buffer> {
  const response = await this.client.request({
    method: 'GET',
    url: `/open-apis/im/v1/messages/${messageId}/resources/${fileKey}`,
    params: { type: 'file' },
    responseType: 'arraybuffer',
  });
  
  // 检查文件大小
  const contentLength = response.headers['content-length'];
  if (contentLength && parseInt(contentLength) > this.MAX_FILE_SIZE) {
    throw new BadRequestException(`File too large. Max size: ${this.MAX_FILE_SIZE / 1024 / 1024}MB`);
  }
  
  const buffer = Buffer.from(response.data);
  
  // 二次验证实际大小
  if (buffer.length > this.MAX_FILE_SIZE) {
    throw new BadRequestException('File size exceeds limit');
  }
  
  return buffer;
}
```

---

### 4. 前端 Token 401 自动跳转
**文件**: `src/utils/api.ts`

```typescript
import axios from 'axios';
import router from '../router';
import { ElMessage } from 'element-plus';

const api = axios.create({
  baseURL: '/api',
  timeout: 30000,
});

// 请求拦截器
api.interceptors.request.use(
  config => {
    const token = sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// 响应拦截器
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // 清除 token
      sessionStorage.removeItem('token');
      
      // 显示提示
      ElMessage.error('登录已过期，请重新登录');
      
      // 跳转登录页，保存当前路径
      router.push({
        path: '/login',
        query: { redirect: router.currentRoute.value.fullPath }
      });
    } else if (error.response?.status === 403) {
      ElMessage.error('没有权限访问');
    } else if (error.response?.status >= 500) {
      ElMessage.error('服务器错误，请稍后重试');
    }
    
    return Promise.reject(error);
  }
);

export default api;
```

---

## ⚡ P1 - 本周修复（稳定性）

### 5. 添加数据库索引
**文件**: 创建新的 migration

```bash
cd content-backend
npm run typeorm migration:create -- src/migrations/AddIndexes
```

```typescript
// src/migrations/xxx-AddIndexes.ts
import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIndexes1234567890 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // users 表索引
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_users_tenant_feishu 
      ON users(tenantId, feishuId);
    `);
    
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_users_tenant 
      ON users(tenantId);
    `);
    
    // articles 表索引
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_articles_owner 
      ON articles(ownerId);
    `);
    
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_articles_status 
      ON articles(status);
    `);
    
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_articles_created 
      ON articles(createdAt DESC);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS idx_users_tenant_feishu;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_users_tenant;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_articles_owner;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_articles_status;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_articles_created;`);
  }
}
```

**执行**:
```bash
npm run typeorm migration:run -- -d dist/data-source.js
```

---

### 6. 统一异常处理
**文件**: `content-backend/src/common/filters/all-exceptions.filter.ts`

```typescript
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.message
        : 'Internal server error';

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message,
    };

    // 记录错误日志
    if (status >= 500) {
      this.logger.error(
        `${request.method} ${request.url}`,
        exception instanceof Error ? exception.stack : exception,
      );
    } else {
      this.logger.warn(
        `${request.method} ${request.url} - ${message}`,
      );
    }

    response.status(status).json(errorResponse);
  }
}
```

**注册**:
```typescript
// main.ts
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalFilters(new AllExceptionsFilter());
  
  await app.listen(3001);
}
```

---

### 7. 添加 DTO 验证
**文件**: `content-backend/src/dto/create-article.dto.ts`

```typescript
import { IsString, IsNotEmpty, MaxLength, IsOptional, IsObject } from 'class-validator';

export class CreateArticleDto {
  @IsString()
  @IsNotEmpty({ message: '标题不能为空' })
  @MaxLength(200, { message: '标题不能超过200个字符' })
  title: string;

  @IsOptional()
  @IsObject()
  config?: Record<string, any>;
}
```

**更新 Controller**:
```typescript
// article.controller.ts
import { ValidationPipe } from '@nestjs/common';
import { CreateArticleDto } from '../dto/create-article.dto';

@Post()
@UseGuards(AuthGuard('jwt'))
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
create(@Body() dto: CreateArticleDto, @Request() req) {
  return this.articleService.create(dto.title, req.user);
}
```

**全局启用**:
```typescript
// main.ts
app.useGlobalPipes(new ValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true,
}));
```

---

## 🎯 P2 - 下周优化（性能与体验）

### 8. 添加请求日志中间件
**文件**: `content-backend/src/common/middleware/logger.middleware.ts`

```typescript
import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, ip } = req;
    const userAgent = req.get('user-agent') || '';
    const startTime = Date.now();

    res.on('finish', () => {
      const { statusCode } = res;
      const duration = Date.now() - startTime;
      
      const message = `${method} ${originalUrl} ${statusCode} ${duration}ms - ${ip}`;
      
      if (statusCode >= 500) {
        this.logger.error(message);
      } else if (statusCode >= 400) {
        this.logger.warn(message);
      } else {
        this.logger.log(message);
      }
    });

    next();
  }
}
```

**注册**:
```typescript
// app.module.ts
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
```

---

### 9. 前端组件拆分
**示例**: 拆分 `Step2Curtain.vue`

创建子组件：
- `src/components/Step2/TextEditor.vue`
- `src/components/Step2/ImageUploader.vue`
- `src/components/Step2/StylePanel.vue`

```vue
<!-- Step2Curtain.vue -->
<template>
  <div class="step2-container">
    <TextEditor v-model="content" />
    <ImageUploader @upload="handleImageUpload" />
    <StylePanel v-model="style" />
  </div>
</template>

<script setup>
import TextEditor from '@/components/Step2/TextEditor.vue';
import ImageUploader from '@/components/Step2/ImageUploader.vue';
import StylePanel from '@/components/Step2/StylePanel.vue';
</script>
```

---

### 10. 添加图片懒加载
**安装**:
```bash
npm install vue3-lazy
```

**使用**:
```vue
<template>
  <img 
    v-lazy="article.coverImage" 
    :alt="article.title"
    loading="lazy"
  />
</template>

<script setup>
import { directive as vLazy } from 'vue3-lazy';
</script>
```

---

## 📋 验收标准

### P0 验收
- [ ] 启动时无 JWT_SECRET 会报错
- [ ] 错误的 Webhook 签名返回 401
- [ ] 上传超过 50MB 文件被拒绝
- [ ] Token 过期自动跳转登录页

### P1 验收
- [ ] 数据库查询使用索引（EXPLAIN 分析）
- [ ] 所有异常返回统一格式
- [ ] DTO 验证失败返回 400

### P2 验收
- [ ] 所有请求都有日志记录
- [ ] 组件代码不超过 300 行
- [ ] 图片懒加载生效

---

## 🚀 执行脚本

```bash
# 一键执行 P0 修复
cd content-backend

# 1. 运行测试
npm run test

# 2. 检查编译
npm run build

# 3. 运行 migration
npm run typeorm migration:run -- -d dist/data-source.js

# 4. 重启服务
npm run start:dev
```

---

**创建时间**: 2025-12-21  
**预计完成**: 2025-12-28  
**负责人**: 梁博星
