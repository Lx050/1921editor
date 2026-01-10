import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class RequestWechatCredentialsDto {
  @ApiProperty({ description: '公众号 AppID' })
  @IsString()
  @MinLength(1)
  appId: string;

  @ApiProperty({ description: '公众号 AppSecret' })
  @IsString()
  @MinLength(1)
  appSecret: string;
}
