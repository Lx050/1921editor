import { IsNotEmpty, IsString, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum ImageType {
  TITLE = 'title',
  SUBTITLE = 'subtitle',
  BODY = 'body',
  QUOTE = 'quote',
}

export class GenerateImageDto {
  @ApiProperty({
    description: '要生成图片的文字内容',
    example: '弘扬建党精神',
  })
  @IsNotEmpty()
  @IsString()
  text: string;

  @ApiProperty({
    description: '图片类型',
    enum: ImageType,
    example: ImageType.TITLE,
  })
  @IsNotEmpty()
  @IsEnum(ImageType)
  type: ImageType;

  @ApiPropertyOptional({
    description: '图片风格',
    example: 'minimalist',
    enum: ['minimalist', 'cyberpunk', 'ink'],
  })
  @IsOptional()
  @IsString()
  style?: string;
}
