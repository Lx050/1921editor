import { Extension } from '@tiptap/vue-3'

/**
 * TextTransform extension: provides commands to transform selected text
 * - UPPERCASE, lowercase, Title Case
 */
export const TextTransform = Extension.create({
  name: 'textTransform',

  addCommands() {
    return {
      transformText: (mode: 'upper' | 'lower' | 'title') => ({ state, dispatch }) => {
        const { from, to, empty } = state.selection
        if (empty) return false

        const text = state.doc.textBetween(from, to, '\n')
        let transformed: string

        switch (mode) {
          case 'upper':
            transformed = text.toUpperCase()
            break
          case 'lower':
            transformed = text.toLowerCase()
            break
          case 'title':
            // Capitalize first letter of each word (CJK-aware: skip CJK chars)
            transformed = text.replace(
              /(?:^|\s)(\S)/g,
              (match, char) => match.replace(char, char.toUpperCase())
            )
            break
          default:
            return false
        }

        if (transformed === text) return false

        if (dispatch) {
          const tr = state.tr.insertText(transformed, from, to)
          dispatch(tr)
        }
        return true
      },
    }
  },
})
