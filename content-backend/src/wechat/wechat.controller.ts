import {
  Controller,
  Post,
  Get,
  UseInterceptors,
  UploadedFile,
  Body,
  Req,
  HttpCode,
  HttpStatus,
  Query,
  Param,
  Delete,
  Res,
  UseGuards,
  Logger,
} from '@nestjs/common';
import type { Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { FileInterceptor } from '@nestjs/platform-express';
import { WechatService } from './wechat.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiProperty,
} from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

class ExchangeAuthDto {
  @ApiProperty({
    description: '微信提供的授权码 (auth_code)',
    example: 'QUERY_AUTH_CODE',
  })
  code: string;
}

@ApiTags('Wechat')
@Controller('wechat')
export class WechatController {
  private readonly logger = new Logger(WechatController.name);

  constructor(
    private readonly wechatService: WechatService,
    private readonly configService: ConfigService,
  ) { }

  private resolveTenantId(req: any): string {
    return (
      req.user?.tenantId ||
      this.configService.get<string>('DEFAULT_TENANT_ID') ||
      '00000000-0000-0000-0000-000000000001'
    );
  }

  /**
   * 微信服务器 VerifyTicket 推送接口 (由微信后台配置)
   * 注意：此接口不需要 JWT 守卫，因为是由微信服务器直接调用
   */
  @Post('ticket')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '微信服务器 VerifyTicket 推送接口',
    description: '接收微信第三方平台每 10 分钟推送一次的 ticket',
  })
  @ApiResponse({ status: 200, description: '成功接收' })
  async receiveTicket(@Body() data: any, @Req() req: any) {
    // 尝试从不同的可能路径获取 ticket
    // 1. 如果有 XML 解析器，可能是 data.ComponentVerifyTicket (微信原生字段) 或 data.ticket (自定义解析)
    // 2. 如果是明文内容，尝试从 body 字符串中提取
    let ticket = data?.ComponentVerifyTicket || data?.ticket;

    if (!ticket && typeof data === 'string') {
      const match =
        data.match(
          /<ComponentVerifyTicket><!\[CDATA\[(.*)\]\]><\/ComponentVerifyTicket>/,
        ) || data.match(/<ComponentVerifyTicket>(.*)<\/ComponentVerifyTicket>/);
      if (match) ticket = match[1];
    }

    if (ticket) {
      await this.wechatService.handleVerifyTicket(ticket);
      return 'success';
    }

    // 如果仍未找到，可能需要检查是否由于采用了加密模式导致无法直接解析
    // 此处暂记日志，微信要求始终返回 success
    return 'success';
  }

  /**
   * 手动更新 VerifyTicket (仅用于开发调试)
   */
  @Post('dev-set-ticket')
  @ApiOperation({
    summary: '手动更新 VerifyTicket (开发用)',
    description: '如果微信推送无法到达本地，可手动调用此接口设置 ticket',
  })
  async devSetTicket(@Body('ticket') ticket: string) {
    if (!ticket) return { success: false, message: 'Ticket is required' };
    await this.wechatService.handleVerifyTicket(ticket);
    return { success: true, message: 'Ticket updated manually' };
  }

  /**
   * 生成预授权码 PreAuthCode
   */
  @Post('pre-auth-code')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '生成预授权码',
    description: '获取用于引导用户扫码授权的 pre_auth_code',
  })
  @ApiResponse({ status: 201, description: '成功返回预授权码' })
  async getPreAuthCode() {
    try {
      const preAuthCode = await this.wechatService.getPreAuthCode();
      const componentAppId =
        this.configService.get<string>('WECHAT_COMPONENT_APP_ID') ||
        this.configService.get<string>('WECHAT_OPEN_APP_ID');
      return {
        success: true,
        pre_auth_code: preAuthCode,
        component_appid: componentAppId,
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * 授权回调 - 接收 auth_code 并换取令牌
   */
  @Post('exchange-auth')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '通过 auth_code 换取令牌',
    description: '在用户扫码授权回调后调用，完成租户与公众号的关联',
  })
  @ApiResponse({ status: 201, description: '授权成功' })
  async exchangeAuth(@Req() req, @Body() body: ExchangeAuthDto) {
    try {
      const tenantId = this.resolveTenantId(req);
      const result = await this.wechatService.exchangeAuthCode(
        tenantId,
        body.code,
      );
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * 获取租户已授权的公众号列表
   */
  @Get('authorized-accounts')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '获取已授权账号列表',
    description: '获取当前租户下所有已授权的微信公众号及其基本信息',
  })
  @ApiResponse({ status: 200, description: '返回列表' })
  async getAuthorizedAccounts(@Req() req) {
    try {
      const tenantId = this.resolveTenantId(req);
      const accounts = await this.wechatService.getAuthorizedAccounts(tenantId);
      return { success: true, data: accounts };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // === 兼容旧接口的发布/上传方法 (已改造为使用 AuthorizerToken) ===

  @Get('status')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '检查微信授权状态 (旧接口兼容)',
    description: '获取当前租户下所有已授权的微信账号',
  })
  @ApiResponse({ status: 200, description: '返回授权列表' })
  async checkStatus(@Req() req) {
    const tenantId = this.resolveTenantId(req);
    return await this.wechatService.getAuthorizedAccounts(tenantId);
  }

  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '上传图片到微信临时素材',
    description: '为文章发布准备图片资源',
  })
  @ApiResponse({ status: 201, description: '上传成功，返回 media_id' })
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(@UploadedFile() image: Express.Multer.File, @Req() req) {
    try {
      if (!image) return { success: false, error: '没有上传图片文件' };

      const tenantId = this.resolveTenantId(req);
      const result = await this.wechatService.uploadImage(tenantId, image);

      return { success: true, data: result };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  @Post('draft')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '创建微信草稿',
    description: '将文章内容同步到微信公众号草稿箱',
  })
  @ApiResponse({ status: 201, description: '草稿创建成功' })
  async createDraft(@Body() articleData: any, @Req() req) {
    try {
      const tenantId = this.resolveTenantId(req);
      const result = await this.wechatService.createDraft(
        tenantId,
        articleData,
      );

      return { success: true, data: result };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  @Delete(':appId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '解约/移除微信账号授权',
    description: '从本系统中逻辑移除对该公众号的授权，不再展示',
  })
  @ApiResponse({ status: 200, description: '移除成功' })
  async removeAuth(@Param('appId') appId: string, @Req() req) {
    try {
      const tenantId = this.resolveTenantId(req);
      await this.wechatService.removeAuth(tenantId, appId);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @Get('image-proxy')
  @ApiOperation({
    summary: '微信图片代理',
    description: '代理访问微信图片以绕过防盗链 (带本地缓存)',
  })
  async proxyImage(@Query('url') url: string, @Res() res: Response) {
    if (!url) {
      res.status(400).send('Missing url parameter');
      return;
    }

    try {
      // 1. 计算缓存路径
      const cacheDir = path.join(process.cwd(), 'uploads', 'cache');
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
      }

      // 猜测扩展名
      let ext = '.jpg'; // 默认
      try {
        const urlObj = new URL(url);
        const fmt = urlObj.searchParams.get('wx_fmt');
        if (fmt) ext = `.${fmt}`;
      } catch (e) {
        // URL 解析失败，忽略
      }

      const hash = crypto.createHash('md5').update(url).digest('hex');
      const filename = `${hash}${ext}`;
      const filePath = path.join(cacheDir, filename);

      // 2. 检查缓存
      if (fs.existsSync(filePath)) {
        // 增加强缓存头
        res.setHeader('Cache-Control', 'public, max-age=31536000');
        return res.sendFile(filePath);
      }

      // 3. 下载并缓存
      const response = await this.wechatService.getProxyImageStream(url);

      // 设置响应头
      const contentType = response.headers['content-type'];
      if (contentType) {
        res.setHeader('Content-Type', contentType);
      }
      res.setHeader('Cache-Control', 'public, max-age=31536000');

      // 创建写入流
      const writer = fs.createWriteStream(filePath);

      // 双路管道：一路给用户，一路写入硬盘
      response.data.pipe(res);
      response.data.pipe(writer);

      writer.on('error', (err) => {
        console.error('[ImageCache] Write error:', err);
        writer.end();
        // 尝试删除可能损坏的文件
        fs.unlink(filePath, () => { });
      });
    } catch (error) {
      // console.error('Proxy error:', error.message);
      if (!res.headersSent) {
        res.status(404).send('Image unavailable');
      }
    }
  }

  @Post('fetch-article')
  // @UseGuards(JwtAuthGuard) // 暂时注释掉，防止数据库连接失败导致认证报错
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '抓取微信文章',
    description: '从微信公众号文章链接抓取内容',
  })
  @ApiResponse({ status: 200, description: '抓取成功' })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  async fetchArticle(@Body() body: { url: string }) {
    this.logger.log(`[Controller] 收到抓取请求: ${body.url}`);
    try {
      if (!body.url) {
        return { success: false, error: '请提供微信文章链接' };
      }

      const result = await this.wechatService.fetchArticleFromUrl(body.url);
      return { success: true, data: result };
    } catch (error: any) {
      // 记录错误日志
      console.error('[fetchArticle] 错误:', error.message);
      console.error('[fetchArticle] 堆栈:', error.stack);
      return { success: false, error: error.message || '抓取失败' };
    }
  }

  @Post('fetch-article-test')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '抓取微信文章（测试端点，无需认证）',
    description: '从微信公众号文章链接抓取内容，仅用于测试',
  })
  async fetchArticleTest(@Body() body: { url: string }) {
    try {
      if (!body.url) {
        return { success: false, error: '请提供微信文章链接' };
      }

      const result = await this.wechatService.fetchArticleFromUrl(body.url);
      return { success: true, data: result };
    } catch (error: any) {
      console.error('[fetchArticleTest] 错误:', error.message);
      console.error('[fetchArticleTest] 堆栈:', error.stack);
      return { success: false, error: error.message || '抓取失败' };
    }
  }
}
