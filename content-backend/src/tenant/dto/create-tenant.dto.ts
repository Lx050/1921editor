import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  Matches,
  IsDateString,
} from 'class-validator';

export class CreateTenantDto {
  @ApiProperty({ description: '租户名称', example: '西大青媒' })
  @IsString()
  @MinLength(1, { message: 'name is required' })
  name: string;

  @ApiProperty({
    description: '租户标识（URL 友好）',
    example: 'xida-qingmei',
  })
  @IsString()
  @MinLength(1, { message: 'slug is required' })
  @Matches(/^[\p{L}\p{N}-]+$/u, {
    message: '组织标识仅支持中文、英文、数字和短横线',
  })
  slug: string;

  @ApiPropertyOptional({
    description: '邀请码（可自定义，留空自动生成）',
    example: '一见青心，媒你不行',
  })
  @IsOptional()
  @IsString()
  @MaxLength(64)
  inviteCode?: string;

  @ApiPropertyOptional({
    description: '邀请码过期时间（ISO 格式，留空永久有效）',
    example: '2026-12-31T23:59:59.000Z',
  })
  @IsOptional()
  @IsDateString()
  inviteCodeExpires?: string;

  @ApiPropertyOptional({
    description: '公众号 AppId',
    example: 'wxc75aebc24fb0d06a',
  })
  @IsOptional()
  @IsString()
  wechatAppId?: string;

  @ApiPropertyOptional({
    description: '公众号 AppSecret',
  })
  @IsOptional()
  @IsString()
  wechatAppSecret?: string;
}
