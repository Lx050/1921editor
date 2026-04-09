<template>
  <div class="min-h-screen flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8" style="background:var(--color-bg-page);">
    <div class="max-w-3xl mx-auto w-full">
      <!-- Loading State -->
      <div v-if="loading" class="text-center">
        <div class="inline-block animate-spin rounded-full h-12 w-12" style="border-bottom:2px solid var(--color-accent-primary);"></div>
        <p class="mt-4" style="color:rgba(0,0,0,0.55);">加载中...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-white shadow rounded-lg p-6">
        <div class="text-center text-red-600">
          <svg class="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <h3 class="mt-2 text-lg font-medium">加载失败</h3>
          <p class="mt-1 text-sm">{{ error }}</p>
          <button @click="router.push('/')" class="mt-4" style="color:var(--color-accent-primary);">返回首页</button>
        </div>
      </div>

      <!-- Article Config -->
      <div v-else-if="article" class="space-y-6">
        <!-- Header -->
        <div class="bg-white shadow rounded-lg p-6">
          <h2 class="text-2xl font-bold mb-2" style="color:rgba(0,0,0,0.85);">配置文章</h2>
          <div class="flex items-center space-x-4 text-sm" style="color:rgba(0,0,0,0.45);">
            <span>📄 {{ article.title }}</span>
            <span class="px-2 py-1 rounded" style="background:var(--color-badge-bg); color:var(--color-badge-text);">{{ article.status }}</span>
          </div>
          <p class="mt-2 text-xs" style="color:var(--color-text-muted);">文章ID: {{ article.id }}</p>
        </div>

        <!-- Mode Selection -->
        <div class="bg-white shadow rounded-lg p-6">
          <h3 class="text-lg font-medium mb-4" style="color:rgba(0,0,0,0.85);">选择工作模式</h3>
          <ModeSelector v-model="selectedMode" />
        </div>

        <!-- WeChat Account Selection -->
        <div v-if="configStore.savedAccounts.length > 0" class="bg-white shadow rounded-lg p-6">
          <h3 class="text-lg font-medium mb-4" style="color:rgba(0,0,0,0.85);">选择公众号</h3>
          <div class="space-y-2">
            <div
              v-for="account in configStore.savedAccounts"
              :key="account.id"
              @click="selectedAccountId = account.id"
              :class="[
                'border rounded-lg p-3 cursor-pointer transition-colors',
                ''
              ]"
              :style="selectedAccountId === account.id
                ? 'border-color:var(--color-accent-primary); background:var(--color-badge-bg); box-shadow:0 0 0 2px var(--color-accent-focus);'
                : 'border-color:rgba(0,0,0,0.1);'"
            >
              <h4 class="font-bold" style="color:rgba(0,0,0,0.85);">{{ account.name }}</h4>
              <p class="text-xs" style="color:rgba(0,0,0,0.45);">AppID: {{ maskAppId(account.appId) }}</p>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-between">
          <button
            @click="router.push('/')"
            class="h-10 px-5 text-sm font-medium rounded-xl transition-all active:scale-[0.98]"
            style="color:rgba(0,0,0,0.65); background:white; box-shadow:var(--shadow-content-card);"
          >
            返回首页
          </button>
          <button
            @click="startProcessing"
            :disabled="!selectedMode"
            class="h-10 px-5 text-sm font-bold rounded-xl transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
            style="background:var(--color-accent-primary); color:#fff;"
            onmouseover="this.style.background='var(--color-accent-hover)'"
            onmouseout="this.style.background='var(--color-accent-primary)'"
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
import ModeSelector from '../components/ModeSelector.vue'

const route = useRoute()
const router = useRouter()
const configStore = useConfigStore()
const appStore = useAppStore()

const article = ref<Article | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const selectedMode = ref<string>('daily')
const selectedAccountId = ref<string | null>(null)


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
      }
      
      // 2. 解析保存的内容并恢复到 contentBlocks
      if (article.value.content) {
        try {
          const savedBlocks = JSON.parse(article.value.content)
          if (Array.isArray(savedBlocks) && savedBlocks.length > 0) {
            // 重新生成 block IDs 并恢复到 appStore
            const restoredBlocks = savedBlocks.map((block: any, index: number) => ({
              id: `restored_${index}_${Date.now()}`,
              type: block.type || 'body',
              text: block.text || '',
              source: 'restored',
              meta: block.aiImageUrl ? { aiImageUrl: block.aiImageUrl } : {}
            }))
            
            appStore.setContentBlocks(restoredBlocks)
          }
        } catch (parseError) {
          // 如果不是 JSON，当作原始文本处理
          appStore.setRawText(article.value.content)
        }
      }
      
      // 3. 加载图片（如果有）
      if (article.value.images && Array.isArray(article.value.images)) {
        const { getWechatProxyUrl, restoreWechatUrl } = await import('../utils/wechatApi')
        const wechatImages = article.value.images.map((img: any, index: number) => {
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
        
        appStore.addWechatImages(wechatImages)
      }
      
      // 4. 根据文章状态决定跳转到哪个步骤
      const status = article.value.status
      const hasContentBlocks = appStore.contentBlocks && appStore.contentBlocks.length > 0
      
      if (status === 'ADJUSTED' || status === 'PUBLISHED') {
        // 已调整或已发布 -> 跳转到 Step3 预览
        router.push('/step3')
      } else if (status === 'PARSED' || hasContentBlocks) {
        // 已解析或有内容块 -> 跳转到 Step2 编辑
        router.push('/step2')
      } else {
        // 草稿状态且无内容 -> 跳转到 Step1
        router.push('/step1')
      }
    } else {
      router.push('/step1')
    }
  } catch (err: any) {
    console.error('[ArticleConfig] Failed to load article data:', err)
    error.value = err.message || '加载文章数据失败'
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
  } catch (err: any) {
    error.value = err.response?.data?.message || '无法加载文章信息'
  } finally {
    loading.value = false
  }
})
</script>
