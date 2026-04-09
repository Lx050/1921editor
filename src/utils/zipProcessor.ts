/**
 * 压缩包处理器
 * 处理 ZIP 文件的解压和内容提取
 */

import JSZip from 'jszip';

/**
 * 提取结果接口
 */
export interface ExtractResult {
    docxFiles: File[];   // 提取的 .docx 文件
    imageFiles: File[];  // 提取的图片文件
}

/**
 * 支持的图片格式
 */
const SUPPORTED_IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];

/**
 * 检查文件是否是图片
 */
function isImageFile(filename: string): boolean {
    const ext = filename.toLowerCase().substring(filename.lastIndexOf('.'));
    return SUPPORTED_IMAGE_EXTENSIONS.includes(ext);
}

/**
 * 检查文件是否是 Word 文档
 */
function isDocxFile(filename: string): boolean {
    return filename.toLowerCase().endsWith('.docx');
}

/**
 * 从 ArrayBuffer 创建 File 对象
 */
function createFileFromBuffer(buffer: ArrayBuffer, filename: string, mimeType: string): File {
    const blob = new Blob([buffer], { type: mimeType });
    return new File([blob], filename, { type: mimeType });
}

/**
 * 获取文件的 MIME 类型
 */
function getMimeType(filename: string): string {
    const ext = filename.toLowerCase().substring(filename.lastIndexOf('.'));
    const mimeTypes: Record<string, string> = {
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.gif': 'image/gif',
        '.bmp': 'image/bmp',
        '.webp': 'image/webp',
        '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    };
    return mimeTypes[ext] || 'application/octet-stream';
}

/**
 * 解压 ZIP 文件并提取内容
 * @param file ZIP 文件
 * @returns 包含 docx 文件和图片文件的结果
 */
export async function extractZip(file: File): Promise<ExtractResult> {
    const result: ExtractResult = {
        docxFiles: [],
        imageFiles: [],
    };

    try {
        const arrayBuffer = await file.arrayBuffer();
        const zip = await JSZip.loadAsync(arrayBuffer);

        // 遍历 ZIP 中的所有文件
        const filePromises: Promise<void>[] = [];

        zip.forEach((relativePath, zipEntry) => {
            // 跳过目录和隐藏文件
            if (zipEntry.dir || relativePath.startsWith('__MACOSX') || relativePath.startsWith('.')) {
                return;
            }

            const filename = relativePath.split('/').pop() || relativePath;

            // 处理图片文件
            if (isImageFile(filename)) {
                const promise = zipEntry.async('arraybuffer').then((buffer) => {
                    const imageFile = createFileFromBuffer(buffer, filename, getMimeType(filename));
                    result.imageFiles.push(imageFile);
                });
                filePromises.push(promise);
            }

            // 处理 Word 文档
            if (isDocxFile(filename)) {
                const promise = zipEntry.async('arraybuffer').then((buffer) => {
                    const docxFile = createFileFromBuffer(buffer, filename, getMimeType(filename));
                    result.docxFiles.push(docxFile);
                });
                filePromises.push(promise);
            }
        });

        await Promise.all(filePromises);


        return result;
    } catch (error) {
        console.error('[ZIP Processor] 解压失败:', error);
        throw new Error(`解压 ZIP 文件失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
}

/**
 * 检查文件是否是 ZIP 压缩包
 */
export function isZipFile(file: File): boolean {
    const zipMimeTypes = [
        'application/zip',
        'application/x-zip-compressed',
        'application/x-zip',
        'application/x-7z-compressed',
    ];

    if (zipMimeTypes.includes(file.type)) {
        return true;
    }

    // 根据扩展名判断
    const ext = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    return ['.zip', '.7z'].includes(ext);
}
