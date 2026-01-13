
/**
 * 判断段落内容是否可能是标题
 */
export const isLikelyHeading = (text: string): boolean => {
    const trimmed = text.trim()
    return (
        trimmed.startsWith('##') || // 有标注
        trimmed.startsWith('#') || // 有标注
        /^第[一二三四五六七八九十\d]+[章节部分]/.test(trimmed) || // 章节标题
        /^\d+[\.、]/.test(trimmed) || // 编号标题
        (trimmed.length < 30 && !trimmed.includes('，')) // 短且无逗号
    )
}

/**
 * 清洗单个图注内容
 */
export const cleanCaption = (caption: string): string => {
    if (!caption) return ''

    let cleaned = caption.trim()

    // 移除外层括号（中文和英文）
    cleaned = cleaned.replace(/^[（(](.+)[）)]$/, '$1')

    // 移除常见前缀模式
    const prefixPatterns = [
        /^图为[:：]?\s*/,           // "图为：" 或 "图为"
        /^图[一二三四五六七八九十\d]+[:：、]?\s*/,  // "图一：" 或 "图1、"
        /^图中[:：]?\s*/,           // "图中："
        /^图示[:：]?\s*/,           // "图示："
        /^如图[:：]?\s*/,           // "如图："
        /^上图[:：]?\s*/,           // "上图："
        /^下图[:：]?\s*/,           // "下图："
        /^左图[:：]?\s*/,           // "左图："
        /^右图[:：]?\s*/,           // "右图："
        /^图片[:：]?\s*/,           // "图片："
        /^配图[:：]?\s*/,           // "配图："
    ]

    for (const pattern of prefixPatterns) {
        cleaned = cleaned.replace(pattern, '')
    }

    // 再次移除可能残留的括号
    cleaned = cleaned.replace(/^[（(]/, '').replace(/[）)]$/, '')

    // 移除多余的空格
    cleaned = cleaned.replace(/\s+/g, ' ').trim()

    return cleaned
}

/**
 * 判断是否可能是图注
 * 特征：以括号开头，包含“图为”等关键词，或短文本且无句号结尾
 */
export const isLikelyCaption = (line: string): boolean => {
    if (!line) return false
    const trimmed = line.trim()
    if (!trimmed) return false

    // 以括号开头
    if (/^[（(]/.test(trimmed)) return true

    // 包含"图为"、"图一"等关键词
    if (/^图[为一二三四五六七八九十\d中示]/.test(trimmed)) return true

    // 短文本且看起来像图注（少于50字符，无句号结尾）
    if (trimmed.length < 50 && !trimmed.endsWith('。') && !trimmed.endsWith('.')) {
        return true
    }

    return false
}

/**
 * 清洗所有图注（遍历整个文本）
 */
export const cleanAllCaptions = (text: string): string => {
    // 匹配 &后面跟着的图注内容
    return text.replace(/&([^\n&]+)/g, (_, caption) => {
        const cleaned = cleanCaption(caption)
        return cleaned ? `&${cleaned}` : '&'
    })
}

/**
 * 第0阶段：合并图片标记和后续的图注段落
 * 处理模式：& \n\n （图为xxx） → &xxx
 */
export const mergeImageWithCaption = (text: string): string => {
    const lines = text.split('\n')
    const result: string[] = []
    let i = 0

    while (i < lines.length) {
        const currentLine = lines[i].trim()

        // 检查是否是单独的图片标记 &
        if (currentLine === '&' || currentLine === '&&') {
            // 查找后面的图注段落
            let nextNonEmpty = i + 1
            while (nextNonEmpty < lines.length && lines[nextNonEmpty].trim() === '') {
                nextNonEmpty++
            }

            if (nextNonEmpty < lines.length) {
                const nextLine = lines[nextNonEmpty].trim()

                // 检查是否是图注（以括号开头，或包含"图为"等关键词）
                if (isLikelyCaption(nextLine)) {
                    // 清洗图注并合并
                    const cleanedCaption = cleanCaption(nextLine)

                    if (currentLine === '&&') {
                        // 双图情况：可能需要查找两个图注
                        let secondCaption = ''
                        let nextNext = nextNonEmpty + 1
                        while (nextNext < lines.length && lines[nextNext].trim() === '') {
                            nextNext++
                        }
                        if (nextNext < lines.length && isLikelyCaption(lines[nextNext].trim())) {
                            secondCaption = cleanCaption(lines[nextNext].trim())
                            i = nextNext + 1
                        } else {
                            i = nextNonEmpty + 1
                        }

                        if (cleanedCaption && secondCaption) {
                            result.push(`&&${cleanedCaption} ${secondCaption}`)
                        } else if (cleanedCaption) {
                            result.push(`&&${cleanedCaption}`)
                        } else {
                            result.push('&&')
                        }
                    } else {
                        // 单图情况
                        if (cleanedCaption) {
                            result.push(`&${cleanedCaption}`)
                        } else {
                            result.push('&')
                        }
                        i = nextNonEmpty + 1
                    }
                    continue
                }
            }
        }

        result.push(lines[i])
        i++
    }

    return result.join('\n')
}

/**
 * 第1阶段：将连续的单图转换为双图
 */
export const convertConsecutiveImagesToDouble = (text: string): string => {
    // 先清洗所有图注
    const cleanedText = cleanAllCaptions(text)

    // 匹配连续的图片标记（中间可能有空行或换行）
    // 支持 & 或 &caption 格式
    const regex = /&([^\n&]*?)\n+&([^\n&]*?)(?=\n|$)/g

    return cleanedText.replace(regex, (_, caption1, caption2) => {
        // 清理图注内容
        const clean1 = cleanCaption(caption1)
        const clean2 = cleanCaption(caption2)

        // 两个都有图注
        if (clean1 && clean2) {
            return `&&${clean1} ${clean2}\n\n`
        }

        // 只有一个有图注
        if (clean1 || clean2) {
            const caption = clean1 || clean2
            return `&&${caption}\n\n`
        }

        // 都没有图注，纯双图
        return '&&\n\n'
    })
}

/**
 * 将 Mammoth 解析出的 HTML 转换为应用的自定义格式
 */
export const convertHtmlToCustomFormat = (html: string): string => {
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, 'text/html')
    const div = doc.body

    let text = ''

    const processNode = (node: Node): string => {
        if (node.nodeType === Node.TEXT_NODE) {
            return node.textContent || ''
        }

        if (node.nodeType !== Node.ELEMENT_NODE) return ''
        const el = node as HTMLElement
        const content = Array.from(el.childNodes).map(processNode).join('')

        switch (el.tagName) {
            case 'H1':
                return `\n\n# ${content.trim()}\n\n`
            case 'H2':
            case 'H3':
                return `\n\n## ${content.trim()}\n\n`
            case 'P':
                const className = el.className || ''
                if (className.includes('caption')) {
                    if (isLikelyHeading(content)) {
                        return `\n\n${content.trim()}\n\n`
                    }
                    const cleanedContent = content.trim().replace(/\s+/g, ' ')
                    return `\n\n&${cleanedContent}\n\n`
                }
                if (content.trim().startsWith('&')) return content
                return `\n\n${content.trim()}\n\n`
            case 'IMG':
                if (el.getAttribute('alt')?.startsWith('&')) {
                    return '\n\n' + el.getAttribute('alt') + '\n\n'
                }
                return ''
            case 'BR':
                return '\n'
            case 'UL':
            case 'OL':
                return `\n\n${content.trim()}\n\n`
            case 'LI':
                return `• ${content.trim()}\n`
            case 'BLOCKQUOTE':
                return `\n\n> ${content.trim()}\n\n`
            default:
                return content
        }
    }

    div.childNodes.forEach(node => {
        text += processNode(node)
    })

    // 清理多余空行并执行合并逻辑
    text = text.replace(/\n{3,}/g, '\n\n').trim()
    text = mergeImageWithCaption(text)
    text = convertConsecutiveImagesToDouble(text)

    return text
}
