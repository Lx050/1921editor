<template>
  <div class="tenant-settings">
    <div class="settings-header">
      <h1>租户配置</h1>
      <p class="subtitle">配置飞书多维表格，实现自动同步</p>
    </div>

    <!-- 人员管理表配置 -->
    <div class="config-section">
      <div class="section-header">
        <h2>人员管理表（必需）⭐</h2>
        <el-tag v-if="config.userTable" type="success">已配置</el-tag>
        <el-tag v-else type="warning">未配置</el-tag>
      </div>

      <div class="config-description">
        <p>在飞书创建多维表格，包含以下列：</p>
        <ul class="field-list">
          <li><strong>姓名</strong> - 文本</li>
          <li><strong>岗位</strong> - 文本</li>
          <li><strong>FeishuID</strong> - 文本 (OpenID)</li>
          <li><strong>Email</strong> - 文本</li>
          <li><strong>最后登录时间</strong> - 日期</li>
          <li><strong>状态</strong> - 文本 (激活/禁用)</li>
        </ul>
        <p class="hint-text">💡 系统会自动在用户登录时更新这些字段</p>
      </div>

      <div class="config-input">
        <el-input
          v-model="userTableUrl"
          placeholder="https://xxx.feishu.cn/wiki/xxx?table=xxx"
          clearable
          :disabled="loading"
        >
          <template #prepend>表格链接</template>
        </el-input>
        <el-button
          type="primary"
          :loading="loading"
          @click="configureUserTable"
          :disabled="!userTableUrl"
        >
          保存配置
        </el-button>
      </div>

      <!-- 已配置的信息 -->
      <div v-if="config.userTable" class="config-details">
        <el-descriptions :column="1" border>
          <el-descriptions-item label="通过验证">
            <el-tag type="success">是</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="原始链接">
             <div class="flex items-center space-x-2">
               <span class="truncate max-w-[300px]" :title="config.userTable.tableUrl">{{ config.userTable.tableUrl }}</span>
               <a 
                 :href="config.userTable.tableUrl" 
                 target="_blank"
                 class="text-blue-600 hover:text-blue-800 flex items-center"
               >
                 <el-icon class="mr-1"><Link /></el-icon>
                 打开飞书表格
               </a>
             </div>
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </div>

    <!-- 文章管理表配置 -->
    <div class="config-section">
      <div class="section-header">
        <h2>文章管理表（可选）</h2>
        <el-tag v-if="config.articleTable" type="success">已配置</el-tag>
        <el-tag v-else type="info">未配置</el-tag>
      </div>

      <div class="config-description">
        <p>用于多人协同与任务权重统计，包含以下列（名称需一致）：</p>
        <ul class="field-list">
          <li><strong>标题</strong> - 文本</li>
          <li><strong>状态</strong> - 文本（建议单选DRAFT/PARSED/ADJUSTED/PUBLISHED）</li>
          <li><strong>内容策划</strong> - 人员 (允许多选)</li>
          <li><strong>文案撰稿</strong> - 人员 (允许多选)</li>
          <li><strong>文章编辑</strong> - 人员 (允许多选)</li>
          <li><strong>最后更新</strong> - 日期</li>
          <li><strong>系统ID</strong> - 文本 (必填)</li>
        </ul>
        <div class="mt-2 text-xs text-gray-400">
          <p>💡 <strong>1/N 权重实现：</strong>在飞书添加公式列，例如：</p>
          <code>IF(COUNTACCESS([文案撰稿])>0, ROUND(1/COUNTACCESS([文案撰稿]), 2), 0)</code>
        </div>
        <p class="hint-text mt-2">🚀 已支持实时双向同步，在飞书调整人员即刻同步回系统</p>
      </div>

      <div class="config-input">
        <el-input
          v-model="articleTableUrl"
          placeholder="https://xxx.feishu.cn/wiki/xxx?table=xxx"
          clearable
          :disabled="loading"
        >
          <template #prepend>表格链接</template>
        </el-input>
        <el-button
          type="primary"
          :loading="loading"
          @click="configureArticleTable"
          :disabled="!articleTableUrl"
        >
          保存配置
        </el-button>
      </div>

      <div v-if="config.articleTable" class="config-details">
        <el-descriptions :column="1" border>
          <el-descriptions-item label="通过验证">
             <el-tag type="success">是</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="原始链接">
             <div class="flex items-center space-x-2">
               <span class="truncate max-w-[300px]" :title="config.articleTable.tableUrl">{{ config.articleTable.tableUrl }}</span>
               <a 
                 :href="config.articleTable.tableUrl" 
                 target="_blank"
                 class="text-blue-600 hover:text-blue-800 flex items-center"
               >
                 <el-icon class="mr-1"><Link /></el-icon>
                 打开飞书表格
               </a>
             </div>
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </div>

    <!-- 邀请码设置 -->
    <div class="config-section">
      <div class="section-header">
        <h2>邀请码设置</h2>
        <el-tag v-if="config.inviteCode" type="success">已配置</el-tag>
        <el-tag v-else type="warning">未配置</el-tag>
      </div>

      <div class="config-description">
        <p>管理员可设置组织邀请码，支持中文、英文和标点；邀请码必须全局唯一。</p>
        <p class="hint-text">💡 修改后立即生效，其他成员需使用新邀请码加入。</p>
      </div>

      <div class="config-input">
        <el-input
          v-model="inviteCodeInput"
          placeholder="例如：一见青心，媒你不行"
          clearable
          :disabled="loading || !userStore.isAdmin"
        >
          <template #prepend>邀请码</template>
        </el-input>
        <el-button
          type="primary"
          :loading="inviteCodeLoading"
          @click="updateInviteCode"
          :disabled="!inviteCodeInput || !userStore.isAdmin"
        >
          保存邀请码
        </el-button>
      </div>

      <div v-if="config.inviteCode" class="config-details">
        <el-descriptions :column="1" border>
          <el-descriptions-item label="当前邀请码">
            {{ config.inviteCode }}
          </el-descriptions-item>
          <el-descriptions-item v-if="config.inviteCodeExpires" label="过期时间">
            {{ new Date(config.inviteCodeExpires).toLocaleString() }}
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </div>

    <!-- 组织模板配置 -->
    <div class="config-section">
      <div class="section-header">
        <h2>组织模板配置</h2>
        <el-tag type="info">全员共享</el-tag>
      </div>

      <div class="config-description">
        <p>设置组织的首尾图模板和排版样式，保存后所有团队成员自动使用此配置。</p>
        <p class="hint-text">支持从微信编辑器 / 135编辑器直接复制粘贴富文本到画布中。</p>
      </div>

      <!-- 模式选择 -->
      <div style="margin-bottom: 16px;">
        <el-radio-group v-model="orgEditMode" size="small">
          <el-radio-button label="daily">日常模式</el-radio-button>
          <el-radio-button label="three_rural">三下乡</el-radio-button>
          <el-radio-button label="reprint">转载</el-radio-button>
        </el-radio-group>
      </div>

      <!-- 首图编辑器 -->
      <OrgTemplateEditor
        title="首图模板"
        type="header"
        :mode="orgEditMode"
        :default-html="getDefaultHeader(orgEditMode)"
        :custom-html="orgConfigStore.getCustomHeader(orgEditMode)"
        @save="(html) => orgConfigStore.setHeader(orgEditMode, html)"
        @reset="orgConfigStore.clearHeader(orgEditMode)"
      />

      <!-- 尾图编辑器 -->
      <OrgTemplateEditor
        title="尾图模板"
        type="footer"
        :mode="orgEditMode"
        :default-html="getDefaultFooter(orgEditMode)"
        :custom-html="orgConfigStore.getCustomFooter(orgEditMode)"
        @save="(html) => orgConfigStore.setFooter(orgEditMode, html)"
        @reset="orgConfigStore.clearFooter(orgEditMode)"
      />

      <!-- 样式预设 -->
      <OrgStylePresets
        :preset="orgConfigStore.stylePreset"
        :default-preset="orgConfigStore.DEFAULT_STYLE_PRESET"
        @update="orgConfigStore.updateStylePreset"
        @reset="orgConfigStore.resetStylePreset()"
      />

      <!-- 导入导出 -->
      <div class="org-config-export" style="display: flex; gap: 8px; margin-top: 12px;">
        <el-button size="small" @click="handleExportOrgConfig">导出配置</el-button>
        <el-button size="small" @click="handleImportOrgConfig">导入配置</el-button>
      </div>
    </div>

    <!-- 租户信息 -->
    <div class="tenant-info">
      <h3>当前租户信息</h3>
      <el-descriptions :column="2" border>
        <el-descriptions-item label="租户名称">
          {{ config.tenantName || '-' }}
        </el-descriptions-item>
        <el-descriptions-item label="租户标识">
          {{ config.tenantSlug || '-' }}
        </el-descriptions-item>
      </el-descriptions>
    </div>

    <!-- 帮助说明 -->
    <div class="help-section">
      <el-collapse>
        <el-collapse-item title="❓ 如何获取飞书表格链接？" name="1">
          <ol>
            <li>在飞书中打开您创建的多维表格</li>
            <li>复制浏览器地址栏的完整URL</li>
            <li>URL格式示例：https://xxx.feishu.cn/wiki/xxx?table=xxx</li>
            <li>粘贴到上方输入框并点击"保存配置"</li>
          </ol>
        </el-collapse-item>
        <el-collapse-item title="❓ 如何获取用户的FeishuID？" name="2">
          <p><strong>方法1：查看登录失败日志</strong></p>
          <p>用户首次登录失败时，后端日志会显示：</p>
          <pre>[AuthService] ❌ 用户不在白名单中
[AuthService] 用户 OpenID: ou_abc123...</pre>
          <p>将这个OpenID填入表格的FeishuID列即可。</p>
        </el-collapse-item>
        <el-collapse-item title="❓ 配置后如何同步？" name="3">
          <p>配置完成后，需要触发同步：</p>
          <ol>
            <li>方式1：访问 <code>/api/sync/users</code> （需要实现触发按钮）</li>
            <li>方式2：等待定时任务自动同步</li>
            <li>方式3：后端管理员手动触发</li>
          </ol>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import api from '../utils/api';
import { ElMessage } from 'element-plus';
import { Link } from '@element-plus/icons-vue';
import { useUserStore } from '../stores/userStore';
import { DEFAULT_HEADERS, DEFAULT_FOOTERS } from '../stores/configStore';
import type { WorkMode } from '../stores/configStore';
import { useOrgConfigStore } from '../stores/orgConfigStore';
import OrgTemplateEditor from '../components/OrgTemplateEditor.vue';
import OrgStylePresets from '../components/OrgStylePresets.vue';

const userStore = useUserStore();
const orgConfigStore = useOrgConfigStore();
const userTableUrl = ref('');
const articleTableUrl = ref('');
const loading = ref(false);
const inviteCodeLoading = ref(false);
const inviteCodeInput = ref('');
const orgEditMode = ref<'daily' | 'three_rural' | 'reprint'>('daily');

// 获取默认首图 HTML（直接读取常量，不触发 setMode 副作用）
function getDefaultHeader(mode: string): string {
  return DEFAULT_HEADERS[mode as WorkMode] || DEFAULT_HEADERS.daily;
}

function getDefaultFooter(mode: string): string {
  return DEFAULT_FOOTERS[mode as WorkMode] || DEFAULT_FOOTERS.daily;
}

function handleExportOrgConfig() {
  const json = orgConfigStore.exportConfig();
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `org-template-config-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
  ElMessage.success('配置已导出');
}

function handleImportOrgConfig() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  input.onchange = async (e) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const success = orgConfigStore.importConfig(text);
      if (success) {
        ElMessage.success('配置导入成功');
      } else {
        ElMessage.error('配置文件格式错误');
      }
    } catch {
      ElMessage.error('读取文件失败');
    }
  };
  input.click();
}
const config = ref<any>({
  userTable: null,
  articleTable: null,
  tenantName: '',
  tenantSlug: '',
  inviteCode: '',
  inviteCodeExpires: null,
});

// 加载当前配置
onMounted(async () => {
  console.log('[TenantSettings] 开始加载配置...');
  try {
    const res = await api.get('/tenant/config');
    console.log('[TenantSettings] API响应:', res.data);
    
    if (res.data.success) {
      config.value = res.data.config;
      console.log('[TenantSettings] 配置加载成功:', config.value);
      
      // 如果已有配置，填充到输入框
      if (config.value.userTable?.tableUrl) {
        userTableUrl.value = config.value.userTable.tableUrl;
      }
      if (config.value.articleTable?.tableUrl) {
        articleTableUrl.value = config.value.articleTable.tableUrl;
      }
      if (config.value.inviteCode) {
        inviteCodeInput.value = config.value.inviteCode;
      }
    } else {
      console.warn('[TenantSettings] API返回失败:', res.data);
    }
  } catch (error: any) {
    console.error('[TenantSettings] 加载配置失败:', error);
    console.error('[TenantSettings] 错误详情:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message
    });
    
    if (error.response?.status === 401) {
      ElMessage.error('未登录或登录已过期，请重新登录');
    } else {
      ElMessage.error('加载配置失败: ' + (error.response?.data?.message || error.message));
    }
  }
});

// 配置人员管理表
async function configureUserTable() {
  if (!userTableUrl.value) {
    ElMessage.warning('请输入表格链接');
    return;
  }

  loading.value = true;
  try {
    const res = await api.post('/tenant/config/user-table', {
      tableUrl: userTableUrl.value.trim(),
    });

    if (res.data.success) {
      ElMessage.success('人员管理表配置成功！');
      config.value.userTable = {
        ...res.data.config,
        tableUrl: userTableUrl.value,
      };
    }
  } catch (error: any) {
    const message = error.response?.data?.message || '配置失败';
    ElMessage.error(message);
  } finally {
    loading.value = false;
  }
}

// 配置文章管理表
async function configureArticleTable() {
  if (!articleTableUrl.value) {
    ElMessage.warning('请输入表格链接');
    return;
  }

  loading.value = true;
  try {
    const res = await api.post('/tenant/config/article-table', {
      tableUrl: articleTableUrl.value.trim(),
    });

    if (res.data.success) {
      ElMessage.success('文章管理表配置成功！');
      config.value.articleTable = {
        ...res.data.config,
        tableUrl: articleTableUrl.value,
      };
    }
  } catch (error: any) {
    const message = error.response?.data?.message || '配置失败';
    ElMessage.error(message);
  } finally {
    loading.value = false;
  }
}

// 更新邀请码
async function updateInviteCode() {
  const inviteCode = inviteCodeInput.value.trim();
  if (!inviteCode) {
    ElMessage.warning('请输入邀请码');
    return;
  }

  if (!userStore.isAdmin) {
    ElMessage.error('仅管理员可修改邀请码');
    return;
  }

  if (!userStore.tenantId) {
    ElMessage.error('未获取到当前租户信息');
    return;
  }

  inviteCodeLoading.value = true;
  try {
    const res = await api.post(`/tenants/${userStore.tenantId}/invite-code`, {
      inviteCode,
    });
    config.value.inviteCode = res.data.inviteCode;
    config.value.inviteCodeExpires = res.data.inviteCodeExpires || null;
    inviteCodeInput.value = res.data.inviteCode;
    ElMessage.success('邀请码更新成功');
  } catch (error: any) {
    const message = error.response?.data?.message || '邀请码更新失败';
    ElMessage.error(message);
  } finally {
    inviteCodeLoading.value = false;
  }
}
</script>

<style scoped>
.tenant-settings {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

.settings-header {
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid #e0e0e0;
}

.settings-header h1 {
  margin: 0 0 10px 0;
  font-size: 28px;
  color: #333;
}

.subtitle {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.config-section {
  margin-bottom: 40px;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.section-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
}

.section-header h2 {
  margin: 0;
  font-size: 20px;
  color: #333;
}

.config-description {
  margin-bottom: 20px;
  padding: 15px;
  background: #f5f7fa;
  border-radius: 4px;
}

.config-description p {
  margin: 0 0 10px 0;
  color: #666;
}

.config-description ul {
  margin: 10px 0;
  padding-left: 20px;
}

.config-description li {
  margin: 5px 0;
  color: #666;
}

.field-list {
  font-size: 13px;
  background: rgba(255, 255, 255, 0.5);
  padding: 10px 10px 10px 30px !important;
  border-radius: 4px;
}

.hint-text {
  color: #409eff !important;
  font-size: 14px;
}

.config-input {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.config-input .el-input {
  flex: 1;
}

.config-details {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e0e0e0;
}

.tenant-info {
  margin-bottom: 30px;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 8px;
}

.tenant-info h3 {
  margin: 0 0 15px 0;
  font-size: 18px;
  color: #333;
}

.help-section {
  margin-top: 40px;
}

.help-section pre {
  background: #f5f5f5;
  padding: 10px;
  border-radius: 4px;
  overflow-x: auto;
}

.help-section code {
  background: #f5f5f5;
  padding: 2px 6px;
  border-radius: 3px;
  font-family: monospace;
}

.help-section ol {
  padding-left: 20px;
}

.help-section li {
  margin: 8px 0;
}
</style>
