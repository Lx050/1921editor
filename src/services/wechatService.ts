/**
 * 微信服务 - 公众号服务端授权方案
 * 无需用户授权，无30天限制
 */

export class WechatService {
  private static instance: WechatService;

  private constructor() { }

  static getInstance(): WechatService {
    if (!WechatService.instance) {
      WechatService.instance = new WechatService();
    }
    return WechatService.instance;
  }

  /**
   * 上传图片到微信素材库
   */
  async uploadImage(file: File): Promise<any> {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const api = (await import('../utils/api')).default;
      const response = await api.post('/wechat/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const payload = response.data;
      if (payload?.success === false) {
        throw new Error(payload.error || '上传失败');
      }
      const data = payload?.data || payload;

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
      const api = (await import('../utils/api')).default;
      const response = await api.post('/wechat/draft', article);
      const payload = response.data;
      if (payload?.success === false) {
        throw new Error(payload.error || '创建草稿失败');
      }
      const data = payload?.data || payload;

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
