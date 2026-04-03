import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { tokenStorage } from '../utils/tokenStorage'
import { useConfigStore } from './configStore'

export interface TenantInfo {
    id: string
    name: string
    slug: string
    isDefault?: boolean
}

export const useUserStore = defineStore('user', () => {
    // 🔒 使用安全的 token 存储
    const token = ref(tokenStorage.getToken() || '')
    const userInfo = ref(JSON.parse(localStorage.getItem('userInfo') || 'null'))

    // 🏢 多空间支持
    const currentTenant = ref<TenantInfo | null>(
        JSON.parse(localStorage.getItem('currentTenant') || 'null')
    )

    const tenants = ref<TenantInfo[]>(
        JSON.parse(localStorage.getItem('tenants') || '[]')
    )

    const isLoggedIn = computed(() => !!token.value && tokenStorage.isTokenValid(token.value))

    // 判断用户是否为管理员
    const isAdmin = computed(() => userInfo.value?.role === 'ADMIN')

    // 获取用户的空间ID
    const tenantId = computed(() => userInfo.value?.tenantId || currentTenant.value?.id || null)

    const setToken = (newToken: string) => {
        token.value = newToken
        // 🔒 使用安全的 token 存储
        tokenStorage.setToken(newToken)
    }

    const setUserInfo = (info: any) => {
        userInfo.value = info
        // 注意：用户信息不是敏感数据，可以继续使用 localStorage
        // 但在生产环境中应考虑加密存储
        localStorage.setItem('userInfo', JSON.stringify(info))
    }

    // 🏢 设置当前空间
    const setCurrentTenant = (tenant: TenantInfo | null) => {
        currentTenant.value = tenant
        if (tenant) {
            localStorage.setItem('currentTenant', JSON.stringify(tenant))
            try {
                const configStore = useConfigStore()
                configStore.fetchBackendConfig(tenant.id)
            } catch (error) {
                console.error('Failed to sync WeChat config', error)
            }
        } else {
            localStorage.removeItem('currentTenant')
        }
    }

    const setTenants = (list: TenantInfo[]) => {
        tenants.value = list
        localStorage.setItem('tenants', JSON.stringify(list))
    }

    const logout = () => {
        token.value = ''
        userInfo.value = null
        currentTenant.value = null
        tenants.value = []
        // 🔒 使用安全的方法清除认证信息
        tokenStorage.clearAuth()
        localStorage.removeItem('currentTenant')
        localStorage.removeItem('userInfo') // Fix: Explicitly remove userInfo
        localStorage.removeItem('tenants')
    }

    return {
        token,
        userInfo,
        currentTenant,
        tenants,
        tenantId,
        isLoggedIn,
        isAdmin,
        setToken,
        setUserInfo,
        setCurrentTenant,
        setTenants,
        logout
    }
})
