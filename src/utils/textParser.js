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
 */
export function smartTextParser(rawText) {
  if (!rawText.trim()) {
    return []
  }

  // 清理文本：移除首尾空格，标准化换行符
  const cleanedText = rawText.trim().replace(/\r\n/g, '\n')

  // 按两个以上连续换行符分割文本块
  const blocks = cleanedText.split(/\n{2,}/)

  // 生成内容块数组，支持标注识别和智能识别
  const contentBlocks = []

  blocks.forEach((block, index) => {
    const trimmedBlock = block.trim()

    // 优先尝试标注识别
    const markedResult = parseMarkedContent(trimmedBlock)
    if (markedResult.hasMark) {
      contentBlocks.push({
        id: `block_${Date.now()}_${index}`,
        text: markedResult.text,
        type: markedResult.type,
        source: 'mark' // 标记来源
      })
      return
    }

    // 无标注时进行智能识别
    const smartType = smartIdentifyType(trimmedBlock, index, blocks)

    contentBlocks.push({
      id: `block_${Date.now()}_${index}`,
      text: trimmedBlock,
      type: smartType.type,
      source: 'smart' // 智能识别来源
    })
  })

  // 过滤掉真正的空块，但保留图片模板块
  return contentBlocks.filter(block => block.text.length > 0 || isImageBlock(block.type))
}

// 添加图片块类型判断函数
function isImageBlock(type) {
  return ['image_single', 'image_double'].includes(type)
}

/**
 * 预处理引言/结尾块，将多行引言合并为一个块
 */
function preprocessQuoteBlocks(text) {
  // 匹配多行>开头的引用块
  const quoteBlockPattern = /^(> .+(?:\n> .+)*)/gm
  return text.replace(quoteBlockPattern, (match) => {
    // 移除每行的>标记，只保留内容
    return match.split('\n').map(line => line.substring(2)).join('\n')
  })
}

/**
 * 解析带标记的内容
 */
function parseMarkedContent(text) {
  // 图片模板标记 - 去除前后空格后进行匹配
  const trimmedText = text.trim()

  if (trimmedText === '&单图' || trimmedText === '单图') {
    return {
      hasMark: true,
      text: '',
      type: 'image_single'
    }
  }

  if (trimmedText === '&&双图' || trimmedText === '双图') {
    return {
      hasMark: true,
      text: '',
      type: 'image_double'
    }
  }

  // 小标题标记：##
  const subtitleMatch = text.match(/^##\s*(.+)$/)
  if (subtitleMatch) {
    return {
      hasMark: true,
      text: subtitleMatch[1].trim(),
      type: 'title'
    }
  }

  // 正文标记：#
  const bodyMatch = text.match(/^#\s*(.+)$/)
  if (bodyMatch) {
    return {
      hasMark: true,
      text: bodyMatch[1].trim(),
      type: 'body'
    }
  }

  // 其他特殊标记
  const specialMarks = {
    '引言：': 'intro',
    '【引言】': 'intro',
    '前言：': 'intro',
    '【前言】': 'intro',
    '结尾：': 'outro',
    '【结尾】': 'outro',
    '总结：': 'outro',
    '【总结】': 'outro'
  }

  for (const [mark, type] of Object.entries(specialMarks)) {
    if (text.startsWith(mark)) {
      return {
        hasMark: true,
        text: text.substring(mark.length).trim(),
        type: type
      }
    }
  }

  return {
    hasMark: false,
    text: text,
    type: null
  }
}

/**
 * 智能识别内容类型
 */
function smartIdentifyType(text, index, allBlocks) {
  // 优先级规则检查

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
 */
function isLikelyTitle(text, index, allBlocks) {
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
  const titleKeywords = ['标题', '概述', '简介', '介绍', '背景']
  if (titleKeywords.some(keyword => text.includes(keyword))) {
    return true
  }

  return false
}

/**
 * 判断是否为引言
 */
function isLikelyIntro(text) {
  const introKeywords = ['引言', '前言', '概述', '简介', '介绍', '背景', '本文', '本文将', '首先']
  return introKeywords.some(keyword => text.includes(keyword))
}

/**
 * 判断是否为结尾
 */
function isLikelyOutro(text) {
  const outroKeywords = ['总结', '结论', '结束', '结语', '最后', '综上所述', '总的来说', '总之', '最终']
  return outroKeywords.some(keyword => text.includes(keyword))
}


/**
 * 清理单个文本块内部的换行符
 * 将单个换行符转换为空格或<br>标签
 */
export function cleanBlockText(text) {
  // 将单个换行符替换为空格
  return text.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim()
}