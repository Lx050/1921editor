import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tenant } from '../entities/tenant.entity';

@Injectable()
export class TenantConfigService {
  constructor(
    @InjectRepository(Tenant)
    private tenantRepository: Repository<Tenant>,
  ) {}

  /**
   * 从飞书表格URL自动提取配置
   * 支持的URL格式：
   * 1. https://xxx.feishu.cn/base/[app_token]?table=[table_id]
   * 2. https://xxx.feishu.cn/wiki/[wiki_id]?table=[table_id]
   */
  extractFeishuTableConfig(url: string): {
    appToken: string;
    tableId: string;
  } {
    try {
      const urlObj = new URL(url);

      // 提取 table_id（从查询参数）
      const tableId = urlObj.searchParams.get('table');
      if (!tableId) {
        throw new Error('URL中未找到table参数');
      }

      // 提取 app_token（从路径）
      let appToken: string | null = null;

      // 格式1: /base/[app_token]
      const baseMatch = urlObj.pathname.match(/\/base\/([^\/]+)/);
      if (baseMatch) {
        appToken = baseMatch[1];
      }

      // 格式2: /wiki/[wiki_id] (wiki_id可能就是app_token)
      const wikiMatch = urlObj.pathname.match(/\/wiki\/([^\/]+)/);
      if (wikiMatch) {
        appToken = wikiMatch[1];
      }

      if (!appToken) {
        throw new Error('URL中未找到app_token或wiki_id');
      }

      return { appToken, tableId };
    } catch (error) {
      throw new BadRequestException(`无效的飞书表格链接: ${error.message}`);
    }
  }

  /**
   * 租户自助配置人员管理表
   */
  async configureTenantUserTable(
    tenantId: string,
    tableUrl: string,
  ): Promise<Tenant> {
    // 1. 自动提取配置
    const { appToken, tableId } = this.extractFeishuTableConfig(tableUrl);

    // 2. 更新租户配置
    const tenant = await this.tenantRepository.findOne({
      where: { id: tenantId },
    });

    if (!tenant) {
      throw new BadRequestException('租户不存在');
    }

    // 3. 保存配置（使用settings字段存储）
    const settings = tenant.settings || {};
    settings.userTable = {
      appToken,
      tableId,
      configuredAt: new Date().toISOString(),
      tableUrl, // 保存原始URL便于查看
    };

    tenant.settings = settings;
    await this.tenantRepository.save(tenant);

    return tenant;
  }

  /**
   * 租户自助配置文章管理表（可选）
   */
  async configureTenantArticleTable(
    tenantId: string,
    tableUrl: string,
  ): Promise<Tenant> {
    const { appToken, tableId } = this.extractFeishuTableConfig(tableUrl);

    const tenant = await this.tenantRepository.findOne({
      where: { id: tenantId },
    });

    if (!tenant) {
      throw new BadRequestException('租户不存在');
    }

    const settings = tenant.settings || {};
    settings.articleTable = {
      appToken,
      tableId,
      configuredAt: new Date().toISOString(),
      tableUrl,
    };

    tenant.settings = settings;
    await this.tenantRepository.save(tenant);

    return tenant;
  }

  /**
   * 获取租户的表格配置
   */
  getTenantTableConfig(tenant: Tenant): {
    userTable?: { appToken: string; tableId: string; tableUrl?: string };
    articleTable?: { appToken: string; tableId: string; tableUrl?: string };
  } {
    const settings = tenant.settings || {};
    return {
      userTable: settings.userTable
        ? {
            appToken: settings.userTable.appToken,
            tableId: settings.userTable.tableId,
            tableUrl: settings.userTable.tableUrl, // 包含原始URL
          }
        : undefined,
      articleTable: settings.articleTable
        ? {
            appToken: settings.articleTable.appToken,
            tableId: settings.articleTable.tableId,
            tableUrl: settings.articleTable.tableUrl, // 包含原始URL
          }
        : undefined,
    };
  }

  /**
   * 获取租户信息
   */
  async getTenant(tenantId: string): Promise<Tenant | null> {
    return this.tenantRepository.findOne({ where: { id: tenantId } });
  }
}
