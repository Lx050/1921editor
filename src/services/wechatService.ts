/**
 * 微信服务 - 公众号服务端授权方案
 * 无需用户授权，无30天限制
 */

export class WechatService {
  private static instance: WechatService;
  private tokenCache: Map<string, { token: string; expireTime: number }> = new Map();

  private constructor() { }

  static getInstance(): WechatService {
    if (!WechatService.instance) {
      WechatService.instance = new WechatService();
    }
    return WechatService.instance;
  }

  /**
   * 获取微信 access_token
   * 服务端授权，无30天限制
   */
  async getAccessToken(): Promise<string> {
    const cacheKey = 'wechat_access_token';
    const cached = this.tokenCache.get(cacheKey);

    // 检查缓存（提前5分钟刷新）
    if (cached && Date.now() < cached.expireTime - 5 * 60 * 1000) {
      return cached.token;
    }

    try {
      // 从后端API获取新的access_token
      const response = await fetch('/api/wechat/access-token');
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || '获取access_token失败');
      }

      const { access_token, expires_in } = data.data;
      const expireTime = Date.now() + expires_in * 1000;

      // 缓存token
      this.tokenCache.set(cacheKey, { token: access_token, expireTime });

      return access_token;

    } catch (error) {
      console.error('获取微信access_token失败:', error);
      throw error;
    }
  }

  /**
   * 上传图片到微信素材库
   */
  async uploadImage(file: File): Promise<any> {
    try {
      const accessToken = await this.getAccessToken();

      const formData = new FormData();
      formData.append('media', file);

      const response = await fetch(
        `https://api.weixin.qq.com/cgi-bin/media/upload?access_token=${accessToken}&type=image`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await response.json();

      if (data.errcode && data.errcode !== 0) {
        throw new Error(`上传失败: ${data.errmsg}`);
      }

      return data;

    } catch (error) {
      console.error('上传图片失败:', error);
      throw error;
    }
  }

  /**
   * 创建图文草稿
   */
  async createDraft(article: any): Promise<any> {
    try {
      const accessToken = await this.getAccessToken();

      const response = await fetch(
        `https://api.weixin.qq.com/cgi-bin/draft/add?access_token=${accessToken}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            articles: [article]
          }),
        }
      );

      const data = await response.json();

      if (data.errcode && data.errcode !== 0) {
        throw new Error(`创建草稿失败: ${data.errmsg}`);
      }

      return data;

    } catch (error) {
      console.error('创建草稿失败:', error);
      throw error;
    }
  }

  /**
   * 检查服务状态
   */
  async checkStatus(): Promise<any> {
    try {
      const response = await fetch('/api/wechat/status');
      return await response.json();
    } catch (error: any) {
      console.error('检查服务状态失败:', error);
      return { status: 'error', message: error.message };
    }
  }
}

// 导出单例
export const wechatService = WechatService.getInstance();