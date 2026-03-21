import type { EditorDocument } from '@/types/editor'

/**
 * Parse basic Markdown text and convert to tiptap EditorDocument JSON.
 * Supports: headings, paragraphs, bold, italic, links, code, lists, blockquotes, hr, code blocks.
 */
export function markdownToTiptap(md: string): EditorDocument {
  const lines = md.split('\n')
  const content: any[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    // Code block (fenced)
    if (line.startsWith('```')) {
      const lang = line.slice(3).trim()
      const codeLines: string[] = []
      i++
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i])
        i++
      }
      i++ // skip closing ```
      content.push({
        type: 'codeBlock',
        attrs: { language: lang || null },
        content: [{ type: 'text', text: codeLines.join('\n') }],
      })
      continue
    }

    // Heading
    const headingMatch = line.match(/^(#{1,3})\s+(.+)$/)
    if (headingMatch) {
      const level = headingMatch[1].length
      content.push({
        type: 'manifoldHeading',
        attrs: { level },
        content: parseInline(headingMatch[2]),
      })
      i++
      continue
    }

    // Horizontal rule
    if (/^(-{3,}|_{3,}|\*{3,})$/.test(line.trim())) {
      content.push({ type: 'horizontalRule' })
      i++
      continue
    }

    // Blockquote
    if (line.startsWith('> ')) {
      const quoteLines: string[] = []
      while (i < lines.length && lines[i].startsWith('> ')) {
        quoteLines.push(lines[i].slice(2))
        i++
      }
      content.push({
        type: 'blockquote',
        content: quoteLines.map(ql => ({
          type: 'manifoldParagraph',
          content: parseInline(ql),
        })),
      })
      continue
    }

    // Unordered list
    if (/^[-*+]\s/.test(line)) {
      const items: any[] = []
      while (i < lines.length && /^[-*+]\s/.test(lines[i])) {
        items.push({
          type: 'listItem',
          content: [{
            type: 'manifoldParagraph',
            content: parseInline(lines[i].replace(/^[-*+]\s/, '')),
          }],
        })
        i++
      }
      content.push({ type: 'bulletList', content: items })
      continue
    }

    // Ordered list
    if (/^\d+\.\s/.test(line)) {
      const items: any[] = []
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        items.push({
          type: 'listItem',
          content: [{
            type: 'manifoldParagraph',
            content: parseInline(lines[i].replace(/^\d+\.\s/, '')),
          }],
        })
        i++
      }
      content.push({ type: 'orderedList', content: items })
      continue
    }

    // Empty line
    if (!line.trim()) {
      i++
      continue
    }

    // Regular paragraph
    content.push({
      type: 'manifoldParagraph',
      attrs: { blockRole: 'body' },
      content: parseInline(line),
    })
    i++
  }

  if (content.length === 0) {
    content.push({
      type: 'manifoldParagraph',
      content: [{ type: 'text', text: '' }],
    })
  }

  return { type: 'doc', content }
}

/**
 * Parse inline markdown syntax into tiptap text nodes with marks.
 */
function parseInline(text: string): any[] {
  const nodes: any[] = []

  // Process inline patterns: **bold**, *italic*, `code`, [link](url), ~~strike~~
  const regex = /(\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`|\[(.+?)\]\((.+?)\)|~~(.+?)~~)/g
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = regex.exec(text)) !== null) {
    // Add plain text before this match
    if (match.index > lastIndex) {
      nodes.push({ type: 'text', text: text.slice(lastIndex, match.index) })
    }

    if (match[2]) {
      // **bold**
      nodes.push({ type: 'text', text: match[2], marks: [{ type: 'bold' }] })
    } else if (match[3]) {
      // *italic*
      nodes.push({ type: 'text', text: match[3], marks: [{ type: 'italic' }] })
    } else if (match[4]) {
      // `code`
      nodes.push({ type: 'text', text: match[4], marks: [{ type: 'code' }] })
    } else if (match[5] && match[6]) {
      // [link](url)
      nodes.push({ type: 'text', text: match[5], marks: [{ type: 'link', attrs: { href: match[6] } }] })
    } else if (match[7]) {
      // ~~strike~~
      nodes.push({ type: 'text', text: match[7], marks: [{ type: 'strike' }] })
    }

    lastIndex = match.index + match[0].length
  }

  // Add remaining plain text
  if (lastIndex < text.length) {
    nodes.push({ type: 'text', text: text.slice(lastIndex) })
  }

  if (nodes.length === 0) {
    nodes.push({ type: 'text', text: text || '' })
  }

  return nodes
}
