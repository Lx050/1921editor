import type { ContentBlock } from '@/types'
import type { EditorDocument } from '@/types/editor'

/**
 * Convert legacy contentBlocks array to tiptap JSON document.
 * Used for backward compatibility during migration.
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
          type: 'manifoldParagraph',
          attrs: { blockRole: 'body' },
          content: block.text ? [{ type: 'text', text: block.text }] : [],
        })
        break

      case 'intro':
        content.push({
          type: 'manifoldParagraph',
          attrs: { blockRole: 'intro' },
          content: block.text ? [{ type: 'text', text: block.text }] : [],
        })
        break

      case 'outro':
        content.push({
          type: 'manifoldParagraph',
          attrs: { blockRole: 'outro' },
          content: block.text ? [{ type: 'text', text: block.text }] : [],
        })
        break

      case 'image_single':
      case 'image_single_caption':
      case 'image_double':
      case 'image_double_caption':
        content.push({
          type: 'manifoldImage',
          attrs: {
            src: (block.meta?.aiImageUrl as string) || '',
            caption: block.text || '',
            layout: 'full_width',
          },
        })
        break

      case 'svg_decoration':
        content.push({
          type: 'manifoldSvgBlock',
          attrs: {
            templateId: (block.meta?.svgTemplateId as string) || '',
            source: 'manifold',
            svgContent: (block.meta?.svgContent as string) || '',
            imageSlots: {},
            config: {},
          },
        })
        break

      default:
        content.push({
          type: 'manifoldParagraph',
          attrs: { blockRole: 'body' },
          content: block.text ? [{ type: 'text', text: block.text }] : [],
        })
    }
  }

  if (content.length === 0) {
    content.push({
      type: 'manifoldParagraph',
      content: [{ type: 'text', text: '' }],
    })
  }

  return { type: 'doc', content }
}
