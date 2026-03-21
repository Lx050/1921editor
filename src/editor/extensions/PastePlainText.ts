import { Extension } from '@tiptap/vue-3'

/**
 * PastePlainText extension: Ctrl+Shift+V pastes clipboard content
 * as plain text, stripping all formatting.
 */
export const PastePlainText = Extension.create({
  name: 'pastePlainText',

  addKeyboardShortcuts() {
    return {
      'Mod-Shift-v': ({ editor }) => {
        // Read plain text from clipboard and insert it
        navigator.clipboard.readText().then((text) => {
          if (text) {
            editor.chain().focus().insertContent(text).run()
          }
        }).catch(() => {
          // Clipboard API not available or denied - ignore silently
        })
        return true
      },
    }
  },
})
