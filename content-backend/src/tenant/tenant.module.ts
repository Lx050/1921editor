import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tenant } from '../entities/tenant.entity';
import { User } from '../entities/user.entity';
import { UserTenant } from '../entities/user-tenant.entity';
import { WechatCredentialToken } from '../entities/wechat-credential-token.entity';
import { TenantService } from './tenant.service';
import { TenantMembershipService } from './tenant-membership.service';
import { TenantConfigService } from './tenant-config.service';
import { TenantConfigController } from './tenant-config.controller';
import { TenantController } from './tenant.controller';
import { InviteCodeService } from '../services/invite-code.service';
import { EmailService } from '../services/email.service';
import { TokenService } from '../services/token.service';
import { WechatCredentialsService } from './wechat-credentials.service';
import { CacheService } from '../cache/cache.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Tenant, User, UserTenant, WechatCredentialToken]),
  ],
  controllers: [TenantConfigController, TenantController],
  providers: [
    TenantService,
    TenantMembershipService,
    TenantConfigService,
    InviteCodeService,
    EmailService,
    TokenService,
    WechatCredentialsService,
    CacheService,
  ],
  exports: [
    TenantService,
    TenantMembershipService,
    TenantConfigService,
    InviteCodeService,
    WechatCredentialsService,
  ],
})
export class TenantModule {}
