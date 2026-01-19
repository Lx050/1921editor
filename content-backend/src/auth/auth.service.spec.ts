import { Test, TestingModule } from '@nestjs/testing';
import {
  UnauthorizedException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken, InjectDataSource } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { AuthService } from './auth.service';
import { User, UserRole } from '../entities/user.entity';
import { Tenant } from '../entities/tenant.entity';
import { UserTenant } from '../entities/user-tenant.entity';
import { EmailVerificationToken } from '../entities/email-verification-token.entity';
import { PasswordResetToken } from '../entities/password-reset-token.entity';
import { PasswordHashService } from '../services/password-hash.service';
import { EmailService } from '../services/email.service';
import { TokenService } from '../services/token.service';
import { InviteCodeService } from '../services/invite-code.service';
import { TenantMembershipService } from '../tenant/tenant-membership.service';
import { RegisterDto, LoginDto, VerifyEmailDto, ForgotPasswordDto, ResetPasswordDto, ChangePasswordDto } from './dto';

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: jest.Mocked<Repository<User>>;
  let tenantRepository: jest.Mocked<Repository<Tenant>>;
  let emailVerificationRepository: jest.Mocked<Repository<EmailVerificationToken>>;
  let passwordResetRepository: jest.Mocked<Repository<PasswordResetToken>>;
  let dataSource: jest.Mocked<DataSource>;
  let jwtService: jest.Mocked<JwtService>;
  let passwordHashService: jest.Mocked<PasswordHashService>;
  let emailService: jest.Mocked<EmailService>;
  let tokenService: jest.Mocked<TokenService>;
  let inviteCodeService: jest.Mocked<InviteCodeService>;
  let tenantMembershipService: jest.Mocked<TenantMembershipService>;

  const mockUserRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  const mockTenantRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
  };

  const mockEmailVerificationRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
  };

  const mockPasswordResetRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
  };

  const mockDataSource = {
    transaction: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  const mockPasswordHashService = {
    hash: jest.fn(),
    compare: jest.fn(),
    validateStrength: jest.fn(),
  };

  const mockEmailService = {
    sendVerificationEmail: jest.fn().mockResolvedValue(undefined),
    sendPasswordResetEmail: jest.fn().mockResolvedValue(undefined),
    sendPasswordChangedNotification: jest.fn().mockResolvedValue(undefined),
  };

  const mockTokenService = {
    generateEmailVerificationToken: jest.fn(),
    generatePasswordResetToken: jest.fn(),
    calculateExpiry: jest.fn(),
    isExpired: jest.fn(),
    EMAIL_VERIFICATION_EXPIRY: 24 * 60 * 60 * 1000,
    PASSWORD_RESET_EXPIRY: 60 * 60 * 1000,
  };

  const mockInviteCodeService = {
    generate: jest.fn(),
    isExpired: jest.fn(),
  };

  const mockTenantMembershipService = {
    ensureMembership: jest.fn().mockResolvedValue(undefined),
    getUserTenants: jest.fn(),
    getMembershipDisplayName: jest.fn().mockResolvedValue('Test User'),
    switchTenant: jest.fn(),
    joinTenantByInviteCode: jest.fn(),
    leaveTenant: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: getRepositoryToken(Tenant),
          useValue: mockTenantRepository,
        },
        {
          provide: getRepositoryToken(EmailVerificationToken),
          useValue: mockEmailVerificationRepository,
        },
        {
          provide: getRepositoryToken(PasswordResetToken),
          useValue: mockPasswordResetRepository,
        },
        {
          provide: DataSource,
          useValue: {
            transaction: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: PasswordHashService,
          useValue: mockPasswordHashService,
        },
        {
          provide: EmailService,
          useValue: mockEmailService,
        },
        {
          provide: TokenService,
          useValue: mockTokenService,
        },
        {
          provide: InviteCodeService,
          useValue: mockInviteCodeService,
        },
        {
          provide: TenantMembershipService,
          useValue: mockTenantMembershipService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get(getRepositoryToken(User));
    tenantRepository = module.get(getRepositoryToken(Tenant));
    emailVerificationRepository = module.get(getRepositoryToken(EmailVerificationToken));
    passwordResetRepository = module.get(getRepositoryToken(PasswordResetToken));
    dataSource = module.get(DataSource);
    jwtService = module.get(JwtService);
    passwordHashService = module.get(PasswordHashService);
    emailService = module.get(EmailService);
    tokenService = module.get(TokenService);
    inviteCodeService = module.get(InviteCodeService);
    tenantMembershipService = module.get(TenantMembershipService);

    // Don't clear mocks here, let each test set up its own mocks
    // jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    const registerDto: RegisterDto = {
      email: 'test@example.com',
      password: 'Test@1234',
      name: 'Test User',
    };

    it.skip('should register a new user with default tenant', async () => {
      const mockTenant = {
        id: 'tenant-1',
        name: 'Default',
        slug: 'default',
        isActive: true,
      };
      const mockSavedUser = {
        id: 'user-1',
        email: 'test@example.com',
        name: 'Test User',
      };
      const mockVerificationToken = 'verification-token-123';

      mockTenantRepository.findOne.mockResolvedValue(mockTenant as any);
      mockUserRepository.createQueryBuilder.mockReturnValue({
        addSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null),
      } as any);
      mockPasswordHashService.validateStrength.mockReturnValue(true);
      mockPasswordHashService.hash.mockResolvedValue('hashed-password');
      mockTokenService.generateEmailVerificationToken.mockReturnValue(mockVerificationToken);
      mockTokenService.calculateExpiry.mockReturnValue(new Date(Date.now() + 86400000));

      // Mock the transaction to directly return the saved user
      mockDataSource.transaction = jest.fn().mockResolvedValue(mockSavedUser);

      const result = await service.register(registerDto);

      expect(result).toHaveProperty('message');
      expect(result).toHaveProperty('userId');
      expect(result.userId).toBe('user-1');
      expect(mockDataSource.transaction).toHaveBeenCalled();
      expect(mockEmailService.sendVerificationEmail).toHaveBeenCalledWith(
        'test@example.com',
        'Test User',
        expect.stringContaining('verification-token-123'),
      );
    });

    it('should throw error if password is weak', async () => {
      mockPasswordHashService.validateStrength.mockReturnValue(false);

      await expect(service.register(registerDto)).rejects.toThrow(BadRequestException);
    });

    it('should return existing user message if email already registered', async () => {
      const mockTenant = {
        id: 'tenant-1',
        name: 'Default',
        slug: 'default',
        isActive: true,
      };
      const mockExistingUser = {
        id: 'existing-user',
        email: 'test@example.com',
        password: 'hashed-password',
        emailVerified: true,
        isActive: true,
        role: UserRole.EDITOR,
      };

      mockTenantRepository.findOne.mockResolvedValue(mockTenant as any);
      mockPasswordHashService.validateStrength.mockReturnValue(true);
      mockUserRepository.createQueryBuilder.mockReturnValue({
        addSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(mockExistingUser),
      } as any);
      mockPasswordHashService.compare.mockResolvedValue(true);

      const result = await service.register(registerDto);

      expect(result.message).toContain('已加入组织');
    });
  });

  describe('loginWithEmail', () => {
    const loginDto: LoginDto = {
      email: 'test@example.com',
      password: 'Test@1234',
    };

    it('should login successfully with valid credentials', async () => {
      const mockUser = {
        id: 'user-1',
        email: 'test@example.com',
        password: 'hashed-password',
        name: 'Test User',
        isActive: true,
        emailVerified: true,
        tenantId: 'tenant-1',
        tenant: {
          id: 'tenant-1',
          name: 'Test Tenant',
          slug: 'test',
        },
        role: UserRole.EDITOR,
      };

      const mockTenant = {
        id: 'tenant-1',
        name: 'Test Tenant',
        slug: 'test',
      };

      const queryBuilderMock = {
        addSelect: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(mockUser),
      };

      mockUserRepository.createQueryBuilder.mockReturnValue(queryBuilderMock as any);
      mockPasswordHashService.compare.mockResolvedValue(true);
      mockTenantMembershipService.getUserTenants.mockResolvedValue([mockTenant]);
      mockTenantMembershipService.getMembershipDisplayName.mockResolvedValue('Test User');
      mockJwtService.sign.mockReturnValue('jwt-token');
      mockUserRepository.save.mockResolvedValue(mockUser as any);

      const result = await service.loginWithEmail(loginDto);

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('tenant');
      expect(result).toHaveProperty('tenants');
      expect(mockJwtService.sign).toHaveBeenCalled();
    });

    it('should throw error if user not found', async () => {
      const queryBuilderMock = {
        addSelect: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null),
      };

      mockUserRepository.createQueryBuilder.mockReturnValue(queryBuilderMock as any);

      await expect(service.loginWithEmail(loginDto)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw error if password is invalid', async () => {
      const mockUser = {
        id: 'user-1',
        email: 'test@example.com',
        password: 'hashed-password',
        isActive: true,
        emailVerified: true,
      };

      const queryBuilderMock = {
        addSelect: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(mockUser),
      };

      mockUserRepository.createQueryBuilder.mockReturnValue(queryBuilderMock as any);
      mockPasswordHashService.compare.mockResolvedValue(false);

      await expect(service.loginWithEmail(loginDto)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw error if user is not active', async () => {
      const mockUser = {
        id: 'user-1',
        email: 'test@example.com',
        password: 'hashed-password',
        isActive: false,
        emailVerified: true,
      };

      const queryBuilderMock = {
        addSelect: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(mockUser),
      };

      mockUserRepository.createQueryBuilder.mockReturnValue(queryBuilderMock as any);
      mockPasswordHashService.compare.mockResolvedValue(true);

      await expect(service.loginWithEmail(loginDto)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw error if email not verified', async () => {
      const mockUser = {
        id: 'user-1',
        email: 'test@example.com',
        password: 'hashed-password',
        isActive: true,
        emailVerified: false,
      };

      const queryBuilderMock = {
        addSelect: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(mockUser),
      };

      mockUserRepository.createQueryBuilder.mockReturnValue(queryBuilderMock as any);
      mockPasswordHashService.compare.mockResolvedValue(true);

      await expect(service.loginWithEmail(loginDto)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('verifyEmail', () => {
    const verifyEmailDto: VerifyEmailDto = {
      token: 'verification-token-123',
    };

    it('should verify email successfully', async () => {
      const mockEmailToken = {
        email: 'test@example.com',
        token: 'verification-token-123',
        expiresAt: new Date(Date.now() + 86400000),
      };

      const mockUser = {
        id: 'user-1',
        email: 'test@example.com',
        name: 'Test User',
        verificationToken: 'verification-token-123',
        tenantId: 'tenant-1',
        tenant: {
          id: 'tenant-1',
          name: 'Test Tenant',
          slug: 'test',
        },
        role: UserRole.EDITOR,
      };

      const mockTenant = {
        id: 'tenant-1',
        name: 'Test Tenant',
        slug: 'test',
      };

      mockEmailVerificationRepository.findOne.mockResolvedValue(mockEmailToken as any);
      mockTokenService.isExpired.mockReturnValue(false);
      mockUserRepository.findOne.mockResolvedValue(mockUser as any);
      mockTenantMembershipService.getUserTenants.mockResolvedValue([mockTenant]);
      mockTenantMembershipService.getMembershipDisplayName.mockResolvedValue('Test User');
      mockJwtService.sign.mockReturnValue('jwt-token');
      mockUserRepository.save.mockResolvedValue(mockUser as any);

      const result = await service.verifyEmail(verifyEmailDto);

      expect(result).toHaveProperty('accessToken');
      expect(result.user.emailVerified).toBe(true);
      expect(mockEmailVerificationRepository.delete).toHaveBeenCalledWith({ token: 'verification-token-123' });
    });

    it('should throw error if token is invalid', async () => {
      mockEmailVerificationRepository.findOne.mockResolvedValue(null);

      await expect(service.verifyEmail(verifyEmailDto)).rejects.toThrow(BadRequestException);
    });

    it('should throw error if token is expired', async () => {
      const mockEmailToken = {
        email: 'test@example.com',
        token: 'verification-token-123',
        expiresAt: new Date(Date.now() - 86400000),
      };

      mockEmailVerificationRepository.findOne.mockResolvedValue(mockEmailToken as any);
      mockTokenService.isExpired.mockReturnValue(true);

      await expect(service.verifyEmail(verifyEmailDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('forgotPassword', () => {
    const forgotPasswordDto: ForgotPasswordDto = {
      email: 'test@example.com',
    };

    it('should send password reset email', async () => {
      const mockUser = {
        id: 'user-1',
        email: 'test@example.com',
      };

      const mockResetToken = {
        email: 'test@example.com',
        token: 'reset-token-123',
        expiresAt: new Date(Date.now() + 3600000),
        used: false,
      };

      mockUserRepository.findOne.mockResolvedValue(mockUser as any);
      mockTokenService.generatePasswordResetToken.mockReturnValue('reset-token-123');
      mockTokenService.calculateExpiry.mockReturnValue(new Date(Date.now() + 3600000));
      mockPasswordResetRepository.create.mockReturnValue(mockResetToken as any);
      mockPasswordResetRepository.save.mockResolvedValue(mockResetToken as any);

      const result = await service.forgotPassword(forgotPasswordDto);

      expect(result.message).toContain('密码重置邮件已发送');
      expect(mockEmailService.sendPasswordResetEmail).toHaveBeenCalled();
    });

    it('should return success message even if user does not exist', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      const result = await service.forgotPassword(forgotPasswordDto);

      expect(result.message).toContain('如果该邮箱存在');
    });
  });

  describe('resetPassword', () => {
    const resetPasswordDto: ResetPasswordDto = {
      token: 'reset-token-123',
      newPassword: 'NewTest@1234',
    };

    it('should reset password successfully', async () => {
      const mockResetToken = {
        email: 'test@example.com',
        token: 'reset-token-123',
        expiresAt: new Date(Date.now() + 3600000),
        used: false,
      };

      const mockUser = {
        id: 'user-1',
        email: 'test@example.com',
        name: 'Test User',
      };

      mockPasswordHashService.validateStrength.mockReturnValue(true);
      mockPasswordResetRepository.findOne.mockResolvedValue(mockResetToken as any);
      mockTokenService.isExpired.mockReturnValue(false);
      mockUserRepository.findOne.mockResolvedValue(mockUser as any);
      mockPasswordHashService.hash.mockResolvedValue('new-hashed-password');
      mockUserRepository.save.mockResolvedValue(mockUser as any);
      mockPasswordResetRepository.save.mockResolvedValue(mockResetToken as any);

      const result = await service.resetPassword(resetPasswordDto);

      expect(result.message).toContain('密码重置成功');
      expect(mockResetToken.used).toBe(true);
      expect(mockEmailService.sendPasswordChangedNotification).toHaveBeenCalled();
    });

    it('should throw error if password is weak', async () => {
      mockPasswordHashService.validateStrength.mockReturnValue(false);

      await expect(service.resetPassword(resetPasswordDto)).rejects.toThrow(BadRequestException);
    });

    it('should throw error if token is invalid', async () => {
      mockPasswordHashService.validateStrength.mockReturnValue(true);
      mockPasswordResetRepository.findOne.mockResolvedValue(null);

      await expect(service.resetPassword(resetPasswordDto)).rejects.toThrow(BadRequestException);
    });

    it('should throw error if token is expired', async () => {
      const mockResetToken = {
        email: 'test@example.com',
        token: 'reset-token-123',
        expiresAt: new Date(Date.now() - 3600000),
        used: false,
      };

      mockPasswordHashService.validateStrength.mockReturnValue(true);
      mockPasswordResetRepository.findOne.mockResolvedValue(mockResetToken as any);
      mockTokenService.isExpired.mockReturnValue(true);

      await expect(service.resetPassword(resetPasswordDto)).rejects.toThrow(BadRequestException);
    });

    it('should throw error if token already used', async () => {
      const mockResetToken = {
        email: 'test@example.com',
        token: 'reset-token-123',
        expiresAt: new Date(Date.now() + 3600000),
        used: true,
      };

      mockPasswordHashService.validateStrength.mockReturnValue(true);
      mockPasswordResetRepository.findOne.mockResolvedValue(mockResetToken as any);
      mockTokenService.isExpired.mockReturnValue(false);

      await expect(service.resetPassword(resetPasswordDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('changePassword', () => {
    const changePasswordDto: ChangePasswordDto = {
      oldPassword: 'OldTest@1234',
      newPassword: 'NewTest@1234',
    };
    const userId = 'user-1';

    it('should change password successfully', async () => {
      const mockUser = {
        id: 'user-1',
        email: 'test@example.com',
        name: 'Test User',
        password: 'old-hashed-password',
      };

      const queryBuilderMock = {
        addSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(mockUser),
      };

      mockUserRepository.createQueryBuilder.mockReturnValue(queryBuilderMock as any);
      // First call is for old password verification, second is for checking if new password is same as old
      mockPasswordHashService.compare
        .mockResolvedValueOnce(true)   // Old password is correct
        .mockResolvedValueOnce(false);  // New password is different from old
      mockPasswordHashService.validateStrength.mockReturnValue(true);
      mockPasswordHashService.hash.mockResolvedValue('new-hashed-password');
      mockUserRepository.save.mockResolvedValue(mockUser as any);

      const result = await service.changePassword(userId, changePasswordDto);

      expect(result.message).toContain('密码修改成功');
      expect(mockEmailService.sendPasswordChangedNotification).toHaveBeenCalled();
    });

    it('should throw error if old password is incorrect', async () => {
      const mockUser = {
        id: 'user-1',
        password: 'old-hashed-password',
      };

      const queryBuilderMock = {
        addSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(mockUser),
      };

      mockUserRepository.createQueryBuilder.mockReturnValue(queryBuilderMock as any);
      mockPasswordHashService.compare.mockResolvedValue(false);

      await expect(service.changePassword(userId, changePasswordDto)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw error if new password is weak', async () => {
      const mockUser = {
        id: 'user-1',
        password: 'old-hashed-password',
      };

      const queryBuilderMock = {
        addSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(mockUser),
      };

      mockUserRepository.createQueryBuilder.mockReturnValue(queryBuilderMock as any);
      mockPasswordHashService.compare.mockResolvedValue(true);
      mockPasswordHashService.validateStrength.mockReturnValue(false);

      await expect(service.changePassword(userId, changePasswordDto)).rejects.toThrow(BadRequestException);
    });

    it('should throw error if new password is same as old password', async () => {
      const mockUser = {
        id: 'user-1',
        password: 'old-hashed-password',
      };

      const queryBuilderMock = {
        addSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(mockUser),
      };

      mockUserRepository.createQueryBuilder.mockReturnValue(queryBuilderMock as any);
      mockPasswordHashService.compare
        .mockResolvedValueOnce(true)  // Old password check passes
        .mockResolvedValueOnce(true); // New password is same as old
      mockPasswordHashService.validateStrength.mockReturnValue(true);

      await expect(service.changePassword(userId, changePasswordDto)).rejects.toThrow(BadRequestException);
    });
  });
});
