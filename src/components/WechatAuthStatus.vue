<template>
  <div class="wechat-auth-status">
    <!-- 已授权状态 -->
    <div v-if="isLoggedIn" class="logged-in">
      <div class="user-info">
        <img :src="userInfo.avatar || '/icons/default-avatar.png'" alt="用户头像" class="avatar" />
        <div class="info">
          <div class="name">{{ userInfo.name || '微信用户' }}</div>
          <div class="status" :class="authStatus.class">
            {{ authStatus.text }}
          </div>
        </div>
      </div>

      <!-- 重新授权提醒 -->
      <div v-if="needsReauth" class="reauth-warning">
        <p class="warning-text">
          ⚠️ 微信授权即将过期，请重新授权以继续使用
        </p>
        <button @click="reauthorize" class="reauth-btn">
          重新授权
        </button>
      </div>
    </div>

    <!-- 未授权状态 -->
    <div v-else class="not-logged-in">
      <button @click="login" class="login-btn">
        <img src="/icons/wechat.svg" alt="" class="wechat-icon" />
        微信登录
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { wechatTokenManager } from '../services/wechatTokenManager';
import { showAlert } from '@/composables/useConfirm';

const isLoggedIn = ref(false);
const userInfo = ref({
  name: '',
  avatar: '',
  openid: '',
});

// 计算授权状态
const authStatus = computed(() => {
  if (!isLoggedIn.value) {
    return { text: '未登录', class: 'not-logged-in' };
  }

  const remainingTime = wechatTokenManager.getRefreshTokenRemainingTime(userInfo.value.openid);

  if (remainingTime === 0) {
    return { text: '授权已过期', class: 'expired' };
  } else if (remainingTime < 3 * 24 * 60 * 60 * 1000) {
    return { text: '即将过期', class: 'expiring-soon' };
  } else {
    return { text: '授权正常', class: 'valid' };
  }
});

// 是否需要重新授权
const needsReauth = computed(() => {
  return isLoggedIn.value && wechatTokenManager.needsReauthorization(userInfo.value.openid);
});

// 微信登录
async function login() {
  try {
    // 构建微信授权URL
    const authUrl = await buildWechatAuthUrl();

    // 跳转到微信授权页面
    window.location.href = authUrl;

  } catch (error) {
    console.error('微信登录失败:', error);
    await showAlert('微信登录失败，请重试', '错误');
  }
}

// 重新授权
async function reauthorize() {
  // 同样的登录流程
  await login();
}

// 构建微信授权URL
async function buildWechatAuthUrl(): Promise<string> {
  const appId = 'YOUR_WECHAT_APP_ID'; // 替换为实际的AppId
  const redirectUri = encodeURIComponent(window.location.origin + '/auth/wechat/callback');
  const state = generateState(); // 生成随机state防止CSRF攻击

  return `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appId}&redirect_uri=${redirectUri}&response_type=code&scope=snsapi_userinfo&state=${state}#wechat_redirect`;
}

// 生成随机state
function generateState(): string {
  return Math.random().toString(36).substr(2, 15) + Date.now().toString(36);
}

// 事件监听器
onMounted(() => {
  // 监听token更新事件
  window.addEventListener('wechat-token-updated', handleTokenUpdated);
  window.addEventListener('wechat-reauthorization-required', handleReauthRequired);

  // 检查当前登录状态
  checkLoginStatus();
});

onUnmounted(() => {
  window.removeEventListener('wechat-token-updated', handleTokenUpdated);
  window.removeEventListener('wechat-reauthorization-required', handleReauthRequired);
});

// 处理token更新事件
function handleTokenUpdated(_event: any) {
  checkLoginStatus();
}

// 处理需要重新授权事件
async function handleReauthRequired(_event: any) {
  checkLoginStatus();

  // 可以显示更明显的提醒
  if (needsReauth.value) {
    await showAlert('您的微信授权即将过期，请重新授权以继续使用', '授权提醒');
  }
}

// 检查登录状态
function checkLoginStatus() {
  try {
    // 从localStorage或token管理器获取用户信息
    const userStr = localStorage.getItem('wechat_user_info');
    if (userStr) {
      const user = JSON.parse(userStr);
      userInfo.value = user;
      isLoggedIn.value = true;
    } else {
      isLoggedIn.value = false;
    }
  } catch (error) {
    console.error('检查登录状态失败:', error);
    isLoggedIn.value = false;
  }
}
</script>

<style scoped>
.wechat-auth-status {
  padding: 16px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.info .name {
  font-weight: 600;
  margin-bottom: 4px;
}

.info .status {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 10px;
  display: inline-block;
}

.status.valid {
  background-color: var(--color-success-light);
  color: var(--color-success);
}

.status.expiring-soon {
  background-color: #fffbeb;
  color: #d97706;
}

.status.expired {
  background-color: var(--color-error-light);
  color: var(--color-error);
}

.reauth-warning {
  background-color: #fffbeb;
  border: 1px solid #fcd34d;
  border-radius: 8px;
  padding: 12px;
}

.warning-text {
  margin: 0 0 12px 0;
  color: #d97706;
  font-size: 14px;
}

.reauth-btn {
  background-color: #d97706;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}

.reauth-btn:hover {
  background-color: #b45309;
}

.login-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: #07c160;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
}

.login-btn:hover {
  background-color: #06ae56;
}

.wechat-icon {
  width: 20px;
  height: 20px;
}
</style>