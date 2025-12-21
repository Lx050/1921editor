<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-50">
    <div class="text-center">
      <h2 class="text-xl font-semibold mb-2">登录中...</h2>
      <p class="text-gray-500">正在处理飞书授权，请稍候</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '../stores/userStore'
import { tokenStorage } from '../utils/tokenStorage'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

onMounted(() => {
  const token = route.query.token as string
  const state = route.query.state as string // CSRF 保护
  const userInfoStr = route.query.userInfo as string
  const tenantSlug = route.query.tenant as string // 🏢 多租户参数

  // 🔒 安全验证：检查 state 参数防止 CSRF 攻击
  // 注意：如果后端没有传回 state，我们暂时跳过检查（向后兼容）
  const storedState = sessionStorage.getItem('oauth_state')
  if (storedState && state !== storedState) {
    console.error('Invalid state parameter - possible CSRF attack')
    router.replace('/?error=invalid_state')
    return
  }

  // 清除 state
  sessionStorage.removeItem('oauth_state')

  if (token) {
    // 🔒 验证 token 格式
    if (!tokenStorage.isTokenValid(token)) {
      console.error('Invalid token format or expired token')
      router.replace('/?error=invalid_token')
      return
    }

    userStore.setToken(token)

    if (userInfoStr) {
      try {
        // 🔒 安全解析用户信息
        const userInfo = JSON.parse(decodeURIComponent(userInfoStr))
        // 验证用户信息的基本结构
        if (!userInfo.id || !userInfo.name) {
          throw new Error('Invalid user info structure')
        }
        userStore.setUserInfo(userInfo)

        // 🏢 如果用户信息包含租户ID，存储租户信息
        if (userInfo.tenantId) {
          userStore.setCurrentTenant({
            id: userInfo.tenantId,
            name: tenantSlug || 'default',
            slug: tenantSlug || 'default'
          })
        }
      } catch (e) {
        console.error('Failed to parse user info:', e)
        router.replace('/?error=invalid_userinfo')
        return
      }
    }

    // 清除 URL 中的敏感参数
    window.history.replaceState({}, document.title, window.location.pathname)

    // Redirect to home or intended page
    router.replace('/')
  } else {
    // Handle error
    console.error('No token found')
    router.replace('/?error=login_failed')
  }
})
</script>

