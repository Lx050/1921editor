import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from '../entities/user.entity';
import { Tenant } from '../entities/tenant.entity';
import * as Lark from '@larksuiteoapi/node-sdk';

/**
 * 飞书多维表格同步服务
 * 负责将数据库中的用户信息同步到飞书多维表格
 */
@Injectable()
export class FeishuTableSyncService {
  private readonly logger = new Logger(FeishuTableSyncService.name);

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Tenant)
    private tenantRepository: Repository<Tenant>,
    private configService: ConfigService,
  ) {}

  /**
   * 将用户信息同步到飞书多维表格
   * @param user 用户实体
   * @param tenant 租户实体
   */
  async syncUserToFeishuTable(user: User, tenant: Tenant): Promise<void> {
    try {
      // 1. 检查租户是否配置了用户表
      const settings = tenant.settings || {};
      if (!settings.userTable) {
        this.logger.warn(`租户 ${tenant.name} 未配置用户管理表，跳过同步`);
        return;
      }

      const { appToken, tableId } = settings.userTable;

      // 2. 获取飞书凭证（优先使用租户配置，否则使用全局配置）
      const feishuAppId =
        tenant.feishuAppId || this.configService.get<string>('FEISHU_APP_ID');
      const feishuAppSecret =
        tenant.feishuAppSecret ||
        this.configService.get<string>('FEISHU_APP_SECRET');

      if (!feishuAppId || !feishuAppSecret) {
        this.logger.warn(
          `租户 ${tenant.name} 未配置飞书凭证且无全局配置，跳过同步`,
        );
        return;
      }

      this.logger.log(`使用飞书凭证: ${feishuAppId.substring(0, 10)}...`);

      const client = new Lark.Client({
        appId: feishuAppId,
        appSecret: feishuAppSecret,
        appType: Lark.AppType.SelfBuild,
        domain: Lark.Domain.Feishu,
      });

      // 3. 查询表格中是否已存在该用户
      const searchRes = await client.bitable.appTableRecord.search({
        path: {
          app_token: appToken,
          table_id: tableId,
        },
        data: {
          filter: {
            conjunction: 'and',
            conditions: [
              {
                field_name: 'FeishuID',
                operator: 'is',
                value: [user.feishuId],
              },
            ],
          },
        },
      });

      if (searchRes.code !== 0) {
        this.logger.error(`查询飞书表格失败: ${searchRes.msg}`);
        return;
      }

      const existingRecords = searchRes.data?.items || [];

      // 4. 准备记录数据
      const recordData: any = {
        fields: {
          姓名: user.name,
          岗位: user.role.toString(),
          FeishuID: user.feishuId,
          Email: user.email || '',
          最后登录时间: user.lastLoginAt ? user.lastLoginAt.getTime() : null,
          状态: user.isActive ? '激活' : '禁用',
        },
      };

      if (existingRecords.length > 0) {
        // 更新现有记录
        const recordId = existingRecords[0].record_id;
        if (!recordId) {
          this.logger.warn(`记录ID为空，跳过更新`);
          return;
        }

        this.logger.log(`更新飞书表格记录: ${user.name} (${recordId})`);

        await client.bitable.appTableRecord.update({
          path: {
            app_token: appToken,
            table_id: tableId,
            record_id: recordId,
          },
          data: recordData,
        });
      } else {
        // 创建新记录
        this.logger.log(`创建飞书表格记录: ${user.name}`);

        await client.bitable.appTableRecord.create({
          path: {
            app_token: appToken,
            table_id: tableId,
          },
          data: recordData,
        });
      }

      this.logger.log(`✅ 用户 ${user.name} 已同步到飞书表格`);
    } catch (error) {
      this.logger.error(
        `同步用户到飞书表格失败: ${error.message}`,
        error.stack,
      );
    }
  }

  /**
   * 批量同步租户下的所有用户到飞书表格
   * @param tenantId 租户ID
   */
  async syncAllUsersToFeishuTable(tenantId: string): Promise<void> {
    this.logger.log(`开始同步租户 ${tenantId} 的所有用户到飞书表格...`);

    const tenant = await this.tenantRepository.findOne({
      where: { id: tenantId },
    });

    if (!tenant) {
      throw new Error(`租户不存在: ${tenantId}`);
    }

    const users = await this.userRepository.find({
      where: { tenantId },
    });

    this.logger.log(`找到 ${users.length} 个用户`);

    for (const user of users) {
      await this.syncUserToFeishuTable(user, tenant);
    }

    this.logger.log(`✅ 批量同步完成`);
  }

  /**
   * 从飞书表格读取用户列表（只读，用于展示）
   * @param tenantId 租户ID
   */
  async readUsersFromFeishuTable(tenantId: string): Promise<any[]> {
    const tenant = await this.tenantRepository.findOne({
      where: { id: tenantId },
    });

    if (!tenant) {
      throw new Error(`租户不存在: ${tenantId}`);
    }

    const settings = tenant.settings || {};
    if (!settings.userTable) {
      return [];
    }

    const { appToken, tableId } = settings.userTable;

    if (!tenant.feishuAppId || !tenant.feishuAppSecret) {
      return [];
    }

    const client = new Lark.Client({
      appId: tenant.feishuAppId,
      appSecret: tenant.feishuAppSecret,
      appType: Lark.AppType.SelfBuild,
      domain: Lark.Domain.Feishu,
    });

    const listRes = await client.bitable.appTableRecord.list({
      path: {
        app_token: appToken,
        table_id: tableId,
      },
      params: {
        page_size: 100,
      },
    });

    if (listRes.code !== 0) {
      this.logger.error(`读取飞书表格失败: ${listRes.msg}`);
      return [];
    }

    return listRes.data?.items || [];
  }
}
