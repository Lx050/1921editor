import {
  Controller,
  Get,
  Param,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { TenantService } from './tenant.service';

@ApiTags('Tenants')
@Controller('tenants')
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}

  @Get()
  @ApiOperation({ summary: '获取所有租户' })
  async findAll() {
    const tenants = await this.tenantService.findAll();
    return tenants.map((t) => ({
      id: t.id,
      name: t.name,
      slug: t.slug,
    }));
  }

  @Get(':id/wechat-config')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: '获取租户微信配置' })
  async getWechatConfig(@Param('id') id: string) {
    const tenant = await this.tenantService.findById(id);
    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }
    return {
      appId: tenant.wechatAppId,
      appSecret: tenant.wechatAppSecret,
    };
  }
}
