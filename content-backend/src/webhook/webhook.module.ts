import { Module } from '@nestjs/common';
import { FeishuWebhookController } from './feishu-webhook.controller';
import { FeishuWebhookService } from './feishu-webhook.service';
import { SyncModule } from '../sync/sync.module';
import { TenantModule } from '../tenant/tenant.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Tenant } from '../entities/tenant.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([User, Tenant]),
        SyncModule,
        TenantModule,
    ],
    controllers: [FeishuWebhookController],
    providers: [FeishuWebhookService],
    exports: [FeishuWebhookService],
})
export class WebhookModule { }
