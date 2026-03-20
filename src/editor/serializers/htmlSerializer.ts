import DOMPurify from 'dompurify'
import { getSvgTemplateById } from '@/styles/svgTemplates'
import type { EditorDocument, ImageSlotData } from '@/types/editor'

/**
 * Serialize tiptap JSON document to WeChat-compatible HTML.
 * Replaces SVG image slot placeholders with actual URLs.
 */
export function serializeToWechatHtml(doc: EditorDocument, header = '', footer = ''): string {
  const parts: string[] = []

  if (header) parts.push(header)

  if (doc.content) {
    for (const node of doc.content) {
      parts.push(serializeNode(node))
    }
  }

  if (footer) parts.push(footer)

  return parts.join('\n')
}

function serializeNode(node: any): string {
  switch (node.type) {
    case 'manifoldHeading':
      return serializeHeading(node)
    case 'manifoldParagraph':
      return serializeParagraph(node)
    case 'manifoldImage':
      return serializeImage(node)
    case 'manifoldSvgBlock':
      return serializeSvgBlock(node)
    case 'horizontalRule':
      return '<hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;" />'
    case 'bulletList':
    case 'orderedList':
      return serializeList(node)
    case 'listItem':
      return `<li>${serializeInlineContent(node)}</li>`
    default:
      return serializeInlineContent(node)
  }
}

function serializeHeading(node: any): string {
  const level = node.attrs?.level || 1
  const text = serializeInlineContent(node)
  return `<h${level}>${text}</h${level}>`
}

function serializeParagraph(node: any): string {
  const text = serializeInlineContent(node)
  return `<p>${text}</p>`
}

function serializeImage(node: any): string {
  const src = node.attrs?.src || ''
  const caption = node.attrs?.caption || ''
  const sanitizedSrc = DOMPurify.sanitize(src)
  if (caption) {
    return `<section style="margin: 15px 0; text-align: center;"><img src="${sanitizedSrc}" style="max-width: 100%;" /><p style="font-size: 12px; color: #999; margin-top: 5px;">${DOMPurify.sanitize(caption)}</p></section>`
  }
  return `<section style="margin: 15px 0; text-align: center;"><img src="${sanitizedSrc}" style="max-width: 100%;" /></section>`
}

function serializeSvgBlock(node: any): string {
  const templateId = node.attrs?.templateId
  const imageSlots = node.attrs?.imageSlots || {}
  let svgContent = node.attrs?.svgContent || ''

  if (!svgContent && templateId) {
    const tpl = getSvgTemplateById(templateId)
    if (tpl) svgContent = tpl.svg
  }

  for (const [slotId, data] of Object.entries(imageSlots)) {
    const slotData = data as ImageSlotData | null
    if (slotData?.url) {
      const regex = new RegExp(`(data-image-slot="${slotId}"[^>]*?)href="[^"]*"`, 'g')
      svgContent = svgContent.replace(regex, `$1href="${slotData.url}"`)
    }
  }

  return `<section class="_135editor" data-role="svg-decoration" style="margin: 15px 0; text-align: center;"><!-- Manifold SVG Engine -->${svgContent}</section>`
}

function serializeList(node: any): string {
  const tag = node.type === 'bulletList' ? 'ul' : 'ol'
  const items = (node.content || []).map((item: any) => serializeNode(item)).join('')
  return `<${tag}>${items}</${tag}>`
}

function serializeInlineContent(node: any): string {
  if (!node.content) return ''
  return node.content.map((child: any) => {
    if (child.type === 'text') {
      let text = DOMPurify.sanitize(child.text || '')
      if (child.marks) {
        for (const mark of child.marks) {
          if (mark.type === 'bold') text = `<strong>${text}</strong>`
          if (mark.type === 'italic') text = `<em>${text}</em>`
        }
      }
      return text
    }
    return ''
  }).join('')
}
