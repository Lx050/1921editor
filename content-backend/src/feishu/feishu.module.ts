import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { FeishuSdkService } from './feishu-sdk.service';
import { BitableSyncService } from './bitable-sync.service';
import { FeishuWebhookController } from './feishu-webhook.controller';
import { User } from '../entities/user.entity';
import { Article } from '../entities/article.entity';
import { Tenant } from '../entities/tenant.entity';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([User, Article, Tenant])],
  controllers: [FeishuWebhookController],
  providers: [FeishuSdkService, BitableSyncService],
  exports: [FeishuSdkService, BitableSyncService],
})
export class FeishuModule {}
