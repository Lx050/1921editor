<template>
  <div style="
    min-height:100vh;
    background:var(--color-bg-warm);
    display:flex;
    align-items:center;
    justify-content:center;
    padding:24px;
  ">
    <!-- 验证邮箱卡片 -->
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
          <h1 style="font-size:20px; font-weight:700; color:rgba(0,0,0,0.95); margin:0 0 4px; letter-spacing:-0.3px;">验证邮箱</h1>
          <p style="font-size:13px; color:var(--color-text-secondary); margin:0;">排版助手 · 个人空间</p>
        </div>

        <!-- 验证中 -->
        <div v-if="loading" style="text-align:center; padding:32px 0;">
          <div style="
            display:inline-block;
            width:40px; height:40px;
            border:3px solid var(--color-accent-focus);
            border-top-color:var(--color-accent-primary);
            border-radius:50%;
            animation:spin 0.8s linear infinite;
            margin-bottom:16px;
          "></div>
          <p style="font-size:14px; font-weight:500; color:var(--color-text-secondary); margin:0;">正在验证...</p>
        </div>

        <!-- 验证成功 -->
        <div v-else-if="success" style="text-align:center; padding:24px 0;">
          <div style="
            width:64px; height:64px;
            background:var(--color-success-light);
            border-radius:50%;
            display:inline-flex; align-items:center; justify-content:center;
            margin-bottom:16px;
          ">
            <svg width="32" height="32" fill="none" stroke="var(--color-success)" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
          </div>
          <h2 style="font-size:20px; font-weight:700; color:rgba(0,0,0,0.95); margin:0 0 8px; letter-spacing:-0.3px;">邮箱验证成功！</h2>
          <p style="font-size:14px; color:var(--color-text-secondary); margin:0 0 24px;">您的邮箱已验证完成，现在可以登录了</p>
          <router-link
            to="/login"
            style="
              display:inline-block;
              padding:10px 24px;
              background:var(--color-accent-primary);
              color:#fff;
              border-radius:4px;
              font-size:14px;
              font-weight:600;
              text-decoration:none;
              transition:background 150ms;
            "
            onmouseover="this.style.background='var(--color-accent-hover)'"
            onmouseout="this.style.background='var(--color-accent-primary)'"
          >
            去登录
          </router-link>
        </div>

        <!-- 验证失败 -->
        <div v-else-if="error" style="text-align:center; padding:24px 0;">
          <div style="
            width:64px; height:64px;
            background:var(--color-error-light);
            border-radius:50%;
            display:inline-flex; align-items:center; justify-content:center;
            margin-bottom:16px;
          ">
            <svg width="32" height="32" fill="none" stroke="var(--color-error)" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </div>
          <h2 style="font-size:20px; font-weight:700; color:rgba(0,0,0,0.95); margin:0 0 8px; letter-spacing:-0.3px;">验证失败</h2>
          <p style="font-size:14px; color:var(--color-text-secondary); margin:0 0 24px;">{{ error }}</p>
          <div style="display:flex; flex-direction:column; align-items:center; gap:12px;">
            <router-link
              to="/register"
              style="
                display:inline-block;
                padding:10px 24px;
                background:var(--color-accent-primary);
                color:#fff;
                border-radius:4px;
                font-size:14px;
                font-weight:600;
                text-decoration:none;
                transition:background 150ms;
              "
              onmouseover="this.style.background='var(--color-accent-hover)'"
              onmouseout="this.style.background='var(--color-accent-primary)'"
            >
              重新注册
            </router-link>
            <p style="font-size:13px; color:var(--color-text-muted); margin:0;">
              或 <a href="mailto:support@example.com" style="color:var(--color-accent-primary); text-decoration:none;">联系客服</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { verifyEmail, type VerifyEmailDto } from '../api/auth'
import toast from '../composables/useToast'

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
