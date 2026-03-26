import { Extension } from '@tiptap/vue-3'
import { Plugin, PluginKey } from '@tiptap/pm/state'

/**
 * DragHandle extension – v3.
 * Compact action pill (drag + move up/down + delete) at the top-right corner
 * of each block. Appears on hover (desktop) or tap (mobile/tablet).
 */
export const DragHandle = Extension.create({
  name: 'dragHandle',

  addProseMirrorPlugins() {
    const editorRef = this.editor
    let barEl: HTMLElement | null = null
    let currentNodePos: number | null = null
    let hideTimer: ReturnType<typeof setTimeout> | null = null
    const isTouch = typeof window !== 'undefined' && matchMedia('(pointer: coarse)').matches

    function createBar() {
      const bar = document.createElement('div')
      bar.className = 'manifold-block-bar'
      bar.style.cssText =
        'position:absolute;display:flex;align-items:center;gap:1px;' +
        'padding:2px 4px;opacity:0;transition:opacity 0.15s;z-index:20;pointer-events:none;user-select:none;' +
        'background:rgba(255,255,255,0.95);border:1px solid #e5e7eb;' +
        'border-radius:6px;font-size:12px;color:#6b7280;box-shadow:0 1px 3px rgba(0,0,0,0.08);'

      // Drag grip
      const grip = document.createElement('span')
      grip.setAttribute('draggable', 'true')
      grip.style.cssText = 'cursor:grab;padding:2px 4px;border-radius:3px;font-size:13px;line-height:1;'
      grip.textContent = '\u2630'
      grip.title = '拖拽移动'
      grip.addEventListener('mouseenter', () => { grip.style.background = '#f3f4f6' })
      grip.addEventListener('mouseleave', () => { grip.style.background = 'transparent' })

      // Move up
      const moveUp = createBtn('\u2191', '上移 (Alt+Up)', 'moveUp')
      // Move down
      const moveDown = createBtn('\u2193', '下移 (Alt+Down)', 'moveDown')
      // Separator
      const sep = document.createElement('span')
      sep.style.cssText = 'width:1px;height:16px;background:#e5e7eb;margin:0 2px;'
      // Group with above
      const groupUp = createBtn('\u229E', '合并到上方块 (Ctrl+Shift+G)', 'groupUp')
      groupUp.style.color = '#8b5cf6'
      // Ungroup
      const ungroup = createBtn('\u229F', '拆分组合', 'ungroup')
      ungroup.style.color = '#8b5cf6'
      // Separator
      const sep2 = document.createElement('span')
      sep2.style.cssText = 'width:1px;height:16px;background:#e5e7eb;margin:0 2px;'
      // Delete
      const del = createBtn('\u2715', '删除块', 'delete')
      del.style.color = '#ef4444'

      bar.appendChild(grip)
      bar.appendChild(moveUp)
      bar.appendChild(moveDown)
      bar.appendChild(sep)
      bar.appendChild(groupUp)
      bar.appendChild(ungroup)
      bar.appendChild(sep2)
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
        'cursor:pointer;border:none;background:transparent;padding:2px 5px;border-radius:3px;' +
        'font-size:13px;line-height:1;color:#6b7280;min-width:24px;min-height:24px;' +
        'display:flex;align-items:center;justify-content:center;'
      btn.addEventListener('mouseenter', () => { btn.style.background = '#f3f4f6' })
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

    function positionBar(view: any, nodePos: number) {
      const domNode = view.nodeDOM(nodePos) as HTMLElement
      if (!domNode || !barEl) return false

      const editorRect = view.dom.getBoundingClientRect()
      const nodeRect = domNode.getBoundingClientRect()

      // Position centered on the top border of the block (straddles the border line)
      const barHeight = 26 // approximate height of the bar
      const top = nodeRect.top - editorRect.top - (barHeight / 2)
      // Center horizontally within the block
      const blockLeft = nodeRect.left - editorRect.left
      const blockWidth = nodeRect.width
      barEl.style.top = `${top}px`
      barEl.style.left = `${blockLeft}px`
      barEl.style.right = 'auto'
      barEl.style.width = `${blockWidth}px`
      barEl.style.justifyContent = 'center'
      return true
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
              if (currentNodePos === 0) return
              const $pos = doc.resolve(currentNodePos)
              if ($pos.index(0) === 0) return
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
              if ($pos.index(0) >= doc.childCount - 1) return
              const nextPos = currentNodePos + node.nodeSize
              const nextNode = doc.nodeAt(nextPos)
              if (!nextNode) return
              const tr = view.state.tr
              tr.delete(currentNodePos, currentNodePos + node.nodeSize)
              const insertAt = currentNodePos + nextNode.nodeSize
              tr.insert(Math.min(insertAt, tr.doc.content.size), node)
              view.dispatch(tr)
            } else if (action === 'groupUp') {
              // Group this block with the one above it
              // Set selection into this block first, then call groupBlocks
              const tr = view.state.tr
              tr.setSelection(view.state.selection.constructor.near(tr.doc.resolve(currentNodePos + 1)))
              view.dispatch(tr)
              ;(view as any).dispatch = view.dispatch.bind(view)
              if (editorRef) {
                (editorRef.commands as any).groupBlocks('above')
              }
            } else if (action === 'ungroup') {
              const tr = view.state.tr
              tr.setSelection(view.state.selection.constructor.near(tr.doc.resolve(currentNodePos + 1)))
              view.dispatch(tr)
              if (editorRef) {
                (editorRef.commands as any).ungroupBlocks()
              }
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

          // Mouse move over editor
          const handleMouseMove = (e: MouseEvent) => {
            const pos = view.posAtCoords({ left: e.clientX, top: e.clientY })
            if (!pos) { hideBar(); return }

            const $pos = view.state.doc.resolve(pos.pos)
            if ($pos.depth < 1) { hideBar(); return }

            const nodePos = $pos.before(1)
            const node = view.state.doc.nodeAt(nodePos)
            if (!node || !node.isBlock) { hideBar(); return }

            if (positionBar(view, nodePos)) {
              showBar(nodePos)
            }
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

            if (positionBar(view, nodePos)) {
              showBar(nodePos)
              hideBar(4000)
            }
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
