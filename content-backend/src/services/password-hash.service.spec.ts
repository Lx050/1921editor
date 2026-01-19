import { Test, TestingModule } from '@nestjs/testing';
import { PasswordHashService } from './password-hash.service';

describe('PasswordHashService', () => {
  let service: PasswordHashService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PasswordHashService],
    }).compile();

    service = module.get<PasswordHashService>(PasswordHashService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('hash', () => {
    it('should hash a password successfully', async () => {
      const password = 'Test@1234';
      const hashedPassword = await service.hash(password);

      expect(hashedPassword).toBeDefined();
      expect(hashedPassword).not.toBe(password);
      expect(hashedPassword.length).toBeGreaterThan(20);
    });

    it('should generate different hashes for the same password', async () => {
      const password = 'Test@1234';
      const hash1 = await service.hash(password);
      const hash2 = await service.hash(password);

      expect(hash1).not.toBe(hash2);
    });

    it('should hash empty string', async () => {
      const hashedPassword = await service.hash('');
      expect(hashedPassword).toBeDefined();
    });
  });

  describe('compare', () => {
    it('should return true for matching password', async () => {
      const password = 'Test@1234';
      const hashedPassword = await service.hash(password);

      const result = await service.compare(password, hashedPassword);
      expect(result).toBe(true);
    });

    it('should return false for incorrect password', async () => {
      const password = 'Test@1234';
      const wrongPassword = 'Wrong@1234';
      const hashedPassword = await service.hash(password);

      const result = await service.compare(wrongPassword, hashedPassword);
      expect(result).toBe(false);
    });

    it('should return false for empty password against non-empty hash', async () => {
      const password = 'Test@1234';
      const hashedPassword = await service.hash(password);

      const result = await service.compare('', hashedPassword);
      expect(result).toBe(false);
    });

    it('should handle unicode characters', async () => {
      const password = '测试@Test1234';
      const hashedPassword = await service.hash(password);

      const result = await service.compare(password, hashedPassword);
      expect(result).toBe(true);
    });
  });

  describe('validateStrength', () => {
    const validPasswords = [
      'Test@1234',
      'MyPass@1',
      'Secure#123',
      'P@ssw0rd',
      'Very$ecure123',
    ];

    const invalidPasswords = [
      { password: 'shortA$', reason: 'less than 8 characters' },
      { password: 'nocaps123$', reason: 'no uppercase letter' },
      { password: 'NOLOW123$', reason: 'no lowercase letter' },
      { password: 'NoNumber$', reason: 'no number' },
      { password: 'NoSpecial123', reason: 'no special character' },
      { password: 'onlylower$', reason: 'missing uppercase and number' },
      { password: '', reason: 'empty string' },
      { password: '12345678', reason: 'only numbers' },
    ];

    it('should validate strong passwords correctly', () => {
      validPasswords.forEach((password) => {
        expect(service.validateStrength(password)).toBe(true);
      });
    });

    it('should reject weak passwords', () => {
      invalidPasswords.forEach(({ password, reason }) => {
        const result = service.validateStrength(password);
        if (result !== false) {
          console.log(`Password "${password}" (${reason}) returned ${result}, expected false`);
        }
        expect(result).toBe(false);
      });
    });

    it('should require minimum 8 characters', () => {
      expect(service.validateStrength('Test1$')).toBe(false);
      expect(service.validateStrength('Test12#$')).toBe(true);
    });

    it('should require uppercase letter', () => {
      expect(service.validateStrength('test@1234')).toBe(false);
      expect(service.validateStrength('Test@1234')).toBe(true);
    });

    it('should require lowercase letter', () => {
      expect(service.validateStrength('TEST@1234')).toBe(false);
      expect(service.validateStrength('Test@1234')).toBe(true);
    });

    it('should require number', () => {
      expect(service.validateStrength('Test@abcd')).toBe(false);
      expect(service.validateStrength('Test@1234')).toBe(true);
    });

    it('should require special character', () => {
      expect(service.validateStrength('Test1234')).toBe(false);
      expect(service.validateStrength('Test@1234')).toBe(true);
    });

    it('should accept all special characters', () => {
      const specialChars = ['!', '@', '#', '$', '%', '^', '&', '*'];
      specialChars.forEach((char) => {
        const password = `Test1234${char}`;
        expect(service.validateStrength(password)).toBe(true);
      });
    });

    it('should reject passwords with unsupported special characters', () => {
      expect(service.validateStrength('Test+1234')).toBe(false);
      expect(service.validateStrength('Test=1234')).toBe(false);
    });
  });

  describe('generateRandom', () => {
    it('should generate password with default length of 12', () => {
      const password = service.generateRandom();
      expect(password).toBeDefined();
      expect(password.length).toBe(12);
      // Check that it only contains valid characters
      const validChars = /^[ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%^&*]+$/;
      expect(validChars.test(password)).toBe(true);
    });

    it('should generate password with custom length', () => {
      const password = service.generateRandom(16);
      expect(password.length).toBe(16);
      const validChars = /^[ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%^&*]+$/;
      expect(validChars.test(password)).toBe(true);
    });

    it('should generate password with 8 characters', () => {
      const password = service.generateRandom(8);
      expect(password.length).toBe(8);
      const validChars = /^[ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%^&*]+$/;
      expect(validChars.test(password)).toBe(true);
    });

    it('should generate different passwords each time', () => {
      const password1 = service.generateRandom();
      const password2 = service.generateRandom();

      expect(password1).not.toBe(password2);
    });

    it('should generate passwords that contain valid characters', () => {
      // Generate multiple passwords and check they all contain valid characters
      for (let i = 0; i < 10; i++) {
        const password = service.generateRandom();
        const validChars = /^[ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%^&*]+$/;
        expect(validChars.test(password)).toBe(true);
        expect(password.length).toBe(12);
      }
    });

    it('should handle edge case of minimum length', () => {
      const password = service.generateRandom(8);
      expect(password.length).toBe(8);
      const validChars = /^[ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%^&*]+$/;
      expect(validChars.test(password)).toBe(true);
    });

    it('should generate valid password with length 20', () => {
      const password = service.generateRandom(20);
      expect(password.length).toBe(20);
      const validChars = /^[ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%^&*]+$/;
      expect(validChars.test(password)).toBe(true);
    });
  });

  describe('integration tests', () => {
    it('should hash and verify random password', async () => {
      const randomPassword = service.generateRandom();
      const hashedPassword = await service.hash(randomPassword);
      const isValid = await service.compare(randomPassword, hashedPassword);

      expect(isValid).toBe(true);
    });

    it('should work with complete password workflow', async () => {
      const password = 'Secure@Pass123';
      const isValidFormat = service.validateStrength(password);
      expect(isValidFormat).toBe(true);

      const hashedPassword = await service.hash(password);
      expect(hashedPassword).toBeDefined();
      expect(hashedPassword).not.toBe(password);

      const isCorrect = await service.compare(password, hashedPassword);
      expect(isCorrect).toBe(true);

      const isWrong = await service.compare('Wrong@Pass123', hashedPassword);
      expect(isWrong).toBe(false);
    });
  });
});
