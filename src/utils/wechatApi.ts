/**
 * 微信 API 服务层
 * 处理与微信公众号 API 的交互
 */

import type { WechatUploadResponse, WechatImage, DraftArticle, DraftCreateResponse } from '@/types';
import api from './api';

/**
 * 上传图片到微信素材库
 * @param file 图片文件
 * @returns 包含 media_id 和 url 的响应
 */
export async function uploadImage(
    file: File,
    options?: { signal?: AbortSignal; timeout?: number }
): Promise<WechatUploadResponse> {
    try {
        const formData = new FormData();
        formData.append('image', file);

        const timeout =
            options?.timeout ??
            parseInt(import.meta.env.VITE_WECHAT_UPLOAD_TIMEOUT || import.meta.env.VITE_API_TIMEOUT || '60000');

        const response = await api.post('/wechat/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            signal: options?.signal,
            timeout
        });

        const payload = response.data;
        if (payload?.success === false) {
            throw new Error(payload.error || '上传图片失败');
        }
        const data = payload?.data || payload;
        if (data?.errcode && data.errcode !== 0) {
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
    // 后端代发，无需本地 token 缓存
}

/**
 * 创建图文草稿
 * @param article 图文参数
 * @returns 草稿创建响应
 */
export async function createDraft(article: DraftArticle): Promise<DraftCreateResponse> {
    try {
        console.log('[WeChat API] 创建草稿, 标题:', article.title);

        const response = await api.post('/wechat/draft', article);
        const payload = response.data;

        if (payload?.success === false) {
            throw new Error(payload.error || '创建草稿失败');
        }
        const data = payload?.data || payload;

        if (data?.errcode && data.errcode !== 0) {
            throw new Error(`创建草稿失败: ${data.errmsg} (错误码: ${data.errcode})`);
        }

        console.log('[WeChat API] 草稿创建成功, draft_id:', data.draft_id || data.media_id);
        return data;
    } catch (error) {
        console.error('[WeChat API] 创建草稿失败:', error);
        throw error;
    }
}
/**
 * 将微信图片 URL 转换为代理 URL
 * @param originalUrl 原始微信图片 URL
 * @returns 代理后的 URL
 */
export function getWechatProxyUrl(originalUrl: string): string {
    if (!originalUrl || !originalUrl.startsWith('http')) {
        return originalUrl;
    }

    // 如果已经是代理 URL 或本地 URL，直接返回
    if (originalUrl.includes('/wechat-image-proxy') || originalUrl.startsWith('blob:') || originalUrl.startsWith('data:')) {
        return originalUrl;
    }

    // 提取 qpic.cn 域名之后的部分（支持 mmbiz.qpic.cn, mmecoa.qpic.cn 等所有子域名）
    try {
        const url = new URL(originalUrl);
        if (url.hostname.endsWith('.qpic.cn') || url.hostname === 'qpic.cn') {
            // 保留完整路径，包含子域名信息
            return `/wechat-image-proxy/${url.hostname}${url.pathname}${url.search}`;
        }
    } catch (e) {
        console.warn('[WeChat API] URL 解析失败:', originalUrl);
    }

    return originalUrl;
}

/**
 * 将代理 URL 还原为微信原始图片 URL
 * @param possibleUrl 代理或原始 URL
 * @returns 原始微信图片 URL
 */
export function restoreWechatUrl(possibleUrl: string): string {
    if (!possibleUrl) return possibleUrl;

    if (possibleUrl.startsWith('/wechat-image-proxy/')) {
        const raw = possibleUrl.replace('/wechat-image-proxy/', '');
        return `https://${raw}`;
    }

    return possibleUrl;
}
