<template>
  <div id="app" class="min-h-screen flex flex-col bg-[#f8f9fa]">
    <!-- 全局 Toast 通知 -->
    <Toast />

    <!-- 资源预加载器 -->
    <ResourcePreloader />

    <!-- 顶部导航栏 - 仅在非 Landing/Home 页面显示，或根据需要始终显示 -->
    <header
      v-if="showHeader"
      class="relative flex-none bg-white shadow-sm border-b border-gray-100 z-50"
    >
      <!-- 装饰性顶部色彩线条 (6px) -->
      <div class="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-400 via-purple-400 to-rose-400"></div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 py-3 md:py-4">
        <div class="flex items-center justify-between gap-2">
          <!-- Logo 区域 -->
          <div class="flex items-center space-x-2 md:space-x-4">
            <div class="relative flex-shrink-0">
              <div class="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg md:rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                <span class="text-white font-bold text-lg md:text-xl" style="font-family: var(--font-display)">B</span>
              </div>
            </div>
            <div class="hidden sm:block">
              <h1 class="text-sm md:text-lg font-bold text-gray-900 leading-tight" style="font-family: var(--font-display)">
                版式装配引擎
              </h1>
              <div class="flex items-center space-x-2">
                <span class="text-[8px] md:text-[10px] tracking-widest text-blue-600 font-bold uppercase">Professional Edition</span>
                <span class="text-[8px] md:text-[10px] text-gray-400">V1.0</span>
              </div>
            </div>
          </div>

          <!-- 步骤指示器 - 仅在步骤页面显示 -->
          <div v-if="isStepPage" class="flex items-center bg-gray-50 px-2 md:px-6 py-1.5 md:py-2 rounded-xl md:rounded-2xl border border-gray-100">
            <div class="flex items-center">
              <div
                :class="[
                  'w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center text-xs md:text-sm font-bold transition-all duration-300',
                  currentStep === 1
                    ? 'bg-blue-500 text-white shadow-md'
                    : currentStep > 1
                    ? 'bg-blue-100 text-blue-600'
                    : 'bg-white text-gray-400 border border-gray-200'
                ]"
              >
                <span v-if="currentStep > 1">✓</span>
                <span v-else>1</span>
              </div>
              <span class="ml-2 md:ml-3 text-xs md:text-sm font-medium hidden lg:inline" :class="currentStep === 1 ? 'text-gray-900' : 'text-gray-400'">
                输入文本
              </span>
            </div>

            <div class="w-4 md:w-10 h-[1px] bg-gray-200 mx-2 md:mx-4"></div>

            <div class="flex items-center">
              <div
                :class="[
                  'w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center text-xs md:text-sm font-bold transition-all duration-300',
                  currentStep === 2
                    ? 'bg-purple-500 text-white shadow-md'
                    : currentStep > 2
                    ? 'bg-purple-100 text-purple-600'
                    : 'bg-white text-gray-400 border border-gray-200'
                ]"
              >
                <span v-if="currentStep > 2">✓</span>
                <span v-else>2</span>
              </div>
              <span class="ml-2 md:ml-3 text-xs md:text-sm font-medium hidden lg:inline" :class="currentStep === 2 ? 'text-gray-900' : 'text-gray-400'">
                编辑内容
              </span>
            </div>

            <div class="w-4 md:w-10 h-[1px] bg-gray-200 mx-2 md:mx-4"></div>

            <div class="flex items-center">
              <div
                :class="[
                  'w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center text-xs md:text-sm font-bold transition-all duration-300',
                  currentStep === 3
                    ? 'bg-rose-500 text-white shadow-md'
                    : 'bg-white text-gray-400 border border-gray-200'
                ]"
              >
                3
              </div>
              <span class="ml-2 md:ml-3 text-xs md:text-sm font-medium hidden lg:inline" :class="currentStep === 3 ? 'text-gray-900' : 'text-gray-400'">
                生成预览
              </span>
            </div>
          </div>

          <!-- 返回首页按钮 -->
          <button
            @click="goToHome"
            class="flex items-center space-x-1 md:space-x-2 px-3 md:px-4 py-1.5 md:py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-lg md:rounded-xl transition-all duration-200 shadow-md shadow-blue-500/20 group flex-shrink-0"
          >
            <svg class="w-3.5 h-3.5 md:w-4 md:h-4 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            <span class="text-xs md:text-sm font-bold hidden sm:inline">首页</span>
            <span class="text-xs md:text-sm font-bold sm:hidden">返回</span>
          </button>
        </div>
      </div>
    </header>

    <!-- 主要内容区域 -->
    <main class="flex-1 flex flex-col min-h-0 relative">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAppStore } from './stores/appStore'
import ResourcePreloader from './components/ResourcePreloader.vue'
import Toast from './components/Toast.vue'

const route = useRoute()
const router = useRouter()
const appStore = useAppStore()

// 是否显示 Header
const showHeader = computed(() => {
  // 首页、Landing页以及所有鉴权相关页面都不显示全局 Header
  const noHeaderPages = [
    'Landing', 
    'Home', 
    'Login', 
    'Register', 
    'ForgotPassword', 
    'VerifyEmail'
  ]
  return !noHeaderPages.includes(route.name as string) && route.name !== undefined
})

// 是否为步骤页面
const isStepPage = computed(() => {
  return ['Step1', 'Step2', 'Step3', 'Step3WithArticle', 'StyleConfig'].includes(route.name as string)
})

// 根据当前路由更新步骤
const currentStep = computed(() => {
  const step = route.meta?.step
  if (typeof step === 'number') {
    appStore.setStep(step)
    return step
  }
  return 0
})

const goToHome = () => {
  router.push('/')
}
</script>

<style>
/* 全局样式修复 */
#app {
  width: 100vw;
  min-height: 100vh;
}

/* 步骤页面需要撑满屏幕，非步骤页面按内容高度 */
.flex-1 {
  flex: 1 1 0%;
}
</style>
