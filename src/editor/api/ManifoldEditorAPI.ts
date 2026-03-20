import type { Editor } from '@tiptap/vue-3'
import type { EditorDocument, ImageSlotData } from '@/types/editor'

/**
 * Manifold Editor API -- programmatic interface for agent/CLI operations.
 * Provides methods to manipulate the tiptap editor from external code.
 */
export class ManifoldEditorAPI {
  private editor: Editor | null = null

  attach(editor: Editor) {
    this.editor = editor
  }

  detach() {
    this.editor = null
  }

  isReady(): boolean {
    return this.editor !== null && !this.editor.isDestroyed
  }

  getDocument(): EditorDocument | null {
    return this.editor?.getJSON() as EditorDocument ?? null
  }

  getHtml(): string {
    return this.editor?.getHTML() ?? ''
  }

  getText(): string {
    return this.editor?.getText() ?? ''
  }

  getWordCount(): number {
    return this.getText().length
  }

  insertHeading(text: string, level: 1 | 2 | 3 = 1) {
    this.editor?.chain().focus().insertContent({
      type: 'manifoldHeading',
      attrs: { level },
      content: text ? [{ type: 'text', text }] : [],
    }).run()
  }

  insertParagraph(text: string, blockRole: 'body' | 'intro' | 'outro' = 'body') {
    this.editor?.chain().focus().insertContent({
      type: 'manifoldParagraph',
      attrs: { blockRole },
      content: text ? [{ type: 'text', text }] : [],
    }).run()
  }

  insertImage(src: string, caption = '') {
    this.editor?.chain().focus().insertContent({
      type: 'manifoldImage',
      attrs: { src, caption, layout: 'full_width' },
    }).run()
  }

  insertSvgTemplate(templateId: string, svgContent: string, imageSlots: Record<string, null> = {}) {
    this.editor?.chain().focus().insertContent({
      type: 'manifoldSvgBlock',
      attrs: { templateId, source: 'manifold', svgContent, imageSlots, config: {} },
    }).run()
  }

  setImageSlot(nodePos: number, slotId: string, data: ImageSlotData) {
    if (!this.editor) return
    const node = this.editor.state.doc.nodeAt(nodePos)
    if (node?.type.name === 'manifoldSvgBlock') {
      const slots = { ...(node.attrs.imageSlots || {}) }
      slots[slotId] = data
      this.editor.chain().setNodeSelection(nodePos).updateAttributes('manifoldSvgBlock', { imageSlots: slots }).run()
    }
  }

  insertHorizontalRule() {
    this.editor?.chain().focus().setHorizontalRule().run()
  }

  clearContent() {
    this.editor?.chain().clearContent().run()
  }

  setContent(doc: EditorDocument) {
    this.editor?.commands.setContent(doc)
  }

  focus() {
    this.editor?.commands.focus()
  }
}

export const manifoldEditorAPI = new ManifoldEditorAPI()
