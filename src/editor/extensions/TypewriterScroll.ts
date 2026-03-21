import { Extension } from '@tiptap/vue-3'
import { Plugin, PluginKey } from '@tiptap/pm/state'

const typewriterKey = new PluginKey('typewriterScroll')

/**
 * TypewriterScroll extension: keeps the cursor line vertically centered
 * in the scrollable container as the user types.
 *
 * Activated externally via a ref toggle — the plugin reads the `enabled`
 * closure variable each time the selection changes.
 */
export function createTypewriterScroll(isEnabled: () => boolean) {
  return Extension.create({
    name: 'typewriterScroll',

    addProseMirrorPlugins() {
      return [
        new Plugin({
          key: typewriterKey,
          view() {
            return {
              update(view) {
                if (!isEnabled()) return
                const { state } = view
                const { selection } = state
                const coords = view.coordsAtPos(selection.head)
                const editorDOM = view.dom.closest('.overflow-y-auto')
                if (!editorDOM) return

                const containerRect = editorDOM.getBoundingClientRect()
                const centerY = containerRect.top + containerRect.height / 2
                const offset = coords.top - centerY

                if (Math.abs(offset) > 20) {
                  editorDOM.scrollBy({ top: offset, behavior: 'smooth' })
                }
              },
            }
          },
        }),
      ]
    },
  })
}
