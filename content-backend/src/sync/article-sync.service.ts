import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Article, ArticleStatus } from '../entities/article.entity';
import { Tenant } from '../entities/tenant.entity';
import { User } from '../entities/user.entity';
import * as Lark from '@larksuiteoapi/node-sdk';

@Injectable()
export class ArticleSyncService {
    private readonly logger = new Logger(ArticleSyncService.name);

    constructor(
        @InjectRepository(Article)
        private articleRepository: Repository<Article>,
        @InjectRepository(Tenant)
        private tenantRepository: Repository<Tenant>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private configService: ConfigService,
    ) { }

    /**
     * 将文章同步到飞书多维表格
     * @param article 文章实体
     * @param tenant 租户实体
     */
    async syncArticleToFeishu(article: Article, tenant: Tenant): Promise<void> {
        try {
            const settings = tenant.settings || {};
            if (!settings.articleTable) {
                this.logger.warn(`租户 ${tenant.name} 未配置文章管理表，跳过同步`);
                return;
            }

            const { appToken, tableId } = settings.articleTable;
            const feishuAppId = tenant.feishuAppId || this.configService.get<string>('FEISHU_APP_ID');
            const feishuAppSecret = tenant.feishuAppSecret || this.configService.get<string>('FEISHU_APP_SECRET');

            if (!feishuAppId || !feishuAppSecret) {
                this.logger.warn(`租户 ${tenant.name} 未配置飞书凭证且无全局配置，跳过同步`);
                return;
            }

            const client = new Lark.Client({
                appId: feishuAppId,
                appSecret: feishuAppSecret,
                appType: Lark.AppType.SelfBuild,
                domain: Lark.Domain.Feishu,
            });

            const recordData: any = {
                fields: {
                    '标题': article.title || '无标题',
                    '状态': article.status,
                    '内容策划': await this.mapUsersToFeishu(article.planners, tenant.id),
                    '文案撰稿': await this.mapUsersToFeishu(article.copywriters, tenant.id),
                    '文章编辑': await this.mapUsersToFeishu(article.editors, tenant.id),
                    '最后更新': article.updatedAt ? article.updatedAt.getTime() : Date.now(),
                    '系统ID': article.id,
                },
            };

            if (article.feishuRecordId) {
                // 更新现有记录
                this.logger.log(`更新飞书文章记录: ${article.title} (${article.feishuRecordId})`);
                await client.bitable.appTableRecord.update({
                    path: {
                        app_token: appToken,
                        table_id: tableId,
                        record_id: article.feishuRecordId,
                    },
                    data: recordData,
                });
            } else {
                // 创建新记录
                this.logger.log(`创建飞书文章记录: ${article.title}`);
                const createRes = await client.bitable.appTableRecord.create({
                    path: {
                        app_token: appToken,
                        table_id: tableId,
                    },
                    data: recordData,
                });

                if (createRes.code === 0 && createRes.data?.record?.record_id) {
                    article.feishuRecordId = createRes.data.record.record_id;
                    await this.articleRepository.save(article);
                }
            }

            this.logger.log(`✅ 文章 ${article.title} 已同步到飞书表格`);
        } catch (error) {
            this.logger.error(`同步文章到飞书表格失败: ${error.message}`);
        }
    }

    /**
     * 从飞书 Webhook 事件同步文章到数据库
     */
    async syncArticleFromFeishu(event: any, tenant: Tenant): Promise<void> {
        const { record_id, app_token, table_id } = event.event || event;

        try {
            const feishuAppId = (tenant.feishuAppId || this.configService.get<string>('FEISHU_APP_ID')) || '';
            const feishuAppSecret = (tenant.feishuAppSecret || this.configService.get<string>('FEISHU_APP_SECRET')) || '';

            if (!feishuAppId || !feishuAppSecret) {
                this.logger.error(`同步失败: 租户 ${tenant.name} 缺少飞书凭证`);
                return;
            }

            const client = new Lark.Client({
                appId: feishuAppId,
                appSecret: feishuAppSecret,
                appType: Lark.AppType.SelfBuild,
                domain: Lark.Domain.Feishu,
            });

            // 读取最新记录
            const recordRes = await client.bitable.appTableRecord.get({
                path: {
                    app_token: app_token,
                    table_id: table_id,
                    record_id: record_id,
                },
            });

            if (recordRes.code !== 0 || !recordRes.data?.record) {
                this.logger.error(`同步失败: 无法获取飞书记录 ${record_id}`);
                return;
            }

            const fields = recordRes.data.record.fields;
            const systemId = fields['系统ID'] as string;

            if (!systemId) {
                this.logger.warn(`飞书记录 ${record_id} 缺少系统ID，忽略`);
                return;
            }

            const article = await this.articleRepository.findOne({
                where: { id: systemId },
            });

            if (!article) {
                this.logger.warn(`找不到对应的系统文章: ${systemId}`);
                return;
            }

            // 冲突检测：如果数据库里的更新时间比飞书记录的更新时间更晚，则不覆盖
            const feishuUpdatedAt = fields['最后更新'] as number;
            if (article.updatedAt && feishuUpdatedAt && article.updatedAt.getTime() > feishuUpdatedAt) {
                this.logger.log(`数据库记录比飞书记录新，跳过该事件 (ID: ${systemId})`);
                return;
            }

            // 更新本地记录
            this.logger.log(`正在从飞书同步文章更新: ${article.title}`);

            const feishuFields = fields as any;
            if (feishuFields['标题']) article.title = feishuFields['标题'];
            if (feishuFields['状态']) article.status = feishuFields['状态'] as ArticleStatus;

            // 同步人员字段
            if (feishuFields['内容策划']) article.planners = await this.mapFeishuToUsers(feishuFields['内容策划']);
            if (feishuFields['文案撰稿']) article.copywriters = await this.mapFeishuToUsers(feishuFields['文案撰稿']);
            if (feishuFields['文章编辑']) article.editors = await this.mapFeishuToUsers(feishuFields['文章编辑']);

            await this.articleRepository.save(article);
            this.logger.log(`✅ 文章 ${article.title} 已从飞书同步`);

        } catch (error) {
            this.logger.error(`从飞书同步文章失败: ${error.message}`);
        }
    }

    /**
     * 将系统用户 ID 数组映射为飞书多维表格的人员格式
     */
    private async mapUsersToFeishu(userIds: string[], tenantId: string): Promise<any[]> {
        if (!userIds || userIds.length === 0) return [];

        const users = await this.userRepository.createQueryBuilder('user')
            .where('user.id IN (:...ids)', { ids: userIds })
            .getMany();

        return users
            .filter(u => u.feishuId)
            .map(u => ({ id: u.feishuId }));
    }

    /**
     * 将飞书多维表格的人员格式映射为系统用户 ID 数组
     */
    private async mapFeishuToUsers(feishuPeople: any[]): Promise<string[]> {
        if (!feishuPeople || !Array.isArray(feishuPeople)) return [];

        const openIds = feishuPeople.map(p => p.id).filter(id => !!id);
        if (openIds.length === 0) return [];

        const users = await this.userRepository.createQueryBuilder('user')
            .where('user.feishuId IN (:...ids)', { ids: openIds })
            .getMany();

        return users.map(u => u.id);
    }
}
