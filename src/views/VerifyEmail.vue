<template>
  <div class="h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 flex items-center justify-center px-4 overflow-hidden text-gray-900">
    <!-- 背景装饰 -->
    <div class="fixed inset-0 -z-10 overflow-hidden">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
    </div>

    <!-- 验证邮箱卡片 -->
    <div class="w-full max-w-md">
      <!-- 统一的返回首页入口 -->
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
        <!-- 品牌标识 -->
        <div class="flex flex-col items-center mb-6">
          <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 mb-3">
            <span class="text-white font-bold text-xl" style="font-family: var(--font-display)">B</span>
          </div>
          <h1 class="text-xl font-bold text-black mb-0.5">验证邮箱</h1>
          <p class="text-gray-500 text-xs">Professional Layout Engine</p>
        </div>

        <!-- 验证中 -->
        <div v-if="loading" class="text-center py-8">
          <div class="inline-block animate-spin rounded-full h-10 w-10 border-4 border-blue-600/30 border-t-blue-600 mb-4"></div>
          <p class="text-gray-600 font-medium">正在验证...</p>
        </div>

        <!-- 验证成功 -->
        <div v-else-if="success" class="text-center py-8">
          <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h2 class="text-xl font-bold text-black mb-2">邮箱验证成功！</h2>
          <p class="text-gray-600 mb-6">您的邮箱已验证完成，现在可以登录了</p>
          <router-link
            to="/login"
            class="inline-block px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg"
          >
            去登录
          </router-link>
        </div>

        <!-- 验证失败 -->
        <div v-else-if="error" class="text-center py-8">
          <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </div>
          <h2 class="text-xl font-bold text-black mb-2">验证失败</h2>
          <p class="text-gray-600 mb-6">{{ error }}</p>
          <div class="space-y-3">
            <router-link
              to="/register"
              class="inline-block px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg"
            >
              重新注册
            </router-link>
            <p class="text-sm text-gray-500">
              或 <a href="mailto:support@example.com" class="text-blue-600 hover:underline">联系客服</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { verifyEmail, type VerifyEmailDto } from '../api/auth'
import toast from '../composables/useToast'

const router = useRouter()
const route = useRoute()

const loading = ref(true)
const success = ref(false)
const error = ref('')

onMounted(() => {
  const token = route.query.token as string

  if (!token) {
    error.value = '验证令牌缺失，请从邮件中点击验证链接'
    loading.value = false
    return
  }

  verifyEmailAddress(token)
})

const verifyEmailAddress = async (token: string) => {
  try {
    const verifyEmailDto: VerifyEmailDto = { token }
    await verifyEmail(verifyEmailDto)

    success.value = true
    toast.success('邮箱验证成功！')
  } catch (err: any) {
    console.error('验证失败:', err)
    error.value = err.response?.data?.message || '验证链接无效或已过期'
  } finally {
    loading.value = false
  }
}
</script>
