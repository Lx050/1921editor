import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * 修改密码 DTO
 */
export class ChangePasswordDto {
  @ApiProperty({ description: '当前密码', example: 'OldPassword123!' })
  @IsString()
  @MinLength(1, { message: '当前密码不能为空' })
  oldPassword: string;

  @ApiProperty({ description: '新密码', example: 'NewSecurePassword456!' })
  @IsString()
  @MinLength(8, { message: '新密码至少8位' })
  newPassword: string;
}
