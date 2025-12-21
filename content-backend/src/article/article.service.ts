import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article, ArticleStatus } from '../entities/article.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class ArticleService {
  private readonly logger = new Logger(ArticleService.name);

  constructor(
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) { }

  async create(title: string, metadata?: Partial<Article>) {
    const article = this.articleRepository.create({
      title,
      status: ArticleStatus.DRAFT,
      ...metadata,
    });
    return this.articleRepository.save(article);
  }

  async findOne(id: string) {
    const article = await this.articleRepository.findOne({ where: { id } });
    if (!article) throw new NotFoundException('Article not found');
    return article;
  }

  async updateStep1(id: string, config: any) {
    await this.articleRepository.update(id, {
      config,
    });
    return this.findOne(id);
  }

  async updateStep2(id: string, content: string) {
    await this.articleRepository.update(id, {
      content,
      status: ArticleStatus.PARSED,
    });
    return this.findOne(id);
  }

  async updateStep3(id: string, images: any[]) {
    await this.articleRepository.update(id, {
      images,
      status: ArticleStatus.ADJUSTED,
    });
    return this.findOne(id);
  }

  async publish(id: string) {
    // TODO: Simulate WeChat Publish
    const result = {
      wechat_url: `https://mp.weixin.qq.com/s/mock_${id}`,
      status: 'success',
      published_at: new Date(),
    };

    await this.articleRepository.update(id, {
      wechatResult: result as any,
      status: ArticleStatus.PUBLISHED,
    });
    return this.findOne(id);
  }

  async findAll(user: User) {
    return this.articleRepository.find({
      where: { ownerId: user.id },
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * 删除 Article（注意：文件清理由 FileCleanupService 处理）
   */
  async delete(id: string): Promise<void> {
    const article = await this.findOne(id);
    await this.articleRepository.remove(article);
    this.logger.log(`Article ${id} deleted`);
  }

  /**
   * 软删除（标记为已删除，保留数据）
   */
  async softDelete(id: string): Promise<void> {
    await this.articleRepository.update(id, {
      status: ArticleStatus.DRAFT, // 或者添加一个 DELETED 状态
      // deletedAt: new Date() // 如果 Entity 有 deletedAt 字段
    });
    this.logger.log(`Article ${id} soft deleted`);
  }
}
