/**
 * 图片存储管理模块
 * 使用 Blob URL 在内存中高效存储图片
 * 导出时按需转换为 base64
 */
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useImageStore = defineStore('images', () => {
  // imageId → { blobUrl, arrayBuffer, contentType, altText, originalName }
  const images = ref(new Map())

  /**
   * 添加图片到存储
   * @param {string} imageId - 唯一标识
   * @param {ArrayBuffer} arrayBuffer - 图片二进制数据
   * @param {string} contentType - MIME 类型 (image/png, image/jpeg 等)
   * @param {object} metadata - 附加信息 { altText, originalName }
   * @returns {string} blob URL
   */
  const addImage = (imageId, arrayBuffer, contentType, metadata = {}) => {
    // 如果已存在同 ID 的图片，先清理旧的
    if (images.value.has(imageId)) {
      removeImage(imageId)
    }

    const blob = new Blob([arrayBuffer], { type: contentType })
    const blobUrl = URL.createObjectURL(blob)

    images.value.set(imageId, {
      blobUrl,
      arrayBuffer, // 保存 arrayBuffer 供云上传使用
      contentType,
      altText: metadata.altText || '',
      originalName: metadata.originalName || ''
    })

    return blobUrl
  }

  /**
   * 获取图片的 blob URL
   */
  const getImageUrl = (imageId) => {
    const img = images.value.get(imageId)
    return img ? img.blobUrl : null
  }

  /**
   * 将 blob URL 转换为 base64 data URI（导出用）
   * @param {string} blobUrl - 要转换的 blob URL
   * @returns {Promise<string|null>} base64 data URI，若 blob URL 已失效则返回 null
   */
  const convertToBase64 = async (blobUrl) => {
    try {
      const response = await fetch(blobUrl)
      if (!response.ok) return null
      const blob = await response.blob()
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result)
        reader.onerror = reject
        reader.readAsDataURL(blob)
      })
    } catch {
      // blob URL 已被撤销或无效
      return null
    }
  }

  /**
   * 删除图片并释放 blob URL
   */
  const removeImage = (imageId) => {
    const img = images.value.get(imageId)
    if (img && img.blobUrl) {
      URL.revokeObjectURL(img.blobUrl)
    }
    images.value.delete(imageId)
  }

  /**
   * 清理全部图片
   */
  const clearAll = () => {
    for (const [, img] of images.value) {
      if (img.blobUrl) {
        URL.revokeObjectURL(img.blobUrl)
      }
    }
    images.value.clear()
  }

  /**
   * 获取存储的图片数量
   */
  const count = () => images.value.size

  return {
    images,
    addImage,
    getImageUrl,
    convertToBase64,
    removeImage,
    clearAll,
    count
  }
})
