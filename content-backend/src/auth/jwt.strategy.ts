import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { UserTenant } from '../entities/user-tenant.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(
    private configService: ConfigService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(UserTenant)
    private userTenantRepository: Repository<UserTenant>,
  ) {
    const secret = configService.get<string>('JWT_SECRET');
    if (!secret) {
      throw new Error(
        'JWT_SECRET environment variable is required for JwtStrategy',
      );
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
      algorithms: ['HS256'], // 明确指定接受的算法，防止算法混淆攻击
    });
  }

  async validate(payload: any) {
    // JWT payload.sub 是用户的 UUID (user.id)
    const userId = payload.sub;

    this.logger.debug(`🔐 JWT验证 - 解析的userId: ${userId}`);
    this.logger.debug(`🔐 JWT payload: ${JSON.stringify(payload)}`);

    if (!userId) {
      this.logger.warn('⚠️ JWT payload 缺少 sub 字段');
      throw new UnauthorizedException('Invalid JWT: missing user id');
    }

    // 使用 user.id (UUID) 查询用户
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      this.logger.warn(`⚠️ 用户不存在: userId=${userId}`);
      throw new UnauthorizedException('User not found in database');
    }

    if (!user.isActive) {
      this.logger.warn(`⚠️ 账号已禁用: userId=${userId}`);
      throw new UnauthorizedException('User is inactive');
    }

    const tenantId =
      payload.tenantId ||
      user.tenantId ||
      this.configService.get<string>('DEFAULT_TENANT_ID') ||
      '00000000-0000-0000-0000-000000000001';

    const membership = await this.userTenantRepository.findOne({
      where: { userId: user.id, tenantId },
    });

    if (!membership) {
      this.logger.warn(
        `⚠️ 用户不属于租户: userId=${userId}, tenantId=${tenantId}`,
      );
      throw new UnauthorizedException('User not in tenant');
    }

    this.logger.debug(`✅ 用户验证成功: ${user.name} (${user.id})`);

    return {
      sub: user.id,
      id: user.id,
      email: user.email,
      tenantId,
      role: user.role,
    };
  }
}
