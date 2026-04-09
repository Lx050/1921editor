/**
 * 微信自动续期服务 - 移动端专用
 * 目标：让用户感觉不到30天的授权限制
 */
import { WechatNotificationManager } from './wechatNotificationManager';
import { WechatBackgroundRenewal } from './wechatBackgroundRenewal';

interface RenewalPolicy {
  earlyRenewalDays: number;    // 提前续期天数
  reminderIntervals: number[]; // 提醒间隔 (小时)
  maxRetryAttempts: number;    // 最大重试次数
  fallbackToBackup: boolean;   // 是否启用备用账号
}

interface AccountHealthStatus {
  accountId: string;
  nickname: string;
  expiresAt: number;
  healthScore: number;         // 0-100 账号健康度
  lastRenewalAt: number;
  renewalCount: number;
  autoRenewalEnabled: boolean;
}

export class WechatAutoRenewalService {
  private static instance: WechatAutoRenewalService;
  private renewalPolicy: RenewalPolicy = {
    earlyRenewalDays: 7,        // 提前7天开始续期流程
    reminderIntervals: [72, 48, 24, 12, 6, 3, 1], // 提醒时间点
    maxRetryAttempts: 3,
    fallbackToBackup: true,
  };

  private notificationManager: WechatNotificationManager;
  private backgroundRenewal: WechatBackgroundRenewal;
  private healthMonitorInterval: ReturnType<typeof setInterval> | null = null;

  private constructor() {
    this.notificationManager = new WechatNotificationManager();
    this.backgroundRenewal = new WechatBackgroundRenewal();
    this.initBackgroundServices();
  }

  static getInstance(): WechatAutoRenewalService {
    if (!WechatAutoRenewalService.instance) {
      WechatAutoRenewalService.instance = new WechatAutoRenewalService();
    }
    return WechatAutoRenewalService.instance;
  }

  /**
   * 启动自动续期服务
   */
  async startAutoRenewalService(): Promise<void> {
    console.debug('[WeChat自动续期] 启动服务...');

    // 1. 启动健康监控
    this.startHealthMonitoring();

    // 2. 检查所有账号状态
    await this.performHealthCheck();

    // 3. 启动后台续期任务
    await this.backgroundRenewal.start();

    // 4. 注册应用生命周期监听
    this.registerAppLifecycleListeners();

    console.debug('[WeChat自动续期] 服务启动完成');
  }

  /**
   * 健康状态监控
   */
  private startHealthMonitoring(): void {
    // 每30分钟检查一次账号健康状态
    this.healthMonitorInterval = setInterval(async () => {
      await this.performHealthCheck();
    }, 30 * 60 * 1000);

    // 页面可见性变化时立即检查
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        this.performHealthCheck();
      }
    });

    // 网络恢复时立即检查
    window.addEventListener('online', () => {
      this.performHealthCheck();
    });
  }

  /**
   * 执行健康检查
   */
  private async performHealthCheck(): Promise<void> {
    try {
      const accounts = await this.getAllAccounts();
      const healthStatuses: AccountHealthStatus[] = [];

      for (const account of accounts) {
        const health = await this.calculateAccountHealth(account);
        healthStatuses.push(health);

        // 根据健康状态采取行动
        await this.takeActionBasedOnHealth(health);
      }

      // 更新UI显示
      this.updateHealthDisplay(healthStatuses);
    } catch (error) {
      console.error('[WeChat自动续期] 健康检查失败:', error);
    }
  }

  /**
   * 计算账号健康度 (0-100)
   */
  private async calculateAccountHealth(account: any): Promise<AccountHealthStatus> {
    const now = Date.now();
    const expiresAt = account.tokenData.expires_at;
    const daysToExpiry = (expiresAt - now) / (24 * 60 * 60 * 1000);

    let healthScore = 100;

    // 基于剩余时间计算健康度
    if (daysToExpiry <= 0) {
      healthScore = 0; // 已过期
    } else if (daysToExpiry <= 1) {
      healthScore = 20; // 1天内过期
    } else if (daysToExpiry <= 3) {
      healthScore = 40; // 3天内过期
    } else if (daysToExpiry <= 7) {
      healthScore = 60; // 7天内过期
    } else if (daysToExpiry <= 15) {
      healthScore = 80; // 15天内过期
    }

    // 根据续期历史调整分数
    const renewalHistory = await this.getRenewalHistory(account.id);
    if (renewalHistory.recentFailures > 0) {
      healthScore -= renewalHistory.recentFailures * 10;
    }

    return {
      accountId: account.id,
      nickname: account.nickname,
      expiresAt,
      healthScore: Math.max(0, healthScore),
      lastRenewalAt: renewalHistory.lastRenewalAt || 0,
      renewalCount: renewalHistory.totalRenewals || 0,
      autoRenewalEnabled: account.autoRenewal !== false,
    };
  }

  /**
   * 根据健康状态采取行动
   */
  private async takeActionBasedOnHealth(health: AccountHealthStatus): Promise<void> {
    if (!health.autoRenewalEnabled) return;

    const now = Date.now();
    const daysToExpiry = (health.expiresAt - now) / (24 * 60 * 60 * 1000);

    // 🚨 紧急情况：立即续期
    if (daysToExpiry <= 1) {
      await this.emergencyRenewal(health);
    }
    // ⚠️ 警告情况：智能续期
    else if (daysToExpiry <= this.renewalPolicy.earlyRenewalDays) {
      await this.intelligentRenewal(health);
    }
    // 📋 提醒情况：发送通知
    else if (daysToExpiry <= 15) {
      await this.sendScheduledReminder(health);
    }
  }

  /**
   * 紧急续期 - 24小时内过期
   */
  private async emergencyRenewal(health: AccountHealthStatus): Promise<void> {
    try {
      console.debug(`[WeChat自动续期] 紧急续期: ${health.nickname}`);

      const success = await this.backgroundRenewal.attemptRenewal(health.accountId, {
        priority: 'high',
        timeout: 10000,
        retryAttempts: 3,
      });

      if (success) {
        await this.notificationManager.showSuccess(
          `${health.nickname} 续期成功`,
          '已自动延长30天有效期'
        );
      } else {
        // 续期失败，启动备用方案
        await this.handleRenewalFailure(health);
      }
    } catch (error) {
      console.error(`[WeChat自动续期] 紧急续期失败:`, error);
      await this.handleRenewalFailure(health);
    }
  }

  /**
   * 智能续期 - 提前续期
   */
  private async intelligentRenewal(health: AccountHealthStatus): Promise<void> {
    try {
      // 选择最佳续期时机
      const optimalTime = await this.calculateOptimalRenewalTime(health);
      const now = Date.now();

      if (now >= optimalTime) {
        console.debug(`[WeChat自动续期] 智能续期: ${health.nickname}`);

        const success = await this.backgroundRenewal.attemptRenewal(health.accountId, {
          priority: 'normal',
          timeout: 15000,
          retryAttempts: 2,
        });

        if (success) {
          await this.recordSuccessfulRenewal(health);
        }
      } else {
        // 设置定时续期
        this.scheduleRenewal(health.accountId, optimalTime - now);
      }
    } catch (error) {
      console.error(`[WeChat自动续期] 智能续期失败:`, error);
    }
  }

  /**
   * 计算最佳续期时机
   */
  private async calculateOptimalRenewalTime(health: AccountHealthStatus): Promise<number> {
    const expiresAt = health.expiresAt;

    // 基于历史数据和当前网络状况计算最佳时机
    const networkQuality = await this.assessNetworkQuality();
    const historicalSuccessRate = await this.getHistoricalSuccessRate(health.accountId);

    // 网络好且成功率高，可以晚一点续期
    const bufferDays = networkQuality > 0.8 && historicalSuccessRate > 0.9 ? 3 : 5;

    return expiresAt - (bufferDays * 24 * 60 * 60 * 1000);
  }

  /**
   * 处理续期失败
   */
  private async handleRenewalFailure(health: AccountHealthStatus): Promise<void> {
    // 1. 尝试备用账号
    if (this.renewalPolicy.fallbackToBackup) {
      const backupAccount = await this.findAvailableBackupAccount();
      if (backupAccount) {
        await this.switchToBackupAccount(health, backupAccount);
        return;
      }
    }

    // 2. 发送紧急通知，要求用户手动重新授权
    await this.notificationManager.showCritical(
      '微信授权即将过期',
      `${health.nickname} 自动续期失败，请手动重新授权`,
      {
        actions: [
          {
            label: '立即重新授权',
            action: () => this.startManualReauth(health.accountId),
            primary: true,
          },
          {
            label: '稍后提醒',
            action: () => this.scheduleManualReminder(health.accountId, 1),
          },
        ],
        persistent: true,
      }
    );
  }

  /**
   * 启动手动重新授权流程
   */
  private async startManualReauth(accountId: string): Promise<void> {
    try {
      // 生成带特殊参数的授权URL，标记这是续期授权
      const response = await fetch('/api/auth/wechat/renewal-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accountId,
          isRenewal: true,
          timestamp: Date.now(),
        }),
      });

      const { authUrl } = await response.json();

      // 跳转到微信授权页面
      window.location.href = authUrl;
    } catch (error) {
      console.error('[WeChat自动续期] 启动手动重新授权失败:', error);
      this.notificationManager.showError('授权异常', '启动重新授权失败，请重试');
    }
  }

  /**
   * 初始化后台服务
   */
  private initBackgroundServices(): void {
    // 注册Service Worker支持后台续期
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw-wechat-renewal.js')
        .then(registration => {
          console.debug('[WeChat自动续期] Service Worker注册成功');
          this.backgroundRenewal.setServiceWorkerRegistration(registration);
        })
        .catch(error => {
          console.error('[WeChat自动续期] Service Worker注册失败:', error);
        });
    }

    // 请求通知权限
    this.requestNotificationPermission();
  }

  /**
   * 请求通知权限
   */
  private async requestNotificationPermission(): Promise<void> {
    if ('Notification' in navigator) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        console.debug('[WeChat自动续期] 通知权限已获取');
      }
    }
  }

  /**
   * 注册应用生命周期监听
   */
  private registerAppLifecycleListeners(): void {
    // 应用进入前台时执行检查
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        setTimeout(() => {
          this.performHealthCheck();
        }, 1000); // 延迟1秒执行，确保应用完全加载
      }
    });

    // 应用从后台恢复时执行检查
    window.addEventListener('pageshow', (event) => {
      if (event.persisted) {
        this.performHealthCheck();
      }
    });

    // 设备唤醒时执行检查
    window.addEventListener('online', () => {
      this.performHealthCheck();
    });
  }

  /**
   * 停止服务
   */
  stopAutoRenewalService(): void {
    if (this.healthMonitorInterval) {
      clearInterval(this.healthMonitorInterval);
    }

    this.backgroundRenewal.stop();
    console.debug('[WeChat自动续期] 服务已停止');
  }

  // ... 其他辅助方法
  private async getAllAccounts() {
    // 实现获取所有账号的逻辑
    return [];
  }

  private async getRenewalHistory(_accountId: string) {
    // 实现获取续期历史的逻辑
    return { recentFailures: 0, lastRenewalAt: 0, totalRenewals: 0 };
  }

  private updateHealthDisplay(_statuses: AccountHealthStatus[]) {
    // 更新UI显示健康状态
  }

  private async sendScheduledReminder(_health: AccountHealthStatus) {
    // 发送定时提醒
  }

  private scheduleRenewal(_accountId: string, _delay: number) {
    // 调度续期任务
  }

  private async recordSuccessfulRenewal(_health: AccountHealthStatus) {
    // 记录成功续期
  }

  private async assessNetworkQuality(): Promise<number> {
    // 评估网络质量 (0-1)
    return 0.9;
  }

  private async getHistoricalSuccessRate(_accountId: string): Promise<number> {
    // 获取历史成功率 (0-1)
    return 0.95;
  }

  private async findAvailableBackupAccount() {
    // 查找可用备用账号
    return null;
  }

  private async switchToBackupAccount(_failedAccount: AccountHealthStatus, _backupAccount: any) {
    // 切换到备用账号
  }

  private scheduleManualReminder(_accountId: string, _hours: number) {
    // 调度手动提醒
  }
}