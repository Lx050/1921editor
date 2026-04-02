<template>
  <div class="h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 flex items-center justify-center px-4 overflow-hidden text-gray-900">
    <div class="w-full max-w-md">
      <router-link
        to="/"
        class="inline-flex items-center space-x-2 text-gray-500 hover:text-blue-600 transition-colors mb-4 group"
      >
        <svg class="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
        </svg>
        <span class="text-sm font-medium">返回首页</span>
      </router-link>

      <div class="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-100/50 p-6">
        <div class="flex flex-col items-center mb-6">
          <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 mb-3">
            <span class="text-white font-bold text-xl" style="font-family: var(--font-display)">B</span>
          </div>
          <h1 class="text-xl font-bold text-black mb-0.5">确认公众号密钥</h1>
          <p class="text-gray-500 text-xs">个人排版助手</p>
        </div>

        <div v-if="loading" class="text-center py-8">
          <div class="inline-block animate-spin rounded-full h-10 w-10 border-4 border-blue-600/30 border-t-blue-600 mb-4"></div>
          <p class="text-gray-600 font-medium">正在确认...</p>
        </div>

        <div v-else-if="success" class="text-center py-8">
          <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h2 class="text-xl font-bold text-black mb-2">密钥更新成功</h2>
          <p class="text-gray-600 mb-6">公众号密钥已更新，可以返回系统继续使用</p>
          <router-link
            to="/settings/wechat"
            class="inline-block px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg"
          >
            回到公众号管理
          </router-link>
        </div>

        <div v-else class="text-center py-8">
          <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </div>
          <h2 class="text-xl font-bold text-black mb-2">确认失败</h2>
          <p class="text-gray-600 mb-6">{{ errorMessage }}</p>
          <router-link
            to="/settings/wechat"
            class="inline-block px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg"
          >
            返回公众号管理
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { tenantApi } from '../../utils/api'
import { useUserStore } from '../../stores/userStore'
import { useConfigStore } from '../../stores/configStore'
import toast from '../../composables/useToast'

const route = useRoute()
const userStore = useUserStore()
const configStore = useConfigStore()

const loading = ref(true)
const success = ref(false)
const errorMessage = ref('')

onMounted(async () => {
  const token = route.query.token as string
  if (!token) {
    errorMessage.value = '确认令牌缺失'
    loading.value = false
    return
  }

  try {
    await tenantApi.confirmWechatCredentialChange({ token })
    success.value = true
    toast.success('公众号密钥更新成功')

    if (userStore.currentTenant?.id) {
      await configStore.fetchBackendConfig(userStore.currentTenant.id)
    }
  } catch (error: any) {
    console.error('确认失败:', error)
    errorMessage.value = error.response?.data?.message || '确认链接无效或已过期'
  } finally {
    loading.value = false
  }
})
</script>
