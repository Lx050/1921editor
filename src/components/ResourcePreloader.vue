<template>
  <div class="resource-preloader">
    <!-- 关键资源预加载 -->
    <link
      v-for="resource in criticalResources"
      :key="resource.url"
      :rel="resource.rel"
      :href="resource.url"
      :as="resource.as"
      :type="resource.type"
      :crossorigin="resource.crossorigin"
    />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'

// 关键资源列表 - 这些资源将被预加载
const criticalResources = [
  // 预加载关键字体
  {
    rel: 'preload',
    href: '/fonts/inter-var.woff2',
    as: 'font',
    type: 'font/woff2',
    crossorigin: 'anonymous'
  },
  // 预加载关键 CSS
  {
    rel: 'preload',
    href: '/src/styles/main.css',
    as: 'style'
  },
  // 预加载 Vue 核心库
  {
    rel: 'modulepreload',
    href: '/node_modules/vue/dist/vue.runtime.esm-bundler.js',
    as: 'script'
  }
]

onMounted(() => {
  // 预连接到可能的外部域名
  const preconnectDomains = [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
    'https://api.weixin.qq.com'
  ]

  preconnectDomains.forEach(domain => {
    const link = document.createElement('link')
    link.rel = 'preconnect'
    link.href = domain
    link.crossOrigin = 'anonymous'
    document.head.appendChild(link)
  })

  // 预加载下一页可能需要的资源
  preloadNextPageResources()
})

function preloadNextPageResources() {
  // 根据当前路由预加载下一页的资源
  const currentPath = window.location.pathname

  if (currentPath === '/' || currentPath === '/step1') {
    // 在首页预加载第二步的资源
    const link = document.createElement('link')
    link.rel = 'prefetch'
    link.href = '/src/views/Step2Curtain.vue'
    document.head.appendChild(link)
  } else if (currentPath === '/step2') {
    // 在第二步预加载第三步的资源
    const link = document.createElement('link')
    link.rel = 'prefetch'
    link.href = '/src/views/Step3Preview.vue'
    document.head.appendChild(link)
  }
}
</script>

<style scoped>
.resource-preloader {
  display: none;
}
</style>