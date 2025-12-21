import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Tenant } from './tenant.entity';

export enum UserRole {
  ADMIN = 'ADMIN', // 租户管理员
  EDITOR = 'EDITOR',
  COPYWRITER = 'COPYWRITER',
  PLANNER = 'PLANNER',
}

@Entity('users')
@Index(['tenantId', 'feishuId'], { unique: true }) // 组合唯一索引：同一租户内 feishuId 唯一
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // === 租户关联 ===
  @Column()
  tenantId: string;

  @ManyToOne(() => Tenant, (tenant) => tenant.users, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tenantId' })
  tenant: Tenant;

  // === 用户信息 ===
  @Column() // 不再是全局唯一，而是 (tenantId, feishuId) 组合唯一
  feishuId: string;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.EDITOR,
  })
  role: UserRole;

  @Column({ nullable: true })
  email: string; // From Feishu or manual match

  @Column({ name: 'isactive', default: true })
  isActive: boolean;

  @Column({ name: 'lastloginat', nullable: true })
  lastLoginAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
