import { Extension } from '@tiptap/vue-3'

/**
 * MoveBlock extension: Alt+Up/Down moves the current block up or down.
 * Works with paragraphs, headings, and other top-level blocks.
 */
export const MoveBlock = Extension.create({
  name: 'moveBlock',

  addKeyboardShortcuts() {
    return {
      'Alt-ArrowUp': ({ editor }) => {
        const { state, dispatch } = editor.view
        const { selection, doc, tr } = state
        const $pos = selection.$from

        // Find the current top-level node
        const depth = $pos.depth
        if (depth === 0) return false

        const parentPos = $pos.before(1)
        const parentNode = doc.nodeAt(parentPos)
        if (!parentNode) return false

        // Can't move up if it's the first node
        if (parentPos === 0) return false

        // Find the node before this one
        const $parentPos = doc.resolve(parentPos)
        const indexInParent = $parentPos.index(0)
        if (indexInParent === 0) return false

        const prevNodePos = $parentPos.posAtIndex(indexInParent - 1, 0)
        const prevNode = doc.nodeAt(prevNodePos)
        if (!prevNode) return false

        // Swap: delete current node, insert before previous node
        const currentEnd = parentPos + parentNode.nodeSize
        const currentSlice = doc.slice(parentPos, currentEnd)

        const newTr = tr
          .delete(parentPos, currentEnd)
          .insert(prevNodePos, currentSlice.content)

        dispatch(newTr)

        // Restore cursor position in moved node
        editor.commands.setTextSelection(prevNodePos + 1)
        return true
      },

      'Alt-ArrowDown': ({ editor }) => {
        const { state, dispatch } = editor.view
        const { selection, doc, tr } = state
        const $pos = selection.$from

        const depth = $pos.depth
        if (depth === 0) return false

        const parentPos = $pos.before(1)
        const parentNode = doc.nodeAt(parentPos)
        if (!parentNode) return false

        const currentEnd = parentPos + parentNode.nodeSize

        // Can't move down if it's the last node
        if (currentEnd >= doc.content.size) return false

        const nextNode = doc.nodeAt(currentEnd)
        if (!nextNode) return false

        const nextEnd = currentEnd + nextNode.nodeSize

        // Swap: delete next node, insert before current node
        const nextSlice = doc.slice(currentEnd, nextEnd)

        const newTr = tr
          .delete(currentEnd, nextEnd)
          .insert(parentPos, nextSlice.content)

        dispatch(newTr)

        // Restore cursor at new position (moved down by next node's size)
        editor.commands.setTextSelection(parentPos + nextNode.nodeSize + 1)
        return true
      },
    }
  },
})
