import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Lark from '@larksuiteoapi/node-sdk';
import * as fs from 'fs';

@Injectable()
export class FeishuService {
  private client: Lark.Client;
  private readonly logger = new Logger(FeishuService.name);

  constructor(private configService: ConfigService) {
    const appId = this.configService.get<string>('FEISHU_APP_ID');
    const appSecret = this.configService.get<string>('FEISHU_APP_SECRET');

    if (!appId || !appSecret) {
      this.logger.warn('Feishu AppID or Secret not found in config');
    }

    this.client = new Lark.Client({
      appId: appId || '',
      appSecret: appSecret || '',
      appType: Lark.AppType.SelfBuild,
      domain: Lark.Domain.Feishu,
      loggerLevel: Lark.LoggerLevel.info,
    });
  }

  getClient(): Lark.Client {
    return this.client;
  }

  async sendMessage(
    receiveId: string,
    content: string,
    msgType: string = 'text',
  ) {
    try {
      const messageData: any = {
        receive_id: receiveId,
        msg_type: msgType,
      };

      if (msgType === 'text') {
        messageData.content = JSON.stringify({ text: content });
      } else {
        messageData.content = content;
      }

      const resp = await this.client.im.message.create({
        params: {
          receive_id_type: 'open_id',
        },
        data: messageData,
      });

      if (resp.code !== 0) {
        this.logger.error(`Failed to send message: ${resp.msg}`);
        throw new Error(resp.msg);
      }
      return resp.data;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  /**
   * 下载文件并返回 Buffer
   */
  async downloadFile(fileKey: string): Promise<Buffer> {
    const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

    try {
      const resp = await this.client.im.file.get({
        path: {
          file_key: fileKey,
        },
      });

      // @ts-ignore - Lark SDK 返回 ArrayBuffer
      const arrayBuffer = await resp.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // 验证文件大小
      if (buffer.length > MAX_FILE_SIZE) {
        const sizeMB = (buffer.length / 1024 / 1024).toFixed(2);
        this.logger.error(
          `File too large: ${sizeMB}MB (max: 50MB), fileKey: ${fileKey}`,
        );
        throw new Error(`文件过大: ${sizeMB}MB，最大允许 50MB`);
      }

      this.logger.log(
        `File downloaded successfully: ${(buffer.length / 1024).toFixed(2)}KB`,
      );
      return buffer;
    } catch (e) {
      this.logger.error(`Failed to download file ${fileKey}`, e);
      throw e;
    }
  }

  /**
   * 下载文件并保存到指定路径（原方法保留）
   */
  async downloadFileToPath(fileKey: string, outputPath: string) {
    try {
      const resp = await this.client.im.file.get({
        path: {
          file_key: fileKey,
        },
      });
      // @ts-ignore
      await resp.writeFile(outputPath);
      return;
    } catch (e) {
      this.logger.error(`Failed to download file ${fileKey}`, e);
      throw e;
    }
  }

  async downloadMessageFile(
    messageId: string,
    fileKey: string,
    outputPath: string,
  ) {
    try {
      const resp = await this.client.im.messageResource.get({
        path: {
          message_id: messageId,
          file_key: fileKey,
        },
        params: {
          type: 'file',
        },
      });
      // @ts-ignore
      await resp.writeFile(outputPath);
      return;
    } catch (e) {
      this.logger.error(`Failed to download message resource ${fileKey}`, e);
      throw e;
    }
  }
}
