import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { FeishuService } from './feishu.service';
import { FileParserService } from './file-parser.service';
import { ArticleService } from '../article/article.service';
import { ConfigService } from '@nestjs/config';
import { AuditLoggerService } from '../common/services/audit-logger.service';
import * as path from 'path';
import * as fs from 'fs/promises';

@Injectable()
export class FeishuMessageHandler {
  private readonly logger = new Logger(FeishuMessageHandler.name);
  private readonly uploadDir: string;
  private readonly frontendUrl: string;

  constructor(
    private readonly feishuService: FeishuService,
    private readonly fileParser: FileParserService,
    private readonly articleService: ArticleService,
    private readonly configService: ConfigService,
    private readonly auditLogger: AuditLoggerService,
  ) {
    this.uploadDir = path.join(process.cwd(), 'uploads');
    this.frontendUrl =
      this.configService.get('FRONTEND_URL') || 'http://localhost:1921';
  }

  /**
   * 监听飞书消息事件
   */
  @OnEvent('feishu.message.received')
  async handleMessage(event: any) {
    this.logger.log('Received Feishu message event');
    this.logger.debug(`Event data: ${JSON.stringify(event)}`);

    try {
      // 检查消息类型
      const messageType = event.message?.message_type;

      if (messageType === 'file') {
        await this.handleFileMessage(event);
      } else {
        this.logger.log(`Unsupported message type: ${messageType}`);
      }
    } catch (error) {
      this.logger.error(
        `Failed to handle message: ${error.message}`,
        error.stack,
      );

      // 审计日志：错误追踪
      await this.auditLogger.logError('FeishuMessage', error, {
        messageType: event.message?.message_type,
        fileName: event.message?.file_name,
        senderId: event.sender?.sender_id?.open_id,
      });

      // 发送错误通知给用户
      try {
        await this.sendErrorNotification(event, error.message);
      } catch (notifyError) {
        this.logger.error(
          `Failed to send error notification: ${notifyError.message}`,
        );
      }
    }
  }

  /**
   * 处理文件消息
   */
  private async handleFileMessage(event: any) {
    const messageId = event.message?.message_id;
    const fileKey = event.message?.file_key;
    const fileName = event.message?.file_name || 'unknown_file';
    const senderId = event.sender?.sender_id?.open_id;

    if (!fileKey) {
      this.logger.warn('File key not found in message');
      return;
    }

    this.logger.log(`Processing file: ${fileName} (key: ${fileKey})`);

    // 审计日志：开始处理
    await this.auditLogger.logAudit('FeishuMessage', 'File upload started', {
      fileName,
      fileKey,
      messageId,
      senderId,
    });

    // 1. 下载文件
    const localFilePath = await this.downloadFile(fileKey, fileName);

    // 2. 解析文件
    const parsedContent = await this.fileParser.parseFile(localFilePath);

    // 审计日志：文件解析完成
    await this.auditLogger.logAudit(
      'FeishuMessage',
      'File parsed successfully',
      {
        fileName,
        textLength: parsedContent.text.length,
        imageCount: parsedContent.images.length,
      },
    );

    // 3. 保存图片到 uploads 目录
    const savedImages = await this.saveImages(parsedContent.images);

    // 4. 创建 Article 草稿
    const article = await this.articleService.create(fileName, {
      content: parsedContent.text, // 原始文本存到 content 字段
      config: {
        uploadedFile: path.basename(localFilePath),
        sourceMessageId: messageId,
        imageUrls: savedImages.map((img) => img.url),
        rawText: parsedContent.text, // 也存一份到 config
      },
      images: savedImages, // 图片元数据
    });

    this.logger.log(`Article created: ${article.id}`);

    // 审计日志：Article 创建成功
    await this.auditLogger.logAudit('FeishuMessage', 'Article draft created', {
      articleId: article.id,
      fileName,
      senderId,
      imageCount: savedImages.length,
    });

    // 5. 发送飞书通知
    await this.sendSuccessNotification(event, article.id);

    // 6. 清理临时文件（可选）
    // await fs.unlink(localFilePath);
  }

  /**
   * 下载飞书文件
   */
  private async downloadFile(
    fileKey: string,
    fileName: string,
  ): Promise<string> {
    this.logger.log(`Downloading file: ${fileKey}`);

    const fileBuffer = await this.feishuService.downloadFile(fileKey);

    // 保存到 uploads 目录
    await fs.mkdir(this.uploadDir, { recursive: true });
    const localPath = path.join(this.uploadDir, `${Date.now()}_${fileName}`);
    await fs.writeFile(localPath, fileBuffer);

    this.logger.log(`File saved to: ${localPath}`);
    return localPath;
  }

  /**
   * 保存图片文件
   */
  private async saveImages(
    images: Array<{ name: string; buffer: Buffer }>,
  ): Promise<Array<{ name: string; url: string }>> {
    const imagesDir = path.join(this.uploadDir, 'images');
    await fs.mkdir(imagesDir, { recursive: true });

    const savedImages: Array<{ name: string; url: string }> = [];

    for (const image of images) {
      const timestamp = Date.now();
      const safeName = image.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const imagePath = path.join(imagesDir, `${timestamp}_${safeName}`);

      await fs.writeFile(imagePath, image.buffer);

      // 构造访问 URL
      const imageUrl = `/uploads/images/${path.basename(imagePath)}`;
      savedImages.push({ name: image.name, url: imageUrl });

      this.logger.log(`Image saved: ${imagePath}`);
    }

    return savedImages;
  }

  /**
   * 发送成功通知
   */
  private async sendSuccessNotification(event: any, articleId: string) {
    const chatId = event.sender?.sender_id?.open_id;

    if (!chatId) {
      this.logger.warn('Chat ID not found, cannot send notification');
      return;
    }

    const configUrl = `${this.frontendUrl}/articles/${articleId}/config`;

    const message = {
      msg_type: 'interactive',
      card: {
        header: {
          title: {
            tag: 'plain_text',
            content: '✅ 文档处理成功',
          },
          template: 'green',
        },
        elements: [
          {
            tag: 'div',
            text: {
              tag: 'lark_md',
              content: `文档已成功解析！\n\n📝 **下一步**: 请点击下方按钮配置文章信息`,
            },
          },
          {
            tag: 'action',
            actions: [
              {
                tag: 'button',
                text: {
                  tag: 'plain_text',
                  content: '立即配置',
                },
                type: 'primary',
                url: configUrl,
              },
            ],
          },
        ],
      },
    };

    await this.feishuService.sendMessage(
      chatId,
      JSON.stringify(message.card),
      'interactive',
    );
    this.logger.log(`Success notification sent to ${chatId}`);
  }

  /**
   * 发送错误通知
   */
  private async sendErrorNotification(event: any, errorMessage: string) {
    const chatId = event.sender?.sender_id?.open_id;

    if (!chatId) return;

    const message = {
      msg_type: 'text',
      content: {
        text: `❌ 处理失败: ${errorMessage}\n\n请确保上传的是 .docx 或 .zip 格式的文件。`,
      },
    };

    await this.feishuService.sendMessage(chatId, message.content.text, 'text');
  }
}
