import { Extension } from '@tiptap/vue-3'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import { Decoration, DecorationSet } from '@tiptap/pm/view'

const focusModeKey = new PluginKey('focusMode')

/**
 * FocusMode extension: adds a 'focus-active' CSS class to the top-level block
 * containing the cursor. Used in conjunction with .focus-mode CSS to dim
 * non-active blocks for distraction-free writing.
 */
export const FocusMode = Extension.create({
  name: 'focusMode',

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: focusModeKey,
        props: {
          decorations(state) {
            const { selection, doc } = state
            const { from } = selection

            // Find the top-level node containing the cursor
            const resolved = doc.resolve(from)
            if (resolved.depth < 1) return DecorationSet.empty

            // Get the top-level node position
            const topLevelPos = resolved.before(1)
            const topLevelNode = doc.nodeAt(topLevelPos)
            if (!topLevelNode) return DecorationSet.empty

            const deco = Decoration.node(topLevelPos, topLevelPos + topLevelNode.nodeSize, {
              class: 'focus-active',
            })

            return DecorationSet.create(doc, [deco])
          },
        },
      }),
    ]
  },
})
