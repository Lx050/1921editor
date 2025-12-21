import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../entities/user.entity';
import { FeishuService } from '../feishu/feishu.service';
import { TenantService } from '../tenant/tenant.service';
import { FeishuTableSyncService } from '../sync/feishu-table-sync.service';
import * as Lark from '@larksuiteoapi/node-sdk';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private feishuService: FeishuService,
    private tenantService: TenantService,
    private feishuTableSyncService: FeishuTableSyncService,
  ) { }

  /**
   * 多租户飞书登录
   * @param code 飞书授权码
   * @param tenantSlug 租户标识符（从前端URL参数获取）
   */
  async feishuLogin(code: string, tenantSlug?: string) {
    try {
      this.logger.log('========== 飞书登录开始 ==========');
      this.logger.log(`Authorization Code: ${code?.substring(0, 10)}...`);
      this.logger.log(`Tenant Slug: ${tenantSlug || 'default'}`);

      // 1. 确定租户
      let tenant;
      if (tenantSlug) {
        this.logger.log(`尝试查找租户: ${tenantSlug}`);
        tenant = await this.tenantService.findBySlug(tenantSlug);
      } else {
        this.logger.log('使用默认租户');
        tenant = await this.tenantService.findById(
          '00000000-0000-0000-0000-000000000001',
        );
      }
      this.logger.log(`租户已找到: ${tenant.name} (ID: ${tenant.id})`);

      let client: Lark.Client;
      const tenantId = tenant.id;

      if (tenant.feishuAppId && tenant.feishuAppSecret) {
        // 使用租户专属的飞书配置
        this.logger.log(`使用租户专属飞书配置: ${tenant.name}`);
        this.logger.log(`Tenant AppID: ${tenant.feishuAppId}`);
        client = new Lark.Client({
          appId: tenant.feishuAppId,
          appSecret: tenant.feishuAppSecret,
          appType: Lark.AppType.SelfBuild,
          domain: Lark.Domain.Feishu,
          loggerLevel: Lark.LoggerLevel.debug, // 启用SDK调试日志
        });
      } else {
        // 使用全局飞书配置（向后兼容）
        this.logger.log('租户未配置飞书凭证，使用全局配置');
        client = this.feishuService.getClient();
      }

      // 2. Get User Access Token - 使用标准飞书身份验证（非OIDC）
      this.logger.log('步骤 2: 用 authorization code 换取 access_token...');
      const tokenRes = await client.request({
        method: 'POST',
        url: '/open-apis/authen/v1/access_token', // 使用标准端点而不是OIDC
        data: {
          grant_type: 'authorization_code',
          code: code,
        },
      });

      this.logger.log(`Token API 响应码: ${tokenRes.code}`);
      this.logger.log(`Token API 响应消息: ${tokenRes.msg || 'success'}`);

      if (tokenRes.code !== 0 || !tokenRes.data) {
        this.logger.error('❌ 获取 Access Token 失败');
        this.logger.error(`错误码: ${tokenRes.code}`);
        this.logger.error(`错误消息: ${tokenRes.msg}`);
        this.logger.error(`完整响应: ${JSON.stringify(tokenRes)}`);
        throw new UnauthorizedException(
          `Failed to get access token: ${tokenRes.msg}`,
        );
      }

      const { access_token, name, open_id, avatar_url, email } = tokenRes.data;
      this.logger.log(
        `✅ Access Token 获取成功: ${access_token.substring(0, 15)}...`,
      );
      this.logger.log(`完整Token响应: ${JSON.stringify(tokenRes.data)}`);

      // 飞书标准身份验证已在步骤2返回用户信息，无需步骤3
      this.logger.log('✅ 用户信息已在Token响应中');

      const feishuUser = {
        name: name,
        open_id: open_id,
        avatar_url: avatar_url,
        email: email,
      };

      this.logger.log(`用户名称: ${feishuUser.name}`);
      this.logger.log(`用户 OpenID: ${feishuUser.open_id}`);

      if (!feishuUser.open_id) {
        this.logger.error('❌ 用户信息缺少 OpenID');
        throw new UnauthorizedException('Feishu User Missing OpenID');
      }

      // 4. 🔒 白名单检查：查找用户是否在该租户的白名单中
      this.logger.log('步骤 4: 检查用户白名单...');
      this.logger.log(
        `查找用户 - TenantID: ${tenantId}, FeishuID: ${feishuUser.open_id}`,
      );

      let user = await this.userRepository.findOne({
        where: {
          tenantId: tenantId,
          feishuId: feishuUser.open_id,
        },
        relations: ['tenant'],
      });

      if (!user) {
        // ✨ 自动注册：用户通过了飞书验证，自动加入该租户
        this.logger.log(`🆕 新用户首次登录，自动注册: ${feishuUser.name}`);

        user = this.userRepository.create({
          tenantId: tenantId,
          feishuId: feishuUser.open_id,
          name: feishuUser.name || 'Unknown',
          email: feishuUser.email || '',
          role: UserRole.EDITOR, // 默认角色
          isActive: true,
          lastLoginAt: new Date(),
        });

        await this.userRepository.save(user);
        this.logger.log(`✅ 用户已创建: ${user.name} (ID: ${user.id})`);

        // 重新查询以确保包含关联关系
        user = await this.userRepository.findOne({
          where: { id: user.id },
          relations: ['tenant']
        });

        if (!user) {
          throw new Error('Failed to create user');
        }
      } else {
        // ✅ 用户存在，检查状态
        if (!user.isActive) {
          this.logger.warn(`❌ 用户 ${user.name} 已被禁用，拒绝登录`);
          throw new UnauthorizedException('该账号已被禁用或已离职');
        }

        this.logger.log(`✅ 用户回归: ${user.name} (${user.role})`);
        user.name = feishuUser.name || user.name;
        user.lastLoginAt = new Date(); // 更新最后登录时间
        await this.userRepository.save(user);
      }

      this.logger.log(
        `用户 ${user.name} 登录到租户 ${user.tenant?.name || 'Default'}`,
      );

      // 🔄 同步用户信息到飞书表格
      this.logger.log('步骤 4.5: 同步用户到飞书表格...');
      try {
        const tenantForSync = user.tenant || tenant;
        await this.feishuTableSyncService.syncUserToFeishuTable(user, tenantForSync);
        this.logger.log('✅ 用户信息已同步到飞书表格');
      } catch (syncError) {
        // 同步失败不影响登录
        this.logger.warn(`⚠️ 同步到飞书表格失败: ${syncError.message}`);
      }

      // 5. Issue JWT
      this.logger.log('步骤 5: 签发 JWT Token...');
      const authResult = this.login(user);
      this.logger.log('✅ JWT Token 签发成功');
      this.logger.log('========== 飞书登录完成 ==========');

      return authResult;
    } catch (e) {
      this.logger.error('========== 飞书登录失败 ==========');
      this.logger.error(`错误类型: ${e.constructor.name}`);
      this.logger.error(`错误消息: ${e.message}`);
      if (e.stack) {
        this.logger.error(`堆栈跟踪: ${e.stack}`);
      }

      if (e instanceof UnauthorizedException) {
        throw e;
      }
      throw new UnauthorizedException('Feishu Login Failed: ' + e.message);
    }
  }

  async login(user: User) {
    const payload = {
      username: user.name,
      sub: user.id,
      feishuId: user.feishuId,
      tenantId: user.tenantId, // 🔑 关键：JWT中包含租户ID
      role: user.role,
    };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
        tenantId: user.tenantId,
      },
    };
  }
}
