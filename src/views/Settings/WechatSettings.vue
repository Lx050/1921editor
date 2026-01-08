<template>
  <div class="wechat-settings max-w-4xl mx-auto py-8 px-4">
    <div class="mb-8 flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">公众号管理</h1>
        <p class="mt-1 text-sm text-gray-500">管理您的微信公众号配置，设置默认发布的账号。</p>
      </div>
      <button
        @click="openAddAccountModal"
        class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <svg class="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
        </svg>
        添加公众号
      </button>
    </div>

    <!-- 账号列表 -->
    <div class="bg-white shadow overflow-hidden sm:rounded-md">
      <ul v-if="configStore.savedAccounts.length > 0" class="divide-y divide-gray-200">
        <li v-for="account in configStore.savedAccounts" :key="account.id">
          <div class="px-4 py-4 sm:px-6 hover:bg-gray-50 transition-colors">
            <div class="flex items-center justify-between">
              <div class="flex-1 min-w-0" @click="selectAccount(account.id)">
                <div class="flex items-center cursor-pointer">
                  <p class="text-sm font-medium text-blue-600 truncate mr-2">{{ account.name }}</p>
                  <span v-if="configStore.wechatConfig.id === account.id" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    默认
                  </span>
                </div>
                <div class="mt-2 flex">
                  <div class="flex items-center text-sm text-gray-500">
                    <svg class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
                    </svg>
                    <p>AppID: {{ maskAppId(account.appId) }}</p>
                  </div>
                </div>
              </div>
              <div class="flex space-x-4">
                <button 
                  @click="openEditAccountModal(account)" 
                  class="text-gray-400 hover:text-blue-600 transition-colors"
                  title="编辑"
                >
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                  </svg>
                </button>
                <button 
                  @click="deleteAccount(account.id)" 
                  class="text-gray-400 hover:text-red-600 transition-colors"
                  title="删除"
                >
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </li>
      </ul>
      <div v-else class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">暂无公众号</h3>
        <p class="mt-1 text-sm text-gray-500">点击右上角按钮添加您的第一个公众号配置。</p>
      </div>
    </div>

    <!-- 编辑弹窗 -->
    <div v-if="showModal" class="fixed inset-0 z-10 overflow-y-auto">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity" aria-hidden="true" @click="showModal = false">
          <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">{{ isEditing ? '编辑公众号' : '添加公众号' }}</h3>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">名称</label>
                <input v-model="form.name" type="text" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="例如：我的公众号">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">AppID</label>
                <input v-model="form.appId" type="text" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">AppSecret</label>
                <input v-model="form.appSecret" type="text" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
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
import { useConfigStore, type WechatConfig } from '../../stores/configStore'

const configStore = useConfigStore()

const showModal = ref(false)
const isEditing = ref(false)
const form = ref<Partial<WechatConfig>>({
  name: '',
  appId: '',
  appSecret: ''
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
    appId: '',
    appSecret: ''
  }
  showModal.value = true
}

const openEditAccountModal = (account: WechatConfig) => {
  isEditing.value = true
  form.value = { ...account }
  showModal.value = true
}

const saveAccount = () => {
  if (!form.value.name || !form.value.appId || !form.value.appSecret) {
    alert('请填写完整信息')
    return
  }

  const account: WechatConfig = {
    id: isEditing.value ? (form.value.id || '') : Date.now().toString(),
    name: form.value.name || '',
    appId: form.value.appId || '',
    appSecret: form.value.appSecret || ''
  }

  configStore.saveAccount(account)
  showModal.value = false
}

const deleteAccount = (id: string) => {
  if (confirm('确定要删除该公众号配置吗？')) {
    configStore.removeAccount(id)
  }
}
</script>
