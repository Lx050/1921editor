/**
 * AI Image Generation Service
 * Calls the HappyCapy AI Gateway to generate images from text prompts,
 * then uploads them to WeChat CDN for use in SVG template slots.
 */
import { uploadImage, getWechatProxyUrl } from './wechatApi'

// AI Gateway endpoint - uses Vite define injection
const AI_GATEWAY_URL = 'https://ai-gateway.happycapy.ai/api/v1'
const AI_GATEWAY_KEY = (typeof __AI_GATEWAY_KEY__ !== 'undefined' ? __AI_GATEWAY_KEY__ : '') as string

export const IMAGE_MODELS = [
  { id: 'google/gemini-3.1-flash-image-preview', name: 'Gemini Flash (快速)' },
  { id: 'google/gemini-3-pro-image-preview', name: 'Gemini Pro (高质量)' },
  { id: 'byteplus/seedream-4-5', name: 'Seedream (艺术风格)' },
] as const

export type ImageModel = typeof IMAGE_MODELS[number]['id']

export interface AiImageResult {
  url: string
  proxyUrl: string
  mediaId: string
  prompt: string
  model: string
}

/**
 * Generate an image from a text prompt via AI Gateway.
 */
export async function generateImage(
  prompt: string,
  model: ImageModel = 'google/gemini-3.1-flash-image-preview'
): Promise<{ imageData: string; format: 'b64' | 'url' }> {
  const resp = await fetch(`${AI_GATEWAY_URL}/images/generations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${AI_GATEWAY_KEY}`,
      'Origin': 'https://trickle.so',
      'User-Agent': 'Mozilla/5.0 (compatible; AI-Gateway-Client/1.0)',
    },
    body: JSON.stringify({
      model,
      prompt,
      n: 1,
      response_format: 'b64_json',
    }),
  })

  if (!resp.ok) {
    const errText = await resp.text()
    throw new Error(`AI生图失败 (${resp.status}): ${errText}`)
  }

  const data = await resp.json()
  const imageItem = data.data?.[0]

  if (imageItem?.b64_json) {
    return { imageData: `data:image/png;base64,${imageItem.b64_json}`, format: 'b64' }
  } else if (imageItem?.url) {
    return { imageData: imageItem.url, format: 'url' }
  }

  throw new Error('AI网关返回数据格式异常')
}

/**
 * Generate image and upload to WeChat CDN in one step.
 */
export async function generateAndUpload(
  prompt: string,
  model?: ImageModel
): Promise<AiImageResult> {
  const { imageData, format } = await generateImage(prompt, model)

  let file: File
  if (format === 'b64') {
    const b64 = imageData.replace(/^data:image\/\w+;base64,/, '')
    const bytes = Uint8Array.from(atob(b64), c => c.charCodeAt(0))
    const blob = new Blob([bytes], { type: 'image/png' })
    file = new File([blob], `ai-${Date.now()}.png`, { type: 'image/png' })
  } else {
    const imgResp = await fetch(imageData)
    const blob = await imgResp.blob()
    file = new File([blob], `ai-${Date.now()}.png`, { type: blob.type || 'image/png' })
  }

  // Upload to WeChat CDN
  const result = await uploadImage(file)
  const wechatUrl = result.url || ''
  const proxyUrl = wechatUrl ? getWechatProxyUrl(wechatUrl) : imageData

  return {
    url: wechatUrl || imageData,
    proxyUrl,
    mediaId: result.media_id || '',
    prompt,
    model: model || 'google/gemini-3.1-flash-image-preview',
  }
}

/**
 * Build an image generation prompt from article context.
 */
export function buildPromptFromContext(
  surroundingText: string,
  slotLabel?: string,
  style?: string
): string {
  const base = slotLabel
    ? `为"${slotLabel}"生成一张配图`
    : '生成一张文章配图'

  const styleHint = style || '现代简约风格，适合微信公众号文章'
  const textSnippet = surroundingText.slice(0, 300).replace(/\n+/g, '。')

  return `${base}。文章内容：${textSnippet}。风格：${styleHint}。要求：无文字水印，高清，16:9宽幅构图。`
}
