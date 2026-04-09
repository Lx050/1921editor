/**
 * docxProcessor.ts
 *
 * Pure utility functions for DOCX/ZIP processing and HTML-to-custom-format conversion.
 * No Vue reactivity, no Pinia stores, no emit dependencies.
 */

// ── 图片尺寸读取（通过浏览器 Image 解码，无需手动解析二进制）──
export const getImageDimensionsFromBuffer = (
  buffer: ArrayBuffer,
  contentType: string
): Promise<{ width: number; height: number } | null> => {
  return new Promise((resolve) => {
    try {
      const blob = new Blob([buffer], { type: contentType })
      const url = URL.createObjectURL(blob)
      const img = new Image()
      img.onload = () => { URL.revokeObjectURL(url); resolve({ width: img.naturalWidth, height: img.naturalHeight }) }
      img.onerror = () => { URL.revokeObjectURL(url); resolve(null) }
      img.src = url
    } catch (e) {
      resolve(null)
    }
  })
}

// 方向判断：横版 / 竖版 / 方形
export const getImageOrientation = (dims: { width: number; height: number } | null | undefined): string => {
  if (!dims || !dims.width || !dims.height) return 'unknown'
  const r = dims.width / dims.height
  if (r > 1.2) return 'landscape'
  if (r < 0.85) return 'portrait'
  return 'square'
}

// 判断是否可能是图注
export const isLikelyCaption = (line: string): boolean => {
  if (!line) return false

  // 以括号开头
  if (/^[（(]/.test(line)) return true

  // 包含"图为"、"图一"等关键词
  if (/^图[为一二三四五六七八九十\d中示]/.test(line)) return true

  // 短文本且看起来像图注（少于50字符，无句号结尾）
  if (line.length < 50 && !line.endsWith('。') && !line.endsWith('.')) {
    return true
  }

  return false
}

// 判断是否是标题
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

// 判断是否是可能的图注文本
export const isShortCaptionText = (text: string): boolean => {
  const trimmed = text.trim()
  if (!trimmed) return false

  // 图注特征检查
  const features = {
    length: trimmed.length < 50, // 短文本
    hasKeywords: /图|注|说明|示意|示例|caption|pic|image/i.test(trimmed), // 含关键词
    noPunctuations: !/[，。！？；："""]{2,}/.test(trimmed), // 无长句标点
    noCommas: !trimmed.includes('，'), // 无逗号
    noPeriods: !trimmed.includes('。'), // 无句号
    notEmpty: trimmed.length > 0,
    notOnlyNumbers: !/^[\d\s]+$/.test(trimmed) // 非纯数字
  }

  // 如果满足所有条件，极可能是图注
  return Object.values(features).every(v => v === true)
}

// 清洗单个图注内容
export const cleanCaption = (caption: string): string => {
  if (!caption) return ''

  let cleaned = caption.trim()

  // 移除尺寸后缀（如 |750x500）——可能残留在未合并的 alt 中
  cleaned = cleaned.replace(/\|\d+x\d+$/, '')

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

// 第0阶段：合并图片标记和后续的图注段落
// 处理模式：& \n\n （图为xxx） → &xxx
export const mergeImageWithCaption = (text: string): string => {
  // 匹配：& 后面跟着换行，然后是一个可能的图注段落
  // 图注段落特征：以 （ 或 ( 开头，或者包含 "图为"、"图一" 等关键词

  const lines = text.split('\n')
  const result: string[] = []
  let i = 0

  while (i < lines.length) {
    const currentLine = lines[i].trim()

    // 检查是否是单独的图片标记（& 或 &|WxH，没有图注文字）
    const isBareImage = /^&&?(\|\d+x\d+)?$/.test(currentLine)
    const isDoubleBareLine = currentLine.startsWith('&&')
    if (isBareImage) {
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

          // 提取当前行的尺寸后缀（如 |750x500），合并后需要保留给后续方向判断
          const dimsSuffix = (currentLine.match(/(\|\d+x\d+)$/) || [])[1] || ''

          if (isDoubleBareLine) {
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
            // 单图情况：合并图注，保留尺寸后缀供方向判断
            if (cleanedCaption) {
              result.push(`&${cleanedCaption}${dimsSuffix}`)
            } else {
              result.push(`&${dimsSuffix}` || '&')
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

// 后处理函数：将连续的单图按方向判断合并或保持独立
// 规则：横+横 / 竖+竖 / 方+方 → 双图；其他组合 → 各自单图
export const convertConsecutiveImagesToDouble = (text: string): string => {
  // 从 alt 里解析尺寸后缀 |WxH
  const parseDims = (raw: string): { width: number; height: number } | null => {
    const m = raw.match(/\|(\d+)x(\d+)$/)
    return m ? { width: +m[1], height: +m[2] } : null
  }

  // 匹配两个连续 & 行（中间可能有空行）
  // raw1/raw2 包含原始内容（含 |WxH 后缀）
  const regex = /&([^\n&]*?)\n+&([^\n&]*?)(?=\n|$)/g

  let result = text.replace(regex, (match, raw1: string, raw2: string) => {
    // ── 方向判断 ──
    const dims1 = parseDims(raw1)
    const dims2 = parseDims(raw2)
    const orient1 = getImageOrientation(dims1)
    const orient2 = getImageOrientation(dims2)

    // 去掉尺寸后缀再清洗图注
    const clean1 = cleanCaption(raw1.replace(/\|\d+x\d+$/, ''))
    const clean2 = cleanCaption(raw2.replace(/\|\d+x\d+$/, ''))

    // 两者都有已知方向且方向不同 → 保持各自单图
    if (orient1 !== 'unknown' && orient2 !== 'unknown' && orient1 !== orient2) {
      const s1 = clean1 ? `&${clean1}` : '&'
      const s2 = clean2 ? `&${clean2}` : '&'
      return `${s1}\n\n${s2}\n\n`
    }

    // 同向（含未知）→ 合并双图
    if (clean1 && clean2) return `&&${clean1} ${clean2}\n\n`
    if (clean1 || clean2) return `&&${clean1 || clean2}\n\n`
    return '&&\n\n'
  })

  // 清除所有残余的尺寸后缀（未被合并的单图行）
  result = result.replace(/&([^&\n]*)\|\d+x\d+/g, (_, caption: string) => {
    const c = cleanCaption(caption)
    return c ? `&${c}` : '&'
  })

  return result
}

// 清洗所有图注（遍历整个文本）
export const cleanAllCaptions = (text: string): string => {
  // 匹配 &后面跟着的图注内容
  return text.replace(/&([^\n&]+)/g, (match, caption: string) => {
    const cleaned = cleanCaption(caption)
    return cleaned ? `&${cleaned}` : '&'
  })
}

// 后处理函数：修复图片后的图注识别问题
export const fixImageCaptions = (text: string): string => {
  // 处理模式：识别图片后的短文本段（应为图注但被识别为正文）
  // 识别以下模式：
  // 模式1（高置信度）：图片 → 短文本 → 图片/标题
  // 模式2（中置信度）：图片 → 短文本 → 长文本（图片已结束）

  const paragraphs = text.split(/\n\n/g)
  const result: string[] = []
  let i = 0

  while (i < paragraphs.length) {
    const current = paragraphs[i]?.trim() || ''
    const next = paragraphs[i + 1]?.trim() || ''
    const nextNext = paragraphs[i + 2]?.trim() || ''

    result.push(paragraphs[i])

    // 模式1：检查是否是图片 → 短文本 → 图片/标题
    // 这是最高置信度的图注模式
    if (
      current.startsWith('&单图') &&
      next && // 有下一段
      !next.startsWith('&') && // 下一段不是图片标记
      nextNext && // 有下下段
      (nextNext.startsWith('&单图') || isLikelyHeading(nextNext)) // 下下段是图片或标题
    ) {
      // 检查中间段是否是图注
      if (isShortCaptionText(next)) {
        // 将中间段标记为图注
        result[result.length - 1] = current + ' ' + next // 合并到图片标记中
        i += 2 // 跳过已经处理的中间段
        continue
      }
    }

    // 模式2：检查是否是图片 → 短文本 → 长文本（图片已结束）
    // 中置信度的图注模式
    if (
      current.startsWith('&单图') &&
      next && // 有下一段
      !next.startsWith('&') && // 下一段不是图片标记
      nextNext && // 有下下段
      nextNext.length > 100 // 下下段是正文（长度>100）
    ) {
      if (isShortCaptionText(next)) {
        result[result.length - 1] = current + ' ' + next // 合并到图片标记中
        i += 2 // 跳过已经处理的中间段
        continue
      }
    }

    // 模式3：检查是否是图片 → 短文本 → 结束（末尾的图注）
    if (
      current.startsWith('&单图') &&
      next && // 有下一段
      !next.startsWith('&') && // 下一段不是图片标记
      !nextNext // 没有下下段（已到结尾）
    ) {
      if (isShortCaptionText(next)) {
        result[result.length - 1] = current + ' ' + next // 合并到图片标记中
        i += 2 // 跳过已经处理的中间段
        continue
      }
    }

    i++
  }

  return result.join('\n\n')
}

// 将 HTML 转换为自定义文本格式（增强版：识别样式）
export const convertHtmlToCustomFormat = (html: string): string => {
  // 创建临时 DOM 元素来解析 HTML
  const div = document.createElement('div')
  div.innerHTML = html

  let text = ''

  // 遍历子节点
  const processNode = (node: Node): string => {
    if (node.nodeType === Node.TEXT_NODE) {
      return node.textContent || ''
    }

    if (node.nodeType !== Node.ELEMENT_NODE) return ''

    const el = node as Element
    let content = ''

    // 递归处理子节点
    el.childNodes.forEach(child => {
      content += processNode(child)
    })

    // 根据标签类型和class添加格式
    switch (el.tagName) {
      case 'H1':
      case 'H2':
      case 'H3':
        // Word 标题转为 ## (标题)，而非 # (正文)
        return `\n\n## ${content.trim()}\n\n`
      case 'P': {
        const className = el.className || ''

        // ── 同段落双图检测（Word 中两张图并排在同一段落）──
        // 这种情况直接合并为双图，尊重作者的原文布局
        const imgEls = Array.from(el.querySelectorAll('img'))
        if (imgEls.length === 2) {
          const a1 = imgEls[0].getAttribute('alt') || ''
          const a2 = imgEls[1].getAttribute('alt') || ''
          if (a1.startsWith('&') && a2.startsWith('&')) {
            // 去掉 & 前缀，cleanCaption 会在后续处理尺寸后缀
            const raw1 = a1.slice(1)
            const raw2 = a2.slice(1)
            // 保留 |WxH 供 convertConsecutiveImagesToDouble 方向判断时已略过（同段落直接双图）
            // 这里直接清洗输出
            const c1 = cleanCaption(raw1.replace(/\|\d+x\d+$/, ''))
            const c2 = cleanCaption(raw2.replace(/\|\d+x\d+$/, ''))
            if (c1 && c2) return `\n\n&&${c1} ${c2}\n\n`
            if (c1 || c2) return `\n\n&&${c1 || c2}\n\n`
            return '\n\n&&\n\n'
          }
        }

        // 如果是图注段落
        if (className.includes('caption')) {
          if (isLikelyHeading(content)) {
            return `\n\n${content.trim()}\n\n`
          }
          const cleanedContent = content.trim().replace(/\s+/g, ' ')
          return `\n\n&${cleanedContent}\n\n`
        }

        // 如果段落只包含图片占位符，直接返回
        if (content.trim().startsWith('&')) return content
        return `\n\n${content.trim()}\n\n`
      }
      case 'IMG': {
        const imgEl = el as HTMLImageElement
        // 处理图片占位符
        if (imgEl.alt && imgEl.alt.startsWith('&')) {
          return '\n\n' + imgEl.alt + '\n\n'
        }
        return ''
      }
      case 'BR':
        return '\n'
      case 'UL':
      case 'OL':
        // 列表作为独立段落
        return `\n\n${content.trim()}\n\n`
      case 'LI':
        // 列表项添加项目符号
        return `• ${content.trim()}\n`
      case 'BLOCKQUOTE':
        // 引用块使用 > 语法
        return `\n\n> ${content.trim()}\n\n`
      default:
        return content
    }
  }

  div.childNodes.forEach(node => {
    text += processNode(node)
  })

  // 清理多余的空行
  text = text.replace(/\n{3,}/g, '\n\n').trim()

  // 多阶段后处理
  text = mergeImageWithCaption(text)              // 第0阶段：合并图片标记和后续图注
  text = convertConsecutiveImagesToDouble(text)   // 第1阶段：合并双图
  // 注意：已禁用 fixImageCaptions，改为使用明确的冒号分隔符语法
  // text = fixImageCaptions(text)  // 第2阶段：修复图注识别（已禁用）

  return text
}
