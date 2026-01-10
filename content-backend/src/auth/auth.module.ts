import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Tenant } from '../entities/tenant.entity';
import { UserTenant } from '../entities/user-tenant.entity';
import { EmailVerificationToken } from '../entities/email-verification-token.entity';
import { PasswordResetToken } from '../entities/password-reset-token.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './auth.controller';
import { PasswordHashService } from '../services/password-hash.service';
import { EmailService } from '../services/email.service';
import { TokenService } from '../services/token.service';
import { InviteCodeService } from '../services/invite-code.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Tenant,
      UserTenant,
      EmailVerificationToken,
      PasswordResetToken,
    ]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const secret = configService.get<string>('JWT_SECRET');
        if (!secret) {
          throw new Error('JWT_SECRET environment variable is required');
        }
        if (secret.length < 64) {
          throw new Error('JWT_SECRET must be at least 64 characters long');
        }
        return {
          secret,
          signOptions: { expiresIn: '7d' },
          algorithm: 'HS256',
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    PasswordHashService,
    EmailService,
    TokenService,
    InviteCodeService,
  ],
  exports: [
    AuthService,
    PasswordHashService,
    EmailService,
    TokenService,
    InviteCodeService,
  ],
})
export class AuthModule {}
