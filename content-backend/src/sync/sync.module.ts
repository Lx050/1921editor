import { Module, forwardRef } from '@nestjs/common';
import { SyncService } from './sync.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Tenant } from '../entities/tenant.entity';
import { FeishuModule } from '../feishu/feishu.module';
import { ConfigModule } from '@nestjs/config';
import { SyncController } from './sync.controller';
import { FeishuOrgSyncService } from './feishu-org-sync.service';
import { FeishuTableSyncService } from './feishu-table-sync.service';
import { ArticleSyncService } from './article-sync.service';
import { Article } from '../entities/article.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Tenant, Article]),
    forwardRef(() => FeishuModule),
    ConfigModule,
  ],
  providers: [
    SyncService,
    FeishuOrgSyncService,
    FeishuTableSyncService,
    ArticleSyncService,
  ],
  exports: [
    SyncService,
    FeishuOrgSyncService,
    FeishuTableSyncService,
    ArticleSyncService,
  ],
  controllers: [SyncController],
})
export class SyncModule {}
