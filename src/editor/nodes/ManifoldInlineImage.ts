import { Node, mergeAttributes } from '@tiptap/vue-3'

/**
 * ManifoldInlineImage — an inline-level image node that lives within paragraphs.
 * Unlike ManifoldImage (block-level), this renders as a block-display img
 * within the inline flow, allowing images to sit inside a text paragraph.
 *
 * Usage: insert between text runs in a paragraph. The image displays as a
 * full-width (or configured width) block within the paragraph's flow.
 */
export const ManifoldInlineImage = Node.create({
  name: 'manifoldInlineImage',

  group: 'inline',
  inline: true,
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      src: { default: '' },
      alt: { default: '' },
      width: { default: '100%' },
      mediaId: { default: '' },
    }
  },

  parseHTML() {
    return [
      { tag: 'img[data-inline-image]' },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    const width = HTMLAttributes.width || '100%'
    return [
      'img',
      mergeAttributes(HTMLAttributes, {
        'data-inline-image': '',
        'data-node-type': 'manifold-inline-image',
        style: `width:${width};display:block;margin:8px auto;border-radius:4px;max-width:100%;`,
      }),
    ]
  },

  addCommands() {
    return {
      insertInlineImage: (attrs: { src: string; mediaId?: string; alt?: string; width?: string }) => ({ chain }: any) => {
        return chain().insertContent({
          type: 'manifoldInlineImage',
          attrs,
        }).run()
      },
    }
  },
})
