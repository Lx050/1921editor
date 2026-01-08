import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * 用户注册 DTO
 */
export class RegisterDto {
  @ApiProperty({ description: '邮箱地址', example: 'user@example.com' })
  @IsEmail({}, { message: '邮箱格式不正确' })
  email: string;

  @ApiProperty({ description: '密码', example: 'SecurePassword123!' })
  @IsString()
  @MinLength(8, { message: '密码至少8位' })
  password: string;

  @ApiProperty({ description: '用户名称', example: '张三' })
  @IsString()
  name: string;

  @ApiProperty({
    description: '租户邀请码（可选，用于加入已有租户）',
    example: 'ABCD1234EF56',
    required: false,
  })
  @IsOptional()
  @IsString()
  inviteCode?: string;
}
