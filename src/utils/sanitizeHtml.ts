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
    ALLOWED_CSS_PROPERTIES: [
      'color', 'background-color', 'font-size', 'font-weight',
      'font-style', 'text-decoration', 'text-align', 'margin',
      'padding', 'border', 'display'
    ],
    FORBID_SCRIPT: true,
    FORBID_TAGS: ['script', 'object', 'embed', 'iframe', 'form', 'input', 'button'],
    FORBID_ATTR: ['onclick', 'onload', 'onerror', 'onmouseover', 'onfocus'],
    KEEP_CONTENT: true // 保留被禁止标签内的文本内容
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