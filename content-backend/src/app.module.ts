import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ThrottlerModule } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { APP_GUARD, APP_INTERCEPTOR, APP_FILTER } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ArticleModule } from './article/article.module';
import { EmailModule } from './email/email.module';
// import { SyncModule } from './sync/sync.module'; // 已移除：依赖飞书模块
import { TenantModule } from './tenant/tenant.module';
import { NanoBananaModule } from './nano-banana/nano-banana.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { SecurityLoggerService } from './common/services/security-logger.service';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { join } from 'path';
// import { WebhookModule } from './webhook/webhook.module'; // 已移除：依赖飞书模块
import { SystemModule } from './system/system.module';
import { StyleTemplateModule } from './style-template/style-template.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(), // 启用定时任务
    ThrottlerModule.forRoot([
      {
        // 🔒 开发环境宽松的限流配置
        ttl: 60000, // 60秒
        limit: 1000, // 每60秒最多1000个请求
      },
      {
        // 🔒 对敏感接口更严格的限制
        ttl: 60000,
        limit: 10,
        name: 'sensitive',
      },
    ]),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get('DATABASE_URL'),
        autoLoadEntities: true,
        synchronize: false, // 🔒 关闭同步模式，使用 migration 管理数据库变更
        migrationsRun: false, // 建议手动运行 migration
        migrations: ['dist/migrations/*.js'], // 配置 migration 文件路径
        logging: configService.get('NODE_ENV') === 'development', // 开发环境显示 SQL 日志
      }),
      inject: [ConfigService],
    }),
    EventEmitterModule.forRoot(),
    TenantModule,
    SystemModule,
    AuthModule,
    ArticleModule,
    EmailModule,
    // SyncModule, // 已移除：依赖飞书模块
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    NanoBananaModule,
    StyleTemplateModule,
    // WebhookModule, // 已移除：依赖飞书模块
  ],
  controllers: [AppController],
  providers: [
    AppService,
    SecurityLoggerService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useFactory: (securityLogger: SecurityLoggerService) => {
        return new LoggingInterceptor(securityLogger);
      },
      inject: [SecurityLoggerService],
    },
    {
      provide: APP_FILTER,
      useFactory: (securityLogger: SecurityLoggerService) => {
        return new HttpExceptionFilter(securityLogger);
      },
      inject: [SecurityLoggerService],
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
