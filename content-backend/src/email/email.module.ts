import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { ArticleModule } from '../article/article.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ArticleModule, ConfigModule],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
