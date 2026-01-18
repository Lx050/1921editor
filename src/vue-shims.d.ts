declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<Record<string, unknown>, Record<string, unknown>, Record<string, unknown>>
  export default component
}

// 扩展Window接口
declare global {
  interface Window {
    ElMessage?: unknown
  }
}

export { }
