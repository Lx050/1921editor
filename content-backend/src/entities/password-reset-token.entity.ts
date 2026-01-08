import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';

/**
 * 密码重置令牌实体
 * 用于存储用户密码重置时的令牌
 */
@Entity('password_reset_tokens')
@Index(['email'])
@Index(['token'])
@Index(['expiresAt'])
export class PasswordResetToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string; // 用户邮箱

  @Column({ unique: true })
  token: string; // 重置令牌（UUID）

  @Column()
  expiresAt: Date; // 令牌过期时间（默认1小时）

  @Column({ default: false })
  used: boolean; // 令牌是否已使用

  @CreateDateColumn()
  createdAt: Date;
}
