import {
  Injectable,
  Logger,
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Tenant } from '../entities/tenant.entity';
import { UserTenant } from '../entities/user-tenant.entity';
import { InviteCodeService } from '../services/invite-code.service';
import { CacheService } from '../cache/cache.service';

/**
 * 租户成员关系管理服务
 * 负责处理用户与租户之间的成员关系
 */
@Injectable()
export class TenantMembershipService {
  private readonly logger = new Logger(TenantMembershipService.name);
  private readonly defaultTenantId =
    process.env.DEFAULT_TENANT_ID || '00000000-0000-0000-0000-000000000001';
  private readonly defaultTenantSlug = 'default';

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Tenant)
    private tenantRepository: Repository<Tenant>,
    @InjectRepository(UserTenant)
    private userTenantRepository: Repository<UserTenant>,
    private inviteCodeService: InviteCodeService,
    private cacheService: CacheService,
  ) {}

  private isDefaultTenant(tenant: Tenant | null): boolean {
    if (!tenant) return false;
    return (
      tenant.id === this.defaultTenantId ||
      tenant.slug === this.defaultTenantSlug
    );
  }

  private async resolveDefaultTenant(): Promise<Tenant | null> {
    const tenantById = await this.tenantRepository.findOne({
      where: { id: this.defaultTenantId },
    });
    if (tenantById) return tenantById;

    return this.tenantRepository.findOne({
      where: { slug: this.defaultTenantSlug },
    });
  }

  /**
   * 确保用户是租户的成员
   * 如果不是则创建成员关系
   */
  async ensureMembership(
    userId: string,
    tenantId: string,
    displayName?: string,
  ): Promise<void> {
    const existing = await this.userTenantRepository.findOne({
      where: { userId, tenantId },
    });
    if (!existing) {
      const membership = this.userTenantRepository.create({
        userId,
        tenantId,
        displayName: displayName?.trim() || undefined,
      });
      await this.userTenantRepository.save(membership);
      this.logger.log(`创建成员关系: 用户 ${userId} -> 租户 ${tenantId}`);
      // 清除用户租户列表缓存
      await this.cacheService.del(CacheService.userTenantsKey(userId));
    } else if (displayName && existing.displayName !== displayName.trim()) {
      existing.displayName = displayName.trim();
      await this.userTenantRepository.save(existing);
      this.logger.log(`更新成员显示名: 用户 ${userId} -> 租户 ${tenantId}`);
      // 清除缓存（显示名和成员关系都可能变化）
      await this.cacheService.del(CacheService.userTenantsKey(userId));
      await this.cacheService.del(
        CacheService.membershipDisplayNameKey(userId, tenantId),
      );
    }
  }

  /**
   * 获取用户可访问的租户列表
   */
  async getUserTenants(userId: string): Promise<Tenant[]> {
    // 尝试从缓存获取
    const cacheKey = CacheService.userTenantsKey(userId);
    const cached = await this.cacheService.get<Tenant[]>(cacheKey);
    if (cached) {
      return cached;
    }

    // 从数据库查询
    const memberships = await this.userTenantRepository.find({
      where: { userId },
      relations: ['tenant'],
    });

    const tenants = memberships
      .map((membership) => membership.tenant)
      .filter((tenant): tenant is Tenant => Boolean(tenant && tenant.isActive));

    const defaultTenant = await this.resolveDefaultTenant();
    if (defaultTenant && defaultTenant.isActive) {
      await this.ensureMembership(userId, defaultTenant.id);
      const hasDefault = tenants.some(
        (tenant) => tenant.id === defaultTenant.id,
      );
      if (!hasDefault) {
        tenants.unshift(defaultTenant);
      }
    }

    // 缓存结果（5分钟）
    await this.cacheService.set(cacheKey, tenants);

    return tenants;
  }

  /**
   * 获取成员在租户中的显示名称
   */
  async getMembershipDisplayName(
    userId: string,
    tenantId: string,
  ): Promise<string | undefined> {
    const membership = await this.userTenantRepository.findOne({
      where: { userId, tenantId },
    });
    return membership?.displayName?.trim() || undefined;
  }

  /**
   * 切换用户的当前租户
   */
  async switchTenant(userId: string, tenantId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('用户不存在');
    }

    if (!tenantId) {
      throw new BadRequestException('tenantId is required');
    }

    let membership = await this.userTenantRepository.findOne({
      where: { userId, tenantId },
      relations: ['tenant'],
    });

    if (!membership) {
      const defaultTenant = await this.resolveDefaultTenant();
      if (defaultTenant?.id === tenantId && defaultTenant.isActive) {
        await this.ensureMembership(userId, tenantId);
        membership = await this.userTenantRepository.findOne({
          where: { userId, tenantId },
          relations: ['tenant'],
        });
      }
    }

    if (!membership?.tenant || !membership.tenant.isActive) {
      throw new UnauthorizedException('没有该组织的访问权限');
    }

    user.tenantId = tenantId;
    await this.userRepository.save(user);

    this.logger.log(`用户 ${userId} 切换到租户 ${tenantId}`);

    return {
      user,
      tenant: membership.tenant,
      displayName: membership.displayName,
    };
  }

  /**
   * 通过邀请码加入租户
   */
  async joinTenantByInviteCode(
    userId: string,
    inviteCode: string,
    displayName: string,
  ) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('用户不存在');
    }

    const trimmedCode = inviteCode?.trim();
    if (!trimmedCode) {
      throw new BadRequestException('邀请码不能为空');
    }

    const trimmedName = displayName?.trim();
    if (!trimmedName) {
      throw new BadRequestException('成员名称不能为空');
    }

    const tenant = await this.tenantRepository.findOne({
      where: { inviteCode: trimmedCode },
    });
    if (!tenant) {
      throw new BadRequestException('邀请码无效');
    }
    if (this.inviteCodeService.isExpired(tenant.inviteCodeExpires)) {
      throw new BadRequestException('邀请码已过期');
    }
    if (!tenant.isActive) {
      throw new BadRequestException('组织已被停用');
    }

    await this.ensureMembership(userId, tenant.id, trimmedName);

    const defaultTenant = await this.resolveDefaultTenant();
    if (defaultTenant?.id && defaultTenant.isActive) {
      await this.ensureMembership(userId, defaultTenant.id);
    }

    user.tenantId = tenant.id;
    await this.userRepository.save(user);

    this.logger.log(`用户 ${userId} 通过邀请码加入租户 ${tenant.id}`);

    return { user, tenant, displayName: trimmedName };
  }

  /**
   * 退出租户
   */
  async leaveTenant(userId: string, tenantId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('用户不存在');
    }

    if (!tenantId) {
      throw new BadRequestException('tenantId is required');
    }

    const tenant = await this.tenantRepository.findOne({
      where: { id: tenantId },
    });
    if (!tenant) {
      throw new NotFoundException('组织不存在');
    }

    if (this.isDefaultTenant(tenant)) {
      throw new BadRequestException('默认组织不可退出');
    }

    const membership = await this.userTenantRepository.findOne({
      where: { userId, tenantId },
    });
    if (!membership) {
      throw new BadRequestException('未加入该组织');
    }

    await this.userTenantRepository.remove(membership);

    // 清除用户租户列表缓存
    await this.cacheService.del(CacheService.userTenantsKey(userId));

    this.logger.log(`用户 ${userId} 退出租户 ${tenantId}`);

    const tenants = await this.getUserTenants(userId);
    if (!tenants.length) {
      throw new BadRequestException('未找到可用的组织');
    }

    const activeTenant =
      tenants.find((item) => item.id === user.tenantId) || tenants[0];

    if (!activeTenant) {
      throw new BadRequestException('未找到可用的组织');
    }

    if (activeTenant.id !== user.tenantId) {
      user.tenantId = activeTenant.id;
      await this.userRepository.save(user);
    }

    const displayName = await this.getMembershipDisplayName(
      userId,
      activeTenant.id,
    );

    return { user, tenant: activeTenant, displayName };
  }
}
