import { Node, mergeAttributes } from '@tiptap/vue-3'

/**
 * ManifoldGroup — a container node that groups multiple blocks
 * (paragraphs, images, headings) into a single visual unit with
 * a shared border/decoration.
 *
 * Created by dragging one block into another block's boundary.
 * All children share a single "paragraph frame" visually.
 */
export const ManifoldGroup = Node.create({
  name: 'manifoldGroup',
  group: 'block',
  content: 'block+',
  defining: true,
  draggable: true,

  addAttributes() {
    return {
      role: {
        default: 'body',
        parseHTML: (el: HTMLElement) => el.getAttribute('data-group-role') || 'body',
      },
    }
  },

  parseHTML() {
    return [
      { tag: 'div[data-node-type="manifold-group"]' },
    ]
  },

  renderHTML({ node, HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        'data-node-type': 'manifold-group',
        'data-group-role': node.attrs.role || 'body',
        'data-drag-handle': '',
      }),
      0, // content hole
    ]
  },

  addCommands() {
    return {
      /**
       * Wrap the current block and an adjacent block into a group.
       * direction: 'above' merges with the block above, 'below' with the block below.
       */
      groupBlocks: (direction: 'above' | 'below') => ({ state, dispatch }: any) => {
        const { selection, doc } = state
        const $from = doc.resolve(selection.from)
        if ($from.depth < 1) return false

        const currentIndex = $from.index(0)
        const currentPos = $from.before(1)
        const currentNode = doc.child(currentIndex)

        let targetIndex: number
        if (direction === 'above') {
          targetIndex = currentIndex - 1
          if (targetIndex < 0) return false
        } else {
          targetIndex = currentIndex + 1
          if (targetIndex >= doc.childCount) return false
        }

        const targetNode = doc.child(targetIndex)

        if (!dispatch) return true

        const tr = state.tr

        // Determine positions
        let firstIndex: number, secondIndex: number
        if (direction === 'above') {
          firstIndex = targetIndex
          secondIndex = currentIndex
        } else {
          firstIndex = currentIndex
          secondIndex = targetIndex
        }

        const firstNode = doc.child(firstIndex)
        const secondNode = doc.child(secondIndex)

        // Calculate positions of both nodes
        let firstPos = 0
        for (let i = 0; i < firstIndex; i++) {
          firstPos += doc.child(i).nodeSize
        }
        const secondPos = firstPos + firstNode.nodeSize

        // If first node is already a group, just append into it
        if (firstNode.type.name === 'manifoldGroup') {
          // Insert second node's content at end of group
          const insertPos = firstPos + firstNode.nodeSize - 1 // before closing tag
          tr.insert(insertPos, secondNode)
          // Delete the second node from its original position (which shifted by the insert)
          const newSecondPos = secondPos + secondNode.nodeSize
          // Actually, simpler: delete second first, then insert
          // Let's redo with a different approach
        }

        // Simple approach: delete both nodes, insert a group containing them
        const endPos = secondPos + secondNode.nodeSize

        // Build group content
        let groupContent: any[]
        if (firstNode.type.name === 'manifoldGroup') {
          // Merge into existing group: unwrap first group's children + second node
          groupContent = []
          firstNode.forEach((child: any) => groupContent.push(child))
          if (secondNode.type.name === 'manifoldGroup') {
            secondNode.forEach((child: any) => groupContent.push(child))
          } else {
            groupContent.push(secondNode)
          }
        } else if (secondNode.type.name === 'manifoldGroup') {
          // Merge current into existing group
          groupContent = [firstNode]
          secondNode.forEach((child: any) => groupContent.push(child))
        } else {
          // Both are regular blocks
          groupContent = [firstNode, secondNode]
        }

        const groupNode = state.schema.nodes.manifoldGroup.create(
          { role: 'body' },
          groupContent,
        )

        tr.replaceWith(firstPos, endPos, groupNode)
        dispatch(tr)
        return true
      },

      /**
       * Ungroup: unwrap a group node back into individual blocks.
       */
      ungroupBlocks: () => ({ state, dispatch }: any) => {
        const { selection, doc } = state
        const $from = doc.resolve(selection.from)

        // Find the manifoldGroup ancestor
        for (let d = $from.depth; d >= 1; d--) {
          const node = $from.node(d)
          if (node.type.name === 'manifoldGroup') {
            if (!dispatch) return true
            const pos = $from.before(d)
            const tr = state.tr
            const children: any[] = []
            node.forEach((child: any) => children.push(child))
            tr.replaceWith(pos, pos + node.nodeSize, children)
            dispatch(tr)
            return true
          }
        }
        return false
      },
    }
  },

  addKeyboardShortcuts() {
    return {
      // Mod+Shift+G: group current block with block above
      'Mod-Shift-g': () => {
        return (this.editor.commands as any).groupBlocks('above')
      },
      // Mod+Shift+U: ungroup
      'Mod-Shift-u': () => {
        return (this.editor.commands as any).ungroupBlocks()
      },
    }
  },
})
