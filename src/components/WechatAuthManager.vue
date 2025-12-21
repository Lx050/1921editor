<template>
  <div class="wechat-auth-manager">
    <div class="manager-header">
      <h3>微信公众号授权管理</h3>
      <p class="subtitle">管理已授权的公众号，用于发布内容</p>
    </div>

    <!-- 当前授权状态 -->
    <div class="auth-status">
      <div class="status-card">
        <div class="status-icon">
          <i :class="authStatus.icon"></i>
        </div>
        <div class="status-info">
          <h4>{{ authStatus.title }}</h4>
          <p>{{ authStatus.description }}</p>
        </div>
      </div>
    </div>

    <!-- 操作按钮 -->
    <div class="actions">
      <button
        class="btn-primary"
        @click="startAuthorization"
        :disabled="isLoading"
      >
        <i class="icon-plus"></i>
        添加新公众号授权
      </button>

      <button
        class="btn-secondary"
        @click="refreshAccountList"
        :disabled="isLoading"
      >
        <i class="icon-refresh"></i>
        刷新列表
      </button>
    </div>

    <!-- 已授权账号列表 -->
    <div v-if="accounts.length > 0" class="accounts-section">
      <h4>已授权的公众号 ({{ accounts.length }})</h4>

      <div class="accounts-grid">
        <div
          v-for="account in accounts"
          :key="account.authorizer_appid"
          class="account-card"
          :class="{ 'expired': isExpired(account) }"
        >
          <!-- 账号头像 -->
          <div class="account-avatar">
            <img :src="account.head_img" :alt="account.nick_name" />
            <div class="status-badge" :class="getTokenStatus(account)">
              <i :class="getTokenIcon(account)"></i>
            </div>
          </div>

          <!-- 账号信息 -->
          <div class="account-info">
            <h5 class="account-name">{{ account.nick_name }}</h5>
            <p class="account-id">AppID: {{ account.authorizer_appid }}</p>

            <!-- 授权状态 -->
            <div class="auth-details">
              <div class="detail-item">
                <span class="label">授权时间:</span>
                <span class="value">{{ formatDate(account.authorizedAt) }}</span>
              </div>
              <div class="detail-item">
                <span class="label">Token状态:</span>
                <span class="value" :class="getTokenStatus(account)">
                  {{ getTokenStatusText(account) }}
                </span>
              </div>
              <div class="detail-item" v-if="account.lastUsed">
                <span class="label">最后使用:</span>
                <span class="value">{{ formatDate(account.lastUsed) }}</span>
              </div>
            </div>
          </div>

          <!-- 操作按钮 -->
          <div class="account-actions">
            <button
              class="action-btn test-btn"
              @click="testAccount(account)"
              :disabled="isExpired(account)"
              title="测试连接"
            >
              <i class="icon-test"></i>
            </button>

            <button
              class="action-btn refresh-btn"
              @click="refreshAccount(account)"
              title="刷新Token"
            >
              <i class="icon-refresh"></i>
            </button>

            <button
              class="action-btn remove-btn"
              @click="confirmRemoveAccount(account)"
              title="移除授权"
            >
              <i class="icon-trash"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-else class="empty-state">
      <div class="empty-icon">
        <i class="icon-wechat"></i>
      </div>
      <h4>暂无已授权的公众号</h4>
      <p>点击上方"添加新公众号授权"开始使用</p>
    </div>

    <!-- 授权弹窗 -->
    <div v-if="showAuthModal" class="modal-overlay" @click="closeAuthModal">
      <div class="auth-modal" @click.stop>
        <div class="modal-header">
          <h4>添加公众号授权</h4>
          <button class="close-btn" @click="closeAuthModal">✕</button>
        </div>

        <div class="modal-body">
          <div class="auth-steps">
            <div class="step" :class="{ 'active': currentStep === 1, 'completed': currentStep > 1 }">
              <div class="step-number">1</div>
              <div class="step-info">
                <h5>生成授权链接</h5>
                <p>系统将生成微信授权链接</p>
              </div>
            </div>

            <div class="step" :class="{ 'active': currentStep === 2, 'completed': currentStep > 2 }">
              <div class="step-number">2</div>
              <div class="step-info">
                <h5>用户扫码授权</h5>
                <p>公众号管理员扫码完成授权</p>
              </div>
            </div>

            <div class="step" :class="{ 'active': currentStep === 3 }">
              <div class="step-number">3</div>
              <div class="step-info">
                <h5>完成授权</h5>
                <p>系统保存授权信息</p>
              </div>
            </div>
          </div>

          <!-- 授权链接 -->
          <div v-if="authUrl" class="auth-url-section">
            <label>授权链接：</label>
            <div class="url-input">
              <input
                type="text"
                :value="authUrl"
                readonly
                ref="authUrlInput"
              />
              <button class="copy-btn" @click="copyAuthUrl">复制</button>
            </div>
            <p class="url-tip">
              请将此链接发送给公众号管理员进行扫码授权
            </p>
          </div>

          <!-- 二维码显示 -->
          <div v-if="authUrl && showQrCode" class="qr-section">
            <h5>授权二维码：</h5>
            <div class="qr-code" ref="qrCodeContainer"></div>
          </div>
        </div>

        <div class="modal-footer">
          <button
            class="btn-primary"
            @click="generateAuthUrl"
            :disabled="isLoading || currentStep > 1"
          >
            生成授权链接
          </button>

          <button
            v-if="authUrl"
            class="btn-secondary"
            @click="showQrCode = !showQrCode"
          >
            {{ showQrCode ? '隐藏二维码' : '显示二维码' }}
          </button>
        </div>
      </div>
    </div>

    <!-- 确认删除弹窗 -->
    <div v-if="showRemoveModal" class="modal-overlay" @click="closeRemoveModal">
      <div class="confirm-modal" @click.stop>
        <div class="modal-header">
          <h4>确认移除授权</h4>
          <button class="close-btn" @click="closeRemoveModal">✕</button>
        </div>

        <div class="modal-body">
          <div class="warning-message">
            <i class="icon-warning"></i>
            <p>确定要移除公众号 <strong>{{ removingAccount?.nick_name }}</strong> 的授权吗？</p>
            <p>移除后将无法向该公众号发布内容，需要重新授权才能使用。</p>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn-danger" @click="removeAccount" :disabled="isLoading">
            确认移除
          </button>
          <button class="btn-secondary" @click="closeRemoveModal">
            取消
          </button>
        </div>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="isLoading" class="loading-overlay">
      <div class="loading-spinner">
        <i class="spinner"></i>
        <p>{{ loadingMessage }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { ThirdPartyWechatAuth } from '../services/ThirdPartyWechatAuth';

interface WechatAuthInfo {
  authorizer_appid: string;
  authorizer_access_token: string;
  authorizer_refresh_token: string;
  expires_in: number;
  nick_name: string;
  head_img: string;
  func_info: any;
  authorizedAt: number;
  lastUsed?: number;
}

const wechatAuth = ThirdPartyWechatAuth.getInstance();

// 响应式数据
const accounts = ref<WechatAuthInfo[]>([]);
const isLoading = ref(false);
const loadingMessage = ref('');
const showAuthModal = ref(false);
const showRemoveModal = ref(false);
const removingAccount = ref<WechatAuthInfo | null>(null);
const authUrl = ref('');
const showQrCode = ref(false);
const currentStep = ref(1);

// 计算属性
const authStatus = computed(() => {
  if (accounts.value.length === 0) {
    return {
      icon: 'icon-warning',
      title: '暂无授权',
      description: '还没有任何公众号授权，请添加授权后才能发布内容'
    };
  }

  const hasExpired = accounts.value.some(account => isExpired(account));
  if (hasExpired) {
    return {
      icon: 'icon-warning',
      title: '部分授权过期',
      description: '有公众号授权已过期，请及时刷新'
    };
  }

  return {
    icon: 'icon-success',
    title: '授权正常',
    description: `已成功授权 ${accounts.value.length} 个公众号`
  };
});

// 生命周期
onMounted(async () => {
  await initializeAuth();
  await loadAccounts();
});

// 初始化授权服务
const initializeAuth = async () => {
  try {
    wechatAuth.initialize({
      storeAuth: (authData: any) => {
        // 存储到localStorage
        const existingAuths = JSON.parse(localStorage.getItem('wechat_auths') || '{}');
        existingAuths[authData.authorizer_appid] = authData;
        localStorage.setItem('wechat_auths', JSON.stringify(existingAuths));
      },
      getAuth: (appId: string) => {
        // 从localStorage获取
        const existingAuths = JSON.parse(localStorage.getItem('wechat_auths') || '{}');
        return existingAuths[appId];
      }
    });
  } catch (error) {
    console.error('初始化微信授权服务失败:', error);
  }
};

// 加载已授权账号
const loadAccounts = async () => {
  try {
    const storedAuths = JSON.parse(localStorage.getItem('wechat_auths') || '{}');
    accounts.value = Object.values(storedAuths) as WechatAuthInfo[];

    // 同时从后端获取
    const backendAccounts = await wechatAuth.getAuthorizedAccounts();

    // 合并数据（以后端数据为准）
    const mergedAccounts = backendAccounts.map(backendAccount => {
      const localAccount = accounts.value.find(acc => acc.authorizer_appid === backendAccount.authorizer_appid);
      return {
        ...backendAccount,
        ...localAccount
      };
    });

    accounts.value = mergedAccounts;
  } catch (error) {
    console.error('加载授权账号失败:', error);
  }
};

// 开始授权流程
const startAuthorization = () => {
  currentStep.value = 1;
  authUrl.value = '';
  showQrCode.value = false;
  showAuthModal.value = true;
};

// 生成授权URL
const generateAuthUrl = async () => {
  try {
    setLoading('正在生成授权链接...');

    const url = await wechatAuth.startAuthorization();
    authUrl.value = url;
    currentStep.value = 2;

    // 监听授权回调
    window.addEventListener('message', handleAuthCallback);

    setLoading('授权链接已生成，等待用户授权...', false);
  } catch (error) {
    console.error('生成授权链接失败:', error);
    alert('生成授权链接失败，请重试');
  }
};

// 处理授权回调
const handleAuthCallback = async (event: MessageEvent) => {
  if (event.data.type === 'wechat-auth-callback') {
    try {
      setLoading('正在处理授权回调...');

      const result = await wechatAuth.handleAuthCallback(
        event.data.code,
        event.data.state
      );

      currentStep.value = 3;

      // 重新加载账号列表
      await loadAccounts();

      // 显示成功消息
      setTimeout(() => {
        alert(`公众号 ${result.nick_name} 授权成功！`);
        closeAuthModal();
      }, 1000);

    } catch (error) {
      console.error('处理授权回调失败:', error);
      alert('授权失败: ' + (error as Error).message);
    } finally {
      setLoading('', false);
    }
  }
};

// 复制授权链接
const copyAuthUrl = () => {
  const input = document.createElement('input');
  input.value = authUrl.value;
  document.body.appendChild(input);
  input.select();
  document.execCommand('copy');
  document.body.removeChild(input);

  alert('授权链接已复制到剪贴板');
};

// 关闭授权弹窗
const closeAuthModal = () => {
  showAuthModal.value = false;
  authUrl.value = '';
  showQrCode.value = false;
  currentStep.value = 1;

  // 移除事件监听
  window.removeEventListener('message', handleAuthCallback);
};

// 刷新账号列表
const refreshAccountList = async () => {
  setLoading('正在刷新账号列表...');
  await loadAccounts();
  setLoading('', false);
};

// 测试账号连接
const testAccount = async (account: WechatAuthInfo) => {
  try {
    setLoading('正在测试连接...');

    const response = await fetch('/api/wechat/test-connection', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        app_id: account.authorizer_appid,
        access_token: account.authorizer_access_token,
      }),
    });

    const data = await response.json();

    if (data.success) {
      alert('连接测试成功！');
      account.lastUsed = Date.now();
      await saveAccounts();
    } else {
      alert('连接测试失败: ' + data.error);
    }
  } catch (error) {
    console.error('测试连接失败:', error);
    alert('连接测试失败: ' + (error as Error).message);
  } finally {
    setLoading('', false);
  }
};

// 刷新账号Token
const refreshAccount = async (account: WechatAuthInfo) => {
  try {
    setLoading('正在刷新Token...');

    const refreshedInfo = await wechatAuth.refreshToken(account);

    // 更新账号信息
    const index = accounts.value.findIndex(acc => acc.authorizer_appid === account.authorizer_appid);
    if (index !== -1) {
      accounts.value[index] = { ...refreshedInfo, lastUsed: account.lastUsed };
    }

    await saveAccounts();
    alert('Token刷新成功！');
  } catch (error) {
    console.error('刷新Token失败:', error);
    alert('刷新Token失败: ' + (error as Error).message);
  } finally {
    setLoading('', false);
  }
};

// 确认移除账号
const confirmRemoveAccount = (account: WechatAuthInfo) => {
  removingAccount.value = account;
  showRemoveModal.value = true;
};

// 移除账号
const removeAccount = async () => {
  if (!removingAccount.value) return;

  try {
    setLoading('正在移除授权...');

    await wechatAuth.removeAuth(removingAccount.value.authorizer_appid);

    // 从列表中移除
    const index = accounts.value.findIndex(acc =>
      acc.authorizer_appid === removingAccount.value?.authorizer_appid
    );
    if (index !== -1) {
      accounts.value.splice(index, 1);
    }

    await saveAccounts();
    closeRemoveModal();
    alert('授权已移除');
  } catch (error) {
    console.error('移除授权失败:', error);
    alert('移除授权失败: ' + error.message);
  } finally {
    setLoading('', false);
  }
};

// 关闭移除弹窗
const closeRemoveModal = () => {
  showRemoveModal.value = false;
  removingAccount.value = null;
};

// 保存账号到本地存储
const saveAccounts = async () => {
  try {
    const auths: Record<string, WechatAuthInfo> = {};
    accounts.value.forEach(account => {
      auths[account.authorizer_appid] = account;
    });
    localStorage.setItem('wechat_auths', JSON.stringify(auths));
  } catch (error) {
    console.error('保存账号信息失败:', error);
  }
};

// 检查账号是否过期
const isExpired = (account: WechatAuthInfo): boolean => {
  const now = Date.now();
  const timeSinceAuth = now - account.authorizedAt;
  const expiresIn = account.expires_in * 1000;

  // 提前5分钟判断为过期
  return timeSinceAuth >= expiresIn - 5 * 60 * 1000;
};

// 获取Token状态
const getTokenStatus = (account: WechatAuthInfo): string => {
  if (isExpired(account)) return 'expired';
  if (account.authorizer_access_token) return 'valid';
  return 'invalid';
};

// 获取Token状态图标
const getTokenIcon = (account: WechatAuthInfo): string => {
  const status = getTokenStatus(account);
  switch (status) {
    case 'valid': return 'icon-check-circle';
    case 'expired': return 'icon-time';
    default: return 'icon-close-circle';
  }
};

// 获取Token状态文本
const getTokenStatusText = (account: WechatAuthInfo): string => {
  const status = getTokenStatus(account);
  switch (status) {
    case 'valid': return '有效';
    case 'expired': return '已过期';
    default: return '无效';
  }
};

// 格式化日期
const formatDate = (timestamp: number): string => {
  return new Date(timestamp).toLocaleString('zh-CN');
};

// 设置加载状态
const setLoading = (message: string, show = true) => {
  loadingMessage.value = message;
  isLoading.value = show;
};
</script>

<style scoped>
.wechat-auth-manager {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.manager-header {
  margin-bottom: 30px;
}

.manager-header h3 {
  margin: 0 0 8px 0;
  font-size: 24px;
  color: #333;
}

.subtitle {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.auth-status {
  margin-bottom: 30px;
}

.status-card {
  display: flex;
  align-items: center;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #007bff;
}

.status-icon {
  margin-right: 16px;
  font-size: 24px;
}

.status-icon i {
  color: #007bff;
}

.status-info h4 {
  margin: 0 0 4px 0;
  font-size: 16px;
}

.status-info p {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.actions {
  display: flex;
  gap: 12px;
  margin-bottom: 30px;
}

.btn-primary,
.btn-secondary,
.btn-danger {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background: #007bff;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #0056b3;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover:not(:disabled) {
  background: #545b62;
}

.btn-danger {
  background: #dc3545;
  color: white;
}

.btn-danger:hover:not(:disabled) {
  background: #c82333;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.accounts-section h4 {
  margin: 0 0 20px 0;
  font-size: 18px;
  color: #333;
}

.accounts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.account-card {
  display: flex;
  flex-direction: column;
  padding: 20px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  transition: all 0.2s;
}

.account-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.account-card.expired {
  border-color: #dc3545;
  background: #fff5f5;
}

.account-avatar {
  position: relative;
  width: 60px;
  height: 60px;
  margin: 0 auto 16px;
}

.account-avatar img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.status-badge {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
}

.status-badge.valid {
  background: #28a745;
  color: white;
}

.status-badge.expired {
  background: #ffc107;
  color: #333;
}

.status-badge.invalid {
  background: #dc3545;
  color: white;
}

.account-info {
  flex: 1;
  margin-bottom: 16px;
}

.account-name {
  margin: 0 0 8px 0;
  font-size: 16px;
  text-align: center;
  color: #333;
}

.account-id {
  margin: 0 0 12px 0;
  font-size: 12px;
  color: #666;
  text-align: center;
}

.auth-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
}

.detail-item .label {
  color: #666;
}

.detail-item .value {
  font-weight: 500;
}

.detail-item .value.valid {
  color: #28a745;
}

.detail-item .value.expired {
  color: #ffc107;
}

.detail-item .value.invalid {
  color: #dc3545;
}

.account-actions {
  display: flex;
  justify-content: center;
  gap: 8px;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.test-btn {
  background: #007bff;
  color: white;
}

.test-btn:hover:not(:disabled) {
  background: #0056b3;
}

.refresh-btn {
  background: #28a745;
  color: white;
}

.refresh-btn:hover {
  background: #1e7e34;
}

.remove-btn {
  background: #dc3545;
  color: white;
}

.remove-btn:hover {
  background: #c82333;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #666;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
  color: #ddd;
}

.empty-state h4 {
  margin: 0 0 8px 0;
  font-size: 18px;
}

.empty-state p {
  margin: 0;
  font-size: 14px;
}

/* 弹窗样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.auth-modal,
.confirm-modal {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  border-bottom: 1px solid #ddd;
}

.modal-header h4 {
  margin: 0;
  font-size: 18px;
}

.close-btn {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #666;
}

.modal-body {
  padding: 20px;
}

.auth-steps {
  margin-bottom: 30px;
}

.step {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.step-number {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: 16px;
  color: white;
}

.step.active .step-number {
  background: #007bff;
}

.step.completed .step-number {
  background: #28a745;
}

.step-info h5 {
  margin: 0 0 4px 0;
  font-size: 14px;
}

.step-info p {
  margin: 0;
  font-size: 12px;
  color: #666;
}

.auth-url-section {
  margin-bottom: 20px;
}

.auth-url-section label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
}

.url-input {
  display: flex;
  gap: 8px;
}

.url-input input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.copy-btn {
  padding: 8px 16px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.url-tip {
  margin: 8px 0 0 0;
  font-size: 12px;
  color: #666;
}

.qr-section {
  text-align: center;
}

.qr-section h5 {
  margin: 0 0 16px 0;
}

.qr-code {
  display: inline-block;
  padding: 20px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.modal-footer {
  display: flex;
  gap: 12px;
  padding: 20px;
  border-top: 1px solid #ddd;
}

.warning-message {
  text-align: center;
  color: #dc3545;
}

.warning-message i {
  display: block;
  font-size: 32px;
  margin-bottom: 16px;
}

.warning-message p {
  margin: 8px 0;
}

.warning-message strong {
  font-weight: bold;
}

/* 加载状态 */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.loading-spinner {
  text-align: center;
}

.spinner {
  display: inline-block;
  width: 32px;
  height: 32px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-spinner p {
  margin-top: 16px;
  color: #666;
  font-size: 14px;
}

/* 图标样式 */
.icon-plus::before { content: '+'; }
.icon-refresh::before { content: '↻'; }
.icon-warning::before { content: '⚠'; }
.icon-success::before { content: '✓'; }
.icon-wechat::before { content: '✉'; }
.icon-check-circle::before { content: '✓'; }
.icon-close-circle::before { content: '✗'; }
.icon-time::before { content: '⏰'; }
.icon-test::before { content: '⚡'; }
.icon-trash::before { content: '🗑'; }
</style>