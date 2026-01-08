import {
  IsString,
  IsOptional,
  IsNumber,
  IsEnum,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum SyncStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export class SyncRequestDto {
  @ApiProperty({
    description: 'Base app token for Feishu Bitable',
    example: 'X3kVbw0fRapfjMsIW1AcN2MvnLe',
  })
  @IsNotEmpty()
  @IsString()
  base_app_token: string;

  @ApiProperty({
    description: 'Table ID to sync from',
    example: 'tblz3wXPfgHVmLG0',
  })
  @IsNotEmpty()
  @IsString()
  table_id: string;

  @ApiPropertyOptional({
    description: 'Batch size for processing records',
    example: 100,
    minimum: 1,
    maximum: 1000,
  })
  @IsOptional()
  @IsNumber()
  batch_size?: number;

  @ApiPropertyOptional({
    description: 'Number of retry attempts',
    example: 3,
    minimum: 0,
    maximum: 10,
  })
  @IsOptional()
  @IsNumber()
  retry_times?: number;
}

export class SyncStatusQueryDto {
  @ApiPropertyOptional({
    description: 'Filter by sync status',
    enum: SyncStatus,
    example: SyncStatus.PROCESSING,
  })
  @IsOptional()
  @IsEnum(SyncStatus)
  status?: SyncStatus;

  @ApiPropertyOptional({
    description: 'Limit number of results',
    example: 50,
    minimum: 1,
    maximum: 1000,
  })
  @IsOptional()
  @IsNumber()
  limit?: number;

  @ApiPropertyOptional({
    description: 'Offset for pagination',
    example: 0,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  offset?: number;
}

export class SyncResponseDto {
  @ApiProperty({
    description: 'Sync job ID',
    example: 'sync_job_123456',
  })
  job_id: string;

  @ApiProperty({
    description: 'Current sync status',
    enum: SyncStatus,
    example: SyncStatus.PROCESSING,
  })
  status: SyncStatus;

  @ApiProperty({
    description: 'Total records to process',
    example: 1000,
  })
  total_records: number;

  @ApiProperty({
    description: 'Number of processed records',
    example: 500,
  })
  processed_records: number;

  @ApiProperty({
    description: 'Number of failed records',
    example: 2,
  })
  failed_records: number;

  @ApiProperty({
    description: 'Error message if sync failed',
    example: 'Connection timeout',
    required: false,
  })
  @IsOptional()
  error?: string;

  @ApiProperty({
    description: 'Sync start time',
    example: '2024-01-01T10:00:00Z',
  })
  start_time: string;

  @ApiProperty({
    description: 'Sync end time (if completed)',
    example: '2024-01-01T10:05:00Z',
    required: false,
  })
  @IsOptional()
  end_time?: string;
}
