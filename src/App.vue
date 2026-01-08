<template>
  <div id="app" class="h-screen flex flex-col magazine-bg">
    <!-- 全局 Toast 通知 -->
    <Toast />

    <!-- 资源预加载器 -->
    <ResourcePreloader />

    <!-- 顶部导航栏 - 在Dashboard页面时隐藏 -->
    <header
      v-if="!isDashboardPage"
      class="relative backdrop-blur-xl bg-[#141419]/80 border-b border-white/10 magazine-page-enter magazine-stagger-1"
    >
      <!-- 装饰性顶部线条 -->
      <div class="absolute top-0 left-0 right-0 h-[1px]">
        <div class="w-full h-full bg-gradient-to-r from-transparent via-[#d4a574]/50 to-transparent"></div>
      </div>

      <div class="max-w-6xl mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <!-- Logo 区域 -->
          <div class="flex items-center space-x-3">
            <div class="relative">
              <div class="w-10 h-10 bg-gradient-to-br from-[#ff6b4a] to-[#ff8566] rounded-lg flex items-center justify-center shadow-lg">
                <span class="text-white font-bold" style="font-family: var(--font-display)">B</span>
              </div>
              <!-- 装饰性光晕 -->
              <div class="absolute -inset-1 bg-gradient-to-br from-[#ff6b4a]/30 to-transparent rounded-lg blur-sm -z-10"></div>
            </div>
            <div>
              <h1 class="text-lg font-semibold" style="font-family: var(--font-display); color: var(--color-text-primary)">
                版式装配引擎
              </h1>
              <span class="text-xs tracking-widest uppercase" style="font-family: var(--font-body); color: var(--color-text-muted)">
                V1.0
              </span>
            </div>
          </div>

          <div class="flex items-center space-x-4">
            <!-- 步骤指示器 -->
            <div class="flex items-center space-x-3">
              <div class="flex items-center" v-if="currentStep > 0">
                <div
                  :class="[
                    'w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-300',
                    currentStep === 1
                      ? 'bg-gradient-to-br from-[#ff6b4a] to-[#ff8566] text-white shadow-lg'
                      : 'bg-[#252530] text-[#a0a0b0] border border-white/10'
                  ]"
                >
                  <span v-if="currentStep > 1" class="text-[#2dd4a6]">✓</span>
                  <span v-else>1</span>
                </div>
                <span class="ml-2 text-sm font-medium hidden sm:inline" :class="currentStep === 1 ? 'text-[#f5f5f5]' : 'text-[#606070]'">
                  输入文本
                </span>
              </div>

              <div v-if="currentStep > 0" class="w-6 h-[1px] bg-white/10 hidden sm:block"></div>

              <div class="flex items-center" v-if="currentStep > 0">
                <div
                  :class="[
                    'w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-300',
                    currentStep === 2
                      ? 'bg-gradient-to-br from-[#ff6b4a] to-[#ff8566] text-white shadow-lg'
                      : currentStep > 2
                      ? 'bg-[#252530] text-[#2dd4a6] border border-[#2dd4a6]/30'
                      : 'bg-[#252530] text-[#a0a0b0] border border-white/10'
                  ]"
                >
                  <span v-if="currentStep > 2" class="text-[#2dd4a6]">✓</span>
                  <span v-else>2</span>
                </div>
                <span class="ml-2 text-sm font-medium hidden sm:inline" :class="currentStep === 2 ? 'text-[#f5f5f5]' : 'text-[#606070]'">
                  编辑内容
                </span>
              </div>

              <div v-if="currentStep > 0" class="w-6 h-[1px] bg-white/10 hidden sm:block"></div>

              <div class="flex items-center" v-if="currentStep > 0">
                <div
                  :class="[
                    'w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-300',
                    currentStep === 3
                      ? 'bg-gradient-to-br from-[#ff6b4a] to-[#ff8566] text-white shadow-lg'
                      : 'bg-[#252530] text-[#a0a0b0] border border-white/10'
                  ]"
                >
                  3
                </div>
                <span class="ml-2 text-sm font-medium hidden sm:inline" :class="currentStep === 3 ? 'text-[#f5f5f5]' : 'text-[#606070]'">
                  生成预览
                </span>
              </div>
            </div>

            <!-- 分隔线 -->
            <div v-if="currentStep > 0" class="h-6 w-[1px] bg-white/10 mx-2"></div>

            <!-- 返回首页按钮 -->
            <button
              @click="goToHome"
              class="magazine-btn magazine-btn-secondary"
              title="返回首页"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              <span class="text-sm font-medium">返回首页</span>
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- 主要内容区域 -->
    <main class="w-full px-4 py-6 flex-1 flex flex-col">
      <!-- 路由视图 -->
      <div class="bg-[#141419]/60 backdrop-blur-sm rounded-xl border border-white/10 flex-1 overflow-hidden shadow-2xl magazine-page-enter magazine-stagger-2">
        <router-view />
      </div>
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

// 检查是否为Dashboard页面
const isDashboardPage = computed(() => {
  return route.name === 'Home'
})

// 根据当前路由更新步骤
const currentStep = computed(() => {
  // 只有明确定义了 step 的路由才显示步骤条
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

<style scoped>
/* 组件特定的样式 */
</style>
