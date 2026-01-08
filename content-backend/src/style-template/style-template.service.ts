import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { StyleTemplate } from '../entities/style-template.entity';
import { CreateStyleTemplateDto, UpdateStyleTemplateDto } from './style-template.dto';
import { User, UserRole } from '../entities/user.entity';

@Injectable()
export class StyleTemplateService {
    constructor(
        @InjectRepository(StyleTemplate)
        private readonly styleRepository: Repository<StyleTemplate>,
    ) { }

    /**
     * 获取所有可用样式（系统默认 + 该用户所属租户的自定义样式）
     */
    async findAll(tenantId: string): Promise<StyleTemplate[]> {
        return this.styleRepository.find({
            where: [
                { tenantId: IsNull() }, // 系统默认
                { tenantId: tenantId }, // 租户自定义
            ],
            order: {
                isCustom: 'ASC',
                createdAt: 'DESC',
            },
        });
    }

    /**
     * 获取单个样式
     */
    async findOne(id: string, tenantId: string): Promise<StyleTemplate> {
        const style = await this.styleRepository.findOne({
            where: { id },
        });

        if (!style) {
            throw new NotFoundException('样式未找到');
        }

        // 如果不是系统样式，且不属于当前租户，则禁止访问
        if (style.tenantId && style.tenantId !== tenantId) {
            throw new ForbiddenException('您没有权限访问此样式');
        }

        return style;
    }

    /**
     * 创建自定义样式
     */
    async create(
        createDto: CreateStyleTemplateDto,
        user: User,
    ): Promise<StyleTemplate> {
        const style = this.styleRepository.create({
            ...createDto,
            isCustom: true,
            tenantId: user.tenantId,
            ownerId: user.id,
        });

        return this.styleRepository.save(style);
    }

    /**
     * 更新样式（云端样式 - 允许所有人修改）
     */
    async update(
        id: string,
        updateDto: UpdateStyleTemplateDto,
        user: User,
    ): Promise<StyleTemplate> {
        const style = await this.findOne(id, user.tenantId);

        // 云端样式允许所有人修改，不限制系统默认样式或创建者权限

        Object.assign(style, updateDto);
        return this.styleRepository.save(style);
    }

    /**
     * 删除样式（云端样式 - 允许所有人删除）
     */
    async delete(id: string, user: User): Promise<void> {
        const style = await this.findOne(id, user.tenantId);

        // 云端样式允许所有人删除，不限制系统默认样式或创建者权限

        await this.styleRepository.remove(style);
    }
}
