<template>
  <div class="h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 flex items-center justify-center px-4 overflow-hidden text-gray-900">
    <!-- 背景装饰 -->
    <div class="fixed inset-0 -z-10 overflow-hidden">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
    </div>

    <!-- 注册卡片 -->
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
          <h1 class="text-xl font-bold text-black mb-0.5">注册账号</h1>
          <p class="text-gray-500 text-xs">Professional Layout Engine</p>
        </div>

        <!-- 注册方式选择 -->
        <div class="flex bg-gray-100 rounded-xl p-1 mb-4">
          <button
            type="button"
            @click="registerMode = 'join'"
            :class="[
              'flex-1 py-2 text-sm font-medium rounded-lg transition-all',
              registerMode === 'join' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
            ]"
          >
            加入组织
          </button>
          <button
            type="button"
            @click="registerMode = 'create'"
            :class="[
              'flex-1 py-2 text-sm font-medium rounded-lg transition-all',
              registerMode === 'create' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
            ]"
          >
            注册新组织
          </button>
        </div>

        <!-- 表单 -->
        <form @submit.prevent="handleRegister" class="space-y-4">
          <!-- 姓名 -->
          <div>
            <label class="block text-sm font-medium text-black mb-1.5">姓名</label>
            <input
              v-model="formData.name"
              type="text"
              required
              placeholder="您的姓名"
              class="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-black placeholder:text-gray-500"
            />
          </div>

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
              placeholder="至少8位，包含大小写字母和数字"
              class="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-black placeholder:text-gray-500"
            />
            <p class="mt-1 text-xs text-gray-500">至少8位，包含大小写字母和数字</p>
          </div>

          <!-- 确认密码 -->
          <div>
            <label class="block text-sm font-medium text-black mb-1.5">确认密码</label>
            <input
              v-model="confirmPassword"
              type="password"
              required
              placeholder="再次输入密码"
              class="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-black placeholder:text-gray-500"
            />
          </div>

          <!-- 加入组织 -->
          <div v-if="registerMode === 'join'">
            <label class="block text-sm font-medium text-black mb-1.5">企业邀请码</label>
            <input
              v-model="formData.inviteCode"
              type="text"
              required
              placeholder="请输入组织邀请码"
              maxlength="64"
              class="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-black placeholder:text-gray-500"
            />
            <p class="mt-1 text-xs text-gray-500">请联系您的组织管理员获取邀请码</p>
          </div>

          <!-- 创建新组织 -->
          <div v-else class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-black mb-1.5">组织名称</label>
              <input
                v-model="formData.tenantName"
                type="text"
                required
                placeholder="例如：西大青媒"
                class="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-black placeholder:text-gray-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-black mb-1.5">组织标识</label>
              <input
                v-model="formData.tenantSlug"
                type="text"
                required
                placeholder="例如：西大青媒 或 xida-qingmei"
                class="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-black placeholder:text-gray-500"
              />
              <p class="mt-1 text-xs text-gray-500">支持中文、英文、数字和短横线</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-black mb-1.5">公众号 AppID</label>
              <input
                v-model="formData.wechatAppId"
                type="text"
                required
                placeholder="请输入公众号 AppID"
                class="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-black placeholder:text-gray-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-black mb-1.5">公众号 AppSecret</label>
              <input
                v-model="formData.wechatAppSecret"
                type="password"
                required
                placeholder="请输入公众号 AppSecret"
                class="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-black placeholder:text-gray-500"
              />
            </div>
            <p class="text-xs text-gray-500">
              注册成功后您将成为该组织管理员，修改密钥需邮箱确认。
            </p>
          </div>

          <!-- 错误提示 -->
          <div v-if="errorMessage" class="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p class="text-sm text-red-600">{{ errorMessage }}</p>
          </div>

          <!-- 注册按钮 -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30"
          >
            {{ loading ? '注册中...' : registerMode === 'create' ? '创建组织并注册' : '注册' }}
          </button>
        </form>

        <!-- 登录链接 -->
        <div class="mt-5 text-center">
          <p class="text-xs text-gray-600">
            已有账号？
            <router-link to="/login" class="text-blue-600 hover:text-blue-700 font-medium">
              立即登录
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
import { register, type RegisterDto } from '../api/auth'
import toast from '../composables/useToast'

const router = useRouter()
const formData = ref<RegisterDto>({
  email: '',
  password: '',
  name: '',
  inviteCode: '',
  createTenant: false,
  tenantName: '',
  tenantSlug: '',
  wechatAppId: '',
  wechatAppSecret: ''
})

const registerMode = ref<'join' | 'create'>('join')
const confirmPassword = ref('')
const loading = ref(false)
const errorMessage = ref('')

const handleRegister = async () => {
  errorMessage.value = ''

  // 验证密码
  if (formData.value.password !== confirmPassword.value) {
    errorMessage.value = '两次输入的密码不一致'
    return
  }

  // 验证密码强度
  if (formData.value.password.length < 8) {
    errorMessage.value = '密码长度至少8位'
    return
  }

  if (!/[A-Z]/.test(formData.value.password) || !/[a-z]/.test(formData.value.password) || !/[0-9]/.test(formData.value.password)) {
    errorMessage.value = '密码必须包含大小写字母和数字'
    return
  }

  let payload: RegisterDto

  if (registerMode.value === 'join') {
    const inviteCode = formData.value.inviteCode.trim()
    if (!inviteCode) {
      errorMessage.value = '请输入邀请码'
      return
    }
    if (inviteCode.length > 64) {
      errorMessage.value = '邀请码长度不能超过64位'
      return
    }
    payload = {
      email: formData.value.email.trim(),
      password: formData.value.password,
      name: formData.value.name.trim(),
      inviteCode,
      createTenant: false
    }
  } else {
    const tenantName = formData.value.tenantName?.trim() || ''
    const tenantSlugInput = formData.value.tenantSlug?.trim() || tenantName
    const tenantSlug = tenantSlugInput.replace(/\s+/g, '-')
    const wechatAppId = formData.value.wechatAppId?.trim() || ''
    const wechatAppSecret = formData.value.wechatAppSecret?.trim() || ''

    if (!tenantName || !tenantSlug || !wechatAppId || !wechatAppSecret) {
      errorMessage.value = '请填写完整的组织与公众号信息'
      return
    }
    if (!/^[\p{L}\p{N}-]+$/u.test(tenantSlug)) {
      errorMessage.value = '组织标识仅支持中文、英文、数字和短横线'
      return
    }

    payload = {
      email: formData.value.email.trim(),
      password: formData.value.password,
      name: formData.value.name.trim(),
      inviteCode: '',
      createTenant: true,
      tenantName,
      tenantSlug,
      wechatAppId,
      wechatAppSecret
    }
  }

  loading.value = true

  try {
    await register(payload)

    toast.success('注册成功！请查收验证邮件')

    // 注册成功后跳转到登录页面
    // 因为注册后需要验证邮箱才能登录
    router.push('/login?email=' + encodeURIComponent(formData.value.email))
  } catch (error: unknown) {
    console.error('注册失败:', error)
    const errorData = error.response?.data
    const message = Array.isArray(errorData?.errors)
      ? errorData.errors.join('；')
      : Array.isArray(errorData?.message)
      ? errorData.message.join('；')
      : errorData?.message || '注册失败，请检查输入信息'
    errorMessage.value = message
  } finally {
    loading.value = false
  }
}
</script>
