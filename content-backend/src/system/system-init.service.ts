import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tenant } from '../entities/tenant.entity';
import { User, UserRole } from '../entities/user.entity';
import { PasswordHashService } from '../services/password-hash.service';
import { InviteCodeService } from '../services/invite-code.service';
import { ConfigService } from '@nestjs/config';

/**
 * 系统初始化 DTO
 */
export interface SystemInitDto {
  adminEmail: string;
  adminPassword: string;
  adminName: string;
  tenantName: string;
  tenantSlug: string;
}

/**
 * 系统初始化服务
 * 用于首次部署时创建默认租户和管理员账户
 */
@Injectable()
export class SystemInitService {
  private readonly logger = new Logger(SystemInitService.name);

  constructor(
    @InjectRepository(Tenant)
    private tenantRepository: Repository<Tenant>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private passwordHashService: PasswordHashService,
    private inviteCodeService: InviteCodeService,
    private configService: ConfigService,
  ) {}

  /**
   * 检查系统是否已初始化
   */
  async isInitialized(): Promise<boolean> {
    const count = await this.tenantRepository.count();
    return count > 0;
  }

  /**
   * 初始化系统
   * @param initDto 初始化数据
   */
  async initialize(initDto: SystemInitDto) {
    this.logger.log('========== 系统初始化开始 ==========');

    // 1. 检查是否已初始化
    const initialized = await this.isInitialized();
    if (initialized) {
      throw new BadRequestException('系统已经初始化过了');
    }

    const { adminEmail, adminPassword, adminName, tenantName, tenantSlug } =
      initDto;

    // 2. 验证密码强度
    if (!this.passwordHashService.validateStrength(adminPassword)) {
      throw new BadRequestException(
        '密码强度不足：至少8位，必须包含大小写字母和数字',
      );
    }

    // 3. 创建租户
    const inviteCode = this.inviteCodeService.generate();
    this.logger.log(`生成邀请码: ${inviteCode}`);

    const tenant = this.tenantRepository.create({
      name: tenantName,
      slug: tenantSlug,
      inviteCode,
      inviteCodeExpires: null, // 永久有效
      isActive: true,
      settings: {},
    });
    await this.tenantRepository.save(tenant);

    this.logger.log(`租户创建成功: ${tenantName} (${tenantSlug})`);

    // 4. 创建管理员账户
    const hashedPassword = await this.passwordHashService.hash(adminPassword);

    const admin = this.userRepository.create({
      tenantId: tenant.id,
      email: adminEmail,
      password: hashedPassword,
      name: adminName,
      role: UserRole.ADMIN,
      emailVerified: true, // 管理员默认已验证
      isActive: true,
      lastLoginAt: new Date(),
    });
    await this.userRepository.save(admin);

    this.logger.log(`管理员账户创建成功: ${adminEmail}`);

    this.logger.log('========== 系统初始化完成 ==========');

    return {
      message: '系统初始化成功',
      tenant: {
        id: tenant.id,
        name: tenant.name,
        slug: tenant.slug,
        inviteCode: tenant.inviteCode,
      },
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    };
  }

  /**
   * 使用环境变量初始化系统（便捷方法）
   */
  async initializeFromEnv() {
    const initDto: SystemInitDto = {
      adminEmail:
        this.configService.get<string>('INIT_ADMIN_EMAIL') ||
        'admin@example.com',
      adminPassword:
        this.configService.get<string>('INIT_ADMIN_PASSWORD') || 'Admin123456',
      adminName:
        this.configService.get<string>('INIT_ADMIN_NAME') || '系统管理员',
      tenantName:
        this.configService.get<string>('INIT_TENANT_NAME') || '默认组织',
      tenantSlug:
        this.configService.get<string>('INIT_TENANT_SLUG') || 'default-org',
    };

    return this.initialize(initDto);
  }
}
