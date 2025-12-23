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

    /**
     * 获取第三方平台 Component Access Token
     */
    async getComponentAccessToken(): Promise<string> {
        const config = await this.getPlatformConfig();
        const now = new Date();

        if (config.componentAccessToken && config.tokenExpiresAt && now < config.tokenExpiresAt) {
            return config.componentAccessToken;
        }

        if (!config.componentVerifyTicket) {
            throw new Error('缺失 ComponentVerifyTicket，请等待微信推送或检查推送配置');
        }

        const appId = this.configService.get<string>('WECHAT_COMPONENT_APP_ID');
        const appSecret = this.configService.get<string>('WECHAT_COMPONENT_APP_SECRET');

        const url = 'https://api.weixin.qq.com/cgi-bin/component/api_component_token';
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
        config.tokenExpiresAt = new Date(Date.now() + (data.expires_in - 600) * 1000);
        await this.platformConfigRepository.save(config);

        return data.component_access_token;
    }

    /**
     * 获取预授权码 PreAuthCode
     */
    async getPreAuthCode(): Promise<string> {
        const componentAccessToken = await this.getComponentAccessToken();
        const appId = this.configService.get<string>('WECHAT_COMPONENT_APP_ID');

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
        const appId = this.configService.get<string>('WECHAT_COMPONENT_APP_ID');

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
        authorizer.expiresAt = new Date(Date.now() + (authInfo.expires_in - 600) * 1000);
        authorizer.isActive = true;

        // 获取公众号详细信息
        await this.updateAuthorizerInfo(authorizer);

        await this.authorizerRepository.save(authorizer);

        return authorizer;
    }

    /**
     * 获取授权方 (公众号) 的 AccessToken
     */
    async getAuthorizerAccessToken(tenantId: string, authorizerAppId?: string): Promise<string> {
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
        if (authorizer.authorizerAccessToken && authorizer.expiresAt && now < authorizer.expiresAt) {
            return authorizer.authorizerAccessToken;
        }

        // 需要刷新 Token
        return await this.refreshAuthorizerToken(authorizer);
    }

    /**
     * 刷新授权方 AccessToken
     */
    private async refreshAuthorizerToken(authorizer: WechatAuthorizer): Promise<string> {
        const componentAccessToken = await this.getComponentAccessToken();
        const componentAppId = this.configService.get<string>('WECHAT_COMPONENT_APP_ID');

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
        authorizer.expiresAt = new Date(Date.now() + (data.expires_in - 600) * 1000);
        await this.authorizerRepository.save(authorizer);

        return data.authorizer_access_token;
    }

    /**
     * 更新授权方详细信息
     */
    async updateAuthorizerInfo(authorizer: WechatAuthorizer): Promise<void> {
        const componentAccessToken = await this.getComponentAccessToken();
        const componentAppId = this.configService.get<string>('WECHAT_COMPONENT_APP_ID');

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
        let config = await this.platformConfigRepository.findOne({ where: { id: 1 } });
        if (!config) {
            config = this.platformConfigRepository.create({ id: 1 });
            await this.platformConfigRepository.save(config);
        }
        return config;
    }

    // === 抽象后的业务方法，不再依赖本地 AppSecret ===

    async uploadImage(tenantId: string, file: Express.Multer.File): Promise<any> {
        const accessToken = await this.getAuthorizerAccessToken(tenantId);
        const url = `https://api.weixin.qq.com/cgi-bin/media/uploadimg?access_token=${accessToken}`;

        const formData = new FormData();
        formData.append('media', new Blob([file.buffer], { type: file.mimetype }) as any, file.originalname);

        const response = await this.httpService.axiosRef.post(url, formData);
        return response.data;
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
                'Referer': 'https://mp.weixin.qq.com/',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });
        return response;
    }
}
