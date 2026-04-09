// Lazy-loaded to defer the large svgTemplates chunk until first SVG import
let _getSvgTemplateById: ((id: string) => any) | null = null
import('@/styles/svgTemplates').then((m) => { _getSvgTemplateById = m.getSvgTemplateById })
function getSvgTemplateById(id: string): any {
  return _getSvgTemplateById ? _getSvgTemplateById(id) : null
}
import type { ContentBlock } from '@/types'
import type { EditorDocument } from '@/types/editor'

/**
 * Convert legacy contentBlocks array to tiptap JSON document.
 * Used for backward compatibility during migration from Step2Curtain to Step2Editor.
 */
export function contentBlocksToTiptap(blocks: ContentBlock[]): EditorDocument {
  const content: any[] = []

  for (const block of blocks) {
    switch (block.type) {
      case 'title':
        content.push({
          type: 'manifoldHeading',
          attrs: { level: 1 },
          content: block.text ? [{ type: 'text', text: block.text }] : [],
        })
        break

      case 'body':
        content.push({
          type: 'paragraph',
          attrs: { blockRole: 'body' },
          content: block.text ? [{ type: 'text', text: block.text }] : [],
        })
        break

      case 'intro':
        content.push({
          type: 'paragraph',
          attrs: { blockRole: 'intro' },
          content: block.text ? [{ type: 'text', text: block.text }] : [],
        })
        break

      case 'outro':
        content.push({
          type: 'paragraph',
          attrs: { blockRole: 'outro' },
          content: block.text ? [{ type: 'text', text: block.text }] : [],
        })
        break

      case 'image_single':
      case 'image_single_caption':
        content.push({
          type: 'manifoldImage',
          attrs: {
            src: (block.meta?.aiImageUrl as string) || '',
            caption: block.type === 'image_single_caption' ? (block.text || '') : '',
            layout: 'full_width',
          },
        })
        break

      case 'image_double':
      case 'image_double_caption':
        // Double images: create two image nodes
        content.push({
          type: 'manifoldImage',
          attrs: {
            src: (block.meta?.aiImageUrl as string) || '',
            caption: block.type === 'image_double_caption' ? (block.text || '') : '',
            layout: 'full_width',
          },
        })
        break

      case 'svg_decoration': {
        const svgId = (block.meta?.svgTemplateId as string) || ''
        let svgContent = (block.meta?.svgContent as string) || ''
        if (!svgContent && svgId) {
          const tpl = getSvgTemplateById(svgId)
          if (tpl) svgContent = tpl.svg
        }
        content.push({
          type: 'manifoldSvgBlock',
          attrs: {
            templateId: svgId,
            source: 'manifold',
            svgContent,
            imageSlots: {},
            config: {},
          },
        })
        break
      }

      case 'svg_image_interactive': {
        // Image-driven SVG template with slots
        const svgId = (block.meta?.svgTemplateId as string) || ''
        let svgContent = (block.meta?.svgContent as string) || ''
        const tpl = svgId ? getSvgTemplateById(svgId) : null
        if (!svgContent && tpl) svgContent = tpl.svg

        // Initialize empty slots from template definition
        const imageSlots: Record<string, null> = {}
        if (tpl && (tpl as any).imageSlots) {
          for (const slot of (tpl as any).imageSlots) {
            imageSlots[slot.id] = null
          }
        }

        content.push({
          type: 'manifoldSvgBlock',
          attrs: {
            templateId: svgId,
            source: 'manifold',
            svgContent,
            imageSlots,
            config: {},
          },
        })
        break
      }

      default:
        // Unknown block types become paragraphs
        content.push({
          type: 'paragraph',
          attrs: { blockRole: 'body' },
          content: block.text ? [{ type: 'text', text: block.text }] : [],
        })
    }
  }

  if (content.length === 0) {
    content.push({
      type: 'paragraph',
      content: [{ type: 'text', text: '' }],
    })
  }

  return { type: 'doc', content }
}
