import type { ContentBlock, BlockType } from '@/types'

/**
 * 解析标记返回接口
 */
interface ParseResult {
  hasMark: boolean;
  text: string;
  type: BlockType | null;
}

/**
 * 智能识别结果接口
 */
interface IdentifyResult {
  type: BlockType;
}

/**
 * 智能文本解析器 - 支持标注语法和智能识别
 * 将纯文本解析为内容块数组
 *
 * 支持的标注语法：
 * # 正文内容
 * ## 小标题内容
 * &单图
 * &&双图
 *
 * 无标注的内容将进行智能识别
 *
 * @param rawText - 原始文本
 * @returns 内容块数组
 */
export function smartTextParser(rawText: string): ContentBlock[] {
  if (typeof rawText !== 'string') {
    throw new Error('Invalid input: rawText must be a string')
  }

  if (!rawText.trim()) {
    return []
  }

  // 清理文本：移除首尾空格，标准化换行符
  const cleanedText: string = rawText.trim().replace(/\r\n/g, '\n')

  // 按两个以上连续换行符分割文本块
  const blocks: string[] = cleanedText.split(/\n{2,}/)

  // 生成内容块数组，支持标注识别和智能识别
  const contentBlocks: ContentBlock[] = []

  blocks.forEach((block: string, index: number): void => {
    const trimmedBlock: string = block.trim()

    // 优先尝试标注识别
    const markedResult: ParseResult = parseMarkedContent(trimmedBlock)
    if (markedResult.hasMark && markedResult.type) {
      contentBlocks.push({
        id: `block_${Date.now()}_${index}`,
        text: markedResult.text,
        type: markedResult.type,
        meta: { source: 'mark' } // 标记来源
      })
      return
    }

    // 无标注时进行智能识别
    const smartType: IdentifyResult = smartIdentifyType(trimmedBlock, index, blocks)

    contentBlocks.push({
      id: `block_${Date.now()}_${index}`,
      text: trimmedBlock,
      type: smartType.type,
      meta: { source: 'smart' } // 智能识别来源
    })
  })

  // 过滤掉真正的空块，但保留图片模板块
  return contentBlocks.filter((block: ContentBlock): boolean =>
    block.text.length > 0 || isImageBlock(block.type)
  )
}

/**
 * 图片块类型判断函数
 * @param type - 块类型
 * @returns 是否为图片块
 */
function isImageBlock(type: BlockType): boolean {
  return type === 'image_single' || type === 'image_double'
}

/**
 * 预处理引言/结尾块，将多行引言合并为一个块
 * @param text - 原始文本
 * @returns 处理后的文本
 */
export function preprocessQuoteBlocks(text: string): string {
  if (typeof text !== 'string') {
    throw new Error('Invalid input: text must be a string')
  }

  // 匹配多行>开头的引用块
  const quoteBlockPattern = /^(> .+(?:\n> .+)*)/gm
  return text.replace(quoteBlockPattern, (match: string): string => {
    // 移除每行的>标记，只保留内容
    return match.split('\n').map((line: string): string => line.substring(2)).join('\n')
  })
}

/**
 * 特殊标记映射
 */
const SPECIAL_MARKS: Record<string, BlockType> = {
  '引言：': 'intro',
  '【引言】': 'intro',
  '前言：': 'intro',
  '【前言】': 'intro',
  '结尾：': 'outro',
  '【结尾】': 'outro',
  '总结：': 'outro',
  '【总结】': 'outro'
}

/**
 * 解析带标记的内容
 * @param text - 待解析的文本
 * @returns 解析结果
 */
function parseMarkedContent(text: string): ParseResult {
  // 图片模板标记 - 去除前后空格后进行匹配
  const trimmedText: string = text.trim()

  // 单图标记：& 或 &单图
  if (trimmedText.startsWith('&')) {
    const content = trimmedText.substring(1).trim()

    // 处理 && 
    if (trimmedText.startsWith('&&')) {
      const doubleContent = trimmedText.substring(2).trim()

      if (doubleContent === '双图+注' || doubleContent === 'double_caption') {
        // 兼容旧的完整标记
        return { hasMark: true, text: '', type: 'image_double_caption' }
      }

      if (doubleContent === '双图' || doubleContent === '') {
        return { hasMark: true, text: '', type: 'image_double' }
      }

      // &&后有其他内容，视为带图注
      return {
        hasMark: true,
        text: doubleContent,
        type: 'image_double_caption'
      }
    }

    // 处理 &
    if (content === '单图' || content === '') {
      return { hasMark: true, text: '', type: 'image_single' }
    }

    // &后有其他内容，视为带图注
    return {
      hasMark: true,
      text: content,
      type: 'image_single_caption'
    }
  }

  // 兼容旧的文字标记 "双图" 和 "双图+注" (不带符号的情况)
  if (trimmedText === '单图') {
    return { hasMark: true, text: '', type: 'image_single' }
  }
  if (trimmedText === '双图') {
    return { hasMark: true, text: '', type: 'image_double' }
  }
  if (trimmedText === '双图+注') {
    return { hasMark: true, text: '', type: 'image_double_caption' }
  }

  // 小标题标记：##
  const subtitleMatch: RegExpMatchArray | null = text.match(/^##\s*(.+)$/)
  if (subtitleMatch) {
    return {
      hasMark: true,
      text: subtitleMatch[1].trim(),
      type: 'title'
    }
  }

  // 正文标记：#
  const bodyMatch: RegExpMatchArray | null = text.match(/^#\s*(.+)$/)
  if (bodyMatch) {
    return {
      hasMark: true,
      text: bodyMatch[1].trim(),
      type: 'body'
    }
  }

  // 其他特殊标记
  for (const [mark, type] of Object.entries(SPECIAL_MARKS)) {
    if (text.startsWith(mark)) {
      return {
        hasMark: true,
        text: text.substring(mark.length).trim(),
        type
      }
    }
  }

  return {
    hasMark: false,
    text,
    type: null
  }
}

/**
 * 标题关键词
 */
const TITLE_KEYWORDS: string[] = ['标题', '概述', '简介', '介绍', '背景']

/**
 * 引言关键词
 */
const INTRO_KEYWORDS: string[] = ['引言', '前言', '概述', '简介', '介绍', '背景', '本文', '本文将', '首先']

/**
 * 结尾关键词
 */
const OUTRO_KEYWORDS: string[] = ['总结', '结论', '结束', '结语', '最后', '综上所述', '总的来说', '总之', '最终']

/**
 * 智能识别内容类型
 * @param text - 文本内容
 * @param index - 在整体中的索引
 * @param allBlocks - 所有文本块
 * @returns 识别结果
 */
function smartIdentifyType(text: string, index: number, allBlocks: string[]): IdentifyResult {
  // 1. 标题识别
  if (isLikelyTitle(text, index, allBlocks)) {
    return { type: 'title' }
  }

  // 2. 引言识别（第一段）
  if (index === 0 && isLikelyIntro(text)) {
    return { type: 'intro' }
  }

  // 3. 结尾识别（最后一段）
  if (index === allBlocks.length - 1 && isLikelyOutro(text)) {
    return { type: 'outro' }
  }

  // 4. 默认为正文
  return { type: 'body' }
}

/**
 * 判断是否为标题
 * @param text - 文本内容
 * @param _index - 索引（预留参数）
 * @param _allBlocks - 所有块（预留参数）
 * @returns 是否为标题
 */
function isLikelyTitle(text: string, _index: number, _allBlocks: string[]): boolean {
  // 章节标记（强特征）
  if (/^第[一二三四五六七八九十\d]+[章节部分]/.test(text)) {
    return true
  }

  // 数字编号
  if (/^\d+[\.、]/.test(text)) {
    return true
  }

  // 短小精悍且不含结束标点
  if (text.length < 36 && text.length > 2 &&
    !text.endsWith('。') && !text.endsWith('！') && !text.endsWith('？')) {
    return true
  }

  // 包含标题关键词
  if (TITLE_KEYWORDS.some((keyword: string): boolean => text.includes(keyword))) {
    return true
  }

  return false
}

/**
 * 判断是否为引言
 * @param text - 文本内容
 * @returns 是否为引言
 */
function isLikelyIntro(text: string): boolean {
  return INTRO_KEYWORDS.some((keyword: string): boolean => text.includes(keyword))
}

/**
 * 判断是否为结尾
 * @param text - 文本内容
 * @returns 是否为结尾
 */
function isLikelyOutro(text: string): boolean {
  return OUTRO_KEYWORDS.some((keyword: string): boolean => text.includes(keyword))
}

/**
 * 清理单个文本块内部的换行符
 * 将单个换行符转换为空格或<br>标签
 * @param text - 原始文本
 * @returns 清理后的文本
 */
export function cleanBlockText(text: string): string {
  if (typeof text !== 'string') {
    throw new Error('Invalid input: text must be a string')
  }

  // 将单个换行符替换为空格
  return text.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim()
}
