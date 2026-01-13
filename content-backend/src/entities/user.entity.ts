import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
  OneToMany,
} from 'typeorm';
import { Tenant } from './tenant.entity';
import { UserTenant } from './user-tenant.entity';

export enum UserRole {
  ADMIN = 'ADMIN', // 租户管理员
  EDITOR = 'EDITOR',
  COPYWRITER = 'COPYWRITER',
  PLANNER = 'PLANNER',
}

@Entity('users')
@Index(['email'], { unique: true }) // 邮箱全局唯一
@Index(['tenantId', 'email'], { unique: true }) // 同一租户内邮箱唯一
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // === 租户关联 ===
  @Column()
  tenantId: string;

  @ManyToOne(() => Tenant, (tenant) => tenant.users, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tenantId' })
  tenant: Tenant;

  @OneToMany(() => UserTenant, (membership) => membership.user)
  memberships: UserTenant[];

  // === 用户信息 ===
  @Column({ unique: true })
  email: string; // 邮箱（必填，全局唯一）

  @Column()
  password: string; // 加密后的密码

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.EDITOR,
  })
  role: UserRole;

  // === 邮箱验证 ===
  @Column({ default: false })
  emailVerified: boolean; // 邮箱是否已验证

  @Column({ type: 'varchar', nullable: true })
  verificationToken: string | null; // 邮箱验证令牌

  // === 密码重置 ===
  @Column({ type: 'varchar', nullable: true })
  resetPasswordToken: string | null; // 密码重置令牌

  @Column({ type: 'timestamp', nullable: true })
  resetPasswordExpires: Date | null; // 密码重置令牌过期时间

  @Column({ name: 'isactive', default: true })
  isActive: boolean;

  @Column({ name: 'lastloginat', nullable: true })
  lastLoginAt: Date;

  @Column({ name: 'feishu_id', nullable: true })
  feishuId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
