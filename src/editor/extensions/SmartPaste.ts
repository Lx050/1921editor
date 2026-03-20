import { Extension } from '@tiptap/vue-3'
import { Plugin, PluginKey } from '@tiptap/pm/state'

/**
 * SmartPaste extension.
 * When pasting HTML content from external sources (Word, web pages, etc.),
 * strips excessive inline styles while preserving structural elements
 * (bold, italic, links, headings, lists).
 *
 * Preserves:
 * - Structural marks: bold, italic, underline, strikethrough, links
 * - Block structure: paragraphs, headings, lists, blockquotes
 * - Images
 *
 * Strips:
 * - Font family declarations (we use our own)
 * - Background colors on text (unless it's a highlight)
 * - Excessive spacing/margin styles
 * - MSO-specific styles (Word)
 * - Class names and IDs
 */
export const SmartPaste = Extension.create({
  name: 'smartPaste',

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('smartPaste'),
        props: {
          transformPastedHTML(html: string): string {
            // Remove MSO-specific stuff
            let cleaned = html
              .replace(/<!--\[if[\s\S]*?\]>[\s\S]*?<!\[endif\]-->/gi, '')
              .replace(/<!--[\s\S]*?-->/g, '')
              .replace(/<o:p[\s\S]*?<\/o:p>/gi, '')
              .replace(/class="[^"]*"/gi, '')
              .replace(/id="[^"]*"/gi, '')

            // Clean up inline styles: keep only structural styling
            cleaned = cleaned.replace(/style="([^"]*)"/gi, (match, styles: string) => {
              const kept: string[] = []
              const styleList = styles.split(';').map((s: string) => s.trim()).filter(Boolean)

              for (const style of styleList) {
                const [prop] = style.split(':').map((s: string) => s.trim())
                const propLower = prop.toLowerCase()

                // Keep structural styles
                if (
                  propLower === 'font-weight' ||
                  propLower === 'font-style' ||
                  propLower === 'text-decoration' ||
                  propLower === 'text-align' ||
                  propLower === 'text-indent'
                ) {
                  kept.push(style)
                }
              }

              return kept.length ? `style="${kept.join('; ')}"` : ''
            })

            // Remove empty spans
            cleaned = cleaned.replace(/<span\s*>\s*([\s\S]*?)\s*<\/span>/gi, '$1')

            // Remove empty divs that wrap content
            cleaned = cleaned.replace(/<div\s*>\s*([\s\S]*?)\s*<\/div>/gi, '<p>$1</p>')

            return cleaned
          },
        },
      }),
    ]
  },
})
