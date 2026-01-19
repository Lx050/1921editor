import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Request,
  Res,
  NotFoundException,
  BadRequestException,
  ValidationPipe,
  UsePipes,
  UseGuards,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { ArticleService } from './article.service';
import {
  CreateArticleDto,
  UpdateArticleConfigDto,
  UpdateArticleContentDto,
  UpdateArticleImagesDto,
} from '../dto/article.dto';
import type { Response } from 'express';
import * as path from 'path';
import * as fs from 'fs';
import { ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from '../entities/user.entity';

@ApiTags('articles')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('articles')
export class ArticleController {
  constructor(
    private readonly articleService: ArticleService,
    private readonly configService: ConfigService,
  ) {}

  private getDefaultTenantId(): string {
    return (
      this.configService.get<string>('DEFAULT_TENANT_ID') ||
      '00000000-0000-0000-0000-000000000001'
    );
  }

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @ApiOperation({ summary: '创建文章' })
  @ApiResponse({ status: 201, description: '文章创建成功' })
  @ApiResponse({ status: 400, description: '参数验证失败' })
  create(@Body() dto: CreateArticleDto, @Request() req: { user: User }) {
    const tenantId = req.user?.tenantId || this.getDefaultTenantId();
    return this.articleService.create(dto.title, {
      ...dto,
      ownerId: req.user?.id ?? undefined,
      tenantId,
    });
  }

  @Get()
  @ApiOperation({ summary: '获取文章列表（分页）' })
  @ApiResponse({ status: 200, description: '获取成功' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: '页码（从 1 开始）',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: '每页数量（最大 100）',
  })
  findAll(
    @Request() req: { user: User },
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    if (req.user?.tenantId) {
      return this.articleService.findAll(req.user, page, limit);
    }
    return this.articleService.findAllByTenant(
      this.getDefaultTenantId(),
      page,
      limit,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: '获取文章详情' })
  @ApiResponse({ status: 200, description: '获取成功' })
  @ApiResponse({ status: 404, description: '文章不存在' })
  @ApiParam({ name: 'id', description: '文章 ID', type: String })
  findOne(@Param('id') id: string, @Request() req: { user: User }) {
    const tenantId = req.user?.tenantId || this.getDefaultTenantId();
    return this.articleService.findOne(id, tenantId);
  }

  @Get(':id/file')
  @ApiOperation({ summary: '获取文章原始文件' })
  @ApiResponse({ status: 200, description: '文件下载成功' })
  @ApiResponse({ status: 404, description: '文件不存在' })
  @ApiParam({ name: 'id', description: '文章 ID', type: String })
  async getFile(
    @Param('id') id: string,
    @Res() res: Response,
    @Request() req: { user: User },
  ) {
    const tenantId = req.user?.tenantId || this.getDefaultTenantId();
    await this.articleService.assertTenantAccess(id, tenantId);
    // 🔒 安全验证：确保 ID 只包含安全字符
    if (!/^[a-zA-Z0-9-_.]+$/.test(id)) {
      throw new BadRequestException('Invalid file ID format');
    }

    const uploadDir = path.join(process.cwd(), 'uploads');

    // Try both .zip and .docx extensions
    const extensions = ['.zip', '.docx'];
    for (const ext of extensions) {
      const filePath = path.join(uploadDir, `${id}${ext}`);

      // 🔒 安全验证：规范化路径并确保在 uploads 目录内
      const normalizedPath = path.normalize(filePath);
      if (!normalizedPath.startsWith(path.normalize(uploadDir))) {
        console.error(`Path traversal attempt detected: ${id}${ext}`);
        throw new BadRequestException('Invalid file path');
      }

      if (fs.existsSync(filePath)) {
        // 🔒 安全设置：设置安全头部
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader(
          'Content-Disposition',
          `attachment; filename="${id}${ext}"`,
        );
        return res.sendFile(filePath);
      }
    }

    throw new NotFoundException('File not found');
  }

  @Put(':id/config')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @ApiOperation({ summary: '更新文章配置' })
  @ApiResponse({ status: 200, description: '配置更新成功' })
  @ApiResponse({ status: 400, description: '参数验证失败' })
  @ApiResponse({ status: 404, description: '文章不存在' })
  @ApiParam({ name: 'id', description: '文章 ID', type: String })
  updateConfig(
    @Param('id') id: string,
    @Body() dto: UpdateArticleConfigDto,
    @Request() req: { user: User },
  ) {
    const tenantId = req.user?.tenantId || this.getDefaultTenantId();
    return this.articleService.updateStep1(
      id,
      { ...dto.config, metadata: dto.metadata }, // V5: 将 metadata 合并到 config 中
      req.user?.id,
      tenantId,
    );
  }

  @Put(':id/content')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @ApiOperation({ summary: '更新文章内容' })
  @ApiResponse({ status: 200, description: '内容更新成功' })
  @ApiResponse({ status: 400, description: '参数验证失败' })
  @ApiResponse({ status: 404, description: '文章不存在' })
  @ApiParam({ name: 'id', description: '文章 ID', type: String })
  updateContent(
    @Param('id') id: string,
    @Body() dto: UpdateArticleContentDto,
    @Request() req: { user: User },
  ) {
    const tenantId = req.user?.tenantId || this.getDefaultTenantId();
    return this.articleService.updateStep2(
      id,
      dto.content,
      req.user?.id,
      tenantId,
    );
  }

  @Put(':id/images')
  @ApiOperation({ summary: '更新文章图片' })
  @ApiResponse({ status: 200, description: '图片更新成功' })
  @ApiResponse({ status: 400, description: '参数验证失败' })
  @ApiResponse({ status: 404, description: '文章不存在' })
  @ApiParam({ name: 'id', description: '文章 ID', type: String })
  updateImages(
    @Param('id') id: string,
    @Body() body: UpdateArticleImagesDto,
    @Request() req: { user: User },
  ) {
    const tenantId = req.user?.tenantId || this.getDefaultTenantId();
    console.log(
      '[Controller] 收到图片数据:',
      JSON.stringify(body?.images?.slice(0, 1)),
    );
    return this.articleService.updateStep3(
      id,
      body.images,
      req.user?.id,
      tenantId,
    );
  }

  @Put(':id/step3-content')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @ApiOperation({ summary: '从Step3保存文章内容（设置状态为ADJUSTED）' })
  @ApiResponse({ status: 200, description: '内容保存成功' })
  @ApiResponse({ status: 400, description: '参数验证失败' })
  @ApiResponse({ status: 404, description: '文章不存在' })
  @ApiParam({ name: 'id', description: '文章 ID', type: String })
  updateStep3Content(
    @Param('id') id: string,
    @Body() dto: UpdateArticleContentDto,
    @Request() req: { user: User },
  ) {
    const tenantId = req.user?.tenantId || this.getDefaultTenantId();
    return this.articleService.updateStep3Content(
      id,
      dto.content,
      req.user?.id,
      tenantId,
    );
  }

  @Post(':id/publish')
  @ApiOperation({ summary: '发布文章' })
  @ApiResponse({ status: 200, description: '发布成功' })
  @ApiResponse({ status: 404, description: '文章不存在' })
  @ApiParam({ name: 'id', description: '文章 ID', type: String })
  publish(@Param('id') id: string, @Request() req: { user: User }) {
    const tenantId = req.user?.tenantId || this.getDefaultTenantId();
    return this.articleService.publish(id, req.user?.id, tenantId);
  }

  @Post(':id/save-draft')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @ApiOperation({ summary: '保存文章草稿' })
  @ApiResponse({ status: 200, description: '草稿保存成功' })
  @ApiResponse({ status: 404, description: '文章不存在' })
  @ApiParam({ name: 'id', description: '文章 ID', type: String })
  async saveDraft(@Param('id') id: string, @Request() req: { user: User }) {
    return this.articleService.saveDraft(id, req.user);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除文章' })
  @ApiResponse({ status: 200, description: '删除成功' })
  @ApiResponse({ status: 404, description: '文章不存在' })
  @ApiParam({ name: 'id', description: '文章 ID', type: String })
  remove(@Param('id') id: string, @Request() req: { user: User }) {
    const tenantId = req.user?.tenantId || this.getDefaultTenantId();
    return this.articleService.delete(id, tenantId);
  }
}
