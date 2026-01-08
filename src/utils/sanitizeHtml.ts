import DOMPurify from 'dompurify'

/**
 * 安全的 HTML 清理函数
 * 允许的标签：p, br, strong, em, u, span
 * 允许的属性：class, style（仅限安全的 CSS）
 * @param html - 原始 HTML 字符串
 * @returns 清理后的安全 HTML
 */
export function sanitizeHtml(html: string): string {
  if (!html || typeof html !== 'string') {
    return ''
  }

  // 配置 DOMPurify，仅允许安全的标签和属性
  const cleanHtml = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'b', 'em', 'i', 'u', 'span', 'div'],
    ALLOWED_ATTR: ['class', 'style'],
    FORBID_TAGS: ['script', 'object', 'embed', 'iframe', 'form', 'input', 'button'],
    FORBID_ATTR: ['onclick', 'onload', 'onerror', 'onmouseover', 'onfocus'],
    KEEP_CONTENT: true // 保留被禁止标签内的文本内容
  })

  return cleanHtml
}

/**
 * 用于样式预览的 HTML 清理函数
 * 允许更多标签以支持样式模板的完整显示
 * @param html - 原始 HTML 字符串
 * @returns 清理后的安全 HTML
 */
export function sanitizeHtmlForPreview(html: string): string {
  if (!html || typeof html !== 'string') {
    return ''
  }

  // 配置 DOMPurify，允许样式预览所需的标签
  const cleanHtml = DOMPurify.sanitize(html, {
    // 允许常用的结构标签
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'b', 'em', 'i', 'u', 'span', 'div',
      'section', 'article', 'header', 'footer', 'main', 'aside',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li', 'dl', 'dt', 'dd',
      'table', 'thead', 'tbody', 'tr', 'td', 'th',
      'img', 'picture',
      'svg', 'path', 'g', 'circle', 'rect', 'line', 'polygon', 'ellipse',
      'figure', 'figcaption'
    ],
    ALLOWED_ATTR: [
      'class', 'style', 'id',
      'src', 'alt', 'width', 'height',
      'viewbox', 'xmlns', 'fill', 'stroke', 'stroke-width',
      'd', 'cx', 'cy', 'r', 'x', 'y', 'x1', 'y1', 'x2', 'y2',
      'data-role', 'data-tools', 'data-id', 'data-brushtype', 'data-width',
      'data-autoskip'
    ],
    FORBID_TAGS: ['script', 'object', 'embed', 'iframe', 'form', 'input', 'button'],
    FORBID_ATTR: ['onclick', 'onload', 'onerror', 'onmouseover', 'onfocus', 'onmouseenter'],
    KEEP_CONTENT: true
  })

  return cleanHtml
}

/**
 * 安全地渲染 HTML 内容
 * 使用 v-html 时必须先用此函数清理
 * @param content - 原始内容（可能是纯文本或 HTML）
 * @returns 清理后的安全 HTML
 */
export function safeRenderHtml(content: string): string {
  if (!content || typeof content !== 'string') {
    return ''
  }

  // 转义 HTML 特殊字符，防止 XSS
  const escaped = content
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

  // 将换行符转换为 <br> 标签，保留基本格式
  const withBr = escaped.replace(/\n/g, '<br>')

  return withBr
}

/**
 * 创建一个 composable 用于安全的 HTML 渲染
 */
export function useSafeHtml() {
  return {
    sanitizeHtml,
    safeRenderHtml
  }
}