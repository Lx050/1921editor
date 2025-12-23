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

@Entity('wechat_authorizers')
@Index(['tenantId', 'authorizerAppId'], { unique: true })
export class WechatAuthorizer {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    tenantId: string;

    @ManyToOne(() => Tenant, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'tenantId' })
    tenant: Tenant;

    @Column({ unique: true })
    authorizerAppId: string; // 授权方 AppID

    @Column({ type: 'text', nullable: true })
    authorizerAccessToken: string;

    @Column({ type: 'text', nullable: true })
    authorizerRefreshToken: string;

    @Column({ type: 'timestamp', nullable: true })
    expiresAt: Date;

    // === 公众号基本信息 ===
    @Column({ nullable: true })
    nickName: string;

    @Column({ nullable: true })
    headImg: string;

    @Column({ nullable: true })
    userName: string; // 原始 ID

    @Column({ nullable: true })
    principalName: string; // 主体名称

    @Column({ type: 'jsonb', nullable: true })
    serviceTypeInfo: any;

    @Column({ type: 'jsonb', nullable: true })
    verifyTypeInfo: any;

    @Column({ nullable: true })
    alias: string; // 微信号

    @Column({ nullable: true })
    qrcodeUrl: string;

    @Column({ default: true })
    isActive: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
