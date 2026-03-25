import { Extension } from '@tiptap/vue-3'
import { Plugin, PluginKey } from '@tiptap/pm/state'

/**
 * DragHandle extension – v2.
 * Shows a block action bar (drag + move up/down + delete) on hover (desktop)
 * or tap (mobile/tablet). Positioned inside the block boundary for better
 * visibility and touch usability.
 */
export const DragHandle = Extension.create({
  name: 'dragHandle',

  addProseMirrorPlugins() {
    let barEl: HTMLElement | null = null
    let currentNodePos: number | null = null
    let hideTimer: ReturnType<typeof setTimeout> | null = null
    const isTouch = typeof window !== 'undefined' && matchMedia('(pointer: coarse)').matches

    function createBar() {
      const bar = document.createElement('div')
      bar.className = 'manifold-block-bar'
      bar.style.cssText =
        'position:absolute;left:0;right:0;top:-1px;height:28px;display:flex;align-items:center;gap:2px;' +
        'padding:0 6px;opacity:0;transition:opacity 0.15s;z-index:20;pointer-events:none;user-select:none;' +
        'background:linear-gradient(to bottom,rgba(249,250,251,0.95),rgba(249,250,251,0.7));' +
        'border-radius:6px 6px 0 0;font-size:12px;color:#6b7280;'

      // Drag grip
      const grip = document.createElement('span')
      grip.setAttribute('draggable', 'true')
      grip.style.cssText = 'cursor:grab;padding:2px 4px;border-radius:3px;font-size:14px;line-height:1;'
      grip.textContent = '\u2630'
      grip.title = '拖拽移动'
      grip.addEventListener('mouseenter', () => { grip.style.background = '#e5e7eb' })
      grip.addEventListener('mouseleave', () => { grip.style.background = 'transparent' })

      // Move up
      const moveUp = createBtn('\u2191', '上移 (Alt+Up)', 'moveUp')
      // Move down
      const moveDown = createBtn('\u2193', '下移 (Alt+Down)', 'moveDown')
      // Delete
      const del = createBtn('\u2715', '删除块', 'delete')
      del.style.marginLeft = 'auto'
      del.style.color = '#ef4444'

      bar.appendChild(grip)
      bar.appendChild(moveUp)
      bar.appendChild(moveDown)
      bar.appendChild(del)

      // Drag start on grip
      grip.addEventListener('dragstart', (e) => {
        if (currentNodePos === null) return
        const view = (bar as any).__view
        if (!view) return
        const node = view.state.doc.nodeAt(currentNodePos)
        if (!node) return

        const slice = view.state.doc.slice(currentNodePos, currentNodePos + node.nodeSize)
        view.dragging = { slice, move: true }
        e.dataTransfer?.setData('text/plain', node.textContent || '')
        e.dataTransfer?.setDragImage(view.nodeDOM(currentNodePos) as HTMLElement || grip, 0, 0)
      })

      return bar
    }

    function createBtn(text: string, title: string, action: string) {
      const btn = document.createElement('button')
      btn.textContent = text
      btn.title = title
      btn.dataset.action = action
      btn.style.cssText =
        'cursor:pointer;border:none;background:transparent;padding:2px 6px;border-radius:3px;' +
        'font-size:13px;line-height:1;color:#6b7280;min-width:28px;min-height:28px;' +
        'display:flex;align-items:center;justify-content:center;'
      btn.addEventListener('mouseenter', () => { btn.style.background = '#e5e7eb' })
      btn.addEventListener('mouseleave', () => { btn.style.background = 'transparent' })
      return btn
    }

    function showBar(nodePos: number) {
      if (!barEl) return
      if (hideTimer) { clearTimeout(hideTimer); hideTimer = null }
      currentNodePos = nodePos
      barEl.style.opacity = '1'
      barEl.style.pointerEvents = 'auto'
    }

    function hideBar(delay = 200) {
      if (hideTimer) clearTimeout(hideTimer)
      hideTimer = setTimeout(() => {
        if (barEl) {
          barEl.style.opacity = '0'
          barEl.style.pointerEvents = 'none'
        }
        currentNodePos = null
      }, delay)
    }

    return [
      new Plugin({
        key: new PluginKey('dragHandle'),
        view(view) {
          barEl = createBar()
          ;(barEl as any).__view = view

          const editorWrapper = view.dom.parentElement
          if (editorWrapper) {
            editorWrapper.style.position = 'relative'
            editorWrapper.appendChild(barEl)
          }

          // Handle bar button clicks
          barEl.addEventListener('mousedown', (e) => {
            const target = (e.target as HTMLElement).closest('[data-action]') as HTMLElement | null
            if (!target || currentNodePos === null) return
            e.preventDefault()
            e.stopPropagation()

            const action = target.dataset.action
            const doc = view.state.doc
            const node = doc.nodeAt(currentNodePos)
            if (!node) return

            if (action === 'moveUp') {
              // Find previous sibling
              if (currentNodePos === 0) return
              const $pos = doc.resolve(currentNodePos)
              if ($pos.index(0) === 0) return
              const prevNodePos = $pos.before(1) - (doc.nodeAt($pos.before(1) - 1) ? 0 : 0)
              // Use simpler approach: delete node, insert before previous
              const prevIndex = $pos.index(0) - 1
              let targetPos = 0
              doc.forEach((n, offset, index) => {
                if (index === prevIndex) targetPos = offset
              })
              const tr = view.state.tr
              tr.delete(currentNodePos, currentNodePos + node.nodeSize)
              tr.insert(targetPos, node)
              view.dispatch(tr)
            } else if (action === 'moveDown') {
              const $pos = doc.resolve(currentNodePos)
              const parentChildCount = doc.childCount
              if ($pos.index(0) >= parentChildCount - 1) return
              // Find next sibling
              const nextPos = currentNodePos + node.nodeSize
              const nextNode = doc.nodeAt(nextPos)
              if (!nextNode) return
              const tr = view.state.tr
              tr.delete(currentNodePos, currentNodePos + node.nodeSize)
              // After deletion, next node shifted
              const insertAt = currentNodePos + nextNode.nodeSize
              tr.insert(Math.min(insertAt, tr.doc.content.size), node)
              view.dispatch(tr)
            } else if (action === 'delete') {
              const tr = view.state.tr
              tr.delete(currentNodePos, currentNodePos + node.nodeSize)
              view.dispatch(tr)
              hideBar(0)
            }
          })

          // Keep bar visible when hovering it
          barEl.addEventListener('mouseenter', () => {
            if (hideTimer) { clearTimeout(hideTimer); hideTimer = null }
          })
          barEl.addEventListener('mouseleave', () => { hideBar(300) })

          // Mouse move over editor: find top-level block, position bar
          const handleMouseMove = (e: MouseEvent) => {
            const pos = view.posAtCoords({ left: e.clientX, top: e.clientY })
            if (!pos) { hideBar(); return }

            const $pos = view.state.doc.resolve(pos.pos)
            if ($pos.depth < 1) { hideBar(); return }

            const nodePos = $pos.before(1)
            const node = view.state.doc.nodeAt(nodePos)
            if (!node || !node.isBlock) { hideBar(); return }

            // Position bar at top of the block
            const domNode = view.nodeDOM(nodePos) as HTMLElement
            if (!domNode || !barEl) { hideBar(); return }

            const editorRect = view.dom.getBoundingClientRect()
            const nodeRect = domNode.getBoundingClientRect()

            barEl.style.top = `${nodeRect.top - editorRect.top}px`
            barEl.style.width = `${nodeRect.width}px`
            barEl.style.left = `${nodeRect.left - editorRect.left}px`
            showBar(nodePos)
          }

          // Touch: show bar on touchstart
          const handleTouch = (e: TouchEvent) => {
            const touch = e.touches[0]
            if (!touch) return
            const pos = view.posAtCoords({ left: touch.clientX, top: touch.clientY })
            if (!pos) return

            const $pos = view.state.doc.resolve(pos.pos)
            if ($pos.depth < 1) return

            const nodePos = $pos.before(1)
            const node = view.state.doc.nodeAt(nodePos)
            if (!node || !node.isBlock) return

            const domNode = view.nodeDOM(nodePos) as HTMLElement
            if (!domNode || !barEl) return

            const editorRect = view.dom.getBoundingClientRect()
            const nodeRect = domNode.getBoundingClientRect()

            barEl.style.top = `${nodeRect.top - editorRect.top}px`
            barEl.style.width = `${nodeRect.width}px`
            barEl.style.left = `${nodeRect.left - editorRect.left}px`
            showBar(nodePos)
            // Auto-hide after 4s on touch
            hideBar(4000)
          }

          view.dom.addEventListener('mousemove', handleMouseMove)
          view.dom.addEventListener('mouseleave', () => hideBar(300))
          if (isTouch) {
            view.dom.addEventListener('touchstart', handleTouch, { passive: true })
          }

          return {
            destroy() {
              view.dom.removeEventListener('mousemove', handleMouseMove)
              if (isTouch) {
                view.dom.removeEventListener('touchstart', handleTouch)
              }
              barEl?.remove()
              barEl = null
              if (hideTimer) clearTimeout(hideTimer)
            },
          }
        },
      }),
    ]
  },
})
