<template>
  <div style="
    min-height:100vh;
    background:var(--color-bg-warm);
    display:flex;
    align-items:flex-start;
    justify-content:center;
    padding:32px 24px;
  ">
    <div style="width:100%; max-width:420px;">

      <!-- 返回 -->
      <router-link
        to="/"
        style="
          display:inline-flex; align-items:center; gap:6px;
          font-size:13px; font-weight:500;
          color:var(--color-text-secondary);
          text-decoration:none;
          margin-bottom:20px;
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
        padding:28px 32px;
        box-shadow:var(--shadow-content-card);
      ">
        <!-- 品牌 -->
        <div style="text-align:center; margin-bottom:24px;">
          <div style="
            width:40px; height:40px;
            background:var(--color-accent-primary);
            border-radius:8px;
            display:inline-flex; align-items:center; justify-content:center;
            margin-bottom:12px;
          ">
            <span style="color:#fff; font-weight:700; font-size:20px; font-family:var(--font-display);">B</span>
          </div>
          <h1 style="font-size:20px; font-weight:700; color:rgba(0,0,0,0.95); margin:0 0 4px; letter-spacing:-0.3px;">创建账号</h1>
          <p style="font-size:13px; color:var(--color-text-secondary); margin:0;">排版助手 · 开始使用</p>
        </div>

        <!-- 注册模式切换 -->
        <div style="
          display:flex;
          background:var(--color-bg-warm);
          border:1px solid rgba(0,0,0,0.1);
          border-radius:6px;
          padding:3px;
          margin-bottom:20px;
          gap:2px;
        ">
          <button
            type="button"
            @click="registerMode = 'join'"
            :style="{
              flex: '1',
              padding: '6px 12px',
              fontSize: '13px',
              fontWeight: '600',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              transition: 'all 150ms',
              background: registerMode === 'join' ? '#fff' : 'transparent',
              color: registerMode === 'join' ? 'rgba(0,0,0,0.95)' : 'var(--color-text-secondary)',
              boxShadow: registerMode === 'join' ? 'rgba(0,0,0,0.08) 0px 1px 4px' : 'none',
            }"
          >加入空间</button>
          <button
            type="button"
            @click="registerMode = 'create'"
            :style="{
              flex: '1',
              padding: '6px 12px',
              fontSize: '13px',
              fontWeight: '600',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              transition: 'all 150ms',
              background: registerMode === 'create' ? '#fff' : 'transparent',
              color: registerMode === 'create' ? 'rgba(0,0,0,0.95)' : 'var(--color-text-secondary)',
              boxShadow: registerMode === 'create' ? 'rgba(0,0,0,0.08) 0px 1px 4px' : 'none',
            }"
          >创建空间</button>
        </div>

        <!-- 表单 -->
        <form @submit.prevent="handleRegister" style="display:flex; flex-direction:column; gap:14px;">

          <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
            <div>
              <label class="form-label">姓名</label>
              <input v-model="formData.name" type="text" required autocomplete="name" placeholder="您的姓名" class="notion-input" style="font-size:14px; padding:8px 12px;" />
            </div>
            <div>
              <label class="form-label">邮箱</label>
              <input v-model="formData.email" type="email" required autocomplete="email" placeholder="your@email.com" class="notion-input" style="font-size:14px; padding:8px 12px;" />
            </div>
          </div>

          <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
            <div>
              <label class="form-label">密码</label>
              <input v-model="formData.password" type="password" required autocomplete="new-password" placeholder="至少8位" class="notion-input" style="font-size:14px; padding:8px 12px;" />
            </div>
            <div>
              <label class="form-label">确认密码</label>
              <input v-model="confirmPassword" type="password" required autocomplete="new-password" placeholder="再次输入" class="notion-input" style="font-size:14px; padding:8px 12px;" />
            </div>
          </div>
          <p style="font-size:12px; color:var(--color-text-muted); margin:-8px 0 0;">密码需至少8位，包含大小写字母和数字</p>

          <!-- 加入空间 -->
          <div v-if="registerMode === 'join'">
            <label class="form-label">加入码</label>
            <input v-model="formData.inviteCode" type="text" required placeholder="请输入空间加入码" maxlength="64" class="notion-input" style="font-size:14px; padding:8px 12px;" />
            <p style="font-size:12px; color:var(--color-text-muted); margin-top:4px;">请联系管理员获取加入码</p>
          </div>

          <!-- 创建空间 -->
          <template v-else>
            <div style="
              background:var(--color-bg-warm);
              border:1px solid rgba(0,0,0,0.08);
              border-radius:8px;
              padding:16px;
              display:flex;
              flex-direction:column;
              gap:12px;
            ">
              <p style="font-size:12px; font-weight:600; color:rgba(0,0,0,0.5); text-transform:uppercase; letter-spacing:0.06em; margin:0;">空间信息</p>
              <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
                <div>
                  <label class="form-label">空间名称</label>
                  <input v-model="formData.tenantName" type="text" required placeholder="例如：我的团队" class="notion-input" style="font-size:13px; padding:7px 10px;" />
                </div>
                <div>
                  <label class="form-label">空间标识</label>
                  <input v-model="formData.tenantSlug" type="text" required placeholder="my-team" class="notion-input" style="font-size:13px; padding:7px 10px;" />
                </div>
              </div>
              <div>
                <label class="form-label">公众号 AppID</label>
                <input v-model="formData.wechatAppId" type="text" required placeholder="wxXXXXXXXXXXXX" class="notion-input" style="font-size:13px; padding:7px 10px;" />
              </div>
              <div>
                <label class="form-label">公众号 AppSecret</label>
                <input v-model="formData.wechatAppSecret" type="password" required autocomplete="off" placeholder="XXXXXXXXXXXXXXXXX" class="notion-input" style="font-size:13px; padding:7px 10px;" />
              </div>
            </div>
          </template>

          <!-- 错误提示 -->
          <div v-if="errorMessage" style="
            padding:10px 12px;
            background:var(--color-error-light);
            border:1px solid var(--color-error-border);
            border-radius:6px;
            font-size:13px;
            color:var(--color-error);
          ">{{ errorMessage }}</div>

          <!-- 注册按钮 -->
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
              transition:background 150ms;
              margin-top:4px;
            "
            :style="{ opacity: loading ? 0.6 : 1 }"
            onmouseover="if(!this.disabled) this.style.background='var(--color-accent-hover)'"
            onmouseout="this.style.background='var(--color-accent-primary)'"
          >
            {{ loading ? '注册中...' : registerMode === 'create' ? '创建空间并注册' : '注册账号' }}
          </button>
        </form>

        <!-- 登录链接 -->
        <p style="text-align:center; font-size:13px; color:var(--color-text-secondary); margin:18px 0 0;">
          已有账号？
          <router-link to="/login" style="color:var(--color-accent-primary); font-weight:600; text-decoration:none;">立即登录</router-link>
        </p>
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
  email: '', password: '', name: '',
  inviteCode: '', createTenant: false,
  tenantName: '', tenantSlug: '',
  wechatAppId: '', wechatAppSecret: ''
})

const registerMode = ref<'join' | 'create'>('join')
const confirmPassword = ref('')
const loading = ref(false)
const errorMessage = ref('')

const handleRegister = async () => {
  errorMessage.value = ''
  if (formData.value.password !== confirmPassword.value) {
    errorMessage.value = '两次输入的密码不一致'
    return
  }
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
    if (!inviteCode) { errorMessage.value = '请输入加入码'; return }
    payload = {
      email: formData.value.email.trim(), password: formData.value.password,
      name: formData.value.name.trim(), inviteCode, createTenant: false
    }
  } else {
    const tenantName = formData.value.tenantName?.trim() || ''
    const tenantSlug = (formData.value.tenantSlug?.trim() || tenantName).replace(/\s+/g, '-')
    const wechatAppId = formData.value.wechatAppId?.trim() || ''
    const wechatAppSecret = formData.value.wechatAppSecret?.trim() || ''
    if (!tenantName || !tenantSlug || !wechatAppId || !wechatAppSecret) {
      errorMessage.value = '请填写完整的空间与公众号信息'; return
    }
    if (!/^[\p{L}\p{N}-]+$/u.test(tenantSlug)) {
      errorMessage.value = '空间标识仅支持中文、英文、数字和短横线'; return
    }
    payload = {
      email: formData.value.email.trim(), password: formData.value.password,
      name: formData.value.name.trim(), inviteCode: '', createTenant: true,
      tenantName, tenantSlug, wechatAppId, wechatAppSecret
    }
  }

  loading.value = true
  try {
    await register(payload)
    toast.success('注册成功！请查收验证邮件')
    router.push('/login?email=' + encodeURIComponent(formData.value.email))
  } catch (error: any) {
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

<style scoped>
.form-label {
  display: block;
  font-size: 12px;
  font-weight: 600;
  color: rgba(0,0,0,0.65);
  margin-bottom: 5px;
}
</style>
