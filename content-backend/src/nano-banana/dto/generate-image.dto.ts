import { IsNotEmpty, IsString, IsEnum, IsOptional } from 'class-validator';

export enum ImageType {
  TITLE = 'title',
  SUBTITLE = 'subtitle',
  BODY = 'body',
  QUOTE = 'quote',
}

export class GenerateImageDto {
  @IsNotEmpty()
  @IsString()
  text: string;

  @IsNotEmpty()
  @IsEnum(ImageType)
  type: ImageType;

  @IsOptional()
  @IsString()
  style?: string; // e.g. 'minimalist', 'cyberpunk', 'ink'
}
