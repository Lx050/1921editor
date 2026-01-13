/**
 * 类型守卫测试
 */
import { describe, it, expect } from 'vitest'
import { isImageBlock, isTextBlock, type BlockType } from '../../types'

describe('类型守卫', () => {
  describe('isImageBlock', () => {
    it('应该正确识别图片块类型', () => {
      expect(isImageBlock('image_single')).toBe(true)
      expect(isImageBlock('image_single_caption')).toBe(true)
      expect(isImageBlock('image_double')).toBe(true)
      expect(isImageBlock('image_double_caption')).toBe(true)
    })

    it('应该正确识别非图片块类型', () => {
      expect(isImageBlock('title')).toBe(false)
      expect(isImageBlock('body')).toBe(false)
      expect(isImageBlock('intro')).toBe(false)
      expect(isImageBlock('outro')).toBe(false)
      expect(isImageBlock('container')).toBe(false)
    })
  })

  describe('isTextBlock', () => {
    it('应该正确识别文本块类型', () => {
      expect(isTextBlock('title')).toBe(true)
      expect(isTextBlock('body')).toBe(true)
      expect(isTextBlock('intro')).toBe(true)
      expect(isTextBlock('outro')).toBe(true)
      expect(isTextBlock('container')).toBe(true)
    })

    it('应该正确识别非文本块类型（图片）', () => {
      expect(isTextBlock('image_single')).toBe(false)
      expect(isTextBlock('image_single_caption')).toBe(false)
      expect(isTextBlock('image_double')).toBe(false)
      expect(isTextBlock('image_double_caption')).toBe(false)
    })

    it('所有类型应该要么是文本块要么是图片块（互斥）', () => {
      const blockTypes: BlockType[] = [
        'title',
        'body',
        'intro',
        'outro',
        'image_single',
        'image_single_caption',
        'image_double',
        'image_double_caption',
        'container'
      ]

      blockTypes.forEach((type) => {
        const isImage = isImageBlock(type)
        const isText = isTextBlock(type)

        // 每个类型要么是图片块，要么是文本块
        expect(isImage || isText).toBe(true)

        // 不能同时是两者
        expect(isImage && isText).toBe(false)
      })
    })
  })
})
