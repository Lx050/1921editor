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

<script setup lang="ts">
import { onMounted } from 'vue'
import imagePreloader from '../utils/imagePreloader'

// 关键资源列表 - 暂时禁用无效的预加载配置
// 这些资源在开发环境中不存在或路径不正确
const criticalResources: Array<{
  rel: string
  url: string
  as?: string
  type?: string
  crossorigin?: string
}> = [
  // 注意：以下资源预加载在开发环境中暂时禁用
  // 生产环境构建后可根据实际资源路径重新配置
]

onMounted(() => {
  // 预连接到可能的外部域名
  const preconnectDomains = [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
    'https://api.weixin.qq.com'
  ]

  // 使用图片预加载器进行预连接
  imagePreloader.preconnectToImageDomains(preconnectDomains)

  // DNS预解析
  const dnsPrefetchDomains = [
    'https://res.wx.qq.com',
    'https://thirdwx.qlogo.cn'
  ]
  imagePreloader.dnsPrefetch(dnsPrefetchDomains)

  // 预加载关键图片
  preloadCriticalImages()

  // 预加载下一页可能需要的资源
  preloadNextPageResources()
})

function preloadCriticalImages() {
  // 根据当前页面预加载关键图片
  const currentPath = window.location.pathname

  if (currentPath === '/') {
    // 首页的关键图片
    const criticalImages: string[] = [
      // 添加首页可能需要的图片资源
    ]

    if (criticalImages.length > 0) {
      imagePreloader.preloadImages(criticalImages, {
        priority: 'high',
        fetchPriority: 'high'
      }).catch(console.error)
    }
  }
}

function preloadNextPageResources() {
  // 暂时禁用手动预取 - Vite 和 Vue Router 会自动处理组件的按需加载
  // 直接使用 src 路径预取 .vue 文件在开发环境中不起作用
  // 生产环境中 Vite 会自动为动态导入的路由组件生成合适的预取标签
  
  // 如果需要手动优化，可以考虑使用 Vue Router 的内置预取功能
  // 或在构建配置中启用 Vite 的动态导入预加载插件
}
</script>

<style scoped>
.resource-preloader {
  display: none;
}
</style>