import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import viteCompression from 'vite-plugin-compression2'

export default defineConfig({
  plugins: [
    vue(),
    // 启用Gzip和Brotli压缩
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
      threshold: 10240, // 只压缩大于10KB的文件
    }),
    viteCompression({
      algorithm: 'brotliCompress',
      ext: '.br',
      threshold: 10240,
    })
  ],
  root: './src',
  // 预加载关键资源
  define: {
    __VUE_OPTIONS_API__: false, // 禁用 Vue Options API 以减小包体积
  },
  server: {
    port: 1921,
    strictPort: true,
    // 代理配置：解决跨域问题
    proxy: {
      // 微信 API 代理
      '/wechat-api': {
        target: 'https://api.weixin.qq.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/wechat-api/, ''),
        secure: true,
        headers: {
          'Origin': 'https://api.weixin.qq.com'
        }
      },
      // 后端 API 代理
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
        ws: true,  // 支持 WebSocket
      },
      // Webhook 代理
      '/webhook': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      },
      // 飞书同步插件代理
      '/sync-plugin': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/sync-plugin/, '/sync-plugin'),
      }
    }
  },
  build: {
    // 优化构建配置
    rollupOptions: {
      output: {
        // 添加文件哈希值用于缓存破坏
        entryFileNames: 'js/[name].[hash].js',
        chunkFileNames: 'js/[name].[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name?.split('.') || []
          const ext = info[info.length - 1]

          // 按类型分类资源
          if (/\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/i.test(assetInfo.name || '')) {
            return `media/[name]-[hash][extname]`
          }
          if (/\.(png|jpe?g|gif|svg|webp)(\?.*)?$/.test(assetInfo.name || '')) {
            return `images/[name]-[hash][extname]`
          }
          if (/\.(woff2?|eot|ttf|otf)(\?.*)?$/i.test(assetInfo.name || '')) {
            return `fonts/[name]-[hash][extname]`
          }
          if (ext === 'css') {
            return `css/[name]-[hash][extname]`
          }

          return `assets/[name]-[hash][extname]`
        },
        // 手动代码分割 - 解决300KB+体积警告
        manualChunks: {
          // Vue核心和常用库打包在一起（基础框架）
          'vendor-vue': ['vue', 'vue-router', 'pinia'],

          // 文档处理相关库（Docx解析）- 大库单独打包，懒加载
          'vendor-docx': ['mammoth'],

          // 压缩包处理库
          'vendor-zip': ['jszip'],

          // QRCode生成器
          'vendor-qrcode': ['qrcode'],

          // 工具库
          'vendor-utils': ['dompurify'],

          }
      }
    },
    // 启用CSS代码分割
    cssCodeSplit: true,
    // 生成sourcemap（生产环境建议关闭以减小体积）
    sourcemap: false, // 生产环境关闭 sourcemap
    // 设置chunk大小警告限制（默认500KB）
    chunkSizeWarningLimit: 300, // 降低限制以提前关注
    // 优化压缩
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // 移除 console.log
        drop_debugger: true, // 移除 debugger
        pure_funcs: ['console.log'], // 移除特定函数调用
      },
      mangle: {
        safari10: true, // 兼容Safari 10
      }
    },
    // 目标浏览器
    target: 'es2020',
    // 资源内联阈值
    assetsInlineLimit: 4096, // 4kb以下内联
  },
  // 优化依赖项
  optimizeDeps: {
    include: ['vue', 'vue-router', 'pinia']
  },
  // 配置资源缓存
  cacheDir: 'node_modules/.vite'
})