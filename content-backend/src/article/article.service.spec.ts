import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ArticleService } from './article.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article, ArticleStatus } from '../entities/article.entity';
import { User } from '../entities/user.entity';
import { BitableSyncService } from '../feishu/bitable-sync.service';

describe('ArticleService', () => {
  let service: ArticleService;
  let articleRepository: jest.Mocked<Repository<Article>>;
  let userRepository: jest.Mocked<Repository<User>>;
  let bitableSyncService: jest.Mocked<BitableSyncService>;

  const mockArticleRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    findAndCount: jest.fn(),
    remove: jest.fn(),
  };

  const mockUserRepository = {
    createQueryBuilder: jest.fn(),
  };

  const mockBitableSyncService = {
    triggerArticleSync: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArticleService,
        {
          provide: getRepositoryToken(Article),
          useValue: mockArticleRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: BitableSyncService,
          useValue: mockBitableSyncService,
        },
      ],
    }).compile();

    service = module.get<ArticleService>(ArticleService);
    articleRepository = module.get(getRepositoryToken(Article));
    userRepository = module.get(getRepositoryToken(User));
    bitableSyncService = module.get(BitableSyncService);

    // Clear mock calls before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an article with title and metadata', async () => {
      const mockArticle = {
        id: 'test-id',
        title: 'Test Article',
        status: ArticleStatus.DRAFT,
        tenantId: 'tenant-1',
        ownerId: 'user-1',
        planners: ['user-1'],
      };

      mockArticleRepository.create.mockReturnValue(mockArticle as any);
      mockArticleRepository.save.mockResolvedValue(mockArticle as any);

      const result = await service.create('Test Article', {
        tenantId: 'tenant-1',
        ownerId: 'user-1',
      });

      expect(result).toEqual(mockArticle);
      expect(mockArticleRepository.create).toHaveBeenCalled();
      expect(mockArticleRepository.save).toHaveBeenCalled();
      expect(bitableSyncService.triggerArticleSync).toHaveBeenCalledWith('test-id');
    });

    it('should add ownerId to planners if not present', async () => {
      const mockArticle = {
        id: 'test-id',
        title: 'Test Article',
        status: ArticleStatus.DRAFT,
        tenantId: 'tenant-1',
        ownerId: 'user-1',
        planners: ['user-1'],
      };

      mockArticleRepository.create.mockReturnValue(mockArticle as any);
      mockArticleRepository.save.mockResolvedValue(mockArticle as any);

      await service.create('Test Article', {
        tenantId: 'tenant-1',
        ownerId: 'user-1',
        planners: [],
      });

      expect(mockArticleRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          planners: ['user-1'],
        }),
      );
    });
  });

  describe('assertTenantAccess', () => {
    it('should return article if tenant has access', async () => {
      const mockArticle = {
        id: 'article-1',
        tenantId: 'tenant-1',
      };

      mockArticleRepository.findOne.mockResolvedValue(mockArticle as any);

      const result = await service.assertTenantAccess('article-1', 'tenant-1');

      expect(result).toEqual(mockArticle);
      expect(mockArticleRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'article-1', tenantId: 'tenant-1' },
      });
    });

    it('should throw NotFoundException if article not found', async () => {
      mockArticleRepository.findOne.mockResolvedValue(null);

      await expect(
        service.assertTenantAccess('article-1', 'tenant-1'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('findOne', () => {
    it('should return article with participant names', async () => {
      const mockArticle = {
        id: 'article-1',
        title: 'Test Article',
        planners: ['user-1', 'user-2'],
        copywriters: ['user-3'],
        editors: ['user-4'],
      };

      const mockUsers = [
        { id: 'user-1', name: 'User 1', email: 'user1@test.com' },
        { id: 'user-2', name: 'User 2', email: 'user2@test.com' },
        { id: 'user-3', name: 'User 3', email: 'user3@test.com' },
        { id: 'user-4', name: 'User 4', email: 'user4@test.com' },
      ];

      mockArticleRepository.findOne.mockResolvedValue(mockArticle as any);

      const queryBuilderMock = {
        where: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(mockUsers),
      };

      (userRepository.createQueryBuilder as jest.Mock).mockReturnValue(
        queryBuilderMock as any,
      );

      const result = await service.findOne('article-1', 'tenant-1');

      expect(result).toEqual(
        expect.objectContaining({
          plannerNames: ['User 1', 'User 2'],
          copywriterNames: ['User 3'],
          editorNames: ['User 4'],
        }),
      );
    });

    it('should throw NotFoundException if article not found', async () => {
      mockArticleRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('article-1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateStep1', () => {
    it('should update article config', async () => {
      const mockArticle = {
        id: 'article-1',
        title: 'Test Article',
      };

      mockArticleRepository.findOne.mockResolvedValue(mockArticle as any);
      mockArticleRepository.update.mockResolvedValue(undefined);
      mockArticleRepository.findOne.mockResolvedValue(mockArticle as any);

      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([]),
      };
      (userRepository.createQueryBuilder as jest.Mock).mockReturnValue(
        mockQueryBuilder as any,
      );

      await service.updateStep1('article-1', { theme: 'dark' }, 'user-1', 'tenant-1');

      expect(mockArticleRepository.update).toHaveBeenCalledWith(
        { id: 'article-1', tenantId: 'tenant-1' },
        expect.objectContaining({
          config: { theme: 'dark' },
        }),
      );
      expect(bitableSyncService.triggerArticleSync).toHaveBeenCalledWith('article-1');
    });
  });

  describe('updateStep2', () => {
    it('should update article content', async () => {
      const mockArticle = {
        id: 'article-1',
        title: 'Test Article',
      };

      mockArticleRepository.findOne.mockResolvedValue(mockArticle as any);
      mockArticleRepository.update.mockResolvedValue(undefined);

      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([]),
      };
      (userRepository.createQueryBuilder as jest.Mock).mockReturnValue(
        mockQueryBuilder as any,
      );

      await service.updateStep2('article-1', '<p>New content</p>', 'user-1', 'tenant-1');

      expect(mockArticleRepository.update).toHaveBeenCalledWith(
        { id: 'article-1', tenantId: 'tenant-1' },
        expect.objectContaining({
          content: '<p>New content</p>',
          status: ArticleStatus.PARSED,
        }),
      );
    });
  });

  describe('updateStep3', () => {
    it('should update article images', async () => {
      const mockArticle = {
        id: 'article-1',
        title: 'Test Article',
      };

      const mockImages = [
        { url: 'https://example.com/image1.jpg', mediaId: 'media-1' },
        { url: 'https://example.com/image2.jpg', mediaId: 'media-2' },
      ];

      mockArticleRepository.findOne.mockResolvedValue(mockArticle as any);
      mockArticleRepository.update.mockResolvedValue(undefined);

      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([]),
      };
      (userRepository.createQueryBuilder as jest.Mock).mockReturnValue(
        mockQueryBuilder as any,
      );

      await service.updateStep3('article-1', mockImages, 'user-1', 'tenant-1');

      expect(mockArticleRepository.update).toHaveBeenCalledWith(
        { id: 'article-1', tenantId: 'tenant-1' },
        expect.objectContaining({
          images: mockImages,
          status: ArticleStatus.ADJUSTED,
        }),
      );
    });
  });

  describe('publish', () => {
    it('should publish article and return wechat result', async () => {
      const mockArticle = {
        id: 'article-1',
        title: 'Test Article',
      };

      mockArticleRepository.findOne.mockResolvedValue(mockArticle as any);
      mockArticleRepository.update.mockResolvedValue(undefined);

      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([]),
      };
      (userRepository.createQueryBuilder as jest.Mock).mockReturnValue(
        mockQueryBuilder as any,
      );

      await service.publish('article-1', 'user-1', 'tenant-1');

      expect(mockArticleRepository.update).toHaveBeenCalledWith(
        { id: 'article-1', tenantId: 'tenant-1' },
        expect.objectContaining({
          status: ArticleStatus.PUBLISHED,
        }),
      );
    });
  });

  describe('findAll', () => {
    it('should return paginated articles for user', async () => {
      const mockUser = {
        id: 'user-1',
        tenantId: 'tenant-1',
      };

      const mockArticles = [
        { id: 'article-1', title: 'Article 1' },
        { id: 'article-2', title: 'Article 2' },
      ];

      mockArticleRepository.findAndCount.mockResolvedValue([mockArticles, 2]);

      const result = await service.findAll(mockUser as any, 1, 10);

      expect(result).toEqual({
        data: mockArticles,
        pagination: {
          page: 1,
          limit: 10,
          total: 2,
          totalPages: 1,
          hasNext: false,
          hasPrev: false,
        },
      });

      expect(mockArticleRepository.findAndCount).toHaveBeenCalledWith({
        where: { tenantId: 'tenant-1' },
        relations: ['owner'],
        order: { createdAt: 'DESC' },
        skip: 0,
        take: 10,
      });
    });

    it('should limit page size to maximum 100', async () => {
      const mockUser = {
        id: 'user-1',
        tenantId: 'tenant-1',
      };

      mockArticleRepository.findAndCount.mockResolvedValue([[], 0]);

      await service.findAll(mockUser as any, 1, 200);

      expect(mockArticleRepository.findAndCount).toHaveBeenCalledWith(
        expect.objectContaining({
          take: 100,
        }),
      );
    });
  });

  describe('delete', () => {
    it('should delete article', async () => {
      const mockArticle = {
        id: 'article-1',
        title: 'Test Article',
        plannerNames: [],
        copywriterNames: [],
        editorNames: [],
      };

      mockArticleRepository.findOne.mockResolvedValue(mockArticle as any);
      mockArticleRepository.remove.mockResolvedValue(undefined);

      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([]),
      };
      (userRepository.createQueryBuilder as jest.Mock).mockReturnValue(
        mockQueryBuilder as any,
      );

      await service.delete('article-1', 'tenant-1');

      expect(mockArticleRepository.remove).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'article-1',
          title: 'Test Article',
        }),
      );
    });
  });

  describe('saveDraft', () => {
    it('should save article as draft', async () => {
      const mockArticle = {
        id: 'article-1',
        title: 'Test Article',
        status: ArticleStatus.PARSED,
      };

      const mockUser = {
        id: 'user-1',
        tenantId: 'tenant-1',
      };

      mockArticleRepository.findOne.mockResolvedValue(mockArticle as any);
      mockArticleRepository.update.mockResolvedValue(undefined);

      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([]),
      };
      (userRepository.createQueryBuilder as jest.Mock).mockReturnValue(
        mockQueryBuilder as any,
      );

      await service.saveDraft('article-1', mockUser as any);

      expect(mockArticleRepository.update).toHaveBeenCalledWith('article-1', {
        status: ArticleStatus.DRAFT,
        updatedAt: expect.any(Date),
      });
    });

    it('should throw NotFoundException if article not found', async () => {
      mockArticleRepository.findOne.mockResolvedValue(null);

      await expect(
        service.saveDraft('article-1'),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
