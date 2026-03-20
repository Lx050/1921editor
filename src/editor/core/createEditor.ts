import { Editor } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Dropcursor from '@tiptap/extension-dropcursor'
import { ManifoldHeading } from '../nodes/ManifoldHeading'
import { ManifoldParagraph } from '../nodes/ManifoldParagraph'
import { ManifoldImage } from '../nodes/ManifoldImage'
import { ManifoldSvgBlock } from '../nodes/ManifoldSvgBlock'
import { SlashCommand } from '../extensions/SlashCommand'
import type { EditorDocument } from '@/types/editor'

export interface CreateEditorOptions {
  content?: EditorDocument
  onUpdate?: (json: EditorDocument) => void
  editable?: boolean
}

export function createManifoldEditor(options: CreateEditorOptions = {}): Editor {
  const { content, onUpdate, editable = true } = options

  return new Editor({
    editable,
    content: content || {
      type: 'doc',
      content: [
        {
          type: 'manifoldHeading',
          attrs: { level: 1 },
          content: [{ type: 'text', text: '' }]
        }
      ]
    },
    extensions: [
      StarterKit.configure({
        heading: false,
        paragraph: false,
      }),
      ManifoldHeading,
      ManifoldParagraph,
      ManifoldImage,
      ManifoldSvgBlock,
      Placeholder.configure({
        placeholder: ({ node }) => {
          if (node.type.name === 'manifoldHeading') return '输入标题...'
          return '输入内容...'
        }
      }),
      Dropcursor.configure({ color: '#3b82f6', width: 2 }),
      SlashCommand,
    ],
    onUpdate: ({ editor }) => {
      if (onUpdate) {
        onUpdate(editor.getJSON() as EditorDocument)
      }
    }
  })
}
