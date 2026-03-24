import { Node, mergeAttributes } from '@tiptap/vue-3'

export const ManifoldHeading = Node.create({
  name: 'manifoldHeading',
  group: 'block',
  content: 'inline*',
  defining: true,

  addAttributes() {
    return {
      level: { default: 1, parseHTML: (el: HTMLElement) => parseInt(el.tagName.replace('H', ''), 10) || 1 },
      styleId: { default: null },
    }
  },

  parseHTML() {
    return [1, 2, 3].map(level => ({
      tag: `h${level}`,
      attrs: { level },
    }))
  },

  renderHTML({ node, HTMLAttributes }) {
    const level = node.attrs.level || 1
    return [`h${level}`, mergeAttributes(HTMLAttributes, {
      'data-node-type': 'manifold-heading',
      'data-style-id': node.attrs.styleId || '',
    }), 0]
  },

  addKeyboardShortcuts() {
    return {
      'Mod-Alt-1': () => this.editor.commands.toggleNode(this.name, 'paragraph', { level: 1 }),
      'Mod-Alt-2': () => this.editor.commands.toggleNode(this.name, 'paragraph', { level: 2 }),
      'Mod-Alt-3': () => this.editor.commands.toggleNode(this.name, 'paragraph', { level: 3 }),
    }
  },
})
