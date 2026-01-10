<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-5xl mx-auto w-full space-y-8">
      <!-- 标题部分 -->
      <div class="text-center">
        <h2 class="mt-6 text-3xl font-extrabold text-gray-900">
          排版引擎
        </h2>
        <p class="mt-2 text-sm text-gray-600">
          选择公众号和工作模式开始排版
        </p>
      </div>

      <div class="flex flex-col md:flex-row gap-6">
        <!-- 左侧：公众号管理 -->
        <div class="flex-1 bg-white shadow rounded-lg p-6">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-medium text-gray-900">公众号管理</h3>
            <div class="flex space-x-3">
               <button
              @click="openAddAccountModal"
              class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              + 添加公众号
            </button>
            </div>
          </div>

          <div class="space-y-4">
            <div
              v-for="account in configStore.savedAccounts"
              :key="account.id"
              :class="[
                'border rounded-lg p-4 cursor-pointer transition-colors relative group',
                configStore.wechatConfig.id === account.id ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500' : 'border-gray-200 hover:border-blue-300'
              ]"
              @click="selectAccount(account.id)"
            >
              <div class="flex justify-between items-start">
                <div>
                  <h4 class="font-bold text-gray-900 flex items-center">
                    {{ account.name }}
                    <span v-if="configStore.wechatConfig.id === account.id" class="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      默认
                    </span>
                  </h4>
                  <p class="text-xs text-gray-500 mt-1">AppID: {{ maskAppId(account.appId) }}</p>
                </div>
                
                <div class="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button @click.stop="openEditAccountModal(account)" class="text-gray-400 hover:text-blue-500">
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                  </button>
                  <button 
                    v-if="configStore.savedAccounts.length > 1" 
                    @click.stop="deleteAccount(account.id)" 
                    class="text-gray-400 hover:text-red-500"
                  >
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧：模式选择 -->
        <div class="flex-1 bg-white shadow rounded-lg p-6 flex flex-col">
          <h3 class="text-lg font-medium text-gray-900 mb-6">选择工作模式</h3>

          <div class="space-y-4 flex-1">
            <div
              @click="configStore.setMode('daily')"
              :class="[
                'border rounded-lg p-4 cursor-pointer flex items-center space-x-4 transition-all',
                configStore.mode === 'daily' ? 'border-blue-500 ring-2 ring-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
              ]"
            >
              <div class="flex-shrink-0 h-10 w-10 bg-orange-100 rounded-full flex items-center justify-center text-xl">
                📝
              </div>
              <div>
                <h4 class="font-bold text-gray-900">日常模式</h4>
                <p class="text-sm text-gray-500">日常公众号内容排版</p>
              </div>
            </div>

            <div
              @click="configStore.setMode('three_rural')"
              :class="[
                'border rounded-lg p-4 cursor-pointer flex items-center space-x-4 transition-all',
                configStore.mode === 'three_rural' ? 'border-blue-500 ring-2 ring-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
              ]"
            >
              <div class="flex-shrink-0 h-10 w-10 bg-green-100 rounded-full flex items-center justify-center text-xl">
                🏡
              </div>
              <div>
                <h4 class="font-bold text-gray-900">三下乡模式</h4>
                <p class="text-sm text-gray-500">三下乡专项活动排版</p>
              </div>
            </div>

            <div
              @click="configStore.setMode('reprint')"
              :class="[
                'border rounded-lg p-4 cursor-pointer flex items-center space-x-4 transition-all',
                configStore.mode === 'reprint' ? 'border-blue-500 ring-2 ring-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
              ]"
            >
              <div class="flex-shrink-0 h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center text-xl">
                📋
              </div>
              <div>
                <h4 class="font-bold text-gray-900">转载模式</h4>
                <p class="text-sm text-gray-500">转载文章排版模板</p>
              </div>
            </div>
          </div>

          <div class="mt-8">
            <button
              @click="enterWork"
              class="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              进入工作
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 账号编辑弹窗 -->
    <div v-if="showModal" class="fixed inset-0 z-10 overflow-y-auto">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity" aria-hidden="true">
          <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">{{ isEditing ? '编辑公众号' : '添加公众号' }}</h3>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">名称</label>
                <input v-model="form.name" type="text" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="例如：Lx05.art">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">AppID</label>
                <input v-model="form.appId" type="text" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
              </div>
              <div>
                <p class="text-xs text-gray-500">AppSecret 仅可在后台配置，此处不再展示。</p>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button @click="saveAccount" type="button" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm">
              保存
            </button>
            <button @click="showModal = false" type="button" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
              取消
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
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

const saveAccount = () => {
  if (!form.value.name || !form.value.appId) {
    alert('请填写完整信息')
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

const deleteAccount = (id: string) => {
  if (confirm('确定要删除该公众号配置吗？')) {
    configStore.removeAccount(id)
  }
}

const enterWork = () => {
  router.push('/step1')
}
</script>
