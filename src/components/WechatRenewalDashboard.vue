<template>
  <div class="wechat-renewal-dashboard">
    <!-- 顶部状态概览 -->
    <div class="dashboard-header">
      <h2>微信账号管理</h2>
      <div class="overall-status" :class="overallStatusClass">
        <i class="status-icon">{{ overallStatusIcon }}</i>
        <span>{{ overallStatusText }}</span>
      </div>
    </div>

    <!-- 账号健康状态卡片 -->
    <div class="accounts-grid">
      <div
        v-for="account in accounts"
        :key="account.id"
        class="account-card"
        :class="getAccountCardClass(account)"
      >
        <!-- 账号基本信息 -->
        <div class="account-header">
          <div class="account-info">
            <img :src="account.avatar || '/icons/default-avatar.png'" class="account-avatar" />
            <div class="account-details">
              <h3 class="account-nickname">{{ account.nickname }}</h3>
              <p class="account-type" :class="account.type">
                {{ account.type === 'primary' ? '主账号' : '备用账号' }}
              </p>
            </div>
          </div>

          <!-- 健康状态指示器 -->
          <div class="health-indicator">
            <div class="health-circle" :style="getHealthCircleStyle(account)"></div>
            <span class="health-score">{{ Math.round(account.healthScore) }}</span>
          </div>
        </div>

        <!-- 有效期信息 -->
        <div class="expiry-info">
          <div class="expiry-progress">
            <div class="progress-bar">
              <div
                class="progress-fill"
                :style="getProgressStyle(account)"
                :class="getProgressClass(account)"
              ></div>
            </div>
            <span class="expiry-text">
              {{ getExpiryText(account) }}
            </span>
          </div>

          <div class="expiry-details">
            <span>有效期至: {{ formatDate(account.tokenData.expires_at) }}</span>
            <span v-if="account.lastRenewalAt" class="last-renewal">
              上次续期: {{ formatRelativeTime(account.lastRenewalAt) }}
            </span>
          </div>
        </div>

        <!-- 自动续期设置 -->
        <div class="auto-renewal-section">
          <label class="toggle-container">
            <input
              type="checkbox"
              v-model="account.autoRenewalEnabled"
              @change="toggleAutoRenewal(account)"
              :disabled="account.healthScore === 0"
            />
            <span class="toggle-slider"></span>
            <span class="toggle-label">自动续期</span>
          </label>

          <div v-if="account.autoRenewalEnabled && account.healthScore > 0" class="renewal-status">
            <i class="icon" :class="getRenewalStatusClass(account)"></i>
            <span>{{ getRenewalStatusText(account) }}</span>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="account-actions">
          <button
            v-if="account.healthScore === 0"
            @click="reauthorize(account)"
            class="btn-primary"
          >
            重新授权
          </button>

          <button
            v-else-if="account.healthScore < 60"
            @click="forceRenewal(account)"
            class="btn-secondary"
          >
            立即续期
          </button>

          <button
            v-if="accounts.length > 1"
            @click="switchAccount(account)"
            :disabled="account.isActive"
            class="btn-outline"
          >
            {{ account.isActive ? '当前账号' : '切换为此账号' }}
          </button>

          <button
            v-if="account.type === 'secondary'"
            @click="removeAccount(account)"
            class="btn-danger"
          >
            移除账号
          </button>
        </div>
      </div>

      <!-- 添加新账号卡片 -->
      <div class="account-card add-account-card" @click="addNewAccount">
        <div class="add-content">
          <i class="add-icon">+</i>
          <h3>添加微信账号</h3>
          <p>添加备用账号确保服务不中断</p>
        </div>
      </div>
    </div>

    <!-- 续期历史和统计 -->
    <div class="renewal-stats-section">
      <h3>续期统计</h3>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-value">{{ renewalStats.totalProcessed }}</div>
          <div class="stat-label">总续期次数</div>
        </div>

        <div class="stat-card">
          <div class="stat-value">{{ renewalStats.successRate }}%</div>
          <div class="stat-label">成功率</div>
        </div>

        <div class="stat-card">
          <div class="stat-value">{{ renewalStats.queueLength }}</div>
          <div class="stat-label">待处理任务</div>
        </div>

        <div class="stat-card">
          <div class="stat-value">{{ renewalStats.activeRenewals }}</div>
          <div class="stat-label">进行中续期</div>
        </div>
      </div>

      <!-- 续期历史记录 -->
      <div class="renewal-history">
        <h4>最近续期记录</h4>
        <div class="history-list">
          <div
            v-for="record in renewalHistory.slice(0, 10)"
            :key="record.id"
            class="history-item"
            :class="record.success ? 'success' : 'failed'"
          >
            <div class="history-info">
              <span class="account-name">{{ record.accountName }}</span>
              <span class="history-time">{{ formatRelativeTime(record.timestamp) }}</span>
            </div>
            <div class="history-result">
              <i class="result-icon">{{ record.success ? '✓' : '✗' }}</i>
              <span>{{ record.success ? '成功' : record.error || '失败' }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 设置面板 -->
    <div class="settings-section">
      <h3>续期设置</h3>

      <div class="setting-item">
        <label class="setting-label">提前续期天数</label>
        <select v-model="settings.earlyRenewalDays" @change="updateSettings" class="setting-select">
          <option value="3">3天</option>
          <option value="5">5天</option>
          <option value="7">7天 (推荐)</option>
          <option value="10">10天</option>
        </select>
      </div>

      <div class="setting-item">
        <label class="setting-label">通知方式</label>
        <div class="notification-channels">
          <label v-for="channel in availableChannels" :key="channel.value" class="channel-checkbox">
            <input
              type="checkbox"
              v-model="settings.notificationChannels"
              :value="channel.value"
              @change="updateSettings"
            />
            <span>{{ channel.label }}</span>
          </label>
        </div>
      </div>

      <div class="setting-item">
        <label class="toggle-container">
          <input
            type="checkbox"
            v-model="settings.fallbackToBackup"
            @change="updateSettings"
          />
          <span class="toggle-slider"></span>
          <span class="toggle-label">主账号失效时自动切换备用账号</span>
        </label>
      </div>

      <div class="setting-item">
        <label class="toggle-container">
          <input
            type="checkbox"
            v-model="settings.quietHoursEnabled"
            @change="updateSettings"
          />
          <span class="toggle-slider"></span>
          <span class="toggle-label">启用免打扰时段</span>
        </label>

        <div v-if="settings.quietHoursEnabled" class="quiet-hours-config">
          <input
            type="time"
            v-model="settings.quietHoursStart"
            @change="updateSettings"
          />
          <span>至</span>
          <input
            type="time"
            v-model="settings.quietHoursEnd"
            @change="updateSettings"
          />
        </div>
      </div>
    </div>

    <!-- 重新授权模态框 -->
    <ReauthModal
      v-if="showReauthModal"
      :account="selectedAccount"
      @confirm="handleReauthConfirm"
      @cancel="showReauthModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { WechatAutoRenewalService } from '@/services/wechatAutoRenewalService';
import { WechatBackgroundRenewal } from '@/services/wechatBackgroundRenewal';

interface WechatAccount {
  id: string;
  nickname: string;
  avatar?: string;
  type: 'primary' | 'secondary';
  isActive: boolean;
  healthScore: number;
  tokenData: {
    expires_at: number;
    access_token: string;
    refresh_token: string;
  };
  lastRenewalAt?: number;
  renewalCount: number;
  autoRenewalEnabled: boolean;
}

interface RenewalHistoryRecord {
  id: string;
  accountId: string;
  accountName: string;
  timestamp: number;
  success: boolean;
  error?: string;
}

interface RenewalSettings {
  earlyRenewalDays: number;
  notificationChannels: string[];
  fallbackToBackup: boolean;
  quietHoursEnabled: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
}

const accounts = ref<WechatAccount[]>([]);
const renewalHistory = ref<RenewalHistoryRecord[]>([]);
const renewalStats = ref({
  totalProcessed: 0,
  successRate: 0,
  queueLength: 0,
  activeRenewals: 0,
});

const settings = ref<RenewalSettings>({
  earlyRenewalDays: 7,
  notificationChannels: ['inapp', 'system'],
  fallbackToBackup: true,
  quietHoursEnabled: false,
  quietHoursStart: '22:00',
  quietHoursEnd: '08:00',
});

const showReauthModal = ref(false);
const selectedAccount = ref<WechatAccount | null>(null);

const availableChannels = [
  { value: 'inapp', label: '应用内通知' },
  { value: 'system', label: '系统通知' },
  { value: 'wechat', label: '微信通知' },
  { value: 'email', label: '邮件通知' },
];

// 计算整体状态
const overallStatusClass = computed(() => {
  const hasValidAccount = accounts.value.some(acc => acc.healthScore > 60);
  const hasExpiringAccount = accounts.value.some(acc => acc.healthScore > 0 && acc.healthScore <= 60);

  if (hasValidAccount) return 'status-good';
  if (hasExpiringAccount) return 'status-warning';
  return 'status-critical';
});

const overallStatusIcon = computed(() => {
  switch (overallStatusClass.value) {
    case 'status-good': return '✓';
    case 'status-warning': return '⚠';
    case 'status-critical': return '!';
    default: return '?';
  }
});

const overallStatusText = computed(() => {
  switch (overallStatusClass.value) {
    case 'status-good': return '所有账号状态良好';
    case 'status-warning': return '部分账号需要关注';
    case 'status-critical': return '需要立即处理';
    default: return '状态未知';
  }
});

let renewalService: WechatAutoRenewalService;
let backgroundRenewal: WechatBackgroundRenewal;

onMounted(async () => {
  // 初始化服务
  renewalService = WechatAutoRenewalService.getInstance();
  backgroundRenewal = new WechatBackgroundRenewal();

  // 启动自动续期服务
  await renewalService.startAutoRenewalService();
  await backgroundRenewal.start();

  // 加载数据
  await loadAccounts();
  await loadRenewalHistory();
  await loadSettings();

  // 开始实时更新
  startRealTimeUpdates();
});

onUnmounted(() => {
  // 清理资源
  renewalService?.stopAutoRenewalService();
  backgroundRenewal?.stop();
});

/**
 * 加载账号列表
 */
async function loadAccounts(): Promise<void> {
  try {
    const response = await fetch('/api/wechat/accounts');
    const data = await response.json();

    accounts.value = data.map((account: any) => ({
      ...account,
      healthScore: calculateHealthScore(account),
      autoRenewalEnabled: account.autoRenewal !== false,
    }));
  } catch (error) {
    console.error('加载账号列表失败:', error);
  }
}

/**
 * 计算账号健康分数
 */
function calculateHealthScore(account: any): number {
  const now = Date.now();
  const expiresAt = account.tokenData.expires_at;
  const daysToExpiry = (expiresAt - now) / (24 * 60 * 60 * 1000);

  let score = 100;

  if (daysToExpiry <= 0) score = 0;
  else if (daysToExpiry <= 1) score = 20;
  else if (daysToExpiry <= 3) score = 40;
  else if (daysToExpiry <= 7) score = 60;
  else if (daysToExpiry <= 15) score = 80;

  return score;
}

/**
 * 获取账号卡片样式类
 */
function getAccountCardClass(account: WechatAccount): string {
  const classes = [];

  if (account.isActive) classes.push('active');
  if (account.healthScore === 0) classes.push('expired');
  else if (account.healthScore <= 40) classes.push('critical');
  else if (account.healthScore <= 60) classes.push('warning');
  else classes.push('good');

  return classes.join(' ');
}

/**
 * 获取健康圆形进度条样式
 */
function getHealthCircleStyle(account: WechatAccount) {
  const circumference = 2 * Math.PI * 18;
  const offset = circumference - (account.healthScore / 100) * circumference;

  return {
    strokeDasharray: `${circumference} ${circumference}`,
    strokeDashoffset: offset,
  };
}

/**
 * 获取进度条样式
 */
function getProgressStyle(account: WechatAccount) {
  const now = Date.now();
  const createdAt = account.tokenData.expires_at - (30 * 24 * 60 * 60 * 1000); // 假设30天有效期
  const totalDuration = account.tokenData.expires_at - createdAt;
  const elapsed = now - createdAt;
  const progress = Math.min(100, (elapsed / totalDuration) * 100);

  return {
    width: `${progress}%`,
  };
}

/**
 * 获取进度条样式类
 */
function getProgressClass(account: WechatAccount): string {
  if (account.healthScore <= 40) return 'progress-critical';
  if (account.healthScore <= 60) return 'progress-warning';
  return 'progress-normal';
}

/**
 * 获取有效期文本
 */
function getExpiryText(account: WechatAccount): string {
  const now = Date.now();
  const expiresAt = account.tokenData.expires_at;
  const daysToExpiry = Math.ceil((expiresAt - now) / (24 * 60 * 60 * 1000));

  if (daysToExpiry <= 0) return '已过期';
  if (daysToExpiry === 1) return '明天过期';
  if (daysToExpiry <= 7) return `${daysToExpiry}天后过期`;
  return `${Math.floor(daysToExpiry / 7)}周后过期`;
}

/**
 * 格式化日期
 */
function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * 格式化相对时间
 */
function formatRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / (60 * 1000));
  const hours = Math.floor(diff / (60 * 60 * 1000));
  const days = Math.floor(diff / (24 * 60 * 60 * 1000));

  if (minutes < 1) return '刚刚';
  if (minutes < 60) return `${minutes}分钟前`;
  if (hours < 24) return `${hours}小时前`;
  if (days < 30) return `${days}天前`;
  return formatDate(timestamp);
}

/**
 * 切换自动续期
 */
async function toggleAutoRenewal(account: WechatAccount): Promise<void> {
  try {
    await fetch(`/api/wechat/accounts/${account.id}/auto-renewal`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        enabled: account.autoRenewalEnabled,
      }),
    });
  } catch (error) {
    console.error('切换自动续期失败:', error);
    // 回滚状态
    account.autoRenewalEnabled = !account.autoRenewalEnabled;
  }
}

/**
 * 获取续期状态图标
 */
function getRenewalStatusClass(_account: WechatAccount): string {
  // 这里可以根据实际的续期状态返回不同的图标类
  return 'icon-check'; // 示例
}

/**
 * 获取续期状态文本
 */
function getRenewalStatusText(_account: WechatAccount): string {
  // 这里可以根据实际的续期状态返回不同的文本
  return '自动续期已启用'; // 示例
}

/**
 * 其他方法...
 */
function reauthorize(account: WechatAccount) {
  selectedAccount.value = account;
  showReauthModal.value = true;
}

function forceRenewal(_account: WechatAccount) {
  // 强制续期逻辑
}

function switchAccount(_account: WechatAccount) {
  // 切换账号逻辑
}

function removeAccount(_account: WechatAccount) {
  // 移除账号逻辑
}

function addNewAccount() {
  // 添加新账号逻辑
}

async function handleReauthConfirm() {
  // 处理重新授权确认
}

async function loadRenewalHistory() {
  // 加载续期历史
}

async function loadSettings() {
  // 加载设置
}

async function updateSettings() {
  // 更新设置
}

function startRealTimeUpdates() {
  // 开始实时更新
  setInterval(async () => {
    renewalStats.value = backgroundRenewal.getRenewalStats();
  }, 5000);
}
</script>

<style scoped>
.wechat-renewal-dashboard {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* 顶部状态概览 */
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  color: white;
}

.overall-status {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.2);
}

.status-good { background: rgba(76, 175, 80, 0.3); }
.status-warning { background: rgba(255, 152, 0, 0.3); }
.status-critical { background: rgba(244, 67, 54, 0.3); }

/* 账号网格 */
.accounts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.account-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.account-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.account-card.active {
  border: 2px solid #4CAF50;
}

.account-card.warning {
  border: 2px solid #FF9800;
}

.account-card.critical {
  border: 2px solid #f44336;
}

.add-account-card {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: 2px dashed #ccc;
  background: #f9f9f9;
}

.add-account-card:hover {
  border-color: #667eea;
  background: #f0f4ff;
}

/* 账号头部 */
.account-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.account-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.account-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
}

.account-details h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.account-type {
  margin: 4px 0 0 0;
  font-size: 12px;
  color: #666;
}

.account-type.primary {
  color: #4CAF50;
}

.health-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.health-circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 3px solid #e0e0e0;
  position: relative;
  transform: rotate(-90deg);
  transition: stroke 0.3s ease;
}

.health-circle::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #f5f5f5;
}

.health-score {
  font-size: 12px;
  font-weight: 600;
}

/* 有效期信息 */
.expiry-info {
  margin-bottom: 16px;
}

.expiry-progress {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.progress-bar {
  flex: 1;
  height: 6px;
  background: #e0e0e0;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #4CAF50;
  transition: width 0.3s ease;
}

.progress-fill.progress-warning {
  background: #FF9800;
}

.progress-fill.progress-critical {
  background: #f44336;
}

.expiry-text {
  font-size: 14px;
  font-weight: 500;
  min-width: 80px;
}

.expiry-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 12px;
  color: #666;
}

.last-renewal {
  color: #4CAF50;
}

/* 自动续期设置 */
.auto-renewal-section {
  margin-bottom: 16px;
}

.toggle-container {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
}

.toggle-container input[type="checkbox"] {
  display: none;
}

.toggle-slider {
  width: 44px;
  height: 24px;
  background: #ccc;
  border-radius: 12px;
  position: relative;
  transition: background 0.3s;
}

.toggle-slider::before {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  background: white;
  border-radius: 50%;
  transition: transform 0.3s;
}

.toggle-container input:checked + .toggle-slider {
  background: #4CAF50;
}

.toggle-container input:checked + .toggle-slider::before {
  transform: translateX(20px);
}

.renewal-status {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 8px;
  font-size: 12px;
  color: #4CAF50;
}

/* 操作按钮 */
.account-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.btn-primary {
  background: #4CAF50;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}

.btn-secondary {
  background: #2196F3;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}

.btn-outline {
  background: transparent;
  color: #666;
  border: 1px solid #ddd;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}

.btn-danger {
  background: #f44336;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}

/* 统计部分 */
.renewal-stats-section {
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 40px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  text-align: center;
  padding: 16px;
  background: #f9f9f9;
  border-radius: 8px;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #333;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  color: #666;
}

/* 设置部分 */
.settings-section {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.setting-item {
  margin-bottom: 20px;
}

.setting-label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
}

.setting-select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
}

.notification-channels {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.channel-checkbox {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
}

.quiet-hours-config {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
}

.quiet-hours-config input[type="time"] {
  padding: 4px 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .wechat-renewal-dashboard {
    padding: 16px;
  }

  .accounts-grid {
    grid-template-columns: 1fr;
  }

  .dashboard-header {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>