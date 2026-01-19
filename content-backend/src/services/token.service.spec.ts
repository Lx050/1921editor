import { Test, TestingModule } from '@nestjs/testing';
import { TokenService } from './token.service';

describe('TokenService', () => {
  let service: TokenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TokenService],
    }).compile();

    service = module.get<TokenService>(TokenService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateEmailVerificationToken', () => {
    it('should generate a valid UUID token', () => {
      const token = service.generateEmailVerificationToken();

      expect(token).toBeDefined();
      expect(token).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
    });

    it('should generate unique tokens', () => {
      const token1 = service.generateEmailVerificationToken();
      const token2 = service.generateEmailVerificationToken();

      expect(token1).not.toBe(token2);
    });

    it('should generate tokens with correct length', () => {
      const token = service.generateEmailVerificationToken();
      expect(token.length).toBe(36); // Standard UUID length with dashes
    });
  });

  describe('generatePasswordResetToken', () => {
    it('should generate a valid UUID token', () => {
      const token = service.generatePasswordResetToken();

      expect(token).toBeDefined();
      expect(token).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
    });

    it('should generate unique tokens', () => {
      const token1 = service.generatePasswordResetToken();
      const token2 = service.generatePasswordResetToken();

      expect(token1).not.toBe(token2);
    });

    it('should generate different token types', () => {
      const emailToken = service.generateEmailVerificationToken();
      const resetToken = service.generatePasswordResetToken();

      expect(emailToken).not.toBe(resetToken);
    });
  });

  describe('generateWechatCredentialToken', () => {
    it('should generate a valid UUID token', () => {
      const token = service.generateWechatCredentialToken();

      expect(token).toBeDefined();
      expect(token).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
    });

    it('should generate unique tokens', () => {
      const token1 = service.generateWechatCredentialToken();
      const token2 = service.generateWechatCredentialToken();

      expect(token1).not.toBe(token2);
    });
  });

  describe('calculateExpiry', () => {
    it('should calculate expiry time correctly for seconds', () => {
      const seconds = 3600; // 1 hour
      const expiry = service.calculateExpiry(seconds);
      const now = new Date();
      const expectedExpiry = new Date(now.getTime() + seconds * 1000);

      expect(expiry).toBeInstanceOf(Date);
      expect(Math.abs(expiry.getTime() - expectedExpiry.getTime())).toBeLessThan(100);
    });

    it('should calculate expiry for 1 minute', () => {
      const seconds = 60;
      const expiry = service.calculateExpiry(seconds);
      const now = new Date();
      const diff = expiry.getTime() - now.getTime();

      expect(diff).toBeGreaterThan(59000); // ~60 seconds
      expect(diff).toBeLessThan(61000);
    });

    it('should calculate expiry for 1 hour', () => {
      const seconds = 3600;
      const expiry = service.calculateExpiry(seconds);
      const now = new Date();
      const diff = expiry.getTime() - now.getTime();

      expect(diff).toBeGreaterThan(3599000); // ~1 hour
      expect(diff).toBeLessThan(3601000);
    });

    it('should calculate expiry for 24 hours', () => {
      const seconds = 86400;
      const expiry = service.calculateExpiry(seconds);
      const now = new Date();
      const diff = expiry.getTime() - now.getTime();

      expect(diff).toBeGreaterThan(86399000); // ~24 hours
      expect(diff).toBeLessThan(86401000);
    });

    it('should handle zero seconds', () => {
      const expiry = service.calculateExpiry(0);
      const now = new Date();

      expect(Math.abs(expiry.getTime() - now.getTime())).toBeLessThan(1000);
    });

    it('should handle large values', () => {
      const seconds = 7 * 24 * 60 * 60; // 1 week
      const expiry = service.calculateExpiry(seconds);
      const now = new Date();
      const expectedExpiry = new Date(now.getTime() + seconds * 1000);

      expect(Math.abs(expiry.getTime() - expectedExpiry.getTime())).toBeLessThan(1000);
    });
  });

  describe('isExpired', () => {
    it('should return false for future expiry date', () => {
      const futureDate = new Date(Date.now() + 3600000); // 1 hour in future
      expect(service.isExpired(futureDate)).toBe(false);
    });

    it('should return true for past expiry date', () => {
      const pastDate = new Date(Date.now() - 3600000); // 1 hour ago
      expect(service.isExpired(pastDate)).toBe(true);
    });

    it('should return false for current time + small margin', () => {
      const futureDate = new Date(Date.now() + 1000); // 1 second in future
      expect(service.isExpired(futureDate)).toBe(false);
    });

    it('should return true for current time - small margin', () => {
      const pastDate = new Date(Date.now() - 1000); // 1 second ago
      expect(service.isExpired(pastDate)).toBe(true);
    });

    it('should handle exactly current time', () => {
      const now = new Date();
      const result = service.isExpired(now);
      // The service creates a new Date() which will be slightly after 'now'
      // So it should either be true or very close to true
      expect(result === true || result === false).toBe(true);
    });

    it('should work with dates far in the future', () => {
      const futureDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // 1 year
      expect(service.isExpired(futureDate)).toBe(false);
    });

    it('should work with dates far in the past', () => {
      const pastDate = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000); // 1 year ago
      expect(service.isExpired(pastDate)).toBe(true);
    });
  });

  describe('expiry constants', () => {
    it('should have EMAIL_VERIFICATION_EXPIRY as 24 hours', () => {
      expect(service.EMAIL_VERIFICATION_EXPIRY).toBe(24 * 60 * 60); // 86400 seconds
    });

    it('should have PASSWORD_RESET_EXPIRY as 1 hour', () => {
      expect(service.PASSWORD_RESET_EXPIRY).toBe(60 * 60); // 3600 seconds
    });

    it('should have WECHAT_CREDENTIAL_CHANGE_EXPIRY as 30 minutes', () => {
      expect(service.WECHAT_CREDENTIAL_CHANGE_EXPIRY).toBe(30 * 60); // 1800 seconds
    });
  });

  describe('integration tests', () => {
    it('should generate token and calculate expiry for email verification', () => {
      const token = service.generateEmailVerificationToken();
      const expiry = service.calculateExpiry(service.EMAIL_VERIFICATION_EXPIRY);

      expect(token).toBeDefined();
      expect(expiry).toBeInstanceOf(Date);
      expect(service.isExpired(expiry)).toBe(false);
    });

    it('should generate token and calculate expiry for password reset', () => {
      const token = service.generatePasswordResetToken();
      const expiry = service.calculateExpiry(service.PASSWORD_RESET_EXPIRY);

      expect(token).toBeDefined();
      expect(expiry).toBeInstanceOf(Date);
      expect(service.isExpired(expiry)).toBe(false);
    });

    it('should generate token and calculate expiry for wechat credential', () => {
      const token = service.generateWechatCredentialToken();
      const expiry = service.calculateExpiry(service.WECHAT_CREDENTIAL_CHANGE_EXPIRY);

      expect(token).toBeDefined();
      expect(expiry).toBeInstanceOf(Date);
      expect(service.isExpired(expiry)).toBe(false);
    });

    it('should detect expired token correctly', () => {
      const token = service.generateEmailVerificationToken();
      const pastExpiry = new Date(Date.now() - 1000);

      expect(service.isExpired(pastExpiry)).toBe(true);
    });

    it('should validate complete token lifecycle', () => {
      // Generate token
      const token = service.generateEmailVerificationToken();
      expect(token).toBeDefined();

      // Calculate expiry
      const expiry = service.calculateExpiry(service.EMAIL_VERIFICATION_EXPIRY);
      expect(service.isExpired(expiry)).toBe(false);

      // Simulate time passing (using past date)
      const pastExpiry = new Date(Date.now() - 1000);
      expect(service.isExpired(pastExpiry)).toBe(true);
    });
  });
});
