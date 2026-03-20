import DOMPurify from 'dompurify'
import { getSvgTemplateById } from '@/styles/svgTemplates'
import { useAppStore } from '@/stores/appStore'
import { useConfigStore } from '@/stores/configStore'
import type { EditorDocument, ImageSlotData } from '@/types/editor'
import type { StyleConfig, StyleTemplate } from '@/types'

/**
 * Org-level style preset (matches styleAssembler.ts logic)
 */
interface OrgStylePreset {
  titleFontFamily: string
  titleFontSize: number
  titleBold: boolean
  bodyFontFamily: string
  bodyFontSize: number
  bodyIndent: boolean
  bodyLineHeight: number
  bodyLetterSpacing: number
  introFontFamily: string
  introFontSize: number
}

function getOrgPresetIfConfigured(): OrgStylePreset | null {
  try {
    const stored = localStorage.getItem('org_template_config')
    if (!stored) return null
    const config = JSON.parse(stored)
    if (!config.stylePreset) return null
    return {
      titleFontFamily: '\u5fae\u8f6f\u96c5\u9ed1, Microsoft YaHei, SimHei, STHeiti',
      titleFontSize: 16,
      titleBold: true,
      bodyFontFamily: '\u5fae\u8f6f\u96c5\u9ed1, Microsoft YaHei, SimHei, STHeiti',
      bodyFontSize: 14,
      bodyIndent: true,
      bodyLineHeight: 1.75,
      bodyLetterSpacing: 1.5,
      introFontFamily: '\u5fae\u8f6f\u96c5\u9ed1, Microsoft YaHei, SimHei, STHeiti',
      introFontSize: 14,
      ...config.stylePreset
    }
  } catch {
    return null
  }
}

/**
 * Serialize tiptap JSON document to WeChat-compatible HTML.
 * Integrates with configStore (header/footer) and appStore (styleConfig, metadata).
 *
 * @param doc - tiptap EditorDocument JSON
 * @param headerOverride - optional header HTML override (uses configStore.currentHeader if empty)
 * @param footerOverride - optional footer HTML override (uses configStore.currentFooter if empty)
 */
export function serializeToWechatHtml(
  doc: EditorDocument,
  headerOverride = '',
  footerOverride = ''
): string {
  const parts: string[] = []
  const configStore = useConfigStore()
  const appStore = useAppStore()

  // Header
  const header = headerOverride || configStore.currentHeader
  if (header) parts.push(header)

  // Resolve style config for text blocks
  const styleConfig = appStore.styleConfig as StyleConfig | null
  const orgPreset = getOrgPresetIfConfigured()

  // Process each node
  if (doc.content) {
    for (const node of doc.content) {
      parts.push(serializeNode(node, styleConfig, orgPreset))
    }
  }

  // Footer with placeholder substitution
  let footer = footerOverride || configStore.currentFooter
  if (footer) {
    footer = footer
      .replace(/\{\{PLANNERS\}\}/g, appStore.plannerNames.join(' ') || ' ')
      .replace(/\{\{COPYWRITERS\}\}/g, appStore.copywriterNames.join(' ') || ' ')
      .replace(/\{\{EDITORS\}\}/g, appStore.editorNames.join(' ') || ' ')
      .replace(/\{\{TEAM_NAME\}\}/g, appStore.teamName || '')
      .replace(/\{\{SOURCE_ACCOUNT\}\}/g, appStore.sourceAccount || '')
      .replace(/\{\{EDITOR_INPUT\}\}/g, appStore.editorInput || ' ')
    parts.push(footer)
  }

  return parts.join('\n')
}

function serializeNode(
  node: any,
  styleConfig: StyleConfig | null,
  orgPreset: OrgStylePreset | null
): string {
  switch (node.type) {
    case 'manifoldHeading':
      return serializeHeading(node, styleConfig, orgPreset)
    case 'manifoldParagraph':
      return serializeParagraph(node, styleConfig, orgPreset)
    case 'manifoldImage':
      return serializeImage(node)
    case 'manifoldSvgBlock':
      return serializeSvgBlock(node)
    case 'horizontalRule':
      return '<hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;" />'
    case 'blockquote':
      return serializeBlockquote(node, styleConfig, orgPreset)
    case 'bulletList':
    case 'orderedList':
      return serializeList(node, styleConfig, orgPreset)
    case 'listItem':
      return `<li>${serializeInlineContent(node)}</li>`
    default:
      return serializeInlineContent(node)
  }
}

/**
 * Apply a style template's fullExample with {{CONTENT}} placeholder.
 */
function applyStyleTemplate(
  content: string,
  template: StyleTemplate | null | undefined,
  orgPreset: OrgStylePreset | null,
  blockType: string
): string {
  // First wrap content with org font if configured
  let styledContent = content
  if (orgPreset) {
    styledContent = wrapWithOrgFont(content, blockType, orgPreset)
  }

  // If a style template is available with {{CONTENT}} placeholder, use it
  if (template?.fullExample?.includes('{{CONTENT}}')) {
    let result = template.fullExample.replace('{{CONTENT}}', styledContent)
    // Apply org block-level style (indent, line-height, letter-spacing)
    if (orgPreset && blockType === 'body') {
      result = wrapWithOrgBlockStyle(result, orgPreset)
    }
    return result
  }

  // Fallback: generate inline styled HTML
  return styledContent
}

function wrapWithOrgFont(content: string, blockType: string, preset: OrgStylePreset): string {
  let style = ''
  switch (blockType) {
    case 'title':
      style = `font-family:${preset.titleFontFamily};font-size:${preset.titleFontSize}px;`
      style += preset.titleBold ? 'font-weight:bold;' : 'font-weight:normal;'
      break
    case 'body':
      style = `font-family:${preset.bodyFontFamily};font-size:${preset.bodyFontSize}px;`
      break
    case 'intro':
    case 'outro':
      style = `font-family:${preset.introFontFamily};font-size:${preset.introFontSize}px;`
      break
  }
  if (!style) return content
  return `<span style="${style}">${content}</span>`
}

function wrapWithOrgBlockStyle(html: string, preset: OrgStylePreset): string {
  const indent = preset.bodyIndent ? 'text-indent:2em;' : 'text-indent:0;'
  const style = `${indent}line-height:${preset.bodyLineHeight};letter-spacing:${preset.bodyLetterSpacing}px;`
  return `<section style="${style}">${html}</section>`
}

function serializeHeading(
  node: any,
  styleConfig: StyleConfig | null,
  orgPreset: OrgStylePreset | null
): string {
  const text = serializeInlineContent(node)
  if (!text.trim()) return ''

  // Try to use style template
  if (styleConfig?.title) {
    return applyStyleTemplate(text, styleConfig.title, orgPreset, 'title')
  }

  // Fallback: basic heading with inline WeChat-compatible styles
  const level = node.attrs?.level || 1
  const fontSize = level === 1 ? 16 : level === 2 ? 15 : 14
  const align = node.attrs?.textAlign || 'center'
  return `<section class="_135editor" data-role="paragraph"><p style="margin: 0; font-size: ${fontSize}px; line-height: 1.75em; text-indent: 0em; text-align: ${align};" align="${align}"><span style="font-weight: bold; color: #333333; font-size: ${fontSize}px; letter-spacing: 1.5px; font-family: \u5fae\u8f6f\u96c5\u9ed1, MicrosoftYaHei;">${text}</span></p></section>`
}

function serializeParagraph(
  node: any,
  styleConfig: StyleConfig | null,
  orgPreset: OrgStylePreset | null
): string {
  const text = serializeInlineContent(node)
  if (!text.trim()) return ''

  const blockRole = node.attrs?.blockRole || 'body'

  // Determine which style template to use based on blockRole
  let template: StyleTemplate | null | undefined = null
  if (styleConfig) {
    switch (blockRole) {
      case 'intro':
      case 'outro':
        template = styleConfig.intro
        break
      case 'body':
      default:
        template = styleConfig.body
        break
    }
  }

  if (template) {
    return applyStyleTemplate(text, template, orgPreset, blockRole)
  }

  // Fallback: basic paragraph with WeChat-compatible styles
  const align = node.attrs?.textAlign || 'justify'
  const indent = align === 'center' ? '0em' : '2.21428em'
  return `<section class="_135editor" data-role="paragraph"><p style="margin: 0; font-size: 14px; line-height: 1.75em; text-indent: ${indent}; text-align: ${align};" align="${align}"><span style="font-weight: 400; color: #333333; font-size: 14px; letter-spacing: 1.5px; font-family: \u5fae\u8f6f\u96c5\u9ed1, MicrosoftYaHei;">${text}</span></p></section>`
}

function serializeImage(node: any): string {
  const src = node.attrs?.src || ''
  const caption = node.attrs?.caption || ''
  const sanitizedSrc = DOMPurify.sanitize(src)
  if (caption) {
    return `<section style="margin: 15px 0; text-align: center;"><img src="${sanitizedSrc}" style="max-width: 100%;" /><p style="font-size: 12px; color: #999; margin-top: 5px;">${DOMPurify.sanitize(caption)}</p></section>`
  }
  return `<section style="margin: 15px 0; text-align: center;"><img src="${sanitizedSrc}" style="max-width: 100%;" /></section>`
}

function serializeSvgBlock(node: any): string {
  const templateId = node.attrs?.templateId
  const imageSlots = node.attrs?.imageSlots || {}
  let svgContent = node.attrs?.svgContent || ''

  if (!svgContent && templateId) {
    const tpl = getSvgTemplateById(templateId)
    if (tpl) svgContent = tpl.svg
  }

  // Replace image slot placeholders with actual URLs
  for (const [slotId, data] of Object.entries(imageSlots)) {
    const slotData = data as ImageSlotData | null
    if (slotData?.url) {
      const regex = new RegExp(`(data-image-slot="${slotId}"[^>]*?)href="[^"]*"`, 'g')
      svgContent = svgContent.replace(regex, `$1href="${slotData.url}"`)
    }
  }

  return `<section class="_135editor" data-role="svg-decoration" style="margin: 15px 0; text-align: center;"><!-- Manifold SVG Engine -->${svgContent}</section>`
}

function serializeList(
  node: any,
  styleConfig: StyleConfig | null,
  orgPreset: OrgStylePreset | null
): string {
  const tag = node.type === 'bulletList' ? 'ul' : 'ol'
  const items = (node.content || []).map((item: any) => serializeNode(item, styleConfig, orgPreset)).join('')
  return `<${tag} style="margin: 10px 0; padding-left: 2em; font-size: 14px; line-height: 1.75em; letter-spacing: 1.5px; font-family: \u5fae\u8f6f\u96c5\u9ed1, MicrosoftYaHei;">${items}</${tag}>`
}

function serializeBlockquote(
  node: any,
  styleConfig: StyleConfig | null,
  orgPreset: OrgStylePreset | null
): string {
  const inner = (node.content || []).map((child: any) => serializeNode(child, styleConfig, orgPreset)).join('')
  return `<blockquote style="margin: 15px 0; padding: 10px 15px; border-left: 3px solid #d1d5db; color: #6b7280; font-size: 14px; line-height: 1.75em;">${inner}</blockquote>`
}

function serializeInlineContent(node: any): string {
  if (!node.content) return ''
  return node.content.map((child: any) => {
    if (child.type === 'text') {
      let text = DOMPurify.sanitize(child.text || '')
      if (child.marks) {
        for (const mark of child.marks) {
          if (mark.type === 'bold') text = `<strong>${text}</strong>`
          if (mark.type === 'italic') text = `<em>${text}</em>`
          if (mark.type === 'underline') text = `<span style="text-decoration: underline;">${text}</span>`
          if (mark.type === 'strike') text = `<span style="text-decoration: line-through;">${text}</span>`
          if (mark.type === 'link' && mark.attrs?.href) {
            text = `<a href="${DOMPurify.sanitize(mark.attrs.href)}" style="color: #576b95; text-decoration: none;">${text}</a>`
          }
          if (mark.type === 'textStyle' && mark.attrs?.color) {
            text = `<span style="color: ${mark.attrs.color};">${text}</span>`
          }
        }
      }
      return text
    }
    return ''
  }).join('')
}
