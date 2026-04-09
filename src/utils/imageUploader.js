/**
 * 图片上传服务
 * 可插拔架构：支持多种上传后端
 * 默认：base64 data URI（离线可用，无需服务器）
 *
 * 未来可扩展后端：阿里云 OSS、腾讯 COS、GitHub、SM.MS 等
 */

// 上传策略注册表
const strategies = {}
let activeStrategy = 'base64' // 默认策略

/**
 * 注册上传策略
 * @param {string} name - 策略名称
 * @param {Function} uploadFn - 异步上传函数 (arrayBuffer, contentType, filename) => url
 */
export function registerStrategy(name, uploadFn) {
  strategies[name] = uploadFn
}

/**
 * 设置当前激活的上传策略
 * @param {string} name - 策略名称
 */
export function setActiveStrategy(name) {
  if (!strategies[name]) throw new Error(`未知的上传策略: ${name}`)
  activeStrategy = name
}

/**
 * 获取当前激活的策略名称
 */
export function getActiveStrategy() {
  return activeStrategy
}

/**
 * 获取所有可用策略列表
 */
export function getStrategies() {
  return Object.keys(strategies)
}

/**
 * 上传单张图片
 * @param {ArrayBuffer} arrayBuffer - 图片二进制数据
 * @param {string} contentType - MIME 类型
 * @param {string} filename - 原始文件名
 * @returns {Promise<string>} 永久 URL
 */
export async function uploadImage(arrayBuffer, contentType, filename) {
  const strategy = strategies[activeStrategy]
  if (!strategy) throw new Error(`上传策略不可用: ${activeStrategy}`)
  return strategy(arrayBuffer, contentType, filename)
}

/**
 * 批量上传图片
 * @param {Array<{arrayBuffer, contentType, filename}>} images - 图片数组
 * @returns {Promise<Array<{ok: boolean, url?: string, error?: string, index: number}>>}
 *   每个元素对应一张图片的结果：
 *   - ok: true  → url 为上传后的永久 URL
 *   - ok: false → error 为错误信息，url 为 undefined
 */
export async function batchUpload(images) {
  const settled = await Promise.allSettled(
    images.map(img => uploadImage(img.arrayBuffer, img.contentType, img.filename))
  )
  return settled.map((result, index) => {
    if (result.status === 'fulfilled') {
      return { ok: true, url: result.value, index }
    } else {
      return { ok: false, error: result.reason?.message || String(result.reason), index }
    }
  })
}

// ==================== 内置策略 ====================

// 1. Base64 Data URI（默认策略，离线可用）
registerStrategy('base64', async (arrayBuffer, contentType) => {
  const bytes = new Uint8Array(arrayBuffer)
  let binary = ''
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return `data:${contentType};base64,${btoa(binary)}`
})

// 2. SM.MS 免费图床（需要 API Token）
registerStrategy('smms', async (arrayBuffer, contentType, filename) => {
  const token = localStorage.getItem('smms_token')
  if (!token) throw new Error('请先配置 SM.MS API Token')

  const blob = new Blob([arrayBuffer], { type: contentType })
  const formData = new FormData()
  formData.append('smfile', blob, filename || 'image.png')

  const resp = await fetch('https://sm.ms/api/v2/upload', {
    method: 'POST',
    headers: { 'Authorization': token },
    body: formData
  })

  const data = await resp.json()
  if (!data.success) throw new Error(data.message || 'SM.MS 上传失败')
  return data.data.url
})

// 3. GitHub 仓库托管（需要 Token + 仓库配置）
registerStrategy('github', async (arrayBuffer, contentType, filename) => {
  const token = localStorage.getItem('github_token')
  const repo = localStorage.getItem('github_repo') // 格式: owner/repo
  const branch = localStorage.getItem('github_branch') || 'main'
  const path = localStorage.getItem('github_path') || 'images'

  if (!token || !repo) throw new Error('请先配置 GitHub Token 和仓库信息')

  // 转换为 base64
  const bytes = new Uint8Array(arrayBuffer)
  let binary = ''
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  const base64Content = btoa(binary)

  // 生成唯一文件路径
  const filepath = `${path}/${Date.now()}_${filename || 'image.png'}`

  const resp = await fetch(`https://api.github.com/repos/${repo}/contents/${filepath}`, {
    method: 'PUT',
    headers: {
      'Authorization': `token ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message: `Upload image: ${filename}`,
      content: base64Content,
      branch
    })
  })

  const data = await resp.json()
  if (!resp.ok) throw new Error(data.message || 'GitHub 上传失败')

  // 返回 jsdelivr CDN URL 以获得更快访问速度
  return `https://cdn.jsdelivr.net/gh/${repo}@${branch}/${filepath}`
})

// 4. 自定义服务器上传（示例模板，需要配置服务器地址）
registerStrategy('custom', async (arrayBuffer, contentType, filename) => {
  const serverUrl = localStorage.getItem('custom_upload_server')
  const authToken = localStorage.getItem('custom_upload_token')

  if (!serverUrl) throw new Error('请先配置自定义服务器地址')

  const blob = new Blob([arrayBuffer], { type: contentType })
  const formData = new FormData()
  formData.append('file', blob, filename || 'image.png')

  const headers = {}
  if (authToken) headers['Authorization'] = `Bearer ${authToken}`

  const resp = await fetch(serverUrl, {
    method: 'POST',
    headers,
    body: formData
  })

  if (!resp.ok) throw new Error('自定义服务器上传失败')

  const data = await resp.json()
  return data.url
})

// 5. 微信公众号图床（通过 content-backend 代理上传到微信永久素材）
// 使用已有的 api 模块（自动注入 JWT token）
registerStrategy('wechat', async (arrayBuffer, contentType, filename) => {
  // 动态导入避免循环依赖
  const { default: api } = await import('./api')
  const { getWechatProxyUrl } = await import('./wechatApi')

  const blob = new Blob([arrayBuffer], { type: contentType })
  const formData = new FormData()
  formData.append('image', blob, filename || 'image.png')

  const response = await api.post('/wechat/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })

  const payload = response.data
  if (payload?.success === false) {
    throw new Error(payload.error || '微信图床上传失败')
  }

  const data = payload?.data || payload
  const wxUrl = data.url
  if (wxUrl) {
    return getWechatProxyUrl(wxUrl)
  }
  return `wechat-media://${data.media_id}`
})

/**
 * 检查微信授权状态（用于 ImageUploadSettings.vue）
 */
export async function checkWechatStatus() {
  try {
    const { default: api } = await import('./api')
    const resp = await api.get('/wechat/status')
    const data = resp.data
    return {
      authorized: Array.isArray(data) ? data.length > 0 : !!data.success,
      accounts: Array.isArray(data) ? data : (data.data || [])
    }
  } catch {
    return { authorized: false, accounts: [] }
  }
}
