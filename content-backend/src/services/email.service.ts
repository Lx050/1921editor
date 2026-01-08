import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

/**
 * 邮件服务
 * 提供 QQ 邮箱发送功能，支持邮箱验证、密码重置等场景
 */
@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly configService: ConfigService;
  private transporter: nodemailer.Transporter;

  constructor() {
    this.configService = new ConfigService();
    this.initializeTransporter();
  }

  /**
   * 初始化邮件传输器
   */
  private initializeTransporter(): void {
    const host = this.configService.get<string>('EMAIL_HOST');
    const port = parseInt(this.configService.get<string>('EMAIL_PORT', '465'));
    const secure =
      this.configService.get<string>('EMAIL_SECURE', 'true') === 'true';
    const user = this.configService.get<string>('EMAIL_USER');
    const pass = this.configService.get<string>('EMAIL_PASS');

    if (!host || !user || !pass) {
      this.logger.warn('邮件服务未配置，无法发送邮件');
      return;
    }

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass },
    });

    this.logger.log(`邮件传输器已初始化: ${host}:${port}`);
  }

  /**
   * 获取发件人信息
   */
  private getFromAddress(): string {
    const fromName =
      this.configService.get<string>('EMAIL_FROM_NAME') || '内容管理系统';
    const fromEmail = this.configService.get<string>('EMAIL_USER');
    return `"${fromName}" <${fromEmail}>`;
  }

  /**
   * 验证邮件配置是否有效
   */
  isConfigured(): boolean {
    return !!(
      this.configService.get<string>('EMAIL_HOST') &&
      this.configService.get<string>('EMAIL_USER') &&
      this.configService.get<string>('EMAIL_PASS')
    );
  }

  /**
   * 发送邮箱验证邮件
   * @param email 收件人邮箱
   * @param name 用户名称
   * @param verifyUrl 验证链接
   */
  async sendVerificationEmail(
    email: string,
    name: string,
    verifyUrl: string,
  ): Promise<void> {
    if (!this.transporter) {
      this.logger.warn(`邮件传输器未初始化，跳过发送验证邮件到 ${email}`);
      return;
    }

    const mailOptions = {
      from: this.getFromAddress(),
      to: email,
      subject: '验证您的邮箱',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">欢迎注册内容管理系统</h2>
          <p>您好 ${name}，</p>
          <p>请点击下面的链接验证您的邮箱：</p>
          <p>
            <a href="${verifyUrl}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">验证邮箱</a>
          </p>
          <p>如果您没有注册，请忽略此邮件。</p>
          <p style="color: #999; font-size: 12px;">此链接将在 24 小时后失效。</p>
        </div>
      `,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      this.logger.log(`验证邮件已发送到 ${email}: ${info.messageId}`);
    } catch (error) {
      this.logger.error(`发送验证邮件失败到 ${email}:`, error);
      throw error;
    }
  }

  /**
   * 发送密码重置邮件
   * @param email 收件人邮箱
   * @param resetUrl 重置链接
   */
  async sendPasswordResetEmail(email: string, resetUrl: string): Promise<void> {
    if (!this.transporter) {
      this.logger.warn(`邮件传输器未初始化，跳过发送密码重置邮件到 ${email}`);
      return;
    }

    const mailOptions = {
      from: this.getFromAddress(),
      to: email,
      subject: '重置您的密码',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">重置密码</h2>
          <p>您好，</p>
          <p>我们收到了您的密码重置请求。</p>
          <p>请点击下面的链接重置您的密码：</p>
          <p>
            <a href="${resetUrl}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">重置密码</a>
          </p>
          <p>如果您没有请求重置密码，请忽略此邮件。</p>
          <p style="color: #999; font-size: 12px;">此链接将在 1 小时后失效。</p>
        </div>
      `,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      this.logger.log(`密码重置邮件已发送到 ${email}: ${info.messageId}`);
    } catch (error) {
      this.logger.error(`发送密码重置邮件失败到 ${email}:`, error);
      throw error;
    }
  }

  /**
   * 发送密码已修改通知邮件
   * @param email 收件人邮箱
   * @param name 用户名称
   */
  async sendPasswordChangedNotification(
    email: string,
    name: string,
  ): Promise<void> {
    if (!this.transporter) {
      this.logger.warn(`邮件传输器未初始化，跳过发送密码修改通知到 ${email}`);
      return;
    }

    const mailOptions = {
      from: this.getFromAddress(),
      to: email,
      subject: '您的密码已修改',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">密码已修改</h2>
          <p>您好 ${name}，</p>
          <p>您的密码已成功修改。</p>
          <p>如果您没有修改密码，请立即联系管理员。</p>
        </div>
      `,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      this.logger.log(`密码修改通知已发送到 ${email}: ${info.messageId}`);
    } catch (error) {
      this.logger.error(`发送密码修改通知失败到 ${email}:`, error);
      throw error;
    }
  }

  /**
   * 发送欢迎邮件（用户加入租户时）
   * @param email 收件人邮箱
   * @param name 用户名称
   * @param tenantName 租户名称
   * @param role 用户角色
   */
  async sendWelcomeEmail(
    email: string,
    name: string,
    tenantName: string,
    role: string,
  ): Promise<void> {
    if (!this.transporter) {
      this.logger.warn(`邮件传输器未初始化，跳过发送欢迎邮件到 ${email}`);
      return;
    }

    const mailOptions = {
      from: this.getFromAddress(),
      to: email,
      subject: `欢迎加入 ${tenantName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">欢迎加入 ${tenantName}</h2>
          <p>您好 ${name}，</p>
          <p>您已成功加入 <strong>${tenantName}</strong>。</p>
          <p>您的角色是：<strong>${role}</strong></p>
          <p>现在可以开始使用内容管理系统了。</p>
        </div>
      `,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      this.logger.log(`欢迎邮件已发送到 ${email}: ${info.messageId}`);
    } catch (error) {
      this.logger.error(`发送欢迎邮件失败到 ${email}:`, error);
      throw error;
    }
  }
}
