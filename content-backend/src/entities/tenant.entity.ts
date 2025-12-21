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

  // === 飞书配置 ===
  @Column({ nullable: true })
  feishuAppId: string; // 该租户的飞书应用ID

  @Column({ nullable: true })
  feishuAppSecret: string; // 该租户的飞书应用密钥

  @Column({ nullable: true })
  feishuBaseAppToken: string; // 飞书多维表格 App Token（用户白名单表）

  @Column({ nullable: true })
  feishuBaseTableId: string; // 飞书多维表格 Table ID（用户白名单表）

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
