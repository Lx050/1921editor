import { IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * 邮箱验证 DTO
 */
export class VerifyEmailDto {
  @ApiProperty({ description: '验证令牌', example: '550e8400-e29b-41d4-a716-446655440000' })
  @IsUUID('4', { message: '令牌格式不正确' })
  token: string;
}
