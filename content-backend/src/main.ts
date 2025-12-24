import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const logger = new Logger('Bootstrap');

  // 🔒 启用安全头部
  app.use(
    helmet({
      crossOriginEmbedderPolicy: false, // 允许前端嵌入
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"], // 允许内联样式（Vue需要）
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", 'data:', 'https:'],
          fontSrc: ["'self'"],
          connectSrc: ["'self'"],
          frameSrc: ["'none'"],
          objectSrc: ["'none'"],
          mediaSrc: ["'self'"],
          manifestSrc: ["'self'"],
        },
      },
    }),
  );

  // 🔒 启用全局验证管道
  // 注意：禁用 whitelist 以保留嵌套对象属性（如图片数组）
  // 如果需要某些端点使用 whitelist，在该端点单独配置
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // 自动转换类型
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // 🔒 启用全局异常过滤器
  app.useGlobalFilters(new AllExceptionsFilter());

  // 设置全局前缀
  app.setGlobalPrefix('api');

  // 🌐 启用 CORS - 允许前端访问
  const allowedOrigins = [
    'http://localhost:1921', // 前端开发服务器
    'http://localhost:5173', // Vite默认端口（备用）
    configService.get<string>('CORS_ORIGIN'),
  ].filter(Boolean); // 过滤掉undefined

  app.enableCors({
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void,
    ) => {
      // 允许无origin的请求（如Postman、curl等）
      if (!origin) return callback(null, true);

      // 检查origin是否在允许列表中
      if (
        allowedOrigins.some((allowed: string) => origin.startsWith(allowed))
      ) {
        callback(null, true);
      } else {
        logger.warn(`CORS blocked request from origin: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-API-Key',
      'X-Requested-With',
    ],
    credentials: true,
    maxAge: 86400, // 预检请求缓存1天
  });

  logger.log(`CORS enabled for origins: ${allowedOrigins.join(', ')}`);

  // 配置 Swagger 文档
  if (configService.get('NODE_ENV') !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Content Backend API')
      .setDescription('内容管理后端 API 文档')
      .setVersion('1.0')
      .addBearerAuth()
      .addApiKey({ type: 'apiKey', name: 'X-API-Key', in: 'header' }, 'apiKey')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);

    logger.log('Swagger documentation available at /api/docs');
  }

  const port = configService.get<number>('PORT') ?? 3001;
  await app.listen(port);

  logger.log(`Application is running on: http://localhost:${port}`);
  logger.log(`API endpoint: http://localhost:${port}/api`);
}

bootstrap().catch((error) => {
  const logger = new Logger('Bootstrap');
  logger.error('Failed to start application:', error);
  process.exit(1);
});
