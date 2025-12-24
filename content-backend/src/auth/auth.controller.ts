import { Controller, Get, Query, Res } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiExcludeController,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { TenantService } from '../tenant/tenant.service';
import type { Response } from 'express';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly tenantService: TenantService,
  ) {}

  /**
   * 飞书登录入口
   * @param tenant 租户slug（可选），如：/auth/feishu/login?tenant=medical-corp
   */
  @Get('feishu/login')
  @ApiOperation({ summary: '飞书登录入口' })
  @ApiQuery({ name: 'tenant', required: false, description: '租户标识' })
  async login(@Query('tenant') tenantSlug: string, @Res() res: Response) {
    if (process.env.NODE_ENV === 'development') {
      console.log('Login endpoint hit, tenant:', tenantSlug);
    }

    let appId: string;
    let redirectUri: string;

    if (tenantSlug) {
      // 使用租户专属配置
      try {
        const tenant = await this.tenantService.findBySlug(tenantSlug);
        if (!tenant.feishuAppId) {
          return res.status(500).send('Tenant Feishu config not found');
        }
        appId = tenant.feishuAppId;

        // 回调URI需要包含租户标识
        const baseRedirectUri =
          this.configService.get<string>('FEISHU_REDIRECT_URI') ||
          'http://localhost:3001/api/auth/feishu/callback';
        redirectUri = encodeURIComponent(
          `${baseRedirectUri}?tenant=${tenantSlug}`,
        );
      } catch (e) {
        return res.status(404).send('Tenant not found');
      }
    } else {
      // 使用全局配置（向后兼容）
      appId = this.configService.get<string>('FEISHU_APP_ID') || '';
      redirectUri = encodeURIComponent(
        this.configService.get<string>('FEISHU_REDIRECT_URI') ||
          'http://localhost:3001/api/auth/feishu/callback',
      );
    }

    if (!appId) {
      console.error('AppID is missing!');
      return res.status(500).send('Feishu AppID not configured');
    }

    const url = `https://open.feishu.cn/open-apis/authen/v1/index?app_id=${appId}&redirect_uri=${redirectUri}`;
    res.redirect(url);
  }

  /**
   * 飞书登录回调
   * @param code 飞书授权码
   * @param tenant 租户slug（从URL参数获取）
   */
  @Get('feishu/callback')
  @ApiOperation({ summary: '飞书登录回调' })
  @ApiQuery({ name: 'code', required: true, description: '飞书授权码' })
  @ApiQuery({ name: 'tenant', required: false, description: '租户标识' })
  async callback(
    @Query('code') code: string,
    @Query('tenant') tenantSlug: string,
    @Res() res: Response,
  ) {
    if (process.env.NODE_ENV === 'development') {
      console.log('========== 飞书回调接收 ==========');
      console.log('Authorization Code:', code?.substring(0, 10) + '...');
      console.log('Tenant Slug:', tenantSlug || 'default');
    }

    try {
      const data = await this.authService.feishuLogin(code, tenantSlug);

      if (process.env.NODE_ENV === 'development') {
        console.log('✅ AuthService 返回成功');
        console.log('User:', data.user.name);
      }

      // Redirect to frontend with token
      const frontendUrl =
        this.configService.get<string>('FRONTEND_URL') ||
        'http://localhost:1921';

      const callbackUrl = tenantSlug
        ? `${frontendUrl}/auth/callback?token=${data.access_token}&userInfo=${encodeURIComponent(JSON.stringify(data.user))}&tenant=${tenantSlug}`
        : `${frontendUrl}/auth/callback?token=${data.access_token}&userInfo=${encodeURIComponent(JSON.stringify(data.user))}`;

      if (process.env.NODE_ENV === 'development') {
        console.log('重定向到前端:', callbackUrl.substring(0, 80) + '...');
        console.log('========== 飞书回调处理完成 ==========');
      }

      res.redirect(callbackUrl);
    } catch (e: any) {
      if (process.env.NODE_ENV === 'development') {
        console.error('========== 飞书回调处理失败 ==========');
        console.error('错误类型:', e.constructor.name);
        console.error('错误消息:', e.message);
      }

      const frontendUrl =
        this.configService.get<string>('FRONTEND_URL') ||
        'http://localhost:1921';

      const errorUrl = `${frontendUrl}/?error=${encodeURIComponent(e.message)}`;

      if (process.env.NODE_ENV === 'development') {
        console.error('重定向到错误页面:', errorUrl);
      }

      res.redirect(errorUrl);
    }
  }
}
