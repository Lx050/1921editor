<template>
  <div class="h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 flex items-center justify-center px-4 overflow-hidden text-gray-900">
    <!-- 背景装饰 -->
    <div class="fixed inset-0 -z-10 overflow-hidden">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
    </div>

    <!-- 忘记密码卡片 -->
    <div class="w-full max-w-[400px] relative">
      <div class="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-100/50 p-6 relative overflow-hidden">
        <!-- 右上角关闭按钮 -->
        <router-link
          to="/"
          class="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100/50 rounded-full transition-all duration-200 z-10"
          title="返回首页"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </router-link>

        <!-- 品牌标识 -->
        <div class="flex flex-col items-center mb-6">
          <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 mb-3">
            <span class="text-white font-bold text-xl" style="font-family: var(--font-display)">B</span>
          </div>
          <h1 class="text-xl font-bold text-black mb-0.5">忘记密码</h1>
          <p class="text-gray-500 text-xs">Professional Layout Engine</p>
        </div>

        <!-- 表单 -->
        <form @submit.prevent="handleForgotPassword" class="space-y-4">
          <!-- 邮箱 -->
          <div>
            <label class="block text-sm font-medium text-black mb-1.5">邮箱</label>
            <input
              v-model="formData.email"
              type="email"
              required
              placeholder="your@email.com"
              class="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-black placeholder:text-gray-500"
            />
          </div>

          <!-- 成功提示 -->
          <div v-if="successMessage" class="p-3 bg-green-50 border border-green-200 rounded-lg">
            <p class="text-sm text-green-600">{{ successMessage }}</p>
          </div>

          <!-- 错误提示 -->
          <div v-if="errorMessage" class="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p class="text-sm text-red-600">{{ errorMessage }}</p>
          </div>

          <!-- 发送按钮 -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30"
          >
            {{ loading ? '发送中...' : '发送重置邮件' }}
          </button>
        </form>

        <!-- 返回登录链接 -->
        <div class="mt-5 text-center">
          <p class="text-xs text-gray-600">
            记起密码了？
            <router-link to="/login" class="text-blue-600 hover:text-blue-700 font-medium">
              返回登录
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { forgotPassword, type ForgotPasswordDto } from '../api/auth'
import toast from '../composables/useToast'

const formData = ref<ForgotPasswordDto>({
  email: ''
})

const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const handleForgotPassword = async () => {
  errorMessage.value = ''
  successMessage.value = ''
  loading.value = true

  try {
    await forgotPassword(formData.value)
    successMessage.value = '如果该邮箱存在，密码重置邮件已发送'
    toast.success('邮件已发送')
  } catch (error: unknown) {
    console.error('发送失败:', error)
    const err = error as { response?: { data?: { message?: string } } }
    errorMessage.value = err.response?.data?.message || '发送失败，请稍后重试'
  } finally {
    loading.value = false
  }
}
</script>
