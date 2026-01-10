import {
  Controller,
  Get,
  Param,
  UseGuards,
  NotFoundException,
  Post,
  Body,
  Request,
  ForbiddenException,
  Query,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiOperation,
  ApiTags,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { TenantService } from './tenant.service';
import { InviteCodeService } from '../services/invite-code.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateInviteCodeDto } from './dto/update-invite-code.dto';
import { WechatCredentialsService } from './wechat-credentials.service';
import { RequestWechatCredentialsDto } from './dto/request-wechat-credentials.dto';
import { ConfirmWechatCredentialsDto } from './dto/confirm-wechat-credentials.dto';

@ApiTags('Tenants')
@Controller('tenants')
export class TenantController {
  constructor(
    private readonly tenantService: TenantService,
    private readonly configService: ConfigService,
    private readonly inviteCodeService: InviteCodeService,
    private readonly wechatCredentialsService: WechatCredentialsService,
  ) {}

  private async resolveDefaultTenant() {
    const defaultTenantId =
      this.configService.get<string>('DEFAULT_TENANT_ID') ||
      '00000000-0000-0000-0000-000000000001';

    try {
      return await this.tenantService.findById(defaultTenantId);
    } catch (error) {
      return await this.tenantService.findBySlug('default');
    }
  }

  private maskSecret(secret?: string | null) {
    if (!secret) return '';
    if (secret.length <= 4) {
      return '****';
    }
    return `****${secret.slice(-4)}`;
  }

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
  async getWechatConfig(@Param('id') id: string, @Request() req) {
    if (req.user?.role !== 'ADMIN' && req.user?.tenantId !== id) {
      throw new ForbiddenException('无权查看该租户配置');
    }
    const tenant = await this.tenantService.findById(id);
    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }
    const appSecretMasked = this.maskSecret(tenant.wechatAppSecret);
    return {
      appId: tenant.wechatAppId,
      appSecretMasked,
      hasSecret: !!tenant.wechatAppSecret,
    };
  }

  @Get('public-wechat-config')
  @ApiOperation({ summary: '获取公开的微信配置' })
  @ApiResponse({ status: 200, description: '返回默认租户微信配置' })
  async getPublicWechatConfig(@Query('slug') slug?: string) {
    const allowPublic = this.configService.get<string>(
      'ALLOW_PUBLIC_WECHAT_CONFIG',
    );
    if (allowPublic !== 'true') {
      throw new ForbiddenException('Public WeChat config is disabled');
    }

    const tenant = slug
      ? await this.tenantService.findBySlug(slug)
      : await this.resolveDefaultTenant();

    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    return {
      appId: tenant.wechatAppId,
      appSecretMasked: this.maskSecret(tenant.wechatAppSecret),
      hasSecret: !!tenant.wechatAppSecret,
      tenant: {
        id: tenant.id,
        name: tenant.name,
        slug: tenant.slug,
      },
    };
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: '创建新租户（管理员）' })
  @ApiResponse({ status: 201, description: '创建成功' })
  async createTenant(@Body() dto: CreateTenantDto, @Request() req) {
    if (req.user?.role !== 'ADMIN') {
      throw new ForbiddenException('Only admin can create tenants');
    }

    const inviteCode = dto.inviteCode?.trim() || this.inviteCodeService.generate();
    const inviteCodeExpires = dto.inviteCodeExpires
      ? new Date(dto.inviteCodeExpires)
      : null;

    const wechatAppId = dto.wechatAppId?.trim() || undefined;
    const wechatAppSecret = dto.wechatAppSecret?.trim() || undefined;

    const tenant = await this.tenantService.create({
      name: dto.name.trim(),
      slug: dto.slug.trim(),
      inviteCode,
      inviteCodeExpires,
      wechatAppId,
      wechatAppSecret,
      isActive: true,
    });

    return {
      id: tenant.id,
      name: tenant.name,
      slug: tenant.slug,
      inviteCode: tenant.inviteCode,
      inviteCodeExpires: tenant.inviteCodeExpires,
    };
  }

  @Post(':id/invite-code')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: '更新租户邀请码（管理员）' })
  @ApiResponse({ status: 200, description: '更新成功' })
  async updateInviteCode(
    @Param('id') id: string,
    @Body() dto: UpdateInviteCodeDto,
    @Request() req,
  ) {
    if (req.user?.role !== 'ADMIN') {
      throw new ForbiddenException('Only admin can update invite code');
    }

    if (req.user?.tenantId !== id) {
      throw new ForbiddenException('无权修改该组织邀请码');
    }

    const inviteCode = dto.inviteCode?.trim();
    if (!inviteCode) {
      throw new BadRequestException('邀请码不能为空');
    }

    if (inviteCode.length > 64) {
      throw new BadRequestException('邀请码长度不能超过64位');
    }

    const existing = await this.tenantService.findByInviteCode(inviteCode);
    if (existing && existing.id !== id) {
      throw new ConflictException('邀请码已被占用');
    }

    const tenant = await this.tenantService.update(id, { inviteCode });
    return {
      inviteCode: tenant.inviteCode,
      inviteCodeExpires: tenant.inviteCodeExpires,
    };
  }

  @Post('wechat-credentials/request')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: '请求修改公众号密钥' })
  @ApiResponse({ status: 200, description: '确认邮件已发送' })
  async requestWechatCredentials(
    @Body() dto: RequestWechatCredentialsDto,
    @Request() req,
  ) {
    return this.wechatCredentialsService.requestChange(
      req.user.sub,
      req.user.tenantId,
      dto,
    );
  }

  @Post('wechat-credentials/confirm')
  @ApiOperation({ summary: '确认修改公众号密钥' })
  @ApiResponse({ status: 200, description: '密钥已更新' })
  async confirmWechatCredentials(@Body() dto: ConfirmWechatCredentialsDto) {
    return this.wechatCredentialsService.confirmChange(dto.token);
  }
}
