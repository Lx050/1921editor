import { Editor } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Dropcursor from '@tiptap/extension-dropcursor'
import Link from '@tiptap/extension-link'
import TextAlign from '@tiptap/extension-text-align'
import { Color } from '@tiptap/extension-color'
import TextStyle from '@tiptap/extension-text-style'
import Underline from '@tiptap/extension-underline'
import Highlight from '@tiptap/extension-highlight'
import Superscript from '@tiptap/extension-superscript'
import Subscript from '@tiptap/extension-subscript'
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import { ManifoldHeading } from '../nodes/ManifoldHeading'
import { ManifoldParagraph } from '../nodes/ManifoldParagraph'
import { ManifoldImage } from '../nodes/ManifoldImage'
import { ManifoldSvgBlock } from '../nodes/ManifoldSvgBlock'
import { ManifoldInlineImage } from '../nodes/ManifoldInlineImage'
import { ManifoldGroup } from '../nodes/ManifoldGroup'
import { ManifoldBlockquote } from '../nodes/ManifoldBlockquote'
import { ManifoldCodeBlock } from '../nodes/ManifoldCodeBlock'
import { SlashCommand } from '../extensions/SlashCommand'
import { FontSize } from '../extensions/FontSize'
import { DragHandle } from '../extensions/DragHandle'
import { SmartPaste } from '../extensions/SmartPaste'
import { FocusMode } from '../extensions/FocusMode'
import { ParagraphNumbers } from '../extensions/ParagraphNumbers'
import { DuplicateBlock } from '../extensions/DuplicateBlock'
import { PastePlainText } from '../extensions/PastePlainText'
import { createTypewriterScroll } from '../extensions/TypewriterScroll'
import { TextTransform } from '../extensions/TextTransform'
import { Bookmarks } from '../extensions/Bookmarks'
import { MoveBlock } from '../extensions/MoveBlock'
import { AutoPair } from '../extensions/AutoPair'
import type { EditorDocument } from '@/types/editor'

export interface CreateEditorOptions {
  content?: EditorDocument
  onUpdate?: (json: EditorDocument) => void
  editable?: boolean
  isTypewriterEnabled?: () => boolean
}

/** Migrate legacy node type names in stored JSON content */
function migrateContent(doc: any): any {
  if (!doc || typeof doc !== 'object') return doc
  if (doc.type === 'manifoldParagraph') doc.type = 'paragraph'
  if (Array.isArray(doc.content)) {
    doc.content = doc.content.map(migrateContent)
  }
  return doc
}

export function createManifoldEditor(options: CreateEditorOptions = {}): Editor {
  const { content, onUpdate, editable = true, isTypewriterEnabled = () => false } = options

  const migratedContent = content ? migrateContent(JSON.parse(JSON.stringify(content))) : null

  return new Editor({
    editable,
    content: migratedContent || {
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
        blockquote: false,
        codeBlock: false,
        dropcursor: false, // 使用下方单独配置的 Dropcursor
      }),
      ManifoldBlockquote,
      ManifoldCodeBlock,
      ManifoldHeading,
      ManifoldParagraph,
      ManifoldImage,
      ManifoldSvgBlock,
      ManifoldInlineImage,
      ManifoldGroup,
      Placeholder.configure({
        placeholder: ({ node }) => {
          if (node.type.name === 'manifoldHeading') {
            const level = node.attrs?.level || 1
            return level === 1 ? '输入标题...' : `输入 H${level} 标题...`
          }
          if (node.type.name === 'paragraph') {
            const role = node.attrs?.blockRole || 'body'
            switch (role) {
              case 'intro': return '输入引言... (/ 打开命令菜单)'
              case 'outro': return '输入结尾...'
              default: return '输入正文... (/ 打开命令菜单)'
            }
          }
          return '输入内容...'
        }
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { target: '_blank', rel: 'noopener noreferrer' },
      }),
      Underline,
      Superscript,
      Subscript,
      Highlight.configure({ multicolor: true }),
      TextStyle,
      Color,
      FontSize,
      TextAlign.configure({
        types: ['manifoldHeading', 'paragraph'],
      }),
      Table.configure({ resizable: true }),
      TableRow,
      TableCell,
      TableHeader,
      Dropcursor.configure({ color: '#3b82f6', width: 2 }),
      DragHandle,
      SmartPaste,
      FocusMode,
      ParagraphNumbers,
      DuplicateBlock,
      PastePlainText,
      createTypewriterScroll(isTypewriterEnabled),
      TextTransform,
      Bookmarks,
      MoveBlock,
      AutoPair,
      SlashCommand,
    ],
    onUpdate: ({ editor }) => {
      if (onUpdate) {
        onUpdate(editor.getJSON() as EditorDocument)
      }
    }
  })
}
