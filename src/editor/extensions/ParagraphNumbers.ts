import { Extension } from '@tiptap/vue-3'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import { Decoration, DecorationSet } from '@tiptap/pm/view'

const paragraphNumbersKey = new PluginKey('paragraphNumbers')

/**
 * ParagraphNumbers extension: adds paragraph/block numbers in the editor gutter.
 * Shows a small number for each top-level block node.
 */
export const ParagraphNumbers = Extension.create({
  name: 'paragraphNumbers',

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: paragraphNumbersKey,
        props: {
          decorations(state) {
            const { doc } = state
            const decos: Decoration[] = []
            let blockIndex = 0

            doc.forEach((node, offset) => {
              blockIndex++
              const widget = Decoration.widget(offset, () => {
                const el = document.createElement('span')
                el.className = 'paragraph-number'
                el.textContent = String(blockIndex)
                el.style.cssText = 'position:absolute;left:-32px;top:2px;font-size:10px;color:#d1d5db;font-family:monospace;user-select:none;pointer-events:none;width:24px;text-align:right;'
                return el
              }, { side: -1 })
              decos.push(widget)
            })

            return DecorationSet.create(doc, decos)
          },
        },
      }),
    ]
  },
})
