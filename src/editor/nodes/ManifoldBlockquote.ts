import Blockquote from '@tiptap/extension-blockquote'

export type BlockquoteVariant = 'default' | 'tip' | 'warning' | 'quote'

/**
 * ManifoldBlockquote: extends the default blockquote with a `variant` attribute
 * for different visual styles: default (gray), tip (green), warning (amber), quote (blue).
 */
export const ManifoldBlockquote = Blockquote.extend({
  addAttributes() {
    return {
      variant: {
        default: 'default' as BlockquoteVariant,
        parseHTML: (element) => element.getAttribute('data-variant') || 'default',
        renderHTML: (attributes) => {
          if (attributes.variant && attributes.variant !== 'default') {
            return { 'data-variant': attributes.variant }
          }
          return {}
        },
      },
    }
  },
})
