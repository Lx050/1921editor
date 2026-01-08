/**
 * 微信相关类型定义
 */

/**
 * 上传状态枚举
 */
export type UploadStatus = 'pending' | 'uploading' | 'success' | 'failed';

/**
 * 微信图片信息
 */
export interface WechatImage {
    id: string;             // 本地唯一ID
    mediaId: string;        // 微信 media_id
    url: string;            // 微信返回的图片 URL（用于最终HTML输出）
    localPreviewUrl?: string; // 本地预览 URL（Blob URL，用于预览显示）
    name: string;           // 原始文件名
    status: UploadStatus;   // 上传状态
    errorMsg?: string;      // 错误信息
    file?: File;            // 原始文件对象
}

/**
 * 上传进度信息
 */
export interface UploadProgress {
    total: number;          // 总数
    completed: number;      // 已完成数量
    failed: number;         // 失败数量
    uploading: number;      // 正在上传数量
}

/**
 * 微信 API 响应基础类型
 */
export interface WechatApiResponse {
    errcode?: number;
    errmsg?: string;
}

/**
 * 获取 Token 响应
 */
export interface WechatTokenResponse extends WechatApiResponse {
    access_token?: string;
    expires_in?: number;
}

/**
 * 上传图片响应
 */
export interface WechatUploadResponse extends WechatApiResponse {
    media_id?: string;
    url?: string;
}

/**
 * 草稿文章参数
 */
export interface DraftArticle {
    title: string;              // 文章标题
    thumb_media_id: string;     // 封面图 media_id
    content: string;            // 文章正文 HTML
    author?: string;            // 作者（可选）
    digest?: string;            // 摘要（可选）
    show_cover_pic: 0 | 1;      // 是否显示封面图
    content_source_url?: string; // 原文链接（可选）
    need_open_comment?: 0 | 1;  // 是否开放留言
    only_fans_can_comment?: 0 | 1; // 是否仅粉丝可留言
}

/**
 * 创建草稿响应
 */
export interface DraftCreateResponse extends WechatApiResponse {
    media_id?: string;          // 草稿 media_id（旧版）
    draft_id?: string;          // 草稿 ID（新版）
    create_time?: string;       // 创建时间
}

