/**
 * 微信 API 服务层
 * 处理与微信公众号 API 的交互
 */

import type { WechatTokenResponse, WechatUploadResponse, WechatImage } from '@/types';

import { useConfigStore } from '../stores/configStore';
// 移除静态配置，保留 tokenUrl 和 uploadUrl 常量
const API_ENDPOINTS = {
    // API 端点 - 使用 Vite 代理路径 /wechat-api 来解决 CORS 问题
    tokenUrl: '/wechat-api/cgi-bin/stable_token',
    uploadUrl: '/wechat-api/cgi-bin/material/add_material',
};

// Token 缓存
let cachedToken: string | null = null;
let tokenExpireTime: number = 0;
let tokenPromise: Promise<string> | null = null;  // V2: 添加 Token 获取锁

/**
 * 获取 Access Token
 * 自动处理缓存和过期刷新，添加并发锁防止重复请求
 */
export async function getAccessToken(): Promise<string> {
    // 检查缓存的 token 是否有效（提前 5 分钟刷新）
    const now = Date.now();
    if (cachedToken && tokenExpireTime > now + 5 * 60 * 1000) {
        return cachedToken;
    }

    // V2: 如果正在获取 Token，直接返回 Promise，避免并发请求
    if (tokenPromise) {
        console.log('[WeChat API] 复用正在进行的 Token 请求');
        return tokenPromise;
    }

    // V2: 创建新的 Token 获取 Promise
    tokenPromise = (async () => {
        try {
            console.log('[WeChat API] 开始获取新的 Token');
            const configStore = useConfigStore();
            const { appId, appSecret } = configStore.wechatConfig;

            const response = await fetch(API_ENDPOINTS.tokenUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    grant_type: 'client_credential',
                    appid: appId,
                    secret: appSecret,
                    force_refresh: false,
                }),
            });

            const data: WechatTokenResponse = await response.json();

            if (data.errcode && data.errcode !== 0) {
                throw new Error(`获取 Token 失败: ${data.errmsg} (错误码: ${data.errcode})`);
            }

            if (!data.access_token) {
                throw new Error('获取 Token 失败: 响应中没有 access_token');
            }

            // 缓存 token
            cachedToken = data.access_token;
            tokenExpireTime = now + (data.expires_in || 7200) * 1000;

            console.log('[WeChat API] Token 获取成功, 有效期:', data.expires_in, '秒');
            return cachedToken;
        } catch (error) {
            console.error('[WeChat API] 获取 Token 失败:', error);
            throw error;
        } finally {
            // V2: 清除 Promise 锁
            tokenPromise = null;
        }
    })();

    return tokenPromise;
}

/**
 * 上传图片到微信素材库
 * @param file 图片文件
 * @returns 包含 media_id 和 url 的响应
 */
export async function uploadImage(file: File): Promise<WechatUploadResponse> {
    try {
        const token = await getAccessToken();
        const url = `${API_ENDPOINTS.uploadUrl}?access_token=${token}&type=image`;

        const formData = new FormData();
        formData.append('media', file);

        const response = await fetch(url, {
            method: 'POST',
            body: formData,
        });

        const data: WechatUploadResponse = await response.json();

        if (data.errcode && data.errcode !== 0) {
            throw new Error(`上传图片失败: ${data.errmsg} (错误码: ${data.errcode})`);
        }

        console.log('[WeChat API] 图片上传成功:', file.name, '-> media_id:', data.media_id);
        return data;
    } catch (error) {
        console.error('[WeChat API] 上传图片失败:', file.name, error);
        throw error;
    }
}

/**
 * 批量上传图片
 * @param files 图片文件数组
 * @param onProgress 进度回调
 * @returns 上传结果数组
 */
export async function uploadImages(
    files: File[],
    onProgress?: (completed: number, total: number, failed: number) => void
): Promise<WechatImage[]> {
    const results: WechatImage[] = [];
    let completed = 0;
    let failed = 0;

    for (const file of files) {
        try {
            const response = await uploadImage(file);
            results.push({
                id: `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                mediaId: response.media_id || '',
                url: response.url || '',
                name: file.name,
                status: 'success',
            });
            completed++;
        } catch (error) {
            results.push({
                id: `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                mediaId: '',
                url: '',
                name: file.name,
                status: 'failed',
                errorMsg: error instanceof Error ? error.message : '上传失败',
                file,
            });
            failed++;
        }

        onProgress?.(completed, files.length, failed);
    }

    return results;
}

/**
 * 重置 Token 缓存
 * 用于强制刷新 token
 */
export function resetTokenCache(): void {
    cachedToken = null;
    tokenExpireTime = 0;
}

/**
 * 创建图文草稿
 * @param article 图文参数
 * @returns 草稿创建响应
 */
export async function createDraft(article: import('@/types').DraftArticle): Promise<import('@/types').DraftCreateResponse> {
    try {
        const token = await getAccessToken();
        const url = `/wechat-api/cgi-bin/draft/add?access_token=${token}`;

        const requestBody = {
            articles: [article]
        };

        console.log('[WeChat API] 创建草稿, 标题:', article.title);
        console.log('[WeChat API] 请求体:', JSON.stringify(requestBody, null, 2));

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
            },
            body: JSON.stringify(requestBody),
        });

        const data: import('@/types').DraftCreateResponse = await response.json();

        if (data.errcode && data.errcode !== 0) {
            throw new Error(`创建草稿失败: ${data.errmsg} (错误码: ${data.errcode})`);
        }

        console.log('[WeChat API] 草稿创建成功, draft_id:', data.draft_id || data.media_id);
        return data;
    } catch (error) {
        console.error('[WeChat API] 创建草稿失败:', error);
        throw error;
    }
}

