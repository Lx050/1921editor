import {
  Injectable,
  Logger,
  UnauthorizedException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { User, UserRole } from '../entities/user.entity';
import { Tenant } from '../entities/tenant.entity';
import { EmailVerificationToken } from '../entities/email-verification-token.entity';
import { PasswordResetToken } from '../entities/password-reset-token.entity';
import { TenantService } from '../tenant/tenant.service';
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
} from './dto';

/**
 * 认证服务
 * 提供邮箱密码认证功能，替代原来的飞书登录
 */
@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Tenant)
    private tenantRepository: Repository<Tenant>,
    @InjectRepository(EmailVerificationToken)
    private emailVerificationRepository: Repository<EmailVerificationToken>,
    @InjectRepository(PasswordResetToken)
    private passwordResetRepository: Repository<PasswordResetToken>,
    private jwtService: JwtService,
    private tenantService: TenantService,
    private passwordHashService: PasswordHashService,
    private emailService: EmailService,
    private tokenService: TokenService,
    private inviteCodeService: InviteCodeService,
    private dataSource: DataSource,
  ) {}

  /**
   * 用户注册
   * @param registerDto 注册信息
   */
  async register(registerDto: RegisterDto) {
    const { email, password, name, inviteCode } = registerDto;

    this.logger.log(`用户注册请求: ${email}`);

    // 1. 验证密码强度
    if (!this.passwordHashService.validateStrength(password)) {
      throw new BadRequestException(
        '密码强度不足：至少8位，必须包含大小写字母和数字',
      );
    }

    // 2. 检查邮箱是否已注册
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException('该邮箱已被注册');
    }

    // 3. 确定租户
    let tenant: Tenant | null;
    if (inviteCode) {
      // 使用邀请码加入已有租户
      tenant = await this.tenantRepository.findOne({
        where: { inviteCode },
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

    // 4. 创建用户
    const hashedPassword = await this.passwordHashService.hash(password);
    const verificationToken =
      this.tokenService.generateEmailVerificationToken();

    const user = this.userRepository.create({
      tenantId: tenant.id,
      email,
      password: hashedPassword,
      name,
      role: UserRole.EDITOR,
      emailVerified: false,
      verificationToken,
      isActive: true,
    });

    await this.userRepository.save(user);

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
    return this.login(user);
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
    // if (!user.emailVerified) {
    //   throw new UnauthorizedException('请先验证邮箱');
    // }

    // 5. 更新最后登录时间
    user.lastLoginAt = new Date();
    await this.userRepository.save(user);

    this.logger.log(`用户登录成功: ${user.email}, 租户: ${user.tenant?.name}`);

    // 6. 生成 JWT Token
    return this.login(user);
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

  /**
   * 生成 JWT Token（内部方法）
   * @param user 用户对象
   */
  private login(user: User) {
    const payload = {
      sub: user.id,
      email: user.email,
      tenantId: user.tenantId,
      role: user.role,
    };
    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        tenantId: user.tenantId,
        emailVerified: user.emailVerified,
        tenant: {
          id: user.tenant?.id,
          name: user.tenant?.name,
          slug: user.tenant?.slug,
        },
      },
    };
  }
}
