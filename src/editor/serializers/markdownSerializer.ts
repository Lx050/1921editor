import type { EditorDocument } from '@/types/editor'

/**
 * Serialize tiptap JSON document to Markdown format.
 * Supports headings, paragraphs, lists, blockquotes, code blocks,
 * images, tables, horizontal rules, and inline formatting.
 */
export function serializeToMarkdown(doc: EditorDocument): string {
  if (!doc.content) return ''
  return doc.content.map(node => serializeNode(node)).join('\n\n')
}

function serializeNode(node: any): string {
  switch (node.type) {
    case 'manifoldHeading': {
      const level = node.attrs?.level || 1
      const prefix = '#'.repeat(level)
      return `${prefix} ${serializeInline(node)}`
    }
    case 'paragraph':
      return serializeInline(node)
    case 'codeBlock': {
      const lang = node.attrs?.language || ''
      const code = (node.content || []).map((c: any) => c.text || '').join('')
      return '```' + lang + '\n' + code + '\n```'
    }
    case 'blockquote': {
      const inner = (node.content || []).map((c: any) => serializeNode(c)).join('\n')
      return inner.split('\n').map((line: string) => `> ${line}`).join('\n')
    }
    case 'bulletList':
      return (node.content || []).map((item: any) => serializeListItem(item, '- ')).join('\n')
    case 'orderedList':
      return (node.content || []).map((item: any, i: number) => serializeListItem(item, `${i + 1}. `)).join('\n')
    case 'horizontalRule':
      return '---'
    case 'manifoldImage': {
      const src = node.attrs?.src || ''
      const caption = node.attrs?.caption || ''
      return caption ? `![${caption}](${src})` : `![](${src})`
    }
    case 'table':
      return serializeTable(node)
    default:
      return serializeInline(node)
  }
}

function serializeListItem(node: any, prefix: string): string {
  if (!node.content) return prefix
  const parts = node.content.map((child: any) => {
    if (child.type === 'paragraph' || child.type === 'paragraph') {
      return serializeInline(child)
    }
    return serializeNode(child)
  })
  // First line gets the prefix, subsequent lines get indented
  const first = parts[0] || ''
  const rest = parts.slice(1).map((p: string) => '  ' + p)
  return [prefix + first, ...rest].join('\n')
}

function serializeTable(node: any): string {
  if (!node.content) return ''
  const rows = node.content.map((row: any) => {
    if (!row.content) return '|'
    const cells = row.content.map((cell: any) => {
      const text = cell.content
        ? cell.content.map((c: any) => serializeInline(c)).join(' ')
        : ''
      return text.replace(/\|/g, '\\|')
    })
    return '| ' + cells.join(' | ') + ' |'
  })

  if (rows.length === 0) return ''
  // Insert header separator after first row
  const firstRow = rows[0]
  const colCount = (firstRow.match(/\|/g) || []).length - 1
  const separator = '| ' + Array(colCount).fill('---').join(' | ') + ' |'
  return [rows[0], separator, ...rows.slice(1)].join('\n')
}

function serializeInline(node: any): string {
  if (!node.content) return ''
  return node.content.map((child: any) => {
    if (child.type === 'text') {
      let text = child.text || ''
      if (child.marks) {
        for (const mark of child.marks) {
          if (mark.type === 'bold') text = `**${text}**`
          if (mark.type === 'italic') text = `*${text}*`
          if (mark.type === 'strike') text = `~~${text}~~`
          if (mark.type === 'code') text = '`' + text + '`'
          if (mark.type === 'link' && mark.attrs?.href) {
            text = `[${text}](${mark.attrs.href})`
          }
          // underline, highlight, textStyle have no standard Markdown equivalent
        }
      }
      return text
    }
    if (child.type === 'hardBreak') return '  \n'
    return ''
  }).join('')
}
