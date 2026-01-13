import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as lark from '@larksuiteoapi/node-sdk';

/**
 * 飞书 SDK 服务
 * 封装 Access Token 管理和 Bitable API 调用
 */
@Injectable()
export class FeishuSdkService {
  private readonly logger = new Logger(FeishuSdkService.name);
  private client: lark.Client;

  constructor(private configService: ConfigService) {
    const appId = this.configService.get<string>('FEISHU_APP_ID');
    const appSecret = this.configService.get<string>('FEISHU_APP_SECRET');

    if (!appId || !appSecret) {
      this.logger.warn('⚠️ 飞书配置缺失，同步功能将不可用');
      return;
    }

    this.client = new lark.Client({
      appId,
      appSecret,
      disableTokenCache: false, // 启用 Token 缓存
    });

    this.logger.log('✅ 飞书 SDK 初始化成功');
  }

  /**
   * 获取 Lark Client 实例
   */
  getClient(): lark.Client | null {
    return this.client || null;
  }

  /**
   * 检查服务是否可用
   */
  isEnabled(): boolean {
    return !!this.client;
  }

  // ==================== Bitable 记录操作 ====================

  /**
   * 获取多维表格记录列表
   */
  async getBitableRecords(
    appToken: string,
    tableId: string,
    filter?: string,
  ): Promise<any[]> {
    if (!this.client) {
      this.logger.warn('飞书 SDK 未初始化，跳过查询');
      return [];
    }

    try {
      const response = await this.client.bitable.appTableRecord.list({
        path: { app_token: appToken, table_id: tableId },
        params: {
          page_size: 500,
          filter: filter || undefined,
        },
      });

      if (response.code !== 0) {
        this.logger.error(`获取记录失败: ${response.msg}`);
        return [];
      }

      return response.data?.items || [];
    } catch (error) {
      this.logger.error('获取 Bitable 记录异常:', error);
      return [];
    }
  }

  /**
   * 创建多维表格记录
   */
  async createBitableRecord(
    appToken: string,
    tableId: string,
    fields: Record<string, any>,
  ): Promise<string | null> {
    if (!this.client) {
      this.logger.warn('飞书 SDK 未初始化，跳过创建');
      return null;
    }

    try {
      const response = await this.client.bitable.appTableRecord.create({
        path: { app_token: appToken, table_id: tableId },
        data: { fields },
      });

      if (response.code !== 0) {
        this.logger.error(`创建记录失败: ${response.msg}`);
        return null;
      }

      const recordId = response.data?.record?.record_id;
      this.logger.log(`✅ 创建 Bitable 记录成功: ${recordId}`);
      return recordId || null;
    } catch (error) {
      this.logger.error('创建 Bitable 记录异常:', error);
      return null;
    }
  }

  /**
   * 更新多维表格记录
   */
  async updateBitableRecord(
    appToken: string,
    tableId: string,
    recordId: string,
    fields: Record<string, any>,
  ): Promise<boolean> {
    if (!this.client) {
      this.logger.warn('飞书 SDK 未初始化，跳过更新');
      return false;
    }

    try {
      const response = await this.client.bitable.appTableRecord.update({
        path: { app_token: appToken, table_id: tableId, record_id: recordId },
        data: { fields },
      });

      if (response.code !== 0) {
        this.logger.error(`更新记录失败: ${response.msg}`);
        return false;
      }

      this.logger.log(`✅ 更新 Bitable 记录成功: ${recordId}`);
      return true;
    } catch (error) {
      this.logger.error('更新 Bitable 记录异常:', error);
      return false;
    }
  }

  /**
   * 删除多维表格记录
   */
  async deleteBitableRecord(
    appToken: string,
    tableId: string,
    recordId: string,
  ): Promise<boolean> {
    if (!this.client) {
      this.logger.warn('飞书 SDK 未初始化，跳过删除');
      return false;
    }

    try {
      const response = await this.client.bitable.appTableRecord.delete({
        path: { app_token: appToken, table_id: tableId, record_id: recordId },
      });

      if (response.code !== 0) {
        this.logger.error(`删除记录失败: ${response.msg}`);
        return false;
      }

      this.logger.log(`✅ 删除 Bitable 记录成功: ${recordId}`);
      return true;
    } catch (error) {
      this.logger.error('删除 Bitable 记录异常:', error);
      return false;
    }
  }

  /**
   * 根据字段值查找记录
   */
  async findRecordByField(
    appToken: string,
    tableId: string,
    fieldName: string,
    fieldValue: string,
  ): Promise<{ id: string; record_id: string } | null> {
    const filter = `CurrentValue.[${fieldName}] = "${fieldValue}"`;
    const records = await this.getBitableRecords(appToken, tableId, filter);
    return records.length > 0 ? records[0] : null;
  }
}
