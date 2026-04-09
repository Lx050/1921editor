<template>
  <style>
    /* 关键 CSS - 内联以避免阻塞渲染 */
    :root {
      --primary-color: var(--color-accent-primary);
      --success-color: #10b981;
      --gray-50: var(--color-bg-page, #f9fafb);
      --gray-100: var(--color-bg-warm, #f3f4f6);
      --gray-200: rgba(0,0,0,0.12);
      --gray-300: rgba(0,0,0,0.2);
      --gray-500: rgba(0,0,0,0.45);
      --gray-600: rgba(0,0,0,0.55);
      --gray-900: rgba(0,0,0,0.85);
    }

    /* 基础布局样式 - 立即渲染 */
    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
        Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    #app {
      min-height: 100vh;
      background-color: var(--gray-50);
    }

    /* 骨架屏 - 快速显示页面结构 */
    .skeleton {
      background: linear-gradient(90deg, var(--color-bg-warm, #f0f0f0) 25%, rgba(0,0,0,0.08) 50%, var(--color-bg-warm, #f0f0f0) 75%);
      background-size: 200% 100%;
      animation: loading 1.5s infinite;
    }

    @keyframes loading {
      0% {
        background-position: 200% 0;
      }
      100% {
        background-position: -200% 0;
      }
    }

    /* 加载指示器 */
    .loading-container {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100vh;
      background-color: var(--gray-50);
    }

    .loading-spinner {
      width: 40px;
      height: 40px;
      border: 4px solid var(--gray-200);
      border-top-color: var(--primary-color);
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }

    /* 关键的容器样式 */
    .h-screen {
      height: 100vh;
    }

    .flex {
      display: flex;
    }

    .flex-col {
      flex-direction: column;
    }

    .flex-1 {
      flex: 1;
    }

    .overflow-hidden {
      overflow: hidden;
    }

    /* 顶部导航栏关键样式 */
    header {
      background-color: white;
      box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
      border-bottom: 1px solid var(--gray-200);
    }

    .max-w-6xl {
      max-width: 1152px;
    }

    .mx-auto {
      margin-left: auto;
      margin-right: auto;
    }

    .px-4 {
      padding-left: 1rem;
      padding-right: 1rem;
    }

    .py-4 {
      padding-top: 1rem;
      padding-bottom: 1rem;
    }

    .shadow-sm {
      box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    }

    .border {
      border-width: 1px;
    }

    .border-b {
      border-bottom-width: 1px;
    }

    .bg-white {
      background-color: white;
    }

    /* 隐藏非关键内容直到加载完成 */
    .content-hidden {
      opacity: 0;
      transition: opacity 0.3s ease-in;
    }

    .content-visible {
      opacity: 1;
    }
  </style>
</template>

<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  // 当 DOM 加载完成，显示内容
  setTimeout(() => {
    document.body.classList.add('content-visible')
    document.body.classList.remove('content-hidden')
  }, 100)
})
</script>