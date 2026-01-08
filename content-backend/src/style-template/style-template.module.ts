import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StyleTemplate } from '../entities/style-template.entity';
import { StyleTemplateService } from './style-template.service';
import { StyleTemplateController } from './style-template.controller';

@Module({
    imports: [TypeOrmModule.forFeature([StyleTemplate])],
    controllers: [StyleTemplateController],
    providers: [StyleTemplateService],
    exports: [StyleTemplateService],
})
export class StyleTemplateModule { }
