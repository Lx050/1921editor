/**
 * 上传管理器
 * 管理图片上传队列，支持并发控制和重试机制
 */

import type { WechatImage, UploadProgress } from '@/types';
import { uploadImage, getWechatProxyUrl } from './wechatApi';

// V2: 优化配置 - 根据网络环境和微信 API 限制调整
const MAX_CONCURRENT_UPLOADS = 5;  // 提升并发数：3 -> 5（微信 API 支持更高并发）
const MAX_RETRY_COUNT = 3;         // 最大重试次数
const RETRY_BASE_DELAY = 1000;     // 重试基础延迟（毫秒）

/**
 * 上传任务接口
 */
interface UploadTask {
    id: string;
    file: File;
    retryCount: number;
    status: 'pending' | 'uploading' | 'success' | 'failed';
    result?: WechatImage;
    batchId: number;
    abortController?: AbortController;
}

/**
 * 上传管理器类
 */
export class UploadManager {
    private queue: UploadTask[] = [];
    private activeUploads: number = 0;
    private onProgressCallback?: (progress: UploadProgress) => void;
    private onCompleteCallback?: (results: WechatImage[]) => void;
    private onImageUploadedCallback?: (image: WechatImage) => void;
    private startTime: number = 0;  // V2: 添加上传开始时间
    private batchId: number = 0;

    /**
     * 设置进度回调
     */
    onProgress(callback: (progress: UploadProgress) => void): this {
        this.onProgressCallback = callback;
        return this;
    }

    /**
     * 设置完成回调
     */
    onComplete(callback: (results: WechatImage[]) => void): this {
        this.onCompleteCallback = callback;
        return this;
    }

    /**
     * 设置单个图片上传成功回调
     */
    onImageUploaded(callback: (image: WechatImage) => void): this {
        this.onImageUploadedCallback = callback;
        return this;
    }

    /**
     * 添加文件到上传队列
     */
    addFiles(files: File[]): void {
        // V2: 记录上传开始时间
        if (this.queue.length === 0) {
            this.startTime = Date.now();
            console.log('[Upload Manager] 开始批量上传', files.length, '个文件');
        }

        for (const file of files) {
            const task: UploadTask = {
                id: `upload_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                file,
                retryCount: 0,
                status: 'pending',
                batchId: this.batchId,
            };
            this.queue.push(task);
        }

        console.log('[Upload Manager] 添加', files.length, '个文件到队列');
        this.processQueue();
    }

    /**
     * 处理上传队列
     */
    private async processQueue(): Promise<void> {
        // 查找待处理的任务
        while (this.activeUploads < MAX_CONCURRENT_UPLOADS) {
            const pendingTask = this.queue.find((t) => t.status === 'pending');
            if (!pendingTask) break;

            pendingTask.status = 'uploading';
            this.activeUploads++;
            this.notifyProgress();

            // V2: 记录开始时间
            const startTime = Date.now();
            console.log(`[Upload Manager] 开始上传: ${pendingTask.file.name} (并发: ${this.activeUploads}/${MAX_CONCURRENT_UPLOADS})`);

            // 异步处理上传
            this.uploadFile(pendingTask).then(() => {
                const duration = Date.now() - startTime;
                console.log(`[Upload Manager] 上传完成: ${pendingTask.file.name}, 耗时: ${duration}ms`);

                this.activeUploads--;
                this.processQueue();
                this.checkComplete();
            });
        }
    }

    /**
     * 上传单个文件
     */
    private async uploadFile(task: UploadTask): Promise<void> {
        if (task.batchId !== this.batchId) {
            return;
        }
        // 创建本地预览 URL（Blob URL）
        const localPreviewUrl = URL.createObjectURL(task.file);

        try {
            const abortController = new AbortController();
            task.abortController = abortController;
            const response = await uploadImage(task.file, { signal: abortController.signal });

            if (task.batchId !== this.batchId) {
                return;
            }

            task.status = 'success';
            // 🔑 关键：将微信原始 URL 转换为代理 URL，确保其他用户/设备可访问
            const proxyUrl = getWechatProxyUrl(response.url || '');
            task.result = {
                id: task.id,
                mediaId: response.media_id || '',
                url: proxyUrl,  // 使用代理 URL 以支持跨用户访问
                localPreviewUrl: localPreviewUrl,  // 使用本地 Blob URL 进行预览
                name: task.file.name,
                status: 'success',
            };

            console.log('[Upload Manager] 上传成功:', task.file.name);
            this.onImageUploadedCallback?.(task.result);
            this.notifyProgress();
        } catch (error) {
            if (task.batchId !== this.batchId) {
                return;
            }

            const errorMessage =
                error instanceof Error ? error.message : '上传失败';
            const statusCode = (error as any)?.response?.status;
            const isCanceled =
                (error as any)?.name === 'CanceledError' ||
                (error as any)?.code === 'ERR_CANCELED';

            if (isCanceled) {
                task.status = 'failed';
                task.result = {
                    id: task.id,
                    mediaId: '',
                    url: '',
                    name: task.file.name,
                    status: 'failed',
                    errorMsg: '上传已取消',
                    file: task.file,
                };
                this.notifyProgress();
                return;
            }

            console.error('[Upload Manager] 上传失败:', task.file.name, error);

            const nonRetryable =
                statusCode === 401 ||
                statusCode === 403 ||
                statusCode === 404 ||
                statusCode === 429 ||
                errorMessage.includes('未授权微信公众号') ||
                errorMessage.includes('Unauthorized');

            // 重试逻辑
            if (!nonRetryable && task.retryCount < MAX_RETRY_COUNT) {
                task.retryCount++;
                task.status = 'pending';

                // 指数退避延迟
                const delay = RETRY_BASE_DELAY * Math.pow(2, task.retryCount - 1);
                console.log(`[Upload Manager] ${task.file.name} 将在 ${delay}ms 后重试 (第 ${task.retryCount} 次)`);

                await new Promise((resolve) => setTimeout(resolve, delay));
            } else {
                task.status = 'failed';
                task.result = {
                    id: task.id,
                    mediaId: '',
                    url: '',
                    name: task.file.name,
                    status: 'failed',
                    errorMsg: errorMessage,
                    file: task.file,
                };
            }

            this.notifyProgress();

            if (errorMessage.includes('未授权微信公众号')) {
                this.clear();
            }
        }
    }

    /**
     * 通知进度更新
     */
    private notifyProgress(): void {
        const progress = this.getProgress();
        this.onProgressCallback?.(progress);
    }

    /**
     * 检查是否全部完成
     */
    private checkComplete(): void {
        const progress = this.getProgress();
        if (progress.uploading === 0 && progress.completed + progress.failed === progress.total && progress.total > 0) {
            // V2: 记录完成时间和统计信息
            const endTime = Date.now();
            const totalDuration = endTime - this.startTime;
            const results = this.queue
                .filter((t) => t.result)
                .map((t) => t.result as WechatImage);

            console.log(`[Upload Manager] 所有上传完成:`, {
                totalFiles: progress.total,
                completed: progress.completed,
                failed: progress.failed,
                totalDuration: `${totalDuration}ms`,
                averageDuration: progress.completed > 0 ? `${Math.round(totalDuration / progress.completed)}ms` : 'N/A',
                concurrency: MAX_CONCURRENT_UPLOADS,
            });

            this.onCompleteCallback?.(results);
        }
    }

    /**
     * 获取当前进度
     */
    getProgress(): UploadProgress {
        const total = this.queue.length;
        const completed = this.queue.filter((t) => t.status === 'success').length;
        const failed = this.queue.filter((t) => t.status === 'failed').length;
        const uploading = this.queue.filter((t) => t.status === 'uploading').length;

        return { total, completed, failed, uploading };
    }

    /**
     * 重试失败的上传
     */
    retryFailed(): void {
        for (const task of this.queue) {
            if (task.status === 'failed') {
                task.status = 'pending';
                task.retryCount = 0;
            }
        }
        this.processQueue();
    }

    /**
     * 清空队列
     */
    clear(): void {
        this.batchId++;
        for (const task of this.queue) {
            if (task.abortController && task.status === 'uploading') {
                task.abortController.abort();
            }
        }
        this.queue = [];
        this.activeUploads = 0;
        this.notifyProgress();
    }

    /**
     * 获取所有已成功上传的图片
     */
    getSuccessfulUploads(): WechatImage[] {
        return this.queue
            .filter((t) => t.status === 'success' && t.result)
            .map((t) => t.result as WechatImage);
    }
}

// 导出单例实例
export const uploadManager = new UploadManager();
