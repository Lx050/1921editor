const MAMMOTH_LOCAL_URL = '/vendor/mammoth.browser.min.js'

type MammothInstance = typeof import('mammoth')

let mammothLoader: Promise<MammothInstance> | null = null

const getGlobalMammoth = (): MammothInstance | undefined =>
  (window as Window & { mammoth?: MammothInstance }).mammoth

const resolveMammoth = (
  resolve: (value: MammothInstance) => void,
  reject: (reason?: Error) => void
) => {
  const mammoth = getGlobalMammoth()
  if (mammoth) {
    resolve(mammoth)
    return
  }
  reject(new Error('Mammoth failed to initialize'))
}

export const loadMammoth = (): Promise<MammothInstance> => {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Mammoth requires a browser environment'))
  }

  const existing = getGlobalMammoth()
  if (existing) {
    return Promise.resolve(existing)
  }

  if (mammothLoader) {
    return mammothLoader
  }

  mammothLoader = new Promise<MammothInstance>((resolve, reject) => {
    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[data-mammoth-loader="true"]'
    )

    if (existingScript) {
      if (existingScript.dataset.loaded === 'true') {
        resolveMammoth(resolve, reject)
      } else {
        existingScript.addEventListener('load', () => resolveMammoth(resolve, reject), { once: true })
        existingScript.addEventListener('error', () => reject(new Error('Failed to load mammoth script')), {
          once: true
        })
      }
      return
    }

    const script = document.createElement('script')
    script.src = MAMMOTH_LOCAL_URL
    script.async = true
    script.dataset.mammothLoader = 'true'
    script.addEventListener(
      'load',
      () => {
        script.dataset.loaded = 'true'
        resolveMammoth(resolve, reject)
      },
      { once: true }
    )
    script.addEventListener(
      'error',
      () => reject(new Error('Failed to load mammoth script')),
      { once: true }
    )
    document.head.appendChild(script)
  })

  return mammothLoader
}
