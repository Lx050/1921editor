import { IsString, IsOptional, IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../entities/user.entity';

export class LoginResponseDto {
  @ApiProperty({
    description: 'JWT access token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  access_token: string;

  @ApiProperty({
    description: 'User information',
    example: {
      id: '123e4567-e89b-12d3-a456-426614174000',
      name: 'John Doe',
      role: 'EDITOR',
      email: 'john@example.com',
    },
  })
  user: {
    id: string;
    name: string;
    role: UserRole;
    email?: string;
  };
}

export class FeishuWebhookEventDto {
  @ApiProperty({
    description: 'Event type',
    example: 'im.message.receive_v1',
  })
  @IsString()
  type: string;

  @ApiProperty({
    description: 'Challenge token for URL verification',
    example: 'your_challenge_token',
    required: false,
  })
  @IsOptional()
  @IsString()
  challenge?: string;

  @ApiProperty({
    description: 'Event header information',
    example: {
      event_type: 'im.message.receive_v1',
      tenant_key: 'tenant_123',
      app_id: 'app_456',
      create_time: '1640995200',
    },
  })
  header?: object;

  @ApiProperty({
    description: 'Event data',
    example: {
      message: {
        message_id: 'om_123456',
        chat_id: 'oc_7890',
        chat_type: 'group',
        content: 'Hello World',
      },
    },
  })
  event?: object;
}
