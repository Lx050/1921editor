<template>
  <div style="min-height:100vh; background:var(--color-bg-warm); padding:40px 24px;">
    <div style="max-width:960px; margin:0 auto;">
      <!-- 标题部分 -->
      <div style="text-align:center; margin-bottom:40px;">
        <h2 style="font-size:28px; font-weight:700; color:rgba(0,0,0,0.95); margin:0 0 8px 0;">
          排版引擎
        </h2>
        <p style="font-size:14px; color:var(--color-text-secondary); margin:0;">
          选择公众号和工作模式开始排版
        </p>
      </div>

      <div class="flex flex-col md:flex-row gap-6">
        <!-- 左侧：公众号管理 -->
        <div class="flex-1" style="background:#fff; border:1px solid rgba(0,0,0,0.1); border-radius:12px; box-shadow:var(--shadow-content-card); padding:24px;">
          <div class="flex justify-between items-center" style="margin-bottom:20px;">
            <h3 style="font-size:16px; font-weight:600; color:rgba(0,0,0,0.95); margin:0;">公众号管理</h3>
            <button
              @click="openAddAccountModal"
              style="display:inline-flex; align-items:center; padding:6px 14px; background:var(--color-accent-primary); color:#fff; font-size:13px; font-weight:500; border:none; border-radius:4px; cursor:pointer; transition:background 0.15s;"
              @mouseenter="e => e.target.style.background='var(--color-accent-hover)'"
              @mouseleave="e => e.target.style.background='var(--color-accent-primary)'"
            >
              + 添加公众号
            </button>
          </div>

          <div class="space-y-3">
            <div v-if="configStore.savedAccounts.length === 0" class="text-center py-8" style="color:var(--color-text-muted);">
              <p class="text-sm">暂无授权账号</p>
            </div>
            <div
              v-for="account in configStore.savedAccounts"
              :key="account.id"
              :style="[
                'border-radius:8px; padding:14px 16px; cursor:pointer; transition:border-color 0.15s, background 0.15s; position:relative;',
                configStore.wechatConfig.id === account.id
                  ? 'border:1px solid var(--color-accent-primary); background:var(--color-badge-bg);'
                  : 'border:1px solid rgba(0,0,0,0.1); background:#fff;'
              ].join('')"
              class="group"
              @click="selectAccount(account.id)"
            >
              <div class="flex justify-between items-start">
                <div>
                  <h4 style="font-weight:700; color:rgba(0,0,0,0.95); margin:0 0 4px 0; display:flex; align-items:center; font-size:14px;">
                    {{ account.name }}
                    <span
                      v-if="configStore.wechatConfig.id === account.id"
                      style="margin-left:8px; padding:1px 8px; font-size:11px; font-weight:600; border-radius:20px; background:var(--color-badge-bg); color:var(--color-badge-text);"
                    >
                      默认
                    </span>
                  </h4>
                  <p style="font-size:12px; color:var(--color-text-secondary); margin:0;">AppID: {{ maskAppId(account.appId) }}</p>
                </div>

                <div class="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button @click.stop="openEditAccountModal(account)" style="background:none; border:none; cursor:pointer; color:var(--color-text-muted); padding:2px;" @mouseenter="e => e.currentTarget.style.color='var(--color-accent-primary)'" @mouseleave="e => e.currentTarget.style.color='var(--color-text-muted)'" title="编辑账号" aria-label="编辑账号">
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                  </button>
                  <button
                    v-if="configStore.savedAccounts.length > 1"
                    @click.stop="deleteAccount(account.id)"
                    style="background:none; border:none; cursor:pointer; color:var(--color-text-muted); padding:2px;"
                    @mouseenter="e => e.currentTarget.style.color='#e53e3e'"
                    @mouseleave="e => e.currentTarget.style.color='var(--color-text-muted)'"
                    title="删除账号"
                    aria-label="删除账号"
                  >
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧：模式选择 -->
        <div class="flex-1 flex flex-col" style="background:#fff; border:1px solid rgba(0,0,0,0.1); border-radius:12px; box-shadow:var(--shadow-content-card); padding:24px;">
          <h3 style="font-size:16px; font-weight:600; color:rgba(0,0,0,0.95); margin:0 0 20px 0;">选择工作模式</h3>

          <div class="space-y-3 flex-1">
            <div
              @click="configStore.setMode('daily')"
              :style="[
                'border-radius:8px; padding:14px 16px; cursor:pointer; display:flex; align-items:center; gap:14px; transition:border-color 0.15s, background 0.15s;',
                configStore.mode === 'daily'
                  ? 'border:1px solid var(--color-accent-primary); background:var(--color-badge-bg);'
                  : 'border:1px solid rgba(0,0,0,0.1); background:#fff;'
              ].join('')"
            >
              <div style="flex-shrink:0; width:40px; height:40px; background:#fff7ed; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:20px;">
                📝
              </div>
              <div>
                <h4 style="font-weight:700; color:rgba(0,0,0,0.95); margin:0 0 2px 0; font-size:14px;">日常模式</h4>
                <p style="font-size:13px; color:var(--color-text-secondary); margin:0;">日常公众号内容排版</p>
              </div>
            </div>

            <div
              @click="configStore.setMode('three_rural')"
              :style="[
                'border-radius:8px; padding:14px 16px; cursor:pointer; display:flex; align-items:center; gap:14px; transition:border-color 0.15s, background 0.15s;',
                configStore.mode === 'three_rural'
                  ? 'border:1px solid var(--color-accent-primary); background:var(--color-badge-bg);'
                  : 'border:1px solid rgba(0,0,0,0.1); background:#fff;'
              ].join('')"
            >
              <div style="flex-shrink:0; width:40px; height:40px; background:var(--color-success-light); border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:20px;">
                🏡
              </div>
              <div>
                <h4 style="font-weight:700; color:rgba(0,0,0,0.95); margin:0 0 2px 0; font-size:14px;">三下乡模式</h4>
                <p style="font-size:13px; color:var(--color-text-secondary); margin:0;">三下乡专项活动排版</p>
              </div>
            </div>

            <div
              @click="configStore.setMode('reprint')"
              :style="[
                'border-radius:8px; padding:14px 16px; cursor:pointer; display:flex; align-items:center; gap:14px; transition:border-color 0.15s, background 0.15s;',
                configStore.mode === 'reprint'
                  ? 'border:1px solid var(--color-accent-primary); background:var(--color-badge-bg);'
                  : 'border:1px solid rgba(0,0,0,0.1); background:#fff;'
              ].join('')"
            >
              <div style="flex-shrink:0; width:40px; height:40px; background:#faf5ff; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:20px;">
                📋
              </div>
              <div>
                <h4 style="font-weight:700; color:rgba(0,0,0,0.95); margin:0 0 2px 0; font-size:14px;">转载模式</h4>
                <p style="font-size:13px; color:var(--color-text-secondary); margin:0;">转载文章排版模板</p>
              </div>
            </div>
          </div>

          <div style="margin-top:24px;">
            <button
              @click="enterWork"
              style="width:100%; padding:12px 16px; background:var(--color-accent-primary); color:#fff; font-size:14px; font-weight:500; border:none; border-radius:4px; cursor:pointer; transition:background 0.15s;"
              @mouseenter="e => e.target.style.background='var(--color-accent-hover)'"
              @mouseleave="e => e.target.style.background='var(--color-accent-primary)'"
            >
              进入工作
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 账号编辑弹窗 -->
    <Transition
      enter-active-class="transition-all duration-150 ease-out"
      leave-active-class="transition-all duration-100 ease-in"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
    >
    <div v-if="showModal" class="fixed inset-0 z-10 overflow-y-auto">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity" aria-hidden="true">
          <div class="absolute inset-0" style="background:rgba(0,0,0,0.4);"></div>
        </div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div class="inline-block align-bottom text-left overflow-hidden transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full" style="background:#fff; border-radius:12px; box-shadow:var(--shadow-content-card);">
          <div style="padding:24px 24px 16px 24px;">
            <h3 style="font-size:16px; font-weight:600; color:rgba(0,0,0,0.95); margin:0 0 20px 0;">{{ isEditing ? '编辑公众号' : '添加公众号' }}</h3>
            <div class="space-y-4">
              <div>
                <label style="display:block; font-size:13px; font-weight:500; color:rgba(0,0,0,0.7); margin-bottom:6px;">名称</label>
                <input v-model="form.name" type="text" class="notion-input" style="width:100%; padding:8px 12px; border:1px solid rgba(0,0,0,0.1); border-radius:4px; font-size:14px; color:rgba(0,0,0,0.95); background:#fff; outline:none; box-sizing:border-box;" placeholder="例如：Lx05.art" onfocus="this.style.borderColor='var(--color-accent-primary)'" onblur="this.style.borderColor=''">
              </div>
              <div>
                <label style="display:block; font-size:13px; font-weight:500; color:rgba(0,0,0,0.7); margin-bottom:6px;">AppID</label>
                <input v-model="form.appId" type="text" class="notion-input" style="width:100%; padding:8px 12px; border:1px solid rgba(0,0,0,0.1); border-radius:4px; font-size:14px; color:rgba(0,0,0,0.95); background:#fff; outline:none; box-sizing:border-box;" onfocus="this.style.borderColor='var(--color-accent-primary)'" onblur="this.style.borderColor=''">
              </div>
              <div>
                <p style="font-size:12px; color:var(--color-text-muted); margin:0;">AppSecret 仅可在后台配置，此处不再展示。</p>
              </div>
            </div>
          </div>
          <div style="background:var(--color-bg-warm); padding:14px 24px; display:flex; flex-direction:row-reverse; gap:10px; border-top:1px solid rgba(0,0,0,0.06);">
            <button
              @click="saveAccount"
              type="button"
              style="padding:8px 20px; background:var(--color-accent-primary); color:#fff; font-size:13px; font-weight:500; border:none; border-radius:4px; cursor:pointer; transition:background 0.15s;"
              @mouseenter="e => e.target.style.background='var(--color-accent-hover)'"
              @mouseleave="e => e.target.style.background='var(--color-accent-primary)'"
            >
              保存
            </button>
            <button
              @click="showModal = false"
              type="button"
              style="padding:8px 20px; background:#fff; color:rgba(0,0,0,0.7); font-size:13px; font-weight:500; border:1px solid rgba(0,0,0,0.1); border-radius:4px; cursor:pointer; transition:background 0.15s;"
              @mouseenter="e => e.target.style.background='var(--color-bg-warm)'"
              @mouseleave="e => e.target.style.background='#fff'"
            >
              取消
            </button>
          </div>
        </div>
      </div>
    </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { showConfirm, showAlert } from '@/composables/useConfirm'
import { useConfigStore, type WechatConfig } from '../stores/configStore'

const router = useRouter()
const configStore = useConfigStore()

const showModal = ref(false)
const isEditing = ref(false)
const form = ref<Partial<WechatConfig>>({
  name: '',
  appId: ''
})

const maskAppId = (id: string) => {
  if (!id) return ''
  return id.length > 8 ? id.substring(0, 4) + '****' + id.substring(id.length - 4) : id
}

const selectAccount = (id: string) => {
  configStore.selectAccount(id)
}

const openAddAccountModal = () => {
  isEditing.value = false
  form.value = {
    name: '',
    appId: ''
  }
  showModal.value = true
}

const openEditAccountModal = (account: WechatConfig) => {
  isEditing.value = true
  form.value = { ...account }
  showModal.value = true
}

const saveAccount = async () => {
  if (!form.value.name || !form.value.appId) {
    await showAlert('请填写完整信息')
    return
  }

  const account: WechatConfig = {
    id: isEditing.value ? (form.value.id || '') : Date.now().toString(),
    name: form.value.name || '',
    appId: form.value.appId || '',
    appSecretMasked: form.value.appSecretMasked || '',
    hasSecret: form.value.hasSecret ?? false
  }

  configStore.saveAccount(account)
  showModal.value = false
}

const deleteAccount = async (id: string) => {
  const confirmed = await showConfirm({ title: '确认删除', message: '确定要删除该公众号配置吗？', type: 'danger', confirmText: '删除', cancelText: '取消' })
  if (confirmed) {
    configStore.removeAccount(id)
  }
}

const enterWork = () => {
  router.push('/step1')
}
</script>
