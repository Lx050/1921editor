<template>
  <div class="bg-white rounded-lg shadow-lg p-6 max-w-2xl">
    <h2 class="text-xl font-bold mb-4 text-gray-800">图片上传配置</h2>

    <!-- 策略选择器 -->
    <div class="mb-6">
      <label class="block text-sm font-medium text-gray-700 mb-2">
        上传策略
      </label>
      <select
        v-model="selectedStrategy"
        @change="onStrategyChange"
        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="base64">Base64 内嵌（默认，离线可用）</option>
        <option value="wechat">微信公众号图床（推荐）</option>
        <option value="smms">SM.MS 免费图床</option>
        <option value="github">GitHub 仓库托管</option>
        <option value="custom">自定义服务器</option>
      </select>
      <p class="mt-1 text-xs text-gray-500">
        {{ strategyDescriptions[selectedStrategy] }}
      </p>
    </div>

    <!-- Base64 策略说明 -->
    <div v-if="selectedStrategy === 'base64'" class="mb-4 p-4 bg-blue-50 rounded-md">
      <p class="text-sm text-gray-700">
        Base64 策略将图片直接嵌入到 HTML 中，无需额外配置。<br>
        优点：离线可用、无需服务器<br>
        缺点：生成的 HTML 较大，不适合大量图片
      </p>
    </div>

    <!-- 微信公众号图床配置 -->
    <div v-if="selectedStrategy === 'wechat'" class="space-y-4 mb-4">
      <!-- 微信授权状态 -->
      <div class="p-4 rounded-md" :class="wechatStatus.authorized ? 'bg-green-50' : 'bg-yellow-50'">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-medium" :class="wechatStatus.authorized ? 'text-green-700' : 'text-yellow-700'">
            {{ wechatStatus.authorized ? '已授权' : '未授权' }}
          </span>
          <button
            @click="checkWxStatus"
            :disabled="checkingWxStatus"
            class="text-xs px-2 py-1 bg-white border rounded hover:bg-gray-50 disabled:opacity-50"
          >
            {{ checkingWxStatus ? '检查中...' : '检查状态' }}
          </button>
        </div>
        <div v-if="wechatStatus.authorized && wechatStatus.accounts.length > 0">
          <p class="text-xs text-gray-600">已授权公众号：</p>
          <ul class="mt-1 space-y-1">
            <li v-for="acc in wechatStatus.accounts" :key="acc.authorizerAppId" class="text-xs text-gray-700">
              {{ acc.nickName || acc.authorizerAppId }}
            </li>
          </ul>
        </div>
        <p v-else class="text-xs text-gray-600">
          请先在 content-backend 中完成微信公众号授权，才能使用图片上传功能。
        </p>
      </div>

      <div class="p-4 bg-blue-50 rounded-md">
        <p class="text-sm text-gray-700">
          通过 content-backend 将图片上传到微信永久素材库。<br>
          优点：图片托管在微信 CDN，公众号文章内直接可用，无防盗链问题。<br>
          注意：需要已部署 content-backend 并完成微信公众号授权。
        </p>
      </div>
    </div>

    <!-- SM.MS 配置 -->
    <div v-if="selectedStrategy === 'smms'" class="space-y-4 mb-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          SM.MS API Token
          <a href="https://sm.ms/home/apitoken" target="_blank" class="text-blue-500 text-xs ml-2">
            (获取 Token)
          </a>
        </label>
        <input
          v-model="config.smms.token"
          type="password"
          placeholder="输入您的 SM.MS API Token"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div class="p-4 bg-yellow-50 rounded-md">
        <p class="text-sm text-gray-700">
          SM.MS 是免费图床服务，每日限额 5GB 流量。<br>
          需要注册账号并生成 API Token。
        </p>
      </div>
    </div>

    <!-- GitHub 配置 -->
    <div v-if="selectedStrategy === 'github'" class="space-y-4 mb-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          GitHub Token
          <a href="https://github.com/settings/tokens" target="_blank" class="text-blue-500 text-xs ml-2">
            (生成 Token)
          </a>
        </label>
        <input
          v-model="config.github.token"
          type="password"
          placeholder="ghp_xxxxxxxxxxxx"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p class="mt-1 text-xs text-gray-500">需要 repo 权限</p>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          仓库地址
        </label>
        <input
          v-model="config.github.repo"
          type="text"
          placeholder="username/repository"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            分支
          </label>
          <input
            v-model="config.github.branch"
            type="text"
            placeholder="main"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            存储路径
          </label>
          <input
            v-model="config.github.path"
            type="text"
            placeholder="images"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      <div class="p-4 bg-blue-50 rounded-md">
        <p class="text-sm text-gray-700">
          图片将上传到 GitHub 仓库，并通过 jsDelivr CDN 加速访问。<br>
          确保仓库是公开的，否则 CDN 无法访问。
        </p>
      </div>
    </div>

    <!-- 自定义服务器配置 -->
    <div v-if="selectedStrategy === 'custom'" class="space-y-4 mb-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          服务器地址
        </label>
        <input
          v-model="config.custom.server"
          type="url"
          placeholder="https://your-server.com/upload"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          授权 Token（可选）
        </label>
        <input
          v-model="config.custom.token"
          type="password"
          placeholder="Bearer token"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div class="p-4 bg-gray-50 rounded-md">
        <p class="text-sm text-gray-700">
          服务器需要接受 multipart/form-data 格式的 POST 请求，<br>
          并返回 JSON: <code class="bg-gray-200 px-1">{"{ url: '...' }"}</code>
        </p>
      </div>
    </div>

    <!-- 测试上传 -->
    <div class="mb-6">
      <button
        @click="testUpload"
        :disabled="testing || selectedStrategy === 'base64'"
        class="w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
      >
        {{ testing ? '测试中...' : '测试上传' }}
      </button>
      <p v-if="selectedStrategy === 'base64'" class="mt-1 text-xs text-gray-500 text-center">
        Base64 策略无需测试
      </p>
      <p v-if="testResult" :class="testResult.success ? 'text-green-600' : 'text-red-600'" class="mt-2 text-sm">
        {{ testResult.message }}
      </p>
    </div>

    <!-- 操作按钮 -->
    <div class="flex gap-3">
      <button
        @click="saveConfig"
        class="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
      >
        保存配置
      </button>
      <button
        @click="$emit('close')"
        class="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
      >
        取消
      </button>
    </div>

    <!-- 保存成功提示 -->
    <div v-if="saved" class="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
      <p class="text-sm text-green-700">配置已保存</p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { setActiveStrategy, getActiveStrategy, uploadImage, checkWechatStatus } from '../utils/imageUploader.js'

// 策略描述
const strategyDescriptions = {
  base64: '图片直接嵌入 HTML，适合少量图片，离线可用',
  wechat: '通过 content-backend 上传到微信 CDN，公众号文章最佳选择',
  smms: '免费图床服务，每日 5GB 流量限制',
  github: '使用 GitHub 仓库 + jsDelivr CDN，稳定快速',
  custom: '自建服务器，完全自主控制'
}

// 微信授权状态
const wechatStatus = reactive({ authorized: false, accounts: [] })
const checkingWxStatus = ref(false)

// 当前选择的策略
const selectedStrategy = ref('base64')

// 配置表单
const config = reactive({
  smms: {
    token: ''
  },
  github: {
    token: '',
    repo: '',
    branch: 'main',
    path: 'images'
  },
  custom: {
    server: '',
    token: ''
  }
})

// 测试状态
const testing = ref(false)
const testResult = ref(null)
const saved = ref(false)

// 加载已保存的配置
onMounted(() => {
  // 加载策略选择
  const savedStrategy = localStorage.getItem('upload_strategy')
  if (savedStrategy) {
    selectedStrategy.value = savedStrategy
  } else {
    selectedStrategy.value = getActiveStrategy()
  }

  // 加载各策略配置
  config.smms.token = localStorage.getItem('smms_token') || ''
  config.github.token = localStorage.getItem('github_token') || ''
  config.github.repo = localStorage.getItem('github_repo') || ''
  config.github.branch = localStorage.getItem('github_branch') || 'main'
  config.github.path = localStorage.getItem('github_path') || 'images'
  config.custom.server = localStorage.getItem('custom_upload_server') || ''
  config.custom.token = localStorage.getItem('custom_upload_token') || ''

  // 如果选择的是微信策略，自动检查授权状态
  if (selectedStrategy.value === 'wechat') {
    checkWxStatus()
  }
})

// 策略切换
const onStrategyChange = () => {
  testResult.value = null
  saved.value = false
}

// 测试上传
const testUpload = async () => {
  testing.value = true
  testResult.value = null

  try {
    // 保存当前配置到 localStorage（临时）
    saveCurrentStrategyConfig()

    // 设置策略
    setActiveStrategy(selectedStrategy.value)

    // 创建一个 1x1 像素的测试图片
    const canvas = document.createElement('canvas')
    canvas.width = 1
    canvas.height = 1
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#0000FF'
    ctx.fillRect(0, 0, 1, 1)

    // 转换为 ArrayBuffer
    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'))
    const arrayBuffer = await blob.arrayBuffer()

    // 上传测试
    const url = await uploadImage(arrayBuffer, 'image/png', 'test.png')

    testResult.value = {
      success: true,
      message: `上传成功！URL: ${url.substring(0, 60)}${url.length > 60 ? '...' : ''}`
    }
  } catch (error) {
    testResult.value = {
      success: false,
      message: `上传失败: ${error.message}`
    }
  } finally {
    testing.value = false
  }
}

// 检查微信授权状态
const checkWxStatus = async () => {
  checkingWxStatus.value = true
  try {
    const status = await checkWechatStatus()
    wechatStatus.authorized = status.authorized
    wechatStatus.accounts = status.accounts
  } catch {
    wechatStatus.authorized = false
    wechatStatus.accounts = []
  } finally {
    checkingWxStatus.value = false
  }
}

// 保存当前策略的配置到 localStorage
const saveCurrentStrategyConfig = () => {
  if (selectedStrategy.value === 'smms') {
    localStorage.setItem('smms_token', config.smms.token)
  } else if (selectedStrategy.value === 'github') {
    localStorage.setItem('github_token', config.github.token)
    localStorage.setItem('github_repo', config.github.repo)
    localStorage.setItem('github_branch', config.github.branch)
    localStorage.setItem('github_path', config.github.path)
  } else if (selectedStrategy.value === 'custom') {
    localStorage.setItem('custom_upload_server', config.custom.server)
    localStorage.setItem('custom_upload_token', config.custom.token)
  }
}

// 保存配置
const saveConfig = () => {
  // 保存策略选择
  localStorage.setItem('upload_strategy', selectedStrategy.value)

  // 保存各策略配置
  saveCurrentStrategyConfig()

  // 设置激活策略
  setActiveStrategy(selectedStrategy.value)

  saved.value = true
  setTimeout(() => {
    saved.value = false
  }, 2000)
}

// 定义 emit
defineEmits(['close'])
</script>

<style scoped>
/* 自定义样式（如需要） */
code {
  font-family: 'Courier New', monospace;
  font-size: 0.875rem;
}
</style>
