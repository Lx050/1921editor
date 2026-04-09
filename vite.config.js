import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import viteCompression from 'vite-plugin-compression2'
import path from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
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
    __AI_GATEWAY_KEY__: JSON.stringify(process.env.AI_GATEWAY_API_KEY || ''),
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
      // 注意：需要排除 src/api 目录下的源文件，避免被代理到后端
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
        ws: true,  // 支持 WebSocket
        // 只代理实际的 API 请求，排除源文件
        bypass: (req) => {
          // 如果请求的是源文件（.ts, .js, .vue 等），不走代理
          if (req.url && /\.(ts|js|vue|tsx|jsx|mjs|cjs)(\?.*)?$/.test(req.url)) {
            return req.url
          }
          // 其他 /api 请求走代理
          return null
        }
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
      },
      // 微信图片代理 - 解决防盗链问题（支持所有 qpic.cn 子域名）
      '/wechat-image-proxy': {
        target: 'https://mmbiz.qpic.cn', // 默认目标，会被动态覆盖
        changeOrigin: true,
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            // 从 URL 中提取实际的目标域名
            // 格式: /wechat-image-proxy/mmecoa.qpic.cn/path/to/image
            const match = req.url.match(/^\/wechat-image-proxy\/([^/]+\.qpic\.cn)(\/.*)?$/);
            if (match) {
              const targetHost = match[1];
              const targetPath = match[2] || '/';
              proxyReq.setHeader('host', targetHost);
              proxyReq.path = targetPath;
            }
          });
        },
        rewrite: (path) => {
          // 移除 /wechat-image-proxy/hostname 前缀，保留实际路径
          return path.replace(/^\/wechat-image-proxy\/[^/]+\.qpic\.cn/, '');
        },
        headers: {
          'Referer': 'https://mp.weixin.qq.com'
        }
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
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // Vue核心框架
            if (id.includes('/vue/') || id.includes('/vue-router/') || id.includes('/pinia/') || id.includes('/@vue/')) {
              return 'vendor-vue'
            }
            // tiptap + ProseMirror (editor engine)
            if (id.includes('/@tiptap/') || id.includes('/prosemirror-') || id.includes('/tippy.js/') || id.includes('/orderedmap/') || id.includes('/crelt/') || id.includes('/rope-sequence/') || id.includes('/w3c-keyname/')) {
              return 'vendor-tiptap'
            }
            // 文档处理
            if (id.includes('/mammoth/')) return 'vendor-docx'
            // 压缩包
            if (id.includes('/jszip/')) return 'vendor-zip'
            // 7z
            if (id.includes('/7z-wasm/')) return 'vendor-7z'
            // QRCode
            if (id.includes('/qrcode/')) return 'vendor-qrcode'
            // DOMPurify
            if (id.includes('/dompurify/')) return 'vendor-utils'
            // Element Plus
            if (id.includes('/element-plus/')) return 'vendor-element'
            // Remaining node_modules into a shared vendor chunk
            if (id.includes('/highlight.js/') || id.includes('/marked/')) return 'vendor-utils'
          }
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
    minify: 'esbuild',
    // 目标浏览器
    target: 'es2020',
    // 资源内联阈值
    assetsInlineLimit: 4096, // 4kb以下内联
  },
  // 优化依赖项
  optimizeDeps: {
    include: ['vue', 'vue-router', 'pinia'],
    // 排除 7z-wasm，避免预构建导致 WASM 加载问题
    exclude: ['7z-wasm']
  },
  // 配置资源缓存 (use /tmp to avoid JuiceFS EIO issues in dev)
  cacheDir: '/tmp/1921editor-vite-cache',
  // 支持 WebAssembly 文件
  assetsInclude: ['**/*.wasm']
})