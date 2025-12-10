import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  root: './src',
  server: {
    port: 1921,
    // 代理配置：解决微信 API 跨域问题
    proxy: {
      '/wechat-api': {
        target: 'https://api.weixin.qq.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/wechat-api/, ''),
        secure: true,
        headers: {
          'Origin': 'https://api.weixin.qq.com'
        }
      }
    }
  },
  build: {
    // 优化构建配置
    rollupOptions: {
      output: {
        // 添加文件哈希值用于缓存破坏
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]',
        // 手动代码分割 - 解决300KB+体积警告
        manualChunks(id) {
          // Vue核心和常用库打包在一起（基础框架）
          if (id.includes('node_modules/vue') ||
              id.includes('node_modules/vue-router') ||
              id.includes('node_modules/pinia')) {
            return 'vendor-vue'
          }

          // 文档处理相关库（Docx解析）- 大库单独打包
          if (id.includes('node_modules/mammoth')) {
            return 'vendor-docx'
          }

          // 压缩包处理库
          if (id.includes('node_modules/jszip')) {
            return 'vendor-zip'
          }

          // QRCode生成器
          if (id.includes('node_modules/qrcode')) {
            return 'vendor-qrcode'
          }

          // 其他node_modules依赖打包在一起
          if (id.includes('node_modules')) {
            return 'vendor'
          }
        }
      }
    },
    // 启用CSS代码分割
    cssCodeSplit: true,
    // 生成sourcemap（生产环境建议关闭以减小体积）
    sourcemap: process.env.NODE_ENV !== 'production',
    // 设置chunk大小警告限制（默认500KB）
    chunkSizeWarningLimit: 1000
  },
  // 优化依赖项
  optimizeDeps: {
    include: ['vue', 'vue-router', 'pinia']
  },
  // 配置资源缓存
  cacheDir: 'node_modules/.vite'
})