<template>
  <div style="
    min-height:100vh;
    background:var(--color-bg-warm);
    display:flex;
    align-items:center;
    justify-content:center;
    padding:24px;
  ">
    <!-- 登录卡片 -->
    <div style="width:100%; max-width:380px;">

      <!-- 返回首页 -->
      <router-link
        to="/"
        style="
          display:inline-flex; align-items:center; gap:6px;
          font-size:13px; font-weight:500;
          color:var(--color-text-secondary);
          text-decoration:none;
          margin-bottom:24px;
          transition:color 150ms;
        "
        onmouseover="this.style.color='rgba(0,0,0,0.9)'"
        onmouseout="this.style.color=''"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M9 11L5 7l4-4" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        返回首页
      </router-link>

      <div style="
        background:#fff;
        border:1px solid rgba(0,0,0,0.1);
        border-radius:12px;
        padding:32px;
        box-shadow:var(--shadow-content-card);
      ">
        <!-- 品牌 -->
        <div style="text-align:center; margin-bottom:28px;">
          <div style="
            width:40px; height:40px;
            background:var(--color-accent-primary);
            border-radius:8px;
            display:inline-flex; align-items:center; justify-content:center;
            margin-bottom:12px;
          ">
            <span style="color:#fff; font-weight:700; font-size:20px; font-family:var(--font-display);">B</span>
          </div>
          <h1 style="font-size:20px; font-weight:700; color:rgba(0,0,0,0.95); margin:0 0 4px; letter-spacing:-0.3px;">登录账号</h1>
          <p style="font-size:13px; color:var(--color-text-secondary); margin:0;">排版助手 · 个人空间</p>
        </div>

        <!-- 表单 -->
        <form @submit.prevent="handleLogin" style="display:flex; flex-direction:column; gap:16px;">

          <div>
            <label style="display:block; font-size:13px; font-weight:600; color:rgba(0,0,0,0.8); margin-bottom:6px;">邮箱</label>
            <input
              v-model="formData.email"
              type="email"
              required
              autocomplete="email"
              placeholder="your@email.com"
              class="notion-input"
              style="font-size:14px; padding:9px 12px;"
            />
          </div>

          <div>
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:6px;">
              <label style="font-size:13px; font-weight:600; color:rgba(0,0,0,0.8);">密码</label>
              <a href="/forgot-password" style="font-size:12px; color:var(--color-accent-primary); text-decoration:none;">忘记密码？</a>
            </div>
            <input
              v-model="formData.password"
              type="password"
              required
              autocomplete="current-password"
              placeholder="••••••••"
              class="notion-input"
              style="font-size:14px; padding:9px 12px;"
            />
          </div>

          <!-- 错误提示 -->
          <div v-if="errorMessage" style="
            padding:10px 12px;
            background:var(--color-error-light);
            border:1px solid var(--color-error-border);
            border-radius:6px;
            font-size:13px;
            color:var(--color-error);
          ">{{ errorMessage }}</div>

          <!-- 登录按钮 -->
          <button
            type="submit"
            :disabled="loading"
            style="
              width:100%;
              padding:10px;
              background:var(--color-accent-primary);
              color:#fff;
              border:none;
              border-radius:4px;
              font-size:14px;
              font-weight:600;
              cursor:pointer;
              transition:background 150ms, opacity 150ms;
              margin-top:4px;
            "
            :style="{ opacity: loading ? 0.6 : 1, cursor: loading ? 'not-allowed' : 'pointer' }"
            onmouseover="if(!this.disabled) this.style.background='var(--color-accent-hover)'"
            onmouseout="this.style.background='var(--color-accent-primary)'"
          >
            {{ loading ? '登录中...' : '登录' }}
          </button>
        </form>

        <!-- 注册 -->
        <p style="text-align:center; font-size:13px; color:var(--color-text-secondary); margin:20px 0 0;">
          还没有账号？
          <router-link to="/register" style="color:var(--color-accent-primary); font-weight:600; text-decoration:none;">立即注册</router-link>
        </p>
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

const formData = ref<LoginDto>({ email: '', password: '' })
const loading = ref(false)
const errorMessage = ref('')

const handleLogin = async () => {
  errorMessage.value = ''
  loading.value = true
  try {
    const response = await login(formData.value)
    userStore.setToken(response.accessToken)
    userStore.setUserInfo({
      id: response.user.id,
      email: response.user.email,
      name: response.user.name,
      displayName: response.user.displayName,
      role: response.user.role,
      tenantId: response.user.tenantId,
      emailVerified: response.user.emailVerified
    })
    const tenant = response.tenant || (response.user as any).tenant
    if (tenant) {
      userStore.setCurrentTenant({ id: tenant.id, name: tenant.name, slug: tenant.slug })
    }
    const tenants = response.tenants || []
    userStore.setTenants(tenants)
    toast.success('登录成功')
    if (tenants.length > 1) {
      router.push('/tenant-select')
    } else {
      router.push('/')
    }
  } catch (error: any) {
    errorMessage.value = error.response?.data?.message || '登录失败，请检查邮箱和密码'
  } finally {
    loading.value = false
  }
}
</script>
