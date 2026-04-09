import { Extension } from '@tiptap/vue-3'
import { Plugin, PluginKey } from '@tiptap/pm/state'

/**
 * ReadingProgress extension: shows a thin progress bar at the top of the editor
 * indicating how far down the document the user has scrolled.
 */
export const ReadingProgress = Extension.create({
  name: 'readingProgress',

  addProseMirrorPlugins() {
    let bar: HTMLDivElement | null = null

    return [
      new Plugin({
        key: new PluginKey('readingProgress'),

        view(editorView) {
          // Create progress bar element
          bar = document.createElement('div')
          bar.className = 'manifold-reading-progress'
          bar.style.cssText =
            'position:sticky;top:0;left:0;right:0;height:2px;z-index:50;pointer-events:none;background:transparent;'
          const inner = document.createElement('div')
          inner.style.cssText =
            'height:100%;width:0%;background:linear-gradient(90deg,#3b82f6,#8b5cf6);transition:width 150ms ease-out;border-radius:0 1px 1px 0;'
          bar.appendChild(inner)

          const parent = editorView.dom.parentElement
          if (parent) {
            parent.style.position = 'relative'
            parent.insertBefore(bar, parent.firstChild)
          }

          function updateProgress() {
            if (!bar || !parent) return
            const scrollTop = parent.scrollTop
            const scrollHeight = parent.scrollHeight - parent.clientHeight
            const progress = scrollHeight > 0 ? Math.min(100, (scrollTop / scrollHeight) * 100) : 0
            const inner = bar.firstElementChild as HTMLDivElement
            if (inner) inner.style.width = `${progress}%`
          }

          parent?.addEventListener('scroll', updateProgress, { passive: true })
          updateProgress()

          return {
            update() { /* no-op on doc update */ },
            destroy() {
              parent?.removeEventListener('scroll', updateProgress)
              bar?.remove()
              bar = null
            },
          }
        },
      }),
    ]
  },
})
