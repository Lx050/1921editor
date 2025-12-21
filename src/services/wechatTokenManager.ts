/**
 * 简化版微信Token管理器
 * 核心功能：自动刷新token，30天内无需用户重新授权
 */

interface WechatTokenData {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  openid: string;
  unionid?: string;
}

export class WechatTokenManager {
  private static instance: WechatTokenManager;
  private tokens: Map<string, WechatTokenData> = new Map();
  private refreshTimer: NodeJS.Timeout | null = null;

  private constructor() {
    this.loadTokensFromStorage();
    this.startAutoRefresh();
  }

  static getInstance(): WechatTokenManager {
    if (!WechatTokenManager.instance) {
      WechatTokenManager.instance = new WechatTokenManager();
    }
    return WechatTokenManager.instance;
  }

  /**
   * 保存微信授权返回的token数据
   */
  saveToken(openid: string, tokenData: WechatTokenData): void {
    // 计算过期时间（当前时间 + 有效期 - 5分钟缓冲）
    tokenData.expires_at = Date.now() + (tokenData.expires_in || 7200) * 1000 - 5 * 60 * 1000;

    // 保存到内存
    this.tokens.set(openid, tokenData);

    // 保存到localStorage（安全起见，可以考虑加密）
    this.saveToStorage(openid, tokenData);

    console.log(`[微信Token] 保存用户 ${openid} 的token，有效期至: ${new Date(tokenData.expires_at).toLocaleString()}`);

    // 重新调度刷新
    this.scheduleRefresh();
  }

  /**
   * 获取有效的access_token
   */
  async getAccessToken(openid: string): Promise<string> {
    const tokenData = this.tokens.get(openid);

    if (!tokenData) {
      throw new Error('用户未授权或token已过期');
    }

    // 检查是否需要刷新
    if (this.needsRefresh(tokenData)) {
      console.log(`[微信Token] 用户 ${openid} token即将过期，开始刷新...`);
      await this.refreshToken(openid);
    }

    const refreshedToken = this.tokens.get(openid);
    return refreshedToken!.access_token;
  }

  /**
   * 检查token是否需要刷新
   */
  private needsRefresh(tokenData: WechatTokenData): boolean {
    const now = Date.now();
    return tokenData.expires_at <= now;
  }

  /**
   * 刷新token
   */
  private async refreshToken(openid: string): Promise<void> {
    const tokenData = this.tokens.get(openid);
    if (!tokenData) {
      throw new Error('找不到要刷新的token');
    }

    try {
      console.log(`[微信Token] 开始刷新用户 ${openid} 的token...`);

      // 调用微信API刷新token
      const response = await fetch('/api/wechat/token/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refresh_token: tokenData.refresh_token,
          openid: openid,
        }),
      });

      if (!response.ok) {
        throw new Error(`刷新token失败: ${response.status}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(`刷新token失败: ${result.error}`);
      }

      // 更新token数据
      const newTokenData: WechatTokenData = {
        access_token: result.access_token,
        refresh_token: result.refresh_token, // 微信会返回新的refresh_token
        expires_in: result.expires_in,
        openid: result.openid || openid,
        unionid: result.unionid,
        expires_at: 0, // 将在saveToken中计算
      };

      this.saveToken(openid, newTokenData);

      console.log(`[微信Token] 用户 ${openid} token刷新成功`);

      // 通知前端token已更新
      this.notifyTokenUpdated(openid);

    } catch (error) {
      console.error(`[微信Token] 用户 ${openid} token刷新失败:`, error);

      // refresh_token也可能过期，需要用户重新授权
      if (this.isRefreshTokenExpired(error)) {
        console.log(`[微信Token] 用户 ${openid} refresh_token已过期，需要重新授权`);
        this.removeToken(openid);
        this.notifyReauthorizationRequired(openid);
      }

      throw error;
    }
  }

  /**
   * 自动刷新调度器
   */
  private scheduleRefresh(): void {
    // 清除现有定时器
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
    }

    // 找到最早过期的token
    let earliestExpiry = Infinity;
    let earliestOpenid = '';

    for (const [openid, tokenData] of this.tokens.entries()) {
      if (tokenData.expires_at < earliestExpiry) {
        earliestExpiry = tokenData.expires_at;
        earliestOpenid = openid;
      }
    }

    if (earliestOpenid) {
      const delay = Math.max(0, earliestExpiry - Date.now());

      console.log(`[微信Token] 调度 ${delay}ms 后刷新用户 ${earliestOpenid} 的token`);

      this.refreshTimer = setTimeout(async () => {
        try {
          await this.refreshToken(earliestOpenid);
          // 递归调度下一个刷新
          this.scheduleRefresh();
        } catch (error) {
          console.error(`[微信Token] 定时刷新失败:`, error);
          // 5分钟后重试
          setTimeout(() => this.scheduleRefresh(), 5 * 60 * 1000);
        }
      }, delay);
    }
  }

  /**
   * 启动自动刷新
   */
  private startAutoRefresh(): void {
    console.log('[微信Token] 启动自动刷新机制');
    this.scheduleRefresh();

    // 每5分钟检查一次所有token状态
    setInterval(() => {
      this.checkAllTokens();
    }, 5 * 60 * 1000);
  }

  /**
   * 检查所有token状态
   */
  private async checkAllTokens(): Promise<void> {
    for (const [openid, tokenData] of this.tokens.entries()) {
      if (this.needsRefresh(tokenData)) {
        console.log(`[微信Token] 检测到用户 ${openid} token需要刷新`);
        try {
          await this.refreshToken(openid);
        } catch (error) {
          console.error(`[微信Token] 检查刷新用户 ${openid} token失败:`, error);
        }
      }
    }
  }

  /**
   * 获取refresh_token剩余时间
   */
  getRefreshTokenRemainingTime(openid: string): number {
    const tokenData = this.tokens.get(openid);
    if (!tokenData) return 0;

    // refresh_token有效期30天
    const thirtyDays = 30 * 24 * 60 * 60 * 1000;

    // 这里需要记录refresh_token的获取时间
    // 简化实现：假设access_token获取时间就是refresh_token获取时间
    const tokenAge = Date.now() - (tokenData.expires_at - 7200 * 1000 + 5 * 60 * 1000);
    const remainingTime = thirtyDays - tokenAge;

    return Math.max(0, remainingTime);
  }

  /**
   * 检查是否需要重新授权
   */
  needsReauthorization(openid: string): boolean {
    const remainingTime = this.getRefreshTokenRemainingTime(openid);

    // 剩余时间少于3天，提醒用户重新授权
    return remainingTime < 3 * 24 * 60 * 60 * 1000;
  }

  /**
   * 保存到本地存储
   */
  private saveToStorage(openid: string, tokenData: WechatTokenData): void {
    try {
      const key = `wechat_token_${openid}`;
      localStorage.setItem(key, JSON.stringify({
        ...tokenData,
        saved_at: Date.now(),
      }));
    } catch (error) {
      console.error('[微信Token] 保存token到localStorage失败:', error);
    }
  }

  /**
   * 从本地存储加载
   */
  private loadTokensFromStorage(): void {
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith('wechat_token_')) {
          const openid = key.replace('wechat_token_', '');
          const data = JSON.parse(localStorage.getItem(key)!);

          // 检查数据是否仍然有效
          if (data.saved_at && (Date.now() - data.saved_at) < 35 * 24 * 60 * 60 * 1000) {
            this.tokens.set(openid, data);
            console.log(`[微信Token] 从存储加载用户 ${openid} 的token`);
          } else {
            // 清理过期的token
            localStorage.removeItem(key);
          }
        }
      }
    } catch (error) {
      console.error('[微信Token] 从localStorage加载token失败:', error);
    }
  }

  /**
   * 移除token
   */
  private removeToken(openid: string): void {
    this.tokens.delete(openid);
    try {
      localStorage.removeItem(`wechat_token_${openid}`);
    } catch (error) {
      console.error('[微信Token] 移除token失败:', error);
    }
  }

  /**
   * 判断是否是refresh_token过期
   */
  private isRefreshTokenExpired(error: any): boolean {
    const errorMessage = error.message?.toLowerCase() || '';
    const errorCode = error.code;

    return (
      errorMessage.includes('invalid refresh_token') ||
      errorMessage.includes('refresh_token expired') ||
      errorMessage.includes('refresh_token 无效') ||
      errorCode === 40001 ||
      errorCode === 40003
    );
  }

  /**
   * 通知token已更新
   */
  private notifyTokenUpdated(openid: string): void {
    if (typeof window !== 'undefined' && window.dispatchEvent) {
      window.dispatchEvent(new CustomEvent('wechat-token-updated', {
        detail: { openid }
      }));
    }
  }

  /**
   * 通知需要重新授权
   */
  private notifyReauthorizationRequired(openid: string): void {
    if (typeof window !== 'undefined' && window.dispatchEvent) {
      window.dispatchEvent(new CustomEvent('wechat-reauthorization-required', {
        detail: { openid }
      }));
    }
  }

  /**
   * 获取所有用户状态
   */
  getAllUsersStatus(): Array<{openid: string; expiresAt: number; refreshRemainingTime: number; needsReauth: boolean}> {
    const status = [];

    for (const [openid, tokenData] of this.tokens.entries()) {
      status.push({
        openid,
        expiresAt: tokenData.expires_at,
        refreshRemainingTime: this.getRefreshTokenRemainingTime(openid),
        needsReauth: this.needsReauthorization(openid),
      });
    }

    return status;
  }
}

// 导出单例实例
export const wechatTokenManager = WechatTokenManager.getInstance();