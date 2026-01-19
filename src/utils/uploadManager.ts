/**
 * 上传管理器
 * 管理图片上传队列，支持并发控制和重试机制
 */

import type { WechatImage, UploadProgress } from '@/types';
import { uploadImage, getWechatProxyUrl } from './wechatApi';

// V2.1: 调高并发数至 8，视环境稳定性而定。配合后端 Token 锁，高并发更安全。
const MAX_CONCURRENT_UPLOADS = 2;
const MAX_RETRY_COUNT = 3;         // 最大重试次数
const RETRY_BASE_DELAY = 1000;     // 重试基础延迟（毫秒）

type UploadError = Error & {
    name?: string;
    code?: string;
    response?: {
        status?: number;
    };
};

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
    originalIndex: number; // 🆕 用户选择文件的原始顺序
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
    private startTime: number = 0;
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
        if (this.queue.length === 0) {
            this.startTime = Date.now();
            console.log(`[Upload Manager] [BATCH_START] 开始批量上传 ${files.length} 个文件`);
        }

        // 记录当前队列长度作为起始索引
        const startIndex = this.queue.length;

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const task: UploadTask = {
                id: `upload_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                file,
                retryCount: 0,
                status: 'pending',
                batchId: this.batchId,
                originalIndex: startIndex + i, // 🆕 记录原始顺序
            };
            this.queue.push(task);
        }

        console.log(`[Upload Manager] 已添加 ${files.length} 个文件，当前队列总计: ${this.queue.length}`);
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

            console.log(`[Upload Manager] [LAUNCH] 启动上传: ${pendingTask.file.name} (并发状态: ${this.activeUploads}/${MAX_CONCURRENT_UPLOADS})`);

            // 异步处理上传，不阻塞循环
            this.uploadFile(pendingTask);
        }

        if (this.activeUploads >= MAX_CONCURRENT_UPLOADS) {
            console.log(`[Upload Manager] [FULL] 并发槽位已满 (${this.activeUploads}/${MAX_CONCURRENT_UPLOADS})，等待任务释放...`);
        }
    }

    /**
     * 上传单个文件
     */
    private async uploadFile(task: UploadTask): Promise<void> {
        if (task.batchId !== this.batchId) {
            this.activeUploads--;
            return;
        }

        const localPreviewUrl = URL.createObjectURL(task.file);

        try {
            const abortController = new AbortController();
            task.abortController = abortController;

            // 执行真实上传
            const response = await uploadImage(task.file, { signal: abortController.signal });

            if (task.batchId === this.batchId) {
                task.status = 'success';
                const proxyUrl = getWechatProxyUrl(response.url || '');
                task.result = {
                    id: task.id,
                    mediaId: response.media_id || '',
                    url: proxyUrl,
                    localPreviewUrl: localPreviewUrl,
                    name: task.file.name,
                    status: 'success',
                    originalIndex: task.originalIndex, // 🆕 传递原始顺序
                };
                console.log(`[Upload Manager] [SUCCESS] ${task.file.name} 上传成功`);
                this.onImageUploadedCallback?.(task.result);
            }
        } catch (error) {
            if (task.batchId !== this.batchId) {
                this.activeUploads--; // 虽已失效但也要计数减一
                return;
            }

            const errorMessage = error instanceof Error ? error.message : '上传失败';
            console.error(`[Upload Manager] [ERROR] ${task.file.name} 失败: ${errorMessage}`);

            const uploadError = error as UploadError;
            const isCanceled = uploadError.name === 'CanceledError' || uploadError.code === 'ERR_CANCELED';

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
            } else {
                const statusCode = uploadError.response?.status;
                const nonRetryable = statusCode === 401 || statusCode === 403 || statusCode === 429 ||
                    errorMessage.includes('未授权') || errorMessage.includes('Unauthorized');

                if (!nonRetryable && task.retryCount < MAX_RETRY_COUNT) {
                    task.retryCount++;
                    task.status = 'pending';
                    const delay = RETRY_BASE_DELAY * Math.pow(2, task.retryCount - 1);
                    console.warn(`[Upload Manager] [RETRY_WAIT] ${task.file.name} 将在 ${delay}ms 后重试 (第 ${task.retryCount} 次)`);

                    setTimeout(() => {
                        if (task.batchId === this.batchId && task.status === 'pending') {
                            this.processQueue();
                        }
                    }, delay);
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
            }
        } finally {
            // 🔑 无论成功与否，单次物理动作结束，槽位立即归还
            this.activeUploads--;
            console.log(`[Upload Manager] [RELEASE] 槽位已释放 (剩余有效并发: ${this.activeUploads}/${MAX_CONCURRENT_UPLOADS})`);

            if (task.batchId === this.batchId) {
                this.notifyProgress();
                this.processQueue(); // 递归调用处理队列
                this.checkComplete();
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
        if (progress.uploading === 0 && (progress.completed + progress.failed) === progress.total && progress.total > 0) {
            const endTime = Date.now();
            const totalDuration = endTime - this.startTime;
            const results = this.queue
                .filter((t) => t.result)
                .map((t) => t.result as WechatImage);

            console.log(`[Upload Manager] [BATCH_COMPLETE] 全部完成! 耗时: ${totalDuration}ms, 成功: ${progress.completed}, 失败: ${progress.failed}`);
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
        console.log('[Upload Manager] 手动重试所有失败任务');
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
        console.log('[Upload Manager] 清空队列并停止所有任务');
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
