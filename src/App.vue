<template>
  <div id="app" class="min-h-screen flex flex-col" style="background: var(--color-bg-page)">
    <!-- 全局 Toast 通知 -->
    <Toast />
    <!-- 全局确认对话框 -->
    <ConfirmDialog />

    <!-- 资源预加载器 -->
    <ResourcePreloader />

    <!-- 顶部导航栏 -->
    <header
      v-if="showHeader"
      class="flex-none z-50"
      style="
        background: #ffffff;
        border-bottom: 1px solid rgba(0,0,0,0.1);
        position: sticky;
        top: 0;
      "
    >
      <div style="max-width: 1200px; margin: 0 auto; padding: 0 24px;">
        <div style="display: flex; align-items: center; justify-content: space-between; height: 52px; gap: 16px;">

          <!-- Logo 区域 -->
          <div style="display: flex; align-items: center; gap: 10px; flex-shrink: 0;">
            <div
              style="
                width: 32px; height: 32px;
                background: var(--color-accent-primary);
                border-radius: 6px;
                display: flex; align-items: center; justify-content: center;
                flex-shrink: 0;
              "
            >
              <span style="color: #fff; font-weight: 700; font-size: 16px; font-family: var(--font-display); letter-spacing: -0.5px;">B</span>
            </div>
            <span
              class="hidden sm:inline"
              style="
                font-size: 15px;
                font-weight: 600;
                color: rgba(0,0,0,0.95);
                letter-spacing: -0.2px;
                font-family: var(--font-display);
              "
            >排版助手</span>
          </div>

          <!-- 步骤指示器 -->
          <div
            v-if="isStepPage"
            style="
              display: flex;
              align-items: center;
              gap: 0;
              background: var(--color-bg-warm);
              border: 1px solid rgba(0,0,0,0.08);
              border-radius: 8px;
              padding: 6px 16px;
            "
          >
            <template v-for="(step, idx) in steps" :key="step.num">
              <div style="display: flex; align-items: center; gap: 8px;">
                <!-- 步骤圆圈 -->
                <div
                  :style="{
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: '700',
                    flexShrink: '0',
                    transition: 'all 200ms',
                    background: currentStep > step.num
                      ? 'var(--color-badge-bg)'
                      : currentStep === step.num
                        ? 'var(--color-accent-primary)'
                        : '#fff',
                    color: currentStep > step.num
                      ? 'var(--color-accent-primary)'
                      : currentStep === step.num
                        ? '#fff'
                        : 'rgba(0,0,0,0.3)',
                    border: currentStep <= step.num && currentStep !== step.num
                      ? '1.5px solid rgba(0,0,0,0.15)'
                      : '1.5px solid transparent',
                  }"
                >
                  <svg v-if="currentStep > step.num" width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  <span v-else>{{ step.num }}</span>
                </div>

                <!-- 步骤文字 — 仅 lg 显示 -->
                <span
                  class="hidden lg:inline"
                  :style="{
                    fontSize: '13px',
                    fontWeight: currentStep === step.num ? '600' : '400',
                    color: currentStep === step.num
                      ? 'rgba(0,0,0,0.95)'
                      : currentStep > step.num
                        ? 'var(--color-accent-primary)'
                        : 'rgba(0,0,0,0.4)',
                    whiteSpace: 'nowrap',
                  }"
                >{{ step.label }}</span>
              </div>

              <!-- 连接线 -->
              <div
                v-if="idx < steps.length - 1"
                :style="{
                  width: '32px',
                  height: '1px',
                  margin: '0 8px',
                  background: currentStep > step.num
                    ? 'var(--color-accent-primary)'
                    : 'rgba(0,0,0,0.12)',
                  transition: 'background 300ms',
                  flexShrink: '0',
                }"
              ></div>
            </template>
          </div>

          <!-- 返回首页按钮 -->
          <button
            @click="goToHome"
            style="
              display: flex;
              align-items: center;
              gap: 6px;
              padding: 6px 14px;
              background: rgba(0,0,0,0.05);
              border: 1px solid transparent;
              border-radius: 4px;
              font-size: 13px;
              font-weight: 600;
              color: rgba(0,0,0,0.7);
              cursor: pointer;
              transition: background 150ms;
              flex-shrink: 0;
              white-space: nowrap;
            "
            onmouseover="this.style.background='rgba(0,0,0,0.08)'"
            onmouseout="this.style.background='rgba(0,0,0,0.05)'"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M9 11L5 7l4-4" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span class="hidden sm:inline">首页</span>
          </button>

        </div>
      </div>
    </header>

    <!-- 主要内容区域 -->
    <main class="flex-1 flex flex-col min-h-0 relative">
      <router-view />
    </main>

    <!-- ICP 备案号 -->
    <footer
      v-if="showFooter"
      style="
        flex: none;
        padding: 12px 0;
        text-align: center;
        font-size: 12px;
        color: var(--color-text-muted);
        border-top: 1px solid rgba(0,0,0,0.07);
        background: var(--color-bg-warm);
      "
    >
      <a
        href="https://beian.miit.gov.cn/"
        target="_blank"
        rel="noopener"
        style="color: inherit; text-decoration: none; transition: color 150ms;"
        onmouseover="this.style.color='rgba(0,0,0,0.6)'"
        onmouseout="this.style.color=''"
      >
        陕ICP备2025074122号
      </a>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAppStore } from './stores/appStore'
import ResourcePreloader from './components/ResourcePreloader.vue'
import Toast from './components/Toast.vue'
import ConfirmDialog from './components/ConfirmDialog.vue'

const route = useRoute()
const router = useRouter()
const appStore = useAppStore()

const steps = [
  { num: 1, label: '输入文本' },
  { num: 2, label: '编辑内容' },
  { num: 3, label: '生成预览' },
]

const showFooter = computed(() => {
  const footerPages = ['Landing', 'Home', 'Login', 'Register', 'ForgotPassword', 'VerifyEmail']
  return footerPages.includes(route.name as string) || !route.name
})

const showHeader = computed(() => {
  const noHeaderPages = [
    'Landing', 'Home', 'Login', 'Register', 'ForgotPassword', 'VerifyEmail'
  ]
  return !noHeaderPages.includes(route.name as string) && route.name !== undefined
})

const isStepPage = computed(() => {
  return ['Step1', 'Step2', 'Step3', 'Step3WithArticle', 'StyleConfig'].includes(route.name as string)
})

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
#app {
  width: 100vw;
  min-height: 100vh;
}

.flex-1 {
  flex: 1 1 0%;
}
</style>
