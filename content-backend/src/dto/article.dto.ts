import { IsString, IsNotEmpty, MaxLength, IsOptional, IsObject, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateArticleDto {
  @ApiProperty({
    description: '文章标题',
    example: '微信公众号排版指南',
    maximum: 200,
  })
  @IsString({ message: '标题必须是字符串' })
  @IsNotEmpty({ message: '标题不能为空' })
  @MaxLength(200, { message: '标题不能超过200个字符' })
  title: string;

  @ApiProperty({
    description: '内容策划人员 ID 列表',
    required: false,
    example: ['user-uuid-1'],
  })
  @IsOptional()
  @IsArray()
  planners?: string[];

  @ApiProperty({
    description: '文案撰稿人员 ID 列表',
    required: false,
    example: ['user-uuid-2'],
  })
  @IsOptional()
  @IsArray()
  copywriters?: string[];

  @ApiProperty({
    description: '文章编辑人员 ID 列表',
    required: false,
    example: ['user-uuid-3'],
  })
  @IsOptional()
  @IsArray()
  editors?: string[];

  @ApiProperty({
    description: '样式配置',
    required: false,
    example: { theme: 'default', fontSize: 16 },
  })
  @IsOptional()
  @IsObject({ message: '配置必须是对象' })
  config?: Record<string, any>;
}

export class UpdateArticleConfigDto {
  @ApiProperty({
    description: '样式配置',
    example: { theme: 'dark', fontSize: 18, lineHeight: 1.8 },
  })
  @IsObject({ message: '配置必须是对象' })
  config: Record<string, any>;
}

export class UpdateArticleContentDto {
  @ApiProperty({
    description: '文章内容',
    example: '这是文章的正文内容...',
  })
  @IsString({ message: '内容必须是字符串' })
  @IsNotEmpty({ message: '内容不能为空' })
  content: string;
}

export class UpdateArticleImagesDto {
  @ApiProperty({
    description: '图片列表',
    example: [{ name: 'image1.jpg', url: '/uploads/image1.jpg' }],
  })
  @IsObject({ message: '图片列表必须是数组', each: true })
  images: any[];
}
