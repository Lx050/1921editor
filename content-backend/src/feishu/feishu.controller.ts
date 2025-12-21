import { Controller, Post, Body, Logger, Headers } from '@nestjs/common';
import { FeishuService } from './feishu.service';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { FeishuWebhookGuard } from './feishu-webhook.guard';
import { UseGuards } from '@nestjs/common';

@Controller('webhook/feishu')
@UseGuards(FeishuWebhookGuard) // 🔒 应用 Webhook 签名验证
export class FeishuController {
  private readonly logger = new Logger(FeishuController.name);

  constructor(
    private readonly feishuService: FeishuService,
    private readonly configService: ConfigService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @Post()
  async event(@Body() body: any) {
    // 1. URL Verification Challenge
    if (body.type === 'url_verification') {
      this.logger.log('Handling URL verification challenge');
      return { challenge: body.challenge };
    }

    // 2. Encryption Handling (TODO: Decrypt if needed)
    if (body.encrypt) {
      this.logger.warn(
        'Received encrypted event, decryption not implemented yet.',
      );
      return;
    }

    // 3. Event Dispatching
    const eventType = body.header?.event_type;
    this.logger.log(`Received event type: ${eventType}`);

    if (eventType === 'im.message.receive_v1') {
      this.eventEmitter.emit('feishu.message.received', body.event);
    }

    return { msg: 'success' };
  }
}
