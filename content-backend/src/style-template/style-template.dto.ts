import {
  IsString,
  IsEnum,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import type { StyleType } from '../entities/style-template.entity';

export class CreateStyleTemplateDto {
  @ApiProperty({ description: '样式模板名称', example: '标准标题' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: '样式类型',
    enum: ['title', 'body', 'intro'],
    example: 'title',
  })
  @IsEnum(['title', 'body', 'intro'])
  @IsNotEmpty()
  type: StyleType;

  @ApiProperty({
    description: '预览 HTML',
    example: '<h1 style="color: #333;">标题</h1>',
  })
  @IsString()
  @IsNotEmpty()
  preview: string;

  @ApiProperty({
    description: '完整示例 HTML',
    example: '<h1 style="color: #333; font-size: 24px;">完整标题示例</h1>',
  })
  @IsString()
  @IsNotEmpty()
  fullExample: string;

  @ApiPropertyOptional({
    description: '是否为自定义样式',
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  isCustom?: boolean;
}

export class UpdateStyleTemplateDto {
  @ApiPropertyOptional({ description: '样式模板名称', example: '标准标题' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    description: '样式类型',
    enum: ['title', 'body', 'intro'],
    example: 'title',
  })
  @IsEnum(['title', 'body', 'intro'])
  @IsOptional()
  type?: StyleType;

  @ApiPropertyOptional({
    description: '预览 HTML',
    example: '<h1 style="color: #333;">标题</h1>',
  })
  @IsString()
  @IsOptional()
  preview?: string;

  @ApiPropertyOptional({
    description: '完整示例 HTML',
    example: '<h1 style="color: #333; font-size: 24px;">完整标题示例</h1>',
  })
  @IsString()
  @IsOptional()
  fullExample?: string;
}
