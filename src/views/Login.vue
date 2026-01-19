<template>
  <div class="h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 flex items-center justify-center px-4 overflow-hidden text-gray-900">
    <!-- 背景装饰 -->
    <div class="fixed inset-0 -z-10 overflow-hidden">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
    </div>

    <!-- 登录卡片 -->
    <div class="w-full max-w-[400px] relative">
      <div class="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-100/50 p-6 relative overflow-hidden">
        <!-- 右上角关闭按钮 -->
        <router-link
          to="/"
          class="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-600 hover:bg-gray-100/50 rounded-full transition-all duration-200 z-10"
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
          <h1 class="text-xl font-bold text-black mb-0.5">登录账号</h1>
          <p class="text-gray-500 text-xs">Professional Layout Engine</p>
        </div>

        <!-- 表单 -->
        <form @submit.prevent="handleLogin" class="space-y-4">
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

          <!-- 密码 -->
          <div>
            <label class="block text-sm font-medium text-black mb-1.5">密码</label>
            <input
              v-model="formData.password"
              type="password"
              required
              placeholder="••••••••"
              class="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-black placeholder:text-gray-500"
            />
          </div>

          <!-- 记住我 & 忘记密码 -->
          <div class="flex items-center justify-between">
            <label class="flex items-center">
              <input type="checkbox" class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
              <span class="ml-2 text-sm text-gray-600">记住我</span>
            </label>
            <a href="/forgot-password" class="text-sm text-blue-600 hover:text-blue-700">忘记密码？</a>
          </div>

          <!-- 错误提示 -->
          <div v-if="errorMessage" class="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p class="text-sm text-red-600">{{ errorMessage }}</p>
          </div>

          <!-- 登录按钮 -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30"
          >
            {{ loading ? '登录中...' : '登录' }}
          </button>
        </form>

        <!-- 注册链接 -->
        <div class="mt-5 text-center">
          <p class="text-xs text-gray-600">
            还没有账号？
            <router-link to="/register" class="text-blue-600 hover:text-blue-700 font-medium">
              立即注册
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/userStore'
import { login, type LoginDto } from '../api/auth'
import toast from '../composables/useToast'

const router = useRouter()
const userStore = useUserStore()

const formData = ref<LoginDto>({
  email: '',
  password: ''
})

const loading = ref(false)
const errorMessage = ref('')

const handleLogin = async () => {
  errorMessage.value = ''
  loading.value = true

  try {
    const response = await login(formData.value)

    // 保存 token
    userStore.setToken(response.accessToken)

    // 保存用户信息
    userStore.setUserInfo({
      id: response.user.id,
      email: response.user.email,
      name: response.user.name,
      displayName: response.user.displayName,
      role: response.user.role as 'ADMIN' | 'USER',
      tenantId: response.user.tenantId,
      emailVerified: response.user.emailVerified
    })

    // 保存租户信息 - tenant 在根对象或者 user 里（兼容处理）
    type UserWithTenant = (typeof response)['user'] & { tenant?: (typeof response)['tenant'] }
    const userWithTenant = response.user as UserWithTenant
    const tenant = response.tenant || userWithTenant.tenant
    if (tenant) {
      userStore.setCurrentTenant({
        id: tenant.id,
        name: tenant.name,
        slug: tenant.slug
      })
    }

    const tenants = response.tenants || []
    userStore.setTenants(tenants)

    toast.success('登录成功')
    if (tenants.length > 1) {
      router.push('/tenant-select')
    } else {
      router.push('/')
    }
  } catch (error: unknown) {
    console.error('登录失败:', error)
    const err = error as { response?: { data?: { message?: string } } }
    errorMessage.value = err.response?.data?.message || '登录失败，请检查邮箱和密码'
  } finally {
    loading.value = false
  }
}
</script>
