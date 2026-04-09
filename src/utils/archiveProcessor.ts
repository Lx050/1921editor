/**
 * 通用压缩包处理器
 * 支持 ZIP, RAR, 7z 格式的解压和内容提取
 * 使用 7z-wasm (基于 7-Zip WebAssembly) 处理 RAR/7z
 * 使用 JSZip 处理 ZIP (更轻量，且方便处理编码)
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
    const lowerName = filename.toLowerCase()
    // V5 改进：使用 includes 并在之后校验，防止由于编码问题导致的后缀截断
    const isDocx = lowerName.includes('.docx') || lowerName.includes('.docm')
    // 过滤 Word 临时文件
    const isTemp = getFileName(filename).startsWith('~$')
    return isDocx && !isTemp
}

/**
 * 从 ArrayBuffer 或 Uint8Array 创建 File 对象
 */
function createFileFromBuffer(buffer: ArrayBuffer | Uint8Array, filename: string, mimeType: string): File {
    // 强制转换为 any 以绕过 strict TS BlobPart 检查，或者使用正确的 ArrayBufferView
    const blob = new Blob([buffer] as any[], { type: mimeType })
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
 * 智能解码文件名
 * 尝试 UTF-8，如果不符合 UTF-8 规范则尝试 GBK
 */
function decodeFilename(bytes: Uint8Array): string {
    try {
        // 尝试用 UTF-8 解码，设置 fatal: true 如果由于字节序列不合法而失败则抛错
        const utf8Decoder = new TextDecoder('utf-8', { fatal: true });
        return utf8Decoder.decode(bytes);
    } catch (e) {
        // UTF-8 解码失败，很可能是 GBK (Windows 默认中文编码)
        try {
            const gbkDecoder = new TextDecoder('gbk');
            return gbkDecoder.decode(bytes);
        } catch (e2) {
            // 万一 GBK 也不行，退回到默认解码
            return new TextDecoder().decode(bytes);
        }
    }
}

/**
 * 使用 JSZip 解压 ZIP 文件 (带智能编码检测)
 */
async function extractWithJSZip(file: File): Promise<ExtractResult> {
    const result: ExtractResult = {
        docxFiles: [],
        imageFiles: [],
    }

    const arrayBuffer = await file.arrayBuffer()

    // V6: 使用智能解码处理文件名乱码
    const zip = await JSZip.loadAsync(arrayBuffer, {
        decodeFileName: (bytes: any) => {
            if (typeof bytes === 'string') return bytes;
            return decodeFilename(new Uint8Array(bytes));
        }
    })

    const filePromises: Promise<void>[] = []

    zip.forEach((relativePath, zipEntry) => {
        // 跳过目录和隐藏文件
        if (zipEntry.dir || relativePath.startsWith('__MACOSX') || relativePath.startsWith('.')) {
            return
        }

        const filename = getFileName(relativePath).trim()

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
        const inputDir = `/input_${Date.now()}`
        const outputDir = `/output_${Date.now()}`

        try { sevenZip.FS.mkdir(inputDir) } catch (e) { }
        try { sevenZip.FS.mkdir(outputDir) } catch (e) { }

        // 将压缩包写入虚拟文件系统
        const inputPath = `${inputDir}/${file.name}`
        sevenZip.FS.writeFile(inputPath, inputData)

        // 改进：不再强制 -mcp=936，除非明确需要（7z 对 ZIP 的编码处理有时不如 JSZip 灵活）
        const cmd = ['x', inputPath, `-o${outputDir}`, '-y', '-bso0', '-bsp0']

        // 如果文件名包含乱码标志，可以尝试添加选项，但此处我们优先信任 7z 的自动检测
        sevenZip.callMain(cmd)

        // 递归读取解压后的文件
        function readDir(dirPath: string): void {
            const entries = sevenZip.FS.readdir(dirPath)

            for (const entry of entries) {
                if (entry === '.' || entry === '..') continue

                const fullPath = `${dirPath}/${entry}`
                const stat = sevenZip.FS.stat(fullPath)

                if (sevenZip.FS.isDir(stat.mode)) {
                    readDir(fullPath)
                } else if (sevenZip.FS.isFile(stat.mode)) {
                    if (entry.startsWith('.') || fullPath.includes('__MACOSX')) continue

                    const filename = getFileName(entry).trim()

                    // 读取文件内容
                    const fileData = sevenZip.FS.readFile(fullPath, { encoding: 'binary' })

                    if (isImageFile(filename)) {
                        const imageFile = createFileFromBuffer(fileData, filename, getMimeType(filename))
                        result.imageFiles.push(imageFile)
                    } else if (isDocxFile(filename)) {
                        const docxFile = createFileFromBuffer(fileData, filename, getMimeType(filename))
                        result.docxFiles.push(docxFile)
                    }
                }
            }
        }

        readDir(outputDir)
        return result
    } catch (error) {
        console.error('[7z-wasm] 解压失败:', error)
        throw new Error(`解压 ${file.name} 失败: ${error instanceof Error ? error.message : '未知错误'}`)
    }
}

/**
 * 通用解压函数 - 自动选择合适的解压方式
 */
export async function extractArchive(file: File): Promise<ExtractResult> {
    const archiveType = getArchiveType(file)

    switch (archiveType) {
        case 'zip':
            // ZIP 优先使用 JSZip，因为它在浏览器端处理文件名编码更灵活
            try {
                return await extractWithJSZip(file)
            } catch (e) {
                console.warn('[Archive Processor] JSZip 处理失败，尝试 7z-wasm:', e)
                return await extractWith7zWasm(file)
            }

        case '7z':
        case 'rar':
            return await extractWith7zWasm(file)

        default:
            throw new Error(`不支持的压缩包格式: ${file.name}`)
    }
}

// 兼容性导出
export { extractArchive as extractZip }
export { isArchiveFile as isZipFile }
