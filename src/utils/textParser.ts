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

  for (let index = 0; index < blocks.length; index++) {
    const block = blocks[index]
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
      continue
    }

    // 无标注时进行智能识别
    // 特殊处理：检查当前块和下一块是否构成双图
    const doubleImageResult = tryRecognizeDoubleImage(blocks, index, trimmedBlock)
    if (doubleImageResult && doubleImageResult.isDouble) {
      // 识别为双图，处理跳过下一张图片
      contentBlocks.push({
        id: `block_${Date.now()}_${index}`,
        text: doubleImageResult.text,
        type: doubleImageResult.type,
        meta: { source: 'smart', doubleImage: true, skipNext: true } // 标记为双图
      })
      index++ // 跳过下一块（因为已经合并处理了）
      continue
    }

    const smartType: IdentifyResult = smartIdentifyType(trimmedBlock, index, blocks)

    contentBlocks.push({
      id: `block_${Date.now()}_${index}`,
      text: trimmedBlock,
      type: smartType.type,
      meta: { source: 'smart' } // 智能识别来源
    })
  }

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
  return (
    type === 'image_single' ||
    type === 'image_double' ||
    type === 'image_single_caption' ||
    type === 'image_double_caption'
  )
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
  const trimmedText: string = text.trim()

  // 引言标记：> 开头
  if (trimmedText.startsWith('>')) {
    const quoteContent = trimmedText.substring(1).trim()
    return { hasMark: true, text: quoteContent, type: 'intro' }
  }

  // 图片模板标记 - 简化语法
  // & 单独使用 = 纯单图
  // &内容 = 单图 + 图注
  // && 单独使用 = 纯双图
  // &&左图注 右图注 = 双图 + 图注
  if (trimmedText.startsWith('&')) {
    // 处理 &&（双图）
    if (trimmedText.startsWith('&&')) {
      const doubleContent = trimmedText.substring(2).trim()

      // && 单独使用 = 纯双图
      if (doubleContent === '' || doubleContent === '双图') {
        return { hasMark: true, text: '', type: 'image_double' }
      }

      // 兼容旧标记
      if (doubleContent === '双图+注' || doubleContent === 'double_caption') {
        return { hasMark: true, text: '', type: 'image_double_caption' }
      }

      // &&后有内容 = 双图 + 图注
      // 移除可能存在的"双图"前缀
      const cleanContent = doubleContent.replace(/^双图\s*/, '')
      return {
        hasMark: true,
        text: cleanContent,
        type: 'image_double_caption'
      }
    }

    // 处理 &（单图）
    const content = trimmedText.substring(1).trim()

    // & 单独使用 = 纯单图
    if (content === '' || content === '单图') {
      return { hasMark: true, text: '', type: 'image_single' }
    }

    // 兼容旧标记
    if (content === '单图+注' || content === 'single_caption') {
      return { hasMark: true, text: '', type: 'image_single_caption' }
    }

    // &后有内容 = 单图 + 图注
    // 移除可能存在的"单图"前缀和冒号
    const cleanContent = content.replace(/^单图[::：]?\s*/, '')
    return {
      hasMark: true,
      text: cleanContent,
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
 * 图片/图注关键词
 */
const IMAGE_KEYWORDS: string[] = ['图', '图片', '图注', '如图所示', '上图', '下图', '左图', '右图', '照片', '图像', '截图']

/**
 * 智能识别内容类型
 * @param text - 文本内容
 * @param index - 在整体中的索引
 * @param allBlocks - 所有文本块
 * @returns 识别结果
 */
function smartIdentifyType(text: string, index: number, allBlocks: string[]): IdentifyResult {
  // 1. 标题识别（优先级最高，避免被图注重叠）
  if (isLikelyTitle(text, index, allBlocks)) {
    return { type: 'title' }
  }

  // 2. 引言识别（第一段）
  if (index === 0 && isLikelyIntro(text)) {
    return { type: 'intro' }
  }

  // 3. 图片/图注识别
  if (isLikelyImageCaption(text)) {
    return { type: 'image_single_caption' }
  }

  // 4. 结尾识别（最后一段）
  if (index === allBlocks.length - 1 && isLikelyOutro(text)) {
    return { type: 'outro' }
  }

  // 5. 默认为正文
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
 * 判断是否为图片/图注
 * @param text - 文本内容
 * @returns 是否为图片/图注
 */
function isLikelyImageCaption(text: string): boolean {
  // 移除首尾空格
  const trimmedText = text.trim()

  // 图注通常较短，但可能比想象的要长（放宽到100字符）
  if (trimmedText.length > 100) {
    return false
  }

  // 强特征1：以"图"字开头，后面跟数字编号（如图1、图2）
  if (/^图\d+/.test(trimmedText)) {
    return true
  }

  // 强特征2：符合"图注："或"图："格式
  if (/^(图注|图)[:：]/.test(trimmedText)) {
    return true
  }

  // 强特征3：看起来像图片文件名，包含常见图片格式
  if (/\.(jpg|jpeg|png|gif|bmp|webp|tiff|svg)$/i.test(trimmedText)) {
    return true
  }

  // 中等特征：包含"图"等关键词，且整体较短（小于30字符）
  // 并且关键词必须在开头，避免将正文中"如图所示"误判为图注
  if (trimmedText.length < 30 && IMAGE_KEYWORDS.some(keyword => {
    // 检查关键词是否在开头（更可能是图注）
    return trimmedText.startsWith(keyword)
  })) {
    return true
  }

  return false
}

/**
 * 双图识别结果接口
 */
interface DoubleImageResult {
  isDouble: boolean;
  type: BlockType;
  text: string;
  skipCount?: number; // 需要跳过的块数
}

/**
 * 尝试识别双图
 * 支持多种双图模式：
 * 1. 连续两个图片（如标注的 &&双图）
 * 2. 图片-图注-图片模式
 * 3. 图片-图片-图注模式
 * @param blocks - 所有文本块
 * @param currentIndex - 当前块索引
 * @param currentBlock - 当前块内容
 * @returns 双图识别结果
 */
function tryRecognizeDoubleImage(blocks: string[], currentIndex: number, currentBlock: string): DoubleImageResult | null {
  // 模式1：显式标记的双图
  // 当前块包含"双图"关键词
  if (/双图/.test(currentBlock)) {
    return {
      isDouble: true,
      type: 'image_double',
      text: currentBlock
    }
  }

  // 当前块包含"双图+注"关键词
  if (/双图\+注/.test(currentBlock)) {
    return {
      isDouble: true,
      type: 'image_double_caption',
      text: currentBlock
    }
  }

  // 模式2：检查连续的图片/图注（已标注的情况，如 &&双图）
  if (currentIndex < blocks.length - 1) {
    const nextBlock = blocks[currentIndex + 1]?.trim() || ''
    const currentIsImage = isLikelyImageCaption(currentBlock)
    const nextIsImage = isLikelyImageCaption(nextBlock)

    if (currentIsImage && nextIsImage) {
      // 两个都是图片，可能是双图
      const combinedText = `${currentBlock} ${nextBlock}`

      // 检查是否有图注关键词
      if (IMAGE_KEYWORDS.some(keyword => currentBlock.includes(keyword) && keyword.includes('图'))) {
        return {
          isDouble: true,
          type: 'image_double_caption',
          text: combinedText
        }
      }

      return {
        isDouble: true,
        type: 'image_double',
        text: combinedText
      }
    }
  }

  // 模式3：从标记文本中识别双图（如 &单图 图注1\n\n&单图 图注2）
  // 这种情况由 Step1 的 convertConsecutiveImagesToDouble 处理，已经合并成 &&双图
  // 所以这里不需要额外处理

  return null
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
