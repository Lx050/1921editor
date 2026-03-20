import type { Editor } from '@tiptap/vue-3'
import type { EditorDocument, ImageSlotData } from '@/types/editor'

/**
 * Manifold Editor API — programmatic interface for agent/CLI operations.
 * Stub implementation for Phase 1. Full implementation in Phase 7+.
 */
export class ManifoldEditorAPI {
  private editor: Editor | null = null

  attach(editor: Editor) {
    this.editor = editor
  }

  detach() {
    this.editor = null
  }

  getDocument(): EditorDocument | null {
    return this.editor?.getJSON() as EditorDocument ?? null
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
}

export const manifoldEditorAPI = new ManifoldEditorAPI()
