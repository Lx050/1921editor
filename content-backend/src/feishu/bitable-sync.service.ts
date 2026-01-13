import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FeishuSdkService } from './feishu-sdk.service';
import { User } from '../entities/user.entity';
import { Article } from '../entities/article.entity';
import { Tenant } from '../entities/tenant.entity';

/**
 * Bitable 同步服务
 * 处理用户和文章到飞书多维表格的同步
 */
@Injectable()
export class BitableSyncService {
    private readonly logger = new Logger(BitableSyncService.name);

    constructor(
        private feishuSdk: FeishuSdkService,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Article)
        private articleRepository: Repository<Article>,
    ) { }

    // ==================== 用户同步 ====================

    /**
     * 同步用户信息到飞书表格
     * 在用户登录时调用
     */
    async syncUserToTable(user: User, tenant: Tenant): Promise<boolean> {
        if (!this.feishuSdk.isEnabled()) {
            this.logger.debug('飞书 SDK 未启用，跳过用户同步');
            return false;
        }

        const userTableConfig = tenant.settings?.userTable;
        if (!userTableConfig?.appToken || !userTableConfig?.tableId) {
            this.logger.debug(`租户 ${tenant.name} 未配置用户管理表`);
            return false;
        }

        const { appToken, tableId } = userTableConfig;

        try {
            // 构造用户字段数据
            const fields: Record<string, any> = {
                姓名: user.name,
                邮箱: user.email,
                岗位: user.role,
                FeishuID: user.feishuId || '',
                最后登录时间: user.lastLoginAt
                    ? new Date(user.lastLoginAt).getTime()
                    : null,
                状态: user.isActive ? '激活' : '禁用',
                系统ID: user.id,
            };

            // 查找是否已存在记录
            const existingRecord = await this.feishuSdk.findRecordByField(
                appToken,
                tableId,
                '系统ID',
                user.id,
            );

            if (existingRecord) {
                // 更新现有记录
                await this.feishuSdk.updateBitableRecord(
                    appToken,
                    tableId,
                    existingRecord.record_id,
                    fields,
                );
                this.logger.log(`🔄 用户同步更新: ${user.name}`);
            } else {
                // 创建新记录
                await this.feishuSdk.createBitableRecord(appToken, tableId, fields);
                this.logger.log(`➕ 用户同步创建: ${user.name}`);
            }

            return true;
        } catch (error) {
            this.logger.error(`用户同步失败: ${user.id}`, error);
            return false;
        }
    }

    // ==================== 文章同步 ====================

    /**
     * 同步文章信息到飞书表格
     * 在文章状态变更时调用
     */
    async syncArticleToTable(article: Article, tenant: Tenant): Promise<boolean> {
        if (!this.feishuSdk.isEnabled()) {
            this.logger.debug('飞书 SDK 未启用，跳过文章同步');
            return false;
        }

        const articleTableConfig = tenant.settings?.articleTable;
        if (!articleTableConfig?.appToken || !articleTableConfig?.tableId) {
            this.logger.debug(`租户 ${tenant.name} 未配置文章管理表`);
            return false;
        }

        const { appToken, tableId } = articleTableConfig;

        try {
            // 获取参与者姓名
            const [plannerNames, copywriterNames, editorNames] = await Promise.all([
                this.getUserNames(article.planners || []),
                this.getUserNames(article.copywriters || []),
                this.getUserNames(article.editors || []),
            ]);

            // V5: 从 config.metadata 获取提取的元数据
            const metadata = article.config?.metadata || {};

            // V6: 格式化为文本日期（飞书表格列为文本类型）
            const formattedDate = article.updatedAt
                ? new Date(article.updatedAt).toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })
                : null;

            // 构造文章字段数据（包含新的三下乡模式字段）
            // 状态映射：已同步 / 已编辑
            const feishuStatus = article.status === 'PUBLISHED' ? '已同步' : '已编辑';

            const fields: Record<string, any> = {
                文章标题: article.title || '无标题',
                状态: feishuStatus,
                队伍专项: metadata.teamProject || '',
                队伍名称: metadata.teamName || '',
                所属院系: metadata.teamDepartment || '',
                负责人: metadata.teamLeader || '',
                联系方式: metadata.teamContact || '',
                编辑: metadata.editorInput || editorNames.join(', ') || '',
                系统ID: article.id,
            };

            this.logger.debug(`[BitableSyncService] 同步字段详情: ${JSON.stringify(fields)}`);

            // 检查之前是否已经同步过 (通过系统ID反查)
            this.logger.debug(`[BitableSyncService] 尝试通过系统ID反查记录: ${article.id}`);
            const existingRecord = await this.feishuSdk.findRecordByField(appToken, tableId, '系统ID', article.id);

            let finalRecordId = '';
            if (existingRecord) {
                finalRecordId = existingRecord.id;
                this.logger.debug(`[BitableSyncService] 发现已存在记录: ${finalRecordId}`);
                await this.feishuSdk.updateBitableRecord(appToken, tableId, finalRecordId, fields);
                this.logger.log(`🔄 文章同步更新: ${article.title}`);
            } else {
                // 创建新记录
                const recordId = await this.feishuSdk.createBitableRecord(appToken, tableId, fields);
                finalRecordId = recordId || '';
                this.logger.log(`➕ 文章同步创建: ${article.title}`);
            }

            // 更新文章中的飞书记录ID (如果发生了变化)
            if (finalRecordId && article.feishuRecordId !== finalRecordId) {
                await this.articleRepository.update(article.id, {
                    feishuRecordId: finalRecordId,
                });
            }

            return true;
        } catch (error) {
            this.logger.error(`文章同步失败: ${article.id}`, error);
            return false;
        }
    }

    /**
     * 批量获取用户姓名
     */
    private async getUserNames(userIds: string[]): Promise<string[]> {
        if (!userIds || userIds.length === 0) return [];

        const users = await this.userRepository
            .createQueryBuilder('user')
            .select(['user.name'])
            .where('user.id IN (:...ids)', { ids: userIds })
            .getMany();

        const nameMap = new Map(users.map((u) => [u.id, u.name]));
        return userIds.map((id) => nameMap.get(id) || '未知').filter(Boolean);
    }

    /**
     * 触发文章同步（异步）
     * 供 ArticleService 调用
     */
    async triggerArticleSync(articleId: string): Promise<void> {
        const article = await this.articleRepository.findOne({
            where: { id: articleId },
            relations: ['tenant'],
        });

        if (!article || !article.tenant) {
            this.logger.warn(`文章或租户不存在: ${articleId}`);
            return;
        }

        // 异步同步，不阻塞主流程
        this.syncArticleToTable(article, article.tenant).catch((err) => {
            this.logger.error(`异步文章同步失败: ${articleId}`, err);
        });
    }
}
