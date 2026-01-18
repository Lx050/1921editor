<template>
  <div class="min-h-screen bg-slate-50 md:bg-gradient-to-br md:from-indigo-50 md:to-blue-100 flex flex-col justify-start md:justify-center p-0 md:py-12 md:px-4 sm:px-6 lg:px-8">
    <div class="max-w-md mx-auto w-full flex-1 md:flex-initial flex flex-col">
      
      <!-- 移动端顶部状态栏背景 (仅移动端) -->
      <div class="md:hidden bg-white px-6 pt-8 pb-4 border-b border-slate-100">
        <h1 class="text-2xl font-bold text-slate-900">选择组织</h1>
        <p class="text-sm text-slate-500">登录排版引擎以继续</p>
      </div>

      <!-- 桌面端标题 (仅桌面端) -->
      <div class="hidden md:block text-center mb-8">
        <h1 class="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">排版引擎</h1>
        <p class="text-slate-600 font-medium">选择您的组织空间</p>
      </div>

      <!-- 主体列表区域 -->
      <div class="bg-white md:shadow-2xl md:rounded-3xl flex-1 md:flex-initial overflow-hidden flex flex-col border-none md:border md:border-white/20">
        
        <!-- 搜索栏 + 加入组织 -->
        <div class="p-4 md:p-6 pb-3 border-b border-slate-50 space-y-3">
          <div class="relative group">
            <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input 
              v-model="searchQuery"
              type="text" 
              placeholder="搜索组织名称或标识..."
              class="block w-full pl-10 pr-3 py-2.5 bg-slate-50 border-transparent focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 rounded-xl text-sm transition-all outline-none"
            >
          </div>
          <div class="space-y-2">
            <input
              v-model="displayNameInput"
              type="text"
              placeholder="填写加入该组织的显示名称"
              class="w-full px-3 py-2.5 bg-slate-50 border border-transparent focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 rounded-xl text-sm transition-all outline-none"
            />
            <div class="flex items-center gap-2">
              <input
                v-model="inviteCodeInput"
                type="text"
                placeholder="输入邀请码加入组织"
                class="flex-1 px-3 py-2.5 bg-slate-50 border border-transparent focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 rounded-xl text-sm transition-all outline-none"
              />
              <button
                @click="handleJoinTenant"
                :disabled="!inviteCodeInput || !displayNameInput || isJoining"
                class="px-4 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl transition-all hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ isJoining ? '加入中...' : '加入' }}
              </button>
            </div>
          </div>
        </div>

        <div class="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
          <!-- 当前组织提示 -->
          <div v-if="currentTenant" class="rounded-2xl border border-blue-100 bg-blue-50/60 px-4 py-3 text-xs text-blue-700 flex items-center justify-between">
            <span>当前组织：{{ currentTenant.name }}</span>
            <span class="font-semibold">{{ currentTenant.slug }}</span>
          </div>
          
          <!-- 默认组织 (置顶显示) -->
          <div v-if="!searchQuery && defaultTenant" class="space-y-2">
            <h3 class="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">常用</h3>
            <div
              @click="selectTenant(defaultTenant)"
              class="relative bg-blue-50/50 border border-blue-100 rounded-2xl p-4 cursor-pointer transition-all active:scale-[0.98] md:hover:shadow-lg md:hover:shadow-blue-500/10 md:hover:-translate-y-0.5 group"
            >
              <span
                v-if="isCurrentTenant(defaultTenant)"
                class="absolute right-3 top-3 text-[10px] font-bold text-blue-600 bg-white px-2 py-0.5 rounded-full border border-blue-200"
              >
                当前
              </span>
              <div class="flex items-center space-x-4">
                <div class="flex-shrink-0 h-12 w-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
                  <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div class="flex-1 min-w-0">
                  <h3 class="text-[15px] font-bold text-slate-900 truncate">{{ defaultTenant.name }}</h3>
                  <p class="text-xs text-blue-600 font-medium">{{ defaultTenant.slug }}</p>
                </div>
                <div class="h-8 w-8 rounded-full bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg class="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <!-- 动态组织列表 -->
          <div class="space-y-2">
            <h3 class="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">
              {{ searchQuery ? '搜索结果' : '所有组织' }}
            </h3>
            
            <!-- 加载状态 -->
            <div v-if="loading" class="space-y-3">
              <div v-for="i in 3" :key="i" class="h-20 bg-slate-50 animate-pulse rounded-2xl"></div>
            </div>

            <!-- 空结果状态 -->
            <div v-else-if="filteredTenants.length === 0" class="py-12 text-center">
              <div class="mb-4 text-4xl">🔍</div>
              <p class="text-sm text-slate-500 font-medium">未能找到匹配的组织</p>
            </div>

            <!-- 列表渲染 -->
            <div v-else class="space-y-3">
              <div
                v-for="(tenant, index) in filteredTenants"
                :key="tenant.id"
                @click="selectTenant(tenant)"
                class="bg-white border border-slate-100 rounded-2xl p-4 cursor-pointer transition-all active:scale-[0.98] md:hover:border-blue-200 md:hover:shadow-xl md:hover:shadow-slate-200/50 md:hover:-translate-y-0.5 group animate-in fade-in slide-in-from-bottom-2 relative"
                :style="{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }"
              >
                <div class="absolute right-3 top-3 flex items-center gap-2">
                  <span
                    v-if="isCurrentTenant(tenant)"
                    class="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100"
                  >
                    当前
                  </span>
                  <button
                    v-if="!tenant.isDefault"
                    @click.stop="handleLeaveTenant(tenant)"
                    class="text-[10px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full border border-red-100 hover:bg-red-100"
                  >
                    退出
                  </button>
                </div>
                <div class="flex items-center space-x-4">
                  <div 
                    class="flex-shrink-0 h-12 w-12 rounded-xl flex items-center justify-center text-lg font-bold shadow-sm transition-transform group-hover:scale-110"
                    :class="getAvatarStyles(tenant.name)"
                  >
                    {{ tenant.name.charAt(0) }}
                  </div>
                  <div class="flex-1 min-w-0">
                    <h3 class="text-[15px] font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                      {{ tenant.name }}
                    </h3>
                    <p class="text-[11px] text-slate-400 font-medium uppercase tracking-tighter">{{ tenant.slug }}</p>
                  </div>
                  <svg class="h-4 w-4 text-slate-300 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 底部信息 -->
        <div class="p-6 bg-slate-50/50 border-t border-slate-50 mt-auto md:mt-0">
          <p class="text-[11px] text-slate-400 text-center leading-relaxed">
            找不到所属组织？请联系系统管理员 
            <br class="md:hidden" />
            或访问 <a href="#" class="text-blue-500 font-semibold hover:underline">帮助中心</a>
          </p>
        </div>
      </div>

      <!-- 返回链接 (移动端隐藏，由于顶部已有标题) -->
      <div class="hidden md:block mt-8 text-center pb-8">
        <router-link to="/" class="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          返回首页
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
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

// 模拟组织列表样式
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

// 组织检索过滤
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
    error.value = '加载组织列表失败，请重试'
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
      role: response.user.role as 'ADMIN' | 'USER',
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
    router.push('/')
  } catch (e) {
    console.error('Failed to switch tenant:', e)
    error.value = '切换组织失败，请重试'
  }
}

const handleJoinTenant = async () => {
  if (!inviteCodeInput.value || !displayNameInput.value) {
    toast.warning('请输入邀请码和显示名称')
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
      role: response.user.role as 'ADMIN' | 'USER',
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
    router.push('/')
  } catch (e) {
    console.error('Failed to join tenant:', e)
    toast.error('加入组织失败，请检查邀请码')
  } finally {
    isJoining.value = false
  }
}

const handleLeaveTenant = async (tenant: TenantInfo) => {
  if (tenant.isDefault) {
    toast.warning('默认组织不可退出')
    return
  }
  if (isLeaving.value) return
  const confirmed = confirm(`确定要退出「${tenant.name}」吗？`)
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
      role: response.user.role as 'ADMIN' | 'USER',
      tenantId: response.user.tenantId,
      emailVerified: response.user.emailVerified
    })
    userStore.setCurrentTenant({
      id: response.tenant.id,
      name: response.tenant.name,
      slug: response.tenant.slug
    })
    userStore.setTenants(response.tenants || [])
    toast.success('已退出组织')
  } catch (e) {
    console.error('Failed to leave tenant:', e)
    toast.error('退出组织失败，请稍后再试')
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
/* 自定义列表动画 */
@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-in {
  animation: slideInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

/* 隐藏滚动条但保留滚动 */
.overflow-y-auto {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.overflow-y-auto::-webkit-scrollbar {
  display: none;
}
</style>
