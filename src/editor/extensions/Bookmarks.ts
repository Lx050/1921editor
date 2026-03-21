import { Extension } from '@tiptap/vue-3'

export interface Bookmark {
  id: string
  pos: number
  label: string
  createdAt: number
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    bookmarks: {
      addBookmark: (label?: string) => ReturnType
      removeBookmark: (id: string) => ReturnType
      jumpToBookmark: (id: string) => ReturnType
    }
  }
}

/**
 * Bookmarks extension: mark positions in the document for quick navigation.
 * Bookmarks are stored as metadata (not in the document schema).
 * Positions are updated on document changes via mapping.
 */
export const Bookmarks = Extension.create({
  name: 'bookmarks',

  addStorage() {
    return {
      bookmarks: [] as Bookmark[],
    }
  },

  addCommands() {
    return {
      addBookmark: (label?: string) => ({ editor, tr }) => {
        const pos = editor.state.selection.from
        const bookmark: Bookmark = {
          id: Date.now().toString(36),
          pos,
          label: label || `书签 ${this.storage.bookmarks.length + 1}`,
          createdAt: Date.now(),
        }
        this.storage.bookmarks.push(bookmark)
        return true
      },
      removeBookmark: (id: string) => () => {
        this.storage.bookmarks = this.storage.bookmarks.filter((b: Bookmark) => b.id !== id)
        return true
      },
      jumpToBookmark: (id: string) => ({ editor }) => {
        const bookmark = this.storage.bookmarks.find((b: Bookmark) => b.id === id)
        if (!bookmark) return false
        const maxPos = editor.state.doc.content.size
        const safePos = Math.min(bookmark.pos, maxPos)
        editor.chain().setTextSelection(safePos).scrollIntoView().run()
        return true
      },
    }
  },

  onTransaction({ transaction }) {
    // Map bookmark positions through document changes
    if (transaction.docChanged) {
      for (const bookmark of this.storage.bookmarks) {
        bookmark.pos = transaction.mapping.map(bookmark.pos)
      }
    }
  },
})
