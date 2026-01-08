import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';

/**
 * 邮箱验证令牌实体
 * 用于存储用户注册时的邮箱验证令牌
 */
@Entity('email_verification_tokens')
@Index(['email'])
@Index(['token'])
@Index(['expiresAt'])
export class EmailVerificationToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string; // 待验证的邮箱

  @Column({ unique: true })
  token: string; // 验证令牌（UUID）

  @Column()
  expiresAt: Date; // 令牌过期时间（默认24小时）

  @CreateDateColumn()
  createdAt: Date;
}
