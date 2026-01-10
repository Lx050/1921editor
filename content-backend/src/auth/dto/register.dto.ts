import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  IsBoolean,
  Matches,
  ValidateIf,
} from 'class-validator';
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

  @ApiProperty({
    description: '是否创建新组织',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  createTenant?: boolean;

  @ApiProperty({
    description: '新组织名称（创建组织时必填）',
    example: '西大青媒',
    required: false,
  })
  @IsOptional()
  @ValidateIf((_, value) => value !== undefined && value !== null && value !== '')
  @IsString()
  tenantName?: string;

  @ApiProperty({
    description: '新组织标识（创建组织时必填）',
    example: 'xida-qingmei',
    required: false,
  })
  @IsOptional()
  @ValidateIf((_, value) => value !== undefined && value !== null && value !== '')
  @IsString()
  @Matches(/^[\p{L}\p{N}-]+$/u, {
    message: '组织标识仅支持中文、英文、数字和短横线',
  })
  tenantSlug?: string;

  @ApiProperty({
    description: '新组织公众号 AppID（创建组织时必填）',
    example: 'wxc75aebc24fb0d06a',
    required: false,
  })
  @IsOptional()
  @ValidateIf((_, value) => value !== undefined && value !== null && value !== '')
  @IsString()
  wechatAppId?: string;

  @ApiProperty({
    description: '新组织公众号 AppSecret（创建组织时必填）',
    required: false,
  })
  @IsOptional()
  @ValidateIf((_, value) => value !== undefined && value !== null && value !== '')
  @IsString()
  wechatAppSecret?: string;
}
