import { Module, forwardRef } from '@nestjs/common';
import { FeishuService } from './feishu.service';
import { FeishuController } from './feishu.controller';
import { FeishuWebhookGuard } from './feishu-webhook.guard';
import { FileParserService } from './file-parser.service';
import { FeishuMessageHandler } from './feishu-message.handler';
import { ConfigModule } from '@nestjs/config';
import { ArticleModule } from '../article/article.module';
import { AuditLoggerService } from '../common/services/audit-logger.service';

@Module({
  imports: [ConfigModule, forwardRef(() => ArticleModule)],
  providers: [
    FeishuService,
    FeishuWebhookGuard,
    FileParserService,
    FeishuMessageHandler,
    AuditLoggerService,
  ],
  controllers: [FeishuController],
  exports: [FeishuService],
})
export class FeishuModule {}
