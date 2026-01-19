<template>
  <div class="group relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100/50 p-6 flex flex-col hover:shadow-2xl hover:border-cyan-200 transition-all duration-300 overflow-hidden min-h-[160px]">
    <!-- 背景装饰 -->
    <div class="absolute inset-0 bg-gradient-to-br from-cyan-50/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    
    <div class="relative flex flex-col h-full">
      <div class="flex items-center space-x-4 mb-4">
        <div class="h-12 w-12 bg-gradient-to-br from-cyan-400 to-teal-500 rounded-xl flex items-center justify-center text-2xl shadow-lg shadow-cyan-500/20 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
          🖼️
        </div>
        <div>
          <h3 class="text-lg font-bold text-gray-900 group-hover:text-cyan-700 transition-colors">封面提取</h3>
          <span class="text-[10px] text-cyan-700 font-bold uppercase tracking-wider">Cover Extractor</span>
        </div>
      </div>

      <p class="text-xs text-gray-600 mb-4 leading-relaxed">
        快速提取微信公众号文章封面图链接，支持一键预览与复制。
      </p>

      <div class="mt-auto space-y-3">
        <!-- 输入区域 -->
        <div class="relative">
          <input 
            v-model="url"
            type="text" 
            placeholder="粘贴微信文章链接..."
            class="w-full pl-3 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all outline-none"
            @keyup.enter="handleExtract"
          />
          <button
            @click="handleExtract"
            :disabled="loading || !url.trim()"
            aria-label="提取封面"
            class="absolute right-2 top-1.5 p-1.5 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            <svg v-if="!loading" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
            <div v-else class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          </button>
        </div>

        <!-- 结果区域 -->
        <transition
          enter-active-class="transition duration-300 ease-out"
          enter-from-class="transform scale-95 opacity-0"
          enter-to-class="transform scale-100 opacity-100"
        >
          <div v-if="coverUrl" class="space-y-3 pt-2">
            <!-- 封面预览卡片 -->
            <div class="relative group/cover rounded-xl overflow-hidden shadow-md border border-gray-100 aspect-video bg-gray-50 flex items-center justify-center">
              <img 
                :src="proxyUrl" 
                class="w-full h-full object-cover transition-transform duration-700" 
                alt="封面预览"
              />
              <div class="absolute inset-0 bg-black/20 group-hover/cover:bg-black/10 transition-colors"></div>
              
              <!-- 右上角关闭 -->
              <button
                @click="coverUrl = ''"
                aria-label="关闭预览"
                class="absolute top-2 right-2 p-1.5 bg-black/40 hover:bg-black/60 text-white rounded-full backdrop-blur-sm transition-all scale-0 group-hover/cover:scale-100"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- 链接展示与一键复制 (更显眼) -->
            <div class="flex flex-col space-y-2">
              <div class="group/link flex items-center p-3 bg-cyan-50/50 border border-cyan-100 rounded-xl hover:border-cyan-200 transition-all">
                <div class="flex-1 min-w-0 pr-3">
                  <p class="text-[10px] text-cyan-700 font-bold uppercase tracking-wider mb-1">图片直链 URL</p>
                  <p class="text-xs text-gray-700 font-mono truncate select-all">{{ coverUrl }}</p>
                </div>
                <button
                  @click="copyLink"
                  aria-label="复制链接到剪贴板"
                  class="flex items-center space-x-1.5 px-3 py-1.5 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 active:scale-95 transition-all shadow-sm"
                >
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <span class="text-xs font-bold">复制链接</span>
                </button>
              </div>
              
              <a 
                :href="coverUrl" 
                target="_blank"
                class="flex items-center justify-center space-x-2 py-2 text-xs text-gray-500 hover:text-cyan-700 transition-colors"
              >
                <span>在新窗口查看原图</span>
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { wechatApi } from '../utils/api'
import { getWechatProxyUrl } from '../utils/wechatApi'
import { copyToClipboard } from '../utils/clipboard'
import toast from '../composables/useToast'

const url = ref('')
const loading = ref(false)
const coverUrl = ref('')

const proxyUrl = computed(() => {
  if (!coverUrl.value) return ''
  return getWechatProxyUrl(coverUrl.value)
})

const handleExtract = async () => {
  if (!url.value.trim()) return
  
  if (!url.value.includes('mp.weixin.qq.com')) {
    toast.error('请输入有效的微信公众号文章链接')
    return
  }

  loading.value = true
  try {
    const response = await wechatApi.fetchArticle(url.value)
    if (response.data.success && response.data.data.cover) {
      coverUrl.value = response.data.data.cover
      toast.success('封面解析成功')
    } else {
      toast.error(response.data.error || '未能解析到封面图，请确认链接有效')
    }
  } catch (err) {
    console.error('Extract failed:', err)
    toast.error('提取失败，服务器可能暂时不可用')
  } finally {
    loading.value = false
  }
}

const copyLink = async () => {
  if (!coverUrl.value) return
  const success = await copyToClipboard(coverUrl.value)
  if (success) {
    toast.success('图片地址已复制到剪贴板')
  }
}
</script>
