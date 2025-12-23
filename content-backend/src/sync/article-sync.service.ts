import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Article, ArticleStatus } from '../entities/article.entity';
import { Tenant } from '../entities/tenant.entity';
import { User } from '../entities/user.entity';
import * as Lark from '@larksuiteoapi/node-sdk';
import {
    FeishuArticleFields,
    FeishuRecordData,
    FeishuWebhookEvent,
    SyncResult,
    FeishuPerson,
    UserGroupMapping,
} from './interfaces/feishu-sync.interface';

@Injectable()
export class ArticleSyncService {
    private readonly logger = new Logger(ArticleSyncService.name);
    // 🔒 防止同一篇文章的并发同步（内存锁）
    private readonly syncInProgress = new Map<string, Promise<SyncResult>>();

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
     * 创建飞书客户端
     */
    private createFeishuClient(tenant: Tenant): Lark.Client {
        const feishuAppId = tenant.feishuAppId || this.configService.get<string>('FEISHU_APP_ID');
        const feishuAppSecret = tenant.feishuAppSecret || this.configService.get<string>('FEISHU_APP_SECRET');

        if (!feishuAppId || !feishuAppSecret) {
            throw new Error(`租户 ${tenant.name} 缺少飞书凭证且无全局配置`);
        }

        return new Lark.Client({
            appId: feishuAppId,
            appSecret: feishuAppSecret,
            appType: Lark.AppType.SelfBuild,
            domain: Lark.Domain.Feishu,
        });
    }

    /**
     * 将文章同步到飞书多维表格
     * @param article 文章实体
     * @param tenant 租户实体
     */
    async syncArticleToFeishu(article: Article, tenant: Tenant): Promise<SyncResult> {
        // 🔒 检查是否已有正在进行的同步
        const existingSync = this.syncInProgress.get(article.id);
        if (existingSync) {
            this.logger.log(`⏳ 文章 ${article.id} 已有同步任务进行中，等待完成...`);
            return existingSync; // 返回正在进行的 Promise，避免重复创建
        }

        // 创建同步 Promise 并立即注册
        const syncPromise = this.doSyncArticleToFeishu(article, tenant);
        this.syncInProgress.set(article.id, syncPromise);

        try {
            return await syncPromise;
        } finally {
            // 同步完成后释放锁
            this.syncInProgress.delete(article.id);
        }
    }

    /**
     * 实际执行同步逻辑（内部方法）
     */
    private async doSyncArticleToFeishu(article: Article, tenant: Tenant): Promise<SyncResult> {
        try {
            const settings = tenant.settings || {};
            if (!settings.articleTable) {
                const message = `租户 ${tenant.name} 未配置文章管理表，跳过同步`;
                this.logger.warn(message);
                return { success: true, message };
            }

            const { appToken, tableId } = settings.articleTable;
            const client = this.createFeishuClient(tenant);

            // 批量映射用户 (优化 N+1 查询)
            const userMapping = await this.mapMultipleUserGroups({
                planners: article.planners || [],
                copywriters: article.copywriters || [],
                editors: article.editors || [],
            });

            const recordData: FeishuRecordData = {
                fields: {
                    '标题': article.title || '无标题',
                    '状态': article.status,
                    '内容策划': userMapping.planners,
                    '文案撰稿': userMapping.copywriters,
                    '文章编辑': userMapping.editors,
                    '最后更新': article.updatedAt ? article.updatedAt.getTime() : Date.now(),
                    '系统ID': article.id,
                },
            };

            if (!article.feishuRecordId) {
                // Double-check database in case another concurrent request updated it
                const freshArticle = await this.articleRepository.findOne({ where: { id: article.id }, select: ['feishuRecordId'] });
                if (freshArticle && freshArticle.feishuRecordId) {
                    article.feishuRecordId = freshArticle.feishuRecordId;
                    this.logger.log(`🔗 发现已存在的 Feishu Record ID: ${article.feishuRecordId}`);
                }
            }

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

            const successMessage = `✅ 文章 ${article.title} 已同步到飞书表格`;
            this.logger.log(successMessage);
            return { success: true, message: successMessage };
        } catch (error) {
            const errorMessage = `同步文章到飞书表格失败: ${error.message}`;
            this.logger.error(errorMessage, error.stack);
            return { success: false, error: errorMessage };
        }
    }

    /**
     * 从飞书 Webhook 事件同步文章到数据库
     */
    async syncArticleFromFeishu(event: FeishuWebhookEvent, tenant: Tenant): Promise<SyncResult> {
        const record_id = event.event?.record_id || event.record_id;
        const app_token = event.event?.app_token || event.app_token;
        const table_id = event.event?.table_id || event.table_id;

        if (!record_id || !app_token || !table_id) {
            return { success: false, error: '缺失必要的路由信息' };
        }

        try {
            const client = this.createFeishuClient(tenant);

            // 读取最新记录
            const recordRes = await client.bitable.appTableRecord.get({
                path: {
                    app_token,
                    table_id,
                    record_id,
                },
            });

            if (recordRes.code !== 0 || !recordRes.data?.record) {
                const error = `无法获取飞书记录 ${record_id}`;
                this.logger.error(`同步失败: ${error}`);
                return { success: false, error };
            }

            const fields = recordRes.data.record.fields as Partial<FeishuArticleFields>;
            const systemId = fields['系统ID'];

            if (!systemId) {
                const message = `飞书记录 ${record_id} 缺少系统ID，忽略`;
                this.logger.warn(message);
                return { success: true, message };
            }

            const article = await this.articleRepository.findOne({
                where: { id: systemId },
            });

            if (!article) {
                const error = `找不到对应的系统文章: ${systemId}`;
                this.logger.warn(error);
                return { success: false, error };
            }

            // 冲突检测：如果数据库里的更新时间比飞书记录的更新时间更晚，则不覆盖
            const feishuUpdatedAt = fields['最后更新'];
            if (article.updatedAt && feishuUpdatedAt && article.updatedAt.getTime() > feishuUpdatedAt) {
                const message = `数据库记录比飞书记录新，跳过该事件 (ID: ${systemId})`;
                this.logger.log(message);
                return { success: true, message };
            }

            // 更新本地记录
            this.logger.log(`正在从飞书同步文章更新: ${article.title}`);

            if (fields['标题']) article.title = fields['标题'];
            if (fields['状态']) article.status = fields['状态'] as ArticleStatus;

            // 同步人员字段
            if (fields['内容策划']) article.planners = await this.mapFeishuToUsers(fields['内容策划']);
            if (fields['文案撰稿']) article.copywriters = await this.mapFeishuToUsers(fields['文案撰稿']);
            if (fields['文章编辑']) article.editors = await this.mapFeishuToUsers(fields['文章编辑']);

            await this.articleRepository.save(article);
            const successMessage = `✅ 文章 ${article.title} 已从飞书同步`;
            this.logger.log(successMessage);
            return { success: true, message: successMessage };

        } catch (error) {
            const errorMessage = `从飞书同步文章失败: ${error.message}`;
            this.logger.error(errorMessage, error.stack);
            return { success: false, error: errorMessage };
        }
    }

    /**
     * 批量映射多个用户组 (减少数据库查询)
     */
    private async mapMultipleUserGroups(groups: { planners: string[], copywriters: string[], editors: string[] }): Promise<UserGroupMapping> {
        const allUserIds = Array.from(new Set([...groups.planners, ...groups.copywriters, ...groups.editors])).filter(id => !!id);

        if (allUserIds.length === 0) {
            return {
                planners: [],
                copywriters: [],
                editors: [],
            };
        }

        const users = await this.userRepository.createQueryBuilder('user')
            .where('user.id IN (:...ids)', { ids: allUserIds })
            .getMany();

        const userMap = new Map(users.map(u => [u.id, u.feishuId]));

        const getFeishuList = (ids: string[]): FeishuPerson[] =>
            ids.map(id => userMap.get(id))
                .filter((fid): fid is string => !!fid)
                .map(fid => ({ id: fid }));

        return {
            planners: getFeishuList(groups.planners),
            copywriters: getFeishuList(groups.copywriters),
            editors: getFeishuList(groups.editors),
        };
    }

    /**
     * 将飞书人员格式映射为系统用户 ID 数组
     */
    private async mapFeishuToUsers(feishuPeople: FeishuPerson[]): Promise<string[]> {
        if (!feishuPeople || !Array.isArray(feishuPeople)) return [];

        const openIds = feishuPeople.map(p => p.id).filter(id => !!id);
        if (openIds.length === 0) return [];

        const users = await this.userRepository.createQueryBuilder('user')
            .where('user.feishuId IN (:...ids)', { ids: openIds })
            .getMany();

        return users.map(u => u.id);
    }
}
