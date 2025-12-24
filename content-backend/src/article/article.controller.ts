import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
  Request,
  Res,
  NotFoundException,
  BadRequestException,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ArticleService } from './article.service';
import { AuthGuard } from '@nestjs/passport';
import {
  CreateArticleDto,
  UpdateArticleConfigDto,
  UpdateArticleContentDto,
  UpdateArticleImagesDto,
} from '../dto/article.dto';
import type { Response } from 'express';
import * as path from 'path';
import * as fs from 'fs';

@ApiTags('articles')
@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @ApiOperation({ summary: '创建文章' })
  @ApiResponse({ status: 201, description: '文章创建成功' })
  @ApiResponse({ status: 400, description: '参数验证失败' })
  @ApiResponse({ status: 401, description: '未授权' })
  create(@Body() dto: CreateArticleDto, @Request() req: { user: any }) {
    return this.articleService.create(dto.title, {
      ...dto,
      ownerId: req.user.id,
      tenantId: req.user.tenantId,
    });
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  findAll(@Request() req: { user: any }) {
    return this.articleService.findAll(req.user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.articleService.findOne(id);
  }

  @Get(':id/file')
  getFile(@Param('id') id: string, @Res() res: Response) {
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
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @ApiOperation({ summary: '更新文章配置' })
  updateConfig(
    @Param('id') id: string,
    @Body() dto: UpdateArticleConfigDto,
    @Request() req: { user: any },
  ) {
    return this.articleService.updateStep1(id, dto.config, req.user.id);
  }

  @Put(':id/content')
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @ApiOperation({ summary: '更新文章内容' })
  updateContent(
    @Param('id') id: string,
    @Body() dto: UpdateArticleContentDto,
    @Request() req: { user: any },
  ) {
    return this.articleService.updateStep2(id, dto.content, req.user.id);
  }

  @Put(':id/images')
  @UseGuards(AuthGuard('jwt'))
  // 🔧 完全移除 ValidationPipe 以避免数据被剥离
  @ApiOperation({ summary: '更新文章图片' })
  updateImages(
    @Param('id') id: string,
    @Body() body: any,
    @Request() req: { user: any },
  ) {
    console.log(
      '[Controller] 收到图片数据:',
      JSON.stringify(body?.images?.slice(0, 1)),
    );
    return this.articleService.updateStep3(id, body.images, req.user.id);
  }

  @Put(':id/step3-content')
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @ApiOperation({ summary: '从Step3保存文章内容（设置状态为ADJUSTED）' })
  updateStep3Content(
    @Param('id') id: string,
    @Body() dto: UpdateArticleContentDto,
    @Request() req: { user: any },
  ) {
    return this.articleService.updateStep3Content(id, dto.content, req.user.id);
  }

  @Post(':id/publish')
  @UseGuards(AuthGuard('jwt'))
  publish(@Param('id') id: string, @Request() req: { user: any }) {
    return this.articleService.publish(id, req.user.id);
  }

  @Post(':id/save-draft')
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @ApiOperation({ summary: '保存文章草稿' })
  @ApiResponse({ status: 200, description: '草稿保存成功' })
  @ApiResponse({ status: 401, description: '未授权' })
  @ApiResponse({ status: 404, description: '文章不存在' })
  async saveDraft(@Param('id') id: string, @Request() req: { user: any }) {
    return this.articleService.saveDraft(id, req.user);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  remove(@Param('id') id: string) {
    return this.articleService.delete(id);
  }
}
