import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article, ArticleStatus } from '../entities/article.entity';
import { User } from '../entities/user.entity';

import { ArticleSyncService } from '../sync/article-sync.service';
import { TenantService } from '../tenant/tenant.service';

@Injectable()
export class ArticleService {
  private readonly logger = new Logger(ArticleService.name);

  constructor(
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly articleSyncService: ArticleSyncService,
    private readonly tenantService: TenantService,
  ) {}

  private async triggerSync(id: string) {
    try {
      const article = await this.articleRepository.findOne({
        where: { id },
        relations: ['owner', 'tenant'],
      });
      if (article && article.tenant) {
        await this.articleSyncService.syncArticleToFeishu(
          article,
          article.tenant,
        );
      }
    } catch (error) {
      this.logger.warn(`同步文章到飞书失�? ${error.message}`);
    }
  }

  /**
   * 将用户添加到指定角色的参与者列表中（去重）
   */
  private async addParticipant(
    articleId: string,
    userId: string,
    role: 'planners' | 'copywriters' | 'editors',
  ) {
    const article = await this.articleRepository.findOne({
      where: { id: articleId },
    });
    if (!article) return;

    const participants = article[role] || [];
    if (!participants.includes(userId)) {
      participants.push(userId);
      await this.articleRepository.update(articleId, { [role]: participants });
      this.logger.log(
        `👤 自动记录参与�? 用户 ${userId} 已加入文�?${articleId} �?${role} 列表`,
      );
    }
  }

  /**
   * 获取参与者姓名列�?
   */
  private async getParticipantNames(userIds: string[]): Promise<string[]> {
    if (!userIds || userIds.length === 0) return [];
    const users = await this.userRepository
      .createQueryBuilder('user')
      .where('user.id IN (:...ids)', { ids: userIds })
      .getMany();

    // 按原�?ID 顺序排序姓名
    const nameMap = new Map(users.map((u) => [u.id, u.name || u.email]));
    return userIds.map((id) => nameMap.get(id)).filter(Boolean) as string[];
  }

  async create(title: string, metadata?: Partial<Article>) {
    this.logger.log(
      `📝 创建文章 - 标题: ${title}, 元数�? ${JSON.stringify(metadata)}`,
    );

    const planners = metadata?.planners || [];
    if (metadata?.ownerId && !planners.includes(metadata.ownerId)) {
      planners.push(metadata.ownerId);
    }

    const article = this.articleRepository.create({
      title,
      status: ArticleStatus.DRAFT,
      ...metadata,
      planners,
    });

    const savedArticle = await this.articleRepository.save(article);
    this.logger.log(
      `�?文章创建成功 - ID: ${savedArticle.id}, 所有�? ${savedArticle.ownerId}, 租户: ${savedArticle.tenantId}`,
    );

    this.triggerSync(savedArticle.id); // 异步触发同步

    return savedArticle;
  }

  async findOne(id: string) {
    const article = await this.articleRepository.findOne({ where: { id } });
    if (!article) throw new NotFoundException('Article not found');

    // 附加参与者姓�?
    const [plannerNames, copywriterNames, editorNames] = await Promise.all([
      this.getParticipantNames(article.planners || []),
      this.getParticipantNames(article.copywriters || []),
      this.getParticipantNames(article.editors || []),
    ]);

    return {
      ...article,
      plannerNames,
      copywriterNames,
      editorNames,
    };
  }

  async updateStep1(id: string, config: any, userId?: string) {
    if (userId) await this.addParticipant(id, userId, 'editors');
    await this.articleRepository.update(id, {
      config,
      updatedAt: new Date(),
    });
    this.triggerSync(id);
    return this.findOne(id);
  }

  async updateStep2(id: string, content: string, userId?: string) {
    if (userId) await this.addParticipant(id, userId, 'editors');
    await this.articleRepository.update(id, {
      content,
      status: ArticleStatus.PARSED,
      updatedAt: new Date(),
    });
    this.triggerSync(id);
    return this.findOne(id);
  }

  async updateStep3(id: string, images: any[], userId?: string) {
    this.logger.log(
      `[updateStep3] 🖼�?保存图片 - 文章ID: ${id}, 用户ID: ${userId}, 图片数量: ${images?.length || 0}`,
    );
    this.logger.log(
      `[updateStep3] 图片数据: ${JSON.stringify(images?.slice(0, 2))}`,
    ); // 只打印前2�?

    if (userId) await this.addParticipant(id, userId, 'editors');
    await this.articleRepository.update(id, {
      images,
      status: ArticleStatus.ADJUSTED,
      updatedAt: new Date(),
    });

    this.logger.log(`[updateStep3] �?图片保存成功 - 文章ID: ${id}`);
    this.triggerSync(id);
    return this.findOne(id);
  }

  // Step3 内容保存 - 设置状态为 ADJUSTED
  async updateStep3Content(id: string, content: string, userId?: string) {
    this.logger.log(
      `[updateStep3Content] 开始保�?- ID: ${id}, 用户ID: ${userId}`,
    );

    // 先验证文章存�?
    const existingArticle = await this.articleRepository.findOne({
      where: { id },
    });
    if (!existingArticle) {
      this.logger.error(`[updateStep3Content] 文章不存�?- ID: ${id}`);
      throw new NotFoundException('Article not found');
    }

    this.logger.log(`[updateStep3Content] 文章存在: ${existingArticle.title}`);

    if (userId) await this.addParticipant(id, userId, 'editors');
    await this.articleRepository.update(id, {
      content,
      status: ArticleStatus.ADJUSTED,
      updatedAt: new Date(),
    });
    this.logger.log(
      `[updateStep3Content] 更新成功 - ID: ${id}, 状�? ADJUSTED`,
    );
    this.triggerSync(id);
    return this.findOne(id);
  }

  async publish(id: string, userId?: string) {
    if (userId) await this.addParticipant(id, userId, 'editors');
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
    this.triggerSync(id);
    return this.findOne(id);
  }

  async findAll(user: User) {
    this.logger.log(
      `🔍 查询文章列表 - 用户ID: ${user?.id ?? 'anonymous'}, 租户ID: ${user.tenantId}`,
    );

    // 按租户查询所有文章（同一组织共享文章池）
    const articles = await this.articleRepository.find({
      where: {
        tenantId: user.tenantId, // 只按租户过滤，不按个人过�?
      },
      relations: ['owner'], // 加载文章所有者信�?
      order: { createdAt: 'DESC' },
    });

    this.logger.log(`📋 找到 ${articles.length} 篇文章（租户共享）`);
    articles.forEach((article, index) => {
      this.logger.log(
        `  ${index + 1}. ${article.title} (${article.status}) - 创建�? ${article.owner?.name || article.ownerId}`,
      );
    });

    return articles;
  }

  async findAllByTenant(tenantId: string) {
    this.logger.log(`🔍 查询文章列表 - 租户ID: ${tenantId} (public)`);

    const articles = await this.articleRepository.find({
      where: {
        tenantId,
      },
      relations: ['owner'],
      order: { createdAt: 'DESC' },
    });

    this.logger.log(
      `📋 找到 ${articles.length} 篇文章（租户共享）`,
    );

    return articles;
  }

  /**
   * 删除 Article（注意：文件清理�?FileCleanupService 处理�?
   */
  async delete(id: string): Promise<void> {
    const article = await this.findOne(id);
    await this.articleRepository.remove(article);
    this.logger.log(`Article ${id} deleted`);
  }

  /**
   * 保存文章草稿
   */
  async saveDraft(id: string, user?: User) {
    const article = await this.articleRepository.findOne({
      where: user?.id && user?.tenantId
        ? { id, ownerId: user.id, tenantId: user.tenantId }
        : { id },
    });

    if (!article) {
      throw new NotFoundException('Article not found');
    }

    // 确保文章状态为草稿
    if (article.status !== ArticleStatus.DRAFT) {
      await this.articleRepository.update(id, {
        status: ArticleStatus.DRAFT,
        updatedAt: new Date(),
      });
      this.logger.log(`Article ${id} saved as draft by user ${user?.id ?? 'anonymous'}`);
    } else {
      // 更新修改时间
      await this.articleRepository.update(id, {
        updatedAt: new Date(),
      });
      this.logger.log(`Draft ${id} updated by user ${user?.id ?? 'anonymous'}`);
    }

    if (user?.id) await this.addParticipant(id, user.id, 'editors');

    this.triggerSync(id);

    return this.findOne(id);
  }

  /**
   * 软删除（标记为已删除，保留数据）
   */
  async softDelete(id: string): Promise<void> {
    await this.articleRepository.update(id, {
      status: ArticleStatus.DRAFT, // 或者添加一�?DELETED 状�?
      // deletedAt: new Date() // 如果 Entity �?deletedAt 字段
    });
    this.logger.log(`Article ${id} soft deleted`);
  }
}

