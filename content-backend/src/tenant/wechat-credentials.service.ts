import {
  Injectable,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tenant } from '../entities/tenant.entity';
import { User, UserRole } from '../entities/user.entity';
import { WechatCredentialToken } from '../entities/wechat-credential-token.entity';
import { EmailService } from '../services/email.service';
import { TokenService } from '../services/token.service';

interface WechatCredentialRequest {
  appId: string;
  appSecret: string;
}

@Injectable()
export class WechatCredentialsService {
  constructor(
    @InjectRepository(Tenant)
    private tenantRepository: Repository<Tenant>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(WechatCredentialToken)
    private tokenRepository: Repository<WechatCredentialToken>,
    private emailService: EmailService,
    private tokenService: TokenService,
  ) {}

  private getFrontendUrl(): string {
    return process.env.FRONTEND_URL || 'http://localhost:3000';
  }

  private maskSecret(secret?: string | null): string {
    if (!secret) return '';
    if (secret.length <= 6) return '******';
    return `****${secret.slice(-4)}`;
  }

  async requestChange(
    userId: string,
    tenantId: string,
    payload: WechatCredentialRequest,
  ) {
    if (!payload.appId || !payload.appSecret) {
      throw new BadRequestException('appId 和 appSecret 为必填项');
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    if (user.role !== UserRole.ADMIN || user.tenantId !== tenantId) {
      throw new ForbiddenException('只有该租户管理员可以修改公众号密钥');
    }

    const tenant = await this.tenantRepository.findOne({
      where: { id: tenantId },
    });
    if (!tenant) {
      throw new NotFoundException('租户不存在');
    }

    const token = this.tokenService.generateWechatCredentialToken();
    const expiresAt = this.tokenService.calculateExpiry(
      this.tokenService.WECHAT_CREDENTIAL_CHANGE_EXPIRY,
    );

    const record = this.tokenRepository.create({
      token,
      tenantId,
      userId,
      appId: payload.appId.trim(),
      appSecret: payload.appSecret.trim(),
      expiresAt,
      used: false,
    });

    await this.tokenRepository.save(record);

    const confirmUrl = `${this.getFrontendUrl()}/settings/wechat/confirm?token=${token}`;
    await this.emailService.sendWechatCredentialChangeEmail(
      user.email,
      user.name,
      tenant.name,
      confirmUrl,
    );

    return {
      message: '确认邮件已发送，请前往邮箱完成验证',
      appId: payload.appId.trim(),
      appSecretMasked: this.maskSecret(payload.appSecret),
      expiresAt,
    };
  }

  async confirmChange(token: string) {
    if (!token) {
      throw new BadRequestException('token is required');
    }

    const record = await this.tokenRepository.findOne({ where: { token } });
    if (!record) {
      throw new NotFoundException('无效的确认令牌');
    }

    if (record.used) {
      throw new BadRequestException('该确认链接已使用');
    }

    if (this.tokenService.isExpired(record.expiresAt)) {
      throw new BadRequestException('确认链接已过期');
    }

    const tenant = await this.tenantRepository.findOne({
      where: { id: record.tenantId },
    });
    if (!tenant) {
      throw new NotFoundException('租户不存在');
    }

    tenant.wechatAppId = record.appId;
    tenant.wechatAppSecret = record.appSecret;
    await this.tenantRepository.save(tenant);

    record.used = true;
    await this.tokenRepository.save(record);

    return {
      message: '公众号密钥已更新',
      tenantId: tenant.id,
      appId: tenant.wechatAppId,
      appSecretMasked: this.maskSecret(tenant.wechatAppSecret),
    };
  }
}
