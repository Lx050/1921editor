import { Extension } from '@tiptap/vue-3'
import { Plugin, PluginKey, TextSelection } from '@tiptap/pm/state'

/**
 * AutoPair extension: auto-closes brackets, quotes, and Chinese punctuation.
 * Typing an opening character inserts the closing one and places cursor between.
 * Typing the closing character when already present just moves cursor forward.
 * Backspace removes both characters of an empty pair.
 */

const PAIRS: Record<string, string> = {
  '(': ')',
  '[': ']',
  '{': '}',
  '\u201c': '\u201d', // ""
  '\u2018': '\u2019', // ''
  '\u300c': '\u300d', // 「」
  '\u3010': '\u3011', // 【】
  '\uff08': '\uff09', // （）
}

const SELF_PAIRS = new Set(['"', "'", '`'])

const ALL_CLOSING = new Set([
  ...Object.values(PAIRS),
  '"', "'", '`',
])

export const AutoPair = Extension.create({
  name: 'autoPair',

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('autoPair'),
        props: {
          handleTextInput(view, from, to, text) {
            const { state } = view

            // 1) Typed a closing char that already exists at cursor → skip over it
            if (ALL_CLOSING.has(text)) {
              const $pos = state.doc.resolve(from)
              const after = $pos.parent.textContent.charAt($pos.parentOffset)
              if (after === text) {
                // But for self-pairing chars, only skip if the char before is NOT the same
                // (prevents skipping when user genuinely wants to type two)
                if (SELF_PAIRS.has(text)) {
                  const before = $pos.parentOffset > 0
                    ? $pos.parent.textContent.charAt($pos.parentOffset - 1)
                    : ''
                  if (before === text) return false
                }
                const tr = state.tr.setSelection(TextSelection.create(state.doc, from + 1))
                view.dispatch(tr)
                return true
              }
            }

            // 2) Typed an opening char with a distinct closing char → auto pair
            if (PAIRS[text]) {
              const close = PAIRS[text]
              if (from !== to) {
                // Wrap selection
                const sel = state.doc.textBetween(from, to)
                let tr = state.tr.replaceWith(from, to, state.schema.text(text + sel + close))
                tr = tr.setSelection(TextSelection.create(tr.doc, from + 1, from + 1 + sel.length))
                view.dispatch(tr)
              } else {
                let tr = state.tr.insertText(text + close, from, to)
                tr = tr.setSelection(TextSelection.create(tr.doc, from + 1))
                view.dispatch(tr)
              }
              return true
            }

            // 3) Self-pairing chars (" ' `)
            if (SELF_PAIRS.has(text)) {
              const $pos = state.doc.resolve(from)
              const before = $pos.parentOffset > 0
                ? $pos.parent.textContent.charAt($pos.parentOffset - 1)
                : ''
              // Only auto-pair after whitespace, start of line, or opening bracket
              const shouldPair = !before || /[\s\(\[\{\u201c\u2018\u300c\u3010\uff08]/.test(before)
              if (shouldPair) {
                if (from !== to) {
                  const sel = state.doc.textBetween(from, to)
                  let tr = state.tr.replaceWith(from, to, state.schema.text(text + sel + text))
                  tr = tr.setSelection(TextSelection.create(tr.doc, from + 1, from + 1 + sel.length))
                  view.dispatch(tr)
                } else {
                  let tr = state.tr.insertText(text + text, from, to)
                  tr = tr.setSelection(TextSelection.create(tr.doc, from + 1))
                  view.dispatch(tr)
                }
                return true
              }
            }

            return false
          },

          handleKeyDown(view, event) {
            if (event.key !== 'Backspace') return false

            const { state } = view
            const { from, empty } = state.selection
            if (!empty || from <= 1) return false

            const $pos = state.doc.resolve(from)
            const offset = $pos.parentOffset
            if (offset === 0) return false

            const textContent = $pos.parent.textContent
            const charBefore = textContent.charAt(offset - 1)
            const charAfter = textContent.charAt(offset)

            // Check if it's a pair (including self-pairs)
            const isPair = PAIRS[charBefore] === charAfter
              || (SELF_PAIRS.has(charBefore) && charBefore === charAfter)

            if (isPair) {
              const tr = state.tr.delete(from - 1, from + 1)
              view.dispatch(tr)
              return true
            }

            return false
          },
        },
      }),
    ]
  },
})
