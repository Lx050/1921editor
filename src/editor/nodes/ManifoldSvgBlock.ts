import { Node, mergeAttributes, VueNodeViewRenderer } from '@tiptap/vue-3'
import SvgBlockView from './SvgBlockView.vue'

export const ManifoldSvgBlock = Node.create({
  name: 'manifoldSvgBlock',
  group: 'block',
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      templateId: { default: '' },
      source: { default: 'manifold' },
      svgContent: { default: '' },
      imageSlots: { default: {} },
      config: { default: {} },
    }
  },

  parseHTML() {
    return [{
      tag: 'section[data-node-type="manifold-svg-block"]',
    }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['section', mergeAttributes({
      'data-node-type': 'manifold-svg-block',
      'data-template-id': HTMLAttributes.templateId || '',
    })]
  },

  addNodeView() {
    return VueNodeViewRenderer(SvgBlockView)
  },
})
