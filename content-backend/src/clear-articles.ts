import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Article } from './entities/article.entity';
import { DataSource } from 'typeorm';

async function clearArticles() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);
  const articleRepo = dataSource.getRepository(Article);

  console.log('🗑️ 正在清除所有文章...');

  // 使用 delete 而不是 clear，以触发任何相关的 cascade 或钩子（如果有）
  // 但为了彻底清除，clear() 或者 query('TRUNCATE') 更快。
  // 考虑到安全性，我们先 count 一下。
  const count = await articleRepo.count();
  console.log(`📊 当前共有 ${count} 篇文章`);

  if (count > 0) {
    await articleRepo.clear(); // 清空表
    console.log('✅ 所有文章已删除！');
  } else {
    console.log('⚠️ 数据库已经是空的。');
  }

  await app.close();
}

clearArticles();
