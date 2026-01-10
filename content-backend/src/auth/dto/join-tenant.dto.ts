import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class JoinTenantDto {
  @ApiProperty({
    description: '组织邀请码',
    example: '一见青心，媒你不行',
  })
  @IsString()
  @MaxLength(64, { message: '邀请码长度不能超过64位' })
  inviteCode: string;

  @ApiProperty({
    description: '加入组织时的成员显示名称',
    example: '西大青媒-小李',
  })
  @IsString()
  @IsNotEmpty({ message: '成员名称不能为空' })
  @MaxLength(64, { message: '成员名称长度不能超过64位' })
  displayName: string;
}
