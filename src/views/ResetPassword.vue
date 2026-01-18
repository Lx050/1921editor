<template>
  <div class="h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 flex items-center justify-center px-4 overflow-hidden text-gray-900">
    <div class="fixed inset-0 -z-10 overflow-hidden">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
    </div>

    <div class="w-full max-w-[400px] relative">
      <div class="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-100/50 p-6 relative overflow-hidden">
        <router-link
          to="/"
          class="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100/50 rounded-full transition-all duration-200 z-10"
          title="返回首页"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </router-link>

        <div class="flex flex-col items-center mb-6">
          <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 mb-3">
            <span class="text-white font-bold text-xl" style="font-family: var(--font-display)">B</span>
          </div>
          <h1 class="text-xl font-bold text-black mb-0.5">重置密码</h1>
          <p class="text-gray-500 text-xs">Professional Layout Engine</p>
        </div>

        <form v-if="!success" @submit.prevent="handleReset" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-black mb-1.5">新密码</label>
            <input
              v-model="formData.newPassword"
              type="password"
              required
              placeholder="至少8位，包含字母和数字"
              class="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-black placeholder:text-gray-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-black mb-1.5">确认新密码</label>
            <input
              v-model="confirmPassword"
              type="password"
              required
              placeholder="再次输入新密码"
              class="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-black placeholder:text-gray-500"
            />
          </div>

          <div v-if="errorMessage" class="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p class="text-sm text-red-600">{{ errorMessage }}</p>
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30"
          >
            {{ loading ? '提交中...' : '重置密码' }}
          </button>
        </form>

        <div v-else class="text-center py-6">
          <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h2 class="text-xl font-bold text-black mb-2">密码已重置</h2>
          <p class="text-gray-600 mb-6">请使用新密码重新登录</p>
          <router-link
            to="/login"
            class="inline-block px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg"
          >
            去登录
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { resetPassword, type ResetPasswordDto } from '../api/auth'
import toast from '../composables/useToast'

const route = useRoute()

const formData = ref<ResetPasswordDto>({
  token: '',
  newPassword: ''
})

const confirmPassword = ref('')
const loading = ref(false)
const errorMessage = ref('')
const success = ref(false)

onMounted(() => {
  const token = route.query.token as string
  formData.value.token = token || ''
  if (!token) {
    errorMessage.value = '重置令牌缺失，请重新申请'
  }
})

const handleReset = async () => {
  errorMessage.value = ''

  if (!formData.value.token) {
    errorMessage.value = '重置令牌缺失，请重新申请'
    return
  }

  if (formData.value.newPassword !== confirmPassword.value) {
    errorMessage.value = '两次输入的密码不一致'
    return
  }

  if (
    formData.value.newPassword.length < 8 ||
    !/[A-Za-z]/.test(formData.value.newPassword) ||
    !/[0-9]/.test(formData.value.newPassword)
  ) {
    errorMessage.value = '密码必须至少8位，并包含字母和数字'
    return
  }

  loading.value = true
  try {
    await resetPassword(formData.value)
    success.value = true
    toast.success('密码重置成功')
  } catch (error: unknown) {
    console.error('重置失败:', error)
    const err = error as { response?: { data?: { message?: string } } }
    errorMessage.value = err.response?.data?.message || '重置失败，请稍后重试'
  } finally {
    loading.value = false
  }
}
</script>
