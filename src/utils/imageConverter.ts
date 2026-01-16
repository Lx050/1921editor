/**
 * 图片格式转换工具
 * 支持将 HEIC/HEIF 等浏览器不支持的格式转换为 JPEG
 */

import heic2any from 'heic2any'

/** 需要转换的图片格式 (浏览器或微信不原生支持) */
const FORMATS_NEED_CONVERSION = ['.heic', '.heif']

/** 可选转换的图片格式 (微信可能不支持) */
const FORMATS_OPTIONAL_CONVERSION = ['.tiff', '.tif', '.bmp', '.avif']

/**
 * 检查文件是否需要转换
 */
export function needsConversion(file: File): boolean {
    const ext = getFileExtension(file.name)
    return FORMATS_NEED_CONVERSION.includes(ext)
}

/**
 * 检查文件是否可选转换 (可能提高兼容性)
 */
export function optionalConversion(file: File): boolean {
    const ext = getFileExtension(file.name)
    return FORMATS_OPTIONAL_CONVERSION.includes(ext)
}

/**
 * 获取文件扩展名 (小写)
 */
function getFileExtension(filename: string): string {
    return filename.toLowerCase().substring(filename.lastIndexOf('.'))
}

/**
 * 将 HEIC/HEIF 文件转换为 JPEG
 * @param file 原始文件 (HEIC/HEIF)
 * @returns 转换后的 JPEG File 对象
 */
export async function convertHeicToJpeg(file: File): Promise<File> {
    console.log('[ImageConverter] 开始转换 HEIC:', file.name)

    try {
        const result = await heic2any({
            blob: file,
            toType: 'image/jpeg',
            quality: 0.92  // 高质量 JPEG
        })

        // heic2any 可能返回单个 Blob 或 Blob 数组
        const blob = Array.isArray(result) ? result[0] : result

        // 生成新的文件名 (.heic/.heif -> .jpg)
        const newName = file.name.replace(/\.(heic|heif)$/i, '.jpg')

        const convertedFile = new File([blob], newName, {
            type: 'image/jpeg',
            lastModified: Date.now()
        })

        console.log('[ImageConverter] 转换成功:', file.name, '->', newName, `(${formatFileSize(convertedFile.size)})`)
        return convertedFile
    } catch (error) {
        console.error('[ImageConverter] HEIC 转换失败:', error)
        throw new Error(`HEIC 转换失败: ${error instanceof Error ? error.message : '未知错误'}`)
    }
}

/**
 * 使用 Canvas 转换其他格式图片为 JPEG
 * 适用于 TIFF, BMP, AVIF 等
 */
export async function convertToJpegWithCanvas(file: File): Promise<File> {
    console.log('[ImageConverter] 使用 Canvas 转换:', file.name)

    return new Promise((resolve, reject) => {
        const img = new Image()
        const url = URL.createObjectURL(file)

        img.onload = () => {
            try {
                const canvas = document.createElement('canvas')
                canvas.width = img.naturalWidth
                canvas.height = img.naturalHeight

                const ctx = canvas.getContext('2d')
                if (!ctx) {
                    throw new Error('无法创建 Canvas 上下文')
                }

                // 绘制白色背景 (防止透明区域变黑)
                ctx.fillStyle = '#FFFFFF'
                ctx.fillRect(0, 0, canvas.width, canvas.height)

                // 绘制图片
                ctx.drawImage(img, 0, 0)

                canvas.toBlob((blob) => {
                    if (!blob) {
                        reject(new Error('Canvas 生成 Blob 失败'))
                        return
                    }

                    const ext = getFileExtension(file.name)
                    const newName = file.name.replace(new RegExp(`\\${ext}$`, 'i'), '.jpg')

                    const convertedFile = new File([blob], newName, {
                        type: 'image/jpeg',
                        lastModified: Date.now()
                    })

                    console.log('[ImageConverter] Canvas 转换成功:', file.name, '->', newName)
                    resolve(convertedFile)
                }, 'image/jpeg', 0.92)
            } catch (error) {
                reject(error)
            } finally {
                URL.revokeObjectURL(url)
            }
        }

        img.onerror = () => {
            URL.revokeObjectURL(url)
            reject(new Error(`无法加载图片: ${file.name}`))
        }

        img.src = url
    })
}

/**
 * 智能转换图片格式
 * 自动检测格式并选择合适的转换方式
 * @param file 原始文件
 * @param forceConvert 是否强制转换所有非 JPEG/PNG 格式
 * @returns 转换后的文件 (如果不需要转换则返回原文件)
 */
export async function smartConvertImage(file: File, forceConvert = false): Promise<File> {
    const ext = getFileExtension(file.name)

    // HEIC/HEIF 必须转换
    if (FORMATS_NEED_CONVERSION.includes(ext)) {
        return await convertHeicToJpeg(file)
    }

    // 其他格式可选转换
    if (forceConvert && FORMATS_OPTIONAL_CONVERSION.includes(ext)) {
        return await convertToJpegWithCanvas(file)
    }

    // 不需要转换，返回原文件
    return file
}

/**
 * 批量转换图片
 * @param files 文件数组
 * @param onProgress 进度回调
 */
export async function batchConvertImages(
    files: File[],
    onProgress?: (completed: number, total: number, currentFile: string) => void
): Promise<File[]> {
    const results: File[] = []

    for (let i = 0; i < files.length; i++) {
        const file = files[i]
        onProgress?.(i, files.length, file.name)

        try {
            const converted = await smartConvertImage(file)
            results.push(converted)
        } catch (error) {
            console.warn('[ImageConverter] 跳过转换失败的文件:', file.name, error)
            results.push(file)  // 转换失败时保留原文件
        }
    }

    onProgress?.(files.length, files.length, '完成')
    return results
}

/**
 * 格式化文件大小
 */
export function formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

// ==================== 图片压缩功能 ====================

/** 默认最大文件大小限制 (10MB) */
export const DEFAULT_MAX_SIZE = 10 * 1024 * 1024

/** 微信推荐的最大文件大小 (2MB，更安全) */
export const WECHAT_RECOMMENDED_SIZE = 2 * 1024 * 1024

/** 压缩配置选项 */
export interface CompressionOptions {
    /** 目标最大文件大小 (字节) */
    maxSize?: number
    /** 初始质量 (0-1) */
    initialQuality?: number
    /** 最低质量 (0-1)，低于此值可能影响图片观感 */
    minQuality?: number
    /** 是否允许缩小尺寸 */
    allowResize?: boolean
    /** 最大宽度 (像素) */
    maxWidth?: number
    /** 最大高度 (像素) */
    maxHeight?: number
    /** 输出格式 */
    outputFormat?: 'image/jpeg' | 'image/png' | 'image/webp'
}

/** 默认压缩配置 */
const DEFAULT_COMPRESSION_OPTIONS: Required<CompressionOptions> = {
    maxSize: DEFAULT_MAX_SIZE,
    initialQuality: 0.92,
    minQuality: 0.5,
    allowResize: true,
    maxWidth: 4096,
    maxHeight: 4096,
    outputFormat: 'image/jpeg'
}

/**
 * 检查文件是否需要压缩
 * @param file 文件
 * @param maxSize 最大允许大小 (字节)
 */
export function needsCompression(file: File, maxSize = DEFAULT_MAX_SIZE): boolean {
    return file.size > maxSize
}

/**
 * 压缩图片
 * 通过降低质量和/或缩小尺寸来减小文件大小
 * @param file 原始图片文件
 * @param options 压缩选项
 * @returns 压缩后的文件
 */
export async function compressImage(
    file: File,
    options: CompressionOptions = {}
): Promise<File> {
    const opts = { ...DEFAULT_COMPRESSION_OPTIONS, ...options }

    console.log('[ImageCompressor] 开始压缩:', file.name, formatFileSize(file.size))

    return new Promise((resolve, reject) => {
        const img = new Image()
        const url = URL.createObjectURL(file)

        img.onload = async () => {
            try {
                let { naturalWidth: width, naturalHeight: height } = img

                // 1. 先检查是否需要缩小尺寸
                if (opts.allowResize) {
                    if (width > opts.maxWidth) {
                        height = Math.round(height * (opts.maxWidth / width))
                        width = opts.maxWidth
                    }
                    if (height > opts.maxHeight) {
                        width = Math.round(width * (opts.maxHeight / height))
                        height = opts.maxHeight
                    }
                }

                // 2. 创建 Canvas 并绘制图片
                const canvas = document.createElement('canvas')
                canvas.width = width
                canvas.height = height

                const ctx = canvas.getContext('2d')
                if (!ctx) {
                    throw new Error('无法创建 Canvas 上下文')
                }

                // 白色背景 (防止 PNG 透明区域变黑)
                if (opts.outputFormat === 'image/jpeg') {
                    ctx.fillStyle = '#FFFFFF'
                    ctx.fillRect(0, 0, width, height)
                }

                ctx.drawImage(img, 0, 0, width, height)

                // 3. 逐步降低质量直到文件大小符合要求
                let quality = opts.initialQuality
                let blob: Blob | null = null
                let attempts = 0
                const maxAttempts = 10

                while (attempts < maxAttempts) {
                    blob = await new Promise<Blob | null>(res => {
                        canvas.toBlob(res, opts.outputFormat, quality)
                    })

                    if (!blob) {
                        throw new Error('Canvas 生成 Blob 失败')
                    }

                    console.log(`[ImageCompressor] 尝试 #${attempts + 1}: 质量=${quality.toFixed(2)}, 大小=${formatFileSize(blob.size)}`)

                    // 检查是否达到目标大小
                    if (blob.size <= opts.maxSize) {
                        break
                    }

                    // 降低质量
                    quality -= 0.1

                    // 如果质量已经很低但仍然超过限制，尝试进一步缩小尺寸
                    if (quality < opts.minQuality && opts.allowResize) {
                        quality = opts.initialQuality
                        width = Math.round(width * 0.8)
                        height = Math.round(height * 0.8)

                        canvas.width = width
                        canvas.height = height

                        if (opts.outputFormat === 'image/jpeg') {
                            ctx.fillStyle = '#FFFFFF'
                            ctx.fillRect(0, 0, width, height)
                        }

                        ctx.drawImage(img, 0, 0, width, height)
                        console.log(`[ImageCompressor] 缩小尺寸: ${width}x${height}`)
                    } else if (quality < opts.minQuality) {
                        // 无法再缩小，使用当前结果
                        console.warn('[ImageCompressor] 已达到最低质量限制')
                        break
                    }

                    attempts++
                }

                if (!blob) {
                    throw new Error('压缩失败')
                }

                // 生成新文件名 (保持原名或改为 .jpg)
                let newName = file.name
                if (opts.outputFormat === 'image/jpeg' && !newName.toLowerCase().endsWith('.jpg') && !newName.toLowerCase().endsWith('.jpeg')) {
                    const lastDot = newName.lastIndexOf('.')
                    newName = (lastDot > 0 ? newName.substring(0, lastDot) : newName) + '.jpg'
                }

                const compressedFile = new File([blob], newName, {
                    type: opts.outputFormat,
                    lastModified: Date.now()
                })

                const ratio = ((1 - compressedFile.size / file.size) * 100).toFixed(1)
                console.log(`[ImageCompressor] 压缩完成: ${formatFileSize(file.size)} -> ${formatFileSize(compressedFile.size)} (减少 ${ratio}%)`)

                resolve(compressedFile)
            } catch (error) {
                reject(error)
            } finally {
                URL.revokeObjectURL(url)
            }
        }

        img.onerror = () => {
            URL.revokeObjectURL(url)
            reject(new Error(`无法加载图片: ${file.name}`))
        }

        img.src = url
    })
}

/**
 * 智能处理图片
 * 自动进行格式转换和压缩
 * @param file 原始文件
 * @param options 配置选项
 */
export async function processImage(
    file: File,
    options: CompressionOptions & { forceConvert?: boolean } = {}
): Promise<File> {
    let processedFile = file

    // 1. 格式转换 (HEIC -> JPEG)
    if (needsConversion(file)) {
        console.log('[ImageProcessor] 步骤1: 格式转换')
        processedFile = await smartConvertImage(file, options.forceConvert)
    }

    // 2. 压缩 (如果超过大小限制)
    const maxSize = options.maxSize ?? DEFAULT_MAX_SIZE
    if (needsCompression(processedFile, maxSize)) {
        console.log('[ImageProcessor] 步骤2: 压缩图片')
        processedFile = await compressImage(processedFile, options)
    }

    return processedFile
}

/**
 * 批量处理图片 (格式转换 + 压缩)
 */
export async function batchProcessImages(
    files: File[],
    options: CompressionOptions & { forceConvert?: boolean } = {},
    onProgress?: (completed: number, total: number, currentFile: string, status: string) => void
): Promise<File[]> {
    const results: File[] = []

    for (let i = 0; i < files.length; i++) {
        const file = files[i]

        try {
            let status = '处理中...'
            if (needsConversion(file)) {
                status = '转换格式...'
            } else if (needsCompression(file, options.maxSize)) {
                status = '压缩中...'
            }

            onProgress?.(i, files.length, file.name, status)

            const processed = await processImage(file, options)
            results.push(processed)

            onProgress?.(i + 1, files.length, file.name, '完成')
        } catch (error) {
            console.warn('[ImageProcessor] 处理失败:', file.name, error)
            results.push(file)  // 失败时保留原文件
            onProgress?.(i + 1, files.length, file.name, '失败')
        }
    }

    return results
}
