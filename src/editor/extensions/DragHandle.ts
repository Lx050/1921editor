import { Extension } from '@tiptap/vue-3'
import { Plugin, PluginKey } from '@tiptap/pm/state'

/**
 * DragHandle extension.
 * Adds a drag handle gutter that appears on hover for block-level nodes.
 * When the handle is dragged, it initiates ProseMirror's node drag.
 */
export const DragHandle = Extension.create({
  name: 'dragHandle',

  addProseMirrorPlugins() {
    let handleEl: HTMLElement | null = null
    let currentNodePos: number | null = null

    function createHandle() {
      const el = document.createElement('div')
      el.className = 'manifold-drag-handle'
      el.setAttribute('draggable', 'true')
      el.innerHTML = '&#x2630;'
      el.style.cssText =
        'position:absolute;left:-28px;width:20px;height:20px;display:flex;align-items:center;' +
        'justify-content:center;cursor:grab;color:#d1d5db;font-size:12px;border-radius:4px;' +
        'opacity:0;transition:opacity 0.15s;z-index:10;user-select:none;'
      el.addEventListener('mouseenter', () => { el.style.color = '#6b7280'; el.style.background = '#f3f4f6' })
      el.addEventListener('mouseleave', () => { el.style.color = '#d1d5db'; el.style.background = 'transparent' })
      return el
    }

    function hideHandle() {
      if (handleEl) {
        handleEl.style.opacity = '0'
        handleEl.style.pointerEvents = 'none'
      }
      currentNodePos = null
    }

    return [
      new Plugin({
        key: new PluginKey('dragHandle'),
        view(view) {
          handleEl = createHandle()
          // Append to editor wrapper
          const editorWrapper = view.dom.parentElement
          if (editorWrapper) {
            editorWrapper.style.position = 'relative'
            editorWrapper.appendChild(handleEl)
          }

          // Handle drag start
          handleEl.addEventListener('dragstart', (e) => {
            if (currentNodePos === null) return
            const node = view.state.doc.nodeAt(currentNodePos)
            if (!node) return

            // Set the drag data so ProseMirror can handle it
            const slice = view.state.doc.slice(
              currentNodePos,
              currentNodePos + node.nodeSize
            )
            const { dom, text } = view.domSerializer?.serializeFragment?.(slice.content) ??
              { dom: document.createElement('div'), text: '' }

            // Use ProseMirror's drag handling
            view.dragging = {
              slice,
              move: true,
            }

            e.dataTransfer?.setData('text/plain', node.textContent || '')
            e.dataTransfer?.setDragImage(view.nodeDOM(currentNodePos) as HTMLElement || handleEl!, 0, 0)
          })

          // Track mouse to show handle near block nodes
          const handleMouseMove = (e: MouseEvent) => {
            const pos = view.posAtCoords({ left: e.clientX, top: e.clientY })
            if (!pos) { hideHandle(); return }

            const $pos = view.state.doc.resolve(pos.pos)
            // Find the top-level block node
            const depth = $pos.depth
            if (depth === 0) { hideHandle(); return }

            const nodePos = $pos.before(1)
            const node = view.state.doc.nodeAt(nodePos)
            if (!node) { hideHandle(); return }

            // Only show for block content nodes
            if (!node.isBlock) { hideHandle(); return }

            currentNodePos = nodePos

            // Position the handle
            const domNode = view.nodeDOM(nodePos) as HTMLElement
            if (!domNode || !handleEl) { hideHandle(); return }

            const editorRect = view.dom.getBoundingClientRect()
            const nodeRect = domNode.getBoundingClientRect()

            handleEl.style.top = `${nodeRect.top - editorRect.top + 2}px`
            handleEl.style.opacity = '1'
            handleEl.style.pointerEvents = 'auto'
          }

          view.dom.addEventListener('mousemove', handleMouseMove)
          view.dom.addEventListener('mouseleave', () => hideHandle())

          return {
            destroy() {
              view.dom.removeEventListener('mousemove', handleMouseMove)
              handleEl?.remove()
              handleEl = null
            },
          }
        },
      }),
    ]
  },
})
