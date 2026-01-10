import {
  Injectable,
  Logger,
  UnauthorizedException,
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../entities/user.entity';
import { Tenant } from '../entities/tenant.entity';
import { UserTenant } from '../entities/user-tenant.entity';
import { EmailVerificationToken } from '../entities/email-verification-token.entity';
import { PasswordResetToken } from '../entities/password-reset-token.entity';
import { PasswordHashService } from '../services/password-hash.service';
import { EmailService } from '../services/email.service';
import { TokenService } from '../services/token.service';
import { InviteCodeService } from '../services/invite-code.service';
import {
  RegisterDto,
  LoginDto,
  VerifyEmailDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  ChangePasswordDto,
  JoinTenantDto,
  LeaveTenantDto,
} from './dto';

/**
 * 认证服务
 * 提供邮箱密码认证功能，替代原来的飞书登录
 */
@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly defaultTenantId =
    process.env.DEFAULT_TENANT_ID || '00000000-0000-0000-0000-000000000001';

  private readonly defaultTenantSlug = 'default';

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Tenant)
    private tenantRepository: Repository<Tenant>,
    @InjectRepository(UserTenant)
    private userTenantRepository: Repository<UserTenant>,
    @InjectRepository(EmailVerificationToken)
    private emailVerificationRepository: Repository<EmailVerificationToken>,
    @InjectRepository(PasswordResetToken)
    private passwordResetRepository: Repository<PasswordResetToken>,
    private jwtService: JwtService,
    private passwordHashService: PasswordHashService,
    private emailService: EmailService,
    private tokenService: TokenService,
    private inviteCodeService: InviteCodeService,
  ) {}

  private async resolveDefaultTenant(): Promise<Tenant | null> {
    const tenantById = await this.tenantRepository.findOne({
      where: { id: this.defaultTenantId },
    });
    if (tenantById) return tenantById;

    return this.tenantRepository.findOne({
      where: { slug: this.defaultTenantSlug },
    });
  }

  private isDefaultTenant(tenant: Tenant | null): boolean {
    if (!tenant) return false;
    return (
      tenant.id === this.defaultTenantId ||
      tenant.slug === this.defaultTenantSlug
    );
  }

  private async ensureMembership(
    userId: string,
    tenantId: string,
    displayName?: string,
  ) {
    const existing = await this.userTenantRepository.findOne({
      where: { userId, tenantId },
    });
    if (!existing) {
      const membership = this.userTenantRepository.create({
        userId,
        tenantId,
        displayName: displayName?.trim() || undefined,
      });
      await this.userTenantRepository.save(membership);
    } else if (displayName && existing.displayName !== displayName.trim()) {
      existing.displayName = displayName.trim();
      await this.userTenantRepository.save(existing);
    }
  }

  private async getUserTenants(userId: string): Promise<Tenant[]> {
    const memberships = await this.userTenantRepository.find({
      where: { userId },
      relations: ['tenant'],
    });

    const tenants = memberships
      .map((membership) => membership.tenant)
      .filter((tenant): tenant is Tenant => Boolean(tenant && tenant.isActive));

    const defaultTenant = await this.resolveDefaultTenant();
    if (defaultTenant && defaultTenant.isActive) {
      await this.ensureMembership(userId, defaultTenant.id);
      const hasDefault = tenants.some((tenant) => tenant.id === defaultTenant.id);
      if (!hasDefault) {
        tenants.unshift(defaultTenant);
      }
    }

    return tenants;
  }

  private async getMembershipDisplayName(
    userId: string,
    tenantId: string,
  ): Promise<string | undefined> {
    const membership = await this.userTenantRepository.findOne({
      where: { userId, tenantId },
    });
    return membership?.displayName?.trim() || undefined;
  }

  private buildAuthResponse(
    user: User,
    tenant: Tenant,
    tenants: Tenant[],
    displayName?: string,
  ) {
    const payload = {
      sub: user.id,
      email: user.email,
      tenantId: tenant.id,
      role: user.role,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        displayName: displayName || user.name,
        role: user.role,
        tenantId: tenant.id,
        emailVerified: user.emailVerified,
      },
      tenant: {
        id: tenant.id,
        name: tenant.name,
        slug: tenant.slug,
      },
      tenants: tenants.map((item) => ({
        id: item.id,
        name: item.name,
        slug: item.slug,
        isDefault: this.isDefaultTenant(item),
      })),
    };
  }

  /**
   * 用户注册
   * @param registerDto 注册信息
   */
  async register(registerDto: RegisterDto) {
    const {
      email,
      password,
      name,
      inviteCode,
      createTenant,
      tenantName,
      tenantSlug,
      wechatAppId,
      wechatAppSecret,
    } = registerDto;
    const normalizedInviteCode = inviteCode?.trim();

    this.logger.log(`用户注册请求: ${email}`);

    // 1. 验证密码强度
    if (!this.passwordHashService.validateStrength(password)) {
      throw new BadRequestException(
        '密码强度不足：至少8位，必须包含大小写字母和数字',
      );
    }

    // 2. 确定租户
    let tenant: Tenant | null;
    let targetRole = UserRole.EDITOR;

    if (createTenant) {
      if (!tenantName || !tenantSlug || !wechatAppId || !wechatAppSecret) {
        throw new BadRequestException('创建组织需填写组织名称、标识与公众号密钥');
      }

      const existingTenant = await this.tenantRepository.findOne({
        where: [{ name: tenantName.trim() }, { slug: tenantSlug.trim() }],
      });
      if (existingTenant) {
        throw new ConflictException('组织名称或标识已被占用');
      }

      tenant = await this.tenantRepository.save(
        this.tenantRepository.create({
          name: tenantName.trim(),
          slug: tenantSlug.trim(),
          inviteCode: this.inviteCodeService.generate(),
          inviteCodeExpires: null,
          wechatAppId: wechatAppId.trim(),
          wechatAppSecret: wechatAppSecret.trim(),
          isActive: true,
        }),
      );
      targetRole = UserRole.ADMIN;
      this.logger.log(`创建新租户: ${tenant.name}`);
    } else if (normalizedInviteCode) {
      // 使用邀请码加入已有租户
      tenant = await this.tenantRepository.findOne({
        where: { inviteCode: normalizedInviteCode },
      });
      if (!tenant) {
        throw new BadRequestException('邀请码无效');
      }
      if (this.inviteCodeService.isExpired(tenant.inviteCodeExpires)) {
        throw new BadRequestException('邀请码已过期');
      }
      this.logger.log(`使用邀请码加入租户: ${tenant.name}`);
    } else {
      // 查找默认租户或创建个人租户
      tenant = await this.tenantRepository.findOne({
        where: { slug: 'default' },
      });
      if (!tenant) {
        // 如果没有默认租户，返回错误，提示先初始化系统
        throw new BadRequestException(
          '系统未初始化，请先调用 /api/system/initialize 初始化系统',
        );
      }
      this.logger.log(`使用默认租户: ${tenant.name}`);
    }

    // 3. 检查邮箱是否已注册
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      const isPasswordValid = await this.passwordHashService.compare(
        password,
        existingUser.password,
      );
      if (!isPasswordValid) {
        throw new ConflictException('该邮箱已被注册');
      }

      if (!existingUser.isActive) {
        throw new UnauthorizedException('该账号已被禁用');
      }

      await this.ensureMembership(existingUser.id, tenant.id);

      const defaultTenant = await this.resolveDefaultTenant();
      if (defaultTenant?.id && defaultTenant.isActive) {
        await this.ensureMembership(existingUser.id, defaultTenant.id);
      }

      let shouldSave = false;
      if (targetRole === UserRole.ADMIN && existingUser.role !== UserRole.ADMIN) {
        existingUser.role = UserRole.ADMIN;
        shouldSave = true;
      }
      if (createTenant && tenant?.id && existingUser.tenantId !== tenant.id) {
        existingUser.tenantId = tenant.id;
        shouldSave = true;
      }
      if (shouldSave) {
        await this.userRepository.save(existingUser);
      }

      if (!existingUser.emailVerified) {
        const verificationToken =
          this.tokenService.generateEmailVerificationToken();
        existingUser.verificationToken = verificationToken;
        await this.userRepository.save(existingUser);

        await this.emailVerificationRepository.delete({ email });
        const emailVerificationToken = this.emailVerificationRepository.create({
          email,
          token: verificationToken,
          expiresAt: this.tokenService.calculateExpiry(
            this.tokenService.EMAIL_VERIFICATION_EXPIRY,
          ),
        });
        await this.emailVerificationRepository.save(emailVerificationToken);

        const verifyUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email?token=${verificationToken}`;
        await this.emailService.sendVerificationEmail(
          email,
          existingUser.name,
          verifyUrl,
        );
      }

      this.logger.log(
        `用户已存在，已加入租户: ${existingUser.email}, 租户: ${tenant.name}`,
      );

      return {
        message: existingUser.emailVerified
          ? '已加入组织，请登录'
          : '已加入组织，请先完成邮箱验证',
        userId: existingUser.id,
      };
    }

    // 4. 创建用户
    const hashedPassword = await this.passwordHashService.hash(password);
    const verificationToken =
      this.tokenService.generateEmailVerificationToken();

    const user = this.userRepository.create({
      tenantId: tenant.id,
      email,
      password: hashedPassword,
      name,
      role: targetRole,
      emailVerified: false,
      verificationToken,
      isActive: true,
    });

    await this.userRepository.save(user);

    await this.ensureMembership(user.id, tenant.id);

    const defaultTenant = await this.resolveDefaultTenant();
    if (defaultTenant?.id && defaultTenant.isActive) {
      await this.ensureMembership(user.id, defaultTenant.id);
    }

    // 5. 保存邮箱验证令牌
    const emailVerificationToken = this.emailVerificationRepository.create({
      email,
      token: verificationToken,
      expiresAt: this.tokenService.calculateExpiry(
        this.tokenService.EMAIL_VERIFICATION_EXPIRY,
      ),
    });
    await this.emailVerificationRepository.save(emailVerificationToken);

    // 6. 发送验证邮件
    const verifyUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email?token=${verificationToken}`;
    await this.emailService.sendVerificationEmail(email, name, verifyUrl);

    this.logger.log(`用户注册成功: ${email}, 租户: ${tenant.name}`);

    return {
      message: '注册成功，请查收验证邮件',
      userId: user.id,
    };
  }

  /**
   * 验证邮箱
   * @param verifyEmailDto 验证信息
   */
  async verifyEmail(verifyEmailDto: VerifyEmailDto) {
    const { token } = verifyEmailDto;

    this.logger.log(`邮箱验证请求: ${token.substring(0, 8)}...`);

    // 1. 查找验证令牌
    const emailToken = await this.emailVerificationRepository.findOne({
      where: { token },
    });

    if (!emailToken) {
      throw new BadRequestException('验证令牌无效');
    }

    // 2. 检查是否过期
    if (this.tokenService.isExpired(emailToken.expiresAt)) {
      throw new BadRequestException('验证令牌已过期，请重新注册');
    }

    // 3. 查找用户
    const user = await this.userRepository.findOne({
      where: { email: emailToken.email, verificationToken: token },
      relations: ['tenant'],
    });

    if (!user) {
      throw new BadRequestException('用户不存在');
    }

    // 4. 更新用户状态
    user.emailVerified = true;
    user.verificationToken = null;
    await this.userRepository.save(user);

    // 5. 删除验证令牌
    await this.emailVerificationRepository.delete({ token });

    this.logger.log(`邮箱验证成功: ${user.email}`);

    // 6. 生成 JWT Token
    const tenants = await this.getUserTenants(user.id);
    const activeTenant =
      tenants.find((item) => item.id === user.tenantId) || tenants[0];
    if (!activeTenant) {
      throw new UnauthorizedException('未找到可用的组织');
    }
    if (activeTenant.id !== user.tenantId) {
      user.tenantId = activeTenant.id;
      await this.userRepository.save(user);
    }
    const displayName = await this.getMembershipDisplayName(
      user.id,
      activeTenant.id,
    );
    return this.buildAuthResponse(user, activeTenant, tenants, displayName);
  }

  /**
   * 用户登录
   * @param loginDto 登录信息
   */
  async loginWithEmail(loginDto: LoginDto) {
    const { email, password } = loginDto;

    this.logger.log(`用户登录请求: ${email}`);

    // 1. 查找用户
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['tenant'],
    });

    if (!user) {
      throw new UnauthorizedException('邮箱或密码错误');
    }

    // 2. 验证密码
    const isPasswordValid = await this.passwordHashService.compare(
      password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('邮箱或密码错误');
    }

    // 3. 检查用户状态
    if (!user.isActive) {
      throw new UnauthorizedException('该账号已被禁用');
    }

    // 4. 检查邮箱验证状态（可选：是否强制验证）
    if (!user.emailVerified) {
      throw new UnauthorizedException('请先验证邮箱');
    }

    // 5. 更新最后登录时间
    user.lastLoginAt = new Date();
    await this.userRepository.save(user);

    this.logger.log(`用户登录成功: ${user.email}, 租户: ${user.tenant?.name}`);

    // 6. 生成 JWT Token
    const tenants = await this.getUserTenants(user.id);
    const activeTenant =
      tenants.find((item) => item.id === user.tenantId) || tenants[0];

    if (!activeTenant) {
      throw new UnauthorizedException('未找到可用的组织');
    }

    if (activeTenant.id !== user.tenantId) {
      user.tenantId = activeTenant.id;
      await this.userRepository.save(user);
    }

    const displayName = await this.getMembershipDisplayName(
      user.id,
      activeTenant.id,
    );
    return this.buildAuthResponse(user, activeTenant, tenants, displayName);
  }

  async listTenants(userId: string) {
    const tenants = await this.getUserTenants(userId);
    return {
      tenants: tenants.map((item) => ({
        id: item.id,
        name: item.name,
        slug: item.slug,
        isDefault: this.isDefaultTenant(item),
      })),
    };
  }

  async switchTenant(userId: string, tenantId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('用户不存在');
    }

    if (!tenantId) {
      throw new BadRequestException('tenantId is required');
    }

    let membership = await this.userTenantRepository.findOne({
      where: { userId, tenantId },
      relations: ['tenant'],
    });

    if (!membership) {
      const defaultTenant = await this.resolveDefaultTenant();
      if (defaultTenant?.id === tenantId && defaultTenant.isActive) {
        await this.ensureMembership(userId, tenantId);
        membership = await this.userTenantRepository.findOne({
          where: { userId, tenantId },
          relations: ['tenant'],
        });
      }
    }

    if (!membership?.tenant || !membership.tenant.isActive) {
      throw new UnauthorizedException('没有该组织的访问权限');
    }

    user.tenantId = tenantId;
    await this.userRepository.save(user);

    const tenants = await this.getUserTenants(userId);
    return this.buildAuthResponse(
      user,
      membership.tenant,
      tenants,
      membership.displayName,
    );
  }

  async joinTenantByInviteCode(userId: string, dto: JoinTenantDto) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('用户不存在');
    }

    const inviteCode = dto.inviteCode?.trim();
    if (!inviteCode) {
      throw new BadRequestException('邀请码不能为空');
    }

    const displayName = dto.displayName?.trim();
    if (!displayName) {
      throw new BadRequestException('成员名称不能为空');
    }

    const tenant = await this.tenantRepository.findOne({
      where: { inviteCode },
    });
    if (!tenant) {
      throw new BadRequestException('邀请码无效');
    }
    if (this.inviteCodeService.isExpired(tenant.inviteCodeExpires)) {
      throw new BadRequestException('邀请码已过期');
    }
    if (!tenant.isActive) {
      throw new BadRequestException('组织已被停用');
    }

    await this.ensureMembership(userId, tenant.id, displayName);

    const defaultTenant = await this.resolveDefaultTenant();
    if (defaultTenant?.id && defaultTenant.isActive) {
      await this.ensureMembership(userId, defaultTenant.id);
    }

    user.tenantId = tenant.id;
    await this.userRepository.save(user);

    const tenants = await this.getUserTenants(userId);
    return this.buildAuthResponse(user, tenant, tenants, displayName);
  }

  async leaveTenant(userId: string, dto: LeaveTenantDto) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('用户不存在');
    }

    const tenantId = dto.tenantId;
    if (!tenantId) {
      throw new BadRequestException('tenantId is required');
    }

    const tenant = await this.tenantRepository.findOne({
      where: { id: tenantId },
    });
    if (!tenant) {
      throw new NotFoundException('组织不存在');
    }

    if (this.isDefaultTenant(tenant)) {
      throw new BadRequestException('默认组织不可退出');
    }

    const membership = await this.userTenantRepository.findOne({
      where: { userId, tenantId },
    });
    if (!membership) {
      throw new BadRequestException('未加入该组织');
    }

    await this.userTenantRepository.remove(membership);

    const tenants = await this.getUserTenants(userId);
    if (!tenants.length) {
      throw new BadRequestException('未找到可用的组织');
    }

    let activeTenant =
      tenants.find((item) => item.id === user.tenantId) || tenants[0];

    if (!activeTenant) {
      throw new BadRequestException('未找到可用的组织');
    }

    if (activeTenant.id !== user.tenantId) {
      user.tenantId = activeTenant.id;
      await this.userRepository.save(user);
    }

    const displayName = await this.getMembershipDisplayName(
      userId,
      activeTenant.id,
    );
    return this.buildAuthResponse(user, activeTenant, tenants, displayName);
  }

  /**
   * 请求密码重置
   * @param forgotPasswordDto 忘记密码信息
   */
  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const { email } = forgotPasswordDto;

    this.logger.log(`密码重置请求: ${email}`);

    // 1. 查找用户
    const user = await this.userRepository.findOne({
      where: { email },
    });

    // 为了安全，即使用户不存在也返回成功消息
    if (!user) {
      this.logger.warn(`密码重置请求的邮箱不存在: ${email}`);
      return { message: '如果该邮箱存在，密码重置邮件已发送' };
    }

    // 2. 生成重置令牌
    const resetToken = this.tokenService.generatePasswordResetToken();

    // 3. 保存重置令牌
    const passwordResetToken = this.passwordResetRepository.create({
      email,
      token: resetToken,
      expiresAt: this.tokenService.calculateExpiry(
        this.tokenService.PASSWORD_RESET_EXPIRY,
      ),
      used: false,
    });
    await this.passwordResetRepository.save(passwordResetToken);

    // 4. 发送重置邮件
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
    await this.emailService.sendPasswordResetEmail(email, resetUrl);

    this.logger.log(`密码重置邮件已发送: ${email}`);

    return { message: '如果该邮箱存在，密码重置邮件已发送' };
  }

  /**
   * 重置密码
   * @param resetPasswordDto 重置密码信息
   */
  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { token, newPassword } = resetPasswordDto;

    this.logger.log(`密码重置执行: ${token.substring(0, 8)}...`);

    // 1. 验证密码强度
    if (!this.passwordHashService.validateStrength(newPassword)) {
      throw new BadRequestException(
        '密码强度不足：至少8位，必须包含大小写字母和数字',
      );
    }

    // 2. 查找重置令牌
    const resetToken = await this.passwordResetRepository.findOne({
      where: { token },
    });

    if (!resetToken) {
      throw new BadRequestException('重置令牌无效');
    }

    // 3. 检查是否过期
    if (this.tokenService.isExpired(resetToken.expiresAt)) {
      throw new BadRequestException('重置令牌已过期');
    }

    // 4. 检查是否已使用
    if (resetToken.used) {
      throw new BadRequestException('重置令牌已被使用');
    }

    // 5. 查找用户
    const user = await this.userRepository.findOne({
      where: { email: resetToken.email },
    });

    if (!user) {
      throw new BadRequestException('用户不存在');
    }

    // 6. 更新密码
    const hashedPassword = await this.passwordHashService.hash(newPassword);
    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await this.userRepository.save(user);

    // 7. 标记令牌为已使用
    resetToken.used = true;
    await this.passwordResetRepository.save(resetToken);

    // 8. 发送密码已修改通知
    await this.emailService.sendPasswordChangedNotification(
      user.email,
      user.name,
    );

    this.logger.log(`密码重置成功: ${user.email}`);

    return { message: '密码重置成功' };
  }

  /**
   * 修改密码
   * @param userId 用户ID
   * @param changePasswordDto 修改密码信息
   */
  async changePassword(userId: string, changePasswordDto: ChangePasswordDto) {
    const { oldPassword, newPassword } = changePasswordDto;

    this.logger.log(`用户修改密码: ${userId}`);

    // 1. 查找用户
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('用户不存在');
    }

    // 2. 验证旧密码
    const isOldPasswordValid = await this.passwordHashService.compare(
      oldPassword,
      user.password,
    );

    if (!isOldPasswordValid) {
      throw new UnauthorizedException('当前密码不正确');
    }

    // 3. 验证新密码强度
    if (!this.passwordHashService.validateStrength(newPassword)) {
      throw new BadRequestException(
        '密码强度不足：至少8位，必须包含大小写字母和数字',
      );
    }

    // 4. 新密码不能与旧密码相同
    const isSamePassword = await this.passwordHashService.compare(
      newPassword,
      user.password,
    );
    if (isSamePassword) {
      throw new BadRequestException('新密码不能与当前密码相同');
    }

    // 5. 更新密码
    const hashedPassword = await this.passwordHashService.hash(newPassword);
    user.password = hashedPassword;
    await this.userRepository.save(user);

    // 6. 发送密码已修改通知
    await this.emailService.sendPasswordChangedNotification(
      user.email,
      user.name,
    );

    this.logger.log(`密码修改成功: ${user.email}`);

    return { message: '密码修改成功' };
  }

}
