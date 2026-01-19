/**
 * 图片感知哈希工具
 * 用于计算图片的感知哈希 (pHash) 并进行相似度匹配
 * 
 * 算法说明：
 * 1. 将图片缩放到 8x8 灰度图
 * 2. 计算 DCT 变换（简化版本使用均值比较）
 * 3. 生成 64 位哈希值
 * 4. 使用汉明距离比较相似度
 */

/**
 * 图片哈希数据结构
 */
export interface ImageHashData {
    hash: string           // 64 位二进制哈希字符串
    file: File             // 原始文件
    index: number          // 原始索引
    width?: number         // 图片宽度
    height?: number        // 图片高度
}

/**
 * 匹配结果
 */
export interface MatchResult {
    docIndex: number       // 文档中的图片索引
    archiveIndex: number   // 压缩包中的图片索引
    distance: number       // 汉明距离
    file: File             // 匹配的文件
}

// 哈希计算的目标尺寸
const HASH_SIZE = 8

/**
 * 将图片文件转换为 ImageBitmap
 */
async function fileToImageBitmap(file: File): Promise<ImageBitmap> {
    const blob = new Blob([await file.arrayBuffer()], { type: file.type })
    return createImageBitmap(blob)
}

/**
 * 将 ArrayBuffer 转换为 ImageBitmap
 */
async function bufferToImageBitmap(buffer: ArrayBuffer, mimeType: string): Promise<ImageBitmap> {
    const blob = new Blob([buffer], { type: mimeType })
    return createImageBitmap(blob)
}

/**
 * 计算图片的感知哈希 (Average Hash / aHash)
 * 使用均值哈希算法，简单高效
 */
export async function computeImageHash(
    source: File | { buffer: ArrayBuffer; mimeType: string }
): Promise<string> {
    let bitmap: ImageBitmap

    if (source instanceof File) {
        bitmap = await fileToImageBitmap(source)
    } else {
        bitmap = await bufferToImageBitmap(source.buffer, source.mimeType)
    }

    // 创建 Canvas 用于图像处理
    const canvas = new OffscreenCanvas(HASH_SIZE, HASH_SIZE)
    const ctx = canvas.getContext('2d')

    if (!ctx) {
        throw new Error('无法创建 Canvas 上下文')
    }

    // 缩放图片到 8x8
    ctx.drawImage(bitmap, 0, 0, HASH_SIZE, HASH_SIZE)

    // 获取像素数据
    const imageData = ctx.getImageData(0, 0, HASH_SIZE, HASH_SIZE)
    const pixels = imageData.data

    // 转换为灰度值数组
    const grayValues: number[] = []
    for (let i = 0; i < pixels.length; i += 4) {
        // 使用加权灰度公式
        const gray = 0.299 * pixels[i] + 0.587 * pixels[i + 1] + 0.114 * pixels[i + 2]
        grayValues.push(gray)
    }

    // 计算均值
    const mean = grayValues.reduce((sum, val) => sum + val, 0) / grayValues.length

    // 生成哈希：每个像素与均值比较
    let hash = ''
    for (const gray of grayValues) {
        hash += gray >= mean ? '1' : '0'
    }

    bitmap.close()

    return hash
}

/**
 * 计算两个哈希的汉明距离
 * 距离越小，图片越相似
 */
export function hammingDistance(hash1: string, hash2: string): number {
    if (hash1.length !== hash2.length) {
        throw new Error('哈希长度不匹配')
    }

    let distance = 0
    for (let i = 0; i < hash1.length; i++) {
        if (hash1[i] !== hash2[i]) {
            distance++
        }
    }

    return distance
}

/**
 * 批量计算文件的哈希
 */
export async function computeHashesForFiles(files: File[]): Promise<ImageHashData[]> {
    const results: ImageHashData[] = []

    for (let i = 0; i < files.length; i++) {
        try {
            const hash = await computeImageHash(files[i])
            results.push({
                hash,
                file: files[i],
                index: i
            })
        } catch (e) {
            console.warn(`[ImageHasher] 无法计算图片哈希: ${files[i].name}`, e)
            // 对于无法计算哈希的图片，使用空哈希
            results.push({
                hash: '0'.repeat(64),
                file: files[i],
                index: i
            })
        }
    }

    return results
}

/**
 * 批量计算 ArrayBuffer 的哈希（用于 Word 文档中的图片）
 */
export async function computeHashesForBuffers(
    buffers: Array<{ buffer: ArrayBuffer; mimeType: string; index: number }>
): Promise<string[]> {
    const hashes: string[] = []

    for (const item of buffers) {
        try {
            const hash = await computeImageHash({ buffer: item.buffer, mimeType: item.mimeType })
            hashes.push(hash)
        } catch (e) {
            console.warn(`[ImageHasher] 无法计算文档图片哈希 (index: ${item.index})`, e)
            hashes.push('0'.repeat(64))
        }
    }

    return hashes
}

/**
 * 将压缩包图片与文档图片进行匹配
 * @param docHashes 文档中图片的哈希（有序）
 * @param archiveHashData 压缩包中图片的哈希数据
 * @param threshold 匹配阈值（汉明距离，小于此值认为匹配成功）
 * @returns 按文档顺序排列的压缩包图片
 */
export function matchImages(
    docHashes: string[],
    archiveHashData: ImageHashData[],
    threshold: number = 15
): File[] {
    const matched: File[] = []
    const usedArchiveIndices = new Set<number>()

    console.log(`[ImageHasher] 开始匹配: ${docHashes.length} 个文档图片, ${archiveHashData.length} 个压缩包图片`)

    // 对每个文档图片，找到最匹配的压缩包图片
    for (let docIdx = 0; docIdx < docHashes.length; docIdx++) {
        const docHash = docHashes[docIdx]
        let bestMatch: { archiveIdx: number; distance: number; file: File } | null = null

        for (let archiveIdx = 0; archiveIdx < archiveHashData.length; archiveIdx++) {
            // 跳过已使用的图片
            if (usedArchiveIndices.has(archiveIdx)) continue

            const archiveData = archiveHashData[archiveIdx]
            const distance = hammingDistance(docHash, archiveData.hash)

            if (distance <= threshold) {
                if (!bestMatch || distance < bestMatch.distance) {
                    bestMatch = {
                        archiveIdx,
                        distance,
                        file: archiveData.file
                    }
                }
            }
        }

        if (bestMatch) {
            matched.push(bestMatch.file)
            usedArchiveIndices.add(bestMatch.archiveIdx)
            console.log(`[ImageHasher] 文档图片 ${docIdx} 匹配到 ${bestMatch.file.name} (距离: ${bestMatch.distance})`)
        } else {
            console.warn(`[ImageHasher] 文档图片 ${docIdx} 未找到匹配`)
        }
    }

    // 将未匹配的压缩包图片追加到末尾
    for (let i = 0; i < archiveHashData.length; i++) {
        if (!usedArchiveIndices.has(i)) {
            matched.push(archiveHashData[i].file)
            console.log(`[ImageHasher] 未匹配的压缩包图片追加: ${archiveHashData[i].file.name}`)
        }
    }

    return matched
}

/**
 * 简化版匹配：当没有文档图片哈希时，按文件名排序
 */
export function sortByFileName(files: File[]): File[] {
    return [...files].sort((a, b) => {
        // 提取文件名中的数字
        const extractNumber = (name: string): number => {
            const match = name.match(/(\d+)/)
            return match ? parseInt(match[1], 10) : Number.MAX_SAFE_INTEGER
        }

        const numA = extractNumber(a.name)
        const numB = extractNumber(b.name)

        if (numA === numB) {
            return a.name.localeCompare(b.name, 'zh-CN')
        }

        return numA - numB
    })
}
