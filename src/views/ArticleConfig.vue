<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-3xl mx-auto w-full">
      <!-- Loading State -->
      <div v-if="loading" class="text-center">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p class="mt-4 text-gray-600">加载中...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-white shadow rounded-lg p-6">
        <div class="text-center text-red-600">
          <svg class="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <h3 class="mt-2 text-lg font-medium">加载失败</h3>
          <p class="mt-1 text-sm">{{ error }}</p>
          <button @click="router.push('/')" class="mt-4 text-blue-600 hover:text-blue-800">返回首页</button>
        </div>
      </div>

      <!-- Article Config -->
      <div v-else-if="article" class="space-y-6">
        <!-- Header -->
        <div class="bg-white shadow rounded-lg p-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-2">配置文章</h2>
          <div class="flex items-center space-x-4 text-sm text-gray-500">
            <span>📄 {{ article.title }}</span>
            <span class="px-2 py-1 bg-blue-100 text-blue-800 rounded">{{ article.status }}</span>
          </div>
          <p class="mt-2 text-xs text-gray-400">文章ID: {{ article.id }}</p>
        </div>

        <!-- Mode Selection -->
        <div class="bg-white shadow rounded-lg p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">选择工作模式</h3>
          <div class="space-y-3">
            <div
              v-for="mode in modes"
              :key="mode.value"
              @click="selectedMode = mode.value"
              :class="[
                'border rounded-lg p-4 cursor-pointer flex items-center space-x-4 transition-all',
                selectedMode === mode.value ? 'border-blue-500 ring-2 ring-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
              ]"
            >
              <div class="text-2xl">{{ mode.icon }}</div>
              <div>
                <h4 class="font-bold text-gray-900">{{ mode.label }}</h4>
                <p class="text-sm text-gray-500">{{ mode.description }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- WeChat Account Selection -->
        <div v-if="configStore.savedAccounts.length > 0" class="bg-white shadow rounded-lg p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">选择公众号</h3>
          <div class="space-y-2">
            <div
              v-for="account in configStore.savedAccounts"
              :key="account.id"
              @click="selectedAccountId = account.id"
              :class="[
                'border rounded-lg p-3 cursor-pointer transition-colors',
                selectedAccountId === account.id ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500' : 'border-gray-200 hover:border-blue-300'
              ]"
            >
              <h4 class="font-bold text-gray-900">{{ account.name }}</h4>
              <p class="text-xs text-gray-500">AppID: {{ maskAppId(account.appId) }}</p>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-between">
          <button @click="router.push('/')" class="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
            返回首页
          </button>
          <button
            @click="startProcessing"
            :disabled="!selectedMode"
            class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            开始处理
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useConfigStore } from '../stores/configStore'
import { useAppStore } from '../stores/appStore'
import { getArticle, type Article } from '../api/article'
import type { ContentBlock, WechatImage, BlockType } from '@/types'

const route = useRoute()
const router = useRouter()
const configStore = useConfigStore()
const appStore = useAppStore()

const article = ref<Article | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const selectedMode = ref<string>('daily')
const selectedAccountId = ref<string | null>(null)

const modes = [
  { value: 'daily', label: '日常模式', icon: '📝', description: '日常公众号内容排版' },
  { value: 'three_rural', label: '三下乡模式', icon: '🏡', description: '三下乡专项活动排版' },
  { value: 'reprint', label: '转载模式', icon: '📋', description: '转载文章排版模板' }
]

const maskAppId = (id: string) => {
  if (!id) return ''
  return id.length > 8 ? id.substring(0, 4) + '****' + id.substring(id.length - 4) : id
}

const startProcessing = async () => {
  try {
    loading.value = true
    error.value = null

    // Set mode
    configStore.setMode(selectedMode.value as 'daily' | 'three_rural' | 'reprint')
    
    // Set account if selected
    if (selectedAccountId.value) {
      configStore.selectAccount(selectedAccountId.value)
    }
    
    // 加载 Article 数据到 appStore
    if (article.value) {
      // 0. 设置当前文章 ID
      appStore.setCurrentArticleId(article.value.id)
      
      // 1. 加载样式配置（如果有）
      if (article.value.config) {
        appStore.setStyleConfig(article.value.config)
        console.log('[ArticleConfig] Loaded style config')
      }
      
      // 2. 解析保存的内容并恢复到 contentBlocks
      if (article.value.content) {
        try {
          const savedBlocks = JSON.parse(article.value.content)
            if (Array.isArray(savedBlocks) && savedBlocks.length > 0) {
              const restoreBlocksRecursively = (blocks: any[]): ContentBlock[] => {
                return blocks.map((block: any) => ({
                  id: block.id || `restored_${Math.random().toString(36).substr(2, 9)}`,
                  type: (block.type || 'body') as BlockType,
                  text: block.text || '',
                  source: 'restored',
                  meta: block.meta || (block.aiImageUrl ? { aiImageUrl: block.aiImageUrl } : {}),
                  children: block.children ? restoreBlocksRecursively(block.children) : undefined
                }))
              }
              const restoredBlocks = restoreBlocksRecursively(savedBlocks)
              appStore.setContentBlocks(restoredBlocks)
              
              const collectTextRecursively = (blocks: ContentBlock[]): string => {
                return blocks.map(b => {
                  const currentText = b.text || ''
                  const childrenText = b.children ? collectTextRecursively(b.children) : ''
                  return currentText + (childrenText ? '\n' + childrenText : '')
                }).join('\n\n')
              }
              const rawText = collectTextRecursively(restoredBlocks)
              appStore.setRawText(rawText)
              console.log('[ArticleConfig] Restored contentBlocks:', restoredBlocks.length)
            }
        } catch {
          // 如果不是 JSON，当作原始文本处理
          console.log('[ArticleConfig] Content is raw text, setting as rawText')
          appStore.setRawText(article.value.content)
        }
      }
      
      // 3. 加载图片（如果有）
      if (article.value.images && Array.isArray(article.value.images)) {
        const { getWechatProxyUrl, restoreWechatUrl } = await import('../utils/wechatApi')
        const wechatImages = article.value.images.map((img: Partial<WechatImage> & { url?: string; proxyUrl?: string; path?: string; mediaId?: string }, index: number) => {
          const rawUrl = img.url || img.proxyUrl || img.path || ''
          const normalizedUrl = restoreWechatUrl(rawUrl)
          const proxyUrl = img.proxyUrl || getWechatProxyUrl(normalizedUrl)
          return {
            id: `article_img_${index}_${Date.now()}`,
            mediaId: img.mediaId || '',
            url: normalizedUrl || rawUrl,
            proxyUrl: proxyUrl,
            name: img.name || `image_${index + 1}`,
            status: 'success' as const,
            localPreviewUrl: proxyUrl || normalizedUrl || rawUrl
          }
        })
        
        appStore.setWechatImages(wechatImages)
        console.log('[ArticleConfig] Loaded images:', wechatImages.length)
      }
      
      // 4. 根据文章状态决定跳转到哪个步骤
      const status = article.value.status
      const hasContentBlocks = appStore.contentBlocks && appStore.contentBlocks.length > 0
      
      if (status === 'ADJUSTED' || status === 'PUBLISHED') {
        // 已调整或已发布 -> 跳转到 Step3 预览
        console.log('[ArticleConfig] Status is', status, '-> jumping to Step3')
        router.push('/step3')
      } else if (status === 'PARSED' || hasContentBlocks) {
        // 已解析或有内容块 -> 跳转到 Step2 编辑
        console.log('[ArticleConfig] Status is', status, 'or has contentBlocks -> jumping to Step2')
        router.push('/step2')
      } else {
        // 草稿状态且无内容 -> 跳转到 Step1
        console.log('[ArticleConfig] Status is DRAFT without content -> jumping to Step1')
        router.push('/step1')
      }
    } else {
      router.push('/step1')
    }
  } catch (err: unknown) {
    console.error('[ArticleConfig] Failed to load article data:', err)
    const message = err instanceof Error ? err.message : '加载文章数据失败'
    error.value = message
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  try {
    const articleId = route.params.id as string
    article.value = await getArticle(articleId)
    
    // Pre-select default account if logged in
    if (configStore.savedAccounts.length > 0) {
      selectedAccountId.value =
        configStore.wechatConfig.id || configStore.savedAccounts[0].id
    }
  } catch (err: unknown) {
    const errorData = err as { response?: { data?: { message?: string } } }
    error.value = errorData.response?.data?.message || '无法加载文章信息'
  } finally {
    loading.value = false
  }
})
</script>
