import { Controller, Post, Body, Logger, HttpCode, HttpStatus } from '@nestjs/common';
import { FeishuWebhookService } from './feishu-webhook.service';

@Controller('webhook/feishu')
export class FeishuWebhookController {
    private readonly logger = new Logger(FeishuWebhookController.name);

    constructor(private readonly feishuWebhookService: FeishuWebhookService) { }

    @Post()
    @HttpCode(HttpStatus.OK)
    async handleWebhook(@Body() body: any) {
        this.logger.log('收到飞书 Webhook 事件');

        // 1. 处理 URL 验证请求 (Challenge)
        if (body.type === 'url_verification') {
            this.logger.log('处理 URL 验证 (Challenge)');
            return { challenge: body.challenge };
        }

        // 2. 处理事件回调
        // 注意：飞书 2.0 格式的头部信息在 body.header 中，事件内容在 body.event 中
        try {
            await this.feishuWebhookService.handleEvent(body);
            return { status: 'success' };
        } catch (error) {
            this.logger.error(`处理 Webhook 事件失败: ${error.message}`);
            return { status: 'error', message: error.message };
        }
    }
}
