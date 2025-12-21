import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(
    configService: ConfigService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
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
    // JWT payload.sub 是用户的 UUID (user.id)，不是 feishuId
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

    this.logger.debug(`✅ 用户验证成功: ${user.name} (${user.id})`);

    return {
      id: user.id,
      userId: user.id,
      username: user.name,
      feishuId: user.feishuId,
      tenantId: user.tenantId,
      role: user.role,
    };
  }
}
