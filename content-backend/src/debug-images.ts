import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Article } from './entities/article.entity';
import { DataSource } from 'typeorm';
import * as fs from 'fs';

async function debugImages() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);
  const articleRepo = dataSource.getRepository(Article);

  console.log('🔍 检查所有文章的图片数据...');

  const articles = await articleRepo.find({
    select: ['id', 'title', 'images', 'updatedAt'],
    order: { updatedAt: 'DESC' },
    take: 5,
  });

  const results = articles.map((a) => ({
    id: a.id,
    title: a.title?.substring(0, 30),
    updatedAt: a.updatedAt,
    imagesCount: a.images?.length || 0,
    // 显示完整的图片数据用于调试
    images: a.images,
  }));

  fs.writeFileSync('image_debug.json', JSON.stringify(results, null, 2));
  console.log('✅ 结果已写入 image_debug.json');
  console.log(JSON.stringify(results, null, 2));

  await app.close();
}

debugImages();
