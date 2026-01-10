import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class SwitchTenantDto {
  @ApiProperty({
    description: '目标租户 ID',
    example: '00000000-0000-0000-0000-000000000001',
  })
  @IsUUID('4', { message: 'tenantId must be a UUID' })
  tenantId: string;
}
