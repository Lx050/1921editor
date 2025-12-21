import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../entities/user.entity';
import { FeishuService } from '../feishu/feishu.service';
import { Tenant } from '../entities/tenant.entity';

@Injectable()
export class FeishuOrgSyncService {
    private readonly logger = new Logger(FeishuOrgSyncService.name);

    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Tenant)
        private tenantRepository: Repository<Tenant>,
        private feishuService: FeishuService,
    ) { }

    /**
     * 从飞书通讯录同步用户
     * 需要权限：contact:user:read
     */
    async syncFromFeishuOrg(tenantId: string, departmentId?: string) {
        this.logger.log('开始从飞书组织架构同步用户...');

        const client = this.feishuService.getClient();
        const tenant = await this.tenantRepository.findOne({ where: { id: tenantId } });

        if (!tenant) {
            throw new Error(`租户不存在: ${tenantId}`);
        }

        try {
            // 1. 获取部门列表（可选，用于过滤特定部门）
            let userIds: string[] = [];

            if (departmentId) {
                // 只同步特定部门
                const deptUsers = await client.contact.user.list({
                    params: {
                        department_id: departmentId,
                        page_size: 100,
                    },
                });

                if (deptUsers.code === 0 && deptUsers.data?.items) {
                    userIds = deptUsers.data.items
                        .map((u) => u.open_id)
                        .filter((id): id is string => !!id);
                }
            } else {
                // 同步所有用户
                const allUsers = await client.contact.user.list({
                    params: {
                        page_size: 100, // 分页处理
                    },
                });

                if (allUsers.code === 0 && allUsers.data?.items) {
                    userIds = allUsers.data.items
                        .map((u) => u.open_id)
                        .filter((id): id is string => !!id);
                }
            }

            this.logger.log(`找到 ${userIds.length} 个飞书用户`);

            // 2. 获取每个用户的详细信息
            for (const openId of userIds) {
                const userInfo = await client.contact.user.get({
                    path: {
                        user_id: openId,
                    },
                    params: {
                        user_id_type: 'open_id',
                    },
                });

                if (userInfo.code !== 0 || !userInfo.data?.user) {
                    this.logger.warn(`无法获取用户信息: ${openId}`);
                    continue;
                }

                const feishuUser = userInfo.data.user;

                // 3. 根据部门或职位映射角色
                let role = UserRole.EDITOR; // 默认角色

                // 示例：根据部门名称判断角色
                if (feishuUser.department_ids?.includes('dept_admin')) {
                    role = UserRole.ADMIN;
                } else if (feishuUser.job_title?.includes('策划')) {
                    role = UserRole.PLANNER;
                } else if (feishuUser.job_title?.includes('文案')) {
                    role = UserRole.COPYWRITER;
                }

                // 4. 创建或更新用户
                let user = await this.userRepository.findOne({
                    where: {
                        tenantId: tenant.id,
                        feishuId: openId,
                    },
                });

                if (!user) {
                    user = this.userRepository.create({
                        tenantId: tenant.id,
                        feishuId: openId,
                        name: feishuUser.name || 'Unknown',
                        email: feishuUser.email || '',
                        role,
                    });
                    this.logger.log(`创建新用户: ${feishuUser.name} (${openId})`);
                } else {
                    user.name = feishuUser.name || user.name;
                    user.email = feishuUser.email || user.email;
                    user.role = role;
                    this.logger.log(`更新用户: ${feishuUser.name} (${openId})`);
                }

                await this.userRepository.save(user);
            }

            // 5. 可选：删除不在飞书的用户（离职处理）
            const allDbUsers = await this.userRepository.find({
                where: { tenantId: tenant.id },
            });

            for (const dbUser of allDbUsers) {
                if (!userIds.includes(dbUser.feishuId)) {
                    this.logger.warn(`用户已离职，从白名单移除: ${dbUser.name}`);
                    await this.userRepository.remove(dbUser);
                }
            }

            this.logger.log('✅ 飞书组织架构同步完成');

            return {
                success: true,
                synced: userIds.length,
                message: `成功同步 ${userIds.length} 个用户`,
            };
        } catch (error) {
            this.logger.error('飞书同步失败', error);
            throw error;
        }
    }

    /**
     * 定时任务：每天凌晨2点同步
     */
    // @Cron('0 2 * * *')
    async scheduledSync() {
        const tenants = await this.tenantRepository.find({
            where: { isActive: true }
        });

        for (const tenant of tenants) {
            try {
                await this.syncFromFeishuOrg(tenant.id);
            } catch (error) {
                this.logger.error(`租户 ${tenant.name} 同步失败`, error);
            }
        }
    }
}
