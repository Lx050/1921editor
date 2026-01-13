/**
 * 微信 API 工具函数单元测试
 */
import { describe, it, expect } from 'vitest'
import { getWechatProxyUrl, restoreWechatUrl } from '../wechatApi'

describe('getWechatProxyUrl', () => {
  it('应该将 mmbiz.qpic.cn 的 URL 转换为代理 URL', () => {
    const originalUrl = 'https://mmbiz.qpic.cn/mmbiz_png/abc123/def456?wx_fmt=png'
    const expected = '/wechat-image-proxy/mmbiz.qpic.cn/mmbiz_png/abc123/def456?wx_fmt=png'
    expect(getWechatProxyUrl(originalUrl)).toBe(expected)
  })

  it('应该将 mmecoa.qpic.cn 的 URL 转换为代理 URL', () => {
    const originalUrl = 'https://mmecoa.qpic.cn/mmbiz_jpg/xyz789?wx_fmt=jpeg'
    const expected = '/wechat-image-proxy/mmecoa.qpic.cn/mmbiz_jpg/xyz789?wx_fmt=jpeg'
    expect(getWechatProxyUrl(originalUrl)).toBe(expected)
  })

  it('应该保留查询参数', () => {
    const originalUrl = 'https://mmbiz.qpic.cn/test.png?wx_fmt=png&tp=webp'
    const expected = '/wechat-image-proxy/mmbiz.qpic.cn/test.png?wx_fmt=png&tp=webp'
    expect(getWechatProxyUrl(originalUrl)).toBe(expected)
  })

  it('应该直接返回非 qpic.cn 的 URL', () => {
    const otherUrl = 'https://example.com/image.jpg'
    expect(getWechatProxyUrl(otherUrl)).toBe(otherUrl)
  })

  it('应该直接返回已经是代理的 URL', () => {
    const proxyUrl = '/wechat-image-proxy/mmbiz.qpic.cn/test.png'
    expect(getWechatProxyUrl(proxyUrl)).toBe(proxyUrl)
  })

  it('应该直接返回 blob URL', () => {
    const blobUrl = 'blob:http://localhost/abc-123-def'
    expect(getWechatProxyUrl(blobUrl)).toBe(blobUrl)
  })

  it('应该直接返回 data URL', () => {
    const dataUrl = 'data:image/png;base64,iVBORw0KG...'
    expect(getWechatProxyUrl(dataUrl)).toBe(dataUrl)
  })

  it('应该处理空字符串', () => {
    expect(getWechatProxyUrl('')).toBe('')
  })

  it('应该处理无效 URL', () => {
    const invalidUrl = 'not-a-valid-url'
    expect(getWechatProxyUrl(invalidUrl)).toBe(invalidUrl)
  })

  it('应该处理不以 http 开头的 URL', () => {
    const relativeUrl = '/images/test.png'
    expect(getWechatProxyUrl(relativeUrl)).toBe(relativeUrl)
  })
})

describe('restoreWechatUrl', () => {
  it('应该将代理 URL 还原为原始微信 URL', () => {
    const proxyUrl = '/wechat-image-proxy/mmbiz.qpic.cn/mmbiz_png/abc123?wx_fmt=png'
    const expected = 'https://mmbiz.qpic.cn/mmbiz_png/abc123?wx_fmt=png'
    expect(restoreWechatUrl(proxyUrl)).toBe(expected)
  })

  it('应该直接返回非代理 URL', () => {
    const normalUrl = 'https://example.com/image.jpg'
    expect(restoreWechatUrl(normalUrl)).toBe(normalUrl)
  })

  it('应该直接返回原始微信 URL', () => {
    const wechatUrl = 'https://mmbiz.qpic.cn/test.png'
    expect(restoreWechatUrl(wechatUrl)).toBe(wechatUrl)
  })

  it('应该处理空字符串', () => {
    expect(restoreWechatUrl('')).toBe('')
  })

  it('应该处理部分代理 URL', () => {
    const partialProxy = '/wechat-image-proxy/test.com/image.png'
    const expected = 'https://test.com/image.png'
    expect(restoreWechatUrl(partialProxy)).toBe(expected)
  })
})

describe('URL 转换往返测试', () => {
  it('应该能正确往返转换微信 URL', () => {
    const originalUrl = 'https://mmbiz.qpic.cn/mmbiz_png/abc123/def456?wx_fmt=png'
    const proxyUrl = getWechatProxyUrl(originalUrl)
    const restoredUrl = restoreWechatUrl(proxyUrl)
    expect(restoredUrl).toBe(originalUrl)
  })

  it('往返转换非微信 URL 应保持不变', () => {
    const otherUrl = 'https://example.com/image.jpg'
    const proxyUrl = getWechatProxyUrl(otherUrl)
    const restoredUrl = restoreWechatUrl(proxyUrl)
    expect(restoredUrl).toBe(otherUrl)
  })
})
