import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tenant } from '../entities/tenant.entity';
import { WechatAuthorizer } from '../entities/wechat-authorizer.entity';
import { WechatPlatformConfig } from '../entities/wechat-platform-config.entity';
import { Blob } from 'buffer';

@Injectable()
export class WechatService {
  private readonly logger = new Logger(WechatService.name);
  private readonly directTokenCache = new Map<
    string,
    { token: string; expiresAt: number }
  >();
  private readonly refreshLocks = new Map<string, Promise<string>>(); // V2: Token 刷新并发锁

  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
    @InjectRepository(Tenant)
    private tenantRepository: Repository<Tenant>,
    @InjectRepository(WechatAuthorizer)
    private authorizerRepository: Repository<WechatAuthorizer>,
    @InjectRepository(WechatPlatformConfig)
    private platformConfigRepository: Repository<WechatPlatformConfig>,
  ) { }

  private getComponentAppId(): string {
    return (
      this.configService.get<string>('WECHAT_COMPONENT_APP_ID') ||
      this.configService.get<string>('WECHAT_OPEN_APP_ID') ||
      ''
    );
  }

  private getComponentAppSecret(): string {
    return (
      this.configService.get<string>('WECHAT_COMPONENT_APP_SECRET') ||
      this.configService.get<string>('WECHAT_OPEN_APP_SECRET') ||
      ''
    );
  }

  /**
   * 获取第三方平台 Component Access Token
   */
  async getComponentAccessToken(): Promise<string> {
    const config = await this.getPlatformConfig();
    const now = new Date();

    if (
      config.componentAccessToken &&
      config.tokenExpiresAt &&
      now < config.tokenExpiresAt
    ) {
      return config.componentAccessToken;
    }

    if (!config.componentVerifyTicket) {
      throw new Error(
        '缺失 ComponentVerifyTicket，请等待微信推送或检查推送配置',
      );
    }

    const appId = this.getComponentAppId();
    const appSecret = this.getComponentAppSecret();

    const url =
      'https://api.weixin.qq.com/cgi-bin/component/api_component_token';
    const response = await this.httpService.axiosRef.post(url, {
      component_appid: appId,
      component_appsecret: appSecret,
      component_verify_ticket: config.componentVerifyTicket,
    });

    const data = response.data;
    if (data.errcode) {
      throw new Error(`获取 ComponentAccessToken 失败: ${data.errmsg}`);
    }

    config.componentAccessToken = data.component_access_token;
    config.tokenExpiresAt = new Date(
      Date.now() + (data.expires_in - 600) * 1000,
    );
    await this.platformConfigRepository.save(config);

    return data.component_access_token;
  }

  /**
   * 获取预授权码 PreAuthCode
   */
  async getPreAuthCode(): Promise<string> {
    const componentAccessToken = await this.getComponentAccessToken();
    const appId = this.getComponentAppId();

    const url = `https://api.weixin.qq.com/cgi-bin/component/api_create_preauthcode?component_access_token=${componentAccessToken}`;
    const response = await this.httpService.axiosRef.post(url, {
      component_appid: appId,
    });

    const data = response.data;
    if (data.errcode) {
      throw new Error(`获取 PreAuthCode 失败: ${data.errmsg}`);
    }

    return data.pre_auth_code;
  }

  /**
   * 使用授权码换取公众号授权信息
   */
  async exchangeAuthCode(tenantId: string, authCode: string): Promise<any> {
    const componentAccessToken = await this.getComponentAccessToken();
    const appId = this.getComponentAppId();

    const url = `https://api.weixin.qq.com/cgi-bin/component/api_query_auth?component_access_token=${componentAccessToken}`;
    const response = await this.httpService.axiosRef.post(url, {
      component_appid: appId,
      authorization_code: authCode,
    });

    const data = response.data;
    if (data.errcode) {
      throw new Error(`换取授权信息失败: ${data.errmsg}`);
    }

    const authInfo = data.authorization_info;

    // 保存或更新授权信息
    let authorizer = await this.authorizerRepository.findOne({
      where: { authorizerAppId: authInfo.authorizer_appid },
    });

    if (!authorizer) {
      authorizer = this.authorizerRepository.create({
        tenantId,
        authorizerAppId: authInfo.authorizer_appid,
      });
    }

    authorizer.authorizerAccessToken = authInfo.authorizer_access_token;
    authorizer.authorizerRefreshToken = authInfo.authorizer_refresh_token;
    authorizer.expiresAt = new Date(
      Date.now() + (authInfo.expires_in - 600) * 1000,
    );
    authorizer.isActive = true;

    // 获取公众号详细信息
    await this.updateAuthorizerInfo(authorizer);

    await this.authorizerRepository.save(authorizer);

    return authorizer;
  }

  /**
   * 获取授权方 (公众号) 的 AccessToken
   */
  async getAuthorizerAccessToken(
    tenantId: string,
    authorizerAppId?: string,
  ): Promise<string> {
    const tenant = await this.tenantRepository.findOne({
      where: { id: tenantId },
    });
    if (tenant?.wechatAppId && tenant.wechatAppSecret) {
      return await this.getDirectAccessToken(tenantId, tenant);
    }

    // 如果没传 authorizerAppId，默认取该租户下最新的已激活授权
    let authorizer: WechatAuthorizer | null;
    if (authorizerAppId) {
      authorizer = await this.authorizerRepository.findOne({
        where: { tenantId, authorizerAppId, isActive: true },
      });
    } else {
      authorizer = await this.authorizerRepository.findOne({
        where: { tenantId, isActive: true },
        order: { updatedAt: 'DESC' },
      });
    }

    if (!authorizer) {
      throw new NotFoundException('该租户未授权微信公众号');
    }

    const now = new Date();
    if (
      authorizer.authorizerAccessToken &&
      authorizer.expiresAt &&
      now < authorizer.expiresAt
    ) {
      return authorizer.authorizerAccessToken;
    }

    // V2: 需要刷新 Token，使用并发锁机制
    const lockKey = authorizer.authorizerAppId;
    if (this.refreshLocks.has(lockKey)) {
      this.logger.log(`[Token Lock] 等待已有的 Token 刷新任务: ${lockKey}`);
      return this.refreshLocks.get(lockKey)!;
    }

    const refreshPromise = this.refreshAuthorizerToken(authorizer).finally(
      () => {
        this.refreshLocks.delete(lockKey);
      },
    );

    this.refreshLocks.set(lockKey, refreshPromise);
    return refreshPromise;
  }

  private async getDirectAccessToken(
    tenantId: string,
    tenant?: Tenant,
  ): Promise<string> {
    const cached = this.directTokenCache.get(tenantId);
    if (cached && cached.expiresAt > Date.now()) {
      return cached.token;
    }

    const targetTenant =
      tenant ||
      (await this.tenantRepository.findOne({ where: { id: tenantId } }));

    if (!targetTenant?.wechatAppId || !targetTenant.wechatAppSecret) {
      throw new NotFoundException('该租户未配置微信公众号');
    }

    const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${targetTenant.wechatAppId}&secret=${targetTenant.wechatAppSecret}`;
    const response = await this.httpService.axiosRef.get(url);
    const data = response.data;

    if (data.errcode) {
      throw new Error(`获取AccessToken失败: ${data.errmsg}`);
    }

    const expiresAt = Date.now() + (data.expires_in - 300) * 1000;
    this.directTokenCache.set(tenantId, {
      token: data.access_token,
      expiresAt,
    });

    return data.access_token;
  }

  /**
   * 刷新授权方 AccessToken
   */
  private async refreshAuthorizerToken(
    authorizer: WechatAuthorizer,
  ): Promise<string> {
    const componentAccessToken = await this.getComponentAccessToken();
    const componentAppId = this.getComponentAppId();

    const url = `https://api.weixin.qq.com/cgi-bin/component/api_authorizer_token?component_access_token=${componentAccessToken}`;
    const response = await this.httpService.axiosRef.post(url, {
      component_appid: componentAppId,
      authorizer_appid: authorizer.authorizerAppId,
      authorizer_refresh_token: authorizer.authorizerRefreshToken,
    });

    const data = response.data;
    if (data.errcode) {
      authorizer.isActive = false; // 可能授权已取消
      await this.authorizerRepository.save(authorizer);
      throw new Error(`刷新 AuthorizerAccessToken 失败: ${data.errmsg}`);
    }

    authorizer.authorizerAccessToken = data.authorizer_access_token;
    authorizer.authorizerRefreshToken = data.authorizer_refresh_token;
    authorizer.expiresAt = new Date(
      Date.now() + (data.expires_in - 600) * 1000,
    );
    await this.authorizerRepository.save(authorizer);

    return data.authorizer_access_token;
  }

  /**
   * 更新授权方详细信息
   */
  async updateAuthorizerInfo(authorizer: WechatAuthorizer): Promise<void> {
    const componentAccessToken = await this.getComponentAccessToken();
    const componentAppId = this.getComponentAppId();

    const url = `https://api.weixin.qq.com/cgi-bin/component/api_get_authorizer_info?component_access_token=${componentAccessToken}`;
    const response = await this.httpService.axiosRef.post(url, {
      component_appid: componentAppId,
      authorizer_appid: authorizer.authorizerAppId,
    });

    const data = response.data;
    if (data.errcode) return;

    const info = data.authorizer_info;
    authorizer.nickName = info.nick_name;
    authorizer.headImg = info.head_img;
    authorizer.userName = info.user_name;
    authorizer.principalName = info.principal_name;
    authorizer.alias = info.alias;
    authorizer.qrcodeUrl = info.qrcode_url;
    authorizer.serviceTypeInfo = info.service_type_info;
    authorizer.verifyTypeInfo = info.verify_type_info;
  }

  /**
   * 处理 VerifyTicket 推送
   */
  async handleVerifyTicket(ticket: string): Promise<void> {
    const config = await this.getPlatformConfig();
    config.componentVerifyTicket = ticket;
    await this.platformConfigRepository.save(config);
    this.logger.log('ComponentVerifyTicket 已更新');
  }

  private async getPlatformConfig(): Promise<WechatPlatformConfig> {
    let config = await this.platformConfigRepository.findOne({
      where: { id: 1 },
    });
    if (!config) {
      config = this.platformConfigRepository.create({ id: 1 });
      await this.platformConfigRepository.save(config);
    }
    return config;
  }

  // === 抽象后的业务方法，不再依赖本地 AppSecret ===

  async uploadImage(tenantId: string, file: Express.Multer.File): Promise<any> {
    const accessToken = await this.getAuthorizerAccessToken(tenantId);
    // V2: 从 add_material (永久素材，慢) 切换为 uploadimg (CDN接口，极速)
    const url = `https://api.weixin.qq.com/cgi-bin/media/uploadimg?access_token=${accessToken}`;

    this.logger.log(
      `[Wechat API] 开始上传图片到微信 CDN: ${file.originalname}`,
    );
    const startTime = Date.now();

    const formData = new FormData();
    formData.append(
      'media',
      new Blob([file.buffer], { type: file.mimetype }) as any,
      file.originalname,
    );

    try {
      const response = await this.httpService.axiosRef.post(url, formData, {
        timeout: 60000, // 后端也增加 60s 超时
      });

      const duration = Date.now() - startTime;
      if (response.data.errcode) {
        this.logger.error(
          `[Wechat API] 上传失败 (${duration}ms): ${JSON.stringify(response.data)}`,
        );
      } else {
        this.logger.log(`[Wechat API] 上传成功 (${duration}ms)`);
      }

      return response.data;
    } catch (error: any) {
      const duration = Date.now() - startTime;
      this.logger.error(
        `[Wechat API] 上传网络异常 (${duration}ms): ${error.message}`,
      );
      throw error;
    }
  }

  async createDraft(tenantId: string, articleData: any): Promise<any> {
    const accessToken = await this.getAuthorizerAccessToken(tenantId);
    const url = `https://api.weixin.qq.com/cgi-bin/draft/add?access_token=${accessToken}`;

    const response = await this.httpService.axiosRef.post(url, {
      articles: [articleData],
    });
    return response.data;
  }

  async getAuthorizedAccounts(tenantId: string): Promise<WechatAuthorizer[]> {
    return await this.authorizerRepository.find({
      where: { tenantId, isActive: true },
      order: { updatedAt: 'DESC' },
    });
  }

  async removeAuth(tenantId: string, authorizerAppId: string): Promise<void> {
    const authorizer = await this.authorizerRepository.findOne({
      where: { tenantId, authorizerAppId },
    });

    if (!authorizer) {
      throw new NotFoundException('找不到该授权记录');
    }

    authorizer.isActive = false;
    await this.authorizerRepository.save(authorizer);
  }

  /**
   * 获取微信图片代理流
   */
  async getProxyImageStream(url: string) {
    const response = await this.httpService.axiosRef.get(url, {
      responseType: 'stream',
      headers: {
        Referer: 'https://mp.weixin.qq.com/',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
    });
    return response;
  }

  /**
   * 从微信公众号文章链接抓取内容
   */
  async fetchArticleFromUrl(url: string): Promise<{ html: string; title: string; author: string; cover: string }> {
    try {
      this.logger.log(`[Fetch Article] 开始抓取微信文章: ${url}`);

      const response = await this.httpService.axiosRef.get(url, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Referer': 'https://mp.weixin.qq.com/',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
        },
        timeout: 30000,
      });

      const html = response.data;

      // 提取文章标题
      const titleMatch = html.match(/<h1[^>]*class="rich_media_title"[^>]*>([\s\S]*?)<\/h1>/i) ||
        html.match(/<title>(.*?)<\/title>/i);
      const title = titleMatch ? titleMatch[1].trim().replace(/\s+/g, ' ') : '';

      // 提取作者信息
      const authorMatch = html.match(/<span[^>]*class="rich_media_meta_text"[^>]*>(.*?)<\/span>/i) ||
        html.match(/<a[^>]*id="js_name"[^>]*>(.*?)<\/a>/i);
      const author = authorMatch ? authorMatch[1].trim() : '';

      // 提取封面图片 URL (msg_cdn_url)
      const coverMatch = html.match(/var\s+msg_cdn_url\s*=\s*"([^"]+)"/) ||
        html.match(/window\.msg_cdn_url\s*=\s*"([^"]+)"/) ||
        html.match(/"cdn_url"\s*:\s*"([^"]+)"/);
      const cover = coverMatch ? coverMatch[1].replace(/\\x2f/g, '/').replace(/\\x26/g, '&') : '';

      // 提取正文内容
      const contentMatch = html.match(/<div[^>]*id="js_content"[^>]*>([\s\S]*?)<\/div>\s*<script/i);
      const content = contentMatch ? contentMatch[1] : '';

      if (!content && !url.includes('test')) {
        // 如果是单纯为了拿封面图，没提取到内容也不报错
        this.logger.warn('[Fetch Article] 未能提取到正文内容，但继续返回元数据');
      }

      this.logger.log(`[Fetch Article] 抓取成功 - 标题: ${title}, 作者: ${author}, 封面图: ${cover ? '已获取' : '未获取'}`);

      return {
        html: content || '',
        title,
        author,
        cover,
      };
    } catch (error: any) {
      this.logger.error(`[Fetch Article] 抓取失败: ${error.message}`);
      throw new Error(`抓取微信文章失败: ${error.message}`);
    }
  }
}
