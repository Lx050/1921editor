import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tenant } from '../entities/tenant.entity';

@Injectable()
export class TenantService {
  private readonly logger = new Logger(TenantService.name);

  constructor(
    @InjectRepository(Tenant)
    private tenantRepository: Repository<Tenant>,
  ) {}

  /**
   * 根据ID查找租户
   */
  async findById(id: string): Promise<Tenant> {
    const tenant = await this.tenantRepository.findOne({ where: { id } });
    if (!tenant) {
      throw new NotFoundException(`Tenant with ID ${id} not found`);
    }
    return tenant;
  }

  /**
   * 根据 slug 查找租户
   */
  async findBySlug(slug: string): Promise<Tenant> {
    const tenant = await this.tenantRepository.findOne({ where: { slug } });
    if (!tenant) {
      throw new NotFoundException(`Tenant with slug ${slug} not found`);
    }
    return tenant;
  }

  /**
   * 获取所有激活的租户
   */
  async findAll(): Promise<Tenant[]> {
    return this.tenantRepository.find({ where: { isActive: true } });
  }

  /**
   * 创建新租户
   */
  async create(tenantData: Partial<Tenant>): Promise<Tenant> {
    const tenant = this.tenantRepository.create(tenantData);
    return this.tenantRepository.save(tenant);
  }

  /**
   * 更新租户配置
   */
  async update(id: string, updates: Partial<Tenant>): Promise<Tenant> {
    await this.tenantRepository.update(id, updates);
    return this.findById(id);
  }

  /**
   * 停用租户
   */
  async deactivate(id: string): Promise<void> {
    await this.tenantRepository.update(id, { isActive: false });
    this.logger.log(`Tenant ${id} has been deactivated`);
  }

  /**
   * 根据飞书AppId查找租户
   */
  async findByFeishuAppId(feishuAppId: string): Promise<Tenant | null> {
    return this.tenantRepository.findOne({ where: { feishuAppId } });
  }

  /**
   * 根据微信AppId查找租户
   */
  async findByWechatAppId(wechatAppId: string): Promise<Tenant | null> {
    return this.tenantRepository.findOne({ where: { wechatAppId } });
  }
}
