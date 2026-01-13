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
import { User } from './user.entity';
import { Tenant } from './tenant.entity';
import type {
  ArticleConfig,
  ArticleImage,
  WechatPublishResult,
} from './article.types';

export enum ArticleStatus {
  DRAFT = 'DRAFT',
  PARSED = 'PARSED',
  ADJUSTED = 'ADJUSTED',
  PUBLISHED = 'PUBLISHED',
}

@Entity('articles')
@Index(['tenantId']) // 添加租户索引以优化查询性能
export class Article {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // === 租户关联 ===
  @Column()
  tenantId: string;

  @ManyToOne(() => Tenant)
  @JoinColumn({ name: 'tenantId' })
  tenant: Tenant;

  @Column({ nullable: true })
  title: string;

  @Column('jsonb', { nullable: true })
  config: ArticleConfig; // Step 1: Layout/Style config

  @Column('text', { nullable: true })
  content: string; // Step 2: Parsed text

  @Column('jsonb', { default: [] })
  images: ArticleImage[]; // Step 3: Image metadata (url, caption)

  @Column({
    type: 'enum',
    enum: ArticleStatus,
    default: ArticleStatus.DRAFT,
  })
  status: ArticleStatus;

  @Column('jsonb', { nullable: true })
  wechatResult: WechatPublishResult; // Step 4: WeChat publish result

  @ManyToOne(() => User)
  @JoinColumn({ name: 'ownerId' })
  owner: User;

  @Column({ nullable: true })
  ownerId: string;

  @Column('jsonb', { default: [] }) // 策划人员
  planners: string[];

  @Column('jsonb', { default: [] }) // 文案撰稿
  copywriters: string[];

  @Column('jsonb', { default: [] }) // 文章编辑
  editors: string[];

  @Column({ nullable: true, name: 'feishurecordid' }) // 飞书多维表格记录ID
  feishuRecordId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
