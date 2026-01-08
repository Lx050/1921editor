/**
 * 第三方微信公众号授权服务
 * 用于获得用户授权，让用户可以发布内容到自己的公众号
 */

export class ThirdPartyWechatAuth {
  private static instance: ThirdPartyWechatAuth;
  private openPlatformAppId: string;
  private callbackUrl: string;
  private storeAuthCallback!: (authData: any) => void;

  constructor() {
    this.openPlatformAppId = process.env.REACT_APP_WECHAT_OPEN_APP_ID!;
    this.callbackUrl = process.env.REACT_APP_DOMAIN + '/auth/callback';
  }

  static getInstance(): ThirdPartyWechatAuth {
    if (!ThirdPartyWechatAuth.instance) {
      ThirdPartyWechatAuth.instance = new ThirdPartyWechatAuth();
    }
    return ThirdPartyWechatAuth.instance;
  }

  /**
   * 初始化存储回调
   */
  initialize(storageCallbacks: {
    storeAuth: (authData: any) => void;
    getAuth: (appId: string) => any;
  }) {
    this.storeAuthCallback = storageCallbacks.storeAuth;
  }

  /**
   * 开始授权流程
   */
  async startAuthorization(): Promise<string> {
    try {
      // 生成预授权码
      const preAuthCode = await this.generatePreAuthCode();

      // 构造授权URL
      const authUrl = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${this.openPlatformAppId}&redirect_uri=${encodeURIComponent(this.callbackUrl)}&response_type=code&scope=snsapi_base&component_appid=${this.openPlatformAppId}&pre_auth_code=${preAuthCode}&state=${this.generateState()}#wechat_redirect`;

      console.log('请用户访问授权URL:', authUrl);

      return authUrl;

    } catch (error) {
      console.error('启动授权流程失败:', error);
      throw error;
    }
  }

  /**
   * 生成预授权码
   * 这个预授权码会提前绑定用户的公众号，简化用户操作
   */
  private async generatePreAuthCode(): Promise<string> {
    try {
      const response = await fetch('/api/wechat/pre-auth-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          component_appid: this.openPlatformAppId,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || '生成预授权码失败');
      }

      return data.pre_auth_code;

    } catch (error) {
      console.error('生成预授权码失败:', error);
      throw error;
    }
  }

  /**
   * 处理授权回调
   */
  async handleAuthCallback(code: string, state: string): Promise<any> {
    try {
      // 验证state参数
      if (!this.validateState(state)) {
        throw new Error('无效的state参数');
      }

      // 使用授权码换取公众号授权信息
      const authInfo = await this.exchangeCodeForAuth(code);

      // 存储授权信息
      await this.saveAuthInfo(authInfo);

      return authInfo;

    } catch (error) {
      console.error('处理授权回调失败:', error);
      throw error;
    }
  }

  /**
   * 使用授权码换取公众号授权信息
   */
  private async exchangeCodeForAuth(code: string): Promise<WechatAuthInfo> {
    try {
      const response = await fetch('/api/wechat/exchange-auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          component_appid: this.openPlatformAppId,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || '换取授权失败');
      }

      return data.data;

    } catch (error) {
      console.error('换取授权失败:', error);
      throw error;
    }
  }

  /**
   * 发布内容到用户授权的公众号
   */
  async publishToWechat(appId: string, content: any): Promise<any> {
    try {
      // 获取授权信息
      const authInfo = await this.getAuthInfo(appId);

      if (!authInfo) {
        throw new Error('公众号未授权，请先授权');
      }

      // 检查access_token是否过期
      await this.checkAndRefreshToken(authInfo);

      // 发布内容
      const response = await fetch('/api/wechat/publish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          app_id: authInfo.authorizer_appid,
          access_token: authInfo.authorizer_access_token,
          content,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || '发布失败');
      }

      return data.data;

    } catch (error) {
      console.error('发布到微信失败:', error);
      throw error;
    }
  }

  /**
   * 检查并刷新access_token
   */
  private async checkAndRefreshToken(authInfo: WechatAuthInfo): Promise<void> {
    const now = Date.now();
    const timeSinceAuth = now - authInfo.authorizedAt;
    const expiresIn = authInfo.expires_in * 1000;

    // 提前5分钟刷新
    if (timeSinceAuth >= expiresIn - 5 * 60 * 1000) {
      console.log('access_token即将过期，开始刷新...');

      const refreshedInfo = await this.refreshToken(authInfo);

      // 更新存储的授权信息
      this.storeAuthCallback(refreshedInfo);
    }
  }

  /**
   * 刷新access_token
   */
  async refreshToken(authInfo: WechatAuthInfo): Promise<WechatAuthInfo> {
    try {
      const response = await fetch('/api/wechat/refresh-token', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          app_id: authInfo.authorizer_appid,
          refresh_token: authInfo.authorizer_refresh_token,
          component_appid: this.openPlatformAppId,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || '刷新token失败');
      }

      // 更新授权信息
      const refreshedInfo = {
        ...authInfo,
        authorizer_access_token: data.data.authorizer_access_token,
        authorizer_refresh_token: data.data.authorizer_refresh_token,
        expires_in: data.data.expires_in,
        authorizedAt: Date.now(),
      };

      return refreshedInfo;

    } catch (error) {
      console.error('刷新token失败:', error);
      throw error;
    }
  }

  /**
   * 生成state参数
   */
  private generateState(): string {
    return Math.random().toString(36).substr(2, 15) + Date.now().toString(36);
  }

  /**
   * 验证state参数
   */
  private validateState(state: string): boolean {
    // 这里可以实现更复杂的state验证逻辑
    return !!(state && state.length >= 8);
  }

  /**
   * 保存授权信息
   */
  private async saveAuthInfo(authInfo: WechatAuthInfo): Promise<void> {
    try {
      this.storeAuthCallback(authInfo);

      // 同时保存到后端数据库
      await fetch('/api/wechat/save-auth', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify(authInfo),
      });

      console.log('授权信息已保存');

    } catch (error) {
      console.error('保存授权信息失败:', error);
    }
  }

  /**
   * 获取授权信息
   */
  private async getAuthInfo(appId: string): Promise<WechatAuthInfo | null> {
    try {
      // 先从本地获取
      const localAuth = this.getAuthLocal(appId);
      if (localAuth) {
        return localAuth;
      }

      // 从后端获取
      const response = await fetch(`/api/wechat/get-auth/${appId}`);
      const data = await response.json();

      if (data.success) {
        return data.data;
      }

      return null;

    } catch (error) {
      console.error('获取授权信息失败:', error);
      return null;
    }
  }

  /**
   * 从本地存储获取授权信息
   */
  private getAuthLocal(appId: string): WechatAuthInfo | null {
    try {
      const existingAuths = JSON.parse(localStorage.getItem('wechat_auths') || '{}');
      return existingAuths[appId] || null;
    } catch (error) {
      console.error('从本地获取授权信息失败:', error);
      return null;
    }
  }

  /**
   * 获取用户已授权的公众号列表
   */
  async getAuthorizedAccounts(): Promise<WechatAuthInfo[]> {
    try {
      const response = await fetch('/api/wechat/authorized-accounts');
      const data = await response.json();

      return data.success ? data.data : [];

    } catch (error) {
      console.error('获取授权公众号列表失败:', error);
      return [];
    }
  }

  /**
   * 检查公众号是否已授权
   */
  async isAccountAuthorized(appId: string): Promise<boolean> {
    const authInfo = await this.getAuthInfo(appId);
    return !!(authInfo && authInfo.authorizer_access_token &&
      (Date.now() - authInfo.authorizedAt) < (authInfo.expires_in * 1000 - 5 * 60 * 1000));
  }

  /**
   * 移除授权
   */
  async removeAuth(appId: string): Promise<void> {
    try {
      this.storeAuthCallback({ appId, removed: true, removedAt: Date.now() });

      await fetch(`/api/wechat/remove-auth/${appId}`, {
        method: 'DELETE',
      });

      console.log(`已移除公众号 ${appId} 的授权`);

    } catch (error) {
      console.error('移除授权失败:', error);
    }
  }
}

interface WechatAuthInfo {
  authorizer_appid: string;        // 授权公众号的AppID
  authorizer_access_token: string;  // 授权公众号的access_token
  authorizer_refresh_token: string; // 授权公众号的refresh_token
  expires_in: number;              // access_token有效期（秒）
  nick_name: string;                // 授权公众号的昵称
  head_img: string;                // 授权公众号的头像
  func_info: any;                 // 授权的公众号功能列表
  authorizedAt: number;             // 授权时间
  lastUsed?: number;               // 最后使用时间
}