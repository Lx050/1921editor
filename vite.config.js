import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import viteCompression from 'vite-plugin-compression2'
// import Components from 'unplugin-vue-components/vite'
// import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
// import AutoImport from 'unplugin-auto-import/vite'

export default defineConfig({
  plugins: [
    vue(),
    // Element Plus 自动导入 - 按需加载组件 (临时禁用，需要先安装 unplugin 包)
    // Components({
    //   resolvers: [
    //     ElementPlusResolver(),
    //     (componentName) => {
    //       if (componentName.startsWith('ElIcon')) {
    //         return { name: componentName.slice(6), from: '@element-plus/icons-vue' }
    //       }
    //     }
    //   ],
    // }),
    // AutoImport({
    //   imports: ['vue', 'vue-router', 'pinia'],
    //   dts: 'src/auto-imports.d.ts',
    //   resolvers: [ElementPlusResolver()],
    // }),
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
  // Element Plus 需要 Options API，不能禁用
  // define: {
  //   __VUE_OPTIONS_API__: false,
  // },
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
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq, req) => {
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
    // 启用模块预加载
    modulePreload: {
      enable: true,
    },
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
        // 手动代码分割 - 优化包体积
        // 注意：Element Plus 必须与 Vue 核心在同一个 chunk，否则会导致循环依赖错误
        manualChunks: (id) => {
          // 将 node_modules 中的包进行分包
          if (id.includes('node_modules')) {
            // Vue 核心 + Element Plus UI 库（必须放在一起避免初始化顺序问题）
            if (id.includes('vue') || id.includes('pinia') || id.includes('vue-router') || id.includes('element-plus')) {
              return 'vendor-vue'
            }

            // Element Plus 依赖的库（ lodash-es, @ctrl/tinycolor 等）
            if (id.includes('lodash-es') || id.includes('@ctrl') || id.includes('@element-plus')) {
              return 'vendor-element-deps'
            }

            // 文档处理（mammoth 大库）- 懒加载
            if (id.includes('mammoth')) {
              return 'vendor-docx'
            }

            // HTTP 客户端
            if (id.includes('axios')) {
              return 'vendor-http'
            }

            // 安全库
            if (id.includes('dompurify')) {
              return 'vendor-utils'
            }

            // 压缩库
            if (id.includes('jszip')) {
              return 'vendor-zip'
            }

            // 7z-wasm
            if (id.includes('7z-wasm')) {
              return 'vendor-7z'
            }

            // QRCode
            if (id.includes('qrcode')) {
              return 'vendor-qrcode'
            }

            // heic2any - 图片转换库
            if (id.includes('heic2any')) {
              return 'vendor-image'
            }

            // 其他第三方库 - 进一步拆分
            // 按包名分组，避免单个 vendor-other 过大
            const match = id.match(/node_modules\/(@?[^/]+)/)
            if (match) {
              const pkgName = match[1]
              // 较小的工具库合并到一起
              const smallLibs = ['he', 'clone-deep', 'clipboard']
              if (smallLibs.includes(pkgName)) {
                return 'vendor-misc'
              }
              // 其他包按包名分组
              return `vendor-${pkgName.replace('@', '')}`
            }

            return 'vendor-other'
          }
        }
      }
    },
    // 启用CSS代码分割
    cssCodeSplit: true,
    // 生产环境优化 - 移除 console.log
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug']
      }
    },
    // 生成sourcemap（生产环境建议关闭以减小体积）
    sourcemap: false, // 生产环境关闭 sourcemap
    // 设置chunk大小警告限制（默认500KB）
    chunkSizeWarningLimit: 300, // 降低限制以提前关注
    // 目标浏览器 - 更现代的设置以减少 polyfill 体积
    target: 'es2020',
    // 资源内联阈值
    assetsInlineLimit: 4096, // 4kb以下内联
    // Polyfill 模块预加载以提升兼容性
    polyfillModulePreload: true,
  },
  // 优化依赖项
  optimizeDeps: {
    include: [
      'vue',
      'vue-router',
      'pinia',
      'element-plus/es/components/button/style',
      'element-plus/es/components/input/style',
      'element-plus/es/components/form/style',
    ],
    // 排除 7z-wasm，避免预构建导致 WASM 加载问题
    exclude: ['7z-wasm']
  },
  // 配置资源缓存
  cacheDir: 'node_modules/.vite',
  // 支持 WebAssembly 文件
  assetsInclude: ['**/*.wasm'],
  // 实验性功能优化
  experimental: {
    renderBuiltUrl(filename, { hostType }) {
      // 对于同一源的文件，返回相对路径
      return { relative: true }
    }
  }
})