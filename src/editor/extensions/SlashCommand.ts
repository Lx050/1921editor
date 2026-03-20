import { Extension } from '@tiptap/vue-3'

export interface SlashMenuItem {
  title: string
  icon: string
  command: (editor: any) => void
}

export const slashMenuItems: SlashMenuItem[] = [
  {
    title: '标题',
    icon: 'H',
    command: (editor) => editor.chain().focus().toggleNode('manifoldHeading', 'manifoldParagraph', { level: 1 }).run(),
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
    title: '图片',
    icon: 'I',
    command: (editor) => editor.chain().focus().insertContent({ type: 'manifoldImage', attrs: { src: '', layout: 'full_width' } }).run(),
  },
  {
    title: 'SVG交互模板',
    icon: 'S',
    command: () => {
      window.dispatchEvent(new CustomEvent('manifold:open-svg-panel'))
    },
  },
  {
    title: '分隔线',
    icon: '—',
    command: (editor) => editor.chain().focus().setHorizontalRule().run(),
  },
]

export const SlashCommand = Extension.create({
  name: 'slashCommand',
})
