import {
    Controller,
    Post,
    Body,
    Headers,
    Logger,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiTags, ApiOperation, ApiExcludeEndpoint } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createHmac } from 'crypto';
import { User } from '../entities/user.entity';
import { Article } from '../entities/article.entity';
import { Tenant } from '../entities/tenant.entity';

/**
 * 飞书事件回调接口
 * 接收来自飞书开放平台的 Webhook 事件
 */
@ApiTags('Webhook')
@Controller('webhook/feishu')
export class FeishuWebhookController {
    private readonly logger = new Logger(FeishuWebhookController.name);
    private readonly verificationToken: string;
    private readonly encryptKey: string;

    constructor(
        private configService: ConfigService,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Article)
        private articleRepository: Repository<Article>,
        @InjectRepository(Tenant)
        private tenantRepository: Repository<Tenant>,
    ) {
        this.verificationToken =
            this.configService.get<string>('FEISHU_VERIFICATION_TOKEN') || '';
        this.encryptKey =
            this.configService.get<string>('FEISHU_ENCRYPT_KEY') || '';
    }

    /**
     * 接收飞书事件回调
     */
    @Post()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: '飞书事件回调' })
    @ApiExcludeEndpoint() // 从 Swagger 文档中隐藏
    async handleWebhook(
        @Body() body: any,
        @Headers('x-lark-signature') signature: string,
        @Headers('x-lark-request-timestamp') timestamp: string,
        @Headers('x-lark-request-nonce') nonce: string,
    ): Promise<any> {
        this.logger.log(`📥 收到飞书 Webhook: ${JSON.stringify(body).slice(0, 200)}`);

        // 1. URL 验证挑战 (首次配置时飞书会发送)
        if (body.type === 'url_verification') {
            this.logger.log('🔐 处理 URL 验证挑战');
            return { challenge: body.challenge };
        }

        // 2. 验证签名 (生产环境必须)
        if (this.encryptKey && signature) {
            const isValid = this.verifySignature(body, signature, timestamp, nonce);
            if (!isValid) {
                this.logger.warn('❌ 签名验证失败');
                return { code: 401, msg: 'Invalid signature' };
            }
        }

        // 3. 验证 Token
        if (body.token && body.token !== this.verificationToken) {
            this.logger.warn('❌ Verification Token 不匹配');
            return { code: 401, msg: 'Invalid token' };
        }

        // 4. 处理事件
        const event = body.event || body;
        const eventType = body.header?.event_type || body.type;

        this.logger.log(`📬 事件类型: ${eventType}`);

        try {
            switch (eventType) {
                case 'drive.file.bitable_record_changed_v1':
                case 'bitable.record.changed':
                    await this.handleBitableRecordChanged(event);
                    break;

                default:
                    this.logger.debug(`未处理的事件类型: ${eventType}`);
            }
        } catch (error) {
            this.logger.error('事件处理失败:', error);
        }

        // 飞书要求在 3 秒内返回 200
        return { code: 0, msg: 'ok' };
    }

    /**
     * 验证请求签名
     */
    private verifySignature(
        body: any,
        signature: string,
        timestamp: string,
        nonce: string,
    ): boolean {
        if (!this.encryptKey) return true;

        const content = timestamp + nonce + this.encryptKey + JSON.stringify(body);
        const computedSignature = createHmac('sha256', '')
            .update(content)
            .digest('hex');

        return computedSignature === signature;
    }

    /**
     * 处理 Bitable 记录变更事件
     * 当用户在飞书表格中修改记录时触发
     */
    private async handleBitableRecordChanged(event: any): Promise<void> {
        this.logger.log('🔄 处理 Bitable 记录变更事件');

        const { app_token, table_id, record_id, action_list } = event;

        if (!app_token || !table_id || !record_id) {
            this.logger.warn('事件数据不完整');
            return;
        }

        // 查找对应的租户配置
        const tenants = await this.tenantRepository.find();

        for (const tenant of tenants) {
            const userTableConfig = tenant.settings?.userTable;
            const articleTableConfig = tenant.settings?.articleTable;

            // 检查是否是用户表
            if (
                userTableConfig?.appToken === app_token &&
                userTableConfig?.tableId === table_id
            ) {
                this.logger.log(`👤 用户表记录变更: ${record_id}`);
                // TODO: 从飞书同步用户数据回系统
                // 这里可以实现反向同步逻辑
                break;
            }

            // 检查是否是文章表
            if (
                articleTableConfig?.appToken === app_token &&
                articleTableConfig?.tableId === table_id
            ) {
                this.logger.log(`📄 文章表记录变更: ${record_id}`);

                // 查找关联的文章
                const article = await this.articleRepository.findOne({
                    where: { feishuRecordId: record_id },
                });

                if (article) {
                    // TODO: 从飞书同步文章数据回系统
                    this.logger.log(`找到关联文章: ${article.title}`);
                }
                break;
            }
        }
    }
}
