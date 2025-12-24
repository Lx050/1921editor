import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('wechat_platform_config')
export class WechatPlatformConfig {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  componentVerifyTicket: string;

  @Column({ type: 'text', nullable: true })
  componentAccessToken: string;

  @Column({ type: 'timestamp', nullable: true })
  tokenExpiresAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
