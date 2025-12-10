<template>
  <div id="app" class="h-screen bg-gray-50 flex flex-col">
    <!-- 顶部导航栏 -->
    <header class="bg-white shadow-sm border-b">
      <div class="max-w-6xl mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span class="text-white font-bold text-sm">B</span>
            </div>
            <h1 class="text-xl font-bold text-gray-900">版式装配引擎 V1.0</h1>
          </div>
          <div class="flex items-center space-x-4">
            <!-- 样式配置按钮 - 只在第2步和第3步显示 -->


            <!-- 步骤指示器 -->
            <div class="flex items-center space-x-4">
              <div class="flex items-center" v-if="currentStep > 0">
                <div :class="[
                  'w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium',
                  currentStep === 1 ? 'bg-blue-600 text-white' : 'bg-green-600 text-white'
                ]">
                  <span v-if="currentStep > 1">✓</span>
                  <span v-else>1</span>
                </div>
                <span class="ml-1 text-sm font-medium hidden sm:inline">输入文本</span>
              </div>

              <div v-if="currentStep > 0" class="w-8 h-0.5 bg-gray-300 hidden sm:block"></div>

              <div class="flex items-center" v-if="currentStep > 0">
                <div :class="[
                  'w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium',
                  currentStep === 2 ? 'bg-blue-600 text-white' : currentStep > 2 ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-600'
                ]">
                  <span v-if="currentStep > 2">✓</span>
                  <span v-else>2</span>
                </div>
                <span class="ml-1 text-sm font-medium hidden sm:inline">编辑内容</span>
              </div>

              <div v-if="currentStep > 0" class="w-8 h-0.5 bg-gray-300 hidden sm:block"></div>

              <div class="flex items-center" v-if="currentStep > 0">
                <div :class="[
                  'w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium',
                  currentStep === 3 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
                ]">
                  3
                </div>
                <span class="ml-1 text-sm font-medium hidden sm:inline">生成预览</span>
              </div>
            </div>

            <!-- 分隔线 -->
            <div v-if="currentStep > 0" class="h-6 w-px bg-gray-200 mx-2"></div>

            <!-- 配置按钮/信息 - 放在最右侧 -->
            <button 
              @click="goToConfig" 
              class="flex items-center space-x-2 pl-3 pr-4 py-1.5 bg-gray-50 hover:bg-gray-100 rounded-full border border-gray-200 transition-colors group"
              title="切换配置"
            >
              <div class="p-1 bg-gray-200 rounded-full text-gray-500 group-hover:bg-white group-hover:text-blue-500 transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
              </div>
              <div class="flex flex-col items-start">
                <span class="text-xs text-gray-500">{{ configStore.mode === 'daily' ? '日常模式' : configStore.mode === 'three_rural' ? '三下乡' : '转载模式' }}</span>
                <span class="text-sm font-medium text-gray-900 leading-none max-w-[100px] truncate">{{ configStore.wechatConfig.name || '未配置' }}</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- 主要内容区域 -->
    <main class="w-full px-4 py-6 flex-1 flex flex-col">


      <!-- 路由视图 -->
      <div class="bg-white rounded-lg shadow-sm border flex-1 overflow-hidden">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAppStore } from './stores/appStore'
import { useConfigStore } from './stores/configStore'

const route = useRoute()
const router = useRouter()
const appStore = useAppStore()
const configStore = useConfigStore()

// 根据当前路由更新步骤
const currentStep = computed(() => {
  // 如果是主页(Config页)，步骤为0
  if (route.path === '/') return 0
  
  const step = route.meta?.step || 1
  appStore.setStep(step)
  return step
})

const goToConfig = () => {
  if (confirm('返回配置页将丢失当前未保存的进度，确定要返回吗？')) {
    router.push('/')
  }
}
</script>

<style scoped>
/* 组件特定的样式 */
</style>