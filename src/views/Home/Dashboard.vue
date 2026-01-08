<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
    <!-- 背景装饰 -->
    <div class="fixed inset-0 -z-10 overflow-hidden">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
    </div>

    <!-- 简化的顶部欢迎栏 -->
    <div class="bg-white/70 backdrop-blur-lg border-b border-gray-100/60 sticky top-0 z-40">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div class="flex items-center justify-between">
          <!-- 左侧：用户信息 -->
          <div class="flex items-center space-x-3">
            <div class="h-9 w-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-sm font-bold shadow-sm">
              {{ userStore.userInfo?.name?.charAt(0) || 'U' }}
            </div>
            <div>
              <p class="text-xs text-gray-500">
                {{ userStore.userInfo?.name || '创作者' }} · {{ userStore.currentTenant?.name || '默认组织' }}
              </p>
            </div>
          </div>

          <!-- 右侧：统一设置下拉菜单 -->
          <div class="relative" @mouseenter="showSettings = true" @mouseleave="showSettings = false">
            <button
              class="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              title="菜单"
            >
              <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>

            <!-- 下拉菜单 -->
            <transition
              enter-active-class="transition ease-out duration-200"
              enter-from-class="transform opacity-0 scale-95"
              enter-to-class="transform opacity-100 scale-100"
              leave-active-class="transition ease-in duration-75"
              leave-from-class="transform opacity-100 scale-100"
              leave-to-class="transform opacity-0 scale-95"
            >
              <div
                v-if="showSettings"
                class="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
              >
                <!-- 组织管理 -->
                <div class="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  组织管理
                </div>
                <button
                  @click="router.push('/tenant-select')"
                  class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors flex items-center"
                >
                  <svg class="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
                  </svg>
                  切换组织
                </button>
                <button
                  @click="router.push('/settings/tenant')"
                  class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors flex items-center"
                >
                  <svg class="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                  </svg>
                  租户设置
                </button>

                <!-- 系统设置 -->
                <div class="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mt-2">
                  系统设置
                </div>
                <button
                  @click="router.push('/settings/wechat')"
                  class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors flex items-center"
                >
                  <svg class="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  公众号设置
                </button>

                <!-- 账户操作 -->
                <div class="border-t border-gray-100 mt-2 pt-2">
                  <button
                    @click="handleLogout"
                    class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center"
                  >
                    <svg class="w-4 h-4 mr-3 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                    </svg>
                    退出登录
                  </button>
                </div>
              </div>
            </transition>
          </div>
        </div>
      </div>
    </div>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <!-- 🚀 新建排版 -->
      <section class="mb-16">
        <div class="text-center mb-10">
          <h2 class="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-3">
            开始创作
          </h2>
          <p class="text-gray-600 max-w-2xl mx-auto">
            选择适合的创作模式，开启高效的图文排版体验
          </p>
        </div>

        <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <!-- 日常模式 -->
          <div
            @click="startWork('daily')"
            class="group relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100/50 p-8 cursor-pointer hover:shadow-2xl hover:border-orange-200 hover:-translate-y-2 transition-all duration-300 overflow-hidden"
          >
            <!-- 背景装饰 -->
            <div class="absolute inset-0 bg-gradient-to-br from-orange-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div class="absolute -top-4 -right-4 w-20 h-20 bg-orange-100/30 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"></div>

            <div class="relative">
              <div class="flex items-center space-x-5 mb-6">
                <div class="h-16 w-16 bg-gradient-to-br from-orange-400 to-amber-500 rounded-2xl flex items-center justify-center text-3xl shadow-lg shadow-orange-500/25 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  📝
                </div>
                <div>
                  <h3 class="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors">日常模式</h3>
                  <span class="text-xs text-orange-600 font-medium">常用推荐</span>
                </div>
              </div>
              <p class="text-sm text-gray-600 mb-6 leading-relaxed">
                适用于日常公众号图文排版，支持标准格式和多图模式，提供灵活的创作体验。
              </p>
              <div class="flex items-center text-orange-600 font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                <span>立即开始</span>
                <svg class="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                </svg>
              </div>
            </div>
          </div>

          <!-- 三下乡模式 -->
          <div
            @click="startWork('three_rural')"
            class="group relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100/50 p-8 cursor-pointer hover:shadow-2xl hover:border-green-200 hover:-translate-y-2 transition-all duration-300 overflow-hidden"
          >
            <!-- 背景装饰 -->
            <div class="absolute inset-0 bg-gradient-to-br from-green-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div class="absolute -top-4 -right-4 w-20 h-20 bg-green-100/30 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"></div>

            <div class="relative">
              <div class="flex items-center space-x-5 mb-6">
                <div class="h-16 w-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center text-3xl shadow-lg shadow-green-500/25 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  🏡
                </div>
                <div>
                  <h3 class="text-xl font-bold text-gray-900 group-hover:text-green-600 transition-colors">三下乡模式</h3>
                  <span class="text-xs text-green-600 font-medium">专项模板</span>
                </div>
              </div>
              <p class="text-sm text-gray-600 mb-6 leading-relaxed">
                三下乡社会实践专项活动排版模板，符合特定规范，助力实践活动宣传。
              </p>
              <div class="flex items-center text-green-600 font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                <span>立即开始</span>
                <svg class="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                </svg>
              </div>
            </div>
          </div>

          <!-- 转载模式 -->
          <div
            @click="startWork('reprint')"
            class="group relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100/50 p-8 cursor-pointer hover:shadow-2xl hover:border-purple-200 hover:-translate-y-2 transition-all duration-300 overflow-hidden"
          >
            <!-- 背景装饰 -->
            <div class="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div class="absolute -top-4 -right-4 w-20 h-20 bg-purple-100/30 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"></div>

            <div class="relative">
              <div class="flex items-center space-x-5 mb-6">
                <div class="h-16 w-16 bg-gradient-to-br from-purple-400 to-violet-500 rounded-2xl flex items-center justify-center text-3xl shadow-lg shadow-purple-500/25 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  📋
                </div>
                <div>
                  <h3 class="text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors">转载模式</h3>
                  <span class="text-xs text-purple-600 font-medium">高效复用</span>
                </div>
              </div>
              <p class="text-sm text-gray-600 mb-6 leading-relaxed">
                标准化转载文章排版，自动处理引用和格式转换，让内容复用更简单。
              </p>
              <div class="flex items-center text-purple-600 font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                <span>立即开始</span>
                <svg class="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 📄 最近草稿 -->
      <section class="relative">

        <div class="flex items-center justify-between mb-8">
          <div>
            <h2 class="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              最近草稿
            </h2>
            <p class="text-sm text-gray-600 mt-1">继续编辑您的创作内容</p>
          </div>
          <button class="group inline-flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors">
            <span>查看全部</span>
            <svg class="ml-1 h-4 w-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
            </svg>
          </button>
        </div>

        <div v-if="loading" class="text-center py-16">
          <div class="inline-flex flex-col items-center">
            <div class="relative">
              <div class="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
              <div class="absolute inset-0 w-12 h-12 border-4 border-transparent border-l-blue-400 rounded-full animate-spin" style="animation-delay: 0.15s; animation-direction: reverse;"></div>
            </div>
            <p class="mt-4 text-gray-600 font-medium">加载中...</p>
          </div>
        </div>

        <div v-else-if="articles.length === 0" class="text-center py-16 bg-white/60 backdrop-blur-sm rounded-2xl border border-dashed border-gray-200">
          <div class="inline-flex flex-col items-center">
            <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
            <p class="text-gray-600 font-medium">暂无草稿，快去创建第一篇排版吧！</p>
            <button
              @click="startWork('daily')"
              class="mt-4 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 text-sm font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              立即开始创作
            </button>
          </div>
        </div>

        <div v-else class="grid grid-cols-1 gap-4">
          <div
            v-for="(article, index) in articles"
            :key="article.id"
            class="group relative bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100/50 hover:shadow-lg hover:border-blue-200 transition-all duration-300 overflow-hidden animate-fade-in"
            :style="{ animationDelay: `${index * 100}ms` }"
          >
            <!-- 左侧装饰线 -->
            <div class="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-purple-500 transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300"></div>

            <a
              @click="continueEdit(article.id)"
              class="block p-6 cursor-pointer"
            >
              <div class="flex items-start justify-between">
                <div class="flex-1 min-w-0 mr-4">
                  <div class="flex items-center mb-2">
                    <h3 class="text-base font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors mr-3">
                      {{ article.title || '无标题' }}
                    </h3>
                    <span
                      class="px-3 py-1 inline-flex text-xs font-medium rounded-full backdrop-blur-sm border"
                      :class="getStatusClass(article.status)"
                    >
                      {{ formatStatus(article.status) }}
                    </span>
                  </div>
                  <div class="flex items-center text-sm text-gray-500">
                    <svg class="flex-shrink-0 mr-2 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span>最后编辑: {{ formatDate(article.updatedAt) }}</span>
                  </div>
                </div>
                <div class="flex-shrink-0 flex items-center space-x-2">
                  <!-- 删除按钮 -->
                  <button
                    @click.stop="confirmDeleteArticle(article)"
                    class="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-red-50 hover:text-red-600 transition-all"
                    title="删除文章"
                  >
                    <svg class="w-5 h-5 text-gray-400 hover:text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                  </button>
                  <!-- 编辑图标 -->
                  <div class="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center group-hover:bg-blue-50 group-hover:text-blue-600 transition-all">
                    <svg class="w-5 h-5 text-gray-400 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                  </div>
                </div>
              </div>
            </a>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onActivated, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../../stores/userStore'
import { useConfigStore } from '../../stores/configStore'
import { useAppStore } from '../../stores/appStore'
import { getArticles, getArticle, type Article } from '../../api/article'
import api from '../../utils/api'
import toast from '../../composables/useToast'

const router = useRouter()
const userStore = useUserStore()
const configStore = useConfigStore()
const appStore = useAppStore()

// 同步微信配置
watch(() => userStore.currentTenant?.id, (newId) => {
  if (newId) {
    console.log('[Dashboard] 同步租户微信配置:', newId)
    configStore.fetchBackendConfig(newId)
  }
}, { immediate: true })

const articles = ref<Article[]>([])
const loading = ref(true)
const showSettings = ref(false)
const isDeleting = ref(false)

// 删除文章确认
const confirmDeleteArticle = async (article: Article) => {
  if (isDeleting.value) return
  
  const confirmed = confirm(`确定要删除文章「${article.title || '无标题'}」吗？\n\n此操作不可恢复。`)
  if (!confirmed) return
  
  isDeleting.value = true
  
  try {
    await api.delete(`/articles/${article.id}`)
    
    // 从列表中移除
    articles.value = articles.value.filter(a => a.id !== article.id)
    
    toast.success('文章已删除')
  } catch (error: any) {
    console.error('删除文章失败:', error)
    toast.error(error.response?.data?.message || '删除失败，请重试')
  } finally {
    isDeleting.value = false
  }
}

const startWork = (mode: 'daily' | 'three_rural' | 'reprint') => {
  configStore.setMode(mode)
  router.push('/step1')
}

const handleLogout = () => {
  if (confirm('确定要退出登录吗？')) {
    userStore.logout()
    router.push('/')
  }
}

// 继续编辑文章 - 直接恢复状态并跳转到正确的步骤
const continueEdit = async (id: string) => {
  try {
    loading.value = true
    console.log('=== [Dashboard] continueEdit 开始 ===')
    console.log('[Dashboard] 文章ID:', id)
    
    // 获取文章详情
    const article = await getArticle(id)
    console.log('[Dashboard] 获取到的文章:', {
      id: article.id,
      title: article.title,
      status: article.status,
      hasConfig: !!article.config,
      contentLength: article.content?.length || 0,
      contentPreview: article.content?.substring(0, 100)
    })
    
    // 1. 设置当前文章 ID
    appStore.setCurrentArticleId(article.id)
    
    // 2. 恢复样式配置
    if (article.config) {
      appStore.setStyleConfig(article.config)
      console.log('[Dashboard] 已恢复样式配置')
    }
    
    // 3. 解析保存的内容并恢复到 contentBlocks
    let hasContentBlocks = false
    if (article.content) {
      console.log('[Dashboard] 尝试解析内容...')
      try {
        const savedBlocks = JSON.parse(article.content)
        console.log('[Dashboard] 解析结果:', {
          isArray: Array.isArray(savedBlocks),
          length: savedBlocks?.length,
          firstBlock: savedBlocks?.[0]
        })
        if (Array.isArray(savedBlocks) && savedBlocks.length > 0) {
          const restoredBlocks = savedBlocks.map((block: any, index: number) => ({
            id: `restored_${index}_${Date.now()}`,
            type: block.type || 'body',
            text: block.text || '',
            source: 'restored',
            meta: block.aiImageUrl ? { aiImageUrl: block.aiImageUrl } : {}
          }))
          
          appStore.setContentBlocks(restoredBlocks)
          hasContentBlocks = true
          console.log('[Dashboard] ✅ 已恢复 contentBlocks:', restoredBlocks.length)
          
          // 同时重建 rawText，以便返回 Step1 时也能显示文本
          const rawText = savedBlocks.map((b: any) => b.text || '').join('\n\n')
          appStore.setRawText(rawText)
          console.log('[Dashboard] ✅ 已重建 rawText:', rawText.length, '字符')
        }
      } catch (parseError) {
        // 如果不是 JSON，当作原始文本处理
        console.log('[Dashboard] JSON解析失败，当作原始文本:', parseError)
        appStore.setRawText(article.content)
      }
    } else {
      console.log('[Dashboard] ⚠️ 文章无内容')
    }
    
    // 4. 统一走 Step3（已编辑），状态不再作为跳转依据
    const status = article.status
    const hasImages = Array.isArray(article.images) && article.images.length > 0
    const hasContent = Boolean(article.content) || hasContentBlocks || hasImages

    console.log('[Dashboard] 决策参数:', { status, hasContentBlocks, hasImages, hasContent })

    if (hasContent) {
      console.log('[Dashboard] → 跳转到 Step3')
      router.push('/step3/' + article.id)
    } else {
      console.log('[Dashboard] → 跳转到 Step1')
      router.push('/step1')
    }
  } catch (error: any) {
    console.error('加载文章失败:', error)
    toast.error('加载文章失败: ' + (error.message || '未知错误'))
  } finally {
    loading.value = false
  }
}

const getStatusClass = (status: string) => {
  const edited = 'bg-blue-100/80 text-blue-700 border-blue-200'
  const map: Record<string, string> = {
    'DRAFT': edited,
    'PARSED': edited,
    'ADJUSTED': edited,
    'PUBLISHED': 'bg-green-100/80 text-green-700 border-green-200'
  }
  return map[status] || edited
}

const formatStatus = (status: string) => {
  const map: Record<string, string> = {
    'DRAFT': '已编辑',
    'PARSED': '已编辑',
    'ADJUSTED': '已编辑',
    'PUBLISHED': '已发布'
  }
  return map[status] || '已编辑'
}

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 获取文章列表函数
const fetchArticles = async () => {
  loading.value = true
  try {
    const res = await getArticles()
    console.log(`📋 获取到 ${res.length} 篇文章`)
    articles.value = res
  } catch (error: any) {
    console.error('❌ 获取文章列表失败:', error)
    toast.error('获取文章列表失败')
  } finally {
    loading.value = false
  }
}

// 首次加载
onMounted(() => {
  console.log('🏠 Dashboard组件已挂载')
  fetchArticles()
})

// 每次进入时刷新（处理 keep-alive 缓存情况）
onActivated(() => {
  console.log('🔄 Dashboard被激活，刷新文章列表')
  fetchArticles()
})
</script>

<style scoped>
@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 0.4s ease-out forwards;
}

/* 平滑滚动 */
html {
  scroll-behavior: smooth;
}

/* 自定义滚动条 */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
