/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_API_TIMEOUT: string
  readonly VITE_NODE_ENV: string
  readonly VITE_WECHAT_APP_ID: string
  readonly VITE_ENABLE_DEBUG: string
  readonly VITE_ENABLE_MOCK: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// 扩展环境变量类型
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// 扩展window对象
declare interface Window {
  // 任何全局变量声明
}