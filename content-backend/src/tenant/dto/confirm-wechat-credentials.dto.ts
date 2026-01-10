import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class ConfirmWechatCredentialsDto {
  @ApiProperty({ description: '确认 token' })
  @IsString()
  @MinLength(1)
  token: string;
}
