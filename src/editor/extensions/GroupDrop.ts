import { Extension } from '@tiptap/vue-3'
import { Plugin, PluginKey } from '@tiptap/pm/state'

/**
 * GroupDrop extension – drag-to-merge UX.
 *
 * When dragging a block, hovering over the CENTER of another block
 * (not the top/bottom edge) causes the target to visually expand
 * with a "swallow" animation. Dropping there merges the blocks
 * into a ManifoldGroup (or appends to an existing group).
 *
 * The normal ProseMirror drop (between blocks) still works for reorder.
 * This extension only intercepts drops that land in the "merge zone".
 */
const groupDropKey = new PluginKey('groupDrop')

export const GroupDrop = Extension.create({
  name: 'groupDrop',

  addProseMirrorPlugins() {
    const editor = this.editor
    let dragSourcePos: number | null = null
    let mergeTargetEl: HTMLElement | null = null
    let mergeTargetPos: number | null = null
    let overlayEl: HTMLElement | null = null

    function createOverlay() {
      const el = document.createElement('div')
      el.className = 'manifold-merge-overlay'
      el.style.cssText =
        'position:absolute;pointer-events:none;z-index:15;' +
        'border:2px dashed #8b5cf6;border-radius:10px;' +
        'background:rgba(139,92,246,0.06);' +
        'transition:all 0.2s cubic-bezier(0.4, 0, 0.2, 1);' +
        'opacity:0;'
      return el
    }

    function showMergeHint(view: any, targetPos: number) {
      const targetDom = view.nodeDOM(targetPos) as HTMLElement
      if (!targetDom || !overlayEl) return

      const editorRect = view.dom.getBoundingClientRect()
      const targetRect = targetDom.getBoundingClientRect()

      // Expand the overlay beyond the target block to show "swallowing"
      const expand = 6
      overlayEl.style.top = `${targetRect.top - editorRect.top - expand}px`
      overlayEl.style.left = `${targetRect.left - editorRect.left - expand}px`
      overlayEl.style.width = `${targetRect.width + expand * 2}px`
      overlayEl.style.height = `${targetRect.height + expand * 2 + 40}px` // extra height to "swallow" the incoming block
      overlayEl.style.opacity = '1'

      mergeTargetEl = targetDom
      mergeTargetPos = targetPos

      // Add glow class to target
      targetDom.classList.add('merge-target-glow')
    }

    function hideMergeHint() {
      if (overlayEl) {
        overlayEl.style.opacity = '0'
        overlayEl.style.height = '0'
      }
      if (mergeTargetEl) {
        mergeTargetEl.classList.remove('merge-target-glow')
        mergeTargetEl = null
      }
      mergeTargetPos = null
    }

    return [
      new Plugin({
        key: groupDropKey,
        view(view) {
          overlayEl = createOverlay()
          const wrapper = view.dom.parentElement
          if (wrapper) {
            wrapper.style.position = 'relative'
            wrapper.appendChild(overlayEl)
          }

          return {
            destroy() {
              overlayEl?.remove()
              overlayEl = null
            },
          }
        },
        props: {
          handleDOMEvents: {
            dragstart(view, event) {
              // Record source block position
              const pos = view.posAtCoords({
                left: (event as DragEvent).clientX,
                top: (event as DragEvent).clientY,
              })
              if (pos) {
                const $pos = view.state.doc.resolve(pos.pos)
                if ($pos.depth >= 1) {
                  dragSourcePos = $pos.before(1)
                }
              }
              return false // don't prevent default
            },

            dragover(view, event) {
              if (dragSourcePos === null) return false
              const e = event as DragEvent

              const pos = view.posAtCoords({ left: e.clientX, top: e.clientY })
              if (!pos) { hideMergeHint(); return false }

              const $pos = view.state.doc.resolve(pos.pos)
              if ($pos.depth < 1) { hideMergeHint(); return false }

              const targetPos = $pos.before(1)
              const targetNode = view.state.doc.nodeAt(targetPos)
              if (!targetNode || !targetNode.isBlock) { hideMergeHint(); return false }

              // Don't merge with self
              if (targetPos === dragSourcePos) { hideMergeHint(); return false }

              // Check if cursor is in the CENTER zone of the target block
              // (not top 25% or bottom 25%, which means normal reorder)
              const targetDom = view.nodeDOM(targetPos) as HTMLElement
              if (!targetDom) { hideMergeHint(); return false }

              const rect = targetDom.getBoundingClientRect()
              const relativeY = e.clientY - rect.top
              const ratio = relativeY / rect.height

              // Center 50% of the block = merge zone
              if (ratio > 0.25 && ratio < 0.75) {
                showMergeHint(view, targetPos)
                // We DON'T prevent default here - let ProseMirror's dropcursor
                // still show. We'll intercept on drop.
              } else {
                hideMergeHint()
              }

              return false
            },

            dragleave(_view, _event) {
              // Small delay before hiding to avoid flicker
              setTimeout(() => {
                if (!mergeTargetEl) return
                hideMergeHint()
              }, 100)
              return false
            },

            drop(view, event) {
              const e = event as DragEvent

              // Only intercept if we have a merge target active
              if (mergeTargetPos === null || dragSourcePos === null) {
                dragSourcePos = null
                hideMergeHint()
                return false
              }

              // Verify cursor is still in merge zone
              const pos = view.posAtCoords({ left: e.clientX, top: e.clientY })
              if (!pos) {
                dragSourcePos = null
                hideMergeHint()
                return false
              }

              const $pos = view.state.doc.resolve(pos.pos)
              if ($pos.depth < 1) {
                dragSourcePos = null
                hideMergeHint()
                return false
              }

              const dropTargetPos = $pos.before(1)
              const targetDom = view.nodeDOM(dropTargetPos) as HTMLElement
              if (!targetDom) {
                dragSourcePos = null
                hideMergeHint()
                return false
              }

              const rect = targetDom.getBoundingClientRect()
              const relativeY = e.clientY - rect.top
              const ratio = relativeY / rect.height

              if (ratio <= 0.25 || ratio >= 0.75) {
                // Not in merge zone - let normal drop handle it
                dragSourcePos = null
                hideMergeHint()
                return false
              }

              // MERGE: prevent default ProseMirror drop
              e.preventDefault()
              e.stopPropagation()

              const srcPos = dragSourcePos
              const tgtPos = dropTargetPos
              dragSourcePos = null
              hideMergeHint()

              // Perform the merge via transaction
              const doc = view.state.doc
              const srcNode = doc.nodeAt(srcPos)
              const tgtNode = doc.nodeAt(tgtPos)
              if (!srcNode || !tgtNode) return true

              const schema = view.state.schema
              const groupType = schema.nodes.manifoldGroup
              if (!groupType) return true

              const tr = view.state.tr

              // Determine which comes first in the document
              const firstPos = Math.min(srcPos, tgtPos)
              const secondPos = Math.max(srcPos, tgtPos)
              const firstNode = doc.nodeAt(firstPos)!
              const secondNode = doc.nodeAt(secondPos)!

              // Collect children for the group
              const children: any[] = []

              function collectChildren(node: any) {
                if (node.type.name === 'manifoldGroup') {
                  node.forEach((child: any) => children.push(child))
                } else {
                  children.push(node)
                }
              }

              collectChildren(firstNode)
              collectChildren(secondNode)

              const groupNode = groupType.create({ role: 'body' }, children)
              const endPos = secondPos + secondNode.nodeSize

              tr.replaceWith(firstPos, endPos, groupNode)
              view.dispatch(tr)

              return true // we handled it
            },

            dragend(_view, _event) {
              dragSourcePos = null
              hideMergeHint()
              return false
            },
          },
        },
      }),
    ]
  },
})
