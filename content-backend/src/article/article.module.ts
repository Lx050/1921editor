import { Module, forwardRef } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';
import { FileCleanupService } from './file-cleanup.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from '../entities/article.entity';
import { User } from '../entities/user.entity';
import { FeishuModule } from '../feishu/feishu.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Article, User]),
    forwardRef(() => FeishuModule),
  ],
  controllers: [ArticleController],
  providers: [ArticleService, FileCleanupService],
  exports: [ArticleService],
})
export class ArticleModule {}
