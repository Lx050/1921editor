<template>
  <div class="min-h-screen bg-gray-100">
    <!-- 预览头部 -->
    <div class="bg-white shadow-sm border-b p-4 sticky top-0 z-10">
      <div class="flex items-center justify-between">
        <h1 class="text-lg font-semibold text-gray-900">草稿预览</h1>
        <button
          @click="goBack"
          class="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
        >
          返回
        </button>
      </div>
    </div>

    <!-- 文章预览 -->
    <div class="max-w-2xl mx-auto p-4">
      <div class="bg-white shadow-lg rounded-lg overflow-hidden">
        <!-- 文章标题 -->
        <div v-if="article.title" class="p-6 border-b">
          <h1 class="text-2xl font-bold text-gray-900 leading-tight">{{ article.title }}</h1>
          <div v-if="article.author || article.digest" class="mt-3 text-sm text-gray-600">
            <span v-if="article.author" class="mr-4">作者：{{ article.author }}</span>
            <span v-if="article.digest">{{ article.digest }}</span>
          </div>
        </div>

        <!-- 文章内容 -->
        <div class="p-6">
          <div v-if="article.content" v-html="sanitizeHtml(article.content)" class="prose max-w-none"></div>
          <div v-else class="text-center py-12">
            <div class="text-gray-400 text-lg mb-2">无预览内容</div>
            <p class="text-gray-500">草稿内容为空或已过期</p>
          </div>
        </div>
      </div>

      <!-- 提示信息 -->
      <div class="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 class="font-semibold text-blue-900 mb-2">💡 预览说明</h3>
        <ul class="text-sm text-blue-800 space-y-1">
          <li>• 此预览为最终发布效果</li>
          <li>• 样式、排版、图片位置均与公众号显示一致</li>
          <li>• 如需修改，请返回编辑页面重新提交</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { sanitizeHtml } from '../utils/sanitizeHtml'

const router = useRouter()
const article = ref({
  title: '',
  author: '',
  digest: '',
  content: ''
})

// 返回上一页
const goBack = () => {
  router.back()
}

// 从 sessionStorage 或 URL参数 读取草稿数据
onMounted(() => {
  try {
    // 1. 尝试从 sessionStorage 读取草稿数据
    const draftId = sessionStorage.getItem('wechat_draft_id')
    const draftTitle = sessionStorage.getItem('wechat_draft_title')
    const draftAuthor = sessionStorage.getItem('wechat_draft_author')
    const draftDigest = sessionStorage.getItem('wechat_draft_digest')
    const draftContent = sessionStorage.getItem('wechat_draft_content')

    if (draftId && draftContent) {
      loadArticle(draftTitle, draftAuthor, draftDigest, draftContent)
      return
    }

    // 2. 尝试从 URL 参数读取预览数据
    const urlParams = new URLSearchParams(window.location.search)
    const previewId = urlParams.get('id')
    const data = urlParams.get('data') // 兼容旧格式

    if (previewId) {
      // 新格式：从 sessionStorage 读取预览数据
      const previewDataStr = sessionStorage.getItem(previewId)
      if (previewDataStr) {
        const previewData = JSON.parse(previewDataStr)

        // 保存到 sessionStorage，避免刷新丢失
        sessionStorage.setItem('wechat_draft_title', previewData.title)
        sessionStorage.setItem('wechat_draft_content', previewData.content)
        sessionStorage.setItem('wechat_draft_author', previewData.author || '')
        sessionStorage.setItem('wechat_draft_digest', previewData.digest || '')

        loadArticle(previewData.title, previewData.author, previewData.digest, previewData.content)
        return
      }
    } else if (data) {
      // 旧格式（兼容）：从URL Base64参数解码
      const decoded = decodeURIComponent(atob(data))
      const previewData = JSON.parse(decoded)

      // 保存到 sessionStorage，避免刷新丢失
      sessionStorage.setItem('wechat_draft_title', previewData.title)
      sessionStorage.setItem('wechat_draft_content', previewData.content)
      sessionStorage.setItem('wechat_draft_author', previewData.author || '')
      sessionStorage.setItem('wechat_draft_digest', previewData.digest || '')

      loadArticle(previewData.title, previewData.author, previewData.digest, previewData.content)
      return
    }

    // 3. 如果没有数据，显示提示
    showNoContent()

  } catch (error) {
    console.error('[Preview] 加载草稿失败:', error)
    showError()
  }
})

// 加载文章数据
const loadArticle = (title, author, digest, content) => {
  article.value = {
    title: title || '未命名文章',
    author: author || '',
    digest: digest || '',
    content: content
  }
}

// 显示无内容提示
const showNoContent = () => {
  article.value.content = `
    <div style="text-align: center; padding: 60px 20px; color: #999;">
      <p>⚠️ 预览链接已失效</p>
      <p style="margin-top: 20px; font-size: 14px;">请在编辑页面重新提交草稿后预览</p>
    </div>
  `
}

// 显示错误信息
const showError = () => {
  article.value.content = `
    <div style="text-align: center; padding: 60px 20px; color: #999;">
      <p>❌ 加载预览失败</p>
      <p style="margin-top: 20px; font-size: 14px;">请检查网络连接后重试</p>
    </div>
  `
}
</script>

<style scoped>
/* 确保文章内容样式正确显示 */
:deep(.prose) {
  max-width: 100% !important;
}

:deep(iframe) {
  max-width: 100%;
  height: auto;
}

:deep(img) {
  max-width: 100%;
  height: auto;
}
</style>
