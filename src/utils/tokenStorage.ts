/**
 * 安全的 Token 存储工具
 * 使用 httpOnly cookies 和安全策略来保护 token
 */

export interface TokenStorageOptions {
  secure?: boolean;      // 仅 HTTPS
  sameSite?: 'strict' | 'lax' | 'none';
  maxAge?: number;      // 过期时间（秒）
  domain?: string;      // Cookie 域名
}

class TokenStorage {
  /**
   * 设置 token 到 httpOnly cookie
   * 注意：在纯前端环境中，httpOnly cookie 无法直接设置
   * 这里提供两种方案：
   * 1. 开发环境：使用 localStorage（但会警告）
   * 2. 生产环境：需要后端设置 httpOnly cookie
   */
  setToken(token: string, _options?: Partial<TokenStorageOptions>): void {
    const isDevelopment = process.env.NODE_ENV === 'development';

    if (isDevelopment) {
      console.warn('⚠️  Using localStorage in development mode - not secure for production!');
      // 开发环境暂时使用 localStorage
      localStorage.setItem('auth_token', token);
      return;
    }

    // 生产环境应该通过后端设置 httpOnly cookie
    // 这里只是占位，实际设置需要后端响应头
    console.warn('Token should be set via httpOnly cookie from server response');
  }

  /**
   * 获取 token
   */
  getToken(): string | null {
    const isDevelopment = process.env.NODE_ENV === 'development';

    if (isDevelopment) {
      return localStorage.getItem('auth_token');
    }

    // 尝试从 document.cookie 获取（仅适用于非 httpOnly 的 cookie）
    // 注意：httpOnly cookie 无法通过 JavaScript 访问
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === 'auth_token') {
        return value;
      }
    }

    return null;
  }

  /**
   * 移除 token
   */
  removeToken(): void {
    const isDevelopment = process.env.NODE_ENV === 'development';

    if (isDevelopment) {
      localStorage.removeItem('auth_token');
      return;
    }

    // 设置过期时间为过去的 cookie
    document.cookie = 'auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; sameSite=strict; secure';
  }

  /**
   * 检查 token 是否有效
   */
  isTokenValid(token?: string): boolean {
    const currentToken = token || this.getToken();
    if (!currentToken) {
      return false;
    }

    try {
      // 解析 JWT payload（不验证签名）
      const payload = JSON.parse(atob(currentToken.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);

      // 检查是否过期
      return payload.exp > currentTime;
    } catch (error) {
      console.error('Failed to parse token:', error);
      return false;
    }
  }

  /**
   * 清除所有认证相关的存储
   */
  clearAuth(): void {
    this.removeToken();
    // 清除其他可能的认证数据
    localStorage.removeItem('user_info');
    localStorage.removeItem('userInfo'); // Fix: Add userInfo
    localStorage.removeItem('feishu_user');
    sessionStorage.clear();
  }
}

// 创建单例
export const tokenStorage = new TokenStorage();

/**
 * Vue Composable for token storage
 */
export function useTokenStorage() {
  return {
    setToken: tokenStorage.setToken.bind(tokenStorage),
    getToken: tokenStorage.getToken.bind(tokenStorage),
    removeToken: tokenStorage.removeToken.bind(tokenStorage),
    isTokenValid: tokenStorage.isTokenValid.bind(tokenStorage),
    clearAuth: tokenStorage.clearAuth.bind(tokenStorage),
  };
}