import { Module } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';
import { FileCleanupService } from './file-cleanup.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from '../entities/article.entity';
import { User } from '../entities/user.entity';
import { TenantModule } from '../tenant/tenant.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Article, User]),
    TenantModule,
  ],
  controllers: [ArticleController],
  providers: [ArticleService, FileCleanupService],
  exports: [ArticleService],
})
export class ArticleModule {}
