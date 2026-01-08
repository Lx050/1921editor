/**
 * 通用压缩包处理器
 * 支持 ZIP, RAR, 7z 格式的解压和内容提取
 * 使用 7z-wasm (基于 7-Zip WebAssembly) 处理 RAR/7z
 * 使用 JSZip 处理 ZIP (更轻量)
 */

import JSZip from 'jszip'

/**
 * 提取结果接口
 */
export interface ExtractResult {
    docxFiles: File[]   // 提取的 .docx 文件
    imageFiles: File[]  // 提取的图片文件
}

/**
 * 支持的图片格式
 */
const SUPPORTED_IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp']

/**
 * 检查文件是否是图片
 */
function isImageFile(filename: string): boolean {
    const ext = filename.toLowerCase().substring(filename.lastIndexOf('.'))
    return SUPPORTED_IMAGE_EXTENSIONS.includes(ext)
}

/**
 * 检查文件是否是 Word 文档
 */
function isDocxFile(filename: string): boolean {
    return filename.toLowerCase().endsWith('.docx')
}

/**
 * 从 ArrayBuffer 创建 File 对象
 */
function createFileFromBuffer(buffer: ArrayBuffer | Uint8Array, filename: string, mimeType: string): File {
    // 确保转换为 ArrayBuffer 并使用类型断言
    let arrayBuffer: ArrayBuffer
    if (buffer instanceof Uint8Array) {
        arrayBuffer = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength) as ArrayBuffer
    } else {
        arrayBuffer = buffer
    }
    const blob = new Blob([arrayBuffer], { type: mimeType })
    return new File([blob], filename, { type: mimeType })
}

/**
 * 获取文件的 MIME 类型
 */
function getMimeType(filename: string): string {
    const ext = filename.toLowerCase().substring(filename.lastIndexOf('.'))
    const mimeTypes: Record<string, string> = {
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.gif': 'image/gif',
        '.bmp': 'image/bmp',
        '.webp': 'image/webp',
        '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    }
    return mimeTypes[ext] || 'application/octet-stream'
}

/**
 * 获取文件名（不含路径）
 */
function getFileName(path: string): string {
    return path.split('/').pop() || path.split('\\').pop() || path
}

/**
 * 检查文件类型
 */
export function getArchiveType(file: File): 'zip' | '7z' | 'rar' | 'docx' | 'unknown' {
    const ext = file.name.toLowerCase().substring(file.name.lastIndexOf('.'))

    if (ext === '.zip') return 'zip'
    if (ext === '.7z') return '7z'
    if (ext === '.rar') return 'rar'
    if (ext === '.docx') return 'docx'

    // 根据 MIME 类型判断
    if (file.type === 'application/zip' || file.type === 'application/x-zip-compressed') return 'zip'
    if (file.type === 'application/x-7z-compressed') return '7z'
    if (file.type === 'application/x-rar-compressed' || file.type === 'application/vnd.rar') return 'rar'

    return 'unknown'
}

/**
 * 检查是否是支持的压缩包
 */
export function isArchiveFile(file: File): boolean {
    const type = getArchiveType(file)
    return type === 'zip' || type === '7z' || type === 'rar'
}

/**
 * 使用 JSZip 解压 ZIP 文件
 */
async function extractWithJSZip(file: File): Promise<ExtractResult> {
    const result: ExtractResult = {
        docxFiles: [],
        imageFiles: [],
    }

    const arrayBuffer = await file.arrayBuffer()
    const zip = await JSZip.loadAsync(arrayBuffer)

    const filePromises: Promise<void>[] = []

    zip.forEach((relativePath, zipEntry) => {
        // 跳过目录和隐藏文件
        if (zipEntry.dir || relativePath.startsWith('__MACOSX') || relativePath.startsWith('.')) {
            return
        }

        const filename = getFileName(relativePath)

        // 处理图片文件
        if (isImageFile(filename)) {
            const promise = zipEntry.async('arraybuffer').then((buffer) => {
                const imageFile = createFileFromBuffer(buffer, filename, getMimeType(filename))
                result.imageFiles.push(imageFile)
            })
            filePromises.push(promise)
        }

        // 处理 Word 文档
        if (isDocxFile(filename)) {
            const promise = zipEntry.async('arraybuffer').then((buffer) => {
                const docxFile = createFileFromBuffer(buffer, filename, getMimeType(filename))
                result.docxFiles.push(docxFile)
            })
            filePromises.push(promise)
        }
    })

    await Promise.all(filePromises)
    return result
}

/**
 * 使用 7z-wasm 解压 RAR/7z 文件
 */
async function extractWith7zWasm(file: File): Promise<ExtractResult> {
    const result: ExtractResult = {
        docxFiles: [],
        imageFiles: [],
    }

    try {
        // 动态导入 7z-wasm
        const SevenZip = await import('7z-wasm')
        const sevenZip = await SevenZip.default()

        const arrayBuffer = await file.arrayBuffer()
        const inputData = new Uint8Array(arrayBuffer)

        // 在 7z-wasm 虚拟文件系统中创建目录
        const inputDir = '/input'
        const outputDir = '/output'

        sevenZip.FS.mkdir(inputDir)
        sevenZip.FS.mkdir(outputDir)

        // 将压缩包写入虚拟文件系统
        const inputPath = `${inputDir}/${file.name}`
        sevenZip.FS.writeFile(inputPath, inputData)

        // 执行解压命令
        console.log('[7z-wasm] 开始解压:', file.name)
        sevenZip.callMain(['x', inputPath, `-o${outputDir}`, '-y', '-bso0', '-bsp0'])

        // 递归读取解压后的文件
        function readDir(dirPath: string): void {
            const entries = sevenZip.FS.readdir(dirPath)

            for (const entry of entries) {
                if (entry === '.' || entry === '..') continue

                const fullPath = `${dirPath}/${entry}`
                const stat = sevenZip.FS.stat(fullPath)

                if (sevenZip.FS.isDir(stat.mode)) {
                    // 递归处理子目录
                    readDir(fullPath)
                } else if (sevenZip.FS.isFile(stat.mode)) {
                    // 跳过隐藏文件
                    if (entry.startsWith('.') || fullPath.includes('__MACOSX')) continue

                    const filename = getFileName(entry)

                    // 读取文件内容
                    const fileData = sevenZip.FS.readFile(fullPath, { encoding: 'binary' })

                    // 处理图片文件
                    if (isImageFile(filename)) {
                        const imageFile = createFileFromBuffer(fileData, filename, getMimeType(filename))
                        result.imageFiles.push(imageFile)
                    }

                    // 处理 Word 文档
                    if (isDocxFile(filename)) {
                        const docxFile = createFileFromBuffer(fileData, filename, getMimeType(filename))
                        result.docxFiles.push(docxFile)
                    }
                }
            }
        }

        readDir(outputDir)

        console.log('[7z-wasm] 解压完成:', result.docxFiles.length, '个 Word 文档,', result.imageFiles.length, '张图片')

        return result
    } catch (error) {
        console.error('[7z-wasm] 解压失败:', error)
        throw new Error(`解压 ${file.name} 失败: ${error instanceof Error ? error.message : '未知错误'}`)
    }
}

/**
 * 通用解压函数 - 自动选择合适的解压方式
 * @param file 压缩包文件
 * @returns 解压结果
 */
export async function extractArchive(file: File): Promise<ExtractResult> {
    const archiveType = getArchiveType(file)

    console.log('[Archive Processor] 处理文件:', file.name, '类型:', archiveType)

    switch (archiveType) {
        case 'zip':
            // ZIP 使用 JSZip (更轻量)
            return extractWithJSZip(file)

        case '7z':
        case 'rar':
            // 7z/RAR 使用 7z-wasm
            return extractWith7zWasm(file)

        default:
            throw new Error(`不支持的压缩包格式: ${file.name}`)
    }
}

// 为了向后兼容，导出旧的函数名
export { extractArchive as extractZip }
export { isArchiveFile as isZipFile }
