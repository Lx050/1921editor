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


            <div class="flex items-center space-x-4">
              <div class="flex items-center">
                <div :class="[
                  'w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium',
                  currentStep === 1 ? 'bg-blue-600 text-white' : 'bg-green-600 text-white'
                ]">
                  <span v-if="currentStep > 1">✓</span>
                  <span v-else>1</span>
                </div>
                <span class="ml-1 text-sm font-medium hidden sm:inline">输入文本</span>
              </div>

              <div class="w-8 h-0.5 bg-gray-300 hidden sm:block"></div>

              <div class="flex items-center">
                <div :class="[
                  'w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium',
                  currentStep === 2 ? 'bg-blue-600 text-white' : currentStep > 2 ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-600'
                ]">
                  <span v-if="currentStep > 2">✓</span>
                  <span v-else>2</span>
                </div>
                <span class="ml-1 text-sm font-medium hidden sm:inline">编辑内容</span>
              </div>

              <div class="w-8 h-0.5 bg-gray-300 hidden sm:block"></div>

              <div class="flex items-center">
                <div :class="[
                  'w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium',
                  currentStep === 3 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
                ]">
                  3
                </div>
                <span class="ml-1 text-sm font-medium hidden sm:inline">生成预览</span>
              </div>
            </div>
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
import { useRoute } from 'vue-router'
import { useAppStore } from './stores/appStore'

const route = useRoute()
const appStore = useAppStore()

// 根据当前路由更新步骤
const currentStep = computed(() => {
  const step = route.meta?.step || 1
  appStore.setStep(step)
  return step
})
</script>

<style scoped>
/* 组件特定的样式 */
</style>