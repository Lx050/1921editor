import { IsString, MinLength, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * 重置密码 DTO
 */
export class ResetPasswordDto {
  @ApiProperty({
    description: '重置令牌',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID('4', { message: '令牌格式不正确' })
  token: string;

  @ApiProperty({ description: '新密码', example: 'NewSecurePassword456!' })
  @IsString()
  @MinLength(8, { message: '密码至少8位' })
  newPassword: string;
}
