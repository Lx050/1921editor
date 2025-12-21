import { Injectable, Logger } from '@nestjs/common';
import { FeishuTableSyncService } from '../sync/feishu-table-sync.service';
import { ArticleSyncService } from '../sync/article-sync.service';
import { TenantService } from '../tenant/tenant.service';

@Injectable()
export class FeishuWebhookService {
    private readonly logger = new Logger(FeishuWebhookService.name);

    constructor(
        private readonly feishuTableSyncService: FeishuTableSyncService,
        private readonly articleSyncService: ArticleSyncService,
        private readonly tenantService: TenantService,
    ) { }

    /**
     * 处理飞书事件
     * @param body 原始请求体
     */
    async handleEvent(body: any) {
        const header = body.header;
        if (!header) {
            this.logger.warn('收到非 2.0 格式的飞书事件，跳过');
            return;
        }

        const eventType = header.event_type;
        this.logger.log(`处理飞书事件: ${eventType} (EventID: ${header.event_id})`);

        switch (eventType) {
            case 'bitable.app_table_record.created_v1':
            case 'bitable.app_table_record.updated_v1':
                await this.handleBitableEvent(body);
                break;

            case 'bitable.app_table_record.deleted_v1':
                this.logger.log('由于删除逻辑较复杂（需要标记位），暂不自动处理记录删除');
                break;

            default:
                this.logger.log(`未处理的事件类型: ${eventType}`);
        }
    }

    /**
     * 处理多维表格记录变更事件
     */
    private async handleBitableEvent(body: any) {
        const event = body.event;
        if (!event) return;

        const { app_token, table_id } = event;
        this.logger.log(`多维表格变更: AppToken=${app_token}, TableID=${table_id}`);

        // 1. 查找对应的租户及其配置
        const tenants = await this.tenantService.findAll();
        const tenant = tenants.find(t => {
            const s = t.settings || {};
            return (s.userTable?.appToken === app_token && s.userTable?.tableId === table_id) ||
                (s.articleTable?.appToken === app_token && s.articleTable?.tableId === table_id);
        });

        if (!tenant) {
            this.logger.warn(`找不到配置了表格 ${app_token}/${table_id} 的租户，忽略该事件`);
            return;
        }

        this.logger.log(`命中租户: ${tenant.name}`);
        const settings = tenant.settings;

        // 2. 判断是哪张表并分发
        if (settings.articleTable?.appToken === app_token && settings.articleTable?.tableId === table_id) {
            this.logger.log('分发到文章表同步处理器');
            await this.articleSyncService.syncArticleFromFeishu(event, tenant);
        } else if (settings.userTable?.appToken === app_token && settings.userTable?.tableId === table_id) {
            this.logger.log('分发到用户表同步处理器 (单向同步中，记录变更已记录，暂不反向同步)');
        }
    }
}
