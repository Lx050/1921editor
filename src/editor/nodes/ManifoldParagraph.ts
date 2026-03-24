import { Node, mergeAttributes } from '@tiptap/vue-3'

export const ManifoldParagraph = Node.create({
  name: 'paragraph',
  group: 'block',
  content: 'inline*',
  defining: true,

  addAttributes() {
    return {
      styleId: { default: null },
      blockRole: { default: 'body' },
      textIndent: { default: 0 },
      lineHeight: { default: null },
    }
  },

  parseHTML() {
    return [{ tag: 'p' }]
  },

  renderHTML({ node, HTMLAttributes }) {
    const indent = node.attrs.textIndent || 0
    const lh = node.attrs.lineHeight
    const styles: string[] = []
    if (indent > 0) styles.push(`text-indent: ${indent * 2}em`)
    if (lh) styles.push(`line-height: ${lh}`)
    const style = styles.join('; ')
    return ['p', mergeAttributes(HTMLAttributes, {
      'data-node-type': 'manifold-paragraph',
      'data-style-id': node.attrs.styleId || '',
      'data-role': node.attrs.blockRole || 'body',
      'data-indent': indent > 0 ? String(indent) : undefined,
      ...(style ? { style } : {}),
    }), 0]
  },

  addKeyboardShortcuts() {
    return {
      'Tab': () => {
        const { $from } = this.editor.state.selection
        if ($from.parent.type.name === this.name) {
          const current = $from.parent.attrs.textIndent || 0
          if (current < 4) {
            this.editor.commands.updateAttributes(this.name, { textIndent: current + 1 })
            return true
          }
        }
        return false
      },
      'Shift-Tab': () => {
        const { $from } = this.editor.state.selection
        if ($from.parent.type.name === this.name) {
          const current = $from.parent.attrs.textIndent || 0
          if (current > 0) {
            this.editor.commands.updateAttributes(this.name, { textIndent: current - 1 })
            return true
          }
        }
        return false
      },
    }
  },
})
