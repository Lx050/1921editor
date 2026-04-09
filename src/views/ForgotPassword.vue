<template>
  <div style="
    min-height:100vh;
    background:var(--color-bg-warm);
    display:flex;
    align-items:center;
    justify-content:center;
    padding:24px;
  ">
    <!-- 忘记密码卡片 -->
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
          <h1 style="font-size:20px; font-weight:700; color:rgba(0,0,0,0.95); margin:0 0 4px; letter-spacing:-0.3px;">忘记密码</h1>
          <p style="font-size:13px; color:var(--color-text-secondary); margin:0;">排版助手 · 个人空间</p>
        </div>

        <!-- 表单 -->
        <form @submit.prevent="handleForgotPassword" style="display:flex; flex-direction:column; gap:16px;">

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

          <!-- 成功提示 -->
          <div v-if="successMessage" style="
            padding:10px 12px;
            background:var(--color-success-light);
            border:1px solid var(--color-success-border);
            border-radius:6px;
            font-size:13px;
            color:var(--color-success);
          ">{{ successMessage }}</div>

          <!-- 错误提示 -->
          <div v-if="error" style="
            padding:10px 12px;
            background:var(--color-error-light);
            border:1px solid var(--color-error-border);
            border-radius:6px;
            font-size:13px;
            color:var(--color-error);
          ">{{ error }}</div>

          <!-- 发送按钮 -->
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
            {{ loading ? '发送中...' : '发送重置邮件' }}
          </button>
        </form>

        <!-- 返回登录 -->
        <p style="text-align:center; font-size:13px; color:var(--color-text-secondary); margin:20px 0 0;">
          记起密码了？
          <router-link to="/login" style="color:var(--color-accent-primary); font-weight:600; text-decoration:none;">返回登录</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { forgotPassword, type ForgotPasswordDto } from '../api/auth'
import toast from '../composables/useToast'
import { useAsyncOp } from '../composables/useAsyncOp'

const formData = ref<ForgotPasswordDto>({
  email: ''
})

const successMessage = ref('')
const { loading, error, run } = useAsyncOp()

const handleForgotPassword = async () => {
  successMessage.value = ''

  await run(async () => {
    try {
      await forgotPassword(formData.value)
      successMessage.value = '如果该邮箱存在，密码重置邮件已发送'
      toast.success('邮件已发送')
    } catch (e: any) {
      console.error('发送失败:', e)
      const msg = e?.response?.data?.message || '发送失败，请稍后重试'
      throw new Error(msg)
    }
  })
}
</script>
