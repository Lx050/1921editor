import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

export class UpdateInviteCodeDto {
  @ApiProperty({
    description: '自定义邀请码（支持中文）',
    example: '一见青心，媒你不行',
  })
  @IsString()
  @MaxLength(64, { message: '邀请码长度不能超过64位' })
  inviteCode: string;
}
