import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';

@Entity('tenants')
export class Tenant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string; // 租户名称，如 "XX医疗公司"

  @Column({ unique: true, nullable: true })
  slug: string; // 租户标识符，用于URL，如 "xx-medical"

  // === 邀请码配置 ===
  @Column({ unique: true, nullable: true })
  inviteCode: string; // 企业专属邀请码（12位，全局唯一）

  @Column({ type: 'timestamp', nullable: true })
  inviteCodeExpires: Date | null; // 邀请码过期时间（null 表示永久有效）

  // === 微信公众号配置 ===
  @Column({ nullable: true })
  wechatAppId: string; // 该租户的微信公众号 APPID

  @Column({ nullable: true })
  wechatAppSecret: string; // 该租户的微信公众号 APPSECRET

  // === 状态管理 ===
  @Column({ default: true })
  isActive: boolean; // 租户是否激活

  @Column({ type: 'jsonb', nullable: true })
  settings: any; // 租户特定设置（如主题、配额等）

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // === 关联关系 ===
  @OneToMany(() => User, (user) => user.tenant)
  users: User[];
}
