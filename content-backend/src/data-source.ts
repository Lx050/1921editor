import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { User } from './entities/user.entity';
import { Article } from './entities/article.entity';
import { Tenant } from './entities/tenant.entity';
import { UserTenant } from './entities/user-tenant.entity';
import { WechatCredentialToken } from './entities/wechat-credential-token.entity';
import { EmailVerificationToken } from './entities/email-verification-token.entity';
import { PasswordResetToken } from './entities/password-reset-token.entity';
import * as path from 'path';

// 加载环境变量
config();

// 创建配置服务实例
const configService = new ConfigService();

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL || configService.get<string>('DATABASE_URL'),
  synchronize: false, // 必须关闭
  logging: process.env.NODE_ENV === 'development',
  entities: [
    User,
    Article,
    Tenant,
    UserTenant,
    WechatCredentialToken,
    EmailVerificationToken,
    PasswordResetToken,
  ],
  migrations: [path.join(__dirname, 'migrations/*{.ts,.js}')],
  subscribers: [path.join(__dirname, 'subscribers/*{.ts,.js}')],
});
