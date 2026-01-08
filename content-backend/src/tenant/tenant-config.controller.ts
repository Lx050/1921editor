import { Controller, Get, Post, Body, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TenantConfigService } from './tenant-config.service';
import { ConfigService } from '@nestjs/config';

class ConfigureTableDto {
  tableUrl: string;
}

@ApiTags('tenant-config')
@Controller('tenant/config')
export class TenantConfigController {
  constructor(
    private tenantConfigService: TenantConfigService,
    private readonly configService: ConfigService,
  ) {}

  private getDefaultTenantId(): string {
    return (
      this.configService.get<string>('DEFAULT_TENANT_ID') ||
      '00000000-0000-0000-0000-000000000001'
    );
  }

  /**
   * 租户自助配置人员管理表
   *
   * 使用方式：
   * 1. 管理员登录
   * 2. 在飞书创建人员管理表格
   * 3. 复制表格URL
   * 4. 调用此接口，粘贴URL
   * 5. 系统自动提取配置
   */
  @Post('user-table')
  @ApiOperation({
    summary: '配置人员管理表',
    description: '租户管理员粘贴飞书表格链接，系统自动提取配置',
  })
  @ApiResponse({
    status: 200,
    description: '配置成功',
    schema: {
      example: {
        success: true,
        message: '人员管理表配置成功',
        config: {
          appToken: 'Gcnnw2yujiqmxXkv5mTc8cftnMc',
          tableId: 'tblO6V58nUVEQX5U',
        },
      },
    },
  })
  async configureUserTable(@Request() req, @Body() dto: ConfigureTableDto) {
    const tenantId = req.user?.tenantId || this.getDefaultTenantId();

    const tenant = await this.tenantConfigService.configureTenantUserTable(
      tenantId,
      dto.tableUrl,
    );

    const config = this.tenantConfigService.getTenantTableConfig(tenant);

    return {
      success: true,
      message: '人员管理表配置成功',
      config: config.userTable,
    };
  }

  /**
   * 租户自助配置文章管理表（可选）
   */
  @Post('article-table')
  @ApiOperation({ summary: '配置文章管理表（可选）' })
  async configureArticleTable(@Request() req, @Body() dto: ConfigureTableDto) {
    const tenantId = req.user?.tenantId || this.getDefaultTenantId();

    const tenant = await this.tenantConfigService.configureTenantArticleTable(
      tenantId,
      dto.tableUrl,
    );

    const config = this.tenantConfigService.getTenantTableConfig(tenant);

    return {
      success: true,
      message: '文章管理表配置成功',
      config: config.articleTable,
    };
  }

  /**
   * 获取当前租户的配置
   */
  @Get()
  @ApiOperation({ summary: '获取租户配置' })
  async getTenantConfig(@Request() req) {
    const tenantId = req.user?.tenantId || this.getDefaultTenantId();

    const tenant = await this.tenantConfigService.getTenant(tenantId);

    if (!tenant) {
      throw new Error(`Tenant not found: ${tenantId}`);
    }

    const config = this.tenantConfigService.getTenantTableConfig(tenant);

    return {
      success: true,
      config: {
        userTable: config.userTable,
        articleTable: config.articleTable,
        tenantName: tenant.name,
        tenantSlug: tenant.slug,
      },
    };
  }
}
