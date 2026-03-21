import { Extension } from '@tiptap/vue-3'

/**
 * DuplicateBlock extension: Ctrl+D duplicates the current top-level block.
 * If text is selected, duplicates the selection as text instead.
 */
export const DuplicateBlock = Extension.create({
  name: 'duplicateBlock',

  addKeyboardShortcuts() {
    return {
      'Mod-d': ({ editor }) => {
        const { state } = editor
        const { selection, doc } = state
        const { from, to, empty } = selection

        if (!empty) {
          // Duplicate selected text in place
          const selectedText = doc.textBetween(from, to, '\n')
          editor.chain().focus().insertContentAt(to, selectedText).run()
          return true
        }

        // Duplicate the top-level block containing the cursor
        const resolved = doc.resolve(from)
        if (resolved.depth < 1) return false

        const blockPos = resolved.before(1)
        const blockNode = doc.nodeAt(blockPos)
        if (!blockNode) return false

        const endPos = blockPos + blockNode.nodeSize
        const nodeJSON = blockNode.toJSON()

        editor.chain().focus().insertContentAt(endPos, nodeJSON).run()
        return true
      },
    }
  },
})
