import { Extension } from '@tiptap/vue-3'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import { Decoration, DecorationSet } from '@tiptap/pm/view'

export interface SlashMenuItem {
  title: string
  icon: string
  shortcut?: string
  command: (editor: any) => void
}

export const slashMenuItems: SlashMenuItem[] = [
  {
    title: '一级标题',
    icon: 'H1',
    shortcut: 'Ctrl+Alt+1',
    command: (editor) => editor.chain().focus().toggleNode('manifoldHeading', 'manifoldParagraph', { level: 1 }).run(),
  },
  {
    title: '二级标题',
    icon: 'H2',
    shortcut: 'Ctrl+Alt+2',
    command: (editor) => editor.chain().focus().toggleNode('manifoldHeading', 'manifoldParagraph', { level: 2 }).run(),
  },
  {
    title: '三级标题',
    icon: 'H3',
    shortcut: 'Ctrl+Alt+3',
    command: (editor) => editor.chain().focus().toggleNode('manifoldHeading', 'manifoldParagraph', { level: 3 }).run(),
  },
  {
    title: '正文',
    icon: 'P',
    command: (editor) => editor.chain().focus().setNode('manifoldParagraph', { blockRole: 'body' }).run(),
  },
  {
    title: '引言',
    icon: 'Q',
    command: (editor) => editor.chain().focus().setNode('manifoldParagraph', { blockRole: 'intro' }).run(),
  },
  {
    title: '结尾',
    icon: 'E',
    command: (editor) => editor.chain().focus().setNode('manifoldParagraph', { blockRole: 'outro' }).run(),
  },
  {
    title: '无序列表',
    icon: '\u2022',
    command: (editor) => editor.chain().focus().toggleBulletList().run(),
  },
  {
    title: '有序列表',
    icon: '1.',
    command: (editor) => editor.chain().focus().toggleOrderedList().run(),
  },
  {
    title: '引用',
    icon: '>',
    command: (editor) => editor.chain().focus().toggleBlockquote().run(),
  },
  {
    title: '提示引用',
    icon: '>+',
    command: (editor) => editor.chain().focus().toggleBlockquote().updateAttributes('blockquote', { variant: 'tip' }).run(),
  },
  {
    title: '警告引用',
    icon: '>!',
    command: (editor) => editor.chain().focus().toggleBlockquote().updateAttributes('blockquote', { variant: 'warning' }).run(),
  },
  {
    title: '高亮引用',
    icon: '>"',
    command: (editor) => editor.chain().focus().toggleBlockquote().updateAttributes('blockquote', { variant: 'quote' }).run(),
  },
  {
    title: '图片',
    icon: 'I',
    command: (editor) => editor.chain().focus().insertContent({ type: 'manifoldImage', attrs: { src: '', layout: 'full_width' } }).run(),
  },
  {
    title: 'SVG模板',
    icon: 'S',
    command: () => {
      window.dispatchEvent(new CustomEvent('manifold:open-svg-panel'))
    },
  },
  {
    title: '表格',
    icon: 'T',
    command: (editor) => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run(),
  },
  {
    title: '代码块',
    icon: '{}',
    command: (editor) => editor.chain().focus().toggleCodeBlock().run(),
  },
  {
    title: '分隔线',
    icon: '\u2015',
    command: (editor) => editor.chain().focus().setHorizontalRule().run(),
  },
  {
    title: '插入日期',
    icon: 'D',
    command: (editor) => {
      const now = new Date()
      const dateStr = `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日`
      editor.chain().focus().insertContent(dateStr).run()
    },
  },
  {
    title: '当前时间',
    icon: 'T',
    command: (editor) => {
      const now = new Date()
      const timeStr = now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
      editor.chain().focus().insertContent(timeStr).run()
    },
  },
  {
    title: '目录 (TOC)',
    icon: '#',
    command: (editor) => {
      // Scan document for headings and generate a linked TOC
      const doc = editor.state.doc
      const headings: { level: number; text: string }[] = []
      doc.descendants((node: any) => {
        if (node.type.name === 'manifoldHeading' && node.textContent.trim()) {
          headings.push({ level: node.attrs?.level || 1, text: node.textContent })
        }
      })
      if (headings.length === 0) return
      const tocLines = headings.map(h => {
        const indent = h.level > 1 ? '\u00A0\u00A0\u00A0\u00A0'.repeat(h.level - 1) : ''
        return `${indent}${h.text}`
      })
      const content: any[] = [
        { type: 'manifoldHeading', attrs: { level: 2 }, content: [{ type: 'text', text: '目录' }] },
      ]
      for (const line of tocLines) {
        content.push({
          type: 'manifoldParagraph',
          attrs: { blockRole: 'body' },
          content: [{ type: 'text', text: line }],
        })
      }
      editor.chain().focus().insertContent(content).run()
    },
  },
]

const slashPluginKey = new PluginKey('slashCommand')

/**
 * SlashCommand extension with floating menu.
 * When user types "/" at the start of an empty paragraph, shows a floating menu.
 * Uses a lightweight ProseMirror plugin + DOM rendering approach (no @tiptap/suggestion dep).
 */
export const SlashCommand = Extension.create({
  name: 'slashCommand',

  addProseMirrorPlugins() {
    const editor = this.editor
    let menuEl: HTMLElement | null = null
    let activeIndex = 0
    let filteredItems: SlashMenuItem[] = []
    let slashPos: number | null = null

    function destroyMenu() {
      if (menuEl) {
        menuEl.remove()
        menuEl = null
      }
      slashPos = null
      filteredItems = []
      activeIndex = 0
    }

    function renderMenu(view: any, query: string) {
      filteredItems = query
        ? slashMenuItems.filter(item =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.icon.toLowerCase().includes(query.toLowerCase())
        )
        : [...slashMenuItems]

      if (filteredItems.length === 0) {
        destroyMenu()
        return
      }

      activeIndex = Math.min(activeIndex, filteredItems.length - 1)

      if (!menuEl) {
        menuEl = document.createElement('div')
        menuEl.className = 'slash-command-menu'
        menuEl.style.cssText = 'position:fixed;z-index:100;background:white;border:1px solid #e5e7eb;border-radius:8px;padding:4px;box-shadow:0 4px 16px rgba(0,0,0,0.1);min-width:180px;max-height:240px;overflow-y:auto;'
        document.body.appendChild(menuEl)
      }

      // Position below cursor
      const coords = view.coordsAtPos(view.state.selection.from)
      menuEl.style.left = `${coords.left}px`
      menuEl.style.top = `${coords.bottom + 4}px`

      menuEl.innerHTML = filteredItems.map((item, i) =>
        `<div class="slash-item" data-index="${i}" style="display:flex;align-items:center;gap:8px;padding:6px 10px;border-radius:4px;cursor:pointer;font-size:13px;${i === activeIndex ? 'background:#eff6ff;color:#1d4ed8;' : 'color:#374151;'}">` +
        `<span style="width:24px;height:24px;display:flex;align-items:center;justify-content:center;border-radius:4px;background:${i === activeIndex ? '#dbeafe' : '#f3f4f6'};font-size:12px;font-weight:600;">${item.icon}</span>` +
        `<span style="flex:1;">${item.title}</span>` +
        (item.shortcut ? `<span style="font-size:10px;color:#9ca3af;font-family:monospace;">${item.shortcut}</span>` : '') +
        `</div>`
      ).join('')

      // Click handlers
      menuEl.querySelectorAll('.slash-item').forEach((el) => {
        el.addEventListener('mousedown', (e) => {
          e.preventDefault()
          const idx = parseInt((el as HTMLElement).dataset.index || '0', 10)
          executeItem(view, idx)
        })
      })
    }

    function executeItem(view: any, index: number) {
      const item = filteredItems[index]
      if (!item) return

      // Delete the "/" and query text
      if (slashPos !== null) {
        const from = slashPos
        const to = view.state.selection.from
        const tr = view.state.tr.delete(from, to)
        view.dispatch(tr)
      }

      destroyMenu()
      item.command(editor)
    }

    return [
      new Plugin({
        key: slashPluginKey,
        props: {
          handleKeyDown(view, event) {
            if (!menuEl) return false

            if (event.key === 'ArrowDown') {
              event.preventDefault()
              activeIndex = (activeIndex + 1) % filteredItems.length
              renderMenu(view, '')
              return true
            }
            if (event.key === 'ArrowUp') {
              event.preventDefault()
              activeIndex = (activeIndex - 1 + filteredItems.length) % filteredItems.length
              renderMenu(view, '')
              return true
            }
            if (event.key === 'Enter') {
              event.preventDefault()
              executeItem(view, activeIndex)
              return true
            }
            if (event.key === 'Escape') {
              destroyMenu()
              return true
            }
            return false
          },
        },
        view() {
          return {
            update(view) {
              const { state } = view
              const { selection } = state
              const { $from } = selection

              // Check if cursor is in a text block
              if (!$from.parent.isTextblock) {
                destroyMenu()
                return
              }

              const textBefore = $from.parent.textContent.slice(0, $from.parentOffset)
              const slashMatch = textBefore.match(/\/([^\s]*)$/)

              if (slashMatch) {
                slashPos = $from.pos - slashMatch[0].length
                const query = slashMatch[1] || ''
                renderMenu(view, query)
              } else {
                destroyMenu()
              }
            },
            destroy() {
              destroyMenu()
            },
          }
        },
      }),
    ]
  },
})
