<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-50">
    <div class="max-w-md w-full p-8 bg-white rounded-xl shadow-lg text-center">
      <div v-if="loading" class="space-y-4">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
        <h2 class="text-xl font-semibold">正在完成授权...</h2>
        <p class="text-gray-500">正在与微信服务器同步授权信息</p>
      </div>

      <div v-else-if="error" class="space-y-4">
        <div class="h-16 w-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
          <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </div>
        <h2 class="text-xl font-semibold text-gray-800">授权失败</h2>
        <p class="text-red-500">{{ error }}</p>
        <button 
          @click="goBack"
          class="inline-block px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium mt-4"
        >
          返回设置
        </button>
      </div>

      <div v-else class="space-y-4">
        <div class="h-16 w-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
          <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
          </svg>
        </div>
        <h2 class="text-xl font-semibold text-gray-800">授权成功</h2>
        <p class="text-gray-600">公众号已成功关联到您的组织</p>
        <p class="text-sm text-gray-400">正在为您跳转...</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

/**
 * 微信授权回调处理页面
 * 
 * 职责：
 * 1. 从 URL 查询参数中提取 auth_code
 * 2. 将 auth_code 发送至后端换取授权令牌 (API: /api/wechat/exchange-auth)
 * 3. 根据处理结果展示成功/失败状态，并引导用户跳转回设置页
 */
const route = useRoute()
const router = useRouter()
const loading = ref(true)
const error = ref('')

const goBack = () => router.push('/settings/wechat')

onMounted(async () => {
  const authCode = route.query.auth_code as string
  
  if (!authCode) {
    error.value = '未获取到授权码，请重试'
    loading.value = false
    return
  }

  try {
    const token = localStorage.getItem('auth_token')
    const response = await fetch('/api/wechat/exchange-auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ code: authCode })
    })

    const data = await response.json()
    if (data.success) {
      setTimeout(() => {
        router.push('/settings/wechat?authorized=success')
      }, 1500)
    } else {
      error.value = data.error || '换取授权失败'
    }
  } catch (e: unknown) {
    error.value = '网络错误，请稍后重试'
  } finally {
    loading.value = false
  }
})
</script>
