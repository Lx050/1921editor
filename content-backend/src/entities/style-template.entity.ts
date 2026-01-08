import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from './user.entity';
import { Tenant } from './tenant.entity';

export type StyleType = 'title' | 'body' | 'intro';

/**
 * 样式模板实体
 * 支持系统默认样式（tenantId 为 null）和用户自定义样式
 */
@Entity('style_templates')
@Index(['tenantId', 'type'])
@Index(['ownerId'])
export class StyleTemplate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * 样式名称
   */
  @Column({ length: 100 })
  name: string;

  /**
   * 样式类型：标题、正文、引言
   */
  @Column({
    type: 'varchar',
    length: 20,
  })
  type: StyleType;

  /**
   * 预览 HTML（小缩略图）
   */
  @Column({ type: 'text' })
  preview: string;

  /**
   * 完整示例 HTML（应用到实际内容）
   */
  @Column({ type: 'text', name: 'full_example' })
  fullExample: string;

  /**
   * 是否为自定义样式
   * true: 用户自定义，false: 系统默认
   */
  @Column({ type: 'boolean', default: false, name: 'is_custom' })
  isCustom: boolean;

  /**
   * 租户 ID（系统默认样式为 null）
   */
  @Column({ type: 'uuid', nullable: true, name: 'tenant_id' })
  tenantId: string | null;

  /**
   * 创建者 ID（系统默认样式为 null）
   */
  @Column({ type: 'uuid', nullable: true, name: 'owner_id' })
  ownerId: string | null;

  @ManyToOne(() => Tenant, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'owner_id' })
  owner: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
