import { Node, mergeAttributes, VueNodeViewRenderer } from '@tiptap/vue-3'
import ImageBlockView from './ImageBlockView.vue'

export const ManifoldImage = Node.create({
  name: 'manifoldImage',
  group: 'block',
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      src: { default: null },
      mediaId: { default: null },
      caption: { default: '' },
      layout: { default: 'full_width' },
      width: { default: null },
    }
  },

  parseHTML() {
    return [{
      tag: 'figure[data-node-type="manifold-image"]',
    }]
  },

  renderHTML({ HTMLAttributes }) {
    const src = HTMLAttributes.src || ''
    const caption = HTMLAttributes.caption || ''
    const width = HTMLAttributes.width
    const imgStyle = width ? `max-width:100%;width:${width}px;height:auto;` : 'max-width:100%;height:auto;'
    return ['figure', mergeAttributes({ 'data-node-type': 'manifold-image' }, HTMLAttributes),
      ['img', { src, draggable: 'false', style: imgStyle }],
      ...(caption ? [['figcaption', { style: 'font-size:12px;color:#999;text-align:center;margin-top:4px;' }, caption]] : []),
    ]
  },

  addNodeView() {
    return VueNodeViewRenderer(ImageBlockView)
  },
})
