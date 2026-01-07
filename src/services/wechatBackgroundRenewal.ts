/**
 * 微信后台无感知续期服务
 * 在用户无感知的情况下自动完成续期操作
 */

interface RenewalTask {
  id: string;
  accountId: string;
  priority: 'low' | 'normal' | 'high';
  scheduledAt: number;
  retryCount: number;
  maxRetries: number;
  timeout: number;
}

interface RenewalResult {
  success: boolean;
  taskId: string;
  completedAt: number;
  error?: string;
  tokenData?: any;
}

export class WechatBackgroundRenewal {
  private renewalQueue: RenewalTask[] = [];
  private activeRenewals: Map<string, Promise<RenewalResult>> = new Map();
  private serviceWorkerRegistration: ServiceWorkerRegistration | null = null;
  private backgroundSyncSupported: boolean = false;
  private isRunning: boolean = false;

  constructor() {
    this.checkBackgroundSupport();
  }

  /**
   * 检查后台功能支持
   */
  private checkBackgroundSupport(): void {
    this.backgroundSyncSupported = 'serviceWorker' in navigator &&
      'PeriodicSyncManager' in window;

    console.log('[后台续期] 背景同步支持:', this.backgroundSyncSupported);
  }

  /**
   * 启动后台续期服务
   */
  async start(): Promise<void> {
    if (this.isRunning) return;

    this.isRunning = true;
    console.log('[后台续期] 启动服务...');

    // 1. 恢复未完成的续期任务
    await this.restorePendingTasks();

    // 2. 注册后台同步
    if (this.backgroundSyncSupported) {
      await this.registerPeriodicSync();
    }

    // 3. 启动任务处理器
    this.startTaskProcessor();

    // 4. 监听网络状态变化
    this.registerNetworkListeners();

    console.log('[后台续期] 服务启动完成');
  }

  /**
   * 停止后台续期服务
   */
  stop(): void {
    this.isRunning = false;
    this.activeRenewals.clear();
    console.log('[后台续期] 服务已停止');
  }

  /**
   * 设置Service Worker注册
   */
  setServiceWorkerRegistration(registration: ServiceWorkerRegistration): void {
    this.serviceWorkerRegistration = registration;
  }

  /**
   * 尝试续期
   */
  async attemptRenewal(accountId: string, options: {
    priority?: 'low' | 'normal' | 'high';
    timeout?: number;
    retryAttempts?: number;
  } = {}): Promise<boolean> {
    const task: RenewalTask = {
      id: this.generateTaskId(),
      accountId,
      priority: options.priority || 'normal',
      scheduledAt: Date.now(),
      retryCount: 0,
      maxRetries: options.retryAttempts || 3,
      timeout: options.timeout || 15000,
    };

    // 检查是否已在进行中
    if (this.isRenewalInProgress(accountId)) {
      console.log(`[后台续期] 账号 ${accountId} 续期已在进行中，跳过`);
      return false;
    }

    // 添加到队列
    this.addToRenewalQueue(task);

    // 执行续期
    const result = await this.executeRenewal(task);

    return result.success;
  }

  /**
   * 执行续期操作
   */
  private async executeRenewal(task: RenewalTask): Promise<RenewalResult> {
    const startTime = Date.now();

    try {
      console.log(`[后台续期] 开始续期任务: ${task.id}, 账号: ${task.accountId}`);

      // 检查网络连接
      if (!navigator.onLine) {
        throw new Error('网络连接不可用');
      }

      // 创建续期Promise
      const renewalPromise = this.performRenewalOperation(task);

      // 添加超时控制
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('续期超时')), task.timeout);
      });

      // 添加到活跃续期列表
      this.activeRenewals.set(task.accountId, renewalPromise);

      const result = await Promise.race([renewalPromise, timeoutPromise]);

      const renewalResult: RenewalResult = {
        success: true,
        taskId: task.id,
        completedAt: Date.now(),
        tokenData: result,
      };

      console.log(`[后台续期] 续期成功: ${task.id}, 耗时: ${Date.now() - startTime}ms`);

      return renewalResult;

    } catch (error) {
      console.error(`[后台续期] 续期失败: ${task.id}, 错误:`, error);

      // 处理重试逻辑
      if (task.retryCount < task.maxRetries) {
        console.log(`[后台续期] 准备重试: ${task.id}, 第${task.retryCount + 1}次重试`);

        // 指数退避重试
        const delay = Math.min(1000 * Math.pow(2, task.retryCount), 30000);
        task.scheduledAt = Date.now() + delay;
        task.retryCount++;

        // 重新调度
        this.scheduleRetry(task);
      }

      return {
        success: false,
        taskId: task.id,
        completedAt: Date.now(),
        error: (error as any).message,
      };
    } finally {
      // 从活跃列表中移除
      this.activeRenewals.delete(task.accountId);
    }
  }

  /**
   * 执行实际的续期操作
   */
  private async performRenewalOperation(task: RenewalTask): Promise<any> {
    try {
      // 1. 获取账号信息
      const accountInfo = await this.getAccountInfo(task.accountId);
      if (!accountInfo) {
        throw new Error('账号信息不存在');
      }

      // 2. 检查是否真的需要续期
      if (!this.needsRenewal(accountInfo)) {
        console.log(`[后台续期] 账号 ${task.accountId} 不需要续期`);
        return accountInfo.tokenData;
      }

      // 3. 尝试使用refresh_token续期
      const newTokenData = await this.refreshToken(accountInfo);

      // 4. 更新本地存储
      await this.updateLocalTokenData(task.accountId, newTokenData);

      // 5. 验证新token有效性
      await this.validateToken(newTokenData);

      return newTokenData;

    } catch (error) {
      console.error(`[后台续期] 续期操作失败:`, error);
      throw error;
    }
  }

  /**
   * 检查账号是否需要续期
   */
  private needsRenewal(accountInfo: any): boolean {
    const now = Date.now();
    const expiresAt = accountInfo.tokenData.expires_at;
    const daysToExpiry = (expiresAt - now) / (24 * 60 * 60 * 1000);

    // 提前3天续期
    return daysToExpiry <= 3;
  }

  /**
   * 使用refresh_token续期
   */
  private async refreshToken(accountInfo: any): Promise<any> {
    const refreshToken = accountInfo.tokenData.refresh_token;

    const response = await fetch('/api/wechat/token/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refresh_token: refreshToken,
        account_id: accountInfo.id,
      }),
    });

    if (!response.ok) {
      throw new Error(`续期请求失败: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || '续期失败');
    }

    return result.token_data;
  }

  /**
   * 验证token有效性
   */
  private async validateToken(tokenData: any): Promise<void> {
    try {
      const response = await fetch('/api/wechat/token/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          access_token: tokenData.access_token,
        }),
      });

      if (!response.ok) {
        throw new Error('Token验证失败');
      }

      const result = await response.json();
      if (!result.valid) {
        throw new Error('Token无效');
      }
    } catch (error: any) {
      throw new Error(`Token验证异常: ${error.message}`);
    }
  }

  /**
   * 注册周期性同步
   */
  private async registerPeriodicSync(): Promise<void> {
    if (!this.serviceWorkerRegistration) return;

    try {
      const registration = this.serviceWorkerRegistration;
      if ('periodicSync' in registration) {
        await (registration as any).periodicSync.register('wechat-renewal-check', {
          minInterval: 60 * 60 * 1000, // 每小时检查一次
        });
        console.log('[后台续期] 周期性同步注册成功');
      }
    } catch (error) {
      console.error('[后台续期] 注册周期性同步失败:', error);
    }
  }

  /**
   * 启动任务处理器
   */
  private startTaskProcessor(): void {
    const processTasks = async () => {
      if (!this.isRunning) return;

      // 处理队列中的任务
      const now = Date.now();
      const readyTasks = this.renewalQueue.filter(task => task.scheduledAt <= now);

      for (const task of readyTasks) {
        // 从队列中移除
        this.removeFromQueue(task.id);

        // 执行续期（不等待，继续处理下一个）
        this.executeRenewal(task).catch(error => {
          console.error(`[后台续期] 任务执行失败: ${task.id}`, error);
        });
      }

      // 继续处理
      setTimeout(processTasks, 5000); // 每5秒检查一次
    };

    processTasks();
  }

  /**
   * 注册网络监听器
   */
  private registerNetworkListeners(): void {
    // 网络恢复时处理待处理任务
    window.addEventListener('online', () => {
      console.log('[后台续期] 网络恢复，处理待处理任务');
      this.handleNetworkRecovery();
    });

    // 网络断开时暂停任务
    window.addEventListener('offline', () => {
      console.log('[后台续期] 网络断开，暂停任务');
    });
  }

  /**
   * 处理网络恢复
   */
  private handleNetworkRecovery(): void {
    // 重新调度失败的任务
    const failedTasks = this.renewalQueue.filter(task => task.retryCount < task.maxRetries);

    for (const task of failedTasks) {
      // 重新调度失败任务
      task.scheduledAt = Date.now() + Math.random() * 30000; // 随机延迟30秒内
    }
  }

  /**
   * 恢复待处理任务
   */
  private async restorePendingTasks(): Promise<void> {
    try {
      // 从IndexedDB或localStorage恢复任务
      const stored = localStorage.getItem('wechat_renewal_tasks');
      if (stored) {
        const tasks: RenewalTask[] = JSON.parse(stored);
        const validTasks = tasks.filter(task => {
          // 过滤过期任务
          const now = Date.now();
          const hoursSinceScheduled = (now - task.scheduledAt) / (60 * 60 * 1000);
          return hoursSinceScheduled < 24 && task.retryCount < task.maxRetries;
        });

        this.renewalQueue.push(...validTasks);
        console.log(`[后台续期] 恢复了 ${validTasks.length} 个待处理任务`);
      }
    } catch (error) {
      console.error('[后台续期] 恢复待处理任务失败:', error);
    }
  }

  /**
   * 调度重试
   */
  private scheduleRetry(task: RenewalTask): void {
    this.renewalQueue.push(task);
    this.savePendingTasks();
  }

  /**
   * 保存待处理任务
   */
  private savePendingTasks(): void {
    try {
      localStorage.setItem('wechat_renewal_tasks', JSON.stringify(this.renewalQueue));
    } catch (error) {
      console.error('[后台续期] 保存待处理任务失败:', error);
    }
  }

  /**
   * 检查续期是否在进行中
   */
  private isRenewalInProgress(accountId: string): boolean {
    return this.activeRenewals.has(accountId);
  }

  /**
   * 添加到续期队列
   */
  private addToRenewalQueue(task: RenewalTask): void {
    this.renewalQueue.push(task);
    this.renewalQueue.sort((a, b) => {
      // 按优先级和时间排序
      const priorityOrder = { high: 3, normal: 2, low: 1 };
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      return a.scheduledAt - b.scheduledAt;
    });

    this.savePendingTasks();
  }

  /**
   * 从队列中移除
   */
  private removeFromQueue(taskId: string): void {
    const index = this.renewalQueue.findIndex(task => task.id === taskId);
    if (index !== -1) {
      this.renewalQueue.splice(index, 1);
      this.savePendingTasks();
    }
  }

  /**
   * 生成任务ID
   */
  private generateTaskId(): string {
    return `renewal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 获取账号信息
   */
  private async getAccountInfo(accountId: string): Promise<any> {
    // 从本地存储或API获取账号信息
    const stored = localStorage.getItem(`wechat_account_${accountId}`);
    if (stored) {
      return JSON.parse(stored);
    }

    // 从API获取
    const response = await fetch(`/api/wechat/accounts/${accountId}`);
    if (!response.ok) {
      throw new Error('获取账号信息失败');
    }

    return response.json();
  }

  /**
   * 更新本地token数据
   */
  private async updateLocalTokenData(accountId: string, tokenData: any): Promise<void> {
    // 更新本地存储
    const accountInfo = await this.getAccountInfo(accountId);
    accountInfo.tokenData = tokenData;

    localStorage.setItem(`wechat_account_${accountId}`, JSON.stringify(accountInfo));
  }

  /**
   * 获取续期统计信息
   */
  getRenewalStats(): {
    queueLength: number;
    activeRenewals: number;
    totalProcessed: number;
    successRate: number;
  } {
    return {
      queueLength: this.renewalQueue.length,
      activeRenewals: this.activeRenewals.size,
      totalProcessed: this.getTotalProcessedCount(),
      successRate: this.getSuccessRate(),
    };
  }

  private getTotalProcessedCount(): number {
    // 从统计记录中获取已处理任务总数
    const stats = localStorage.getItem('wechat_renewal_stats');
    if (stats) {
      const data = JSON.parse(stats);
      return data.totalProcessed || 0;
    }
    return 0;
  }

  private getSuccessRate(): number {
    // 从统计记录中计算成功率
    const stats = localStorage.getItem('wechat_renewal_stats');
    if (stats) {
      const data = JSON.parse(stats);
      const total = data.totalProcessed || 0;
      const successful = data.successful || 0;
      return total > 0 ? (successful / total) : 0;
    }
    return 0;
  }
}