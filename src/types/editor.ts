import type { JSONContent } from '@tiptap/vue-3'

/** Image slot definition within an SVG template */
export interface ImageSlotDef {
  id: string
  label: string
  width: number
  height: number
}

/** Filled image slot data */
export interface ImageSlotData {
  url: string
  mediaId?: string
  name?: string
}

/** SVG template with image slots */
export interface ImageDrivenSvgTemplate {
  id: string
  name: string
  category: string
  tags: string[]
  colorScheme: string
  interactive: boolean
  interactionType?: string
  source: 'manifold'
  imageSlots: ImageSlotDef[]
  svg: string
}

/** ManifoldSvgBlock node attrs */
export interface SvgBlockAttrs {
  templateId: string
  source: string
  svgContent: string
  imageSlots: Record<string, ImageSlotData | null>
  config: Record<string, unknown>
}

/** ManifoldImage node attrs */
export interface ImageBlockAttrs {
  src: string
  mediaId?: string
  caption?: string
  layout: 'full_width' | 'inline' | 'float_left' | 'float_right'
}

/** Editor document JSON (alias for tiptap JSONContent) */
export type EditorDocument = JSONContent

/** Image slot registry entry (derived from all SVG blocks) */
export interface SlotRegistryEntry {
  nodeId: string
  templateId: string
  slotId: string
  slotLabel: string
  data: ImageSlotData | null
}
