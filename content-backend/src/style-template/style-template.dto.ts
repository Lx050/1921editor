import { IsString, IsEnum, IsBoolean, IsNotEmpty, IsOptional } from 'class-validator';
import type { StyleType } from '../entities/style-template.entity';

export class CreateStyleTemplateDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsEnum(['title', 'body', 'intro'])
    @IsNotEmpty()
    type: StyleType;

    @IsString()
    @IsNotEmpty()
    preview: string;

    @IsString()
    @IsNotEmpty()
    fullExample: string;

    @IsBoolean()
    @IsOptional()
    isCustom?: boolean;
}

export class UpdateStyleTemplateDto {
    @IsString()
    @IsOptional()
    name?: string;

    @IsEnum(['title', 'body', 'intro'])
    @IsOptional()
    type?: StyleType;

    @IsString()
    @IsOptional()
    preview?: string;

    @IsString()
    @IsOptional()
    fullExample?: string;
}
