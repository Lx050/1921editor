<template>
  <div class="wechat-settings max-w-4xl mx-auto py-8 px-4">
    <div class="mb-8 flex flex-col gap-2">
      <h1 class="text-2xl font-bold text-gray-900">公众号管理</h1>
      <p class="text-sm text-gray-500">
        仅租户管理员可修改公众号密钥，更新需邮箱确认。
      </p>
    </div>

    <div class="bg-white shadow rounded-lg p-6 space-y-6">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div class="space-y-1">
          <p class="text-sm text-gray-500">当前组织</p>
          <p class="text-lg font-semibold text-gray-900">
            {{ tenantName }}
          </p>
        </div>
        <button
          @click="openRequestModal"
          :disabled="!canEdit"
          class="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          申请修改密钥
        </button>
      </div>

      <div class="border-t border-gray-100 pt-6 grid gap-4 md:grid-cols-2">
        <div class="bg-gray-50 rounded-lg p-4">
          <p class="text-xs text-gray-500 mb-1">AppID</p>
          <p class="text-sm font-semibold text-gray-900">
            {{ maskAppId(configStore.wechatConfig.appId) || '-' }}
          </p>
        </div>
        <div class="bg-gray-50 rounded-lg p-4">
          <p class="text-xs text-gray-500 mb-1">AppSecret</p>
          <p class="text-sm font-semibold text-gray-900">
            {{ secretDisplay }}
          </p>
        </div>
      </div>

      <div class="text-xs text-gray-400 leading-relaxed">
        说明：密钥不会展示明文，修改需要邮件确认，旧密钥会被覆盖并销毁。
      </div>
    </div>

    <div class="mt-8">
      <div class="mb-4">
        <h2 class="text-lg font-semibold text-gray-900">公众号授权</h2>
        <p class="text-sm text-gray-500">用于将组织公众号与平台绑定，支持素材上传与草稿同步。</p>
      </div>
      <WechatAuthManager />
    </div>

    <div v-if="showModal" class="fixed inset-0 z-10 overflow-y-auto">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity" aria-hidden="true" @click="showModal = false">
          <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">申请修改公众号密钥</h3>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">新 AppID</label>
                <input
                  v-model="form.appId"
                  type="text"
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="请输入新的 AppID"
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">新 AppSecret</label>
                <input
                  v-model="form.appSecret"
                  type="password"
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="请输入新的 AppSecret"
                >
              </div>
              <p class="text-xs text-gray-400">
                提交后将发送确认邮件给当前管理员，确认后才会生效。
              </p>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              @click="submitRequest"
              type="button"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
              :disabled="loading"
            >
              {{ loading ? '发送中...' : '发送确认邮件' }}
            </button>
            <button
              @click="showModal = false"
              type="button"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              取消
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useConfigStore } from '../../stores/configStore'
import { useUserStore } from '../../stores/userStore'
import { tenantApi } from '../../utils/api'
import toast from '../../composables/useToast'
import WechatAuthManager from '../../components/WechatAuthManager.vue'

const configStore = useConfigStore()
const userStore = useUserStore()

const showModal = ref(false)
const loading = ref(false)
const form = ref({
  appId: '',
  appSecret: ''
})

const tenantName = computed(() => {
  return userStore.currentTenant?.name || '未选择组织'
})

const canEdit = computed(() => userStore.isAdmin)

const secretDisplay = computed(() => {
  if (configStore.wechatConfig.appSecretMasked) {
    return configStore.wechatConfig.appSecretMasked
  }
  if (configStore.wechatConfig.hasSecret) {
    return '****'
  }
  return '未设置'
})

const maskAppId = (id: string) => {
  if (!id) return ''
  return id.length > 8 ? `${id.substring(0, 4)}****${id.substring(id.length - 4)}` : id
}

const openRequestModal = () => {
  if (!canEdit.value) {
    toast.error('仅管理员可以修改公众号密钥')
    return
  }
  form.value = { appId: '', appSecret: '' }
  showModal.value = true
}

const submitRequest = async () => {
  if (!form.value.appId || !form.value.appSecret) {
    toast.error('请填写完整的 AppID 和 AppSecret')
    return
  }

  loading.value = true
  try {
    await tenantApi.requestWechatCredentialChange({
      appId: form.value.appId.trim(),
      appSecret: form.value.appSecret.trim()
    })
    toast.success('确认邮件已发送，请查收邮箱')
    showModal.value = false
  } catch (error: unknown) {
    console.error('请求失败:', error)
    toast.error(error.response?.data?.message || '发送失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (userStore.currentTenant?.id) {
    configStore.fetchBackendConfig(userStore.currentTenant.id)
  }
})
</script>
