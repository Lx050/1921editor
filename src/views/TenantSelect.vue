<template>
  <div style="
    min-height:100vh;
    background:var(--color-bg-warm);
    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content:flex-start;
    padding:48px 24px;
  ">
    <div style="width:100%; max-width:440px;">

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

      <!-- 标题区域 -->
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
        <h1 style="font-size:20px; font-weight:700; color:rgba(0,0,0,0.95); margin:0 0 4px; letter-spacing:-0.3px;">选择空间</h1>
        <p style="font-size:13px; color:var(--color-text-secondary); margin:0;">排版助手 · 切换工作空间</p>
      </div>

      <!-- 主卡片 -->
      <div style="
        background:#fff;
        border:1px solid rgba(0,0,0,0.1);
        border-radius:12px;
        box-shadow:var(--shadow-content-card);
        overflow:hidden;
      ">

        <!-- 搜索 + 加入空间 -->
        <div style="padding:20px 20px 16px; border-bottom:1px solid rgba(0,0,0,0.07);">
          <!-- 搜索输入 -->
          <div style="position:relative; margin-bottom:12px;">
            <span style="
              position:absolute; top:50%; left:10px; transform:translateY(-50%);
              display:flex; align-items:center; pointer-events:none;
              color:var(--color-text-muted);
            ">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </span>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="搜索空间名称或标识..."
              class="notion-input"
              style="padding-left:32px;"
            />
          </div>

          <!-- 加入空间 -->
          <div style="display:flex; flex-direction:column; gap:8px;">
            <input
              v-model="displayNameInput"
              type="text"
              placeholder="填写加入该空间的显示名称"
              class="notion-input"
            />
            <div style="display:flex; align-items:center; gap:8px;">
              <input
                v-model="inviteCodeInput"
                type="text"
                placeholder="输入加入码加入空间"
                class="notion-input"
                style="flex:1;"
              />
              <button
                @click="handleJoinTenant"
                :disabled="!inviteCodeInput || !displayNameInput || isJoining"
                style="
                  padding:8px 16px;
                  background:var(--color-accent-primary);
                  color:#fff;
                  font-size:13px;
                  font-weight:600;
                  border:none;
                  border-radius:8px;
                  cursor:pointer;
                  white-space:nowrap;
                  transition:background 150ms;
                  flex-shrink:0;
                "
                onmouseover="if(!this.disabled) this.style.background='var(--color-accent-hover)'"
                onmouseout="if(!this.disabled) this.style.background='var(--color-accent-primary)'"
              >
                {{ isJoining ? '加入中...' : '加入' }}
              </button>
            </div>
          </div>
        </div>

        <!-- 列表区域 -->
        <div style="max-height:400px; overflow-y:auto; padding:16px 20px 20px;">

          <!-- 当前空间提示 -->
          <div v-if="currentTenant" style="
            background:var(--color-badge-bg);
            border:1px solid rgba(0,117,222,0.15);
            border-radius:8px;
            padding:10px 14px;
            margin-bottom:16px;
            display:flex;
            align-items:center;
            justify-content:space-between;
            font-size:12px;
            color:var(--color-badge-text);
          ">
            <span>当前空间：{{ currentTenant.name }}</span>
            <span style="font-weight:600;">{{ currentTenant.slug }}</span>
          </div>

          <!-- 常用 (默认空间置顶) -->
          <div v-if="!searchQuery && defaultTenant" style="margin-bottom:16px;">
            <div style="
              font-size:11px;
              font-weight:600;
              color:rgba(0,0,0,0.4);
              text-transform:uppercase;
              letter-spacing:0.08em;
              margin-bottom:6px;
              padding:0 2px;
            ">常用</div>
            <div
              @click="selectTenant(defaultTenant)"
              style="
                position:relative;
                background:#fff;
                border:1px solid rgba(0,0,0,0.1);
                border-radius:10px;
                padding:14px;
                cursor:pointer;
                display:flex;
                align-items:center;
                gap:12px;
                transition:background 120ms;
              "
              onmouseover="this.style.background='rgba(0,0,0,0.02)'"
              onmouseout="this.style.background='#fff'"
            >
              <span
                v-if="isCurrentTenant(defaultTenant)"
                style="
                  position:absolute; right:12px; top:12px;
                  font-size:10px; font-weight:700;
                  color:var(--color-badge-text);
                  background:var(--color-badge-bg);
                  padding:2px 8px;
                  border-radius:20px;
                  border:1px solid rgba(0,117,222,0.15);
                "
              >当前</span>
              <div :style="getAvatarInlineStyle(defaultTenant.name)" style="
                flex-shrink:0;
                width:40px; height:40px;
                border-radius:10px;
                display:flex; align-items:center; justify-content:center;
                font-size:16px; font-weight:700;
              ">
                {{ defaultTenant.name.charAt(0) }}
              </div>
              <div style="flex:1; min-width:0;">
                <div style="font-size:14px; font-weight:600; color:rgba(0,0,0,0.9); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
                  {{ defaultTenant.name }}
                </div>
                <div style="font-size:11px; color:var(--color-text-muted); margin-top:2px; text-transform:lowercase;">
                  {{ defaultTenant.slug }}
                </div>
              </div>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:rgba(0,0,0,0.25); flex-shrink:0;">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </div>
          </div>

          <!-- 所有空间 / 搜索结果 -->
          <div>
            <div style="
              font-size:11px;
              font-weight:600;
              color:rgba(0,0,0,0.4);
              text-transform:uppercase;
              letter-spacing:0.08em;
              margin-bottom:6px;
              padding:0 2px;
            ">{{ searchQuery ? '搜索结果' : '所有空间' }}</div>

            <!-- 加载骨架 -->
            <div v-if="loading" style="display:flex; flex-direction:column; gap:8px;">
              <div
                v-for="i in 3"
                :key="i"
                style="
                  height:64px;
                  background:rgba(0,0,0,0.05);
                  border-radius:10px;
                  animation:pulse 1.5s ease-in-out infinite;
                "
              ></div>
            </div>

            <!-- 空结果 -->
            <div v-else-if="filteredTenants.length === 0" style="
              padding:40px 0;
              text-align:center;
              font-size:13px;
              color:var(--color-text-muted);
            ">
              未能找到匹配的空间
            </div>

            <!-- 租户列表 -->
            <div v-else style="display:flex; flex-direction:column; gap:8px;">
              <div
                v-for="(tenant, index) in filteredTenants"
                :key="tenant.id"
                @click="selectTenant(tenant)"
                style="
                  position:relative;
                  background:#fff;
                  border:1px solid rgba(0,0,0,0.1);
                  border-radius:10px;
                  padding:12px 14px;
                  cursor:pointer;
                  display:flex;
                  align-items:center;
                  gap:12px;
                  transition:background 120ms;
                "
                :style="{ animationDelay: `${index * 50}ms` }"
                onmouseover="this.style.background='rgba(0,0,0,0.02)'"
                onmouseout="this.style.background='#fff'"
              >
                <!-- 徽章区 -->
                <div style="position:absolute; right:12px; top:12px; display:flex; align-items:center; gap:6px;">
                  <span
                    v-if="isCurrentTenant(tenant)"
                    style="
                      font-size:10px; font-weight:700;
                      color:var(--color-badge-text);
                      background:var(--color-badge-bg);
                      padding:2px 8px;
                      border-radius:20px;
                      border:1px solid rgba(0,117,222,0.15);
                    "
                  >当前</span>
                  <button
                    v-if="!tenant.isDefault"
                    @click.stop="handleLeaveTenant(tenant)"
                    style="
                      font-size:10px; font-weight:600;
                      color:#e53e3e;
                      background:#fff5f5;
                      border:1px solid rgba(229,62,62,0.2);
                      padding:2px 8px;
                      border-radius:20px;
                      cursor:pointer;
                      transition:background 120ms;
                    "
                    onmouseover="this.style.background='#fed7d7'"
                    onmouseout="this.style.background='#fff5f5'"
                  >退出</button>
                </div>

                <!-- 头像 -->
                <div :style="getAvatarInlineStyle(tenant.name)" style="
                  flex-shrink:0;
                  width:38px; height:38px;
                  border-radius:9px;
                  display:flex; align-items:center; justify-content:center;
                  font-size:15px; font-weight:700;
                ">
                  {{ tenant.name.charAt(0) }}
                </div>

                <!-- 名称 + slug -->
                <div style="flex:1; min-width:0; padding-right:60px;">
                  <div style="font-size:14px; font-weight:600; color:rgba(0,0,0,0.88); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
                    {{ tenant.name }}
                  </div>
                  <div style="font-size:11px; color:var(--color-text-muted); margin-top:2px; text-transform:lowercase;">
                    {{ tenant.slug }}
                  </div>
                </div>

                <!-- 箭头 -->
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:rgba(0,0,0,0.2); flex-shrink:0;">
                  <path d="M9 18l6-6-6-6"/>
                </svg>
              </div>
            </div>
          </div>

        </div>

        <!-- 底部提示 -->
        <div style="
          padding:14px 20px;
          border-top:1px solid rgba(0,0,0,0.07);
          background:rgba(0,0,0,0.01);
        ">
          <p style="font-size:11px; color:var(--color-text-muted); text-align:center; margin:0; line-height:1.6;">
            找不到所属空间？请联系管理员或访问
            <a href="#" style="color:var(--color-accent-primary); font-weight:500; text-decoration:none;">帮助中心</a>
          </p>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { showConfirm } from '@/composables/useConfirm'
import { useUserStore } from '../stores/userStore'
import { listTenants, switchTenant, joinTenant, leaveTenant, type TenantInfo } from '../api/auth'
import toast from '../composables/useToast'

const router = useRouter()
const userStore = useUserStore()
const tenants = computed(() => userStore.tenants || [])
const loading = ref(true)
const error = ref<string | null>(null)
const searchQuery = ref('')
const inviteCodeInput = ref('')
const displayNameInput = ref('')
const isJoining = ref(false)
const isLeaving = ref(false)

// 空间列表头像样式
const avatarStyles = [
  'bg-indigo-100 text-indigo-600',
  'bg-emerald-100 text-emerald-600',
  'bg-amber-100 text-amber-600',
  'bg-rose-100 text-rose-600',
  'bg-violet-100 text-violet-600',
  'bg-cyan-100 text-cyan-600'
]

const getAvatarStyles = (name: string) => {
  const index = name.length % avatarStyles.length
  return avatarStyles[index]
}

// 头像内联样式（对应原 Tailwind 颜色，转为 inline styles）
const avatarInlineStyles = [
  { background: '#e0e7ff', color: '#4f46e5' },
  { background: '#d1fae5', color: '#059669' },
  { background: '#fef3c7', color: '#d97706' },
  { background: '#ffe4e6', color: '#e11d48' },
  { background: '#ede9fe', color: '#7c3aed' },
  { background: '#cffafe', color: '#0891b2' },
]

const getAvatarInlineStyle = (name: string) => {
  const index = name.length % avatarInlineStyles.length
  return avatarInlineStyles[index]
}

// 空间检索过滤
const defaultTenant = computed(() => {
  return tenants.value.find(t => t.isDefault) || tenants.value.find(t => t.slug === 'default') || null
})

const currentTenant = computed(() => {
  if (userStore.currentTenant?.id) return userStore.currentTenant
  const idFromUser = userStore.userInfo?.tenantId
  return tenants.value.find(t => t.id === idFromUser) || defaultTenant.value || null
})

const isCurrentTenant = (tenant: TenantInfo | null) => {
  if (!tenant) return false
  return currentTenant.value?.id === tenant.id
}

const filteredTenants = computed(() => {
  const baseTenants = searchQuery.value
    ? tenants.value
    : tenants.value.filter(t => !defaultTenant.value || t.id !== defaultTenant.value.id)
  if (!searchQuery.value) return baseTenants
  const query = searchQuery.value.toLowerCase()
  return baseTenants.filter(t =>
    t.name.toLowerCase().includes(query) ||
    t.slug.toLowerCase().includes(query)
  )
})

const loadTenants = async () => {
  loading.value = true
  error.value = null

  try {
    const response = await listTenants()
    userStore.setTenants(response.tenants || [])
  } catch (e) {
    error.value = '加载空间列表失败，请重试'
    console.error('Failed to load tenants:', e)
  } finally {
    loading.value = false
  }
}

const selectTenant = async (tenant: TenantInfo | null) => {
  if (!tenant) return
  if ('vibrate' in navigator) navigator.vibrate(10)
  try {
    const response = await switchTenant({ tenantId: tenant.id })
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
    userStore.setCurrentTenant({
      id: response.tenant.id,
      name: response.tenant.name,
      slug: response.tenant.slug
    })
    userStore.setTenants(response.tenants || [])
    toast.success(`已切换至 ${response.tenant.name}`)
    router.push('/step1')
  } catch (e) {
    console.error('Failed to switch tenant:', e)
    error.value = '切换空间失败，请重试'
  }
}

const handleJoinTenant = async () => {
  if (!inviteCodeInput.value || !displayNameInput.value) {
    toast.warning('请输入加入码和显示名称')
    return
  }
  if (isJoining.value) return

  isJoining.value = true
  try {
    const response = await joinTenant({
      inviteCode: inviteCodeInput.value.trim(),
      displayName: displayNameInput.value.trim()
    })
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
    userStore.setCurrentTenant({
      id: response.tenant.id,
      name: response.tenant.name,
      slug: response.tenant.slug
    })
    userStore.setTenants(response.tenants || [])
    inviteCodeInput.value = ''
    displayNameInput.value = ''
    toast.success(`已加入并切换至 ${response.tenant.name}`)
    router.push('/step1')
  } catch (e) {
    console.error('Failed to join tenant:', e)
    toast.error('加入空间失败，请检查加入码')
  } finally {
    isJoining.value = false
  }
}

const handleLeaveTenant = async (tenant: TenantInfo) => {
  if (tenant.isDefault) {
    toast.warning('默认空间不可退出')
    return
  }
  if (isLeaving.value) return
  const confirmed = await showConfirm({ message: `确定要退出「${tenant.name}」吗？`, type: 'warning' })
  if (!confirmed) return

  isLeaving.value = true
  try {
    const response = await leaveTenant({ tenantId: tenant.id })
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
    userStore.setCurrentTenant({
      id: response.tenant.id,
      name: response.tenant.name,
      slug: response.tenant.slug
    })
    userStore.setTenants(response.tenants || [])
    toast.success('已退出空间')
  } catch (e) {
    console.error('Failed to leave tenant:', e)
    toast.error('退出空间失败，请稍后再试')
  } finally {
    isLeaving.value = false
  }
}

onMounted(() => {
  if (!userStore.isLoggedIn) {
    router.push('/login')
    return
  }
  loadTenants()
})
</script>

<style scoped>
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.45; }
}

/* 隐藏滚动条但保留滚动 */
div[style*="overflow-y:auto"],
div[style*="overflow-y: auto"] {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
div[style*="overflow-y:auto"]::-webkit-scrollbar,
div[style*="overflow-y: auto"]::-webkit-scrollbar {
  display: none;
}
</style>
