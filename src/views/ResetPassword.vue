<template>
  <div style="
    min-height:100vh;
    background:var(--color-bg-warm);
    display:flex;
    align-items:center;
    justify-content:center;
    padding:24px;
  ">
    <!-- 重置密码卡片 -->
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
          <h1 style="font-size:20px; font-weight:700; color:rgba(0,0,0,0.95); margin:0 0 4px; letter-spacing:-0.3px;">重置密码</h1>
          <p style="font-size:13px; color:var(--color-text-secondary); margin:0;">排版助手 · 个人空间</p>
        </div>

        <!-- 表单 -->
        <form v-if="!success" @submit.prevent="handleReset" style="display:flex; flex-direction:column; gap:16px;">

          <div>
            <label style="display:block; font-size:13px; font-weight:600; color:rgba(0,0,0,0.8); margin-bottom:6px;">新密码</label>
            <input
              v-model="formData.newPassword"
              type="password"
              required
              autocomplete="new-password"
              placeholder="至少8位，包含大小写字母和数字"
              class="notion-input"
              style="font-size:14px; padding:9px 12px;"
            />
          </div>

          <div>
            <label style="display:block; font-size:13px; font-weight:600; color:rgba(0,0,0,0.8); margin-bottom:6px;">确认新密码</label>
            <input
              v-model="confirmPassword"
              type="password"
              required
              autocomplete="new-password"
              placeholder="再次输入新密码"
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

          <!-- 提交按钮 -->
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
            {{ loading ? '提交中...' : '重置密码' }}
          </button>
        </form>

        <!-- 成功状态 -->
        <div v-else style="text-align:center; padding:24px 0;">
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
          <h2 style="font-size:20px; font-weight:700; color:rgba(0,0,0,0.95); margin:0 0 8px; letter-spacing:-0.3px;">密码已重置</h2>
          <p style="font-size:14px; color:var(--color-text-secondary); margin:0 0 24px;">请使用新密码重新登录</p>
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
    !/[A-Z]/.test(formData.value.newPassword) ||
    !/[a-z]/.test(formData.value.newPassword) ||
    !/[0-9]/.test(formData.value.newPassword)
  ) {
    errorMessage.value = '密码必须至少8位，并包含大小写字母和数字'
    return
  }

  loading.value = true
  try {
    await resetPassword(formData.value)
    success.value = true
    toast.success('密码重置成功')
  } catch (error: any) {
    console.error('重置失败:', error)
    errorMessage.value = error.response?.data?.message || '重置失败，请稍后重试'
  } finally {
    loading.value = false
  }
}
</script>
