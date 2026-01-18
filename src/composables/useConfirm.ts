/**
 * 确认对话框工具函数
 * 通过触发全局自定义事件来显示确认对话框
 */

export interface ConfirmOptions {
  title?: string
  message: string
  confirmText?: string
  cancelText?: string
  type?: 'warning' | 'danger' | 'info'
  showCancel?: boolean
}

export const confirm = (options: ConfirmOptions): Promise<boolean> => {
  return new Promise((resolve) => {
    const event = new CustomEvent('show-confirm', {
      detail: options
    })
    window.dispatchEvent(event)

    // 监听一次性结果事件
    const handleResult = (e: Event) => {
      const customEvent = e as CustomEvent<boolean>
      window.removeEventListener('confirm-result', handleResult)
      resolve(customEvent.detail)
    }

    window.addEventListener('confirm-result', handleResult)
  })
}

export default confirm
