import { Node, mergeAttributes } from '@tiptap/vue-3'

export const ManifoldParagraph = Node.create({
  name: 'manifoldParagraph',
  group: 'block',
  content: 'inline*',
  defining: true,

  addAttributes() {
    return {
      styleId: { default: null },
      blockRole: { default: 'body' },
    }
  },

  parseHTML() {
    return [{ tag: 'p' }]
  },

  renderHTML({ node, HTMLAttributes }) {
    return ['p', mergeAttributes(HTMLAttributes, {
      'data-node-type': 'manifold-paragraph',
      'data-style-id': node.attrs.styleId || '',
      'data-role': node.attrs.blockRole || 'body',
    }), 0]
  },
})
