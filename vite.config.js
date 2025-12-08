import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  root: './src',
  server: {
    port: 1921
  },
  build: {
    // 优化构建配置
    rollupOptions: {
      output: {
        // 添加文件哈希值用于缓存破坏
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]'
      }
    },
    // 启用CSS代码分割
    cssCodeSplit: true,
    // 生成sourcemap
    sourcemap: true
  },
  // 优化依赖项
  optimizeDeps: {
    include: ['vue', 'vue-router', 'pinia']
  },
  // 配置资源缓存
  cacheDir: 'node_modules/.vite'
})