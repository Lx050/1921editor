import { ref } from 'vue'

export function useAsyncOp() {
  const loading = ref(false)
  const error = ref('')

  async function run<T>(fn: () => Promise<T>): Promise<T | undefined> {
    loading.value = true
    error.value = ''
    try {
      return await fn()
    } catch (e: any) {
      error.value = e?.message || String(e)
      return undefined
    } finally {
      loading.value = false
    }
  }

  return { loading, error, run }
}
