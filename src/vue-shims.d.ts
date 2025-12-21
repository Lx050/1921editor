declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// 扩展Window接口
declare global {
  interface Window {
    ElMessage?: any
  }
}

export { }
