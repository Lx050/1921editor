/**
 * 微信续期智能通知管理器
 * 根据用户习惯和场景智能选择提醒方式
 */

// 声明 window.wx
declare global {
  interface Window {
    wx: any;
  }
}

interface NotificationOptions {
  title: string;
  message: string;
  priority?: 'low' | 'normal' | 'high' | 'critical';
  actions?: NotificationAction[];
  persistent?: boolean;
  timeout?: number;
  vibration?: boolean | number[];
  sound?: string;
}

interface NotificationAction {
  label: string;
  action: () => void;
  primary?: boolean;
  destructive?: boolean;
}

interface UserBehaviorPattern {
  activeHours: number[];      // 用户活跃时间段
  preferredChannels: string[]; // 偏好的通知渠道
  lastInteractionTime: number; // 最后交互时间
  notificationFrequency: number; // 通知频率偏好
}

export class WechatNotificationManager {
  private notificationChannels: Map<string, WechatNotificationChannel>;
  private userBehavior!: UserBehaviorPattern;
  private notificationHistory: Map<string, number[]>;

  constructor() {
    this.notificationChannels = new Map();
    this.initializeNotificationChannels();
    this.loadUserBehavior();
    this.notificationHistory = new Map();
  }

  /**
   * 初始化通知渠道
   */
  private initializeNotificationChannels(): void {
    // 应用内通知
    this.notificationChannels.set('inapp', new InAppNotificationChannel());

    // 系统通知
    this.notificationChannels.set('system', new SystemNotificationChannel());

    // 微信通知 (如果支持)
    this.notificationChannels.set('wechat', new WechatAppNotificationChannel());

    // 邮件通知
    this.notificationChannels.set('email', new EmailNotificationChannel());
  }

  /**
   * 加载用户行为模式
   */
  private loadUserBehavior(): void {
    const stored = localStorage.getItem('wechat_user_behavior');
    if (stored) {
      this.userBehavior = JSON.parse(stored);
    } else {
      this.userBehavior = {
        activeHours: [9, 10, 11, 14, 15, 16, 17, 18, 19, 20, 21], // 默认工作时间
        preferredChannels: ['inapp', 'system'],
        lastInteractionTime: Date.now(),
        notificationFrequency: 0.7, // 默认频率偏好
      };
    }
  }

  /**
   * 智能通知发送
   */
  async sendSmartNotification(options: NotificationOptions): Promise<void> {
    // 1. 分析当前场景
    const context = await this.analyzeNotificationContext();

    // 2. 选择最佳通知渠道
    const channels = this.selectOptimalChannels(options, context);

    // 3. 优化通知内容和时机
    const optimizedOptions = this.optimizeNotificationContent(options, context);

    // 4. 发送通知
    const results = await Promise.allSettled(
      channels.map(channel => this.sendNotification(channel, optimizedOptions))
    );

    // 5. 记录用户行为
    this.recordNotificationEvent(options.title, results);

    // 6. 学习和调整策略
    await this.adjustStrategyBasedOnResults(results);
  }

  /**
   * 显示成功通知
   */
  async showSuccess(title: string, message: string, options?: Partial<NotificationOptions>): Promise<void> {
    await this.sendSmartNotification({
      title,
      message,
      priority: 'low',
      ...options,
    });
  }

  /**
   * 显示警告通知
   */
  async showWarning(title: string, message: string, options?: Partial<NotificationOptions>): Promise<void> {
    await this.sendSmartNotification({
      title,
      message,
      priority: 'normal',
      vibration: true,
      sound: 'warning',
      ...options,
    });
  }

  /**
   * 显示紧急通知
   */
  async showCritical(title: string, message: string, options?: Partial<NotificationOptions>): Promise<void> {
    await this.sendSmartNotification({
      title,
      message,
      priority: 'critical',
      persistent: true,
      vibration: [200, 100, 200],
      sound: 'urgent',
      ...options,
    });
  }

  /**
   * 显示错误通知
   */
  async showError(title: string, message: string, options?: Partial<NotificationOptions>): Promise<void> {
    await this.sendSmartNotification({
      title,
      message,
      priority: 'high',
      vibration: true,
      sound: 'error',
      ...options,
    });
  }

  /**
   * 分析通知上下文
   */
  private async analyzeNotificationContext(): Promise<NotificationContext> {
    const now = new Date();
    const currentHour = now.getHours();
    const isUserActive = this.userBehavior.activeHours.includes(currentHour);

    // 检测应用状态
    const isAppInForeground = !document.hidden;
    const isUserOnline = navigator.onLine;

    // 检测设备状态
    const batteryLevel = await this.getBatteryLevel();
    const isQuietMode = await this.isQuietMode();

    // 检测用户活动
    const timeSinceLastInteraction = now.getTime() - this.userBehavior.lastInteractionTime;
    const isRecentlyActive = timeSinceLastInteraction < 30 * 60 * 1000; // 30分钟内活跃

    return {
      currentHour,
      isUserActive,
      isAppInForeground,
      isUserOnline,
      batteryLevel,
      isQuietMode,
      isRecentlyActive,
      timeSinceLastInteraction,
    };
  }

  /**
   * 选择最佳通知渠道
   */
  private selectOptimalChannels(options: NotificationOptions, context: NotificationContext): string[] {
    const channels: string[] = [];

    // 根据优先级选择渠道
    switch (options.priority) {
      case 'critical':
        // 紧急通知：使用所有可用渠道
        if (context.isAppInForeground) channels.push('inapp');
        if (!context.isQuietMode) channels.push('system');
        if (context.isUserOnline) channels.push('wechat');
        break;

      case 'high':
        // 高优先级：主要渠道
        if (context.isAppInForeground) channels.push('inapp');
        if (!context.isQuietMode && this.userBehavior.preferredChannels.includes('system')) {
          channels.push('system');
        }
        break;

      case 'normal':
        // 普通优先级：根据场景选择
        if (context.isAppInForeground) {
          channels.push('inapp');
        } else if (context.isUserActive && !context.isQuietMode) {
          channels.push('system');
        }
        break;

      case 'low':
        // 低优先级：仅在应用内显示
        if (context.isAppInForeground) {
          channels.push('inapp');
        }
        break;
    }

    // 过滤不可用的渠道
    return channels.filter(channel => this.notificationChannels.has(channel));
  }

  /**
   * 优化通知内容
   */
  private optimizeNotificationContent(options: NotificationOptions, context: NotificationContext): NotificationOptions {
    let optimized = { ...options };

    // 根据电池状态调整
    if (context.batteryLevel < 0.2) {
      // 低电量模式：减少震动和声音
      optimized.vibration = false;
      optimized.sound = undefined;
    }

    // 根据时间调整内容
    const hour = context.currentHour;
    if (hour >= 22 || hour <= 6) {
      // 夜间模式：更温和的提醒
      optimized.title = `🌙 ${optimized.title}`;
      optimized.vibration = optimized.vibration ? [50] : false;
    } else if (hour >= 12 && hour <= 14) {
      // 午休时间：稍后提醒选项
      if (!optimized.actions) {
        optimized.actions = [];
      }
      optimized.actions.push({
        label: '午休后提醒',
        action: () => this.scheduleReminder(optimized.title, optimized.message, 2 * 60 * 60 * 1000),
      });
    }

    // 根据用户活跃度调整
    if (!context.isRecentlyActive) {
      // 用户不活跃：增加吸引力的标题
      optimized.title = `💡 ${optimized.title}`;
    }

    return optimized;
  }

  /**
   * 发送通知到指定渠道
   */
  private async sendNotification(channel: string, options: NotificationOptions): Promise<boolean> {
    try {
      const notificationChannel = this.notificationChannels.get(channel);
      if (!notificationChannel) {
        throw new Error(`Unknown notification channel: ${channel}`);
      }

      await notificationChannel.send(options);
      return true;
    } catch (error) {
      console.error(`Failed to send notification via ${channel}:`, error);
      return false;
    }
  }

  /**
   * 记录通知事件
   */
  private recordNotificationEvent(title: string, _results: PromiseSettledResult<boolean>[]): void {
    const timestamp = Date.now();

    if (!this.notificationHistory.has(title)) {
      this.notificationHistory.set(title, []);
    }

    this.notificationHistory.get(title)!.push(timestamp);

    // 保留最近100条记录
    const history = this.notificationHistory.get(title)!;
    if (history.length > 100) {
      history.splice(0, history.length - 100);
    }

    // 更新用户行为
    this.userBehavior.lastInteractionTime = timestamp;
    this.saveUserBehavior();
  }

  /**
   * 根据结果调整策略
   */
  private async adjustStrategyBasedOnResults(results: PromiseSettledResult<boolean>[]): Promise<void> {
    const successRate = results.filter(r => r.status === 'fulfilled' && r.value).length / results.length;

    if (successRate < 0.5) {
      // 成功率低，调整策略
      console.log('[通知管理] 通知成功率较低，调整策略');

      // 可以在这里实现自适应策略调整
      // 例如：尝试不同的通知渠道、调整时间间隔等
    }
  }

  /**
   * 调度提醒
   */
  private scheduleReminder(title: string, message: string, delay: number): void {
    setTimeout(() => {
      this.showWarning(title, message, {
        actions: [{
          label: '知道了',
          action: () => { },
          primary: true,
        }],
      });
    }, delay);
  }

  /**
   * 获取电池电量
   */
  private async getBatteryLevel(): Promise<number> {
    if ('getBattery' in navigator) {
      try {
        const battery = await (navigator as any).getBattery();
        return battery.level;
      } catch {
        return 1.0; // 无法获取，假设满电
      }
    }
    return 1.0;
  }

  /**
   * 检查是否在静音模式
   */
  private async isQuietMode(): Promise<boolean> {
    // 检查系统的静音模式
    if ('vibrate' in navigator) {
      // 尝试短震动，如果不震动则可能在静音模式
      try {
        navigator.vibrate(1);
        return false;
      } catch {
        return true;
      }
    }
    return false;
  }

  /**
   * 保存用户行为数据
   */
  private saveUserBehavior(): void {
    localStorage.setItem('wechat_user_behavior', JSON.stringify(this.userBehavior));
  }

  /**
   * 清理通知历史
   */
  cleanupNotificationHistory(): void {
    const cutoffTime = Date.now() - 30 * 24 * 60 * 60 * 1000; // 30天前

    for (const [title, timestamps] of this.notificationHistory.entries()) {
      const filtered = timestamps.filter(timestamp => timestamp > cutoffTime);
      if (filtered.length === 0) {
        this.notificationHistory.delete(title);
      } else {
        this.notificationHistory.set(title, filtered);
      }
    }
  }
}

// 通知上下文接口
interface NotificationContext {
  currentHour: number;
  isUserActive: boolean;
  isAppInForeground: boolean;
  isUserOnline: boolean;
  batteryLevel: number;
  isQuietMode: boolean;
  isRecentlyActive: boolean;
  timeSinceLastInteraction: number;
}

// 通知渠道基类
abstract class WechatNotificationChannel {
  abstract send(options: NotificationOptions): Promise<void>;
}

// 应用内通知渠道
class InAppNotificationChannel extends WechatNotificationChannel {
  async send(options: NotificationOptions): Promise<void> {
    // 实现应用内通知逻辑
    const notification = document.createElement('div');
    notification.className = `wechat-notification ${options.priority || 'normal'}`;
    notification.innerHTML = `
      <div class="notification-content">
        <h4>${options.title}</h4>
        <p>${options.message}</p>
        ${options.actions ? this.renderActions(options.actions) : ''}
      </div>
      <button class="notification-close" onclick="this.parentElement.remove()">×</button>
    `;

    document.body.appendChild(notification);

    // 自动移除通知
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, options.timeout || 5000);
  }

  private renderActions(actions: NotificationAction[]): string {
    return actions.map(action => `
      <button class="notification-action ${action.primary ? 'primary' : ''}"
              onclick="${action.action.toString()}">
        ${action.label}
      </button>
    `).join('');
  }
}

// 系统通知渠道
class SystemNotificationChannel extends WechatNotificationChannel {
  async send(options: NotificationOptions): Promise<void> {
    if ('Notification' in navigator && Notification.permission === 'granted') {
      const notification = new Notification(options.title, {
        body: options.message,
        icon: '/icons/wechat-notification.png',
        badge: '/icons/wechat-badge.png',
        silent: options.vibration === false,
        requireInteraction: options.persistent,
        tag: 'wechat-renewal',
      } as any);

      if (options.actions && options.actions.length > 0) {
        // 注意：某些浏览器可能不支持通知操作按钮
        notification.onclick = () => {
          options.actions![0].action();
          notification.close();
        };
      }

      if (options.timeout) {
        setTimeout(() => {
          notification.close();
        }, options.timeout);
      }
    }
  }
}

// 微信应用通知渠道 (如果支持)
class WechatAppNotificationChannel extends WechatNotificationChannel {
  async send(options: NotificationOptions): Promise<void> {
    // 实现微信小程序内通知
    if (window.wx && window.wx.miniProgram) {
      window.wx.miniProgram.postMessage({
        data: {
          type: 'notification',
          title: options.title,
          message: options.message,
        }
      });
    }
  }
}

// 邮件通知渠道
class EmailNotificationChannel extends WechatNotificationChannel {
  async send(options: NotificationOptions): Promise<void> {
    // 实现邮件通知逻辑
    await fetch('/api/notifications/email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subject: options.title,
        content: options.message,
        priority: options.priority,
      }),
    });
  }
}